# Reunite360 - Disaster Response & Family Reunification Platform

Reunite360 is a comprehensive, AI-ready dashboard designed for disaster response, family reunification, and rescue coordination. It provides specialized interfaces for the public, command centers, field rescue teams, and hospital intake staff to efficiently manage and track missing and found persons during crises.

## Features Implemented So Far

The platform is structured around a centralized state management system (`CaseContext`) and supports multiple distinct views tailored for different user roles.

### 1. Core Modules & Views
- **Public Home Portal (`PublicHome`)**: The main landing page for the general public. Users can report missing persons, report found persons, track existing cases, and view available facilities.
- **Command Center Dashboard (`CommandCenterView`)**: An administrative interface for authorities to monitor all active cases, analyze trends, and coordinate rescue efforts on a macro level.
- **Field Rescue App (`FieldRescueView`)**: A streamlined, mobile-responsive view designed for rescue workers operating in the field to quickly report found individuals and update statuses.
- **Hospital Intake Portal (`HospitalIntakeView`)**: A dedicated interface for medical facilities to log patient arrivals, update medical conditions, and facilitate matching with reported missing cases.
- **Track Case System (`TrackCaseView`)**: A search interface allowing users to track the real-time status of a specific case using a unique Case ID.
- **Facilities Viewer (`FacilitiesView`)**: A module to view operational relief camps, hospitals, and command centers.

### 2. Interactive Modals
- **Report Missing Form (`ReportMissingModal`)**: A comprehensive multi-step form to collect details about a missing person (physical description, last known location, clothing, etc.).
- **Report Found Form (`ReportFoundModal`)**: A form for field workers or the public to report a found person, allowing for quick data entry and evidence attachment.
- **Case Detail View (`CaseDetailModal`)**: A highly detailed, tabbed interface to view all information related to a specific case. 
  - **Tabs include**: Overview, Evidence, Timeline, Actions, and Verification.
  - **Recent Updates**: Fully optimized for scrollability and responsive design, preventing clipping on smaller screens and featuring sleek custom scrollbars.

### 3. UI/UX & Theming
- **Dark-Mode Aesthetic**: The application uses a modern, high-contrast dark theme with "glass-morphism" panel effects (`glass-panel`) for a premium feel.
- **Responsive Design**: Built using flexible grid and flexbox layouts to ensure usability across desktops, tablets, and mobile devices.
- **Accessibility & Localization**: Includes a high-contrast toggle and a Language Context (`LanguageProvider`) to support multiple languages in emergency situations.
- **Status Badging**: Visual indicators (critical, verified, pending) to quickly convey the urgency and status of cases.

### 4. Technical Architecture
- **React + TypeScript**: Strongly typed components for reliability and maintainability.
- **Context API**: Global state management for cases and language settings.
- **Vite**: Lightning-fast development server and optimized production builds.

## How to Run the Project (Full-Stack Setup)

Reunite360 is powered by a **FastAPI** backend connected to a **PostgreSQL 18** database, with a **React + TypeScript + Vite** frontend.

---

### Prerequisites
- **Node.js**: v18 or higher
- **Python**: v3.10 or higher
- **PostgreSQL 18**: Running on `localhost:5432` with a database named `reunite360`.

---

### Step 1: Database Setup (PostgreSQL)

1. Ensure PostgreSQL 18 service is running on your machine.
2. Create the `reunite360` database using pgAdmin, `psql`, or SQL command:
   ```sql
   CREATE DATABASE reunite360;
   ```

---

### Step 2: Backend Setup (FastAPI REST API)

1. Open a terminal and navigate to the `backend` folder:
   ```powershell
   cd backend
   ```

2. Create and activate a Python virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install the backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create/verify the `backend/.env` file with your PostgreSQL connection parameters:
   ```env
   DATABASE_URL=postgresql+psycopg://postgres:1234@localhost:5432/reunite360
   SECRET_KEY=reunite360-secret-key-change-in-production
   ```
   *(Replace `1234` with your local PostgreSQL password if different).*

5. **(Optional) Seed Demo Data**:
   Populate the database with realistic demo cases, missing persons, found persons, emergency reports, facilities, and candidate matches:
   ```bash
   python -m app.seed.demo_data
   ```

6. Start the FastAPI server:
   - **Windows (PowerShell)**:
     ```powershell
     $env:DISABLE_SQLALCHEMY_CEXT="1"
     python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
     ```
   - **Linux / macOS**:
     ```bash
     uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
     ```

7. **Verify Backend Health & Documentation**:
   - **Health Check**: Open [http://localhost:8000/api/health](http://localhost:8000/api/health) in your browser. Expected response:
     ```json
     {
       "status": "ok",
       "database": "connected",
       "database_name": "reunite360"
     }
     ```
   - **Interactive API Specs (Swagger UI)**: Open [http://localhost:8000/docs](http://localhost:8000/docs).

---

### Step 3: Frontend Setup (React + Vite)

1. Open a second terminal in the project root directory (`sns hackathon`):
   ```bash
   npm install
   ```

2. (Optional) Create `.env` in the root directory if customizing the API URL:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```
   *(Defaults to `http://localhost:8000/api` if omitted).*

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser to access the full-stack application.

---

### Production Build

To test or generate the production bundle for the frontend:
```bash
npm run build
```

