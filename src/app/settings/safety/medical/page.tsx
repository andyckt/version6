"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import { 
  FiChevronLeft,
  FiPlus,
  FiActivity,
  FiCheck,
  FiAlertTriangle,
  FiEdit3,
  FiSave,
  FiToggleLeft,
  FiToggleRight
} from 'react-icons/fi';

// Mock medical information data
const mockMedicalInfo = {
  bloodType: 'O+',
  allergies: ['Penicillin', 'Peanuts'],
  medications: ['Cetirizine 10mg (daily)'],
  conditions: ['Asthma - Mild'],
  additionalInfo: 'Carries an inhaler at all times.',
  shareWithEmergencyServices: true
};

export default function MedicalInformationPage() {
  const [medicalInfo, setMedicalInfo] = useState(mockMedicalInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Form state for editing
  const [formValues, setFormValues] = useState({
    bloodType: medicalInfo.bloodType,
    allergiesText: medicalInfo.allergies.join(', '),
    medicationsText: medicalInfo.medications.join(', '),
    conditionsText: medicalInfo.conditions.join(', '),
    additionalInfo: medicalInfo.additionalInfo,
    shareWithEmergencyServices: medicalInfo.shareWithEmergencyServices
  });
  
  const handleEdit = () => {
    setFormValues({
      bloodType: medicalInfo.bloodType,
      allergiesText: medicalInfo.allergies.join(', '),
      medicationsText: medicalInfo.medications.join(', '),
      conditionsText: medicalInfo.conditions.join(', '),
      additionalInfo: medicalInfo.additionalInfo,
      shareWithEmergencyServices: medicalInfo.shareWithEmergencyServices
    });
    setIsEditing(true);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormValues({
        ...formValues,
        [name]: target.checked
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Convert comma-separated strings back to arrays
    const newMedicalInfo = {
      bloodType: formValues.bloodType,
      allergies: formValues.allergiesText.split(',').map(item => item.trim()).filter(item => item !== ''),
      medications: formValues.medicationsText.split(',').map(item => item.trim()).filter(item => item !== ''),
      conditions: formValues.conditionsText.split(',').map(item => item.trim()).filter(item => item !== ''),
      additionalInfo: formValues.additionalInfo,
      shareWithEmergencyServices: formValues.shareWithEmergencyServices
    };
    
    setMedicalInfo(newMedicalInfo);
    setIsSaving(false);
    setIsEditing(false);
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const bloodTypeOptions = [
    { value: '', label: 'Select blood type' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
    { value: 'Unknown', label: 'Unknown' }
  ];
  
  return (
    <main className="pb-16 min-h-screen bg-gray-50">
      <PageTransition>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container-app py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/settings" className="p-1.5 bg-gray-100 rounded-full mr-3 hover:bg-gray-200 transition-colors">
                  <FiChevronLeft className="w-4 h-4" />
                </Link>
                <h1 className="text-xl font-bold">Medical Information</h1>
              </div>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="p-2 bg-red-50 text-red-600 rounded-lg inline-flex items-center hover:bg-red-100 transition-colors"
                >
                  <FiEdit3 className="w-4 h-4 mr-1" />
                  <span className="text-sm">Edit</span>
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="container-app py-6">
          {saveSuccess && (
            <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-lg flex items-center">
              <FiCheck className="w-5 h-5 text-green-500 mr-2" />
              Medical information saved successfully
            </div>
          )}
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex items-start mb-6">
                <div className="p-3 bg-red-100 rounded-full mr-4 flex-shrink-0">
                  <FiActivity className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Medical Information</h2>
                  <p className="text-gray-600">
                    Add important medical details that could be critical in an emergency situation while traveling.
                  </p>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-2 text-amber-800 flex items-center">
                  <FiAlertTriangle className="w-4 h-4 mr-2" />
                  Important Privacy Notice
                </h3>
                <p className="text-sm text-amber-700">
                  This information will only be shared with emergency medical personnel if needed. You can control who has access to this information via the privacy setting at the bottom of this page.
                </p>
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
                        Blood Type
                      </label>
                      <select
                        id="bloodType"
                        name="bloodType"
                        value={formValues.bloodType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      >
                        {bloodTypeOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="allergiesText" className="block text-sm font-medium text-gray-700 mb-1">
                        Allergies
                      </label>
                      <textarea
                        id="allergiesText"
                        name="allergiesText"
                        value={formValues.allergiesText}
                        onChange={handleChange}
                        placeholder="List allergies separated by commas (e.g. Penicillin, Peanuts)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 h-24"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Enter any allergies to medications, food, or other substances.
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="medicationsText" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Medications
                      </label>
                      <textarea
                        id="medicationsText"
                        name="medicationsText"
                        value={formValues.medicationsText}
                        onChange={handleChange}
                        placeholder="List medications separated by commas (e.g. Lisinopril 10mg daily, Metformin 500mg twice daily)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 h-24"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Include dosage and frequency if possible.
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="conditionsText" className="block text-sm font-medium text-gray-700 mb-1">
                        Medical Conditions
                      </label>
                      <textarea
                        id="conditionsText"
                        name="conditionsText"
                        value={formValues.conditionsText}
                        onChange={handleChange}
                        placeholder="List medical conditions separated by commas (e.g. Diabetes, Asthma, Hypertension)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 h-24"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Information
                      </label>
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formValues.additionalInfo}
                        onChange={handleChange}
                        placeholder="Any other relevant medical information emergency responders should know"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 h-24"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Include information about medical devices, special care instructions, or other details.
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Share Medical Information with Emergency Services</p>
                          <p className="text-sm text-gray-500">
                            If enabled, medical personnel can access this information in case of an emergency
                          </p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setFormValues(prev => ({
                            ...prev,
                            shareWithEmergencyServices: !prev.shareWithEmergencyServices
                          }))}
                          className="text-gray-700"
                        >
                          {formValues.shareWithEmergencyServices ? (
                            <FiToggleRight className="w-10 h-6 text-red-600" />
                          ) : (
                            <FiToggleLeft className="w-10 h-6 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
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
                          <>
                            <FiSave className="w-4 h-4 mr-2" />
                            Save Information
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Blood Type</h3>
                    <p className="text-gray-900 font-medium">
                      {medicalInfo.bloodType || 'Not provided'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Allergies</h3>
                    {medicalInfo.allergies.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {medicalInfo.allergies.map((allergy, index) => (
                          <li key={index} className="text-gray-900">{allergy}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 italic">No allergies listed</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Current Medications</h3>
                    {medicalInfo.medications.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {medicalInfo.medications.map((medication, index) => (
                          <li key={index} className="text-gray-900">{medication}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 italic">No medications listed</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Medical Conditions</h3>
                    {medicalInfo.conditions.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {medicalInfo.conditions.map((condition, index) => (
                          <li key={index} className="text-gray-900">{condition}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 italic">No medical conditions listed</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Additional Information</h3>
                    {medicalInfo.additionalInfo ? (
                      <p className="text-gray-900">{medicalInfo.additionalInfo}</p>
                    ) : (
                      <p className="text-gray-600 italic">No additional information provided</p>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Emergency Services Access</p>
                        <p className="text-sm text-gray-500">
                          {medicalInfo.shareWithEmergencyServices 
                            ? 'Medical personnel can access this information in case of emergency'
                            : 'Medical information is not shared with emergency services'}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        medicalInfo.shareWithEmergencyServices 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {medicalInfo.shareWithEmergencyServices ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageTransition>
      
      <Navigation />
    </main>
  );
} 