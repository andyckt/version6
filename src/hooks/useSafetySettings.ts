"use client";

/**
 * Safety and Emergency Settings Hook
 * 
 * This custom hook provides methods for managing a user's safety and emergency settings,
 * including emergency contacts, medical information, and insurance policies.
 */

import { useState } from 'react';
import { User, EmergencyContact, MedicalInformation, InsurancePolicy, Document } from '@/types/user';
import { useUser } from '@/components/UserContext';

interface UseSafetySettingsReturn {
  // Emergency Contacts
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<boolean>;
  updateEmergencyContact: (id: string, updates: Partial<Omit<EmergencyContact, 'id'>>) => Promise<boolean>;
  removeEmergencyContact: (id: string) => Promise<boolean>;
  setPrimaryEmergencyContact: (id: string) => Promise<boolean>;
  
  // Medical Information
  updateMedicalInfo: (info: Partial<MedicalInformation>) => Promise<boolean>;
  toggleMedicalInfoSharing: () => Promise<boolean>;
  
  // Insurance Policies
  addInsurancePolicy: (policy: Omit<InsurancePolicy, 'id' | 'documents'>) => Promise<boolean>;
  updateInsurancePolicy: (id: string, updates: Partial<Omit<InsurancePolicy, 'id' | 'documents'>>) => Promise<boolean>;
  removeInsurancePolicy: (id: string) => Promise<boolean>;
  addPolicyDocument: (policyId: string, document: Omit<Document, 'id'>) => Promise<boolean>;
  removePolicyDocument: (policyId: string, documentId: string) => Promise<boolean>;
  
  // State
  isSaving: boolean;
  error: string | null;
  clearError: () => void;
}

export const useSafetySettings = (): UseSafetySettingsReturn => {
  const { user, isLoading } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Helper function to update the user object in localStorage
  const updateUserInStorage = (updatedUser: User): void => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };
  
  // Helper function to simulate API calls with a delay
  const simulateApiCall = async <T>(operation: () => T): Promise<T> => {
    setIsSaving(true);
    setError(null);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return operation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };
  
  // Clear any error messages
  const clearError = () => setError(null);
  
  // Emergency Contact Methods
  const addEmergencyContact = async (contact: Omit<EmergencyContact, 'id'>): Promise<boolean> => {
    if (!user) return false;
    
    return simulateApiCall(() => {
      const newContact: EmergencyContact = {
        id: `contact-${Date.now()}`,
        ...contact
      };
      
      // If this contact is primary, update other contacts
      let updatedContacts = [...user.safety.emergencyContacts];
      
      if (contact.isPrimary) {
        updatedContacts = updatedContacts.map(c => ({
          ...c,
          isPrimary: false
        }));
      }
      
      // Add the new contact
      updatedContacts.push(newContact);
      
      // Create updated user object
      const updatedUser: User = {
        ...user,
        safety: {
          ...user.safety,
          emergencyContacts: updatedContacts
        }
      };
      
      // Update localStorage (in a real app, this would be an API call)
      updateUserInStorage(updatedUser);
      
      return true;
    });
  };
  
  const updateEmergencyContact = async (
    id: string, 
    updates: Partial<Omit<EmergencyContact, 'id'>>
  ): Promise<boolean> => {
    if (!user) return false;
    
    return simulateApiCall(() => {
      // Find the contact to update
      const contactIndex = user.safety.emergencyContacts.findIndex(c => c.id === id);
      
      if (contactIndex === -1) {
        throw new Error('Emergency contact not found');
      }
      
      let updatedContacts = [...user.safety.emergencyContacts];
      
      // If making this contact primary, update other contacts
      if (updates.isPrimary) {
        updatedContacts = updatedContacts.map(c => ({
          ...c,
          isPrimary: false
        }));
      }
      
      // Update the specific contact
      updatedContacts[contactIndex] = {
        ...updatedContacts[contactIndex],
        ...updates
      };
      
      // Create updated user object
      const updatedUser: User = {
        ...user,
        safety: {
          ...user.safety,
          emergencyContacts: updatedContacts
        }
      };
      
      // Update localStorage (in a real app, this would be an API call)
      updateUserInStorage(updatedUser);
      
      return true;
    });
  };
  
  const removeEmergencyContact = async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    return simulateApiCall(() => {
      // Filter out the contact to remove
      const updatedContacts = user.safety.emergencyContacts.filter(c => c.id !== id);
      
      // Create updated user object
      const updatedUser: User = {
        ...user,
        safety: {
          ...user.safety,
          emergencyContacts: updatedContacts
        }
      };
      
      // Update localStorage (in a real app, this would be an API call)
      updateUserInStorage(updatedUser);
      
      return true;
    });
  };
  
  const setPrimaryEmergencyContact = async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    return simulateApiCall(() => {
      // Update all contacts, setting the specified one as primary
      const updatedContacts = user.safety.emergencyContacts.map(c => ({
        ...c,
        isPrimary: c.id === id
      }));
      
      // Create updated user object
      const updatedUser: User = {
        ...user,
        safety: {
          ...user.safety,
          emergencyContacts: updatedContacts
        }
      };
      
      // Update localStorage (in a real app, this would be an API call)
      updateUserInStorage(updatedUser);
      
      return true;
    });
  };
  
  // Medical Information Methods
  const updateMedicalInfo = async (info: Partial<MedicalInformation>): Promise<boolean> => {
    if (!user) return false;
    
    return simulateApiCall(() => {
      // Create updated user object
      const updatedUser: User = {
        ...user,
        safety: {
          ...user.safety,
          medicalInformation: {
            ...user.safety.medicalInformation,
            ...info
          }
        }
      };
      
      // Update localStorage (in a real app, this would be an API call)
      updateUserInStorage(updatedUser);
      
      return true;
    });
  };
  
  const toggleMedicalInfoSharing = async (): Promise<boolean> => {
    if (!user) return false;
    
    return simulateApiCall(() => {
      // Toggle the sharing setting
      const updatedUser: User = {
        ...user,
        safety: {
          ...user.safety,
          medicalInformation: {
            ...user.safety.medicalInformation,
            shareWithEmergencyServices: !user.safety.medicalInformation.shareWithEmergencyServices
          }
        }
      };
      
      // Update localStorage (in a real app, this would be an API call)
      updateUserInStorage(updatedUser);
      
      return true;
    });
  };
  
  // Insurance Policy Methods
  const addInsurancePolicy = async (
    policy: Omit<InsurancePolicy, 'id' | 'documents'>
  ): Promise<boolean> => {
    if (!user) return false;
    
    return simulateApiCall(() => {
      const newPolicy: InsurancePolicy = {
        id: `policy-${Date.now()}`,
        ...policy,
        documents: []
      };
      
      // Create updated user object
      const updatedUser: User = {
        ...user,
        safety: {
          ...user.safety,
          insurancePolicies: [...user.safety.insurancePolicies, newPolicy]
        }
      };
      
      // Update localStorage (in a real app, this would be an API call)
      updateUserInStorage(updatedUser);
      
      return true;
    });
  };
  
  const updateInsurancePolicy = async (
    id: string, 
    updates: Partial<Omit<InsurancePolicy, 'id' | 'documents'>>
  ): Promise<boolean> => {
    if (!user) return false;
    
    return simulateApiCall(() => {
      // Find the policy to update
      const policyIndex = user.safety.insurancePolicies.findIndex(p => p.id === id);
      
      if (policyIndex === -1) {
        throw new Error('Insurance policy not found');
      }
      
      // Update the specific policy
      const updatedPolicies = [...user.safety.insurancePolicies];
      updatedPolicies[policyIndex] = {
        ...updatedPolicies[policyIndex],
        ...updates
      };
      
      // Create updated user object
      const updatedUser: User = {
        ...user,
        safety: {
          ...user.safety,
          insurancePolicies: updatedPolicies
        }
      };
      
      // Update localStorage (in a real app, this would be an API call)
      updateUserInStorage(updatedUser);
      
      return true;
    });
  };
  
  const removeInsurancePolicy = async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    return simulateApiCall(() => {
      // Filter out the policy to remove
      const updatedPolicies = user.safety.insurancePolicies.filter(p => p.id !== id);
      
      // Create updated user object
      const updatedUser: User = {
        ...user,
        safety: {
          ...user.safety,
          insurancePolicies: updatedPolicies
        }
      };
      
      // Update localStorage (in a real app, this would be an API call)
      updateUserInStorage(updatedUser);
      
      return true;
    });
  };
  
  const addPolicyDocument = async (
    policyId: string, 
    document: Omit<Document, 'id'>
  ): Promise<boolean> => {
    if (!user) return false;
    
    return simulateApiCall(() => {
      // Find the policy to update
      const policyIndex = user.safety.insurancePolicies.findIndex(p => p.id === policyId);
      
      if (policyIndex === -1) {
        throw new Error('Insurance policy not found');
      }
      
      // Create new document with ID
      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        ...document
      };
      
      // Add document to the policy
      const updatedPolicies = [...user.safety.insurancePolicies];
      updatedPolicies[policyIndex] = {
        ...updatedPolicies[policyIndex],
        documents: [...updatedPolicies[policyIndex].documents, newDocument]
      };
      
      // Create updated user object
      const updatedUser: User = {
        ...user,
        safety: {
          ...user.safety,
          insurancePolicies: updatedPolicies
        }
      };
      
      // Update localStorage (in a real app, this would be an API call)
      updateUserInStorage(updatedUser);
      
      return true;
    });
  };
  
  const removePolicyDocument = async (policyId: string, documentId: string): Promise<boolean> => {
    if (!user) return false;
    
    return simulateApiCall(() => {
      // Find the policy to update
      const policyIndex = user.safety.insurancePolicies.findIndex(p => p.id === policyId);
      
      if (policyIndex === -1) {
        throw new Error('Insurance policy not found');
      }
      
      // Remove document from the policy
      const updatedPolicies = [...user.safety.insurancePolicies];
      updatedPolicies[policyIndex] = {
        ...updatedPolicies[policyIndex],
        documents: updatedPolicies[policyIndex].documents.filter(d => d.id !== documentId)
      };
      
      // Create updated user object
      const updatedUser: User = {
        ...user,
        safety: {
          ...user.safety,
          insurancePolicies: updatedPolicies
        }
      };
      
      // Update localStorage (in a real app, this would be an API call)
      updateUserInStorage(updatedUser);
      
      return true;
    });
  };
  
  return {
    addEmergencyContact,
    updateEmergencyContact,
    removeEmergencyContact,
    setPrimaryEmergencyContact,
    updateMedicalInfo,
    toggleMedicalInfoSharing,
    addInsurancePolicy,
    updateInsurancePolicy,
    removeInsurancePolicy,
    addPolicyDocument,
    removePolicyDocument,
    isSaving,
    error,
    clearError
  };
}; 