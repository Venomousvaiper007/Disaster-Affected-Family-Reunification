import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  GitMerge,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  Info,
  Scale,
  FileCheck2,
  AlertTriangle,
  Send,
  Building2
} from 'lucide-react';

export const SmartMatchWorkspace = () => {
  const {
    matches,
    cases,
    openCaseDetails,
    setSelectedMatchForVerify,
    setIsVerifyModalOpen,
    rejectMatch,
    addCaseNote,
    t
  } = useCommand();

  const [filterScore, setFilterScore] = useState('ALL'); // ALL, HIGH (>90%), MEDIUM (70-90%)
  const [selectedMatch, setSelectedMatch] = useState(matches[0] || null);

  const filteredMatches = matches.filter(m => {
    if (filterScore === 'HIGH') return m.overallScore >= 90;
    if (filterScore === 'MEDIUM') return m.overallScore >= 70 && m.overallScore < 90;
    return true;
  });

  const handleLaunchVerification = (match) => {
    setSelectedMatchForVerify(match);
    setIsVerifyModalOpen(true);
  };

  const handleReject = (matchId) => {
    const reason = prompt('Please enter the rationale for marking this candidate as a false match:');
    if (reason) {
      rejectMatch(matchId, reason);
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header & Safety Notice Banner */}
      <div className="bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#D8F3EF] border border-[#155E63]/20 text-[#155E63]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#1D3033] uppercase tracking-wider font-mono">
                {t('smartMatching')}
              </h1>
              <p className="text-xs text-[#687A7C] font-sans">
                {t('smartMatchSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#687A7C] font-medium">{t('filterConfidence')}:</span>
            <div className="flex bg-[#F4F7F6] rounded-lg p-0.5 border border-[#E1E9E7] text-xs">
              {['ALL', 'HIGH', 'MEDIUM'].map(tier => (
                <button
                  key={tier}
                  onClick={() => setFilterScore(tier)}
                  className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                    filterScore === tier ? 'bg-[#155E63] text-white shadow-xs' : 'text-[#687A7C] hover:text-[#1D3033]'
                  }`}
                >
                  {tier === 'ALL' ? t('allConfidence') : tier === 'HIGH' ? t('highConfidence') : t('mediumConfidence')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Safety Warning Banner */}
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3 text-rose-900 text-xs">
          <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold font-mono tracking-wide uppercase text-rose-800">
              {t('safetyNotice')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Matching Grid: Left Ranked Candidate List + Right Side-by-Side Explainable Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Ranked Candidate List (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E1E9E7] rounded-xl p-4 shadow-soft-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E1E9E7]">
            <span className="font-mono font-bold text-xs uppercase text-[#1D3033]">
              {t('potentialMatches')} ({filteredMatches.length})
            </span>
            <span className="text-[10px] text-[#155E63] font-mono font-bold">{t('matchScore')}</span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredMatches.map(m => {
              const isSelected = selectedMatch?.id === m.id;
              const isReunified = m.status === 'VERIFIED_REUNIFIED';
              const isRejected = m.status === 'REJECTED_FALSE_POSITIVE';

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMatch(m)}
                  className={`
                    p-3.5 rounded-xl border cursor-pointer transition-all duration-200 space-y-2.5
                    ${isSelected 
                      ? 'bg-[#D8F3EF]/30 border-[#155E63] shadow-soft-sm ring-1 ring-[#155E63]' 
                      : 'bg-white border-[#E1E9E7] hover:border-[#155E63]/50 hover:bg-[#F4F7F6]/50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#155E63]">{m.id}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        m.overallScore >= 90
                          ? 'bg-[#D8F3EF] text-[#155E63] border border-[#155E63]/30'
                          : 'bg-amber-50 text-[#B7791F] border border-amber-200'
                      }`}>
                        {m.overallScore}% {t('matchScore')}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="text-[#1D3033] font-semibold flex items-center justify-between">
                      <span className="truncate">{m.missingPersonName}</span>
                      <span className="text-[10px] text-[#F47C65] font-mono font-bold">{t('missing')}</span>
                    </div>
                    <div className="text-[#687A7C] flex items-center justify-between text-[11px]">
                      <span className="truncate">{m.foundPersonName}</span>
                      <span className="text-[10px] text-[#155E63] font-mono font-bold">{t('found')}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E1E9E7] flex items-center justify-between text-[10px] text-[#687A7C]">
                    <span>{m.confidenceTier}</span>
                    <span className={`font-mono font-bold ${isReunified ? 'text-emerald-700' : isRejected ? 'text-rose-700' : 'text-amber-700'}`}>
                      {isReunified ? t('statusVerified') : isRejected ? t('falsePositives') : t('statusAwaitingVerify')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Side-by-Side Explainable Inspection & Breakdown (8 Cols) */}
        {selectedMatch ? (
          <div className="lg:col-span-8 space-y-4">
            {/* Side by Side Comparative Dossier */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Missing Record Card */}
              <div className="bg-white border border-[#F47C65]/40 rounded-xl p-4 shadow-soft-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E1E9E7]">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F47C65]/15 text-[#F47C65] border border-[#F47C65]/30">
                    {t('missingProfile')}
                  </span>
                  <span className="font-mono text-xs text-[#F47C65] font-bold">{selectedMatch.missingCaseId}</span>
                </div>

                <div className="space-y-2 text-xs">
                  <h3 className="text-sm font-bold text-[#1D3033]">{selectedMatch.missingPersonName}</h3>
                  <div className="text-[#1D3033]">
                    <span className="text-[#687A7C]">{t('ageLabel')}:</span> {selectedMatch.missingAge}
                  </div>
                  <div className="text-[#1D3033]">
                    <span className="text-[#687A7C]">{t('location')}:</span> {selectedMatch.missingLocation}
                  </div>
                  <div className="text-[#1D3033]">
                    <span className="text-[#687A7C]">{t('attire')}:</span> {selectedMatch.missingClothing}
                  </div>
                </div>
              </div>

              {/* Found Record Card */}
              <div className="bg-white border border-[#155E63]/40 rounded-xl p-4 shadow-soft-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E1E9E7]">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D8F3EF] text-[#155E63] border border-[#155E63]/30">
                    {t('foundProfile')}
                  </span>
                  <span className="font-mono text-xs text-[#155E63] font-bold">{selectedMatch.foundCaseId}</span>
                </div>

                <div className="space-y-2 text-xs">
                  <h3 className="text-sm font-bold text-[#1D3033]">{selectedMatch.foundPersonName}</h3>
                  <div className="text-[#1D3033]">
                    <span className="text-[#687A7C]">{t('ageLabel')}:</span> {selectedMatch.foundAge}
                  </div>
                  <div className="text-[#1D3033]">
                    <span className="text-[#687A7C]">{t('location')}:</span> {selectedMatch.foundLocation}
                  </div>
                  <div className="text-[#1D3033]">
                    <span className="text-[#687A7C]">{t('attire')}:</span> {selectedMatch.foundClothing}
                  </div>
                </div>
              </div>
            </div>

            {/* Explainable Rationale & Visual Score Breakdown */}
            <div className="bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E1E9E7]">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#155E63]" />
                  <h3 className="text-sm font-bold text-[#1D3033] uppercase tracking-wider font-mono">
                    Explainable AI Parameter Weights & Decision Rationale
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-[#155E63]">
                  Overall Confidence: {selectedMatch.overallScore}%
                </span>
              </div>

              {/* Automated Decision Rationale Callout */}
              {selectedMatch.decisionRationale && (
                <div className="p-3.5 bg-[#D8F3EF]/40 border border-[#B2E4DD] rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#155E63]">
                    <Sparkles className="w-3.5 h-3.5 text-[#155E63]" />
                    <span>Automated Match Decision Rationale</span>
                  </div>
                  <p className="text-xs text-[#1D3033] leading-relaxed">
                    {selectedMatch.decisionRationale}
                  </p>
                </div>
              )}

              {/* Supporting vs Missing Evidence Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {/* Supporting Evidence */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 space-y-2">
                  <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Supporting Evidence Points</span>
                  </div>
                  <div className="space-y-1.5">
                    {(selectedMatch.supportingEvidence || [
                      { text: "Visual physical feature alignment", impact: "+35%" },
                      { text: "Geospatial proximity boundary match", impact: "+25%" }
                    ]).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-emerald-950 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-100">
                        <span className="text-[11px] font-medium">{item.text}</span>
                        <span className="font-mono font-bold text-emerald-700 text-[10px]">{item.impact}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing or Contradictory Evidence */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 space-y-2">
                  <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    <span>Missing / Contradictory Elements</span>
                  </div>
                  <div className="space-y-1.5">
                    {(selectedMatch.missingEvidence && selectedMatch.missingEvidence.length > 0 ? selectedMatch.missingEvidence : [
                      { text: "No significant contradictory evidence flagged", penalty: "None" }
                    ]).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-amber-950 bg-white/80 px-2.5 py-1 rounded-lg border border-amber-100">
                        <span className="text-[11px] font-medium">{item.text}</span>
                        <span className="font-mono font-bold text-amber-800 text-[10px]">{item.penalty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Evidence Indicator Progress Bars */}
              <div className="space-y-3 pt-2">
                {Object.entries(selectedMatch.breakdown).map(([key, data]) => {
                  const labelMap = {
                    nameSimilarity: t('nameSimilarity'),
                    ageMatch: t('ageMatch'),
                    proximity: t('locationProximity'),
                    clothingAndAppearance: t('clothingMatch'),
                    physicalFeatures: t('physicalFeatures')
                  };

                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#1D3033]">{labelMap[key] || key}</span>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-[#687A7C]">Weight: {data.weight}%</span>
                          <span className="text-[#155E63] font-bold">{data.score}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#F4F7F6] border border-[#E1E9E7] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#155E63] to-[#80CEC3] rounded-full transition-all duration-500"
                          style={{ width: `${data.score}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-[#687A7C] italic">
                        {data.note}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Evidence Tags & Conflicting Warnings */}
              <div className="pt-3 border-t border-[#E1E9E7] flex flex-wrap gap-2 items-center">
                <span className="text-[11px] font-mono text-[#687A7C]">Key Corroborating Clues:</span>
                {selectedMatch.evidenceTags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    ✓ {tag}
                  </span>
                ))}
              </div>

              {selectedMatch.conflictingDetails.length > 0 && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#B7791F] flex-shrink-0" />
                  <span>Conflicting Detail: {selectedMatch.conflictingDetails.join(', ')}</span>
                </div>
              )}

              {/* Primary Action Buttons */}
              <div className="pt-4 border-t border-[#E1E9E7] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReject(selectedMatch.id)}
                    className="px-3.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{t('notAMatch')}</span>
                  </button>
                  <button
                    onClick={() => {
                      const note = prompt('Request details / photo clarification:');
                      if (note) addCaseNote(selectedMatch.missingCaseId, `Info requested: ${note}`);
                    }}
                    className="px-3.5 py-2 rounded-lg bg-[#F4F7F6] hover:bg-slate-200 border border-[#E1E9E7] text-[#1D3033] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-[#B7791F]" />
                    <span>{t('requestInfo')}</span>
                  </button>
                </div>

                <button
                  onClick={() => handleLaunchVerification(selectedMatch)}
                  className="px-5 py-2.5 bg-[#155E63] hover:bg-[#123B3A] text-white font-bold text-xs rounded-lg shadow-soft-sm flex items-center gap-2 transition-all transform active:scale-95"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>{t('reviewEvidence')} & Verify Match</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 flex items-center justify-center p-12 bg-white border border-[#E1E9E7] rounded-xl text-[#687A7C]">
            Select a candidate match to inspect explainable comparison breakdown.
          </div>
        )}
      </div>
    </div>
  );
};
