import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, PlusCircle, Search } from 'lucide-react';

export default function EmptyState({
  title = 'No reports found',
  description = 'There are currently no items matching your criteria.',
  actionText,
  actionLink,
  onReset,
}) {
  return (
    <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto space-y-4 my-8">
      <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
        <AlertCircle className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
        {actionText && actionLink && (
          <Link
            to={actionLink}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-blue-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{actionText}</span>
          </Link>
        )}

        {onReset && (
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
