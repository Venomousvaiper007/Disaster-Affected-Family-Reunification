from pydantic import BaseModel
from typing import Optional, List, Any

class ConflictingEvidenceItem(BaseModel):
    field: str
    missingRecordValue: str
    foundRecordValue: str
    explanation: str
    severity: str # LOW, MEDIUM, HIGH

class CandidateMatchSchema(BaseModel):
    id: str
    missingReportId: str
    foundPersonId: str
    overallScore: int
    confidenceLabel: str # VERY_HIGH, HIGH, MODERATE, LOW

    nameScore: int
    ageScore: int
    genderScore: int
    physicalScore: int
    clothingScore: int
    locationScore: int
    timelineScore: int

    supportingEvidence: List[str] = []
    conflictingEvidence: List[ConflictingEvidenceItem] = []
    missingInformation: List[str] = []

    timelineConsistency: str # CONSISTENT, PLAUSIBLE, SUSPICIOUS_GAP, IMPOSSIBLE
    recommendedVerification: List[str] = []

    createdAt: str
    reviewedBy: Optional[str] = None
    reviewedAt: Optional[str] = None

class MatchVerificationRequest(BaseModel):
    verifiedBy: str
    verificationMethod: str
    notes: str
