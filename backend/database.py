import sqlite3
import datetime
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "reunite360.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.executescript("""
    CREATE TABLE IF NOT EXISTS cases (
        id TEXT PRIMARY KEY,
        case_type TEXT,
        status TEXT DEFAULT 'NEW',
        priority TEXT DEFAULT 'MEDIUM',
        priority_score REAL DEFAULT 50.0,
        created_at TEXT,
        updated_at TEXT,
        reporter_name TEXT,
        reporter_contact TEXT,
        reporter_relationship TEXT,
        assigned_responder TEXT,
        source TEXT DEFAULT 'Citizen',
        reliability TEXT DEFAULT 'MEDIUM',
        conflict_flag INTEGER DEFAULT 0,
        notes TEXT
    );

    CREATE TABLE IF NOT EXISTS missing_persons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        case_id TEXT UNIQUE,
        name TEXT,
        age INTEGER,
        gender TEXT,
        height TEXT,
        physical_marks TEXT,
        clothing TEXT,
        hair TEXT,
        last_known_location TEXT,
        last_known_time TEXT,
        circumstances TEXT,
        vulnerability TEXT DEFAULT 'GENERAL_ADULT',
        photo_url TEXT,
        lat REAL,
        lng REAL,
        FOREIGN KEY(case_id) REFERENCES cases(id)
    );

    CREATE TABLE IF NOT EXISTS found_persons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        case_id TEXT UNIQUE,
        name_if_known TEXT,
        age_approx INTEGER,
        gender TEXT,
        height_approx TEXT,
        physical_marks TEXT,
        clothing TEXT,
        hair TEXT,
        current_location TEXT,
        time_found TEXT,
        condition TEXT DEFAULT 'Stable',
        shelter_or_hospital TEXT,
        photo_url TEXT,
        lat REAL,
        lng REAL,
        FOREIGN KEY(case_id) REFERENCES cases(id)
    );

    CREATE TABLE IF NOT EXISTS emergency_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        case_id TEXT UNIQUE,
        emergency_type TEXT,
        location TEXT,
        lat REAL,
        lng REAL,
        num_people INTEGER DEFAULT 1,
        condition TEXT,
        description TEXT,
        fatality_unverified INTEGER DEFAULT 0,
        assigned_team TEXT,
        photo_url TEXT,
        FOREIGN KEY(case_id) REFERENCES cases(id)
    );

    CREATE TABLE IF NOT EXISTS matches (
        id TEXT PRIMARY KEY,
        missing_case_id TEXT,
        found_case_id TEXT,
        confidence_score REAL,
        match_category TEXT,
        supporting_evidence TEXT,
        missing_evidence TEXT,
        rationale TEXT,
        status TEXT DEFAULT 'POTENTIAL',
        reviewed_by TEXT,
        reviewed_at TEXT,
        created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS timeline_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        case_id TEXT,
        timestamp TEXT,
        location TEXT,
        source TEXT,
        organization TEXT,
        description TEXT,
        status TEXT,
        evidence_ref TEXT,
        lat REAL,
        lng REAL
    );

    CREATE TABLE IF NOT EXISTS evidence (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        case_id TEXT,
        source_name TEXT,
        source_type TEXT,
        verification_status TEXT DEFAULT 'UNVERIFIED',
        reliability_level TEXT DEFAULT 'MEDIUM',
        timestamp TEXT,
        description TEXT
    );

    CREATE TABLE IF NOT EXISTS conflicts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        case_id TEXT,
        source_a TEXT,
        source_b TEXT,
        conflict_type TEXT,
        description TEXT,
        status TEXT DEFAULT 'UNRESOLVED'
    );

    CREATE TABLE IF NOT EXISTS duplicate_groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        primary_case_id TEXT,
        case_ids TEXT,
        similarity_score REAL,
        status TEXT DEFAULT 'PENDING'
    );

    CREATE TABLE IF NOT EXISTS rescue_teams (
        id TEXT PRIMARY KEY,
        name TEXT,
        leader TEXT,
        contact TEXT,
        status TEXT DEFAULT 'AVAILABLE',
        assigned_case_id TEXT,
        lat REAL,
        lng REAL
    );

    CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        message TEXT,
        type TEXT,
        case_id TEXT,
        read INTEGER DEFAULT 0,
        created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT,
        case_id TEXT,
        actor TEXT,
        action TEXT,
        details TEXT
    );
    """)
    conn.commit()
    conn.close()

def dict_from_row(row):
    return dict(row) if row else None

def dicts_from_rows(rows):
    return [dict(r) for r in rows]
