import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function IncidentMap({ cases = [], rescueTeams = [], onSelectCase }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([13.0827, 80.2707], 13);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(leafletMap.current);
    }

    // Clear old markers
    markersRef.current.forEach(m => leafletMap.current.removeLayer(m));
    markersRef.current = [];

    // Custom SVG icon generator
    const createCustomIcon = (color, symbol) => {
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
          <path fill="${color}" stroke="#ffffff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <text x="12" y="11" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">${symbol}</text>
        </svg>
      `;
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: svg,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -28]
      });
    };

    // Plot Cases
    cases.forEach(c => {
      let lat = 13.0827;
      let lng = 80.2707;
      let color = "#3b82f6";
      let symbol = "C";

      if (c.case_type === 'EMERGENCY') {
        color = c.priority === 'CRITICAL' ? '#ef4444' : '#f59e0b';
        symbol = "🚨";
        lat = c.emergency?.lat || lat;
        lng = c.emergency?.lng || lng;
      } else if (c.case_type === 'MISSING') {
        color = '#f59e0b';
        symbol = "M";
        lat = c.person?.lat || lat;
        lng = c.person?.lng || lng;
      } else if (c.case_type === 'FOUND') {
        color = '#10b981';
        symbol = "F";
        lat = c.person?.lat || lat;
        lng = c.person?.lng || lng;
      }

      if (lat && lng) {
        const icon = createCustomIcon(color, symbol);
        const marker = L.marker([lat, lng], { icon }).addTo(leafletMap.current);

        const name = c.person?.name || c.person?.name_if_known || c.emergency?.location || c.id;
        const popupContent = document.createElement('div');
        popupContent.className = "p-2 font-sans";
        popupContent.innerHTML = `
          <div class="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 mb-1 flex items-center justify-between">
            <span>${c.id}</span>
            <span class="px-1.5 py-0.5 rounded text-[10px] text-white bg-slate-800">${c.case_type}</span>
          </div>
          <p class="text-xs font-semibold text-slate-800">${name}</p>
          <p class="text-[11px] text-slate-600 mt-0.5">Status: <span class="font-bold text-blue-600">${c.status}</span></p>
          <button id="popup-btn-${c.id}" class="mt-2 w-full bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold py-1 px-2 rounded shadow transition">
            View Full Case Details →
          </button>
        `;

        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          const btn = document.getElementById(`popup-btn-${c.id}`);
          if (btn && onSelectCase) {
            btn.onclick = () => onSelectCase(c.id);
          }
        });

        markersRef.current.push(marker);
      }
    });

    // Plot Rescue Teams
    rescueTeams.forEach(team => {
      if (team.lat && team.lng) {
        const icon = createCustomIcon('#8b5cf6', '🚑');
        const marker = L.marker([team.lat, team.lng], { icon }).addTo(leafletMap.current);
        marker.bindPopup(`
          <div class="p-1 font-sans">
            <p class="text-xs font-bold text-purple-700">${team.name}</p>
            <p class="text-[11px] text-slate-700">Leader: ${team.leader}</p>
            <p class="text-[11px] text-slate-700">Status: <span class="font-bold text-emerald-600">${team.status}</span></p>
          </div>
        `);
        markersRef.current.push(marker);
      }
    });

  }, [cases, rescueTeams, onSelectCase]);

  return (
    <div className="relative w-full h-[480px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      <div ref={mapRef} className="w-full h-full z-10" />
      {/* Legend overlay */}
      <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur border border-slate-800 p-2.5 rounded-lg text-[11px] z-20 space-y-1 text-slate-300 shadow-lg">
        <div className="font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1 mb-1">Live Map Legend</div>
        <div className="flex items-center space-x-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span><span>Critical Emergency SOS</span></div>
        <div className="flex items-center space-x-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span>Missing Person</span></div>
        <div className="flex items-center space-x-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span>Found / Shelter Intake</span></div>
        <div className="flex items-center space-x-2"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span><span>Rescue Unit (Deployed)</span></div>
      </div>
    </div>
  );
}
