import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { NearbyIssuesMap } from './components/NearbyIssuesMap';
import { MyComplaintsList } from './components/MyComplaintsList';
import { AuthorityDashboard } from './components/AuthorityDashboard';
import { ReportIssueModal } from './components/ReportIssueModal';
import { EscalationModal } from './components/EscalationModal';
import { 
  getStoredComplaints, 
  saveComplaints, 
  resetDemoData, 
  calculateCivicStats, 
  addComplaint, 
  updateComplaintStatus, 
  assignOfficerToComplaint, 
  toggleCommunityConfirmation, 
  submitCitizenVerification 
} from './services/storage';
import { Complaint, ComplaintStatus, CivicStats } from './types';
import { JanDrishtiLogo } from './components/JanDrishtiLogo';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  RotateCcw, 
  Play, 
  ShieldCheck, 
  X,
  Heart
} from 'lucide-react';

export default function App() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<CivicStats>({
    totalReported: 0,
    openIssues: 0,
    criticalIssues: 0,
    overdueIssues: 0,
    resolvedIssues: 0,
    verifiedCount: 0,
    communityConfirmations: 0
  });

  const [activeTab, setActiveTab] = useState<'landing' | 'report' | 'nearby' | 'my-complaints' | 'authority'>('landing');
  const [userRole, setUserRole] = useState<'citizen' | 'authority'>('citizen');
  
  // Modals & Selection State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [escalationComplaint, setEscalationComplaint] = useState<Complaint | null>(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Guided Walkthrough Step (0 = hidden, 1 to 5 = active walkthrough)
  const [walkthroughStep, setWalkthroughStep] = useState<number>(0);

  // Load complaints from storage on mount
  useEffect(() => {
    const loaded = getStoredComplaints();
    setComplaints(loaded);
    setStats(calculateCivicStats(loaded));
    if (loaded.length > 0) {
      setSelectedComplaintId(loaded[0].id);
    }
  }, []);

  // Sync stats when complaints change
  const handleUpdateComplaintsState = (updated: Complaint[]) => {
    setComplaints(updated);
    setStats(calculateCivicStats(updated));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Actions
  const handleResetData = () => {
    const fresh = resetDemoData();
    handleUpdateComplaintsState(fresh);
    if (fresh.length > 0) setSelectedComplaintId(fresh[0].id);
    showToast('Demo data reset to original sample complaints.');
  };

  const handleComplaintCreated = (newComplaint: Complaint) => {
    const updated = addComplaint(newComplaint);
    handleUpdateComplaintsState(updated);
    setSelectedComplaintId(newComplaint.id);
    setActiveTab('my-complaints');
    showToast(`Complaint ${newComplaint.id} generated & dispatched to ${newComplaint.authority.code}!`);
  };

  const handleToggleConfirm = (id: string) => {
    const { complaints: updated, confirmed } = toggleCommunityConfirmation(id);
    handleUpdateComplaintsState(updated);
    showToast(confirmed ? 'Community confirmation (+1) recorded!' : 'Confirmation removed.');
  };

  const handleUpdateStatus = (id: string, newStatus: ComplaintStatus, comment?: string, repairPhoto?: string) => {
    const updated = updateComplaintStatus(id, newStatus, comment, repairPhoto);
    handleUpdateComplaintsState(updated);
    showToast(`Complaint ${id} status updated to "${newStatus}"!`);
  };

  const handleAssignOfficer = (id: string, officer: { name: string; designation: string; contact: string }) => {
    const updated = assignOfficerToComplaint(id, officer);
    handleUpdateComplaintsState(updated);
    showToast(`Assigned ${officer.name} to ${id}.`);
  };

  const handleSubmitVerification = (id: string, isFixed: boolean, remarks: string) => {
    const updated = submitCitizenVerification(id, isFixed, remarks);
    handleUpdateComplaintsState(updated);
    showToast(isFixed ? `Complaint ${id} closed & verified by citizen!` : `Complaint ${id} reopened for remediation!`);
  };

  const handleSelectComplaintFromAnywhere = (c: Complaint) => {
    setSelectedComplaintId(c.id);
    setActiveTab('my-complaints');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Interactive Guided Demo Helper Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-2 text-xs border-b border-indigo-900/60 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-amber-500 text-slate-950 font-bold">
            <Sparkles className="w-3 h-3" />
          </span>
          <span className="font-semibold text-slate-200">Interactive End-to-End Prototype Demo:</span>
          <span className="text-slate-400 hidden sm:inline">
            1. Report Issue ➔ 2. AI Scan ➔ 3. Auto-Route ➔ 4. Officer Fixes ➔ 5. Citizen Audits & Closes
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition-colors"
          >
            + Test Live Report
          </button>
          <button
            onClick={() => {
              setUserRole('authority');
              setActiveTab('authority');
            }}
            className="px-2.5 py-1 rounded-md bg-indigo-700 hover:bg-indigo-600 text-white font-medium text-[11px] transition-colors"
          >
            Officer Portal
          </button>
        </div>
      </div>

      {/* Primary Sticky Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        stats={stats}
        onResetDemo={handleResetData}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'landing' && (
          <LandingPage
            stats={stats}
            complaints={complaints}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onNavigate={(tab) => {
              if (tab === 'authority') setUserRole('authority');
              setActiveTab(tab);
            }}
            onOpenEscalation={(c) => setEscalationComplaint(c)}
            onSelectComplaint={handleSelectComplaintFromAnywhere}
          />
        )}

        {activeTab === 'nearby' && (
          <NearbyIssuesMap
            complaints={complaints}
            onToggleConfirm={handleToggleConfirm}
            onSelectComplaint={handleSelectComplaintFromAnywhere}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}

        {activeTab === 'my-complaints' && (
          <MyComplaintsList
            complaints={complaints}
            selectedComplaintId={selectedComplaintId}
            onSelectComplaint={(c) => setSelectedComplaintId(c.id)}
            onSubmitVerification={handleSubmitVerification}
            onOpenEscalation={(c) => setEscalationComplaint(c)}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}

        {activeTab === 'authority' && (
          <AuthorityDashboard
            complaints={complaints}
            stats={stats}
            onUpdateStatus={handleUpdateStatus}
            onAssignOfficer={handleAssignOfficer}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <JanDrishtiLogo variant="compact" theme="dark" />
          </div>
          <div className="text-center md:text-right space-y-1">
            <p className="text-slate-300 font-bold text-xs uppercase tracking-wider">
              Making Bharat Better • One Step Towards Revolution
            </p>
            <p className="text-slate-500 text-[11px]">
              Civic Accountability Prototype • 100% Free Open-Source Architecture
            </p>
          </div>
        </div>
      </footer>

      {/* Report Issue Modal */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        existingComplaints={complaints}
        onComplaintCreated={handleComplaintCreated}
      />

      {/* Escalation Dossier Modal */}
      <EscalationModal
        complaint={escalationComplaint}
        isOpen={!!escalationComplaint}
        onClose={() => setEscalationComplaint(null)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
