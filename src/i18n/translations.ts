export type LanguageCode = 'en' | 'ta' | 'hi' | 'te' | 'ml' | 'bn';

export interface TranslationStrings {
  appName: string;
  appTagline: string;
  disasterHeader: string;
  activeHelpline: string;
  switchRole: string;
  language: string;
  
  // Navigation
  navHome: string;
  navReportMissing: string;
  navReportFound: string;
  navTrackCase: string;
  navFacilities: string;
  navCommandCenter: string;
  navFieldRescue: string;
  navHospitalIntake: string;
  
  // Zero-Knowledge Hero CTA
  heroTitle: string;
  heroSubtitle: string;
  ctaReportMissingTitle: string;
  ctaReportMissingDesc: string;
  ctaReportFoundTitle: string;
  ctaReportFoundDesc: string;
  ctaTrackCaseTitle: string;
  ctaTrackCaseDesc: string;
  ctaEmergencyHelpTitle: string;
  ctaEmergencyHelpDesc: string;
  
  // Family Track Case
  trackTitle: string;
  trackPlaceholder: string;
  trackButton: string;
  trackSafeNote: string;
  caseNotFound: string;
  caseStatusLabel: string;
  lastKnownLocLabel: string;
  lastUpdatedLabel: string;
  nextStepLabel: string;
  
  // Status Labels
  statusUnverified: string;
  statusPossibleMatch: string;
  statusUnderVerification: string;
  statusVerified: string;
  statusFamilyNotified: string;
  statusReunited: string;
  statusClosed: string;
  
  // 3 Core Engines
  coreFusionTitle: string;
  coreFusionDesc: string;
  coreNbaTitle: string;
  coreNbaDesc: string;
  coreLoopTitle: string;
  coreLoopDesc: string;
  
  // Forms & Actions
  submitReport: string;
  fullName: string;
  age: string;
  gender: string;
  clothing: string;
  scarsAndMarks: string;
  lastSeenLocation: string;
  contactNumber: string;
  uploadPhoto: string;
  notes: string;
  cancel: string;
  verifyMatch: string;
  confirmReunification: string;
}

export const translations: Record<LanguageCode, TranslationStrings> = {
  en: {
    appName: 'Reunite360',
    appTagline: 'Disaster Response, Family Reunification & Rescue Coordination Platform',
    disasterHeader: 'Active Emergency: Cyclone Vardah / Coastal Flood Zone Delta',
    activeHelpline: 'Toll-Free Emergency Helpline: 1070 / 1800-425-3333',
    switchRole: 'Select Active Portal',
    language: 'Language',
    
    navHome: 'Public Portal',
    navReportMissing: 'Report Missing Person',
    navReportFound: 'Report Found Person',
    navTrackCase: 'Track Case',
    navFacilities: 'Nearby Relief & Shelters',
    navCommandCenter: 'Command Center',
    navFieldRescue: 'Field Rescue Team',
    navHospitalIntake: 'Hospital / Shelter Intake',
    
    heroTitle: 'Help Reconnect Displaced Loved Ones in Times of Crisis',
    heroSubtitle: 'A verified, intelligent platform connecting families, field rescue units, relief shelters, and hospitals to safely reunite separated families.',
    ctaReportMissingTitle: 'Report Missing Person',
    ctaReportMissingDesc: 'Register a family member or friend missing during the disaster for automated fusion matching.',
    ctaReportFoundTitle: 'Report Found / Rescued Person',
    ctaReportFoundDesc: 'Log an unidentified, stranded, or hospitalized individual to find their loved ones.',
    ctaTrackCaseTitle: 'Track Case Status',
    ctaTrackCaseDesc: 'Enter your Case Reference ID to check verified updates and safe location information.',
    ctaEmergencyHelpTitle: 'Emergency Help & Relief Shelters',
    ctaEmergencyHelpDesc: 'Find real-time nearby shelters, hospitals, medical posts, food camps, and emergency lines.',
    
    trackTitle: 'Track Your Missing Person Case',
    trackPlaceholder: 'Enter Case ID (e.g. #R124 or MIS-2026-081) or Contact Phone',
    trackButton: 'Search Case',
    trackSafeNote: 'Privacy Assurance: Information displayed is strictly verified by emergency authorities to protect family privacy and avoid unverified rumors.',
    caseNotFound: 'No case record found with that reference. Please check the Case ID or contact the 24/7 hotline.',
    caseStatusLabel: 'Current Verification State',
    lastKnownLocLabel: 'Last Verified Location',
    lastUpdatedLabel: 'Last Authorized Update',
    nextStepLabel: 'Next Coordinated Step',
    
    statusUnverified: 'Intake Registered (Searching Records)',
    statusPossibleMatch: 'Potential Match Identified (Analyzing Evidence)',
    statusUnderVerification: 'Verification In Progress (Responder Dispatched)',
    statusVerified: 'Identity Officially Verified',
    statusFamilyNotified: 'Family Notification Active',
    statusReunited: 'Family Safely Reunited',
    statusClosed: 'Case Resolved & Closed',
    
    coreFusionTitle: 'Live Case Fusion Engine',
    coreFusionDesc: 'Continuously correlates fragmented records across hospitals, shelters, and rescue teams with explainable match evidence and conflict detection.',
    coreNbaTitle: 'Next-Best-Action (NBA) Engine',
    coreNbaDesc: 'Dynamically prioritizes emergency tasks and tells commanders and responders exactly what action to take next.',
    coreLoopTitle: 'Verified Reunification Loop',
    coreLoopDesc: 'Strict closed-loop protocol ensuring zero false notifications until multi-source authority verification is complete.',
    
    submitReport: 'Submit Emergency Report',
    fullName: 'Full Name',
    age: 'Age / Approx Age',
    gender: 'Gender',
    clothing: 'Clothing Description (Top & Bottom)',
    scarsAndMarks: 'Distinguishing Scars, Tattoos or Marks',
    lastSeenLocation: 'Last Seen Location / Landmark',
    contactNumber: 'Your Contact Phone Number',
    uploadPhoto: 'Upload Clear Photograph (If available)',
    notes: 'Important Medical or Special Notes',
    cancel: 'Cancel',
    verifyMatch: 'Verify Candidate Match',
    confirmReunification: 'Confirm Official Reunification',
  },
  
  ta: {
    appName: 'ரீயுனைட்360 (Reunite360)',
    appTagline: 'பேரிடர் மீட்பு, குடும்ப மறுஇணைப்பு மற்றும் ஒருங்கிணைப்பு தளம்',
    disasterHeader: 'செயலில் உள்ள அவசரநிலை: வர்தா புயல் / கடலோர வெள்ள மண்டலம்',
    activeHelpline: 'கட்டணமில்லா அவசர உதவி எண்: 1070 / 1800-425-3333',
    switchRole: 'பயனர் பிரிவைத் தேர்ந்தெடுக்கவும்',
    language: 'மொழி',
    
    navHome: 'பொது போர்டல்',
    navReportMissing: 'காணாமல் போனவரைப் பதிவு செய்',
    navReportFound: 'மீட்கப்பட்டவரைப் பதிவு செய்',
    navTrackCase: 'வழக்கு நிலையை அறிதல்',
    navFacilities: 'அருகிலுள்ள முகாம்கள் & மருத்துவமனைகள்',
    navCommandCenter: 'கட்டளை மையம் (Command Center)',
    navFieldRescue: 'கள மீட்புக் குழு',
    navHospitalIntake: 'மருத்துவமனை / முகாம் பதிவு',
    
    heroTitle: 'பேரிடர் காலத்தில் பிரிந்த குடும்பங்களை மீண்டும் இணைப்போம்',
    heroSubtitle: 'குடும்பங்கள், மீட்புக் குழுக்கள், நிவாரண முகாம்கள் மற்றும் மருத்துவமனைகளை இணைத்து பாதுகாப்பாக மறுஇணைப்பு செய்யும் நம்பகமான தளம்.',
    ctaReportMissingTitle: 'காணாமல் போனவரைப் பதிவு செய்க',
    ctaReportMissingDesc: 'பேரிடரில் பிரிந்த குடும்பத்தினர் குறித்த தகவல்களை எளிதாகப் பதிவு செய்யுங்கள்.',
    ctaReportFoundTitle: 'மீட்கப்பட்ட / கண்டுபிடிக்கப்பட்டவர் பதிவு',
    ctaReportFoundDesc: 'முகாமில் அல்லது மருத்துவமனையில் உள்ள அடையாளம் தெரியாத நபர்களைப் பதிவு செய்யுங்கள்.',
    ctaTrackCaseTitle: 'வழக்கின் நிலையை அறியவும்',
    ctaTrackCaseDesc: 'உங்கள் வழக்கு எண் (Case ID) கொடுத்து சரிபார்க்கப்பட்ட சமீபத்திய நிலையை உடனே தெரிந்து கொள்ளுங்கள்.',
    ctaEmergencyHelpTitle: 'அவசர உதவி & முகாம்கள்',
    ctaEmergencyHelpDesc: 'உடனடி மருத்துவ உதவிகள், தங்கும் முகாம்கள், உணவு மற்றும் உதவி எண்களைக் கண்டறியுங்கள்.',
    
    trackTitle: 'காணாமல் போன நபர் வழக்கின் நிலையை அறியவும்',
    trackPlaceholder: 'வழக்கு எண் (#R124) அல்லது தொலைபேசி எண்ணை உள்ளிடவும்',
    trackButton: 'தேடுக',
    trackSafeNote: 'பாதுகாப்பு உறுதி: காட்டப்படும் அனைத்து தகவல்களும் அரசு அதிகாரிகளால் முழுமையாக சரிபார்க்கப்பட்டவை.',
    caseNotFound: 'இந்த எண்ணில் வழக்கு எதுவும் கிடைக்கவில்லை. உதவி எண்ணைத் தொடர்பு கொள்ளவும்.',
    caseStatusLabel: 'தற்போதைய சரிபார்ப்பு நிலை',
    lastKnownLocLabel: 'கடைசியாக உறுதிசெய்யப்பட்ட இடம்',
    lastUpdatedLabel: 'கடைசி புதுப்பிப்பு நேரம்',
    nextStepLabel: 'அடுத்தகட்ட நடவடிக்கை',
    
    statusUnverified: 'பதிவு செய்யப்பட்டது (தேடுதல் நடக்கிறது)',
    statusPossibleMatch: 'சாத்தியமான பொருத்தம் கண்டறியப்பட்டது (ஆய்வு செய்யப்படுகிறது)',
    statusUnderVerification: 'சரிபார்ப்பு பணியில் உள்ளது',
    statusVerified: 'அடையாளம் அதிகாரப்பூர்வமாக உறுதி செய்யப்பட்டது',
    statusFamilyNotified: 'குடும்பத்தினருக்கு தகவல் தெரிவிக்கப்படுகிறது',
    statusReunited: 'குடும்பத்துடன் வெற்றிகரமாக இணைக்கப்பட்டார்',
    statusClosed: 'வழக்கு நிறைவடைந்தது',
    
    coreFusionTitle: 'நேரடி வழக்கு இணைப்பு இன்ஜின் (Case Fusion)',
    coreFusionDesc: 'மருத்துவமனை, முகாம் மற்றும் மீட்புக் குழு பதிவுகளை ஒப்பிட்டு தெளிவான ஆதாரங்களுடன் பொருத்தங்களைக் கண்டறிகிறது.',
    coreNbaTitle: 'அடுத்த சிறந்த நடவடிக்கை இன்ஜின் (Next-Best-Action)',
    coreNbaDesc: 'அவசர பணிகளை வரிசைப்படுத்தி, மீட்புக் குழுவினர் அடுத்து என்ன செய்ய வேண்டும் என்பதை வழிகாட்டுகிறது.',
    coreLoopTitle: 'உறுதிப்படுத்தப்பட்ட மறுஇணைப்பு சுழற்சி',
    coreLoopDesc: 'அதிகாரிகள் முழுமையாக உறுதி செய்யும் வரை தவறான தகவல்கள் குடும்பத்தினருக்கு செல்வதை முற்றிலும் தடுக்கிறது.',
    
    submitReport: 'அவசர அறிக்கையை சமர்ப்பிக்கவும்',
    fullName: 'முழு பெயர்',
    age: 'வயது / தோராய வயது',
    gender: 'பாலினம்',
    clothing: 'அணிந்திருந்த ஆடை விபரம்',
    scarsAndMarks: 'அடையாளத் தழும்புகள் அல்லது மச்சங்கள்',
    lastSeenLocation: 'கடைசியாகப் பார்த்த இடம்',
    contactNumber: 'உங்கள் தொடர்பு எண்',
    uploadPhoto: 'புகைப்படம் பதிவேற்றவும்',
    notes: 'மருத்துவக் குறிப்புகள் / சிறப்புக் குறிப்புகள்',
    cancel: 'ரத்து செய்',
    verifyMatch: 'பொருத்தத்தை உறுதிப்படுத்து',
    confirmReunification: 'மறுஇணைப்பை உறுதி செய்',
  },

  hi: {
    appName: 'रियूनाइट360 (Reunite360)',
    appTagline: 'आपदा प्रतिक्रिया, पारिवारिक पुनर्मिलन एवं बचाव समन्वय मंच',
    disasterHeader: 'सक्रिय आपातकाल: चक्रवात वरदा / तटीय बाढ़ क्षेत्र डेल्टा',
    activeHelpline: 'टोल-फ्री आपातकालीन हेल्पलाइन: 1070 / 1800-425-3333',
    switchRole: 'सक्रिय पोर्टल चुनें',
    language: 'भाषा',
    
    navHome: 'सार्वजनिक पोर्टल',
    navReportMissing: 'लापता व्यक्ति की रिपोर्ट',
    navReportFound: 'मिले हुए व्यक्ति की रिपोर्ट',
    navTrackCase: 'केस ट्रैक करें',
    navFacilities: 'निकटतम राहत शिविर एवं अस्पताल',
    navCommandCenter: 'कमांड सेंटर',
    navFieldRescue: 'फील्ड रेस्क्यू टीम',
    navHospitalIntake: 'अस्पताल / शेल्टर इनटेक',
    
    heroTitle: 'संकट के समय अपनों को सुरक्षित रूप से मिलाएं',
    heroSubtitle: 'परिवारों, बचाव दलों, राहत शिविरों और अस्पतालों को जोड़ने वाला एक विश्वसनीय एवं त्वरित पुनर्मिलन मंच।',
    ctaReportMissingTitle: 'लापता व्यक्ति की रिपोर्ट करें',
    ctaReportMissingDesc: 'आपदा में बिछड़े अपने परिजन की जानकारी दर्ज करें ताकि त्वरित खोज हो सके।',
    ctaReportFoundTitle: 'मिले व्यक्ति की रिपोर्ट करें',
    ctaReportFoundDesc: 'अस्पताल या राहत शिविर में मौजूद अज्ञात व्यक्तियों का विवरण दर्ज करें।',
    ctaTrackCaseTitle: 'केस की स्थिति ट्रैक करें',
    ctaTrackCaseDesc: 'अपने केस आईडी (#R124) के माध्यम से सत्यापित स्थिति और स्थान की जानकारी प्राप्त करें।',
    ctaEmergencyHelpTitle: 'आपातकालीन सहायता एवं राहत केंद्र',
    ctaEmergencyHelpDesc: 'निकटतम राहत शिविर, अस्पताल, भोजन केंद्र और आपातकालीन हेल्पलाइन देखें।',
    
    trackTitle: 'अपने लापता व्यक्ति के केस को ट्रैक करें',
    trackPlaceholder: 'केस आईडी (#R124) या फ़ोन नंबर दर्ज करें',
    trackButton: 'केस खोजें',
    trackSafeNote: 'गोपनीयता आश्वासन: यहाँ केवल अधिकृत अधिकारियों द्वारा सत्यापित जानकारी ही प्रदर्शित की जाती है।',
    caseNotFound: 'इस संदर्भ का कोई केस नहीं मिला। कृपया हेल्पलाइन से संपर्क करें।',
    caseStatusLabel: 'वर्तमान स्थिति',
    lastKnownLocLabel: 'अंतिम सत्यापित स्थान',
    lastUpdatedLabel: 'अंतिम अपडेट समय',
    nextStepLabel: 'अगला समन्वित कदम',
    
    statusUnverified: 'पंजीकृत (खोज जारी है)',
    statusPossibleMatch: 'संभावित मिलान मिला (सबूतों का विश्लेषण जारी)',
    statusUnderVerification: 'सत्यापन प्रक्रियाधीन (अधिकारी तैनात)',
    statusVerified: 'पहचान आधिकारिक रूप से सत्यापित',
    statusFamilyNotified: 'परिवार को सूचित किया जा रहा है',
    statusReunited: 'सकुशल पारिवारिक पुनर्मिलन संपन्न',
    statusClosed: 'केस सफलतापूर्वक बंद',
    
    coreFusionTitle: 'लाइव केस फ्यूज़न इंजन',
    coreFusionDesc: 'अस्पतालों, शिविरों और बचाव दलों के विभिन्न रिकॉर्ड को मिलाकर पारदर्शी मिलान तैयार करता है।',
    coreNbaTitle: 'नेक्स्ट-बेस्ट-एक्शन (NBA) इंजन',
    coreNbaDesc: 'अधिकारियों और बचाव कर्मियों को प्राथमिकता के आधार पर बताता है कि आगे क्या कदम उठाना है।',
    coreLoopTitle: 'सत्यापित पुनर्मिलन लूप',
    coreLoopDesc: 'अधिकारियों द्वारा पूर्ण सत्यापन से पहले परिजनों को अधूरी या भ्रामक सूचना जाने से रोकता है।',
    
    submitReport: 'आपातकालीन रिपोर्ट जमा करें',
    fullName: 'पूरा नाम',
    age: 'आयु / अनुमानित आयु',
    gender: 'लिंग',
    clothing: 'पहने हुए वस्त्रों का विवरण',
    scarsAndMarks: 'पहचान के निशान या तिल',
    lastSeenLocation: 'अंतिम बार देखा गया स्थान',
    contactNumber: 'आपका संपर्क नंबर',
    uploadPhoto: 'फोटो अपलोड करें',
    notes: 'चिकित्सा या अन्य महत्वपूर्ण विवरण',
    cancel: 'रद्द करें',
    verifyMatch: 'मिलान सत्यापित करें',
    confirmReunification: 'पुनर्मिलन की पुष्टि करें',
  },

  te: {
    appName: 'రీయునైట్360 (Reunite360)',
    appTagline: 'విపత్తు ప్రతిస్పందన & కుటుంబ పునఃకలయిక వేదిక',
    disasterHeader: 'ప్రస్తుత అత్యవసర పరిస్థితి: తుఫాను వర్దా / వరద జోన్',
    activeHelpline: 'టోల్-ఫ్రీ అత్యవసర హెల్ప్‌లైన్: 1070 / 1800-425-3333',
    switchRole: 'పోర్టల్ ఎంచుకోండి',
    language: 'భాష',
    navHome: 'పబ్లిక్ పోర్టల్',
    navReportMissing: 'తప్పిపోయిన వ్యక్తి నివేదిక',
    navReportFound: 'కనుగొన్న వ్యక్తి నివేదిక',
    navTrackCase: 'కేసు స్థితిని ట్రాక్ చేయండి',
    navFacilities: 'సహాయక శిబిరాలు & ఆసుపత్రులు',
    navCommandCenter: 'కమాండ్ సెంటర్',
    navFieldRescue: 'రెస్క్యూ బృందం',
    navHospitalIntake: 'ఆసుపత్రి / షెల్టర్ రికార్డు',
    heroTitle: 'విపత్తు సమయంలో ఆప్తులను సురక్షితంగా కలపండి',
    heroSubtitle: 'కుటుంబాలు, రెస్క్యూ టీమ్‌లు, షెల్టర్‌లు మరియు ఆసుపత్రులను అనుసంధానించే వేదిక.',
    ctaReportMissingTitle: 'తప్పిపోయిన వ్యక్తిని నమోదు చేయండి',
    ctaReportMissingDesc: 'విపత్తులో తప్పిపోయిన వారి వివరాలను నమోదు చేయండి.',
    ctaReportFoundTitle: 'కనుగొనబడిన వ్యక్తి వివరాలు',
    ctaReportFoundDesc: 'రక్షించబడిన లేదా ఆసుపత్రిలో ఉన్న అనామక వ్యక్తుల వివరాలను చేర్చండి.',
    ctaTrackCaseTitle: 'కేసు స్థితిని ట్రాక్ చేయండి',
    ctaTrackCaseDesc: 'మీ కేసు ఐడి (#R124) ద్వారా ధృవీకరించబడిన తాజా వివరాలు తెలుసుకోండి.',
    ctaEmergencyHelpTitle: 'అత్యవసర సహాయం & శిబిరాలు',
    ctaEmergencyHelpDesc: 'సమీపంలోని పునరావాస కేంద్రాలు, ఆసుపత్రులు మరియు హెల్ప్‌లైన్ నంబర్లను చూడండి.',
    trackTitle: 'మీ కేసును ట్రాక్ చేయండి',
    trackPlaceholder: 'కేసు ఐడి (#R124) నమోదు చేయండి',
    trackButton: 'వెతకండి',
    trackSafeNote: 'గోప్యతా హామీ: అధికారుల ద్వారా ధృవీకరించబడిన సమాచారం మాత్రమే చూపబడుతుంది.',
    caseNotFound: 'ఈ ఐడితో ఎలాంటి కేసు కనుగొనబడలేదు.',
    caseStatusLabel: 'ప్రస్తుత స్థితి',
    lastKnownLocLabel: 'చివరిగా గుర్తించిన ప్రదేశం',
    lastUpdatedLabel: 'చివరి అప్‌డేట్',
    nextStepLabel: 'తదుపరి చర్య',
    statusUnverified: 'నమోదైంది (శోధన ప్రారంభమైంది)',
    statusPossibleMatch: 'సాధ్యమైన సరిపోలిక కనుగొనబడింది',
    statusUnderVerification: 'ధృవీకరణ జరుగుతోంది',
    statusVerified: 'గుర్తింపు అధికారికంగా ధృవీకరించబడింది',
    statusFamilyNotified: 'కుటుంబ సభ్యులకు సమాచారం అందించబడుతోంది',
    statusReunited: 'కుటుంబం సురక్షితంగా ఏకమైంది',
    statusClosed: 'కేసు ముగిసింది',
    coreFusionTitle: 'లైవ్ కేస్ ఫ్యూజన్ ఇంజిన్',
    coreFusionDesc: 'ఆసుపత్రులు, షెల్టర్‌లు మరియు రెస్క్యూ డేటాను పోల్చి కచ్చితమైన ఫలితాలను ఇస్తుంది.',
    coreNbaTitle: 'నెక్స్ట్-బెస్ట్-యాక్షన్ ఇంజిన్',
    coreNbaDesc: 'రెస్క్యూ సిబ్బందికి తదుపరి అత్యవసర చర్యలను నిర్దేశిస్తుంది.',
    coreLoopTitle: 'ధృవీకరించబడిన పునఃకలయిక లూప్',
    coreLoopDesc: 'పూర్తి ధృవీకరణ జరిగే వరకు తప్పుడు సమాచారం వ్యాపించకుండా నిరోధిస్తుంది.',
    submitReport: 'నివేదికను సమర్పించండి',
    fullName: 'పూర్తి పేరు',
    age: 'వయస్సు',
    gender: 'లింగం',
    clothing: 'ధరించిన దుస్తులు',
    scarsAndMarks: 'పుట్టుమచ్చలు లేదా గాయాల గుర్తులు',
    lastSeenLocation: 'చివరిగా చూసిన ప్రదేశం',
    contactNumber: 'సంప్రదింపు నంబర్',
    uploadPhoto: 'ఫోటోను అప్‌లోడ్ చేయండి',
    notes: 'ఇతర ముఖ్యమైన వివరాలు',
    cancel: 'రద్దు చేయండి',
    verifyMatch: 'సరిపోలికను ధృవీకరించండి',
    confirmReunification: 'పునఃకలయికను నిర్ధారించండి',
  },

  ml: {
    appName: 'റീയുണൈറ്റ്360 (Reunite360)',
    appTagline: 'ദുരന്ത നിവാരണവും കുടുംബ പുനരേകീകരണ വേദി',
    disasterHeader: 'സജീവ അടിയന്തരാവസ്ഥ: ചുഴലിക്കാറ്റ് വർധ / തീരദേശ പ്രളയ മേഖല',
    activeHelpline: 'ടോൾ-ഫ്രീ അടിയന്തര ഹെൽപ്പ് ലൈൻ: 1070 / 1800-425-3333',
    switchRole: 'പോർട്ടൽ തിരഞ്ഞെടുക്കുക',
    language: 'ഭാഷ',
    navHome: 'പബ്ലിക് പോർട്ടൽ',
    navReportMissing: 'കാണാതായവരെ റിപ്പോർട്ട് ചെയ്യുക',
    navReportFound: 'കണ്ടെത്തിയവരെ റിപ്പോർട്ട് ചെയ്യുക',
    navTrackCase: 'കേസ് നില പരിശോധിക്കുക',
    navFacilities: 'ദുരിതാശ്വാസ ക്യാമ്പുകൾ & ആശുപത്രികൾ',
    navCommandCenter: 'കമാൻഡ് സെന്റർ',
    navFieldRescue: 'ഫീൽഡ് റെസ്ക്യൂ ടീം',
    navHospitalIntake: 'ആശുപത്രി / ഷെൽട്ടർ ഇൻടേക്ക്',
    heroTitle: 'ദുരന്തമുഖത്ത് വേർപിരിഞ്ഞ പ്രിയപ്പെട്ടവരെ സുരക്ഷിതമായി ഒന്നിപ്പിക്കുക',
    heroSubtitle: 'കുടുംബങ്ങളെയും രക്ഷാപ്രവർത്തകരെയും ആശുപത്രികളെയും സംയോജിപ്പിക്കുന്ന വിശ്വസനീയമായ പ്ലാറ്റ്‌ഫോം.',
    ctaReportMissingTitle: 'കാണാതായ വ്യക്തിയെ റിപ്പോർട്ട് ചെയ്യുക',
    ctaReportMissingDesc: 'ദുരന്തത്തിൽ വേർപിരിഞ്ഞ കുടുംബാംഗങ്ങളുടെ വിവരങ്ങൾ രജിസ്റ്റർ ചെയ്യുക.',
    ctaReportFoundTitle: 'കണ്ടെത്തിയ വ്യക്തിയെ റിപ്പോർട്ട് ചെയ്യുക',
    ctaReportFoundDesc: 'അഭയകേന്ദ്രങ്ങളിലോ ആശുപത്രികളിലോ ഉള്ള അപരിചിതരായ ആളുകളുടെ വിവരങ്ങൾ ചേർക്കുക.',
    ctaTrackCaseTitle: 'കേസ് പുരോഗതി പരിശോധിക്കുക',
    ctaTrackCaseDesc: 'കേസ് ഐഡി (#R124) നൽകി ഔദ്യോഗിക വിവരങ്ങൾ പരിശോധിക്കുക.',
    ctaEmergencyHelpTitle: 'അടിയന്തര സഹായവും ക്യാമ്പുകളും',
    ctaEmergencyHelpDesc: 'സമീപത്തുള്ള ദുരിതാശ്വാസ ക്യാമ്പുകൾ, ആശുപത്രികൾ, ഹെൽപ്പ് ലൈൻ എന്നിവ കണ്ടെത്തുക.',
    trackTitle: 'കേസ് വിവരങ്ങൾ തിരയുക',
    trackPlaceholder: 'കേസ് ഐഡി (#R124) അല്ലെങ്കിൽ ഫോൺ നമ്പർ നൽകുക',
    trackButton: 'തിരയുക',
    trackSafeNote: 'സുരക്ഷാ ഉറപ്പ്: ഔദ്യോഗികമായി സ്ഥിരീകരിച്ച വിവരങ്ങൾ മാത്രമേ ഇവിടെ കാണിക്കൂ.',
    caseNotFound: 'ഈ വിവരങ്ങൾ ഉള്ള കേസ് ലഭ്യമല്ല.',
    caseStatusLabel: 'നിലവിലെ അവസ്ഥ',
    lastKnownLocLabel: 'അവസാനം സ്ഥിരീകരിച്ച സ്ഥലം',
    lastUpdatedLabel: 'അവസാനം അപ്ഡേറ്റ് ചെയ്ത സമയം',
    nextStepLabel: 'അടുത്ത നടപടി',
    statusUnverified: 'രജിസ്റ്റർ ചെയ്തു (തിരച്ചിൽ തുടരുന്നു)',
    statusPossibleMatch: 'സാധ്യമായ പൊരുത്തം കണ്ടെത്തി',
    statusUnderVerification: 'സ്ഥിരീകരണ പരിശോധന നടക്കുന്നു',
    statusVerified: 'വ്യക്തിത്വം ഔദ്യോഗികമായി സ്ഥിരീകരിച്ചു',
    statusFamilyNotified: 'കുടുംബത്തെ അറിയിക്കുന്നു',
    statusReunited: 'കുടുംബവുമായി പുനരേകീകരിച്ചു',
    statusClosed: 'കേസ് പൂർത്തിയായി',
    coreFusionTitle: 'ലൈവ് കേസ് ഫ്യൂഷൻ എഞ്ചിൻ',
    coreFusionDesc: 'വിവിധ കേന്ദ്രങ്ങളിൽ നിന്നുള്ള വിവരങ്ങൾ താരതമ്യം ചെയ്ത് കൃത്യമായ പൊരുത്തം കണ്ടെത്തുന്നു.',
    coreNbaTitle: 'നെക്സ്റ്റ്-ബെസ്റ്റ്-ആക്ഷൻ എഞ്ചിൻ',
    coreNbaDesc: 'രക്ഷാപ്രവർത്തകർ അടുത്തതായി ചെയ്യേണ്ട കൃത്യമായ കാര്യങ്ങൾ മുൻഗണനാടിസ്ഥാനത്തിൽ നിർദ്ദേശിക്കുന്നു.',
    coreLoopTitle: 'സ്ഥിരീകരിച്ച പുനരേകീകരണ പ്രക്രിയ',
    coreLoopDesc: 'അധികൃതർ സ്ഥിരീകരിക്കുന്നതുവരെ തെറ്റായ വിവരങ്ങൾ പ്രചരിക്കുന്നത് തടയുന്നു.',
    submitReport: 'റിപ്പോർട്ട് സമർപ്പിക്കുക',
    fullName: 'മുഴുവൻ പേര്',
    age: 'പ്രായം',
    gender: 'ലിംഗഭേദം',
    clothing: 'ധരിച്ചിരുന്ന വസ്ത്രം',
    scarsAndMarks: 'തിരിച്ചറിയൽ അടയാളങ്ങൾ',
    lastSeenLocation: 'അവസാനം കണ്ട സ്ഥലം',
    contactNumber: 'ഫോൺ നമ്പർ',
    uploadPhoto: 'ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക',
    notes: 'മറ്റു വിവരങ്ങൾ',
    cancel: 'റദ്ദാക്കുക',
    verifyMatch: 'സ്ഥിരീകരിക്കുക',
    confirmReunification: 'പുനരേകീകരണം ഉറപ്പാക്കുക',
  },

  bn: {
    appName: 'রিইউনাইট৩৬০ (Reunite360)',
    appTagline: 'দুর্যোগ প্রতিক্রিয়া, পারিবারিক পুনর্মিলন ও উদ্ধার সমন্বয় প্ল্যাটফর্ম',
    disasterHeader: 'জরুরি অবস্থা: ঘূর্ণিঝড় ভরদা / উপকূলীয় বন্যা অঞ্চল ডেল্টা',
    activeHelpline: 'টোল-ফ্রি জরুরি হেল্পলাইন: 1070 / 1800-425-3333',
    switchRole: 'সক্রিয় পোর্টাল নির্বাচন করুন',
    language: 'ভাষা',
    navHome: 'পাবলিক পোর্টাল',
    navReportMissing: 'নিখোঁজ ব্যক্তির রিপোর্ট',
    navReportFound: 'উদ্ধারকৃত ব্যক্তির রিপোর্ট',
    navTrackCase: 'কেস ট্র্যাক করুন',
    navFacilities: 'নিকটবর্তী আশ্রয়কেন্দ্র ও হাসপাতাল',
    navCommandCenter: 'কমান্ড সেন্টার',
    navFieldRescue: 'ফিল্ড রেসকিউ টিম',
    navHospitalIntake: 'হাসপাতাল / শেল্টার ইনটেক',
    heroTitle: 'দুর্যোগের মুহূর্তে বিচ্ছিন্ন প্রিয়জনদের নিরাপদে ফিরিয়ে আনুন',
    heroSubtitle: 'পরিবার, উদ্ধারকারী দল, আশ্রয় শিবির এবং হাসপাতালকে সংযুক্তকারী একটি নির্ভরযোগ্য প্ল্যাটফর্ম।',
    ctaReportMissingTitle: 'নিখোঁজ ব্যক্তির রিপোর্ট করুন',
    ctaReportMissingDesc: 'দুর্যোগে নিখোঁজ হওয়া পরিবারের সদস্যের তথ্য নথিবদ্ধ করুন।',
    ctaReportFoundTitle: 'উদ্ধারকৃত ব্যক্তির রিপোর্ট করুন',
    ctaReportFoundDesc: 'হাসপাতাল বা শিবিরে থাকা অজ্ঞাত ব্যক্তির তথ্য যোগ করুন।',
    ctaTrackCaseTitle: 'কেস স্ট্যাটাস ট্র্যাক করুন',
    ctaTrackCaseDesc: 'আপনার কেস আইডি (#R124) দিয়ে যাচাইকৃত সর্বশেষ তথ্য জানুন।',
    ctaEmergencyHelpTitle: 'জরুরি সাহায্য ও আশ্রয়কেন্দ্র',
    ctaEmergencyHelpDesc: 'কাছের আশ্রয়কেন্দ্র, হাসপাতাল এবং হেল্পলাইন নম্বর খুঁজুন।',
    trackTitle: 'আপনার কেস ট্র্যাক করুন',
    trackPlaceholder: 'কেস আইডি (#R124) লিখুন',
    trackButton: 'অনুসন্ধান করুন',
    trackSafeNote: 'গোপনীয়তার আশ্বাস: শুধুমাত্র কর্তৃপক্ষের দ্বারা যাচাইকৃত সঠিক তথ্যই এখানে প্রদর্শিত হয়।',
    caseNotFound: 'এই আইডি দিয়ে কোনো কেস পাওয়া যায়নি।',
    caseStatusLabel: 'বর্তমান স্ট্যাটাস',
    lastKnownLocLabel: 'সর্বশেষ যাচাইকৃত অবস্থান',
    lastUpdatedLabel: 'সর্বশেষ আপডেট',
    nextStepLabel: 'পরবর্তী পদক্ষেপ',
    statusUnverified: 'নিবন্ধিত (অনুসন্ধান চলছে)',
    statusPossibleMatch: 'সম্ভাব্য মিল পাওয়া গেছে (বিশ্লেষণ চলছে)',
    statusUnderVerification: 'যাচাইকরণ প্রক্রিয়াধীন',
    statusVerified: 'পরিচয় আনুষ্ঠানিকভাবে যাচাই করা হয়েছে',
    statusFamilyNotified: 'পরিবারকে জানানো হচ্ছে',
    statusReunited: 'পরিবার নিরাপদে পুনর্মিলিত হয়েছে',
    statusClosed: 'কেস সমাপ্ত',
    coreFusionTitle: 'লাইভ কেস ফিউশন ইঞ্জিন',
    coreFusionDesc: 'বিভিন্ন উৎসের তথ্য মিলিয়ে সঠিক ফলাফল তৈরি করে।',
    coreNbaTitle: 'নেক্সট-বেস্ট-অ্যাকশন ইঞ্জিন',
    coreNbaDesc: 'উদ্ধারকারীদের অগ্রাধিকার ভিত্তিতে পরবর্তী পদক্ষেপের নির্দেশ দেয়।',
    coreLoopTitle: 'যাচাইকৃত পুনর্মিলন প্রক্রিয়া',
    coreLoopDesc: 'সম্পূর্ণ যাচাই না হওয়া পর্যন্ত ভুল তথ্য যাওয়া রোধ করে।',
    submitReport: 'রিপোর্ট জমা দিন',
    fullName: 'পুরো নাম',
    age: 'বয়স',
    gender: 'লিঙ্গ',
    clothing: 'পোশাকের বিবরণ',
    scarsAndMarks: 'শনাক্তকরণ চিহ্ন বা দাগ',
    lastSeenLocation: 'সর্বশেষ দেখার স্থান',
    contactNumber: 'যোগাযোগের নম্বর',
    uploadPhoto: 'ছবি আপলোড করুন',
    notes: 'গুরুত্বপূর্ণ নোট',
    cancel: 'বাতিল',
    verifyMatch: 'মিল নিশ্চিত করুন',
    confirmReunification: 'পুনর্মিলন নিশ্চিত করুন',
  },
};
