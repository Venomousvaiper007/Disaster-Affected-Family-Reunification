# ⚙️ Reunite360 Backend API

The REST backend service and AI decision engine for **Project 96 — Reunite360** (Disaster Response, Family Reunification & Rescue Coordination Platform).

> For full project architectural documentation and frontend guide, see the main [Project README](../README.md).

---

## ⚡ Tech Stack

- **Framework**: FastAPI (Python 3.10+)
- **Server**: Uvicorn (`uvicorn main:app --host 0.0.0.0 --port 8000`)
- **Database**: Native SQLite (`sqlite3`) with custom relational schema (12 interlinked tables)
- **AI Matching Engine**: Deterministic multi-factor weighted similarity engine ($0-100\%$)
- **Priority Triage**: Algorithmic vulnerability & urgency scoring engine ($0-100$)

---

## 🚀 Running the Backend

```bash
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate   # Windows
# source venv/bin/activate # Linux/macOS

# Install dependencies
pip install fastapi uvicorn

# Initialize database schema and populate seed dataset
python seed_data.py

# Start FastAPI Uvicorn Server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

- API Base URL: `http://localhost:8000`
- Interactive OpenAPI Swagger Docs: `http://localhost:8000/docs`

---

## 🧠 Core Backend Modules

- **`database.py`**: SQLite database schema manager handling 12 entities (cases, missing, found, emergency, matches, evidence, timeline, conflicts, duplicates, rescue teams, notifications, audit logs).
- **`engine/matcher.py`**: Deterministic similarity engine computing weighted match scores and rationale breakdowns based on physical traits, visual markers, age range, Haversine geospatial proximity, and temporal overlap.
- **`engine/priority.py`**: Priority score calculator ($0-100$) and recommended next action generator based on vulnerability (children/elderly), medical condition, and status.
- **`engine/evidence.py`**: Evidence trust level evaluator and timeline consistency checker.
- **`seed_data.py`**: Pre-populates the database with realistic disaster scenario data (Ravi Kumar `MP-1024` / `FP-2048` match scenario, emergency SOS `ER-1042`, conflict `MP-1092`, duplicate group `DG-101`).
- **`main.py`**: FastAPI controller serving all REST endpoints.
