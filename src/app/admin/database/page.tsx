"use client";

import { useState, useEffect } from 'react';
import { 
  FiDatabase, FiRefreshCw, FiAlertCircle, FiCheckCircle, 
  FiHardDrive, FiCpu, FiDownload, FiUpload
} from 'react-icons/fi';

interface DatabaseStats {
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  version: string;
  collections: number;
  totalDocuments: number;
  avgResponseTime: number;
  storageSize: string;
  maxConnections: number;
  activeConnections: number;
  usagePercentage: number;
  lastBackup: string;
  recentOperations: {
    reads: number;
    writes: number;
    queries: number;
  };
}

interface CollectionInfo {
  name: string;
  documentCount: number;
  avgDocumentSize: string;
  totalSize: string;
  indexes: number;
  lastModified: string;
}

export default function DatabasePage() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchDatabaseInfo();
  }, []);
  
  const fetchDatabaseInfo = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock database stats
      const mockStats: DatabaseStats = {
        status: 'healthy',
        uptime: '15 days, 7 hours',
        version: 'MongoDB 5.0.6',
        collections: 12,
        totalDocuments: 24563,
        avgResponseTime: 45, // ms
        storageSize: '1.2 GB',
        maxConnections: 100,
        activeConnections: 23,
        usagePercentage: 23, // %
        lastBackup: '2023-05-15 04:30 AM',
        recentOperations: {
          reads: 15243,
          writes: 5421,
          queries: 8752
        }
      };
      
      // Mock collections info
      const mockCollections: CollectionInfo[] = [
        {
          name: 'users',
          documentCount: 5423,
          avgDocumentSize: '2.4 KB',
          totalSize: '12.8 MB',
          indexes: 3,
          lastModified: '2023-05-15 10:45 AM'
        },
        {
          name: 'posts',
          documentCount: 12458,
          avgDocumentSize: '8.6 KB',
          totalSize: '104.5 MB',
          indexes: 4,
          lastModified: '2023-05-15 11:23 AM'
        },
        {
          name: 'comments',
          documentCount: 28764,
          avgDocumentSize: '1.2 KB',
          totalSize: '32.6 MB',
          indexes: 2,
          lastModified: '2023-05-15 11:30 AM'
        },
        {
          name: 'categories',
          documentCount: 42,
          avgDocumentSize: '0.8 KB',
          totalSize: '0.03 MB',
          indexes: 1,
          lastModified: '2023-05-10 09:15 AM'
        },
        {
          name: 'media',
          documentCount: 4325,
          avgDocumentSize: '245 KB',
          totalSize: '1.02 GB',
          indexes: 2,
          lastModified: '2023-05-15 09:45 AM'
        },
        {
          name: 'logs',
          documentCount: 156432,
          avgDocumentSize: '0.5 KB',
          totalSize: '76.3 MB',
          indexes: 2,
          lastModified: '2023-05-15 11:59 AM'
        }
      ];
      
      setStats(mockStats);
      setCollections(mockCollections);
    } catch (error) {
      console.error('Error fetching database info:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDatabaseInfo();
    setRefreshing(false);
  };
  
  const getStatusColor = (status: DatabaseStats['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiRefreshCw className="w-8 h-8 mr-2 text-primary animate-spin" />
        <span className="text-lg">Loading database information...</span>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Database Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage your database performance, collections, and statistics.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            disabled={refreshing}
          >
            <FiRefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>
      
      {/* Database Status Overview */}
      {stats && (
        <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-3">
          {/* Status Card */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stats.status === 'healthy' ? 'bg-green-100' : stats.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                {stats.status === 'healthy' ? (
                  <FiCheckCircle className="w-6 h-6 text-green-600" />
                ) : stats.status === 'warning' ? (
                  <FiAlertCircle className="w-6 h-6 text-yellow-600" />
                ) : (
                  <FiAlertCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Database Status</h3>
                <p className={`text-2xl font-bold ${getStatusColor(stats.status)}`}>
                  {stats.status.charAt(0).toUpperCase() + stats.status.slice(1)}
                </p>
                <p className="text-sm text-gray-500">Version: {stats.version}</p>
                <p className="text-sm text-gray-500">Uptime: {stats.uptime}</p>
              </div>
            </div>
          </div>
          
          {/* Storage Card */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <FiHardDrive className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Storage</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.storageSize}</p>
                <p className="text-sm text-gray-500">{stats.collections} Collections</p>
                <p className="text-sm text-gray-500">{stats.totalDocuments.toLocaleString()} Documents</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Storage Usage</span>
                <span className="text-sm font-medium text-gray-700">{stats.usagePercentage}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  className={`h-2 rounded-full ${
                    stats.usagePercentage < 70 
                      ? 'bg-green-500' 
                      : stats.usagePercentage < 90 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${stats.usagePercentage}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Performance Card */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <FiCpu className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.avgResponseTime} ms</p>
                <p className="text-sm text-gray-500">Average Response Time</p>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">{stats.activeConnections}</span>
                    <span> / </span>
                    <span>{stats.maxConnections} connections</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="p-2 text-center bg-gray-50 rounded">
                <div className="flex items-center justify-center">
                  <FiDownload className="w-4 h-4 mr-1 text-green-500" />
                  <span className="text-xs font-medium">Reads</span>
                </div>
                <p className="mt-1 text-sm font-semibold">{stats.recentOperations.reads.toLocaleString()}</p>
              </div>
              <div className="p-2 text-center bg-gray-50 rounded">
                <div className="flex items-center justify-center">
                  <FiUpload className="w-4 h-4 mr-1 text-blue-500" />
                  <span className="text-xs font-medium">Writes</span>
                </div>
                <p className="mt-1 text-sm font-semibold">{stats.recentOperations.writes.toLocaleString()}</p>
              </div>
              <div className="p-2 text-center bg-gray-50 rounded">
                <div className="flex items-center justify-center">
                  <FiDatabase className="w-4 h-4 mr-1 text-purple-500" />
                  <span className="text-xs font-medium">Queries</span>
                </div>
                <p className="mt-1 text-sm font-semibold">{stats.recentOperations.queries.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Database Backup Info */}
      {stats && (
        <div className="p-4 mt-6 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiDatabase className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Backup Information</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Last backup taken on: <span className="font-medium">{stats.lastBackup}</span></p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Backup Now
                  </button>
                  <button
                    type="button"
                    className="ml-3 px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Configure Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Collections Table */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Database Collections</h2>
        <div className="overflow-hidden border border-gray-200 shadow sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Collection Name
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Documents
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Avg. Size
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Total Size
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Indexes
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Last Modified
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {collections.map((collection) => (
                <tr key={collection.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiDatabase className="flex-shrink-0 w-4 h-4 mr-2 text-gray-400" />
                      <div className="text-sm font-medium text-gray-900">{collection.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{collection.documentCount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{collection.avgDocumentSize}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{collection.totalSize}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{collection.indexes}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{collection.lastModified}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Database Actions */}
      <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Database Optimization</h3>
          <p className="mt-1 text-sm text-gray-500">Run operations to improve database performance.</p>
          <div className="flex mt-4 space-x-2">
            <button className="px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Optimize Indexes
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Compact Collections
            </button>
          </div>
        </div>
        
        <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Data Operations</h3>
          <p className="mt-1 text-sm text-gray-500">Manage import and export operations.</p>
          <div className="flex mt-4 space-x-2">
            <button className="px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Export Data
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Import Data
            </button>
          </div>
        </div>
        
        <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Advanced Tools</h3>
          <p className="mt-1 text-sm text-gray-500">Access database administration tools.</p>
          <div className="flex flex-col mt-4 space-y-2">
            <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Run Query
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Database Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 