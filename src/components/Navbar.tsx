import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCases } from '../context/CaseContext';
import type { LanguageCode } from '../i18n/translations';
import type { UserRole } from '../types';
import {
  ShieldAlert,
  Globe,
  Radio,
  Users,
  Activity,
  Building2,
  PhoneCall,
  Sun,
  Moon,
  Fingerprint,
} from 'lucide-react';

interface NavbarProps {
  currentTab?: string;
  setCurrentTab: (tab: string) => void;
  isHighContrast: boolean;
  setIsHighContrast: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isHighContrast,
  setIsHighContrast,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { userRole, setUserRole, metrics } = useCases();

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'ml', label: 'മലയാളം (Malayalam)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
  ];

  const roles: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'public_family', label: 'Family / Public', icon: <Users size={15} /> },
    { role: 'rescue_team', label: 'Field Rescue', icon: <Radio size={15} /> },
    { role: 'hospital_shelter', label: 'Hospital / Shelter', icon: <Building2 size={15} /> },
    { role: 'command_authority', label: 'Command Authority', icon: <Activity size={15} /> },
  ];

  const handleRoleChange = (r: UserRole) => {
    setUserRole(r);
    if (r === 'public_family') setCurrentTab('public_home');
    else if (r === 'rescue_team') setCurrentTab('field_rescue');
    else if (r === 'hospital_shelter') setCurrentTab('hospital_intake');
    else if (r === 'command_authority') setCurrentTab('command_center');
  };

  return (
    <>
      {/* Active Disaster Emergency Ribbon */}
      <div className="emergency-ribbon">
        <div className="app-container ribbon-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="emergency-tag pulse-red">
              <ShieldAlert size={13} /> {t.disasterHeader}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
              <PhoneCall size={13} /> {t.activeHelpline}
            </span>
            <span className="badge badge-verification" style={{ fontSize: '0.7rem' }}>
              LIVE FUSION ENGINE ACTIVE ({metrics.possibleMatchesCount} Candidates)
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="app-header">
        <div className="app-container header-content">
          {/* Brand */}
          <div className="brand-wrapper" onClick={() => setCurrentTab('public_home')}>
            <div className="brand-icon-box">
              <ShieldAlert size={26} />
            </div>
            <div>
              <div className="brand-title">Reunite360</div>
              <span className="brand-tag">Disaster Family Reunification & Rescue System</span>
            </div>
          </div>

          {/* Role Navigation Bar */}
          <div className="role-bar">
            {roles.map(item => (
              <button
                key={item.role}
                className={`role-tab ${userRole === item.role && currentTab !== 'biometric_intake' ? 'active' : ''}`}
                onClick={() => handleRoleChange(item.role)}
                title={item.label}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            {/* Biometric Verification Tab */}
            <button
              className={`role-tab ${currentTab === 'biometric_intake' ? 'active' : ''}`}
              onClick={() => setCurrentTab('biometric_intake')}
              title="Biometric Verification & Family Search"
              style={{
                borderColor: currentTab === 'biometric_intake' ? '#38bdf8' : 'rgba(56, 189, 248, 0.4)',
                background: currentTab === 'biometric_intake' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(56, 189, 248, 0.08)',
                color: '#38bdf8',
              }}
            >
              <Fingerprint size={16} />
              <span>Biometric Verification</span>
            </button>
          </div>

          {/* Utilities: Language + Accessibility High Contrast */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Language Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={16} color="var(--text-secondary)" />
              <select
                className="form-select"
                style={{ padding: '6px 10px', fontSize: '0.825rem', width: 'auto' }}
                value={language}
                onChange={e => setLanguage(e.target.value as LanguageCode)}
                aria-label="Select Language"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* High Contrast Mode Toggle */}
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setIsHighContrast(prev => !prev)}
              title="Toggle High-Contrast Accessibility Mode"
              style={{ padding: '6px 10px' }}
            >
              {isHighContrast ? <Sun size={15} /> : <Moon size={15} />}
              <span style={{ fontSize: '0.75rem' }}>{isHighContrast ? 'Standard' : 'Contrast'}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
