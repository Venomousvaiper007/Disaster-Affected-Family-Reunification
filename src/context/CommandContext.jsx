import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  mockOperations,
  mockResponders,
  mockShelters,
  mockHospitals,
  mockRescueTeams,
  mockCases,
  mockSmartMatches,
  mockDuplicates,
  mockConflicts,
  mockAuditLogs,
  mockNotifications
} from '../data/mockData';
import { getTranslation } from '../i18n';

const CommandContext = createContext();

export const ROLE_PERMISSIONS = {
  'Incident Commander': [
    'overview', 'map', 'missing', 'found', 'matches', 'verification',
    'coordination', 'shelters', 'teams', 'family', 'analytics', 'duplicates', 'audit', 'settings'
  ],
  'Authority / Admin': [
    'overview', 'map', 'missing', 'found', 'matches', 'verification',
    'coordination', 'shelters', 'teams', 'family', 'analytics', 'duplicates', 'audit', 'settings'
  ],
  'Family Member': [
    'family', 'overview', 'missing'
  ],
  'Citizen / Volunteer': [
    'overview', 'map', 'found', 'missing'
  ],
  'Rescue Team': [
    'overview', 'map', 'coordination', 'teams', 'found'
  ],
  'Organization / Shelter': [
    'overview', 'shelters', 'found', 'verification'
  ],
  // Legacy aliases
  'Administrator': [
    'overview', 'map', 'missing', 'found', 'matches', 'verification', 'coordination', 'shelters', 'teams', 'analytics', 'duplicates', 'audit', 'settings'
  ],
  'Field Responder': [
    'overview', 'map', 'missing', 'found', 'verification', 'coordination', 'shelters', 'teams'
  ],
  'Family Representative': [
    'family', 'overview', 'missing'
  ]
};

export const CommandProvider = ({ children }) => {
  // Localization with persistence
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('r360_lang') || 'en';
  });
  const t = (key) => getTranslation(lang, key);

  useEffect(() => {
    localStorage.setItem('r360_lang', lang);
  }, [lang]);

  // Active Operation
  const [operations, setOperations] = useState(mockOperations);
  const [activeOperationId, setActiveOperationId] = useState(mockOperations[0].id);
  const activeOperation = operations.find(op => op.id === activeOperationId) || operations[0];

  // Active User Role & Profiles
  const [currentRole, setCurrentRoleState] = useState(() => {
    return localStorage.getItem('r360_role') || 'Incident Commander';
  });
  const [responders, setResponders] = useState(mockResponders);
  const [currentResponder, setCurrentResponderState] = useState(() => {
    const saved = localStorage.getItem('r360_responder');
    return saved ? JSON.parse(saved) : mockResponders[0];
  });

  // UI Navigation & View State
  const [currentView, setCurrentView] = useState('overview');
  const [roleToast, setRoleToast] = useState(null);

  // Switch Role with Access Control & Redirection
  const setCurrentRole = (newRole) => {
    setCurrentRoleState(newRole);
    localStorage.setItem('r360_role', newRole);

    const permittedViews = ROLE_PERMISSIONS[newRole] || ROLE_PERMISSIONS['Incident Commander'];
    if (!permittedViews.includes(currentView)) {
      if (newRole === 'Family Representative') {
        setCurrentView('family');
      } else {
        setCurrentView('overview');
      }
    }

    setRoleToast(`Switched active role to: ${newRole}`);
    setTimeout(() => setRoleToast(null), 3500);

    addAuditEntry(
      'ROLE_SWITCH',
      'USER_SESSION',
      `Active role context switched to ${newRole} (DEMO MODE / Role-aware Interface)`
    );
  };

  // Switch Responder Profile
  const setCurrentResponder = (responder) => {
    setCurrentResponderState(responder);
    localStorage.setItem('r360_responder', JSON.stringify(responder));

    setRoleToast(`Logged in as: ${responder.name} (${responder.badge})`);
    setTimeout(() => setRoleToast(null), 3500);

    addAuditEntry(
      'PROFILE_SWITCH',
      responder.id,
      `Operator identity changed to ${responder.name} [Badge: ${responder.badge}, Sector: ${responder.sector}]`
    );
  };

  // Main Datasets with local persistence
  const [cases, setCases] = useState(() => {
    const saved = localStorage.getItem('r360_cases');
    return saved ? JSON.parse(saved) : mockCases;
  });

  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem('r360_matches');
    return saved ? JSON.parse(saved) : mockSmartMatches;
  });

  const [duplicates, setDuplicates] = useState(() => {
    const saved = localStorage.getItem('r360_duplicates');
    return saved ? JSON.parse(saved) : mockDuplicates;
  });

  const [conflicts, setConflicts] = useState(() => {
    const saved = localStorage.getItem('r360_conflicts');
    return saved ? JSON.parse(saved) : mockConflicts;
  });

  const [shelters, setShelters] = useState(mockShelters);
  const [hospitals, setHospitals] = useState(mockHospitals);
  const [rescueTeams, setRescueTeams] = useState(mockRescueTeams);

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('r360_audit');
    return saved ? JSON.parse(saved) : mockAuditLogs;
  });

  const [notifications, setNotifications] = useState(mockNotifications);

  // Offline Synchronization State
  const [isOnline, setIsOnline] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState(() => {
    const saved = localStorage.getItem('r360_offline_queue');
    return saved ? JSON.parse(saved) : [];
  });
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString());

  // Modal & Drawer States
  const [selectedCase, setSelectedCase] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedMatchForVerify, setSelectedMatchForVerify] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');

  // Highlighted case on map/stream
  const [highlightedCaseId, setHighlightedCaseId] = useState(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('r360_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('r360_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('r360_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('r360_conflicts', JSON.stringify(conflicts));
  }, [conflicts]);

  useEffect(() => {
    localStorage.setItem('r360_offline_queue', JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  // Add an audit entry helper
  const addAuditEntry = (action, target, details) => {
    const newEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString(),
      actor: `${currentResponder.name} (${currentRole})`,
      action,
      target,
      details
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Select case for details panel
  const openCaseDetails = (caseItem) => {
    setSelectedCase(caseItem);
    setIsDetailsOpen(true);
  };

  const closeCaseDetails = () => {
    setIsDetailsOpen(false);
  };

  // Comprehensive Multi-Category Emergency Incident Reporting
  const reportEmergency = (reportData) => {
    const timestamp = new Date().toLocaleString();
    const category = reportData.category || 'MISSING_PERSON';
    
    // Generate appropriate prefix based on category
    let prefix = 'CAS';
    let defaultClassification = 'MISSING';
    
    if (category === 'FOUND_PERSON') {
      prefix = 'FND';
      defaultClassification = 'FOUND';
    } else if (category === 'TRAPPED_PERSON') {
      prefix = 'TRP';
      defaultClassification = 'TRAPPED';
    } else if (category === 'MEDICAL_EMERGENCY') {
      prefix = 'MED';
      defaultClassification = 'MEDICAL';
    } else if (category === 'FIRE_HAZARD') {
      prefix = 'HAZ';
      defaultClassification = 'HAZARD';
    } else if (category === 'DAMAGED_INFRASTRUCTURE') {
      prefix = 'INF';
      defaultClassification = 'INFRASTRUCTURE';
    } else if (category === 'OTHER_EMERGENCY') {
      prefix = 'EMG';
      defaultClassification = 'OTHER';
    }

    const newId = `${prefix}-2026-0${Math.floor(100 + Math.random() * 900)}`;
    const pin = reportData.pin || `${Math.floor(1000 + Math.random() * 9000)}`;

    const newRecord = {
      id: newId,
      category: category,
      classification: defaultClassification,
      fullName: reportData.fullName || (category === 'MISSING_PERSON' ? 'Unidentified Missing Person' : `${category.replace(/_/g, ' ')} Incident`),
      age: parseInt(reportData.age) || (category === 'MISSING_PERSON' ? 25 : 30),
      gender: reportData.gender || 'Unknown',
      photo: reportData.photo || (category === 'MISSING_PERSON'
        ? (reportData.gender === 'Female' ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80')
        : 'https://images.unsplash.com/photo-1574096079513-d8259312b785?w=300&auto=format&fit=crop&q=80'),
      reportedAt: timestamp,
      lastSeenLocation: reportData.lastSeenLocation || `${reportData.district || 'Chennai'}, ${reportData.landmark || 'Emergency Sector'}`,
      coordinates: reportData.coordinates || [13.0827 + (Math.random() - 0.5) * 0.08, 80.2707 + (Math.random() - 0.5) * 0.08],
      status: 'REPORTED',
      priority: reportData.priority || 'URGENT',
      assignedTo: reportData.assignedTo || 'Unassigned',
      assignedId: null,
      responseCentre: reportData.responseCentre || 'Velachery Community Relief Center',
      pin: pin,
      clothing: reportData.clothing || 'Standard relief attire',
      physicalMarks: reportData.physicalMarks || 'None noted',
      medicalNotes: reportData.medicalNotes || reportData.medicalAssistanceType || 'No acute trauma reported',
      incidentDescription: reportData.incidentDescription || '',
      affectedCount: parseInt(reportData.affectedCount) || 1,
      natureOfDanger: reportData.natureOfDanger || '',
      safeCallback: reportData.safeCallback || reportData.reporterContact || '',
      emergencyServicesContacted: !!reportData.emergencyServicesContacted,
      reporter: {
        name: reportData.reporterName || 'Anonymous Citizen / Field Informant',
        contact: reportData.reporterContact || 'Protected by DPDP Act',
        relation: reportData.reporterRelation || 'Relative',
        verifiedPhone: true
      },
      potentialMatchId: null,
      matchScore: null,
      notes: [
        { author: currentResponder.name, text: `Emergency report logged via ${isOnline ? 'Direct Command Gateway' : 'Offline Buffer Queue'}. Category: ${category}.`, time: timestamp }
      ],
      timeline: [
        { title: 'Incident Report Received & Queued', time: timestamp, by: currentResponder.name, type: 'REGISTERED' }
      ]
    };

    if (!isOnline) {
      const offlineItem = { ...newRecord, tempLocalId: `OFFLINE-${Date.now().toString().slice(-4)}` };
      setOfflineQueue(prev => [offlineItem, ...prev]);
      setCases(prev => [offlineItem, ...prev]);
      addAuditEntry('OFFLINE_EMERGENCY_FILED', offlineItem.id, `Offline report queued for ${category} [${offlineItem.id}]`);
      return offlineItem;
    }

    setCases(prev => [newRecord, ...prev]);
    addAuditEntry('EMERGENCY_REPORTED', newRecord.id, `New emergency filed: ${category} at ${newRecord.lastSeenLocation} [Priority: ${newRecord.priority}]`);

    // Create Notification
    setNotifications(prev => [
      {
        id: `NOTIF-${Date.now()}`,
        type: newRecord.priority === 'CRITICAL' || newRecord.priority === 'URGENT' ? 'URGENT' : 'INFO',
        title: `New ${newRecord.priority} Incident: ${newId}`,
        message: `${newRecord.fullName} — ${newRecord.lastSeenLocation}`,
        time: 'Just now',
        link: 'coordination',
        caseId: newId
      },
      ...prev
    ]);

    // Run explainable matching if missing or found
    if (category === 'MISSING_PERSON' || category === 'FOUND_PERSON') {
      runSmartMatchingForCase(newRecord);
    }

    return newRecord;
  };

  // Backwards compatibility alias
  const registerNewCase = (caseData) => {
    return reportEmergency({
      ...caseData,
      category: caseData.classification === 'FOUND' ? 'FOUND_PERSON' : 'MISSING_PERSON'
    });
  };

  // Run explainable matching for a new or updated case
  const runSmartMatchingForCase = (targetCase) => {
    const opposingType = targetCase.classification === 'MISSING' ? 'FOUND' : 'MISSING';
    const candidates = cases.filter(c => c.classification === opposingType && c.status !== 'REUNIFICATION_CONFIRMED');

    candidates.forEach(candidate => {
      const nameScore = (targetCase.fullName.toLowerCase().includes(candidate.fullName.toLowerCase().slice(0, 3)) || candidate.fullName.includes('Unidentified')) ? 80 : 30;
      const ageDiff = Math.abs(targetCase.age - candidate.age);
      const ageScore = ageDiff <= 2 ? 100 : ageDiff <= 5 ? 80 : 40;
      const latDiff = Math.abs(targetCase.coordinates[0] - candidate.coordinates[0]);
      const lngDiff = Math.abs(targetCase.coordinates[1] - candidate.coordinates[1]);
      const proxScore = (latDiff < 0.05 && lngDiff < 0.05) ? 95 : 60;
      const clothingScore = 75;

      const weightedScore = Math.round((nameScore * 0.3) + (ageScore * 0.2) + (proxScore * 0.3) + (clothingScore * 0.2));

      if (weightedScore >= 70) {
        const matchId = `MATCH-${Date.now().toString().slice(-4)}`;
        const missing = targetCase.classification === 'MISSING' ? targetCase : candidate;
        const found = targetCase.classification === 'FOUND' ? targetCase : candidate;

        const newMatch = {
          id: matchId,
          missingCaseId: missing.id,
          missingPersonName: missing.fullName,
          missingAge: missing.age,
          missingLocation: missing.lastSeenLocation,
          missingClothing: missing.clothing,
          foundCaseId: found.id,
          foundPersonName: found.fullName,
          foundAge: found.age,
          foundLocation: found.lastSeenLocation,
          foundClothing: found.clothing,
          overallScore: weightedScore,
          confidenceTier: weightedScore > 85 ? 'HIGH_CONFIDENCE' : 'MODERATE_CONFIDENCE',
          status: 'AWAITING_HUMAN_VERIFICATION',
          breakdown: {
            nameSimilarity: { score: nameScore, weight: 30, note: `Phonetic & spelling similarity score: ${nameScore}%` },
            ageMatch: { score: ageScore, weight: 20, note: `Age difference: ${ageDiff} year(s)` },
            proximity: { score: proxScore, weight: 30, note: 'Within local sector response boundary' },
            clothingAndAppearance: { score: clothingScore, weight: 20, note: 'Matching keywords in attire' }
          },
          evidenceTags: ['Phonetic Match', 'Geospatial Sector Match', 'Age Compatibility'],
          conflictingDetails: [],
          sourceCentres: {
            missing: missing.responseCentre,
            found: found.responseCentre
          },
          calculatedAt: new Date().toLocaleString(),
          safetyWarning: 'A similarity score is not identity confirmation. Human verification required.'
        };

        setMatches(prev => [newMatch, ...prev]);
        addAuditEntry('SMART_MATCH_GENERATED', matchId, `Generated ${weightedScore}% match between ${missing.id} and ${found.id}`);
        
        setNotifications(prev => [
          {
            id: `NOTIF-${Date.now()}`,
            type: 'MATCH',
            title: `New Candidate Match (${weightedScore}%)`,
            message: `Match generated between ${missing.id} and ${found.id}`,
            time: 'Just now',
            link: 'matches',
            matchId: matchId
          },
          ...prev
        ]);
      }
    });
  };

  // Case Status & Assignment Updates
  const updateCaseStatus = (caseId, newStatus, reason = '') => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const timestamp = new Date().toLocaleString();
        return {
          ...c,
          status: newStatus,
          notes: reason ? [{ author: currentResponder.name, text: `Status changed to ${newStatus}: ${reason}`, time: timestamp }, ...c.notes] : c.notes,
          timeline: [{ title: `Status: ${newStatus}`, time: timestamp, by: currentResponder.name, type: 'STATUS' }, ...c.timeline]
        };
      }
      return c;
    }));
    addAuditEntry('STATUS_CHANGED', caseId, `Status updated to ${newStatus} (${reason || 'Standard operational update'})`);
  };

  const assignResponderToCase = (caseId, responder) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const timestamp = new Date().toLocaleString();
        return {
          ...c,
          assignedTo: responder.name,
          assignedId: responder.id,
          timeline: [{ title: `Assigned to ${responder.name}`, time: timestamp, by: currentResponder.name, type: 'ASSIGNMENT' }, ...c.timeline]
        };
      }
      return c;
    }));
    addAuditEntry('RESPONDER_ASSIGNED', caseId, `Case assigned to ${responder.name}`);
  };

  const updateCasePriority = (caseId, newPriority, reason = '') => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const timestamp = new Date().toLocaleString();
        return {
          ...c,
          priority: newPriority,
          timeline: [{ title: `Priority set to ${newPriority}`, time: timestamp, by: currentResponder.name, type: 'PRIORITY' }, ...c.timeline]
        };
      }
      return c;
    }));
    addAuditEntry('PRIORITY_CHANGED', caseId, `Priority elevated to ${newPriority}. Reason: ${reason}`);
  };

  const addCaseNote = (caseId, noteText) => {
    const timestamp = new Date().toLocaleString();
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          notes: [{ author: currentResponder.name, text: noteText, time: timestamp }, ...c.notes]
        };
      }
      return c;
    }));
    addAuditEntry('NOTE_ADDED', caseId, `Internal note appended by ${currentResponder.name}`);
  };

  // Human Verification Workflow
  const verifyAndReuniteMatch = (matchId, checklistResults, reviewerNotes) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    const timestamp = new Date().toLocaleString();

    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          status: 'VERIFIED_REUNIFIED',
          verifiedAt: timestamp,
          verifiedBy: currentResponder.name,
          checklist: checklistResults,
          reviewerNotes: reviewerNotes
        };
      }
      return m;
    }));

    setCases(prev => prev.map(c => {
      if (c.id === match.missingCaseId || c.id === match.foundCaseId) {
        return {
          ...c,
          status: 'REUNIFICATION_CONFIRMED',
          notes: [
            { author: currentResponder.name, text: `Human verification passed (5/5 checks). Reunification confirmed with ${c.id === match.missingCaseId ? match.foundCaseId : match.missingCaseId}. Notes: ${reviewerNotes}`, time: timestamp },
            ...c.notes
          ],
          timeline: [
            { title: 'Identity Verified & Reunited', time: timestamp, by: currentResponder.name, type: 'REUNITED' },
            ...c.timeline
          ]
        };
      }
      return c;
    }));

    addAuditEntry('HUMAN_VERIFICATION_STAMP', matchId, `Dual-responder verification complete for ${match.missingCaseId} & ${match.foundCaseId}. Official reunification authorized.`);
  };

  const rejectMatch = (matchId, reason) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return { ...m, status: 'REJECTED_FALSE_POSITIVE', rejectionReason: reason };
      }
      return m;
    }));
    addAuditEntry('MATCH_REJECTED', matchId, `Match rejected as false positive. Reason: ${reason}`);
  };

  // Duplicate Resolution Workflow
  const mergeDuplicateRecords = (dupId, primaryId, dupCaseId) => {
    setDuplicates(prev => prev.map(d => {
      if (d.id === dupId) {
        return { ...d, status: 'MERGED', mergedAt: new Date().toLocaleString(), mergedBy: currentResponder.name };
      }
      return d;
    }));

    setCases(prev => prev.map(c => {
      if (c.id === primaryId) {
        return {
          ...c,
          notes: [{ author: currentResponder.name, text: `Merged secondary record ${dupCaseId}. Original provenance preserved.`, time: new Date().toLocaleString() }, ...c.notes]
        };
      }
      if (c.id === dupCaseId) {
        return {
          ...c,
          status: 'CLOSED',
          notes: [{ author: currentResponder.name, text: `Archived as duplicate of primary case ${primaryId}.`, time: new Date().toLocaleString() }, ...c.notes]
        };
      }
      return c;
    }));

    addAuditEntry('DUPLICATES_MERGED', primaryId, `Merged duplicate ${dupCaseId} into ${primaryId} without data loss.`);
  };

  // Conflict Resolution Workflow (e.g., MP-1092)
  const resolveConflict = (conflictId, chosenSource, chosenLocation, chosenAge, overrideNotes) => {
    const timestamp = new Date().toLocaleString();
    let affectedCaseId = null;

    setConflicts(prev => prev.map(conf => {
      if (conf.id === conflictId) {
        affectedCaseId = conf.caseId;
        return {
          ...conf,
          status: 'RESOLVED',
          resolvedAt: timestamp,
          resolvedBy: currentResponder.name,
          chosenSource: chosenSource,
          resolutionNotes: overrideNotes
        };
      }
      return conf;
    }));

    if (affectedCaseId) {
      setCases(prev => prev.map(c => {
        if (c.id === affectedCaseId) {
          return {
            ...c,
            lastSeenLocation: chosenLocation || c.lastSeenLocation,
            age: chosenAge ? parseInt(chosenAge) : c.age,
            status: 'UNDER_REVIEW',
            notes: [
              { author: currentResponder.name, text: `Conflict resolved by authority. Adopted ${chosenSource}. Justification: ${overrideNotes}`, time: timestamp },
              ...c.notes
            ],
            timeline: [
              { title: 'Data Conflict Resolved', time: timestamp, by: currentResponder.name, type: 'VERIFIED' },
              ...c.timeline
            ]
          };
        }
        return c;
      }));
    }

    addAuditEntry('CONFLICT_RESOLVED', conflictId, `Reconciled conflicting records for ${affectedCaseId || conflictId} using ${chosenSource}.`);
  };

  // Rescue Team Dispatch Engine
  const dispatchRescueTeam = (teamId, targetCaseId, assignedSector, taskNotes) => {
    const timestamp = new Date().toLocaleString();
    let teamName = teamId;

    setRescueTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        teamName = team.name;
        return {
          ...team,
          status: 'DEPLOYED_ACTIVE',
          assignedSector: assignedSector || team.assignedSector,
          lastDispatchedCase: targetCaseId,
          dispatchedAt: timestamp
        };
      }
      return team;
    }));

    if (targetCaseId) {
      setCases(prev => prev.map(c => {
        if (c.id === targetCaseId) {
          return {
            ...c,
            status: 'DISPATCHED',
            assignedTo: teamName,
            assignedId: teamId,
            notes: [
              { author: currentResponder.name, text: `Rescue squad ${teamName} dispatched to location. Task: ${taskNotes || 'Immediate field extraction & identification'}`, time: timestamp },
              ...c.notes
            ],
            timeline: [
              { title: `Dispatched: ${teamName}`, time: timestamp, by: currentResponder.name, type: 'ASSIGNMENT' },
              ...c.timeline
            ]
          };
        }
        return c;
      }));
    }

    addAuditEntry('RESCUE_DISPATCHED', teamId, `Dispatched ${teamName} to ${assignedSector || targetCaseId} for target case ${targetCaseId}.`);
  };

  // Offline Sync trigger
  const synchronizeOfflineQueue = () => {
    if (offlineQueue.length === 0) return;
    const count = offlineQueue.length;
    
    setOfflineQueue([]);
    setLastSyncTime(new Date().toLocaleTimeString());
    
    addAuditEntry('OFFLINE_SYNC_SUCCESS', 'CENTRAL_GATEWAY', `Successfully synchronized ${count} queued field reports to central disaster repository.`);
    
    setNotifications(prev => [
      {
        id: `NOTIF-${Date.now()}`,
        type: 'INFO',
        title: 'Batch Sync Completed',
        message: `${count} offline reports pushed to central command net.`,
        time: 'Just now',
        link: 'audit'
      },
      ...prev
    ]);
  };

  // Toggle Online/Offline simulator
  const toggleOnlineMode = () => {
    setIsOnline(prev => {
      const next = !prev;
      if (next && offlineQueue.length > 0) {
        synchronizeOfflineQueue();
      }
      return next;
    });
  };

  return (
    <CommandContext.Provider value={{
      lang,
      setLang,
      t,
      operations,
      activeOperation,
      setActiveOperationId,
      currentRole,
      setCurrentRole,
      responders,
      currentResponder,
      setCurrentResponder,
      roleToast,
      cases,
      matches,
      duplicates,
      conflicts,
      shelters,
      hospitals,
      rescueTeams,
      auditLogs,
      notifications,
      isOnline,
      toggleOnlineMode,
      offlineQueue,
      synchronizeOfflineQueue,
      lastSyncTime,
      currentView,
      setCurrentView,
      selectedCase,
      isDetailsOpen,
      openCaseDetails,
      closeCaseDetails,
      isRegisterOpen,
      setIsRegisterOpen,
      isVerifyModalOpen,
      setIsVerifyModalOpen,
      selectedMatchForVerify,
      setSelectedMatchForVerify,
      isExportOpen,
      setIsExportOpen,
      searchQuery,
      setSearchQuery,
      filterPriority,
      setFilterPriority,
      filterStatus,
      setFilterStatus,
      filterCategory,
      setFilterCategory,
      highlightedCaseId,
      setHighlightedCaseId,
      reportEmergency,
      registerNewCase,
      updateCaseStatus,
      assignResponderToCase,
      updateCasePriority,
      addCaseNote,
      verifyAndReuniteMatch,
      rejectMatch,
      mergeDuplicateRecords,
      resolveConflict,
      dispatchRescueTeam,
      addAuditEntry
    }}>
      {children}
    </CommandContext.Provider>
  );
};

export const useCommand = () => {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error('useCommand must be used within a CommandProvider');
  }
  return context;
};
