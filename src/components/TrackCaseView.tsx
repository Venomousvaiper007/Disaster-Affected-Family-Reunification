import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCases } from '../context/CaseContext';
import { getSafeFamilyCaseView } from '../services/reunificationLoop';
import type { FusedCase } from '../types';
import {
  Search,
  MapPin,
  Clock,
  Compass,
  PhoneCall,
  AlertCircle,
  Lock,
} from 'lucide-react';

interface TrackCaseViewProps {
  initialCaseId?: string;
  onSelectCase?: (caseItem: FusedCase) => void;
}

export const TrackCaseView: React.FC<TrackCaseViewProps> = ({ initialCaseId, onSelectCase }) => {
  const { t } = useLanguage();
  const { getCaseByNumberOrId, fusedCases } = useCases();

  const [searchInput, setSearchInput] = useState(initialCaseId || '#R124');
  const [activeCase, setActiveCase] = useState<FusedCase | undefined>(() =>
    getCaseByNumberOrId(initialCaseId || '#R124')
  );
  const [hasSearched, setHasSearched] = useState(true);

  useEffect(() => {
    if (initialCaseId) {
      setSearchInput(initialCaseId);
      const found = getCaseByNumberOrId(initialCaseId);
      setActiveCase(found);
      setHasSearched(true);
    }
  }, [initialCaseId, fusedCases]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = getCaseByNumberOrId(searchInput);
    setActiveCase(found);
    setHasSearched(true);
  };

  const safeView = activeCase ? getSafeFamilyCaseView(activeCase) : null;

  return (
    <div className="app-container" style={{ padding: '32px 0 60px', maxWidth: '820px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{t.trackTitle}</h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
          Real-time, verified updates directly from emergency disaster authorities.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '32px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="form-input"
            placeholder={t.trackPlaceholder}
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            style={{ fontSize: '1rem', padding: '14px 18px' }}
          />
          <button type="submit" className="btn btn-primary btn-lg" style={{ whiteSpace: 'nowrap' }}>
            <Search size={18} /> {t.trackButton}
          </button>
        </form>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Lock size={13} /> {t.trackSafeNote}
        </div>
      </div>

      {/* Quick Case ID Selector shortcuts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quick Check Demo Cases:</span>
        {fusedCases.map(c => (
          <button
            key={c.id}
            className={`btn btn-sm ${activeCase?.id === c.id ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              setSearchInput(c.caseNumber);
              setActiveCase(c);
              setHasSearched(true);
            }}
          >
            {c.caseNumber} ({c.missingReport?.fullName || c.title.split(' ')[0]})
          </button>
        ))}
      </div>

      {/* Found Case Information Card */}
      {safeView && activeCase ? (
        <div className="glass-panel" style={{ padding: '32px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-500)', letterSpacing: '0.05em' }}>
                OFFICIAL CASE REFERENCE: {safeView.caseNumber}
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px' }}>{safeView.personName}</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Age: {safeView.age || 'Recorded'} • Gender: {safeView.gender}
              </span>
            </div>

            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
              <span className={`badge ${safeView.status === 'REUNITED' ? 'badge-reunited' : safeView.status === 'VERIFIED' ? 'badge-verified' : 'badge-possible'}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                {safeView.safeStatusBadge}
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {t.lastUpdatedLabel}: {new Date(safeView.lastUpdated).toLocaleTimeString()}
              </div>
              {onSelectCase && (
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => onSelectCase(activeCase)}
                  style={{ fontSize: '0.75rem', marginTop: '4px' }}
                >
                  View Full File
                </button>
              )}
            </div>
          </div>

          {/* Key Safe Family Metrics */}
          <div className="grid-cols-2" style={{ marginBottom: '28px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="#60a5fa" /> {t.lastKnownLocLabel}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px', color: '#f8fafc' }}>
                {safeView.safeLocation}
              </div>
              {safeView.showFoundDetails && safeView.facilityPhone && (
                <div style={{ fontSize: '0.8rem', color: '#93c5fd', marginTop: '4px' }}>
                  📞 Facility Reception: {safeView.facilityPhone}
                </div>
              )}
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Compass size={15} color="#fbbf24" /> {t.nextStepLabel}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px', color: '#f8fafc' }}>
                {safeView.safeNextStep}
              </div>
            </div>
          </div>

          {/* Verified Timeline Updates for Family */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} /> Verified Activity Log
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {safeView.timeline.map((evt) => (
                <div
                  key={evt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(30, 41, 59, 0.4)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', marginTop: '6px' }} />
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{evt.title}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(evt.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {evt.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 24/7 Family Hotline Banner */}
          <div
            style={{
              marginTop: '28px',
              padding: '16px 20px',
              background: 'linear-gradient(90deg, rgba(30, 58, 138, 0.3), rgba(15, 23, 42, 0.8))',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Need Immediate Counselor Assistance?</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Dedicated Family Support Desk is available 24/7.
              </div>
            </div>
            <a href="tel:1070" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
              <PhoneCall size={14} /> Call Helpline: 1070
            </a>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="glass-panel" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <AlertCircle size={40} color="var(--accent-amber)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{t.caseNotFound}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '8px auto 20px' }}>
            Please check the spelling of your Case ID (e.g. #R124) or call our 24/7 toll-free helpline at 1070 for assistance.
          </p>
        </div>
      ) : null}
    </div>
  );
};
