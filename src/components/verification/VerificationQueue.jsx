import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  FileCheck2,
  AlertTriangle,
  GitMerge,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  PhoneCall,
  UserCheck,
  FileText
} from 'lucide-react';

export const VerificationQueue = () => {
  const {
    matches,
    cases,
    setSelectedMatchForVerify,
    setIsVerifyModalOpen,
    openCaseDetails,
    t
  } = useCommand();

  const [queueTab, setQueueTab] = useState('PENDING'); // PENDING, CONFIRMED, REJECTED

  const pendingMatches = matches.filter(m => m.status === 'AWAITING_HUMAN_VERIFICATION');
  const confirmedMatches = matches.filter(m => m.status === 'VERIFIED_REUNIFIED');
  const rejectedMatches = matches.filter(m => m.status === 'REJECTED_FALSE_POSITIVE');

  const displayList = queueTab === 'PENDING' ? pendingMatches : queueTab === 'CONFIRMED' ? confirmedMatches : rejectedMatches;

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[#B7791F]">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#1D3033] uppercase tracking-wider font-mono">
              {t('verificationTitle')}
            </h1>
            <p className="text-xs text-[#687A7C] font-sans">
              {t('verificationSubtitle')}
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-[#F4F7F6] rounded-lg p-0.5 border border-[#E1E9E7] text-xs">
          <button
            onClick={() => setQueueTab('PENDING')}
            className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
              queueTab === 'PENDING' ? 'bg-[#155E63] text-white font-bold shadow-xs' : 'text-[#687A7C] hover:text-[#1D3033]'
            }`}
          >
            <span>{t('pendingReviews')}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
              queueTab === 'PENDING' ? 'bg-white/20 text-white' : 'bg-slate-200 text-[#687A7C]'
            }`}>
              {pendingMatches.length}
            </span>
          </button>
          <button
            onClick={() => setQueueTab('CONFIRMED')}
            className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
              queueTab === 'CONFIRMED' ? 'bg-[#24856A] text-white font-bold shadow-xs' : 'text-[#687A7C] hover:text-[#1D3033]'
            }`}
          >
            <span>{t('verifiedReunions')}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
              queueTab === 'CONFIRMED' ? 'bg-white/20 text-white' : 'bg-slate-200 text-[#687A7C]'
            }`}>
              {confirmedMatches.length}
            </span>
          </button>
          <button
            onClick={() => setQueueTab('REJECTED')}
            className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
              queueTab === 'REJECTED' ? 'bg-[#C83D4D] text-white font-bold shadow-xs' : 'text-[#687A7C] hover:text-[#1D3033]'
            }`}
          >
            <span>{t('falsePositives')}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
              queueTab === 'REJECTED' ? 'bg-white/20 text-white' : 'bg-slate-200 text-[#687A7C]'
            }`}>
              {rejectedMatches.length}
            </span>
          </button>
        </div>
      </div>

      {/* Queue Cards */}
      <div className="grid grid-cols-1 gap-4">
        {displayList.length > 0 ? (
          displayList.map(m => {
            const missingCase = cases.find(c => c.id === m.missingCaseId);
            const foundCase = cases.find(c => c.id === m.foundCaseId);

            return (
              <div
                key={m.id}
                className="bg-white border border-[#E1E9E7] hover:border-[#155E63]/40 rounded-xl p-5 shadow-soft-sm space-y-4 transition-all"
              >
                {/* Top Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E1E9E7]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-[#155E63]">{m.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                      m.overallScore >= 90 ? 'bg-[#D8F3EF] text-[#155E63] border border-[#155E63]/30' : 'bg-amber-50 text-[#B7791F] border border-amber-200'
                    }`}>
                      {m.overallScore}% Similarity Score
                    </span>
                    <span className="text-xs text-[#687A7C] font-mono">Calculated: {m.calculatedAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {m.status === 'VERIFIED_REUNIFIED' ? (
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold font-mono">
                        VERIFIED BY: {m.verifiedBy}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md bg-amber-50 text-[#B7791F] border border-amber-200 text-xs font-bold font-mono">
                        AWAITING OFFICER REVIEW
                      </span>
                    )}
                  </div>
                </div>

                {/* Side-by-Side Comparison Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Missing Case Snapshot */}
                  <div className="p-3.5 rounded-lg bg-[#F4F7F6] border border-[#E1E9E7] space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold font-mono text-[#F47C65] uppercase">Missing Report Profile</span>
                      <span className="font-mono text-[#687A7C]">{m.missingCaseId}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {missingCase?.photo && (
                        <img
                          src={missingCase.photo}
                          alt={m.missingPersonName}
                          className="w-12 h-12 rounded-lg object-cover border border-[#E1E9E7]"
                        />
                      )}
                      <div>
                        <h4 className="font-bold text-sm text-[#1D3033]">{m.missingPersonName}</h4>
                        <div className="text-xs text-[#687A7C]">{m.missingAge} yrs • Last Seen: {m.missingLocation}</div>
                      </div>
                    </div>

                    <div className="text-xs text-[#1D3033] bg-white p-2.5 rounded border border-[#E1E9E7]">
                      <span className="text-[#687A7C] font-semibold block text-[11px]">Reported Attire & Distinct Marks:</span>
                      {m.missingClothing}
                    </div>
                  </div>

                  {/* Found Case Snapshot */}
                  <div className="p-3.5 rounded-lg bg-[#F4F7F6] border border-[#E1E9E7] space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold font-mono text-[#155E63] uppercase">Found Subject Profile</span>
                      <span className="font-mono text-[#687A7C]">{m.foundCaseId}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {foundCase?.photo && (
                        <img
                          src={foundCase.photo}
                          alt={m.foundPersonName}
                          className="w-12 h-12 rounded-lg object-cover border border-[#E1E9E7]"
                        />
                      )}
                      <div>
                        <h4 className="font-bold text-sm text-[#1D3033]">{m.foundPersonName}</h4>
                        <div className="text-xs text-[#687A7C]">{m.foundAge} yrs • Located: {m.foundLocation}</div>
                      </div>
                    </div>

                    <div className="text-xs text-[#1D3033] bg-white p-2.5 rounded border border-[#E1E9E7]">
                      <span className="text-[#687A7C] font-semibold block text-[11px]">Present Attire & Status:</span>
                      {m.foundClothing}
                    </div>
                  </div>
                </div>

                {/* Evidence Corroboration Tags */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono text-[#687A7C]">Corroborated Points:</span>
                    {m.evidenceTags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        ✓ {tag}
                      </span>
                    ))}
                  </div>

                  {m.status === 'AWAITING_HUMAN_VERIFICATION' && (
                    <button
                      onClick={() => {
                        setSelectedMatchForVerify(m);
                        setIsVerifyModalOpen(true);
                      }}
                      className="px-4 py-2 bg-[#24856A] hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-soft-sm flex items-center gap-2 transition-all transform active:scale-95"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Execute 5-Point Verification</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white border border-[#E1E9E7] rounded-xl text-[#687A7C]">
            No records in this verification tab currently.
          </div>
        )}
      </div>
    </div>
  );
};
