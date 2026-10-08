def validate_status_transition(current_status: str, target_status: str, user_role: str) -> dict:
    state_order = [
        "UNVERIFIED",
        "POSSIBLE_MATCH",
        "UNDER_VERIFICATION",
        "VERIFIED",
        "FAMILY_NOTIFIED",
        "REUNITED",
        "CLOSED"
    ]

    if target_status not in state_order:
        return {"allowed": False, "reason": f"Unknown target status: {target_status}"}

    cur_idx = state_order.index(current_status) if current_status in state_order else 0
    target_idx = state_order.index(target_status)

    if target_status == "CLOSED":
        if user_role in ["ADMIN", "command_authority"]:
            return {"allowed": True}
        return {"allowed": False, "reason": "Only ADMIN / Command Authority can mark a case as CLOSED."}

    if target_idx <= cur_idx and user_role not in ["ADMIN", "command_authority"]:
        return {"allowed": False, "reason": "Cannot move case backwards without Incident Commander authorization."}

    if target_status == "UNDER_VERIFICATION":
        if user_role in ["RESCUE_TEAM", "RESPONDER", "ORGANIZATION", "ADMIN", "hospital_shelter", "command_authority"]:
            return {"allowed": True}
        return {"allowed": False, "reason": "Only responders, hospital staff, or admins can begin verification."}

    if target_status == "VERIFIED":
        if user_role in ["ORGANIZATION", "ADMIN", "hospital_shelter", "command_authority"]:
            return {"allowed": True}
        return {"allowed": False, "reason": "Official verification requires Hospital Supervisor or Incident Commander authorization."}

    if target_status == "FAMILY_NOTIFIED":
        if current_status != "VERIFIED" and user_role not in ["ADMIN", "command_authority"]:
            return {"allowed": False, "reason": "CRITICAL SAFETY RULE: Cannot notify family before official verification is complete!"}
        return {"allowed": True}

    if target_status == "REUNITED":
        if current_status not in ["FAMILY_NOTIFIED", "VERIFIED"] and user_role not in ["ADMIN", "command_authority"]:
            return {"allowed": False, "reason": "Must complete verification and family contact before final reunification handover."}
        return {"allowed": True}

    return {"allowed": True}

def get_safe_family_case_view(fused_case_dict: dict) -> dict:
    missing = fused_case_dict.get("missingReport") or {}
    status = fused_case_dict.get("status", "UNVERIFIED")

    safe_status = "Active Search Underway"
    safe_location = "Coordinated Search Zone"
    safe_next_step = "Emergency units are actively checking regional intake records."
    show_found_details = False

    if status == "UNVERIFIED":
        safe_status = "Searching Intake Registries"
        safe_location = missing.get("lastSeenLocation", {}).get("landmark") or "Disaster Region"
        safe_next_step = "Automated record matching active across all operational relief centers."
    elif status == "POSSIBLE_MATCH":
        safe_status = "Potential Lead Under Review"
        safe_location = "Regional Verification In Progress"
        safe_next_step = "Field officers are reviewing matching records. Standby for official confirmation."
    elif status == "UNDER_VERIFICATION":
        safe_status = "Official Verification In Progress"
        safe_location = "Designated Relief / Medical Center"
        safe_next_step = "A certified responder is verifying physical identification at the center."
    elif status in ["VERIFIED", "FAMILY_NOTIFIED"]:
        safe_status = "Person Located & Verified Safe"
        found_rec = fused_case_dict.get("foundRecord") or {}
        safe_location = found_rec.get("currentFacilityName") or "Designated Hospital / Shelter"
        safe_next_step = "Designated family contact coordinator is reaching out to arrange safe pickup."
        show_found_details = True
    elif status == "REUNITED":
        safe_status = "Reunited with Family"
        safe_location = "Relief Station"
        safe_next_step = "Case completed. Support & welfare services available 24/7."
        show_found_details = True
    elif status == "CLOSED":
        safe_status = "Case Completed & Closed"
        safe_location = "Archived"
        safe_next_step = "Case resolved."

    return {
        "caseNumber": fused_case_dict.get("caseNumber"),
        "personName": missing.get("fullName") or "Registered Individual",
        "status": status,
        "safeStatusBadge": safe_status,
        "safeLocation": safe_location,
        "safeNextStep": safe_next_step,
        "lastUpdated": fused_case_dict.get("updatedAt"),
        "showFoundDetails": show_found_details,
        "timeline": fused_case_dict.get("timeline", [])
    }
