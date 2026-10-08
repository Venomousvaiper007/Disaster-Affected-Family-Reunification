import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List

from backend.app.database.session import get_db
from backend.app.database.models import RescueTeam, RescueAssignment, EmergencyReport, AuditLog

router = APIRouter(prefix="/api/rescue", tags=["rescue"])

@router.get("/teams", response_model=List[dict])
def list_rescue_teams(db: Session = Depends(get_db)):
    teams = db.query(RescueTeam).all()
    res = []
    for t in teams:
        res.append({
            "id": str(t.id),
            "teamCode": t.team_code,
            "leadCommander": t.lead_commander,
            "phone": t.phone,
            "membersCount": t.members_count,
            "specialization": t.specialization,
            "currentLocation": {
                "lat": t.current_lat,
                "lng": t.current_lng,
                "address": "Field Base",
                "sector": t.current_sector
            },
            "status": t.status
        })
    return res

@router.get("/teams/{id}")
def get_rescue_team(id: str, db: Session = Depends(get_db)):
    t = db.query(RescueTeam).filter((RescueTeam.id == id) | (RescueTeam.team_code == id)).first()
    if not t:
        raise HTTPException(status_code=404, detail="Rescue team not found")
    return {
        "id": str(t.id),
        "teamCode": t.team_code,
        "leadCommander": t.lead_commander,
        "phone": t.phone,
        "membersCount": t.members_count,
        "specialization": t.specialization,
        "currentLocation": {
            "lat": t.current_lat,
            "lng": t.current_lng,
            "address": "Field Base",
            "sector": t.current_sector
        },
        "status": t.status
    }

@router.get("/teams/{id}/assignments")
def get_rescue_team_assignments(id: str, db: Session = Depends(get_db)):
    t = db.query(RescueTeam).filter((RescueTeam.id == id) | (RescueTeam.team_code == id)).first()
    if not t:
        raise HTTPException(status_code=404, detail="Rescue team not found")
    assignments = db.query(RescueAssignment).filter(RescueAssignment.rescue_team_id == t.id).all()
    res = []
    for a in assignments:
        res.append({
            "id": str(a.id),
            "emergencyReportId": str(a.emergency_report_id),
            "rescueTeamId": str(a.rescue_team_id),
            "status": a.status,
            "fieldNotes": a.field_notes,
            "dispatchedAt": a.dispatched_at.isoformat() if a.dispatched_at else None,
            "completedAt": a.completed_at.isoformat() if a.completed_at else None
        })
    return res

@router.patch("/assignments/{id}/status")
def update_assignment_status(id: str, payload: dict, db: Session = Depends(get_db), x_user_role: str = Header(default="RESCUE_TEAM")):
    a = db.query(RescueAssignment).filter(RescueAssignment.id == id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Assignment not found")

    new_status = payload.get("status")
    field_notes = payload.get("fieldNotes")

    if new_status:
        a.status = new_status
        if new_status == "RESOLVED":
            a.completed_at = datetime.utcnow()
            # update emergency report status as well
            if a.emergency_report:
                a.emergency_report.status = "RESOLVED"
            if a.rescue_team:
                a.rescue_team.status = "STANDBY"

    if field_notes:
        a.field_notes = field_notes

    audit = AuditLog(
        id=uuid.uuid4(),
        actor_name="Field Commander",
        actor_role=x_user_role,
        action=f"RESCUE_ASSIGNMENT_{new_status}",
        details=f"Assignment {a.id} updated to status {new_status}. Field notes: {field_notes}"
    )
    db.add(audit)

    db.commit()
    return {"success": True, "message": f"Assignment updated to {new_status}"}
