import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List

from backend.app.database.session import get_db
from backend.app.database.models import CaseConflict, AuditLog

router = APIRouter(prefix="/api/conflicts", tags=["conflicts"])

@router.get("", response_model=List[dict])
def list_case_conflicts(db: Session = Depends(get_db)):
    conflicts = db.query(CaseConflict).order_by(CaseConflict.created_at.desc()).all()
    res = []
    for conf in conflicts:
        res.append({
            "id": str(conf.id),
            "fusedCaseId": str(conf.fused_case_id),
            "title": conf.title,
            "description": conf.description,
            "severity": conf.severity,
            "status": conf.status,
            "resolutionNotes": conf.resolution_notes,
            "resolvedBy": conf.resolved_by,
            "resolvedAt": conf.resolved_at.isoformat() if conf.resolved_at else None,
            "createdAt": conf.created_at.isoformat() if conf.created_at else datetime.utcnow().isoformat()
        })
    return res

@router.post("/{id}/resolve")
def resolve_case_conflict(id: str, payload: dict, db: Session = Depends(get_db), x_user_role: str = Header(default="ADMIN")):
    conf = db.query(CaseConflict).filter(CaseConflict.id == id).first()
    if not conf:
        raise HTTPException(status_code=404, detail="Conflict record not found")

    resolved_by = payload.get("resolvedBy", "Authorized Inspector")
    notes = payload.get("notes", "Conflict reviewed and reconciled")

    conf.status = "RESOLVED"
    conf.resolution_notes = notes
    conf.resolved_by = resolved_by
    conf.resolved_at = datetime.utcnow()

    audit = AuditLog(
        id=uuid.uuid4(),
        actor_name=resolved_by,
        actor_role=x_user_role,
        action="CASE_CONFLICT_RESOLVED",
        fused_case_id=conf.fused_case_id,
        details=f"Conflict '{conf.title}' resolved by {resolved_by}. Notes: {notes}"
    )
    db.add(audit)

    db.commit()
    return {"success": True, "message": "Conflict resolved"}
