import { apiFetch } from './client';

export interface EvidenceData {
  fusedCaseId: string;
  timelineEventId?: string;
  evidenceType: string;
  sourceType: string;
  sourceName: string;
  valueDescription: string;

  reliabilityScore?: number;
  notes?: string;
}

export async function submitEvidenceApi(data: EvidenceData): Promise<any> {
  return apiFetch<any>('/evidence', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
