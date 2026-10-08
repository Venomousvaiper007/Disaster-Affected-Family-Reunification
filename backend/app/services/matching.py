import math
from datetime import datetime

def levenshtein_distance(a: str, b: str) -> int:
    if not a: return len(b) if b else 0
    if not b: return len(a)
    a, b = a.lower(), b.lower()
    matrix = [[0] * (len(a) + 1) for _ in range(len(b) + 1)]
    for i in range(len(b) + 1): matrix[i][0] = i
    for j in range(len(a) + 1): matrix[0][j] = j
    for i in range(1, len(b) + 1):
        for j in range(1, len(a) + 1):
            if b[i-1] == a[j-1]:
                matrix[i][j] = matrix[i-1][j-1]
            else:
                matrix[i][j] = min(matrix[i-1][j-1] + 1, matrix[i][j-1] + 1, matrix[i-1][j] + 1)
    return matrix[len(b)][len(a)]

def string_similarity(s1: str, s2: str) -> float:
    if not s1 or not s2: return 0.0
    str1, str2 = s1.strip().lower(), s2.strip().lower()
    if str1 == str2: return 1.0
    dist = levenshtein_distance(str1, str2)
    max_len = max(len(str1), len(str2))
    return max(0.0, 1.0 - (dist / max_len))

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def evaluate_candidate_match(missing_dict: dict, found_dict: dict) -> dict:
    matched_factors = []
    conflicting_factors = []
    missing_factors = []
    recommended_verification = []

    # 1. Name score (20%)
    name_score = 50.0
    is_identified = found_dict.get("is_identified") or found_dict.get("isIdentified")
    given_name = found_dict.get("given_name") or found_dict.get("givenName")
    missing_name = missing_dict.get("full_name") or missing_dict.get("fullName") or ""

    if is_identified and given_name:
        sim = string_similarity(missing_name, given_name)
        name_score = sim * 100.0
        if sim >= 0.8:
            matched_factors.append(f"Name match: '{missing_name}' ≈ '{given_name}'")
        elif sim < 0.3:
            conflicting_factors.append({
                "field": "Name",
                "missingRecordValue": missing_name,
                "foundRecordValue": given_name,
                "explanation": f"Given name '{given_name}' differs from missing name '{missing_name}'",
                "severity": "MEDIUM"
            })
    else:
        missing_factors.append("Rescued individual is currently unidentified / unable to state name")
        name_score = 70.0 # High neutrality when unidentified

    # 2. Gender score (10%)
    gender_score = 100.0
    m_gender = missing_dict.get("gender", "UNKNOWN")
    f_gender = found_dict.get("gender", "UNKNOWN")
    if f_gender != "UNKNOWN" and m_gender != "UNKNOWN":
        if m_gender == f_gender:
            gender_score = 100.0
            matched_factors.append(f"Gender match: {m_gender}")
        else:
            gender_score = 10.0
            conflicting_factors.append({
                "field": "Gender",
                "missingRecordValue": m_gender,
                "foundRecordValue": f_gender,
                "explanation": f"Gender mismatch ({m_gender} vs {f_gender})",
                "severity": "HIGH"
            })
    else:
        missing_factors.append("Gender is UNKNOWN on record")
        gender_score = 80.0

    # 3. Age score (15%) - UNKNOWN / approximate is NOT mismatch!
    age_score = 80.0
    m_age = missing_dict.get("age", 30)
    f_min = found_dict.get("estimated_age_min") or found_dict.get("estimatedAgeMin")
    f_max = found_dict.get("estimated_age_max") or found_dict.get("estimatedAgeMax")
    
    if f_min is not None and f_max is not None:
        if f_min <= m_age <= f_max:
            age_score = 100.0
            matched_factors.append(f"Age {m_age} falls in intake range ({f_min}–{f_max} yrs)")
        else:
            diff = min(abs(m_age - f_min), abs(m_age - f_max))
            if diff <= 3:
                age_score = 85.0
                matched_factors.append(f"Age is within triage tolerance (±{diff} yrs)")
            else:
                age_score = max(20.0, 100.0 - diff * 12.0)
                conflicting_factors.append({
                    "field": "Age",
                    "missingRecordValue": f"{m_age} years",
                    "foundRecordValue": f"{f_min}–{f_max} years",
                    "explanation": f"Age variance of {diff} years",
                    "severity": "HIGH" if diff > 10 else "LOW"
                })
    else:
        missing_factors.append("Found record lacks estimated age range")
        age_score = 75.0

    # 4. Height score (10%)
    m_traits = missing_dict.get("traits", {})
    f_traits = found_dict.get("traits", {})
    m_height = missing_dict.get("height_cm") or m_traits.get("heightCm")
    f_height = found_dict.get("height_cm") or f_traits.get("heightCm")
    height_score = 80.0
    if m_height and f_height:
        diff = abs(m_height - f_height)
        if diff <= 4:
            height_score = 100.0
            matched_factors.append(f"Height match ({m_height} cm vs {f_height} cm)")
        elif diff <= 10:
            height_score = 80.0
        else:
            height_score = 40.0
            conflicting_factors.append({
                "field": "Height",
                "missingRecordValue": f"{m_height} cm",
                "foundRecordValue": f"{f_height} cm",
                "explanation": f"Height difference of {diff} cm",
                "severity": "LOW"
            })
    else:
        missing_factors.append("Height missing on one or both records")
        height_score = 75.0

    # 5. Physical features & marks (20%)
    m_marks = m_traits.get("distinguishingMarks") or missing_dict.get("distinguishing_marks") or []
    f_marks = f_traits.get("distinguishingMarks") or found_dict.get("distinguishing_marks") or []
    physical_score = 70.0
    if m_marks and f_marks:
        mark_matches = 0
        for m_m in m_marks:
            for f_m in f_marks:
                if string_similarity(str(m_m), str(f_m)) > 0.5 or any(w in str(f_m).lower() for w in str(m_m).lower().split() if len(w) > 3):
                    mark_matches += 1
                    matched_factors.append(f"Distinguishing mark match: '{m_m}' ≈ '{f_m}'")
        if mark_matches > 0:
            physical_score = 98.0
        else:
            physical_score = 65.0
    elif m_marks and not f_marks:
        missing_factors.append(f"Missing report lists mark: '{', '.join(m_marks)}', pending inspection at facility")
        recommended_verification.append(f"Inspect individual for mark: '{', '.join(m_marks)}'")
        physical_score = 75.0
    else:
        physical_score = 80.0

    # 6. Clothing score (5%)
    m_upper = m_traits.get("clothingUpper") or missing_dict.get("clothing_upper") or ""
    f_upper = f_traits.get("clothingUpper") or found_dict.get("clothing_upper") or ""
    clothing_score = 75.0
    if m_upper and f_upper:
        if string_similarity(m_upper, f_upper) > 0.5 or (m_upper.lower() in f_upper.lower() or f_upper.lower() in m_upper.lower()):
            clothing_score = 95.0
            matched_factors.append(f"Clothing matches: '{m_upper}' ≈ '{f_upper}'")
        else:
            clothing_score = 55.0
            conflicting_factors.append({
                "field": "Clothing",
                "missingRecordValue": m_upper,
                "foundRecordValue": f_upper,
                "explanation": f"Clothing differs: reported '{m_upper}' vs intake '{f_upper}' (Displaced persons often receive relief apparel)",
                "severity": "LOW"
            })
    else:
        missing_factors.append("Clothing description incomplete")
        clothing_score = 70.0

    # 7. Location score (10%)
    m_loc = missing_dict.get("lastSeenLocation") or missing_dict.get("last_seen_location") or {}
    f_loc = found_dict.get("foundLocation") or found_dict.get("found_location") or {}
    m_lat = m_loc.get("lat") or missing_dict.get("last_seen_lat", 13.0827)
    m_lng = m_loc.get("lng") or missing_dict.get("last_seen_lng", 80.2707)
    f_lat = f_loc.get("lat") or found_dict.get("found_lat", 13.0827)
    f_lng = f_loc.get("lng") or found_dict.get("found_lng", 80.2707)

    dist_km = haversine_km(m_lat, m_lng, f_lat, f_lng)
    location_score = 80.0
    if dist_km <= 3.0:
        location_score = 98.0
        matched_factors.append(f"High proximity: Found within {dist_km:.1f} km of last seen site")
    elif dist_km <= 15.0:
        location_score = 85.0
        matched_factors.append(f"Within regional evacuation corridor ({dist_km:.1f} km)")
    else:
        location_score = 50.0
        conflicting_factors.append({
            "field": "Location",
            "missingRecordValue": m_loc.get("address", "Last Seen"),
            "foundRecordValue": f_loc.get("address", "Found Site"),
            "explanation": f"Distance is {dist_km:.1f} km apart",
            "severity": "MEDIUM"
        })

    # 8. Time score (10%)
    timeline_score = 90.0
    m_time_str = missing_dict.get("last_seen_time") or missing_dict.get("lastSeenTime")
    f_time_str = found_dict.get("found_time") or found_dict.get("foundTime")
    timeline_consistency = "CONSISTENT"

    if m_time_str and f_time_str:
        try:
            m_dt = datetime.fromisoformat(str(m_time_str).replace("Z", "+00:00"))
            f_dt = datetime.fromisoformat(str(f_time_str).replace("Z", "+00:00"))
            if f_dt >= m_dt:
                hours_diff = (f_dt - m_dt).total_seconds() / 3600.0
                if hours_diff <= 48:
                    timeline_score = 100.0
                    matched_factors.append(f"Timeline valid: Rescued {hours_diff:.1f} hrs post-disappearance")
                else:
                    timeline_score = 85.0
                    timeline_consistency = "PLAUSIBLE"
            else:
                timeline_score = 20.0
                timeline_consistency = "IMPOSSIBLE"
                conflicting_factors.append({
                    "field": "Timeline",
                    "missingRecordValue": str(m_time_str),
                    "foundRecordValue": str(f_time_str),
                    "explanation": "Intake timestamp precedes reported disappearance time",
                    "severity": "HIGH"
                })
        except Exception:
            timeline_score = 80.0

    # Weighted Sum according to specification:
    # Name: 20%, Age: 15%, Gender: 10%, Height: 10%, Physical: 20%, Clothing: 5%, Location: 10%, Time: 10%
    raw_score = (
        name_score * 0.20 +
        age_score * 0.15 +
        gender_score * 0.10 +
        height_score * 0.10 +
        physical_score * 0.20 +
        clothing_score * 0.05 +
        location_score * 0.10 +
        timeline_score * 0.10
    )

    penalty = 0.0
    for c in conflicting_factors:
        if c.get("severity") == "HIGH": penalty += 18.0
        elif c.get("severity") == "MEDIUM": penalty += 8.0

    final_score = int(max(10.0, min(99.0, round(raw_score - penalty))))

    confidence_label = "LOW"
    if final_score >= 85: confidence_label = "VERY_HIGH"
    elif final_score >= 70: confidence_label = "HIGH"
    elif final_score >= 50: confidence_label = "MODERATE"

    evidence_quality = "HIGH" if len(matched_factors) >= 3 else ("MEDIUM" if len(matched_factors) >= 1 else "LOW")
    freshness_quality = "OPTIMAL"

    return {
        "rawMatchScore": final_score,
        "overallScore": final_score,
        "confidenceLabel": confidence_label,
        "matchedFactors": matched_factors,
        "missingFactors": missing_factors,
        "conflictingFactors": conflicting_factors,
        "supportingEvidence": matched_factors,
        "conflictingEvidence": conflicting_factors,
        "missingInformation": missing_factors,
        "evidenceQuality": evidence_quality,
        "freshnessQuality": freshness_quality,
        "systemConfidence": f"{confidence_label} — Potential match awaiting human verification",
        "nameScore": int(name_score),
        "ageScore": int(age_score),
        "genderScore": int(gender_score),
        "physicalScore": int(physical_score),
        "clothingScore": int(clothing_score),
        "locationScore": int(location_score),
        "timelineScore": int(timeline_score),
        "timelineConsistency": timeline_consistency,
        "recommendedVerification": recommended_verification
    }

