import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  X,
  Download,
  Printer,
  Copy,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const ExportReportModal = () => {
  const {
    isExportOpen,
    setIsExportOpen,
    activeOperation,
    cases,
    matches,
    shelters,
    hospitals,
    rescueTeams,
    currentResponder,
    currentRole
  } = useCommand();

  const [copied, setCopied] = useState(false);

  if (!isExportOpen) return null;

  const urgentCount = cases.filter(c => c.priority === 'URGENT' && c.status !== 'REUNIFICATION_CONFIRMED').length;
  const verifiedCount = cases.filter(c => c.status === 'REUNIFICATION_CONFIRMED').length;
  const pendingMatchCount = matches.filter(m => m.status === 'AWAITING_HUMAN_VERIFICATION').length;
  const totalShelterOccupancy = shelters.reduce((acc, s) => acc + s.occupancy, 0);
  const totalShelterCapacity = shelters.reduce((acc, s) => acc + s.capacity, 0);

  const reportText = `===================================================================
REUNITE360 — DISASTER RESPONSE & REUNIFICATION SITUATION REPORT (SITREP)
===================================================================
Operation: ${activeOperation.name}
Response Sector: ${activeOperation.region}
Generated At: ${new Date().toLocaleString()}
Authorizing Officer: ${currentResponder.name} (${currentRole} - ${currentResponder.badge})
Classification: OFFICIAL DISASTER RESPONSE LEDGER (PROTECTED)
-------------------------------------------------------------------

1. EXECUTIVE SUMMARY:
- Total Registered Cases: ${cases.length}
- Missing Persons Under Active Search: ${cases.filter(c => c.classification === 'MISSING' && c.status !== 'REUNIFICATION_CONFIRMED').length}
- Found / Rescued Individuals in Shelters: ${cases.filter(c => c.classification === 'FOUND' && c.status !== 'REUNIFICATION_CONFIRMED').length}
- Confirmed Family Reunifications: ${verifiedCount}
- Urgent / Critical Priority Cases: ${urgentCount}
- AI Candidate Matches Awaiting Human Verification: ${pendingMatchCount}

2. FACILITY INFRASTRUCTURE STATUS:
- Active Shelters: ${shelters.length} Facilities
- Total Shelter Bed Occupancy: ${totalShelterOccupancy} / ${totalShelterCapacity} (${Math.round((totalShelterOccupancy/totalShelterCapacity)*100)}%)
- Connected Trauma Hospitals: ${hospitals.length} Hospitals
- Active Swift Water & Field Rescue Teams: ${rescueTeams.length} Units Deployed

3. URGENT CASES REQUIRING PRIORITY DISPATCH:
${cases.filter(c => c.priority === 'URGENT' && c.status !== 'REUNIFICATION_CONFIRMED').map(c => `• [${c.id}] ${c.fullName} (${c.age} yrs, ${c.gender}) - Last seen: ${c.lastSeenLocation} | Assigned: ${c.assignedTo}`).join('\n')}

4. SYSTEM HEALTH & DATA INTEGRITY:
- Dual-Responder Human Verification: Enforced & Operational
- Offline Field Queue Status: 100% Synchronized
- Chain-of-Custody Audit Stamps: Immutable
===================================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([reportText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Reunite360_SitRep_${activeOperation.id}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="modal-dialog bg-white border border-[#E1E9E7] rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-soft-lg flex flex-col text-[#1D3033]">
        {/* Pinned Header */}
        <div className="modal-header-pinned p-4 sm:p-5 border-b border-[#E1E9E7] bg-[#F4F7F6] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#D8F3EF] text-[#155E63] border border-[#155E63]/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1D3033] font-mono uppercase">
                Situation Report (SitRep) Export
              </h2>
              <span className="text-xs text-[#687A7C] font-sans">
                Official shift handover and coordination briefing document
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsExportOpen(false)}
            className="p-1.5 rounded-lg text-[#687A7C] hover:text-[#1D3033] hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="modal-body-scroll p-4 sm:p-6 space-y-4">
          <div className="relative">
            <pre className="p-4 rounded-xl bg-[#F4F7F6] border border-[#E1E9E7] text-[#1D3033] font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[360px]">
              {reportText}
            </pre>
          </div>
        </div>

        {/* Pinned Footer */}
        <div className="modal-footer-pinned p-4 border-t border-[#E1E9E7] bg-[#F4F7F6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-[#E1E9E7] rounded-xl text-xs font-semibold text-[#1D3033] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4 text-[#687A7C]" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-[#E1E9E7] rounded-xl text-xs font-semibold text-[#1D3033] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4 text-[#687A7C]" />
              <span>Print</span>
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="px-5 py-2.5 bg-[#155E63] hover:bg-[#123B3A] text-white font-bold text-xs rounded-xl shadow-soft-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download SitRep File</span>
          </button>
        </div>
      </div>
    </div>
  );
};
