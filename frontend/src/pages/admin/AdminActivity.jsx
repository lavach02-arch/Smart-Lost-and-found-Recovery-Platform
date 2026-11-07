import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAdminActivity } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import { Activity, Shield, User } from 'lucide-react';

export default function AdminActivity() {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async (page = currentPage) => {
    setLoading(true);
    try {
      const res = await getAdminActivity(token, { page, limit: 15 });
      if (res.success) {
        setLogs(res.logs || []);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('[AdminActivity fetch error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage, token]);

  const getActionBadge = (action) => {
    if (action.includes('SUSPENDED') || action.includes('DELETED')) {
      return 'bg-rose-100 text-rose-800 border-rose-200';
    }
    if (action.includes('ACTIVATED') || action.includes('RESOLVED')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <AdminSidebar />

        <main className="flex-1 w-full space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Admin Audit Activity Log</h1>
            <p className="text-xs text-slate-500">Immutable audit logs of all administrative operations on the platform.</p>
          </div>

          {/* Activity Log Table */}
          {loading ? (
            <LoadingSpinner message="Loading audit logs..." />
          ) : logs.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-4">Administrator</th>
                      <th className="p-4">Action</th>
                      <th className="p-4">Target Type</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {logs.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-bold text-slate-900 truncate max-w-[140px]">
                          {log.admin?.name || 'Admin'}
                        </td>

                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getActionBadge(log.action)}`}>
                            {log.action}
                          </span>
                        </td>

                        <td className="p-4 text-slate-600 font-semibold">{log.targetType}</td>

                        <td className="p-4 text-slate-700 max-w-[260px] leading-relaxed">
                          {log.description}
                        </td>

                        <td className="p-4 text-slate-500 shrink-0">
                          {new Date(log.createdAt).toLocaleString()}
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
              <p className="text-xs text-slate-500">No administrative activity logs recorded yet.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
