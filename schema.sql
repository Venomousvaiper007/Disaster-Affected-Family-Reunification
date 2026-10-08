-- ====================================================================
-- Reunite360 — Disaster Response, Family Reunification & Rescue Coordination
-- PostgreSQL Relational Production Database Schema
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUM TYPES
CREATE TYPE case_status_enum AS ENUM (
    'UNVERIFIED',
    'POSSIBLE_MATCH',
    'UNDER_VERIFICATION',
    'VERIFIED',
    'FAMILY_NOTIFIED',
    'REUNITED',
    'CLOSED'
);

CREATE TYPE user_role_enum AS ENUM (
    'public_family',
    'rescue_team',
    'hospital_shelter',
    'command_authority'
);

CREATE TYPE urgency_level_enum AS ENUM (
    'CRITICAL',
    'HIGH',
    'MEDIUM',
    'LOW'
);

CREATE TYPE vulnerability_enum AS ENUM (
    'CHILD',
    'ELDERLY',
    'INJURED',
    'PREGNANT',
    'DISABLED',
    'NONE'
);

CREATE TYPE gender_enum AS ENUM (
    'MALE',
    'FEMALE',
    'OTHER',
    'UNKNOWN'
);

CREATE TYPE facility_type_enum AS ENUM (
    'HOSPITAL',
    'SHELTER',
    'RELIEF_CAMP',
    'FIELD_POST'
);

CREATE TYPE action_status_enum AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'COMPLETED',
    'ESCALATED'
);

-- 2. DISASTER INCIDENTS TABLE
CREATE TABLE disaster_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    incident_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    center_lat DOUBLE PRECISION NOT NULL,
    center_lng DOUBLE PRECISION NOT NULL,
    radius_km DOUBLE PRECISION NOT NULL DEFAULT 25.0,
    active_helpline VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. FACILITIES (HOSPITALS, SHELTERS, RELIEF CAMPS)
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES disaster_incidents(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    facility_type facility_type_enum NOT NULL,
    address TEXT NOT NULL,
    landmark VARCHAR(255),
    sector VARCHAR(100),
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    phone VARCHAR(50) NOT NULL,
    emergency_contact VARCHAR(50) NOT NULL,
    total_capacity INT NOT NULL DEFAULT 100,
    current_occupancy INT NOT NULL DEFAULT 0,
    available_beds INT NOT NULL DEFAULT 100,
    medical_staff_on_duty INT NOT NULL DEFAULT 5,
    supplies_status VARCHAR(50) DEFAULT 'OPTIMAL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. RESCUE TEAMS
CREATE TABLE rescue_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES disaster_incidents(id) ON DELETE CASCADE,
    team_code VARCHAR(100) UNIQUE NOT NULL,
    lead_commander VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    members_count INT NOT NULL DEFAULT 4,
    specialization VARCHAR(100) NOT NULL,
    current_lat DOUBLE PRECISION NOT NULL,
    current_lng DOUBLE PRECISION NOT NULL,
    current_sector VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'STANDBY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. USERS & RESPONDERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'public_family',
    badge_number VARCHAR(100),
    facility_id UUID REFERENCES facilities(id) ON DELETE SET NULL,
    rescue_team_id UUID REFERENCES rescue_teams(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. MISSING PERSON REPORTS
CREATE TABLE missing_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. '#R124'
    incident_id UUID REFERENCES disaster_incidents(id) ON DELETE SET NULL,
    reporter_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    reporter_name VARCHAR(255) NOT NULL,
    reporter_relationship VARCHAR(100) NOT NULL,
    reporter_contact VARCHAR(50) NOT NULL,
    reporter_alternate_contact VARCHAR(50),
    
    full_name VARCHAR(255) NOT NULL,
    alias_name VARCHAR(255),
    age INT NOT NULL,
    gender gender_enum NOT NULL,
    vulnerability vulnerability_enum NOT NULL DEFAULT 'NONE',
    
    -- Physical traits & clothing
    height_cm INT,
    build VARCHAR(50),
    distinguishing_marks TEXT[], -- array of marks/scars
    clothing_upper VARCHAR(255),
    clothing_lower VARCHAR(255),
    footwear VARCHAR(255),
    accessories TEXT[],
    languages_spoken TEXT[],
    medical_condition_notes TEXT,
    
    -- Location & time last seen
    last_seen_address TEXT NOT NULL,
    last_seen_landmark VARCHAR(255),
    last_seen_sector VARCHAR(100),
    last_seen_lat DOUBLE PRECISION NOT NULL,
    last_seen_lng DOUBLE PRECISION NOT NULL,
    last_seen_time TIMESTAMP WITH TIME ZONE NOT NULL,
    
    photo_url TEXT,
    additional_notes TEXT,
    status case_status_enum NOT NULL DEFAULT 'UNVERIFIED',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. FOUND PERSONS / RESCUED INDIVIDUALS
CREATE TABLE found_persons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. '#F089'
    incident_id UUID REFERENCES disaster_incidents(id) ON DELETE SET NULL,
    finder_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    reported_by_role VARCHAR(50) NOT NULL,
    reported_by_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    
    is_identified BOOLEAN NOT NULL DEFAULT FALSE,
    given_name VARCHAR(255),
    estimated_age_min INT,
    estimated_age_max INT,
    gender gender_enum NOT NULL DEFAULT 'UNKNOWN',
    vulnerability vulnerability_enum NOT NULL DEFAULT 'NONE',
    medical_condition VARCHAR(100) NOT NULL DEFAULT 'STABLE',
    is_conscious BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Physical traits & clothing found
    height_cm INT,
    build VARCHAR(50),
    distinguishing_marks TEXT[],
    clothing_upper VARCHAR(255),
    clothing_lower VARCHAR(255),
    footwear VARCHAR(255),
    accessories TEXT[],
    languages_spoken TEXT[],
    medical_condition_notes TEXT,
    
    -- Location & time found
    found_address TEXT NOT NULL,
    found_landmark VARCHAR(255),
    found_sector VARCHAR(100),
    found_lat DOUBLE PRECISION NOT NULL,
    found_lng DOUBLE PRECISION NOT NULL,
    found_time TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Current facility intake
    current_facility_id UUID REFERENCES facilities(id) ON DELETE SET NULL,
    current_facility_type facility_type_enum NOT NULL,
    current_facility_name VARCHAR(255) NOT NULL,
    ward_or_bed VARCHAR(100),
    photo_url TEXT,
    notes TEXT,
    
    status case_status_enum NOT NULL DEFAULT 'UNVERIFIED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. FUSED CASES (LIVE CASE FUSION ENGINE)
CREATE TABLE fused_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    status case_status_enum NOT NULL DEFAULT 'UNVERIFIED',
    priority urgency_level_enum NOT NULL DEFAULT 'HIGH',
    vulnerability vulnerability_enum NOT NULL DEFAULT 'NONE',
    
    missing_report_id UUID REFERENCES missing_reports(id) ON DELETE SET NULL,
    found_person_id UUID REFERENCES found_persons(id) ON DELETE SET NULL,
    
    -- Match confidence scores
    match_score INT DEFAULT 0,
    confidence_label VARCHAR(50),
    score_breakdown JSONB, -- stores { nameScore, ageScore, scarScore, clothingScore, locationScore, timelineScore }
    
    supporting_evidence JSONB, -- array of verified points
    conflicting_evidence JSONB, -- array of detected conflicts with severity
    missing_information JSONB, -- array of unverified data points
    timeline_consistency VARCHAR(50),
    recommended_verification JSONB,
    
    -- Verification metadata
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by VARCHAR(255),
    verified_by_role VARCHAR(100),
    verification_method VARCHAR(255),
    verification_notes TEXT,
    biometric_confirmed BOOLEAN DEFAULT FALSE,
    
    -- Reunification metadata
    reunited_at TIMESTAMP WITH TIME ZONE,
    reunification_location VARCHAR(255),
    facilitated_by VARCHAR(255),
    family_received_name VARCHAR(255),
    reunification_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. CANDIDATE MATCHES (FUSION RECORD PAIRS)
CREATE TABLE candidate_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    missing_report_id UUID NOT NULL REFERENCES missing_reports(id) ON DELETE CASCADE,
    found_person_id UUID NOT NULL REFERENCES found_persons(id) ON DELETE CASCADE,
    overall_score INT NOT NULL,
    confidence_label VARCHAR(50) NOT NULL,
    
    name_score INT NOT NULL,
    age_score INT NOT NULL,
    gender_score INT NOT NULL,
    physical_score INT NOT NULL,
    clothing_score INT NOT NULL,
    location_score INT NOT NULL,
    timeline_score INT NOT NULL,
    
    supporting_evidence JSONB NOT NULL DEFAULT '[]',
    conflicting_evidence JSONB NOT NULL DEFAULT '[]',
    missing_information JSONB NOT NULL DEFAULT '[]',
    timeline_consistency VARCHAR(50) NOT NULL,
    recommended_verification JSONB NOT NULL DEFAULT '[]',
    
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_match_pair UNIQUE (missing_report_id, found_person_id)
);

-- 10. TIMELINE EVENTS
CREATE TABLE timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fused_case_id UUID REFERENCES fused_cases(id) ON DELETE CASCADE,
    missing_report_id UUID REFERENCES missing_reports(id) ON DELETE CASCADE,
    found_person_id UUID REFERENCES found_persons(id) ON DELETE CASCADE,
    
    event_time TIMESTAMP WITH TIME ZONE NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    source_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    location_name TEXT,
    
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    evidence_photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. NEXT-BEST-ACTIONS (NBA ENGINE)
CREATE TABLE next_best_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fused_case_id UUID NOT NULL REFERENCES fused_cases(id) ON DELETE CASCADE,
    priority_score INT NOT NULL, -- 1 to 100
    urgency_level urgency_level_enum NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    assigned_role user_role_enum NOT NULL,
    assignee_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    target_facility_or_team VARCHAR(255),
    contact_phone VARCHAR(50),
    
    status action_status_enum NOT NULL DEFAULT 'PENDING',
    steps JSONB NOT NULL DEFAULT '[]', -- array of { stepNumber, instruction, completed }
    rationale TEXT NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. AUDIT LOGS (FULL REGULATORY COMPLIANCE & PRIVACY TRAIL)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_name VARCHAR(255) NOT NULL,
    actor_role user_role_enum NOT NULL,
    action VARCHAR(255) NOT NULL,
    fused_case_id UUID REFERENCES fused_cases(id) ON DELETE SET NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. PERFORMANCE INDEXES
CREATE INDEX idx_missing_status ON missing_reports(status);
CREATE INDEX idx_missing_case_num ON missing_reports(case_number);
CREATE INDEX idx_found_status ON found_persons(status);
CREATE INDEX idx_found_case_num ON found_persons(case_number);
CREATE INDEX idx_fused_status ON fused_cases(status);
CREATE INDEX idx_fused_priority ON fused_cases(priority);
CREATE INDEX idx_nba_status ON next_best_actions(status, priority_score DESC);
CREATE INDEX idx_timeline_case ON timeline_events(fused_case_id, event_time ASC);
CREATE INDEX idx_matches_score ON candidate_matches(overall_score DESC);
