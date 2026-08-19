import React from 'react';
import { 
  Camera, 
  Cpu, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  ShieldAlert, 
  Building2, 
  Sparkles, 
  Eye, 
  CheckCheck,
  AlertTriangle,
  FileText,
  Flag,
  Flame
} from 'lucide-react';
import { CivicStats, Complaint } from '../types';
import { JanDrishtiLogo } from './JanDrishtiLogo';

interface LandingPageProps {
  stats: CivicStats;
  complaints: Complaint[];
  onOpenReportModal: () => void;
  onNavigate: (tab: 'nearby' | 'my-complaints' | 'authority') => void;
  onOpenEscalation: (complaint: Complaint) => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  stats,
  complaints,
  onOpenReportModal,
  onNavigate,
  onOpenEscalation,
  onSelectComplaint
}) => {
  const steps = [
    {
      step: '01',
      title: 'Capture',
      desc: 'Snap a live photo or upload evidence. Automatic GPS pinpointing captures exact coordinates without manual hassle.',
      icon: Camera,
      badge: 'Camera + Geolocation'
    },
    {
      step: '02',
      title: 'Analyze',
      desc: 'Simulated AI Vision classifies the road/civic defect, calculates surface hazard severity, and crafts a technical report.',
      icon: Cpu,
      badge: 'Simulated AI Vision'
    },
    {
      step: '03',
      title: 'Route',
      desc: 'Auto-detects jurisdiction (NHAI, State PWD, Municipal Corp, Discom, Jal Board) and dispatches directly to the zonal officer.',
      icon: Navigation,
      badge: 'Auto Authority Dispatch'
    },
    {
      step: '04',
      title: 'Track & Confirm',
      desc: 'Nearby citizens confirm (+1) instead of filing duplicate complaints. Dynamic SLA countdown prevents bureaucratic stalling.',
      icon: Users,
      badge: 'Community + SLA Timers'
    },
    {
      step: '05',
      title: 'Verify',
      desc: 'Authorities cannot self-certify closure. Complaints only close when citizens independently verify the physical repair.',
      icon: CheckCheck,
      badge: 'Citizen-Powered Sign-off'
    }
  ];

  const recentComplaints = complaints.slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-14 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-gradient-to-br from-amber-500/20 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-blue-600/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 max-w-2xl">
            {/* Top Slogan Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-extrabold uppercase tracking-widest mb-5 shadow-xs">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>ONE STEP TOWARDS REVOLUTION</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight font-sans">
              Making Bharat Better. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
                One Civic Issue at a Time.
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              <strong>Your View. Your Voice. Better Governance.</strong> Report potholes, damaged roads, faulty streetlights, and sanitation hazards directly to responsible authorities with AI verification.
            </p>

            {/* Quick Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenReportModal}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-base shadow-lg shadow-orange-600/25 flex items-center gap-2.5 active:scale-95 transition-all"
              >
                <Camera className="w-5 h-5" />
                <span>Report an Issue Now</span>
              </button>

              <button
                onClick={() => onNavigate('nearby')}
                className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-colors"
              >
                <span>Explore Public Map</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('authority')}
                className="px-5 py-3.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-200 font-semibold text-sm border border-indigo-700/60 flex items-center gap-2 transition-colors"
              >
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>Authority Portal</span>
              </button>
            </div>

            {/* Privacy & Free Guarantee */}
            <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>100% Free prototype • Citizen anonymity preserved • Real OpenStreetMap tiles</span>
            </div>
          </div>

          {/* Right Column: Official Logo Card Emblem */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-amber-500/30 flex flex-col items-center text-center max-w-xs w-full group hover:scale-[1.02] transition-all">
              <JanDrishtiLogo variant="icon-only" size="lg" />
              
              <div className="mt-3">
                <span className="text-2xl font-black text-[#0F1E36] tracking-tight">
                  Jan<span className="text-[#F35B16]">Drishti</span>
                </span>
                <div className="mt-1">
                  <span className="text-[11px] font-black text-[#0F1E36] uppercase tracking-wider block">
                    MAKING BHARAT BETTER.
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
                    One Civic Issue at a Time.
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 w-full">
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 inline-block">
                  🇮🇳 Citizen Civic Revolution
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Civic Pulse Statistics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reported</span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.totalReported}</span>
            <span className="text-xs font-medium text-blue-600">Civic Cases</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Documented in public registry</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active In-Progress</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">{stats.openIssues}</span>
            <span className="text-xs font-medium text-amber-600">{stats.overdueIssues} SLA Overdue</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Under authority intervention</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Community Endorsements</span>
            <span className="p-2 rounded-lg bg-orange-50 text-orange-600">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-orange-600">{stats.communityConfirmations}</span>
            <span className="text-xs font-medium text-orange-600">+1 Votes</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Duplicate prevention active</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Fixed</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{stats.verifiedCount}</span>
            <span className="text-xs font-medium text-emerald-600">Citizen Audited</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Closed-loop verified by public</p>
        </div>
      </section>

      {/* 5-Step Process Explainer */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-bold text-amber-600 uppercase tracking-widest">How JanDrishti Works</h2>
          <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            End-to-End Accountability Architecture
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            From the initial photo capture to the final citizen verification sign-off, every step is transparent and auditable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-slate-50 rounded-2xl p-5 border border-slate-200/60 flex flex-col justify-between hover:border-amber-400/80 transition-all hover:shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold text-slate-400 group-hover:text-amber-600 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-800 group-hover:bg-amber-500 group-hover:text-white transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.desc}</p>
                </div>
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full inline-block">
                    {item.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Civic Issues Preview */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Live Public Feed</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">Recent Civic Grievances</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('nearby')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>View All on Civic Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentComplaints.map(c => {
            return (
              <div
                key={c.id}
                onClick={() => {
                  onSelectComplaint(c);
                  onNavigate('my-complaints');
                }}
                className="bg-slate-800/90 rounded-2xl overflow-hidden border border-slate-700/80 hover:border-amber-500/60 transition-all cursor-pointer group flex flex-col"
              >
                <div className="relative h-36 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={c.photoUrl}
                    alt={c.category}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback to dependable pothole / road hazard image
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-200 text-[10px] font-bold backdrop-blur-xs border border-slate-700">
                      {c.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold text-white backdrop-blur-xs ${
                      c.aiAnalysis.severity === 'Critical' ? 'bg-red-600' :
                      c.aiAnalysis.severity === 'High' ? 'bg-orange-600' :
                      c.aiAnalysis.severity === 'Medium' ? 'bg-amber-600' : 'bg-slate-600'
                    }`}>
                      {c.aiAnalysis.severity}
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2 z-10">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs ${
                      c.status === 'Verified' ? 'bg-emerald-600' :
                      c.status === 'Resolved' ? 'bg-blue-600' :
                      c.status === 'Work Started' ? 'bg-amber-600' :
                      c.status === 'Reopened' ? 'bg-rose-600' : 'bg-slate-700'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-amber-400">{c.category}</span>
                    <h4 className="text-sm font-bold text-white line-clamp-2 mt-0.5 group-hover:text-amber-300 transition-colors">
                      {c.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-1">{c.location.address}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>{c.communityConfirmations} confirms</span>
                    </span>
                    <span className="text-slate-400">{c.authority.code}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 rounded-3xl p-8 sm:p-12 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            See a pothole or civic hazard on your street?
          </h3>
          <p className="mt-2 text-amber-100 text-sm sm:text-base leading-relaxed">
            Report it instantly. Your submission is tagged with GPS coordinates, analyzed for safety risks, and forwarded to the exact engineering division.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            onClick={onOpenReportModal}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-bold text-sm shadow-md transition-all active:scale-95 text-center"
          >
            Report Issue (30 Seconds)
          </button>
        </div>
      </section>
    </div>
  );
};
