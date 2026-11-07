import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileText, CheckCircle2, XCircle, Bell, Trash2, ExternalLink } from 'lucide-react';

export default function NotificationItem({ notification, onMarkRead, onDelete }) {
  const { _id, type, title, message, isRead, relatedItem, relatedRequest, createdAt } = notification;

  const getTypeStyle = () => {
    switch (type) {
      case 'MATCH_FOUND':
        return {
          bg: 'bg-indigo-50 border-indigo-200 text-indigo-700',
          icon: Sparkles,
          iconBg: 'bg-indigo-600 text-white',
        };
      case 'RECOVERY_REQUEST':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-700',
          icon: FileText,
          iconBg: 'bg-blue-600 text-white',
        };
      case 'REQUEST_ACCEPTED':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          icon: CheckCircle2,
          iconBg: 'bg-emerald-600 text-white',
        };
      case 'REQUEST_REJECTED':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          icon: XCircle,
          iconBg: 'bg-rose-600 text-white',
        };
      default:
        return {
          bg: 'bg-slate-50 border-slate-200 text-slate-700',
          icon: Bell,
          iconBg: 'bg-slate-700 text-white',
        };
    }
  };

  const style = getTypeStyle();
  const Icon = style.icon;

  const formattedTime = new Date(createdAt).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        isRead ? 'bg-white border-slate-200/80 shadow-sm' : `${style.bg} shadow-md`
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className={`w-9 h-9 rounded-xl ${style.iconBg} flex items-center justify-center shrink-0 shadow-sm mt-0.5`}>
            <Icon className="w-4 h-4" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-slate-900">{title}</h4>
              {!isRead && (
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 animate-pulse" />
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
            <span className="text-[11px] font-medium text-slate-400 block pt-0.5">{formattedTime}</span>

            {/* Action Links */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {relatedRequest && (
                <Link
                  to={`/recovery-requests/${relatedRequest._id || relatedRequest}`}
                  onClick={() => !isRead && onMarkRead?.(_id)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold inline-flex items-center space-x-1 shadow-sm transition-all"
                >
                  <span>View Request</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}

              {relatedItem && (
                <Link
                  to={`/item/${relatedItem._id || relatedItem}`}
                  onClick={() => !isRead && onMarkRead?.(_id)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center space-x-1 transition-all"
                >
                  <span>View Item</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          {!isRead && (
            <button
              onClick={() => onMarkRead?.(_id)}
              className="px-2 py-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-100/60 hover:bg-blue-100 rounded-lg transition-all"
            >
              Mark read
            </button>
          )}
          <button
            onClick={() => onDelete?.(_id)}
            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-all"
            title="Delete notification"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
