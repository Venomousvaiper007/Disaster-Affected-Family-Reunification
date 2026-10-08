from datetime import datetime

def detect_case_conflicts(timeline_events: list) -> list:
    conflicts = []
    # Sort events by timestamp
    sorted_events = []
    for e in timeline_events:
        ts = e.get("event_time") or e.get("timestamp")
        if isinstance(ts, str):
            try:
                dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
            except Exception:
                dt = datetime.utcnow()
        elif isinstance(ts, datetime):
            dt = ts
        else:
            dt = datetime.utcnow()
        sorted_events.append((dt, e))

    sorted_events.sort(key=lambda x: x[0])

    for i in range(len(sorted_events) - 1):
        dt1, e1 = sorted_events[i]
        dt2, e2 = sorted_events[i+1]
        loc1 = e1.get("location_name") or e1.get("source_name") or ""
        loc2 = e2.get("location_name") or e2.get("source_name") or ""
        
        # Check if locations are physically different and timestamp difference is less than 30 mins
        if loc1 and loc2 and loc1 != loc2:
            minutes_diff = abs((dt2 - dt1).total_seconds()) / 60.0
            if minutes_diff < 30.0:
                conflicts.append({
                    "title": f"Spatial-Temporal Conflict between {loc1} and {loc2}",
                    "description": f"Event at '{loc1}' at {dt1.strftime('%H:%M')} conflicts with event at '{loc2}' at {dt2.strftime('%H:%M')} ({minutes_diff:.0f} mins gap)",
                    "severity": "HIGH",
                    "status": "OPEN",
                    "related_event_ids": [str(e1.get("id")), str(e2.get("id"))]
                })

    return conflicts
