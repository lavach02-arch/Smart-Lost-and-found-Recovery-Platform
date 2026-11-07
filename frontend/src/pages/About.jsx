import React from 'react';
import { Compass, ShieldCheck, Cpu, Zap, CheckCircle2, Layers, ArrowRight } from 'lucide-react';

export default function About() {
  const roadmapSteps = [
    { phase: 'Phase 1', title: 'Project Setup & UI Foundation', status: 'Active / Completed', current: true },
    { phase: 'Phase 2', title: 'User Authentication & Authorization', status: 'Upcoming' },
    { phase: 'Phase 3', title: 'Interactive Item Reporting', status: 'Upcoming' },
    { phase: 'Phase 4', title: 'Smart Automated Matching System', status: 'Upcoming' },
    { phase: 'Phase 5', title: 'Notifications & Claim/Recovery Workflow', status: 'Upcoming' },
    { phase: 'Phase 6', title: 'Admin Moderation & Analytics Dashboard', status: 'Upcoming' },
    { phase: 'Phase 7', title: 'Testing, Security, Optimization & Deployment', status: 'Upcoming' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
          <Compass className="w-4 h-4" />
          <span>About SmartFind</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Lost it? Found it? <span className="gradient-text">SmartFind brings them together.</span>
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          SmartFind is a modern recovery platform engineered to streamline how communities report, match, and return lost items with speed and security.
        </p>
      </div>

      {/* Problem & Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* The Problem */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold text-slate-900">The Problem We Solve</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Traditional lost-and-found methods rely on scattered social media posts, chaotic messaging threads, or physical lost-and-found desks that lack organization. 
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            People frequently lose valuable items—macbooks, wallets, access cards, keys—without any central system to check if someone has already found them nearby.
          </p>
        </div>

        {/* The Solution */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">
            🚀
          </div>
          <h2 className="text-2xl font-bold text-slate-900">The SmartFind Solution</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            SmartFind centralizes lost and found listings into a unified, clean interface with categorized item indexing, search filters, and location tracking.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            By providing a structured reporting process and automated matching, SmartFind drastically reduces the time it takes to return lost items to their owners.
          </p>
        </div>

      </div>

      {/* Smart Matching Explanation */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <Cpu className="w-6 h-6 text-teal-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">Future Smart Matching Algorithm</h2>
        </div>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          In Phase 4, SmartFind will introduce a multi-dimensional matching engine. When a user reports a lost or found item, the algorithm automatically cross-references:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            <h4 className="font-bold text-white text-sm">Item Taxonomy</h4>
            <p className="text-xs text-slate-300 mt-1">Categorization & brand tags</p>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            <h4 className="font-bold text-white text-sm">Geospatial Proximity</h4>
            <p className="text-xs text-slate-300 mt-1">Location radius matching</p>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            <h4 className="font-bold text-white text-sm">Time Window</h4>
            <p className="text-xs text-slate-300 mt-1">Chronological correlation</p>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            <h4 className="font-bold text-white text-sm">Description Similarity</h4>
            <p className="text-xs text-slate-300 mt-1">Keyword & vector analysis</p>
          </div>
        </div>
      </div>

      {/* Multi-Phase Architecture Roadmap */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900">Project Development Roadmap</h2>
          <p className="text-xs text-slate-500 mt-1">Structured multi-phase implementation plan</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 divide-y divide-slate-100">
          {roadmapSteps.map((step) => (
            <div key={step.phase} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  step.current ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {step.current ? <CheckCircle2 className="w-4 h-4" /> : step.phase.replace('Phase ', '')}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${step.current ? 'text-blue-600' : 'text-slate-800'}`}>
                    {step.phase}: {step.title}
                  </h4>
                </div>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                step.current 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {step.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
