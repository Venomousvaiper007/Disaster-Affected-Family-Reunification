import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.app.database.session import get_db
from backend.app.database.models import (
    FusedCase, MissingReport, FoundPerson, CandidateMatch, TimelineEvent, NextBestAction, Evidence, CaseConflict, AuditLog
)
from backend.app.schemas.case import FusedCaseResponse
from backend.app.routers.missing import format_missing_response
from backend.app.routers.found import format_found_response
from backend.app.services.reunification import validate_status_transition, get_safe_family_case_view
from backend.app.services.nba import generate_next_best_action

router = APIRouter(prefix="/api/cases", tags=["cases"])

def format_fused_case_response(c: FusedCase, db: Session, x_user_role: str = "ADMIN") -> dict:
    missing_dict = None
    if c.missing_report:
        missing_dict = format_missing_response(c.missing_report, str(c.id), str(c.found_person_id) if c.found_person_id else None, c.match_score)
    elif c.missing_report_id:
        m = db.query(MissingReport).filter(MissingReport.id == c.missing_report_id).first()
        if m: missing_dict = format_missing_response(m, str(c.id), str(c.found_person_id) if c.found_person_id else None, c.match_score)

    found_dict = None
    if c.found_person:
        found_dict = format_found_response(c.found_person, str(c.id), str(c.missing_report_id) if c.missing_report_id else None, c.match_score)
    elif c.found_person_id:
        f = db.query(FoundPerson).filter(FoundPerson.id == c.found_person_id).first()
        if f: found_dict = format_found_response(f, str(c.id), str(c.missing_report_id) if c.missing_report_id else None, c.match_score)

    cand_match_dict = c.score_breakdown or None

    timeline_res = []
    for tl in c.timeline_events:
        timeline_res.append({
            "id": str(tl.id),
            "caseId": str(c.id),
            "timestamp": tl.event_time.isoformat() if tl.event_time else datetime.utcnow().isoformat(),
            "sourceType": tl.source_type,
            "sourceName": tl.source_name,
            "title": tl.title,
            "description": tl.description,
            "location": {
                "lat": tl.lat or 13.0827,
                "lng": tl.lng or 80.2707,
                "address": tl.location_name or "Command Location"
            },
            "verified": tl.verified,
            "evidencePhotoUrl": tl.evidence_photo_url
        })

    nba_res = []
    for nba in c.next_best_actions:
        nba_res.append({
            "id": str(nba.id),
            "caseId": str(c.id),
            "priorityScore": nba.priority_score,
            "urgencyLevel": nba.urgency_level,
            "title": nba.title,
            "description": nba.description,
            "assignedRole": nba.assigned_role,
            "targetFacilityOrTeam": nba.target_facility_or_team,
            "contactPhone": nba.contact_phone,
            "status": nba.status,
            "steps": nba.steps or [],
            "rationale": nba.rationale,
            "createdAt": nba.created_at.isoformat() if nba.created_at else datetime.utcnow().isoformat(),
            "updatedAt": nba.updated_at.isoformat() if nba.updated_at else datetime.utcnow().isoformat()
        })

    verif_details = None
    if c.verified_at:
        verif_details = {
            "verifiedAt": c.verified_at.isoformat(),
            "verifiedBy": c.verified_by or "Authorized Officer",
            "verifiedByRole": c.verified_by_role or "command_authority",
            "verificationMethod": c.verification_method or "Biometric & Photographic Cross-check",
            "notes": c.verification_notes or "",
            "biometricOrPhotoConfirmed": c.biometric_confirmed
        }

    reunif_details = None
    if c.reunited_at:
        reunif_details = {
            "reunitedAt": c.reunited_at.isoformat(),
            "location": c.reunification_location or "Relief Station",
            "facilitatedBy": c.facilitated_by or "Officer Lead",
            "familyReceivedName": c.family_received_name or "Verified Family Member",
            "signatureRecorded": True,
            "notes": c.reunification_notes or ""
        }

    raw_response = {
        "id": str(c.id),
        "caseNumber": c.case_number,
        "title": c.title,
        "status": c.status,
        "priority": c.priority,
        "vulnerability": c.vulnerability,
        "createdAt": c.created_at.isoformat() if c.created_at else datetime.utcnow().isoformat(),
        "updatedAt": c.updated_at.isoformat() if c.updated_at else datetime.utcnow().isoformat(),
        "missingReport": missing_dict,
        "foundRecord": found_dict,
        "candidateMatch": cand_match_dict,
        "nextBestActions": nba_res,
        "timeline": timeline_res,
        "verificationDetails": verif_details,
        "reunificationDetails": reunif_details
    }

    # If role is FAMILY/public_family, apply safe filtering to prevent unverified leaks
    if x_user_role in ["FAMILY", "public_family"]:
        safe_view = get_safe_family_case_view(raw_response)
        raw_response["safeView"] = safe_view

    return raw_response

@router.get("", response_model=List[dict])
def list_cases(db: Session = Depends(get_db), x_user_role: str = Header(default="ADMIN")):
    cases = db.query(FusedCase).order_by(FusedCase.created_at.desc()).all()
    return [format_fused_case_response(c, db, x_user_role) for c in cases]

def find_fused_case(identifier: str, db: Session) -> Optional[FusedCase]:
    clean = identifier.strip()
    try:
        u_obj = uuid.UUID(clean)
        c = db.query(FusedCase).filter(FusedCase.id == u_obj).first()
        if c: return c
    except ValueError:
        pass

    clean_hash = f"#{clean.replace('#', '')}"
    return db.query(FusedCase).filter(
        (FusedCase.case_number == clean) | 
        (FusedCase.case_number == clean_hash)
    ).first()

@router.get("/{id}")
def get_case(id: str, db: Session = Depends(get_db), x_user_role: str = Header(default="ADMIN")):
    c = find_fused_case(id, db)
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    return format_fused_case_response(c, db, x_user_role)


@router.get("/{id}/timeline")
def get_case_timeline(id: str, db: Session = Depends(get_db)):
    c = db.query(FusedCase).filter((FusedCase.id == id) | (FusedCase.case_number == id)).first()
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    res = []
    for tl in c.timeline_events:
        res.append({
            "id": str(tl.id),
            "caseId": str(c.id),
            "timestamp": tl.event_time.isoformat() if tl.event_time else datetime.utcnow().isoformat(),
            "sourceType": tl.source_type,
            "sourceName": tl.source_name,
            "title": tl.title,
            "description": tl.description,
            "location": {"lat": tl.lat or 13.0827, "lng": tl.lng or 80.2707, "address": tl.location_name or ""},
            "verified": tl.verified
        })
    return res

@router.get("/{id}/matches")
def get_case_matches(id: str, db: Session = Depends(get_db)):
    c = db.query(FusedCase).filter((FusedCase.id == id) | (FusedCase.case_number == id)).first()
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    if not c.missing_report_id or not c.found_person_id:
        return []
    match = db.query(CandidateMatch).filter(
        CandidateMatch.missing_report_id == c.missing_report_id,
        CandidateMatch.found_person_id == c.found_person_id
    ).first()
    if not match:
        return [c.score_breakdown] if c.score_breakdown else []
    return [{
        "id": str(match.id),
        "missingReportId": str(match.missing_report_id),
        "foundPersonId": str(match.found_person_id),
        "overallScore": match.overall_score,
        "confidenceLabel": match.confidence_label,
        "supportingEvidence": match.supporting_evidence or [],
        "conflictingEvidence": match.conflicting_evidence or [],
        "missingInformation": match.missing_information or [],
        "recommendedVerification": match.recommended_verification or []
    }]

@router.get("/{id}/evidence")
def get_case_evidence(id: str, db: Session = Depends(get_db)):
    c = db.query(FusedCase).filter((FusedCase.id == id) | (FusedCase.case_number == id)).first()
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    ev_list = db.query(Evidence).filter(Evidence.fused_case_id == c.id).all()
    res = []
    for ev in ev_list:
        res.append({
            "id": str(ev.id),
            "fusedCaseId": str(ev.fused_case_id),
            "evidenceType": ev.evidence_type,
            "sourceType": ev.source_type,
            "sourceName": ev.source_name,
            "valueDescription": ev.value_description,
            "reliabilityScore": ev.reliability_score,
            "verificationStatus": ev.verification_status,
            "createdAt": ev.created_at.isoformat()
        })
    return res

@router.get("/{id}/actions")
def get_case_actions(id: str, db: Session = Depends(get_db)):
    c = db.query(FusedCase).filter((FusedCase.id == id) | (FusedCase.case_number == id)).first()
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    res = []
    for nba in c.next_best_actions:
        res.append({
            "id": str(nba.id),
            "caseId": str(c.id),
            "priorityScore": nba.priority_score,
            "urgencyLevel": nba.urgency_level,
            "title": nba.title,
            "description": nba.description,
            "assignedRole": nba.assigned_role,
            "targetFacilityOrTeam": nba.target_facility_or_team,
            "contactPhone": nba.contact_phone,
            "status": nba.status,
            "steps": nba.steps or [],
            "rationale": nba.rationale
        })
    return res

@router.get("/{id}/conflicts")
def get_case_conflicts(id: str, db: Session = Depends(get_db)):
    c = db.query(FusedCase).filter((FusedCase.id == id) | (FusedCase.case_number == id)).first()
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    conflicts = db.query(CaseConflict).filter(CaseConflict.fused_case_id == c.id).all()
    res = []
    for conf in conflicts:
        res.append({
            "id": str(conf.id),
            "fusedCaseId": str(c.id),
            "title": conf.title,
            "description": conf.description,
            "severity": conf.severity,
            "status": conf.status,
            "resolutionNotes": conf.resolution_notes,
            "resolvedBy": conf.resolved_by
        })
    return res

@router.patch("/{id}/status")
def update_case_status(id: str, payload: dict, db: Session = Depends(get_db), x_user_role: str = Header(default="ADMIN")):
    c = find_fused_case(id, db)
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")

    new_status = payload.get("newStatus") or payload.get("status")
    notes = payload.get("notes", "")

    role_str = x_user_role if isinstance(x_user_role, str) else "ADMIN"
    validation = validate_status_transition(c.status, new_status, role_str)
    if not validation["allowed"]:
        raise HTTPException(status_code=400, detail=validation.get("reason", "Transition not allowed"))

    c.status = new_status
    c.updated_at = datetime.utcnow()

    if c.missing_report:
        c.missing_report.status = new_status
    if c.found_person:
        c.found_person.status = new_status

    # Add Timeline event
    tl = TimelineEvent(
        id=uuid.uuid4(),
        fused_case_id=c.id,
        event_time=datetime.utcnow(),
        source_type="AUTHORITY" if role_str in ["ADMIN", "command_authority"] else "HOSPITAL",
        source_name="Incident Commander" if role_str in ["ADMIN", "command_authority"] else "Authorized Officer",
        title=f"Status updated to {new_status.replace('_', ' ')}",
        description=notes or "Case progressed along verified reunification loop.",
        verified=True
    )
    db.add(tl)

    audit = AuditLog(
        id=uuid.uuid4(),
        actor_name="Authorized Officer",
        actor_role=role_str,
        action=f"STATUS_TRANSITION_{new_status}",
        fused_case_id=c.id,
        details=f"Case {c.case_number} transitioned to {new_status}. {notes}"
    )
    db.add(audit)

    db.commit()
    return {"success": True, "message": f"Case updated to {new_status}", "case": format_fused_case_response(c, db, role_str)}

@router.post("/{id}/reunite")
def confirm_official_reunification(id: str, payload: dict, db: Session = Depends(get_db), x_user_role: str = Header(default="ADMIN")):
    c = find_fused_case(id, db)
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")

    role_str = x_user_role if isinstance(x_user_role, str) else "ADMIN"
    facilitator = payload.get("facilitator", "Lead Rescue Officer")
    receiver_name = payload.get("receiverName", "Family Member")
    notes = payload.get("notes", "")

    c.status = "REUNITED"
    c.reunited_at = datetime.utcnow()
    c.reunification_location = c.found_person.current_facility_name if c.found_person else "Designated Reunification Point"
    c.facilitated_by = facilitator
    c.family_received_name = receiver_name
    c.reunification_notes = notes
    c.updated_at = datetime.utcnow()

    if c.missing_report: c.missing_report.status = "REUNITED"
    if c.found_person: c.found_person.status = "REUNITED"

    tl = TimelineEvent(
        id=uuid.uuid4(),
        fused_case_id=c.id,
        event_time=datetime.utcnow(),
        source_type="AUTHORITY",
        source_name=facilitator,
        title="Family Safely Reunited",
        description=f"Physical handover completed to {receiver_name}. Handover verified by {facilitator}.",
        verified=True
    )
    db.add(tl)

    audit = AuditLog(
        id=uuid.uuid4(),
        actor_name=facilitator,
        actor_role=role_str,
        action="OFFICIAL_REUNIFICATION_COMPLETED",
        fused_case_id=c.id,
        details=f"Handover to {receiver_name} completed. Case marked REUNITED."
    )
    db.add(audit)

    db.commit()
    return {"success": True, "message": "Official reunification confirmed", "case": format_fused_case_response(c, db, role_str)}

