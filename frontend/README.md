# 🎨 Reunite360 Frontend

The frontend interface for **Project 96 — Reunite360** (Disaster Response, Family Reunification & Rescue Coordination Platform).

> For full project architectural documentation, backend endpoints, and demo guide, see the main [Project README](../README.md).

---

## ⚡ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Vanilla CSS / Tailwind CSS + Google Fonts (Inter)
- **Map Visualizations**: Leaflet.js (`react-leaflet`) with custom dark SVG markers
- **Charts**: Recharts
- **Icons**: Lucide React
- **Internationalization**: Native i18n supporting English & Tamil (`i18n.js`)

---

## 🚀 Running the Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev -- --host --port 5173
```

App will be available at `http://localhost:5173`.

---

## 🧩 Key Components & Pages

- **`IncidentMap.jsx`**: Real-time Leaflet radar map with color-coded custom pins (`ER`, `MP`, `FP`, `TEAM`).
- **`Home.jsx`**: Public landing page with live KPIs and Ravi Kumar central spotlight case preview.
- **`ReportMissing.jsx`, `ReportFound.jsx`, `ReportEmergency.jsx`**: Reporting forms with automated match trigger and unverified fatality protocol warnings.
- **`CommandCenter.jsx`**: Authority dashboard for priority filters, AI match candidate verification, rescue team dispatch, duplicate record merging, and conflict resolution.
- **`CaseDetail.jsx`**: Comprehensive investigation view displaying AI rationale, supporting vs. missing evidence lists, dynamic timeline, and audit history.
- **`FamilyTrack.jsx`**: Privacy-preserving status tracker by Case ID or phone number.
- **`Analytics.jsx`**: Visualized performance metrics (reunification speed, match accuracy distribution).
- **`AuditLog.jsx`**: Immutable, searchable platform audit trail.
