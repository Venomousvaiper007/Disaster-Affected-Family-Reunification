import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  X,
  User,
  MapPin,
  Calendar,
  AlertTriangle,
  Shield,
  Heart,
  FileText,
  Clock,
  UserPlus,
  Send,
  GitMerge,
  CopyX,
  ArrowUpRight,
  Printer,
  ChevronDown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const IncidentDetailsPanel = () => {
  const {
    selectedCase,
    isDetailsOpen,
    closeCaseDetails,
    responders,
    assignResponderToCase,
    updateCaseStatus,
    updateCasePriority,
    addCaseNote,
    matches,
    setSelectedMatchForVerify,
    setIsVerifyModalOpen,
    setCurrentView,
    t
  } = useCommand();

  const [newNote, setNewNote] = useState('');
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);

  if (!isDetailsOpen || !selectedCase) return null;

  // Find associated match if available
  const associatedMatch = matches.find(
    m => m.missingCaseId === selectedCase.id || m.foundCaseId === selectedCase.id
  );

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addCaseNote(selectedCase.id, newNote);
    setNewNote('');
  };

  const handleOpenVerifyModal = () => {
    if (associatedMatch) {
      setSelectedMatchForVerify(associatedMatch);
      closeCaseDetails();
      setIsVerifyModalOpen(true);
    } else {
      setCurrentView('matches');
      closeCaseDetails();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={closeCaseDetails}
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-[490] lg:hidden"
      />

      <div className="fixed inset-y-0 right-0 z-[500] w-full max-w-xl bg-white border-l border-[#E1E9E7] shadow-soft-lg flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Pinned Header */}
        <div className="modal-header-pinned p-4 border-b border-[#E1E9E7] bg-[#F4F7F6] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
              selectedCase.classification === 'MISSING'
                ? 'bg-[#F47C65]/15 text-[#F47C65] border border-[#F47C65]/30'
                : 'bg-[#D8F3EF] text-[#155E63] border border-[#155E63]/30'
            }`}>
              {selectedCase.classification}
            </span>
            <div>
              <h2 className="text-sm font-mono font-bold text-[#1D3033] tracking-wide">{selectedCase.id}</h2>
              <span className="text-[11px] text-[#687A7C] font-sans">Incident Dossier Record</span>
            </div>
          </div>

          <button
            onClick={closeCaseDetails}
            className="p-1.5 rounded-lg text-[#687A7C] hover:text-[#1D3033] hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Scrollable Content (modal-body-scroll) */}
        <div className="modal-body-scroll flex-1 p-4 sm:p-5 space-y-4 text-[#1D3033]">
          {/* Unverified Fatality Protocol Safety Banner */}
          {(selectedCase.medicalNotes?.toLowerCase().includes('deceased') || selectedCase.category?.toLowerCase().includes('casualty')) && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-start gap-3 text-rose-900 text-xs">
              <Shield className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold font-mono uppercase text-rose-800">
                  UNVERIFIED FATALITY PROTOCOL ACTIVE:
                </span>
                <p className="text-rose-700 text-[11px] leading-relaxed">
                  Public display of casualty confirmation is strictly masked until dual-confirmed by authorized medical examiners and law enforcement officers.
                </p>
              </div>
            </div>
          )}

          {/* Person Primary Card */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#F4F7F6] border border-[#E1E9E7]">
            <img
              src={selectedCase.photo}
              alt={selectedCase.fullName}
              className="w-18 h-18 rounded-xl object-cover border-2 border-[#155E63]/30 shadow-soft-xs flex-shrink-0"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'; }}
            />
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-[#1D3033] truncate">{selectedCase.fullName}</h3>
                {selectedCase.vulnerabilityScore && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D8F3EF] text-[#155E63] border border-[#B2E4DD] flex-shrink-0 ml-1">
                    Triage: {selectedCase.vulnerabilityScore}/100
                  </span>
                )}
              </div>
              <div className="text-xs text-[#687A7C] flex items-center gap-2">
                <span className="font-semibold">{selectedCase.age} Years Old</span>
                <span>•</span>
                <span>{selectedCase.gender}</span>
                <span>•</span>
                <span className="font-mono text-[#155E63] font-bold">PIN: {selectedCase.pin}</span>
              </div>
              <div className="text-xs text-[#687A7C] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#F47C65] flex-shrink-0" />
                <span className="truncate">{selectedCase.lastSeenLocation}</span>
              </div>
              <div className="text-[11px] text-[#687A7C] font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#687A7C]" />
                <span>Reported: {selectedCase.reportedAt}</span>
              </div>
            </div>
          </div>

          {/* Recommended Next Best Action Card */}
          <div className="p-3 bg-gradient-to-r from-[#D8F3EF]/60 to-white border border-[#B2E4DD] rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#155E63]">
              <AlertCircle className="w-3.5 h-3.5 text-[#155E63]" />
              <span>Recommended Next Best Action (Triage Engine)</span>
            </div>
            <p className="text-xs text-[#1D3033] leading-relaxed font-medium">
              {selectedCase.nextBestAction || (selectedCase.priority === 'URGENT' ? 'Dispatch nearest NDRF/SDRF squad for immediate on-site extraction and verification.' : 'Cross-reference camp check-ins and notify field welfare desk.')}
            </p>
          </div>

          {/* Quick Action Control Bar */}
          <div className="grid grid-cols-3 gap-2">
            {/* Status Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className="w-full py-2 px-2.5 rounded-lg bg-[#F4F7F6] border border-[#E1E9E7] hover:border-[#155E63]/40 text-left flex items-center justify-between text-xs cursor-pointer"
              >
                <div>
                  <span className="text-[10px] text-[#687A7C] block uppercase font-mono">Status</span>
                  <span className="font-bold text-[#155E63] truncate block">{selectedCase.status}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#687A7C]" />
              </button>
              {isStatusOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E1E9E7] rounded-xl shadow-soft-md py-1 z-20 text-xs">
                  {['REPORTED', 'UNDER_REVIEW', 'POTENTIAL_MATCH', 'AWAITING_VERIFICATION', 'REUNIFICATION_CONFIRMED', 'NEEDS_MORE_INFO', 'ESCALATED', 'CLOSED'].map(st => (
                    <button
                      key={st}
                      onClick={() => {
                        updateCaseStatus(selectedCase.id, st);
                        setIsStatusOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#F4F7F6] text-[#1D3033] text-xs font-medium cursor-pointer"
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Priority Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPriorityOpen(!isPriorityOpen)}
                className="w-full py-2 px-2.5 rounded-lg bg-[#F4F7F6] border border-[#E1E9E7] hover:border-[#155E63]/40 text-left flex items-center justify-between text-xs cursor-pointer"
              >
                <div>
                  <span className="text-[10px] text-[#687A7C] block uppercase font-mono">Priority</span>
                  <span className={`font-bold truncate block ${selectedCase.priority === 'URGENT' ? 'text-rose-600' : 'text-[#B7791F]'}`}>
                    {selectedCase.priority}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#687A7C]" />
              </button>
              {isPriorityOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E1E9E7] rounded-xl shadow-soft-md py-1 z-20 text-xs">
                  {['URGENT', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
                    <button
                      key={p}
                      onClick={() => {
                        updateCasePriority(selectedCase.id, p);
                        setIsPriorityOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#F4F7F6] text-[#1D3033] text-xs font-medium cursor-pointer"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Responder Assignment */}
            <div className="relative">
              <button
                onClick={() => setIsAssignOpen(!isAssignOpen)}
                className="w-full py-2 px-2.5 rounded-lg bg-[#F4F7F6] border border-[#E1E9E7] hover:border-[#155E63]/40 text-left flex items-center justify-between text-xs cursor-pointer"
              >
                <div>
                  <span className="text-[10px] text-[#687A7C] block uppercase font-mono">Assigned</span>
                  <span className="font-bold text-[#1D3033] truncate block max-w-[90px]">{selectedCase.assignedTo || 'Unassigned'}</span>
                </div>
                <UserPlus className="w-3.5 h-3.5 text-[#687A7C]" />
              </button>
              {isAssignOpen && (
                <div className="absolute top-full right-0 w-56 mt-1 bg-white border border-[#E1E9E7] rounded-xl shadow-soft-md py-1 z-20 text-xs">
                  <div className="px-3 py-1 text-[10px] font-mono text-[#687A7C] uppercase border-b border-[#E1E9E7]">Assign Responder</div>
                  {responders.map(resp => (
                    <button
                      key={resp.id}
                      onClick={() => {
                        assignResponderToCase(selectedCase.id, resp);
                        setIsAssignOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#F4F7F6] text-[#1D3033] text-xs truncate font-medium cursor-pointer"
                    >
                      {resp.name} ({resp.badge})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Potential Match Alert Card */}
          {associatedMatch ? (
            <div className="p-3.5 rounded-xl bg-[#D8F3EF]/40 border border-[#155E63]/30 shadow-soft-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#155E63] font-bold text-xs font-mono">
                  <GitMerge className="w-4 h-4 text-[#155E63]" />
                  <span>CANDIDATE SMART MATCH ({associatedMatch.overallScore}% MATCH)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D8F3EF] text-[#155E63] border border-[#155E63]/30">
                  {associatedMatch.confidenceTier}
                </span>
              </div>

              <p className="text-xs text-[#1D3033] leading-relaxed">
                Paired with record <span className="font-mono text-[#155E63] font-bold">{associatedMatch.missingCaseId === selectedCase.id ? associatedMatch.foundCaseId : associatedMatch.missingCaseId}</span>.
                Phonetic, appearance, and proximity parameters match.
              </p>

              <button
                onClick={handleOpenVerifyModal}
                className="w-full py-2 bg-[#155E63] hover:bg-[#123B3A] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-soft-sm cursor-pointer"
              >
                <span>Launch Dual-Responder Verification</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-[#F4F7F6] border border-[#E1E9E7] flex items-center justify-between text-xs text-[#687A7C]">
              <div className="flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-[#687A7C]" />
                <span>No confirmed smart match paired yet.</span>
              </div>
              <button
                onClick={() => { setCurrentView('matches'); closeCaseDetails(); }}
                className="text-[#155E63] font-bold hover:underline cursor-pointer"
              >
                Scan Workspace →
              </button>
            </div>
          )}

          {/* Physical Description & Medical Needs */}
          <div className="space-y-2.5 bg-[#F4F7F6] border border-[#E1E9E7] rounded-xl p-3.5 text-xs">
            <h4 className="font-bold text-[#1D3033] uppercase tracking-wider font-mono text-[11px] border-b border-[#E1E9E7] pb-1.5">
              Physical Identifiers & Clinical Profile
            </h4>

            <div className="space-y-2">
              <div>
                <span className="text-[#687A7C] font-semibold block text-[11px]">Clothing & Attire:</span>
                <p className="text-[#1D3033] mt-0.5">{selectedCase.clothing}</p>
              </div>
              <div>
                <span className="text-[#687A7C] font-semibold block text-[11px]">Distinctive Marks & Features:</span>
                <p className="text-[#1D3033] mt-0.5">{selectedCase.physicalMarks}</p>
              </div>
              <div>
                <span className="text-rose-700 font-semibold block text-[11px]">Medical Conditions & Triage Notes:</span>
                <p className="text-rose-900 mt-0.5 bg-rose-50 p-2 rounded border border-rose-200">{selectedCase.medicalNotes}</p>
              </div>
            </div>
          </div>

          {/* Reporter Provenance */}
          <div className="bg-[#F4F7F6] border border-[#E1E9E7] rounded-xl p-3.5 text-xs space-y-2">
            <h4 className="font-bold text-[#1D3033] uppercase tracking-wider font-mono text-[11px] border-b border-[#E1E9E7] pb-1.5">
              Reporter Provenance & Custody
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[#1D3033]">
              <div>
                <span className="text-[#687A7C] text-[10px] block font-mono">Reporter Name</span>
                <span className="font-semibold">{selectedCase.reporter.name}</span>
              </div>
              <div>
                <span className="text-[#687A7C] text-[10px] block font-mono">Relationship</span>
                <span className="font-semibold">{selectedCase.reporter.relation}</span>
              </div>
              <div>
                <span className="text-[#687A7C] text-[10px] block font-mono">Response Sector Base</span>
                <span className="font-semibold">{selectedCase.responseCentre}</span>
              </div>
              <div>
                <span className="text-[#687A7C] text-[10px] block font-mono">Contact Protection</span>
                <span className="text-[#24856A] font-mono font-bold">🔒 Protected Data</span>
              </div>
            </div>
          </div>

          {/* Internal Response Notes & Form */}
          <div className="bg-[#F4F7F6] border border-[#E1E9E7] rounded-xl p-3.5 text-xs space-y-2.5">
            <h4 className="font-bold text-[#1D3033] uppercase tracking-wider font-mono text-[11px] border-b border-[#E1E9E7] pb-1.5">
              Internal Operations Log
            </h4>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Add responder field note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 bg-white border border-[#E1E9E7] rounded-xl px-3 py-2 text-xs text-[#1D3033] placeholder-[#687A7C] focus:outline-none focus:border-[#155E63]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#155E63] hover:bg-[#123B3A] text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {selectedCase.notes && selectedCase.notes.map((n, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-white border border-[#E1E9E7]">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#687A7C]">
                    <span className="font-bold text-[#155E63]">{n.author}</span>
                    <span>{n.time}</span>
                  </div>
                  <p className="text-[#1D3033] mt-1 text-xs">{n.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-[#F4F7F6] border border-[#E1E9E7] rounded-xl p-3.5 text-xs space-y-2.5">
            <h4 className="font-bold text-[#1D3033] uppercase tracking-wider font-mono text-[11px] border-b border-[#E1E9E7] pb-1.5">
              Audit Timeline
            </h4>

            <div className="space-y-3 pl-2 border-l-2 border-[#155E63]/30">
              {selectedCase.timeline && selectedCase.timeline.map((tItem, i) => (
                <div key={i} className="relative pl-3">
                  <span className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full bg-[#155E63] border-2 border-white"></span>
                  <div className="text-[#1D3033] font-semibold text-xs">{tItem.title}</div>
                  <div className="text-[10px] text-[#687A7C] font-mono">{tItem.time} • by {tItem.by}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
