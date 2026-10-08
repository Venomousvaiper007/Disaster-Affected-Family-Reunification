import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  X,
  AlertTriangle,
  UserX,
  UserCheck,
  LifeBuoy,
  HeartPulse,
  Flame,
  Building,
  HelpCircle,
  MapPin,
  Camera,
  Shield,
  Clock,
  CheckCircle2,
  WifiOff,
  Sparkles,
  Copy,
  ArrowRight,
  Navigation,
  Lock,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export const ReportEmergencyModal = () => {
  const {
    isRegisterOpen,
    setIsRegisterOpen,
    reportEmergency,
    shelters,
    isOnline,
    setCurrentView,
    t
  } = useCommand();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Category
    category: 'MISSING_PERSON',
    
    // Step 2: Details
    incidentDescription: '',
    incidentDateTime: new Date().toISOString().slice(0, 16),
    urgencyLevel: 'URGENT',
    reporterName: '',
    reporterContact: '',
    reporterRelation: 'Parent',
    
    // Missing / Found Specific
    fullName: '',
    isUnidentified: false,
    age: '',
    gender: 'Male',
    photo: '',
    clothing: '',
    physicalMarks: '',
    medicalNotes: '',
    responseCentre: 'Velachery Community Relief Center',

    // Trapped Specific
    affectedCount: '1',
    natureOfDanger: 'Flood waters rising rapidly on ground floor',
    safeCallback: '',

    // Medical Specific
    medicalAssistanceType: 'Trauma / Severe Injury',
    emergencyServicesContacted: false,

    // Step 3: Location
    district: 'Chennai — Velachery Sector',
    landmark: 'Near Velachery Main Road & MRTS Station',
    coordinates: [12.9800, 80.2200],
    lastSeenLocation: 'Velachery Main Road, Chennai'
  });

  if (!isRegisterOpen) return null;

  const categories = [
    {
      id: 'MISSING_PERSON',
      title: t('catMissingPerson'),
      desc: t('catMissingPersonDesc'),
      icon: UserX,
      color: 'bg-[#F47C65]/10 text-[#F47C65] border-[#F47C65]/30'
    },
    {
      id: 'FOUND_PERSON',
      title: t('catFoundPerson'),
      desc: t('catFoundPersonDesc'),
      icon: UserCheck,
      color: 'bg-[#155E63]/10 text-[#155E63] border-[#155E63]/30'
    },
    {
      id: 'TRAPPED_PERSON',
      title: t('catTrappedPerson'),
      desc: t('catTrappedPersonDesc'),
      icon: LifeBuoy,
      color: 'bg-rose-50 text-[#C83D4D] border-rose-300'
    },
    {
      id: 'MEDICAL_EMERGENCY',
      title: t('catMedicalEmergency'),
      desc: t('catMedicalEmergencyDesc'),
      icon: HeartPulse,
      color: 'bg-red-50 text-red-700 border-red-300'
    },
    {
      id: 'FIRE_HAZARD',
      title: t('catFireHazard'),
      desc: t('catFireHazardDesc'),
      icon: Flame,
      color: 'bg-amber-50 text-[#B7791F] border-amber-300'
    },
    {
      id: 'DAMAGED_INFRASTRUCTURE',
      title: t('catDamagedInfrastructure'),
      desc: t('catDamagedInfrastructureDesc'),
      icon: Building,
      color: 'bg-purple-50 text-purple-700 border-purple-300'
    },
    {
      id: 'OTHER_EMERGENCY',
      title: t('catOtherEmergency'),
      desc: t('catOtherEmergencyDesc'),
      icon: HelpCircle,
      color: 'bg-slate-50 text-[#687A7C] border-slate-300'
    }
  ];

  const presetDistricts = [
    { name: 'Chennai — Velachery Sector', coords: [12.9800, 80.2200], defaultLandmark: 'Near Velachery Main Road & MRTS Station' },
    { name: 'Wayanad — Meppadi & Chooralmala', coords: [11.5510, 76.1265], defaultLandmark: 'Near Meppadi High School Relief Base' },
    { name: 'Wayanad — Mundakkai Hill Sector', coords: [11.5450, 76.1500], defaultLandmark: 'Near Bailey Bridge Access Point' },
    { name: 'Rajahmundry — Godavari Basin', coords: [17.0010, 81.7820], defaultLandmark: 'Near Kotilingala Ghat Causeway' },
    { name: 'Bengaluru — Bellandur & ORR', coords: [12.9260, 77.6780], defaultLandmark: 'Near EcoSpace Underpass Corridor' },
    { name: 'Delhi — Kashmere Gate & Yamuna', coords: [28.6650, 77.2380], defaultLandmark: 'Near Yamuna Bazar Ghat #3' },
    { name: 'Chennai — Saidapet & Adyar Basin', coords: [13.0210, 80.2230], defaultLandmark: 'Near Maraimalai Adigal Bridge' },
    { name: 'Cuddalore — Port Coastal Sector', coords: [11.7480, 79.7714], defaultLandmark: 'Near Cuddalore Old Port Cyclone Shelter' }
  ];

  const presetAvatars = [
    { label: 'Young Girl', url: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=300&auto=format&fit=crop&q=80' },
    { label: 'Teen Male', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80' },
    { label: 'Elderly Male', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80' },
    { label: 'Adult Female', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDistrictChange = (e) => {
    const selectedDist = presetDistricts.find(d => d.name === e.target.value);
    if (selectedDist) {
      setFormData(prev => ({
        ...prev,
        district: selectedDist.name,
        coordinates: selectedDist.coords,
        landmark: selectedDist.defaultLandmark,
        lastSeenLocation: `${selectedDist.name}, ${selectedDist.defaultLandmark}`
      }));
    } else {
      setFormData(prev => ({ ...prev, district: e.target.value }));
    }
  };

  const handleDeviceGps = () => {
    setGpsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setFormData(prev => ({
            ...prev,
            coordinates: [lat, lng],
            landmark: `GPS Fixed: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
          }));
          setGpsLoading(false);
        },
        () => {
          setGpsLoading(false);
          setErrorMsg('GPS device permission denied or unavailable. Default sector locality coordinates applied.');
          setTimeout(() => setErrorMsg(''), 4000);
        },
        { timeout: 8000 }
      );
    } else {
      setGpsLoading(false);
      setErrorMsg('GPS device geolocation not supported by browser.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleNext = () => {
    setErrorMsg('');
    if (currentStep === 1) {
      if (!formData.category) {
        setErrorMsg('Please select an incident category.');
        return;
      }
    } else if (currentStep === 2) {
      if (formData.category === 'MISSING_PERSON' && !formData.isUnidentified && !formData.fullName.trim()) {
        setErrorMsg('Please enter the missing person name or check "Unidentified Person".');
        return;
      }
      if (!formData.reporterName.trim()) {
        setErrorMsg('Please enter your name as the reporting contact.');
        return;
      }
      if (!formData.reporterContact.trim()) {
        setErrorMsg('Please enter a confidential callback phone number.');
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.district.trim()) {
        setErrorMsg('Please select or specify the incident district/locality.');
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      const finalLocation = `${formData.district}, ${formData.landmark || 'Disaster Response Zone'}`;
      const record = reportEmergency({
        ...formData,
        fullName: formData.isUnidentified ? 'Unidentified Person' : (formData.fullName || `${formData.category.replace(/_/g, ' ')} Incident`),
        lastSeenLocation: finalLocation,
        priority: formData.urgencyLevel
      });

      setIsSubmitting(false);
      setSubmittedRecord(record);
    }, 500);
  };

  const handleCopyId = () => {
    if (submittedRecord) {
      navigator.clipboard.writeText(submittedRecord.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  const handleClose = () => {
    setIsRegisterOpen(false);
    setCurrentStep(1);
    setSubmittedRecord(null);
    setCopiedId(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="modal-dialog bg-white border border-[#E1E9E7] rounded-2xl w-full max-w-3xl max-h-[92vh] shadow-dropdown flex flex-col text-[#1D3033]">
        
        {/* Pinned Header (Friend's README requirement) */}
        <div className="modal-header-pinned p-4 sm:p-5 border-b border-[#E1E9E7] bg-[#F4F7F6] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#D8F3EF] text-[#155E63] border border-[#B2E4DD]">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1D3033] font-sans flex items-center gap-2">
                <span>{t('reportIssue')}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#155E63] text-white font-mono font-bold">
                  MULTI-SECTOR
                </span>
              </h2>
              <span className="text-xs text-[#687A7C] font-sans">
                Direct broadcast to disaster response coordinators & field relief units
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-[#687A7C] hover:text-[#1D3033] hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offline Notice Banner */}
        {!isOnline && (
          <div className="p-2.5 bg-amber-50 border-b border-amber-200 text-[#B7791F] text-xs flex items-center gap-2 font-medium flex-shrink-0">
            <WifiOff className="w-4 h-4 text-[#B7791F] flex-shrink-0" />
            <span>Offline-First Gateway: Report will be cached locally and synced automatically upon reconnection.</span>
          </div>
        )}

        {/* Pinned Progress Stepper (Friend's README requirement) */}
        {!submittedRecord && (
          <div className="px-6 pt-3.5 pb-2 bg-[#FAFDFD] border-b border-[#E1E9E7] flex-shrink-0">
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono text-[#687A7C]">
              <div className={`pb-1 border-b-2 font-semibold transition-all ${currentStep === 1 ? 'border-[#155E63] text-[#155E63]' : currentStep > 1 ? 'border-[#24856A] text-[#24856A]' : 'border-[#E1E9E7]'}`}>
                {t('stepCategory')}
              </div>
              <div className={`pb-1 border-b-2 font-semibold transition-all ${currentStep === 2 ? 'border-[#155E63] text-[#155E63]' : currentStep > 2 ? 'border-[#24856A] text-[#24856A]' : 'border-[#E1E9E7]'}`}>
                {t('stepDetails')}
              </div>
              <div className={`pb-1 border-b-2 font-semibold transition-all ${currentStep === 3 ? 'border-[#155E63] text-[#155E63]' : currentStep > 3 ? 'border-[#24856A] text-[#24856A]' : 'border-[#E1E9E7]'}`}>
                {t('stepLocation')}
              </div>
              <div className={`pb-1 border-b-2 font-semibold transition-all ${currentStep === 4 ? 'border-[#155E63] text-[#155E63]' : 'border-[#E1E9E7]'}`}>
                {t('stepReview')}
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Modal Body (modal-body-scroll) */}
        <div className="modal-body-scroll p-4 sm:p-6 space-y-4">
          
          {/* STEP 1: SELECT REPORT CATEGORY */}
          {!submittedRecord && currentStep === 1 && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-[#1D3033]">{t('reportCategoryTitle')}</h3>
                <p className="text-xs text-[#687A7C]">{t('reportCategorySubtitle')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {categories.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = formData.category === cat.id;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => setFormData(p => ({ ...p, category: cat.id }))}
                      className={`
                        p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3
                        ${isSelected 
                          ? 'bg-[#D8F3EF]/40 border-[#155E63] shadow-soft ring-2 ring-[#155E63]/30' 
                          : 'bg-white border-[#E1E9E7] hover:border-[#155E63]/40 hover:bg-[#F4F7F6]'
                        }
                      `}
                    >
                      <div className={`p-2 rounded-xl border flex-shrink-0 ${cat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs text-[#1D3033] flex items-center justify-between">
                          <span>{cat.title}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#155E63]" />}
                        </div>
                        <p className="text-[11px] text-[#687A7C] leading-snug">{cat.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: COLLECT INCIDENT DETAILS */}
          {!submittedRecord && currentStep === 2 && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#E1E9E7]">
                <h3 className="text-sm font-bold text-[#1D3033] flex items-center gap-2">
                  <span>{t('stepDetails')}</span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#D8F3EF] text-[#155E63] font-mono font-bold">
                    {formData.category.replace(/_/g, ' ')}
                  </span>
                </h3>
                <span className="text-[11px] text-[#687A7C] font-mono">* Required fields</span>
              </div>

              {/* Urgency Level & Incident Date/Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1D3033] mb-1">
                    {t('urgencyLevelLabel')} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="urgencyLevel"
                    value={formData.urgencyLevel}
                    onChange={handleChange}
                    className="w-full bg-[#F4F7F6] border border-[#E1E9E7] focus:border-[#155E63] rounded-xl px-3 py-2 text-xs text-[#1D3033] font-medium focus:outline-none"
                  >
                    <option value="CRITICAL">{t('urgencyCritical')}</option>
                    <option value="URGENT">{t('urgencyUrgent')}</option>
                    <option value="HIGH">{t('urgencyHigh')}</option>
                    <option value="MEDIUM">{t('urgencyMedium')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1D3033] mb-1">
                    {t('incidentDateLabel')}
                  </label>
                  <input
                    type="datetime-local"
                    name="incidentDateTime"
                    value={formData.incidentDateTime}
                    onChange={handleChange}
                    className="w-full bg-[#F4F7F6] border border-[#E1E9E7] focus:border-[#155E63] rounded-xl px-3 py-2 text-xs text-[#1D3033] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Conditional Missing Person Details */}
              {formData.category === 'MISSING_PERSON' && (
                <div className="p-3.5 rounded-xl bg-[#F4F7F6] border border-[#E1E9E7] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#155E63] uppercase tracking-wider font-mono">
                      Missing Subject Dossier
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#687A7C]">
                      <input
                        type="checkbox"
                        name="isUnidentified"
                        checked={formData.isUnidentified}
                        onChange={handleChange}
                        className="rounded text-[#155E63] focus:ring-0"
                      />
                      <span>Unidentified / Nickname only</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#1D3033] mb-1">
                        {t('fullNameLabel')} {!formData.isUnidentified && <span className="text-rose-500">*</span>}
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        disabled={formData.isUnidentified}
                        placeholder={formData.isUnidentified ? "Will be registered as 'Unidentified Person'" : "e.g. Ramesh Kannan"}
                        className="w-full bg-white border border-[#E1E9E7] focus:border-[#155E63] rounded-xl px-3 py-2 text-xs text-[#1D3033] placeholder-[#687A7C] focus:outline-none disabled:bg-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1D3033] mb-1">{t('ageLabel')}</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="e.g. 28"
                        className="w-full bg-white border border-[#E1E9E7] focus:border-[#155E63] rounded-xl px-3 py-2 text-xs text-[#1D3033] placeholder-[#687A7C] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1D3033] mb-1">{t('genderLabel')}</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#E1E9E7] focus:border-[#155E63] rounded-xl px-3 py-2 text-xs text-[#1D3033] focus:outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other / Non-Binary</option>
                        <option value="Unknown">Unknown</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1D3033] mb-1">{t('clothingLabel')}</label>
                      <input
                        type="text"
                        name="clothing"
                        value={formData.clothing}
                        onChange={handleChange}
                        placeholder="e.g. Blue checked shirt, black jeans, silver watch"
                        className="w-full bg-white border border-[#E1E9E7] focus:border-[#155E63] rounded-xl px-3 py-2 text-xs text-[#1D3033] placeholder-[#687A7C] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Preset Photo Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1D3033] mb-1.5">
                      Subject Photo or Sample Avatar
                    </label>
                    <div className="flex items-center gap-3">
                      {presetAvatars.map((p, idx) => (
                        <div
                          key={idx}
                          onClick={() => setFormData(prev => ({ ...prev, photo: p.url }))}
                          className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                            formData.photo === p.url ? 'border-[#155E63] scale-105 shadow-soft ring-2 ring-[#155E63]/30' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={p.url} alt={p.label} className="w-11 h-11 object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional Trapped Person Details */}
              {formData.category === 'TRAPPED_PERSON' && (
                <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 space-y-3">
                  <span className="font-bold text-xs text-[#C83D4D] uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <LifeBuoy className="w-4 h-4" />
                    <span>Trapped Person Rescue Parameters</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1D3033] mb-1">
                        {t('affectedCountLabel')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="affectedCount"
                        value={formData.affectedCount}
                        onChange={handleChange}
                        min="1"
                        placeholder="e.g. 4 people"
                        className="w-full bg-white border border-rose-200 focus:border-[#C83D4D] rounded-xl px-3 py-2 text-xs text-[#1D3033] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1D3033] mb-1">
                        {t('safeCallbackLabel')}
                      </label>
                      <input
                        type="text"
                        name="safeCallback"
                        value={formData.safeCallback}
                        onChange={handleChange}
                        placeholder="e.g. 98401-XXXXX (Alternate phone)"
                        className="w-full bg-white border border-rose-200 focus:border-[#C83D4D] rounded-xl px-3 py-2 text-xs text-[#1D3033] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1D3033] mb-1">
                      {t('natureOfDangerLabel')} <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      name="natureOfDanger"
                      value={formData.natureOfDanger}
                      onChange={handleChange}
                      placeholder={t('natureOfDangerPlaceholder')}
                      className="w-full bg-white border border-rose-200 focus:border-[#C83D4D] rounded-xl p-2.5 text-xs text-[#1D3033] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Conditional Medical Emergency Details */}
              {formData.category === 'MEDICAL_EMERGENCY' && (
                <div className="p-3.5 rounded-xl bg-red-50/50 border border-red-200 space-y-3">
                  <span className="font-bold text-xs text-red-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4" />
                    <span>Medical Triage Requirements</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1D3033] mb-1">
                        {t('medicalAssistanceTypeLabel')} <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="medicalAssistanceType"
                        value={formData.medicalAssistanceType}
                        onChange={handleChange}
                        className="w-full bg-white border border-red-200 focus:border-red-600 rounded-xl px-3 py-2 text-xs text-[#1D3033] focus:outline-none"
                      >
                        <option value="Trauma / Severe Injury">{t('medicalTypeTrauma')}</option>
                        <option value="Cardiac / Respiratory Distress">{t('medicalTypeCardiac')}</option>
                        <option value="Pediatric / Infant Care">{t('medicalTypePediatric')}</option>
                        <option value="Dialysis / Critical Medication Shortage">{t('medicalTypeDialysis')}</option>
                        <option value="Hypothermia / Dehydration">{t('medicalTypeHypothermia')}</option>
                      </select>
                    </div>

                    <div className="flex items-center pt-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1D3033] font-medium">
                        <input
                          type="checkbox"
                          name="emergencyServicesContacted"
                          checked={formData.emergencyServicesContacted}
                          onChange={handleChange}
                          className="rounded text-red-600 focus:ring-0"
                        />
                        <span>{t('emergencyServicesContactedLabel')}</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Incident Description */}
              <div>
                <label className="block text-xs font-semibold text-[#1D3033] mb-1">
                  {t('incidentDescLabel')} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  name="incidentDescription"
                  value={formData.incidentDescription}
                  onChange={handleChange}
                  placeholder={t('incidentDescPlaceholder')}
                  className="w-full bg-[#F4F7F6] border border-[#E1E9E7] focus:border-[#155E63] rounded-xl p-2.5 text-xs text-[#1D3033] focus:outline-none"
                />
              </div>

              {/* Reporter Contact Information (Common) */}
              <div className="p-3.5 rounded-xl bg-[#D8F3EF]/30 border border-[#B2E4DD] space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#155E63] font-mono uppercase">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Reporter Identification & Confidential Contact (DPDP Protected)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#1D3033] mb-1">
                      {t('reporterNameLabel')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="reporterName"
                      value={formData.reporterName}
                      onChange={handleChange}
                      placeholder="e.g. S. Ramaswamy"
                      className="w-full bg-white border border-[#E1E9E7] focus:border-[#155E63] rounded-xl px-3 py-2 text-xs text-[#1D3033] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1D3033] mb-1">
                      {t('reporterContactLabel')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="reporterContact"
                      value={formData.reporterContact}
                      onChange={handleChange}
                      placeholder="e.g. 98401-23456"
                      className="w-full bg-white border border-[#E1E9E7] focus:border-[#155E63] rounded-xl px-3 py-2 text-xs text-[#1D3033] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1D3033] mb-1">
                      {t('reporterRelationLabel')}
                    </label>
                    <select
                      name="reporterRelation"
                      value={formData.reporterRelation}
                      onChange={handleChange}
                      className="w-full bg-white border border-[#E1E9E7] focus:border-[#155E63] rounded-xl px-3 py-2 text-xs text-[#1D3033] focus:outline-none"
                    >
                      <option value="Parent">{t('relParent')}</option>
                      <option value="Spouse">{t('relSpouse')}</option>
                      <option value="Child/Sibling">{t('relChild')}</option>
                      <option value="Neighbor">{t('relNeighbor')}</option>
                      <option value="Volunteer/Responder">{t('relFirstResponder')}</option>
                      <option value="Self">{t('relSelf')}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION */}
          {!submittedRecord && currentStep === 3 && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#E1E9E7]">
                <h3 className="text-sm font-bold text-[#1D3033]">{t('stepLocation')}</h3>
                <span className="text-[11px] text-[#687A7C] font-mono">Geospatial Sector Tagging</span>
              </div>

              {/* District / Locality Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#1D3033] mb-1">
                  {t('districtLocalityLabel')} <span className="text-rose-500">*</span>
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleDistrictChange}
                  className="w-full bg-[#F4F7F6] border border-[#E1E9E7] focus:border-[#155E63] rounded-xl px-3 py-2.5 text-xs text-[#1D3033] font-medium focus:outline-none"
                >
                  {presetDistricts.map((d, i) => (
                    <option key={i} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Landmark input */}
              <div>
                <label className="block text-xs font-semibold text-[#1D3033] mb-1">
                  {t('landmarkLabel')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F47C65]" />
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder={t('landmarkPlaceholder')}
                    className="w-full bg-[#F4F7F6] border border-[#E1E9E7] focus:border-[#155E63] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1D3033] focus:outline-none"
                  />
                </div>
              </div>

              {/* GPS Option */}
              <div className="p-3.5 rounded-xl bg-[#F4F7F6] border border-[#E1E9E7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-semibold text-xs text-[#1D3033] block">Automatic Device GPS Coordinate Detection</span>
                  <span className="text-[11px] text-[#687A7C] block font-mono">
                    Current Coordinates: [{formData.coordinates[0].toFixed(4)}, {formData.coordinates[1].toFixed(4)}]
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleDeviceGps}
                  disabled={gpsLoading}
                  className="px-3.5 py-2 bg-white border border-[#E1E9E7] hover:border-[#155E63] text-xs font-semibold text-[#155E63] rounded-xl shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#155E63]" />
                  <span>{gpsLoading ? 'Acquiring Fix...' : t('useGpsBtn')}</span>
                </button>
              </div>

              {/* Preset Sector Location Map Chips */}
              <div>
                <label className="block text-[11px] font-mono text-[#687A7C] mb-2 uppercase font-bold">
                  Quick Disaster Sector Selection:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {presetDistricts.map((dist, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          district: dist.name,
                          coordinates: dist.coords,
                          landmark: dist.defaultLandmark,
                          lastSeenLocation: `${dist.name}, ${dist.defaultLandmark}`
                        }));
                      }}
                      className={`p-2 rounded-xl text-left border text-[11px] transition-all cursor-pointer ${
                        formData.district === dist.name 
                          ? 'bg-[#D8F3EF] border-[#155E63] text-[#155E63] font-bold shadow-xs' 
                          : 'bg-white border-[#E1E9E7] text-[#1D3033] hover:bg-[#F4F7F6]'
                      }`}
                    >
                      <div className="truncate font-semibold">{dist.name.split('—')[1] || dist.name}</div>
                      <div className="text-[10px] text-[#687A7C] font-mono">[{dist.coords[0].toFixed(2)}, {dist.coords[1].toFixed(2)}]</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & SUBMIT */}
          {!submittedRecord && currentStep === 4 && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#E1E9E7]">
                <div>
                  <h3 className="text-sm font-bold text-[#1D3033]">{t('reviewTitle')}</h3>
                  <p className="text-xs text-[#687A7C]">{t('reviewSubtitle')}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#155E63] text-white">
                  {formData.urgencyLevel}
                </span>
              </div>

              {/* Dossier Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#F4F7F6] border border-[#E1E9E7] space-y-1">
                  <span className="text-[10px] font-mono text-[#155E63] font-bold uppercase block">Category & Subject</span>
                  <div className="font-bold text-[#1D3033] text-sm">
                    {formData.isUnidentified ? 'Unidentified Person' : (formData.fullName || formData.category.replace(/_/g, ' '))}
                  </div>
                  <div className="text-[#687A7C]">{formData.category.replace(/_/g, ' ')} • {formData.gender} {formData.age ? `• ${formData.age} yrs` : ''}</div>
                  {formData.clothing && <div className="text-[11px] text-[#1D3033]"><span className="text-[#687A7C]">Attire:</span> {formData.clothing}</div>}
                </div>

                <div className="p-3 rounded-xl bg-[#F4F7F6] border border-[#E1E9E7] space-y-1">
                  <span className="text-[10px] font-mono text-[#F47C65] font-bold uppercase block">Incident Location</span>
                  <div className="font-bold text-[#1D3033] text-sm truncate">{formData.district}</div>
                  <div className="text-[#687A7C] text-[11px]">{formData.landmark}</div>
                  <div className="text-[10px] font-mono text-[#155E63]">Coords: [{formData.coordinates[0].toFixed(4)}, {formData.coordinates[1].toFixed(4)}]</div>
                </div>
              </div>

              {/* Description & Reporter info */}
              <div className="p-3.5 rounded-xl bg-[#F4F7F6] border border-[#E1E9E7] text-xs space-y-1.5">
                <span className="text-[10px] font-mono text-[#687A7C] font-bold uppercase block">Reporter & Description</span>
                <p className="text-[#1D3033] leading-relaxed italic">{formData.incidentDescription || 'No extra textual description provided.'}</p>
                <div className="pt-2 border-t border-[#E1E9E7] flex items-center justify-between text-[#687A7C] text-[11px]">
                  <span>Reporter: <strong className="text-[#1D3033]">{formData.reporterName}</strong> ({formData.reporterRelation})</span>
                  <span className="font-mono text-[#155E63]">Phone: {formData.reporterContact}</span>
                </div>
              </div>

              {/* Mandatory Humanitarian Safety Warning Notice */}
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold uppercase tracking-wide text-rose-800 font-mono text-[10px]">
                    MANDATORY EMERGENCY DISCLAIMER:
                  </span>
                  <p className="text-rose-800 text-[11px] leading-relaxed">
                    {t('safetyNoticeDisclaimer')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SUCCESS SCREEN */}
          {submittedRecord && (
            <div className="py-4 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#24856A] border-2 border-emerald-300 flex items-center justify-center mx-auto shadow-soft">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-bold text-[#1D3033]">
                  {t('submissionSuccessTitle')}
                </h3>
                <p className="text-xs text-[#687A7C]">
                  {t('submissionSuccessDesc')}
                </p>
              </div>

              {/* Case ID and PIN Card */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#D8F3EF]/40 border border-[#155E63]/30 shadow-soft space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#155E63] uppercase tracking-wider font-mono">
                    {t('yourCaseId')}:
                  </span>
                  <span className="text-base font-mono font-extrabold text-[#155E63] tracking-wide">
                    {submittedRecord.id}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#155E63]/20">
                  <span className="text-xs text-[#1D3033]">{t('yourPin')}:</span>
                  <span className="font-mono font-bold text-sm text-[#155E63] bg-white px-2.5 py-0.5 rounded border border-[#B2E4DD]">
                    {submittedRecord.pin}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyId}
                  className="w-full py-2 bg-white hover:bg-slate-50 border border-[#155E63] text-[#155E63] font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId ? t('copiedCaseId') : t('copyCaseId')}</span>
                </button>
              </div>

              <p className="text-[11px] text-[#687A7C] max-w-sm mx-auto">
                {t('saveIdNotice')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setCurrentView('family');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#155E63] hover:bg-[#123B3A] text-white font-bold text-xs rounded-xl shadow-soft flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>{t('trackNowBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSubmittedRecord(null);
                    setCurrentStep(1);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#F4F7F6] hover:bg-slate-200 text-[#1D3033] font-semibold text-xs rounded-xl border border-[#E1E9E7] transition-colors cursor-pointer"
                >
                  {t('submitAnotherBtn')}
                </button>
              </div>
            </div>
          )}

          {/* Validation Error Message */}
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Pinned Footer (modal-footer-pinned) */}
        {!submittedRecord && (
          <div className="modal-footer-pinned p-4 border-t border-[#E1E9E7] bg-[#F4F7F6] flex items-center justify-between flex-shrink-0">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-4 py-2 rounded-xl bg-white border border-[#E1E9E7] text-[#687A7C] hover:text-[#1D3033] text-xs font-semibold transition-colors cursor-pointer"
              >
                ← Back
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-[#155E63] hover:bg-[#123B3A] text-white text-xs font-bold transition-all shadow-soft cursor-pointer flex items-center gap-1.5"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#F47C65] hover:bg-[#e06b54] text-white text-xs font-bold shadow-soft transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>{t('submittingReport')}</span>
                ) : (
                  <>
                    <LifeBuoy className="w-4 h-4" />
                    <span>{t('submitReportBtn')}</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
