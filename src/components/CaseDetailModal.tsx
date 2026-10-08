import React, { useState } from 'react';
import { useCases } from '../context/CaseContext';
import type { FusedCase, CaseStatus } from '../types';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Activity,
  Sparkles,
  HeartHandshake,
  User,
  Building2,
  MapPin,
  ArrowRight,
  Phone,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CaseDetailModalProps {
  fusedCase: FusedCase;
  onClose: () => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({ fusedCase, onClose }) => {
  const { userRole, updateCaseStatus, verifyCandidateMatch, confirmOfficialReunification } = useCases();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EVIDENCE' | 'TIMELINE' | 'ACTIONS' | 'VERIFY'>('OVERVIEW');
  const [verifierName, setVerifierName] = useState('Dr. S. K. Narayanan (Medical Supervisor)');
  const [verificationMethod, setVerificationMethod] = useState('Biometric Facial Comparison & Right Palm Scar Confirmation');
  const [verificationNotes, setVerificationNotes] = useState('Patient right palm scar matches family photo and description precisely. Confirmed conscious orientation.');
  
  const [reuniteReceiver, setReuniteReceiver] = useState(fusedCase.missingReport?.reporterName || 'Family Member');
  const [reuniteFacilitator, setReuniteFacilitator] = useState('Officer K. Ramanathan (Zonal Incident Command)');
  const [reuniteNotes, setReuniteNotes] = useState('Official physical handover complete. Identity verified via government photo ID.');

  const missing = fusedCase.missingReport;
  const found = fusedCase.foundRecord;
  const match = fusedCase.candidateMatch;
  const nba = fusedCase.nextBestActions[0];

  const handleVerify = async () => {
    try {
      await verifyCandidateMatch(fusedCase.id, verifierName, verificationMethod, verificationNotes);
      setActiveTab('OVERVIEW');
    } catch (err: any) {
      alert(`Verification failed: ${err.message || err}`);
    }
  };

  const handleReunite = async () => {
    try {
      await confirmOfficialReunification(fusedCase.id, reuniteFacilitator, reuniteReceiver, reuniteNotes);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      setActiveTab('OVERVIEW');
    } catch (err: any) {
      alert(`Reunification failed: ${err.message || err}`);
    }
  };

  const handleStatusChange = async (newStatus: CaseStatus) => {
    const res = await updateCaseStatus(fusedCase.id, newStatus, `Transitioned by ${userRole}`);
    if (!res.success) {
      alert(res.message);
    }
  };


  const statusList: CaseStatus[] = [
    'UNVERIFIED',
    'POSSIBLE_MATCH',
    'UNDER_VERIFICATION',
    'VERIFIED',
    'FAMILY_NOTIFIED',
    'REUNITED',
    'CLOSED',
  ];

  const currentStatusIdx = statusList.indexOf(fusedCase.status);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{
          maxWidth: '1060px',
          width: '95vw',
          height: '88vh',
          maxHeight: '880px',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div
          style={{
            padding: '18px 24px',
            background: 'linear-gradient(180deg, #192338 0%, #0d1526 100%)',
            borderBottom: '1px solid rgba(59, 130, 246, 0.25)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 800,
                fontSize: '1rem',
                flexShrink: 0,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              }}
            >
              {fusedCase.caseNumber}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {fusedCase.title}
                </h2>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span
                    className={`badge ${
                      fusedCase.status === 'REUNITED'
                        ? 'badge-reunited'
                        : fusedCase.status === 'VERIFIED'
                        ? 'badge-verified'
                        : 'badge-possible'
                    }`}
                  >
                    {fusedCase.status.replace('_', ' ')}
                  </span>
                  {fusedCase.priority === 'CRITICAL' && (
                    <span className="badge badge-critical">CRITICAL PRIORITY</span>
                  )}
                  {match && (
                    <span className="badge badge-verification" style={{ color: '#93c5fd' }}>
                      {match.overallScore}% MATCH
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  marginTop: '4px',
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <span>Case ID: <strong>{fusedCase.id}</strong></span>
                <span>•</span>
                <span>Created: {new Date(fusedCase.createdAt).toLocaleDateString()} {new Date(fusedCase.createdAt).toLocaleTimeString()}</span>
                <span>•</span>
                <span>Last Fusion Update: {new Date(fusedCase.updatedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          <button
            className="btn btn-outline btn-sm"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              padding: '0',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Unified State Progression Stepper */}
        <div
          style={{
            padding: '10px 24px',
            background: 'rgba(11, 17, 32, 0.95)',
            borderBottom: '1px solid var(--border-color)',
            flexShrink: 0,
          }}
        >
          <div className="state-stepper">
            <div className="stepper-progress-bar">
              <div
                className="stepper-progress-fill"
                style={{ width: `${(currentStatusIdx / (statusList.length - 1)) * 100}%` }}
              />
            </div>
            {statusList.map((st, idx) => {
              const isCompleted = idx < currentStatusIdx;
              const isCurrent = idx === currentStatusIdx;
              return (
                <div
                  key={st}
                  className={`step-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                >
                  <div className="step-circle">
                    {isCompleted ? <CheckCircle2 size={15} /> : idx + 1}
                  </div>
                  <span className="step-label">
                    {st.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modern Segmented Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '10px 24px',
            background: '#070b14',
            borderBottom: '1px solid var(--border-color)',
            flexShrink: 0,
            overflowX: 'auto',
          }}
        >
          <button
            className={`btn btn-sm ${activeTab === 'OVERVIEW' ? 'btn-primary' : 'btn-outline'}`}
            style={{
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              padding: '6px 14px',
              fontSize: '0.825rem',
            }}
            onClick={() => setActiveTab('OVERVIEW')}
          >
            <User size={14} /> Dossier Overview
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'EVIDENCE' ? 'btn-primary' : 'btn-outline'}`}
            style={{
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              padding: '6px 14px',
              fontSize: '0.825rem',
            }}
            onClick={() => setActiveTab('EVIDENCE')}
          >
            <Sparkles size={14} /> Case Fusion & Match {match && `(${match.overallScore}%)`}
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'TIMELINE' ? 'btn-primary' : 'btn-outline'}`}
            style={{
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              padding: '6px 14px',
              fontSize: '0.825rem',
            }}
            onClick={() => setActiveTab('TIMELINE')}
          >
            <Clock size={14} /> Timeline ({fusedCase.timeline.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'ACTIONS' ? 'btn-primary' : 'btn-outline'}`}
            style={{
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              padding: '6px 14px',
              fontSize: '0.825rem',
            }}
            onClick={() => setActiveTab('ACTIONS')}
          >
            <Activity size={14} /> Next-Best-Action
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'VERIFY' ? 'btn-success' : 'btn-outline'}`}
            style={{
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              padding: '6px 14px',
              fontSize: '0.825rem',
            }}
            onClick={() => setActiveTab('VERIFY')}
          >
            <ShieldCheck size={14} /> Authority Verification
          </button>
        </div>

        {/* Tab Contents (Scrollable Viewport) */}
        <div className="modal-body-scroll" style={{ padding: '24px', flex: '1 1 auto', overflowY: 'auto', minHeight: 0 }}>
          {/* TAB 1: WHO & WHERE OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Dual Column: Missing Report vs Found Intake */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                  gap: '18px',
                }}
              >
                {/* Source A: Missing Report */}
                <div
                  className="record-box"
                  style={{
                    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(10, 16, 30, 0.95) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
                      paddingBottom: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#3b82f6',
                        }}
                      />
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#93c5fd', letterSpacing: '0.04em' }}>
                        SOURCE A: FAMILY MISSING REPORT
                      </span>
                    </div>
                    <span className="badge badge-unverified">
                      {missing?.caseNumber || 'Not filed'}
                    </span>
                  </div>

                  {missing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        {missing.photoUrl ? (
                          <img
                            src={missing.photoUrl}
                            alt={missing.fullName}
                            style={{
                              width: '74px',
                              height: '74px',
                              borderRadius: 'var(--radius-md)',
                              objectFit: 'cover',
                              border: '2px solid rgba(59, 130, 246, 0.4)',
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '74px',
                              height: '74px',
                              borderRadius: 'var(--radius-md)',
                              background: 'rgba(59, 130, 246, 0.15)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#60a5fa',
                              flexShrink: 0,
                            }}
                          >
                            <User size={32} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                            {missing.fullName}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            Age: <strong>{missing.age} years</strong> • Gender: <strong>{missing.gender}</strong>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Phone size={12} /> Contact: {missing.reporterName} ({missing.reporterRelationship}) • {missing.reporterContact}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          background: 'rgba(0, 0, 0, 0.35)',
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.825rem',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                        }}
                      >
                        <div>
                          <strong style={{ color: '#93c5fd' }}>Distinguishing Marks:</strong>{' '}
                          <span style={{ color: '#e2e8f0' }}>{missing.traits.distinguishingMarks?.join(', ') || 'None noted'}</span>
                        </div>
                        <div>
                          <strong style={{ color: '#93c5fd' }}>Reported Clothing:</strong>{' '}
                          <span style={{ color: '#e2e8f0' }}>{missing.traits.clothingUpper}, {missing.traits.clothingLower}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', marginTop: '2px' }}>
                          <MapPin size={14} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <strong style={{ color: '#fb7185' }}>Last Seen:</strong> {missing.lastSeenLocation.address}{' '}
                            <span style={{ color: '#94a3b8' }}>({new Date(missing.lastSeenTime).toLocaleTimeString()})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '16px 0' }}>
                      No missing report correlated yet. Record originated from field rescue / hospital intake.
                    </div>
                  )}
                </div>

                {/* Source B: Rescued / Found Intake */}
                <div
                  className="record-box"
                  style={{
                    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(10, 16, 30, 0.95) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
                      paddingBottom: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#10b981',
                        }}
                      />
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.04em' }}>
                        SOURCE B: RESCUED / FACILITY INTAKE
                      </span>
                    </div>
                    <span className="badge badge-verified">
                      {found?.caseNumber || 'Intake Active'}
                    </span>
                  </div>

                  {found ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        {found.photoUrl ? (
                          <img
                            src={found.photoUrl}
                            alt="Found intake"
                            style={{
                              width: '74px',
                              height: '74px',
                              borderRadius: 'var(--radius-md)',
                              objectFit: 'cover',
                              border: '2px solid rgba(16, 185, 129, 0.4)',
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '74px',
                              height: '74px',
                              borderRadius: 'var(--radius-md)',
                              background: 'rgba(16, 185, 129, 0.15)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#34d399',
                              flexShrink: 0,
                            }}
                          >
                            <Building2 size={32} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                            {found.isIdentified ? found.givenName : `Unidentified Person (${found.estimatedAgeMin ?? '?'}-${found.estimatedAgeMax ?? '?'}y)`}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            Vitals: <strong>{found.medicalCondition}</strong> • Facility: <strong>{found.currentFacilityName}</strong>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                            Logged by: {found.reportedByName} • Placement: {found.wardOrBed || 'General Ward'}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          background: 'rgba(0, 0, 0, 0.35)',
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.825rem',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                        }}
                      >
                        <div>
                          <strong style={{ color: '#6ee7b7' }}>Intake Marks:</strong>{' '}
                          <span style={{ color: '#e2e8f0' }}>{found.traits.distinguishingMarks?.join(', ') || 'Under visual triage'}</span>
                        </div>
                        <div>
                          <strong style={{ color: '#6ee7b7' }}>Found Clothing:</strong>{' '}
                          <span style={{ color: '#e2e8f0' }}>{found.traits.clothingUpper}, {found.traits.clothingLower}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', marginTop: '2px' }}>
                          <MapPin size={14} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <strong style={{ color: '#34d399' }}>Rescued Location:</strong> {found.foundLocation.address}{' '}
                            <span style={{ color: '#94a3b8' }}>({new Date(found.foundTime).toLocaleTimeString()})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '16px 0' }}>
                      No hospital/shelter intake linked yet. Search broadcast active across all field teams.
                    </div>
                  )}
                </div>
              </div>

              {/* Recommended Next-Best-Action Prominent Banner */}
              {nba && (
                <div
                  style={{
                    background: 'linear-gradient(90deg, rgba(30, 58, 138, 0.45), rgba(15, 23, 42, 0.95))',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '18px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div style={{ maxWidth: '680px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-critical" style={{ fontSize: '0.7rem' }}>
                        URGENCY: {nba.urgencyLevel}
                      </span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase' }}>
                        RECOMMENDED NEXT-BEST-ACTION
                      </span>
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                      {nba.title}
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {nba.description}
                    </div>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => setActiveTab('ACTIONS')}
                    style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    View Action Checklist ({nba.steps.length} Steps) <ArrowRight size={15} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIVE CASE FUSION & MATCH ANALYSIS */}
          {activeTab === 'EVIDENCE' && match && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Top Score Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px 24px',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  className="score-circle-lg"
                  style={{
                    background:
                      match.overallScore >= 85
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    width: '68px',
                    height: '68px',
                    fontSize: '1.3rem',
                  }}
                >
                  {match.overallScore}%
                  <span style={{ fontSize: '0.6rem', fontWeight: 700 }}>MATCH</span>
                </div>

                <div style={{ flexGrow: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Live Case Fusion Correlation Analysis</h3>
                    <span className="badge badge-verification">{match.confidenceLabel} PROBABILITY</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Multi-factor probabilistic scoring evaluating Name, Age Compatibility, Distinguishing Scars, Geolocation Proximity, and Chronological Timeline.
                  </p>

                  {/* Explainable Factor Bars */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                      gap: '12px',
                      marginTop: '14px',
                    }}
                  >
                    <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Age Compatibility</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: match.ageScore > 80 ? '#34d399' : '#fbbf24' }}>
                        {match.ageScore}%
                      </div>
                    </div>
                    <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Scars & Traits</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: match.physicalScore > 80 ? '#34d399' : '#fbbf24' }}>
                        {match.physicalScore}%
                      </div>
                    </div>
                    <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Location Proximity</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: match.locationScore > 80 ? '#34d399' : '#fbbf24' }}>
                        {match.locationScore}%
                      </div>
                    </div>
                    <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Timeline Flow</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: match.timelineScore > 80 ? '#34d399' : '#fbbf24' }}>
                        {match.timelineConsistency}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Pillars of Evidence: Supporting vs Conflicts vs Missing */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                  gap: '18px',
                }}
              >
                {/* Supporting Evidence */}
                <div className="record-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#34d399' }}>
                    <CheckCircle2 size={18} />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Supporting Evidence ({match.supportingEvidence.length})</h4>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {match.supportingEvidence.map((item, idx) => (
                      <div key={idx} className="evidence-row evidence-match">
                        <span style={{ fontWeight: 800 }}>✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conflicting Evidence & Missing Info */}
                <div className="record-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#fbbf24' }}>
                    <AlertTriangle size={18} />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                      Conflicts & Uncertainties ({match.conflictingEvidence.length + match.missingInformation.length})
                    </h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {match.conflictingEvidence.map((item, idx) => (
                      <div key={idx} className="evidence-row evidence-conflict">
                        <span style={{ fontWeight: 800 }}>⚠</span>
                        <div>
                          <strong>{item.field} Conflict ({item.severity} Severity):</strong> {item.explanation}
                        </div>
                      </div>
                    ))}

                    {match.missingInformation.map((item, idx) => (
                      <div key={idx} className="evidence-row evidence-missing">
                        <HelpCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Verification Protocol */}
              <div className="record-box" style={{ background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#93c5fd' }}>
                  <ShieldCheck size={18} />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Recommended Verification Checks for Responders</h4>
                </div>
                <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {match.recommendedVerification.map((rec, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE */}
          {activeTab === 'TIMELINE' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '18px' }}>
                Chronological Case Reconstruction & Geolocation Trail
              </h3>
              <div style={{ position: 'relative', paddingLeft: '32px' }}>
                {/* Timeline vertical bar */}
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    bottom: '8px',
                    left: '12px',
                    width: '3px',
                    background: 'linear-gradient(180deg, #3b82f6, #10b981)',
                  }}
                />

                {fusedCase.timeline.map((event) => (
                  <div key={event.id} style={{ position: 'relative', marginBottom: '20px' }}>
                    {/* Node Dot */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-26px',
                        top: '6px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: '#0f172a',
                        border: '3px solid #3b82f6',
                        boxShadow: '0 0 10px rgba(59, 130, 246, 0.6)',
                      }}
                    />

                    <div className="glass-panel" style={{ padding: '16px 20px', background: 'rgba(15, 23, 42, 0.85)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#93c5fd' }}>
                          {event.sourceType} • {event.sourceName}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(event.timestamp).toLocaleTimeString()} ({new Date(event.timestamp).toLocaleDateString()})
                        </span>
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>{event.title}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {event.description}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6ee7b7', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {event.location.address}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: NEXT-BEST-ACTION ENGINE */}
          {activeTab === 'ACTIONS' && nba && (
            <div>
              <div className="nba-box" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <span className="badge badge-verification">PRIORITY SCORE: {nba.priorityScore}/100</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '8px', color: '#ffffff' }}>{nba.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{nba.description}</p>
                  </div>
                  <div style={{ textAlign: 'right', background: 'rgba(0, 0, 0, 0.3)', padding: '10px 16px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Assigned Responder</div>
                    <div style={{ fontWeight: 800, color: '#60a5fa', fontSize: '0.95rem' }}>{nba.targetFacilityOrTeam}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📞 {nba.contactPhone}</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.85rem' }}>
                  <strong style={{ color: '#93c5fd' }}>Operational Rationale:</strong> {nba.rationale}
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '12px' }}>
                  Step-by-Step Action Protocol
                </h4>
                {nba.steps.map(step => (
                  <div key={step.stepNumber} className="nba-step-item">
                    <div className="step-badge-num">{step.stepNumber}</div>
                    <div style={{ flexGrow: 1, fontSize: '0.875rem' }}>{step.instruction}</div>
                    <span className={`badge ${step.completed ? 'badge-verified' : 'badge-unverified'}`}>
                      {step.completed ? 'DONE' : 'PENDING'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AUTHORITY VERIFICATION & CLOSURE */}
          {activeTab === 'VERIFY' && (
            <div>
              <div className="glass-panel" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.9)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={22} color="var(--accent-emerald)" /> Authority Verification & Safe Reunification Loop
                </h3>

                {fusedCase.status !== 'VERIFIED' && fusedCase.status !== 'FAMILY_NOTIFIED' && fusedCase.status !== 'REUNITED' ? (
                  <div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                      Perform authorized identity verification. Ensure photo cross-check, scar confirmation, or biometric match before signoff.
                    </p>

                    <div className="form-group">
                      <label className="form-label">Authorized Verifying Officer / Medical Lead</label>
                      <input
                        type="text"
                        className="form-input"
                        value={verifierName}
                        onChange={e => setVerifierName(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Verification Method Used</label>
                      <input
                        type="text"
                        className="form-input"
                        value={verificationMethod}
                        onChange={e => setVerificationMethod(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Official Verification Notes / Badge Confirmation</label>
                      <textarea
                        className="form-textarea"
                        value={verificationNotes}
                        onChange={e => setVerificationNotes(e.target.value)}
                      />
                    </div>

                    <button className="btn btn-success btn-lg" style={{ width: '100%', marginTop: '8px' }} onClick={handleVerify}>
                      <ShieldCheck size={18} /> Officially Verify & Authorize Family Notification
                    </button>
                  </div>
                ) : fusedCase.status !== 'REUNITED' ? (
                  <div>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '20px' }}>
                      <div style={{ color: '#34d399', fontWeight: 800 }}>✓ IDENTITY VERIFIED BY AUTHORITY</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Verified by: {fusedCase.verificationDetails?.verifiedBy} ({fusedCase.verificationDetails?.verificationMethod})
                      </div>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '12px' }}>
                      Complete Physical Handover & Family Reunification
                    </h4>

                    <div className="form-group">
                      <label className="form-label">Family Receiver Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={reuniteReceiver}
                        onChange={e => setReuniteReceiver(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Relief Center Facilitator Officer</label>
                      <input
                        type="text"
                        className="form-input"
                        value={reuniteFacilitator}
                        onChange={e => setReuniteFacilitator(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Reunification & Welfare Handover Notes</label>
                      <textarea
                        className="form-textarea"
                        value={reuniteNotes}
                        onChange={e => setReuniteNotes(e.target.value)}
                      />
                    </div>

                    <button className="btn btn-success btn-lg" style={{ width: '100%', marginTop: '8px' }} onClick={handleReunite}>
                      <HeartHandshake size={20} /> Confirm Physical Reunification & Mark REUNITED
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#34d399' }}>
                      <HeartHandshake size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>Family Safely Reunited!</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '450px', margin: '8px auto 20px' }}>
                      Handover completed to {fusedCase.reunificationDetails?.familyReceivedName} at{' '}
                      {fusedCase.reunificationDetails?.location}.
                    </p>
                    <button className="btn btn-outline" onClick={() => handleStatusChange('CLOSED')}>
                      Archive & Close Case Record
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div
          style={{
            padding: '12px 24px',
            background: '#070b14',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Reunite360 Live Case Fusion Engine v2.4 • Relational DB Pipeline Active
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
