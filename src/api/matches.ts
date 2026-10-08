import { apiFetch } from './client';

export async function verifyCandidateMatchApi(
  caseId: string,
  verifiedBy: string,
  method: string,
  notes: string
): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>(`/matches/${encodeURIComponent(caseId)}/verify`, {
    method: 'POST',
    body: JSON.stringify({ verifiedBy, verificationMethod: method, notes }),
  });
}

export async function rejectCandidateMatchApi(caseId: string): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>(`/matches/${encodeURIComponent(caseId)}/reject`, {
    method: 'POST',
  });
}
