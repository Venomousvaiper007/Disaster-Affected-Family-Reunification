import { apiFetch } from './client';

export interface EmergencyReportData {
  id?: string;
  emergencyCode?: string;
  reporterName: string;
  reporterContact: string;
  locationAddress: string;
  lat: number;
  lng: number;
  sector?: string;
  peopleTrappedCount: number;
  criticallyInjuredCount: number;
  hasUnverifiedFatality: boolean;
  fatalityStatus?: string;
  description: string;
  photoUrl?: string;
  priority?: string;
  status?: string;
}

export async function fetchEmergencies(): Promise<EmergencyReportData[]> {
  return apiFetch<EmergencyReportData[]>('/emergencies');
}

export async function createEmergencyApi(data: EmergencyReportData): Promise<EmergencyReportData> {
  return apiFetch<EmergencyReportData>('/emergencies', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateEmergencyStatusApi(id: string, status: string, fatalityStatus?: string): Promise<EmergencyReportData> {
  return apiFetch<EmergencyReportData>(`/emergencies/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, fatalityStatus }),
  });
}

export async function assignRescueTeamApi(emergencyId: string, rescueTeamId: string, fieldNotes?: string): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>(`/emergencies/${emergencyId}/assign`, {
    method: 'POST',
    body: JSON.stringify({ emergencyReportId: emergencyId, rescueTeamId, fieldNotes }),
  });
}
