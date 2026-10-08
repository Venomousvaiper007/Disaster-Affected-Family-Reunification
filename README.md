# 🆘 Project 96 — Reunite360 🌐
### **AI-Assisted Disaster Response, Family Reunification & Rescue Coordination Platform**

> **Hackathon Problem Statement:** Disaster-Affected Family Reunification  
> **Built for:** 24-Hour Hackathon Prototype  
> **Architecture:** Full-Stack Local-First (FastAPI + SQLite + React + Leaflet + Recharts)

---

## 📌 Executive Summary

During major natural disasters (floods, earthquakes, cyclones), information becomes fragmented across rescue centers, relief camps, temporary shelters, and hospitals. Families are separated, and traditional missing-person reporting systems suffer from data duplication, unverified rumors, slow match confirmation, and lack of real-time visibility.

**Reunite360** is a unified disaster response & reunification coordination platform designed to bridge this gap. It empowers citizens, rescue teams, hospitals, and disaster authorities to manage cases, verify identity matches, dispatch emergency response teams, merge duplicate reports, resolve conflicting information, and provide real-time updates to affected families — **all while running 100% locally without external paid AI dependencies.**

---

## 🔥 Exhaustive Feature Matrix (All Features Included)

Here is the complete list of all features and capabilities engineered into **Reunite360**:

### 1. 📝 Intake & Disaster Reporting Suite
- **Missing Person Intake (`/report-missing`)**:
  - Detailed physical profile (height, weight, build, hair/eye color, gender, age).
  - Visual identification markers (distinguishing features, clothing description, tattoos, scars, birthmarks).
  - Medical condition & urgency flags (unconscious, injured, chronic illness, missing medication).
  - Last seen location with interactive map coordinates, address, and timestamp.
  - Photo attachment URL & contact information.
  - **Auto-Match Execution**: Instantly runs the local AI matching engine upon form submission.
- **Found Person / Relief Intake (`/report-found`)**:
  - Registration for shelters, rescue workers, and hospitals logging found individuals or unidentified persons.
  - Records condition (conscious, unconscious, injured, deceased), estimated age, clothing, visual markers, and hospital/shelter location.
  - Automatically searches database for matching missing person reports.
- **Emergency SOS Intake (`/report-emergency`)**:
  - Direct emergency rescue request form for stranded citizens.
  - Captures medical urgency, number of trapped individuals, environmental hazards (rising water, building collapse), and live GPS location.
- **Unverified Fatality Protocol Safety Warning**:
  - Strict protocol and UI banner for reports involving unverified casualties.
  - Masks public view of fatality data until dual-confirmed by official medical examiners/law enforcement to prevent public panic.

---

### 2. 🧠 Local AI & Intelligence Engines (100% Offline / Zero API Cost)
- **Multi-Factor Deterministic Similarity Matcher ($0-100\%$)**:
  - **Textual Similarity**: Evaluates fuzzy string matching (`difflib`) on names, physical traits, and clothing descriptions.
  - **Visual Feature Alignment**: Cross-checks specific markers like tattoos, scars, and birthmarks.
  - **Age Range Tolerance**: Scores age alignment using dynamic tolerance windows.
  - **Geospatial Distance Scoring**: Uses Haversine formulas to calculate geographic distance between last seen location and found location.
  - **Temporal Alignment**: Evaluates time elapsed between disappearance and discovery.
- **Automated Match Rationale Generator**:
  - Generates human-readable decision explanations for every match candidate.
  - Explicitly lists **Supporting Evidence** (e.g., *"Right forearm tattoo match (+35%)"*, *"Distance within 1.2km (+25%)"*) and **Missing/Contradictory Evidence** (e.g., *"Age discrepancy of 3 years"*).
- **Priority & Vulnerability Triage Engine ($0-100$)**:
  - Computes dynamic priority scores prioritizing vulnerable individuals:
    - Children under 12 & Elderly over 65 (+25-30 priority points).
    - Unconscious or severely injured individuals (+40 priority points).
    - Time elapsed since last contact.
  - Generates recommended **Next Best Action** for command center operators (e.g., *"Dispatch Medical Squad Alpha Immediately"*).
- **Evidence Confidence Evaluator**:
  - Assigns trust levels to incoming evidence (Official Hospital > Authorized Shelter > Citizen Tip).
  - Flags contradictory reports for human review.

---

### 3. 🛡️ Command Center & Human-In-The-Loop Operations
- **Candidate Match Verification Modal**:
  - Side-by-side comparison interface for missing and found person records.
  - Displays AI score, physical side-by-side specs, supporting vs missing evidence toggles.
  - **Dual-Confirm / Reject**: Authorized responders must explicitly confirm matches before status updates to `MATCHED` or `REUNITED`.
- **Rescue Team Dispatch Engine**:
  - View list of available rescue teams (`TEAM-01 Rescue Alpha`, `TEAM-02 Medical Squad`, `TEAM-03 Water Rescue`).
  - Assign teams to emergency SOS calls or found person locations with real-time status updates (*Dispatched*, *En Route*, *On Site*, *Resolved*).
- **Duplicate Record Merging Tool**:
  - Automatically detects potential duplicate reports (e.g., `DG-101` where multiple family members report the same person).
  - Unified view to merge secondary records into a canonical master record while preserving all underlying evidence logs.
- **Conflict Resolution Interface**:
  - Identifies conflicting data points across reports (e.g., `MP-1092` with conflicting last-known locations or age statements).
  - Operator workflow to override, resolve, or reconcile data points with documented authority notes.

---

### 4. 🗺️ Interactive Disaster Radar Map
- **Leaflet Interactive Map (`IncidentMap.jsx`)**:
  - High-contrast dark-mode tiles customized for emergency operation centers.
  - **Custom Vector Pin Markers**:
    - 🚨 **Red Pulsing Pin**: Emergency SOS / Rescue Calls
    - ⚠️ **Amber Pin**: Missing Person Incidents
    - 🟢 **Emerald Pin**: Found Person / Shelter Registrations
    - 🔵 **Blue Pin**: Active Rescue Teams
  - **Interactive Popups**: Click any pin to inspect summary details, priority tags, medical urgency, and quick links to full case files.
  - **Geospatial Radius Filter**: Filter incidents by distance radius (5km, 10km, 25km, All) and case type.

---

### 5. 👨‍👩‍👧 Family Portal & Public Experience
- **Privacy-Preserving Family Tracking Portal (`/family-track`)**:
  - Enables affected families to securely track their relative's status using a unique **Case ID** (e.g., `MP-1024`) or phone number.
  - Displays a visual status progress bar (*Reported* $\rightarrow$ *AI Match Flagged* $\rightarrow$ *Authority Verified* $\rightarrow$ *Rescued / Reunited*).
  - Keeps confidential location details and medical notes protected from public indexation.
- **Multilingual Engine (English & Tamil)**:
  - Native language switcher in top navigation bar for seamless translation between **English** and **Tamil** (`தமிழ்`).
  - Covers all form labels, notifications, status badges, and help text.
- **Simulated Role Switcher**:
  - Role toggle bar in the navigation header allowing evaluators to switch perspectives instantly:
    - 👨‍👩‍👧 *Family Member*
    - 🧑‍🚒 *Citizen / Volunteer*
    - 🚑 *Rescue Team*
    - 🏥 *Organization / Shelter*
    - 🛡️ *Authority / Admin*
- **Offline Sync Queue Status Indicator**:
  - Header badge and status drawer displaying pending local requests queued during connectivity drops in disaster zones.

---

### 6. 📊 Analytics, Metrics & Auditability
- **Recharts System Analytics (`/analytics`)**:
  - Live metric cards: Total Cases, Reunited Count, High-Priority Urgency Count, Pending Matches.
  - Visual charts:
    - **Reunification Velocity**: Cases resolved per hour.
    - **AI Match Confidence Distribution**: Histogram of match scores across candidate pairs.
    - **Status Breakdown**: Pie chart of Active, Verified, Dispatched, and Reunited cases.
    - **Priority Matrix**: Distribution of Low, Medium, High, and Critical priority cases.
- **Immutable Platform Audit Log (`/audit-log`)**:
  - Searchable, filterable audit log capturing every single system transaction.
  - Records timestamp, action type (Intake, Match Flagged, Match Verified, Team Dispatched, Record Merged, Conflict Resolved), target Case ID, user role, and exact parameters changed.

---

### 7. 🌟 Central Demo Scenario Spotlight ("Ravi Kumar" Workflow)
- Pre-seeded end-to-end hackathon test case accessible directly from the homepage:
  1. **Missing Person**: Ravi Kumar (`MP-1024`) reported missing by wife Sita Kumar in Cuddalore.
  2. **Found Person**: Unidentified male (`FP-2048`) registered at Relief Camp #2.
  3. **88% AI Match**: Triggered automatically with explicit tattoo & location match rationales.
  4. **Verification & Dispatch**: Command center operators confirm identity and dispatch Rescue Alpha (`TEAM-01`) to complete reunification.

---

## ⚡ Key Highlights & Core Capabilities Summary

- 🤖 **Local AI Matching Engine ($0-100\%$)**: Multi-factor deterministic similarity matcher evaluating physical characteristics, visual identification features (clothing, tattoos, scars), age tolerance, location proximity (Haversine distance), and temporal alignment.
- 🛡️ **Human-In-The-Loop Verification**: AI assists by computing match scores and generating detailed decision rationales, but **never auto-confirms identity**. Official verification requires dual-confirm workflow by rescue/authority teams.
- 🚨 **Unverified Fatality Protocol**: Strict safety mechanism masking unconfirmed casualty reports to prevent panic and protect family emotional well-being until verified by authorized responders.
- 🗺️ **Interactive Disaster Radar Map**: Real-time Leaflet map featuring color-coded custom vector pins (`ER` Emergency SOS, `MP` Missing Person, `FP` Found Person, `TEAM` Rescue Team) with dynamic radius filters.
- 📊 **Priority & Vulnerability Triage ($0-100$)**: Algorithmic scoring based on medical urgency, age vulnerability (children/elderly), and time elapsed since last contact.
- 🔄 **Duplicate Merging & Conflict Resolution**: Dedicated admin tools to merge duplicate reports (`DG-101`) into unified master cases and resolve conflicting information (`MP-1092`) with evidence history.
- 🌐 **Multilingual & Offline Ready**: Native language switcher (**English & Tamil**) and local offline queue sync indicator for low-connectivity disaster zones.
- 🔍 **Privacy-Preserving Family Tracking**: Dedicated portal for family members to safely check real-time status updates using unique Case IDs or phone numbers without public exposure of sensitive data.
- 📜 **Immutable Audit Trail**: Full event logging for every intake, match evaluation, verification step, dispatch, and status change.

---

## 🛠️ Tech Stack & Architecture

```
                       ┌─────────────────────────────────────────┐
                       │           React + Vite Frontend          │
                       │ (Tailwind CSS, Leaflet, Recharts, i18n)  │
                       └───────────────────┬─────────────────────┘
                                           │ HTTP / REST API
                                           ▼
                       ┌─────────────────────────────────────────┐
                       │             FastAPI Backend             │
                       │      (Python 3.10+, Uvicorn Server)     │
                       └───────────┬─────────────────┬───────────┘
                                   │                 │
                                   ▼                 ▼
             ┌───────────────────────────┐     ┌───────────────────────────┐
             │ SQLite Relational DB      │     │ Deterministic Matcher     │
             │ (12 Interlinked Tables)   │     │ & Priority Engine         │
             └───────────────────────────┘     └───────────────────────────┘
```

### **Backend (`/backend`)**
- **Framework**: FastAPI (Python 3.10+)
- **Database**: Native SQLite (`sqlite3`) with standard dictionary row factories
- **Matching Engine**: Deterministic multi-factor weighted similarity algorithm using string similarity (`difflib`), Haversine geospatial calculations, and age range scoring.
- **Triage & Priority**: Rule-based priority scoring engine ($0-100$).

### **Frontend (`/frontend`)**
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Google Fonts (Inter) + CSS Glassmorphism
- **Mapping**: Leaflet.js with custom dark tiles & animated vector markers
- **Charts & Analytics**: Recharts
- **Icons**: Lucide React
- **Localization**: Custom English/Tamil (`en`/`ta`) translation engine

---

## 📁 Repository Structure

```
hacknext/
├── backend/
│   ├── database.py         # SQLite schema initialization (12 core entities)
│   ├── main.py             # FastAPI REST endpoints & controller logic
│   ├── seed_data.py        # Seed dataset (Ravi Kumar case, SOS emergency, conflicts)
│   └── engine/
│       ├── matcher.py      # Deterministic AI matching algorithm & rationale builder
│       ├── priority.py     # Priority triage & next-best-action generator
│       └── evidence.py     # Evidence confidence evaluator & timeline parser
│
└── frontend/
    ├── public/             # Static assets & map markers
    └── src/
        ├── api.js          # REST Client for backend endpoints
        ├── i18n.js         # English & Tamil translation dictionary
        ├── components/
        │   ├── Header.jsx           # Global Navigation, Role Switcher, i18n & Notification Drawer
        │   └── IncidentMap.jsx      # Leaflet Interactive Disaster Map
        └── pages/
            ├── Home.jsx             # Public Landing Page & Demo Spotlight Widget
            ├── ReportMissing.jsx    # Missing Person Intake Form
            ├── ReportFound.jsx      # Found Person Intake Form
            ├── ReportEmergency.jsx  # Emergency SOS Intake Form
            ├── CommandCenter.jsx    # Authority Dashboard (Verification, Dispatch, Merges, Conflicts)
            ├── CaseDetail.jsx       # Investigation view (Rationale, Evidence, Timeline, Audit)
            ├── FamilyTrack.jsx      # Privacy-Preserving Family Search Portal
            ├── Analytics.jsx        # Recharts Metrics & System Performance Dashboard
            └── AuditLog.jsx         # Searchable System Audit Trail
```

---

## 🚦 Quick Start & Local Setup

### **Prerequisites**
- **Node.js** (v18+)
- **Python** (v3.10+)

### **1. Launch Backend API**
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
# source venv/bin/activate

pip install fastapi uvicorn
python seed_data.py   # Initializes database & populates demo dataset
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
> Backend API will be available at: `http://localhost:8000`  
> Interactive OpenAPI Documentation: `http://localhost:8000/docs`

---

### **2. Launch Frontend Application**
```bash
cd frontend
npm install
npm run dev -- --host --port 5173
```
> Frontend Application will be available at: `http://localhost:5173`

---

## 📡 API Overview

| Endpoint | Method | Description |
|---|---|---|
| `/api/dashboard/stats` | `GET` | System-wide live KPIs (Total cases, reunited, high priority, pending matches) |
| `/api/cases` | `GET` | Query missing, found, and emergency cases with filters |
| `/api/cases/{case_id}` | `GET` | Retrieve full case breakdown (details, timeline, evidence, audit logs) |
| `/api/report/missing` | `POST` | Register a new missing person report and run auto-matching |
| `/api/report/found` | `POST` | Register a found person/unidentified body and run auto-matching |
| `/api/report/emergency` | `POST` | Log an urgent SOS rescue request |
| `/api/matches/verify` | `POST` | Dual-confirm or reject an AI match candidate |
| `/api/rescue/dispatch` | `POST` | Dispatch rescue team to emergency/found location |
| `/api/duplicates/merge` | `POST` | Merge duplicate records into a canonical master record |
| `/api/conflicts/resolve` | `POST` | Resolve data conflicts with verified authoritative value |
| `/api/family/track` | `GET` | Track case status using Case ID or Phone Number |
| `/api/audit-logs` | `GET` | Retrieve immutable platform audit trail |

---

## 👥 Roles & Access Scopes

| Role | Available Features |
|---|---|
| 👨‍👩‍👧 **Family Member** | Report missing loved ones, track status via Family Portal, view public map. |
| 🧑‍🚒 **Citizen / Volunteer** | Report found persons/relatives, report emergency SOS, view public map. |
| 🚑 **Rescue Team** | View dispatched rescue tasks, update field status, submit rescue reports. |
| 🏥 **Organization / Shelter** | Register found persons at shelters/hospitals, log medical status. |
| 🛡️ **Authority / Admin** | Access Command Center, review AI matches, confirm identity, merge duplicates, resolve conflicts, view analytics & audit logs. |

---

## 🎨 Design Philosophy & Safety Protocol

1. **Dark High-Contrast Aesthetic**: Built with modern dark-mode visuals, vibrant emergency indicators (`#EF4444` SOS, `#F59E0B` Warning, `#10B981` Reunited), glassmorphic cards, and smooth CSS micro-interactions to optimize readability in dark command centers or field tablets.
2. **Dignity & Privacy First**: Personal contacts are masked in public views. Family members track progress via unique cryptographic tracking keys.
3. **No False Promises**: AI confidence scores clearly articulate *why* a match was suggested, explicitly listing both supporting evidence and missing items to guide human decision-makers safely.

---

## 📜 License & Acknowledgments

Developed as a hackathon submission for **Project 96 — Disaster-Affected Family Reunification**. Built with open-source technologies for community resilience and humanitarian response.
