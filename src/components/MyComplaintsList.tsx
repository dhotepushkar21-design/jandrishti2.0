import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Building2, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  ChevronRight, 
  FileText, 
  Sparkles, 
  RotateCcw, 
  ArrowUpRight,
  CheckCheck,
  XCircle,
  Users
} from 'lucide-react';
import { Complaint, ComplaintStatus } from '../types';

interface MyComplaintsListProps {
  complaints: Complaint[];
  selectedComplaintId: string | null;
  onSelectComplaint: (complaint: Complaint) => void;
  onSubmitVerification: (id: string, isFixed: boolean, remarks: string) => void;
  onOpenEscalation: (complaint: Complaint) => void;
  onOpenReportModal: () => void;
}

const LIFECYCLE_STEPS: { key: ComplaintStatus; label: string; desc: string }[] = [
  { key: 'Reported', label: 'Reported', desc: 'Captured & Ingested' },
  { key: 'Routed', label: 'Routed', desc: 'Jurisdiction Assigned' },
  { key: 'Acknowledged', label: 'Acknowledged', desc: 'Officer Assigned' },
  { key: 'Work Started', label: 'Work Started', desc: 'Crews on Site' },
  { key: 'Resolved', label: 'Resolved', desc: 'Repair Evidence Uploaded' },
  { key: 'Verified', label: 'Verified', desc: 'Citizen Closed-Loop Sign-off' }
];

export const MyComplaintsList: React.FC<MyComplaintsListProps> = ({
  complaints,
  selectedComplaintId,
  onSelectComplaint,
  onSubmitVerification,
  onOpenEscalation,
  onOpenReportModal
}) => {
  const [remarks, setRemarks] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const selected = complaints.find(c => c.id === selectedComplaintId) || complaints[0];

  const getStepIndex = (status: ComplaintStatus) => {
    switch (status) {
      case 'Reported': return 0;
      case 'Routed': return 1;
      case 'Acknowledged': return 2;
      case 'Work Started': return 3;
      case 'Resolved': return 4;
      case 'Verified': return 5;
      case 'Reopened': return 3; // Loop back to work in progress
      default: return 0;
    }
  };

  const currentStepIdx = selected ? getStepIndex(selected.status) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <h2 className="text-xl font-bold text-slate-900">Citizen Complaints & Resolution Tracker</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track real-time government repair progress, review officer notes, and verify completed works.
          </p>
        </div>
        <button
          onClick={onOpenReportModal}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <span>+ File New Grievance</span>
        </button>
      </div>

      {complaints.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Complaints Lodged Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Take a photo of a road crater, broken light, or civic hazard to start live tracking.
          </p>
          <button
            onClick={onOpenReportModal}
            className="mt-4 px-5 py-2.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600"
          >
            Report an Issue Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Complaints List */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              Active Grievance Tickets ({complaints.length})
            </span>

            {complaints.map(c => {
              const isSelected = selected && selected.id === c.id;
              const isPendingVerification = c.status === 'Resolved';

              return (
                <div
                  key={c.id}
                  onClick={() => onSelectComplaint(c)}
                  className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md relative ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  {isPendingVerification && (
                    <span className="absolute -top-2 right-4 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold shadow-sm animate-pulse">
                      Action Required: Verify Fix
                    </span>
                  )}

                  <div className="flex items-start gap-3">
                    <img
                      src={c.photoUrl}
                      alt={c.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold font-mono text-slate-500">{c.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                          c.status === 'Resolved' ? 'bg-blue-100 text-blue-800' :
                          c.status === 'Work Started' ? 'bg-amber-100 text-amber-800' :
                          c.status === 'Reopened' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {c.status}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">{c.title}</h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{c.location.address}</p>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{new Date(c.reportedAt).toLocaleDateString()}</span>
                        <span className="text-slate-600 font-medium truncate max-w-[140px]">
                          {c.authority.name.split('-')[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Deep-Dive Card */}
          {selected && (
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              {/* Card Header & Title */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white font-mono text-xs font-bold">
                      {selected.id}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                      {selected.category}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                      selected.aiAnalysis.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                      selected.aiAnalysis.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {selected.aiAnalysis.severity} Hazard
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">{selected.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{selected.location.address}, {selected.location.city} ({selected.location.roadType})</span>
                  </p>
                </div>

                {/* Overdue / Escalation Trigger */}
                {selected.isOverdue && selected.status !== 'Verified' && (
                  <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl text-right shrink-0">
                    <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider block">
                      SLA Overdue
                    </span>
                    <button
                      onClick={() => onOpenEscalation(selected)}
                      className="mt-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <span>Escalate Issue</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* 6-Stage Lifecycle Stepper */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                  Resolution Lifecycle Progress
                </span>

                <div className="grid grid-cols-6 gap-1 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                  {LIFECYCLE_STEPS.map((s, idx) => {
                    const isPassed = currentStepIdx >= idx;
                    const isCurrent = currentStepIdx === idx;
                    const isReopenedState = selected.status === 'Reopened' && idx === 3;

                    return (
                      <div key={s.key} className="text-center">
                        <div className="flex items-center justify-center mb-1.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCurrent && isReopenedState ? 'bg-rose-600 text-white animate-bounce' :
                            isCurrent ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20' :
                            isPassed ? 'bg-emerald-600 text-white' :
                            'bg-slate-200 text-slate-400'
                          }`}>
                            {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold block truncate ${
                          isCurrent ? 'text-slate-900' : isPassed ? 'text-emerald-700' : 'text-slate-400'
                        }`}>
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {selected.status === 'Reopened' && (
                  <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-rose-600 shrink-0" />
                    <span><strong>Reopened:</strong> Citizen audited physical site and reported that the repair was inadequate. Case escalated back to engineering supervisor.</span>
                  </div>
                )}
              </div>

              {/* Citizen Verification Interactive Action Box */}
              {selected.status === 'Resolved' && (
                <div className="bg-amber-50 border-2 border-amber-400 p-5 rounded-3xl shadow-sm space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                      <CheckCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-950">Citizen Physical Audit Required</h4>
                      <p className="text-xs text-amber-800">
                        The authority marked this grievance resolved. Has the issue actually been fixed on ground?
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1">
                      Citizen Verification Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="e.g. Visited site today, pothole asphalted completely / still open gap"
                      className="w-full p-2.5 text-xs rounded-xl border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={() => {
                        onSubmitVerification(selected.id, true, remarks || 'Physical site inspected: Defect fixed satisfactorily.');
                        setRemarks('');
                      }}
                      className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>YES — Issue Fixed (Close Grievance)</span>
                    </button>

                    <button
                      onClick={() => {
                        onSubmitVerification(selected.id, false, remarks || 'Physical inspection failed: Issue still exists on road.');
                        setRemarks('');
                      }}
                      className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20 active:scale-95 transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>NO — Still Exists (Reopen Case)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Before & After Photo Evidence Comparison */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Photo Evidence & Resolution Comparison
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Before */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">Initial Citizen Evidence</span>
                      <span>{new Date(selected.reportedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 relative">
                      <img 
                        src={selected.photoUrl} 
                        alt="Initial Defect" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-bold text-white">
                        Initial Condition
                      </span>
                    </div>
                  </div>

                  {/* After */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">Authority Repair Evidence</span>
                      <span>{selected.repairPhotoUrl ? 'Uploaded by Engineer' : 'Pending Upload'}</span>
                    </div>
                    <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative flex items-center justify-center text-center p-4">
                      {selected.repairPhotoUrl ? (
                        <>
                          <img 
                            src={selected.repairPhotoUrl} 
                            alt="Repaired Condition" 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80';
                            }}
                            className="w-full h-full object-cover" 
                          />
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-emerald-950/80 text-[10px] font-bold text-emerald-300">
                            Completed Works
                          </span>
                        </>
                      ) : (
                        <div className="text-slate-400 text-xs">
                          <Clock className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                          <span>Official repair evidence will appear here upon completion.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsible Authority & Officer Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Assigned Civic Authority
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">{selected.authority.code}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selected.authority.name}</h4>
                  <p className="text-xs text-slate-600">{selected.authority.department} • {selected.authority.jurisdiction}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span>Assigned Field Officer: <strong>{selected.assignedOfficer?.name || 'Zonal Response Squad'}</strong></span>
                  <span>Escalation: <strong>{selected.authority.escalationOfficer}</strong></span>
                </div>
              </div>

              {/* Officer Audit Notes */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Official Activity & Audit Trail
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selected.officerNotes.map(note => (
                    <div key={note.id} className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
                      <div className="flex items-center justify-between text-slate-500 mb-1">
                        <span className="font-bold text-slate-800">{note.officerName} ({note.designation})</span>
                        <span className="text-[10px]">{new Date(note.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-700">{note.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
