import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAdminRecoveryRequests } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import { Eye, ArrowRight, FileCheck } from 'lucide-react';

export default function RecoveryManagement() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRequests = async (page = currentPage) => {
    setLoading(true);
    try {
      const res = await getAdminRecoveryRequests(token, {
        status: statusFilter,
        page,
        limit: 10,
      });
      if (res.success) {
        setRequests(res.requests || []);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('[RecoveryManagement fetch error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(1);
    setCurrentPage(1);
  }, [statusFilter, token]);

  useEffect(() => {
    fetchRequests(currentPage);
  }, [currentPage]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'ACCEPTED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'CANCELLED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
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
            <h1 className="text-2xl font-extrabold text-slate-900">Recovery Requests Monitoring</h1>
            <p className="text-xs text-slate-500">Overview of all claim recovery transactions across the platform.</p>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Filter by Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="ACCEPTED">ACCEPTED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>

          {/* Requests Table */}
          {loading ? (
            <LoadingSpinner message="Loading recovery claim records..." />
          ) : requests.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-4">Item</th>
                      <th className="p-4">Requester</th>
                      <th className="p-4">Owner</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {requests.map((req) => (
                      <tr key={req._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-bold text-slate-900 truncate max-w-[160px]">
                          {req.item?.title || 'Reported Item'}
                        </td>
                        <td className="p-4 text-slate-600">{req.requester?.name || 'User'}</td>
                        <td className="p-4 text-slate-600">{req.owner?.name || 'User'}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getStatusBadge(req.status)}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          <Link
                            to={`/recovery-requests/${req._id}`}
                            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-all inline-flex align-middle"
                            title="View Request Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
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
              <p className="text-xs text-slate-500">No recovery requests found under this status.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
