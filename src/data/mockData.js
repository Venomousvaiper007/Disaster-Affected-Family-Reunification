// Rich Multi-Region Mock Dataset for Reunite360 Command Centre

export const mockOperations = [
  {
    id: "OP-ALL-INDIA",
    name: "Nationwide Disaster Response Grid (All Sectors)",
    region: "Pan-India Unified Command Network",
    status: "ACTIVE_LEVEL_4",
    startedAt: "2026-10-05 00:00 AM",
    coordinates: [15.5000, 78.5000],
    zoom: 6,
    leadAgency: "National Disaster Management Authority (NDMA) & NDRF"
  },
  {
    id: "OP-2026-MICH",
    name: "Cyclone Michaung Floods — Chennai & Cuddalore Sector",
    region: "Tamil Nadu Coastal Belt (Chennai, Velachery, Saidapet, Cuddalore)",
    status: "ACTIVE_LEVEL_4",
    startedAt: "2026-10-06 04:30 AM",
    coordinates: [13.0827, 80.2707],
    zoom: 12,
    leadAgency: "Tamil Nadu Disaster Management Authority & NDRF"
  },
  {
    id: "OP-2026-WAYA",
    name: "Wayanad Landslide Rapid Response Sector",
    region: "Meppadi, Chooralmala & Mundakkai Hills, Wayanad, Kerala",
    status: "ACTIVE_LEVEL_4",
    startedAt: "2026-09-28 08:00 AM",
    coordinates: [11.5564, 76.1320],
    zoom: 13,
    leadAgency: "Kerala State Disaster Management Authority & SDRF"
  },
  {
    id: "OP-2026-GODA",
    name: "Godavari Inundation & Flash Flood Sector",
    region: "Rajahmundry, Bhadrachalam & Konaseema, AP & Telangana",
    status: "MONITORING_LEVEL_3",
    startedAt: "2026-10-01 06:00 AM",
    coordinates: [17.0005, 81.8040],
    zoom: 11,
    leadAgency: "AP State Disaster Management Authority & SDRF"
  },
  {
    id: "OP-2026-BLRU",
    name: "Bengaluru Urban Waterlogging Sector",
    region: "Bellandur, Mahadevapura & Sarjapur Corridor, Bengaluru, Karnataka",
    status: "OPERATIONAL",
    startedAt: "2026-10-04 10:00 AM",
    coordinates: [12.9352, 77.6245],
    zoom: 12,
    leadAgency: "Karnataka State Natural Disaster Monitoring Centre"
  },
  {
    id: "OP-2026-DLHI",
    name: "Delhi Yamuna Basin Flood Relief Sector",
    region: "Kashmere Gate, Yamuna Bazar & Mayur Vihar, Delhi NCR",
    status: "STANDBY_MONITORING",
    startedAt: "2026-10-03 12:00 PM",
    coordinates: [28.6692, 77.2315],
    zoom: 12,
    leadAgency: "Delhi Disaster Management Authority (DDMA)"
  }
];

export const mockResponders = [
  { id: "RESP-01", name: "Commander Rajesh Kumar", role: "Incident Commander", agency: "NDRF 04 Battalion", activeCases: 8, badge: "CMD-901", sector: "Chennai & Wayanad" },
  { id: "RESP-02", name: "Officer Priya Sundaram", role: "Social Welfare Lead", agency: "TNDMA Family Support", activeCases: 12, badge: "SW-412", sector: "Velachery Base" },
  { id: "RESP-03", name: "Dr. Arvind Menon", role: "Medical Liaison Officer", agency: "Govt. Stanley Hospital Trauma", activeCases: 5, badge: "MED-108", sector: "Triage Ward" },
  { id: "RESP-04", name: "Inspector K. Selvam", role: "Field Response Team Leader", agency: "TN Fire & Rescue Services", activeCases: 7, badge: "FRS-330", sector: "Adyar Basin" },
  { id: "RESP-05", name: "Meenakshi Ram", role: "Volunteer Coordinator", agency: "Indian Red Cross Alpha", activeCases: 4, badge: "VOL-087", sector: "Cuddalore Port" },
  { id: "RESP-06", name: "Capt. Shaji Varghese", role: "Wayanad Field Commander", agency: "Kerala SDRF Squad 01", activeCases: 6, badge: "KSD-204", sector: "Meppadi Chooralmala" },
  { id: "RESP-07", name: "Inspector Suresh Reddy", role: "AP Disaster Response Officer", agency: "AP SDRF Unit 3", activeCases: 5, badge: "AP-512", sector: "Godavari Sector" }
];

export const mockShelters = [
  // Chennai / Tamil Nadu Shelters
  {
    id: "SHL-01",
    name: "Velachery Community Relief Center",
    location: "Velachery Main Road, Chennai, Tamil Nadu",
    coordinates: [12.9759, 80.2212],
    capacity: 450,
    occupancy: 382,
    contactPerson: "Capt. Murugan (98401-23456)",
    hasMedicalPost: true,
    hasChildCare: true,
    status: "OPERATIONAL",
    lastSynced: "3 mins ago"
  },
  {
    id: "SHL-02",
    name: "St. Thomas Mount Evacuation Shelter",
    location: "Mount-Poonamallee High Rd, Chennai, Tamil Nadu",
    coordinates: [13.0033, 80.1983],
    capacity: 600,
    occupancy: 510,
    contactPerson: "Sister Anitha (94440-98712)",
    hasMedicalPost: true,
    hasChildCare: true,
    status: "OPERATIONAL",
    lastSynced: "10 mins ago"
  },
  {
    id: "SHL-03",
    name: "Saidapet Government Higher Secondary School",
    location: "Jones Road, Saidapet, Chennai, Tamil Nadu",
    coordinates: [13.0213, 80.2231],
    capacity: 350,
    occupancy: 340,
    contactPerson: "Mr. Ganesan (98410-55432)",
    hasMedicalPost: false,
    hasChildCare: true,
    status: "NEAR_CAPACITY",
    lastSynced: "1 min ago"
  },
  {
    id: "SHL-04",
    name: "Tambaram Sanatorium Relief Camp",
    location: "GST Road, Tambaram Sanatorium, Chennai, Tamil Nadu",
    coordinates: [12.9348, 80.1342],
    capacity: 500,
    occupancy: 280,
    contactPerson: "Officer Senthil (97900-11223)",
    hasMedicalPost: true,
    hasChildCare: false,
    status: "OPERATIONAL",
    lastSynced: "15 mins ago"
  },
  {
    id: "SHL-05",
    name: "Cuddalore Port Cyclone Relief Centre",
    location: "Old Town, Cuddalore Harbour, Tamil Nadu",
    coordinates: [11.7480, 79.7714],
    capacity: 800,
    occupancy: 690,
    contactPerson: "Tahsildar Ramanathan (94432-88776)",
    hasMedicalPost: true,
    hasChildCare: true,
    status: "OPERATIONAL",
    lastSynced: "25 mins ago"
  },

  // Wayanad / Kerala Shelters
  {
    id: "SHL-06",
    name: "Meppadi Govt Higher Secondary School Camp",
    location: "Meppadi Town, Wayanad, Kerala",
    coordinates: [11.5510, 76.1265],
    capacity: 550,
    occupancy: 480,
    contactPerson: "Dr. Mathew Joseph (94471-12345)",
    hasMedicalPost: true,
    hasChildCare: true,
    status: "OPERATIONAL",
    lastSynced: "5 mins ago"
  },
  {
    id: "SHL-07",
    name: "Chooralmala St. Sebastian Relief Base",
    location: "Chooralmala Junction, Wayanad, Kerala",
    coordinates: [11.5360, 76.1680],
    capacity: 400,
    occupancy: 365,
    contactPerson: "Sister Rosily (94462-87654)",
    hasMedicalPost: true,
    hasChildCare: true,
    status: "NEAR_CAPACITY",
    lastSynced: "8 mins ago"
  },
  {
    id: "SHL-08",
    name: "Kalpetta Municipal Community Hall Camp",
    location: "Main Road, Kalpetta, Wayanad, Kerala",
    coordinates: [11.6080, 76.0820],
    capacity: 700,
    occupancy: 420,
    contactPerson: "Officer Vijayan (98470-44332)",
    hasMedicalPost: true,
    hasChildCare: true,
    status: "OPERATIONAL",
    lastSynced: "12 mins ago"
  },

  // Andhra Pradesh & Telangana Shelters
  {
    id: "SHL-09",
    name: "Rajahmundry Godavari Flood Relief Camp #1",
    location: "Kotilingala Ghat Road, Rajahmundry, Andhra Pradesh",
    coordinates: [17.0040, 81.7780],
    capacity: 650,
    occupancy: 490,
    contactPerson: "Tahsildar K. Venkat (98480-11224)",
    hasMedicalPost: true,
    hasChildCare: true,
    status: "OPERATIONAL",
    lastSynced: "18 mins ago"
  },

  // Bengaluru, Karnataka Shelters
  {
    id: "SHL-10",
    name: "Bellandur Community Center Transit Shelter",
    location: "Outer Ring Road, Bellandur, Bengaluru, Karnataka",
    coordinates: [12.9280, 77.6740],
    capacity: 300,
    occupancy: 185,
    contactPerson: "BBMP Officer Naveen (99001-55443)",
    hasMedicalPost: true,
    hasChildCare: false,
    status: "OPERATIONAL",
    lastSynced: "20 mins ago"
  },

  // Delhi NCR Shelters
  {
    id: "SHL-11",
    name: "Yamuna Bazar Community Flood Relief Base",
    location: "Ring Road, Kashmere Gate, Delhi",
    coordinates: [28.6650, 77.2380],
    capacity: 500,
    occupancy: 390,
    contactPerson: "SDM Rajesh Verma (98110-33221)",
    hasMedicalPost: true,
    hasChildCare: true,
    status: "OPERATIONAL",
    lastSynced: "14 mins ago"
  }
];

export const mockHospitals = [
  // Chennai Hospitals
  {
    id: "HOSP-01",
    name: "Govt. Stanley Medical College & Hospital",
    location: "Old Jail Rd, Royapuram, Chennai, Tamil Nadu",
    coordinates: [13.1075, 80.2872],
    traumaBeds: 45,
    availableBeds: 8,
    icuAvailable: 3,
    contactPerson: "Dr. Arvind Menon (044-25281351)",
    status: "CRITICAL_FLOW",
    unidentifiedPatients: 4
  },
  {
    id: "HOSP-02",
    name: "Rajiv Gandhi Government General Hospital (RGGGH)",
    location: "EVR Periyar Salai, Park Town, Chennai, Tamil Nadu",
    coordinates: [13.0827, 80.2780],
    traumaBeds: 80,
    availableBeds: 19,
    icuAvailable: 7,
    contactPerson: "Dr. K. Swaminathan (044-25305000)",
    status: "OPERATIONAL",
    unidentifiedPatients: 6
  },
  {
    id: "HOSP-03",
    name: "Government Multi Super Speciality Hospital (Omandurar)",
    location: "Anna Salai, Triplicane, Chennai, Tamil Nadu",
    coordinates: [13.0694, 80.2745],
    traumaBeds: 40,
    availableBeds: 14,
    icuAvailable: 5,
    contactPerson: "Duty CMO (044-25666000)",
    status: "OPERATIONAL",
    unidentifiedPatients: 2
  },

  // Kerala / Wayanad Hospitals
  {
    id: "HOSP-04",
    name: "Govt Medical College Hospital Mananthavady",
    location: "Mananthavady, Wayanad, Kerala",
    coordinates: [11.8025, 76.0040],
    traumaBeds: 60,
    availableBeds: 12,
    icuAvailable: 4,
    contactPerson: "Dr. Radhakrishnan (04935-240223)",
    status: "CRITICAL_FLOW",
    unidentifiedPatients: 5
  },
  {
    id: "HOSP-05",
    name: "WIMS Medical College & Emergency Trauma Center",
    location: "Meppadi, Wayanad, Kerala",
    coordinates: [11.5540, 76.1340],
    traumaBeds: 50,
    availableBeds: 15,
    icuAvailable: 6,
    contactPerson: "Dr. Susan George (04936-287000)",
    status: "OPERATIONAL",
    unidentifiedPatients: 3
  },

  // Andhra Pradesh Hospital
  {
    id: "HOSP-06",
    name: "Government General Hospital Rajahmundry",
    location: "Danavaipeta, Rajahmundry, Andhra Pradesh",
    coordinates: [17.0090, 81.7890],
    traumaBeds: 55,
    availableBeds: 18,
    icuAvailable: 5,
    contactPerson: "Dr. P. Satyanarayana (0883-2473333)",
    status: "OPERATIONAL",
    unidentifiedPatients: 2
  },

  // Bengaluru Hospital
  {
    id: "HOSP-07",
    name: "Sakra World Hospital Trauma Unit",
    location: "Marathahalli-Sarjapur Outer Ring Rd, Bengaluru, Karnataka",
    coordinates: [12.9270, 77.6850],
    traumaBeds: 35,
    availableBeds: 9,
    icuAvailable: 3,
    contactPerson: "Dr. Anil Kumar (080-49694969)",
    status: "OPERATIONAL",
    unidentifiedPatients: 1
  }
];

export const mockRescueTeams = [
  // Chennai Teams
  {
    id: "TEAM-01",
    name: "NDRF Unit 04 (Swift Water Inflatable Boat)",
    leader: "Sub-Inspector Dinesh Rana",
    members: 14,
    coordinates: [12.9850, 80.2150],
    assignedSector: "Velachery Lake Flooding Zone, Chennai",
    status: "DEPLOYED_ACTIVE",
    equipment: ["2 Inflatable Boats", "Satellite VHF", "Sonar Life Finder"],
    radioChannel: "TAC-4 (156.800 MHz)"
  },
  {
    id: "TEAM-02",
    name: "SDRF Coastal Battalion 2",
    leader: "Havildar Balaji",
    members: 10,
    coordinates: [13.0280, 80.2450],
    assignedSector: "Adyar River Basin Corridor, Chennai",
    status: "DEPLOYED_ACTIVE",
    equipment: ["High-power Drones", "Thermal Night Vision", "First Aid Rigs"],
    radioChannel: "TAC-2 (154.650 MHz)"
  },
  {
    id: "TEAM-03",
    name: "Indian Red Cross First Aid Alpha",
    leader: "Meenakshi Ram",
    members: 8,
    coordinates: [13.0010, 80.2010],
    assignedSector: "St. Thomas Mount Transit Camp, Chennai",
    status: "STANDBY_BASE",
    equipment: ["Medical Mobile Van", "Infant Formula Kits", "Satellite Link"],
    radioChannel: "MED-1 (150.125 MHz)"
  },

  // Wayanad Teams
  {
    id: "TEAM-04",
    name: "NDRF 10th Battalion Special Search & Rescue",
    leader: "Inspector Rajesh Yadav",
    members: 18,
    coordinates: [11.5420, 76.1550],
    assignedSector: "Chooralmala Debris Sector, Wayanad, Kerala",
    status: "DEPLOYED_ACTIVE",
    equipment: ["Canine Sniffer Squad", "Acoustic Victim Detectors", "Heavy Winch"],
    radioChannel: "TAC-WYD-1 (160.200 MHz)"
  },
  {
    id: "TEAM-05",
    name: "Indian Army Madras Sappers Rescue Task Force",
    leader: "Major Harikrishnan",
    members: 24,
    coordinates: [11.5480, 76.1420],
    assignedSector: "Mundakkai Bailey Bridge Access Corridor, Wayanad",
    status: "DEPLOYED_ACTIVE",
    equipment: ["Bailey Bridge Gear", "Heavy Earthmovers", "Satellite Comms"],
    radioChannel: "ARMY-SAR-3 (142.500 MHz)"
  },

  // Andhra Pradesh Team
  {
    id: "TEAM-06",
    name: "AP SDRF Swift Water Rescue Fleet 1",
    leader: "Inspector Suresh Reddy",
    members: 12,
    coordinates: [17.0150, 81.7920],
    assignedSector: "Godavari Flood Embankment, Rajahmundry, AP",
    status: "DEPLOYED_ACTIVE",
    equipment: ["3 Motorized Rescue Boats", "Lifejackets", "GPS Trackers"],
    radioChannel: "AP-SDRF-1 (158.400 MHz)"
  },

  // Bengaluru Team
  {
    id: "TEAM-07",
    name: "Karnataka Fire & Emergency SDRF Unit",
    leader: "Station Officer Ramesh",
    members: 10,
    coordinates: [12.9320, 77.6800],
    assignedSector: "Bellandur & Mahadevapura Water Corridor, Bengaluru",
    status: "STANDBY_BASE",
    equipment: ["High Volume Dewatering Pumps", "Rafts", "Searchlights"],
    radioChannel: "KA-FRS-4 (152.100 MHz)"
  }
];

export const mockCases = [
  // --- CHENNAI & CUDDALORE CASES ---
  {
    id: "MP-1024",
    classification: "MISSING",
    fullName: "Ravi Kumar",
    age: 38,
    gender: "Male",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    reportedAt: "2026-10-07 08:45 AM",
    lastSeenLocation: "Cuddalore Old Town Harbour Boat Jetty, Tamil Nadu",
    coordinates: [11.7480, 79.7714],
    status: "POTENTIAL_MATCH",
    priority: "URGENT",
    vulnerabilityScore: 82,
    nextBestAction: "Dispatch Rescue Alpha (TEAM-01) for field identity verification at Relief Camp #2",
    assignedTo: "Commander Rajesh Kumar",
    assignedId: "RESP-01",
    responseCentre: "Cuddalore Port Cyclone Relief Centre",
    pin: "1024",
    clothing: "Brown linen shirt, dark blue trousers",
    physicalMarks: "Tattoo of trident on right forearm, small scar above left eyebrow",
    medicalNotes: "Exhaustion, mild dehydration, no known chronic allergies",
    reporter: {
      name: "Sita Kumar (Wife)",
      contact: "98412-88771 (Verified)",
      relation: "Spouse",
      verifiedPhone: true
    },
    potentialMatchId: "FP-2048",
    matchScore: 88,
    notes: [
      { author: "Commander Rajesh Kumar", text: "Flagged for immediate AI match confirmation against Cuddalore Camp intakes.", time: "2026-10-07 09:00 AM" }
    ],
    timeline: [
      { title: "Missing Report Logged by Sita Kumar", time: "08:45 AM, 07 Oct", by: "Sita Kumar (Wife)", type: "REGISTERED" },
      { title: "88% Multi-Factor Match Flagged", time: "09:15 AM, 07 Oct", by: "Reunite360 AI Engine", type: "MATCH" },
      { title: "Rescue Team Dispatched", time: "09:30 AM, 07 Oct", by: "Cmdr. Rajesh Kumar", type: "ASSIGNMENT" }
    ]
  },
  {
    id: "FP-2048",
    classification: "FOUND",
    fullName: "Unidentified Male (Found near Cuddalore Port)",
    age: 38,
    gender: "Male",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    reportedAt: "2026-10-07 09:10 AM",
    lastSeenLocation: "Rescued from Old Town Harbour, admitted to Relief Camp #2, Cuddalore",
    coordinates: [11.7510, 79.7740],
    status: "AWAITING_VERIFICATION",
    priority: "URGENT",
    vulnerabilityScore: 80,
    nextBestAction: "Coordinate dual-confirmation with Sita Kumar and NDRF Team 01",
    assignedTo: "Commander Rajesh Kumar",
    assignedId: "RESP-01",
    responseCentre: "Cuddalore Port Cyclone Relief Centre",
    pin: "2048",
    clothing: "Muddy brown button shirt, dark trousers",
    physicalMarks: "Trident tattoo on right forearm, visible scar above left eyebrow",
    medicalNotes: "Conscious but fatigued, minor superficial abrasions treated",
    reporter: {
      name: "Tahsildar Ramanathan",
      contact: "Cuddalore Port Desk (94432-88776)",
      relation: "Shelter Administration",
      verifiedPhone: true
    },
    potentialMatchId: "MP-1024",
    matchScore: 88,
    notes: [
      { author: "Tahsildar Ramanathan", text: "Individual brought by Coast Guard Swift boat. Cross-checked with MP-1024 report.", time: "2026-10-07 09:12 AM" }
    ],
    timeline: [
      { title: "Rescued from Flooded Jetty", time: "08:30 AM, 07 Oct", by: "Coast Guard Swift Boat", type: "RESCUE" },
      { title: "Admitted to Relief Camp #2", time: "09:10 AM, 07 Oct", by: "Shelter Intake Desk", type: "REGISTERED" },
      { title: "Matched with Missing Case MP-1024", time: "09:15 AM, 07 Oct", by: "Reunite360 AI Engine", type: "MATCH" }
    ]
  },
  {
    id: "CAS-2026-0101",
    classification: "MISSING",
    fullName: "Aadhya Subramanian",
    age: 7,
    gender: "Female",
    photo: "https://images.unsplash.com/photo-1543332164-6e82f355badc?w=300&auto=format&fit=crop&q=80",
    reportedAt: "2026-10-07 09:15 AM",
    lastSeenLocation: "Velachery 100 Feet Road, Near Bus Depot, Chennai",
    coordinates: [12.9780, 80.2195],
    status: "POTENTIAL_MATCH",
    priority: "URGENT",
    vulnerabilityScore: 92,
    nextBestAction: "Immediate medical check and family handover at Velachery Relief Center",
    assignedTo: "Officer Priya Sundaram",
    assignedId: "RESP-02",
    responseCentre: "Velachery Community Relief Center",
    pin: "4412",
    clothing: "Yellow floral dress with white sandals",
    physicalMarks: "Small birthmark on left wrist, curly hair, silver anklet",
    medicalNotes: "Asthmatic, needs inhaler if exposed to damp weather",
    reporter: {
      name: "Subramanian Ramaswamy (Father)",
      contact: "98401-XXXXX (Protected)",
      relation: "Parent",
      verifiedPhone: true
    },
    potentialMatchId: "CAS-2026-0201",
    matchScore: 94,
    notes: [
      { author: "Officer Priya Sundaram", text: "Report received via emergency field portal. Dispatched team to check nearby Velachery shelter.", time: "2026-10-07 09:30 AM" }
    ],
    timeline: [
      { title: "Case Registered", time: "09:15 AM, 07 Oct", by: "Subramanian (Father)", type: "REGISTERED" },
      { title: "Priority Assigned: Urgent", time: "09:20 AM, 07 Oct", by: "Automated Rules (Child Under 12)", type: "PRIORITY" },
      { title: "Candidate Match Computed", time: "10:15 AM, 07 Oct", by: "Reunite360 AI Engine (94% Score)", type: "MATCH" }
    ]
  },
  {
    id: "CAS-2026-0201",
    classification: "FOUND",
    fullName: "Unidentified Girl (Responds to 'Aadhu')",
    age: 7,
    gender: "Female",
    photo: "https://images.unsplash.com/photo-1543332164-6e82f355badc?w=300&auto=format&fit=crop&q=80",
    reportedAt: "2026-10-07 10:00 AM",
    lastSeenLocation: "Rescued from Velachery MRTS Station Pillar 42, Chennai",
    coordinates: [12.9792, 80.2220],
    status: "AWAITING_VERIFICATION",
    priority: "URGENT",
    vulnerabilityScore: 90,
    nextBestAction: "Dual-confirm child identification with father Subramanian",
    assignedTo: "Officer Priya Sundaram",
    assignedId: "RESP-02",
    responseCentre: "Velachery Community Relief Center",
    pin: "8921",
    clothing: "Wet yellow floral frock, silver anklet with small bell",
    physicalMarks: "Small birthmark on left wrist, slight scratches on left knee",
    medicalNotes: "Mild wheezing treated by Red Cross First Aid post. Stable now.",
    reporter: {
      name: "NDRF Boat Team 04 (Sub-Insp Dinesh)",
      contact: "NDRF VHF Channel 4",
      relation: "Rescue Personnel",
      verifiedPhone: true
    },
    potentialMatchId: "CAS-2026-0101",
    matchScore: 94,
    notes: [
      { author: "Capt. Murugan", text: "Child safe at Child Protection Desk, Room 4, Velachery Relief Center.", time: "2026-10-07 10:05 AM" }
    ],
    timeline: [
      { title: "Rescued by Boat Team", time: "09:50 AM, 07 Oct", by: "NDRF Boat 04", type: "RESCUE" },
      { title: "Admitted to Shelter", time: "10:00 AM, 07 Oct", by: "Velachery Center Desk", type: "REGISTERED" }
    ]
  },
  {
    id: "CAS-2026-0102",
    classification: "MISSING",
    fullName: "K. Raghunathan",
    age: 72,
    gender: "Male",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80",
    reportedAt: "2026-10-07 07:45 AM",
    lastSeenLocation: "Saidapet Jones Road, Near Maraimalai Adigal Bridge, Chennai",
    coordinates: [13.0205, 80.2240],
    status: "UNDER_REVIEW",
    priority: "URGENT",
    assignedTo: "Dr. Arvind Menon",
    assignedId: "RESP-03",
    responseCentre: "Saidapet Government Higher Secondary School",
    pin: "1932",
    clothing: "White dhoti, grey half-sleeve shirt, black frame spectacles",
    physicalMarks: "White hair, slight limp in right leg, scar above left eyebrow",
    medicalNotes: "Diabetic, Alzheimer's stage 1",
    reporter: {
      name: "R. Karthik (Son)",
      contact: "94441-XXXXX (Protected)",
      relation: "Son",
      verifiedPhone: true
    },
    potentialMatchId: "CAS-2026-0202",
    matchScore: 88,
    notes: [],
    timeline: [
      { title: "Case Registered by Son", time: "07:45 AM, 07 Oct", by: "Karthik", type: "REGISTERED" }
    ]
  },

  // --- WAYANAD, KERALA CASES ---
  {
    id: "WYD-2026-0101",
    classification: "MISSING",
    fullName: "Ananya Sreeraman",
    age: 10,
    gender: "Female",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
    reportedAt: "2026-10-06 06:30 AM",
    lastSeenLocation: "Chooralmala School Road, Meppadi, Wayanad, Kerala",
    coordinates: [11.5390, 76.1620],
    status: "POTENTIAL_MATCH",
    priority: "URGENT",
    vulnerabilityScore: 95,
    nextBestAction: "Coordinate identity verification at Meppadi Camp #1 with mother Bindu",
    assignedTo: "Capt. Shaji Varghese",
    assignedId: "RESP-06",
    responseCentre: "Meppadi Govt Higher Secondary School Camp",
    pin: "6011",
    clothing: "Green kurti with peacock print, red hair ribbon",
    physicalMarks: "Small mole on right cheek, wears gold ear studs",
    medicalNotes: "Allergic to dust, mild asthma",
    reporter: {
      name: "Bindu Sreeraman (Mother)",
      contact: "94471-99882 (Verified)",
      relation: "Parent",
      verifiedPhone: true
    },
    potentialMatchId: "WYD-2026-0201",
    matchScore: 92,
    notes: [
      { author: "Capt. Shaji Varghese", text: "Report received from Chooralmala landslide sector. Search squad deployed.", time: "2026-10-06 07:00 AM" }
    ],
    timeline: [
      { title: "Landslide Missing Report Logged", time: "06:30 AM, 06 Oct", by: "Mother", type: "REGISTERED" },
      { title: "Candidate Match Found at WIMS Base", time: "08:15 AM, 06 Oct", by: "AI Engine (92%)", type: "MATCH" }
    ]
  },
  {
    id: "WYD-2026-0201",
    classification: "FOUND",
    fullName: "Rescued Girl ('Anu')",
    age: 10,
    gender: "Female",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
    reportedAt: "2026-10-06 08:00 AM",
    lastSeenLocation: "Rescued from Mundakkai Riverbed, admitted to Meppadi Camp",
    coordinates: [11.5450, 76.1500],
    status: "AWAITING_VERIFICATION",
    priority: "URGENT",
    vulnerabilityScore: 93,
    nextBestAction: "Dual-confirm identity with mother Bindu and Army Task Force",
    assignedTo: "Capt. Shaji Varghese",
    assignedId: "RESP-06",
    responseCentre: "Meppadi Govt Higher Secondary School Camp",
    pin: "6012",
    clothing: "Muddy green dress, single gold ear stud",
    physicalMarks: "Mole on right cheek, minor superficial abrasions on forearm",
    medicalNotes: "Stable, treated for exhaustion and minor shock",
    reporter: {
      name: "Indian Army Madras Sappers (Major Harikrishnan)",
      contact: "Army VHF SAR-3",
      relation: "Armed Forces / Rescue",
      verifiedPhone: true
    },
    potentialMatchId: "WYD-2026-0101",
    matchScore: 92,
    notes: [],
    timeline: [
      { title: "Rescued by Madras Sappers", time: "07:30 AM, 06 Oct", by: "Army Task Force", type: "RESCUE" },
      { title: "Intake at Meppadi Relief Base", time: "08:00 AM, 06 Oct", by: "SDRF Squad", type: "REGISTERED" }
    ]
  },
  {
    id: "WYD-2026-0102",
    classification: "MISSING",
    fullName: "V. K. Mohammed Kutty",
    age: 65,
    gender: "Male",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    reportedAt: "2026-10-06 09:20 AM",
    lastSeenLocation: "Chooralmala Tea Plantation Estate, Wayanad, Kerala",
    coordinates: [11.5310, 76.1720],
    status: "UNDER_REVIEW",
    priority: "URGENT",
    vulnerabilityScore: 88,
    nextBestAction: "Search team cross-referencing Kalpetta hospital intakes",
    assignedTo: "Capt. Shaji Varghese",
    assignedId: "RESP-06",
    responseCentre: "Kalpetta Municipal Community Hall Camp",
    pin: "7103",
    clothing: "White mundu, brown checked shirt, black umbrella",
    physicalMarks: "Grey beard, walking cane, silver ring on left index finger",
    medicalNotes: "Cardiac patient, requires regular blood thinner medication",
    reporter: {
      name: "Shameer Kutty (Son)",
      contact: "98472-XXXXX (Protected)",
      relation: "Son",
      verifiedPhone: true
    },
    potentialMatchId: null,
    matchScore: null,
    notes: [],
    timeline: [
      { title: "Missing Case Registered", time: "09:20 AM, 06 Oct", by: "Son", type: "REGISTERED" }
    ]
  },

  // --- ANDHRA PRADESH / GODAVARI CASES ---
  {
    id: "GDA-2026-0101",
    classification: "MISSING",
    fullName: "G. Lakshmi Narayana",
    age: 52,
    gender: "Male",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
    reportedAt: "2026-10-07 10:30 AM",
    lastSeenLocation: "Kotilingala Ghat Causeway, Rajahmundry, Andhra Pradesh",
    coordinates: [17.0010, 81.7820],
    status: "UNDER_REVIEW",
    priority: "HIGH",
    vulnerabilityScore: 78,
    nextBestAction: "Coordinate with AP SDRF boat patrol for riverbank sweep",
    assignedTo: "Inspector Suresh Reddy",
    assignedId: "RESP-07",
    responseCentre: "Rajahmundry Godavari Flood Relief Camp #1",
    pin: "8120",
    clothing: "White shirt, grey formal trousers, black rubber sandals",
    physicalMarks: "Birthmark on neck, gold chain",
    medicalNotes: "Hypertensive",
    reporter: {
      name: "G. Radha (Daughter)",
      contact: "98481-XXXXX (Protected)",
      relation: "Child",
      verifiedPhone: true
    },
    potentialMatchId: null,
    matchScore: null,
    notes: [],
    timeline: [
      { title: "Report Logged", time: "10:30 AM, 07 Oct", by: "Daughter", type: "REGISTERED" }
    ]
  },

  // --- BENGALURU, KARNATAKA CASES ---
  {
    id: "BLR-2026-0101",
    classification: "MISSING",
    fullName: "Pranav Gowda",
    age: 26,
    gender: "Male",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
    reportedAt: "2026-10-07 01:15 PM",
    lastSeenLocation: "Outer Ring Road EcoSpace Underpass, Bellandur, Bengaluru",
    coordinates: [12.9260, 77.6780],
    status: "REPORTED",
    priority: "HIGH",
    vulnerabilityScore: 72,
    nextBestAction: "Check Bellandur relief camp intakes and BBMP rescue boat list",
    assignedTo: "Commander Rajesh Kumar",
    assignedId: "RESP-01",
    responseCentre: "Bellandur Community Center Transit Shelter",
    pin: "4321",
    clothing: "Black tech hoodie, blue denim jeans, waterproof backpack",
    physicalMarks: "Wears rectangular black spectacles",
    medicalNotes: "None",
    reporter: {
      name: "Manjunath Gowda (Father)",
      contact: "99002-XXXXX (Protected)",
      relation: "Parent",
      verifiedPhone: true
    },
    potentialMatchId: null,
    matchScore: null,
    notes: [],
    timeline: [
      { title: "Report Logged", time: "01:15 PM, 07 Oct", by: "Father", type: "REGISTERED" }
    ]
  },

  // --- DELHI NCR CASES ---
  {
    id: "DLH-2026-0101",
    classification: "MISSING",
    fullName: "Rameshwar Dayal",
    age: 60,
    gender: "Male",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    reportedAt: "2026-10-07 03:00 PM",
    lastSeenLocation: "Yamuna Bazar Ghat #3, Kashmere Gate, Delhi",
    coordinates: [28.6660, 77.2360],
    status: "REPORTED",
    priority: "URGENT",
    vulnerabilityScore: 84,
    nextBestAction: "Alert DDMA boat patrol and Kashmere Gate relief center",
    assignedTo: "Commander Rajesh Kumar",
    assignedId: "RESP-01",
    responseCentre: "Yamuna Bazar Community Flood Relief Base",
    pin: "1190",
    clothing: "Khadi kurta, white pyjama, brown shawl",
    physicalMarks: "Scar on right thumb",
    medicalNotes: "Diabetic",
    reporter: {
      name: "Sunil Dayal (Son)",
      contact: "98112-XXXXX (Protected)",
      relation: "Son",
      verifiedPhone: true
    },
    potentialMatchId: null,
    matchScore: null,
    notes: [],
    timeline: [
      { title: "Missing Report Registered", time: "03:00 PM, 07 Oct", by: "Son", type: "REGISTERED" }
    ]
  }
];

export const mockSmartMatches = [
  {
    id: "MATCH-1024",
    missingCaseId: "MP-1024",
    missingPersonName: "Ravi Kumar",
    missingAge: 38,
    missingLocation: "Cuddalore Old Town Harbour Boat Jetty",
    missingClothing: "Brown linen shirt, blue trousers",
    foundCaseId: "FP-2048",
    foundPersonName: "Unidentified Male (Relief Camp #2)",
    foundAge: 38,
    foundLocation: "Rescued from Old Town Harbour (1.2 km away)",
    foundClothing: "Muddy brown shirt, dark trousers",
    overallScore: 88,
    confidenceTier: "HIGH_CONFIDENCE",
    status: "AWAITING_HUMAN_VERIFICATION",
    decisionRationale: "High probability match based on distinct right forearm trident tattoo (+35%), Haversine proximity under 1.2km (+25%), compatible age range (+15%), and matching brown shirt (+13%).",
    supportingEvidence: [
      { text: "Right forearm trident tattoo match", impact: "+35%" },
      { text: "Geospatial proximity within 1.2 km", impact: "+25%" },
      { text: "Compatible age bracket (38 years)", impact: "+15%" },
      { text: "Brown button shirt visual alignment", impact: "+13%" }
    ],
    missingEvidence: [
      { text: "Estimated age variance +/- 2 years on intake", penalty: "-5%" }
    ],
    breakdown: {
      nameSimilarity: { score: 65, weight: 30, note: "Found record logged as Unidentified Male with phonetic profile" },
      ageMatch: { score: 95, weight: 15, note: "Exact age alignment (38 years)" },
      proximity: { score: 92, weight: 25, note: "Within 1.2 km of last seen Cuddalore Jetty" },
      clothingAndAppearance: { score: 88, weight: 20, note: "Brown linen/cotton shirt and dark pants match" },
      physicalFeatures: { score: 100, weight: 10, note: "Trident tattoo on right forearm + eyebrow scar" }
    },
    evidenceTags: ["Trident Tattoo (+35%)", "Geospatial 1.2km (+25%)", "Brown Shirt (+13%)", "Eyebrow Scar"],
    conflictingDetails: [],
    sourceCentres: {
      missing: "Cuddalore Port Cyclone Relief Centre",
      found: "Cuddalore Port Relief Camp #2"
    },
    calculatedAt: "2026-10-07 09:15 AM",
    safetyWarning: "A similarity score is not identity confirmation. Dual human verification and family confirmation required before physical handover."
  },
  {
    id: "MATCH-8841",
    missingCaseId: "CAS-2026-0101",
    missingPersonName: "Aadhya Subramanian",
    missingAge: 7,
    missingLocation: "Velachery 100 Feet Road, Chennai",
    missingClothing: "Yellow floral dress, white sandals",
    foundCaseId: "CAS-2026-0201",
    foundPersonName: "Unidentified Girl ('Aadhu')",
    foundAge: 7,
    foundLocation: "Velachery MRTS Station (1.4 km away)",
    foundClothing: "Wet yellow floral frock, silver anklet",
    overallScore: 94,
    confidenceTier: "HIGH_CONFIDENCE",
    status: "AWAITING_HUMAN_VERIFICATION",
    decisionRationale: "Near-identical match based on distinctive wrist birthmark (+35%), Soundex nickname match 'Aadhu' (+30%), and 1.4km proximity corridor (+25%).",
    supportingEvidence: [
      { text: "Left wrist birthmark confirmed on both records", impact: "+35%" },
      { text: "Phonetic Soundex match ('Aadhya' vs 'Aadhu')", impact: "+30%" },
      { text: "Proximity: 1.4 km in same drainage corridor", impact: "+25%" },
      { text: "Yellow floral dress + silver anklet", impact: "+10%" }
    ],
    missingEvidence: [],
    breakdown: {
      nameSimilarity: { score: 90, weight: 30, note: "Phonetic Soundex match ('Aadhya' vs nickname 'Aadhu')" },
      ageMatch: { score: 100, weight: 15, note: "Exact age match (7 years)" },
      proximity: { score: 95, weight: 25, note: "Proximity: 1.4 km apart in same drainage corridor" },
      clothingAndAppearance: { score: 92, weight: 20, note: "High match: 'Yellow floral dress' + 'Silver anklet'" },
      physicalFeatures: { score: 90, weight: 10, note: "Birthmark on left wrist confirmed on both records" }
    },
    evidenceTags: ["Phonetic Match", "Geospatial 1.4km", "Clothing Color Match", "Wrist Birthmark"],
    conflictingDetails: [],
    sourceCentres: {
      missing: "Velachery Community Relief Center",
      found: "Velachery Relief Center (Rescue Room 4)"
    },
    calculatedAt: "2026-10-07 10:15 AM",
    safetyWarning: "A similarity score is not identity confirmation. Human verification and family confirmation required."
  },
  {
    id: "MATCH-WYD-01",
    missingCaseId: "WYD-2026-0101",
    missingPersonName: "Ananya Sreeraman",
    missingAge: 10,
    missingLocation: "Chooralmala School Road, Wayanad",
    missingClothing: "Green kurti with peacock print",
    foundCaseId: "WYD-2026-0201",
    foundPersonName: "Rescued Girl ('Anu')",
    foundAge: 10,
    foundLocation: "Rescued from Mundakkai Riverbed",
    foundClothing: "Muddy green dress, single gold ear stud",
    overallScore: 92,
    confidenceTier: "HIGH_CONFIDENCE",
    status: "AWAITING_HUMAN_VERIFICATION",
    decisionRationale: "High-confidence landslide rescue match: Right cheek mole (+35%), nickname 'Anu' Soundex match (+30%), green dress match (+15%), exact age 10 (+12%).",
    supportingEvidence: [
      { text: "Right cheek distinctive mole confirmed", impact: "+35%" },
      { text: "Soundex match ('Ananya' vs 'Anu')", impact: "+30%" },
      { text: "Green kurti / dress color match", impact: "+15%" },
      { text: "Exact age match (10 years)", impact: "+12%" }
    ],
    missingEvidence: [],
    breakdown: {
      nameSimilarity: { score: 90, weight: 30, note: "Nickname match ('Ananya' vs 'Anu')" },
      ageMatch: { score: 100, weight: 15, note: "Exact age match (10 years)" },
      proximity: { score: 90, weight: 25, note: "Meppadi to Mundakkai rescue corridor" },
      clothingAndAppearance: { score: 90, weight: 20, note: "Green dress alignment" },
      physicalFeatures: { score: 95, weight: 10, note: "Right cheek mole confirmed" }
    },
    evidenceTags: ["Right Cheek Mole", "Green Kurti", "Nickname Match", "Wayanad Landslide Corridor"],
    conflictingDetails: [],
    sourceCentres: {
      missing: "Chooralmala Sector",
      found: "Meppadi Govt Higher Secondary Camp"
    },
    calculatedAt: "2026-10-06 08:15 AM",
    safetyWarning: "Dual responder signoff and mother Bindu presence required before handover."
  }
];

export const mockDuplicates = [
  {
    id: "DUP-001",
    groupId: "DG-101",
    suspectedGroup: "Aadhya Subramanian Duplicate Reports (DG-101)",
    primaryCaseId: "CAS-2026-0101",
    duplicateCaseId: "CAS-2026-0188",
    similarityScore: 96,
    reasons: ["Identical Name & Age", "Reported by Mother (Geetha) & Father (Subramanian) separately at 2 different relief centres", "Identical photos and contact info attached"],
    sourceA: "Filed via Web Portal by Subramanian (Father)",
    sourceB: "Filed at Tambaram Desk by Geetha (Mother)",
    status: "SUGGESTED_MERGE",
    detectedAt: "2026-10-07 10:20 AM"
  }
];

export const mockConflicts = [
  {
    id: "CONF-001",
    caseId: "CAS-2026-0102",
    personName: "K. Raghunathan",
    conflictField: "Last Known Location & Age Discrepancy",
    summary: "Discrepancy detected between family web submission and authorized hospital emergency desk intake.",
    fieldA: {
      label: "Citizen Web Intake (R. Karthik, Son)",
      location: "Saidapet Jones Road, Chennai",
      age: "72 years",
      reportedAt: "2026-10-07 07:45 AM",
      confidence: "Citizen Report (Medium Trust)"
    },
    fieldB: {
      label: "Hospital Emergency Intake (Stanley Trauma Desk)",
      location: "Adyar Bridge Causeway Sector",
      age: "70 years",
      reportedAt: "2026-10-07 11:20 AM",
      confidence: "Authorized Medical Desk (High Trust)"
    },
    status: "PENDING_RESOLUTION",
    resolutionNotes: ""
  }
];

export const mockAuditLogs = [
  { id: "AUD-992", timestamp: "2026-10-07 04:00 PM", actor: "Capt. Shaji Varghese (RESP-06)", action: "RESCUE_TEAM_DISPATCHED", target: "WYD-2026-0101", details: "Madras Sappers task force dispatched to Chooralmala sector." },
  { id: "AUD-991", timestamp: "2026-10-07 02:30 PM", actor: "Cmdr. Rajesh Kumar (RESP-01)", action: "REUNIFICATION_CONFIRMED", target: "CAS-2026-0103", details: "Physical identity verified by Gazetted Officer. Child and father handed over to spouse Kavitha." },
  { id: "AUD-990", timestamp: "2026-10-07 01:15 PM", actor: "Dr. Arvind Menon (RESP-03)", action: "MEDICAL_STATUS_UPDATE", target: "CAS-2026-0202", details: "Insulin administered. Blood glucose stabilized at 140 mg/dL in Omandurar Ward 3B." },
  { id: "AUD-989", timestamp: "2026-10-07 10:15 AM", actor: "Explainable Matching AI Engine", action: "CANDIDATE_MATCH_GENERATED", target: "MATCH-8841", details: "Generated 94% explainable match between Missing #0101 and Found #0201." },
  { id: "AUD-988", timestamp: "2026-10-07 09:15 AM", actor: "Subramanian (Family)", action: "CASE_CREATED_ONLINE", target: "CAS-2026-0101", details: "Missing person report filed with photo and emergency contact." },
  { id: "AUD-987", timestamp: "2026-10-06 04:30 AM", actor: "System Administrator", action: "OPERATION_ACTIVATED", target: "OP-2026-MICH", details: "Disaster operation activated for Cyclone Michaung Floods." }
];

export const mockNotifications = [
  { id: "NOTIF-1", type: "URGENT", title: "Urgent Landslide Match Ready", message: "Wayanad Match #WYD-01 (92% confidence) ready for dual-responder verification.", time: "4 mins ago", link: "verification", matchId: "MATCH-WYD-01" },
  { id: "NOTIF-2", type: "URGENT", title: "Urgent Case Unassigned", message: "Missing child report CAS-2026-0101 requires immediate officer review.", time: "8 mins ago", link: "coordination", caseId: "CAS-2026-0101" },
  { id: "NOTIF-3", type: "MATCH", title: "High-Score Match Flagged", message: "Match #8841 (94% confidence) awaiting dual-responder human approval.", time: "18 mins ago", link: "verification", matchId: "MATCH-8841" },
  { id: "NOTIF-4", type: "WARNING", title: "Suspected Duplicate Submission", message: "Cross-centre duplicate detected between #0101 and #0188 (96% similarity).", time: "30 mins ago", link: "duplicates" },
  { id: "NOTIF-5", type: "INFO", title: "Offline Cache Synchronized", message: "3 field reports from NDRF Boat 4 synced successfully to central command ledger.", time: "45 mins ago", link: "audit" }
];
