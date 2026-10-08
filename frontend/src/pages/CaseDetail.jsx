import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, AlertTriangle, UserCheck, ShieldAlert, 
  MapPin, Clock, FileText, Layers, Activity, User, ShieldCheck
} from 'lucide-react';
import { fetchCaseDetail, verifyMatch } from '../api';

export default function CaseDetail({ caseId, onBack, t }) {
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (caseId) {
      loadDetail();
    }
  }, [caseId]);

  const loadDetail = async () => {
    setLoading(true);
    try {
      const data = await fetchCaseDetail(caseId);
      setCaseData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (matchId, action) => {
    try {
      await verifyMatch(matchId, action, "Officer Rajesh (Command Center)");
      alert(`Match ${action === 'CONFIRM' ? 'VERIFIED' : 'REJECTED'} successfully!`);
      loadDetail();
    } catch (e) {
      alert("Error verifying match: " + e.message);
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400 text-sm animate-pulse">Loading comprehensive case record #{caseId}...</div>;
  if (error || !caseData) return <div className="py-20 text-center text-red-400 text-sm">Case not found or error loading data.</div>;

  const person = caseData.person || {};
  const emergency = caseData.emergency || {};
  const matches = caseData.matches || [];
  const timeline = caseData.timeline || [];
  const evidences = caseData.evidences || [];
  const conflicts = caseData.conflicts || [];
  const audits = caseData.audits || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <button 
              onClick={onBack}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1 mr-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span className="text-xl font-mono font-black text-amber-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">{caseData.id}</span>
            <span className="px-2.5 py-1 rounded text-xs font-extrabold bg-slate-800 text-white uppercase">{caseData.case_type}</span>
            <span className={`px-2.5 py-1 rounded text-xs font-extrabold ${caseData.status === 'VERIFIED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-sky-950 text-sky-400 border border-sky-800'}`}>
              {caseData.status}
            </span>
          </div>

          <h1 className="text-2xl font-black text-white pt-2">
            {person.name || person.name_if_known || emergency.location || caseData.id}
          </h1>
          <p className="text-xs text-slate-400">Reporter: <strong className="text-slate-200">{caseData.reporter_name}</strong> ({caseData.reporter_relationship}) | Contact: <strong className="text-slate-200">{caseData.reporter_contact}</strong></p>
        </div>

        {/* Priority Score Card */}
        <div className="bg-slate-900 border border-amber-500/30 p-4 rounded-xl text-right self-start sm:self-auto space-y-1 shadow-lg">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Calculated Priority Score</p>
          <p className="text-3xl font-black text-amber-400 font-mono">{caseData.calculated_priority || caseData.priority_score}</p>
          <span className="text-[11px] text-amber-300 font-semibold">{caseData.priority} PRIORITY</span>
        </div>
      </div>

      {/* Case Details Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">Person & Disaster Details</h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div><span className="text-slate-400">Age:</span> <strong className="text-white">{person.age || person.age_approx || 'N/A'}</strong></div>
            <div><span className="text-slate-400">Gender:</span> <strong className="text-white">{person.gender || 'N/A'}</strong></div>
            <div><span className="text-slate-400">Height:</span> <strong className="text-white">{person.height || person.height_approx || 'N/A'}</strong></div>
            <div><span className="text-slate-400">Hair:</span> <strong className="text-white">{person.hair || 'N/A'}</strong></div>
            <div className="col-span-2"><span className="text-slate-400">Physical Marks:</span> <strong className="text-amber-300">{person.physical_marks || 'None specified'}</strong></div>
            <div className="col-span-2"><span className="text-slate-400">Clothing:</span> <strong className="text-white">{person.clothing || 'N/A'}</strong></div>
            <div className="col-span-2"><span className="text-slate-400">Last / Current Location:</span> <strong className="text-sky-300">{person.last_known_location || person.current_location || emergency.location}</strong></div>
          </div>
        </div>

        {/* Photo & Circumstances */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg flex flex-col justify-between">
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">Circumstances & Photo Reference</h2>
            <p className="text-xs text-slate-300">{person.circumstances || caseData.notes || emergency.description}</p>
          </div>

          {person.photo_url && (
            <div className="pt-2 flex items-center space-x-4 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <img src={person.photo_url} alt="Person Reference" className="w-16 h-16 object-cover rounded-lg border border-slate-700" />
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-200">Verified Photo Reference</span>
                <p className="text-[11px] text-slate-400">Uploaded by reporter for visual verification matching.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI SMART MATCHES & RATIONALE SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-white flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-sky-400" />
            <span>Multi-Factor AI Matches & Rationale ({matches.length})</span>
          </h2>
          <span className="text-xs text-slate-400">Deterministic scoring & evidence alignment</span>
        </div>

        {matches.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center text-xs text-slate-400">
            No potential identity matches generated yet for this record.
          </div>
        ) : (
          matches.map(m => (
            <div key={m.id} className="bg-slate-900 border border-sky-500/40 rounded-2xl p-6 space-y-5 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-4">
                  <div className="text-center bg-slate-950 border border-sky-500/50 p-3 rounded-xl min-w-[90px]">
                    <span className="text-3xl font-black text-sky-400 font-mono">{m.confidence_score}%</span>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Match Score</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-sky-400 bg-sky-950 px-2.5 py-1 rounded border border-sky-800">{m.match_category}</span>
                    <p className="text-xs text-slate-300 mt-1 font-semibold">Matched Record: {m.found_case_id === caseData.id ? m.missing_case_id : m.found_case_id}</p>
                    <span className="text-[11px] text-slate-400">Status: <strong className="text-white">{m.status}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {m.status === 'VERIFIED' ? (
                    <span className="px-4 py-2 bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow">
                      <ShieldCheck className="w-4 h-4" />
                      <span>MATCH VERIFIED & REUNITED</span>
                    </span>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleVerify(m.id, 'CONFIRM')}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
                      >
                        ✓ Verify Identity Match
                      </button>
                      <button 
                        onClick={() => handleVerify(m.id, 'REJECT')}
                        className="px-4 py-2.5 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 font-bold text-xs rounded-xl transition"
                      >
                        ✗ Reject Match
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Rationale Explanation */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">AI Match Rationale & Explanation</span>
                <p className="text-xs text-slate-200 leading-relaxed italic">{m.rationale}</p>
              </div>

              {/* Supporting vs Missing Evidence Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-emerald-900/40 space-y-2">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Supporting Matched Characteristics ({m.supporting_evidence?.length || 0})</span>
                  </span>
                  <ul className="space-y-1.5 pt-1">
                    {m.supporting_evidence?.map((item, idx) => (
                      <li key={idx} className="text-slate-300 text-[11px] flex items-start space-x-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-amber-900/40 space-y-2">
                  <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Missing Verification Evidence ({m.missing_evidence?.length || 0})</span>
                  </span>
                  <ul className="space-y-1.5 pt-1">
                    {m.missing_evidence?.map((item, idx) => (
                      <li key={idx} className="text-slate-400 text-[11px] flex items-start space-x-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DYNAMIC CASE TIMELINE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-base font-black text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>Dynamic Disaster Case Timeline</span>
          </h2>
          {caseData.timeline_consistency && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded border ${caseData.timeline_consistency.consistent ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-amber-950 text-amber-400 border-amber-800'}`}>
              Timeline Check: {caseData.timeline_consistency.consistent ? 'STABLE' : 'CONFLICT DETECTED'}
            </span>
          )}
        </div>

        <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
          {timeline.map((event, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-amber-500 group-hover:scale-125 transition"></div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">{event.timestamp} — {event.location}</span>
                  <span className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800 font-mono">{event.status}</span>
                </div>
                <p className="text-xs text-slate-200">{event.description}</p>
                <span className="text-[10px] text-slate-500 block pt-1">Source: {event.organization} ({event.source})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AUDIT TRAIL LOG */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">System Audit Trail Log</h2>
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-h-48 overflow-y-auto space-y-2 font-mono text-[11px]">
          {audits.map(a => (
            <div key={a.id} className="text-slate-400 border-b border-slate-900 pb-1 flex justify-between">
              <span><strong className="text-slate-200">[{a.timestamp}]</strong> {a.actor}: {a.details}</span>
              <span className="text-slate-400 text-[10px]">{a.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
