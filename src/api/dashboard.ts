import { apiFetch } from './client';
import type { Facility, RescueTeamUnit, AuditLogEntry } from '../types';

export interface DashboardResponse {
  role: string;
  metrics: {
    totalActiveCases: number;
    highPriorityCount: number;
    possibleMatchesCount: number;
    underVerificationCount: number;
    reunitedCount: number;
    avgReunificationHours: number;
  };
  facilities: Facility[];
  rescueTeams: RescueTeamUnit[];
  recentAuditLogs: AuditLogEntry[];
}

export async function fetchDashboardData(role: string = 'ADMIN'): Promise<DashboardResponse> {
  return apiFetch<DashboardResponse>(`/dashboard/${role}`);
}
