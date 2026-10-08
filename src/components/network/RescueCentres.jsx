import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  Building2,
  Crosshair,
  Radio,
  PhoneCall,
  Bed,
  Users,
  Shield,
  Activity,
  MapPin,
  Clock,
  ExternalLink,
  Plus
} from 'lucide-react';

export const RescueCentres = () => {
  const { shelters, hospitals, rescueTeams, t } = useCommand();
  const [activeTab, setActiveTab] = useState('SHELTERS'); // SHELTERS, HOSPITALS, TEAMS
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#D8F3EF] border border-[#155E63]/20 text-[#155E63]">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#1D3033] uppercase tracking-wider font-mono">
              {t('rescueCentresTitle')}
            </h1>
            <p className="text-xs text-[#687A7C] font-sans">
              {t('rescueCentresSubtitle')}
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-[#F4F7F6] rounded-lg p-0.5 border border-[#E1E9E7] text-xs">
          <button
            onClick={() => setActiveTab('SHELTERS')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'SHELTERS' ? 'bg-[#155E63] text-white shadow-xs font-bold' : 'text-[#687A7C] hover:text-[#1D3033]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t('sheltersTab')} ({shelters.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('HOSPITALS')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'HOSPITALS' ? 'bg-[#C83D4D] text-white shadow-xs font-bold' : 'text-[#687A7C] hover:text-[#1D3033]'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{t('hospitalsTab')} ({hospitals.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('TEAMS')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'TEAMS' ? 'bg-purple-700 text-white shadow-xs font-bold' : 'text-[#687A7C] hover:text-[#1D3033]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{t('teamsTab')} ({rescueTeams.length})</span>
          </button>
        </div>
      </div>

      {/* Content Grid */}
      {activeTab === 'SHELTERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shelters.map(s => {
            const occupancyPercent = Math.round((s.occupancy / s.capacity) * 100);
            const isNearCapacity = occupancyPercent >= 85;

            return (
              <div
                key={s.id}
                className="bg-white border border-[#E1E9E7] hover:border-[#155E63]/40 rounded-xl p-5 shadow-soft-sm space-y-4 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-[#155E63] font-bold">{s.id}</span>
                    <h3 className="text-sm font-bold text-[#1D3033] mt-0.5">{s.name}</h3>
                    <div className="text-xs text-[#687A7C] flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#F47C65]" />
                      <span>{s.location}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    isNearCapacity ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {s.status}
                  </span>
                </div>

                {/* Capacity Gauge */}
                <div className="space-y-1.5 bg-[#F4F7F6] p-3 rounded-lg border border-[#E1E9E7]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#687A7C]">Bed Occupancy:</span>
                    <span className="font-mono font-bold text-[#1D3033]">{s.occupancy} / {s.capacity} ({occupancyPercent}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E1E9E7] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isNearCapacity ? 'bg-[#C83D4D]' : 'bg-[#155E63]'}`}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                </div>

                {/* Facilities Badges */}
                <div className="flex items-center gap-2 flex-wrap text-[11px]">
                  {s.hasMedicalPost && (
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                      + Medical Unit
                    </span>
                  )}
                  {s.hasChildCare && (
                    <span className="px-2 py-0.5 rounded bg-[#D8F3EF] text-[#155E63] border border-[#155E63]/20 font-semibold">
                      ✓ Child Nursery
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-[#687A7C] ml-auto">
                    Synced {s.lastSynced}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#E1E9E7] flex items-center justify-between text-xs text-[#1D3033]">
                  <div className="flex items-center gap-1.5 text-[#687A7C]">
                    <PhoneCall className="w-3.5 h-3.5 text-[#155E63]" />
                    <span>{s.contactPerson}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'HOSPITALS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitals.map(h => (
            <div
              key={h.id}
              className="bg-white border border-[#E1E9E7] hover:border-rose-300 rounded-xl p-5 shadow-soft-sm space-y-4 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] text-rose-700 font-bold">{h.id}</span>
                  <h3 className="text-sm font-bold text-[#1D3033] mt-0.5">{h.name}</h3>
                  <div className="text-xs text-[#687A7C] flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{h.location}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  {h.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#F4F7F6] p-3 rounded-lg border border-[#E1E9E7] text-xs">
                <div>
                  <span className="text-[#687A7C] text-[10px] block font-mono">Available Trauma Beds</span>
                  <span className="text-lg font-bold font-mono text-[#1D3033]">{h.availableBeds} / {h.traumaBeds}</span>
                </div>
                <div>
                  <span className="text-[#687A7C] text-[10px] block font-mono">ICU Vacancy</span>
                  <span className="text-lg font-bold font-mono text-emerald-700">{h.icuAvailable} Beds</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <span>Unidentified Trauma Patients:</span>
                <span className="font-mono font-bold">{h.unidentifiedPatients} Awaiting Match</span>
              </div>

              <div className="pt-3 border-t border-[#E1E9E7] text-xs text-[#1D3033] flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                <span className="text-[#687A7C]">{h.contactPerson}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'TEAMS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rescueTeams.map(rt => (
            <div
              key={rt.id}
              className="bg-white border border-[#E1E9E7] hover:border-purple-300 rounded-xl p-5 shadow-soft-sm space-y-4 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] text-purple-700 font-bold">{rt.id}</span>
                  <h3 className="text-sm font-bold text-[#1D3033] mt-0.5">{rt.name}</h3>
                  <div className="text-xs text-[#687A7C] mt-1">
                    Sector: <span className="text-[#1D3033] font-semibold">{rt.assignedSector}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  {rt.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs bg-[#F4F7F6] p-3 rounded-lg border border-[#E1E9E7]">
                <div className="flex items-center justify-between">
                  <span className="text-[#687A7C]">Squad Leader:</span>
                  <span className="font-semibold text-[#1D3033]">{rt.leader}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#687A7C]">Personnel Strength:</span>
                  <span className="font-mono font-bold text-[#155E63]">{rt.members} Operators</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#687A7C]">Radio Channel:</span>
                  <span className="font-mono font-bold text-emerald-700">{rt.radioChannel}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#687A7C] block uppercase">Equipment Deployed:</span>
                <div className="flex flex-wrap gap-1.5">
                  {rt.equipment.map((eq, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E1E9E7] text-[#1D3033] font-mono">
                      • {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
