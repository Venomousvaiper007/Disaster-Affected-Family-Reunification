import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.app.database.session import get_db
from backend.app.database.models import (
    MissingReport, FoundPerson, FusedCase, CandidateMatch, TimelineEvent, NextBestAction, AuditLog
)
from backend.app.schemas.missing import MissingReportCreate, MissingReportResponse
from backend.app.services.matching import evaluate_candidate_match
from backend.app.services.nba import generate_next_best_action

router = APIRouter(prefix="/api/missing", tags=["missing"])

def format_missing_response(m: MissingReport, fused_id: Optional[str] = None, matched_found_id: Optional[str] = None, match_score: Optional[int] = None) -> dict:
    return {
        "id": str(m.id),
        "caseNumber": m.case_number,
        "reportedAt": m.created_at.isoformat() if m.created_at else datetime.utcnow().isoformat(),
        "reporterName": m.reporter_name,
        "reporterRelationship": m.reporter_relationship,
        "reporterContact": m.reporter_contact,
        "reporterAlternateContact": m.reporter_alternate_contact,
        "fullName": m.full_name,
        "aliasName": m.alias_name,
        "age": m.age,
        "gender": m.gender,
        "vulnerability": m.vulnerability,
        "traits": {
            "age": m.age,
            "gender": m.gender,
            "heightCm": m.height_cm,
            "build": m.build,
            "distinguishingMarks": m.distinguishing_marks or [],
            "clothingUpper": m.clothing_upper,
            "clothingLower": m.clothing_lower,
            "footwear": m.footwear,
            "accessories": m.accessories or [],
            "languagesSpoken": m.languages_spoken or [],
            "medicalConditionNotes": m.medical_condition_notes,
            "isConscious": True
        },
        "lastSeenLocation": {
            "lat": m.last_seen_lat,
            "lng": m.last_seen_lng,
            "address": m.last_seen_address,
            "landmark": m.last_seen_landmark,
            "sector": m.last_seen_sector
        },
        "lastSeenTime": m.last_seen_time.isoformat() if m.last_seen_time else datetime.utcnow().isoformat(),
        "photoUrl": m.photo_url,
        "additionalNotes": m.additional_notes,
        "status": m.status,
        "fusedCaseId": fused_id,
        "matchedFoundId": matched_found_id,
        "matchScore": match_score
    }

@router.get("", response_model=List[dict])
def list_missing_reports(db: Session = Depends(get_db)):
    reports = db.query(MissingReport).order_by(MissingReport.created_at.desc()).all()
    res = []
    for m in reports:
        # Find associated fused case
        fc = db.query(FusedCase).filter(FusedCase.missing_report_id == m.id).first()
        fused_id = str(fc.id) if fc else None
        matched_found_id = str(fc.found_person_id) if fc and fc.found_person_id else None
        match_score = fc.match_score if fc else None
        res.append(format_missing_response(m, fused_id, matched_found_id, match_score))
    return res

@router.post("", response_model=dict)
def create_missing_report(data: MissingReportCreate, db: Session = Depends(get_db), x_user_role: str = Header(default="FAMILY")):
    count = db.query(MissingReport).count()
    case_number = f"#R{100 + count + 25}"
    
    try:
        last_seen_dt = datetime.fromisoformat(data.lastSeenTime.replace("Z", "+00:00"))
    except Exception:
        last_seen_dt = datetime.utcnow()

    missing_record = MissingReport(
        id=uuid.uuid4(),
        case_number=case_number,
        reporter_name=data.reporterName,
        reporter_relationship=data.reporterRelationship,
        reporter_contact=data.reporterContact,
        reporter_alternate_contact=data.reporterAlternateContact,
        full_name=data.fullName,
        alias_name=data.aliasName,
        age=data.age,
        gender=data.gender,
        vulnerability=data.vulnerability,
        height_cm=data.traits.heightCm,
        build=data.traits.build,
        distinguishing_marks=data.traits.distinguishingMarks or [],
        clothing_upper=data.traits.clothingUpper,
        clothing_lower=data.traits.clothingLower,
        footwear=data.traits.footwear,
        accessories=data.traits.accessories or [],
        languages_spoken=data.traits.languagesSpoken or [],
        medical_condition_notes=data.traits.medicalConditionNotes,
        last_seen_address=data.lastSeenLocation.address,
        last_seen_landmark=data.lastSeenLocation.landmark,
        last_seen_sector=data.lastSeenLocation.sector,
        last_seen_lat=data.lastSeenLocation.lat,
        last_seen_lng=data.lastSeenLocation.lng,
        last_seen_time=last_seen_dt,
        photo_url=data.photoUrl,
        additional_notes=data.additionalNotes,
        status="UNVERIFIED"
    )
    db.add(missing_record)
    db.flush()

    # Search for potential candidate match in found_persons
    active_found = db.query(FoundPerson).filter(FoundPerson.status.notin_(["REUNITED", "CLOSED"])).all()
    best_match = None
    best_found = None

    missing_dict = format_missing_response(missing_record)
    for found in active_found:
        found_dict = {
            "id": str(found.id),
            "caseNumber": found.case_number,
            "isIdentified": found.is_identified,
            "givenName": found.given_name,
            "estimatedAgeMin": found.estimated_age_min,
            "estimatedAgeMax": found.estimated_age_max,
            "gender": found.gender,
            "vulnerability": found.vulnerability,
            "traits": {
                "heightCm": found.height_cm,
                "distinguishingMarks": found.distinguishing_marks or [],
                "clothingUpper": found.clothing_upper,
                "clothingLower": found.clothing_lower
            },
            "foundLocation": {"lat": found.found_lat, "lng": found.found_lng, "address": found.found_address},
            "foundTime": found.found_time.isoformat() if found.found_time else datetime.utcnow().isoformat(),
            "currentFacilityName": found.current_facility_name
        }
        eval_res = evaluate_candidate_match(missing_dict, found_dict)
        if eval_res["overallScore"] >= 50 and (best_match is None or eval_res["overallScore"] > best_match["overallScore"]):
            best_match = eval_res
            best_found = found

    fused_case_id = uuid.uuid4()
    fused_case_num = case_number

    if best_match and best_found:
        missing_record.status = "POSSIBLE_MATCH"
        best_found.status = "POSSIBLE_MATCH"

        fused_case = FusedCase(
            id=fused_case_id,
            case_number=fused_case_num,
            title=f"{missing_record.full_name} ({missing_record.age}y) — {missing_record.last_seen_landmark or 'Disaster Area'} / {best_found.current_facility_name}",
            status="POSSIBLE_MATCH",
            priority="CRITICAL" if missing_record.vulnerability in ["CHILD", "ELDERLY"] else "HIGH",
            vulnerability=missing_record.vulnerability,
            missing_report_id=missing_record.id,
            found_person_id=best_found.id,
            match_score=best_match["overallScore"],
            confidence_label=best_match["confidenceLabel"],
            score_breakdown=best_match,
            supporting_evidence=best_match["supportingEvidence"],
            conflicting_evidence=best_match["conflictingEvidence"],
            missing_information=best_match["missingInformation"],
            timeline_consistency=best_match["timelineConsistency"],
            recommended_verification=best_match["recommendedVerification"]
        )
        db.add(fused_case)
        db.flush()

        # Add candidate_matches record
        cand_match = CandidateMatch(
            id=uuid.uuid4(),
            missing_report_id=missing_record.id,
            found_person_id=best_found.id,
            overall_score=best_match["overallScore"],
            confidence_label=best_match["confidenceLabel"],
            name_score=best_match["nameScore"],
            age_score=best_match["ageScore"],
            gender_score=best_match["genderScore"],
            physical_score=best_match["physicalScore"],
            clothing_score=best_match["clothingScore"],
            location_score=best_match["locationScore"],
            timeline_score=best_match["timelineScore"],
            supporting_evidence=best_match["supportingEvidence"],
            conflicting_evidence=best_match["conflictingEvidence"],
            missing_information=best_match["missingInformation"],
            timeline_consistency=best_match["timelineConsistency"],
            recommended_verification=best_match["recommendedVerification"]
        )
        db.add(cand_match)

        # Create Timeline Events
        tl1 = TimelineEvent(
            id=uuid.uuid4(),
            fused_case_id=fused_case.id,
            missing_report_id=missing_record.id,
            event_time=last_seen_dt,
            source_type="FAMILY",
            source_name=f"{missing_record.reporter_name} ({missing_record.reporter_relationship})",
            title="Last Seen Report Logged",
            description=f"Missing person report filed: {missing_record.full_name}, wearing {missing_record.clothing_upper or 'casual clothing'}.",
            lat=missing_record.last_seen_lat,
            lng=missing_record.last_seen_lng,
            location_name=missing_record.last_seen_address,
            verified=True
        )
        tl2 = TimelineEvent(
            id=uuid.uuid4(),
            fused_case_id=fused_case.id,
            found_person_id=best_found.id,
            event_time=best_found.found_time or datetime.utcnow(),
            source_type=best_found.reported_by_role,
            source_name=best_found.reported_by_name,
            title="Individual Rescued / Logged at Intake",
            description=f"Found at {best_found.found_address}. Admitted to {best_found.current_facility_name}.",
            lat=best_found.found_lat,
            lng=best_found.found_lng,
            location_name=best_found.found_address,
            verified=True
        )
        db.add_all([tl1, tl2])

        # Generate NBA
        nba_data = generate_next_best_action(
            {"id": str(fused_case.id), "status": "POSSIBLE_MATCH", "vulnerability": missing_record.vulnerability},
            missing=missing_dict,
            found={"current_facility_name": best_found.current_facility_name, "contact_phone": best_found.contact_phone},
            match=best_match
        )
        nba_rec = NextBestAction(
            id=uuid.uuid4(),
            fused_case_id=fused_case.id,
            priority_score=nba_data["priorityScore"],
            urgency_level=nba_data["urgencyLevel"],
            title=nba_data["title"],
            description=nba_data["description"],
            assigned_role=nba_data["assignedRole"],
            target_facility_or_team=nba_data["targetFacilityOrTeam"],
            contact_phone=nba_data["contactPhone"],
            status="PENDING",
            steps=nba_data["steps"],
            rationale=nba_data["rationale"]
        )
        db.add(nba_rec)

        # Audit Log
        audit = AuditLog(
            id=uuid.uuid4(),
            actor_name=missing_record.reporter_name,
            actor_role="FAMILY",
            action="MISSING_REPORT_FUSED_MATCH",
            fused_case_id=fused_case.id,
            details=f"Correlated missing report {case_number} with Intake {best_found.case_number} at score {best_match['overallScore']}%."
        )
        db.add(audit)
    else:
        # Standalone Fused Case
        fused_case = FusedCase(
            id=fused_case_id,
            case_number=fused_case_num,
            title=f"{missing_record.full_name} ({missing_record.age}y) — {missing_record.last_seen_landmark or 'Disaster Area'}",
            status="UNVERIFIED",
            priority="CRITICAL" if missing_record.vulnerability in ["CHILD", "ELDERLY"] else "HIGH",
            vulnerability=missing_record.vulnerability,
            missing_report_id=missing_record.id
        )
        db.add(fused_case)
        db.flush()

        tl1 = TimelineEvent(
            id=uuid.uuid4(),
            fused_case_id=fused_case.id,
            missing_report_id=missing_record.id,
            event_time=last_seen_dt,
            source_type="FAMILY",
            source_name=f"{missing_record.reporter_name} ({missing_record.reporter_relationship})",
            title="Missing Report Logged",
            description="Missing report filed. Searching shelter and hospital records.",
            lat=missing_record.last_seen_lat,
            lng=missing_record.last_seen_lng,
            location_name=missing_record.last_seen_address,
            verified=True
        )
        db.add(tl1)

        nba_data = generate_next_best_action(
            {"id": str(fused_case.id), "status": "UNVERIFIED", "vulnerability": missing_record.vulnerability},
            missing=missing_dict
        )
        nba_rec = NextBestAction(
            id=uuid.uuid4(),
            fused_case_id=fused_case.id,
            priority_score=nba_data["priorityScore"],
            urgency_level=nba_data["urgencyLevel"],
            title=nba_data["title"],
            description=nba_data["description"],
            assigned_role=nba_data["assignedRole"],
            target_facility_or_team=nba_data["targetFacilityOrTeam"],
            contact_phone=nba_data["contactPhone"],
            status="PENDING",
            steps=nba_data["steps"],
            rationale=nba_data["rationale"]
        )
        db.add(nba_rec)

        audit = AuditLog(
            id=uuid.uuid4(),
            actor_name=missing_record.reporter_name,
            actor_role="FAMILY",
            action="MISSING_REPORT_SUBMITTED",
            fused_case_id=fused_case.id,
            details=f"Family submitted missing person report for {missing_record.full_name}. Initiated broadcast search."
        )
        db.add(audit)

    db.commit()

    return format_missing_response(
        missing_record,
        fused_id=str(fused_case_id),
        matched_found_id=str(best_found.id) if best_found else None,
        match_score=best_match["overallScore"] if best_match else None
    )

@router.get("/{id}")
def get_missing_report(id: str, db: Session = Depends(get_db)):
    m = db.query(MissingReport).filter((MissingReport.id == id) | (MissingReport.case_number == id)).first()
    if not m:
        raise HTTPException(status_code=404, detail="Missing report not found")
    fc = db.query(FusedCase).filter(FusedCase.missing_report_id == m.id).first()
    return format_missing_response(
        m,
        fused_id=str(fc.id) if fc else None,
        matched_found_id=str(fc.found_person_id) if fc and fc.found_person_id else None,
        match_score=fc.match_score if fc else None
    )
