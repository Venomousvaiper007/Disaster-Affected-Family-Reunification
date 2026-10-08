import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from backend.app.database.models import (
    DisasterIncident, Organization, Facility, RescueTeam, User,
    MissingReport, FoundPerson, FusedCase, CandidateMatch, TimelineEvent,
    NextBestAction, EmergencyReport, RescueAssignment, Evidence, CaseConflict, AuditLog
)
from backend.app.services.matching import evaluate_candidate_match
from backend.app.services.nba import generate_next_best_action

def seed_demo_data(db: Session):
    # Check if data already exists
    if db.query(DisasterIncident).first():
        print("Database already seeded. Skipping seed.")
        return

    print("Seeding PostgreSQL database with demo data...")

    # 1. Incident
    incident = DisasterIncident(
        id=uuid.uuid4(),
        code="INC-2026-DELTA-01",
        name="Cyclone Vardah — Coastal Flood Impact Zone Delta",
        incident_type="CYCLONE",
        severity="LEVEL_3",
        center_lat=13.0827,
        center_lng=80.2707,
        radius_km=30.0,
        active_helpline="1070 / 1800-425-3333",
        status="ACTIVE",
        started_at=datetime.utcnow() - timedelta(days=1)
    )
    db.add(incident)
    db.flush()

    # 2. Organizations
    orgs = [
        Organization(id=uuid.uuid4(), name="Rajiv Gandhi Govt General Hospital", org_type="HOSPITAL", contact_phone="+91 44 2530 5000", address="EVR Periyar Salai, Park Town"),
        Organization(id=uuid.uuid4(), name="Stanley Trauma Medical Center", org_type="HOSPITAL", contact_phone="+91 44 2528 1351", address="Old Jail Rd, Royapuram"),
        Organization(id=uuid.uuid4(), name="Nehru Indoor Stadium Relief Commission", org_type="SHELTER", contact_phone="+91 44 2561 0222", address="Sydenhams Rd, Periamet"),
        Organization(id=uuid.uuid4(), name="Basin Bridge Community Aid NGO", org_type="NGO", contact_phone="+91 44 2598 4400", address="Basin Bridge High School Ground"),
        Organization(id=uuid.uuid4(), name="National Disaster Response Force (NDRF)", org_type="GOVT", contact_phone="+91 98400 91101", address="Command Staging Base")
    ]
    db.add_all(orgs)
    db.flush()

    # 3. Facilities (5+)
    facilities = [
        Facility(
            id=uuid.uuid4(), incident_id=incident.id,
            name="Government Rajiv Gandhi General Hospital (Zone B)", facility_type="HOSPITAL",
            address="EVR Periyar Salai, Park Town, Sector Delta-1", landmark="Opposite Central Station", sector="Sector Delta-1",
            lat=13.0818, lng=80.2785, phone="+91 44 2530 5000", emergency_contact="+91 44 2530 5111",
            total_capacity=500, current_occupancy=382, available_beds=118, medical_staff_on_duty=48, supplies_status="OPTIMAL"
        ),
        Facility(
            id=uuid.uuid4(), incident_id=incident.id,
            name="Stanley Medical College & Trauma Hospital", facility_type="HOSPITAL",
            address="Old Jail Rd, Royapuram, Sector Delta-2", landmark="North Basin Bridge", sector="Sector Delta-2",
            lat=13.1075, lng=80.2872, phone="+91 44 2528 1351", emergency_contact="+91 44 2528 9999",
            total_capacity=350, current_occupancy=310, available_beds=40, medical_staff_on_duty=32, supplies_status="ADEQUATE"
        ),
        Facility(
            id=uuid.uuid4(), incident_id=incident.id,
            name="Nehru Indoor Stadium Relief Shelter #3", facility_type="SHELTER",
            address="Sydenhams Rd, Periamet, Sector Delta-1", landmark="Near Railway Yard", sector="Sector Delta-1",
            lat=13.0841, lng=80.2725, phone="+91 44 2561 0222", emergency_contact="+91 94440 12345",
            total_capacity=1200, current_occupancy=840, available_beds=360, medical_staff_on_duty=14, supplies_status="OPTIMAL"
        ),
        Facility(
            id=uuid.uuid4(), incident_id=incident.id,
            name="Basin Bridge Community Flood Relief Camp", facility_type="RELIEF_CAMP",
            address="Basin Bridge Junction High School Ground", landmark="Near Water Canal Post", sector="Sector Delta-3",
            lat=13.0984, lng=80.2671, phone="+91 44 2598 4400", emergency_contact="+91 98401 88877",
            total_capacity=800, current_occupancy=670, available_beds=130, medical_staff_on_duty=8, supplies_status="ADEQUATE"
        ),
        Facility(
            id=uuid.uuid4(), incident_id=incident.id,
            name="Royapuram Harbor Sector Relief Field Post #5", facility_type="FIELD_POST",
            address="Royapuram Harbor Gate 3 Road", landmark="Harbor Police Outpost", sector="Sector Delta-2",
            lat=13.1120, lng=80.2910, phone="+91 44 2590 1122", emergency_contact="+91 98400 33445",
            total_capacity=250, current_occupancy=190, available_beds=60, medical_staff_on_duty=5, supplies_status="LOW"
        )
    ]
    db.add_all(facilities)
    db.flush()

    # 4. Rescue Teams (5+)
    rescue_teams = [
        RescueTeam(
            id=uuid.uuid4(), incident_id=incident.id, team_code="NDRF-BOAT-ALPHA-01",
            lead_commander="Capt. R. Soundararajan", phone="+91 98400 91101", members_count=8, specialization="WATER_RESCUE",
            current_lat=13.0892, current_lng=80.2741, current_sector="Sector Delta-1", status="ACTIVE_MISSION"
        ),
        RescueTeam(
            id=uuid.uuid4(), incident_id=incident.id, team_code="SDRF-URBAN-BRAVO-04",
            lead_commander="Inspector Vikram Sen", phone="+91 98400 91102", members_count=6, specialization="URBAN_SEARCH",
            current_lat=13.1012, current_lng=80.2815, current_sector="Sector Delta-2", status="ACTIVE_MISSION"
        ),
        RescueTeam(
            id=uuid.uuid4(), incident_id=incident.id, team_code="DRONE-RECON-CHARLIE-02",
            lead_commander="Tech Officer Priya Nair", phone="+91 98400 91103", members_count=4, specialization="DRONE_SURVEILLANCE",
            current_lat=13.0789, current_lng=80.2644, current_sector="Sector Delta-1", status="STANDBY"
        ),
        RescueTeam(
            id=uuid.uuid4(), incident_id=incident.id, team_code="MEDICAL-EVAC-DELTA-09",
            lead_commander="Dr. Anbarasan K.", phone="+91 98400 91104", members_count=5, specialization="MEDICAL_EVAC",
            current_lat=13.0818, current_lng=80.2785, current_sector="Sector Delta-1", status="STANDBY"
        ),
        RescueTeam(
            id=uuid.uuid4(), incident_id=incident.id, team_code="COASTAL-GUARD-ECHO-03",
            lead_commander="Sub-Inspector M. Selvam", phone="+91 98400 91105", members_count=7, specialization="WATER_RESCUE",
            current_lat=13.1100, current_lng=80.2900, current_sector="Sector Delta-2", status="STANDBY"
        )
    ]
    db.add_all(rescue_teams)
    db.flush()

    # 5. Users
    users = [
        User(id=uuid.uuid4(), full_name="Incident Commander Chief", email="cmd@reunite360.gov", phone="+91 98400 00001", role="ADMIN"),
        User(id=uuid.uuid4(), full_name="Officer K. Ramanathan", email="ramanathan@tnpol.gov", phone="+91 98400 00002", role="RESPONDER"),
        User(id=uuid.uuid4(), full_name="Meena Kumar", email="meena.k@gmail.com", phone="+91 98401 23456", role="FAMILY"),
        User(id=uuid.uuid4(), full_name="Dr. Sunitha Nurse In-charge", email="sunitha@rggh.gov", phone="+91 44 2530 5000", role="ORGANIZATION", facility_id=facilities[0].id),
        User(id=uuid.uuid4(), full_name="Capt. R. Soundararajan", email="soundar@ndrf.gov", phone="+91 98400 91101", role="RESCUE_TEAM", rescue_team_id=rescue_teams[0].id)
    ]
    db.add_all(users)
    db.flush()

    # 6. Hero Missing Reports & Found Records (15-20 records each)
    now = datetime.utcnow()

    # Hero Scenario 1: Missing Ravi Kumar (#R124)
    missing_ravi = MissingReport(
        id=uuid.uuid4(), case_number="#R124", reporter_name="Meena Kumar", reporter_relationship="Wife", reporter_contact="+91 98401 23456",
        full_name="Ravi Kumar", alias_name="Ravi", age=42, gender="MALE", vulnerability="NONE",
        height_cm=172, build="MEDIUM", distinguishing_marks=["Prominent scar on right hand palm", "Mole below left collarbone"],
        clothing_upper="Blue check shirt", clothing_lower="Dark blue denim jeans", footwear="Brown leather sandals",
        accessories=["Silver wrist watch"], languages_spoken=["Tamil", "English", "Hindi"],
        last_seen_address="Chennai Central Railway Station, Platform 4 Sub-way", last_seen_landmark="Near Railway Main Clock Tower",
        last_seen_sector="Sector Delta-1", last_seen_lat=13.0825, last_seen_lng=80.2755,
        last_seen_time=now - timedelta(hours=5), photo_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
        additional_notes="Was waiting to board emergency evacuation train when water surged.", status="POSSIBLE_MATCH"
    )

    # Hero Scenario 1: Found Rescued Male (#F089)
    found_ravi = FoundPerson(
        id=uuid.uuid4(), case_number="#F089", reported_by_role="RESCUE_TEAM", reported_by_name="NDRF Rescue Unit Alpha (Capt. Soundararajan)",
        contact_phone="+91 98400 91101", is_identified=False, estimated_age_min=40, estimated_age_max=45, gender="MALE",
        vulnerability="INJURED", medical_condition="MINOR_INJURIES", is_conscious=True,
        height_cm=170, build="MEDIUM", distinguishing_marks=["Prominent scar on right hand palm", "Bruising on right shoulder"],
        clothing_upper="Blue check shirt (Mud-stained)", clothing_lower="Dark jeans", accessories=["Silver wrist watch"],
        languages_spoken=["Tamil"], medical_condition_notes="Mild hypothermia, right wrist sprain, stable vitals.",
        found_address="Flooded Railway Culvert near Central Station Yard", found_landmark="Near Railway Main Track Bridge",
        found_sector="Sector Delta-1", found_lat=13.0835, found_lng=80.2748, found_time=now - timedelta(hours=4, minutes=15),
        current_facility_id=facilities[0].id, current_facility_type="HOSPITAL", current_facility_name="Government Rajiv Gandhi General Hospital (Zone B)",
        ward_or_bed="Emergency Ward 3, Bed #14", photo_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
        notes="Rescued by boat at 10:40 AM. Transferred to Nehru Stadium Shelter at 11:20 AM, then moved to Rajiv Gandhi Hospital at 1:00 PM for wrist dressing.",
        status="POSSIBLE_MATCH"
    )

    db.add_all([missing_ravi, found_ravi])
    db.flush()

    # Generate Hero Fused Case
    match_eval = evaluate_candidate_match({
        "full_name": missing_ravi.full_name, "age": missing_ravi.age, "gender": missing_ravi.gender, "vulnerability": missing_ravi.vulnerability,
        "height_cm": missing_ravi.height_cm, "traits": {"distinguishingMarks": missing_ravi.distinguishing_marks, "clothingUpper": missing_ravi.clothing_upper},
        "last_seen_location": {"lat": missing_ravi.last_seen_lat, "lng": missing_ravi.last_seen_lng, "address": missing_ravi.last_seen_address},
        "last_seen_time": missing_ravi.last_seen_time.isoformat()
    }, {
        "is_identified": found_ravi.is_identified, "estimated_age_min": found_ravi.estimated_age_min, "estimated_age_max": found_ravi.estimated_age_max,
        "gender": found_ravi.gender, "vulnerability": found_ravi.vulnerability, "height_cm": found_ravi.height_cm,
        "traits": {"distinguishingMarks": found_ravi.distinguishing_marks, "clothingUpper": found_ravi.clothing_upper},
        "found_location": {"lat": found_ravi.found_lat, "lng": found_ravi.found_lng, "address": found_ravi.found_address},
        "found_time": found_ravi.found_time.isoformat()
    })

    hero_case = FusedCase(
        id=uuid.uuid4(), case_number="#R124", title="Ravi Kumar (42y, Male) — Railway Station / RGGH Intake",
        status="POSSIBLE_MATCH", priority="HIGH", vulnerability="NONE",
        missing_report_id=missing_ravi.id, found_person_id=found_ravi.id,
        match_score=match_eval["overallScore"], confidence_label=match_eval["confidenceLabel"],
        score_breakdown=match_eval, supporting_evidence=match_eval["supportingEvidence"],
        conflicting_evidence=match_eval["conflictingEvidence"], missing_information=match_eval["missingInformation"],
        timeline_consistency=match_eval["timelineConsistency"], recommended_verification=match_eval["recommendedVerification"]
    )
    db.add(hero_case)
    db.flush()

    cand_match = CandidateMatch(
        id=uuid.uuid4(), missing_report_id=missing_ravi.id, found_person_id=found_ravi.id,
        overall_score=match_eval["overallScore"], confidence_label=match_eval["confidenceLabel"],
        name_score=match_eval["nameScore"], age_score=match_eval["ageScore"], gender_score=match_eval["genderScore"],
        physical_score=match_eval["physicalScore"], clothing_score=match_eval["clothingScore"],
        location_score=match_eval["locationScore"], timeline_score=match_eval["timelineScore"],
        supporting_evidence=match_eval["supportingEvidence"], conflicting_evidence=match_eval["conflictingEvidence"],
        missing_information=match_eval["missingInformation"], timeline_consistency=match_eval["timelineConsistency"],
        recommended_verification=match_eval["recommendedVerification"]
    )
    db.add(cand_match)

    tl_events = [
        TimelineEvent(id=uuid.uuid4(), fused_case_id=hero_case.id, missing_report_id=missing_ravi.id, event_time=missing_ravi.last_seen_time, source_type="FAMILY", source_name="Meena Kumar (Wife)", title="Last Seen at Railway Station", description="Reported waiting on Platform 4 Subway wearing blue check shirt.", lat=missing_ravi.last_seen_lat, lng=missing_ravi.last_seen_lng, location_name=missing_ravi.last_seen_address, verified=True),
        TimelineEvent(id=uuid.uuid4(), fused_case_id=hero_case.id, found_person_id=found_ravi.id, event_time=found_ravi.found_time, source_type="RESCUE_TEAM", source_name="NDRF Boat Alpha-01", title="Rescued from Flooded Railway Yard", description="Unknown adult male pulled from submerged culvert with wrist sprain and blue shirt.", lat=found_ravi.found_lat, lng=found_ravi.found_lng, location_name=found_ravi.found_address, verified=True),
        TimelineEvent(id=uuid.uuid4(), fused_case_id=hero_case.id, event_time=now - timedelta(hours=3), source_type="SHELTER", source_name="Nehru Stadium Relief Shelter #3", title="Admitted for Triage & Dry Clothes", description="Intake logged unidentified male. Given dry blanket and warm fluids.", lat=facilities[2].lat, lng=facilities[2].lng, location_name=facilities[2].name, verified=True),
        TimelineEvent(id=uuid.uuid4(), fused_case_id=hero_case.id, event_time=now - timedelta(hours=1), source_type="HOSPITAL", source_name="Rajiv Gandhi General Hospital", title="Transferred to Emergency Ward #3, Bed 14", description="Admitted for wrist x-ray and saline infusion. Attending nurse noted distinct right palm scar.", lat=facilities[0].lat, lng=facilities[0].lng, location_name=facilities[0].name, verified=True)
    ]
    db.add_all(tl_events)

    nba_data = generate_next_best_action({"id": str(hero_case.id), "status": "POSSIBLE_MATCH", "vulnerability": "NONE"}, match=match_eval, found={"current_facility_name": facilities[0].name, "contact_phone": facilities[0].phone})
    nba = NextBestAction(
        id=uuid.uuid4(), fused_case_id=hero_case.id, priority_score=nba_data["priorityScore"], urgency_level=nba_data["urgencyLevel"],
        title=nba_data["title"], description=nba_data["description"], assigned_role=nba_data["assignedRole"],
        target_facility_or_team=nba_data["targetFacilityOrTeam"], contact_phone=nba_data["contactPhone"], status="PENDING", steps=nba_data["steps"], rationale=nba_data["rationale"]
    )
    db.add(nba)

    # 15+ Additional Missing & Found Reports for realism
    names = [
        ("Aarav Ramesh", 7, "MALE", "CHILD", "Mother Kavitha", "+91 98402 99881", "Yellow superhero shirt", "Navy shorts"),
        ("K. S. Narayanan", 74, "MALE", "ELDERLY", "Son Senthil", "+91 97900 11223", "White khadi shirt", "White dhoti"),
        ("Ananya Sharma", 26, "FEMALE", "NONE", "Brother Rohit", "+91 99620 44332", "Maroon cotton kurti", "Black leggings"),
        ("Priya Sundaram", 32, "FEMALE", "PREGNANT", "Husband Sundaram", "+91 98403 11223", "Green saree", "Gold bangles"),
        ("Karthik Raja", 19, "MALE", "NONE", "Father Raja", "+91 98404 22334", "Red polo t-shirt", "Blue jeans"),
        ("Lakshmi Ammal", 81, "FEMALE", "ELDERLY", "Daughter Banu", "+91 98405 33445", "Yellow silk saree", "Spectacles"),
        ("Deepak V.", 29, "MALE", "DISABLED", "Wife Sudha", "+91 98406 44556", "Grey shirt", "Black pants"),
        ("Venkatesh Prasad", 50, "MALE", "NONE", "Son Vignesh", "+91 98407 55667", "Checkered shirt", "Khaki trousers"),
        ("Savitri Devi", 65, "FEMALE", "ELDERLY", "Son Rahul", "+91 98408 66778", "Blue printed saree", "Gold chain"),
        ("Nithin Kumar", 10, "MALE", "CHILD", "Father Kumar", "+91 98409 77889", "Orange t-shirt", "Black shorts"),
        ("Geetha Mohan", 38, "FEMALE", "NONE", "Husband Mohan", "+91 98410 88990", "Pink salwar suit", "Watch"),
        ("Manish Verma", 45, "MALE", "INJURED", "Wife Sunita", "+91 98411 99001", "White linen shirt", "Jeans"),
        ("Bhavana Reddy", 22, "FEMALE", "NONE", "Mother Swathi", "+91 98412 10112", "Black top", "Denim skirt"),
        ("Ganesh Moorthy", 58, "MALE", "NONE", "Son Ashwin", "+91 98413 21223", "Brown shirt", "Grey trousers"),
        ("Saravanan P.", 35, "MALE", "NONE", "Wife Malathi", "+91 98414 32334", "Striped shirt", "Blue jeans")
    ]

    for idx, (m_name, age, g, vuln, rep, phone, upper, lower) in enumerate(names, start=2):
        case_num = f"#M{str(idx).zfill(3)}"
        m_rec = MissingReport(
            id=uuid.uuid4(), case_number=case_num, reporter_name=rep, reporter_relationship="Relative", reporter_contact=phone,
            full_name=m_name, age=age, gender=g, vulnerability=vuln,
            height_cm=160 + (idx % 20), build="MEDIUM", distinguishing_marks=["Scars or birthmark noted"],
            clothing_upper=upper, clothing_lower=lower,
            last_seen_address=f"Disaster Evacuation Sector Delta-{(idx % 4) + 1}", last_seen_lat=13.08 + (idx * 0.002), last_seen_lng=80.27 + (idx * 0.002),
            last_seen_time=now - timedelta(hours=idx * 2), status="UNVERIFIED"
        )
        f_rec = FoundPerson(
            id=uuid.uuid4(), case_number=f"#F{str(idx + 10).zfill(3)}", reported_by_role="SHELTER", reported_by_name=facilities[idx % 5].name,
            contact_phone=facilities[idx % 5].phone, is_identified=False, estimated_age_min=age - 2, estimated_age_max=age + 2,
            gender=g, vulnerability=vuln, medical_condition="STABLE",
            found_address=f"Relief Post Sector Delta-{(idx % 4) + 1}", found_lat=13.08 + (idx * 0.002) + 0.001, found_lng=80.27 + (idx * 0.002) + 0.001,
            found_time=now - timedelta(hours=idx * 2 - 1), current_facility_id=facilities[idx % 5].id,
            current_facility_type=facilities[idx % 5].facility_type, current_facility_name=facilities[idx % 5].name,
            status="UNVERIFIED"
        )
        db.add_all([m_rec, f_rec])

    db.flush()

    # Hero Scenario 2: Emergency ER-1042
    er_1042 = EmergencyReport(
        id=uuid.uuid4(), emergency_code="ER-1042", reporter_name="Kannan S. (Citizen)", reporter_contact="+91 94440 99887",
        location_address="Wall Tax Road Flooded Apartment Building #14, Basin Bridge", lat=13.0950, lng=80.2680, sector="Sector Delta-3",
        people_trapped_count=3, critically_injured_count=1, has_unverified_fatality=False, fatality_status="NONE",
        description="3 people trapped on 1st floor balcony due to rising flood waters. 1 elderly person critically injured from fall.",
        priority="CRITICAL", status="ASSIGNED"
    )
    db.add(er_1042)
    db.flush()

    rescue_assign = RescueAssignment(
        id=uuid.uuid4(), emergency_report_id=er_1042.id, rescue_team_id=rescue_teams[0].id,
        status="DISPATCHED", field_notes="Team Alpha motorboat dispatched to Wall Tax Road staging location."
    )
    db.add(rescue_assign)

    # 10-15 Additional Emergency Reports
    er_data = [
        ("ER-1043", "Ramesh K.", "+91 98401 11111", "Basin Bridge Bus Terminus", 13.0980, 80.2690, 5, 0, False, "Submerged bus stop shelter with stranded passengers."),
        ("ER-1044", "Priya N.", "+91 98402 22222", "Royapuram Coastal Colony Street 2", 13.1050, 80.2850, 2, 1, True, "Structural roof collapse reported. 1 person trapped under beams."),
        ("ER-1045", "Senthil P.", "+91 98403 33333", "Central Railway Subway Approach", 13.0830, 80.2760, 0, 2, False, "Two pedestrians washed into culvert drainage."),
        ("ER-1046", "Gita R.", "+91 98404 44444", "Periamet Commercial Complex Level -1", 13.0850, 80.2730, 4, 0, False, "Basement power generator flooded, occupants trapped in lift."),
        ("ER-1047", "Murugan T.", "+91 98405 55555", "Old Jail Road High School Relief Booth", 13.1080, 80.2880, 1, 0, False, "Request medical assistance for diabetic senior citizen.")
    ]
    for code, rep, phone, loc, lat, lng, trapped, inj, fatality, desc in er_data:
        er = EmergencyReport(
            id=uuid.uuid4(), emergency_code=code, reporter_name=rep, reporter_contact=phone,
            location_address=loc, lat=lat, lng=lng, sector="Sector Delta-1",
            people_trapped_count=trapped, critically_injured_count=inj, has_unverified_fatality=fatality,
            fatality_status="POSSIBLE FATALITY — UNVERIFIED" if fatality else "NONE",
            description=desc, priority="CRITICAL" if (inj > 0 or trapped >= 3) else "HIGH", status="REPORTED"
        )
        db.add(er)

    # Case Conflicts (Phase 10 demo)
    conflict = CaseConflict(
        id=uuid.uuid4(), fused_case_id=hero_case.id,
        title="Location/Intake Conflict for Ravi Kumar",
        description="Shelter desk recorded arrival at 11:20 AM while Hospital emergency triage reported admission at 1:00 PM. Verification required on intermediate ambulance transit.",
        severity="MEDIUM", status="OPEN", related_event_ids=[str(tl_events[2].id), str(tl_events[3].id)]
    )
    db.add(conflict)

    # Audit Logs (Phase 14)
    audit1 = AuditLog(id=uuid.uuid4(), actor_name="Meena Kumar", actor_role="FAMILY", action="MISSING_REPORT_CREATED", fused_case_id=hero_case.id, details="Missing report filed for Ravi Kumar (#R124).")
    audit2 = AuditLog(id=uuid.uuid4(), actor_name="Capt. R. Soundararajan", actor_role="RESCUE_TEAM", action="FOUND_PERSON_LOGGED", fused_case_id=hero_case.id, details="Logged rescued male (#F089) near Central Railway Culvert.")
    audit3 = AuditLog(id=uuid.uuid4(), actor_name="AI Fusion Engine", actor_role="ADMIN", action="FUSION_MATCH_CALCULATED", fused_case_id=hero_case.id, details=f"Calculated {match_eval['overallScore']}% score between #R124 and #F089.")
    db.add_all([audit1, audit2, audit3])

    db.commit()
    print("Database seeding completed successfully!")
