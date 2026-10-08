import React, { useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import ReportMissing from './pages/ReportMissing';
import ReportFound from './pages/ReportFound';
import ReportEmergency from './pages/ReportEmergency';
import CommandCenter from './pages/CommandCenter';
import CaseDetail from './pages/CaseDetail';
import FamilyTrack from './pages/FamilyTrack';
import Analytics from './pages/Analytics';
import AuditLog from './pages/AuditLog';
import { translations } from './i18n';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home'); // home, report-missing, report-found, report-emergency, command, case-detail, family-track, analytics, audit
  const [currentRole, setCurrentRole] = useState('Admin'); // Family, Citizen, RescueTeam, Organization, Admin
  const [lang, setLang] = useState('en'); // en, ta
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  const t = translations[lang] || translations.en;

  const handleSelectCase = (caseId) => {
    setSelectedCaseId(caseId);
    setCurrentTab('case-detail');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      <div>
        <Header 
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setSelectedCaseId(null);
            setCurrentTab(tab);
          }}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          lang={lang}
          setLang={setLang}
          t={t}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {currentTab === 'home' && (
            <Home 
              setCurrentTab={setCurrentTab} 
              onSelectCase={handleSelectCase} 
              t={t} 
            />
          )}

          {currentTab === 'report-missing' && (
            <ReportMissing 
              setCurrentTab={setCurrentTab} 
              onSelectCase={handleSelectCase} 
              t={t} 
            />
          )}

          {currentTab === 'report-found' && (
            <ReportFound 
              setCurrentTab={setCurrentTab} 
              onSelectCase={handleSelectCase} 
              t={t} 
            />
          )}

          {currentTab === 'report-emergency' && (
            <ReportEmergency 
              setCurrentTab={setCurrentTab} 
              onSelectCase={handleSelectCase} 
              t={t} 
            />
          )}

          {currentTab === 'command' && (
            <CommandCenter 
              onSelectCase={handleSelectCase} 
              t={t} 
            />
          )}

          {currentTab === 'case-detail' && selectedCaseId && (
            <CaseDetail 
              caseId={selectedCaseId} 
              onBack={() => setCurrentTab('command')} 
              t={t} 
            />
          )}

          {currentTab === 'family-track' && (
            <FamilyTrack t={t} />
          )}

          {currentTab === 'analytics' && (
            <Analytics />
          )}

          {currentTab === 'audit' && (
            <AuditLog />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white">Reunite360</span>
            <span>• Project 96</span>
            <span className="text-slate-600">|</span>
            <span>Disaster Response & Family Reunification Network</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Current Active Role Perspective: <strong className="text-amber-400">{currentRole}</strong> | Language: <strong className="text-sky-400">{lang.toUpperCase()}</strong>
          </div>
        </div>
      </footer>
    </div>
  );
}
