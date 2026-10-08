import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List

from backend.app.database.session import get_db
from backend.app.database.models import Evidence, FusedCase, AuditLog
from backend.app.schemas.evidence import EvidenceCreate, EvidenceResponse
from backend.app.services.evidence import calculate_evidence_reliability

router = APIRouter(prefix="/api/evidence", tags=["evidence"])

@router.post("", response_model=dict)
def create_evidence(data: EvidenceCreate, db: Session = Depends(get_db), x_user_role: str = Header(default="RESPONDER")):
    c = db.query(FusedCase).filter((FusedCase.id == data.fusedCaseId) | (FusedCase.case_number == data.fusedCaseId)).first()
    if not c:
        raise HTTPException(status_code=404, detail="Associated fused case not found")

    reliability = data.reliabilityScore or calculate_evidence_reliability(data.sourceType)

    evidence_item = Evidence(
        id=uuid.uuid4(),
        fused_case_id=c.id,
        timeline_event_id=uuid.UUID(data.timelineEventId) if data.timelineEventId else None,
        evidence_type=data.evidenceType,
        source_type=data.sourceType,
        source_name=data.sourceName,
        value_description=data.valueDescription,
        reliability_score=reliability,
        verification_status="UNVERIFIED"
    )
    db.add(evidence_item)

    audit = AuditLog(
        id=uuid.uuid4(),
        actor_name=data.sourceName,
        actor_role=x_user_role,
        action="EVIDENCE_SUBMITTED",
        fused_case_id=c.id,
        details=f"Submitted {data.evidenceType} evidence ({data.valueDescription}) from {data.sourceType} with reliability {reliability}."
    )
    db.add(audit)

    db.commit()
    return {
        "id": str(evidence_item.id),
        "fusedCaseId": str(c.id),
        "evidenceType": evidence_item.evidence_type,
        "sourceType": evidence_item.source_type,
        "sourceName": evidence_item.source_name,
        "valueDescription": evidence_item.value_description,
        "reliabilityScore": evidence_item.reliability_score,
        "verificationStatus": evidence_item.verification_status,
        "createdAt": evidence_item.created_at.isoformat()
    }
