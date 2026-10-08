def compute_case_priority_label(vulnerability: str, urgency: str = None, match_score: int = 0) -> str:
    if vulnerability in ["CHILD", "ELDERLY", "INJURED", "PREGNANT"] or urgency == "CRITICAL":
        return "CRITICAL"
    if match_score >= 80 or urgency == "HIGH":
        return "HIGH"
    if match_score >= 50 or urgency == "MEDIUM":
        return "MEDIUM"
    return "LOW"
