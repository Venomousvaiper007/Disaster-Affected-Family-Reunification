import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  CopyX,
  AlertTriangle,
  GitMerge,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info,
  Archive,
  Scale,
  FileEdit,
  Check,
  Building,
  UserCheck
} from 'lucide-react';

export const DuplicateDetection = () => {
  const { duplicates, conflicts = [], mergeDuplicateRecords, resolveConflict, t } = useCommand();
  const [activeTab, setActiveTab] = useState('duplicates'); // 'duplicates' | 'conflicts'
  const [selectedDup, setSelectedDup] = useState(duplicates[0] || null);
  const [selectedConflict, setSelectedConflict] = useState(conflicts[0] || null);
  const [chosenSource, setChosenSource] = useState('fieldB');
  const [overrideNotes, setOverrideNotes] = useState('Verified with hospital emergency admissions ledger.');

  const handleMerge = (dup) => {
    if (confirm(`Authorize merge of record ${dup.duplicateCaseId} into primary record ${dup.primaryCaseId}? Original audit history and identifiers will be preserved.`)) {
      mergeDuplicateRecords(dup.id, dup.primaryCaseId, dup.duplicateCaseId);
    }
  };

  const handleResolveConflict = (conf) => {
    const selectedField = chosenSource === 'fieldA' ? conf.fieldA : conf.fieldB;
    resolveConflict(
      conf.id,
      selectedField.label,
      selectedField.location,
      selectedField.age?.replace(/[^0-9]/g, ''),
      overrideNotes
    );
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header & Tab Selector */}
      <div className="bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#D8F3EF] border border-[#B2E4DD] text-[#155E63]">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#1D3033] uppercase tracking-wider font-mono">
              {t('duplicateTitle')}
            </h1>
            <p className="text-xs text-[#687A7C] font-sans">
              {t('duplicateSubtitle')}
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-[#F4F7F6] p-1 rounded-xl border border-[#E1E9E7] text-xs">
          <button
            onClick={() => setActiveTab('duplicates')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'duplicates'
                ? 'bg-[#155E63] text-white shadow-xs'
                : 'text-[#687A7C] hover:text-[#1D3033]'
            }`}
          >
            <CopyX className="w-3.5 h-3.5" />
            <span>Duplicate Merging ({duplicates.filter(d => d.status === 'SUGGESTED_MERGE').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('conflicts')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'conflicts'
                ? 'bg-[#155E63] text-white shadow-xs'
                : 'text-[#687A7C] hover:text-[#1D3033]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Conflict Resolution ({conflicts.filter(c => c.status === 'PENDING_RESOLUTION').length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'duplicates' ? (
        /* DUPLICATE MERGING VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {duplicates.map(d => {
              const isMerged = d.status === 'MERGED';
              const isSelected = selectedDup?.id === d.id;

              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDup(d)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-3 ${
                    isSelected ? 'bg-[#D8F3EF]/30 border-[#155E63] ring-1 ring-[#155E63] shadow-soft-xs' : 'bg-white border-[#E1E9E7] hover:border-[#155E63]/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#155E63]">{d.groupId || d.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isMerged ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {d.similarityScore}% Duplicate Similarity
                    </span>
                  </div>

                  <div className="text-xs">
                    <h4 className="font-bold text-[#1D3033]">{d.suspectedGroup}</h4>
                    <div className="text-[11px] text-[#687A7C] mt-1 font-mono">
                      Primary: {d.primaryCaseId} ⟷ Duplicate: {d.duplicateCaseId}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E1E9E7] flex items-center justify-between text-[11px] text-[#687A7C]">
                    <span>Detected: {d.detectedAt}</span>
                    <span className={isMerged ? 'text-[#24856A] font-bold' : 'text-[#B7791F] font-bold'}>
                      {isMerged ? 'MERGED ✓' : 'ACTION PENDING'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Inspection & Merge Authorization (7 cols) */}
          {selectedDup ? (
            <div className="lg:col-span-7 bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E1E9E7] pb-3">
                <h3 className="font-bold text-[#1D3033] text-sm font-mono uppercase">
                  Duplicate Inspection & Provenance Merge ({selectedDup.groupId || selectedDup.id})
                </h3>
                <span className="text-xs text-[#155E63] font-mono font-bold">
                  {selectedDup.similarityScore}% Match Confidence
                </span>
              </div>

              {/* Side-by-Side Sources */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#F4F7F6] border border-[#E1E9E7] space-y-1.5">
                  <span className="text-[10px] text-[#B7791F] font-mono font-bold uppercase block">Source Submission A (Primary)</span>
                  <span className="font-mono text-[#155E63] font-bold block">{selectedDup.primaryCaseId}</span>
                  <p className="text-[#1D3033] text-[11px]">{selectedDup.sourceA}</p>
                </div>

                <div className="p-3 rounded-lg bg-[#F4F7F6] border border-[#E1E9E7] space-y-1.5">
                  <span className="text-[10px] text-rose-700 font-mono font-bold uppercase block">Source Submission B (Duplicate)</span>
                  <span className="font-mono text-[#155E63] font-bold block">{selectedDup.duplicateCaseId}</span>
                  <p className="text-[#1D3033] text-[11px]">{selectedDup.sourceB}</p>
                </div>
              </div>

              {/* Detection Reasons */}
              <div className="space-y-2 bg-[#F4F7F6] p-3 rounded-lg border border-[#E1E9E7]">
                <span className="text-[11px] text-[#687A7C] font-mono uppercase font-bold block">
                  Corroborating Detection Signals:
                </span>
                <ul className="space-y-1 text-xs text-[#1D3033]">
                  {selectedDup.reasons.map((r, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F47C65]"></span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Non-destructive Merge Policy Note */}
              <div className="p-3 rounded-lg bg-[#D8F3EF] border border-[#155E63]/20 text-xs text-[#155E63] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#155E63] flex-shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Non-Destructive Merge Policy: Authorizing this merge preserves both case identifiers, historical timestamps, and reporter details in the master audit log.
                </p>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-[#E1E9E7] flex justify-end">
                {selectedDup.status !== 'MERGED' ? (
                  <button
                    onClick={() => handleMerge(selectedDup)}
                    className="px-5 py-2.5 bg-[#155E63] hover:bg-[#123B3A] text-white font-bold text-xs rounded-xl shadow-soft-sm flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                  >
                    <Archive className="w-4 h-4" />
                    <span>Authorize Non-Destructive Merge</span>
                  </button>
                ) : (
                  <span className="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-mono font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#24856A]" />
                    <span>Records Successfully Merged on {selectedDup.mergedAt}</span>
                  </span>
                )}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        /* CONFLICT RESOLUTION VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Conflicts List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {conflicts.map(c => {
              const isResolved = c.status === 'RESOLVED';
              const isSelected = selectedConflict?.id === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedConflict(c)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2.5 ${
                    isSelected ? 'bg-[#D8F3EF]/30 border-[#155E63] ring-1 ring-[#155E63] shadow-soft-xs' : 'bg-white border-[#E1E9E7] hover:border-[#155E63]/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#155E63]">{c.id} • {c.caseId}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isResolved ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-[#B7791F] border border-amber-200'
                    }`}>
                      {isResolved ? 'RESOLVED ✓' : 'CONFLICT PENDING'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-[#1D3033] text-xs">{c.personName}</h4>
                    <p className="text-[11px] text-[#687A7C]">{c.conflictField}</p>
                  </div>

                  <div className="pt-2 border-t border-[#E1E9E7] text-[10px] text-[#687A7C] flex items-center justify-between">
                    <span>{c.summary}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Conflict Resolution Workspace (7 cols) */}
          {selectedConflict ? (
            <div className="lg:col-span-7 bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E1E9E7] pb-3">
                <div>
                  <h3 className="font-bold text-[#1D3033] text-sm font-mono uppercase">
                    Reconciliation Workspace: {selectedConflict.caseId}
                  </h3>
                  <p className="text-xs text-[#687A7C]">{selectedConflict.conflictField}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {selectedConflict.status}
                </span>
              </div>

              <div className="text-xs text-[#1D3033] leading-relaxed">
                Select the authoritative source to adopt for official command coordination:
              </div>

              {/* Field A vs Field B Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Source A */}
                <div
                  onClick={() => selectedConflict.status !== 'RESOLVED' && setChosenSource('fieldA')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    chosenSource === 'fieldA'
                      ? 'border-[#155E63] bg-[#D8F3EF]/30 ring-1 ring-[#155E63]'
                      : 'border-[#E1E9E7] bg-white hover:border-[#155E63]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#687A7C]">Option A</span>
                    <input
                      type="radio"
                      checked={chosenSource === 'fieldA'}
                      onChange={() => setChosenSource('fieldA')}
                      className="text-[#155E63]"
                    />
                  </div>
                  <div className="font-bold text-xs text-[#1D3033]">{selectedConflict.fieldA.label}</div>
                  <div className="text-xs space-y-0.5 text-[#1D3033]">
                    <div><strong>Location:</strong> {selectedConflict.fieldA.location}</div>
                    <div><strong>Age:</strong> {selectedConflict.fieldA.age}</div>
                    <div className="text-[10px] text-[#687A7C]">Trust: {selectedConflict.fieldA.confidence}</div>
                  </div>
                </div>

                {/* Source B */}
                <div
                  onClick={() => selectedConflict.status !== 'RESOLVED' && setChosenSource('fieldB')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    chosenSource === 'fieldB'
                      ? 'border-[#155E63] bg-[#D8F3EF]/30 ring-1 ring-[#155E63]'
                      : 'border-[#E1E9E7] bg-white hover:border-[#155E63]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#155E63]">Option B (Recommended)</span>
                    <input
                      type="radio"
                      checked={chosenSource === 'fieldB'}
                      onChange={() => setChosenSource('fieldB')}
                      className="text-[#155E63]"
                    />
                  </div>
                  <div className="font-bold text-xs text-[#1D3033]">{selectedConflict.fieldB.label}</div>
                  <div className="text-xs space-y-0.5 text-[#1D3033]">
                    <div><strong>Location:</strong> {selectedConflict.fieldB.location}</div>
                    <div><strong>Age:</strong> {selectedConflict.fieldB.age}</div>
                    <div className="text-[10px] text-[#687A7C]">Trust: {selectedConflict.fieldB.confidence}</div>
                  </div>
                </div>
              </div>

              {/* Authority Justification Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D3033]">
                  Authority Override Justification Notes:
                </label>
                <textarea
                  value={overrideNotes}
                  onChange={(e) => setOverrideNotes(e.target.value)}
                  disabled={selectedConflict.status === 'RESOLVED'}
                  rows={2}
                  className="w-full bg-[#F4F7F6] border border-[#E1E9E7] focus:border-[#155E63] focus:bg-white rounded-xl p-2.5 text-xs text-[#1D3033] focus:outline-none"
                  placeholder="Document reason for choosing this authoritative source..."
                />
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-[#E1E9E7] flex justify-end">
                {selectedConflict.status !== 'RESOLVED' ? (
                  <button
                    onClick={() => handleResolveConflict(selectedConflict)}
                    className="px-5 py-2.5 bg-[#155E63] hover:bg-[#123B3A] text-white font-bold text-xs rounded-xl shadow-soft-sm flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Apply Official Authority Override</span>
                  </button>
                ) : (
                  <span className="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-mono font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#24856A]" />
                    <span>Conflict Reconciled by Authority on {selectedConflict.resolvedAt}</span>
                  </span>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

