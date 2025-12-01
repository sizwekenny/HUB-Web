import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

interface Notification {
  notification_id: number;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  is_read: boolean | number;
  created_at: string;
  read_at?: string | null;
}

const NotificationsPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async (): Promise<void> => {
    setLoading(true);
    try {
      const notificationsRes = await axios.get<Notification[]>(`${API_URL}/notifications`);
      const unreadRes = await axios.get<{ count: number }>(`${API_URL}/notifications/unread-count`);
      
      setNotifications(notificationsRes.data || []);
      setUnreadCount(unreadRes.data?.count || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number): Promise<void> => {
    try {
      await axios.patch(`${API_URL}/notifications/${notificationId}/read`);
      setNotifications(prev => prev.map(notif => 
        notif.notification_id === notificationId 
          ? { ...notif, is_read: 1, read_at: new Date().toISOString() }
          : notif
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async (): Promise<void> => {
    try {
      await axios.post(`${API_URL}/notifications/mark-all-read`);
      setNotifications(prev => prev.map(notif => ({
        ...notif,
        is_read: 1,
        read_at: new Date().toISOString()
      })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatTime = (timestamp: string): string => {
    try {
      const now = new Date();
      const time = new Date(timestamp);
      const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch {
      return 'Recently';
    }
  };

  const unreadNotifications = notifications.filter(n => !n.is_read);
  const readNotifications = notifications.filter(n => n.is_read);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-700">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No notifications</p>
              </div>
            ) : (
              <>
                {unreadNotifications.map(notification => (
                  <div key={notification.notification_id} className="p-4 border-b border-gray-100 bg-blue-50">
                    <div className="flex gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">{formatTime(notification.created_at)}</span>
                          <button
                            onClick={() => markAsRead(notification.notification_id)}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            Mark read
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {readNotifications.map(notification => (
                  <div key={notification.notification_id} className="p-4 border-b border-gray-100">
                    <div className="flex gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">{notification.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                        <span className="text-xs text-gray-400 mt-2 block">{formatTime(notification.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;