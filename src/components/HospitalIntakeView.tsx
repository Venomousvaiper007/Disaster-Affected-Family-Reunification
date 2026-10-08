import React, { useState } from 'react';
import { useCases } from '../context/CaseContext';
import type { FusedCase } from '../types';
import {
  Building2,
  Plus,
  ArrowRight,
  Sparkles,
  Fingerprint,
} from 'lucide-react';

interface HospitalIntakeViewProps {
  onOpenReportFound: () => void;
  onOpenBiometricIntake?: () => void;
  onSelectCase: (caseItem: FusedCase) => void;
}

export const HospitalIntakeView: React.FC<HospitalIntakeViewProps> = ({
  onOpenReportFound,
  onOpenBiometricIntake,
  onSelectCase,
}) => {
  const { foundRecords, facilities, fusedCases } = useCases();
  const [selectedFacilityId, setSelectedFacilityId] = useState(facilities[0]?.id || '');

  const activeFacility = facilities.find(f => f.id === selectedFacilityId) || facilities[0];
  const facilityRecords = foundRecords.filter(f => f.currentFacilityId === selectedFacilityId || !f.currentFacilityId);

  return (
    <div className="app-container" style={{ padding: '24px 0 60px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #1d4ed8, #0284c7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Hospital & Shelter Intake Management</h2>
              <span className="badge badge-verification">BEDSIDE FUSION RADAR</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Active Facility: <strong>{activeFacility.name}</strong> • Capacity: <strong>{activeFacility.currentOccupancy}/{activeFacility.totalCapacity}</strong> ({activeFacility.availableBeds} beds free)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            value={selectedFacilityId}
            onChange={e => setSelectedFacilityId(e.target.value)}
            style={{ width: 'auto' }}
          >
            {facilities.map(fac => (
              <option key={fac.id} value={fac.id}>
                {fac.name}
              </option>
            ))}
          </select>
          {onOpenBiometricIntake && (
            <button className="btn btn-outline" onClick={onOpenBiometricIntake} style={{ borderColor: '#38bdf8', color: '#38bdf8' }}>
              <Fingerprint size={16} /> Scan Biometrics
            </button>
          )}
          <button className="btn btn-primary" onClick={onOpenReportFound}>
            <Plus size={16} /> New Patient Intake
          </button>
        </div>
      </div>

      {/* Patient Intake Registry Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Admitted Unidentified / Rescued Individuals</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Live Case Fusion automatically correlates admitted patients against missing reports.
            </p>
          </div>
          <span className="badge badge-verification">{facilityRecords.length} ADMITTED INTAKES</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {facilityRecords.map(rec => {
            const linkedCase = fusedCases.find(c => c.foundRecord?.id === rec.id);

            return (
              <div
                key={rec.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(59, 130, 246, 0.15)',
                      color: '#60a5fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {rec.caseNumber}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem' }}>
                        {rec.isIdentified ? rec.givenName : `Unidentified (${rec.estimatedAgeMin ?? '?'}-${rec.estimatedAgeMax ?? '?'} yrs)`}
                      </span>
                      <span className={`badge ${rec.medicalCondition === 'CRITICAL' || rec.medicalCondition === 'UNCONSCIOUS' ? 'badge-critical' : 'badge-verification'}`}>
                        {rec.medicalCondition}
                      </span>
                      {rec.matchScore && (
                        <span className="badge badge-possible">
                          <Sparkles size={12} /> {rec.matchScore}% FUSION MATCH
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Ward/Bed: <strong>{rec.wardOrBed || 'Triage Reception'}</strong> • Marks: {rec.traits.distinguishingMarks?.join(', ') || 'None noted'} • Clothing: {rec.traits.clothingUpper}
                    </div>
                  </div>
                </div>

                <div>
                  {linkedCase ? (
                    <button className="btn btn-primary btn-sm" onClick={() => onSelectCase(linkedCase)}>
                      Bedside Verification <ArrowRight size={14} />
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Searching Database...
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
