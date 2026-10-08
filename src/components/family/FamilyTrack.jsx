import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  HeartHandshake,
  Search,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Lock,
  Send,
  Upload,
  AlertCircle,
  HelpCircle,
  FileText,
  PhoneCall
} from 'lucide-react';

export const FamilyTrack = () => {
  const { cases, addCaseNote, t } = useCommand();

  const [inputCaseId, setInputCaseId] = useState('CAS-2026-0101');
  const [inputPin, setInputPin] = useState('4412');
  const [trackedCase, setTrackedCase] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [additionalNote, setAdditionalNote] = useState('');
  const [noteSubmitted, setNoteSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setNoteSubmitted(false);

    if (!inputCaseId.trim()) {
      setErrorMsg('Please enter a valid Case ID.');
      return;
    }

    const searchTerm = inputCaseId.trim().toLowerCase();
    const found = cases.find(c =>
      c.id.toLowerCase() === searchTerm ||
      c.reporter?.contact?.toLowerCase().includes(searchTerm) ||
      (c.reporter?.contact?.replace(/[^0-9]/g, '') && c.reporter.contact.replace(/[^0-9]/g, '').includes(searchTerm.replace(/[^0-9]/g, '')))
    );

    if (found) {
      // Check PIN / Security token if searching by ID
      if (inputPin && found.pin && found.pin !== inputPin.trim() && !inputCaseId.includes('-')) {
        setErrorMsg('Security PIN does not match the registered case.');
        setTrackedCase(null);
        return;
      }
      setTrackedCase(found);
      setHasSearched(true);
    } else {
      setErrorMsg('No case found matching this Case ID or phone number. Please check your emergency receipt or contact 1070.');
      setTrackedCase(null);
      setHasSearched(true);
    }
  };

  const handleSendAdditionalInfo = (e) => {
    e.preventDefault();
    if (!additionalNote.trim() || !trackedCase) return;

    addCaseNote(trackedCase.id, `Family Note Submission: ${additionalNote}`);
    setAdditionalNote('');
    setNoteSubmitted(true);
  };

  // Safe Family Status Mapping (Strict Privacy Compliance)
  const getFamilyFriendlyStatus = (status) => {
    switch (status) {
      case 'REPORTED':
        return {
          step: 1,
          title: 'Report Received & Queued',
          desc: 'Your report has been logged into the central disaster response network and distributed to field relief teams.',
          color: 'text-[#155E63]',
          badge: 'bg-[#D8F3EF] text-[#155E63] border-[#155E63]/20'
        };
      case 'UNDER_REVIEW':
        return {
          step: 2,
          title: 'Case Under Active Officer Review',
          desc: 'A designated relief officer is actively cross-referencing field intake registries and hospital admissions.',
          color: 'text-purple-700',
          badge: 'bg-purple-50 text-purple-800 border-purple-200'
        };
      case 'POTENTIAL_MATCH':
      case 'AWAITING_VERIFICATION':
        return {
          step: 3,
          title: 'Candidate Record Under Official Verification',
          desc: 'A potential candidate has been located in the sector. Relief coordinators and medical teams are performing human verification checks.',
          color: 'text-[#B7791F]',
          badge: 'bg-amber-50 text-[#B7791F] border-amber-200'
        };
      case 'REUNIFICATION_CONFIRMED':
        return {
          step: 4,
          title: 'Identity Verified — Reunification In Progress',
          desc: 'Identity has been officially verified by response authorities. Family contact and handover coordination is being arranged.',
          color: 'text-[#24856A]',
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-200'
        };
      case 'NEEDS_MORE_INFO':
        return {
          step: 2,
          title: 'Additional Information Requested',
          desc: 'The assigned officer has requested further details (such as recent attire or distinct identification marks) to assist searching.',
          color: 'text-[#B7791F]',
          badge: 'bg-amber-50 text-[#B7791F] border-amber-200'
        };
      default:
        return {
          step: 1,
          title: 'Report Logged in Command Net',
          desc: 'Search operations are actively ongoing across relief sectors.',
          color: 'text-[#687A7C]',
          badge: 'bg-slate-100 text-[#687A7C] border-slate-200'
        };
    }
  };

  const statusInfo = trackedCase ? getFamilyFriendlyStatus(trackedCase.status) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-[#E1E9E7] rounded-2xl p-6 md:p-8 shadow-soft-sm text-center space-y-3.5">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#D8F3EF] text-[#155E63] border border-[#155E63]/20 mb-1">
          <HeartHandshake className="w-7 h-7" />
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-[#1D3033] font-sans">
          {t('familyPortalTitle')}
        </h1>
        <p className="text-sm text-[#687A7C] max-w-xl mx-auto leading-relaxed">
          {t('familyPortalSubtitle')}
        </p>

        {/* Privacy Note */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
          <Lock className="w-3.5 h-3.5 text-[#24856A]" />
          <span>Strict Family Privacy Protection Active (Authorized Access Only)</span>
        </div>
      </div>

      {/* Case Lookup Search Card */}
      <div className="bg-white border border-[#E1E9E7] rounded-2xl p-6 shadow-soft-sm">
        <form onSubmit={handleTrackSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-7">
              <label className="block text-xs font-semibold text-[#1D3033] mb-1.5">
                Case Tracking ID or Registered Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687A7C]" />
                <input
                  type="text"
                  placeholder="e.g. MP-1024 or 98412-88771"
                  value={inputCaseId}
                  onChange={(e) => setInputCaseId(e.target.value)}
                  className="w-full bg-[#F4F7F6] border border-[#E1E9E7] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1D3033] placeholder-[#687A7C] focus:outline-none focus:border-[#155E63] focus:ring-1 focus:ring-[#155E63] font-mono"
                />
              </div>
            </div>

            <div className="md:col-span-5">
              <label className="block text-xs font-semibold text-[#1D3033] mb-1.5">
                4-Digit Security PIN (from receipt)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687A7C]" />
                <input
                  type="password"
                  placeholder="e.g. 1024"
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value)}
                  className="w-full bg-[#F4F7F6] border border-[#E1E9E7] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1D3033] placeholder-[#687A7C] focus:outline-none focus:border-[#155E63] focus:ring-1 focus:ring-[#155E63] font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-[#687A7C]">
              Demo Quick Lookups: <span className="font-mono text-[#155E63] font-bold cursor-pointer underline" onClick={() => { setInputCaseId('MP-1024'); setInputPin('1024'); }}>MP-1024 (Ravi Kumar)</span>, <span className="font-mono text-[#155E63] font-bold cursor-pointer underline" onClick={() => { setInputCaseId('CAS-2026-0101'); setInputPin('4412'); }}>CAS-2026-0101</span>
            </span>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#155E63] hover:bg-[#123B3A] text-white font-bold text-xs rounded-xl shadow-soft-sm transition-all"
            >
              Check Case Status
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Case Tracking Results View */}
      {trackedCase && statusInfo && (
        <div className="bg-white border border-[#E1E9E7] rounded-2xl p-6 shadow-soft-sm space-y-6">
          {/* Top Status Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E1E9E7]">
            <div className="flex items-center gap-4">
              <img
                src={trackedCase.photo}
                alt={trackedCase.fullName}
                className="w-14 h-14 rounded-xl object-cover border-2 border-[#155E63]/30"
              />
              <div>
                <h3 className="text-lg font-bold text-[#1D3033]">{trackedCase.fullName}</h3>
                <div className="text-xs text-[#687A7C]">
                  Case ID: <span className="font-mono text-[#155E63] font-bold">{trackedCase.id}</span> • {trackedCase.age} Years • {trackedCase.gender}
                </div>
              </div>
            </div>

            <span className={`px-3.5 py-1 rounded-full text-xs font-bold font-mono border ${statusInfo.badge}`}>
              {statusInfo.title}
            </span>
          </div>

          {/* 4-Step Visual Progress Flow */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#687A7C]">
              <span className={statusInfo.step >= 1 ? 'text-[#155E63] font-bold' : ''}>1. Received</span>
              <span className={statusInfo.step >= 2 ? 'text-purple-700 font-bold' : ''}>2. Review</span>
              <span className={statusInfo.step >= 3 ? 'text-[#B7791F] font-bold' : ''}>3. Verify</span>
              <span className={statusInfo.step >= 4 ? 'text-[#24856A] font-bold' : ''}>4. Reunited</span>
            </div>

            <div className="w-full h-3 bg-[#F4F7F6] border border-[#E1E9E7] rounded-full overflow-hidden p-0.5 flex gap-1">
              <div className={`h-full rounded-full transition-all duration-500 ${statusInfo.step >= 1 ? 'bg-[#155E63] flex-1' : 'bg-transparent flex-1'}`} />
              <div className={`h-full rounded-full transition-all duration-500 ${statusInfo.step >= 2 ? 'bg-purple-600 flex-1' : 'bg-transparent flex-1'}`} />
              <div className={`h-full rounded-full transition-all duration-500 ${statusInfo.step >= 3 ? 'bg-amber-500 flex-1' : 'bg-transparent flex-1'}`} />
              <div className={`h-full rounded-full transition-all duration-500 ${statusInfo.step >= 4 ? 'bg-[#24856A] flex-1' : 'bg-transparent flex-1'}`} />
            </div>
          </div>

          {/* Detailed Status Explanation Box */}
          <div className="p-4 rounded-xl bg-[#F4F7F6] border border-[#E1E9E7] space-y-1.5">
            <div className="text-xs font-bold font-mono text-[#1D3033] flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${statusInfo.color}`} />
              <span>Current Status: {statusInfo.title}</span>
            </div>
            <p className="text-xs text-[#687A7C] leading-relaxed pl-6">
              {statusInfo.desc}
            </p>
          </div>

          {/* Family Additional Information Submission Form */}
          <div className="p-5 rounded-xl bg-[#F4F7F6] border border-[#E1E9E7] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1D3033] font-mono uppercase">
              <FileText className="w-4 h-4 text-[#155E63]" />
              <span>Submit Additional Information or Photo to Case Officer</span>
            </div>

            <form onSubmit={handleSendAdditionalInfo} className="space-y-3">
              <textarea
                rows={3}
                value={additionalNote}
                onChange={(e) => setAdditionalNote(e.target.value)}
                placeholder="Provide any new details (e.g., additional contact number, clothing details, or potential relatives they might contact)..."
                className="w-full bg-white border border-[#E1E9E7] rounded-xl p-3 text-xs text-[#1D3033] placeholder-[#687A7C] focus:outline-none focus:border-[#155E63]"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[11px] text-[#687A7C]">
                  Notes are instantly attached to your assigned officer's dashboard.
                </span>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#155E63] hover:bg-[#123B3A] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Update</span>
                </button>
              </div>
            </form>

            {noteSubmitted && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#24856A]" />
                <span>Your information has been logged and forwarded to the case responder.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
