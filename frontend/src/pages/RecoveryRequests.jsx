import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getMyRecoveryRequests,
  getReceivedRecoveryRequests,
  acceptRecoveryRequest,
  rejectRecoveryRequest,
  cancelRecoveryRequest,
  completeRecoveryRequest,
} from '../services/api';
import RecoveryRequestCard from '../components/RecoveryRequestCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { FileCheck, Inbox, Send } from 'lucide-react';

export default function RecoveryRequests() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (!token) return;
    setLoading(true);
    try {
      let res;
      if (activeTab === 'received') {
        res = await getReceivedRecoveryRequests(token);
      } else {
        res = await getMyRecoveryRequests(token);
      }
      if (res.success) {
        setRequests(res.requests || []);
      }
    } catch (err) {
      console.error('[RecoveryRequests fetch error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab, token]);

  const handleAccept = async (id) => {
    try {
      const res = await acceptRecoveryRequest(id, token);
      if (res.success) {
        fetchRequests();
      }
    } catch (err) {
      alert(err.message || 'Failed to accept request');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await rejectRecoveryRequest(id, token);
      if (res.success) {
        fetchRequests();
      }
    } catch (err) {
      alert(err.message || 'Failed to reject request');
    }
  };

  const handleCancel = async (id) => {
    try {
      const res = await cancelRecoveryRequest(id, token);
      if (res.success) {
        fetchRequests();
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel request');
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await completeRecoveryRequest(id, token);
      if (res.success) {
        fetchRequests();
      }
    } catch (err) {
      alert(err.message || 'Failed to mark recovery completed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-teal-300">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Recovery Management</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Recovery Claims & Requests</h1>
          <p className="text-slate-300 text-sm">
            Track and manage recovery claim requests submitted by you or received for your reported items.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('received')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all ${
            activeTab === 'received'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Received Requests</span>
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all ${
            activeTab === 'sent'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>My Sent Requests</span>
        </button>
      </div>

      {/* Request Cards Grid */}
      {loading ? (
        <LoadingSpinner message="Loading recovery requests..." />
      ) : requests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <RecoveryRequestCard
              key={req._id}
              request={req}
              isOwnerView={activeTab === 'received'}
              onAccept={handleAccept}
              onReject={handleReject}
              onCancel={handleCancel}
              onComplete={handleComplete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={activeTab === 'received' ? 'No Received Recovery Requests' : 'No Sent Recovery Requests'}
          description={
            activeTab === 'received'
              ? 'When other users claim items you reported, their requests will appear here.'
              : 'You haven’t submitted any recovery claims yet.'
          }
          actionText="Find Potential Matches"
          actionLink="/my-reports"
        />
      )}
    </div>
  );
}
