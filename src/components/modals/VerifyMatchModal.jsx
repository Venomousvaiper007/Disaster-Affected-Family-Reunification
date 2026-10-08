import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Lock,
  HeartHandshake,
  UserCheck,
  Building2,
  Stamp
} from 'lucide-react';

export const VerifyMatchModal = () => {
  const {
    selectedMatchForVerify,
    isVerifyModalOpen,
    setIsVerifyModalOpen,
    verifyAndReuniteMatch,
    currentResponder,
    currentRole
  } = useCommand();

  const [checklist, setChecklist] = useState({
    visualPhotoConfirmed: false,
    clothingVerified: false,
    birthmarkOrScarVerified: false,
    relativePhoneConfirmed: false,
    medicalClearanceObtained: false
  });

  const [reviewerNotes, setReviewerNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isVerifyModalOpen || !selectedMatchForVerify) return null;

  const allChecked = Object.values(checklist).every(Boolean);

  const handleCheckboxChange = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirmVerification = (e) => {
    e.preventDefault();
    if (!allChecked) {
      setErrorMsg('All 5 mandatory verification points must be completed and confirmed before authorizing family transfer.');
      return;
    }
    if (!reviewerNotes.trim()) {
      setErrorMsg('Please document the officer verification notes and handover location.');
      return;
    }

    verifyAndReuniteMatch(selectedMatchForVerify.id, checklist, reviewerNotes);
    setIsVerifyModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="modal-dialog bg-white border border-[#E1E9E7] rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-soft-lg flex flex-col text-[#1D3033]">
        
        {/* Pinned Header (Friend's README requirement) */}
        <div className="modal-header-pinned p-4 sm:p-5 border-b border-[#E1E9E7] bg-[#F4F7F6] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#1D3033] font-mono uppercase">
                Human Identity Verification Authorization
              </h2>
              <span className="text-xs text-[#687A7C] font-sans">
                Dual-responder sign-off for Match #{selectedMatchForVerify.id}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsVerifyModalOpen(false)}
            className="p-1.5 rounded-lg text-[#687A7C] hover:text-[#1D3033] hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body (modal-body-scroll - Friend's README requirement) */}
        <div className="modal-body-scroll p-4 sm:p-6 space-y-4">
          {/* Matched Records Summary Header */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F4F7F6] border border-[#E1E9E7] text-xs">
            <div className="border-r border-[#E1E9E7] pr-3">
              <span className="text-[10px] text-[#F47C65] font-mono font-bold block uppercase">Missing Case Dossier</span>
              <div className="font-bold text-[#1D3033] text-sm mt-0.5">{selectedMatchForVerify.missingPersonName}</div>
              <div className="text-[#687A7C] font-mono text-[11px]">{selectedMatchForVerify.missingCaseId} • Age {selectedMatchForVerify.missingAge}</div>
            </div>
            <div className="pl-2">
              <span className="text-[10px] text-[#155E63] font-mono font-bold block uppercase">Found Record Dossier</span>
              <div className="font-bold text-[#1D3033] text-sm mt-0.5">{selectedMatchForVerify.foundPersonName}</div>
              <div className="text-[#687A7C] font-mono text-[11px]">{selectedMatchForVerify.foundCaseId} • Age {selectedMatchForVerify.foundAge}</div>
            </div>
          </div>

          {/* 5-Point Mandatory Verification Checklist */}
          <div className="space-y-2.5 bg-[#F4F7F6] border border-[#E1E9E7] rounded-xl p-3.5">
            <div className="flex items-center justify-between border-b border-[#E1E9E7] pb-2">
              <span className="font-mono font-bold text-xs uppercase text-[#1D3033] flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-[#24856A]" />
                <span>5-Point Identity Confirmation Protocol</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-[#24856A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {Object.values(checklist).filter(Boolean).length}/5 Completed
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-[#E1E9E7] cursor-pointer hover:border-[#155E63]/40 transition-colors">
                <input
                  type="checkbox"
                  checked={checklist.visualPhotoConfirmed}
                  onChange={() => handleCheckboxChange('visualPhotoConfirmed')}
                  className="mt-0.5 rounded border-[#E1E9E7] text-[#155E63] focus:ring-[#155E63]"
                />
                <div>
                  <span className="font-semibold text-[#1D3033] block">1. Visual & Photographic Confirmation</span>
                  <span className="text-[11px] text-[#687A7C]">Responder verified high-resolution photograph matches present subject.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-[#E1E9E7] cursor-pointer hover:border-[#155E63]/40 transition-colors">
                <input
                  type="checkbox"
                  checked={checklist.clothingVerified}
                  onChange={() => handleCheckboxChange('clothingVerified')}
                  className="mt-0.5 rounded border-[#E1E9E7] text-[#155E63] focus:ring-[#155E63]"
                />
                <div>
                  <span className="font-semibold text-[#1D3033] block">2. Attire, Jewelry & Personal Effects Corroboration</span>
                  <span className="text-[11px] text-[#687A7C]">Corroborated clothing, ornaments, or identification tokens with missing report details.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-[#E1E9E7] cursor-pointer hover:border-[#155E63]/40 transition-colors">
                <input
                  type="checkbox"
                  checked={checklist.birthmarkOrScarVerified}
                  onChange={() => handleCheckboxChange('birthmarkOrScarVerified')}
                  className="mt-0.5 rounded border-[#E1E9E7] text-[#155E63] focus:ring-[#155E63]"
                />
                <div>
                  <span className="font-semibold text-[#1D3033] block">3. Distinctive Biological Mark / Scar Check</span>
                  <span className="text-[11px] text-[#687A7C]">Confirmed anatomical markings (birthmark, tattoo, or surgical scar) noted in report.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-[#E1E9E7] cursor-pointer hover:border-[#155E63]/40 transition-colors">
                <input
                  type="checkbox"
                  checked={checklist.relativePhoneConfirmed}
                  onChange={() => handleCheckboxChange('relativePhoneConfirmed')}
                  className="mt-0.5 rounded border-[#E1E9E7] text-[#155E63] focus:ring-[#155E63]"
                />
                <div>
                  <span className="font-semibold text-[#1D3033] block">4. Direct Voice / Family Contact Verification</span>
                  <span className="text-[11px] text-[#687A7C]">Officer contacted registered next-of-kin via secure channel and confirmed family identity.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-[#E1E9E7] cursor-pointer hover:border-[#155E63]/40 transition-colors">
                <input
                  type="checkbox"
                  checked={checklist.medicalClearanceObtained}
                  onChange={() => handleCheckboxChange('medicalClearanceObtained')}
                  className="mt-0.5 rounded border-[#E1E9E7] text-[#155E63] focus:ring-[#155E63]"
                />
                <div>
                  <span className="font-semibold text-[#1D3033] block">5. Medical Stability & Triage Clearance</span>
                  <span className="text-[11px] text-[#687A7C]">Medical team certified individual is fit for safe transport / family reunion handover.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Reviewer Notes & Signoff */}
          <div className="space-y-2.5">
            <div>
              <label className="block text-xs font-semibold text-[#1D3033] mb-1">
                Handover Logistics & Officer Justification <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                placeholder="e.g. Identity verified at Relief Desk in presence of Tehsildar. Physical handover to family scheduled."
                className="w-full bg-white border border-[#E1E9E7] rounded-xl p-2.5 text-xs text-[#1D3033] placeholder-[#687A7C] focus:outline-none focus:border-[#155E63]"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-[#F4F7F6] border border-[#E1E9E7] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Stamp className="w-4 h-4 text-[#155E63]" />
                <span className="text-[#687A7C]">Authorizing Officer:</span>
                <span className="font-bold text-[#1D3033] font-mono">{currentResponder.name} ({currentResponder.badge})</span>
              </div>
              <span className="text-[10px] text-[#24856A] font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                OFFICIAL SEAL
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Pinned Footer (modal-footer-pinned) */}
        <div className="modal-footer-pinned p-4 border-t border-[#E1E9E7] bg-[#F4F7F6] flex items-center justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsVerifyModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-white border border-[#E1E9E7] text-[#687A7C] hover:text-[#1D3033] hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmVerification}
            disabled={!allChecked}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              allChecked
                ? 'bg-[#24856A] hover:bg-emerald-700 text-white shadow-soft-sm'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Authorize & Confirm Official Reunification</span>
          </button>
        </div>
      </div>
    </div>
  );
};
