import json
import datetime
from database import get_connection, init_db
from engine.matcher import calculate_match_score

def seed_database():
    init_db()
    conn = get_connection()
    cursor = conn.cursor()

    tables = [
        "cases", "missing_persons", "found_persons", "emergency_reports",
        "matches", "timeline_events", "evidence", "conflicts",
        "duplicate_groups", "rescue_teams", "notifications", "audit_logs"
    ]
    for tbl in tables:
        cursor.execute(f"DELETE FROM {tbl}")
    conn.commit()

    print("Seeding Reunite360 disaster scenario demo dataset...")

    # 1. Rescue Teams
    teams = [
        ("TEAM-ALPHA", "Rescue Team Alpha", "Capt. Vikram Seth", "+91 98765 43210", "AVAILABLE", None, 13.0827, 80.2707),
        ("TEAM-BETA", "Rescue Team Beta", "Inspector Ramesh Kumar", "+91 98765 43211", "DISPATCHED", "ER-1042", 13.0890, 80.2800),
        ("TEAM-CHARLIE", "Rescue Team Charlie", "Officer Anita Sharma", "+91 98765 43212", "AVAILABLE", None, 13.0750, 80.2550),
        ("TEAM-MED-1", "Medical Quick Response Unit 1", "Dr. Priya Sundaram", "+91 98765 43213", "AVAILABLE", None, 13.0800, 80.2600),
    ]
    cursor.executemany("INSERT INTO rescue_teams VALUES (?,?,?,?,?,?,?,?)", teams)

    # 2. Special Demo Case 1 — Ravi Kumar (MP-1024 / FP-2048 / FP-2050)
    cursor.execute("""
        INSERT INTO cases (id, case_type, status, priority, priority_score, created_at, updated_at, reporter_name, reporter_contact, reporter_relationship, assigned_responder, source, reliability, conflict_flag, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ("MP-1024", "MISSING", "POTENTIAL_MATCH", "HIGH", 78.5, "2026-10-08 10:15:00", "2026-10-08 11:30:00", "Priya Kumar", "+91 98401 12345", "Wife", "Officer Rajesh", "Family", "HIGH", 0, "Last seen near Central Railway Station before flash evacuation."))

    cursor.execute("""
        INSERT INTO missing_persons (case_id, name, age, gender, height, physical_marks, clothing, hair, last_known_location, last_known_time, circumstances, vulnerability, photo_url, lat, lng)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ("MP-1024", "Ravi Kumar", 42, "Male", "5'8\"", "Deep scar on right hand, birthmark near left shoulder", "Dark blue t-shirt, black trousers", "Short black hair", "Central Railway Station, Platform 3", "10:00 AM", "Separated from family during sudden station stampede.", "GENERAL_ADULT", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400", 13.0827, 80.2707))

    cursor.execute("""
        INSERT INTO cases (id, case_type, status, priority, priority_score, created_at, updated_at, reporter_name, reporter_contact, reporter_relationship, assigned_responder, source, reliability, conflict_flag, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ("FP-2048", "FOUND", "POTENTIAL_MATCH", "MEDIUM", 55.0, "2026-10-08 10:45:00", "2026-10-08 11:20:00", "Rescue Team Alpha", "+91 98765 43210", "Rescue Worker", "Officer Rajesh", "Rescue Team", "HIGH", 0, "Rescued conscious near railway tracks."))

    cursor.execute("""
        INSERT INTO found_persons (case_id, name_if_known, age_approx, gender, height_approx, physical_marks, clothing, hair, current_location, time_found, condition, shelter_or_hospital, photo_url, lat, lng)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ("FP-2048", "Unknown Male", 42, "Male", "5'8\"", "Scar on right hand", "Blue shirt, dark trousers", "Short black hair", "Railway Evacuation Point", "10:45 AM", "Mild exhaustion, oriented", "St. John Relief Center (Shelter A)", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400", 13.0835, 80.2715))

    cursor.execute("""
        INSERT INTO cases (id, case_type, status, priority, priority_score, created_at, updated_at, reporter_name, reporter_contact, reporter_relationship, source, reliability, conflict_flag, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ("FP-2050", "FOUND", "UNDER_REVIEW", "MEDIUM", 50.0, "2026-10-08 11:20:00", "2026-10-08 11:20:00", "St. John Relief Staff", "+91 98400 99887", "Shelter Manager", "Shelter", "HIGH", 0, "Intake registration completed at Shelter A."))

    cursor.execute("""
        INSERT INTO found_persons (case_id, name_if_known, age_approx, gender, height_approx, physical_marks, clothing, hair, current_location, time_found, condition, shelter_or_hospital, lat, lng)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ("FP-2050", "Unknown Male #27", 42, "Male", "5'8\"", "Visible scar on right hand", "Blue shirt", "Short dark hair", "St. John Relief Center (Shelter A), Hall 2", "11:20 AM", "Stable", "St. John Relief Center", 13.0850, 80.2750))

    # Match Ravi Kumar
    mp_dict = {"name": "Ravi Kumar", "age": 42, "gender": "Male", "height": "5'8\"", "physical_marks": "Deep scar on right hand", "clothing": "Dark blue t-shirt", "last_known_location": "Central Railway Station", "last_known_time": "10:00 AM", "lat": 13.0827, "lng": 80.2707}
    fp_dict = {"name_if_known": "Unknown Male", "age_approx": 42, "gender": "Male", "height_approx": "5'8\"", "physical_marks": "Scar on right hand", "clothing": "Blue shirt", "current_location": "Railway Evacuation Point", "time_found": "10:45 AM", "lat": 13.0835, "lng": 80.2715}
    match_res = calculate_match_score(mp_dict, fp_dict)

    cursor.execute("""
        INSERT INTO matches (id, missing_case_id, found_case_id, confidence_score, match_category, supporting_evidence, missing_evidence, rationale, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ("M-1024-2048", "MP-1024", "FP-2048", match_res["confidence_score"], match_res["match_category"], json.dumps(match_res["supporting_evidence"]), json.dumps(match_res["missing_evidence"]), match_res["rationale"], "POTENTIAL", "2026-10-08 11:25:00"))

    # Timeline events for Ravi Kumar
    events_ravi = [
        ("MP-1024", "10:00 AM", "Railway Station", "Family Report", "Priya Kumar (Wife)", "Ravi Kumar last seen during flash station evacuation.", "REPORTED", None, 13.0827, 80.2707),
        ("MP-1024", "10:45 AM", "Railway Station Perimeter", "Rescue Team", "Rescue Team Alpha", "Rescued male matching description near railway tracks.", "RESCUED", None, 13.0835, 80.2715),
        ("MP-1024", "11:20 AM", "Shelter A (St. John Center)", "Shelter Intake", "St. John Relief Center", "Registered intake at Shelter A. Physical characteristics recorded.", "SHELTER_INTAKE", None, 13.0850, 80.2750),
        ("MP-1024", "01:50 PM", "Government General Hospital", "Hospital Intake", "Govt General Hospital", "Medical triage completed. Minor abrasions treated.", "MEDICAL_CHECK", None, 13.0810, 80.2780),
        ("MP-1024", "04:30 PM", "Relief Camp C (Stadium)", "Relief Center", "Disaster Response Authority", "Transferred to family waiting section at Relief Camp C.", "LOCATED", None, 13.0780, 80.2720)
    ]
    cursor.executemany("INSERT INTO timeline_events (case_id, timestamp, location, source, organization, description, status, evidence_ref, lat, lng) VALUES (?,?,?,?,?,?,?,?,?,?)", events_ravi)

    evidences_ravi = [
        ("MP-1024", "Priya Kumar (Family)", "FAMILY", "VERIFIED", "HIGH", "10:15 AM", "Family photo provided showing scar on right hand."),
        ("MP-1024", "Rescue Team Alpha", "RESCUE_TEAM", "VERIFIED", "HIGH", "10:45 AM", "Rescue field report filed matching height and clothing."),
        ("MP-1024", "St. John Relief Center", "SHELTER", "VERIFIED", "HIGH", "11:20 AM", "Shelter registration log entry #27 confirmed.")
    ]
    cursor.executemany("INSERT INTO evidence (case_id, source_name, source_type, verification_status, reliability_level, timestamp, description) VALUES (?,?,?,?,?,?,?)", evidences_ravi)

    # 3. Emergency SOS (ER-1042)
    cursor.execute("""
        INSERT INTO cases (id, case_type, status, priority, priority_score, created_at, updated_at, reporter_name, reporter_contact, reporter_relationship, source, reliability, conflict_flag, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ("ER-1042", "EMERGENCY", "NEW", "CRITICAL", 95.0, "2026-10-08 11:40:00", "2026-10-08 11:40:00", "Karthik M (Citizen)", "+91 97900 11223", "Bystander", "Citizen", "HIGH", 0, "CRITICAL SOS: 3 people trapped under collapsed wall structure."))

    cursor.execute("""
        INSERT INTO emergency_reports (case_id, emergency_type, location, lat, lng, num_people, condition, description, fatality_unverified, assigned_team, photo_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ("ER-1042", "PERSON_TRAPPED", "XYZ Road, Near Railway Overbridge", 13.0890, 80.2800, 3, "1 person severely injured; 2 trapped in second floor debris.", "Structural collapse due to heavy waterlogging. Immediate heavy rescue equipment needed.", 0, None, "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&q=80&w=400"))

    # 4. Unverified Fatality (ER-1099)
    cursor.execute("""
        INSERT INTO cases (id, case_type, status, priority, priority_score, created_at, updated_at, reporter_name, reporter_contact, source, reliability, conflict_flag, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ("ER-1099", "EMERGENCY", "UNDER_REVIEW", "HIGH", 75.0, "2026-10-08 12:00:00", "2026-10-08 12:00:00", "Anonymous Citizen", "+91 99999 00000", "Citizen", "LOW", 0, "Unverified fatality report from civilian."))

    cursor.execute("""
        INSERT INTO emergency_reports (case_id, emergency_type, location, lat, lng, num_people, condition, description, fatality_unverified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ("ER-1099", "POSSIBLE_FATALITY", "Canal Bank Road, Zone 4", 13.0710, 80.2620, 1, "Unresponsive individual floating near submerged vehicle.", "Civilian report of possible casualty. IMPORTANT: Unverified report. Responders dispatched for verification.", 1))

    # 5. Conflict Case (MP-1092 Meena Sundaram)
    cursor.execute("""
        INSERT INTO cases (id, case_type, status, priority, priority_score, created_at, updated_at, reporter_name, reporter_contact, source, reliability, conflict_flag, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ("MP-1092", "MISSING", "POTENTIAL_MATCH", "HIGH", 82.0, "2026-10-08 09:30:00", "2026-10-08 12:15:00", "Sundaram (Father)", "+91 98402 33445", "Family", "HIGH", 1, "CONFLICT: Shelter record claims intake at 3:00 PM, Hospital records admission at 2:00 PM."))

    cursor.execute("""
        INSERT INTO missing_persons (case_id, name, age, gender, height, physical_marks, clothing, last_known_location, last_known_time, vulnerability, photo_url, lat, lng)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ("MP-1092", "Meena Sundaram", 68, "Female", "5'2\"", "Gold bangles, spectacles, silver hair", "Yellow saree", "Market Complex, Zone 2", "09:00 AM", "ELDERLY", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400", 13.0650, 80.2500))

    cursor.execute("""
        INSERT INTO conflicts (case_id, source_a, source_b, conflict_type, description, status)
        VALUES (?, ?, ?, ?, ?, ?)
    """, ("MP-1092", "Shelter A (St. John Relief Center)", "City Memorial Hospital", "LOCATION_TIME_MISMATCH", "Shelter A logged present at 3:00 PM while City Memorial Hospital logged admission at 2:00 PM. Incompatible travel timeline.", "UNRESOLVED"))

    # 6. Duplicate Group (DG-101)
    dups_cases = [
        ("FP-2003", "FOUND", "UNDER_REVIEW", "MEDIUM", 45.0, "Shelter", "Anand Sharma", 35, "Male", "5'10\"", "Tattoo on left forearm", "Red t-shirt", "Shelter B (High School)", "08:30 AM", 13.0900, 80.2600),
        ("FP-2008", "FOUND", "UNDER_REVIEW", "MEDIUM", 45.0, "Citizen", "Anand", 36, "Male", "5'10\"", "Arm tattoo", "Red shirt", "Shelter B Perimeter", "09:00 AM", 13.0905, 80.2605),
        ("FP-2012", "FOUND", "UNDER_REVIEW", "MEDIUM", 45.0, "Rescue Team", "Male with forearm tattoo", 35, "Male", "5'10\"", "Tattoo left forearm", "Red shirt", "Relief Intake B", "08:45 AM", 13.0898, 80.2598),
    ]
    for cid, ctype, cstat, cpri, cscore, csrc, name, age, gnd, hgt, marks, cloth, loc, tfound, lat, lng in dups_cases:
        cursor.execute("INSERT INTO cases (id, case_type, status, priority, priority_score, source, created_at) VALUES (?,?,?,?,?,?,?)", (cid, ctype, cstat, cpri, cscore, csrc, "2026-10-08 08:30:00"))
        cursor.execute("INSERT INTO found_persons (case_id, name_if_known, age_approx, gender, height_approx, physical_marks, clothing, current_location, time_found, lat, lng) VALUES (?,?,?,?,?,?,?,?,?,?,?)", (cid, name, age, gnd, hgt, marks, cloth, loc, tfound, lat, lng))

    cursor.execute("""
        INSERT INTO duplicate_groups (title, primary_case_id, case_ids, similarity_score, status)
        VALUES ('Duplicate Found Person Entries (Anand / Forearm Tattoo)', 'FP-2003', ?, 89.5, 'PENDING')
    """, (json.dumps(["FP-2003", "FP-2008", "FP-2012"]),))

    # 7. Additional Cases
    additional = [
        ("MP-1001", "MISSING", "UNDER_REVIEW", "HIGH", 72.0, "Child missing near park", "Kavya Ramesh", 7, "Female", "3'10\"", "Wearing green frock with floral pattern", "Children's Park Road", "08:30 AM", "CHILD", 13.0760, 80.2680),
        ("MP-1002", "MISSING", "RESOLVED", "MEDIUM", 40.0, "Found safe at grandmother shelter", "Gopalakrishnan", 74, "Male", "5'5\"", "White shirt, walking stick", "West Mada Street", "07:00 AM", "ELDERLY", 13.0700, 80.2700),
        ("MP-1003", "MISSING", "UNDER_REVIEW", "CRITICAL", 88.0, "Injured citizen last seen near bus stand", "Suresh Pillai", 51, "Male", "5'9\"", "Limp in left leg, blue shirt", "Central Bus Terminus", "09:15 AM", "INJURED", 13.0810, 80.2650),
        ("MP-1004", "MISSING", "POTENTIAL_MATCH", "HIGH", 68.0, "Missing pregnant mother", "Deepa Lakshmi", 29, "Female", "5'4\"", "Red saree, gold chain", "South Relief Center", "09:45 AM", "PREGNANT", 13.0600, 80.2550),

        ("FP-2001", "FOUND", "UNDER_REVIEW", "MEDIUM", 45.0, "Young girl found at Shelter B", "Unknown Girl", 7, "Female", "3'10\"", "Green frock with flower pattern", "Shelter B (High School)", "09:00 AM", "CHILD", 13.0900, 80.2600),
        ("FP-2002", "FOUND", "RESOLVED", "LOW", 30.0, "Elderly man reconnected", "Gopalakrishnan", 74, "Male", "5'5\"", "White shirt, walking stick", "Shelter C (Stadium)", "08:00 AM", "ELDERLY", 13.0780, 80.2720),
        ("FP-2005", "FOUND", "UNDER_REVIEW", "HIGH", 65.0, "Injured male admitted at Apollo", "Unknown Male", 50, "Male", "5'9\"", "Left leg bandage, blue t-shirt", "Apollo Relief Care Unit", "10:00 AM", "INJURED", 13.0750, 80.2800),

        ("ER-1001", "EMERGENCY", "DISPATCHED", "HIGH", 78.0, "Elderly trapped on terrace", None, None, None, None, None, "North Zone Terrace", "11:00 AM", "ELDERLY", 13.0950, 80.2650),
        ("ER-1002", "EMERGENCY", "RESOLVED", "MEDIUM", 50.0, "Medical kit emergency request", None, None, None, None, None, "Community Center", "09:30 AM", "GENERAL_ADULT", 13.0800, 80.2500),
    ]

    for item in additional:
        cid, ctype, cstat, cpri, cscore, cnotes, name, age, gnd, hgt, desc, loc, tval, vtype, lat, lng = item
        cursor.execute("INSERT INTO cases (id, case_type, status, priority, priority_score, notes, source, created_at) VALUES (?,?,?,?,?,?,?,?)", (cid, ctype, cstat, cpri, cscore, cnotes, "Citizen", "2026-10-08 09:00:00"))
        if ctype == "MISSING":
            cursor.execute("INSERT INTO missing_persons (case_id, name, age, gender, height, clothing, last_known_location, last_known_time, vulnerability, lat, lng) VALUES (?,?,?,?,?,?,?,?,?,?,?)", (cid, name, age, gnd, hgt, desc, loc, tval, vtype, lat, lng))
        elif ctype == "FOUND":
            cursor.execute("INSERT INTO found_persons (case_id, name_if_known, age_approx, gender, height_approx, clothing, current_location, time_found, lat, lng) VALUES (?,?,?,?,?,?,?,?,?,?)", (cid, name, age, gnd, hgt, desc, loc, tval, lat, lng))
        elif ctype == "EMERGENCY":
            cursor.execute("INSERT INTO emergency_reports (case_id, emergency_type, location, lat, lng, num_people, description) VALUES (?,?,?,?,?,?,?)", (cid, "PERSON_TRAPPED", loc, lat, lng, 2, cnotes))

    # 8. Notifications & Audits
    notifs = [
        ("🔔 High Confidence Match Found", "Potential match MP-1024 (Ravi Kumar) ↔ FP-2048 at 91% confidence.", "MATCH", "MP-1024", "2026-10-08 11:25:00"),
        ("🚨 Critical Emergency SOS Reported", "ER-1042: 3 people trapped near XYZ Road. Immediate dispatch required.", "EMERGENCY", "ER-1042", "2026-10-08 11:40:00"),
        ("⚠ Information Conflict Detected", "MP-1092 (Meena Sundaram) has conflicting location logs between Shelter A and Hospital B.", "CONFLICT", "MP-1092", "2026-10-08 12:15:00"),
    ]
    cursor.executemany("INSERT INTO notifications (title, message, type, case_id, created_at) VALUES (?,?,?,?,?)", notifs)

    audits = [
        ("2026-10-08 10:15:00", "MP-1024", "Priya Kumar (Family)", "CREATE_REPORT", "Missing person report created for Ravi Kumar."),
        ("2026-10-08 10:45:00", "FP-2048", "Rescue Team Alpha", "CREATE_REPORT", "Found person report registered near Railway Station."),
        ("2026-10-08 11:25:00", "MP-1024", "System AI Engine", "MATCH_GENERATED", "Smart multi-factor match generated: 91% confidence score."),
        ("2026-10-08 11:40:00", "ER-1042", "Karthik M (Citizen)", "EMERGENCY_REPORT", "Critical SOS submitted: 3 people trapped."),
    ]
    cursor.executemany("INSERT INTO audit_logs (timestamp, case_id, actor, action, details) VALUES (?,?,?,?,?)", audits)

    conn.commit()
    conn.close()
    print("Seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
