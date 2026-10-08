import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  History,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Clock,
  User,
  FileSpreadsheet
} from 'lucide-react';

export const AuditHistory = () => {
  const { auditLogs, t } = useCommand();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const matchesSearch =
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.id.toLowerCase().includes(search.toLowerCase());

    return matchesAction && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['Audit ID', 'Timestamp', 'Actor', 'Action', 'Target', 'Details'];
    const rows = filteredLogs.map(l => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.actor}"`,
      `"${l.action}"`,
      `"${l.target}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Reunite360_Audit_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#24856A]">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#1D3033] uppercase tracking-wider font-mono">
              {t('auditTitle')}
            </h1>
            <p className="text-xs text-[#687A7C] font-sans">
              {t('auditSubtitle')}
            </p>
          </div>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F4F7F6] hover:bg-slate-200 border border-[#E1E9E7] text-[#1D3033] text-xs font-semibold transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#24856A]" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#E1E9E7] rounded-xl p-3.5 shadow-soft-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687A7C]" />
          <input
            type="text"
            placeholder="Search audit trail by actor, case, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F4F7F6] border border-[#E1E9E7] rounded-lg pl-9 pr-3 py-2 text-xs text-[#1D3033] placeholder-[#687A7C] focus:outline-none focus:border-[#155E63]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#687A7C] font-medium">Action Type:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-[#F4F7F6] border border-[#E1E9E7] rounded-lg text-xs px-3 py-2 text-[#1D3033] font-medium focus:outline-none focus:border-[#155E63]"
          >
            <option value="ALL">All Actions</option>
            <option value="HUMAN_VERIFICATION_STAMP">Human Verification</option>
            <option value="STATUS_CHANGED">Status Change</option>
            <option value="CASE_REGISTERED">Case Registered</option>
            <option value="SMART_MATCH_GENERATED">Smart Match</option>
            <option value="DUPLICATES_MERGED">Duplicates Merged</option>
            <option value="OFFLINE_SYNC_SUCCESS">Offline Sync</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-[#E1E9E7] rounded-xl p-4 shadow-soft-sm overflow-x-auto">
        <table className="w-full text-left text-xs text-[#1D3033]">
          <thead className="bg-[#F4F7F6] text-[#687A7C] uppercase font-mono text-[10px] border-y border-[#E1E9E7]">
            <tr>
              <th className="py-3 px-3.5">Audit ID</th>
              <th className="py-3 px-3.5">Timestamp</th>
              <th className="py-3 px-3.5">Officer / Actor</th>
              <th className="py-3 px-3.5">Action Type</th>
              <th className="py-3 px-3.5">Target Entity</th>
              <th className="py-3 px-3.5">Operation Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E1E9E7] font-sans">
            {filteredLogs.map(l => (
              <tr key={l.id} className="hover:bg-[#F4F7F6]/50 transition-colors">
                <td className="py-3.5 px-3.5 font-mono font-bold text-[#155E63] text-[11px]">{l.id}</td>
                <td className="py-3.5 px-3.5 font-mono text-[11px] text-[#687A7C]">{l.timestamp}</td>
                <td className="py-3.5 px-3.5 font-semibold text-[#1D3033]">{l.actor}</td>
                <td className="py-3.5 px-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    l.action.includes('VERIFICATION') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                    l.action.includes('REGISTERED') ? 'bg-[#D8F3EF] text-[#155E63]' :
                    l.action.includes('MERGED') ? 'bg-purple-50 text-purple-800' : 'bg-slate-100 text-[#687A7C]'
                  }`}>
                    {l.action}
                  </span>
                </td>
                <td className="py-3.5 px-3.5 font-mono text-[#F47C65] font-bold">{l.target}</td>
                <td className="py-3.5 px-3.5 text-[#687A7C] max-w-md">{l.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
