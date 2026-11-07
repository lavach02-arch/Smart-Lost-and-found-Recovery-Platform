import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading reports...' }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3 py-12">
      <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
      <p className="text-sm font-semibold text-slate-500">{message}</p>
    </div>
  );
}
