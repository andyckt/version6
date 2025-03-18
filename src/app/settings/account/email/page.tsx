"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import { 
  FiChevronLeft, 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff,
  FiX,
  FiCheck,
  FiEdit2,
  FiAlertCircle
} from 'react-icons/fi';

// Mock user data - in a real app, this would come from an API
const mockUser = {
  email: 'travel.enthusiast@example.com',
  emailVerified: true,
  lastPasswordChange: '2023-08-15T10:30:00Z'
};

export default function EmailPasswordPage() {
  const router = useRouter();
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [emailForm, setEmailForm] = useState({
    email: mockUser.email,
    currentPassword: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateEmailForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailForm.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(emailForm.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Current password validation for email change
    if (!emailForm.currentPassword) {
      newErrors.currentPassword = 'Password is required to change email';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const validatePasswordForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Current password validation
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      isValid = false;
    }
    
    // New password validation
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    }
    
    // Confirm password validation
    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
      isValid = false;
    } else if (passwordForm.confirmPassword !== passwordForm.newPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmailForm()) return;
    
    // Simulate API call
    setIsSaving(true);
    
    // In a real app, this would be an API call to update the email
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setIsEditingEmail(false);
    
    // Reset password field
    setEmailForm(prev => ({
      ...prev,
      currentPassword: ''
    }));
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    // Simulate API call
    setIsSaving(true);
    
    // In a real app, this would be an API call to update the password
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setIsEditingPassword(false);
    
    // Reset password fields
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
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
                <h1 className="text-xl font-bold">Email & Password</h1>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container-app py-6">
          {/* Email Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Email Address</h2>
                
                {isEditingEmail ? (
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setIsEditingEmail(false)}
                      disabled={isSaving}
                      className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditingEmail(true)}
                    className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {isEditingEmail ? (
                <form onSubmit={handleEmailSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        New Email Address
                      </label>
                      <div className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <FiMail className="text-gray-400 w-4 h-4" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={emailForm.email}
                          onChange={handleEmailChange}
                          className="flex-1 ml-2 focus:outline-none"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <FiAlertCircle className="w-3 h-3 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <FiLock className="text-gray-400 w-4 h-4" />
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          id="currentPassword"
                          name="currentPassword"
                          value={emailForm.currentPassword}
                          onChange={handleEmailChange}
                          className="flex-1 ml-2 focus:outline-none"
                          placeholder="Enter your current password"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? (
                            <FiEyeOff className="w-4 h-4" />
                          ) : (
                            <FiEye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <FiAlertCircle className="w-3 h-3 mr-1" />
                          {errors.currentPassword}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        We need your current password to verify your identity
                      </p>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        'Update Email'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="flex items-center mb-1">
                    <FiMail className="text-gray-400 w-4 h-4 mr-2" />
                    <span>{mockUser.email}</span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    {mockUser.emailVerified ? (
                      <span className="text-green-500 flex items-center">
                        <FiCheck className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-amber-500 flex items-center">
                        <FiAlertCircle className="w-3 h-3 mr-1" />
                        Not verified
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Password Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Password</h2>
                
                {isEditingPassword ? (
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setIsEditingPassword(false)}
                      disabled={isSaving}
                      className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditingPassword(true)}
                    className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {isEditingPassword ? (
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <FiLock className="text-gray-400 w-4 h-4" />
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="flex-1 ml-2 focus:outline-none"
                          placeholder="Enter your current password"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? (
                            <FiEyeOff className="w-4 h-4" />
                          ) : (
                            <FiEye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <FiAlertCircle className="w-3 h-3 mr-1" />
                          {errors.currentPassword}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <FiLock className="text-gray-400 w-4 h-4" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          id="newPassword"
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="flex-1 ml-2 focus:outline-none"
                          placeholder="Enter your new password"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? (
                            <FiEyeOff className="w-4 h-4" />
                          ) : (
                            <FiEye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <FiAlertCircle className="w-3 h-3 mr-1" />
                          {errors.newPassword}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Password must be at least 8 characters long
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <FiLock className="text-gray-400 w-4 h-4" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="flex-1 ml-2 focus:outline-none"
                          placeholder="Confirm your new password"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <FiEyeOff className="w-4 h-4" />
                          ) : (
                            <FiEye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <FiAlertCircle className="w-3 h-3 mr-1" />
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="flex items-center">
                    <FiLock className="text-gray-400 w-4 h-4 mr-2" />
                    <span className="text-gray-600">••••••••</span>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    Last changed {new Date(mockUser.lastPasswordChange).toLocaleDateString()}
                  </p>
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