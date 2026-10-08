import React from 'react';
import { useCases } from '../context/CaseContext';
import type { FusedCase } from '../types';
import {
  Radio,
  HeartHandshake,
  ArrowRight,
  Fingerprint,
} from 'lucide-react';

interface FieldRescueViewProps {
  onOpenReportFound: () => void;
  onOpenBiometricIntake?: () => void;
  onSelectCase: (caseItem: FusedCase) => void;
}

export const FieldRescueView: React.FC<FieldRescueViewProps> = ({
  onOpenReportFound,
  onOpenBiometricIntake,
  onSelectCase,
}) => {
  const { fusedCases, rescueTeams, facilities } = useCases();
  const activeUnit = rescueTeams[0] || {
    status: 'ACTIVE_MISSION',
    teamCode: 'RESCUE-ALPHA-01',
    leadCommander: 'Inspector R. Rajesh',
    specialization: 'WATER_RESCUE',
  };

  const assignedCases = fusedCases.filter(c => c.status === 'UNDER_VERIFICATION' || c.status === 'POSSIBLE_MATCH');

  return (
    <div className="app-container" style={{ padding: '24px 0 60px' }}>
      {/* Unit Status Header */}
      <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #059669, #047857)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Radio size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Field Rescue Operations Console</h2>
              <span className="badge badge-verified">{activeUnit.status}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Unit: <strong>{activeUnit.teamCode}</strong> • Commander: <strong>{activeUnit.leadCommander}</strong> • Specialization: <strong>{activeUnit.specialization.replace('_', ' ')}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {onOpenBiometricIntake && (
            <button className="btn btn-outline" onClick={onOpenBiometricIntake} style={{ borderColor: '#38bdf8', color: '#38bdf8' }}>
              <Fingerprint size={16} /> Scan Biometrics
            </button>
          )}
          <button className="btn btn-success btn-lg" onClick={onOpenReportFound}>
            <HeartHandshake size={18} /> Quick Log Rescued Person
          </button>
        </div>
      </div>

      {/* Grid: Assigned Field Missions + Nearby Facilities */}
      <div className="grid-cols-2" style={{ marginBottom: '24px' }}>
        {/* Left: Assigned Priority Search Tasks */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Assigned Case Verification Missions</h3>
            <span className="badge badge-verification">{assignedCases.length} MISSIONS</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {assignedCases.map(c => (
              <div
                key={c.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 800, color: '#60a5fa' }}>{c.caseNumber} • {c.missingReport?.fullName || c.title}</span>
                  <span className="badge badge-possible">{c.status.replace('_', ' ')}</span>
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  📍 Last Seen / Task Area: {c.missingReport?.lastSeenLocation.address || 'Sector Delta'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#fbbf24', marginTop: '4px' }}>
                  Action: {c.nextBestActions[0]?.title || 'Verify physical identification'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => onSelectCase(c)}>
                    Open Task Checklist <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Real-Time Evacuation Shelter & Hospital Routes */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Closest Relief Evacuation Points</h3>
            <span className="badge badge-verification">BED TRACKER</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {facilities.map(fac => (
              <div
                key={fac.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{fac.name}</span>
                  <span className="badge badge-verified">{fac.availableBeds} BEDS OPEN</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  📍 {fac.location.address}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#93c5fd', marginTop: '4px' }}>
                  📞 Hotline: {fac.phone} • Emergency Desk: {fac.emergencyContact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
