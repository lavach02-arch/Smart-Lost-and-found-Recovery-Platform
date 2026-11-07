import React from 'react';
import * as Icons from 'lucide-react';

export default function StatCard({ stat }) {
  const IconComponent = Icons[stat.iconName] || Icons.Activity;

  const colorStyles = {
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  }[stat.color] || 'bg-blue-500/20 text-blue-400 border-blue-500/30';

  return (
    <div className="relative bg-slate-900/90 p-6 rounded-2xl border border-slate-800/80 shadow-xl transition-all backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-xl border ${colorStyles}`}>
          <IconComponent className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700/50 px-2 py-0.5 rounded-full">
          Live Metric
        </span>
      </div>

      <div className="text-3xl font-extrabold text-white tracking-tight">
        {stat.value}
      </div>

      <p className="text-sm font-medium text-slate-300 mt-1">
        {stat.label}
      </p>

      <p className="text-xs text-slate-400 mt-2 flex items-center space-x-1">
        <span>{stat.change}</span>
      </p>
    </div>
  );
}
