export type CaseStatus = 
  | 'UNVERIFIED'
  | 'POSSIBLE_MATCH'
  | 'UNDER_VERIFICATION'
  | 'VERIFIED'
  | 'FAMILY_NOTIFIED'
  | 'REUNITED'
  | 'CLOSED';

export type UserRole = 'public_family' | 'rescue_team' | 'hospital_shelter' | 'command_authority';

export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type VulnerabilityCategory = 'CHILD' | 'ELDERLY' | 'INJURED' | 'PREGNANT' | 'DISABLED' | 'NONE';

export interface LocationCoords {
  lat: number;
  lng: number;
  address: string;
  landmark?: string;
  sector?: string;
}

export interface PhysicalTraits {
  approxAgeMin?: number;
  approxAgeMax?: number;
  age?: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN';
  heightCm?: number;
  build?: 'SLIM' | 'MEDIUM' | 'HEAVY' | 'ATHLETIC' | 'UNKNOWN';
  skinTone?: string;
  hairColor?: string;
  distinguishingMarks?: string[]; // e.g., ["Scar on right hand", "Mole on left cheek", "Tattoo on forearm"]
  clothingUpper?: string; // e.g., "Blue shirt", "Red cotton shirt"
  clothingLower?: string; // e.g., "Black jeans", "Khaki trousers"
  footwear?: string;
  accessories?: string[]; // e.g., ["Silver watch", "Gold ring", "Spectacles"]
  languagesSpoken?: string[];
  medicalConditionNotes?: string;
  isConscious?: boolean;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  timestamp: string; // ISO string
  sourceType: 'FAMILY' | 'RESCUE_TEAM' | 'SHELTER' | 'HOSPITAL' | 'AUTHORITY' | 'CITIZEN';
  sourceName: string;
  title: string;
  description: string;
  location: LocationCoords;
  verified: boolean;
  evidencePhotoUrl?: string;
}

export interface EvidenceItem {
  id: string;
  category: 'PHOTO' | 'PHYSICAL_TRAIT' | 'CLOTHING' | 'LOCATION' | 'TIMELINE' | 'BIOMETRIC' | 'DOCUMENT';
  label: string;
  sourceAValue: string;
  sourceBValue: string;
  matchStatus: 'MATCH' | 'CONFLICT' | 'MISSING' | 'PARTIAL';
  confidenceWeight: number; // 0 to 1
  notes?: string;
}

export interface CandidateMatch {
  id: string;
  missingReportId: string;
  foundPersonId: string;
  overallScore: number; // 0 - 100
  confidenceLabel: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW';
  
  // Breakdown scores (0 - 100)
  nameScore: number;
  ageScore: number;
  genderScore: number;
  physicalScore: number;
  clothingScore: number;
  locationScore: number;
  timelineScore: number;
  
  supportingEvidence: string[];
  conflictingEvidence: {
    field: string;
    missingRecordValue: string;
    foundRecordValue: string;
    explanation: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
  }[];
  missingInformation: string[];
  
  timelineConsistency: 'CONSISTENT' | 'PLAUSIBLE' | 'SUSPICIOUS_GAP' | 'IMPOSSIBLE';
  recommendedVerification: string[];
  
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface NextBestAction {
  id: string;
  caseId: string;
  priorityScore: number; // 1 to 100 (higher = more urgent)
  urgencyLevel: UrgencyLevel;
  title: string;
  description: string;
  assignedRole: UserRole;
  assigneeName?: string;
  targetFacilityOrTeam?: string;
  contactPhone?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ESCALATED';
  steps: {
    stepNumber: number;
    instruction: string;
    completed: boolean;
  }[];
  rationale: string;
  createdAt: string;
  updatedAt: string;
}

export interface MissingPersonReport {
  id: string; // e.g. "MIS-2026-081"
  caseNumber: string; // e.g. "#R124"
  reportedAt: string;
  reporterName: string;
  reporterRelationship: string;
  reporterContact: string;
  reporterAlternateContact?: string;
  
  fullName: string;
  aliasName?: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  vulnerability: VulnerabilityCategory;
  
  aadhaarNumber?: string;
  familyCardNumber?: string;
  
  traits: PhysicalTraits;
  lastSeenLocation: LocationCoords;
  lastSeenTime: string;
  photoUrl?: string;
  additionalNotes?: string;
  
  status: CaseStatus;
  fusedCaseId?: string;
  matchedFoundId?: string;
  matchScore?: number;
}

export interface FoundPersonRecord {
  id: string; // e.g. "FND-2026-104"
  caseNumber: string; // e.g. "#F089"
  reportedAt: string;
  reportedByRole: 'RESCUE_TEAM' | 'HOSPITAL' | 'SHELTER' | 'CITIZEN';
  reportedByName: string;
  contactPhone?: string;
  
  isIdentified: boolean;
  givenName?: string;
  isConscious?: boolean;
  estimatedAgeMin?: number;
  estimatedAgeMax?: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN';
  vulnerability: VulnerabilityCategory;
  medicalCondition: 'STABLE' | 'MINOR_INJURIES' | 'CRITICAL' | 'UNCONSCIOUS' | 'DECEASED';
  
  aadhaarNumber?: string;
  familyCardNumber?: string;
  
  traits: PhysicalTraits;
  foundLocation: LocationCoords;
  foundTime: string;
  
  currentFacilityType: 'HOSPITAL' | 'SHELTER' | 'RELIEF_CAMP' | 'FIELD_POST';
  currentFacilityName: string;
  currentFacilityId?: string;
  wardOrBed?: string;
  photoUrl?: string;
  notes?: string;
  
  status: CaseStatus;
  fusedCaseId?: string;
  matchedMissingId?: string;
  matchScore?: number;
}

export interface FusedCase {
  id: string; // e.g. "CASE-R124"
  caseNumber: string;
  title: string;
  status: CaseStatus;
  priority: UrgencyLevel;
  vulnerability: VulnerabilityCategory;
  createdAt: string;
  updatedAt: string;
  
  missingReport?: MissingPersonReport;
  foundRecord?: FoundPersonRecord;
  
  candidateMatch?: CandidateMatch;
  nextBestActions: NextBestAction[];
  timeline: TimelineEvent[];
  
  verificationDetails?: {
    verifiedAt: string;
    verifiedBy: string;
    verifiedByRole: string;
    verificationMethod: string;
    notes: string;
    officialBadgeId?: string;
    biometricOrPhotoConfirmed: boolean;
  };
  
  reunificationDetails?: {
    reunitedAt: string;
    location: string;
    facilitatedBy: string;
    familyReceivedName: string;
    signatureRecorded: boolean;
    notes: string;
  };
}

export interface Facility {
  id: string;
  name: string;
  type: 'HOSPITAL' | 'SHELTER' | 'RELIEF_CAMP';
  location: LocationCoords;
  phone: string;
  emergencyContact: string;
  totalCapacity: number;
  currentOccupancy: number;
  availableBeds: number;
  medicalStaffOnDuty: number;
  suppliesStatus: 'OPTIMAL' | 'ADEQUATE' | 'LOW' | 'CRITICAL';
}

export interface RescueTeamUnit {
  id: string;
  teamCode: string; // e.g. "RESCUE-ALPHA-01"
  leadCommander: string;
  phone: string;
  membersCount: number;
  specialization: 'WATER_RESCUE' | 'URBAN_SEARCH' | 'MEDICAL_EVAC' | 'DRONE_SURVEILLANCE';
  currentLocation: LocationCoords;
  status: 'ACTIVE_MISSION' | 'STANDBY' | 'TRANSPORTING' | 'OFF_DUTY';
  assignedCaseId?: string;
}

export interface DisasterIncident {
  id: string;
  name: string;
  type: 'CYCLONE' | 'FLOOD' | 'EARTHQUAKE' | 'LANDSLIDE' | 'INDUSTRIAL';
  locationName: string;
  centerCoords: LocationCoords;
  radiusKm: number;
  severity: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4_CATASTROPHIC';
  startTime: string;
  activeHelpline: string;
  status: 'ACTIVE' | 'CONTAINED' | 'RECOVERY';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  caseId?: string;
  details: string;
  ipAddress?: string;
}
