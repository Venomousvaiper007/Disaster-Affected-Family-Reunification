def generate_next_best_action(fused_case: dict, missing: dict = None, found: dict = None, match: dict = None) -> dict:
    status = fused_case.get("status", "UNVERIFIED")
    vulnerability = fused_case.get("vulnerability") or (missing.get("vulnerability") if missing else None) or (found.get("vulnerability") if found else "NONE")

    priority_score = 40
    if vulnerability == "CHILD": priority_score += 30
    elif vulnerability == "ELDERLY": priority_score += 20
    elif vulnerability in ["INJURED", "PREGNANT", "DISABLED"]: priority_score += 25

    if found and found.get("medical_condition") in ["CRITICAL", "UNCONSCIOUS"]:
        priority_score += 30
    elif found and found.get("medical_condition") == "MINOR_INJURIES":
        priority_score += 10

    if match and match.get("overallScore", 0) >= 80:
        priority_score += 15

    if status == "UNDER_VERIFICATION": priority_score += 10
    elif status == "VERIFIED": priority_score += 15
    elif status in ["REUNITED", "CLOSED"]: priority_score = 5

    priority_score = min(100, max(10, priority_score))

    urgency_level = "LOW"
    if priority_score >= 85: urgency_level = "CRITICAL"
    elif priority_score >= 65: urgency_level = "HIGH"
    elif priority_score >= 45: urgency_level = "MEDIUM"

    title = "Cross-reference Emergency Records"
    description = "Search active relief camps and field records for incoming matches."
    target_facility = found.get("current_facility_name") if found else "Zonal Disaster Command Center"
    contact_phone = found.get("contact_phone") if found else "1070"
    steps = []
    rationale = "Routine periodic case correlation."

    if status == "UNVERIFIED":
        if missing and not found:
            title = f"Broadcast Missing Alert for {missing.get('full_name', 'Missing Person')}"
            description = "Deploy search queries across regional intake registries."
            rationale = "Missing report logged. Searching shelter and hospital records."
            steps = [
                {"stepNumber": 1, "instruction": "Notify Field Rescue Units in last seen area", "completed": False},
                {"stepNumber": 2, "instruction": "Query Hospital Emergency Intakes within 15 km radius for unidentified patients", "completed": False},
                {"stepNumber": 3, "instruction": "Check distinguishing features in shelter database", "completed": False}
            ]
        elif found and not missing:
            title = f"Identify Rescued Person at {found.get('current_facility_name', 'Facility')}"
            description = "Individual admitted requires family correlation."
            rationale = "Found individual is currently unlinked to missing reports."
            steps = [
                {"stepNumber": 1, "instruction": "Capture high-resolution photo at facility", "completed": False},
                {"stepNumber": 2, "instruction": "Document any scars or identifying marks with Ward Nurse", "completed": False},
                {"stepNumber": 3, "instruction": "Run automated live case fusion against active missing reports", "completed": False}
            ]
    elif status == "POSSIBLE_MATCH":
        title = f"Dispatch Verification Team to {target_facility}"
        score = match.get("overallScore", 85) if match else 85
        description = f"Potential match ({score}% confidence) identified."
        rationale = "High correlation on physical & location factors."
        steps = [
            {"stepNumber": 1, "instruction": f"Contact Intake Desk ({contact_phone})", "completed": False},
            {"stepNumber": 2, "instruction": "Request latest photograph of face and identifying marks", "completed": False},
            {"stepNumber": 3, "instruction": "Verify admission timestamp against disappearance timeline", "completed": False},
            {"stepNumber": 4, "instruction": "Compare photographic evidence with family records", "completed": False}
        ]
    elif status == "UNDER_VERIFICATION":
        title = f"Complete Authorized Verification at {target_facility}"
        description = "Field responder or medical supervisor is validating physical identity."
        rationale = "Case is in active verification state."
        steps = [
            {"stepNumber": 1, "instruction": "Review responder live photo confirmation at bedside/ward", "completed": True},
            {"stepNumber": 2, "instruction": "Verify reporter relationship proof or ID reference", "completed": False},
            {"stepNumber": 3, "instruction": "Incident Commander sign-off on identity match", "completed": False}
        ]
    elif status == "VERIFIED":
        title = "Initiate Secure Family Notification & Reunification Protocol"
        description = "Identity is 100% verified. Safely contact family and coordinate pickup."
        rationale = "Authorized verification complete."
        steps = [
            {"stepNumber": 1, "instruction": f"Call verified reporter ({missing.get('reporter_contact') if missing else 'Family'})", "completed": False},
            {"stepNumber": 2, "instruction": f"Provide designated safe pickup location: {target_facility}", "completed": False},
            {"stepNumber": 3, "instruction": "Record physical handoff and official closure signature", "completed": False}
        ]
    elif status == "REUNITED" or status == "CLOSED":
        title = "Case Successfully Reunited & Archived"
        description = "Person safely reunited with family. Full audit trail recorded."
        rationale = "Reunification verified and officially closed."
        steps = [
            {"stepNumber": 1, "instruction": "Audit logs archived into Disaster Incident Repository", "completed": True},
            {"stepNumber": 2, "instruction": "Provide post-reunification counseling & relief kit", "completed": True}
        ]

    return {
        "id": f"NBA-{fused_case.get('id')}",
        "caseId": str(fused_case.get("id")),
        "priorityScore": priority_score,
        "urgencyLevel": urgency_level,
        "title": title,
        "description": description,
        "assignedRole": "command_authority" if status in ["VERIFIED", "FAMILY_NOTIFIED"] else "rescue_team",
        "targetFacilityOrTeam": target_facility,
        "contactPhone": contact_phone,
        "status": "PENDING",
        "steps": steps,
        "rationale": rationale,
        "createdAt": fused_case.get("created_at", ""),
        "updatedAt": fused_case.get("updated_at", "")
    }
