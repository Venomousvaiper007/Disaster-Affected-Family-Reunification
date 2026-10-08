from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from backend.app.schemas.missing import LocationCoordsSchema, PhysicalTraitsSchema

class FoundPersonCreate(BaseModel):
    reportedByRole: str = "CITIZEN" # RESCUE_TEAM, HOSPITAL, SHELTER, CITIZEN
    reportedByName: str
    contactPhone: Optional[str] = None
    
    isIdentified: bool = False
    givenName: Optional[str] = None
    estimatedAgeMin: Optional[int] = None
    estimatedAgeMax: Optional[int] = None
    gender: str = "UNKNOWN"
    vulnerability: str = "NONE"
    medicalCondition: str = "STABLE"
    isConscious: bool = True
    
    traits: PhysicalTraitsSchema
    foundLocation: LocationCoordsSchema
    foundTime: str
    
    currentFacilityType: str = "SHELTER" # HOSPITAL, SHELTER, RELIEF_CAMP, FIELD_POST
    currentFacilityName: str
    currentFacilityId: Optional[str] = None
    wardOrBed: Optional[str] = None
    photoUrl: Optional[str] = None
    notes: Optional[str] = None

class FoundPersonResponse(BaseModel):
    id: str
    caseNumber: str
    reportedAt: str
    reportedByRole: str
    reportedByName: str
    contactPhone: Optional[str] = None
    
    isIdentified: bool
    givenName: Optional[str] = None
    estimatedAgeMin: Optional[int] = None
    estimatedAgeMax: Optional[int] = None
    gender: str
    vulnerability: str
    medicalCondition: str
    isConscious: Optional[bool] = True
    
    traits: PhysicalTraitsSchema
    foundLocation: LocationCoordsSchema
    foundTime: str
    
    currentFacilityType: str
    currentFacilityName: str
    currentFacilityId: Optional[str] = None
    wardOrBed: Optional[str] = None
    photoUrl: Optional[str] = None
    notes: Optional[str] = None
    
    status: str
    fusedCaseId: Optional[str] = None
    matchedMissingId: Optional[str] = None
    matchScore: Optional[int] = None

    class Config:
        from_attributes = True
