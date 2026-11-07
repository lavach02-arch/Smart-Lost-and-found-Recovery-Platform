import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../services/api';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setUnreadCount(0);
      return;
    }
    try {
      const res = await getUnreadNotificationCount(token);
      if (res.success) {
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.error('[NotificationContext] Failed to fetch unread count', err);
    }
  }, [token, isAuthenticated]);

  const fetchNotifications = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setNotifications([]);
      return;
    }
    setLoading(true);
    try {
      const res = await getNotifications(token);
      if (res.success) {
        setNotifications(res.notifications || []);
      }
      await fetchUnreadCount();
    } catch (err) {
      console.error('[NotificationContext] Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated, fetchUnreadCount]);

  // Initial fetch and periodic polling (every 30 seconds)
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchNotifications();
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, token, fetchNotifications, fetchUnreadCount]);

  const markRead = async (id) => {
    if (!token) return;
    try {
      await markNotificationAsRead(id, token);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('[NotificationContext] markRead error', err);
    }
  };

  const markAllRead = async () => {
    if (!token) return;
    try {
      await markAllNotificationsAsRead(token);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('[NotificationContext] markAllRead error', err);
    }
  };

  const removeNotif = async (id) => {
    if (!token) return;
    try {
      await deleteNotification(id, token);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      fetchUnreadCount();
    } catch (err) {
      console.error('[NotificationContext] removeNotif error', err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        fetchUnreadCount,
        markRead,
        markAllRead,
        removeNotif,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
