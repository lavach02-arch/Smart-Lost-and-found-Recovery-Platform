import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import NotificationItem from '../components/NotificationItem';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Bell, CheckCheck, Sparkles } from 'lucide-react';

export default function Notifications() {
  const { notifications, unreadCount, loading, markRead, markAllRead, removeNotif } = useNotifications();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-teal-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Alerts & Notifications</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Notification Center</h1>
          <p className="text-slate-300 text-sm">
            Stay informed about potential match alerts, recovery requests, and system updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center space-x-1.5 shadow-sm shrink-0"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      {loading ? (
        <LoadingSpinner message="Loading notifications..." />
      ) : notifications.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
            <span>Showing all ({notifications.length})</span>
            {unreadCount > 0 && <span className="text-blue-600 font-bold">{unreadCount} unread</span>}
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <NotificationItem
                key={n._id}
                notification={n}
                onMarkRead={markRead}
                onDelete={removeNotif}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Notifications Yet"
          description="When matches are found or recovery requests are made, your notifications will appear here."
          actionText="Explore Items"
          actionLink="/lost-items"
        />
      )}
    </div>
  );
}
