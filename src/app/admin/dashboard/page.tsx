"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiUsers, FiFileText, FiActivity, FiServer, 
  FiAlertCircle, FiCheckCircle, FiTrendingUp, FiRefreshCw, 
  FiShoppingCart, FiCpu, FiCalendar, FiEye, FiMessageSquare, FiPlus
} from 'react-icons/fi';
import { isAdminLoggedIn } from '@/app/actions';

interface DashboardStats {
  users: {
    total: number;
    activeToday: number;
    newThisWeek: number;
    percentChange: number;
  };
  content: {
    total: number;
    published: number;
    draft: number;
    scheduled: number;
  };
  issues: {
    total: number;
    open: number;
    resolved: number;
    critical: number;
  };
  system: {
    status: 'operational' | 'degraded' | 'maintenance' | 'outage';
    uptime: string;
    responseTime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
  activity: {
    date: string;
    users: number;
    pageViews: number;
    conversions: number;
  }[];
  recentIssues: {
    id: string;
    title: string;
    status: string;
    priority: string;
    createdAt: string;
  }[];
  recentContent: {
    id: string;
    title: string;
    type: string;
    status: string;
    views: number;
    author: string;
  }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const router = useRouter();
  
  useEffect(() => {
    // Check if admin is logged in
    const checkAuth = async () => {
      const loggedIn = await isAdminLoggedIn();
      if (!loggedIn) {
        router.push('/admin/login');
      }
    };
    
    checkAuth();
    fetchDashboardData();
  }, [timeRange, router]);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock dashboard data
      const mockData: DashboardStats = {
        users: {
          total: 12453,
          activeToday: 843,
          newThisWeek: 267,
          percentChange: 12.6
        },
        content: {
          total: 543,
          published: 425,
          draft: 78,
          scheduled: 40
        },
        issues: {
          total: 128,
          open: 47,
          resolved: 75,
          critical: 6
        },
        system: {
          status: 'operational',
          uptime: '99.98%',
          responseTime: 235,
          memoryUsage: 68,
          cpuUsage: 42
        },
        activity: [
          { date: 'Mon', users: 1243, pageViews: 5432, conversions: 43 },
          { date: 'Tue', users: 1423, pageViews: 6321, conversions: 53 },
          { date: 'Wed', users: 1653, pageViews: 7231, conversions: 67 },
          { date: 'Thu', users: 1534, pageViews: 6543, conversions: 61 },
          { date: 'Fri', users: 1873, pageViews: 8432, conversions: 73 },
          { date: 'Sat', users: 1462, pageViews: 6542, conversions: 57 },
          { date: 'Sun', users: 1324, pageViews: 5764, conversions: 49 }
        ],
        recentIssues: [
          {
            id: 'ISSUE-001',
            title: 'Login page crashes on mobile devices',
            status: 'open',
            priority: 'high',
            createdAt: '2023-05-10T08:30:00Z'
          },
          {
            id: 'ISSUE-003',
            title: 'Payment processing fails with specific credit cards',
            status: 'open',
            priority: 'critical',
            createdAt: '2023-05-14T16:20:00Z'
          },
          {
            id: 'ISSUE-005',
            title: 'Search functionality is slow on large datasets',
            status: 'in_progress',
            priority: 'high',
            createdAt: '2023-05-09T14:10:00Z'
          },
          {
            id: 'ISSUE-007',
            title: 'Dashboard analytics not updating in real-time',
            status: 'open',
            priority: 'medium',
            createdAt: '2023-05-13T16:50:00Z'
          },
        ],
        recentContent: [
          {
            id: 'post-001',
            title: 'Getting Started with Our Platform',
            type: 'post',
            status: 'published',
            views: 1245,
            author: 'John Doe'
          },
          {
            id: 'article-001',
            title: 'The Future of AI in Everyday Applications',
            type: 'article',
            status: 'published',
            views: 2310,
            author: 'Robert Johnson'
          },
          {
            id: 'announcement-001',
            title: 'New Features Coming Next Month',
            type: 'announcement',
            status: 'published',
            views: 1890,
            author: 'John Doe'
          },
          {
            id: 'post-002',
            title: 'Optimizing Your Workflow',
            type: 'post',
            status: 'draft',
            views: 0,
            author: 'Jane Smith'
          },
        ]
      };
      
      setStats(mockData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-500';
      case 'degraded':
        return 'text-yellow-500';
      case 'maintenance':
        return 'text-blue-500';
      case 'outage':
        return 'text-red-500';
      case 'open':
        return 'text-blue-500';
      case 'in_progress':
        return 'text-yellow-500';
      case 'resolved':
        return 'text-green-500';
      case 'closed':
        return 'text-gray-500';
      case 'published':
        return 'text-green-500';
      case 'draft':
        return 'text-gray-500';
      case 'scheduled':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Simple bar chart for activity
  const ActivityChart = ({ data }: { data: DashboardStats['activity'] }) => {
    const maxPageViews = Math.max(...data.map(item => item.pageViews));
    const maxUsers = Math.max(...data.map(item => item.users));
    const maxConversions = Math.max(...data.map(item => item.conversions)) * 10; // Scale up for visibility
    
    return (
      <div className="grid grid-cols-7 gap-2 h-48 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="relative flex flex-col items-center justify-end h-40 w-full">
              {/* Page Views Bar */}
              <div 
                className="absolute bottom-0 w-full bg-blue-200 rounded-t"
                style={{ height: `${(item.pageViews / maxPageViews) * 100}%`, zIndex: 1 }}
              ></div>
              
              {/* Users Bar */}
              <div 
                className="absolute bottom-0 w-2/3 bg-green-400 rounded-t"
                style={{ height: `${(item.users / maxUsers) * 100}%`, zIndex: 2 }}
              ></div>
              
              {/* Conversions Bar */}
              <div 
                className="absolute bottom-0 w-1/3 bg-purple-500 rounded-t"
                style={{ height: `${(item.conversions / maxConversions) * 100}%`, zIndex: 3 }}
              ></div>
            </div>
            <span className="mt-2 text-xs font-medium text-gray-500">{item.date}</span>
          </div>
        ))}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiRefreshCw className="w-8 h-8 mr-2 text-primary animate-spin" />
        <span className="text-lg">Loading dashboard data...</span>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Overview of your platform's performance and status
          </p>
        </div>
        <div className="flex items-center mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="mr-4 block rounded-md border-gray-300 py-1.5 text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <FiRefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
      
      {stats && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Users Stats */}
            <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-md">
                  <FiUsers className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-xl font-semibold text-gray-900">{stats.users.total.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <FiActivity className="w-4 h-4 mr-1 text-gray-400" />
                    <span className="text-sm text-gray-500">{stats.users.activeToday.toLocaleString()} active today</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <FiTrendingUp className={`w-4 h-4 mr-1 ${stats.users.percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-sm font-medium ${stats.users.percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.users.percentChange}% from last {timeRange}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{stats.users.newThisWeek} new users this week</p>
              </div>
            </div>
            
            {/* Content Stats */}
            <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-md">
                  <FiFileText className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Content Items</p>
                  <p className="text-xl font-semibold text-gray-900">{stats.content.total.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <FiEye className="w-4 h-4 mr-1 text-gray-400" />
                    <span className="text-sm text-gray-500">{stats.content.published.toLocaleString()} published</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="p-2 text-center rounded bg-gray-50">
                  <p className="text-xs font-medium text-gray-500">Draft</p>
                  <p className="text-sm font-semibold text-gray-900">{stats.content.draft}</p>
                </div>
                <div className="p-2 text-center rounded bg-gray-50">
                  <p className="text-xs font-medium text-gray-500">Scheduled</p>
                  <p className="text-sm font-semibold text-gray-900">{stats.content.scheduled}</p>
                </div>
              </div>
            </div>
            
            {/* Issues Stats */}
            <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-md">
                  <FiAlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Issues</p>
                  <p className="text-xl font-semibold text-gray-900">{stats.issues.total.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 mr-1 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-500">{stats.issues.critical} critical</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="p-2 text-center rounded bg-gray-50">
                  <p className="text-xs font-medium text-gray-500">Open</p>
                  <p className="text-sm font-semibold text-gray-900">{stats.issues.open}</p>
                </div>
                <div className="p-2 text-center rounded bg-gray-50">
                  <p className="text-xs font-medium text-gray-500">Resolved</p>
                  <p className="text-sm font-semibold text-gray-900">{stats.issues.resolved}</p>
                </div>
              </div>
            </div>
            
            {/* System Stats */}
            <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-md">
                  <FiServer className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">System Status</p>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 mr-1 ${stats.system.status === 'operational' ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
                    <p className="text-xl font-semibold text-gray-900 capitalize">{stats.system.status}</p>
                  </div>
                  <div className="flex items-center mt-1">
                    <FiActivity className="w-4 h-4 mr-1 text-gray-400" />
                    <span className="text-sm text-gray-500">{stats.system.uptime} uptime</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-500">Memory Usage</span>
                  <span className="text-xs font-medium text-gray-700">{stats.system.memoryUsage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 rounded-full bg-blue-500" 
                    style={{ width: `${stats.system.memoryUsage}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between mt-3 mb-1">
                  <span className="text-xs font-medium text-gray-500">CPU Usage</span>
                  <span className="text-xs font-medium text-gray-700">{stats.system.cpuUsage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 rounded-full bg-purple-500" 
                    style={{ width: `${stats.system.cpuUsage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Activity Chart Section */}
          <div className="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Activity Overview</h3>
              <p className="mt-1 text-sm text-gray-500">
                Website traffic and user engagement metrics
              </p>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-2 bg-green-400 rounded-sm"></div>
                    <span className="text-xs font-medium text-gray-500">Users</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-2 bg-blue-200 rounded-sm"></div>
                    <span className="text-xs font-medium text-gray-500">Page Views</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-2 bg-purple-500 rounded-sm"></div>
                    <span className="text-xs font-medium text-gray-500">Conversions</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Total Views:</span> {stats.activity.reduce((sum, item) => sum + item.pageViews, 0).toLocaleString()}
                </div>
              </div>
              
              <ActivityChart data={stats.activity} />
            </div>
          </div>
          
          {/* Recent Issues and Content */}
          <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-2">
            {/* Recent Issues */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Recent Issues</h3>
                  <a href="/admin/issues" className="text-sm font-medium text-primary hover:text-primary-dark">
                    View all
                  </a>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {stats.recentIssues.map((issue) => (
                  <div key={issue.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start">
                      <FiAlertCircle className={`mt-1 flex-shrink-0 ${getStatusColor(issue.priority)}`} />
                      <div className="ml-3">
                        <a href={`/admin/issues/${issue.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                          {issue.title}
                        </a>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityBadge(issue.priority)}`}>
                            {issue.priority}
                          </span>
                          <span className={`ml-2 text-xs ${getStatusColor(issue.status)}`}>
                            {issue.status.replace('_', ' ')}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {formatDate(issue.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <a
                  href="/admin/issues/create"
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark"
                >
                  <FiPlus className="w-4 h-4 mr-2" />
                  Create new issue
                </a>
              </div>
            </div>
            
            {/* Recent Content */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Recent Content</h3>
                  <a href="/admin/content" className="text-sm font-medium text-primary hover:text-primary-dark">
                    View all
                  </a>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {stats.recentContent.map((content) => (
                  <div key={content.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start">
                      {content.type === 'post' && <FiFileText className="mt-1 flex-shrink-0 text-blue-500" />}
                      {content.type === 'article' && <FiFileText className="mt-1 flex-shrink-0 text-green-500" />}
                      {content.type === 'announcement' && <FiCalendar className="mt-1 flex-shrink-0 text-red-500" />}
                      <div className="ml-3">
                        <a href={`/admin/content/${content.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                          {content.title}
                        </a>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500 capitalize">
                            {content.type}
                          </span>
                          <span className={`ml-2 text-xs ${getStatusColor(content.status)}`}>
                            {content.status}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {content.views.toLocaleString()} views
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      By {content.author}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <a
                  href="/admin/content/create"
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark"
                >
                  <FiPlus className="w-4 h-4 mr-2" />
                  Create new content
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 