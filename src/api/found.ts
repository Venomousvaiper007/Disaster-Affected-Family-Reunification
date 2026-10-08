import { apiFetch } from './client';
import type { FoundPersonRecord } from '../types';

export async function fetchFoundRecords(): Promise<FoundPersonRecord[]> {
  return apiFetch<FoundPersonRecord[]>('/found');
}

export async function fetchFoundRecordById(id: string): Promise<FoundPersonRecord> {
  return apiFetch<FoundPersonRecord>(`/found/${id}`);
}

export async function createFoundPersonApi(
  data: Omit<FoundPersonRecord, 'id' | 'caseNumber' | 'reportedAt' | 'status'>
): Promise<FoundPersonRecord> {
  return apiFetch<FoundPersonRecord>('/found', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
