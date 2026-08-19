import React from 'react';
import { 
  Eye, 
  MapPin, 
  PlusCircle, 
  ListOrdered, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  User,
  Building2,
  Bell
} from 'lucide-react';
import { CivicStats } from '../types';
import { JanDrishtiLogo } from './JanDrishtiLogo';

interface NavbarProps {
  activeTab: 'landing' | 'report' | 'nearby' | 'my-complaints' | 'authority';
  setActiveTab: (tab: 'landing' | 'report' | 'nearby' | 'my-complaints' | 'authority') => void;
  userRole: 'citizen' | 'authority';
  setUserRole: (role: 'citizen' | 'authority') => void;
  stats: CivicStats;
  onResetDemo: () => void;
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  stats,
  onResetDemo,
  onOpenReportModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top Utility Bar */}
      <div className="bg-slate-950 px-4 py-1 text-xs text-slate-400 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-300">National Civic Accountability Grid (Prototype Demo)</span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400">100% Free Open-Source Civic Tech</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-slate-400">
            {stats.openIssues} Active Issues • {stats.verifiedCount} Verified Resolved
          </span>
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
            title="Reset to initial sample complaints"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <button 
            onClick={() => setActiveTab('landing')}
            className="flex items-center text-left group focus:outline-none"
          >
            <JanDrishtiLogo variant="compact" theme="dark" />
          </button>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'landing'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('nearby')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'nearby'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Civic Map</span>
            </button>
            <button
              onClick={() => setActiveTab('my-complaints')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'my-complaints'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>My Complaints</span>
              {stats.openIssues > 0 && (
                <span className="w-4 h-4 rounded-full bg-orange-600 text-[10px] flex items-center justify-center text-white font-bold">
                  {stats.openIssues}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setUserRole('authority');
                setActiveTab('authority');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'authority'
                  ? 'bg-indigo-500 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Authority Portal</span>
            </button>
          </nav>

          {/* Right Action & Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Primary Action Button */}
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-sm shadow-md shadow-orange-600/20 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Issue</span>
            </button>

            {/* Role Switcher Pill */}
            <div className="hidden sm:flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setUserRole('citizen')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                  userRole === 'citizen'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="View as Anonymous Citizen"
              >
                <User className="w-3.5 h-3.5" />
                <span>Citizen</span>
              </button>
              <button
                onClick={() => {
                  setUserRole('authority');
                  if (activeTab !== 'authority') setActiveTab('authority');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                  userRole === 'authority'
                    ? 'bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="View as Municipal Authority Officer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Officer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sub-nav */}
      <div className="md:hidden flex border-t border-slate-800 bg-slate-900/95 overflow-x-auto py-2 px-3 gap-2">
        <button
          onClick={() => setActiveTab('landing')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            activeTab === 'landing' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('nearby')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'nearby' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          <MapPin className="w-3 h-3" />
          Civic Map
        </button>
        <button
          onClick={() => setActiveTab('my-complaints')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'my-complaints' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          <ListOrdered className="w-3 h-3" />
          My Complaints ({stats.openIssues})
        </button>
        <button
          onClick={() => {
            setUserRole('authority');
            setActiveTab('authority');
          }}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'authority' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400'
          }`}
        >
          <Building2 className="w-3 h-3" />
          Authority
        </button>
      </div>
    </header>
  );
};
