import React from 'react';
import { useCases } from '../context/CaseContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Building2,
  PhoneCall,
  MapPin,
} from 'lucide-react';

export const FacilitiesView: React.FC = () => {
  const { facilities } = useCases();
  const { t } = useLanguage();

  return (
    <div className="app-container" style={{ padding: '32px 0 60px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{t.navFacilities}</h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
          Official list of operational relief camps, emergency hospital trauma centers, and supply depots.
        </p>
      </div>

      {/* Facilities Grid */}
      <div className="grid-cols-2" style={{ gap: '20px' }}>
        {facilities.map(fac => {
          const occupancyPct = Math.round((fac.currentOccupancy / fac.totalCapacity) * 100);
          const isHospital = fac.type === 'HOSPITAL';

          return (
            <div key={fac.id} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      background: isHospital ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: isHospital ? '#60a5fa' : '#fbbf24',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Building2 size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{fac.name}</h3>
                    <span className="badge badge-verification" style={{ fontSize: '0.7rem' }}>
                      {fac.type} • {fac.location.sector || 'Sector Delta'}
                    </span>
                  </div>
                </div>

                <span className="badge badge-verified">{fac.availableBeds} BEDS OPEN</span>
              </div>

              {/* Location & Contact */}
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e2e8f0' }}>
                  <MapPin size={15} color="#60a5fa" /> {fac.location.address}
                </div>
                {fac.location.landmark && (
                  <div style={{ marginLeft: '21px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Landmark: {fac.location.landmark}
                  </div>
                )}
              </div>

              {/* Capacity Progress Bar */}
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '12px 14px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Shelter Occupancy</span>
                  <span style={{ fontWeight: 700 }}>
                    {fac.currentOccupancy} / {fac.totalCapacity} ({occupancyPct}%)
                  </span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: '#1e293b', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${occupancyPct}%`,
                      background: occupancyPct > 85 ? '#f43f5e' : occupancyPct > 70 ? '#f59e0b' : '#10b981',
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                <a
                  href={`tel:${fac.phone}`}
                  className="btn btn-primary btn-sm"
                  style={{ textDecoration: 'none' }}
                >
                  <PhoneCall size={14} /> Call {fac.phone}
                </a>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Staff on Duty: <strong>{fac.medicalStaffOnDuty}</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
