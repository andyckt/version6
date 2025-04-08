"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BaseMerchant } from '@/data/merchants';

export default function EditMerchantPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [merchant, setMerchant] = useState<BaseMerchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    verified: false,
    recommended: false,
    hashtags: '',
    district: '',
    merchantType: ''
  });
  
  // Fetch merchant data
  useEffect(() => {
    async function fetchMerchant() {
      try {
        setLoading(true);
        const response = await fetch(`/api/merchants/id/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch merchant: ${response.statusText}`);
        }
        
        const data = await response.json();
        setMerchant(data);
        
        // Initialize form data
        setFormData({
          displayName: data.displayName || '',
          username: data.username || '',
          verified: data.verified || false,
          recommended: data.recommended || false,
          hashtags: data.hashtags ? data.hashtags.join(', ') : '',
          district: data.district ? data.district.join(', ') : '',
          merchantType: data.merchantType || ''
        });
      } catch (err) {
        console.error('Error fetching merchant:', err);
        setError('Failed to load merchant data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchMerchant();
    }
  }, [id]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.displayName || !formData.username) {
      setError('Display name and username are required');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Prepare data for API
      const updatedMerchant = {
        ...merchant,
        displayName: formData.displayName,
        username: formData.username,
        verified: formData.verified,
        recommended: formData.recommended,
        hashtags: formData.hashtags.split(',').map(tag => tag.trim()),
        district: formData.district.split(',').map(district => district.trim()),
        merchantType: formData.merchantType
      };
      
      // Send update to API
      const response = await fetch(`/api/admin/merchants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMerchant),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update merchant: ${response.statusText}`);
      }
      
      setSuccessMessage('Merchant updated successfully');
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error updating merchant:', err);
      setError('Failed to update merchant. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleDelete = async () => {
    try {
      setSaving(true);
      
      const response = await fetch(`/api/admin/merchants/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete merchant: ${response.statusText}`);
      }
      
      // Redirect to merchant list
      router.push('/admin/merchants');
      
    } catch (err) {
      console.error('Error deleting merchant:', err);
      setError('Failed to delete merchant. Please try again.');
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Edit Merchant</h1>
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (!merchant) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Edit Merchant</h1>
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          Merchant not found
        </div>
        <Link href="/admin/merchants" className="text-blue-500 hover:underline">
          &larr; Back to merchant list
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Merchant: {merchant.displayName}</h1>
        <Link href="/admin/merchants" className="text-blue-500 hover:underline">
          &larr; Back to merchant list
        </Link>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information Section */}
            <div className="col-span-2">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Merchant Type
                  </label>
                  <input
                    type="text"
                    name="merchantType"
                    value={formData.merchantType}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div className="flex space-x-4 items-center">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="verified"
                        checked={formData.verified}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span>Verified</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="recommended"
                        checked={formData.recommended}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span>Recommended</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Taxonomy Section */}
            <div className="col-span-2">
              <h2 className="text-xl font-semibold mb-4">Taxonomy</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Hashtags (comma separated)
                  </label>
                  <textarea
                    name="hashtags"
                    value={formData.hashtags}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Districts (comma separated)
                  </label>
                  <textarea
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-500 text-white px-4 py-2 rounded"
              disabled={saving}
            >
              Delete Merchant
            </button>
            
            <div className="space-x-4">
              <Link
                href="/admin/merchants"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete {merchant.displayName}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
                disabled={saving}
              >
                {saving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 