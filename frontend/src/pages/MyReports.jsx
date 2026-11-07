import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyReports, deleteItem } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';
import { Eye, Edit3, Trash2, MapPin, Calendar, PlusCircle, Search, Sparkles } from 'lucide-react';

export default function MyReports() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUserReports = async (tab = activeTab, page = currentPage) => {
    setLoading(true);
    try {
      const res = await getMyReports(token, { status: tab, page, limit: 9 });
      if (res.success) {
        setReports(res.data || []);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages || 1);
        }
      }
    } catch (err) {
      console.error('[MyReports fetch error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReports(activeTab, currentPage);
  }, [activeTab, currentPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const res = await deleteItem(deleteTargetId, token);
      if (res.success) {
        setDeleteTargetId(null);
        fetchUserReports(activeTab, currentPage);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete report');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-teal-300">
            User Management
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">My Submitted Reports</h1>
          <p className="text-slate-300 text-sm">
            View, update, or remove your submitted lost and found reports.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            to="/lost-items/report"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 transition-all flex items-center space-x-1 shadow-sm"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Report Lost</span>
          </Link>
          <Link
            to="/found-items/report"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center space-x-1 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Found</span>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        {['all', 'lost', 'found'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold capitalize transition-all ${
              activeTab === tab
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab === 'all' ? 'All Reports' : `${tab} Reports`}
          </button>
        ))}
      </div>

      {/* Reports Listing Grid */}
      {loading ? (
        <LoadingSpinner message="Loading your submitted reports..." />
      ) : reports.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((item) => {
              const itemId = item._id || item.id;
              return (
                <div
                  key={itemId}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Image & Status */}
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <StatusBadge status={item.status} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2">
                      <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>

                      <div className="pt-3 space-y-1 text-xs text-slate-500 font-medium">
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
                    <Link
                      to={`/matches/${itemId}`}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Find Matches</span>
                    </Link>

                    <div className="grid grid-cols-3 gap-2">
                      <Link
                        to={`/item/${itemId}`}
                        className="py-2 px-2 rounded-xl bg-white border border-slate-200 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-1 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>

                      <Link
                        to={`/item/${itemId}/edit`}
                        className="py-2 px-2 rounded-xl bg-white border border-slate-200 hover:bg-amber-50 hover:text-amber-700 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-1 transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>

                      <button
                        onClick={() => setDeleteTargetId(itemId)}
                        className="py-2 px-2 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center justify-center space-x-1 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      ) : (
        <EmptyState
          title="No submitted reports found"
          description="You haven't reported any lost or found items under this status yet."
          actionText="Report an Item"
          actionLink="/lost-items/report"
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Are you sure you want to delete this report?"
        message="This action cannot be undone and will permanently remove this item report."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
        isConfirming={isDeleting}
      />
    </div>
  );
}
