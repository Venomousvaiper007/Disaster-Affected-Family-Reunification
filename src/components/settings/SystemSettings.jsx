import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  Settings,
  Globe,
  Shield,
  Trash2,
  RefreshCw,
  Lock,
  Database,
  CheckCircle2,
  Sliders,
  Bell
} from 'lucide-react';

export const SystemSettings = () => {
  const { lang, setLang, isOnline, toggleOnlineMode, lastSyncTime, t } = useCommand();
  const [cleared, setCleared] = useState(false);

  const handleResetData = () => {
    if (confirm('Reset demo state back to default disaster scenario records?')) {
      localStorage.removeItem('r360_cases');
      localStorage.removeItem('r360_matches');
      localStorage.removeItem('r360_duplicates');
      localStorage.removeItem('r360_audit');
      localStorage.removeItem('r360_offline_queue');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[#D8F3EF] border border-[#155E63]/20 text-[#155E63]">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-[#1D3033] uppercase tracking-wider font-mono">
            {t('settingsTitle')}
          </h1>
          <p className="text-xs text-[#687A7C] font-sans">
            {t('settingsSubtitle')}
          </p>
        </div>
      </div>

      {/* Language Preferences */}
      <div className="bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-[#E1E9E7] pb-2">
          <Globe className="w-4 h-4 text-[#155E63]" />
          <h2 className="text-sm font-bold text-[#1D3033] font-mono uppercase">{t('switchLanguage')}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {[
            { code: 'en', label: 'English', native: 'English', desc: 'Primary Command Interface' },
            { code: 'ta', label: 'Tamil', native: 'தமிழ்', desc: 'தமிழ்நாடு பேரிடர் மீட்பு இடைமுகம்' },
            { code: 'ml', label: 'Malayalam', native: 'മലയാളം', desc: 'കേരള ദുരന്ത നിവാരണ ഇന്റർഫേസ്' },
            { code: 'te', label: 'Telugu', native: 'తెలుగు', desc: 'ఆంధ్ర / తెలంగాణ విపత్తు పోర్టల్' },
            { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', desc: 'ಕರ್ನಾಟಕ ವಿಪತ್ತು ಪರಿಹಾರ ವ್ಯವಸ್ಥೆ' },
            { code: 'hi', label: 'Hindi', native: 'हिन्दी', desc: 'राष्ट्रीय आपदा प्रबंधन प्रणाली' },
          ].map(l => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                lang === l.code ? 'bg-[#D8F3EF]/40 border-[#155E63] text-[#155E63] ring-1 ring-[#155E63] shadow-soft-xs font-bold' : 'bg-[#F4F7F6] border-[#E1E9E7] text-[#1D3033] hover:bg-[#D8F3EF]/20'
              }`}
            >
              <div>
                <div className="font-bold text-sm">{l.native}</div>
                <div className="text-[10px] text-[#687A7C]">{l.desc}</div>
              </div>
              {lang === l.code && <CheckCircle2 className="w-5 h-5 text-[#155E63] flex-shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Offline Sync Cache Engine */}
      <div className="bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-[#E1E9E7] pb-2">
          <Database className="w-4 h-4 text-[#24856A]" />
          <h2 className="text-sm font-bold text-[#1D3033] font-mono uppercase">Offline-First Engine & Storage</h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#F4F7F6] border border-[#E1E9E7]">
            <div>
              <div className="font-semibold text-[#1D3033]">Gateway Connectivity Simulator</div>
              <div className="text-[11px] text-[#687A7C]">Test offline reporting workflow and local sync retry logic</div>
            </div>
            <button
              onClick={toggleOnlineMode}
              className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold border transition-colors ${
                isOnline ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-[#B7791F] border-amber-300'
              }`}
            >
              {isOnline ? 'CONNECTED' : 'OFFLINE MODE'}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-[#687A7C] p-2">
            <span>Last Command Net Sync Timestamp:</span>
            <span className="font-mono text-[#1D3033] font-bold">{lastSyncTime}</span>
          </div>
        </div>
      </div>

      {/* Reset Cache */}
      <div className="bg-white border border-rose-200 rounded-xl p-5 shadow-soft-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-rose-100 pb-2">
          <Trash2 className="w-4 h-4 text-[#C83D4D]" />
          <h2 className="text-sm font-bold text-rose-800 font-mono uppercase">Reset Demonstration State</h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <p className="text-[#687A7C] max-w-md">
            Clears browser local storage cache and restores default disaster scenario data for live hackathon presentation.
          </p>
          <button
            onClick={handleResetData}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold rounded-lg transition-colors whitespace-nowrap"
          >
            Reset Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};
