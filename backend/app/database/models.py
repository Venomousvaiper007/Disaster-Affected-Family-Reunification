import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey, Enum as SQLEnum, JSON, Table
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
from sqlalchemy.orm import relationship
import enum

from backend.app.database.connection import Base

# Enums matching schema.sql & target architecture
class CaseStatusEnum(str, enum.Enum):
    UNVERIFIED = "UNVERIFIED"
    POSSIBLE_MATCH = "POSSIBLE_MATCH"
    UNDER_VERIFICATION = "UNDER_VERIFICATION"
    VERIFIED = "VERIFIED"
    FAMILY_NOTIFIED = "FAMILY_NOTIFIED"
    REUNITED = "REUNITED"
    CLOSED = "CLOSED"

class UserRoleEnum(str, enum.Enum):
    FAMILY = "FAMILY"
    CITIZEN = "CITIZEN"
    RESPONDER = "RESPONDER"
    RESCUE_TEAM = "RESCUE_TEAM"
    ORGANIZATION = "ORGANIZATION"
    ADMIN = "ADMIN"
    # Legacy aliases matching existing schema.sql
    public_family = "FAMILY"
    rescue_team = "RESCUE_TEAM"
    hospital_shelter = "ORGANIZATION"
    command_authority = "ADMIN"

class UrgencyLevelEnum(str, enum.Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class VulnerabilityEnum(str, enum.Enum):
    CHILD = "CHILD"
    ELDERLY = "ELDERLY"
    INJURED = "INJURED"
    PREGNANT = "PREGNANT"
    DISABLED = "DISABLED"
    NONE = "NONE"

class GenderEnum(str, enum.Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"
    UNKNOWN = "UNKNOWN"

class FacilityTypeEnum(str, enum.Enum):
    HOSPITAL = "HOSPITAL"
    SHELTER = "SHELTER"
    RELIEF_CAMP = "RELIEF_CAMP"
    FIELD_POST = "FIELD_POST"

class ActionStatusEnum(str, enum.Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    ESCALATED = "ESCALATED"

class EmergencyStatusEnum(str, enum.Enum):
    REPORTED = "REPORTED"
    ACKNOWLEDGED = "ACKNOWLEDGED"
    ASSIGNED = "ASSIGNED"
    DISPATCHED = "DISPATCHED"
    ON_SCENE = "ON_SCENE"
    RESCUE_IN_PROGRESS = "RESCUE_IN_PROGRESS"
    RESOLVED = "RESOLVED"

class ConflictStatusEnum(str, enum.Enum):
    OPEN = "OPEN"
    UNDER_REVIEW = "UNDER_REVIEW"
    RESOLVED = "RESOLVED"
    DISMISSED = "DISMISSED"

class DisasterIncident(Base):
    __tablename__ = "disaster_incidents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    incident_type = Column(String(100), nullable=False)
    severity = Column(String(50), nullable=False)
    center_lat = Column(Float, nullable=False)
    center_lng = Column(Float, nullable=False)
    radius_km = Column(Float, nullable=False, default=25.0)
    active_helpline = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="ACTIVE")
    started_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    facilities = relationship("Facility", back_populates="incident")
    rescue_teams = relationship("RescueTeam", back_populates="incident")

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    org_type = Column(String(100), nullable=False) # HOSPITAL, SHELTER, NGO, GOVT
    contact_phone = Column(String(50))
    address = Column(Text)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    users = relationship("User", back_populates="organization")

class Facility(Base):
    __tablename__ = "facilities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("disaster_incidents.id", ondelete="CASCADE"), nullable=True)
    name = Column(String(255), nullable=False)
    facility_type = Column(String(50), nullable=False)
    address = Column(Text, nullable=False)
    landmark = Column(String(255))
    sector = Column(String(100))
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    phone = Column(String(50), nullable=False)
    emergency_contact = Column(String(50), nullable=False)
    total_capacity = Column(Integer, nullable=False, default=100)
    current_occupancy = Column(Integer, nullable=False, default=0)
    available_beds = Column(Integer, nullable=False, default=100)
    medical_staff_on_duty = Column(Integer, nullable=False, default=5)
    supplies_status = Column(String(50), default="OPTIMAL")
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    incident = relationship("DisasterIncident", back_populates="facilities")

class RescueTeam(Base):
    __tablename__ = "rescue_teams"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("disaster_incidents.id", ondelete="CASCADE"), nullable=True)
    team_code = Column(String(100), unique=True, nullable=False)
    lead_commander = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    members_count = Column(Integer, nullable=False, default=4)
    specialization = Column(String(100), nullable=False)
    current_lat = Column(Float, nullable=False)
    current_lng = Column(Float, nullable=False)
    current_sector = Column(String(100))
    status = Column(String(50), nullable=False, default="STANDBY")
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    incident = relationship("DisasterIncident", back_populates="rescue_teams")
    assignments = relationship("RescueAssignment", back_populates="rescue_team")

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=True)
    phone = Column(String(50), nullable=False)
    role = Column(String(50), nullable=False, default="FAMILY")
    badge_number = Column(String(100))
    facility_id = Column(UUID(as_uuid=True), ForeignKey("facilities.id", ondelete="SET NULL"), nullable=True)
    rescue_team_id = Column(UUID(as_uuid=True), ForeignKey("rescue_teams.id", ondelete="SET NULL"), nullable=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    organization = relationship("Organization", back_populates="users")

class MissingReport(Base):
    __tablename__ = "missing_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_number = Column(String(50), unique=True, nullable=False)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("disaster_incidents.id", ondelete="SET NULL"), nullable=True)
    reporter_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    reporter_name = Column(String(255), nullable=False)
    reporter_relationship = Column(String(100), nullable=False)
    reporter_contact = Column(String(50), nullable=False)
    reporter_alternate_contact = Column(String(50))

    full_name = Column(String(255), nullable=False)
    alias_name = Column(String(255))
    age = Column(Integer, nullable=False)
    gender = Column(String(50), nullable=False)
    vulnerability = Column(String(50), nullable=False, default="NONE")

    height_cm = Column(Integer)
    build = Column(String(50))
    distinguishing_marks = Column(JSON, default=list) # Array of strings or JSON
    clothing_upper = Column(String(255))
    clothing_lower = Column(String(255))
    footwear = Column(String(255))
    accessories = Column(JSON, default=list)
    languages_spoken = Column(JSON, default=list)
    medical_condition_notes = Column(Text)

    last_seen_address = Column(Text, nullable=False)
    last_seen_landmark = Column(String(255))
    last_seen_sector = Column(String(100))
    last_seen_lat = Column(Float, nullable=False)
    last_seen_lng = Column(Float, nullable=False)
    last_seen_time = Column(DateTime(timezone=True), nullable=False)

    photo_url = Column(Text)
    additional_notes = Column(Text)
    status = Column(String(50), nullable=False, default="UNVERIFIED")

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

class FoundPerson(Base):
    __tablename__ = "found_persons"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_number = Column(String(50), unique=True, nullable=False)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("disaster_incidents.id", ondelete="SET NULL"), nullable=True)
    finder_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    reported_by_role = Column(String(50), nullable=False)
    reported_by_name = Column(String(255), nullable=False)
    contact_phone = Column(String(50))

    is_identified = Column(Boolean, nullable=False, default=False)
    given_name = Column(String(255))
    estimated_age_min = Column(Integer)
    estimated_age_max = Column(Integer)
    gender = Column(String(50), nullable=False, default="UNKNOWN")
    vulnerability = Column(String(50), nullable=False, default="NONE")
    medical_condition = Column(String(100), nullable=False, default="STABLE")
    is_conscious = Column(Boolean, nullable=False, default=True)

    height_cm = Column(Integer)
    build = Column(String(50))
    distinguishing_marks = Column(JSON, default=list)
    clothing_upper = Column(String(255))
    clothing_lower = Column(String(255))
    footwear = Column(String(255))
    accessories = Column(JSON, default=list)
    languages_spoken = Column(JSON, default=list)
    medical_condition_notes = Column(Text)

    found_address = Column(Text, nullable=False)
    found_landmark = Column(String(255))
    found_sector = Column(String(100))
    found_lat = Column(Float, nullable=False)
    found_lng = Column(Float, nullable=False)
    found_time = Column(DateTime(timezone=True), nullable=False)

    current_facility_id = Column(UUID(as_uuid=True), ForeignKey("facilities.id", ondelete="SET NULL"), nullable=True)
    current_facility_type = Column(String(50), nullable=False)
    current_facility_name = Column(String(255), nullable=False)
    ward_or_bed = Column(String(100))
    photo_url = Column(Text)
    notes = Column(Text)

    status = Column(String(50), nullable=False, default="UNVERIFIED")
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

class FusedCase(Base):
    __tablename__ = "fused_cases"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_number = Column(String(50), unique=True, nullable=False)
    title = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False, default="UNVERIFIED")
    priority = Column(String(50), nullable=False, default="HIGH")
    vulnerability = Column(String(50), nullable=False, default="NONE")

    missing_report_id = Column(UUID(as_uuid=True), ForeignKey("missing_reports.id", ondelete="SET NULL"), nullable=True)
    found_person_id = Column(UUID(as_uuid=True), ForeignKey("found_persons.id", ondelete="SET NULL"), nullable=True)

    match_score = Column(Integer, default=0)
    confidence_label = Column(String(50))
    score_breakdown = Column(JSON, default=dict)
    supporting_evidence = Column(JSON, default=list)
    conflicting_evidence = Column(JSON, default=list)
    missing_information = Column(JSON, default=list)
    timeline_consistency = Column(String(50))
    recommended_verification = Column(JSON, default=list)

    verified_at = Column(DateTime(timezone=True))
    verified_by = Column(String(255))
    verified_by_role = Column(String(100))
    verification_method = Column(String(255))
    verification_notes = Column(Text)
    biometric_confirmed = Column(Boolean, default=False)

    reunited_at = Column(DateTime(timezone=True))
    reunification_location = Column(String(255))
    facilitated_by = Column(String(255))
    family_received_name = Column(String(255))
    reunification_notes = Column(Text)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    missing_report = relationship("MissingReport", foreign_keys=[missing_report_id])
    found_person = relationship("FoundPerson", foreign_keys=[found_person_id])
    timeline_events = relationship("TimelineEvent", back_populates="fused_case", cascade="all, delete-orphan")
    next_best_actions = relationship("NextBestAction", back_populates="fused_case", cascade="all, delete-orphan")
    evidence_items = relationship("Evidence", back_populates="fused_case", cascade="all, delete-orphan")
    conflicts = relationship("CaseConflict", back_populates="fused_case", cascade="all, delete-orphan")

class CandidateMatch(Base):
    __tablename__ = "candidate_matches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    missing_report_id = Column(UUID(as_uuid=True), ForeignKey("missing_reports.id", ondelete="CASCADE"), nullable=False)
    found_person_id = Column(UUID(as_uuid=True), ForeignKey("found_persons.id", ondelete="CASCADE"), nullable=False)
    overall_score = Column(Integer, nullable=False)
    confidence_label = Column(String(50), nullable=False)

    name_score = Column(Integer, nullable=False, default=0)
    age_score = Column(Integer, nullable=False, default=0)
    gender_score = Column(Integer, nullable=False, default=0)
    physical_score = Column(Integer, nullable=False, default=0)
    clothing_score = Column(Integer, nullable=False, default=0)
    location_score = Column(Integer, nullable=False, default=0)
    timeline_score = Column(Integer, nullable=False, default=0)

    supporting_evidence = Column(JSON, nullable=False, default=list)
    conflicting_evidence = Column(JSON, nullable=False, default=list)
    missing_information = Column(JSON, nullable=False, default=list)
    timeline_consistency = Column(String(50), nullable=False, default="CONSISTENT")
    recommended_verification = Column(JSON, nullable=False, default=list)

    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reviewed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    missing_report = relationship("MissingReport")
    found_person = relationship("FoundPerson")

class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    fused_case_id = Column(UUID(as_uuid=True), ForeignKey("fused_cases.id", ondelete="CASCADE"), nullable=True)
    missing_report_id = Column(UUID(as_uuid=True), ForeignKey("missing_reports.id", ondelete="CASCADE"), nullable=True)
    found_person_id = Column(UUID(as_uuid=True), ForeignKey("found_persons.id", ondelete="CASCADE"), nullable=True)

    event_time = Column(DateTime(timezone=True), nullable=False)
    source_type = Column(String(50), nullable=False)
    source_name = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)

    lat = Column(Float)
    lng = Column(Float)
    location_name = Column(Text)

    verified = Column(Boolean, nullable=False, default=False)
    evidence_photo_url = Column(Text)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    fused_case = relationship("FusedCase", back_populates="timeline_events")

class NextBestAction(Base):
    __tablename__ = "next_best_actions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    fused_case_id = Column(UUID(as_uuid=True), ForeignKey("fused_cases.id", ondelete="CASCADE"), nullable=False)
    priority_score = Column(Integer, nullable=False)
    urgency_level = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)

    assigned_role = Column(String(50), nullable=False)
    assignee_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    target_facility_or_team = Column(String(255))
    contact_phone = Column(String(50))

    status = Column(String(50), nullable=False, default="PENDING")
    steps = Column(JSON, nullable=False, default=list)
    rationale = Column(Text, nullable=False)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    fused_case = relationship("FusedCase", back_populates="next_best_actions")

class EmergencyReport(Base):
    __tablename__ = "emergency_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    emergency_code = Column(String(50), unique=True, nullable=False) # e.g. "ER-1042"
    reporter_name = Column(String(255), nullable=False)
    reporter_contact = Column(String(50), nullable=False)

    location_address = Column(Text, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    sector = Column(String(100))

    people_trapped_count = Column(Integer, default=0)
    critically_injured_count = Column(Integer, default=0)
    has_unverified_fatality = Column(Boolean, default=False)
    fatality_status = Column(String(100), default="NONE") # "POSSIBLE FATALITY — UNVERIFIED" if reported by citizen

    description = Column(Text, nullable=False)
    photo_url = Column(Text)
    priority = Column(String(50), nullable=False, default="CRITICAL")
    status = Column(String(50), nullable=False, default="REPORTED")

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    rescue_assignments = relationship("RescueAssignment", back_populates="emergency_report", cascade="all, delete-orphan")

class RescueAssignment(Base):
    __tablename__ = "rescue_assignments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    emergency_report_id = Column(UUID(as_uuid=True), ForeignKey("emergency_reports.id", ondelete="CASCADE"), nullable=False)
    rescue_team_id = Column(UUID(as_uuid=True), ForeignKey("rescue_teams.id", ondelete="CASCADE"), nullable=False)
    assigned_by_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    status = Column(String(50), nullable=False, default="ASSIGNED")
    field_notes = Column(Text)
    dispatched_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    completed_at = Column(DateTime(timezone=True))

    emergency_report = relationship("EmergencyReport", back_populates="rescue_assignments")
    rescue_team = relationship("RescueTeam", back_populates="assignments")

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    fused_case_id = Column(UUID(as_uuid=True), ForeignKey("fused_cases.id", ondelete="CASCADE"), nullable=False)
    timeline_event_id = Column(UUID(as_uuid=True), ForeignKey("timeline_events.id", ondelete="SET NULL"), nullable=True)

    evidence_type = Column(String(50), nullable=False) # PHOTO, PHYSICAL_TRAIT, CLOTHING, LOCATION, BIOMETRIC, DOCUMENT
    source_type = Column(String(50), nullable=False) # HOSPITAL, ORGANIZATION, RESPONDER, CITIZEN
    source_name = Column(String(255), nullable=False)
    value_description = Column(Text, nullable=False)

    reliability_score = Column(Float, nullable=False, default=0.5) # 0.0 to 1.0 (Hospital 0.95 > Org 0.85 > Responder 0.75 > Citizen 0.50)
    verification_status = Column(String(50), nullable=False, default="UNVERIFIED")
    verified_by = Column(String(255))
    verified_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    fused_case = relationship("FusedCase", back_populates="evidence_items")

class CaseConflict(Base):
    __tablename__ = "case_conflicts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    fused_case_id = Column(UUID(as_uuid=True), ForeignKey("fused_cases.id", ondelete="CASCADE"), nullable=False)

    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(50), nullable=False, default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String(50), nullable=False, default="OPEN") # OPEN, UNDER_REVIEW, RESOLVED, DISMISSED

    related_event_ids = Column(JSON, default=list)
    resolution_notes = Column(Text)
    resolved_by = Column(String(255))
    resolved_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    fused_case = relationship("FusedCase", back_populates="conflicts")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    recipient_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    recipient_role = Column(String(50))
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), nullable=False, default="INFO")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class DuplicateGroup(Base):
    __tablename__ = "duplicate_groups"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entity_type = Column(String(50), nullable=False) # MISSING, FOUND
    primary_record_id = Column(UUID(as_uuid=True), nullable=False)
    duplicate_record_ids = Column(JSON, nullable=False, default=list)
    confidence_score = Column(Float, nullable=False, default=0.8)
    status = Column(String(50), nullable=False, default="PENDING_REVIEW")
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    actor_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    actor_name = Column(String(255), nullable=False)
    actor_role = Column(String(50), nullable=False)
    action = Column(String(255), nullable=False)
    fused_case_id = Column(UUID(as_uuid=True), ForeignKey("fused_cases.id", ondelete="SET NULL"), nullable=True)
    details = Column(Text, nullable=False)
    ip_address = Column(String(50))
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
