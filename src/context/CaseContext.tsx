import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  MissingPersonReport,
  FoundPersonRecord,
  FusedCase,
  Facility,
  RescueTeamUnit,
  AuditLogEntry,
  UserRole,
  CaseStatus,
} from '../types';
import { fetchMissingReports, createMissingReportApi } from '../api/missing';
import { fetchFoundRecords, createFoundPersonApi } from '../api/found';
import { fetchCases, updateCaseStatusApi, confirmOfficialReunificationApi } from '../api/cases';
import { verifyCandidateMatchApi } from '../api/matches';
import { fetchDashboardData } from '../api/dashboard';

interface CaseContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  
  missingReports: MissingPersonReport[];
  foundRecords: FoundPersonRecord[];
  fusedCases: FusedCase[];
  facilities: Facility[];
  rescueTeams: RescueTeamUnit[];
  auditLogs: AuditLogEntry[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  
  // Actions
  reportMissingPerson: (report: Omit<MissingPersonReport, 'id' | 'caseNumber' | 'reportedAt' | 'status'>) => Promise<string>;
  reportFoundPerson: (record: Omit<FoundPersonRecord, 'id' | 'caseNumber' | 'reportedAt' | 'status'>) => Promise<string>;
  
  updateCaseStatus: (caseId: string, newStatus: CaseStatus, notes?: string) => Promise<{ success: boolean; message: string }>;
  verifyCandidateMatch: (caseId: string, verifiedBy: string, method: string, notes: string) => Promise<void>;
  confirmOfficialReunification: (caseId: string, facilitator: string, receiverName: string, notes: string) => Promise<void>;
  
  getCaseByNumberOrId: (identifier: string) => FusedCase | undefined;
  getMissingReportById: (id: string) => MissingPersonReport | undefined;
  getFoundRecordById: (id: string) => FoundPersonRecord | undefined;
  
  // Analytics & Summary Metrics
  metrics: {
    totalActiveCases: number;
    highPriorityCount: number;
    possibleMatchesCount: number;
    underVerificationCount: number;
    reunitedCount: number;
    avgReunificationHours: number;
  };
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('r360_user_role') as UserRole) || 'command_authority';
  });

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem('r360_user_role', role);
  };
  
  const [missingReports, setMissingReports] = useState<MissingPersonReport[]>([]);
  const [foundRecords, setFoundRecords] = useState<FoundPersonRecord[]>([]);
  const [fusedCases, setFusedCases] = useState<FusedCase[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [rescueTeams, setRescueTeams] = useState<RescueTeamUnit[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch PostgreSQL database authoritative state
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [missingRes, foundRes, casesRes, dashboardRes] = await Promise.all([
        fetchMissingReports(),
        fetchFoundRecords(),
        fetchCases(),
        fetchDashboardData(userRole)
      ]);

      setMissingReports(missingRes);
      setFoundRecords(foundRes);
      setFusedCases(casesRes);
      setFacilities(dashboardRes.facilities || []);
      setRescueTeams(dashboardRes.rescueTeams || []);
      setAuditLogs(dashboardRes.recentAuditLogs || []);
    } catch (err: any) {
      console.error('Failed to fetch data from backend PostgreSQL:', err);
      setError(err.message || 'Failed to connect to backend database.');
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // ACTION: Submit Missing Person Report to PostgreSQL
  const reportMissingPerson = async (
    data: Omit<MissingPersonReport, 'id' | 'caseNumber' | 'reportedAt' | 'status'>
  ): Promise<string> => {
    try {
      const created = await createMissingReportApi(data);
      await refreshData();
      return created.caseNumber;
    } catch (err: any) {
      console.error('Error submitting missing report to backend:', err);
      throw err;
    }
  };

  // ACTION: Submit Found Person Record to PostgreSQL
  const reportFoundPerson = async (
    data: Omit<FoundPersonRecord, 'id' | 'caseNumber' | 'reportedAt' | 'status'>
  ): Promise<string> => {
    try {
      const created = await createFoundPersonApi(data);
      await refreshData();
      return created.caseNumber;
    } catch (err: any) {
      console.error('Error submitting found record to backend:', err);
      throw err;
    }
  };

  // ACTION: Update Case Status via PostgreSQL API
  const updateCaseStatus = async (
    caseId: string,
    newStatus: CaseStatus,
    notes?: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await updateCaseStatusApi(caseId, newStatus, notes);
      await refreshData();
      return { success: res.success, message: res.message };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to update case status.' };
    }
  };

  // ACTION: Verify Candidate Match via PostgreSQL API
  const verifyCandidateMatch = async (
    caseId: string,
    verifiedBy: string,
    method: string,
    notes: string
  ): Promise<void> => {
    try {
      await verifyCandidateMatchApi(caseId, verifiedBy, method, notes);
      await refreshData();
    } catch (err: any) {
      console.error('Failed to verify match on backend:', err);
      throw err;
    }
  };

  // ACTION: Confirm Official Reunification via PostgreSQL API
  const confirmOfficialReunification = async (
    caseId: string,
    facilitator: string,
    receiverName: string,
    notes: string
  ): Promise<void> => {
    try {
      await confirmOfficialReunificationApi(caseId, facilitator, receiverName, notes);
      await refreshData();
    } catch (err: any) {
      console.error('Failed to confirm reunification on backend:', err);
      throw err;
    }
  };

  const getCaseByNumberOrId = (identifier: string): FusedCase | undefined => {
    const clean = identifier.trim().toLowerCase().replace('#', '');
    return fusedCases.find(
      c =>
        c.id.toLowerCase() === clean ||
        c.caseNumber.toLowerCase() === identifier.trim().toLowerCase() ||
        c.caseNumber.toLowerCase().replace('#', '') === clean ||
        c.missingReport?.fullName.toLowerCase().includes(clean) ||
        c.missingReport?.reporterContact.includes(clean)
    );
  };

  const getMissingReportById = (id: string) => missingReports.find(m => m.id === id || m.caseNumber === id);
  const getFoundRecordById = (id: string) => foundRecords.find(f => f.id === id || f.caseNumber === id);

  // Compute live KPI metrics from PostgreSQL backed state
  const totalActiveCases = fusedCases.filter(c => c.status !== 'CLOSED').length;
  const highPriorityCount = fusedCases.filter(
    c => c.priority === 'CRITICAL' || c.priority === 'HIGH'
  ).length;
  const possibleMatchesCount = fusedCases.filter(c => c.status === 'POSSIBLE_MATCH').length;
  const underVerificationCount = fusedCases.filter(c => c.status === 'UNDER_VERIFICATION').length;
  const reunitedCount = fusedCases.filter(c => c.status === 'REUNITED').length;
  const avgReunificationHours = 2.4;

  const value = {
    userRole,
    setUserRole,
    missingReports,
    foundRecords,
    fusedCases,
    facilities,
    rescueTeams,
    auditLogs,
    loading,
    error,
    refreshData,
    reportMissingPerson,
    reportFoundPerson,
    updateCaseStatus,
    verifyCandidateMatch,
    confirmOfficialReunification,
    getCaseByNumberOrId,
    getMissingReportById,
    getFoundRecordById,
    metrics: {
      totalActiveCases,
      highPriorityCount,
      possibleMatchesCount,
      underVerificationCount,
      reunitedCount,
      avgReunificationHours,
    },
  };

  return <CaseContext.Provider value={value}>{children}</CaseContext.Provider>;
};

export const useCases = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCases must be used within a CaseProvider');
  }
  return context;
};
