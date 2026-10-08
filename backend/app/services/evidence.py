SOURCE_RELIABILITY_WEIGHTS = {
    "HOSPITAL": 0.95,
    "ORGANIZATION": 0.85,
    "SHELTER": 0.85,
    "RESPONDER": 0.75,
    "RESCUE_TEAM": 0.75,
    "AUTHORITY": 0.90,
    "CITIZEN": 0.50,
    "FAMILY": 0.60
}

def calculate_evidence_reliability(source_type: str) -> float:
    return SOURCE_RELIABILITY_WEIGHTS.get(source_type.upper(), 0.50)
