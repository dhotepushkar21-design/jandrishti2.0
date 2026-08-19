import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Building2, 
  Users, 
  Clock, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Send, 
  FileText,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Complaint } from '../types';
import { JanDrishtiLogo } from './JanDrishtiLogo';

interface EscalationModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EscalationModal: React.FC<EscalationModalProps> = ({
  complaint,
  isOpen,
  onClose
}) => {
  const [escalationLevel, setEscalationLevel] = useState<'reminder' | 'commissioner' | 'dossier'>('dossier');
  const [sentAction, setSentAction] = useState<string | null>(null);

  if (!isOpen || !complaint) return null;

  const daysUnresolved = Math.max(
    1,
    Math.round((Date.now() - new Date(complaint.reportedAt).getTime()) / (1000 * 60 * 60 * 24))
  );

  const handleTriggerAction = (level: string) => {
    setSentAction(`Official ${level} dispatched through JanDrishti Civic Accountability Grid.`);
    setTimeout(() => {
      setSentAction(null);
    }, 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-rose-950 text-white px-6 py-4 flex items-center justify-between border-b border-rose-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Civic Grievance Escalation Engine</h3>
              <p className="text-xs text-rose-300">Public Interest & Accountability Dossier ({complaint.id})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-rose-900/80 hover:bg-rose-800 text-rose-200 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Escalation Tier Selector Tabs */}
        <div className="bg-slate-100 p-3 border-b border-slate-200 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setEscalationLevel('reminder')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              escalationLevel === 'reminder'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tier 1: Engineer Priority Reminder
          </button>
          <button
            onClick={() => setEscalationLevel('commissioner')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              escalationLevel === 'commissioner'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tier 2: Higher Authority Escalation
          </button>
          <button
            onClick={() => setEscalationLevel('dossier')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              escalationLevel === 'dossier'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tier 3: Public Interest Report
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {sentAction && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{sentAction}</span>
            </div>
          )}

          {/* Tier 1: Reminder */}
          {escalationLevel === 'reminder' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Direct Department Priority Reminder</h4>
                <p className="text-slate-600">
                  Sends an expedited priority SMS & official portal reminder to the assigned junior engineer and control room supervisor.
                </p>
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-slate-700 font-mono text-[11px]">
                  [URGENT REMINDER] Grievance {complaint.id} ({complaint.category}) at {complaint.location.address} has breached SLA timeline ({daysUnresolved} days unresolved, {complaint.communityConfirmations} citizen confirmations). Immediate ground deployment required.
                </div>
              </div>
              <button
                onClick={() => handleTriggerAction('Priority Reminder Notice')}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Transmit Formal Priority Notice to Engineer</span>
              </button>
            </div>
          )}

          {/* Tier 2: Higher Authority */}
          {escalationLevel === 'commissioner' && (
            <div className="space-y-4">
              <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 text-xs space-y-3">
                <h4 className="text-sm font-bold text-amber-950">Appellate Authority Intervention</h4>
                <p className="text-amber-800">
                  Escalates the unaddressed ticket to the Superintending Engineer / Municipal Commissioner / Regional Director.
                </p>
                <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Appellate Officer:</span>
                    <strong className="text-slate-900">{complaint.authority.escalationOfficer}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Jurisdiction:</span>
                    <span className="text-slate-900">{complaint.authority.jurisdiction}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Official Registry Email:</span>
                    <span className="text-indigo-600 font-mono">{complaint.authority.contactEmail}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleTriggerAction('Superintending Escalation File')}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Submit Appellate Non-Compliance Report</span>
              </button>
            </div>
          )}

          {/* Tier 3: Public Interest Dossier */}
          {escalationLevel === 'dossier' && (
            <div className="space-y-4">
              {/* Dossier Sheet */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-slate-900 shadow-md space-y-6 font-sans print:border-none print:shadow-none">
                {/* Dossier Header */}
                <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <JanDrishtiLogo variant="compact" theme="light" />
                    <span className="text-[11px] px-2.5 py-1 rounded bg-slate-900 text-white font-bold tracking-wider">
                      PUBLIC AUDIT DOSSIER
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-black text-rose-600 block">{complaint.id}</span>
                    <span className="text-[10px] text-slate-500">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Main Spec Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Reported Defect</span>
                      <p className="text-sm font-bold text-slate-900">{complaint.title}</p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Location & Jurisdiction</span>
                      <p className="text-xs font-medium text-slate-800">{complaint.location.address}, {complaint.location.city}</p>
                      <p className="text-[11px] text-slate-500">Jurisdiction: {complaint.location.roadType}</p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Responsible Civic Agency</span>
                      <p className="text-xs font-bold text-slate-900">{complaint.authority.name}</p>
                      <p className="text-[11px] text-slate-600">{complaint.authority.department}</p>
                    </div>
                  </div>

                  <div className="space-y-2 sm:border-l sm:border-slate-200 sm:pl-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Audit Metrics</span>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div className="bg-slate-100 p-2 rounded-lg text-center">
                          <span className="text-base font-black text-rose-600 block">{daysUnresolved} Days</span>
                          <span className="text-[9px] text-slate-500">Unresolved</span>
                        </div>
                        <div className="bg-slate-100 p-2 rounded-lg text-center">
                          <span className="text-base font-black text-slate-900 block">{complaint.communityConfirmations}</span>
                          <span className="text-[9px] text-slate-500">Confirmations</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Status</span>
                      <span className="inline-block px-2.5 py-1 rounded bg-rose-100 text-rose-800 font-bold text-xs mt-1">
                        {complaint.status} (SLA Expired)
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Officer</span>
                      <p className="text-xs text-slate-800">{complaint.assignedOfficer?.name || 'Unassigned / Delayed'}</p>
                    </div>
                  </div>
                </div>

                {/* Evidence Image */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Certified Photographic Ground Evidence
                  </span>
                  <div className="h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                    <img src={complaint.photoUrl} alt="Defect proof" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Legal / Civic Transparency Notice */}
                <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-500 leading-relaxed">
                  <strong>Civic Rights Statement:</strong> Under public infrastructure mandates, hazardous road depressions and public utility defects require rectification within stipulated SLA guidelines. This document aggregates citizen corroborations and time-stamped proof for public audits.
                </div>
              </div>

              {/* Dossier Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerAction('Public Interest Dossier Publication')}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/20 active:scale-95 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Publish Public Civic Audit File</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
