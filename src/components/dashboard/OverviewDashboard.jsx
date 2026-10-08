import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import { MetricCard } from './MetricCard';
import {
  Users,
  UserX,
  GitMerge,
  HeartHandshake,
  AlertTriangle,
  Building2,
  Search,
  ArrowRight,
  ShieldCheck,
  Radio,
  Clock,
  CheckCircle2,
  Eye,
  AlertCircle,
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';

export const OverviewDashboard = () => {
  const {
    cases,
    matches,
    shelters,
    hospitals,
    rescueTeams,
    offlineQueue,
    notifications,
    setCurrentView,
    openCaseDetails,
    t
  } = useCommand();

  const [tableFilter, setTableFilter] = useState('ALL'); // ALL, MISSING, FOUND, URGENT
  const [tableSearch, setTableSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Metric Computations
  const totalCases = cases.length;
  const unmatchedCases = cases.filter(c => !c.potentialMatchId && c.status !== 'REUNIFICATION_CONFIRMED' && c.status !== 'CLOSED').length;
  const pendingMatches = matches.filter(m => m.status === 'AWAITING_HUMAN_VERIFICATION').length;
  const confirmedReunions = cases.filter(c => c.status === 'REUNIFICATION_CONFIRMED').length;
  const urgentCases = cases.filter(c => c.priority === 'URGENT' && c.status !== 'REUNIFICATION_CONFIRMED').length;
  const totalRescueNodes = shelters.length + hospitals.length;

  // Operational Priorities items
  const priorities = [
    {
      id: 'p1',
      title: t('urgentNeedReview'),
      count: urgentCases,
      severity: 'CRITICAL',
      color: 'border-rose-200 bg-rose-50/70 text-[#C83D4D]',
      badgeColor: 'bg-[#C83D4D] text-white',
      action: () => setCurrentView('coordination')
    },
    {
      id: 'p2',
      title: t('matchesAwaitingVerification'),
      count: pendingMatches,
      severity: 'HIGH_PRIORITY',
      color: 'border-teal-200 bg-[#D8F3EF]/50 text-[#155E63]',
      badgeColor: 'bg-[#155E63] text-white',
      action: () => setCurrentView('verification')
    },
    {
      id: 'p3',
      title: t('awaitingMoreInfo'),
      count: cases.filter(c => c.status === 'NEEDS_MORE_INFO').length,
      severity: 'ACTION_REQUIRED',
      color: 'border-amber-200 bg-amber-50/70 text-[#B7791F]',
      badgeColor: 'bg-[#B7791F] text-white',
      action: () => setCurrentView('coordination')
    },
    {
      id: 'p4',
      title: t('unassignedCases'),
      count: cases.filter(c => c.assignedTo === 'Unassigned' || !c.assignedTo).length,
      severity: 'COORDINATION',
      color: 'border-slate-200 bg-slate-50 text-[#1D3033]',
      badgeColor: 'bg-slate-700 text-white',
      action: () => setCurrentView('coordination')
    },
    {
      id: 'p5',
      title: t('offlineSyncPending'),
      count: offlineQueue.length,
      severity: 'CACHE_SYNC',
      color: 'border-sky-200 bg-sky-50 text-[#397BB5]',
      badgeColor: 'bg-[#397BB5] text-white',
      action: () => setCurrentView('audit')
    }
  ];

  // Filter Table Data
  const filteredCases = cases.filter(c => {
    const matchesFilter =
      tableFilter === 'ALL' ||
      (tableFilter === 'MISSING' && c.classification === 'MISSING') ||
      (tableFilter === 'FOUND' && c.classification === 'FOUND') ||
      (tableFilter === 'URGENT' && c.priority === 'URGENT');

    const matchesSearch =
      c.id.toLowerCase().includes(tableSearch.toLowerCase()) ||
      c.fullName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      c.lastSeenLocation.toLowerCase().includes(tableSearch.toLowerCase()) ||
      c.responseCentre.toLowerCase().includes(tableSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage) || 1;
  const paginatedCases = filteredCases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'REUNIFICATION_CONFIRMED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-[#24856A] border border-emerald-200">{t('statusReunited')}</span>;
      case 'AWAITING_VERIFICATION':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-[#B7791F] border border-amber-200">{t('statusAwaitingVerify')}</span>;
      case 'POTENTIAL_MATCH':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-100 text-[#155E63] border border-teal-200">{t('statusPotentialMatch')}</span>;
      case 'NEEDS_MORE_INFO':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-orange-100 text-[#D43C20] border border-orange-200">{t('statusNeedsInfo')}</span>;
      case 'ESCALATED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-[#C83D4D] border border-rose-200">{t('statusEscalated')}</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-[#397BB5] border border-sky-200">{t('statusUnderReview')}</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">{t('statusReported')}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT':
      case 'CRITICAL':
        return <span className="text-[10px] font-bold text-[#C83D4D] font-mono flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#C83D4D] animate-ping"></span>{t('priorityUrgent')}</span>;
      case 'HIGH':
        return <span className="text-[10px] font-semibold text-[#B7791F] font-mono">{t('priorityHigh')}</span>;
      default:
        return <span className="text-[10px] text-[#687A7C] font-mono">{t('priorityMedium')}</span>;
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* 1. TOP STRATEGIC KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          title={t('totalCases')}
          value={totalCases}
          subtitle={t('totalCasesSub')}
          icon={Users}
          variant="teal"
          onClick={() => setCurrentView('coordination')}
        />
        <MetricCard
          title={t('unmatchedCases')}
          value={unmatchedCases}
          subtitle={t('unmatchedCasesSub')}
          icon={UserX}
          variant="coral"
          onClick={() => setCurrentView('missing')}
        />
        <MetricCard
          title={t('potentialMatches')}
          value={pendingMatches}
          subtitle={t('potentialMatchesSub')}
          icon={GitMerge}
          variant="amber"
          trend="+2 Pending"
          trendPositive={true}
          onClick={() => setCurrentView('matches')}
        />
        <MetricCard
          title={t('confirmedReunions')}
          value={confirmedReunions}
          subtitle={t('confirmedReunionsSub')}
          icon={HeartHandshake}
          variant="green"
          trend="Verified"
          trendPositive={true}
          onClick={() => setCurrentView('verification')}
        />
        <MetricCard
          title={t('urgentCases')}
          value={urgentCases}
          subtitle={t('urgentCasesSub')}
          icon={AlertTriangle}
          variant="rose"
          onClick={() => setCurrentView('coordination')}
        />
        <MetricCard
          title={t('connectedCentres')}
          value={totalRescueNodes}
          subtitle={t('connectedCentresSub')}
          icon={Building2}
          variant="blue"
          onClick={() => setCurrentView('shelters')}
        />
      </div>

      {/* 2. OPERATIONAL PRIORITIES & RESPONSE NETWORK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Operational Action Priorities (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E1E9E7] rounded-2xl p-4 sm:p-5 shadow-soft">
          <div className="flex items-center justify-between pb-3 border-b border-[#E1E9E7]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#D8F3EF] text-[#155E63]">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#1D3033] font-sans">
                  {t('operationalPriorities')}
                </h2>
                <p className="text-[11px] text-[#687A7C]">Real-time responder action triggers & follow-up queues</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#155E63] font-bold bg-[#D8F3EF] px-2.5 py-0.5 rounded-full border border-[#B2E4DD]">
              ACTIVE QUEUE
            </span>
          </div>

          <div className="mt-3.5 space-y-2">
            {priorities.map((p) => (
              <div
                key={p.id}
                className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border ${p.color} transition-all hover:shadow-xs`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold flex-shrink-0 ${p.badgeColor}`}>
                    {p.count}
                  </span>
                  <span className="text-xs font-semibold truncate">{p.title}</span>
                </div>

                <button
                  onClick={p.action}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#155E63] hover:text-white bg-white hover:bg-[#155E63] px-2.5 py-1 rounded-lg border border-[#E1E9E7] transition-all shadow-xs cursor-pointer flex-shrink-0 ml-2"
                >
                  <span>{t('openQueue')}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Response Network Status (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E1E9E7] rounded-2xl p-4 sm:p-5 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E9E7]">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#155E63] animate-pulse" />
                <h2 className="text-sm font-bold text-[#1D3033] font-sans">
                  {t('responseNetwork')}
                </h2>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-[#24856A]"></span>
            </div>

            <div className="mt-3.5 space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F7F6] border border-[#E1E9E7]">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#155E63]" />
                  <span className="text-xs font-medium text-[#1D3033]">{t('activeShelters')}</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#155E63]">{shelters.length} Shelters</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F7F6] border border-[#E1E9E7]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C83D4D]" />
                  <span className="text-xs font-medium text-[#1D3033]">{t('connectedHospitals')}</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#C83D4D]">{hospitals.length} Hospitals</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F7F6] border border-[#E1E9E7]">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#397BB5]" />
                  <span className="text-xs font-medium text-[#1D3033]">{t('activeTeams')}</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#397BB5]">{rescueTeams.length} Rescue Teams</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F7F6] border border-[#E1E9E7]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#24856A]" />
                  <span className="text-xs font-medium text-[#1D3033]">{t('syncStatus')}</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#24856A]">100% Operational</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('map')}
            className="w-full mt-3.5 py-2.5 px-3 bg-[#155E63] hover:bg-[#123B3A] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-teal-glow cursor-pointer"
          >
            <span>{t('navMap')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. RECENT CASE ACTIVITY TABLE & COORDINATION INBOX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Case Activity Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E1E9E7] rounded-2xl p-4 sm:p-5 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E1E9E7]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#155E63]" />
              <h2 className="text-sm font-bold text-[#1D3033] font-sans">
                {t('recentActivity')}
              </h2>
            </div>

            {/* Filter and Search */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-[#F4F7F6] rounded-xl p-0.5 border border-[#E1E9E7] text-xs">
                {['ALL', 'MISSING', 'FOUND', 'URGENT'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => { setTableFilter(filter); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                      tableFilter === filter ? 'bg-[#155E63] text-white shadow-xs' : 'text-[#687A7C] hover:text-[#1D3033]'
                    }`}
                  >
                    {filter === 'ALL' ? t('allCases') : filter === 'MISSING' ? t('missing') : filter === 'FOUND' ? t('found') : t('priorityUrgent')}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#687A7C]" />
                <input
                  type="text"
                  placeholder="Filter cases..."
                  value={tableSearch}
                  onChange={(e) => { setTableSearch(e.target.value); setCurrentPage(1); }}
                  className="bg-[#F4F7F6] border border-[#E1E9E7] focus:border-[#155E63] focus:bg-white rounded-xl text-xs pl-8 pr-2.5 py-1 text-[#1D3033] placeholder-[#687A7C] focus:outline-none w-36 sm:w-44 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs text-[#1D3033]">
              <thead className="bg-[#F4F7F6] text-[#687A7C] uppercase font-mono text-[10px] border-y border-[#E1E9E7]">
                <tr>
                  <th className="py-2.5 px-3">{t('caseId')}</th>
                  <th className="py-2.5 px-3">{t('personName')}</th>
                  <th className="py-2.5 px-3">{t('classification')}</th>
                  <th className="py-2.5 px-3">{t('location')}</th>
                  <th className="py-2.5 px-3">{t('priority')}</th>
                  <th className="py-2.5 px-3">{t('status')}</th>
                  <th className="py-2.5 px-3 text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E9E7]">
                {paginatedCases.length > 0 ? (
                  paginatedCases.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-[#F4F7F6]/80 transition-colors cursor-pointer group"
                      onClick={() => openCaseDetails(c)}
                    >
                      <td className="py-2.5 px-3 font-mono font-semibold text-[#155E63]">{c.id}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={c.photo}
                            alt={c.fullName}
                            className="w-7 h-7 rounded-full object-cover border border-[#E1E9E7]"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60'; }}
                          />
                          <div>
                            <span className="font-semibold text-[#1D3033] block">{c.fullName}</span>
                            <span className="text-[10px] text-[#687A7C]">{c.age} yrs • {c.gender}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.classification === 'MISSING' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-[#155E63]'
                        }`}>
                          {c.classification === 'MISSING' ? t('missing') : t('found')}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#687A7C] max-w-[150px] truncate">{c.lastSeenLocation}</td>
                      <td className="py-2.5 px-3">{getPriorityBadge(c.priority)}</td>
                      <td className="py-2.5 px-3">{getStatusBadge(c.status)}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openCaseDetails(c);
                          }}
                          className="p-1.5 rounded-lg bg-white hover:bg-[#155E63] text-[#687A7C] hover:text-white transition-colors border border-[#E1E9E7] shadow-xs cursor-pointer"
                          title={t('viewDetails')}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-[#687A7C]">
                      No cases match current filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E1E9E7] text-xs text-[#687A7C]">
            <span>
              {t('showing')} {(currentPage - 1) * itemsPerPage + 1} {t('of')} {Math.min(currentPage * itemsPerPage, filteredCases.length)} {t('entries')} ({filteredCases.length} {t('of')})
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1 rounded-lg bg-white text-[#1D3033] disabled:opacity-40 disabled:cursor-not-allowed border border-[#E1E9E7] hover:bg-[#F4F7F6] font-semibold cursor-pointer"
              >
                {t('prevPage')}
              </button>
              <span className="font-mono text-[#1D3033] font-semibold">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-1 rounded-lg bg-white text-[#1D3033] disabled:opacity-40 disabled:cursor-not-allowed border border-[#E1E9E7] hover:bg-[#F4F7F6] font-semibold cursor-pointer"
              >
                {t('nextPage')}
              </button>
            </div>
          </div>
        </div>

        {/* Coordination Inbox Feed (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E1E9E7] rounded-2xl p-4 sm:p-5 shadow-soft">
          <div className="flex items-center justify-between pb-3 border-b border-[#E1E9E7]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#155E63]" />
              <h2 className="text-sm font-bold text-[#1D3033] font-sans">
                {t('notifications')}
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#B7791F] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-semibold">
              Live Feed
            </span>
          </div>

          <div className="mt-3.5 space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => { if (n.link) setCurrentView(n.link); }}
                className="p-3 rounded-xl bg-[#F4F7F6] hover:bg-[#D8F3EF]/40 border border-[#E1E9E7] cursor-pointer transition-all hover:border-[#155E63]/40 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1D3033] flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${n.type === 'URGENT' ? 'bg-[#C83D4D] animate-ping' : n.type === 'MATCH' ? 'bg-[#155E63]' : 'bg-[#24856A]'}`}></span>
                    {n.title}
                  </span>
                  <span className="text-[10px] text-[#687A7C] font-mono">{n.time}</span>
                </div>
                <p className="text-xs text-[#687A7C] mt-1.5 leading-relaxed">{n.message}</p>
                <div className="mt-2 flex items-center justify-end text-[11px] text-[#155E63] font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Take Action →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
