import React from 'react';
import { Filter, RotateCcw, MapPin, Tag, Calendar, Layers } from 'lucide-react';
import { CATEGORIES } from './ItemForm';

export default function FilterBar({
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  selectedDateRange,
  setSelectedDateRange,
  selectedStatus,
  setSelectedStatus,
  onReset,
}) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2 text-slate-800 font-semibold text-sm">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filter Reports</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-blue-600 flex items-center space-x-1 font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center space-x-1">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span>Category</span>
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Location Filter</span>
          </label>
          <input
            type="text"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            placeholder="e.g. Bus Stand, Library..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Time Range</span>
          </label>
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            <option value="all">Any Time</option>
            <option value="7days">Past 7 Days</option>
            <option value="30days">Past 30 Days</option>
          </select>
        </div>

        {/* Optional Status Filter (when used on My Reports or all items view) */}
        {setSelectedStatus && (
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Status</span>
            </label>
            <select
              value={selectedStatus || 'all'}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="all">All Statuses</option>
              <option value="lost">Lost Only</option>
              <option value="found">Found Only</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
