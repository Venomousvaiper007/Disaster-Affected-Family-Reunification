import React, { useEffect, useState } from 'react';
import { 
  Radio, ShieldAlert, Users, CheckCircle2, XCircle, AlertTriangle, 
  MapPin, Filter, Layers, ArrowRight, Eye, RefreshCw, UserCheck
} from 'lucide-react';
import IncidentMap from '../components/IncidentMap';
import { 
  fetchStats, fetchCases, fetchMatches, fetchRescueTeams, 
  fetchDuplicates, fetchConflicts, verifyMatch, assignRescueTeam, resolveDuplicate, resolveConflict 
} from '../api';

export default function CommandCenter({ onSelectCase, t }) {
  const [stats, setStats] = useState(null);
  const [cases, setCases] = useState([]);
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  
  const [activeTab, setActiveTab] = useState('priority-queue'); // priority-queue, matches, rescue-ops, duplicates, conflicts
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedEmergency, setSelectedEmergency] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [sData, cData, mData, tData, dData, confData] = await Promise.all([
        fetchStats(),
        fetchCases(),
        fetchMatches(),
        fetchRescueTeams(),
        fetchDuplicates(),
        fetchConflicts()
      ]);
      setStats(sData);
      setCases(cData);
      setMatches(mData);
      setTeams(tData);
      setDuplicates(dData);
      setConflicts(confData);
    } catch (e) {
      console.error("Error loading command center data", e);
    }
  };

  const handleVerifyMatchAction = async (matchId, action) => {
    try {
      await verifyMatch(matchId, action, "Commander Rajesh (Command Admin)");
      alert(`Match ${action === 'CONFIRM' ? 'VERIFIED' : 'REJECTED'} successfully!`);
      setSelectedMatch(null);
      loadAllData();
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const handleAssignTeam = async (caseId, teamId) => {
    try {
      await assignRescueTeam(caseId, teamId, "DISPATCHED");
      alert(`Rescue team assigned successfully!`);
      setSelectedEmergency(null);
      loadAllData();
    } catch (e) {
      alert("Error assigning team: " + e.message);
    }
  };

  const handleMergeDuplicate = async (groupId) => {
    try {
      await resolveDuplicate(groupId, "MERGE");
      alert("Duplicate group merged successfully!");
      loadAllData();
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const handleFixConflict = async (conflictId) => {
    try {
      await resolveConflict(conflictId);
      alert("Conflict marked as RESOLVED!");
      loadAllData();
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const filteredCases = cases.filter(c => {
    if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;
    if (searchQuery) {
      const s = searchQuery.lower();
      return str(c).lower().includes(s);
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Overview KPIs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
            <span>RESCUE COMMAND CENTER</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Multi-agency coordination hub for emergency dispatch, priority management, and match verification.</p>
        </div>

        <button 
          onClick={loadAllData}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1 border border-slate-800 self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Live Radar</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Active Missing</p>
          <p className="text-2xl font-black text-amber-400 mt-1">{stats?.active_missing_cases || 0}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Found Persons</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{stats?.found_persons || 0}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Active Emergencies</p>
          <p className="text-2xl font-black text-red-500 mt-1">{stats?.active_emergencies || 0}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Potential Matches</p>
          <p className="text-2xl font-black text-sky-400 mt-1">{matches.filter(m => m.status === 'POTENTIAL').length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl col-span-2 md:col-span-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Conflicts & Duplicates</p>
          <p className="text-2xl font-black text-purple-400 mt-1">{(conflicts.filter(c => c.status === 'UNRESOLVED').length) + (duplicates.filter(d => d.status === 'PENDING').length)}</p>
        </div>
      </div>

      {/* Incident Map Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-red-400" />
            <span>Geographic Incident & Rescue Radar</span>
          </h2>
          <span className="text-xs text-slate-400">{cases.length} active pins tracked</span>
        </div>
        <IncidentMap cases={cases} rescueTeams={teams} onSelectCase={onSelectCase} />
      </div>

      {/* Tabs Navigation for Operations */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('priority-queue')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${activeTab === 'priority-queue' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Priority Queue ({filteredCases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${activeTab === 'matches' ? 'bg-sky-500 text-slate-950 shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Potential Matches ({matches.filter(m => m.status === 'POTENTIAL').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rescue-ops')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${activeTab === 'rescue-ops' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            <Radio className="w-4 h-4" />
            <span>Rescue Ops & Dispatch ({teams.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('duplicates')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${activeTab === 'duplicates' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            <Layers className="w-4 h-4" />
            <span>Duplicates ({duplicates.filter(d => d.status === 'PENDING').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('conflicts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${activeTab === 'conflicts' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Conflicts ({conflicts.filter(c => c.status === 'UNRESOLVED').length})</span>
          </button>
        </div>

        {/* TAB 1: PRIORITY QUEUE */}
        {activeTab === 'priority-queue' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-300">Filter Priority:</span>
                {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
                  <button
                    key={p} onClick={() => setPriorityFilter(p)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${priorityFilter === p ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <input 
                type="text"
                placeholder={t.actions.searchPlaceholder}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none w-64"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCases.map(c => {
                const name = c.person?.name || c.person?.name_if_known || c.emergency?.location || c.id;
                const isEmergency = c.case_type === 'EMERGENCY';

                return (
                  <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition space-y-3 shadow-lg relative overflow-hidden flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-extrabold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{c.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${c.priority === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' : c.priority === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-slate-800 text-slate-300'}`}>
                          {c.priority} ({c.priority_score})
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white">{name}</h3>
                      <p className="text-xs text-slate-400">Type: <span className="font-semibold text-slate-200">{c.case_type}</span> | Status: <span className="font-semibold text-sky-400">{c.status}</span></p>

                      {isEmergency && (
                        <div className="bg-red-950/40 border border-red-900/60 p-2 rounded text-[11px] text-red-300">
                          Emergency SOS: {c.emergency?.description}
                        </div>
                      )}

                      {c.conflict_flag && (
                        <div className="bg-amber-950/40 border border-amber-900/60 p-2 rounded text-[11px] text-amber-300 flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span>Information Conflict Detected</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">{c.created_at}</span>
                      <button
                        onClick={() => onSelectCase(c.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: POTENTIAL MATCHES & VERIFICATION */}
        {activeTab === 'matches' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-300">
              💡 <strong>AI-Assisted Verification Workflow</strong>: Smart multi-factor scores are decision-support labels. Identity matches require human verification before family updates are generated.
            </div>

            <div className="space-y-3">
              {matches.map(m => (
                <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-sky-500/40 transition space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-black text-sky-400 font-mono">{m.confidence_score}%</span>
                      <div>
                        <span className="text-xs font-bold text-white uppercase tracking-wider bg-sky-950 text-sky-400 px-2 py-0.5 rounded border border-sky-800">{m.match_category}</span>
                        <p className="text-xs text-slate-400 mt-1">Missing Report: <strong className="text-amber-400">{m.missing_case_id}</strong> ↔ Found Record: <strong className="text-emerald-400">{m.found_case_id}</strong></p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {m.status === 'VERIFIED' ? (
                        <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-xs rounded-lg flex items-center space-x-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>VERIFIED BY RESPONDER</span>
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleVerifyMatchAction(m.id, 'CONFIRM')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow"
                          >
                            ✓ Confirm & Verify
                          </button>
                          <button
                            onClick={() => handleVerifyMatchAction(m.id, 'REJECT')}
                            className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 font-bold text-xs rounded-lg"
                          >
                            ✗ Reject Match
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic">{m.rationale}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                      <span className="font-bold text-emerald-400">Supporting Matched Features:</span>
                      {m.supporting_evidence?.map((item, idx) => (
                        <p key={idx} className="text-slate-300 text-[11px]">{item}</p>
                      ))}
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                      <span className="font-bold text-amber-400">Missing Evidence Checklist:</span>
                      {m.missing_evidence?.map((item, idx) => (
                        <p key={idx} className="text-slate-400 text-[11px]">{item}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RESCUE OPS & DISPATCH */}
        {activeTab === 'rescue-ops' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Rescue Team Deployment & Status</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {teams.map(team => (
                <div key={team.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-400">{team.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${team.status === 'AVAILABLE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'}`}>
                      {team.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{team.name}</h3>
                  <p className="text-xs text-slate-400">Leader: <strong className="text-slate-200">{team.leader}</strong></p>
                  <p className="text-xs text-slate-400">Contact: <strong className="text-slate-200">{team.contact}</strong></p>
                  {team.assigned_case_id && (
                    <p className="text-xs text-red-400 font-bold bg-red-950/60 p-2 rounded border border-red-900">
                      Assigned to SOS: {team.assigned_case_id}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DUPLICATES */}
        {activeTab === 'duplicates' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Duplicate Record Groups Detected</h2>

            {duplicates.map(d => (
              <div key={d.id} className="bg-slate-900 border border-purple-500/30 rounded-xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 bg-purple-950 px-2.5 py-1 rounded border border-purple-800">
                    ⚠ Similarity: {d.similarity_score}%
                  </span>
                  <span className="text-xs text-slate-400">Status: <strong className="text-amber-400">{d.status}</strong></span>
                </div>

                <h3 className="text-base font-bold text-white">{d.title}</h3>
                <p className="text-xs text-slate-300">Contains records: {d.case_ids?.join(', ')}</p>

                {d.status === 'PENDING' && (
                  <div className="pt-2 flex space-x-2">
                    <button 
                      onClick={() => handleMergeDuplicate(d.id)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg shadow"
                    >
                      Merge Duplicate Records
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: CONFLICTS */}
        {activeTab === 'conflicts' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Information Conflict Resolution</h2>

            {conflicts.map(conf => (
              <div key={conf.id} className="bg-slate-900 border border-amber-500/30 rounded-xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                    Case: {conf.case_id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${conf.status === 'UNRESOLVED' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400'}`}>
                    {conf.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{conf.conflict_type.replace(/_/g, ' ')}</h3>
                <p className="text-xs text-slate-300">{conf.description}</p>
                <p className="text-xs text-slate-400">Source A: <strong>{conf.source_a}</strong> ↔ Source B: <strong>{conf.source_b}</strong></p>

                {conf.status === 'UNRESOLVED' && (
                  <button 
                    onClick={() => handleFixConflict(conf.id)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg shadow"
                  >
                    Mark Conflict as RESOLVED
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
