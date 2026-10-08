import type { FusedCase, NextBestAction, UrgencyLevel } from '../types';

/**
 * NEXT-BEST-ACTION (NBA) ENGINE
 * Analyzes case state, candidate matches, medical triage, and vulnerability metrics
 * to compute a dynamic priority score and prescribe concrete, step-by-step next actions.
 */

export function generateNextBestAction(fusedCase: FusedCase): NextBestAction {
  const missing = fusedCase.missingReport;
  const found = fusedCase.foundRecord;
  const match = fusedCase.candidateMatch;
  const status = fusedCase.status;

  // Compute dynamic priority score (1 - 100)
  let priorityScore = 40; // Base score
  let urgencyLevel: UrgencyLevel = 'MEDIUM';

  // 1. Vulnerability weighting
  const vuln = fusedCase.vulnerability || missing?.vulnerability || found?.vulnerability;
  if (vuln === 'CHILD') priorityScore += 30;
  else if (vuln === 'ELDERLY') priorityScore += 20;
  else if (vuln === 'INJURED' || vuln === 'PREGNANT' || vuln === 'DISABLED') priorityScore += 25;

  // 2. Medical condition urgency
  if (found?.medicalCondition === 'CRITICAL' || found?.medicalCondition === 'UNCONSCIOUS') {
    priorityScore += 30;
  } else if (found?.medicalCondition === 'MINOR_INJURIES') {
    priorityScore += 10;
  }

  // 3. Match score factor
  if (match && match.overallScore >= 80) {
    priorityScore += 15; // High likelihood of immediate resolution
  }

  // 4. Status adjustments
  if (status === 'UNDER_VERIFICATION') {
    priorityScore += 10;
  } else if (status === 'VERIFIED') {
    priorityScore += 15; // Expedite family notification and reunification!
  } else if (status === 'REUNITED' || status === 'CLOSED') {
    priorityScore = 5;
  }

  priorityScore = Math.min(100, Math.max(10, priorityScore));

  if (priorityScore >= 85) urgencyLevel = 'CRITICAL';
  else if (priorityScore >= 65) urgencyLevel = 'HIGH';
  else if (priorityScore >= 45) urgencyLevel = 'MEDIUM';
  else urgencyLevel = 'LOW';

  // Generate tailored Title, Rationale, and Actionable Steps
  let title = 'Cross-reference Emergency Records';
  let description = 'Search active relief camps and field records for incoming matches.';
  let targetFacilityOrTeam = found?.currentFacilityName || 'Zonal Disaster Command Center';
  let contactPhone = found?.contactPhone || '1070';
  const steps: NextBestAction['steps'] = [];
  let rationale = 'Routine periodic case correlation.';

  switch (status) {
    case 'UNVERIFIED':
      if (missing && !found) {
        title = `Broadcast Missing Alert for ${missing.fullName} (${missing.age}y)`;
        description = `Deploy search queries across Sector ${missing.lastSeenLocation.sector || 'Delta'} intake registries.`;
        rationale = `Missing report logged ${new Date(missing.reportedAt).toLocaleTimeString()}. No active candidate matches yet.`;
        steps.push(
          { stepNumber: 1, instruction: `Notify Field Rescue Units in ${missing.lastSeenLocation.landmark || missing.lastSeenLocation.address}`, completed: false },
          { stepNumber: 2, instruction: `Query Hospital Emergency Intakes within 15 km radius for unidentified patients`, completed: false },
          { stepNumber: 3, instruction: `Check distinguishing features: "${missing.traits.distinguishingMarks?.join(', ') || 'None noted'}" in shelter database`, completed: false }
        );
      } else if (found && !missing) {
        title = `Identify Rescued Person at ${found.currentFacilityName}`;
        description = `Individual admitted at ${found.currentFacilityName} requires family correlation.`;
        rationale = `Found individual (approx age: ${found.estimatedAgeMin ?? '?'}-${found.estimatedAgeMax ?? '?'}) is currently unlinked to missing reports.`;
        steps.push(
          { stepNumber: 1, instruction: `Capture high-resolution frontal and profile photo at ${found.currentFacilityName}`, completed: false },
          { stepNumber: 2, instruction: `Document any scars, jewelry, or identifying marks with Ward Nurse`, completed: false },
          { stepNumber: 3, instruction: `Run automated live case fusion against all active missing reports`, completed: false }
        );
      }
      break;

    case 'POSSIBLE_MATCH':
      if (match) {
        title = `Dispatch Verification Team to ${found?.currentFacilityName || 'Facility'}`;
        description = `Potential match (${match.overallScore}% confidence) identified between ${missing?.fullName || 'Missing Person'} and ${found?.currentFacilityName || 'Intake'}.`;
        rationale = `High correlation on ${match.supportingEvidence.slice(0, 2).join('; ')}. Conflicts to resolve: ${match.conflictingEvidence.length > 0 ? match.conflictingEvidence[0].field : 'None'}.`;
        
        steps.push(
          { stepNumber: 1, instruction: `Contact ${found?.currentFacilityName || 'Facility'} Intake Desk (${found?.contactPhone || 'Helpline'})`, completed: false },
          { stepNumber: 2, instruction: `Request latest clear photograph of face and identifying marks from facility staff`, completed: false },
          { stepNumber: 3, instruction: match.conflictingEvidence.length > 0 
            ? `Resolve conflict: ${match.conflictingEvidence[0].explanation}`
            : `Verify admission timestamp against disappearance timeline`, completed: false },
          { stepNumber: 4, instruction: `Compare photographic evidence with family records`, completed: false },
          { stepNumber: 5, instruction: `Confirm identity authorization with Incident Commander`, completed: false }
        );
      }
      break;

    case 'UNDER_VERIFICATION':
      title = `Complete Authorized Verification at ${found?.currentFacilityName || 'Facility'}`;
      description = `Field responder or medical supervisor is currently validating physical identity.`;
      rationale = `Case is in active verification state. Biometric/photographic comparison pending sign-off.`;
      steps.push(
        { stepNumber: 1, instruction: `Review responder live photo confirmation at bedside/ward`, completed: true },
        { stepNumber: 2, instruction: `Verify reporter relationship proof or government ID reference`, completed: false },
        { stepNumber: 3, instruction: `Incident Commander official sign-off on identity match`, completed: false }
      );
      break;

    case 'VERIFIED':
      title = `Initiate Secure Family Notification & Reunification Protocol`;
      description = `Identity is 100% verified. Safely contact family and coordinate escort / transfer.`;
      rationale = `Authorized verification complete. Contact reporter ${missing?.reporterName || 'Family'} at ${missing?.reporterContact || 'Contact'}.`;
      steps.push(
        { stepNumber: 1, instruction: `Call verified reporter ${missing?.reporterName || 'Family'} (${missing?.reporterContact || 'Contact'}) with compassionate protocol`, completed: false },
        { stepNumber: 2, instruction: `Provide designated safe pickup location: ${found?.currentFacilityName || 'Facility'} (${found?.foundLocation.address || 'Address'})`, completed: false },
        { stepNumber: 3, instruction: `Arrange medical transport or volunteer escort if patient is injured`, completed: false },
        { stepNumber: 4, instruction: `Record physical handoff and official closure signature`, completed: false }
      );
      break;

    case 'FAMILY_NOTIFIED':
      title = `Facilitate Safe Transit & Physical Reunification`;
      description = `Family is en-route to ${found?.currentFacilityName || 'Reunion Center'}. Prepare discharge documents.`;
      rationale = `Family confirmed arrival ETA. Ready for final handover documentation.`;
      steps.push(
        { stepNumber: 1, instruction: `Reception desk at ${found?.currentFacilityName} alert for family arrival`, completed: true },
        { stepNumber: 2, instruction: `Conduct safe emotional reunion in private relief booth`, completed: false },
        { stepNumber: 3, instruction: `Log official Reunification Handover Record in system`, completed: false }
      );
      break;

    case 'REUNITED':
    case 'CLOSED':
      title = `Case Successfully Reunited & Archived`;
      description = `Person safely reunited with family. Full audit trail recorded.`;
      rationale = `Reunification verified and officially closed.`;
      steps.push(
        { stepNumber: 1, instruction: `Audit logs archived into Disaster Incident Repository`, completed: true },
        { stepNumber: 2, instruction: `Provide post-reunification counseling & relief welfare package`, completed: true }
      );
      break;
  }

  return {
    id: `NBA-${fusedCase.id}`,
    caseId: fusedCase.id,
    priorityScore,
    urgencyLevel,
    title,
    description,
    assignedRole: status === 'VERIFIED' || status === 'FAMILY_NOTIFIED' ? 'command_authority' : 'rescue_team',
    targetFacilityOrTeam,
    contactPhone,
    status: 'PENDING',
    steps,
    rationale,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
