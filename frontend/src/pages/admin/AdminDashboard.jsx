import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAdminDashboard } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Users, FileQuestion, PlusCircle, Sparkles, Inbox, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getAdminDashboard(token);
        if (res.success) {
          setStats(res.stats);
          setRecentActivity(res.recentActivity || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch admin dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  const statCards = [
    { title: 'Total Registered Users', count: stats?.totalUsers || 0, icon: Users, color: 'bg-blue-600' },
    { title: 'Lost Item Reports', count: stats?.totalLostItems || 0, icon: FileQuestion, color: 'bg-amber-500' },
    { title: 'Found Item Reports', count: stats?.totalFoundItems || 0, icon: PlusCircle, color: 'bg-teal-500' },
    { title: 'Potential Smart Matches', count: stats?.totalMatches || 0, icon: Sparkles, color: 'bg-indigo-600' },
    { title: 'Pending Recovery Claims', count: stats?.pendingRecoveryRequests || 0, icon: Inbox, color: 'bg-rose-500' },
    { title: 'Completed Recoveries', count: stats?.completedRecoveries || 0, icon: CheckCircle2, color: 'bg-emerald-600' },
    { title: 'Pending Listing Reports', count: stats?.pendingReports || 0, icon: AlertTriangle, color: 'bg-orange-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <AdminSidebar />

        <main className="flex-1 w-full space-y-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase text-teal-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Administrator Dashboard</span>
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight">Platform Management</h1>
              <p className="text-slate-300 text-xs">Real-time metrics and administration controls.</p>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading platform metrics..." />
          ) : error ? (
            <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold space-y-1">
              <p className="font-bold text-sm">Failed to Load Dashboard</p>
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-slate-500 block">{card.title}</span>
                        <span className="text-3xl font-extrabold text-slate-900">{card.count}</span>
                      </div>
                      <div className={`w-12 h-12 rounded-2xl ${card.color} text-white flex items-center justify-center shadow-md shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Admin Activity Log Preview */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Recent Admin Activity</h3>
                {recentActivity.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {recentActivity.map((log) => (
                      <div key={log._id} className="py-3 flex items-start justify-between gap-4">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-800">{log.description}</p>
                          <span className="text-[11px] text-slate-400">By {log.admin?.name || 'Admin'}</span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 shrink-0">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-4 text-center">No admin activity recorded yet.</p>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
