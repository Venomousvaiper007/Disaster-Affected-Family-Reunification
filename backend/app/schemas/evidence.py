from pydantic import BaseModel
from typing import Optional

class EvidenceCreate(BaseModel):
    fusedCaseId: str
    timelineEventId: Optional[str] = None
    evidenceType: str # PHOTO, PHYSICAL_TRAIT, CLOTHING, LOCATION, BIOMETRIC, DOCUMENT
    sourceType: str # HOSPITAL, ORGANIZATION, RESPONDER, CITIZEN
    sourceName: str
    valueDescription: str
    reliabilityScore: Optional[float] = None
    notes: Optional[str] = None

class EvidenceResponse(BaseModel):
    id: str
    fusedCaseId: str
    timelineEventId: Optional[str] = None
    evidenceType: str
    sourceType: str
    sourceName: str
    valueDescription: str
    reliabilityScore: float
    verificationStatus: str
    verifiedBy: Optional[str] = None
    verifiedAt: Optional[str] = None
    createdAt: str

    class Config:
        from_attributes = True
