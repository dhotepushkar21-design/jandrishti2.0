import React, { useState } from 'react';
import { 
  Building2, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  UserCheck, 
  Upload, 
  Plus, 
  Send, 
  Camera, 
  ShieldAlert, 
  Layers,
  FileCheck,
  CheckCheck,
  Users,
  MapPin,
  Flame
} from 'lucide-react';
import { Complaint, ComplaintStatus, CivicStats } from '../types';
import { updateComplaintStatus, assignOfficerToComplaint } from '../services/storage';

interface AuthorityDashboardProps {
  complaints: Complaint[];
  stats: CivicStats;
  onUpdateStatus: (id: string, newStatus: ComplaintStatus, comment?: string, repairPhoto?: string) => void;
  onAssignOfficer: (id: string, officer: { name: string; designation: string; contact: string }) => void;
}

const SAMPLE_REPAIR_PHOTOS = [
  {
    name: 'Asphalt Patch Repaved',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Streetlight Cable Replaced',
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Pipeline Trench Restored',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Footpath Slab Realigned',
    url: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=800&q=80'
  }
];

const PRESET_ENGINEERS = [
  { name: 'Er. Rajesh Kulkarni', designation: 'Assistant Executive Engineer (Roads)', contact: '+91 98450 12345' },
  { name: 'Venkatesh Murthy', designation: 'Junior Electrical Engineer (O&M)', contact: '+91 94480 88990' },
  { name: 'Sunil Patil', designation: 'Ward Hydraulic Supervisor', contact: '+91 98200 44556' },
  { name: 'Er. Anand Shinde', designation: 'Ward Junior Infrastructure Engineer', contact: '+91 97650 33221' },
  { name: 'Er. S. P. Verma', designation: 'NHAI Highway Resident Engineer', contact: '+91 99100 77889' }
];

export const AuthorityDashboard: React.FC<AuthorityDashboardProps> = ({
  complaints,
  stats,
  onUpdateStatus,
  onAssignOfficer
}) => {
  const [selectedId, setSelectedId] = useState<string>(complaints[0]?.id || '');
  const [filterTab, setFilterTab] = useState<'All' | 'Critical' | 'Overdue' | 'Open' | 'Resolved'>('All');
  
  // Action form state
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('Work Started');
  const [officerComment, setOfficerComment] = useState('');
  const [repairPhoto, setRepairPhoto] = useState('');
  const [selectedEngineerIdx, setSelectedEngineerIdx] = useState(0);

  const selectedComplaint = complaints.find(c => c.id === selectedId) || complaints[0];

  const filteredComplaints = complaints.filter(c => {
    if (filterTab === 'Critical') return c.aiAnalysis.severity === 'Critical' || c.aiAnalysis.severity === 'High';
    if (filterTab === 'Overdue') return c.isOverdue && c.status !== 'Verified';
    if (filterTab === 'Open') return c.status !== 'Resolved' && c.status !== 'Verified';
    if (filterTab === 'Resolved') return c.status === 'Resolved' || c.status === 'Verified';
    return true;
  });

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    onUpdateStatus(
      selectedComplaint.id,
      newStatus,
      officerComment || `Status updated to ${newStatus} by Zonal Officer.`,
      repairPhoto || undefined
    );

    setOfficerComment('');
    setRepairPhoto('');
  };

  const handleQuickAssign = () => {
    if (!selectedComplaint) return;
    const eng = PRESET_ENGINEERS[selectedEngineerIdx];
    onAssignOfficer(selectedComplaint.id, eng);
  };

  const handleRepairFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setRepairPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Authority Portal Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold font-mono">
              OFFICIAL GOV PORTAL
            </span>
            <span className="text-xs text-slate-400">Integrated Civic Operations Center</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
            Municipal & Highway Authority Dashboard
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Auto-dispatched civic complaints routed directly by JanDrishti AI. Review ground reports, assign engineers, log progress, and upload repair evidence for citizen audit.
          </p>
        </div>

        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Jurisdiction</span>
          <span className="text-xs font-bold text-amber-400">Metropolitan Regional Divisions</span>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Open Cases</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{stats.openIssues}</span>
            <span className="text-xs text-slate-500">tickets</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            Critical Emergencies
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-red-600">{stats.criticalIssues}</span>
            <span className="text-xs text-red-600">high risk</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            SLA Overdue
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-rose-600">{stats.overdueIssues}</span>
            <span className="text-xs text-rose-600">escalated</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">Resolved (Audit Pending)</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-blue-600">{stats.resolvedIssues}</span>
            <span className="text-xs text-blue-600">with proof</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block flex items-center gap-1">
            <CheckCheck className="w-3.5 h-3.5" />
            Citizen Verified
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600">{stats.verifiedCount}</span>
            <span className="text-xs text-emerald-600">closed</span>
          </div>
        </div>
      </div>

      {/* Main Filter & Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Complaint Inbox Table */}
        <div className="lg:col-span-5 space-y-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(['All', 'Critical', 'Overdue', 'Open', 'Resolved'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  filterTab === tab
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {filteredComplaints.map(c => {
              const isSelected = selectedComplaint && selectedComplaint.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`bg-white p-3.5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-sm'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {c.id}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">{c.category}</span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                      c.status === 'Resolved' ? 'bg-blue-100 text-blue-800' :
                      c.status === 'Work Started' ? 'bg-amber-100 text-amber-800' :
                      c.status === 'Reopened' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mt-1.5 line-clamp-1">{c.title}</h4>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{c.location.address}</p>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Users className="w-3 h-3 text-amber-500" />
                      {c.communityConfirmations} citizens confirmed
                    </span>
                    <span>
                      Engineer: <strong>{c.assignedOfficer?.name || 'Unassigned'}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Officer Action & Resolution Workspace */}
        {selectedComplaint && (
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            {/* Header with Case Specs */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                    {selectedComplaint.id}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {selectedComplaint.category}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    selectedComplaint.aiAnalysis.severity === 'Critical' ? 'bg-red-600 text-white' :
                    selectedComplaint.aiAnalysis.severity === 'High' ? 'bg-orange-600 text-white' :
                    'bg-slate-700 text-white'
                  }`}>
                    {selectedComplaint.aiAnalysis.severity} Severity
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedComplaint.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{selectedComplaint.location.address} • {selectedComplaint.location.roadType}</span>
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">SLA Target</span>
                <span className={`text-xs font-bold ${selectedComplaint.isOverdue ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {selectedComplaint.isOverdue ? 'Overdue - Escalated' : 'Within Target Window'}
                </span>
              </div>
            </div>

            {/* AI Technical Recommendation Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                🤖 AI Ground Hazard & Repair Specs
              </span>
              <p className="text-slate-700 leading-relaxed">{selectedComplaint.aiAnalysis.hazardAssessment}</p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-600">
                <span>Method: <strong>{selectedComplaint.aiAnalysis.recommendedAction}</strong></span>
                <span className="text-emerald-700 font-semibold">{(selectedComplaint.aiAnalysis.confidence * 100).toFixed(1)}% AI Match</span>
              </div>
            </div>

            {/* Assignment Section */}
            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  Field Engineering Crew Assignment
                </span>
                <span className="text-xs text-indigo-700 font-medium">
                  {selectedComplaint.assignedOfficer ? 'Assigned' : 'Unassigned'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={selectedEngineerIdx}
                  onChange={(e) => setSelectedEngineerIdx(parseInt(e.target.value, 10))}
                  className="flex-1 p-2 text-xs rounded-xl border border-indigo-200 bg-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {PRESET_ENGINEERS.map((eng, idx) => (
                    <option key={eng.name} value={idx}>
                      {eng.name} — {eng.designation}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleQuickAssign}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
                >
                  Dispatch Officer
                </button>
              </div>

              {selectedComplaint.assignedOfficer && (
                <p className="text-[11px] text-indigo-900">
                  Currently dispatched: <strong>{selectedComplaint.assignedOfficer.name}</strong> ({selectedComplaint.assignedOfficer.designation}, {selectedComplaint.assignedOfficer.contact})
                </p>
              )}
            </div>

            {/* Status Update & Repair Proof Form */}
            <form onSubmit={handleStatusSubmit} className="space-y-4 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Update Case Status & Official Department Log
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">New Lifecycle Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Acknowledged">Acknowledged (Crew Notified)</option>
                    <option value="Work Started">Work Started (Men & Machinery on Site)</option>
                    <option value="Resolved">Resolved (Repair Completed - Request Citizen Audit)</option>
                    <option value="Verified">Verified / Closed (Final)</option>
                    <option value="Reopened">Reopened (Remedial Action)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Officer Note</label>
                  <input
                    type="text"
                    value={officerComment}
                    onChange={(e) => setOfficerComment(e.target.value)}
                    placeholder="e.g. 50mm cold mix asphalt compacted and rolled..."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Repair Photo Upload Section */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Upload Repair Proof / Completion Evidence Photo
                </label>

                {repairPhoto ? (
                  <div className="relative rounded-2xl overflow-hidden h-36 border border-slate-200 bg-slate-900">
                    <img src={repairPhoto} alt="Repair proof" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setRepairPhoto('')}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded bg-slate-900/80 text-xs text-white"
                    >
                      Remove
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                      Proof Attached
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 cursor-pointer transition-colors">
                      <input type="file" accept="image/*" onChange={handleRepairFileUpload} className="hidden" />
                      <Upload className="w-4 h-4 text-indigo-600" />
                      <span>Upload Repair Photo File</span>
                    </label>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                      <span className="text-slate-400 text-[10px] shrink-0">Sample repairs:</span>
                      {SAMPLE_REPAIR_PHOTOS.map(s => (
                        <button
                          key={s.name}
                          type="button"
                          onClick={() => setRepairPhoto(s.url)}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] whitespace-nowrap"
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Update Status & Notify Citizens</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
