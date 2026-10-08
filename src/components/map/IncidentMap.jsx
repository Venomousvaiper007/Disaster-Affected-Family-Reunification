import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useCommand } from '../../context/CommandContext';
import {
  Layers,
  Filter,
  Eye,
  List,
  Map as MapIcon,
  Shield,
  Building2,
  Radio,
  UserX,
  UserCheck,
  HeartHandshake,
  AlertTriangle,
  Search,
  Crosshair,
  Maximize2,
  RefreshCw,
  Navigation,
  LifeBuoy,
  HeartPulse,
  Flame,
  Building,
  CheckCircle2,
  RotateCcw,
  Globe,
  Compass,
  ChevronDown,
  ChevronUp,
  X,
  MapPin,
  Sparkles,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

// Fix Leaflet Default Marker Icon issue in React
delete L.Icon.Default.prototype._getIconUrl;

// Custom Marker Generator with SVG Icons & Humanitarian Pulse Rings
const createCustomIcon = (type, priority = 'MEDIUM', isReunited = false) => {
  let bgColor = '#155E63'; // Deep Teal default
  let pulseClass = '';
  let svgPath = '';

  if (isReunited) {
    bgColor = '#24856A'; // Success Green
    svgPath = '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="currentColor"/>';
  } else if (type === 'MISSING' || type === 'MISSING_PERSON') {
    bgColor = priority === 'URGENT' || priority === 'CRITICAL' ? '#C83D4D' : '#F47C65';
    pulseClass = priority === 'URGENT' || priority === 'CRITICAL' ? 'marker-pulse-urgent' : 'marker-pulse-coral';
    svgPath = '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="8" x2="23" y2="14"/><line x1="23" y1="8" x2="17" y2="14"/>';
  } else if (type === 'FOUND' || type === 'FOUND_PERSON') {
    bgColor = '#155E63'; // Deep Teal
    pulseClass = 'marker-pulse-teal';
    svgPath = '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>';
  } else if (type === 'TRAPPED' || type === 'TRAPPED_PERSON') {
    bgColor = '#C83D4D';
    pulseClass = 'marker-pulse-urgent';
    svgPath = '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>';
  } else if (type === 'MEDICAL' || type === 'MEDICAL_EMERGENCY') {
    bgColor = '#B91C1C';
    pulseClass = 'marker-pulse-urgent';
    svgPath = '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5v14M5 12h14"/>';
  } else if (type === 'HAZARD' || type === 'FIRE_HAZARD') {
    bgColor = '#D97706';
    pulseClass = 'marker-pulse-coral';
    svgPath = '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>';
  } else if (type === 'SHELTER') {
    bgColor = '#397BB5'; // Relief Blue
    svgPath = '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>';
  } else if (type === 'HOSPITAL') {
    bgColor = '#C83D4D'; // Medical Red
    svgPath = '<path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="4"/>';
  } else if (type === 'TEAM') {
    bgColor = '#123B3A'; // Dark Evergreen
    pulseClass = 'marker-pulse-teal';
    svgPath = '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>';
  } else if (type === 'SEARCH_TARGET') {
    bgColor = '#7C3AED';
    pulseClass = 'marker-pulse-urgent';
    svgPath = '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>';
  } else {
    bgColor = '#687A7C';
    svgPath = '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>';
  }

  const html = `
    <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-card ${pulseClass}" style="background-color: ${bgColor}">
      <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${svgPath}
      </svg>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

// Map View Controller for auto-centering, resizing & flyTo actions
const MapController = ({ targetCoord, zoomLevel = 14 }) => {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (targetCoord) {
      map.flyTo(targetCoord, zoomLevel, { duration: 1.4 });
    }
  }, [targetCoord, zoomLevel, map]);

  return null;
};

// Known Major Geographic Places Database across India for Instant Offline Search
const KNOWN_PLACES_INDEX = [
  { name: 'Wayanad, Kerala', coords: [11.5564, 76.1320], region: 'Kerala', zoom: 13 },
  { name: 'Meppadi, Wayanad, Kerala', coords: [11.5510, 76.1265], region: 'Kerala', zoom: 14 },
  { name: 'Chooralmala, Wayanad, Kerala', coords: [11.5360, 76.1680], region: 'Kerala', zoom: 14 },
  { name: 'Mundakkai, Wayanad, Kerala', coords: [11.5450, 76.1500], region: 'Kerala', zoom: 14 },
  { name: 'Kalpetta, Wayanad, Kerala', coords: [11.6080, 76.0820], region: 'Kerala', zoom: 13 },
  { name: 'Mananthavady, Wayanad, Kerala', coords: [11.8025, 76.0040], region: 'Kerala', zoom: 13 },
  { name: 'Kozhikode, Kerala', coords: [11.2588, 75.7804], region: 'Kerala', zoom: 12 },
  { name: 'Kochi, Kerala', coords: [9.9312, 76.2673], region: 'Kerala', zoom: 12 },
  { name: 'Thiruvananthapuram, Kerala', coords: [8.5241, 76.9366], region: 'Kerala', zoom: 12 },
  { name: 'Chennai, Tamil Nadu', coords: [13.0827, 80.2707], region: 'Tamil Nadu', zoom: 12 },
  { name: 'Velachery, Chennai, Tamil Nadu', coords: [12.9759, 80.2212], region: 'Tamil Nadu', zoom: 14 },
  { name: 'Saidapet, Chennai, Tamil Nadu', coords: [13.0213, 80.2231], region: 'Tamil Nadu', zoom: 14 },
  { name: 'St. Thomas Mount, Chennai', coords: [13.0033, 80.1983], region: 'Tamil Nadu', zoom: 14 },
  { name: 'Tambaram, Chennai', coords: [12.9348, 80.1342], region: 'Tamil Nadu', zoom: 14 },
  { name: 'Cuddalore, Tamil Nadu', coords: [11.7480, 79.7714], region: 'Tamil Nadu', zoom: 13 },
  { name: 'Ennore, Chennai', coords: [13.2180, 80.3230], region: 'Tamil Nadu', zoom: 13 },
  { name: 'Coimbatore, Tamil Nadu', coords: [11.0168, 76.9558], region: 'Tamil Nadu', zoom: 12 },
  { name: 'Madurai, Tamil Nadu', coords: [9.9252, 78.1198], region: 'Tamil Nadu', zoom: 12 },
  { name: 'Rajahmundry, Andhra Pradesh', coords: [17.0005, 81.8040], region: 'Andhra Pradesh', zoom: 13 },
  { name: 'Bhadrachalam, Telangana', coords: [17.6689, 80.8936], region: 'Telangana', zoom: 13 },
  { name: 'Vijayawada, Andhra Pradesh', coords: [16.5062, 80.6480], region: 'Andhra Pradesh', zoom: 12 },
  { name: 'Hyderabad, Telangana', coords: [17.3850, 78.4867], region: 'Telangana', zoom: 12 },
  { name: 'Bengaluru, Karnataka', coords: [12.9716, 77.5946], region: 'Karnataka', zoom: 12 },
  { name: 'Bellandur, Bengaluru', coords: [12.9280, 77.6740], region: 'Karnataka', zoom: 14 },
  { name: 'Mahadevapura, Bengaluru', coords: [12.9918, 77.6974], region: 'Karnataka', zoom: 14 },
  { name: 'Delhi NCR', coords: [28.6692, 77.2315], region: 'Delhi', zoom: 12 },
  { name: 'Kashmere Gate, Delhi', coords: [28.6650, 77.2380], region: 'Delhi', zoom: 14 },
  { name: 'Mumbai, Maharashtra', coords: [19.0760, 72.8777], region: 'Maharashtra', zoom: 12 },
  { name: 'Kolkata, West Bengal', coords: [22.5726, 88.3639], region: 'West Bengal', zoom: 12 },
  { name: 'Dehradun, Uttarakhand', coords: [30.3165, 78.0322], region: 'Uttarakhand', zoom: 12 },
  { name: 'Shimla, Himachal Pradesh', coords: [31.1048, 77.1734], region: 'Himachal Pradesh', zoom: 12 }
];

// Free basemap tile providers
const BASEMAP_PROVIDERS = {
  osm_hot: {
    id: 'osm_hot',
    name: 'Humanitarian HOT',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles by <a href="https://www.hotosm.org/">HOT</a>',
    subdomains: ['a', 'b', 'c']
  },
  osm_standard: {
    id: 'osm_standard',
    name: 'OpenStreetMap Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: ['a', 'b', 'c']
  },
  esri_street: {
    id: 'esri_street',
    name: 'Esri World Street',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    subdomains: ['server']
  },
  esri_satellite: {
    id: 'esri_satellite',
    name: 'Esri Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    subdomains: ['server']
  }
};

export const IncidentMap = () => {
  const {
    operations,
    activeOperation,
    setActiveOperationId,
    cases,
    shelters,
    hospitals,
    rescueTeams,
    openCaseDetails,
    highlightedCaseId,
    setHighlightedCaseId,
    setIsRegisterOpen,
    t
  } = useCommand();

  // Selected Basemap
  const [selectedBasemap, setSelectedBasemap] = useState('osm_hot');

  // Layer Toggles
  const [layers, setLayers] = useState({
    missing: true,
    found: true,
    emergencies: true,
    shelters: true,
    hospitals: true,
    teams: true,
    hazardRings: true
  });

  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [mapSearch, setMapSearch] = useState('');
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);
  const [searchTargetPin, setSearchTargetPin] = useState(null);
  const [isListView, setIsListView] = useState(false);
  const [targetCoord, setTargetCoord] = useState(null);
  const [targetZoom, setTargetZoom] = useState(13);

  // Both Menu Panels are open and accessible by default
  const [showIncidentStream, setShowIncidentStream] = useState(true);
  const [showLayerPanel, setShowLayerPanel] = useState(true);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  // Auto-center map when active operation changes
  useEffect(() => {
    if (activeOperation && activeOperation.coordinates) {
      setTargetCoord(activeOperation.coordinates);
      setTargetZoom(activeOperation.zoom || 12);
    }
  }, [activeOperation]);

  // Handle instant search matching cases or places
  useEffect(() => {
    if (!mapSearch.trim()) {
      setSearchSuggestions([]);
      return;
    }

    const query = mapSearch.toLowerCase();
    const matchedPlaces = KNOWN_PLACES_INDEX.filter(p =>
      p.name.toLowerCase().includes(query) || p.region.toLowerCase().includes(query)
    ).slice(0, 4);

    const matchedCases = cases.filter(c =>
      c.fullName?.toLowerCase().includes(query) ||
      c.id?.toLowerCase().includes(query) ||
      c.lastSeenLocation?.toLowerCase().includes(query)
    ).slice(0, 3);

    setSearchSuggestions({ places: matchedPlaces, cases: matchedCases });
  }, [mapSearch, cases]);

  // Filter cases across map
  const visibleCases = cases.filter(c => {
    if (urgencyFilter === 'URGENT' && c.priority !== 'URGENT' && c.priority !== 'CRITICAL') return false;
    
    // Layer filters
    const isMissing = c.classification === 'MISSING' || c.category === 'MISSING_PERSON';
    const isFound = c.classification === 'FOUND' || c.category === 'FOUND_PERSON';
    const isEmergency = !isMissing && !isFound;

    if (isMissing && !layers.missing) return false;
    if (isFound && !layers.found) return false;
    if (isEmergency && !layers.emergencies) return false;

    if (mapSearch && !searchTargetPin) {
      const matchName = c.fullName?.toLowerCase().includes(mapSearch.toLowerCase());
      const matchLoc = c.lastSeenLocation?.toLowerCase().includes(mapSearch.toLowerCase());
      const matchId = c.id?.toLowerCase().includes(mapSearch.toLowerCase());
      return matchName || matchLoc || matchId;
    }
    return true;
  });

  const handleSelectIncident = (c) => {
    setHighlightedCaseId(c.id);
    if (c.coordinates) {
      setTargetCoord(c.coordinates);
      setTargetZoom(15);
    }
  };

  const handleSelectPlace = (place) => {
    setTargetCoord(place.coords);
    setTargetZoom(place.zoom || 14);
    setSearchTargetPin({
      name: place.name,
      coords: place.coords
    });
    setMapSearch(place.name);
    setSearchSuggestions([]);
  };

  // Perform online OpenStreetMap Geocode search for ANY place
  const handleUniversalSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!mapSearch.trim()) return;

    // Check offline dictionary first
    const offlineMatch = KNOWN_PLACES_INDEX.find(p =>
      p.name.toLowerCase().includes(mapSearch.toLowerCase())
    );

    if (offlineMatch) {
      handleSelectPlace(offlineMatch);
      return;
    }

    // Otherwise geocode query using OpenStreetMap Nominatim
    setIsSearchingGeocode(true);
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearch + ', India')}&limit=1`
      );
      const data = await resp.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const foundCoord = [lat, lon];
        setTargetCoord(foundCoord);
        setTargetZoom(14);
        setSearchTargetPin({
          name: data[0].display_name,
          coords: foundCoord
        });
        setSearchSuggestions([]);
      } else {
        const globalResp = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearch)}&limit=1`
        );
        const globalData = await globalResp.json();
        if (globalData && globalData.length > 0) {
          const lat = parseFloat(globalData[0].lat);
          const lon = parseFloat(globalData[0].lon);
          setTargetCoord([lat, lon]);
          setTargetZoom(13);
          setSearchTargetPin({
            name: globalData[0].display_name,
            coords: [lat, lon]
          });
        }
      }
    } catch (err) {
      console.warn("Geocoding lookup error:", err);
    } finally {
      setIsSearchingGeocode(false);
    }
  };

  const handleResetView = () => {
    setTargetCoord(activeOperation.coordinates || [13.0827, 80.2707]);
    setTargetZoom(activeOperation.zoom || 12);
    setHighlightedCaseId(null);
    setSearchTargetPin(null);
    setMapSearch('');
  };

  const currentBasemap = BASEMAP_PROVIDERS[selectedBasemap] || BASEMAP_PROVIDERS.osm_hot;

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] space-y-2.5">
      {/* Top Map Control Bar - Streamlined & Minimal */}
      <div className="bg-white border border-[#E1E9E7] rounded-2xl p-3 shadow-soft flex flex-wrap items-center justify-between gap-2.5 flex-shrink-0">
        {/* Left: Operation Info & Active Marker Counts */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#D8F3EF] text-[#155E63] border border-[#B2E4DD]">
            <MapIcon className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-[#1D3033] font-sans flex items-center gap-2">
              <span>{t('navMap')}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D8F3EF] text-[#155E63] font-semibold border border-[#B2E4DD]">
                {visibleCases.length} {t('activeCases')}
              </span>
            </h1>
          </div>
        </div>

        {/* Right Controls: Minimal & Effective */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Universal Place & Incident Search Box */}
          <form onSubmit={handleUniversalSearchSubmit} className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#687A7C]" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={mapSearch}
              onChange={(e) => setMapSearch(e.target.value)}
              className="bg-[#F4F7F6] border border-[#E1E9E7] focus:border-[#155E63] focus:bg-white rounded-xl text-xs pl-8 pr-7 py-1.5 text-[#1D3033] placeholder-[#687A7C] focus:outline-none w-44 sm:w-56 transition-all"
            />
            {mapSearch && (
              <button
                type="button"
                onClick={() => { setMapSearch(''); setSearchTargetPin(null); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#687A7C] hover:text-[#1D3033] cursor-pointer"
              >
                ×
              </button>
            )}

            {/* Quick Autocomplete Suggestions Dropdown */}
            {searchSuggestions && (searchSuggestions.places?.length > 0 || searchSuggestions.cases?.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E1E9E7] rounded-xl shadow-dropdown py-1.5 z-40 text-xs">
                {searchSuggestions.places?.length > 0 && (
                  <div>
                    <div className="px-3 py-1 text-[10px] font-mono text-[#687A7C] uppercase border-b border-[#E1E9E7]">Places / Sectors</div>
                    {searchSuggestions.places.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectPlace(p)}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#D8F3EF]/50 text-[#1D3033] flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-semibold">{p.name}</span>
                        <span className="text-[10px] text-[#155E63] font-mono">Fly To ↗</span>
                      </button>
                    ))}
                  </div>
                )}

                {searchSuggestions.cases?.length > 0 && (
                  <div className="border-t border-[#E1E9E7] mt-1 pt-1">
                    <div className="px-3 py-1 text-[10px] font-mono text-[#687A7C] uppercase">Matching Incidents</div>
                    {searchSuggestions.cases.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => { handleSelectIncident(c); setSearchSuggestions([]); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#D8F3EF]/50 text-[#1D3033] flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate">{c.fullName} ({c.id})</span>
                        <span className="text-[10px] text-[#C83D4D] font-mono">{c.priority}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Quick Disaster Region Selector */}
          <div className="flex items-center gap-1 bg-[#F4F7F6] border border-[#E1E9E7] p-1 rounded-xl text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-[#155E63] ml-1.5" />
            <select
              value={activeOperation.id}
              onChange={(e) => setActiveOperationId(e.target.value)}
              className="bg-transparent border-0 text-xs font-medium text-[#1D3033] focus:outline-none pr-2 cursor-pointer max-w-[130px] truncate"
            >
              {operations.map(op => (
                <option key={op.id} value={op.id}>{op.name}</option>
              ))}
            </select>
          </div>

          {/* Stream Menu Toggle */}
          <button
            onClick={() => setShowIncidentStream(!showIncidentStream)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              showIncidentStream ? 'bg-[#D8F3EF] text-[#155E63] border-[#B2E4DD]' : 'bg-white text-[#687A7C] border-[#E1E9E7] hover:text-[#1D3033]'
            }`}
            title="Toggle Live Incident Stream"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('mapStreamMenu')}</span>
          </button>

          {/* Layers Menu Toggle */}
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              showLayerPanel ? 'bg-[#D8F3EF] text-[#155E63] border-[#B2E4DD]' : 'bg-white text-[#687A7C] border-[#E1E9E7] hover:text-[#1D3033]'
            }`}
            title="Toggle Map Feeds & Layers"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('mapLayersMenu')}</span>
          </button>

          {/* Urgency Filter */}
          <button
            onClick={() => setUrgencyFilter(prev => prev === 'ALL' ? 'URGENT' : 'ALL')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              urgencyFilter === 'URGENT'
                ? 'bg-rose-50 text-[#C83D4D] border-rose-300 font-bold shadow-xs'
                : 'bg-white text-[#687A7C] border-[#E1E9E7] hover:text-[#1D3033]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#C83D4D]" />
            <span className="hidden sm:inline">{t('priorityUrgent')}</span>
          </button>

          {/* List vs Map View Toggle */}
          <button
            onClick={() => setIsListView(!isListView)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-[#E1E9E7] text-xs font-semibold text-[#1D3033] hover:bg-[#F4F7F6] transition-colors cursor-pointer shadow-xs"
          >
            {isListView ? <MapIcon className="w-3.5 h-3.5 text-[#155E63]" /> : <List className="w-3.5 h-3.5 text-[#155E63]" />}
          </button>

          {/* Report Issue Action */}
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F47C65] hover:bg-[#E9583D] text-white font-semibold text-xs shadow-coral-glow transition-all cursor-pointer"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* Main Map Body / Left Incident Stream Menu + Center Leaflet Map + Right Map Feeds & Layers Menu */}
      <div className="flex-1 relative rounded-2xl overflow-hidden border border-[#E1E9E7] bg-[#E8EFEF] shadow-card">
        {!isListView ? (
          <>
            {/* Interactive Leaflet Map with Real-Time Free Basemap Provider */}
            <MapContainer
              key={selectedBasemap}
              center={activeOperation.coordinates || [13.0827, 80.2707]}
              zoom={activeOperation.zoom || 12}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              <MapController targetCoord={targetCoord} zoomLevel={targetZoom} />

              {/* Free, Authentic Basemap TileLayer without API Key Restrictions */}
              <TileLayer
                key={selectedBasemap}
                url={currentBasemap.url}
                attribution={currentBasemap.attribution}
                subdomains={currentBasemap.subdomains || ['a', 'b', 'c']}
                maxZoom={19}
              />

              {/* Flood Hazard Buffer Zone Circles */}
              {layers.hazardRings && (
                <>
                  <Circle
                    center={[12.9800, 80.2200]}
                    radius={1500}
                    pathOptions={{ color: '#C83D4D', fillColor: '#C83D4D', fillOpacity: 0.15, weight: 2, dashArray: '5, 5' }}
                  />
                  <Circle
                    center={[11.5360, 76.1680]}
                    radius={2000}
                    pathOptions={{ color: '#C83D4D', fillColor: '#C83D4D', fillOpacity: 0.18, weight: 2, dashArray: '5, 5' }}
                  />
                </>
              )}

              {/* Search Target Pin Marker if user searched a place */}
              {searchTargetPin && (
                <Marker
                  position={searchTargetPin.coords}
                  icon={createCustomIcon('SEARCH_TARGET')}
                >
                  <Popup>
                    <div className="p-2.5 text-xs text-[#1D3033] bg-white rounded-xl space-y-1">
                      <div className="font-bold text-[#7C3AED] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Searched Location</span>
                      </div>
                      <div className="text-[11px] text-[#1D3033] font-medium">{searchTargetPin.name}</div>
                      <div className="text-[10px] text-[#687A7C] font-mono">[{searchTargetPin.coords[0].toFixed(4)}, {searchTargetPin.coords[1].toFixed(4)}]</div>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Cases & Emergency Incidents Markers Across ALL Places */}
              {visibleCases.map((c) => (
                <Marker
                  key={c.id}
                  position={c.coordinates || [13.0827, 80.2707]}
                  icon={createCustomIcon(c.category || c.classification, c.priority, c.status === 'REUNIFICATION_CONFIRMED')}
                  eventHandlers={{
                    click: () => handleSelectIncident(c)
                  }}
                >
                  <Popup>
                    <div className="p-3.5 w-68 text-[#1D3033] bg-white rounded-xl space-y-2">
                      <div className="flex items-center justify-between pb-1.5 border-b border-[#E1E9E7]">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.classification === 'MISSING' ? 'bg-amber-100 text-amber-800' :
                          c.classification === 'FOUND' ? 'bg-teal-100 text-[#155E63]' :
                          'bg-rose-100 text-[#C83D4D]'
                        }`}>
                          {c.category ? c.category.replace(/_/g, ' ') : c.classification}
                        </span>
                        <span className="font-mono text-[11px] text-[#155E63] font-bold">{c.id}</span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {c.photo && (
                          <img
                            src={c.photo}
                            alt={c.fullName}
                            className="w-10 h-10 rounded-xl object-cover border border-[#E1E9E7]"
                          />
                        )}
                        <div className="overflow-hidden flex-1">
                          <h4 className="font-bold text-xs text-[#1D3033] truncate">{c.fullName}</h4>
                          <span className="text-[10px] text-[#687A7C] block font-mono truncate">{c.lastSeenLocation}</span>
                          {c.priority && (
                            <span className="text-[10px] font-bold text-[#C83D4D] font-mono">Priority: {c.priority}</span>
                          )}
                        </div>
                      </div>

                      {c.clothing && (
                        <div className="text-[11px] text-[#687A7C] line-clamp-2">
                          <strong className="text-[#1D3033]">Attire: </strong>{c.clothing}
                        </div>
                      )}

                      <button
                        onClick={() => openCaseDetails(c)}
                        className="w-full py-1.5 rounded-xl bg-[#155E63] hover:bg-[#123B3A] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs mt-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t('viewDetails')}</span>
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Shelters Markers Across ALL Regions */}
              {layers.shelters && shelters.map(s => (
                <Marker
                  key={s.id}
                  position={s.coordinates}
                  icon={createCustomIcon('SHELTER')}
                >
                  <Popup>
                    <div className="p-3 w-64 bg-white text-[#1D3033] rounded-xl space-y-1.5">
                      <div className="flex items-center gap-2 pb-1 text-[#397BB5] font-bold text-xs border-b border-[#E1E9E7]">
                        <Building2 className="w-4 h-4" />
                        <span>{s.name}</span>
                      </div>
                      <div className="text-[11px] text-[#687A7C]">{s.location}</div>
                      <div className="text-[11px] font-mono text-[#24856A] font-semibold">
                        Occupancy: {s.occupancy} / {s.capacity} beds ({Math.round((s.occupancy / s.capacity) * 100)}%)
                      </div>
                      <div className="text-[10px] text-[#687A7C]">Liaison: {s.contactPerson}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Hospitals Markers Across ALL Regions */}
              {layers.hospitals && hospitals.map(h => (
                <Marker
                  key={h.id}
                  position={h.coordinates}
                  icon={createCustomIcon('HOSPITAL')}
                >
                  <Popup>
                    <div className="p-3 w-64 bg-white text-[#1D3033] rounded-xl space-y-1.5">
                      <div className="flex items-center gap-2 pb-1 text-[#C83D4D] font-bold text-xs border-b border-[#E1E9E7]">
                        <Crosshair className="w-4 h-4" />
                        <span>{h.name}</span>
                      </div>
                      <div className="text-[11px] text-[#687A7C]">{h.location}</div>
                      <div className="text-[11px] font-mono text-[#C83D4D] font-semibold">
                        Trauma Beds: {h.availableBeds} | ICU: {h.icuAvailable}
                      </div>
                      <div className="text-[10px] text-[#687A7C]">Medical Liaison: {h.contactPerson}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Rescue Teams Markers Across ALL Regions */}
              {layers.teams && rescueTeams.map(rt => (
                <Marker
                  key={rt.id}
                  position={rt.coordinates}
                  icon={createCustomIcon('TEAM')}
                >
                  <Popup>
                    <div className="p-3 w-64 bg-white text-[#1D3033] rounded-xl space-y-1.5">
                      <div className="flex items-center gap-2 pb-1 text-[#123B3A] font-bold text-xs border-b border-[#E1E9E7]">
                        <Radio className="w-4 h-4" />
                        <span>{rt.name}</span>
                      </div>
                      <div className="text-[11px] text-[#687A7C]">Sector: {rt.assignedSector}</div>
                      <div className="text-[11px] font-mono text-[#155E63] font-semibold">
                        Leader: {rt.leader} ({rt.members} Operators)
                      </div>
                      <div className="text-[10px] text-[#687A7C]">Radio Channel: {rt.radioChannel}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* RIGHT FLOATING MENU: MAP FEEDS & LAYER TOGGLES (z-[20]) */}
            {showLayerPanel ? (
              <div className="absolute top-4 right-4 z-[20] bg-white/95 backdrop-blur-md border border-[#E1E9E7] rounded-2xl p-3.5 shadow-dropdown w-72 max-w-[calc(100vw-2rem)] text-xs text-[#1D3033] animate-fade-in max-h-[80%] flex flex-col">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E1E9E7]">
                  <div className="flex items-center gap-1.5 font-mono font-bold text-[11px] uppercase text-[#155E63]">
                    <Layers className="w-4 h-4 text-[#155E63]" />
                    <span>Map Feeds & Layers Menu</span>
                  </div>
                  <button
                    onClick={() => setShowLayerPanel(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-[#687A7C] hover:text-[#1D3033] cursor-pointer"
                    title="Hide Menu"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-y-auto space-y-2.5 font-sans pr-1">
                  <div className="text-[10px] font-mono uppercase text-[#687A7C] font-bold">Incident Layers</div>
                  
                  <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#F4F7F6] cursor-pointer transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#F47C65] border border-white shadow-xs"></span>
                      <span className="font-medium">{t('navMissing')}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.missing}
                      onChange={() => setLayers(p => ({ ...p, missing: !p.missing }))}
                      className="rounded text-[#155E63] focus:ring-0 cursor-pointer w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#F4F7F6] cursor-pointer transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#155E63] border border-white shadow-xs"></span>
                      <span className="font-medium">{t('navFound')}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.found}
                      onChange={() => setLayers(p => ({ ...p, found: !p.found }))}
                      className="rounded text-[#155E63] focus:ring-0 cursor-pointer w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#F4F7F6] cursor-pointer transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#C83D4D] border border-white shadow-xs"></span>
                      <span className="font-medium">Trapped / Medical / Hazards</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.emergencies}
                      onChange={() => setLayers(p => ({ ...p, emergencies: !p.emergencies }))}
                      className="rounded text-[#155E63] focus:ring-0 cursor-pointer w-4 h-4"
                    />
                  </label>

                  <div className="text-[10px] font-mono uppercase text-[#687A7C] font-bold pt-1 border-t border-[#E1E9E7]">Infrastructure & Teams</div>

                  <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#F4F7F6] cursor-pointer transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#397BB5] border border-white shadow-xs"></span>
                      <span className="font-medium">{t('activeShelters')} ({shelters.length})</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.shelters}
                      onChange={() => setLayers(p => ({ ...p, shelters: !p.shelters }))}
                      className="rounded text-[#155E63] focus:ring-0 cursor-pointer w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#F4F7F6] cursor-pointer transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#B91C1C] border border-white shadow-xs"></span>
                      <span className="font-medium">{t('connectedHospitals')} ({hospitals.length})</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.hospitals}
                      onChange={() => setLayers(p => ({ ...p, hospitals: !p.hospitals }))}
                      className="rounded text-[#155E63] focus:ring-0 cursor-pointer w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#F4F7F6] cursor-pointer transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#123B3A] border border-white shadow-xs"></span>
                      <span className="font-medium">{t('activeTeams')} ({rescueTeams.length})</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.teams}
                      onChange={() => setLayers(p => ({ ...p, teams: !p.teams }))}
                      className="rounded text-[#155E63] focus:ring-0 cursor-pointer w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#F4F7F6] cursor-pointer transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-200 border border-[#C83D4D]"></span>
                      <span className="font-medium">Surge Hazard Rings</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={layers.hazardRings}
                      onChange={() => setLayers(p => ({ ...p, hazardRings: !p.hazardRings }))}
                      className="rounded text-[#155E63] focus:ring-0 cursor-pointer w-4 h-4"
                    />
                  </label>

                  {/* Basemap Selection */}
                  <div className="pt-2 border-t border-[#E1E9E7] space-y-1.5">
                    <div className="text-[10px] font-mono uppercase text-[#687A7C] font-bold">Basemap Tile Style</div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {Object.entries(BASEMAP_PROVIDERS).map(([key, bm]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedBasemap(key)}
                          className={`px-2 py-1.5 rounded-xl text-[11px] font-semibold border text-left truncate transition-all cursor-pointer ${
                            selectedBasemap === key
                              ? 'bg-[#D8F3EF] text-[#155E63] border-[#155E63] shadow-xs'
                              : 'bg-[#F4F7F6] text-[#687A7C] border-[#E1E9E7] hover:text-[#1D3033]'
                          }`}
                        >
                          {bm.name.replace('OpenStreetMap', 'OSM')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowLayerPanel(true)}
                className="absolute top-4 right-4 z-[20] bg-white/95 backdrop-blur border border-[#E1E9E7] hover:border-[#155E63] rounded-xl px-3 py-2 shadow-dropdown flex items-center gap-2 text-xs font-bold text-[#155E63] cursor-pointer hover:bg-[#F4F7F6] transition-all"
                title="Open Map Feeds & Layers Menu"
              >
                <Layers className="w-4 h-4 text-[#155E63]" />
                <span>Layers Menu</span>
              </button>
            )}

            {/* LEFT FLOATING MENU: LIVE INCIDENT STREAM (z-[20]) */}
            {showIncidentStream ? (
              <div className="absolute top-4 left-4 z-[20] w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md border border-[#E1E9E7] rounded-2xl p-3.5 shadow-dropdown max-h-[80%] flex flex-col animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-[#E1E9E7]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[11px] text-[#1D3033] uppercase tracking-wider">
                      Live Incident Stream
                    </span>
                    <span className="text-[10px] font-mono text-[#155E63] font-bold bg-[#D8F3EF] px-2 py-0.5 rounded-full border border-[#B2E4DD]">
                      {visibleCases.length} Active
                    </span>
                  </div>
                  <button
                    onClick={() => setShowIncidentStream(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-[#687A7C] hover:text-[#1D3033] cursor-pointer"
                    title="Hide Stream Menu"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Stream Quick Filter Tags */}
                <div className="flex items-center gap-1.5 py-2 overflow-x-auto border-b border-[#E1E9E7]/60 no-scrollbar">
                  <button
                    onClick={() => setUrgencyFilter('ALL')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all ${
                      urgencyFilter === 'ALL'
                        ? 'bg-[#155E63] text-white'
                        : 'bg-[#F4F7F6] text-[#687A7C] hover:text-[#1D3033]'
                    }`}
                  >
                    ALL ({cases.length})
                  </button>
                  <button
                    onClick={() => setUrgencyFilter('URGENT')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all flex items-center gap-1 ${
                      urgencyFilter === 'URGENT'
                        ? 'bg-[#C83D4D] text-white'
                        : 'bg-rose-50 text-[#C83D4D] border border-rose-200'
                    }`}
                  >
                    <AlertTriangle className="w-2.5 h-2.5" />
                    URGENT
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
                  {visibleCases.map(c => {
                    const isHighlighted = highlightedCaseId === c.id;

                    return (
                      <div
                        key={c.id}
                        onClick={() => handleSelectIncident(c)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                          isHighlighted
                            ? 'bg-[#D8F3EF] border-[#155E63] ring-1 ring-[#155E63] shadow-soft'
                            : 'bg-[#F4F7F6] hover:bg-[#D8F3EF]/30 border-[#E1E9E7]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                          <span className="font-bold text-[#155E63]">{c.id}</span>
                          <span className={`px-1.5 py-0.2 rounded font-bold ${
                            c.priority === 'URGENT' || c.priority === 'CRITICAL' ? 'bg-rose-100 text-[#C83D4D]' : 'text-[#687A7C]'
                          }`}>
                            {c.priority}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {c.photo && (
                            <img src={c.photo} alt={c.fullName} className="w-8 h-8 rounded-lg object-cover border border-[#E1E9E7]" />
                          )}
                          <div className="overflow-hidden flex-1">
                            <div className="font-bold text-xs text-[#1D3033] truncate">{c.fullName}</div>
                            <div className="text-[10px] text-[#687A7C] truncate">{c.lastSeenLocation}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 mt-1 border-t border-[#E1E9E7]/60 text-[10px] text-[#687A7C]">
                          <span className="truncate max-w-[130px]">{c.responseCentre?.split(' ')[0]}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openCaseDetails(c);
                            }}
                            className="text-[#155E63] font-bold hover:underline"
                          >
                            Dossier →
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {visibleCases.length === 0 && (
                    <div className="p-6 text-center text-xs text-[#687A7C] font-mono">
                      No matching incidents found
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowIncidentStream(true)}
                className="absolute top-4 left-4 z-[20] bg-white/95 backdrop-blur border border-[#E1E9E7] hover:border-[#155E63] rounded-xl px-3 py-2 shadow-dropdown flex items-center gap-2 text-xs font-bold text-[#155E63] cursor-pointer hover:bg-[#F4F7F6] transition-all"
                title="Open Live Incident Stream Menu"
              >
                <List className="w-4 h-4 text-[#155E63]" />
                <span>Incident Stream Menu</span>
              </button>
            )}

            {/* FLOATING MAP LEGEND & QUICK SHORTCUT BAR AT BOTTOM */}
            <div className="absolute bottom-4 left-4 right-4 z-[20] pointer-events-none flex items-center justify-between gap-2">
              {/* Bottom Left Legend Pills */}
              <div className="pointer-events-auto bg-white/90 backdrop-blur-md border border-[#E1E9E7] rounded-xl px-3 py-1.5 shadow-soft hidden lg:flex items-center gap-3 text-[11px] text-[#1D3033]">
                <span className="font-mono font-bold text-[10px] text-[#687A7C] uppercase">Legend:</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#F47C65]"></span> Missing</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#155E63]"></span> Found</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#C83D4D]"></span> Trapped / Medical</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#397BB5]"></span> Shelters</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#123B3A]"></span> Teams</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#24856A]"></span> Reunited</span>
              </div>

              {/* Bottom Right Menu Action Pill */}
              <div className="pointer-events-auto ml-auto flex items-center gap-2">
                <button
                  onClick={() => { setShowIncidentStream(true); setShowLayerPanel(true); }}
                  className="bg-[#155E63] text-white hover:bg-[#123B3A] px-3 py-1.5 rounded-xl shadow-teal-glow text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Map Menu Overview</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* List View fallback */
          <div className="p-5 h-full overflow-y-auto bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleCases.map(c => (
                <div
                  key={c.id}
                  onClick={() => openCaseDetails(c)}
                  className="bg-white border border-[#E1E9E7] hover:border-[#155E63] rounded-xl p-4 shadow-soft space-y-3 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#155E63]">{c.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.priority === 'URGENT' || c.priority === 'CRITICAL' ? 'bg-rose-100 text-[#C83D4D]' : 'bg-slate-100 text-[#687A7C]'
                    }`}>
                      {c.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {c.photo && (
                      <img src={c.photo} alt={c.fullName} className="w-12 h-12 rounded-xl object-cover border border-[#E1E9E7]" />
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-[#1D3033]">{c.fullName}</h4>
                      <span className="text-xs text-[#687A7C]">{c.classification || c.category}</span>
                    </div>
                  </div>

                  <div className="text-xs text-[#687A7C] bg-[#F4F7F6] p-2.5 rounded-lg border border-[#E1E9E7]">
                    📍 {c.lastSeenLocation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

