import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, UserCheck, Users, Radio, Globe, 
  Bell, RefreshCw, AlertTriangle, CheckCircle2, Wifi, WifiOff, FileText, Activity
} from 'lucide-react';
import { fetchNotifications, reseedDatabase } from '../api';

export default function Header({ 
  currentTab, setCurrentTab, 
  currentRole, setCurrentRole, 
  lang, setLang, 
  t 
}) {
  const [notifs, setNotifs] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isReseeding, setIsReseeding] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadNotifs();
    const interval = setInterval(loadNotifs, 10000);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const loadNotifs = async () => {
    try {
      const data = await fetchNotifications();
      setNotifs(data);
    } catch (e) {
      console.log("Notifs fetch err", e);
    }
  };

  const handleReseed = async () => {
    setIsReseeding(true);
    try {
      await reseedDatabase();
      alert("Database successfully re-seeded with demo scenario dataset!");
      window.location.reload();
    } catch (e) {
      alert("Reseed failed: " + e.message);
    } finally {
      setIsReseeding(false);
    }
  };

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border-b border-red-900/40 px-4 py-1.5 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-semibold text-red-400 uppercase tracking-wider">ACTIVE DISASTER RESPONSE MODE</span>
          <span className="text-slate-500">|</span>
          <span className="hidden sm:inline">Disaster-Affected Family Reunification & Rescue Command Network</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Offline / Online Status */}
          <div className={`flex items-center space-x-1.5 px-2 py-0.5 rounded text-[11px] font-mono ${isOnline ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-amber-950 text-amber-400 border border-amber-800/50'}`}>
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3 animate-pulse" />}
            <span>{isOnline ? 'LIVE SYNC' : 'OFFLINE MODE (QUEUED)'}</span>
          </div>

          {/* Quick Reseed Button for Hackathon Demo */}
          <button 
            onClick={handleReseed}
            disabled={isReseeding}
            className="flex items-center space-x-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] border border-slate-700 transition"
            title="Reset to fresh demo dataset"
          >
            <RefreshCw className={`w-3 h-3 ${isReseeding ? 'animate-spin' : ''}`} />
            <span>Reset Demo Scenario</span>
          </button>

          {/* Multilingual Selector */}
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5">
            <Globe className="w-3 h-3 text-sky-400" />
            <button 
              onClick={() => setLang('en')} 
              className={`px-1.5 py-0.2 rounded text-[11px] font-semibold ${lang === 'en' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
            <span className="text-slate-600">|</span>
            <button 
              onClick={() => setLang('ta')} 
              className={`px-1.5 py-0.2 rounded text-[11px] font-semibold ${lang === 'ta' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              தமிழ்
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-900/30 font-black text-white text-xl tracking-tighter border border-red-400/30">
              96
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold text-white tracking-tight">Reunite<span className="text-red-500">360</span></span>
                <span className="text-[10px] uppercase font-bold bg-red-950 text-red-400 border border-red-800/60 px-1.5 py-0.5 rounded">PROJECT 96</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">{t.tagline}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button 
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${currentTab === 'home' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}
            >
              {t.nav.home}
            </button>
            <button 
              onClick={() => setCurrentTab('report-missing')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${currentTab === 'report-missing' ? 'bg-slate-800 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-amber-300 hover:bg-slate-900'}`}
            >
              {t.nav.reportMissing}
            </button>
            <button 
              onClick={() => setCurrentTab('report-found')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${currentTab === 'report-found' ? 'bg-slate-800 text-sky-400 border border-sky-500/30' : 'text-slate-400 hover:text-sky-300 hover:bg-slate-900'}`}
            >
              {t.nav.reportFound}
            </button>
            <button 
              onClick={() => setCurrentTab('report-emergency')}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition flex items-center space-x-1.5 ${currentTab === 'report-emergency' ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' : 'bg-red-950/60 text-red-400 border border-red-800/60 hover:bg-red-900 hover:text-white'}`}
            >
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <span>{t.nav.reportEmergency}</span>
            </button>
            <button 
              onClick={() => setCurrentTab('command')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${currentTab === 'command' ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-900'}`}
            >
              {t.nav.commandCenter}
            </button>
            <button 
              onClick={() => setCurrentTab('family-track')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${currentTab === 'family-track' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {t.nav.trackCase}
            </button>
            <button 
              onClick={() => setCurrentTab('analytics')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${currentTab === 'analytics' ? 'bg-slate-800 text-purple-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {t.nav.analytics}
            </button>
            <button 
              onClick={() => setCurrentTab('audit')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${currentTab === 'audit' ? 'bg-slate-800 text-slate-200' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {t.nav.auditLog}
            </button>
          </nav>

          {/* Right Role Switcher & Notifications */}
          <div className="flex items-center space-x-3">
            {/* Role Switcher */}
            <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
              <Users className="w-4 h-4 text-slate-400 ml-2 mr-1" />
              <select 
                value={currentRole} 
                onChange={(e) => setCurrentRole(e.target.value)}
                className="bg-transparent text-xs font-medium text-slate-200 pr-2 py-1 outline-none cursor-pointer"
              >
                <option value="Family" className="bg-slate-900 text-slate-200">{t.roles.family}</option>
                <option value="Citizen" className="bg-slate-900 text-slate-200">{t.roles.citizen}</option>
                <option value="RescueTeam" className="bg-slate-900 text-slate-200">{t.roles.rescueTeam}</option>
                <option value="Organization" className="bg-slate-900 text-slate-200">{t.roles.organization}</option>
                <option value="Admin" className="bg-slate-900 text-slate-200">{t.roles.admin}</option>
              </select>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white relative transition"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer Dropdown */}
              {showNotifPanel && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Live System Notifications</span>
                    <span className="text-[10px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded border border-red-800">{notifs.length} events</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/50">
                    {notifs.length === 0 ? (
                      <p className="p-4 text-xs text-slate-400 text-center">No recent notifications</p>
                    ) : (
                      notifs.map(n => (
                        <div key={n.id} className="p-3 hover:bg-slate-800/40 transition">
                          <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.created_at}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
