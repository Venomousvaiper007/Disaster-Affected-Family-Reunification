import type { CaseStatus, FusedCase, UserRole, AuditLogEntry } from '../types';

export interface TransitionValidationResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Validates whether a user with a given role can transition a case to the target status.
 */
export function validateStatusTransition(
  currentStatus: CaseStatus,
  targetStatus: CaseStatus,
  userRole: UserRole
): TransitionValidationResult {
  // Define strict state machine progression order
  const stateOrder: CaseStatus[] = [
    'UNVERIFIED',
    'POSSIBLE_MATCH',
    'UNDER_VERIFICATION',
    'VERIFIED',
    'FAMILY_NOTIFIED',
    'REUNITED',
    'CLOSED',
  ];

  const currentIndex = stateOrder.indexOf(currentStatus);
  const targetIndex = stateOrder.indexOf(targetStatus);

  if (targetIndex < 0) {
    return { allowed: false, reason: `Unknown target status: ${targetStatus}` };
  }

  // Allow closing from any state if authority
  if (targetStatus === 'CLOSED') {
    if (userRole === 'command_authority') return { allowed: true };
    return { allowed: false, reason: 'Only Command Authority can mark a case as CLOSED.' };
  }

  // Prevent backwards transitions except by authority
  if (targetIndex <= currentIndex && userRole !== 'command_authority') {
    return { allowed: false, reason: 'Cannot move case backwards without Incident Commander authorization.' };
  }

  // Role permissions per target state
  switch (targetStatus) {
    case 'POSSIBLE_MATCH':
      // System or responder can trigger candidate match review
      return { allowed: true };

    case 'UNDER_VERIFICATION':
      if (userRole === 'rescue_team' || userRole === 'hospital_shelter' || userRole === 'command_authority') {
        return { allowed: true };
      }
      return { allowed: false, reason: 'Only field responders, hospital staff, or authority can begin verification.' };

    case 'VERIFIED':
      if (userRole === 'hospital_shelter' || userRole === 'command_authority') {
        return { allowed: true };
      }
      return { allowed: false, reason: 'Official verification requires Hospital Supervisor or Incident Commander authorization.' };

    case 'FAMILY_NOTIFIED':
      if (currentStatus !== 'VERIFIED' && userRole !== 'command_authority') {
        return { allowed: false, reason: 'CRITICAL SAFETY RULE: Cannot notify family before official verification is complete!' };
      }
      if (userRole === 'command_authority' || userRole === 'hospital_shelter') {
        return { allowed: true };
      }
      return { allowed: false, reason: 'Family notification must be performed by designated authority or hospital counselor.' };

    case 'REUNITED':
      if (currentStatus !== 'FAMILY_NOTIFIED' && currentStatus !== 'VERIFIED' && userRole !== 'command_authority') {
        return { allowed: false, reason: 'Must complete verification and family contact before final reunification handover.' };
      }
      return { allowed: true };

    default:
      return { allowed: true };
  }
}

/**
 * Creates a formatted, regulatory-compliant audit log entry.
 */
export function createAuditLog(
  actorName: string,
  actorRole: UserRole,
  action: string,
  caseId: string,
  details: string
): AuditLogEntry {
  return {
    id: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    actorName,
    actorRole,
    action,
    caseId,
    details,
  };
}

/**
 * Filters case information for public / family view to prevent panic, rumors, or unverified leaks.
 */
export function getSafeFamilyCaseView(fusedCase: FusedCase) {
  const missing = fusedCase.missingReport;
  const status = fusedCase.status;

  // Masked or reassuring status
  let safeStatusBadge = 'Active Search Underway';
  let safeLocation = 'Coordinated Search Zone';
  let safeNextStep = 'Emergency units are actively checking regional intake records.';
  let showFoundDetails = false;

  switch (status) {
    case 'UNVERIFIED':
      safeStatusBadge = 'Searching Intake Registries';
      safeLocation = missing ? missing.lastSeenLocation.landmark || missing.lastSeenLocation.address : 'Disaster Region';
      safeNextStep = 'Automated record matching active across all operational relief centers.';
      break;

    case 'POSSIBLE_MATCH':
      // Do NOT leak raw unverified match details to prevent panic!
      safeStatusBadge = 'Potential Lead Under Review';
      safeLocation = 'Regional Verification In Progress';
      safeNextStep = 'Field officers are reviewing matching records. Standby for official confirmation.';
      break;

    case 'UNDER_VERIFICATION':
      safeStatusBadge = 'Official Verification In Progress';
      safeLocation = 'Designated Relief / Medical Center';
      safeNextStep = 'A certified responder is verifying physical identification at the center.';
      break;

    case 'VERIFIED':
    case 'FAMILY_NOTIFIED':
      safeStatusBadge = 'Person Located & Verified Safe';
      safeLocation = fusedCase.foundRecord?.currentFacilityName || 'Designated Hospital / Shelter';
      safeNextStep = 'Designated family contact coordinator is reaching out to arrange safe pickup.';
      showFoundDetails = true;
      break;

    case 'REUNITED':
      safeStatusBadge = 'Reunited with Family';
      safeLocation = fusedCase.reunificationDetails?.location || 'Relief Station';
      safeNextStep = 'Case completed. Support & welfare services available 24/7.';
      showFoundDetails = true;
      break;

    case 'CLOSED':
      safeStatusBadge = 'Case Completed & Closed';
      safeLocation = 'Archived';
      safeNextStep = 'Case resolved.';
      break;
  }

  return {
    caseNumber: fusedCase.caseNumber,
    personName: missing?.fullName || 'Registered Individual',
    age: missing?.age || fusedCase.foundRecord?.traits.age,
    gender: missing?.gender || fusedCase.foundRecord?.gender,
    status,
    safeStatusBadge,
    safeLocation,
    safeNextStep,
    lastUpdated: fusedCase.updatedAt,
    showFoundDetails,
    facilityName: showFoundDetails ? fusedCase.foundRecord?.currentFacilityName : undefined,
    facilityPhone: showFoundDetails ? fusedCase.foundRecord?.contactPhone : undefined,
    timeline: fusedCase.timeline.filter(e => e.verified || showFoundDetails),
  };
}
