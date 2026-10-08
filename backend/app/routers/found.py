import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.app.database.session import get_db
from backend.app.database.models import (
    FoundPerson, MissingReport, FusedCase, CandidateMatch, TimelineEvent, NextBestAction, AuditLog
)
from backend.app.schemas.found import FoundPersonCreate, FoundPersonResponse
from backend.app.services.matching import evaluate_candidate_match
from backend.app.services.nba import generate_next_best_action

router = APIRouter(prefix="/api/found", tags=["found"])

def format_found_response(f: FoundPerson, fused_id: Optional[str] = None, matched_missing_id: Optional[str] = None, match_score: Optional[int] = None) -> dict:
    return {
        "id": str(f.id),
        "caseNumber": f.case_number,
        "reportedAt": f.created_at.isoformat() if f.created_at else datetime.utcnow().isoformat(),
        "reportedByRole": f.reported_by_role,
        "reportedByName": f.reported_by_name,
        "contactPhone": f.contact_phone,
        "isIdentified": f.is_identified,
        "givenName": f.given_name,
        "estimatedAgeMin": f.estimated_age_min,
        "estimatedAgeMax": f.estimated_age_max,
        "gender": f.gender,
        "vulnerability": f.vulnerability,
        "medicalCondition": f.medical_condition,
        "isConscious": f.is_conscious,
        "traits": {
            "approxAgeMin": f.estimated_age_min,
            "approxAgeMax": f.estimated_age_max,
            "gender": f.gender,
            "heightCm": f.height_cm,
            "build": f.build,
            "distinguishingMarks": f.distinguishing_marks or [],
            "clothingUpper": f.clothing_upper,
            "clothingLower": f.clothing_lower,
            "footwear": f.footwear,
            "accessories": f.accessories or [],
            "languagesSpoken": f.languages_spoken or [],
            "medicalConditionNotes": f.medical_condition_notes,
            "isConscious": f.is_conscious
        },
        "foundLocation": {
            "lat": f.found_lat,
            "lng": f.found_lng,
            "address": f.found_address,
            "landmark": f.found_landmark,
            "sector": f.found_sector
        },
        "foundTime": f.found_time.isoformat() if f.found_time else datetime.utcnow().isoformat(),
        "currentFacilityType": f.current_facility_type,
        "currentFacilityName": f.current_facility_name,
        "currentFacilityId": str(f.current_facility_id) if f.current_facility_id else None,
        "wardOrBed": f.ward_or_bed,
        "photoUrl": f.photo_url,
        "notes": f.notes,
        "status": f.status,
        "fusedCaseId": fused_id,
        "matchedMissingId": matched_missing_id,
        "matchScore": match_score
    }

@router.get("", response_model=List[dict])
def list_found_records(db: Session = Depends(get_db)):
    records = db.query(FoundPerson).order_by(FoundPerson.created_at.desc()).all()
    res = []
    for f in records:
        fc = db.query(FusedCase).filter(FusedCase.found_person_id == f.id).first()
        fused_id = str(fc.id) if fc else None
        matched_missing_id = str(fc.missing_report_id) if fc and fc.missing_report_id else None
        match_score = fc.match_score if fc else None
        res.append(format_found_response(f, fused_id, matched_missing_id, match_score))
    return res

@router.post("", response_model=dict)
def create_found_record(data: FoundPersonCreate, db: Session = Depends(get_db), x_user_role: str = Header(default="RESPONDER")):
    count = db.query(FoundPerson).count()
    case_number = f"#F{str(count + 95).zfill(3)}"

    try:
        found_dt = datetime.fromisoformat(data.foundTime.replace("Z", "+00:00"))
    except Exception:
        found_dt = datetime.utcnow()

    found_record = FoundPerson(
        id=uuid.uuid4(),
        case_number=case_number,
        reported_by_role=data.reportedByRole,
        reported_by_name=data.reportedByName,
        contact_phone=data.contactPhone,
        is_identified=data.isIdentified,
        given_name=data.givenName,
        estimated_age_min=data.estimatedAgeMin,
        estimated_age_max=data.estimatedAgeMax,
        gender=data.gender,
        vulnerability=data.vulnerability,
        medical_condition=data.medicalCondition,
        is_conscious=data.isConscious,
        height_cm=data.traits.heightCm,
        build=data.traits.build,
        distinguishing_marks=data.traits.distinguishingMarks or [],
        clothing_upper=data.traits.clothingUpper,
        clothing_lower=data.traits.clothingLower,
        footwear=data.traits.footwear,
        accessories=data.traits.accessories or [],
        languages_spoken=data.traits.languagesSpoken or [],
        medical_condition_notes=data.traits.medicalConditionNotes,
        found_address=data.foundLocation.address,
        found_landmark=data.foundLocation.landmark,
        found_sector=data.foundLocation.sector,
        found_lat=data.foundLocation.lat,
        found_lng=data.foundLocation.lng,
        found_time=found_dt,
        current_facility_type=data.currentFacilityType,
        current_facility_name=data.currentFacilityName,
        ward_or_bed=data.wardOrBed,
        photo_url=data.photoUrl,
        notes=data.notes,
        status="UNVERIFIED"
    )
    db.add(found_record)
    db.flush()

    # Match against missing reports
    active_missing = db.query(MissingReport).filter(MissingReport.status.notin_(["REUNITED", "CLOSED"])).all()
    best_match = None
    best_missing = None

    found_dict = format_found_response(found_record)
    for missing in active_missing:
        missing_dict = {
            "id": str(missing.id),
            "caseNumber": missing.case_number,
            "fullName": missing.full_name,
            "age": missing.age,
            "gender": missing.gender,
            "vulnerability": missing.vulnerability,
            "traits": {
                "heightCm": missing.height_cm,
                "distinguishingMarks": missing.distinguishing_marks or [],
                "clothingUpper": missing.clothing_upper,
                "clothingLower": missing.clothing_lower
            },
            "lastSeenLocation": {"lat": missing.last_seen_lat, "lng": missing.last_seen_lng, "address": missing.last_seen_address},
            "lastSeenTime": missing.last_seen_time.isoformat() if missing.last_seen_time else datetime.utcnow().isoformat()
        }
        eval_res = evaluate_candidate_match(missing_dict, found_dict)
        if eval_res["overallScore"] >= 50 and (best_match is None or eval_res["overallScore"] > best_match["overallScore"]):
            best_match = eval_res
            best_missing = missing

    fused_case_id = uuid.uuid4()
    if best_match and best_missing:
        found_record.status = "POSSIBLE_MATCH"
        best_missing.status = "POSSIBLE_MATCH"

        existing_fused = db.query(FusedCase).filter(FusedCase.missing_report_id == best_missing.id).first()
        if existing_fused:
            fused_case_id = existing_fused.id
            existing_fused.found_person_id = found_record.id
            existing_fused.status = "POSSIBLE_MATCH"
            existing_fused.match_score = best_match["overallScore"]
            existing_fused.confidence_label = best_match["confidenceLabel"]
            existing_fused.score_breakdown = best_match
            existing_fused.supporting_evidence = best_match["supportingEvidence"]
            existing_fused.conflicting_evidence = best_match["conflictingEvidence"]
            existing_fused.missing_information = best_match["missingInformation"]
            existing_fused.timeline_consistency = best_match["timelineConsistency"]
            existing_fused.recommended_verification = best_match["recommendedVerification"]
            
            tl = TimelineEvent(
                id=uuid.uuid4(),
                fused_case_id=existing_fused.id,
                found_person_id=found_record.id,
                event_time=found_dt,
                source_type=data.reportedByRole,
                source_name=data.reportedByName,
                title="Rescued Intake Registered",
                description=f"Individual arrived at {data.currentFacilityName}. Correlated with family report.",
                lat=data.foundLocation.lat,
                lng=data.foundLocation.lng,
                location_name=data.foundLocation.address,
                verified=True
            )
            db.add(tl)
        else:
            fused_case = FusedCase(
                id=fused_case_id,
                case_number=case_number,
                title=f"Intake {case_number} ({data.currentFacilityName}) & {best_missing.full_name}",
                status="POSSIBLE_MATCH",
                priority="HIGH",
                vulnerability=found_record.vulnerability,
                missing_report_id=best_missing.id,
                found_person_id=found_record.id,
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

            tl = TimelineEvent(
                id=uuid.uuid4(),
                fused_case_id=fused_case_id,
                found_person_id=found_record.id,
                event_time=found_dt,
                source_type=data.reportedByRole,
                source_name=data.reportedByName,
                title="Rescued Intake Logged",
                description=f"Found at {data.foundLocation.address}. Admitted to {data.currentFacilityName}.",
                lat=data.foundLocation.lat,
                lng=data.foundLocation.lng,
                location_name=data.foundLocation.address,
                verified=True
            )
            db.add(tl)

        cand_match = CandidateMatch(
            id=uuid.uuid4(),
            missing_report_id=best_missing.id,
            found_person_id=found_record.id,
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

        audit = AuditLog(
            id=uuid.uuid4(),
            actor_name=data.reportedByName,
            actor_role="ORGANIZATION",
            action="FOUND_INTAKE_CORRELATED",
            fused_case_id=fused_case_id,
            details=f"Logged intake {case_number}. Live fusion linked with Missing Case {best_missing.case_number} with {best_match['overallScore']}% score."
        )
        db.add(audit)
    else:
        audit = AuditLog(
            id=uuid.uuid4(),
            actor_name=data.reportedByName,
            actor_role="ORGANIZATION",
            action="UNIDENTIFIED_INTAKE_LOGGED",
            fused_case_id=None,
            details=f"Unidentified person logged at {data.currentFacilityName}. Standby for fusion matching."
        )
        db.add(audit)

    db.commit()

    return format_found_response(
        found_record,
        fused_id=str(fused_case_id),
        matched_missing_id=str(best_missing.id) if best_missing else None,
        match_score=best_match["overallScore"] if best_match else None
    )

@router.get("/{id}")
def get_found_record(id: str, db: Session = Depends(get_db)):
    f = db.query(FoundPerson).filter((FoundPerson.id == id) | (FoundPerson.case_number == id)).first()
    if not f:
        raise HTTPException(status_code=404, detail="Found record not found")
    fc = db.query(FusedCase).filter(FusedCase.found_person_id == f.id).first()
    return format_found_response(
        f,
        fused_id=str(fc.id) if fc else None,
        matched_missing_id=str(fc.missing_report_id) if fc and fc.missing_report_id else None,
        match_score=fc.match_score if fc else None
    )
