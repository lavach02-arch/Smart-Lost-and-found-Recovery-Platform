import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, Ban, Sparkles, MapPin, Calendar, ArrowRight, User } from 'lucide-react';

export default function RecoveryRequestCard({ request, isOwnerView, onAccept, onReject, onCancel, onComplete }) {
  const { _id, item, requester, owner, message, status, createdAt } = request;

  const getStatusBadge = () => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Pending Approval',
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: Clock,
        };
      case 'ACCEPTED':
        return {
          label: 'Request Accepted',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: CheckCircle2,
        };
      case 'REJECTED':
        return {
          label: 'Request Rejected',
          color: 'bg-rose-100 text-rose-800 border-rose-200',
          icon: XCircle,
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          color: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Ban,
        };
      case 'COMPLETED':
        return {
          label: 'Recovery Completed',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Sparkles,
        };
      default:
        return {
          label: status,
          color: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Clock,
        };
    }
  };

  const badge = getStatusBadge();
  const StatusIcon = badge.icon;

  const otherUser = isOwnerView ? requester : owner;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
      <div className="p-6 space-y-4">
        {/* Status Header */}
        <div className="flex items-center justify-between gap-3">
          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Item Preview */}
        {item && (
          <div className="flex items-center space-x-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <img
              src={item.image}
              alt={item.title}
              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
            />
            <div className="space-y-1 overflow-hidden">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                {item.category}
              </span>
              <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
              <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium">
                <div className="flex items-center space-x-1 truncate">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
                <div className="flex items-center space-x-1 shrink-0">
                  <Calendar className="w-3 h-3 shrink-0" />
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Claim Message */}
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Claim Message</span>
          <p className="text-xs text-slate-700 bg-slate-50/80 p-3 rounded-xl border border-slate-100 italic leading-relaxed">
            "{message}"
          </p>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-2.5 pt-1">
          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="text-slate-400 font-medium">{isOwnerView ? 'Requested by:' : 'Item Owner:'} </span>
            <span className="font-bold text-slate-800">{otherUser?.name || 'User'}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
        <Link
          to={`/recovery-requests/${_id}`}
          className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-all flex items-center space-x-1"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {/* Actions based on role and status */}
        <div className="flex items-center space-x-2">
          {isOwnerView && status === 'PENDING' && (
            <>
              <button
                onClick={() => onReject?.(_id)}
                className="px-3 py-2 text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-xl transition-all"
              >
                Reject
              </button>
              <button
                onClick={() => onAccept?.(_id)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
              >
                Accept
              </button>
            </>
          )}

          {!isOwnerView && status === 'PENDING' && (
            <button
              onClick={() => onCancel?.(_id)}
              className="px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-xl transition-all"
            >
              Cancel Request
            </button>
          )}

          {status === 'ACCEPTED' && (
            <button
              onClick={() => onComplete?.(_id)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
            >
              Mark Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
