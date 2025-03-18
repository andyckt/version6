/**
 * Authentication and User Account Utilities
 * 
 * This file provides utility functions for user authentication, registration,
 * and account management using the comprehensive user data structure.
 */

import { User, createNewUser } from '@/types/user';

/**
 * Generate a unique user ID
 * In a real application, this would be handled by a database
 */
export const generateUserId = (): number => {
  return Math.floor(Math.random() * 1000000000);
};

/**
 * Create a new user account
 * @param username Username for the new account
 * @param email Email address for the new account
 * @param password Password for the new account (will be hashed in a real implementation)
 * @param displayName Display name for the new account
 * @returns A new User object
 */
export const createAccount = (
  username: string,
  email: string,
  password: string, 
  displayName: string
): User => {
  // Generate a new user ID
  const userId = generateUserId();
  
  // Create the basic user structure
  const newUser = createNewUser(userId, username, email, displayName);
  
  // In a real application, we would:
  // 1. Hash the password
  // 2. Store the user in a database
  // 3. Send a verification email
  // 4. Create necessary user directories/resources
  
  return newUser;
};

/**
 * Update user profile information
 * @param user Current user object
 * @param updates Object containing fields to update
 * @returns Updated user object
 */
export const updateUserProfile = (user: User, updates: Partial<Pick<User, 
  'displayName' | 'bio' | 'location' | 'homeLocation' | 'website'
>>): User => {
  return {
    ...user,
    ...updates
  };
};

/**
 * Update user privacy settings
 * @param user Current user object
 * @param privacySettings New privacy settings
 * @returns Updated user object
 */
export const updatePrivacySettings = (user: User, privacySettings: Partial<User['settings']['privacy']>): User => {
  return {
    ...user,
    settings: {
      ...user.settings,
      privacy: {
        ...user.settings.privacy,
        ...privacySettings
      }
    }
  };
};

/**
 * Add an emergency contact to a user's profile
 * @param user Current user object
 * @param contact New emergency contact
 * @returns Updated user object
 */
export const addEmergencyContact = (user: User, contact: Omit<User['safety']['emergencyContacts'][0], 'id'>): User => {
  const newContact = {
    id: `contact-${Date.now()}`,
    ...contact
  };
  
  // If the new contact is primary, update other contacts
  const updatedContacts = contact.isPrimary 
    ? user.safety.emergencyContacts.map(c => ({
        ...c,
        isPrimary: false
      }))
    : [...user.safety.emergencyContacts];
  
  return {
    ...user,
    safety: {
      ...user.safety,
      emergencyContacts: [...updatedContacts, newContact]
    }
  };
};

/**
 * Validate if user data contains all required fields for a complete profile
 * @param user User object to validate
 * @returns Object containing validation status and missing fields
 */
export const validateUserProfile = (user: User): { isComplete: boolean; missingFields: string[] } => {
  const requiredFields: Array<{ field: string; path: (user: User) => any }> = [
    { field: 'displayName', path: (u) => u.displayName },
    { field: 'email', path: (u) => u.auth.email },
    { field: 'profileImage', path: (u) => u.profileImage },
    { field: 'homeLocation', path: (u) => u.homeLocation }
  ];
  
  const missingFields = requiredFields
    .filter(({ path }) => !path(user))
    .map(({ field }) => field);
  
  return {
    isComplete: missingFields.length === 0,
    missingFields
  };
};

/**
 * Check if current user is verified
 * @param user User object to check
 * @returns Boolean indicating if user is verified
 */
export const isUserVerified = (user: User): boolean => {
  return user.verified && user.auth.emailVerified;
};

/**
 * Format user join date for display
 * @param joinDate Date string from user object
 * @returns Formatted date string (e.g., "March 2021")
 */
export const formatJoinDate = (joinDate: string): string => {
  const date = new Date(joinDate);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}; 