import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCases } from '../context/CaseContext';
import type { VulnerabilityCategory } from '../types';
import {
  X,
  UserPlus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReportMissingModalProps {
  onClose: () => void;
  onSuccess: (caseNumber: string) => void;
}

export const ReportMissingModal: React.FC<ReportMissingModalProps> = ({ onClose, onSuccess }) => {
  const { t } = useLanguage();
  const { reportMissingPerson } = useCases();

  const [step, setStep] = useState(1);
  const [createdCaseNum, setCreatedCaseNum] = useState<string | null>(null);

  // Form states
  // Step 1: Reporter
  const [reporterName, setReporterName] = useState('');
  const [reporterRelationship, setReporterRelationship] = useState('Parent');
  const [reporterContact, setReporterContact] = useState('');
  const [reporterAlternateContact, setReporterAlternateContact] = useState('');

  // Step 2: Missing Individual
  const [fullName, setFullName] = useState('');
  const [aliasName, setAliasName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [vulnerability, setVulnerability] = useState<VulnerabilityCategory>('NONE');

  // Step 3: Physical Marks & Clothing
  const [scars, setScars] = useState('');
  const [clothingUpper, setClothingUpper] = useState('');
  const [clothingLower, setClothingLower] = useState('');
  const [accessories, setAccessories] = useState('');

  // Step 4: Location & Photo
  const [lastSeenAddress, setLastSeenAddress] = useState('');
  const [lastSeenLandmark, setLastSeenLandmark] = useState('');
  const [lastSeenTime, setLastSeenTime] = useState(new Date().toISOString().slice(0, 16));
  const [photoUrl, setPhotoUrl] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !age || !reporterContact || !lastSeenAddress) {
      alert('Please fill out required fields.');
      return;
    }

    const marksArray = scars
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const accessoriesArray = accessories
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    try {
      const caseNum = await reportMissingPerson({
        reporterName: reporterName || 'Concerned Relative',
        reporterRelationship,
        reporterContact,
        reporterAlternateContact,
        fullName,
        aliasName,
        age: Number(age),
        gender,
        vulnerability,
        traits: {
          age: Number(age),
          gender,
          distinguishingMarks: marksArray,
          clothingUpper,
          clothingLower,
          accessories: accessoriesArray,
        },
        lastSeenLocation: {
          lat: 13.0827,
          lng: 80.2707,
          address: lastSeenAddress,
          landmark: lastSeenLandmark,
          sector: 'Sector Delta-1',
        },
        lastSeenTime: new Date(lastSeenTime).toISOString(),
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        additionalNotes,
      });

      setCreatedCaseNum(caseNum);
      setStep(5);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      alert(`Submission error: ${err.message || err}`);
    }
  };


  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '640px', padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 16px 24px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(244, 63, 94, 0.15)',
                color: '#fb7185',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserPlus size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t.ctaReportMissingTitle}</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Step {step} of 4 • Automated Fusion Registry
              </span>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Step Progression indicator */}
        {step < 5 && (
          <div style={{ display: 'flex', gap: '6px', padding: '0 24px 16px 24px', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                style={{
                  flexGrow: 1,
                  height: '4px',
                  borderRadius: '2px',
                  background: s <= step ? '#f43f5e' : '#334155',
                  transition: 'background 0.3s ease',
                }}
              />
            ))}
          </div>
        )}

        <div className="modal-body-scroll" style={{ padding: '24px', overflowY: 'auto' }}>
          {/* STEP 1: Reporter Contact Details */}
          {step === 1 && (
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
                Your Contact Information (Reporter)
              </h3>
              <div className="form-group">
                <label className="form-label">Your Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Meena Kumar"
                  value={reporterName}
                  onChange={e => setReporterName(e.target.value)}
                />
              </div>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Relationship to Missing Person</label>
                  <select
                    className="form-select"
                    value={reporterRelationship}
                    onChange={e => setReporterRelationship(e.target.value)}
                  >
                    <option value="Parent">Parent</option>
                    <option value="Spouse">Spouse / Partner</option>
                    <option value="Child">Son / Daughter</option>
                    <option value="Sibling">Brother / Sister</option>
                    <option value="Relative">Other Relative</option>
                    <option value="Friend">Friend / Neighbor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Primary Phone Number *</label>
                  <input
                    type="tel"
                    className="form-input"
                    required
                    placeholder="+91 98401 XXXXX"
                    value={reporterContact}
                    onChange={e => setReporterContact(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Alternate Contact Phone (Optional)</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 94440 XXXXX"
                  value={reporterAlternateContact}
                  onChange={e => setReporterAlternateContact(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (!reporterName || !reporterContact) {
                      alert('Please provide your name and phone number.');
                      return;
                    }
                    setStep(2);
                  }}
                >
                  Next: Person Details <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Missing Individual Details */}
          {step === 2 && (
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
                Missing Person Identity Details
              </h3>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Missing Person's Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Ravi Kumar"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Alias / Nickname (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Chhotu / Anand"
                    value={aliasName}
                    onChange={e => setAliasName(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid-cols-3">
                <div className="form-group">
                  <label className="form-label">Age *</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    min="0"
                    max="120"
                    placeholder="42"
                    value={age}
                    onChange={e => setAge(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender *</label>
                  <select
                    className="form-select"
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Vulnerability</label>
                  <select
                    className="form-select"
                    value={vulnerability}
                    onChange={e => setVulnerability(e.target.value as any)}
                  >
                    <option value="NONE">Standard</option>
                    <option value="CHILD">Child (&lt;12y)</option>
                    <option value="ELDERLY">Elderly (&gt;65y)</option>
                    <option value="INJURED">Injured / Medical</option>
                    <option value="PREGNANT">Pregnant</option>
                    <option value="DISABLED">Special Needs</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>
                  <ArrowLeft size={15} /> Back
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (!fullName || !age) {
                      alert('Please enter full name and age.');
                      return;
                    }
                    setStep(3);
                  }}
                >
                  Next: Physical Traits <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Physical Marks & Clothing */}
          {step === 3 && (
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
                Distinguishing Characteristics & Clothing
              </h3>
              <div className="form-group">
                <label className="form-label">
                  Distinguishing Marks, Scars, Tattoos, or Moles (High Importance)
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Scar on right palm, birthmark on shoulder"
                  value={scars}
                  onChange={e => setScars(e.target.value)}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Separate multiple marks with commas.
                </span>
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Clothing Top (Shirt / T-shirt / Kurti)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Blue check shirt"
                    value={clothingUpper}
                    onChange={e => setClothingUpper(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Clothing Bottom (Pants / Shorts / Saree)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Dark blue denim jeans"
                    value={clothingLower}
                    onChange={e => setClothingLower(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Accessories / Jewelry / Spectacles</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Silver wrist watch, black spectacles"
                  value={accessories}
                  onChange={e => setAccessories(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button className="btn btn-outline" onClick={() => setStep(2)}>
                  <ArrowLeft size={15} /> Back
                </button>
                <button className="btn btn-primary" onClick={() => setStep(4)}>
                  Next: Location & Sighting <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Location & Photo */}
          {step === 4 && (
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
                Last Seen Location & Photographic Reference
              </h3>
              <div className="form-group">
                <label className="form-label">Last Known Location / Address *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Chennai Central Railway Station Subway"
                  value={lastSeenAddress}
                  onChange={e => setLastSeenAddress(e.target.value)}
                />
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Nearby Landmark</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Main Railway Clock Tower"
                    value={lastSeenLandmark}
                    onChange={e => setLastSeenLandmark(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Approximate Time Last Seen</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={lastSeenTime}
                    onChange={e => setLastSeenTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Photo Reference URL (Optional)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://... photo link (or will use default portrait)"
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Special Medical Notes or Instructions</label>
                <textarea
                  className="form-textarea"
                  placeholder="e.g. Needs asthma inhaler, was carrying emergency documents"
                  value={additionalNotes}
                  onChange={e => setAdditionalNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button className="btn btn-outline" onClick={() => setStep(3)}>
                  <ArrowLeft size={15} /> Back
                </button>
                <button className="btn btn-emergency btn-lg" onClick={handleSubmit}>
                  <Sparkles size={18} /> Submit & Trigger Live Case Fusion
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Success & Instant Live Case Fusion Feedback */}
          {step === 5 && (
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
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Missing Person Report Registered!</h3>
              <div
                style={{
                  display: 'inline-block',
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-md)',
                  marginTop: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: '#93c5fd',
                }}
              >
                Case Reference: {createdCaseNum}
              </div>

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  maxWidth: '480px',
                  margin: '20px auto',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <div style={{ color: '#34d399', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} /> Live Case Fusion Active
                </div>
                Your report has been broadcasted to all active NDRF/SDRF rescue boats, relief camp intakes, and hospital triage desks. The system is actively matching incoming records.
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    onClose();
                    if (createdCaseNum) onSuccess(createdCaseNum);
                  }}
                >
                  Track Case Progress Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
