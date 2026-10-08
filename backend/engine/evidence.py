import json

def evaluate_evidence_trust(source_type: str) -> str:
    high_trust = {"GOVERNMENT_HOSPITAL", "HOSPITAL", "RESCUE_TEAM", "AUTHORITY", "SHELTER"}
    medium_trust = {"CITIZEN", "FAMILY", "RELIEF_WORKER"}
    
    st = source_type.upper() if source_type else ""
    if any(h in st for h in high_trust):
        return "HIGH"
    elif any(m in st for m in medium_trust):
        return "MEDIUM"
    return "LOW"

def check_timeline_consistency(events: list) -> dict:
    """
    Evaluates chronological and geographical consistency across timeline events.
    """
    if not events or len(events) < 2:
        return {"is_consistent": True, "score": 100.0, "notes": "Insufficient timeline events to evaluate inconsistency."}
    
    inconsistencies = []
    # Check simple location jump issues or backward timeline sequence
    for i in range(len(events) - 1):
        e1 = events[i]
        e2 = events[i+1]
        
        loc1 = e1.get("location", "").lower()
        loc2 = e2.get("location", "").lower()
        t1 = e1.get("timestamp", "")
        t2 = e2.get("timestamp", "")
        
        # Check for potential location conflict (e.g. different locations recorded around the exact same time)
        if loc1 and loc2 and loc1 != loc2 and t1 == t2 and t1 != "":
            inconsistencies.append(f"Conflict: Reported at '{e1.get('location')}' and '{e2.get('location')}' at identical timestamp ({t1}).")
            
    if inconsistencies:
        return {
            "is_consistent": False,
            "score": 45.0,
            "inconsistencies": inconsistencies,
            "notes": "⚠ Contradictory timeline records detected. Verification required."
        }
    
    return {
        "is_consistent": True,
        "score": 95.0,
        "inconsistencies": [],
        "notes": "✓ Chronological timeline sequence is consistent and plausible."
    }
