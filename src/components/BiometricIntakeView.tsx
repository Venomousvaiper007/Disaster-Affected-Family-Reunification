import React, { useState } from 'react';
import { useCases } from '../context/CaseContext';
import {
  Fingerprint,
  CheckCircle2,
  Users,
  Building2,
  Save,
  ShieldCheck,
  Sparkles,
  HeartPulse,
  UserCheck,
} from 'lucide-react';

interface BiometricProfile {
  id: string;
  name: string;
  aadhaarNumber: string;
  familyCardNumber: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  photoUrl: string;
  medicalCondition: 'STABLE' | 'MINOR_INJURIES' | 'CRITICAL' | 'UNCONSCIOUS';
  vulnerability: 'NONE' | 'CHILD' | 'ELDERLY' | 'INJURED' | 'PREGNANT';
  clothing: string;
  distinguishingMarks: string[];
  facilityName: string;
  facilityType: 'RELIEF_CAMP' | 'SHELTER' | 'HOSPITAL' | 'FIELD_POST';
  wardOrBed: string;
}

const PRESET_BIOMETRIC_PROFILES: BiometricProfile[] = [
  {
    id: 'BIO-DEMO-01',
    name: 'Ramasamy Sundaram',
    aadhaarNumber: '9842-7710-4329',
    familyCardNumber: 'FC-TAM-884920',
    age: 48,
    gender: 'MALE',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    medicalCondition: 'STABLE',
    vulnerability: 'NONE',
    clothing: 'Brown cotton shirt and grey trousers',
    distinguishingMarks: ['Scar on left cheek', 'Black watch on left wrist'],
    facilityName: 'Nehru Indoor Stadium Disaster Relief Shelter #3',
    facilityType: 'SHELTER',
    wardOrBed: 'Block B, Mat #42',
  },
  {
    id: 'BIO-DEMO-02',
    name: 'Soundarya Kumar',
    aadhaarNumber: '7712-4091-8823',
    familyCardNumber: 'FC-TAM-441298',
    age: 36,
    gender: 'FEMALE',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    medicalCondition: 'MINOR_INJURIES',
    vulnerability: 'NONE',
    clothing: 'Blue saree with silver zari border',
    distinguishingMarks: ['Mole on right chin', 'Gold nose pin'],
    facilityName: 'Government Rajiv Gandhi General Hospital (Zone B)',
    facilityType: 'HOSPITAL',
    wardOrBed: 'Observation Ward 2, Bed #19',
  },
  {
    id: 'BIO-DEMO-03',
    name: 'Velmurugan K.',
    aadhaarNumber: '4451-9982-1044',
    familyCardNumber: 'FC-TAM-901142',
    age: 68,
    gender: 'MALE',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    medicalCondition: 'STABLE',
    vulnerability: 'ELDERLY',
    clothing: 'White dhoti and light green towel',
    distinguishingMarks: ['Black rimmed reading glasses', 'Surgical scar on right knee'],
    facilityName: 'Basin Bridge Community Flood Relief Camp',
    facilityType: 'RELIEF_CAMP',
    wardOrBed: 'Senior Citizens Pavilion, Cot #08',
  },
];

interface FamilySearchResult {
  id: string;
  type: 'FOUND_RECORD' | 'MISSING_REPORT' | 'SHELTER_ENTRY';
  fullName: string;
  relationship: string;
  age: number;
  gender: string;
  familyCardNumber: string;
  aadhaarNumber?: string;
  currentWhereabouts: string;
  facilityOrLocationName: string;
  statusBadge: string;
  statusColor: string;
  contactPhone: string;
  medicalNotes?: string;
  photoUrl?: string;
}

interface BiometricIntakeViewProps {
  onSelectCase?: (caseItem: any) => void;
  onNavigateToCommandCenter?: () => void;
}

export const BiometricIntakeView: React.FC<BiometricIntakeViewProps> = () => {
  const { reportFoundPerson, foundRecords } = useCases();

  // Scanning State
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [activeProfile, setActiveProfile] = useState<BiometricProfile | null>(null);

  // Form Fields (editable after scan)
  const [scannedAadhaar, setScannedAadhaar] = useState('');
  const [scannedFamilyCard, setScannedFamilyCard] = useState('');
  const [scannedName, setScannedName] = useState('');
  const [scannedAge, setScannedAge] = useState(45);
  const [scannedGender, setScannedGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [facilityName, setFacilityName] = useState('Nehru Indoor Stadium Disaster Relief Shelter #3');
  const [wardOrBed, setWardOrBed] = useState('Block B, Bed #12');
  const [medicalCondition, setMedicalCondition] = useState<'STABLE' | 'MINOR_INJURIES' | 'CRITICAL' | 'UNCONSCIOUS'>('STABLE');

  // Action Results State
  const [savedCaseId, setSavedCaseId] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<FamilySearchResult[] | null>(null);
  const [searchedCardNumber, setSearchedCardNumber] = useState<string | null>(null);
  const [reunificationRequestedId, setReunificationRequestedId] = useState<string | null>(null);

  // Trigger Biometric Scan
  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanCompleted(false);
    setSavedCaseId(null);
    setSearchResults(null);

    const preset = PRESET_BIOMETRIC_PROFILES[selectedPresetIndex];

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanCompleted(true);
          populateProfile(preset);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  // Immediate "Scan Complete" button handler
  const handleScanCompleteNow = () => {
    setIsScanning(false);
    setScanProgress(100);
    setScanCompleted(true);
    setSavedCaseId(null);
    setSearchResults(null);
    const preset = PRESET_BIOMETRIC_PROFILES[selectedPresetIndex];
    populateProfile(preset);
  };

  const populateProfile = (preset: BiometricProfile) => {
    setActiveProfile(preset);
    setScannedAadhaar(preset.aadhaarNumber);
    setScannedFamilyCard(preset.familyCardNumber);
    setScannedName(preset.name);
    setScannedAge(preset.age);
    setScannedGender(preset.gender);
    setFacilityName(preset.facilityName);
    setWardOrBed(preset.wardOrBed);
    setMedicalCondition(preset.medicalCondition);
  };

  // Action 1: Save Alone
  const handleSaveAlone = async () => {
    try {
      const caseNum = await reportFoundPerson({
        isIdentified: true,
        givenName: scannedName,
        aadhaarNumber: scannedAadhaar,
        familyCardNumber: scannedFamilyCard,
        gender: scannedGender,
        estimatedAgeMin: Math.max(1, scannedAge - 2),
        estimatedAgeMax: scannedAge + 2,
        vulnerability: activeProfile?.vulnerability || 'NONE',
        medicalCondition: medicalCondition,
        isConscious: true,
        traits: {
          age: scannedAge,
          gender: scannedGender,
          clothingUpper: activeProfile?.clothing || 'Disaster relief wear',
          distinguishingMarks: activeProfile?.distinguishingMarks || [],
        },
        foundLocation: {
          lat: 13.0841,
          lng: 80.2725,
          address: 'Basin Bridge / Relief Shelter Sector Delta',
          sector: 'Sector Delta-1',
        },
        foundTime: new Date().toISOString(),
        currentFacilityType: 'SHELTER',
        currentFacilityName: facilityName,
        wardOrBed: wardOrBed,
        photoUrl: activeProfile?.photoUrl,
        notes: `Registered via Biometric UIDAI Scanner. Aadhaar: ${scannedAadhaar}, Family Card: ${scannedFamilyCard}`,
        reportedByName: 'Biometric Intake Station Officer',
        reportedByRole: 'SHELTER',
      });

      setSavedCaseId(caseNum);
      setSearchResults(null);
    } catch (err: any) {
      alert(`Error saving record: ${err.message || err}`);
    }
  };

  // Action 2: Save and Search for Family Members
  const handleSaveAndSearchFamily = async () => {
    try {
      // 1. Save entry first
      const caseNum = await reportFoundPerson({
        isIdentified: true,
        givenName: scannedName,
        aadhaarNumber: scannedAadhaar,
        familyCardNumber: scannedFamilyCard,
        gender: scannedGender,
        estimatedAgeMin: Math.max(1, scannedAge - 2),
        estimatedAgeMax: scannedAge + 2,
        vulnerability: activeProfile?.vulnerability || 'NONE',
        medicalCondition: medicalCondition,
        isConscious: true,
        traits: {
          age: scannedAge,
          gender: scannedGender,
          clothingUpper: activeProfile?.clothing || 'Disaster relief wear',
          distinguishingMarks: activeProfile?.distinguishingMarks || [],
        },
        foundLocation: {
          lat: 13.0841,
          lng: 80.2725,
          address: 'Basin Bridge / Relief Shelter Sector Delta',
          sector: 'Sector Delta-1',
        },
        foundTime: new Date().toISOString(),
        currentFacilityType: 'SHELTER',
        currentFacilityName: facilityName,
        wardOrBed: wardOrBed,
        photoUrl: activeProfile?.photoUrl,
        notes: `Registered via Biometric UIDAI Scanner. Aadhaar: ${scannedAadhaar}, Family Card: ${scannedFamilyCard}`,
        reportedByName: 'Biometric Intake Station Officer',
        reportedByRole: 'SHELTER',
      });

      setSavedCaseId(caseNum);
      setSearchedCardNumber(scannedFamilyCard);
    } catch (err: any) {
      alert(`Error saving record: ${err.message || err}`);
    }


    // 2. Perform family search by Family Card Number
    const results: FamilySearchResult[] = [];

    // Search existing Found Records & Relief Camps for matching family card
    foundRecords.forEach(f => {
      const isCardMatch = f.familyCardNumber === scannedFamilyCard;
      if (isCardMatch || (scannedFamilyCard === 'FC-TAM-884920' && (f.givenName?.includes('Ramasamy') || f.caseNumber === '#F089'))) {
        results.push({
          id: f.id,
          type: 'FOUND_RECORD',
          fullName: f.givenName || 'Family Member',
          relationship: f.gender === 'FEMALE' ? 'Wife / Daughter' : 'Son / Brother',
          age: f.traits.age || 40,
          gender: f.gender,
          familyCardNumber: scannedFamilyCard,
          aadhaarNumber: f.aadhaarNumber || '9842-XXXX-1102',
          currentWhereabouts: `${f.currentFacilityName} (${f.wardOrBed || 'General Ward'})`,
          facilityOrLocationName: f.currentFacilityName,
          statusBadge: f.currentFacilityType === 'HOSPITAL' ? 'HOSPITALIZED (STABLE)' : 'IN RELIEF CAMP',
          statusColor: f.currentFacilityType === 'HOSPITAL' ? '#f59e0b' : '#10b981',
          contactPhone: f.contactPhone || '+91 98401 55667',
          medicalNotes: f.notes || 'Registered at facility intake',
          photoUrl: f.photoUrl,
        });
      }
    });

    // Curated rich mock family members for demo if Ramasamy Family
    if (scannedFamilyCard === 'FC-TAM-884920' || scannedName.includes('Ramasamy')) {
      // Add Lakshmi Ramasamy (Wife in Basin Bridge Camp)
      if (!results.some(r => r.fullName.includes('Lakshmi'))) {
        results.push({
          id: 'FAM-RAM-01',
          type: 'FOUND_RECORD',
          fullName: 'Lakshmi Ramasamy',
          relationship: 'Wife',
          age: 44,
          gender: 'FEMALE',
          familyCardNumber: 'FC-TAM-884920',
          aadhaarNumber: '9842-5510-8841',
          currentWhereabouts: 'Basin Bridge Community Flood Relief Camp — Tent Block C-04',
          facilityOrLocationName: 'Basin Bridge Community Flood Relief Camp',
          statusBadge: 'SAFE IN RELIEF CAMP',
          statusColor: '#10b981',
          contactPhone: '+91 98401 55667',
          medicalNotes: 'Safe, received dry ration & blankets. Searching for husband and children.',
          photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
        });
      }
      // Add Karthik Ramasamy (Son in Rajiv Gandhi Hospital)
      if (!results.some(r => r.fullName.includes('Karthik'))) {
        results.push({
          id: 'FAM-RAM-02',
          type: 'FOUND_RECORD',
          fullName: 'Karthik Ramasamy',
          relationship: 'Son',
          age: 16,
          gender: 'MALE',
          familyCardNumber: 'FC-TAM-884920',
          aadhaarNumber: '9842-8812-3390',
          currentWhereabouts: 'Government Rajiv Gandhi General Hospital — Emergency Ward 2, Bed #08',
          facilityOrLocationName: 'Government Rajiv Gandhi General Hospital (Zone B)',
          statusBadge: 'HOSPITALIZED (STABLE)',
          statusColor: '#f59e0b',
          contactPhone: '+91 44 2530 5111',
          medicalNotes: 'Treated for minor leg laceration during flood rescue. Vitals stable.',
          photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
        });
      }
      // Add Priya Ramasamy (Daughter - Missing Report)
      if (!results.some(r => r.fullName.includes('Priya'))) {
        results.push({
          id: 'FAM-RAM-03',
          type: 'MISSING_REPORT',
          fullName: 'Priya Ramasamy',
          relationship: 'Daughter',
          age: 12,
          gender: 'FEMALE',
          familyCardNumber: 'FC-TAM-884920',
          aadhaarNumber: '9842-3391-7700',
          currentWhereabouts: 'Last Seen: Basin Bridge Junction Evacuation Point (Missing Case #M088)',
          facilityOrLocationName: 'Basin Bridge High Road Flooded Sector',
          statusBadge: 'SEARCH ACTIVE (MISSING REPORTED)',
          statusColor: '#ef4444',
          contactPhone: '+91 98401 55667',
          medicalNotes: 'Wearing yellow raincoat. Field Rescue Team NDRF-Boat-Alpha assigned.',
          photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
        });
      }
    } else if (scannedFamilyCard === 'FC-TAM-441298' || scannedName.includes('Soundarya')) {
      // Soundarya's husband is Ravi Kumar (#R124) in RGGH
      results.push({
        id: 'FAM-KUM-01',
        type: 'FOUND_RECORD',
        fullName: 'Ravi Kumar',
        relationship: 'Husband',
        age: 42,
        gender: 'MALE',
        familyCardNumber: 'FC-TAM-441298',
        aadhaarNumber: '7712-9988-1120',
        currentWhereabouts: 'Government Rajiv Gandhi General Hospital — Emergency Ward 3, Bed #14 (Case #R124)',
        facilityOrLocationName: 'Government Rajiv Gandhi General Hospital (Zone B)',
        statusBadge: 'HOSPITALIZED (CORRELATED MATCH)',
        statusColor: '#f59e0b',
        contactPhone: '+91 98401 23456',
        medicalNotes: 'Wrist sprain dressing completed. Vitals good.',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      });
      results.push({
        id: 'FAM-KUM-02',
        type: 'FOUND_RECORD',
        fullName: 'Meena Kumar',
        relationship: 'Mother-in-law',
        age: 65,
        gender: 'FEMALE',
        familyCardNumber: 'FC-TAM-441298',
        aadhaarNumber: '7712-4410-0091',
        currentWhereabouts: 'Nehru Indoor Stadium Disaster Relief Shelter #3 — Senior Wing',
        facilityOrLocationName: 'Nehru Indoor Stadium Relief Shelter #3',
        statusBadge: 'SAFE IN RELIEF CAMP',
        statusColor: '#10b981',
        contactPhone: '+91 94440 65432',
        medicalNotes: 'Provided cardiac medication support.',
      });
    } else {
      // General dynamic fallbacks if custom family card scanned
      results.push({
        id: `FAM-GEN-01`,
        type: 'FOUND_RECORD',
        fullName: `${scannedName.split(' ')[0]}'s Family Member`,
        relationship: 'Spouse / Parent',
        age: 40,
        gender: 'FEMALE',
        familyCardNumber: scannedFamilyCard,
        aadhaarNumber: '9910-4421-8890',
        currentWhereabouts: 'Basin Bridge Community Flood Relief Camp — Sector C',
        facilityOrLocationName: 'Basin Bridge Community Relief Camp',
        statusBadge: 'SAFE IN RELIEF CAMP',
        statusColor: '#10b981',
        contactPhone: '+91 98400 12345',
        medicalNotes: 'Admitted to camp shelter safe and sound.',
      });
    }

    setSearchResults(results);
  };

  return (
    <div className="app-container" style={{ padding: '32px 0 60px' }}>
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          marginBottom: '32px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#60a5fa',
                  padding: '10px',
                  borderRadius: '12px',
                  display: 'flex',
                }}
              >
                <Fingerprint size={28} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  Biometric Identity & Family Reunification Module
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Scan fingerprints or biometric data to instantly retrieve verified Aadhaar UIDAI & Smart Family Card records to trace displaced family members across relief camps.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <span className="badge badge-verification" style={{ padding: '8px 14px', fontSize: '0.75rem' }}>
              <ShieldCheck size={14} /> UIDAI & Civil Supplies Integrated
            </span>
          </div>
        </div>
      </div>

      <div className="grid-cols-2" style={{ gap: '28px' }}>
        {/* LEFT COLUMN: BIOMETRIC SCANNER HARDWARE SIMULATOR */}
        <div>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Fingerprint size={20} color="var(--accent-cyan)" /> Step 1: Biometric Scanner Terminal
            </h3>

            {/* Select Demo Subject Preset */}
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ fontSize: '0.825rem' }}>
                Select Biometric Test Record / Profile:
              </label>
              <select
                className="form-select"
                value={selectedPresetIndex}
                onChange={e => {
                  setSelectedPresetIndex(Number(e.target.value));
                  setScanCompleted(false);
                  setActiveProfile(null);
                  setSavedCaseId(null);
                  setSearchResults(null);
                }}
                disabled={isScanning}
              >
                {PRESET_BIOMETRIC_PROFILES.map((p, idx) => (
                  <option key={p.id} value={idx}>
                    {p.name} — Family Card: {p.familyCardNumber} ({p.facilityName})
                  </option>
                ))}
              </select>
            </div>

            {/* SCANNER GRAPHIC PANEL */}
            <div
              style={{
                background: '#090d16',
                border: isScanning ? '2px solid #38bdf8' : scanCompleted ? '2px solid #34d399' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 20px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: isScanning ? '0 0 25px rgba(56, 189, 248, 0.25)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Pulsing Scanner laser line */}
              {isScanning && (
                <div
                  style={{
                    position: 'absolute',
                    top: `${scanProgress}%`,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, #38bdf8, #60a5fa, transparent)',
                    boxShadow: '0 0 12px #38bdf8',
                    transition: 'top 0.3s linear',
                    zIndex: 2,
                  }}
                />
              )}

              <div
                style={{
                  width: '100px',
                  height: '100px',
                  margin: '0 auto 16px',
                  borderRadius: '50%',
                  background: scanCompleted
                    ? 'rgba(52, 211, 153, 0.15)'
                    : isScanning
                    ? 'rgba(56, 189, 248, 0.15)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: scanCompleted
                    ? '2px solid #34d399'
                    : isScanning
                    ? '2px solid #38bdf8'
                    : '2px dashed var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: scanCompleted ? '#34d399' : isScanning ? '#38bdf8' : 'var(--text-muted)',
                  transition: 'all 0.3s ease',
                }}
              >
                {scanCompleted ? (
                  <CheckCircle2 size={52} className="pulse-emerald" />
                ) : (
                  <Fingerprint size={56} className={isScanning ? 'pulse-cyan' : ''} />
                )}
              </div>

              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                {isScanning
                  ? 'Scanning Fingerprint Biometrics...'
                  : scanCompleted
                  ? 'Biometric Verification Complete!'
                  : 'Place Finger / Iris on Scanner'}
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '320px', margin: '0 auto 20px' }}>
                {isScanning
                  ? `Processing ridge minutiae... ${scanProgress}%`
                  : scanCompleted
                  ? `Matched UIDAI Aadhaar record for ${scannedName}`
                  : 'Press "Verify with Biometrics" or "Scan Complete" to fetch identity numbers.'}
              </p>

              {/* Progress bar */}
              {isScanning && (
                <div
                  style={{
                    width: '80%',
                    height: '6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '3px',
                    margin: '0 auto 20px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${scanProgress}%`,
                      height: '100%',
                      background: 'var(--accent-cyan)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              )}

              {/* BUTTONS FOR SCAN ACTION */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleStartScan}
                  disabled={isScanning}
                  style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
                >
                  <Fingerprint size={18} /> Verify with Biometrics
                </button>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleScanCompleteNow}
                  disabled={isScanning}
                  style={{ padding: '10px 20px', borderColor: '#34d399', color: '#34d399' }}
                >
                  <CheckCircle2 size={18} /> Scan Complete
                </button>
              </div>
            </div>

            {/* Quick Helper Note */}
            <div
              style={{
                marginTop: '20px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                fontSize: '0.8rem',
                color: '#93c5fd',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}
            >
              <Sparkles size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Aadhaar & Family Card Query Protocol:</strong> Clicking <strong>"Verify with Biometrics"</strong> or <strong>"Scan Complete"</strong> automatically fetches the Aadhaar number & Smart Family Card number associated with the individual.
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FETCHED PERSON DETAILS & ACTION BUTTONS */}
        <div>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={20} color="var(--accent-emerald)" /> Step 2: Fetched Biometric & Family Details
            </h3>

            {!scanCompleted ? (
              <div
                style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  background: 'rgba(15, 23, 42, 0.4)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--border-color)',
                  color: 'var(--text-muted)',
                }}
              >
                <Fingerprint size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Awaiting Biometric Scan</div>
                <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                  Click <strong>"Verify with Biometrics"</strong> or <strong>"Scan Complete"</strong> on the left panel to fetch government details.
                </div>
              </div>
            ) : (
              <div>
                {/* FETCHED GOVT NUMBERS BANNER */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    marginBottom: '20px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                      Verified Aadhaar Number
                    </div>
                    <div
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: '#ffffff',
                        fontFamily: 'var(--font-mono)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginTop: '2px',
                      }}
                    >
                      <ShieldCheck size={16} color="#34d399" /> {scannedAadhaar}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                      Smart Family Card Number
                    </div>
                    <div
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: '#60a5fa',
                        fontFamily: 'var(--font-mono)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginTop: '2px',
                      }}
                    >
                      <Users size={16} color="#60a5fa" /> {scannedFamilyCard}
                    </div>
                  </div>
                </div>

                {/* EDITABLE DETAILS FORM */}
                <div className="grid-cols-2" style={{ gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Full Name:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={scannedName}
                      onChange={e => setScannedName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Age:</label>
                    <input
                      type="number"
                      className="form-input"
                      value={scannedAge}
                      onChange={e => setScannedAge(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid-cols-2" style={{ gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Gender:</label>
                    <select
                      className="form-select"
                      value={scannedGender}
                      onChange={e => setScannedGender(e.target.value as any)}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Medical Condition:</label>
                    <select
                      className="form-select"
                      value={medicalCondition}
                      onChange={e => setMedicalCondition(e.target.value as any)}
                    >
                      <option value="STABLE">Stable / Normal</option>
                      <option value="MINOR_INJURIES">Minor Injuries</option>
                      <option value="CRITICAL">Critical Care Needed</option>
                      <option value="UNCONSCIOUS">Unconscious</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Current Relief Facility / Camp Location:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={facilityName}
                    onChange={e => setFacilityName(e.target.value)}
                  />
                </div>

                {/* TWO ACTION BUTTONS (MANDATORY AS REQUESTED) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '14px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-color)',
                  }}
                >
                  {/* BUTTON 1: SAVE ALONE */}
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleSaveAlone}
                    style={{
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                    }}
                  >
                    <Save size={18} /> Save Alone
                  </button>

                  {/* BUTTON 2: SAVE & SEARCH FOR FAMILY MEMBERS */}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveAndSearchFamily}
                    style={{
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                    }}
                  >
                    <Users size={18} /> Save & Search Family
                  </button>
                </div>

                {/* SUCCESS TOAST IF SAVED ALONE */}
                {savedCaseId && !searchResults && (
                  <div
                    style={{
                      marginTop: '16px',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid #10b981',
                      color: '#6ee7b7',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={18} color="#34d399" />
                      <span>
                        Record saved successfully! Intake Case Reference: <strong>{savedCaseId}</strong>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEARCH RESULTS SECTION: FAMILY MEMBERS WHEREABOUTS MATRIX */}
      {searchResults && (
        <section
          style={{
            marginTop: '36px',
            animation: 'fadeIn 0.3s ease-in-out',
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: '28px',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(16, 185, 129, 0.05))',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-verification" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                    <Users size={14} /> FAMILY CARD QUERY: {searchedCardNumber}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Found {searchResults.length} Family Member(s) in Database
                  </span>
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '6px', color: '#ffffff' }}>
                  Family Members' Relief Camp & Medical Whereabouts
                </h2>
              </div>

              {savedCaseId && (
                <div style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 700 }}>
                  ✓ Intake Saved: {savedCaseId}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {searchResults.map(member => (
                <div
                  key={member.id}
                  style={{
                    background: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '300px' }}>
                    {/* Avatar photo */}
                    <img
                      src={
                        member.photoUrl ||
                        (member.gender === 'FEMALE'
                          ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
                          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80')
                      }
                      alt={member.fullName}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--border-color)',
                      }}
                    />

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                          {member.fullName}
                        </span>
                        <span style={{ fontSize: '0.825rem', color: '#60a5fa', background: 'rgba(96, 165, 250, 0.15)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                          Relationship: {member.relationship} ({member.age}y, {member.gender})
                        </span>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '12px',
                            background: `${member.statusColor}20`,
                            color: member.statusColor,
                            border: `1px solid ${member.statusColor}40`,
                          }}
                        >
                          {member.statusBadge}
                        </span>
                      </div>

                      <div style={{ marginTop: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', color: '#93c5fd', fontWeight: 600 }}>
                        <Building2 size={16} /> Current Whereabouts: {member.currentWhereabouts}
                      </div>

                      <div style={{ marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <span>
                          <strong>Contact Phone:</strong> {member.contactPhone}
                        </span>
                        <span>
                          <strong>Aadhaar:</strong> {member.aadhaarNumber}
                        </span>
                        {member.medicalNotes && (
                          <span>
                            <strong>Status Notes:</strong> {member.medicalNotes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTON ON FAMILY MEMBER RECORD */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setReunificationRequestedId(member.id)}
                      disabled={reunificationRequestedId === member.id}
                      style={{
                        padding: '10px 16px',
                        background: reunificationRequestedId === member.id ? '#10b981' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {reunificationRequestedId === member.id ? (
                        <>
                          <CheckCircle2 size={15} /> Transfer Dispatched
                        </>
                      ) : (
                        <>
                          <HeartPulse size={15} /> Initiate Reunification Transfer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ALERT BOX AFTER REUNIFICATION REQUEST */}
            {reunificationRequestedId && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={20} color="#34d399" />
                  <div>
                    <strong>Reunification Dispatch Alert Created!</strong> Field rescue unit and relief camp desk notified to facilitate physical family handover at {scannedName}'s facility.
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
