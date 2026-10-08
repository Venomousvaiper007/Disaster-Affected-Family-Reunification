from pydantic import BaseModel
from typing import Optional, List

class EmergencyReportCreate(BaseModel):
    reporterName: str
    reporterContact: str
    locationAddress: str
    lat: float
    lng: float
    sector: Optional[str] = None
    peopleTrappedCount: int = 0
    criticallyInjuredCount: int = 0
    hasUnverifiedFatality: bool = False
    description: str
    photoUrl: Optional[str] = None

class EmergencyReportResponse(BaseModel):
    id: str
    emergencyCode: str
    reporterName: str
    reporterContact: str
    locationAddress: str
    lat: float
    lng: float
    sector: Optional[str] = None
    peopleTrappedCount: int
    criticallyInjuredCount: int
    hasUnverifiedFatality: bool
    fatalityStatus: str
    description: str
    photoUrl: Optional[str] = None
    priority: str
    status: str
    createdAt: str
    updatedAt: str

    class Config:
        from_attributes = True
