import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCases } from '../context/CaseContext';
import type { FusedCase } from '../types';
import {
  UserPlus,
  Search,
  ShieldAlert,
  Building2,
  ArrowRight,
  HeartHandshake,
  Cpu,
  Compass,
  Sparkles,
  Fingerprint,
} from 'lucide-react';

interface PublicHomeProps {
  onOpenReportMissing: () => void;
  onOpenReportFound: () => void;
  onOpenBiometricIntake?: () => void;
  onTrackCase: (caseId?: string) => void;
  onViewFacilities: () => void;
  onSelectCase: (caseItem: FusedCase) => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  onOpenReportMissing,
  onOpenReportFound,
  onOpenBiometricIntake,
  onTrackCase,
  onViewFacilities,
  onSelectCase,
}) => {
  const { t } = useLanguage();
  const { metrics, fusedCases } = useCases();
  const [quickTrackInput, setQuickTrackInput] = useState('');

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackInput.trim()) {
      onTrackCase(quickTrackInput.trim());
    }
  };

  const sampleRecentCases = fusedCases.slice(0, 3);

  return (
    <div className="app-container" style={{ paddingBottom: '60px' }}>
      {/* Zero-Knowledge Hero Section */}
      <section className="hero-public">
        <div className="hero-badge-pill">
          <Sparkles size={15} /> Reunite360 Unified Disaster Coordination
        </div>
        <h1 className="hero-main-title">{t.heroTitle}</h1>
        <p className="hero-subtext">{t.heroSubtitle}</p>

        {/* PROMINENT BIOMETRIC VERIFICATION CALLOUT */}
        {onOpenBiometricIntake && (
          <div
            className="glass-panel"
            onClick={onOpenBiometricIntake}
            style={{
              maxWidth: '840px',
              margin: '0 auto 28px',
              padding: '16px 24px',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25), rgba(16, 185, 129, 0.25))',
              border: '1.5px solid rgba(56, 189, 248, 0.6)',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 20px rgba(56, 189, 248, 0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  background: '#38bdf8',
                  color: '#0f172a',
                  padding: '12px',
                  borderRadius: '50%',
                  display: 'flex',
                  boxShadow: '0 0 15px rgba(56, 189, 248, 0.5)',
                }}
              >
                <Fingerprint size={26} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Enter Details via Biometric <span className="badge badge-verification" style={{ fontSize: '0.7rem' }}>NEW MODULE</span>
                </div>
                <div style={{ fontSize: '0.825rem', color: '#93c5fd', marginTop: '2px' }}>
                  Scan fingerprints to fetch Aadhaar & Smart Family Card numbers and instantly find family members in relief camps.
                </div>
              </div>
            </div>

            <button className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap', background: '#38bdf8', color: '#0f172a', fontWeight: 800 }}>
              Verify with Biometrics <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* 4 PRIMARY ZERO-KNOWLEDGE ACTION CARDS */}
        <div className="action-cards-grid">
          {/* Card 1: Report Missing Person */}
          <div className="primary-action-card card-missing" onClick={onOpenReportMissing}>
            <div className="card-icon-wrapper icon-missing">
              <UserPlus size={28} />
            </div>
            <h3 className="card-title">{t.ctaReportMissingTitle}</h3>
            <p className="card-desc">{t.ctaReportMissingDesc}</p>
            <span className="card-action-link" style={{ color: '#fb7185' }}>
              Begin Registration <ArrowRight size={15} />
            </span>
          </div>

          {/* Card 2: Report Found Person */}
          <div className="primary-action-card card-found" onClick={onOpenReportFound}>
            <div className="card-icon-wrapper icon-found">
              <HeartHandshake size={28} />
            </div>
            <h3 className="card-title">{t.ctaReportFoundTitle}</h3>
            <p className="card-desc">{t.ctaReportFoundDesc}</p>
            <span className="card-action-link" style={{ color: '#34d399' }}>
              Log Sighting / Intake <ArrowRight size={15} />
            </span>
          </div>

          {/* Card 3: Track My Case */}
          <div className="primary-action-card" onClick={() => onTrackCase()}>
            <div className="card-icon-wrapper icon-track">
              <Search size={28} />
            </div>
            <h3 className="card-title">{t.ctaTrackCaseTitle}</h3>
            <p className="card-desc">{t.ctaTrackCaseDesc}</p>
            <span className="card-action-link" style={{ color: '#60a5fa' }}>
              Check Verified Status <ArrowRight size={15} />
            </span>
          </div>

          {/* Card 4: Emergency Help & Relief Camps */}
          <div className="primary-action-card" onClick={onViewFacilities}>
            <div className="card-icon-wrapper icon-help">
              <Building2 size={28} />
            </div>
            <h3 className="card-title">{t.ctaEmergencyHelpTitle}</h3>
            <p className="card-desc">{t.ctaEmergencyHelpDesc}</p>
            <span className="card-action-link" style={{ color: '#fbbf24' }}>
              View Nearby Camps <ArrowRight size={15} />
            </span>
          </div>
        </div>

        {/* Quick Search Case Bar */}
        <div
          className="glass-panel"
          style={{
            maxWidth: '680px',
            margin: '0 auto 40px',
            padding: '16px 20px',
            background: 'rgba(15, 23, 42, 0.9)',
          }}
        >
          <form onSubmit={handleQuickTrack} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="form-input"
              placeholder={t.trackPlaceholder}
              value={quickTrackInput}
              onChange={e => setQuickTrackInput(e.target.value)}
              style={{ fontSize: '0.95rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              <Search size={16} /> {t.trackButton}
            </button>
          </form>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'left' }}>
            🔒 {t.trackSafeNote}
          </div>
        </div>
      </section>

      {/* 3 CORE PILLARS SECTION */}
      <section className="core-pillars-section">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: '#93c5fd' }}>
            HOW REUNITE360 INTELLIGENTLY SOLVES DISASTER FRAGMENTATION
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px' }}>
            The 3 Foundational Pillars of Reunite360
          </h2>
        </div>

        <div className="grid-cols-3">
          {/* Pillar 1 */}
          <div className="pillar-card">
            <div className="pillar-number">CORE SOLUTION 01</div>
            <h3 className="pillar-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={20} color="var(--accent-cyan)" /> {t.coreFusionTitle}
            </h3>
            <p className="pillar-desc">{t.coreFusionDesc}</p>
            <div style={{ marginTop: '16px', fontSize: '0.8rem', color: '#93c5fd', background: 'rgba(59, 130, 246, 0.1)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
              ✓ Age & Scar Correlation <br />
              ✓ Conflict Detection (Clothes/Time) <br />
              ✓ Explainable Score Breakdown
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="pillar-card">
            <div className="pillar-number">CORE SOLUTION 02</div>
            <h3 className="pillar-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={20} color="var(--accent-amber)" /> {t.coreNbaTitle}
            </h3>
            <p className="pillar-desc">{t.coreNbaDesc}</p>
            <div style={{ marginTop: '16px', fontSize: '0.8rem', color: '#fbbf24', background: 'rgba(245, 158, 11, 0.1)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
              ✓ Vulnerability & Urgency Weighing <br />
              ✓ Step-by-Step Task Generation <br />
              ✓ Human-in-the-Loop Decisions
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="pillar-card">
            <div className="pillar-number">CORE SOLUTION 03</div>
            <h3 className="pillar-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={20} color="var(--accent-emerald)" /> {t.coreLoopTitle}
            </h3>
            <p className="pillar-desc">{t.coreLoopDesc}</p>
            <div style={{ marginTop: '16px', fontSize: '0.8rem', color: '#6ee7b7', background: 'rgba(16, 185, 129, 0.1)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
              ✓ Strict 7-Stage State Machine <br />
              ✓ Zero Premature Rumor Leaks <br />
              ✓ Verified Physical Handover Audit
            </div>
          </div>
        </div>
      </section>

      {/* Live Active Emergency Stats Ribbon */}
      <section className="glass-panel" style={{ padding: '24px 28px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Active Disaster Telemetry & Cases</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Real-time synchronization with Regional Emergency Management Database.
            </p>
          </div>
          <span className="badge badge-verification">LIVE POSTGRESQL SYNC</span>
        </div>

        <div className="grid-cols-4">
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL CASES IN FUSION</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
              {metrics.totalActiveCases}
            </div>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CANDIDATE MATCHES</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>
              {metrics.possibleMatchesCount}
            </div>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>UNDER VERIFICATION</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#60a5fa' }}>
              {metrics.underVerificationCount}
            </div>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>FAMILIES REUNITED</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#34d399' }}>
              {metrics.reunitedCount}
            </div>
          </div>
        </div>

        {/* Highlighted exemplar cases */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px' }}>
            Featured Exemplar Active Cases:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sampleRecentCases.map(c => (
              <div
                key={c.id}
                onClick={() => onSelectCase(c)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 800, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>{c.caseNumber}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{c.title}</span>
                  <span className={`badge ${c.status === 'REUNITED' ? 'badge-reunited' : 'badge-possible'}`}>
                    {c.status.replace('_', ' ')}
                  </span>
                </div>
                <span className="btn btn-outline btn-sm">
                  Inspect Fusion Details <ArrowRight size={13} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
