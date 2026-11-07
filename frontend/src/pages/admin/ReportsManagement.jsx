import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAdminReports, updateReportStatus, deleteAdminItem } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import ConfirmDialog from '../../components/ConfirmDialog';
import { AlertTriangle, Eye, CheckCircle2, XCircle, Trash2, Clock } from 'lucide-react';

export default function ReportsManagement() {
  const { token } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteItemTarget, setDeleteItemTarget] = useState(null);

  const fetchReports = async (page = currentPage) => {
    setLoading(true);
    try {
      const res = await getAdminReports(token, {
        status: statusFilter,
        page,
        limit: 10,
      });
      if (res.success) {
        setReports(res.reports || []);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('[ReportsManagement fetch error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(1);
    setCurrentPage(1);
  }, [statusFilter, token]);

  useEffect(() => {
    fetchReports(currentPage);
  }, [currentPage]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await updateReportStatus(id, status, token);
      if (res.success) fetchReports(currentPage);
    } catch (err) {
      alert(err.message || 'Failed to update report status');
    }
  };

  const handleConfirmDeleteItem = async () => {
    if (!deleteItemTarget) return;
    try {
      await deleteAdminItem(deleteItemTarget.itemId, token);
      await updateReportStatus(deleteItemTarget.reportId, 'RESOLVED', token);
      setDeleteItemTarget(null);
      fetchReports(currentPage);
    } catch (err) {
      alert(err.message || 'Failed to delete reported item');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'REVIEWED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RESOLVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'DISMISSED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <AdminSidebar />

        <main className="flex-1 w-full space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Reported Listings & Abuse</h1>
            <p className="text-xs text-slate-500">Review user-submitted reports for fake listings or inappropriate content.</p>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Reports</option>
              <option value="PENDING">PENDING</option>
              <option value="REVIEWED">REVIEWED</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="DISMISSED">DISMISSED</option>
            </select>
          </div>

          {/* Reports Table */}
          {loading ? (
            <LoadingSpinner message="Loading reported listings..." />
          ) : reports.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-4">Reported Item</th>
                      <th className="p-4">Reason</th>
                      <th className="p-4">Reporter</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Submitted</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {reports.map((rep) => (
                      <tr key={rep._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <span className="font-bold text-slate-900 block truncate max-w-[160px]">
                            {rep.reportedItem?.title || 'Item Removed'}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold">
                            {rep.reason}
                          </span>
                        </td>

                        <td className="p-4 text-slate-600">{rep.reporter?.name || 'User'}</td>

                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getStatusBadge(rep.status)}`}>
                            {rep.status}
                          </span>
                        </td>

                        <td className="p-4 text-slate-500">{new Date(rep.createdAt).toLocaleDateString()}</td>

                        <td className="p-4 text-right space-x-1.5">
                          {rep.reportedItem && (
                            <Link
                              to={`/item/${rep.reportedItem._id || rep.reportedItem}`}
                              className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-all inline-flex align-middle"
                              title="View Item"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          )}

                          {rep.status === 'PENDING' && (
                            <button
                              onClick={() => handleUpdateStatus(rep._id, 'REVIEWED')}
                              className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-[11px] font-bold transition-all"
                            >
                              Review
                            </button>
                          )}

                          {rep.status !== 'RESOLVED' && rep.status !== 'DISMISSED' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(rep._id, 'DISMISSED')}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-all"
                              >
                                Dismiss
                              </button>

                              {rep.reportedItem && (
                                <button
                                  onClick={() =>
                                    setDeleteItemTarget({
                                      reportId: rep._id,
                                      itemId: rep.reportedItem._id || rep.reportedItem,
                                    })
                                  }
                                  className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg text-[11px] font-bold transition-all"
                                >
                                  Delete Item
                                </button>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
              <p className="text-xs text-slate-500">No user reports found under this status filter.</p>
            </div>
          )}
        </main>
      </div>

      <ConfirmDialog
        isOpen={!!deleteItemTarget}
        title="Delete Reported Item & Resolve Report?"
        message="This action will delete the item listing from the platform and mark the report as resolved."
        onConfirm={handleConfirmDeleteItem}
        onCancel={() => setDeleteItemTarget(null)}
      />
    </div>
  );
}
