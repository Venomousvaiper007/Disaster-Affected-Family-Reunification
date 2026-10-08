from pydantic import BaseModel
from typing import Optional, List
from backend.app.schemas.missing import LocationCoordsSchema

class RescueTeamResponse(BaseModel):
    id: str
    teamCode: str
    leadCommander: str
    phone: str
    membersCount: int
    specialization: str
    currentLocation: LocationCoordsSchema
    status: str
    assignedCaseId: Optional[str] = None

    class Config:
        from_attributes = True

class RescueAssignmentCreate(BaseModel):
    emergencyReportId: str
    rescueTeamId: str
    fieldNotes: Optional[str] = None

class RescueAssignmentStatusUpdate(BaseModel):
    status: str # DISPATCHED, ON_SCENE, RESCUE_IN_PROGRESS, RESOLVED
    fieldNotes: Optional[str] = None
