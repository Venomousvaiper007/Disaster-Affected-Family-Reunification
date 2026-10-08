import json
import datetime
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import get_connection, init_db, dict_from_row, dicts_from_rows
from engine.matcher import calculate_match_score
from engine.priority import calculate_case_priority
from engine.evidence import evaluate_evidence_trust, check_timeline_consistency
from seed_data import seed_database

app = FastAPI(title="Project 96 — Reunite360 API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) as cnt FROM cases")
    cnt = c.fetchone()["cnt"]
    conn.close()
    if cnt == 0:
        seed_database()

# ----------------------------------------------------
# SCHEMAS
# ----------------------------------------------------
class MissingPersonCreate(BaseModel):
    name: str
    age: int
    gender: str
    height: Optional[str] = None
    physical_marks: Optional[str] = None
    clothing: Optional[str] = None
    hair: Optional[str] = None
    last_known_location: str
    last_known_time: str
    circumstances: Optional[str] = None
    vulnerability: Optional[str] = "GENERAL_ADULT"
    photo_url: Optional[str] = None
    lat: Optional[float] = 13.0827
    lng: Optional[float] = 80.2707
    reporter_name: str
    reporter_contact: str
    reporter_relationship: str

class FoundPersonCreate(BaseModel):
    name_if_known: Optional[str] = "Unknown Person"
    age_approx: Optional[int] = None
    gender: Optional[str] = None
    height_approx: Optional[str] = None
    physical_marks: Optional[str] = None
    clothing: Optional[str] = None
    hair: Optional[str] = None
    current_location: str
    time_found: str
    condition: Optional[str] = "Stable"
    shelter_or_hospital: Optional[str] = None
    photo_url: Optional[str] = None
    lat: Optional[float] = 13.0850
    lng: Optional[float] = 80.2750
    reporter_name: str
    reporter_contact: str
    reporter_relationship: Optional[str] = "Good Samaritan / Responder"

class EmergencyReportCreate(BaseModel):
    emergency_type: str
    location: str
    lat: Optional[float] = 13.0890
    lng: Optional[float] = 80.2800
    num_people: Optional[int] = 1
    condition: Optional[str] = None
    description: str
    fatality_unverified: Optional[bool] = False
    photo_url: Optional[str] = None
    reporter_name: str
    reporter_contact: str

class VerifyMatchRequest(BaseModel):
    action: str # CONFIRM, REJECT, NEED_MORE_EVIDENCE
    reviewer_name: str
    notes: Optional[str] = None

class RescueAssignRequest(BaseModel):
    team_id: str
    status: Optional[str] = "DISPATCHED" # DISPATCHED, ON_SCENE, RESOLVED

# ----------------------------------------------------
# SYSTEM ENDPOINTS
# ----------------------------------------------------
@app.post("/api/seed")
def trigger_seed():
    seed_database()
    return {"status": "success", "message": "Database successfully re-seeded with demo scenario."}

@app.get("/api/dashboard/stats")
def get_dashboard_stats():
    conn = get_connection()
    c = conn.cursor()

    active_missing = c.execute("SELECT COUNT(*) FROM cases WHERE case_type = 'MISSING' AND status != 'RESOLVED'").fetchone()[0]
    found_persons = c.execute("SELECT COUNT(*) FROM cases WHERE case_type = 'FOUND'").fetchone()[0]
    active_emergencies = c.execute("SELECT COUNT(*) FROM cases WHERE case_type = 'EMERGENCY' AND status != 'RESOLVED'").fetchone()[0]
    potential_matches = c.execute("SELECT COUNT(*) FROM matches WHERE status = 'POTENTIAL'").fetchone()[0]
    pending_verifications = c.execute("SELECT COUNT(*) FROM cases WHERE status = 'VERIFICATION_PENDING'").fetchone()[0] + potential_matches
    resolved_cases = c.execute("SELECT COUNT(*) FROM cases WHERE status = 'RESOLVED'").fetchone()[0]
    unresolved_conflicts = c.execute("SELECT COUNT(*) FROM conflicts WHERE status = 'UNRESOLVED'").fetchone()[0]
    pending_duplicates = c.execute("SELECT COUNT(*) FROM duplicate_groups WHERE status = 'PENDING'").fetchone()[0]
    rescue_teams_available = c.execute("SELECT COUNT(*) FROM rescue_teams WHERE status = 'AVAILABLE'").fetchone()[0]

    conn.close()

    return {
        "active_missing_cases": active_missing,
        "found_persons": found_persons,
        "active_emergencies": active_emergencies,
        "potential_matches": potential_matches,
        "pending_verifications": pending_verifications,
        "resolved_cases": resolved_cases,
        "unresolved_conflicts": unresolved_conflicts,
        "pending_duplicates": pending_duplicates,
        "rescue_teams_available": rescue_teams_available
    }

# ----------------------------------------------------
# REPORTING ENDPOINTS
# ----------------------------------------------------
@app.post("/api/cases/missing")
def report_missing_person(data: MissingPersonCreate):
    conn = get_connection()
    c = conn.cursor()

    count = c.execute("SELECT COUNT(*) FROM cases WHERE case_type = 'MISSING'").fetchone()[0] + 1025
    case_id = f"MP-{count}"
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    c.execute("""
        INSERT INTO cases (id, case_type, status, priority, priority_score, created_at, updated_at, reporter_name, reporter_contact, reporter_relationship, source, reliability, conflict_flag)
        VALUES (?, 'MISSING', 'NEW', 'HIGH', 70.0, ?, ?, ?, ?, ?, 'Family', 'HIGH', 0)
    """, (case_id, now_str, now_str, data.reporter_name, data.reporter_contact, data.reporter_relationship))

    c.execute("""
        INSERT INTO missing_persons (case_id, name, age, gender, height, physical_marks, clothing, hair, last_known_location, last_known_time, circumstances, vulnerability, photo_url, lat, lng)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (case_id, data.name, data.age, data.gender, data.height, data.physical_marks, data.clothing, data.hair, data.last_known_location, data.last_known_time, data.circumstances, data.vulnerability, data.photo_url, data.lat, data.lng))

    c.execute("""
        INSERT INTO timeline_events (case_id, timestamp, location, source, organization, description, status, lat, lng)
        VALUES (?, ?, ?, 'Family Report', ?, ?, 'REPORTED', ?, ?)
    """, (case_id, data.last_known_time, data.last_known_location, f"Reporter: {data.reporter_name}", f"Missing person report filed for {data.name}.", data.lat, data.lng))

    c.execute("""
        INSERT INTO audit_logs (timestamp, case_id, actor, action, details)
        VALUES (?, ?, ?, 'CREATE_MISSING_REPORT', ?)
    """, (now_str, case_id, data.reporter_name, f"Missing report created for {data.name} ({data.age} yrs)."))

    # Auto match cycle
    found_rows = dicts_from_rows(c.execute("SELECT * FROM found_persons").fetchall())
    highest_match = 0.0
    mp_dict = {
        "name": data.name, "age": data.age, "gender": data.gender,
        "height": data.height, "physical_marks": data.physical_marks,
        "clothing": data.clothing, "last_known_location": data.last_known_location,
        "last_known_time": data.last_known_time, "lat": data.lat, "lng": data.lng
    }

    for fp in found_rows:
        res = calculate_match_score(mp_dict, fp)
        score = res["confidence_score"]
        if score > highest_match:
            highest_match = score

        if score >= 60.0:
            match_id = f"M-{case_id}-{fp['case_id']}"
            c.execute("""
                INSERT OR REPLACE INTO matches (id, missing_case_id, found_case_id, confidence_score, match_category, supporting_evidence, missing_evidence, rationale, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'POTENTIAL', ?)
            """, (match_id, case_id, fp['case_id'], score, res["match_category"], json.dumps(res["supporting_evidence"]), json.dumps(res["missing_evidence"]), res["rationale"], now_str))

            c.execute("""
                INSERT INTO notifications (title, message, type, case_id, created_at)
                VALUES (?, ?, 'MATCH', ?, ?)
            """, ("🔔 New Potential Match Generated", f"Match score {score}% between missing report {case_id} and found record {fp['case_id']}.", case_id, now_str))

    if highest_match >= 75.0:
        c.execute("UPDATE cases SET status = 'POTENTIAL_MATCH' WHERE id = ?", (case_id,))

    conn.commit()
    conn.close()

    return {"status": "success", "case_id": case_id, "highest_match_score": highest_match, "message": "Missing person report submitted successfully."}

@app.post("/api/cases/found")
def report_found_person(data: FoundPersonCreate):
    conn = get_connection()
    c = conn.cursor()

    count = c.execute("SELECT COUNT(*) FROM cases WHERE case_type = 'FOUND'").fetchone()[0] + 2051
    case_id = f"FP-{count}"
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    c.execute("""
        INSERT INTO cases (id, case_type, status, priority, priority_score, created_at, updated_at, reporter_name, reporter_contact, reporter_relationship, source, reliability)
        VALUES (?, 'FOUND', 'UNDER_REVIEW', 'MEDIUM', 50.0, ?, ?, ?, ?, ?, 'Citizen', 'HIGH')
    """, (case_id, now_str, now_str, data.reporter_name, data.reporter_contact, data.reporter_relationship))

    c.execute("""
        INSERT INTO found_persons (case_id, name_if_known, age_approx, gender, height_approx, physical_marks, clothing, hair, current_location, time_found, condition, shelter_or_hospital, photo_url, lat, lng)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (case_id, data.name_if_known, data.age_approx, data.gender, data.height_approx, data.physical_marks, data.clothing, data.hair, data.current_location, data.time_found, data.condition, data.shelter_or_hospital, data.photo_url, data.lat, data.lng))

    c.execute("""
        INSERT INTO timeline_events (case_id, timestamp, location, source, organization, description, status, lat, lng)
        VALUES (?, ?, ?, 'Found Person Intake', ?, ?, 'REGISTERED', ?, ?)
    """, (case_id, data.time_found, data.current_location, data.shelter_or_hospital or "Relief Station", f"Found person registered: {data.name_if_known} ({data.condition}).", data.lat, data.lng))

    c.execute("""
        INSERT INTO audit_logs (timestamp, case_id, actor, action, details)
        VALUES (?, ?, ?, 'CREATE_FOUND_REPORT', ?)
    """, (now_str, case_id, data.reporter_name, f"Unverified Found Person report created at {data.current_location}."))

    # Match cycle against missing
    missing_rows = dicts_from_rows(c.execute("SELECT * FROM missing_persons").fetchall())
    fp_dict = {
        "name_if_known": data.name_if_known, "age_approx": data.age_approx, "gender": data.gender,
        "height_approx": data.height_approx, "physical_marks": data.physical_marks,
        "clothing": data.clothing, "current_location": data.current_location,
        "shelter_or_hospital": data.shelter_or_hospital, "time_found": data.time_found,
        "lat": data.lat, "lng": data.lng
    }

    for mp in missing_rows:
        res = calculate_match_score(mp, fp_dict)
        score = res["confidence_score"]
        if score >= 60.0:
            match_id = f"M-{mp['case_id']}-{case_id}"
            c.execute("""
                INSERT OR REPLACE INTO matches (id, missing_case_id, found_case_id, confidence_score, match_category, supporting_evidence, missing_evidence, rationale, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'POTENTIAL', ?)
            """, (match_id, mp['case_id'], case_id, score, res["match_category"], json.dumps(res["supporting_evidence"]), json.dumps(res["missing_evidence"]), res["rationale"], now_str))

            c.execute("""
                INSERT INTO notifications (title, message, type, case_id, created_at)
                VALUES (?, ?, 'MATCH', ?, ?)
            """, ("🔔 Potential Match Found", f"Found report {case_id} matches missing person {mp['name']} ({score}%).", mp['case_id'], now_str))

    conn.commit()
    conn.close()

    return {"status": "success", "case_id": case_id, "message": "Found-person report registered successfully."}

@app.post("/api/cases/emergency")
def report_emergency(data: EmergencyReportCreate):
    conn = get_connection()
    c = conn.cursor()

    count = c.execute("SELECT COUNT(*) FROM cases WHERE case_type = 'EMERGENCY'").fetchone()[0] + 1045
    case_id = f"ER-{count}"
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    priority_label = "CRITICAL" if data.emergency_type in ["PERSON_TRAPPED", "PERSON_IN_DANGER", "MULTIPLE_PEOPLE"] else "HIGH"
    priority_score = 90.0 if priority_label == "CRITICAL" else 75.0

    c.execute("""
        INSERT INTO cases (id, case_type, status, priority, priority_score, created_at, updated_at, reporter_name, reporter_contact, source, reliability)
        VALUES (?, 'EMERGENCY', 'NEW', ?, ?, ?, ?, ?, ?, 'Citizen', 'HIGH')
    """, (case_id, priority_label, priority_score, now_str, now_str, data.reporter_name, data.reporter_contact))

    c.execute("""
        INSERT INTO emergency_reports (case_id, emergency_type, location, lat, lng, num_people, condition, description, fatality_unverified, photo_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (case_id, data.emergency_type, data.location, data.lat, data.lng, data.num_people, data.condition, data.description, 1 if data.fatality_unverified else 0, data.photo_url))

    c.execute("""
        INSERT INTO timeline_events (case_id, timestamp, location, source, organization, description, status, lat, lng)
        VALUES (?, ?, ?, 'Emergency SOS', ?, ?, 'REPORTED', ?, ?)
    """, (case_id, datetime.datetime.now().strftime("%I:%M %p"), data.location, f"Citizen: {data.reporter_name}", f"Emergency SOS ({data.emergency_type.replace('_', ' ')}): {data.description}", data.lat, data.lng))

    c.execute("""
        INSERT INTO audit_logs (timestamp, case_id, actor, action, details)
        VALUES (?, ?, ?, 'EMERGENCY_SOS_CREATED', ?)
    """, (now_str, case_id, data.reporter_name, f"Emergency SOS filed: {data.num_people} person(s) at {data.location}."))

    c.execute("""
        INSERT INTO notifications (title, message, type, case_id, created_at)
        VALUES (?, ?, 'EMERGENCY', ?, ?)
    """, (f"🚨 Emergency SOS: {priority_label}", f"{case_id} — {data.emergency_type.replace('_', ' ')} at {data.location}.", case_id, now_str))

    conn.commit()
    conn.close()

    return {"status": "success", "case_id": case_id, "priority": priority_label, "message": "Emergency SOS registered successfully. Response team alerted."}

# ----------------------------------------------------
# LIST & DETAIL ENDPOINTS
# ----------------------------------------------------
@app.get("/api/cases")
def list_cases(case_type: Optional[str] = None, status: Optional[str] = None, priority: Optional[str] = None, search: Optional[str] = None):
    conn = get_connection()
    c = conn.cursor()

    sql = "SELECT * FROM cases WHERE 1=1"
    params = []
    if case_type:
        sql += " AND case_type = ?"
        params.append(case_type.upper())
    if status:
        sql += " AND status = ?"
        params.append(status.upper())
    if priority:
        sql += " AND priority = ?"
        params.append(priority.upper())

    sql += " ORDER BY priority_score DESC"
    cases = dicts_from_rows(c.execute(sql, params).fetchall())

    results = []
    for case in cases:
        cid = case["id"]
        ctype = case["case_type"]

        if ctype == "MISSING":
            mp = dict_from_row(c.execute("SELECT * FROM missing_persons WHERE case_id = ?", (cid,)).fetchone())
            if mp:
                case["person"] = mp
        elif ctype == "FOUND":
            fp = dict_from_row(c.execute("SELECT * FROM found_persons WHERE case_id = ?", (cid,)).fetchone())
            if fp:
                case["person"] = fp
        elif ctype == "EMERGENCY":
            er = dict_from_row(c.execute("SELECT * FROM emergency_reports WHERE case_id = ?", (cid,)).fetchone())
            if er:
                case["emergency"] = er

        if search:
            s = search.lower()
            if s not in str(case).lower():
                continue

        results.append(case)

    conn.close()
    return results

@app.get("/api/cases/{case_id}")
def get_case_detail(case_id: str):
    conn = get_connection()
    c = conn.cursor()

    case_row = dict_from_row(c.execute("SELECT * FROM cases WHERE id = ?", (case_id,)).fetchone())
    if not case_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Case not found")

    ctype = case_row["case_type"]
    related_info = {}

    if ctype == "MISSING":
        mp = dict_from_row(c.execute("SELECT * FROM missing_persons WHERE case_id = ?", (case_id,)).fetchone())
        if mp:
            case_row["person"] = mp
            related_info["vulnerability"] = mp.get("vulnerability")
    elif ctype == "FOUND":
        fp = dict_from_row(c.execute("SELECT * FROM found_persons WHERE case_id = ?", (case_id,)).fetchone())
        if fp:
            case_row["person"] = fp
    elif ctype == "EMERGENCY":
        er = dict_from_row(c.execute("SELECT * FROM emergency_reports WHERE case_id = ?", (case_id,)).fetchone())
        if er:
            case_row["emergency"] = er
            related_info["emergency_type"] = er.get("emergency_type")

    # Matches
    match_rows = dicts_from_rows(c.execute("SELECT * FROM matches WHERE missing_case_id = ? OR found_case_id = ?", (case_id, case_id)).fetchall())
    case_row["matches"] = []
    highest_score = 0.0

    for m in match_rows:
        m["supporting_evidence"] = json.loads(m["supporting_evidence"]) if m.get("supporting_evidence") else []
        m["missing_evidence"] = json.loads(m["missing_evidence"]) if m.get("missing_evidence") else []
        if m["confidence_score"] > highest_score:
            highest_score = m["confidence_score"]
        case_row["matches"].append(m)

    related_info["highest_match_score"] = highest_score
    case_row["calculated_priority"] = calculate_case_priority(case_row, related_info)

    # Timeline & consistency
    events = dicts_from_rows(c.execute("SELECT * FROM timeline_events WHERE case_id = ? ORDER BY id ASC", (case_id,)).fetchall())
    case_row["timeline"] = events
    case_row["timeline_consistency"] = check_timeline_consistency(events)

    # Evidences & conflicts & audits
    case_row["evidences"] = dicts_from_rows(c.execute("SELECT * FROM evidence WHERE case_id = ?", (case_id,)).fetchall())
    case_row["conflicts"] = dicts_from_rows(c.execute("SELECT * FROM conflicts WHERE case_id = ?", (case_id,)).fetchall())
    case_row["audits"] = dicts_from_rows(c.execute("SELECT * FROM audit_logs WHERE case_id = ? ORDER BY id DESC", (case_id,)).fetchall())

    conn.close()
    return case_row

# ----------------------------------------------------
# MATCH VERIFICATION & RESCUE DISPATCH
# ----------------------------------------------------
@app.get("/api/matches")
def list_matches():
    conn = get_connection()
    c = conn.cursor()
    matches = dicts_from_rows(c.execute("SELECT * FROM matches ORDER BY confidence_score DESC").fetchall())
    for m in matches:
        m["supporting_evidence"] = json.loads(m["supporting_evidence"]) if m.get("supporting_evidence") else []
        m["missing_evidence"] = json.loads(m["missing_evidence"]) if m.get("missing_evidence") else []
    conn.close()
    return matches

@app.post("/api/matches/{match_id}/verify")
def verify_match(match_id: str, data: VerifyMatchRequest):
    conn = get_connection()
    c = conn.cursor()

    m = dict_from_row(c.execute("SELECT * FROM matches WHERE id = ?", (match_id,)).fetchone())
    if not m:
        conn.close()
        raise HTTPException(status_code=404, detail="Match record not found")

    new_status = "VERIFIED" if data.action == "CONFIRM" else ("REJECTED" if data.action == "REJECT" else "NEED_MORE_EVIDENCE")
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    c.execute("UPDATE matches SET status = ?, reviewed_by = ?, reviewed_at = ? WHERE id = ?", (new_status, data.reviewer_name, now_str, match_id))

    if data.action == "CONFIRM":
        c.execute("UPDATE cases SET status = 'VERIFIED', updated_at = ? WHERE id = ?", (now_str, m["missing_case_id"]))
        c.execute("UPDATE cases SET status = 'VERIFIED', updated_at = ? WHERE id = ?", (now_str, m["found_case_id"]))

        c.execute("""
            INSERT INTO timeline_events (case_id, timestamp, location, source, organization, description, status)
            VALUES (?, ?, 'Relief Center / Verified Facility', 'Human Verification', ?, 'IDENTITY VERIFIED MATCH CONFIRMED. Family notification dispatched.', 'VERIFIED')
        """, (m["missing_case_id"], datetime.datetime.now().strftime("%I:%M %p"), f"Verified by: {data.reviewer_name}"))

        c.execute("""
            INSERT INTO audit_logs (timestamp, case_id, actor, action, details)
            VALUES (?, ?, ?, 'MATCH_CONFIRMED', ?)
        """, (now_str, m["missing_case_id"], data.reviewer_name, f"Match {match_id} confirmed between {m['missing_case_id']} and {m['found_case_id']}."))

        c.execute("""
            INSERT INTO notifications (title, message, type, case_id, created_at)
            VALUES (?, ?, 'VERIFICATION', ?, ?)
        """, ("✅ Identity Verified — Match Confirmed", f"Case {m['missing_case_id']} identity verified by {data.reviewer_name}. Family notified.", m["missing_case_id"], now_str))

    elif data.action == "REJECT":
        c.execute("UPDATE cases SET status = 'UNDER_REVIEW' WHERE id = ? AND status = 'POTENTIAL_MATCH'", (m["missing_case_id"],))
        c.execute("""
            INSERT INTO audit_logs (timestamp, case_id, actor, action, details)
            VALUES (?, ?, ?, 'MATCH_REJECTED', ?)
        """, (now_str, m["missing_case_id"], data.reviewer_name, f"Match {match_id} rejected. Reason: {data.notes or 'Insufficient evidence'}"))

    conn.commit()
    conn.close()

    return {"status": "success", "match_status": new_status, "message": f"Match status updated to {new_status}."}

@app.get("/api/rescue_teams")
def list_rescue_teams():
    conn = get_connection()
    c = conn.cursor()
    teams = dicts_from_rows(c.execute("SELECT * FROM rescue_teams").fetchall())
    conn.close()
    return teams

@app.post("/api/emergencies/{case_id}/assign")
def assign_rescue_team(case_id: str, data: RescueAssignRequest):
    conn = get_connection()
    c = conn.cursor()

    case_row = dict_from_row(c.execute("SELECT * FROM cases WHERE id = ?", (case_id,)).fetchone())
    if not case_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Emergency case not found")

    team = dict_from_row(c.execute("SELECT * FROM rescue_teams WHERE id = ?", (data.team_id,)).fetchone())
    if not team:
        conn.close()
        raise HTTPException(status_code=404, detail="Rescue team not found")

    t_status = data.status or "DISPATCHED"
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    c.execute("UPDATE rescue_teams SET status = ?, assigned_case_id = ? WHERE id = ?", (t_status, case_id, data.team_id))
    c.execute("UPDATE emergency_reports SET assigned_team = ? WHERE case_id = ?", (team["name"], case_id))

    new_c_status = "DISPATCHED" if t_status == "DISPATCHED" else ("RESOLVED" if t_status == "RESOLVED" else "UNDER_REVIEW")
    c.execute("UPDATE cases SET status = ?, assigned_responder = ?, updated_at = ? WHERE id = ?", (new_c_status, team["leader"], now_str, case_id))

    c.execute("""
        INSERT INTO timeline_events (case_id, timestamp, location, source, organization, description, status)
        VALUES (?, ?, 'Emergency Scene', 'Command Center Dispatch', ?, ?, ?)
    """, (case_id, datetime.datetime.now().strftime("%I:%M %p"), team["name"], f"Rescue operations status updated to {t_status} under leadership of {team['leader']}.", t_status))

    c.execute("""
        INSERT INTO audit_logs (timestamp, case_id, actor, action, details)
        VALUES (?, ?, 'Command Center Officer', 'RESCUE_TEAM_DISPATCH', ?)
    """, (now_str, case_id, f"Assigned {team['name']} to emergency {case_id}. Status: {t_status}."))

    c.execute("""
        INSERT INTO notifications (title, message, type, case_id, created_at)
        VALUES (?, ?, 'EMERGENCY', ?, ?)
    """, (f"🚑 Rescue Team Dispatched: {team['name']}", f"{team['name']} assigned to emergency {case_id}.", case_id, now_str))

    conn.commit()
    conn.close()

    return {"status": "success", "emergency_status": new_c_status, "team_status": t_status, "message": f"{team['name']} successfully assigned to {case_id}."}

# ----------------------------------------------------
# DUPLICATES & CONFLICTS
# ----------------------------------------------------
@app.get("/api/duplicates")
def list_duplicates():
    conn = get_connection()
    c = conn.cursor()
    dups = dicts_from_rows(c.execute("SELECT * FROM duplicate_groups").fetchall())
    for d in dups:
        d["case_ids"] = json.loads(d["case_ids"]) if d.get("case_ids") else []
    conn.close()
    return dups

@app.post("/api/duplicates/{group_id}/resolve")
def resolve_duplicate(group_id: int, action: str = Query("MERGE")):
    conn = get_connection()
    c = conn.cursor()
    new_status = "MERGED" if action == "MERGE" else "DISMISSED"
    c.execute("UPDATE duplicate_groups SET status = ? WHERE id = ?", (new_status, group_id))
    conn.commit()
    conn.close()
    return {"status": "success", "message": f"Duplicate group {group_id} {new_status.lower()}."}

@app.get("/api/conflicts")
def list_conflicts():
    conn = get_connection()
    c = conn.cursor()
    confs = dicts_from_rows(c.execute("SELECT * FROM conflicts").fetchall())
    conn.close()
    return confs

@app.post("/api/conflicts/{conflict_id}/resolve")
def resolve_conflict(conflict_id: int):
    conn = get_connection()
    c = conn.cursor()
    c.execute("UPDATE conflicts SET status = 'RESOLVED' WHERE id = ?", (conflict_id,))
    conf = dict_from_row(c.execute("SELECT case_id FROM conflicts WHERE id = ?", (conflict_id,)).fetchone())
    if conf:
        c.execute("UPDATE cases SET conflict_flag = 0 WHERE id = ?", (conf["case_id"],))
    conn.commit()
    conn.close()
    return {"status": "success", "message": f"Conflict {conflict_id} marked as RESOLVED."}

# ----------------------------------------------------
# FAMILY TRACKING PORTAL (PRIVACY-PRESERVING)
# ----------------------------------------------------
@app.get("/api/family/track/{query}")
def track_family_case(query: str):
    conn = get_connection()
    c = conn.cursor()

    q_upper = query.upper().strip()
    case = dict_from_row(c.execute("SELECT * FROM cases WHERE UPPER(id) = ? OR reporter_contact = ?", (q_upper, query)).fetchone())

    if not case:
        conn.close()
        raise HTTPException(status_code=404, detail="No matching report found for the provided Case ID or phone number.")

    cid = case["id"]
    mp = dict_from_row(c.execute("SELECT * FROM missing_persons WHERE case_id = ?", (cid,)).fetchone())
    events = dicts_from_rows(c.execute("SELECT * FROM timeline_events WHERE case_id = ? ORDER BY id ASC", (cid,)).fetchall())

    conn.close()

    public_status = "UNDER INVESTIGATION"
    if case["status"] in ["VERIFIED", "RESOLVED"]:
        public_status = "LOCATED & SAFE"
    elif case["status"] in ["POTENTIAL_MATCH", "VERIFICATION_PENDING"]:
        public_status = "POTENTIAL LOCATION IDENTIFIED — VERIFICATION IN PROGRESS"

    latest_event = events[-1] if events else None

    return {
        "case_id": case["id"],
        "person_name": mp["name"] if mp else "Reported Relative",
        "public_status": public_status,
        "last_updated": case["updated_at"],
        "verified_location": latest_event["location"] if (latest_event and case["status"] in ["VERIFIED", "RESOLVED"]) else "Relief Operations Active",
        "current_condition": "Safe & Under Care" if case["status"] in ["VERIFIED", "RESOLVED"] else "Search & Match Verification Active",
        "public_timeline": [
            {
                "timestamp": e["timestamp"],
                "location": e["location"],
                "description": e["description"],
                "status": e["status"]
            } for e in events
        ],
        "message": f"Reunite360 active update for {mp['name'] if mp else 'your relative'}. Emergency teams and relief centers are coordinating."
    }

# ----------------------------------------------------
# NOTIFICATIONS & AUDIT LOGS
# ----------------------------------------------------
@app.get("/api/notifications")
def list_notifications():
    conn = get_connection()
    c = conn.cursor()
    notifs = dicts_from_rows(c.execute("SELECT * FROM notifications ORDER BY id DESC LIMIT 30").fetchall())
    conn.close()
    return notifs

@app.get("/api/audit")
def list_audit_logs():
    conn = get_connection()
    c = conn.cursor()
    audits = dicts_from_rows(c.execute("SELECT * FROM audit_logs ORDER BY id DESC LIMIT 50").fetchall())
    conn.close()
    return audits
