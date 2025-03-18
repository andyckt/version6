"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import { 
  FiChevronLeft, 
  FiAlertTriangle,
  FiTrash2,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheck
} from 'react-icons/fi';

export default function DeleteAccountPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError('');
  };
  
  const handleConfirmTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmText(e.target.value);
    if (error) setError('');
  };
  
  const handleContinue = () => {
    if (!password) {
      setError('Please enter your password to continue');
      return;
    }
    
    // In a real app, verify the password with an API call here
    setStep(2);
  };
  
  const handleDelete = async () => {
    if (confirmText !== 'delete my account') {
      setError('Please type "delete my account" to confirm');
      return;
    }
    
    setIsLoading(true);
    
    // In a real app, this would be an API call to delete the account
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setIsSuccess(true);
    
    // In a real app, redirect to logged out page after a delay
    setTimeout(() => {
      router.push('/');
    }, 3000);
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
              <h1 className="text-xl font-bold">Delete Account</h1>
            </div>
          </div>
        </div>
        
        <div className="container-app py-6">
          {isSuccess ? (
            <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-green-800 mb-2">Account Deletion Initiated</h2>
              <p className="text-green-700 mb-4">
                Your account deletion request has been processed. You will be signed out shortly.
              </p>
              <div className="w-full max-w-xs mx-auto">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300 ease-in-out"
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                {step === 1 ? (
                  <>
                    <div className="flex items-start mb-6">
                      <div className="p-3 bg-red-100 rounded-full mr-4 flex-shrink-0">
                        <FiAlertTriangle className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold mb-2">Delete Your Account</h2>
                        <p className="text-gray-600 mb-4">
                          This action is permanent and cannot be undone. All your data, including your profile, posts, and saved items will be permanently deleted.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
                      <h3 className="font-medium mb-2 text-red-800">What happens when you delete your account:</h3>
                      <ul className="text-sm text-red-700 space-y-2">
                        <li className="flex items-start">
                          <FiTrash2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          Your profile and all your content will be permanently deleted
                        </li>
                        <li className="flex items-start">
                          <FiTrash2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          Your username will be released and may become available to others
                        </li>
                        <li className="flex items-start">
                          <FiTrash2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          You will lose access to all your saved items and preferences
                        </li>
                        <li className="flex items-start">
                          <FiTrash2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          You won't be able to recover your account after 30 days
                        </li>
                      </ul>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Enter your password to continue
                      </label>
                      <div className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <FiLock className="text-gray-400 w-4 h-4" />
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          value={password}
                          onChange={handlePasswordChange}
                          className="flex-1 ml-2 focus:outline-none"
                          placeholder="Enter your password"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <FiEyeOff className="w-4 h-4" />
                          ) : (
                            <FiEye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {error && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <FiAlertCircle className="w-3 h-3 mr-1" />
                          {error}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex justify-end">
                      <Link 
                        href="/settings" 
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-3 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </Link>
                      <button
                        onClick={handleContinue}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Continue
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start mb-6">
                      <div className="p-3 bg-red-100 rounded-full mr-4 flex-shrink-0">
                        <FiAlertTriangle className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold mb-2">Final Confirmation</h2>
                        <p className="text-gray-600 mb-4">
                          This action is permanent and cannot be undone. Please type <strong>delete my account</strong> in the field below to confirm.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700 mb-1">
                        Type "delete my account" to confirm
                      </label>
                      <input
                        type="text"
                        id="confirmText"
                        value={confirmText}
                        onChange={handleConfirmTextChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        placeholder="delete my account"
                      />
                      {error && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <FiAlertCircle className="w-3 h-3 mr-1" />
                          {error}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex justify-end">
                      <button 
                        onClick={() => setStep(1)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-3 hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isLoading || confirmText !== 'delete my account'}
                        className={`px-4 py-2 bg-red-600 text-white rounded-lg flex items-center ${
                          confirmText === 'delete my account' ? 'hover:bg-red-700' : 'opacity-50 cursor-not-allowed'
                        } transition-colors`}
                      >
                        {isLoading && (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        )}
                        Delete Account
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </PageTransition>
      
      <Navigation />
    </main>
  );
} 