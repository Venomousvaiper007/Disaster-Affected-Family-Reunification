import React, { useState } from 'react';
import { useCases } from '../context/CaseContext';
import type { FusedCase } from '../types';
import {
  MapPin,
  Building2,
  Radio,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface CommandMapProps {
  onSelectCase?: (caseItem: FusedCase) => void;
  highlightCaseId?: string;
}

export const CommandMap: React.FC<CommandMapProps> = ({ onSelectCase, highlightCaseId }) => {
  const { fusedCases, facilities, rescueTeams } = useCases();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'MISSING' | 'FOUND' | 'FACILITY' | 'RESCUE'>('ALL');
  const [selectedPin, setSelectedPin] = useState<{
    type: 'CASE' | 'FACILITY' | 'RESCUE';
    data: any;
  } | null>(null);

  // Filtered lists
  const filteredCases = fusedCases.filter(c => {
    if (activeFilter === 'MISSING') return c.missingReport !== undefined;
    if (activeFilter === 'FOUND') return c.foundRecord !== undefined;
    return true;
  });

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      {/* Map Control Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="var(--primary-500)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Tactical Geospatial Operations Map</h3>
          <span className="badge badge-verification">LIVE TELEMETRY</span>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeFilter === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveFilter('ALL')}
          >
            All Overlays
          </button>
          <button
            className={`btn btn-sm ${activeFilter === 'MISSING' ? 'btn-emergency' : 'btn-outline'}`}
            onClick={() => setActiveFilter('MISSING')}
          >
            Missing Reports ({fusedCases.filter(c => c.missingReport).length})
          </button>
          <button
            className={`btn btn-sm ${activeFilter === 'FOUND' ? 'btn-success' : 'btn-outline'}`}
            onClick={() => setActiveFilter('FOUND')}
          >
            Found / Rescued ({fusedCases.filter(c => c.foundRecord).length})
          </button>
          <button
            className={`btn btn-sm ${activeFilter === 'FACILITY' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveFilter('FACILITY')}
          >
            Hospitals & Camps ({facilities.length})
          </button>
          <button
            className={`btn btn-sm ${activeFilter === 'RESCUE' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveFilter('RESCUE')}
          >
            Rescue Units ({rescueTeams.length})
          </button>
        </div>
      </div>

      {/* Map Graphic Canvas / Interactive Tactical Grid */}
      <div
        style={{
          height: '420px',
          width: '100%',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at center, #111e38 0%, #080d1a 100%)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Tactical Radar Grid Lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(59, 130, 246, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.07) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        {/* Disaster Impact Perimeter Ring */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            border: '2px dashed rgba(244, 63, 94, 0.4)',
            background: 'radial-gradient(circle, rgba(244, 63, 94, 0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.65rem',
              fontWeight: 800,
              color: '#fb7185',
              letterSpacing: '0.05em',
            }}
          >
            CYCLONE VARDAH FLOOD SECTOR DELTA (30 KM RADIUS)
          </span>
        </div>

        {/* Render Map Markers */}
        {/* 1. Facilities */}
        {(activeFilter === 'ALL' || activeFilter === 'FACILITY') &&
          facilities.map((fac, idx) => {
            const topPercent = 25 + idx * 18;
            const leftPercent = 20 + idx * 22;
            const isHospital = fac.type === 'HOSPITAL';
            return (
              <div
                key={fac.id}
                onClick={() => setSelectedPin({ type: 'FACILITY', data: fac })}
                style={{
                  position: 'absolute',
                  top: `${topPercent}%`,
                  left: `${leftPercent}%`,
                  cursor: 'pointer',
                  zIndex: 20,
                  transform: 'translate(-50%, -50%)',
                  transition: 'transform 0.2s ease',
                }}
                title={fac.name}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: isHospital ? '#1e40af' : '#b45309',
                    border: '2px solid white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  <Building2 size={20} />
                </div>
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: '#e2e8f0',
                    marginTop: '4px',
                    whiteSpace: 'nowrap',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {fac.name.split(' ')[0]} ({fac.availableBeds} beds)
                </div>
              </div>
            );
          })}

        {/* 2. Rescue Teams */}
        {(activeFilter === 'ALL' || activeFilter === 'RESCUE') &&
          rescueTeams.map((team, idx) => {
            const topPercent = 40 + idx * 20;
            const leftPercent = 65 - idx * 18;
            return (
              <div
                key={team.id}
                onClick={() => setSelectedPin({ type: 'RESCUE', data: team })}
                style={{
                  position: 'absolute',
                  top: `${topPercent}%`,
                  left: `${leftPercent}%`,
                  cursor: 'pointer',
                  zIndex: 25,
                  transform: 'translate(-50%, -50%)',
                }}
                title={team.teamCode}
              >
                <div
                  className="pulse-green"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#047857',
                    border: '2px solid #34d399',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <Radio size={18} />
                </div>
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: '#6ee7b7',
                    marginTop: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {team.teamCode.split('-')[1]}
                </div>
              </div>
            );
          })}

        {/* 3. Fused Cases */}
        {(activeFilter === 'ALL' || activeFilter === 'MISSING' || activeFilter === 'FOUND') &&
          filteredCases.map((caseItem, idx) => {
            const isMatch = caseItem.status === 'POSSIBLE_MATCH' || caseItem.status === 'UNDER_VERIFICATION' || caseItem.status === 'VERIFIED';
            const isReunited = caseItem.status === 'REUNITED';
            const topPercent = 30 + (idx * 23) % 55;
            const leftPercent = 35 + (idx * 28) % 55;
            const isHighlighted = highlightCaseId === caseItem.id || highlightCaseId === caseItem.caseNumber;

            return (
              <div
                key={caseItem.id}
                onClick={() => {
                  setSelectedPin({ type: 'CASE', data: caseItem });
                  if (onSelectCase) onSelectCase(caseItem);
                }}
                style={{
                  position: 'absolute',
                  top: `${topPercent}%`,
                  left: `${leftPercent}%`,
                  cursor: 'pointer',
                  zIndex: isHighlighted ? 40 : 30,
                  transform: isHighlighted ? 'translate(-50%, -50%) scale(1.2)' : 'translate(-50%, -50%)',
                  transition: 'all 0.25s ease',
                }}
              >
                <div
                  className={isMatch ? 'pulse-amber' : isReunited ? 'pulse-green' : 'pulse-red'}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: isReunited
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : isMatch
                      ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                      : 'linear-gradient(135deg, #f43f5e, #e11d48)',
                    border: isHighlighted ? '3px solid #ffffff' : '2px solid rgba(255, 255, 255, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  {caseItem.candidateMatch ? `${caseItem.candidateMatch.overallScore}%` : <MapPin size={20} />}
                </div>
                <div
                  style={{
                    background: 'rgba(9, 13, 22, 0.9)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginTop: '4px',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {caseItem.caseNumber} • {caseItem.missingReport?.fullName.split(' ')[0] || 'Unidentified'}
                </div>
              </div>
            );
          })}

        {/* Selected Pin Quick Summary Drawer */}
        {selectedPin && (
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              zIndex: 50,
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
            }}
          >
            {selectedPin.type === 'CASE' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(59, 130, 246, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#60a5fa',
                      fontWeight: 800,
                    }}
                  >
                    {selectedPin.data.candidateMatch ? `${selectedPin.data.candidateMatch.overallScore}%` : '#'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>{selectedPin.data.title}</span>
                      <span className="badge badge-verification">{selectedPin.data.status}</span>
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      📍 Last Seen: {selectedPin.data.missingReport?.lastSeenLocation.address || 'Disaster Zone'} | 🏥 Intake:{' '}
                      {selectedPin.data.foundRecord?.currentFacilityName || 'Searching'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => setSelectedPin(null)}>
                    Dismiss
                  </button>
                  {onSelectCase && (
                    <button className="btn btn-primary btn-sm" onClick={() => onSelectCase(selectedPin.data)}>
                      Open Full Case Analysis <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </>
            )}

            {selectedPin.type === 'FACILITY' && (
              <>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#60a5fa' }}>
                    {selectedPin.data.name} ({selectedPin.data.type})
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                    📍 {selectedPin.data.location.address} | 🛏️ Available Beds: <strong>{selectedPin.data.availableBeds}</strong> /{' '}
                    {selectedPin.data.totalCapacity} | 📞 {selectedPin.data.phone}
                  </div>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => setSelectedPin(null)}>
                  Close
                </button>
              </>
            )}

            {selectedPin.type === 'RESCUE' && (
              <>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#34d399' }}>
                    {selectedPin.data.teamCode} — {selectedPin.data.specialization}
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                    Lead: {selectedPin.data.leadCommander} | Members: {selectedPin.data.membersCount} | Sector:{' '}
                    {selectedPin.data.currentLocation.address} | 📞 {selectedPin.data.phone}
                  </div>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => setSelectedPin(null)}>
                  Close
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
