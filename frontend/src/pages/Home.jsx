import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, Search, UserCheck, Users, Radio, MapPin, 
  ArrowRight, Activity, CheckCircle2, AlertTriangle, FileSearch, HeartHandshake, Layers
} from 'lucide-react';
import { fetchStats } from '../api';

export default function Home({ setCurrentTab, onSelectCase, t }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div className="space-y-12 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-red-950/20 blur-3xl rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-red-950/80 border border-red-800/80 px-3 py-1 rounded-full text-xs font-semibold text-red-400 mb-6 shadow-lg shadow-red-950/50">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>DISASTER RESPONSE & REUNIFICATION PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Disasters fragment information. <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-amber-400 to-sky-400">
              Project 96 reconnects it.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {t.heroDesc}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setCurrentTab('report-missing')}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-xl shadow-amber-950/50 transition transform hover:-translate-y-0.5 flex items-center space-x-2 text-sm"
            >
              <Users className="w-5 h-5" />
              <span>{t.actions.reportMissingBtn}</span>
            </button>

            <button
              onClick={() => setCurrentTab('report-emergency')}
              className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold rounded-xl shadow-xl shadow-red-950/80 transition transform hover:-translate-y-0.5 flex items-center space-x-2 text-sm border border-red-400/40"
            >
              <ShieldAlert className="w-5 h-5 animate-pulse" />
              <span>{t.actions.reportEmergencyBtn}</span>
            </button>

            <button
              onClick={() => setCurrentTab('command')}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold rounded-xl border border-slate-700 transition flex items-center space-x-2 text-sm"
            >
              <Radio className="w-5 h-5" />
              <span>{t.actions.openCommandBtn}</span>
            </button>

            <button
              onClick={() => setCurrentTab('family-track')}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-sky-400 font-semibold rounded-xl border border-slate-800 transition flex items-center space-x-2 text-sm"
            >
              <Search className="w-5 h-5" />
              <span>{t.actions.trackCaseBtn}</span>
            </button>
          </div>
        </div>
      </section>

      {/* LIVE KPI METRICS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 blur-xl rounded-full"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Missing Cases</p>
            <p className="text-3xl font-black text-amber-400 mt-2">{stats ? stats.active_missing_cases : '...'}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">Family & civilian reports</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-xl rounded-full"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Found Persons Registered</p>
            <p className="text-3xl font-black text-emerald-400 mt-2">{stats ? stats.found_persons : '...'}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">Shelters, hospitals & rescue</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 blur-xl rounded-full"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active SOS Emergencies</p>
            <p className="text-3xl font-black text-red-500 mt-2">{stats ? stats.active_emergencies : '...'}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">High urgency response needed</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 blur-xl rounded-full"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Potential Matches</p>
            <p className="text-3xl font-black text-sky-400 mt-2">{stats ? stats.potential_matches : '...'}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">Pending human verification</span>
          </div>
        </div>
      </section>

      {/* FEATURED DEMO SPOTLIGHT CARD — RAVI KUMAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1 rounded-full">
                <span>⭐ HACKATHON CENTRAL DEMO CASE</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Reunifying Ravi Kumar (Case MP-1024)
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                Experience how Project 96 connects fragmented reports across <strong className="text-amber-400">Family (MP-1024)</strong>, <strong className="text-emerald-400">Rescue Team Alpha (FP-2048)</strong>, and <strong className="text-sky-400">Shelter A (FP-2050)</strong> into a <strong className="text-white font-bold">91% Verified Confidence Score</strong> with human responder verification.
              </p>

              <div className="flex flex-wrap gap-2 text-xs text-slate-400 pt-2">
                <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Age: 42</span>
                <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Scar on right hand</span>
                <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Blue shirt</span>
                <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Last seen: Railway Station (10:00 AM)</span>
              </div>
            </div>

            <button
              onClick={() => onSelectCase("MP-1024")}
              className="px-6 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-xl transition flex items-center space-x-2 text-sm whitespace-nowrap"
            >
              <span>Launch Demo Case MP-1024</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* CORE PRODUCT PHILOSOPHY WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white">The Reunite360 Workflow</h2>
          <p className="text-slate-400 text-sm">Human verification guided by intelligent evidence evaluation.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-7 gap-2 text-center text-xs font-bold font-mono">
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-300">1. REPORT</div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-sky-400">2. CONNECT</div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-amber-400">3. VERIFY</div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-purple-400">4. PRIORITIZE</div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-emerald-400">5. ACT</div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-blue-400">6. UPDATE</div>
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-xl shadow-lg col-span-2 md:col-span-1">7. REUNITE</div>
        </div>
      </section>
    </div>
  );
}
