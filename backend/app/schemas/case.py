from pydantic import BaseModel
from typing import Optional, List, Any
from backend.app.schemas.missing import MissingReportResponse, LocationCoordsSchema
from backend.app.schemas.found import FoundPersonResponse

class TimelineEventSchema(BaseModel):
    id: str
    caseId: str
    timestamp: str
    sourceType: str
    sourceName: str
    title: str
    description: str
    location: LocationCoordsSchema
    verified: bool
    evidencePhotoUrl: Optional[str] = None

class NextBestActionSchema(BaseModel):
    id: str
    caseId: str
    priorityScore: int
    urgencyLevel: str
    title: str
    description: str
    assignedRole: str
    targetFacilityOrTeam: Optional[str] = None
    contactPhone: Optional[str] = None
    status: str
    steps: List[Any] = []
    rationale: str
    createdAt: str
    updatedAt: str

class VerificationDetailsSchema(BaseModel):
    verifiedAt: str
    verifiedBy: str
    verifiedByRole: str
    verificationMethod: str
    notes: str
    officialBadgeId: Optional[str] = None
    biometricOrPhotoConfirmed: bool = True

class ReunificationDetailsSchema(BaseModel):
    reunitedAt: str
    location: str
    facilitatedBy: str
    familyReceivedName: str
    signatureRecorded: bool = True
    notes: str

class FusedCaseResponse(BaseModel):
    id: str
    caseNumber: str
    title: str
    status: str
    priority: str
    vulnerability: str
    createdAt: str
    updatedAt: str

    missingReport: Optional[MissingReportResponse] = None
    foundRecord: Optional[FoundPersonResponse] = None
    candidateMatch: Optional[Any] = None
    nextBestActions: List[NextBestActionSchema] = []
    timeline: List[TimelineEventSchema] = []

    verificationDetails: Optional[VerificationDetailsSchema] = None
    reunificationDetails: Optional[ReunificationDetailsSchema] = None

    class Config:
        from_attributes = True
