import { apiFetch } from './client';
import type { FusedCase, CaseStatus } from '../types';

export async function fetchCases(): Promise<FusedCase[]> {
  return apiFetch<FusedCase[]>('/cases');
}

export async function fetchCaseById(id: string): Promise<FusedCase> {
  return apiFetch<FusedCase>(`/cases/${encodeURIComponent(id)}`);
}

export async function updateCaseStatusApi(
  caseId: string,
  newStatus: CaseStatus,
  notes?: string
): Promise<{ success: boolean; message: string; case?: FusedCase }> {
  return apiFetch<{ success: boolean; message: string; case?: FusedCase }>(`/cases/${encodeURIComponent(caseId)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ newStatus, notes }),
  });
}

export async function confirmOfficialReunificationApi(
  caseId: string,
  facilitator: string,
  receiverName: string,
  notes: string
): Promise<{ success: boolean; message: string; case?: FusedCase }> {
  return apiFetch<{ success: boolean; message: string; case?: FusedCase }>(`/cases/${encodeURIComponent(caseId)}/reunite`, {
    method: 'POST',
    body: JSON.stringify({ facilitator, receiverName, notes }),
  });
}
