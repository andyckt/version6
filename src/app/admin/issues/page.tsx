"use client";

import { useState, useEffect } from 'react';
import { 
  FiAlertCircle, FiCheckCircle, FiClock, FiRefreshCw,
  FiFilter, FiChevronDown, FiSearch, FiExternalLink, FiMessageSquare
} from 'react-icons/fi';

type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'pending';
type IssuePriority = 'low' | 'medium' | 'high' | 'critical';
type IssueType = 'bug' | 'feature_request' | 'support' | 'question' | 'other';

interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  type: IssueType;
  reportedBy: {
    id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  comments: number;
}

interface FilterState {
  status: IssueStatus | 'all';
  priority: IssuePriority | 'all';
  type: IssueType | 'all';
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    priority: 'all',
    type: 'all'
  });
  
  useEffect(() => {
    fetchIssues();
  }, []);
  
  const fetchIssues = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock issues data
      const mockIssues: Issue[] = [
        {
          id: 'ISSUE-001',
          title: 'Login page crashes on mobile devices',
          description: 'Users are reporting that the login page crashes when attempting to sign in using iOS devices. The issue appears to be specific to Safari browsers.',
          status: 'open',
          priority: 'high',
          type: 'bug',
          reportedBy: {
            id: 'user-123',
            name: 'John Doe',
            email: 'john.doe@example.com'
          },
          createdAt: '2023-05-10T08:30:00Z',
          updatedAt: '2023-05-10T14:20:00Z',
          comments: 5
        },
        {
          id: 'ISSUE-002',
          title: 'Add dark mode support to the dashboard',
          description: 'Multiple users have requested a dark mode option for the dashboard to reduce eye strain during night time usage.',
          status: 'in_progress',
          priority: 'medium',
          type: 'feature_request',
          reportedBy: {
            id: 'user-456',
            name: 'Jane Smith',
            email: 'jane.smith@example.com'
          },
          assignedTo: {
            id: 'dev-789',
            name: 'Mike Johnson'
          },
          createdAt: '2023-05-08T11:45:00Z',
          updatedAt: '2023-05-12T09:15:00Z',
          comments: 7
        },
        {
          id: 'ISSUE-003',
          title: 'Payment processing fails with specific credit cards',
          description: 'Some users are unable to complete payments when using Mastercard credit cards. The transaction appears to go through but then fails with a generic error message.',
          status: 'open',
          priority: 'critical',
          type: 'bug',
          reportedBy: {
            id: 'user-789',
            name: 'Robert Brown',
            email: 'robert.b@example.com'
          },
          createdAt: '2023-05-14T16:20:00Z',
          updatedAt: '2023-05-14T16:20:00Z',
          comments: 2
        },
        {
          id: 'ISSUE-004',
          title: 'How do I change my profile picture?',
          description: 'I cannot find the option to update my profile picture in the user settings page. Is this feature available?',
          status: 'resolved',
          priority: 'low',
          type: 'question',
          reportedBy: {
            id: 'user-101',
            name: 'Emily Davis',
            email: 'emily.d@example.com'
          },
          assignedTo: {
            id: 'support-202',
            name: 'Sarah Wilson'
          },
          createdAt: '2023-05-11T10:30:00Z',
          updatedAt: '2023-05-11T12:45:00Z',
          comments: 3
        },
        {
          id: 'ISSUE-005',
          title: 'Search functionality is slow on large datasets',
          description: 'When searching through more than 1000 records, the search operation takes more than 10 seconds to return results. This is causing usability issues for our premium users.',
          status: 'in_progress',
          priority: 'high',
          type: 'bug',
          reportedBy: {
            id: 'user-505',
            name: 'Alex Johnson',
            email: 'alex.j@example.com'
          },
          assignedTo: {
            id: 'dev-303',
            name: 'Chris Martin'
          },
          createdAt: '2023-05-09T14:10:00Z',
          updatedAt: '2023-05-13T11:30:00Z',
          comments: 8
        },
        {
          id: 'ISSUE-006',
          title: 'Request for API documentation improvement',
          description: 'The current API documentation lacks examples for some endpoints. It would be helpful to include sample requests and responses for all API endpoints.',
          status: 'pending',
          priority: 'medium',
          type: 'feature_request',
          reportedBy: {
            id: 'user-606',
            name: 'Michael Smith',
            email: 'michael.s@example.com'
          },
          createdAt: '2023-05-12T09:45:00Z',
          updatedAt: '2023-05-14T15:20:00Z',
          comments: 4
        },
        {
          id: 'ISSUE-007',
          title: 'Dashboard analytics not updating in real-time',
          description: 'The analytics widgets on the dashboard are only refreshing data when the page is manually reloaded, not in real-time as expected.',
          status: 'open',
          priority: 'medium',
          type: 'bug',
          reportedBy: {
            id: 'user-707',
            name: 'Jennifer Lee',
            email: 'jennifer.l@example.com'
          },
          createdAt: '2023-05-13T16:50:00Z',
          updatedAt: '2023-05-13T16:50:00Z',
          comments: 0
        },
        {
          id: 'ISSUE-008',
          title: 'Need help with data export feature',
          description: 'I am trying to export my data to CSV format but I am receiving an error. Please provide instructions on how to use this feature correctly.',
          status: 'closed',
          priority: 'low',
          type: 'support',
          reportedBy: {
            id: 'user-808',
            name: 'Thomas Wilson',
            email: 'thomas.w@example.com'
          },
          assignedTo: {
            id: 'support-404',
            name: 'Linda Green'
          },
          createdAt: '2023-05-07T11:20:00Z',
          updatedAt: '2023-05-08T10:15:00Z',
          comments: 5
        }
      ];
      
      setIssues(mockIssues);
      
      // Select the first issue by default if available
      if (mockIssues.length > 0 && !selectedIssue) {
        setSelectedIssue(mockIssues[0]);
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger an API call with the search query
    console.log('Searching for:', searchQuery);
  };
  
  const applyFilters = (issue: Issue): boolean => {
    // Apply status filter
    if (filters.status !== 'all' && issue.status !== filters.status) {
      return false;
    }
    
    // Apply priority filter
    if (filters.priority !== 'all' && issue.priority !== filters.priority) {
      return false;
    }
    
    // Apply type filter
    if (filters.type !== 'all' && issue.type !== filters.type) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        issue.title.toLowerCase().includes(query) ||
        issue.description.toLowerCase().includes(query) ||
        issue.reportedBy.name.toLowerCase().includes(query)
      );
    }
    
    return true;
  };
  
  const filteredIssues = issues.filter(applyFilters);
  
  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityBadge = (priority: IssuePriority) => {
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
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getIssueTypeIcon = (type: IssueType) => {
    switch (type) {
      case 'bug':
        return <FiAlertCircle className="text-red-500" />;
      case 'feature_request':
        return <FiCheckCircle className="text-green-500" />;
      case 'support':
        return <FiMessageSquare className="text-blue-500" />;
      case 'question':
        return <FiMessageSquare className="text-purple-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Issue Tracking</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage and respond to user-reported issues and feature requests
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={fetchIssues}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <FiRefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Issues
            </button>
          </div>
        </div>
        
        <div className="mt-6 md:flex md:items-center md:justify-between">
          {/* Search bar */}
          <div className="flex-1 min-w-0">
            <form onSubmit={handleSearch} className="flex w-full md:max-w-md">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiSearch className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Search issues by title, description, or reporter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Search
              </button>
            </form>
          </div>
          
          {/* Filters */}
          <div className="flex items-center mt-4 space-x-3 md:mt-0">
            <div className="relative inline-block text-left">
              <select
                className="block w-full py-2 pl-3 pr-10 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as IssueStatus | 'all' })}
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            <div className="relative inline-block text-left">
              <select
                className="block w-full py-2 pl-3 pr-10 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value as IssuePriority | 'all' })}
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div className="relative inline-block text-left">
              <select
                className="block w-full py-2 pl-3 pr-10 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value as IssueType | 'all' })}
              >
                <option value="all">All Types</option>
                <option value="bug">Bug</option>
                <option value="feature_request">Feature Request</option>
                <option value="support">Support</option>
                <option value="question">Question</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FiRefreshCw className="w-8 h-8 mr-2 text-primary animate-spin" />
            <span className="text-lg">Loading issues...</span>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Issue list */}
            <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h2 className="text-sm font-medium text-gray-700">
                  Issues ({filteredIssues.length})
                </h2>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                <ul className="divide-y divide-gray-200">
                  {filteredIssues.length === 0 ? (
                    <li className="p-6 text-center text-gray-500">
                      No issues match your filters.
                    </li>
                  ) : (
                    filteredIssues.map((issue) => (
                      <li
                        key={issue.id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                          selectedIssue?.id === issue.id ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => setSelectedIssue(issue)}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            {getIssueTypeIcon(issue.type)}
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {issue.title}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 truncate">
                              {issue.id} • Reported by {issue.reportedBy.name}
                            </p>
                            <div className="mt-2 flex items-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(issue.status)}`}>
                                {issue.status.replace('_', ' ')}
                              </span>
                              <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(issue.priority)}`}>
                                {issue.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
            
            {/* Issue details */}
            <div className="lg:col-span-2">
              {selectedIssue ? (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedIssue.title}
                      </h2>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500">
                          {selectedIssue.id}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center flex-wrap gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedIssue.status)}`}>
                        Status: {selectedIssue.status.replace('_', ' ')}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(selectedIssue.priority)}`}>
                        Priority: {selectedIssue.priority}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Type: {selectedIssue.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          Reported by: <span className="font-medium text-gray-900">{selectedIssue.reportedBy.name}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Reported on: <span className="font-medium text-gray-900">{formatDate(selectedIssue.createdAt)}</span>
                        </p>
                      </div>
                      {selectedIssue.assignedTo && (
                        <div>
                          <p className="text-sm text-gray-500">
                            Assigned to: <span className="font-medium text-gray-900">{selectedIssue.assignedTo.name}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="px-6 py-4">
                    <h3 className="text-sm font-medium text-gray-900">Description</h3>
                    <div className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                      {selectedIssue.description}
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">Comments ({selectedIssue.comments})</h3>
                    <div className="mt-4 bg-gray-50 p-4 rounded-md">
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        rows={3}
                        placeholder="Add your comment here..."
                      ></textarea>
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                          <FiMessageSquare className="mr-2 -ml-1 w-4 h-4" />
                          Add Comment
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between">
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                          Update Status
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                          Assign Issue
                        </button>
                      </div>
                      <div>
                        {selectedIssue.status !== 'closed' && (
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            Close Issue
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
                  <FiAlertCircle className="w-12 h-12 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No issue selected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select an issue from the list to view its details.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 