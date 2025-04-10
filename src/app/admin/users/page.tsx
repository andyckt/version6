"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiArrowLeft, FiSearch, FiEdit2, FiTrash2, FiUserPlus, 
  FiRefreshCw, FiCheckCircle, FiXCircle, FiChevronLeft, FiChevronRight, FiPlus, FiMail, FiDownload, FiFilter 
} from 'react-icons/fi';

// User type from MongoDB
interface MongoUser {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  verified: boolean;
  location: string;
  homeLocation: string;
  website: string;
  joinDate: string;
  role: 'user' | 'creator' | 'admin';
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  emailVerified?: boolean;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<MongoUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<MongoUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    location: '',
    homeLocation: '',
    website: '',
    verified: false,
    role: 'user' as 'user' | 'creator' | 'admin'
  });
  const [filter, setFilter] = useState('all');
  
  // Function to fetch the users
  const fetchUsers = async (page = 1, limit = 10) => {
    setIsLoading(true);
    setError('');
    
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }
      
      const response = await fetch(`/api/users?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.users || []);
      setTotalPages(data.pagination.totalPages || 1);
      setCurrentPage(data.pagination.page || 1);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching users');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchUsers(1);
  };
  
  // Function to view user details
  const viewUser = (user: MongoUser) => {
    setSelectedUser(user);
    setIsEditing(false);
  };
  
  // Function to prepare for editing
  const prepareEdit = (user: MongoUser) => {
    setSelectedUser(user);
    setEditForm({
      displayName: user.displayName,
      bio: user.bio || '',
      location: user.location || '',
      homeLocation: user.homeLocation || '',
      website: user.website || '',
      verified: user.verified || false,
      role: user.role || 'user'
    });
    setIsEditing(true);
  };
  
  // Function to handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Function to save user changes
  const saveUserChanges = async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/users/${selectedUser.username}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      const updatedUser = await response.json();
      
      // Update the user in the list
      setUsers(prev => 
        prev.map(user => 
          user._id === updatedUser._id ? updatedUser : user
        )
      );
      
      // Update the selected user view
      setSelectedUser(updatedUser);
      setIsEditing(false);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating user');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to handle pagination
  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    fetchUsers(newPage);
  };
  
  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Filter and search users
  const filteredUsers = users.filter(user => {
    // Apply status filter
    if (filter !== 'all' && user.status !== filter) {
      return false;
    }
    
    // Apply search
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      return (
        user.displayName.toLowerCase().includes(search) || 
        user.email.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search)
      );
    }
    
    return true;
  });
  
  // Get status badge style
  const getStatusBadge = (status: MongoUser['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <main className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header className="sticky top-0 bg-white z-10 border-b border-gray-100 shadow-sm">
        <div className="container-app max-w-6xl">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <Link href="/admin" className="p-2 mr-2 transition-transform hover:scale-110">
                <FiArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-lg font-medium">User Management</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => fetchUsers(currentPage)}
                className="p-2 mr-2 text-gray-600 hover:text-gray-900 transition-colors"
                disabled={isLoading}
                title="Refresh"
              >
                <FiRefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <Link 
                href="/admin"
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Add New User"
              >
                <FiUserPlus className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container-app max-w-6xl py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User List */}
          <div className="lg:col-span-2">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Search users by username or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="ml-2 px-4 py-2 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 transition-colors"
                  disabled={isLoading}
                >
                  Search
                </button>
              </form>
            </div>
            
            {/* Error message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            {/* User List */}
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Loading users...</p>
              </div>
            ) : (
              <>
                {users.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <p className="text-gray-500 mb-2">No users found.</p>
                    {searchQuery && (
                      <p className="text-sm text-gray-400">
                        Try another search term or clear the search to see all users.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <ul className="divide-y divide-gray-100">
                      {filteredUsers.map((user) => (
                        <li 
                          key={user._id} 
                          className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                            selectedUser?._id === user._id ? 'bg-gray-50' : ''
                          }`}
                          onClick={() => viewUser(user)}
                        >
                          <div className="flex items-center p-4">
                            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
                              {user.profileImage ? (
                                <Image
                                  src={user.profileImage}
                                  alt={user.displayName}
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400">
                                  {user.displayName.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center">
                                <h3 className="font-medium text-gray-900 truncate">
                                  {user.displayName}
                                </h3>
                                {user.verified && (
                                  <FiCheckCircle className="ml-1 text-blue-500 w-4 h-4" />
                                )}
                              </div>
                              <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                            </div>
                            <div className="ml-2 flex-shrink-0">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                user.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : user.role === 'creator' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.role}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="px-4 py-3 bg-gray-50 text-gray-600 border-t border-gray-100 flex items-center justify-between">
                        <button
                          className="flex items-center text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => changePage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <FiChevronLeft className="mr-1" />
                          Previous
                        </button>
                        <span className="text-sm">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          className="flex items-center text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => changePage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <FiChevronRight className="ml-1" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Right Column - User Details */}
          <div className="lg:col-span-1">
            {selectedUser ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {isEditing ? (
                  /* Edit Form */
                  <div className="p-4">
                    <h2 className="text-lg font-bold mb-4">Edit User</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Display Name
                        </label>
                        <input
                          type="text"
                          name="displayName"
                          value={editForm.displayName}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={editForm.bio}
                          onChange={handleFormChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            value={editForm.location}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Home Location
                          </label>
                          <input
                            type="text"
                            name="homeLocation"
                            value={editForm.homeLocation}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <input
                          type="text"
                          name="website"
                          value={editForm.website}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <select
                          name="role"
                          value={editForm.role}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="user">User</option>
                          <option value="creator">Creator</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="verified"
                          name="verified"
                          checked={editForm.verified}
                          onChange={handleFormChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="verified" className="ml-2 block text-sm text-gray-700">
                          Verified User
                        </label>
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-4">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={saveUserChanges}
                          disabled={isLoading}
                          className="px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* User Details */
                  <div>
                    {/* Cover & Profile Image */}
                    <div className="h-32 bg-gray-200 relative">
                      {selectedUser.coverImage && (
                        <Image
                          src={selectedUser.coverImage}
                          alt={`${selectedUser.displayName}'s cover`}
                          fill
                          className="object-cover"
                        />
                      )}
                      <div className="absolute -bottom-10 left-4">
                        <div className="h-20 w-20 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                          {selectedUser.profileImage ? (
                            <Image
                              src={selectedUser.profileImage}
                              alt={selectedUser.displayName}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400 text-xl">
                              {selectedUser.displayName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => prepareEdit(selectedUser)}
                          className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                          title="Edit User"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* User Info */}
                    <div className="pt-12 px-4 pb-4">
                      <div className="flex items-center mb-1">
                        <h2 className="text-xl font-bold">{selectedUser.displayName}</h2>
                        {selectedUser.verified && (
                          <FiCheckCircle className="ml-1 text-blue-500 w-5 h-5" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">@{selectedUser.username}</p>
                      
                      {selectedUser.bio && (
                        <p className="text-gray-800 mb-4">{selectedUser.bio}</p>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm font-medium truncate">{selectedUser.email}</p>
                          <div className="flex items-center mt-1">
                            <div 
                              className={`w-2 h-2 rounded-full mr-1 ${
                                selectedUser.emailVerified ? 'bg-green-500' : 'bg-red-500'
                              }`} 
                            />
                            <span className="text-xs">
                              {selectedUser.emailVerified ? 'Verified' : 'Not Verified'}
                            </span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500">Role</p>
                          <p className="text-sm font-medium capitalize">{selectedUser.role}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Joined {new Date(selectedUser.joinDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {/* Location & Website */}
                      {(selectedUser.location || selectedUser.homeLocation) && (
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold mb-1">Location</h3>
                          {selectedUser.location && (
                            <p className="text-sm text-gray-700 mb-1">
                              Current: {selectedUser.location}
                            </p>
                          )}
                          {selectedUser.homeLocation && (
                            <p className="text-sm text-gray-700">
                              Home: {selectedUser.homeLocation}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {selectedUser.website && (
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold mb-1">Website</h3>
                          <a 
                            href={selectedUser.website.startsWith('http') ? selectedUser.website : `https://${selectedUser.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {selectedUser.website}
                          </a>
                        </div>
                      )}
                      
                      {/* Stats */}
                      <div className="border-t border-gray-100 pt-4 mt-4">
                        <h3 className="text-sm font-semibold mb-2">Stats</h3>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <p className="text-lg font-bold">{selectedUser.stats.posts}</p>
                            <p className="text-xs text-gray-500">Posts</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold">{selectedUser.stats.followers}</p>
                            <p className="text-xs text-gray-500">Followers</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold">{selectedUser.stats.following}</p>
                            <p className="text-xs text-gray-500">Following</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Admin Actions */}
                      <div className="border-t border-gray-100 pt-4 mt-4">
                        <h3 className="text-sm font-semibold mb-2">Admin Actions</h3>
                        <div className="flex space-x-2">
                          <Link
                            href={`/user/${selectedUser.username}`}
                            target="_blank"
                            className="flex-1 px-3 py-2 text-sm text-center bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                          >
                            View Profile
                          </Link>
                          <button
                            className="flex-1 px-3 py-2 text-sm text-center bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                            onClick={() => {/* Implement delete user functionality */}}
                          >
                            Delete User
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUserPlus className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-gray-700 font-medium mb-2">No User Selected</h3>
                <p className="text-gray-500 text-sm">
                  Select a user from the list to view details and manage their account.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 