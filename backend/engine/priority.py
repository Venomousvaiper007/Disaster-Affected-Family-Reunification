def calculate_case_priority(case_dict: dict, related_info: dict = None) -> dict:
    """
    Calculates transparent priority score and returns classification + recommended next actions.
    """
    if not related_info:
        related_info = {}
        
    score = 30.0 # Base score
    factors = []
    
    vulnerability = related_info.get("vulnerability", "GENERAL_ADULT")
    vuln_weights = {
        "CHILD": 25,
        "ELDERLY": 20,
        "INJURED": 25,
        "DISABLED": 20,
        "PREGNANT": 20,
        "GENERAL_ADULT": 5
    }
    v_boost = vuln_weights.get(vulnerability, 5)
    score += v_boost
    if v_boost >= 20:
        factors.append(f"+{v_boost} Vulnerable Person ({vulnerability})")

    emergency_type = related_info.get("emergency_type")
    if emergency_type:
        em_weights = {
            "PERSON_IN_DANGER": 40,
            "PERSON_TRAPPED": 45,
            "INJURED_PERSON": 35,
            "MULTIPLE_PEOPLE": 40,
            "POSSIBLE_FATALITY": 35,
            "STRUCTURAL_DANGER": 30,
            "OTHER": 15
        }
        em_boost = em_weights.get(emergency_type, 20)
        score += em_boost
        factors.append(f"+{em_boost} Critical Emergency ({emergency_type.replace('_', ' ')})")

    if case_dict.get("conflict_flag"):
        score += 15
        factors.append("+15 Contradictory Information Conflict")

    match_score = related_info.get("highest_match_score", 0.0)
    if match_score >= 85.0:
        score += 20
        factors.append(f"+20 Strong Match Pending Verification ({int(match_score)}%)")
    elif match_score >= 60.0:
        score += 10
        factors.append(f"+10 Possible Match Found ({int(match_score)}%)")

    reliability = case_dict.get("reliability", "MEDIUM")
    if reliability == "HIGH":
        score += 5
    elif reliability == "LOW":
        score += 10
        factors.append("+10 Low Reliability Report Needs Verification")

    score = min(max(round(score, 1), 0.0), 100.0)

    if score >= 80.0:
        priority_label = "CRITICAL"
        color = "red"
    elif score >= 60.0:
        priority_label = "HIGH"
        color = "amber"
    elif score >= 40.0:
        priority_label = "MEDIUM"
        color = "yellow"
    else:
        priority_label = "LOW"
        color = "green"

    # Generate Next-Best-Action recommendations
    actions = []
    case_type = case_dict.get("case_type")

    if emergency_type or case_type == "EMERGENCY":
        actions.append("Dispatch nearest available Rescue Team (Team Alpha / Team Beta)")
        actions.append("Establish GPS contact and verify headcount on scene")
        actions.append("Coordinate medical triage or shelter transfer upon rescue")
    elif match_score >= 85.0:
        actions.append("Contact holding facility / shelter manager for physical verification")
        actions.append("Cross-check scar / physical identifier with family representative")
        actions.append("Upload recent verified photograph to case file")
        actions.append("Trigger automated family status notification upon confirmation")
    elif case_dict.get("conflict_flag"):
        actions.append("Review timeline log conflict between reported locations")
        actions.append("Contact reporting agency to verify latest physical location")
        actions.append("Reconcile timestamp sequence before updating case state")
    elif case_type == "MISSING":
        actions.append("Broadcast inquiry to nearby hospital intake registers & relief camps")
        actions.append("Run automatic matching cycle against newly registered found persons")
        actions.append("Verify last known location coordinates with local rescue teams")
    else:
        actions.append("Verify registration log details with intake officer")
        actions.append("Cross-reference with missing person reports")

    return {
        "priority": priority_label,
        "priority_score": score,
        "color": color,
        "factors": factors,
        "next_actions": actions
    }
