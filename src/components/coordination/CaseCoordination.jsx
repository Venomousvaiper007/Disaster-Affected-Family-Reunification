import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  Users2,
  AlertTriangle,
  Clock,
  ArrowRight,
  UserPlus,
  ArrowUpRight,
  Shield,
  PlusCircle,
  Eye,
  Filter,
  Layers,
  ChevronDown,
  Radio
} from 'lucide-react';

export const CaseCoordination = () => {
  const {
    cases,
    responders,
    rescueTeams,
    dispatchRescueTeam,
    updateCaseStatus,
    assignResponderToCase,
    updateCasePriority,
    openCaseDetails,
    setIsRegisterOpen,
    t
  } = useCommand();

  const [filterResponder, setFilterResponder] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [dispatchTargetCase, setDispatchTargetCase] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState('TEAM-01');
  const [dispatchNotes, setDispatchNotes] = useState('Immediate field identity verification & relief extraction.');

  // Stages
  const stages = [
    { key: 'REPORTED', title: '1. Reported', border: 'border-slate-300', text: 'text-[#1D3033]' },
    { key: 'UNDER_REVIEW', title: '2. Under Review', border: 'border-purple-300', text: 'text-purple-800' },
    { key: 'POTENTIAL_MATCH', title: '3. Candidate Match', border: 'border-[#155E63]/40', text: 'text-[#155E63]' },
    { key: 'AWAITING_VERIFICATION', title: '4. Verification Queue', border: 'border-amber-300', text: 'text-[#B7791F]' },
    { key: 'REUNIFICATION_CONFIRMED', title: '5. Reunited / Closed', border: 'border-emerald-300', text: 'text-[#24856A]' },
    { key: 'ESCALATED', title: 'Alert: Escalated / Action', border: 'border-rose-300', text: 'text-[#C83D4D]' }
  ];

  const filteredCases = cases.filter(c => {
    if (filterResponder !== 'ALL' && c.assignedTo !== filterResponder) return false;
    if (filterPriority !== 'ALL' && c.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div className="space-y-5 pb-12">
      {/* Header & Controls */}
      <div className="bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#D8F3EF] border border-[#155E63]/20 text-[#155E63]">
            <Users2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#1D3033] uppercase tracking-wider font-mono">
              {t('coordinationTitle')}
            </h1>
            <p className="text-xs text-[#687A7C] font-sans">
              {t('coordinationSubtitle')}
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-[#F4F7F6] border border-[#E1E9E7] rounded-lg text-xs px-3 py-2 text-[#1D3033] font-medium focus:outline-none focus:border-[#155E63]"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent Priority Only</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
          </select>

          {/* Responder filter */}
          <select
            value={filterResponder}
            onChange={(e) => setFilterResponder(e.target.value)}
            className="bg-[#F4F7F6] border border-[#E1E9E7] rounded-lg text-xs px-3 py-2 text-[#1D3033] font-medium focus:outline-none focus:border-[#155E63]"
          >
            <option value="ALL">All Responders</option>
            {responders.map(r => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>

          <button
            onClick={() => setIsRegisterOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#F47C65] hover:bg-[#e06b54] text-white font-bold text-xs flex items-center gap-1.5 shadow-soft-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Case</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          let stageCases = [];
          if (stage.key === 'ESCALATED') {
            stageCases = filteredCases.filter(c => c.status === 'ESCALATED' || c.status === 'NEEDS_MORE_INFO');
          } else {
            stageCases = filteredCases.filter(c => c.status === stage.key);
          }

          return (
            <div
              key={stage.key}
              className="bg-[#F4F7F6] border border-[#E1E9E7] rounded-xl p-3.5 flex flex-col min-h-[500px]"
            >
              {/* Stage Header */}
              <div className={`flex items-center justify-between pb-2 mb-3 border-b border-[#E1E9E7] ${stage.text}`}>
                <span className="font-mono font-bold text-xs uppercase tracking-wider">{stage.title}</span>
                <span className="px-2 py-0.5 rounded-full bg-white border border-[#E1E9E7] text-[10px] font-mono font-bold text-[#1D3033]">
                  {stageCases.length}
                </span>
              </div>

              {/* Cards Stream */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {stageCases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => openCaseDetails(c)}
                    className="p-3.5 rounded-xl bg-white border border-[#E1E9E7] hover:border-[#155E63]/50 cursor-pointer shadow-soft-xs hover:shadow-soft-sm transition-all space-y-2.5 group"
                  >
                    {/* Top Row */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#155E63]">{c.id}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        c.priority === 'URGENT' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'text-[#687A7C] font-mono'
                      }`}>
                        {c.priority}
                      </span>
                    </div>

                    {/* Person */}
                    <div className="flex items-center gap-2.5">
                      <img
                        src={c.photo}
                        alt={c.fullName}
                        className="w-10 h-10 rounded-lg object-cover border border-[#E1E9E7]"
                      />
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-xs text-[#1D3033] truncate group-hover:text-[#155E63] transition-colors">
                          {c.fullName}
                        </h4>
                        <span className="text-[10px] text-[#687A7C] block">{c.age} yrs • {c.gender}</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="text-[11px] text-[#687A7C] truncate">
                      📍 {c.lastSeenLocation}
                    </div>

                    {/* Priority & Triage Indicator */}
                    {c.vulnerabilityScore && (
                      <div className="flex items-center justify-between text-[10px] bg-[#F4F7F6] px-2 py-1 rounded-md">
                        <span className="text-[#687A7C] font-mono">Triage Score:</span>
                        <span className="font-mono font-bold text-[#155E63]">{c.vulnerabilityScore}/100</span>
                      </div>
                    )}

                    {/* Assigned Responder & Dispatch Action */}
                    <div className="pt-2 border-t border-[#E1E9E7] flex items-center justify-between text-[10px]">
                      <span className="text-[#687A7C] truncate max-w-[110px]">
                        👤 {c.assignedTo || 'Unassigned'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDispatchTargetCase(c);
                        }}
                        className="px-2 py-1 rounded bg-[#D8F3EF] hover:bg-[#B2E4DD] text-[#155E63] font-bold text-[10px] transition-colors flex items-center gap-1"
                        title="Dispatch Rescue Squad"
                      >
                        <Radio className="w-3 h-3" />
                        <span>Dispatch</span>
                      </button>
                    </div>
                  </div>
                ))}

                {stageCases.length === 0 && (
                  <div className="p-6 text-center text-[#687A7C] text-xs font-mono border border-dashed border-[#E1E9E7] rounded-xl bg-white/50">
                    No cases in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rescue Team Dispatch Modal */}
      {dispatchTargetCase && (
        <div className="fixed inset-0 bg-[#123B3A]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E1E9E7] rounded-2xl shadow-dropdown max-w-lg w-full p-5 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#E1E9E7] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#D8F3EF] text-[#155E63]">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1D3033]">Dispatch Field Rescue Squad</h3>
                  <p className="text-xs text-[#687A7C]">Target Case: {dispatchTargetCase.id} ({dispatchTargetCase.fullName})</p>
                </div>
              </div>
              <button
                onClick={() => setDispatchTargetCase(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#1D3033] block mb-1">Select Available Rescue Squad:</label>
                <div className="space-y-2">
                  {rescueTeams.map(team => (
                    <div
                      key={team.id}
                      onClick={() => setSelectedTeamId(team.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedTeamId === team.id
                          ? 'border-[#155E63] bg-[#D8F3EF]/40 ring-1 ring-[#155E63]'
                          : 'border-[#E1E9E7] bg-white hover:border-[#155E63]/40'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-[#1D3033]">{team.name}</div>
                        <div className="text-[11px] text-[#687A7C]">Leader: {team.leader} • {team.members} members</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D8F3EF] text-[#155E63]">
                        {team.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1D3033] block mb-1">Mission Notes / Instructions:</label>
                <textarea
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-[#F4F7F6] border border-[#E1E9E7] rounded-xl p-2.5 text-xs text-[#1D3033] focus:outline-none focus:border-[#155E63]"
                  placeholder="e.g. Conduct rapid boat sweep and biometric verification..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E1E9E7]">
              <button
                onClick={() => setDispatchTargetCase(null)}
                className="px-4 py-2 rounded-xl bg-[#F4F7F6] text-[#1D3033] font-semibold text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dispatchRescueTeam(
                    selectedTeamId,
                    dispatchTargetCase.id,
                    dispatchTargetCase.lastSeenLocation,
                    dispatchNotes
                  );
                  setDispatchTargetCase(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#155E63] hover:bg-[#123B3A] text-white font-bold text-xs shadow-soft-sm flex items-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Confirm Dispatch Order</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
