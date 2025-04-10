"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  FiUsers, FiSettings, FiBarChart2, FiFile, 
  FiDatabase, FiAlertCircle, FiHelpCircle, FiPlusCircle 
} from 'react-icons/fi';

interface DashboardStat {
  label: string;
  value: number | string;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
}

interface AdminSection {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStat[]>([
    {
      label: 'Total Users',
      value: 0,
      change: {
        value: 0,
        type: 'increase'
      }
    },
    {
      label: 'Active Users',
      value: 0,
      change: {
        value: 0,
        type: 'increase'
      }
    },
    {
      label: 'New Signups',
      value: 0,
      change: {
        value: 0,
        type: 'increase'
      }
    },
    {
      label: 'Waiting List',
      value: 0,
      change: {
        value: 0,
        type: 'increase'
      }
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Mock function to fetch dashboard data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/admin/dashboard');
      // const data = await response.json();
      
      // Simulate API call with mock data for now
      setTimeout(() => {
        setStats([
          {
            label: 'Total Users',
            value: 6,
            change: {
              value: 12,
              type: 'increase'
            }
          },
          {
            label: 'Active Users',
            value: 4,
            change: {
              value: 8,
              type: 'increase'
            }
          },
          {
            label: 'New Signups',
            value: 2,
            change: {
              value: 100,
              type: 'increase'
            }
          },
          {
            label: 'Waiting List',
            value: 28,
            change: {
              value: 24,
              type: 'increase'
            }
          }
        ]);
        setIsLoading(false);
      }, 1000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
      setIsLoading(false);
    }
  };
  
  // Admin sections
  const adminSections: AdminSection[] = [
    {
      title: 'User Management',
      description: 'View, edit, and manage user accounts',
      icon: <FiUsers className="w-6 h-6" />,
      href: '/admin/users',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Settings',
      description: 'Configure system and application settings',
      icon: <FiSettings className="w-6 h-6" />,
      href: '/admin/settings',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Analytics',
      description: 'View site statistics and user engagement',
      icon: <FiBarChart2 className="w-6 h-6" />,
      href: '/admin/analytics',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Content',
      description: 'Manage posts, pages, and other content',
      icon: <FiFile className="w-6 h-6" />,
      href: '/admin/content',
      color: 'bg-yellow-50 text-yellow-600'
    },
    {
      title: 'Database',
      description: 'View and manage database records',
      icon: <FiDatabase className="w-6 h-6" />,
      href: '/admin/database',
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      title: 'Issues',
      description: 'Review reported issues and requests',
      icon: <FiAlertCircle className="w-6 h-6" />,
      href: '/admin/issues',
      color: 'bg-red-50 text-red-600'
    }
  ];
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  return (
    <main className="min-h-screen bg-gray-50 pb-10">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="container-app max-w-7xl py-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your application and users</p>
        </div>
      </header>
      
      <div className="container-app max-w-7xl py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
              
              {isLoading ? (
                <div className="mt-2 h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <>
                  <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
                  
                  {stat.change && (
                    <div className="mt-2 flex items-center">
                      <span 
                        className={`text-sm font-medium ${
                          stat.change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {stat.change.type === 'increase' ? '+' : '-'}{stat.change.value}%
                      </span>
                      <span className="text-xs text-gray-500 ml-1">from last month</span>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        
        {/* Admin Sections */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {adminSections.map((section, index) => (
            <Link
              key={index}
              href={section.href}
              className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className={`${section.color} p-3 inline-flex rounded-lg mb-3`}>
                  {section.icon}
                </div>
                <h3 className="text-lg font-semibold mb-1">{section.title}</h3>
                <p className="text-gray-500">{section.description}</p>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-white rounded-lg shadow-sm p-4 flex items-center hover:shadow-md transition-shadow">
            <div className="p-2 bg-primary rounded-lg mr-3 flex-shrink-0">
              <FiPlusCircle className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Add New User</h3>
              <p className="text-sm text-gray-500">Create a new user account</p>
            </div>
          </button>
          
          <button className="bg-white rounded-lg shadow-sm p-4 flex items-center hover:shadow-md transition-shadow">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3 flex-shrink-0">
              <FiHelpCircle className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Run Maintenance</h3>
              <p className="text-sm text-gray-500">Clean up database</p>
            </div>
          </button>
          
          <button className="bg-white rounded-lg shadow-sm p-4 flex items-center hover:shadow-md transition-shadow">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg mr-3 flex-shrink-0">
              <FiBarChart2 className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Export Reports</h3>
              <p className="text-sm text-gray-500">Download analytics data</p>
            </div>
          </button>
          
          <button className="bg-white rounded-lg shadow-sm p-4 flex items-center hover:shadow-md transition-shadow">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg mr-3 flex-shrink-0">
              <FiSettings className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">System Settings</h3>
              <p className="text-sm text-gray-500">Configure app behavior</p>
            </div>
          </button>
        </div>
      </div>
    </main>
  );
} 