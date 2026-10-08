import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  UserX,
  PlusCircle,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  MapPin,
  Clock,
  HeartHandshake
} from 'lucide-react';

export const MissingPersonsView = () => {
  const { cases, openCaseDetails, setIsRegisterOpen, t } = useCommand();
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const missingCases = cases.filter(c => c.classification === 'MISSING');

  const filtered = missingCases.filter(c => {
    const matchPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;
    const matchSearch =
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.lastSeenLocation.toLowerCase().includes(search.toLowerCase());
    return matchPriority && matchSearch;
  });

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-coral-50 border border-[#F47C65]/30 text-[#F47C65]">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#1D3033] uppercase tracking-wider font-mono">
              {t('missingRegistry')}
            </h1>
            <p className="text-xs text-[#687A7C] font-sans">
              {t('missingSubtitle')}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="px-4 py-2 bg-[#F47C65] hover:bg-[#e06b54] text-white font-bold text-xs rounded-xl shadow-soft-sm flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('registerMissing')}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#E1E9E7] rounded-xl p-3.5 shadow-soft-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687A7C]" />
          <input
            type="text"
            placeholder={t('searchMissing')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F4F7F6] border border-[#E1E9E7] rounded-lg pl-9 pr-3 py-2 text-xs text-[#1D3033] placeholder-[#687A7C] focus:outline-none focus:border-[#155E63]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#687A7C] font-medium">{t('priority')}:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#F4F7F6] border border-[#E1E9E7] rounded-lg text-xs px-3 py-2 text-[#1D3033] font-medium focus:outline-none focus:border-[#155E63] cursor-pointer"
          >
            <option value="ALL">{t('allPriorities')}</option>
            <option value="URGENT">{t('urgentOnly')}</option>
            <option value="HIGH">{t('highPriority')}</option>
            <option value="MEDIUM">{t('mediumPriority')}</option>
          </select>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div
            key={c.id}
            onClick={() => openCaseDetails(c)}
            className="bg-white border border-[#E1E9E7] hover:border-[#F47C65]/60 rounded-xl p-5 shadow-soft-sm hover:shadow-soft-md space-y-4 cursor-pointer transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={c.photo}
                  alt={c.fullName}
                  className="w-12 h-12 rounded-xl object-cover border border-[#F47C65]/30"
                />
                <div>
                  <span className="font-mono text-[10px] text-[#F47C65] font-bold">{c.id}</span>
                  <h3 className="text-sm font-bold text-[#1D3033] group-hover:text-[#F47C65] transition-colors">{c.fullName}</h3>
                  <span className="text-xs text-[#687A7C]">{c.age} yrs • {c.gender}</span>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                c.priority === 'URGENT' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-[#687A7C]'
              }`}>
                {c.priority}
              </span>
            </div>

            <div className="text-xs space-y-1 bg-[#F4F7F6] p-3 rounded-lg border border-[#E1E9E7]">
              <div className="text-[#687A7C] truncate">📍 {t('lastSeenAt')}: {c.lastSeenLocation}</div>
              <div className="text-[#1D3033] line-clamp-1"><span className="text-[#687A7C]">{t('attire')}: </span>{c.clothing}</div>
            </div>

            <div className="pt-2 border-t border-[#E1E9E7] flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono text-[#687A7C]">{t('officer')}: {c.assignedTo || t('unassigned')}</span>
              <span className="text-[#155E63] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>{t('viewDetails')}</span>
                <Eye className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
