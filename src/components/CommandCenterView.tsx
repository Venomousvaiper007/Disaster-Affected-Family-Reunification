import React, { useState } from 'react';
import { useCases } from '../context/CaseContext';
import { CommandMap } from './CommandMap';
import type { FusedCase } from '../types';
import {
  AlertTriangle,
  CheckCircle2,
  Users,
  Building2,
  FileText,
  Radio,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface CommandCenterViewProps {
  onSelectCase: (caseItem: FusedCase) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({ onSelectCase }) => {
  const { fusedCases, metrics, facilities, rescueTeams, auditLogs } = useCases();

  const [activeTab, setActiveTab] = useState<'MAP_CASES' | 'NBA_QUEUE' | 'ANALYTICS' | 'AUDIT_LOGS'>('MAP_CASES');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredCases = fusedCases.filter(c => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      return (
        c.caseNumber.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.missingReport?.fullName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="app-container" style={{ padding: '24px 0 60px' }}>
      {/* 5 Top KPI Metric Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Active Fusion Cases</span>
            <Users size={16} color="var(--primary-500)" />
          </div>
          <div className="kpi-number" style={{ color: '#ffffff' }}>
            {metrics.totalActiveCases}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Live disaster cases</div>
        </div>

        <div className="kpi-card" style={{ borderColor: 'rgba(244, 63, 94, 0.4)' }}>
          <div className="kpi-header">
            <span className="kpi-label">High / Critical Urgency</span>
            <AlertTriangle size={16} color="var(--accent-rose)" />
          </div>
          <div className="kpi-number" style={{ color: '#fb7185' }}>
            {metrics.highPriorityCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Vulnerable / Children / ICU</div>
        </div>

        <div className="kpi-card" style={{ borderColor: 'rgba(245, 158, 11, 0.4)' }}>
          <div className="kpi-header">
            <span className="kpi-label">Candidate Matches</span>
            <Sparkles size={16} color="var(--accent-amber)" />
          </div>
          <div className="kpi-number" style={{ color: '#fbbf24' }}>
            {metrics.possibleMatchesCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Live Case Fusion correlated</div>
        </div>

        <div className="kpi-card" style={{ borderColor: 'rgba(59, 130, 246, 0.4)' }}>
          <div className="kpi-header">
            <span className="kpi-label">Awaiting Verification</span>
            <ShieldCheck size={16} color="var(--primary-500)" />
          </div>
          <div className="kpi-number" style={{ color: '#60a5fa' }}>
            {metrics.underVerificationCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Field verifier assigned</div>
        </div>

        <div className="kpi-card" style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}>
          <div className="kpi-header">
            <span className="kpi-label">Reunited Today</span>
            <CheckCircle2 size={16} color="var(--accent-emerald)" />
          </div>
          <div className="kpi-number" style={{ color: '#34d399' }}>
            {metrics.reunitedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Avg Handover: 2.4 hrs</div>
        </div>
      </div>

      {/* Main Command Navigation Bar */}
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
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${activeTab === 'MAP_CASES' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('MAP_CASES')}
          >
            Live Map & Case Queue
          </button>
          <button
            className={`btn ${activeTab === 'NBA_QUEUE' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('NBA_QUEUE')}
          >
            Next-Best-Actions ({fusedCases.length})
          </button>
          <button
            className={`btn ${activeTab === 'ANALYTICS' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('ANALYTICS')}
          >
            Analytics & Shelter Flow
          </button>
          <button
            className={`btn ${activeTab === 'AUDIT_LOGS' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('AUDIT_LOGS')}
          >
            Regulatory Audit Trail ({auditLogs.length})
          </button>
        </div>

        {activeTab === 'MAP_CASES' && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Filter by name, case #..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                style={{ padding: '8px 12px', fontSize: '0.85rem', width: '220px' }}
              />
            </div>
            <select
              className="form-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '0.85rem', width: 'auto' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="UNVERIFIED">Unverified</option>
              <option value="POSSIBLE_MATCH">Possible Match</option>
              <option value="UNDER_VERIFICATION">Under Verification</option>
              <option value="VERIFIED">Verified</option>
              <option value="REUNITED">Reunited</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: LIVE MAP & CASE QUEUE */}
      {activeTab === 'MAP_CASES' && (
        <div>
          {/* Tactical Map */}
          <CommandMap onSelectCase={onSelectCase} />

          {/* Priority Case Queue */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Prioritized Disaster Case Queue</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Evaluated with Live Case Fusion Engine and Next-Best-Action prioritization.
                </span>
              </div>
              <span className="badge badge-verification">{filteredCases.length} ACTIVE CASES DISPLAYED</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredCases.map(c => {
                const match = c.candidateMatch;
                const nba = c.nextBestActions[0];

                return (
                  <div
                    key={c.id}
                    onClick={() => onSelectCase(c)}
                    style={{
                      background: 'rgba(15, 23, 42, 0.85)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '18px 20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59, 130, 246, 0.5)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      {/* Left Block */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: 'var(--radius-md)',
                            background: match
                              ? match.overallScore >= 85
                                ? 'rgba(16, 185, 129, 0.2)'
                                : 'rgba(245, 158, 11, 0.2)'
                              : 'rgba(59, 130, 246, 0.2)',
                            color: match
                              ? match.overallScore >= 85
                                ? '#34d399'
                                : '#fbbf24'
                              : '#60a5fa',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 800,
                            fontSize: '0.95rem',
                          }}
                        >
                          {match ? `${match.overallScore}%` : '#'}
                          {match && <span style={{ fontSize: '0.55rem' }}>MATCH</span>}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>{c.title}</span>
                            <span
                              className={`badge ${
                                c.status === 'REUNITED'
                                  ? 'badge-reunited'
                                  : c.status === 'VERIFIED'
                                  ? 'badge-verified'
                                  : 'badge-possible'
                              }`}
                            >
                              {c.status.replace('_', ' ')}
                            </span>
                            {c.priority === 'CRITICAL' && (
                              <span className="badge badge-critical">CRITICAL</span>
                            )}
                          </div>

                          <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            📍 Last Seen: {c.missingReport?.lastSeenLocation.address || 'Disaster Zone'} | 🏥 Facility:{' '}
                            {c.foundRecord?.currentFacilityName || 'Unassigned / Searching'}
                          </div>
                        </div>
                      </div>

                      {/* Right Block: NBA Summary & Action CTA */}
                      <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {nba && (
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd' }}>
                              NEXT ACTION:
                            </div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '280px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                              {nba.title}
                            </div>
                          </div>
                        )}

                        <button className="btn btn-primary btn-sm">
                          Inspect <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Conflict Notice if present */}
                    {match && match.conflictingEvidence.length > 0 && (
                      <div
                        style={{
                          marginTop: '12px',
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(245, 158, 11, 0.1)',
                          border: '1px solid rgba(245, 158, 11, 0.25)',
                          fontSize: '0.775rem',
                          color: '#fde68a',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <AlertTriangle size={13} />
                        <span>
                          <strong>Conflict Detected:</strong> {match.conflictingEvidence[0].explanation} (Investigation Required)
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NEXT-BEST-ACTION DISPATCH QUEUE */}
      {activeTab === 'NBA_QUEUE' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Next-Best-Action (NBA) Dispatch Engine</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Prioritized emergency response tasks automatically computed across vulnerability, medical triage, and match evidence.
              </p>
            </div>
            <span className="badge badge-verification">AUTONOMOUS NBA ENGINE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {fusedCases.map(c => {
              const nba = c.nextBestActions[0];
              if (!nba) return null;

              return (
                <div
                  key={nba.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-verification">
                          PRIORITY: {nba.priorityScore}/100 • {nba.urgencyLevel}
                        </span>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{nba.title}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Case: <strong>{c.caseNumber}</strong> ({c.title}) • Target:{' '}
                        <strong>{nba.targetFacilityOrTeam}</strong> (📞 {nba.contactPhone})
                      </div>
                    </div>

                    <button className="btn btn-primary btn-sm" onClick={() => onSelectCase(c)}>
                      Execute Steps & Verify <ArrowRight size={14} />
                    </button>
                  </div>

                  <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: '14px', fontSize: '0.825rem' }}>
                    <strong>Why this action is prescribed:</strong> {nba.rationale}
                  </div>

                  {/* Steps Checklist */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
                    {nba.steps.map(step => (
                      <div
                        key={step.stepNumber}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(30, 41, 59, 0.4)',
                          fontSize: '0.8rem',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <div className="step-badge-num" style={{ width: '20px', height: '20px', fontSize: '0.7rem' }}>
                          {step.stepNumber}
                        </div>
                        <span style={{ flexGrow: 1 }}>{step.instruction}</span>
                        {step.completed && <CheckCircle2 size={15} color="#34d399" />}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS & SHELTER CAPACITY */}
      {activeTab === 'ANALYTICS' && (
        <div>
          <div className="grid-cols-2" style={{ marginBottom: '24px' }}>
            {/* Facility Capacities */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} color="var(--primary-500)" /> Hospital & Relief Camp Capacities
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {facilities.map(fac => {
                  const pct = Math.round((fac.currentOccupancy / fac.totalCapacity) * 100);
                  return (
                    <div key={fac.id}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{fac.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {fac.currentOccupancy} / {fac.totalCapacity} ({pct}%)
                        </span>
                      </div>
                      <div style={{ height: '8px', borderRadius: '4px', background: '#1e293b', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${pct}%`,
                            background: pct > 85 ? '#f43f5e' : pct > 70 ? '#f59e0b' : '#10b981',
                          }}
                        />
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        🛏️ Available Beds: <strong>{fac.availableBeds}</strong> | Medical Staff: {fac.medicalStaffOnDuty} | 📞 {fac.phone}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Field Rescue Units */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={18} color="var(--accent-emerald)" /> Active Field Rescue Units
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rescueTeams.map(team => (
                  <div
                    key={team.id}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{team.teamCode}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Lead: {team.leadCommander} • Specialization: {team.specialization.replace('_', ' ')}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        📍 Sector: {team.currentLocation.address}
                      </div>
                    </div>
                    <span className="badge badge-verified">{team.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'AUDIT_LOGS' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Official Regulatory & Verification Audit Trail</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Immutable event stream for legal compliance, identity verification, and privacy assurance.
              </p>
            </div>
            <span className="badge badge-verification">AUDIT TRAIL SECURED</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {auditLogs.map(log => (
              <div
                key={log.id}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                }}
              >
                <FileText size={18} color="var(--primary-500)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#93c5fd' }}>
                      {log.action} • {log.actorName} ({log.actorRole})
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {log.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
