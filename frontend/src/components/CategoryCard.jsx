import React from 'react';
import * as Icons from 'lucide-react';

export default function CategoryCard({ category, onClick }) {
  // Dynamically map string icon name to Lucide Icon component
  const IconComponent = Icons[category.icon] || Icons.Tag;

  return (
    <div 
      onClick={() => onClick && onClick(category.name)}
      className="group relative bg-slate-900/90 p-6 rounded-2xl border border-slate-800/80 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden backdrop-blur-md hover:border-slate-700"
    >
      {/* Background Accent Pill */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${category.gradient} flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <IconComponent className="w-6 h-6" />
      </div>

      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
          {category.name}
        </h4>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700/50 rounded-full">
          {category.count} items
        </span>
      </div>

      <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
        {category.description}
      </p>

      <div className="mt-4 flex items-center text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
        <span>Browse {category.name}</span>
        <Icons.ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </div>
  );
}
