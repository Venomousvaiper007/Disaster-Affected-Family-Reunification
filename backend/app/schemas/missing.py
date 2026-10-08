from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class LocationCoordsSchema(BaseModel):
    lat: float
    lng: float
    address: str
    landmark: Optional[str] = None
    sector: Optional[str] = None

class PhysicalTraitsSchema(BaseModel):
    approxAgeMin: Optional[int] = None
    approxAgeMax: Optional[int] = None
    age: Optional[int] = None
    gender: str = "UNKNOWN"
    heightCm: Optional[int] = None
    build: Optional[str] = None
    skinTone: Optional[str] = None
    hairColor: Optional[str] = None
    distinguishingMarks: Optional[List[str]] = Field(default_factory=list)
    clothingUpper: Optional[str] = None
    clothingLower: Optional[str] = None
    footwear: Optional[str] = None
    accessories: Optional[List[str]] = Field(default_factory=list)
    languagesSpoken: Optional[List[str]] = Field(default_factory=list)
    medicalConditionNotes: Optional[str] = None
    isConscious: Optional[bool] = True

class MissingReportCreate(BaseModel):
    reporterName: str
    reporterRelationship: str
    reporterContact: str
    reporterAlternateContact: Optional[str] = None
    
    fullName: str
    aliasName: Optional[str] = None
    age: int
    gender: str
    vulnerability: str = "NONE"
    
    traits: PhysicalTraitsSchema
    lastSeenLocation: LocationCoordsSchema
    lastSeenTime: str
    photoUrl: Optional[str] = None
    additionalNotes: Optional[str] = None

class MissingReportResponse(BaseModel):
    id: str
    caseNumber: str
    reportedAt: str
    reporterName: str
    reporterRelationship: str
    reporterContact: str
    reporterAlternateContact: Optional[str] = None
    
    fullName: str
    aliasName: Optional[str] = None
    age: int
    gender: str
    vulnerability: str
    
    traits: PhysicalTraitsSchema
    lastSeenLocation: LocationCoordsSchema
    lastSeenTime: str
    photoUrl: Optional[str] = None
    additionalNotes: Optional[str] = None
    
    status: str
    fusedCaseId: Optional[str] = None
    matchedFoundId: Optional[str] = None
    matchScore: Optional[int] = None

    class Config:
        from_attributes = True
