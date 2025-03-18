"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import { 
  FiChevronLeft,
  FiPhone,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiAlertTriangle,
  FiUser,
  FiHeart,
  FiMail,
  FiX
} from 'react-icons/fi';

// Mock emergency contacts data
const mockEmergencyContacts = [
  {
    id: '1',
    name: 'Emma Johnson',
    relationship: 'Family',
    phone: '+1 (555) 123-4567',
    email: 'emma.j@example.com',
    isPrimary: true
  },
  {
    id: '2',
    name: 'Michael Chen',
    relationship: 'Friend',
    phone: '+1 (555) 987-6543',
    email: 'michael.c@example.com',
    isPrimary: false
  }
];

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState(mockEmergencyContacts);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentContact, setCurrentContact] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleAdd = () => {
    setCurrentContact({
      id: `temp-${Date.now()}`,
      name: '',
      relationship: '',
      phone: '',
      email: '',
      isPrimary: contacts.length === 0 // Make primary if first contact
    });
    setIsAdding(true);
  };
  
  const handleEdit = (contact: any) => {
    setCurrentContact({ ...contact });
    setIsEditing(true);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this emergency contact?')) {
      setIsSaving(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setContacts(contacts.filter(contact => contact.id !== id));
      setIsSaving(false);
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox separately
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setCurrentContact({
        ...currentContact,
        [name]: target.checked
      });
    } else {
      setCurrentContact({
        ...currentContact,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (isAdding) {
      setContacts([...contacts, currentContact]);
    } else if (isEditing) {
      setContacts(contacts.map(contact => 
        contact.id === currentContact.id ? currentContact : contact
      ));
    }
    
    setIsSaving(false);
    setIsAdding(false);
    setIsEditing(false);
    setCurrentContact(null);
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentContact(null);
  };
  
  // If this contact is set as primary, ensure other contacts are not primary
  const handlePrimaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setContacts(contacts.map(contact => ({
        ...contact,
        isPrimary: contact.id === currentContact.id
      })));
    }
    
    setCurrentContact({
      ...currentContact,
      isPrimary: e.target.checked
    });
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
              <h1 className="text-xl font-bold">Emergency Contacts</h1>
            </div>
          </div>
        </div>
        
        <div className="container-app py-6">
          {saveSuccess && (
            <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-lg flex items-center">
              <FiCheck className="w-5 h-5 text-green-500 mr-2" />
              Changes saved successfully
            </div>
          )}
          
          {(isAdding || isEditing) ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">
                    {isAdding ? 'Add New Contact' : 'Edit Contact'}
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
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <FiUser className="text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={currentContact?.name || ''}
                          onChange={handleChange}
                          className="flex-1 ml-2 focus:outline-none"
                          placeholder="Contact full name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">
                        Relationship <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <FiHeart className="text-gray-400 w-4 h-4" />
                        <select
                          id="relationship"
                          name="relationship"
                          required
                          value={currentContact?.relationship || ''}
                          onChange={handleChange}
                          className="flex-1 ml-2 focus:outline-none bg-transparent"
                        >
                          <option value="">Select relationship</option>
                          <option value="Family">Family</option>
                          <option value="Friend">Friend</option>
                          <option value="Partner">Partner</option>
                          <option value="Colleague">Colleague</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <FiPhone className="text-gray-400 w-4 h-4" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={currentContact?.phone || ''}
                          onChange={handleChange}
                          className="flex-1 ml-2 focus:outline-none"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <FiMail className="text-gray-400 w-4 h-4" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={currentContact?.email || ''}
                          onChange={handleChange}
                          className="flex-1 ml-2 focus:outline-none"
                          placeholder="contact@example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isPrimary"
                        name="isPrimary"
                        checked={currentContact?.isPrimary || false}
                        onChange={handlePrimaryChange}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <label htmlFor="isPrimary" className="ml-3 block text-sm text-gray-700">
                        Set as primary emergency contact
                      </label>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          'Save Contact'
                        )}
                      </button>
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
                      <FiPhone className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-2">Emergency Contacts</h2>
                      <p className="text-gray-600">
                        Add people who should be contacted in case of an emergency while you're traveling. Your primary contact will be displayed first to emergency responders.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
                    <h3 className="font-medium mb-2 text-amber-800 flex items-center">
                      <FiAlertTriangle className="w-4 h-4 mr-2" />
                      Important
                    </h3>
                    <p className="text-sm text-amber-700">
                      These contacts will only be accessible to emergency services or in situations where your safety may be at risk. Make sure to keep this information up to date.
                    </p>
                  </div>
                  
                  {contacts.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiPhone className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No emergency contacts</h3>
                      <p className="text-gray-500 mb-4">Add your first emergency contact to keep safe while traveling</p>
                      <button
                        onClick={handleAdd}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg inline-flex items-center hover:bg-red-700 transition-colors"
                      >
                        <FiPlus className="w-4 h-4 mr-2" /> Add Contact
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="space-y-4">
                        {contacts.map((contact) => (
                          <div key={contact.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center">
                                  <h3 className="font-medium text-gray-900">{contact.name}</h3>
                                  {contact.isPrimary && (
                                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                                      Primary
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">{contact.relationship}</p>
                                <div className="mt-2 space-y-1">
                                  <p className="text-sm flex items-center">
                                    <FiPhone className="w-3 h-3 mr-2 text-gray-500" />
                                    {contact.phone}
                                  </p>
                                  {contact.email && (
                                    <p className="text-sm flex items-center">
                                      <FiMail className="w-3 h-3 mr-2 text-gray-500" />
                                      {contact.email}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEdit(contact)}
                                  className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                  <FiEdit2 className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                  onClick={() => handleDelete(contact.id)}
                                  className="p-1.5 bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={handleAdd}
                          className="px-4 py-2 border border-red-500 text-red-600 rounded-lg inline-flex items-center hover:bg-red-50 transition-colors"
                        >
                          <FiPlus className="w-4 h-4 mr-2" /> Add Another Contact
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