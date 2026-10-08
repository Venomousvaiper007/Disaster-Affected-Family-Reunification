import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import { Sidebar } from './Sidebar';
import { TopCommandBar } from './TopCommandBar';
import { OverviewDashboard } from '../dashboard/OverviewDashboard';
import { IncidentMap } from '../map/IncidentMap';
import { MissingPersonsView } from '../cases/MissingPersonsView';
import { FoundPersonsView } from '../cases/FoundPersonsView';
import { SmartMatchWorkspace } from '../matching/SmartMatchWorkspace';
import { VerificationQueue } from '../verification/VerificationQueue';
import { CaseCoordination } from '../coordination/CaseCoordination';
import { RescueCentres } from '../network/RescueCentres';
import { FamilyTrack } from '../family/FamilyTrack';
import { AnalyticsDashboard } from '../analytics/AnalyticsDashboard';
import { DuplicateDetection } from '../intelligence/DuplicateDetection';
import { AuditHistory } from '../audit/AuditHistory';
import { SystemSettings } from '../settings/SystemSettings';
import { IncidentDetailsPanel } from '../dashboard/IncidentDetailsPanel';
import { RegisterCaseModal } from '../modals/RegisterCaseModal';
import { VerifyMatchModal } from '../modals/VerifyMatchModal';
import { ExportReportModal } from '../modals/ExportReportModal';
import { ShieldCheck, Info } from 'lucide-react';

export const AppLayout = () => {
  const { currentView, roleToast } = useCommand();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewDashboard />;
      case 'map':
        return <IncidentMap />;
      case 'missing':
        return <MissingPersonsView />;
      case 'found':
        return <FoundPersonsView />;
      case 'matches':
        return <SmartMatchWorkspace />;
      case 'verification':
        return <VerificationQueue />;
      case 'coordination':
        return <CaseCoordination />;
      case 'shelters':
      case 'teams':
        return <RescueCentres />;
      case 'family':
        return <FamilyTrack />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'duplicates':
        return <DuplicateDetection />;
      case 'audit':
        return <AuditHistory />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-[#1D3033] flex flex-col font-sans selection:bg-[#D8F3EF] selection:text-[#155E63]">
      {/* Role Switch Toast Banner */}
      {roleToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#155E63] text-white px-4 py-2 rounded-xl shadow-dropdown flex items-center gap-2 text-xs font-semibold animate-bounce">
          <ShieldCheck className="w-4 h-4 text-[#80CEC3]" />
          <span>{roleToast}</span>
        </div>
      )}

      {/* Navigation Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-[#123B3A]/60 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* Main Container */}
      <div
        className={`
          flex-1 flex flex-col transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}
        `}
      >
        {/* Top Command Bar */}
        <TopCommandBar onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

        {/* Main Workspace Area */}
        <main className="flex-1 p-4 lg:p-6 max-w-[1920px] w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Modals & Slide-over Panels */}
      <IncidentDetailsPanel />
      <RegisterCaseModal />
      <VerifyMatchModal />
      <ExportReportModal />
    </div>
  );
};
