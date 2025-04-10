"use client";

import { useState, useEffect } from 'react';
import { 
  FiTrendingUp, FiUsers, FiShoppingCart, FiDollarSign, 
  FiPieChart, FiCalendar, FiMap, FiRefreshCw, FiDownload
} from 'react-icons/fi';

// Mock data interfaces
interface OverviewStats {
  totalVisits: number;
  bounceRate: number;
  averageSessionTime: string;
  conversionRate: number;
}

interface VisitData {
  date: string;
  visits: number;
  uniqueVisitors: number;
}

interface DeviceData {
  device: string;
  percentage: number;
  color: string;
}

interface PageViewData {
  page: string;
  views: number;
  uniqueViews: number;
  avgTimeOnPage: string;
}

interface LocationData {
  country: string;
  visits: number;
  percentage: number;
}

export default function AnalyticsPage() {
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(null);
  const [visitData, setVisitData] = useState<VisitData[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [pageViewData, setPageViewData] = useState<PageViewData[]>([]);
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('last7days');
  
  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);
  
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock overview stats
      const mockOverviewStats: OverviewStats = {
        totalVisits: 28547,
        bounceRate: 42.3,
        averageSessionTime: '3m 24s',
        conversionRate: 3.8
      };
      
      // Mock visit data for chart
      const mockVisitData: VisitData[] = [
        { date: 'May 10', visits: 1200, uniqueVisitors: 954 },
        { date: 'May 11', visits: 1350, uniqueVisitors: 1042 },
        { date: 'May 12', visits: 1500, uniqueVisitors: 1154 },
        { date: 'May 13', visits: 1400, uniqueVisitors: 1078 },
        { date: 'May 14', visits: 1650, uniqueVisitors: 1243 },
        { date: 'May 15', visits: 1750, uniqueVisitors: 1356 },
        { date: 'May 16', visits: 1850, uniqueVisitors: 1425 },
      ];
      
      // Mock device data
      const mockDeviceData: DeviceData[] = [
        { device: 'Mobile', percentage: 58, color: 'bg-blue-500' },
        { device: 'Desktop', percentage: 32, color: 'bg-green-500' },
        { device: 'Tablet', percentage: 10, color: 'bg-purple-500' },
      ];
      
      // Mock page view data
      const mockPageViewData: PageViewData[] = [
        { page: '/', views: 12500, uniqueViews: 9800, avgTimeOnPage: '2m 30s' },
        { page: '/products', views: 8200, uniqueViews: 6100, avgTimeOnPage: '3m 15s' },
        { page: '/blog', views: 5400, uniqueViews: 4300, avgTimeOnPage: '4m 05s' },
        { page: '/about', views: 3200, uniqueViews: 2800, avgTimeOnPage: '1m 45s' },
        { page: '/contact', views: 2100, uniqueViews: 1900, avgTimeOnPage: '1m 20s' },
      ];
      
      // Mock location data
      const mockLocationData: LocationData[] = [
        { country: 'United States', visits: 12400, percentage: 43.5 },
        { country: 'United Kingdom', visits: 3800, percentage: 13.3 },
        { country: 'Canada', visits: 2900, percentage: 10.2 },
        { country: 'Germany', visits: 2100, percentage: 7.4 },
        { country: 'Australia', visits: 1750, percentage: 6.1 },
        { country: 'Other', visits: 5597, percentage: 19.5 }
      ];
      
      setOverviewStats(mockOverviewStats);
      setVisitData(mockVisitData);
      setDeviceData(mockDeviceData);
      setPageViewData(mockPageViewData);
      setLocationData(mockLocationData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Simple bar chart component
  const BarChart = ({ data }: { data: VisitData[] }) => {
    const maxValue = Math.max(...data.map(item => item.visits));
    
    return (
      <div className="pt-6">
        <div className="flex justify-between mb-2">
          <div className="text-xs font-medium text-gray-500">
            <span className="inline-block w-3 h-3 mr-1 bg-blue-500 rounded-sm"></span>
            Total Visits
          </div>
          <div className="text-xs font-medium text-gray-500">
            <span className="inline-block w-3 h-3 mr-1 bg-blue-300 rounded-sm"></span>
            Unique Visitors
          </div>
        </div>
        <div className="flex items-end justify-between h-48 mt-3">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center group">
              <div className="relative flex flex-col items-center w-12">
                <div
                  className="w-6 bg-blue-300 rounded-t"
                  style={{ height: `${(item.uniqueVisitors / maxValue) * 100}%` }}
                ></div>
                <div
                  className="absolute bottom-0 w-10 bg-blue-500 rounded-t"
                  style={{ height: `${(item.visits / maxValue) * 100}%`, zIndex: -1 }}
                ></div>
              </div>
              <span className="mt-2 text-xs font-medium text-gray-500">{item.date}</span>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                Visits: {item.visits.toLocaleString()}<br />
                Unique: {item.uniqueVisitors.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Device distribution chart (simple pie chart visualization)
  const DeviceChart = ({ data }: { data: DeviceData[] }) => {
    return (
      <div className="flex items-center justify-between mt-4">
        {/* Pie chart representation */}
        <div className="relative w-32 h-32">
          {data.map((item, index) => {
            // Calculate the segment positions (simplified)
            const offset = data
              .slice(0, index)
              .reduce((acc, curr) => acc + curr.percentage, 0);
            const style = {
              '--start': `${offset}%`,
              '--end': `${offset + item.percentage}%`,
              '--color': item.color.replace('bg-', '')
            } as React.CSSProperties;
            
            return (
              <div
                key={index}
                className={`absolute inset-0 ${item.color}`}
                style={{
                  clipPath: `conic-gradient(from 0deg, transparent 0 var(--start), currentColor var(--start) var(--end), transparent var(--end) 100%)`
                }}
              ></div>
            );
          })}
          <div className="absolute inset-4 bg-white rounded-full"></div>
        </div>
        
        {/* Legend */}
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-4 h-4 rounded-sm ${item.color} mr-2`}></div>
              <div>
                <span className="text-sm font-medium text-gray-900">{item.device}</span>
                <span className="ml-2 text-sm text-gray-500">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiRefreshCw className="w-8 h-8 mr-2 text-primary animate-spin" />
        <span className="text-lg">Loading analytics data...</span>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            View your site analytics and performance metrics.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="mr-2 block rounded-md border-gray-300 py-1.5 text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last7days">Last 7 days</option>
            <option value="last30days">Last 30 days</option>
            <option value="thisMonth">This month</option>
            <option value="lastMonth">Last month</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
            <FiDownload className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>
      
      {/* Stats Overview */}
      {overviewStats && (
        <div className="grid grid-cols-1 gap-5 mt-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-md">
                <FiTrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Total Visits</p>
                <p className="text-xl font-semibold text-gray-900">{overviewStats.totalVisits.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-md">
                <FiUsers className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Bounce Rate</p>
                <p className="text-xl font-semibold text-gray-900">{overviewStats.bounceRate}%</p>
              </div>
            </div>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-md">
                <FiCalendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Avg. Session Time</p>
                <p className="text-xl font-semibold text-gray-900">{overviewStats.averageSessionTime}</p>
              </div>
            </div>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-md">
                <FiShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                <p className="text-xl font-semibold text-gray-900">{overviewStats.conversionRate}%</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Charts section */}
      <div className="grid grid-cols-1 gap-5 mt-5 lg:grid-cols-3">
        {/* Traffic Overview */}
        <div className="col-span-2 p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Traffic Overview</h3>
          </div>
          <BarChart data={visitData} />
        </div>
        
        {/* Device Distribution */}
        <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Device Distribution</h3>
          <DeviceChart data={deviceData} />
        </div>
      </div>
      
      {/* Top Pages Table */}
      <div className="mt-5">
        <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Top Pages</h3>
          <div className="mt-4 overflow-hidden border border-gray-200 shadow-sm sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Page
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Views
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Unique Views
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Avg. Time on Page
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pageViewData.map((page, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{page.page}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{page.views.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{page.uniqueViews.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{page.avgTimeOnPage}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Visitor Locations */}
      <div className="mt-5">
        <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Visitor Locations</h3>
          <div className="mt-4 overflow-hidden border border-gray-200 shadow-sm sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Country
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Visits
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {locationData.map((location, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiMap className="flex-shrink-0 w-4 h-4 mr-2 text-gray-400" />
                        <div className="text-sm font-medium text-gray-900">{location.country}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{location.visits.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full h-2 mr-2 bg-gray-200 rounded-full" style={{ maxWidth: '100px' }}>
                          <div 
                            className="h-2 bg-primary rounded-full" 
                            style={{ width: `${location.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{location.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 