import { apiFetch } from './client';
import type { MissingPersonReport } from '../types';

export async function fetchMissingReports(): Promise<MissingPersonReport[]> {
  return apiFetch<MissingPersonReport[]>('/missing');
}

export async function fetchMissingReportById(id: string): Promise<MissingPersonReport> {
  return apiFetch<MissingPersonReport>(`/missing/${id}`);
}

export async function createMissingReportApi(
  data: Omit<MissingPersonReport, 'id' | 'caseNumber' | 'reportedAt' | 'status'>
): Promise<MissingPersonReport> {
  return apiFetch<MissingPersonReport>('/missing', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
