import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Filter, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Clock, 
  ChevronRight, 
  ShieldCheck,
  Building,
  Info,
  Maximize2
} from 'lucide-react';
import { Complaint, IssueCategory, IssueSeverity, ComplaintStatus } from '../types';

interface NearbyIssuesMapProps {
  complaints: Complaint[];
  onToggleConfirm: (id: string) => void;
  onSelectComplaint: (complaint: Complaint) => void;
  onOpenReportModal: () => void;
}

export const NearbyIssuesMap: React.FC<NearbyIssuesMapProps> = ({
  complaints,
  onToggleConfirm,
  onSelectComplaint,
  onOpenReportModal
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeComplaintId, setActiveComplaintId] = useState<string | null>(null);

  const categories: string[] = [
    'All',
    'Pothole',
    'Damaged Road',
    'Streetlight',
    'Traffic Signal/CCTV',
    'Garbage',
    'Water Leakage',
    'Footpath'
  ];

  const cities: string[] = ['All', 'Bengaluru', 'Delhi', 'Mumbai', 'Pune', 'Hyderabad'];

  const filteredComplaints = complaints.filter(c => {
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (selectedCity !== 'All' && !c.location.city.toLowerCase().includes(selectedCity.toLowerCase())) return false;
    if (selectedSeverity !== 'All' && c.aiAnalysis.severity !== selectedSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${c.id} ${c.title} ${c.description} ${c.location.address} ${c.authority.name}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [12.9716, 77.5946],
        zoom: 12,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Clean up map when unmounting
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers on filter/complaints change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m: L.Marker) => {
      if (m && typeof m.remove === 'function') {
        m.remove();
      }
    });
    markersRef.current = {};

    const bounds = L.latLngBounds([]);

    filteredComplaints.forEach(c => {
      const isCritical = c.aiAnalysis.severity === 'Critical';
      const isVerified = c.status === 'Verified';
      const isResolved = c.status === 'Resolved';

      const pinColor = isVerified ? '#059669' : isCritical ? '#DC2626' : isResolved ? '#2563EB' : '#D97706';

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="
            background-color: ${pinColor};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
            font-weight: bold;
          ">
            ${c.category === 'Pothole' ? '🕳️' : c.category === 'Streetlight' ? '💡' : c.category === 'Water Leakage' ? '💧' : c.category === 'Garbage' ? '🗑️' : '⚠️'}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([c.location.lat, c.location.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setActiveComplaintId(c.id);
      });

      markersRef.current[c.id] = marker;
      bounds.extend([c.location.lat, c.location.lng]);
    });

    if (filteredComplaints.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [filteredComplaints]);

  // Center map on active complaint if selected from list
  const handleSelectFromList = (c: Complaint) => {
    setActiveComplaintId(c.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([c.location.lat, c.location.lng], 15, { animate: true });
    }
  };

  const activeComplaint = complaints.find(c => c.id === activeComplaintId);

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <h2 className="text-xl font-bold text-slate-900">Civic Issues Public Map & Registry</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time open map of citizen-reported infrastructure hazards across municipalities.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, road, or authority..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Category:
        </span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}

        <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block"></div>

        {/* City Filter */}
        <span className="text-slate-400 font-semibold mr-1 hidden sm:inline">City:</span>
        <div className="flex gap-1 overflow-x-auto">
          {cities.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                selectedCity === city
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Split Map & List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive OpenStreetMap Container */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-3 border border-slate-200/80 shadow-sm flex flex-col h-[500px] lg:h-[600px] relative overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full rounded-2xl" />

          {/* Privacy Note Badge on Map */}
          <div className="absolute top-6 left-6 z-[400] bg-slate-950/80 backdrop-blur-xs text-slate-200 px-3 py-1 rounded-full text-[10px] font-medium border border-slate-800 shadow-md">
            🔒 Reporter Identity Protected • Anonymous Citizen
          </div>

          {/* Selected Pin Mini Popup Card */}
          {activeComplaint && (
            <div className="absolute bottom-6 inset-x-6 z-[400] bg-white rounded-2xl p-4 shadow-xl border border-slate-200 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={activeComplaint.photoUrl}
                  alt={activeComplaint.category}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {activeComplaint.id}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${
                      activeComplaint.aiAnalysis.severity === 'Critical' ? 'bg-red-600' : 'bg-amber-600'
                    }`}>
                      {activeComplaint.aiAnalysis.severity}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                    {activeComplaint.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">{activeComplaint.location.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onToggleConfirm(activeComplaint.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    activeComplaint.confirmedByUser
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                  }`}
                  title="Confirm that this issue exists on ground"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{activeComplaint.confirmedByUser ? 'Confirmed' : '+1 Confirm'}</span>
                </button>
                <button
                  onClick={() => onSelectComplaint(activeComplaint)}
                  className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                  title="View Full Case Details"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Complaints Feed Column */}
        <div className="lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>Showing {filteredComplaints.length} public records</span>
            <span className="text-[11px]">Click to inspect or confirm</span>
          </div>

          {filteredComplaints.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
              <p className="text-sm">No civic issues match your current filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedCity('All');
                  setSearchQuery('');
                }}
                className="mt-2 text-xs font-bold text-amber-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredComplaints.map(c => {
              const isSelected = c.id === activeComplaintId;
              return (
                <div
                  key={c.id}
                  onClick={() => handleSelectFromList(c)}
                  className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={c.photoUrl}
                      alt={c.category}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-slate-500 font-mono">{c.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                          c.status === 'Resolved' ? 'bg-blue-100 text-blue-800' :
                          c.status === 'Work Started' ? 'bg-amber-100 text-amber-800' :
                          c.status === 'Reopened' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {c.status}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">
                        {c.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {c.location.address}, {c.location.city}
                      </p>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 truncate max-w-[150px]">
                          🏛️ {c.authority.name.split('-')[0]}
                        </span>

                        {/* Community Confirm Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleConfirm(c.id);
                          }}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                            c.confirmedByUser
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          <Users className="w-3 h-3" />
                          <span>{c.communityConfirmations} {c.confirmedByUser ? 'Confirmed' : 'Confirm'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
