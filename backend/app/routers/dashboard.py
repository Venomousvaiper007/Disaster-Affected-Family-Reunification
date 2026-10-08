from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.database.models import FusedCase, MissingReport, FoundPerson, Facility, RescueTeam, AuditLog

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/{role}")
def get_dashboard_data(role: str, db: Session = Depends(get_db)):
    cases = db.query(FusedCase).all()
    total_active = len([c for c in cases if c.status != "CLOSED"])
    high_priority = len([c for c in cases if c.priority in ["CRITICAL", "HIGH"]])
    possible_matches = len([c for c in cases if c.status == "POSSIBLE_MATCH"])
    under_verification = len([c for c in cases if c.status == "UNDER_VERIFICATION"])
    reunited = len([c for c in cases if c.status == "REUNITED"])

    facilities_db = db.query(Facility).all()
    fac_res = []
    for fac in facilities_db:
        fac_res.append({
            "id": str(fac.id),
            "name": fac.name,
            "type": fac.facility_type,
            "location": {"lat": fac.lat, "lng": fac.lng, "address": fac.address, "landmark": fac.landmark, "sector": fac.sector},
            "phone": fac.phone,
            "emergencyContact": fac.emergency_contact,
            "totalCapacity": fac.total_capacity,
            "currentOccupancy": fac.current_occupancy,
            "availableBeds": fac.available_beds,
            "medicalStaffOnDuty": fac.medical_staff_on_duty,
            "suppliesStatus": fac.supplies_status
        })

    teams_db = db.query(RescueTeam).all()
    teams_res = []
    for t in teams_db:
        teams_res.append({
            "id": str(t.id),
            "teamCode": t.team_code,
            "leadCommander": t.lead_commander,
            "phone": t.phone,
            "membersCount": t.members_count,
            "specialization": t.specialization,
            "currentLocation": {"lat": t.current_lat, "lng": t.current_lng, "address": "Base", "sector": t.current_sector},
            "status": t.status
        })

    audit_db = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(20).all()
    audit_res = []
    for a in audit_db:
        audit_res.append({
            "id": str(a.id),
            "timestamp": a.created_at.isoformat() if a.created_at else "",
            "actorName": a.actor_name,
            "actorRole": a.actor_role,
            "action": a.action,
            "caseId": str(a.fused_case_id) if a.fused_case_id else None,
            "details": a.details
        })

    return {
        "role": role,
        "metrics": {
            "totalActiveCases": total_active,
            "highPriorityCount": high_priority,
            "possibleMatchesCount": possible_matches,
            "underVerificationCount": under_verification,
            "reunitedCount": reunited,
            "avgReunificationHours": 2.4
        },
        "facilities": fac_res,
        "rescueTeams": teams_res,
        "recentAuditLogs": audit_res
    }
