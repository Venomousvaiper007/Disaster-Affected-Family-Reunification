import { apiFetch } from './client';
import type { RescueTeamUnit } from '../types';

export async function fetchRescueTeams(): Promise<RescueTeamUnit[]> {
  return apiFetch<RescueTeamUnit[]>('/rescue/teams');
}

export async function updateAssignmentStatusApi(assignmentId: string, status: string, fieldNotes?: string): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>(`/rescue/assignments/${assignmentId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, fieldNotes }),
  });
}
