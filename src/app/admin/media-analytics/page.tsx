"use client";

import { useState, useEffect } from 'react';
import { FiBarChart2, FiPieChart, FiDownload, FiRefreshCw } from 'react-icons/fi';

// Define the analytics data structure
interface MediaAnalytics {
  highResViews: number;
  totalViews: number;
  uploadQualityChoices: {
    standard: number;
    high: number;
  };
  qualityMetrics?: {
    averageSSIM: {
      thumbnail: number;
      medium: number;
      large: number;
      original: number;
    };
    belowThresholdCount: number;
    totalProcessed: number;
  };
}

// Simple chart component for quality choices
function QualityChoicesPieChart({ data }: { data: MediaAnalytics }) {
  const total = data.uploadQualityChoices.standard + data.uploadQualityChoices.high;
  
  if (total === 0) return <div className="text-center p-4">No data available</div>;
  
  const standardPercent = Math.round((data.uploadQualityChoices.standard / total) * 100);
  const highPercent = Math.round((data.uploadQualityChoices.high / total) * 100);
  
  return (
    <div className="py-4">
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          {/* SVG Pie Chart */}
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {/* High quality segment */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#4F46E5"
              strokeWidth="10"
              strokeDasharray={`${highPercent * 2.83} ${(100 - highPercent) * 2.83}`}
            />
            {/* Standard quality segment */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#10B981"
              strokeWidth="10"
              strokeDasharray={`${standardPercent * 2.83} ${(100 - standardPercent) * 2.83}`}
              strokeDashoffset={`${-highPercent * 2.83}`}
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-gray-700">{total}</span>
            <span className="text-xs text-gray-500">Total Choices</span>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#10B981] rounded-full mr-2"></div>
          <span className="text-sm text-gray-700">Standard ({standardPercent}%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#4F46E5] rounded-full mr-2"></div>
          <span className="text-sm text-gray-700">High Quality ({highPercent}%)</span>
        </div>
      </div>
    </div>
  );
}

// After the existing QualityChoicesPieChart component, add:
function QualityMetricsChart({ data }: { data: MediaAnalytics }) {
  // Only render if quality metrics exist
  if (!data.qualityMetrics) {
    return (
      <div className="text-sm text-gray-500 h-40 flex items-center justify-center">
        No quality metrics data available yet
      </div>
    );
  }
  
  const metrics = data.qualityMetrics;
  
  // Calculate the percentage of images below threshold
  const belowThresholdPercentage = metrics.totalProcessed > 0
    ? Math.round((metrics.belowThresholdCount / metrics.totalProcessed) * 100)
    : 0;
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm mb-2">
        <span>Variant</span>
        <span>Avg. SSIM Score</span>
      </div>
      
      {/* Thumbnail quality */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Thumbnail</span>
          <span className="font-medium">{metrics.averageSSIM.thumbnail.toFixed(3)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full" 
            style={{ width: `${Math.min(metrics.averageSSIM.thumbnail * 100, 100)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Medium quality */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Medium</span>
          <span className="font-medium">{metrics.averageSSIM.medium.toFixed(3)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full" 
            style={{ width: `${Math.min(metrics.averageSSIM.medium * 100, 100)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Large quality */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Large</span>
          <span className="font-medium">{metrics.averageSSIM.large.toFixed(3)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full" 
            style={{ width: `${Math.min(metrics.averageSSIM.large * 100, 100)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Original quality */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Original</span>
          <span className="font-medium">{metrics.averageSSIM.original.toFixed(3)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full" 
            style={{ width: `${Math.min(metrics.averageSSIM.original * 100, 100)}%` }}
          ></div>
        </div>
      </div>
      
      <div className="pt-2 text-xs text-gray-600">
        <div className="flex justify-between">
          <span>Total images analyzed:</span>
          <span className="font-medium">{metrics.totalProcessed}</span>
        </div>
        <div className="flex justify-between">
          <span>Images below threshold:</span>
          <span className={`font-medium ${belowThresholdPercentage > 5 ? 'text-red-600' : 'text-green-600'}`}>
            {metrics.belowThresholdCount} ({belowThresholdPercentage}%)
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MediaAnalyticsPage() {
  const [analytics, setAnalytics] = useState<MediaAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load analytics data from localStorage
  const loadAnalytics = () => {
    setIsLoading(true);
    
    try {
      // Simulate network delay for more realistic loading experience
      setTimeout(() => {
        const analyticsData = localStorage.getItem('mediaAnalytics');
        
        if (analyticsData) {
          const parsedData = JSON.parse(analyticsData);
          setAnalytics(parsedData);
        } else {
          // Default empty analytics
          setAnalytics({
            highResViews: 0,
            totalViews: 0,
            uploadQualityChoices: {
              standard: 0,
              high: 0
            }
          });
        }
        
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      setIsLoading(false);
    }
  };
  
  // Export analytics data as JSON
  const exportAnalytics = () => {
    if (!analytics) return;
    
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportName = `media-analytics-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
  };
  
  // Reset analytics data
  const resetAnalytics = () => {
    if (confirm('Are you sure you want to reset all analytics data? This cannot be undone.')) {
      localStorage.removeItem('mediaAnalytics');
      loadAnalytics();
    }
  };
  
  // Load analytics on component mount
  useEffect(() => {
    loadAnalytics();
  }, []);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <FiRefreshCw className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-500">Loading analytics data...</p>
        </div>
      </div>
    );
  }
  
  // Calculate high-res view rate
  const highResViewRate = analytics && analytics.totalViews > 0
    ? Math.round((analytics.highResViews / analytics.totalViews) * 100)
    : 0;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Media Quality Analytics</h1>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadAnalytics}
            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          
          <button
            onClick={exportAnalytics}
            className="inline-flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700"
          >
            <FiDownload className="w-4 h-4 mr-2" />
            Export
          </button>
          
          <button
            onClick={resetAnalytics}
            className="inline-flex items-center px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-700"
          >
            Reset
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-3">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
              <FiBarChart2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-medium">Media Views</h2>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-3xl font-semibold text-gray-800">{analytics?.totalViews || 0}</p>
              <p className="text-sm text-gray-500">Total views</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-semibold text-blue-600">{analytics?.highResViews || 0}</p>
              <p className="text-sm text-gray-500">High-res views</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${highResViewRate}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {highResViewRate}% of users view images in high resolution
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
              <FiPieChart className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-medium">Upload Quality Choices</h2>
          </div>
          {analytics && (
            <QualityChoicesPieChart data={analytics} />
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full bg-teal-100 text-teal-600 mr-3">
              <FiBarChart2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-medium">Image Quality Metrics</h2>
          </div>
          {analytics && (
            <QualityMetricsChart data={analytics} />
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
              <FiBarChart2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-medium">Quality Insights</h2>
          </div>
          
          <div className="space-y-4">
            {analytics && analytics.uploadQualityChoices.high > analytics.uploadQualityChoices.standard && (
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm">
                <strong>Insight:</strong> Users prefer high quality uploads. Consider making high quality the default.
              </div>
            )}
            
            {analytics && highResViewRate > 30 && (
              <div className="p-3 bg-blue-50 border-l-4 border-blue-400 text-sm">
                <strong>Insight:</strong> High usage of high-resolution viewing ({highResViewRate}%). Consider increasing medium image quality.
              </div>
            )}
            
            {analytics && highResViewRate < 10 && analytics.totalViews > 50 && (
              <div className="p-3 bg-green-50 border-l-4 border-green-400 text-sm">
                <strong>Insight:</strong> Low high-resolution usage. Current image quality seems sufficient for most users.
              </div>
            )}
            
            {(!analytics || 
              (analytics.uploadQualityChoices.high === 0 && 
               analytics.uploadQualityChoices.standard === 0 && 
               analytics.totalViews === 0)) && (
              <div className="p-3 bg-gray-50 border-l-4 border-gray-400 text-sm">
                <strong>Note:</strong> Not enough data collected yet. Check back after more user activity.
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Raw Analytics Data</h2>
        <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
          {JSON.stringify(analytics, null, 2)}
        </pre>
      </div>
      
      <div className="text-sm text-gray-500">
        <p>Note: This analytics dashboard uses local browser storage for demonstration purposes.</p>
        <p>In production, you would implement server-side analytics collection and storage.</p>
      </div>
    </div>
  );
} 