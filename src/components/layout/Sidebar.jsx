import React from 'react';
import { useCommand, ROLE_PERMISSIONS } from '../../context/CommandContext';
import {
  LayoutDashboard,
  MapPin,
  UserX,
  UserCheck,
  GitMerge,
  FileCheck2,
  Users2,
  Building2,
  Radio,
  HeartHandshake,
  BarChart3,
  CopyX,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  LifeBuoy,
  ShieldCheck
} from 'lucide-react';

export const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { currentView, setCurrentView, cases, matches, currentRole, currentResponder, t } = useCommand();

  const permittedViews = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS['Incident Commander'];

  // Badge calculations
  const pendingMatchesCount = matches.filter(m => m.status === 'AWAITING_HUMAN_VERIFICATION').length;
  const urgentCount = cases.filter(c => c.priority === 'URGENT' && c.status !== 'REUNIFICATION_CONFIRMED' && c.status !== 'CLOSED').length;
  const unassignedCount = cases.filter(c => c.assignedTo === 'Unassigned' || !c.assignedTo).length;

  const rawNavGroups = [
    {
      label: t('commandCentre'),
      items: [
        { id: 'overview', label: t('navOverview'), icon: LayoutDashboard },
        { id: 'map', label: t('navMap'), icon: MapPin, highlight: true },
      ]
    },
    {
      label: t('caseRegistry') || "CASE REGISTRY & AI",
      items: [
        { id: 'missing', label: t('navMissing'), icon: UserX, badge: cases.filter(c => c.classification === 'MISSING' && c.status !== 'REUNIFICATION_CONFIRMED').length },
        { id: 'found', label: t('navFound'), icon: UserCheck, badge: cases.filter(c => c.classification === 'FOUND' && c.status !== 'REUNIFICATION_CONFIRMED').length },
        { id: 'matches', label: t('navMatches'), icon: GitMerge, badge: pendingMatchesCount > 0 ? pendingMatchesCount : null, badgeColor: 'bg-teal-100 text-[#155E63] border-teal-200' },
        { id: 'verification', label: t('navVerification'), icon: FileCheck2, badge: pendingMatchesCount > 0 ? `${pendingMatchesCount} Action` : null, badgeColor: 'bg-amber-100 text-amber-900 border-amber-200' },
      ]
    },
    {
      label: t('fieldRelief') || "FIELD & RELIEF NETWORK",
      items: [
        { id: 'coordination', label: t('navCoordination'), icon: Users2, badge: unassignedCount > 0 ? `${unassignedCount}` : null, badgeColor: 'bg-rose-100 text-[#C83D4D] border-rose-200' },
        { id: 'shelters', label: t('navCentres'), icon: Building2 },
        { id: 'teams', label: t('navTeams'), icon: Radio },
        { id: 'family', label: t('navFamily'), icon: HeartHandshake },
      ]
    },
    {
      label: t('intelligence'),
      items: [
        { id: 'analytics', label: t('navAnalytics'), icon: BarChart3 },
        { id: 'duplicates', label: t('navDuplicates'), icon: CopyX },
        { id: 'audit', label: t('navAudit'), icon: History },
        { id: 'settings', label: t('navSettings'), icon: Settings },
      ]
    }
  ];

  // Filter nav groups by permitted views
  const navGroups = rawNavGroups
    .map(g => ({
      ...g,
      items: g.items.filter(item => permittedViews.includes(item.id))
    }))
    .filter(g => g.items.length > 0);

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-[#E1E9E7] shadow-soft transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#E1E9E7] bg-white flex-shrink-0">
        <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => setCurrentView('overview')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#155E63] to-[#123B3A] text-white shadow-teal-glow flex-shrink-0">
            <LifeBuoy className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F47C65] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F47C65]"></span>
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-[#1D3033] font-sans flex items-center gap-1">
                REUNITE<span className="text-[#155E63] font-extrabold">360</span>
              </span>
              <span className="text-[10px] text-[#687A7C] font-mono tracking-wider uppercase font-semibold">
                CMD NET • V2.4
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-[#687A7C] hover:text-[#155E63] hover:bg-[#F4F7F6] transition-colors border border-transparent hover:border-[#E1E9E7] cursor-pointer"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Badge Pill */}
      {!isCollapsed && (
        <div className="px-3 pt-3 flex-shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-[#F4F7F6] border border-[#E1E9E7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#155E63]" />
              <span className="text-[11px] font-bold text-[#1D3033] truncate max-w-[130px]">{currentRole}</span>
            </div>
            <span className="text-[9px] font-mono font-bold bg-[#D8F3EF] text-[#155E63] px-1.5 py-0.2 rounded border border-[#B2E4DD]">
              ACTIVE
            </span>
          </div>
        </div>
      )}

      {/* Urgent Alert Ribbon */}
      {!isCollapsed && urgentCount > 0 && permittedViews.includes('coordination') && (
        <div className="mx-3 mt-2 px-3 py-2 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between shadow-xs flex-shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#C83D4D]">
            <AlertTriangle className="w-4 h-4 text-[#C83D4D] animate-pulse flex-shrink-0" />
            <span className="truncate font-sans">{urgentCount} Urgent Cases</span>
          </div>
          <button
            onClick={() => { setCurrentView('coordination'); }}
            className="text-[10px] uppercase font-bold text-white hover:bg-rose-700 bg-[#C83D4D] px-2 py-0.5 rounded-md transition-colors shadow-xs cursor-pointer"
          >
            Review
          </button>
        </div>
      )}

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3.5">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-bold text-[#687A7C] uppercase tracking-wider font-mono">
                {group.label}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    if (window.innerWidth < 768) setIsMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer
                    ${isActive 
                      ? 'bg-[#D8F3EF] text-[#155E63] font-bold shadow-xs border border-[#B2E4DD]' 
                      : 'text-[#687A7C] hover:text-[#1D3033] hover:bg-[#F4F7F6] border border-transparent'
                    }
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-[#155E63]' : 'text-[#687A7C] group-hover:text-[#1D3033]'}`} />
                  
                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between text-left truncate">
                      <span className="truncate">{item.label}</span>
                      {item.badge !== undefined && item.badge !== null && (
                        <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-bold ${item.badgeColor || 'bg-slate-100 text-[#687A7C]'}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {isCollapsed && item.badge && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F47C65]"></span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Responder Profile Footer */}
      <div className="p-3 border-t border-[#E1E9E7] bg-[#F4F7F6]/60 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#155E63] text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
            {currentResponder.name.charAt(0)}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs text-[#1D3033] truncate">{currentResponder.name}</div>
              <div className="text-[10px] text-[#687A7C] font-mono truncate">{currentResponder.badge} • {currentResponder.sector}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
