const API_BASE = "http://localhost:8000/api";

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/dashboard/stats`);
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return res.json();
}

export async function fetchCases(params = {}) {
  const query = new URLSearchParams();
  if (params.case_type) query.append("case_type", params.case_type);
  if (params.status) query.append("status", params.status);
  if (params.priority) query.append("priority", params.priority);
  if (params.search) query.append("search", params.search);

  const res = await fetch(`${API_BASE}/cases?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch cases");
  return res.json();
}

export async function fetchCaseDetail(caseId) {
  const res = await fetch(`${API_BASE}/cases/${caseId}`);
  if (!res.ok) throw new Error("Failed to fetch case detail");
  return res.json();
}

export async function postMissingReport(data) {
  const res = await fetch(`${API_BASE}/cases/missing`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to submit missing person report");
  return res.json();
}

export async function postFoundReport(data) {
  const res = await fetch(`${API_BASE}/cases/found`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to submit found person report");
  return res.json();
}

export async function postEmergencyReport(data) {
  const res = await fetch(`${API_BASE}/cases/emergency`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to submit emergency report");
  return res.json();
}

export async function fetchMatches() {
  const res = await fetch(`${API_BASE}/matches`);
  if (!res.ok) throw new Error("Failed to fetch matches");
  return res.json();
}

export async function verifyMatch(matchId, action, reviewerName, notes = "") {
  const res = await fetch(`${API_BASE}/matches/${matchId}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, reviewer_name: reviewerName, notes })
  });
  if (!res.ok) throw new Error("Failed to update match verification state");
  return res.json();
}

export async function fetchRescueTeams() {
  const res = await fetch(`${API_BASE}/rescue_teams`);
  if (!res.ok) throw new Error("Failed to fetch rescue teams");
  return res.json();
}

export async function assignRescueTeam(caseId, teamId, status = "DISPATCHED") {
  const res = await fetch(`${API_BASE}/emergencies/${caseId}/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ team_id: teamId, status })
  });
  if (!res.ok) throw new Error("Failed to assign rescue team");
  return res.json();
}

export async function fetchDuplicates() {
  const res = await fetch(`${API_BASE}/duplicates`);
  if (!res.ok) throw new Error("Failed to fetch duplicate groups");
  return res.json();
}

export async function resolveDuplicate(groupId, action = "MERGE") {
  const res = await fetch(`${API_BASE}/duplicates/${groupId}/resolve?action=${action}`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to resolve duplicate");
  return res.json();
}

export async function fetchConflicts() {
  const res = await fetch(`${API_BASE}/conflicts`);
  if (!res.ok) throw new Error("Failed to fetch conflicts");
  return res.json();
}

export async function resolveConflict(conflictId) {
  const res = await fetch(`${API_BASE}/conflicts/${conflictId}/resolve`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to resolve conflict");
  return res.json();
}

export async function trackFamily(query) {
  const res = await fetch(`${API_BASE}/family/track/${query}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Unable to find case");
  }
  return res.json();
}

export async function fetchNotifications() {
  const res = await fetch(`${API_BASE}/notifications`);
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}

export async function fetchAuditLogs() {
  const res = await fetch(`${API_BASE}/audit`);
  if (!res.ok) throw new Error("Failed to fetch audit logs");
  return res.json();
}

export async function reseedDatabase() {
  const res = await fetch(`${API_BASE}/seed`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to reseed database");
  return res.json();
}
