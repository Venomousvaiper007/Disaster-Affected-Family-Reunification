import React, { useState, useRef, useEffect } from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  Search,
  Bell,
  Wifi,
  WifiOff,
  RefreshCw,
  PlusCircle,
  Globe,
  ChevronDown,
  Shield,
  Layers,
  FileText,
  AlertCircle,
  CheckCircle2,
  Menu,
  Activity,
  Download,
  Languages,
  LifeBuoy,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English', native: 'English', flag: '🌐' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
];

export const TopCommandBar = ({ onToggleMobileSidebar }) => {
  const {
    lang,
    setLang,
    t,
    operations,
    activeOperation,
    setActiveOperationId,
    currentRole,
    setCurrentRole,
    responders,
    currentResponder,
    setCurrentResponder,
    isOnline,
    toggleOnlineMode,
    lastSyncTime,
    offlineQueue,
    notifications,
    searchQuery,
    setSearchQuery,
    setIsRegisterOpen,
    setIsExportOpen,
    setCurrentView,
    openCaseDetails,
    cases
  } = useCommand();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isOpOpen, setIsOpOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const notifRef = useRef(null);
  const roleRef = useRef(null);
  const opRef = useRef(null);
  const langRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
      if (roleRef.current && !roleRef.current.contains(e.target)) setIsRoleOpen(false);
      if (opRef.current && !opRef.current.contains(e.target)) setIsOpOpen(false);
      if (langRef.current && !langRef.current.contains(e.target)) setIsLangOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick search matching cases
  const searchResults = searchQuery.trim()
    ? cases.filter(c =>
        c.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastSeenLocation?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const currentLangObj = LANGUAGE_OPTIONS.find(l => l.code === lang) || LANGUAGE_OPTIONS[0];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur border-b border-[#E1E9E7] px-3 sm:px-4 flex items-center justify-between gap-2.5 text-[#1D3033] shadow-soft">
      {/* Left: Mobile Toggle & Disaster Sector Selector */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-lg text-[#687A7C] hover:text-[#1D3033] hover:bg-[#F4F7F6]"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Disaster Operation Selector */}
        <div className="relative" ref={opRef}>
          <button
            onClick={() => setIsOpOpen(!isOpOpen)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#F4F7F6] border border-[#E1E9E7] hover:border-[#155E63]/40 transition-all text-xs font-medium text-[#1D3033] cursor-pointer"
          >
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#24856A] animate-ping"></span>
              <span className="font-semibold text-[#155E63] uppercase tracking-wide text-[10px] sm:text-[11px] font-mono hidden sm:inline">{t('operation')}:</span>
            </div>
            <span className="max-w-[120px] sm:max-w-[180px] md:max-w-[220px] truncate font-semibold">{activeOperation.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#687A7C] flex-shrink-0" />
          </button>

          {isOpOpen && (
            <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white border border-[#E1E9E7] rounded-xl shadow-dropdown py-2 z-50">
              <div className="px-3 py-1.5 text-[10px] font-mono text-[#687A7C] uppercase tracking-wider border-b border-[#E1E9E7]">
                Switch Active Disaster Sector
              </div>
              <div className="max-h-72 overflow-y-auto">
                {operations.map(op => (
                  <button
                    key={op.id}
                    onClick={() => {
                      setActiveOperationId(op.id);
                      setIsOpOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-xs flex flex-col gap-0.5 hover:bg-[#F4F7F6] transition-colors cursor-pointer ${op.id === activeOperation.id ? 'bg-[#D8F3EF]/60 text-[#155E63] border-l-4 border-[#155E63] font-semibold' : 'text-[#1D3033]'}`}
                  >
                    <div className="font-semibold flex items-center justify-between">
                      <span>{op.name}</span>
                      {op.id === activeOperation.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#155E63]" />}
                    </div>
                    <div className="text-[11px] text-[#687A7C] truncate">{op.region}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Demo Data Tag */}
        <span className="hidden xl:inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 bg-amber-50 text-[#B7791F] border border-amber-200 rounded-md font-medium">
          <Activity className="w-3 h-3 text-[#B7791F] animate-pulse" />
          {t('simulatedData')}
        </span>
      </div>

      {/* Middle: Universal Search */}
      <div className="flex-1 max-w-md relative hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687A7C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-[#F4F7F6] border border-[#E1E9E7] focus:border-[#155E63] focus:bg-white rounded-xl pl-9 pr-8 py-1.5 text-xs text-[#1D3033] placeholder-[#687A7C] focus:outline-none focus:ring-2 focus:ring-[#D8F3EF] transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#687A7C] hover:text-[#1D3033] cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        {/* Live Search Dropdown */}
        {searchFocused && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E1E9E7] rounded-xl shadow-dropdown py-2 z-50">
            <div className="px-3 py-1 text-[10px] font-mono text-[#687A7C] border-b border-[#E1E9E7]">
              Matching Cases ({searchResults.length})
            </div>
            {searchResults.map(c => (
              <div
                key={c.id}
                onClick={() => {
                  openCaseDetails(c);
                  setSearchQuery('');
                }}
                className="px-3 py-2 hover:bg-[#F4F7F6] cursor-pointer flex items-center justify-between border-b border-[#E1E9E7]/60 last:border-0"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.classification === 'MISSING' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'}`}>
                    {c.classification}
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-[#1D3033]">{c.fullName}</div>
                    <div className="text-[10px] text-[#687A7C]">{c.id} • {c.lastSeenLocation}</div>
                  </div>
                </div>
                <span className="text-[10px] text-[#155E63] font-semibold font-mono">Dossier →</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls: Multi-Language Selector, Connectivity, Notifs, SitRep, Role, Report Emergency */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        
        {/* MULTI-LANGUAGE SELECTOR DROPDOWN (Supports EN, TA, ML, TE, KN, HI) */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white border border-[#E1E9E7] hover:border-[#155E63] text-xs font-semibold text-[#155E63] shadow-xs transition-all hover:bg-[#F4F7F6] cursor-pointer"
            title={t('switchLanguage')}
          >
            <Globe className="w-3.5 h-3.5 text-[#155E63]" />
            <span className="font-sans text-xs font-bold">{currentLangObj.native}</span>
            <ChevronDown className="w-3 h-3 text-[#687A7C]" />
          </button>

          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E1E9E7] rounded-xl shadow-dropdown py-1.5 z-50 animate-fade-in">
              <div className="px-3 py-1.5 text-[10px] font-mono text-[#687A7C] uppercase tracking-wider border-b border-[#E1E9E7] flex items-center justify-between">
                <span>{t('switchLanguage')}</span>
                <Languages className="w-3.5 h-3.5 text-[#155E63]" />
              </div>
              <div className="p-1 space-y-0.5">
                {LANGUAGE_OPTIONS.map(opt => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      setLang(opt.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${lang === opt.code ? 'bg-[#D8F3EF] text-[#155E63] font-bold' : 'text-[#1D3033] hover:bg-[#F4F7F6]'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{opt.flag}</span>
                      <div>
                        <span className="font-semibold block">{opt.native}</span>
                        <span className="text-[10px] text-[#687A7C] block font-sans">{opt.label}</span>
                      </div>
                    </div>
                    {lang === opt.code && <CheckCircle2 className="w-4 h-4 text-[#155E63]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Network & Offline Mode Toggle */}
        <button
          onClick={toggleOnlineMode}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
            isOnline
              ? 'bg-emerald-50 text-[#24856A] border-emerald-200 hover:bg-emerald-100 font-semibold'
              : 'bg-amber-50 text-[#B7791F] border-amber-300 hover:bg-amber-100 font-bold animate-pulse'
          }`}
          title={isOnline ? "Simulate Offline Mode (Disconnect Central Gateway)" : "Reconnect to Central Command Network"}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-[#24856A]" />
              <span className="hidden lg:inline">{t('online')}</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-[#B7791F]" />
              <span className="hidden lg:inline">{t('offline')} ({offlineQueue.length})</span>
            </>
          )}
        </button>

        {/* Coordination Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl bg-white border border-[#E1E9E7] hover:border-[#155E63] text-[#687A7C] hover:text-[#1D3033] shadow-xs cursor-pointer"
            title={t('notifications')}
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F47C65] text-[10px] font-bold text-white shadow-xs">
                {notifications.length}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E1E9E7] rounded-2xl shadow-dropdown p-2 z-50">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#E1E9E7]">
                <span className="text-xs font-bold text-[#1D3033] uppercase tracking-wide font-mono">{t('notifications')}</span>
                <span className="text-[10px] text-[#155E63] font-mono font-semibold bg-[#D8F3EF] px-2 py-0.5 rounded-full">{notifications.length} Alerts</span>
              </div>
              <div className="max-h-72 overflow-y-auto space-y-1 py-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.link) setCurrentView(n.link);
                      setIsNotifOpen(false);
                    }}
                    className="p-2.5 rounded-xl hover:bg-[#F4F7F6] cursor-pointer transition-colors border-b border-[#E1E9E7]/60 last:border-0"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#1D3033] flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${n.type === 'URGENT' ? 'bg-[#C83D4D] animate-ping' : n.type === 'MATCH' ? 'bg-[#155E63]' : 'bg-[#24856A]'}`}></span>
                        {n.title}
                      </span>
                      <span className="text-[10px] text-[#687A7C] font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#687A7C] mt-1 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Export SitRep Modal Button */}
        <button
          onClick={() => setIsExportOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-[#E1E9E7] hover:border-[#155E63] text-xs font-medium text-[#1D3033] shadow-xs hover:bg-[#F4F7F6] cursor-pointer"
          title="Export Situation Report & Dossier Summary"
        >
          <Download className="w-3.5 h-3.5 text-[#155E63]" />
          <span className="hidden xl:inline font-semibold">SitRep</span>
        </button>

        {/* Responder Profile & Role Switcher */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setIsRoleOpen(!isRoleOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white border border-[#E1E9E7] hover:border-[#155E63] text-xs text-left shadow-xs hover:bg-[#F4F7F6] cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#D8F3EF] border border-[#B2E4DD] flex items-center justify-center font-bold text-[#155E63] text-xs">
              {currentResponder.name.charAt(0)}
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="font-semibold text-[#1D3033] text-xs leading-none truncate max-w-[120px]">{currentResponder.name}</span>
              <span className="text-[10px] text-[#687A7C] font-mono font-medium">{currentRole}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#687A7C]" />
          </button>

          {isRoleOpen && (
            <div className="absolute right-0 mt-2 w-68 bg-white border border-[#E1E9E7] rounded-xl shadow-dropdown py-2 z-50">
              <div className="px-3 py-1.5 text-[10px] font-mono text-[#687A7C] uppercase tracking-wider border-b border-[#E1E9E7] flex items-center justify-between">
                <span>Switch Role (Demo Mode)</span>
                <Shield className="w-3 h-3 text-[#155E63]" />
              </div>
              <div className="p-1 space-y-1 max-h-60 overflow-y-auto">
                {[
                  { name: 'Authority / Admin', icon: '🛡️', desc: 'Command center, AI verification, conflicts' },
                  { name: 'Family Member', icon: '👨‍👩‍👧', desc: 'Report missing & track via Family Portal' },
                  { name: 'Citizen / Volunteer', icon: '🧑‍🚒', desc: 'Report emergency SOS & found persons' },
                  { name: 'Rescue Team', icon: '🚑', desc: 'View dispatched rescue tasks & field operations' },
                  { name: 'Organization / Shelter', icon: '🏥', desc: 'Shelter registration & hospital triage' },
                  { name: 'Incident Commander', icon: '🎖️', desc: 'Full multi-agency disaster operations' }
                ].map(r => (
                  <button
                    key={r.name}
                    onClick={() => {
                      setCurrentRole(r.name);
                      setIsRoleOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex flex-col gap-0.5 transition-colors cursor-pointer ${currentRole === r.name ? 'bg-[#D8F3EF] text-[#155E63] font-bold' : 'text-[#1D3033] hover:bg-[#F4F7F6]'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span>{r.icon}</span>
                        <span>{r.name}</span>
                      </span>
                      {currentRole === r.name && <CheckCircle2 className="w-3.5 h-3.5 text-[#155E63]" />}
                    </div>
                    <span className="text-[10px] text-[#687A7C] font-normal pl-5">{r.desc}</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-[#E1E9E7] mt-1 pt-1">
                <div className="px-3 py-1 text-[10px] font-mono text-[#687A7C] uppercase">Active Responder Profiles</div>
                {responders.map(resp => (
                  <button
                    key={resp.id}
                    onClick={() => {
                      setCurrentResponder(resp);
                      setIsRoleOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs truncate transition-colors cursor-pointer ${currentResponder.id === resp.id ? 'text-[#155E63] font-bold bg-[#D8F3EF]/50' : 'text-[#687A7C] hover:bg-[#F4F7F6] hover:text-[#1D3033]'}`}
                  >
                    <div className="font-semibold">{resp.name}</div>
                    <div className="text-[10px] font-mono text-[#687A7C]">{resp.badge} • {resp.sector}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Primary Action: Report Emergency / Issue Button (Warm Coral) */}
        <button
          onClick={() => setIsRegisterOpen(true)}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-[#F47C65] hover:bg-[#E9583D] text-white font-semibold text-xs shadow-coral-glow transition-all transform active:scale-95 cursor-pointer flex-shrink-0"
        >
          <LifeBuoy className="w-4 h-4 text-white" />
          <span className="font-sans font-semibold hidden sm:inline">{t('registerCase')}</span>
          <span className="font-sans font-semibold sm:hidden">SOS</span>
        </button>
      </div>
    </header>
  );
};
