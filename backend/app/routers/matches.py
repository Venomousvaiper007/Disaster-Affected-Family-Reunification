import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List

from backend.app.database.session import get_db
from backend.app.database.models import CandidateMatch, FusedCase, TimelineEvent, AuditLog
from backend.app.schemas.match import MatchVerificationRequest

router = APIRouter(prefix="/api/matches", tags=["matches"])

@router.get("", response_model=List[dict])
def list_candidate_matches(db: Session = Depends(get_db)):
    matches = db.query(CandidateMatch).order_by(CandidateMatch.overall_score.desc()).all()
    res = []
    for m in matches:
        res.append({
            "id": str(m.id),
            "missingReportId": str(m.missing_report_id),
            "foundPersonId": str(m.found_person_id),
            "overallScore": m.overall_score,
            "confidenceLabel": m.confidence_label,
            "nameScore": m.name_score,
            "ageScore": m.age_score,
            "genderScore": m.gender_score,
            "physicalScore": m.physical_score,
            "clothingScore": m.clothing_score,
            "locationScore": m.location_score,
            "timelineScore": m.timeline_score,
            "supportingEvidence": m.supporting_evidence or [],
            "conflictingEvidence": m.conflicting_evidence or [],
            "missingInformation": m.missing_information or [],
            "timelineConsistency": m.timeline_consistency,
            "recommendedVerification": m.recommended_verification or [],
            "createdAt": m.created_at.isoformat() if m.created_at else datetime.utcnow().isoformat()
        })
    return res

@router.get("/{id}")
def get_candidate_match(id: str, db: Session = Depends(get_db)):
    m = db.query(CandidateMatch).filter(CandidateMatch.id == id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Candidate match not found")
    return {
        "id": str(m.id),
        "missingReportId": str(m.missing_report_id),
        "foundPersonId": str(m.found_person_id),
        "overallScore": m.overall_score,
        "confidenceLabel": m.confidence_label,
        "supportingEvidence": m.supporting_evidence or [],
        "conflictingEvidence": m.conflicting_evidence or [],
        "missingInformation": m.missing_information or [],
        "recommendedVerification": m.recommended_verification or []
    }

@router.post("/{id}/verify")
def verify_candidate_match(id: str, payload: MatchVerificationRequest, db: Session = Depends(get_db), x_user_role: str = Header(default="ADMIN")):
    m = db.query(CandidateMatch).filter(CandidateMatch.id == id).first()
    fused_case = None
    if m:
        fused_case = db.query(FusedCase).filter(
            FusedCase.missing_report_id == m.missing_report_id,
            FusedCase.found_person_id == m.found_person_id
        ).first()

    if not fused_case:
        fused_case = db.query(FusedCase).filter((FusedCase.id == id) | (FusedCase.case_number == id)).first()

    if not fused_case:
        raise HTTPException(status_code=404, detail="Associated case/match not found")

    fused_case.status = "VERIFIED"
    fused_case.verified_at = datetime.utcnow()
    fused_case.verified_by = payload.verifiedBy
    fused_case.verified_by_role = x_user_role
    fused_case.verification_method = payload.verificationMethod
    fused_case.verification_notes = payload.notes
    fused_case.biometric_confirmed = True
    fused_case.updated_at = datetime.utcnow()

    if fused_case.missing_report: fused_case.missing_report.status = "VERIFIED"
    if fused_case.found_person: fused_case.found_person.status = "VERIFIED"

    tl = TimelineEvent(
        id=uuid.uuid4(),
        fused_case_id=fused_case.id,
        event_time=datetime.utcnow(),
        source_type="AUTHORITY",
        source_name=payload.verifiedBy,
        title="Official Identification Verified",
        description=f"Identification verified via {payload.verificationMethod}. Notes: '{payload.notes}'. Ready for family notification.",
        verified=True
    )
    db.add(tl)

    audit = AuditLog(
        id=uuid.uuid4(),
        actor_name=payload.verifiedBy,
        actor_role=x_user_role,
        action="OFFICIAL_MATCH_VERIFIED",
        fused_case_id=fused_case.id,
        details=f"Authorized identity confirmation completed via {payload.verificationMethod}. Notes: {payload.notes}"
    )
    db.add(audit)

    db.commit()
    return {"success": True, "message": "Match verified successfully", "caseId": str(fused_case.id)}

@router.post("/{id}/reject")
def reject_candidate_match(id: str, db: Session = Depends(get_db), x_user_role: str = Header(default="ADMIN")):
    m = db.query(CandidateMatch).filter(CandidateMatch.id == id).first()
    if m:
        db.delete(m)
        db.commit()
    return {"success": True, "message": "Match rejected"}
