import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, CheckCircle2, ArrowRight, Sparkles, Send, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createRecoveryRequest } from '../services/api';

export default function MatchCard({ match }) {
  const { item, matchScore, matchLevel, matchedFields = [] } = match;
  const itemId = item._id || item.id;
  const isLost = item.status === 'lost';

  const { user, token, isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const currentUserId = user?._id || user?.id;
  const isOwner = currentUserId && (item.owner === currentUserId || item.owner?._id === currentUserId);

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-emerald-600 text-white border-emerald-500';
    if (score >= 60) return 'bg-blue-600 text-white border-blue-500';
    return 'bg-amber-600 text-white border-amber-500';
  };

  const getLevelBadge = (score) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (score >= 60) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  const handleOpenModal = () => {
    setClaimMessage(`I believe this is my item "${item.title}". Key identifying details: `);
    setSubmitError('');
    setSubmitSuccess(false);
    setShowModal(true);
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    if (!claimMessage.trim()) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await createRecoveryRequest({ itemId, message: claimMessage.trim() }, token);
      if (res.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setShowModal(false);
          setSubmitSuccess(false);
        }, 2000);
      }
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit recovery request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group hover:-translate-y-1">
        <div>
          {/* Header Image & Score Badge */}
          <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <div className="absolute top-3 left-3 flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black shadow-md border ${getScoreColor(matchScore)}`}>
                {matchScore}% Match
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getLevelBadge(matchScore)}`}>
                {matchLevel}
              </span>
            </div>
          </div>

          {/* Item Content */}
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600">
              <Tag className="w-3.5 h-3.5" />
              <span>{item.category}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 uppercase">{isLost ? 'Lost Item' : 'Found Item'}</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {item.title}
            </h3>

            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {item.description}
            </p>

            <div className="space-y-1.5 text-xs text-slate-500 font-medium pt-1">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{item.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{item.date}</span>
              </div>
            </div>

            {/* Match Explanation Checklist */}
            {matchedFields.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Match Criteria Met:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matchedFields.map((field) => (
                    <span
                      key={field}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{field}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
          {isAuthenticated && !isOwner && (
            <button
              onClick={handleOpenModal}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center space-x-2 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Request Recovery</span>
            </button>
          )}

          <Link
            to={`/item/${itemId}`}
            className="w-full py-2 px-4 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center space-x-2 border border-slate-200 shadow-xs"
          >
            <span>View Match Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recovery Request Claim Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Recovery Claim</span>
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">Request Item Recovery</h3>
              <p className="text-xs text-slate-500">
                Submit a recovery claim to the item owner for <strong className="text-slate-800">{item.title}</strong>.
              </p>
            </div>

            {submitSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-3 text-xs font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Recovery request sent successfully! The owner has been notified.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitClaim} className="space-y-4">
                {submitError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Why do you believe this is your item?
                  </label>
                  <textarea
                    rows={4}
                    value={claimMessage}
                    onChange={(e) => setClaimMessage(e.target.value)}
                    placeholder="Describe specific markings, contents, or circumstances confirming ownership..."
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !claimMessage.trim()}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Sending...' : 'Send Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
