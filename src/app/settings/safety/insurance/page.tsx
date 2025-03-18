"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import { 
  FiChevronLeft,
  FiShield,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiAlertTriangle,
  FiFile,
  FiCalendar,
  FiInfo,
  FiPhone,
  FiGlobe,
  FiX,
  FiUpload
} from 'react-icons/fi';

// Mock insurance data
const mockInsuranceData = [
  {
    id: '1',
    provider: 'WorldTraveler Insurance',
    policyNumber: 'WT-9876543',
    coverage: 'Comprehensive Travel',
    startDate: '2023-06-01',
    endDate: '2024-06-01',
    contactPhone: '+1 (800) 123-4567',
    contactEmail: 'claims@worldtraveler.com',
    website: 'https://www.worldtraveler-insurance.com',
    documents: [
      { id: 'doc1', name: 'Policy Document.pdf', size: '1.2 MB', uploaded: '2023-05-20' }
    ],
    notes: 'Includes emergency medical evacuation, trip cancellation, and lost baggage coverage.'
  }
];

export default function TravelInsurancePage() {
  const [insuranceData, setInsuranceData] = useState(mockInsuranceData);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentPolicy, setCurrentPolicy] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleAdd = () => {
    setCurrentPolicy({
      id: `temp-${Date.now()}`,
      provider: '',
      policyNumber: '',
      coverage: '',
      startDate: '',
      endDate: '',
      contactPhone: '',
      contactEmail: '',
      website: '',
      documents: [],
      notes: ''
    });
    setIsAdding(true);
  };
  
  const handleEdit = (policy: any) => {
    setCurrentPolicy({ ...policy });
    setIsEditing(true);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this insurance policy?')) {
      setIsSaving(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setInsuranceData(insuranceData.filter(policy => policy.id !== id));
      setIsSaving(false);
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setCurrentPolicy({
      ...currentPolicy,
      [name]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (isAdding) {
      setInsuranceData([...insuranceData, currentPolicy]);
    } else if (isEditing) {
      setInsuranceData(insuranceData.map(policy => 
        policy.id === currentPolicy.id ? currentPolicy : policy
      ));
    }
    
    setIsSaving(false);
    setIsAdding(false);
    setIsEditing(false);
    setCurrentPolicy(null);
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentPolicy(null);
  };
  
  const handleAddDocument = () => {
    // In a real app, this would trigger a file upload dialog
    // For this mock, we'll just add a placeholder document
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: 'New Policy Document.pdf',
      size: '1.5 MB',
      uploaded: new Date().toISOString().split('T')[0]
    };
    
    setCurrentPolicy({
      ...currentPolicy,
      documents: [...(currentPolicy.documents || []), newDoc]
    });
  };
  
  const handleRemoveDocument = (docId: string) => {
    setCurrentPolicy({
      ...currentPolicy,
      documents: currentPolicy.documents.filter((doc: any) => doc.id !== docId)
    });
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' } as Intl.DateTimeFormatOptions;
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <main className="pb-16 min-h-screen bg-gray-50">
      <PageTransition>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container-app py-4">
            <div className="flex items-center">
              <Link href="/settings" className="p-1.5 bg-gray-100 rounded-full mr-3 hover:bg-gray-200 transition-colors">
                <FiChevronLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-xl font-bold">Travel Insurance</h1>
            </div>
          </div>
        </div>
        
        <div className="container-app py-6">
          {saveSuccess && (
            <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-lg flex items-center">
              <FiCheck className="w-5 h-5 text-green-500 mr-2" />
              Insurance information saved successfully
            </div>
          )}
          
          {(isAdding || isEditing) ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">
                    {isAdding ? 'Add New Insurance Policy' : 'Edit Insurance Policy'}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
                        Insurance Provider <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="provider"
                        name="provider"
                        required
                        value={currentPolicy?.provider || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        placeholder="e.g. World Traveler Insurance"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="policyNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Policy Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="policyNumber"
                          name="policyNumber"
                          required
                          value={currentPolicy?.policyNumber || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50"
                          placeholder="e.g. WT-9876543"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="coverage" className="block text-sm font-medium text-gray-700 mb-1">
                          Coverage Type <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="coverage"
                          name="coverage"
                          required
                          value={currentPolicy?.coverage || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50"
                          placeholder="e.g. Comprehensive Travel"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          name="startDate"
                          required
                          value={currentPolicy?.startDate || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                          End Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          id="endDate"
                          name="endDate"
                          required
                          value={currentPolicy?.endDate || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Claims Phone Number
                      </label>
                      <input
                        type="tel"
                        id="contactPhone"
                        name="contactPhone"
                        value={currentPolicy?.contactPhone || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        placeholder="e.g. +1 (800) 123-4567"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          id="contactEmail"
                          name="contactEmail"
                          value={currentPolicy?.contactEmail || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50"
                          placeholder="e.g. claims@example.com"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                          Insurance Website
                        </label>
                        <input
                          type="url"
                          id="website"
                          name="website"
                          value={currentPolicy?.website || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50"
                          placeholder="e.g. https://www.example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={currentPolicy?.notes || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 h-24"
                        placeholder="Any additional details about your insurance policy..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Policy Documents
                      </label>
                      
                      {currentPolicy?.documents?.length > 0 ? (
                        <div className="space-y-2 mb-3">
                          {currentPolicy.documents.map((doc: any) => (
                            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <FiFile className="w-4 h-4 text-gray-500 mr-2" />
                                <div>
                                  <p className="text-sm font-medium">{doc.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {doc.size} • Uploaded {doc.uploaded}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveDocument(doc.id)}
                                className="p-1 text-gray-400 hover:text-red-500"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mb-3">No documents uploaded yet</p>
                      )}
                      
                      <button
                        type="button"
                        onClick={handleAddDocument}
                        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg inline-flex items-center hover:bg-gray-50 text-sm"
                      >
                        <FiUpload className="w-4 h-4 mr-2" />
                        Upload Document
                      </button>
                      <p className="mt-1 text-xs text-gray-500">
                        Upload your policy document, insurance card, or any related files.
                      </p>
                    </div>
                    
                    <div className="pt-4">
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                        >
                          {isSaving ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            'Save Insurance Policy'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="p-6">
                  <div className="flex items-start mb-6">
                    <div className="p-3 bg-red-100 rounded-full mr-4 flex-shrink-0">
                      <FiShield className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-2">Travel Insurance</h2>
                      <p className="text-gray-600">
                        Keep track of your travel insurance policies for quick access while traveling.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
                    <h3 className="font-medium mb-2 text-amber-800 flex items-center">
                      <FiAlertTriangle className="w-4 h-4 mr-2" />
                      Important
                    </h3>
                    <p className="text-sm text-amber-700">
                      Always review your insurance policy details before traveling. Download a copy to your device for offline access in case of emergency.
                    </p>
                  </div>
                  
                  {insuranceData.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiShield className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No insurance policies</h3>
                      <p className="text-gray-500 mb-4">Add your travel insurance policy for easy access</p>
                      <button
                        onClick={handleAdd}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg inline-flex items-center hover:bg-red-700 transition-colors"
                      >
                        <FiPlus className="w-4 h-4 mr-2" /> Add Insurance Policy
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="space-y-6">
                        {insuranceData.map((policy) => (
                          <div key={policy.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-100">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-medium text-gray-900">{policy.provider}</h3>
                                  <div className="flex items-center mt-1">
                                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                      {policy.coverage}
                                    </span>
                                    <span className="mx-2 text-gray-300">•</span>
                                    <span className="text-sm text-gray-600">
                                      Policy: {policy.policyNumber}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEdit(policy)}
                                    className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                  >
                                    <FiEdit2 className="w-4 h-4 text-gray-600" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(policy.id)}
                                    className="p-1.5 bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors"
                                  >
                                    <FiTrash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-xs uppercase text-gray-500 font-medium mb-1">Coverage Period</h4>
                                  <p className="text-sm flex items-center">
                                    <FiCalendar className="w-3 h-3 mr-2 text-gray-500" />
                                    {formatDate(policy.startDate)} - {formatDate(policy.endDate)}
                                  </p>
                                </div>
                                
                                {policy.contactPhone && (
                                  <div>
                                    <h4 className="text-xs uppercase text-gray-500 font-medium mb-1">Claims Phone</h4>
                                    <p className="text-sm flex items-center">
                                      <FiPhone className="w-3 h-3 mr-2 text-gray-500" />
                                      {policy.contactPhone}
                                    </p>
                                  </div>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {policy.contactEmail && (
                                  <div>
                                    <h4 className="text-xs uppercase text-gray-500 font-medium mb-1">Contact Email</h4>
                                    <p className="text-sm">
                                      {policy.contactEmail}
                                    </p>
                                  </div>
                                )}
                                
                                {policy.website && (
                                  <div>
                                    <h4 className="text-xs uppercase text-gray-500 font-medium mb-1">Website</h4>
                                    <p className="text-sm flex items-center">
                                      <FiGlobe className="w-3 h-3 mr-2 text-gray-500" />
                                      <a href={policy.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                                        {policy.website}
                                      </a>
                                    </p>
                                  </div>
                                )}
                              </div>
                              
                              {policy.notes && (
                                <div className="mt-4">
                                  <h4 className="text-xs uppercase text-gray-500 font-medium mb-1">Notes</h4>
                                  <p className="text-sm text-gray-600">
                                    {policy.notes}
                                  </p>
                                </div>
                              )}
                              
                              {policy.documents && policy.documents.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-xs uppercase text-gray-500 font-medium mb-1">Documents</h4>
                                  <div className="space-y-2">
                                    {policy.documents.map((doc) => (
                                      <div key={doc.id} className="flex items-center p-2 bg-gray-50 rounded">
                                        <FiFile className="w-4 h-4 text-gray-500 mr-2" />
                                        <span className="text-sm">{doc.name}</span>
                                        <span className="text-xs text-gray-500 ml-2">({doc.size})</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={handleAdd}
                          className="px-4 py-2 border border-red-500 text-red-600 rounded-lg inline-flex items-center hover:bg-red-50 transition-colors"
                        >
                          <FiPlus className="w-4 h-4 mr-2" /> Add Another Policy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </PageTransition>
      
      <Navigation />
    </main>
  );
} 