import { useState, useEffect } from 'react';
import { 
  FiBell, FiX, FiAlertCircle, FiCheckCircle, 
  FiInfo, FiUser, FiFileText, FiServer, FiClock
} from 'react-icons/fi';

type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

export default function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Fetch notifications when panel is opened
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);
  
  const fetchNotifications = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock notifications data
      const mockNotifications: Notification[] = [
        {
          id: 'notif-001',
          type: 'warning',
          title: 'Database storage reaching capacity',
          message: 'Your database storage is at 85% capacity. Consider optimizing or upgrading soon.',
          time: '2023-05-15T10:30:00Z',
          read: false
        },
        {
          id: 'notif-002',
          type: 'success',
          title: 'Backup completed successfully',
          message: 'The scheduled system backup was completed successfully.',
          time: '2023-05-15T08:15:00Z',
          read: true
        },
        {
          id: 'notif-003',
          type: 'info',
          title: 'New user registration',
          message: 'A new user (john.doe@example.com) has registered on your platform.',
          time: '2023-05-15T07:45:00Z',
          read: false,
          actionUrl: '/admin/users'
        },
        {
          id: 'notif-004',
          type: 'error',
          title: 'Payment gateway error',
          message: 'The payment gateway is experiencing connectivity issues. Transactions may be affected.',
          time: '2023-05-14T23:10:00Z',
          read: true
        },
        {
          id: 'notif-005',
          type: 'info',
          title: 'Content published',
          message: 'The article "Getting Started with Our Platform" has been published.',
          time: '2023-05-14T16:30:00Z',
          read: true,
          actionUrl: '/admin/content'
        },
        {
          id: 'notif-006',
          type: 'system',
          title: 'System update available',
          message: 'A new system update (v2.5.0) is available. Please review release notes before updating.',
          time: '2023-05-14T12:00:00Z',
          read: false
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };
  
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    
    // If today, show time only
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show full date
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return <FiInfo className="w-5 h-5 text-blue-500" />;
      case 'success':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <FiAlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <FiAlertCircle className="w-5 h-5 text-red-500" />;
      case 'system':
        return <FiServer className="w-5 h-5 text-purple-500" />;
      default:
        return <FiInfo className="w-5 h-5 text-gray-500" />;
    }
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="relative inline-block text-left">
      {/* Notification Bell */}
      <button
        type="button"
        className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <FiBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      
      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 z-10 w-80 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900">Notifications</h3>
                <button 
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-primary hover:text-primary-dark"
                >
                  Mark all as read
                </button>
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <FiClock className="w-5 h-5 mr-2 text-gray-400 animate-spin" />
                  <span className="text-sm text-gray-500">Loading notifications...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <FiBell className="w-6 h-6 mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">No notifications to display</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`px-4 py-3 hover:bg-gray-50 ${notification.read ? '' : 'bg-blue-50'}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="ml-3 w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="ml-2 text-xs text-gray-500">
                              {formatTime(notification.time)}
                            </p>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            {notification.message}
                          </p>
                          {notification.actionUrl && (
                            <a 
                              href={notification.actionUrl}
                              className="block mt-1 text-xs font-medium text-primary hover:text-primary-dark"
                            >
                              View details
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="px-4 py-2 mt-1 border-t border-gray-200">
              <a href="/admin/notifications" className="block text-sm font-medium text-center text-primary hover:text-primary-dark">
                View all notifications
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 