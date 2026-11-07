import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { getMyReports, getItemMatches, getReceivedRecoveryRequests, getMyRecoveryRequests } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { Search, PlusCircle, User, Sparkles, PackageCheck, FileQuestion, CheckCircle2, ArrowRight, ListFilter, MapPin, Calendar, Eye, Inbox, Bell, FileCheck } from 'lucide-react';

export default function Dashboard() {
  const { user, token } = useAuth();
  const { unreadCount } = useNotifications();
  const [reportStats, setReportStats] = useState({
    lostCount: 0,
    foundCount: 0,
    totalCount: 0,
    matchesCount: 0,
    pendingRequestsCount: 0,
    acceptedRequestsCount: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!token) return;
      try {
        const [reportsRes, receivedReqRes, sentReqRes] = await Promise.allSettled([
          getMyReports(token, { limit: 100 }),
          getReceivedRecoveryRequests(token),
          getMyRecoveryRequests(token),
        ]);

        let lost = 0, found = 0, items = [], totalMatches = 0;

        if (reportsRes.status === 'fulfilled' && reportsRes.value?.success && reportsRes.value?.data) {
          items = reportsRes.value.data;
          lost = items.filter((i) => i.status === 'lost').length;
          found = items.filter((i) => i.status === 'found').length;
          setRecentReports(items.slice(0, 3));

          // Fetch matches for items in parallel
          const matchPromises = items.map((item) => {
            const itemId = item._id || item.id;
            return getItemMatches(itemId, token);
          });
          const matchResults = await Promise.allSettled(matchPromises);
          matchResults.forEach((result) => {
            if (result.status === 'fulfilled' && result.value?.success && Array.isArray(result.value.matches)) {
              totalMatches += result.value.matches.length;
            }
          });
        }

        let pendingCount = 0, acceptedCount = 0;
        const allRequests = [
          ...(receivedReqRes.status === 'fulfilled' && receivedReqRes.value?.success ? receivedReqRes.value.requests || [] : []),
          ...(sentReqRes.status === 'fulfilled' && sentReqRes.value?.success ? sentReqRes.value.requests || [] : []),
        ];

        pendingCount = allRequests.filter((r) => r.status === 'PENDING').length;
        acceptedCount = allRequests.filter((r) => r.status === 'ACCEPTED' || r.status === 'COMPLETED').length;

        setReportStats({
          lostCount: lost,
          foundCount: found,
          totalCount: items.length,
          matchesCount: totalMatches,
          pendingRequestsCount: pendingCount,
          acceptedRequestsCount: acceptedCount,
        });
      } catch (err) {
        console.error('[Dashboard Stats Error]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [token]);

  const stats = [
    {
      title: 'My Lost Reports',
      count: reportStats.lostCount,
      icon: FileQuestion,
      color: 'bg-amber-500',
      link: '/my-reports',
    },
    {
      title: 'My Found Reports',
      count: reportStats.foundCount,
      icon: PlusCircle,
      color: 'bg-blue-500',
      link: '/my-reports',
    },
    {
      title: 'Potential Matches',
      count: reportStats.matchesCount,
      icon: Sparkles,
      color: 'bg-indigo-500',
      link: '/my-reports',
    },
    {
      title: 'Pending Requests',
      count: reportStats.pendingRequestsCount,
      icon: Inbox,
      color: 'bg-rose-500',
      link: '/recovery-requests',
    },
    {
      title: 'Recoveries In Progress',
      count: reportStats.acceptedRequestsCount,
      icon: FileCheck,
      color: 'bg-emerald-500',
      link: '/recovery-requests',
    },
    {
      title: 'Unread Notifications',
      count: unreadCount,
      icon: Bell,
      color: 'bg-purple-500',
      link: '/notifications',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl z-10">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />
            <span>Account Active & Authenticated</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome, {user?.name || 'User'} 👋
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Manage your recovery reports, view potential smart matches, and report lost or found items.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 shrink-0">
          <Link
            to="/my-reports"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white text-blue-700 hover:bg-blue-50 transition-all flex items-center space-x-1.5 shadow-md"
          >
            <ListFilter className="w-4 h-4 text-blue-600" />
            <span>View My Reports</span>
          </Link>
          <Link
            to="/profile"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20 hover:bg-white/30 transition-all flex items-center space-x-1.5"
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </Link>
        </div>
      </div>

      {/* Dashboard Metrics Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Activity Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Link
                key={idx}
                to={stat.link}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-blue-600 transition-colors">
                    {stat.title}
                  </span>
                  <div className={`w-10 h-10 rounded-xl ${stat.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-slate-900">{loading ? '...' : stat.count}</span>
                  <span className="text-xs font-medium text-slate-400">items</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Action Reporting Buttons */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2 md:col-span-1">
          <h2 className="text-xl font-extrabold">Take Action</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Report a lost belonging or help someone recover their item by submitting a found report.
          </p>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/lost-items/report"
            className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Report Lost Item</h3>
                <p className="text-xs text-slate-400">Submit a missing report</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/found-items/report"
            className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Report Found Item</h3>
                <p className="text-xs text-slate-400">Submit a found item</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Recent Submitted Reports & Matches Quick Access */}
      {recentReports.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Reports & Potential Matches</h2>
            <Link to="/my-reports" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1">
              <span>View All Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentReports.map((item) => {
              const itemId = item._id || item.id;
              return (
                <div
                  key={itemId}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3">
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                      <div className="pt-2 space-y-1 text-xs text-slate-500 font-medium">
                        <div className="flex items-center space-x-1.5 truncate">
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

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center space-x-2">
                    <Link
                      to={`/matches/${itemId}`}
                      className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Find Matches</span>
                    </Link>
                    <Link
                      to={`/item/${itemId}`}
                      className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-1 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
