import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { CaseProvider } from './context/CaseContext';
import { Navbar } from './components/Navbar';
import { PublicHome } from './components/PublicHome';
import { CommandCenterView } from './components/CommandCenterView';
import { FieldRescueView } from './components/FieldRescueView';
import { HospitalIntakeView } from './components/HospitalIntakeView';
import { TrackCaseView } from './components/TrackCaseView';
import { FacilitiesView } from './components/FacilitiesView';
import { BiometricIntakeView } from './components/BiometricIntakeView';
import { ReportMissingModal } from './components/ReportMissingModal';
import { ReportFoundModal } from './components/ReportFoundModal';
import { CaseDetailModal } from './components/CaseDetailModal';
import type { FusedCase } from './types';
import './App.css';

const MainApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('public_home');
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Modals state
  const [isReportMissingOpen, setIsReportMissingOpen] = useState(false);
  const [isReportFoundOpen, setIsReportFoundOpen] = useState(false);
  const [selectedCaseForDetail, setSelectedCaseForDetail] = useState<FusedCase | null>(null);
  const [trackCaseId, setTrackCaseId] = useState<string | undefined>(undefined);

  const handleOpenTrackCase = (caseId?: string) => {
    if (caseId) setTrackCaseId(caseId);
    setCurrentTab('track_case');
  };

  const handleReportMissingSuccess = (caseNumber: string) => {
    setTrackCaseId(caseNumber);
    setCurrentTab('track_case');
  };

  const handleReportFoundSuccess = () => {
    setCurrentTab('command_center');
  };

  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      data-theme={isHighContrast ? 'high-contrast' : undefined}
    >
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isHighContrast={isHighContrast}
        setIsHighContrast={setIsHighContrast}
      />

      {/* Main View Router */}
      <main style={{ flexGrow: 1 }}>
        {currentTab === 'public_home' && (
          <PublicHome
            onOpenReportMissing={() => setIsReportMissingOpen(true)}
            onOpenReportFound={() => setIsReportFoundOpen(true)}
            onOpenBiometricIntake={() => setCurrentTab('biometric_intake')}
            onTrackCase={handleOpenTrackCase}
            onViewFacilities={() => setCurrentTab('facilities')}
            onSelectCase={c => setSelectedCaseForDetail(c)}
          />
        )}

        {currentTab === 'command_center' && (
          <CommandCenterView onSelectCase={c => setSelectedCaseForDetail(c)} />
        )}

        {currentTab === 'field_rescue' && (
          <FieldRescueView
            onOpenReportFound={() => setIsReportFoundOpen(true)}
            onOpenBiometricIntake={() => setCurrentTab('biometric_intake')}
            onSelectCase={c => setSelectedCaseForDetail(c)}
          />
        )}

        {currentTab === 'hospital_intake' && (
          <HospitalIntakeView
            onOpenReportFound={() => setIsReportFoundOpen(true)}
            onOpenBiometricIntake={() => setCurrentTab('biometric_intake')}
            onSelectCase={c => setSelectedCaseForDetail(c)}
          />
        )}

        {currentTab === 'track_case' && (
          <TrackCaseView
            initialCaseId={trackCaseId}
            onSelectCase={c => setSelectedCaseForDetail(c)}
          />
        )}

        {currentTab === 'biometric_intake' && (
          <BiometricIntakeView
            onSelectCase={c => setSelectedCaseForDetail(c)}
            onNavigateToCommandCenter={() => setCurrentTab('command_center')}
          />
        )}

        {currentTab === 'facilities' && <FacilitiesView />}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(9, 13, 22, 0.95)',
          padding: '24px 0',
          fontSize: '0.825rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
        }}
      >
        <div className="app-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <strong>Reunite360</strong> — Disaster Response, Family Reunification & Rescue Coordination Platform
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>National Disaster Management Authority</span>
              <span>•</span>
              <span>24/7 Helpline: 1070</span>
              <span>•</span>
              <span>PostgreSQL Enterprise Schema Ready</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isReportMissingOpen && (
        <ReportMissingModal
          onClose={() => setIsReportMissingOpen(false)}
          onSuccess={handleReportMissingSuccess}
        />
      )}

      {isReportFoundOpen && (
        <ReportFoundModal
          onClose={() => setIsReportFoundOpen(false)}
          onSuccess={handleReportFoundSuccess}
        />
      )}

      {selectedCaseForDetail && (
        <CaseDetailModal
          fusedCase={selectedCaseForDetail}
          onClose={() => setSelectedCaseForDetail(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <CaseProvider>
        <MainApp />
      </CaseProvider>
    </LanguageProvider>
  );
}
