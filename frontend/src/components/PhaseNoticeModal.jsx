import React from 'react';
import { Sparkles, X, ShieldAlert, ArrowRight, Layers } from 'lucide-react';

export default function PhaseNoticeModal({ isOpen, onClose, title = "Feature Coming Soon", targetPhase = "Phase 3" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
              Phase 1 Preview Mode
            </span>
          </div>

          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-sm text-blue-100 mt-1">
            SmartFind Lost & Found Platform Roadmap Notice
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-start space-x-3 p-3.5 bg-blue-50/80 rounded-xl border border-blue-100 text-slate-700">
            <Layers className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-blue-950">Planned for {targetPhase}</p>
              <p className="text-slate-600 mt-0.5">
                Full interactive item submission, smart automated matching, and verification workflows are scheduled for future development phases.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <p className="font-medium text-slate-800">What you can test in Phase 1 right now:</p>
            <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600">
              <li>Browse filterable Lost & Found item galleries</li>
              <li>Filter items by Category, Location, and Date</li>
              <li>View detailed item preview pages</li>
              <li>Inspect Express API health check connection</li>
            </ul>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <span>Got it, continue exploring</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
