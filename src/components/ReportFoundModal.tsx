import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCases } from '../context/CaseContext';
import type { VulnerabilityCategory } from '../types';
import {
  X,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReportFoundModalProps {
  onClose: () => void;
  onSuccess: (caseNumber: string) => void;
}

export const ReportFoundModal: React.FC<ReportFoundModalProps> = ({ onClose, onSuccess }) => {
  const { t } = useLanguage();
  const { reportFoundPerson, facilities } = useCases();

  const [isIdentified] = useState(false);
  const [givenName] = useState('');
  const [reporterRole, setReporterRole] = useState<'RESCUE_TEAM' | 'HOSPITAL' | 'SHELTER' | 'CITIZEN'>('RESCUE_TEAM');
  const [reporterName, setReporterName] = useState('NDRF Field Team Alpha');
  const [contactPhone] = useState('+91 98400 91101');

  const [estimatedAgeMin, setEstimatedAgeMin] = useState<number | ''>(40);
  const [estimatedAgeMax, setEstimatedAgeMax] = useState<number | ''>(45);
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN'>('MALE');
  const [medicalCondition, setMedicalCondition] = useState<'STABLE' | 'MINOR_INJURIES' | 'CRITICAL' | 'UNCONSCIOUS'>('MINOR_INJURIES');
  const [vulnerability] = useState<VulnerabilityCategory>('INJURED');

  const [scars, setScars] = useState('Scar on right palm');
  const [clothingUpper, setClothingUpper] = useState('Blue check shirt');
  const [clothingLower, setClothingLower] = useState('Dark denim jeans');

  const [foundAddress, setFoundAddress] = useState('Railway Bridge Canal Post, Sector Delta-1');
  const [currentFacilityId, setCurrentFacilityId] = useState(facilities[0]?.id || '');
  const [wardOrBed, setWardOrBed] = useState('Emergency Ward #3, Bed 14');
  const [photoUrl] = useState('');
  const [notes] = useState('Rescued from flooded culvert. Stable vitals, right wrist dressing applied.');

  const [createdCaseNum, setCreatedCaseNum] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const marksArray = scars.split(',').map(s => s.trim()).filter(Boolean);
    const selectedFacility = facilities.find(f => f.id === currentFacilityId) || facilities[0];

    try {
      const caseNum = await reportFoundPerson({
        reportedByRole: reporterRole,
        reportedByName: reporterName,
        contactPhone,
        isIdentified,
        givenName: isIdentified ? givenName : undefined,
        estimatedAgeMin: estimatedAgeMin ? Number(estimatedAgeMin) : undefined,
        estimatedAgeMax: estimatedAgeMax ? Number(estimatedAgeMax) : undefined,
        gender,
        vulnerability,
        medicalCondition,
        isConscious: medicalCondition !== 'UNCONSCIOUS',
        traits: {
          approxAgeMin: estimatedAgeMin ? Number(estimatedAgeMin) : undefined,
          approxAgeMax: estimatedAgeMax ? Number(estimatedAgeMax) : undefined,
          gender,
          distinguishingMarks: marksArray,
          clothingUpper,
          clothingLower,
        },
        foundLocation: {
          lat: 13.0827,
          lng: 80.2707,
          address: foundAddress,
          sector: 'Sector Delta-1',
        },
        foundTime: new Date().toISOString(),
        currentFacilityType: selectedFacility ? selectedFacility.type : 'SHELTER',
        currentFacilityName: selectedFacility ? selectedFacility.name : 'Relief Shelter',
        currentFacilityId: selectedFacility ? selectedFacility.id : undefined,
        wardOrBed,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        notes,
      });

      setCreatedCaseNum(caseNum);
      setIsDone(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      alert(`Intake submission error: ${err.message || err}`);
    }
  };


  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '680px', padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 16px 24px', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HeartHandshake size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t.ctaReportFoundTitle}</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Field Rescue & Shelter Intake Registry
              </span>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body-scroll" style={{ padding: '24px', overflowY: 'auto' }}>
          {!isDone ? (
            <form onSubmit={handleSubmit}>
              {/* Triage Status */}
              <div className="grid-cols-2" style={{ marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Logged By Source</label>
                  <select
                    className="form-select"
                    value={reporterRole}
                    onChange={e => setReporterRole(e.target.value as any)}
                  >
                    <option value="RESCUE_TEAM">Field Rescue Unit (NDRF / SDRF)</option>
                    <option value="HOSPITAL">Hospital Trauma / ER Intake</option>
                    <option value="SHELTER">Relief Shelter Reception</option>
                    <option value="CITIZEN">Citizen / Good Samaritan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Reporter / Officer Name</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={reporterName}
                    onChange={e => setReporterName(e.target.value)}
                  />
                </div>
              </div>

              {/* Individual Identification & Vitals */}
              <div className="grid-cols-3">
                <div className="form-group">
                  <label className="form-label">Medical Condition</label>
                  <select
                    className="form-select"
                    value={medicalCondition}
                    onChange={e => setMedicalCondition(e.target.value as any)}
                  >
                    <option value="STABLE">Stable / Uninjured</option>
                    <option value="MINOR_INJURIES">Minor Injuries</option>
                    <option value="CRITICAL">Critical Medical Care</option>
                    <option value="UNCONSCIOUS">Unconscious</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Estimated Age (Min-Max)</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="40"
                      value={estimatedAgeMin}
                      onChange={e => setEstimatedAgeMin(e.target.value ? Number(e.target.value) : '')}
                    />
                    <input
                      type="number"
                      className="form-input"
                      placeholder="45"
                      value={estimatedAgeMax}
                      onChange={e => setEstimatedAgeMax(e.target.value ? Number(e.target.value) : '')}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="UNKNOWN">Unknown / Unconscious</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              {/* Physical Traits */}
              <div className="form-group">
                <label className="form-label">Distinguishing Marks, Scars, Tattoos</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Scar on right palm, mole on chin"
                  value={scars}
                  onChange={e => setScars(e.target.value)}
                />
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Clothing Top Found</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Blue check shirt"
                    value={clothingUpper}
                    onChange={e => setClothingUpper(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Clothing Bottom Found</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Dark jeans"
                    value={clothingLower}
                    onChange={e => setClothingLower(e.target.value)}
                  />
                </div>
              </div>

              {/* Current Facility Placement */}
              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Current Placement Facility</label>
                  <select
                    className="form-select"
                    value={currentFacilityId}
                    onChange={e => setCurrentFacilityId(e.target.value)}
                  >
                    {facilities.map(fac => (
                      <option key={fac.id} value={fac.id}>
                        {fac.name} ({fac.availableBeds} beds available)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Ward / Bed / Tent Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Emergency Ward #3, Bed 14"
                    value={wardOrBed}
                    onChange={e => setWardOrBed(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location Where Found / Rescued</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={foundAddress}
                  onChange={e => setFoundAddress(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" className="btn btn-outline" onClick={onClose}>
                  {t.cancel}
                </button>
                <button type="submit" className="btn btn-success btn-lg">
                  <Sparkles size={18} /> Register Intake & Run Live Match Radar
                </button>
              </div>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '2px solid #10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: '#34d399',
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Rescued Individual Intake Registered!</h3>
              <div
                style={{
                  display: 'inline-block',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-md)',
                  marginTop: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: '#6ee7b7',
                }}
              >
                Intake Case ID: {createdCaseNum}
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '16px auto 24px' }}>
                The Live Case Fusion Engine has evaluated this intake against all missing reports in the disaster area. Matching candidate reports have been queued for authority verification.
              </p>

              <button
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  if (createdCaseNum) onSuccess(createdCaseNum);
                }}
              >
                Open Correlated Case Analysis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
