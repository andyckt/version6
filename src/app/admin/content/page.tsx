"use client";

import { useState, useEffect } from 'react';
import { 
  FiEdit, FiTrash2, FiPlus, FiSearch, FiFilter, 
  FiEye, FiRefreshCw, FiCalendar, FiLayers
} from 'react-icons/fi';

type ContentStatus = 'published' | 'draft' | 'scheduled' | 'archived';
type ContentType = 'post' | 'page' | 'article' | 'announcement';

interface Content {
  id: string;
  title: string;
  type: ContentType;
  status: ContentStatus;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  excerpt: string;
  featured: boolean;
  category?: string;
  tags: string[];
  views: number;
}

export default function ContentPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ContentType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ContentStatus | 'all'>('all');
  
  useEffect(() => {
    fetchContent();
  }, []);
  
  const fetchContent = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock content data
      const mockContent: Content[] = [
        {
          id: 'post-001',
          title: 'Getting Started with Our Platform',
          type: 'post',
          status: 'published',
          author: {
            id: 'user-123',
            name: 'John Doe'
          },
          createdAt: '2023-05-01T10:30:00Z',
          updatedAt: '2023-05-02T14:45:00Z',
          publishedAt: '2023-05-02T15:00:00Z',
          excerpt: 'A comprehensive guide to help you get started with all the features our platform offers.',
          featured: true,
          category: 'Guides',
          tags: ['beginner', 'tutorial', 'getting-started'],
          views: 1245
        },
        {
          id: 'page-001',
          title: 'About Us',
          type: 'page',
          status: 'published',
          author: {
            id: 'user-456',
            name: 'Jane Smith'
          },
          createdAt: '2023-04-15T09:20:00Z',
          updatedAt: '2023-04-15T11:10:00Z',
          publishedAt: '2023-04-15T12:00:00Z',
          excerpt: 'Learn more about our company, mission, and values.',
          featured: false,
          tags: ['company', 'about'],
          views: 875
        },
        {
          id: 'article-001',
          title: 'The Future of AI in Everyday Applications',
          type: 'article',
          status: 'published',
          author: {
            id: 'user-789',
            name: 'Robert Johnson'
          },
          createdAt: '2023-05-10T08:45:00Z',
          updatedAt: '2023-05-10T16:30:00Z',
          publishedAt: '2023-05-11T09:00:00Z',
          excerpt: 'Exploring how artificial intelligence is being integrated into everyday applications and changing how we interact with technology.',
          featured: true,
          category: 'Technology',
          tags: ['ai', 'technology', 'future'],
          views: 2310
        },
        {
          id: 'announcement-001',
          title: 'New Features Coming Next Month',
          type: 'announcement',
          status: 'published',
          author: {
            id: 'user-123',
            name: 'John Doe'
          },
          createdAt: '2023-05-15T11:20:00Z',
          updatedAt: '2023-05-15T14:35:00Z',
          publishedAt: '2023-05-15T15:00:00Z',
          excerpt: 'We\'re excited to announce a set of new features that will be launching next month to enhance your experience.',
          featured: true,
          tags: ['announcement', 'features', 'update'],
          views: 1890
        },
        {
          id: 'post-002',
          title: 'Optimizing Your Workflow',
          type: 'post',
          status: 'draft',
          author: {
            id: 'user-456',
            name: 'Jane Smith'
          },
          createdAt: '2023-05-18T13:15:00Z',
          updatedAt: '2023-05-18T13:15:00Z',
          excerpt: 'Tips and tricks to optimize your daily workflow and increase productivity.',
          featured: false,
          category: 'Productivity',
          tags: ['productivity', 'workflow', 'tips'],
          views: 0
        },
        {
          id: 'article-002',
          title: 'Understanding Data Privacy in the Digital Age',
          type: 'article',
          status: 'scheduled',
          author: {
            id: 'user-789',
            name: 'Robert Johnson'
          },
          createdAt: '2023-05-20T09:30:00Z',
          updatedAt: '2023-05-20T16:45:00Z',
          publishedAt: '2023-05-25T09:00:00Z',
          excerpt: 'A deep dive into data privacy concerns, regulations, and best practices for protecting your information online.',
          featured: false,
          category: 'Privacy',
          tags: ['privacy', 'data', 'security'],
          views: 0
        },
        {
          id: 'page-002',
          title: 'Terms of Service',
          type: 'page',
          status: 'published',
          author: {
            id: 'user-123',
            name: 'John Doe'
          },
          createdAt: '2023-04-01T10:00:00Z',
          updatedAt: '2023-04-01T10:00:00Z',
          publishedAt: '2023-04-01T11:00:00Z',
          excerpt: 'Our terms of service and user agreement.',
          featured: false,
          tags: ['legal', 'terms'],
          views: 420
        },
        {
          id: 'post-003',
          title: 'Community Highlights: April 2023',
          type: 'post',
          status: 'archived',
          author: {
            id: 'user-456',
            name: 'Jane Smith'
          },
          createdAt: '2023-04-30T14:20:00Z',
          updatedAt: '2023-04-30T16:10:00Z',
          publishedAt: '2023-04-30T17:00:00Z',
          excerpt: 'A look back at the top community contributions and highlights from April 2023.',
          featured: false,
          category: 'Community',
          tags: ['community', 'highlights', 'april'],
          views: 890
        }
      ];
      
      setContents(mockContent);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger an API call with search parameters
    console.log('Searching for:', searchQuery);
  };
  
  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'post':
        return <FiEdit className="text-blue-500" />;
      case 'page':
        return <FiLayers className="text-purple-500" />;
      case 'article':
        return <FiEdit className="text-green-500" />;
      case 'announcement':
        return <FiCalendar className="text-red-500" />;
      default:
        return <FiEdit className="text-gray-500" />;
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Filter content based on selected filters
  const filteredContent = contents.filter(content => {
    // Filter by search query
    if (searchQuery && !content.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by type
    if (selectedType !== 'all' && content.type !== selectedType) {
      return false;
    }
    
    // Filter by status
    if (selectedStatus !== 'all' && content.status !== selectedStatus) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Content Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create, edit, and manage all content on your site
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add New Content
          </button>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="mt-6 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <form onSubmit={handleSearch} className="flex w-full md:max-w-md">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Search content by title..."
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
        
        <div className="flex items-center mt-4 space-x-3 md:mt-0">
          <div className="relative inline-block text-left">
            <select
              className="block w-full py-2 pl-3 pr-10 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ContentType | 'all')}
            >
              <option value="all">All Types</option>
              <option value="post">Posts</option>
              <option value="page">Pages</option>
              <option value="article">Articles</option>
              <option value="announcement">Announcements</option>
            </select>
          </div>
          
          <div className="relative inline-block text-left">
            <select
              className="block w-full py-2 pl-3 pr-10 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ContentStatus | 'all')}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStatus('all');
              setSelectedType('all');
              fetchContent();
            }}
            className="inline-flex items-center p-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Content table */}
      <div className="mt-6 overflow-hidden bg-white border border-gray-200 shadow-sm sm:rounded-lg">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FiRefreshCw className="w-8 h-8 mr-2 text-primary animate-spin" />
            <span className="text-lg">Loading content...</span>
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FiFilter className="w-8 h-8 mb-2 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">No content found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Published
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Views
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContent.map((content) => (
                  <tr key={content.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {content.featured && (
                          <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-yellow-500 bg-yellow-100 rounded-full">
                            ★
                          </span>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{content.title}</div>
                          {content.category && (
                            <div className="text-xs text-gray-500">{content.category}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-2">
                          {getTypeIcon(content.type)}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {content.type}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(content.status)}`}>
                        {content.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{content.author.name}</div>
                      <div className="text-xs text-gray-500">Updated {formatDate(content.updatedAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(content.publishedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{content.views.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          className="p-1 text-indigo-600 hover:text-indigo-900"
                          title="View"
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          className="p-1 text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FiEdit className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          className="p-1 text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between py-3 mt-4 bg-white border border-gray-200 sm:px-6 rounded-md">
        <div className="flex justify-between flex-1 sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Previous
          </button>
          <button className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredContent.length}</span> of{" "}
              <span className="font-medium">{filteredContent.length}</span> results
            </p>
          </div>
          <div>
            <nav className="inline-flex rounded-md shadow-sm isolate -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:z-10">
                <span className="sr-only">Previous</span>
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="relative z-10 inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-500 bg-indigo-50">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:z-10">
                <span className="sr-only">Next</span>
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
} 