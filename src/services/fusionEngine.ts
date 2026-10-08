import type { MissingPersonReport, FoundPersonRecord, CandidateMatch } from '../types';

// Helper: Calculate Levenshtein Distance
function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix: number[][] = [];
  for (let i = 0; i <= bn; ++i) matrix[i] = [i];
  for (let i = 0; i <= an; ++i) matrix[0][i] = i;
  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1).toLowerCase() === a.charAt(j - 1).toLowerCase()) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1) // insertion / deletion
        );
      }
    }
  }
  return matrix[bn][an];
}

// Helper: String similarity ratio (0 to 1)
function stringSimilarity(s1: string, s2: string): number {
  if (!s1 || !s2) return 0;
  const str1 = s1.trim().toLowerCase();
  const str2 = s2.trim().toLowerCase();
  if (str1 === str2) return 1;
  const distance = levenshteinDistance(str1, str2);
  const maxLen = Math.max(str1.length, str2.length);
  return Math.max(0, 1 - distance / maxLen);
}

// Helper: Haversine distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * LIVE CASE FUSION ENGINE
 * Analyzes multi-source records, computes explainable match confidence,
 * detects supporting evidence, flags conflicts without premature rejection,
 * and identifies missing information.
 */
export function evaluateCandidateMatch(
  missing: MissingPersonReport,
  found: FoundPersonRecord
): CandidateMatch {
  const supportingEvidence: string[] = [];
  const conflictingEvidence: CandidateMatch['conflictingEvidence'] = [];
  const missingInformation: string[] = [];
  const recommendedVerification: string[] = [];

  // 1. Name Compatibility
  let nameScore = 50; // Default baseline if unidentified
  if (found.isIdentified && found.givenName) {
    const sim = stringSimilarity(missing.fullName, found.givenName);
    nameScore = Math.round(sim * 100);
    if (sim >= 0.8) {
      supportingEvidence.push(`Full Name closely matches: "${missing.fullName}" ≈ "${found.givenName}"`);
    } else if (sim < 0.3) {
      conflictingEvidence.push({
        field: 'Given Name',
        missingRecordValue: missing.fullName,
        foundRecordValue: found.givenName,
        explanation: `Name on record (${found.givenName}) differs from missing report (${missing.fullName})`,
        severity: 'MEDIUM',
      });
    }
  } else {
    missingInformation.push('Rescued individual is currently unidentified / unable to state name');
    nameScore = 70; // High neutrality when unconscious/unidentified
  }

  // 2. Gender Compatibility
  let genderScore = 100;
  if (found.gender !== 'UNKNOWN') {
    if (missing.gender === found.gender) {
      genderScore = 100;
      supportingEvidence.push(`Gender match: ${missing.gender}`);
    } else {
      genderScore = 10;
      conflictingEvidence.push({
        field: 'Gender',
        missingRecordValue: missing.gender,
        foundRecordValue: found.gender,
        explanation: `Gender mismatch (${missing.gender} vs ${found.gender})`,
        severity: 'HIGH',
      });
    }
  } else {
    missingInformation.push('Rescued record has gender marked as UNKNOWN');
    genderScore = 80;
  }

  // 3. Age Compatibility
  // (Crucial rule: Missing data or approximate range is NOT a mismatch!)
  let ageScore = 80;
  const missingAge = missing.age;
  const foundAgeMin = found.estimatedAgeMin ?? found.traits.approxAgeMin ?? (found.traits.age ? found.traits.age - 2 : undefined);
  const foundAgeMax = found.estimatedAgeMax ?? found.traits.approxAgeMax ?? (found.traits.age ? found.traits.age + 2 : undefined);

  if (foundAgeMin !== undefined && foundAgeMax !== undefined) {
    if (missingAge >= foundAgeMin && missingAge <= foundAgeMax) {
      ageScore = 100;
      supportingEvidence.push(`Age ${missingAge} falls directly within intake estimate (${foundAgeMin}–${foundAgeMax} yrs)`);
    } else {
      const diff = Math.min(Math.abs(missingAge - foundAgeMin), Math.abs(missingAge - foundAgeMax));
      if (diff <= 3) {
        ageScore = 85;
        supportingEvidence.push(`Age is within acceptable triage tolerance (±${diff} yrs variance)`);
      } else {
        ageScore = Math.max(20, 100 - diff * 12);
        conflictingEvidence.push({
          field: 'Age',
          missingRecordValue: `${missingAge} years`,
          foundRecordValue: `${foundAgeMin}–${foundAgeMax} years`,
          explanation: `Age differs by ${diff} years from initial visual triage estimate`,
          severity: diff > 10 ? 'HIGH' : 'LOW',
        });
      }
    }
  } else if (found.traits.age !== undefined) {
    const diff = Math.abs(missingAge - found.traits.age);
    if (diff === 0) {
      ageScore = 100;
      supportingEvidence.push(`Exact age match: ${missingAge} years`);
    } else if (diff <= 3) {
      ageScore = 85;
      supportingEvidence.push(`Age close (${missingAge} vs ${found.traits.age} yrs)`);
    } else {
      ageScore = Math.max(20, 100 - diff * 10);
      conflictingEvidence.push({
        field: 'Age',
        missingRecordValue: `${missingAge} years`,
        foundRecordValue: `${found.traits.age} years`,
        explanation: `Age difference of ${diff} years`,
        severity: 'MEDIUM',
      });
    }
  } else {
    missingInformation.push('Found record lacks verified age estimation');
    ageScore = 75;
  }

  // 4. Distinguishing Marks & Scars (Very High Discriminative Power)
  let physicalScore = 70;
  const missingMarks = missing.traits.distinguishingMarks || [];
  const foundMarks = found.traits.distinguishingMarks || [];

  if (missingMarks.length > 0 && foundMarks.length > 0) {
    let markMatchCount = 0;
    for (const mMark of missingMarks) {
      for (const fMark of foundMarks) {
        const mTokens = mMark.toLowerCase().split(/\s+/);
        const fTokens = fMark.toLowerCase().split(/\s+/);
        const common = mTokens.filter(t => fTokens.includes(t) && t.length > 2);
        if (common.length >= 2 || stringSimilarity(mMark, fMark) > 0.6) {
          markMatchCount++;
          supportingEvidence.push(`Confirmed identifying mark: "${mMark}" matches "${fMark}"`);
        }
      }
    }
    if (markMatchCount > 0) {
      physicalScore = 98;
    } else {
      physicalScore = 65;
      missingInformation.push('No specific overlapping scars verified between reports');
    }
  } else if (missingMarks.length > 0 && foundMarks.length === 0) {
    missingInformation.push(`Missing report specifies mark: "${missingMarks.join(', ')}", but facility intake has not inspected marks yet`);
    physicalScore = 75;
    recommendedVerification.push(`Inspect individual for documented mark: "${missingMarks.join(', ')}"`);
  } else {
    physicalScore = 80;
  }

  // 5. Clothing Comparison (Conflict should NOT discard case, but be noted)
  let clothingScore = 75;
  const mClothing = `${missing.traits.clothingUpper || ''} ${missing.traits.clothingLower || ''}`.trim().toLowerCase();
  const fClothing = `${found.traits.clothingUpper || ''} ${found.traits.clothingLower || ''}`.trim().toLowerCase();

  if (mClothing && fClothing) {
    const sim = stringSimilarity(mClothing, fClothing);
    if (sim > 0.6 || (mClothing.includes('blue') && fClothing.includes('blue')) || (mClothing.includes('red') && fClothing.includes('red'))) {
      clothingScore = 95;
      supportingEvidence.push(`Clothing aligns: "${missing.traits.clothingUpper || ''}" ≈ "${found.traits.clothingUpper || ''}"`);
    } else {
      // Clothing conflict: person might have changed clothes, been covered with emergency blanket, etc.
      clothingScore = 55;
      conflictingEvidence.push({
        field: 'Clothing',
        missingRecordValue: `${missing.traits.clothingUpper || ''}, ${missing.traits.clothingLower || ''}`,
        foundRecordValue: `${found.traits.clothingUpper || ''}, ${found.traits.clothingLower || ''}`,
        explanation: `Clothing differs: Family reported (${missing.traits.clothingUpper || 'N/A'}), but intake recorded (${found.traits.clothingUpper || 'N/A'}). Note: Displaced persons often receive relief apparel.`,
        severity: 'LOW',
      });
      recommendedVerification.push('Check if original clothes were discarded or changed during emergency rescue/hospital admission');
    }
  } else {
    missingInformation.push('Incomplete clothing description on one of the records');
    clothingScore = 70;
  }

  // 6. Geolocation Proximity
  let locationScore = 80;
  const distanceKm = calculateDistanceKm(
    missing.lastSeenLocation.lat,
    missing.lastSeenLocation.lng,
    found.foundLocation.lat,
    found.foundLocation.lng
  );

  if (distanceKm <= 3.0) {
    locationScore = 98;
    supportingEvidence.push(`High geographic correlation: Found within ${distanceKm.toFixed(1)} km of last seen area (${found.foundLocation.landmark || found.foundLocation.address})`);
  } else if (distanceKm <= 12.0) {
    locationScore = 85;
    supportingEvidence.push(`Within expected regional disaster evacuation corridor (${distanceKm.toFixed(1)} km from last seen coordinate)`);
  } else if (distanceKm <= 35.0) {
    locationScore = 65;
    conflictingEvidence.push({
      field: 'Location Proximity',
      missingRecordValue: missing.lastSeenLocation.address,
      foundRecordValue: found.foundLocation.address,
      explanation: `Location distance is ${distanceKm.toFixed(1)} km. Requires verification of ambulance/evacuation transit route.`,
      severity: 'LOW',
    });
  } else {
    locationScore = 40;
    conflictingEvidence.push({
      field: 'Location Proximity',
      missingRecordValue: missing.lastSeenLocation.address,
      foundRecordValue: found.foundLocation.address,
      explanation: `Distance is ${distanceKm.toFixed(1)} km (Unusually far from last reported coordinates)`,
      severity: 'MEDIUM',
    });
  }

  // 7. Timeline Consistency
  let timelineScore = 90;
  let timelineConsistency: CandidateMatch['timelineConsistency'] = 'CONSISTENT';

  const lastSeenEpoch = new Date(missing.lastSeenTime).getTime();
  const foundEpoch = new Date(found.foundTime).getTime();

  if (!isNaN(lastSeenEpoch) && !isNaN(foundEpoch)) {
    if (foundEpoch >= lastSeenEpoch) {
      const hoursDiff = (foundEpoch - lastSeenEpoch) / (1000 * 60 * 60);
      if (hoursDiff <= 48) {
        timelineScore = 100;
        timelineConsistency = 'CONSISTENT';
        supportingEvidence.push(`Chronological timeline is completely valid: Rescue occurred ${hoursDiff.toFixed(1)} hours after last sighting`);
      } else {
        timelineScore = 85;
        timelineConsistency = 'PLAUSIBLE';
        supportingEvidence.push(`Timeline plausible (${Math.round(hoursDiff / 24)} days elapsed between disappearance and intake)`);
      }
    } else {
      // Found time is BEFORE last seen time
      timelineScore = 20;
      timelineConsistency = 'IMPOSSIBLE';
      conflictingEvidence.push({
        field: 'Timeline Anomaly',
        missingRecordValue: `Last seen: ${missing.lastSeenTime}`,
        foundRecordValue: `Rescued at: ${found.foundTime}`,
        explanation: 'Intake timestamp precedes reported disappearance time. Check time-zone or logging entry errors.',
        severity: 'HIGH',
      });
      recommendedVerification.push('Verify intake log timestamp with facility desk clerk');
    }
  }

  // 8. Photographic Evidence Bonus
  if (missing.photoUrl && found.photoUrl) {
    supportingEvidence.push('Both records possess photographic assets available for biometric / authority facial comparison');
    recommendedVerification.push('Compare high-resolution face and ear structure photographs side-by-side');
  } else if (missing.photoUrl && !found.photoUrl) {
    recommendedVerification.push(`Request immediate photo capture at ${found.currentFacilityName}`);
  }

  // Weighted Total Calculation
  // Weights: Name (15%), Gender (15%), Age (20%), Scars/Physical (20%), Clothing (10%), Location (10%), Timeline (10%)
  const weightedSum =
    nameScore * 0.15 +
    genderScore * 0.15 +
    ageScore * 0.20 +
    physicalScore * 0.20 +
    clothingScore * 0.10 +
    locationScore * 0.10 +
    timelineScore * 0.10;

  // Apply penalty only for high-severity hard conflicts
  let penalty = 0;
  conflictingEvidence.forEach(c => {
    if (c.severity === 'HIGH') penalty += 20;
    if (c.severity === 'MEDIUM') penalty += 8;
  });

  const overallScore = Math.max(10, Math.min(99, Math.round(weightedSum - penalty)));

  let confidenceLabel: CandidateMatch['confidenceLabel'] = 'LOW';
  if (overallScore >= 85) confidenceLabel = 'VERY_HIGH';
  else if (overallScore >= 70) confidenceLabel = 'HIGH';
  else if (overallScore >= 50) confidenceLabel = 'MODERATE';

  return {
    id: `MATCH-${missing.id}-${found.id}`,
    missingReportId: missing.id,
    foundPersonId: found.id,
    overallScore,
    confidenceLabel,
    nameScore,
    ageScore,
    genderScore,
    physicalScore,
    clothingScore,
    locationScore,
    timelineScore,
    supportingEvidence,
    conflictingEvidence,
    missingInformation,
    timelineConsistency,
    recommendedVerification,
    createdAt: new Date().toISOString(),
  };
}
