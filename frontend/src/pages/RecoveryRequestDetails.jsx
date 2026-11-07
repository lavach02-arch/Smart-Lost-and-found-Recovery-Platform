import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getRecoveryRequest,
  acceptRecoveryRequest,
  rejectRecoveryRequest,
  cancelRecoveryRequest,
  completeRecoveryRequest,
} from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, CheckCircle2, Clock, XCircle, Ban, Sparkles, MapPin, Calendar, User, MessageSquare, ExternalLink, AlertCircle } from 'lucide-react';

export default function RecoveryRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRecoveryRequest(id, token);
      if (res.success) {
        setRequest(res.request);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch request details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id, token]);

  if (loading) return <LoadingSpinner message="Loading request details..." />;
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center space-x-3 text-sm font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
        <button
          onClick={() => navigate('/recovery-requests')}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          Back to Recovery Requests
        </button>
      </div>
    );
  }

  if (!request) return null;

  const currentUserId = user?._id || user?.id;
  const requesterId = request.requester?._id || request.requester;
  const ownerId = request.owner?._id || request.owner;

  const isOwner = currentUserId === ownerId;
  const isRequester = currentUserId === requesterId;

  const handleAccept = async () => {
    setActionLoading(true);
    try {
      const res = await acceptRecoveryRequest(id, token);
      if (res.success) fetchDetails();
    } catch (err) {
      alert(err.message || 'Failed to accept request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      const res = await rejectRecoveryRequest(id, token);
      if (res.success) fetchDetails();
    } catch (err) {
      alert(err.message || 'Failed to reject request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      const res = await cancelRecoveryRequest(id, token);
      if (res.success) fetchDetails();
    } catch (err) {
      alert(err.message || 'Failed to cancel request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    setActionLoading(true);
    try {
      const res = await completeRecoveryRequest(id, token);
      if (res.success) fetchDetails();
    } catch (err) {
      alert(err.message || 'Failed to complete recovery');
    } finally {
      setActionLoading(false);
    }
  };

  const item = request.item;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Top Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Recovery Requests</span>
      </button>

      {/* Main Request Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden space-y-6">
        {/* Banner Header */}
        <div className="bg-slate-900 p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Recovery Request #{request._id.slice(-6)}
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-1">Claim Verification & Recovery</h1>
          </div>

          <span
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
              request.status === 'ACCEPTED'
                ? 'bg-emerald-500 text-white'
                : request.status === 'REJECTED'
                ? 'bg-rose-500 text-white'
                : request.status === 'COMPLETED'
                ? 'bg-blue-600 text-white'
                : request.status === 'CANCELLED'
                ? 'bg-slate-600 text-white'
                : 'bg-amber-500 text-slate-950'
            }`}
          >
            {request.status}
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Target Item Section */}
          {item && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Item</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 gap-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-200"
                  />
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{item.category}</span>
                    <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/item/${item._id || item.id}`}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shrink-0"
                >
                  <span>View Original Item</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* User Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Requester</span>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{request.requester?.name || 'User'}</h4>
                  <p className="text-xs text-slate-500">{request.requester?.email}</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Item Owner</span>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{request.owner?.name || 'User'}</h4>
                  <p className="text-xs text-slate-500">{request.owner?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Claim Rationale Message */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-900">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold">Claim Verification Message</h3>
            </div>
            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {request.message}
            </div>
          </div>

          {/* Actions Bar */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-slate-400 font-medium">
              Submitted on {new Date(request.createdAt).toLocaleString()}
            </span>

            <div className="flex items-center space-x-3">
              {isOwner && request.status === 'PENDING' && (
                <>
                  <button
                    disabled={actionLoading}
                    onClick={handleReject}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 transition-all disabled:opacity-50"
                  >
                    Reject Request
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={handleAccept}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all disabled:opacity-50"
                  >
                    Accept Recovery Claim
                  </button>
                </>
              )}

              {isRequester && request.status === 'PENDING' && (
                <button
                  disabled={actionLoading}
                  onClick={handleCancel}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-all disabled:opacity-50"
                >
                  Cancel Request
                </button>
              )}

              {request.status === 'ACCEPTED' && (
                <button
                  disabled={actionLoading}
                  onClick={handleComplete}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all disabled:opacity-50"
                >
                  Mark Recovery Completed
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
