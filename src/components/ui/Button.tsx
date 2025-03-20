"use client";

import React from 'react';
import { useNavigation } from '@/hooks/useNavigation';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export function Button({
  href,
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled = false,
  type = 'button',
  ...props
}: ButtonProps) {
  const { navigate } = useNavigation();

  // Handle navigation and clicks
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    
    if (href) {
      e.preventDefault();
      navigate(href);
    } else if (onClick) {
      onClick(e);
    }
  };

  // Base styles that apply to all buttons
  const baseStyles = "font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50";
  
  // Size variations
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  // Visual style variations
  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary/90 active:bg-primary/95",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-150",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-550"
  };

  // States
  const stateStyles = {
    disabled: "opacity-50 cursor-not-allowed",
    loading: "relative !text-transparent",
    fullWidth: "w-full"
  };

  const buttonClasses = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${disabled || isLoading ? stateStyles.disabled : ''}
    ${isLoading ? stateStyles.loading : ''}
    ${fullWidth ? stateStyles.fullWidth : ''}
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {children}
      
      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
    </button>
  );
} 