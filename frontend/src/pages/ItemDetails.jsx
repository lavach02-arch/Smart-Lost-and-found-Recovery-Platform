import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Tag, User, ShieldAlert, Edit3, Trash2, FileText, CheckCircle2, Sparkles, Flag } from 'lucide-react';
import { getItemById, deleteItem, createReport } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const outletContext = useOutletContext();
  const onOpenReportModal = outletContext?.onOpenReportModal;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Report modal state
  const [showReportItemModal, setShowReportItemModal] = useState(false);
  const [reportReason, setReportReason] = useState('Incorrect Item');
  const [reportDescription, setReportDescription] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState('');

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setReportError('Please log in to submit a report');
      return;
    }
    setIsSubmittingReport(true);
    setReportError('');
    try {
      const res = await createReport(
        {
          reportedItem: item._id || item.id,
          reason: reportReason,
          description: reportDescription,
        },
        token
      );
      if (res.success) {
        setReportSuccess(true);
      } else {
        setReportError(res.message || 'Failed to submit report');
      }
    } catch (err) {
      setReportError(err.message || 'Failed to submit report');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await getItemById(id);
        if (res.success && res.data) {
          setItem(res.data);
        } else {
          setError('Item report not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch item details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteItem(id, token);
      if (res.success) {
        setShowDeleteModal(false);
        navigate('/my-reports');
      }
    } catch (err) {
      alert(err.message || 'Failed to delete report');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Fetching report details..." />;
  }

  if (error || !item) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Item Report Not Found</h2>
        <p className="text-xs text-slate-500">{error || `No report found matching ID ${id}`}</p>
        <Link
          to="/lost-items"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-xs shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Directory</span>
        </Link>
      </div>
    );
  }

  const isLost = item.status === 'lost';
  const ownerId = item.owner?._id || item.owner?.id || item.owner;
  const currentUserId = user?.id || user?._id;
  const isOwner = Boolean(ownerId && currentUserId && ownerId === currentUserId);
  const reporterName = item.owner?.name || item.contactName || 'SmartFind Registered Member';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={isLost ? '/lost-items' : '/found-items'}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {isLost ? 'Lost Items' : 'Found Items'}</span>
        </Link>

        {/* Owner Controls */}
        {isOwner && (
          <div className="flex items-center space-x-2">
            <Link
              to={`/matches/${id}`}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center space-x-1.5 shadow-md shadow-blue-500/20"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Find Potential Matches</span>
            </Link>

            <Link
              to={`/item/${id}/edit`}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Report</span>
            </Link>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Report</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Details Card Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Column: Image Display */}
        <div className="relative bg-slate-900 min-h-[320px] md:min-h-full flex items-center justify-center">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover max-h-[500px]"
          />
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <StatusBadge status={item.status} />
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category tag */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit border border-blue-100">
                <Tag className="w-3.5 h-3.5" />
                <span>{item.category}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">ID: {item._id || item.id}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {item.title}
            </h1>

            {/* Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center space-x-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Location</p>
                  <p className="text-xs font-semibold text-slate-800 truncate">{item.location}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Calendar className="w-4 h-4 text-teal-500 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Date Reported</p>
                  <p className="text-xs font-semibold text-slate-800">{item.date}</p>
                </div>
              </div>

              {item.time && (
                <div className="flex items-center space-x-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100 sm:col-span-2">
                  <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Time</p>
                    <p className="text-xs font-semibold text-slate-800">{item.time}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Item Description</h3>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                {item.description}
              </p>
            </div>

            {/* Additional Details (if provided) */}
            {item.additionalDetails && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Additional Details</span>
                </h3>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {item.additionalDetails}
                </p>
              </div>
            )}

            {/* Reporter Info */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Reporter Information</h3>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Reported by: {reporterName}</p>
                  <p className="text-[11px] text-slate-500">Contact managed securely via SmartFind</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Callouts */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
            {onOpenReportModal && (
              <button
                onClick={() => onOpenReportModal(isLost ? 'Claim / Contact Owner' : 'Claim Found Item', 'Phase 5 (Claim & Recovery Workflow)')}
                className="w-full sm:flex-1 py-3.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl text-sm transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-5 h-5 text-teal-300" />
                <span>{isLost ? 'Contact Owner / Report Match' : 'Claim This Item'}</span>
              </button>
            )}

            {!isOwner && user && (
              <button
                onClick={() => setShowReportItemModal(true)}
                className="w-full sm:w-auto py-3.5 px-4 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-semibold rounded-2xl text-xs transition-colors flex items-center justify-center space-x-1.5 border border-slate-200 hover:border-rose-200"
              >
                <Flag className="w-4 h-4" />
                <span>Report Item</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Report Item Modal */}
      {showReportItemModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-rose-600 font-bold text-base">
                <Flag className="w-5 h-5" />
                <h3>Report Listing to Admin</h3>
              </div>
              <button
                onClick={() => setShowReportItemModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            {reportSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800">Report Submitted</h4>
                <p className="text-xs text-slate-500">
                  Thank you for keeping SmartFind safe. Platform administrators will review this listing shortly.
                </p>
                <button
                  onClick={() => {
                    setShowReportItemModal(false);
                    setReportSuccess(false);
                  }}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                {reportError && (
                  <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium">
                    {reportError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reason for Reporting *
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Incorrect Item">Incorrect Item Information</option>
                    <option value="Fake Listing">Fake / Fraudulent Listing</option>
                    <option value="Spam">Spam or Duplicate Post</option>
                    <option value="Inappropriate Content">Inappropriate Content / Language</option>
                    <option value="Other">Other Reason</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description / Additional Details
                  </label>
                  <textarea
                    rows={3}
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Provide context for admin review..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportItemModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReport}
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md flex items-center space-x-1.5"
                  >
                    {isSubmittingReport ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <Flag className="w-3.5 h-3.5" />
                        <span>Submit Report</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        title="Are you sure you want to delete this report?"
        message="This action cannot be undone and will permanently remove this item report from SmartFind."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isConfirming={isDeleting}
      />
    </div>
  );
}
