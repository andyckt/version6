"use client";

/**
 * User Context Provider
 * 
 * This component creates a React context for managing user state throughout the application.
 * It provides access to the current user data and authentication methods.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, exampleUser } from '@/types/user';
import { createAccount, updateUserProfile, updatePrivacySettings } from '@/utils/authUtils';

// Define the shape of our context
interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string, displayName: string) => Promise<boolean>;
  updateProfile: (updates: Partial<Pick<User, 'displayName' | 'bio' | 'location' | 'homeLocation' | 'website'>>) => void;
  updatePrivacy: (settings: Partial<User['settings']['privacy']>) => void;
}

// Create the context with a default value
const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  register: async () => false,
  updateProfile: () => {},
  updatePrivacy: () => {},
});

// Custom hook for accessing the user context
export const useUser = () => useContext(UserContext);

// The UserProvider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, we would check for an auth token in local storage
        // and then validate it with an API call
        const savedUser = localStorage.getItem('user');
        
        if (savedUser) {
          // For demo purposes, we'll use the parsed user from localStorage
          setUser(JSON.parse(savedUser));
        } else {
          // For demo/development purposes, use the example user
          // This would be removed in production
          setUser(exampleUser);
          localStorage.setItem('user', JSON.stringify(exampleUser));
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to validate credentials
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // For demo/development purposes, we'll just use the example user
      // This would be replaced with proper authentication in production
      if (email === exampleUser.auth.email) {
        setUser(exampleUser);
        localStorage.setItem('user', JSON.stringify(exampleUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Register function
  const register = async (
    username: string,
    email: string,
    password: string,
    displayName: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to create a user
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Create new user with our utility
      const newUser = createAccount(username, email, password, displayName);
      
      // Set the user state and store in localStorage
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = (updates: Partial<Pick<User, 'displayName' | 'bio' | 'location' | 'homeLocation' | 'website'>>) => {
    if (!user) return;
    
    // In a real app, this would be an API call to update the user profile
    const updatedUser = updateUserProfile(user, updates);
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Update privacy settings function
  const updatePrivacy = (settings: Partial<User['settings']['privacy']>) => {
    if (!user) return;
    
    // In a real app, this would be an API call to update privacy settings
    const updatedUser = updatePrivacySettings(user, settings);
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Context value
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    updateProfile,
    updatePrivacy,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}; 