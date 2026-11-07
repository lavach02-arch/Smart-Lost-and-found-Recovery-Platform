import React from 'react';
import { Tag } from 'lucide-react';

export default function StatusBadge({ status, className = '' }) {
  const isLost = status?.toLowerCase() === 'lost';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-xs ${
        isLost
          ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
      } ${className}`}
    >
      <Tag className="w-3 h-3" />
      <span>{isLost ? 'LOST' : 'FOUND'}</span>
    </span>
  );
}
