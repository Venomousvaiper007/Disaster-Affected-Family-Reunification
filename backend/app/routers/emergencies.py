import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.app.database.session import get_db
from backend.app.database.models import EmergencyReport, RescueAssignment, RescueTeam, AuditLog
from backend.app.schemas.emergency import EmergencyReportCreate, EmergencyReportResponse
from backend.app.schemas.rescue import RescueAssignmentCreate

router = APIRouter(prefix="/api/emergencies", tags=["emergencies"])

def format_emergency_response(e: EmergencyReport) -> dict:
    return {
        "id": str(e.id),
        "emergencyCode": e.emergency_code,
        "reporterName": e.reporter_name,
        "reporterContact": e.reporter_contact,
        "locationAddress": e.location_address,
        "lat": e.lat,
        "lng": e.lng,
        "sector": e.sector,
        "peopleTrappedCount": e.people_trapped_count,
        "criticallyInjuredCount": e.critically_injured_count,
        "hasUnverifiedFatality": e.has_unverified_fatality,
        "fatalityStatus": e.fatality_status,
        "description": e.description,
        "photoUrl": e.photo_url,
        "priority": e.priority,
        "status": e.status,
        "createdAt": e.created_at.isoformat() if e.created_at else datetime.utcnow().isoformat(),
        "updatedAt": e.updated_at.isoformat() if e.updated_at else datetime.utcnow().isoformat()
    }

@router.get("", response_model=List[dict])
def list_emergencies(db: Session = Depends(get_db)):
    reports = db.query(EmergencyReport).order_by(EmergencyReport.created_at.desc()).all()
    return [format_emergency_response(e) for e in reports]

@router.post("", response_model=dict)
def create_emergency_report(data: EmergencyReportCreate, db: Session = Depends(get_db), x_user_role: str = Header(default="CITIZEN")):
    random_suffix = uuid.uuid4().hex[:4].upper()
    code = f"ER-{random_suffix}"


    # Citizen fatality safety rule
    fatality_status = "NONE"
    if data.hasUnverifiedFatality:
        fatality_status = "POSSIBLE FATALITY — UNVERIFIED"

    priority = "CRITICAL" if (data.criticallyInjuredCount > 0 or data.peopleTrappedCount >= 3 or data.hasUnverifiedFatality) else "HIGH"

    role_str = x_user_role if isinstance(x_user_role, str) else "CITIZEN"

    emergency = EmergencyReport(
        id=uuid.uuid4(),
        emergency_code=code,
        reporter_name=data.reporterName,
        reporter_contact=data.reporterContact,
        location_address=data.locationAddress,
        lat=data.lat,
        lng=data.lng,
        sector=data.sector or "Sector Delta-1",
        people_trapped_count=data.peopleTrappedCount,
        critically_injured_count=data.criticallyInjuredCount,
        has_unverified_fatality=data.hasUnverifiedFatality,
        fatality_status=fatality_status,
        description=data.description,
        photo_url=data.photoUrl,
        priority=priority,
        status="REPORTED"
    )
    db.add(emergency)

    audit = AuditLog(
        id=uuid.uuid4(),
        actor_name=data.reporterName,
        actor_role=role_str,
        action="EMERGENCY_REPORT_SUBMITTED",
        details=f"Submitted emergency report {code} at {data.locationAddress}. Trapped: {data.peopleTrappedCount}, Critical: {data.criticallyInjuredCount}."
    )

    db.add(audit)

    db.commit()
    return format_emergency_response(emergency)

@router.get("/{id}")
def get_emergency(id: str, db: Session = Depends(get_db)):
    e = db.query(EmergencyReport).filter((EmergencyReport.id == id) | (EmergencyReport.emergency_code == id)).first()
    if not e:
        raise HTTPException(status_code=404, detail="Emergency report not found")
    return format_emergency_response(e)

@router.patch("/{id}/status")
def update_emergency_status(id: str, payload: dict, db: Session = Depends(get_db), x_user_role: str = Header(default="RESPONDER")):
    e = db.query(EmergencyReport).filter((EmergencyReport.id == id) | (EmergencyReport.emergency_code == id)).first()
    if not e:
        raise HTTPException(status_code=404, detail="Emergency report not found")
    
    new_status = payload.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Missing status field")

    e.status = new_status
    e.updated_at = datetime.utcnow()

    role_str = x_user_role if isinstance(x_user_role, str) else "RESPONDER"
    # If authorized responder updates fatality status
    if "fatalityStatus" in payload:
        if role_str in ["RESPONDER", "RESCUE_TEAM", "ADMIN"]:
            e.fatality_status = payload["fatalityStatus"]
        else:
            raise HTTPException(status_code=403, detail="Only authorized personnel can verify fatality status")

    audit = AuditLog(
        id=uuid.uuid4(),
        actor_name="Authorized Officer",
        actor_role=role_str,
        action=f"EMERGENCY_STATUS_{new_status}",
        details=f"Emergency {e.emergency_code} status updated to {new_status}."
    )
    db.add(audit)
    db.commit()
    return format_emergency_response(e)

@router.post("/{id}/assign")
def assign_rescue_team(id: str, data: RescueAssignmentCreate, db: Session = Depends(get_db), x_user_role: str = Header(default="RESPONDER")):
    e = db.query(EmergencyReport).filter((EmergencyReport.id == id) | (EmergencyReport.emergency_code == id)).first()
    if not e:
        raise HTTPException(status_code=404, detail="Emergency report not found")

    team = db.query(RescueTeam).filter((RescueTeam.id == data.rescueTeamId) | (RescueTeam.team_code == data.rescueTeamId)).first()
    if not team:
        raise HTTPException(status_code=404, detail="Rescue team not found")

    assignment = RescueAssignment(
        id=uuid.uuid4(),
        emergency_report_id=e.id,
        rescue_team_id=team.id,
        field_notes=data.fieldNotes,
        status="ASSIGNED",
        dispatched_at=datetime.utcnow()
    )
    db.add(assignment)

    e.status = "ASSIGNED"
    team.status = "ACTIVE_MISSION"

    role_str = x_user_role if isinstance(x_user_role, str) else "RESPONDER"
    audit = AuditLog(
        id=uuid.uuid4(),
        actor_name="Command Dispatcher",
        actor_role=role_str,
        action="RESCUE_TEAM_ASSIGNED",
        details=f"Assigned rescue team {team.team_code} to emergency {e.emergency_code}."
    )
    db.add(audit)


    db.commit()
    return {
        "success": True,
        "message": f"Assigned {team.team_code} to {e.emergency_code}",
        "assignmentId": str(assignment.id)
    }
