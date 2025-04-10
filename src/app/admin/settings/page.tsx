"use client";

import { useState } from 'react';
import { FiSave, FiAlertCircle } from 'react-icons/fi';

interface SettingSection {
  title: string;
  description: string;
  settings: Setting[];
}

type SettingType = 'text' | 'number' | 'toggle' | 'select';

interface Setting {
  id: string;
  name: string;
  description: string;
  type: SettingType;
  value: string | number | boolean;
  options?: { value: string; label: string }[];
}

export default function SettingsPage() {
  const [sections, setSections] = useState<SettingSection[]>([
    {
      title: 'General Settings',
      description: 'Configure basic system settings and default behaviors',
      settings: [
        {
          id: 'site_name',
          name: 'Site Name',
          description: 'The name displayed on your site and in emails',
          type: 'text',
          value: 'My Application'
        },
        {
          id: 'site_description',
          name: 'Site Description',
          description: 'Brief description of your site for SEO purposes',
          type: 'text',
          value: 'A modern application for productivity'
        },
        {
          id: 'maintenance_mode',
          name: 'Maintenance Mode',
          description: 'When enabled, the site will display a maintenance message to all non-admin users',
          type: 'toggle',
          value: false
        },
      ]
    },
    {
      title: 'User Settings',
      description: 'Configure user account options and registration settings',
      settings: [
        {
          id: 'allow_registrations',
          name: 'Allow Registrations',
          description: 'Allow new users to register for an account',
          type: 'toggle',
          value: true
        },
        {
          id: 'default_user_role',
          name: 'Default User Role',
          description: 'Role assigned to new users upon registration',
          type: 'select',
          value: 'user',
          options: [
            { value: 'user', label: 'User' },
            { value: 'creator', label: 'Creator' },
            { value: 'admin', label: 'Admin' },
          ]
        },
        {
          id: 'email_verification',
          name: 'Email Verification',
          description: 'Require users to verify their email address before they can log in',
          type: 'toggle',
          value: true
        },
        {
          id: 'max_login_attempts',
          name: 'Max Login Attempts',
          description: 'Number of failed login attempts before account is temporarily locked',
          type: 'number',
          value: 5
        },
      ]
    },
    {
      title: 'Email Settings',
      description: 'Configure email service connection and notification settings',
      settings: [
        {
          id: 'smtp_host',
          name: 'SMTP Host',
          description: 'SMTP server hostname for sending emails',
          type: 'text',
          value: 'smtp.example.com'
        },
        {
          id: 'smtp_port',
          name: 'SMTP Port',
          description: 'SMTP server port',
          type: 'number',
          value: 587
        },
        {
          id: 'notification_email',
          name: 'Notification Email',
          description: 'Email address used for sending system notifications',
          type: 'text',
          value: 'notifications@example.com'
        },
        {
          id: 'send_welcome_email',
          name: 'Send Welcome Email',
          description: 'Send a welcome email to new users upon registration',
          type: 'toggle',
          value: true
        },
      ]
    },
    {
      title: 'Security Settings',
      description: 'Configure security features and authentication requirements',
      settings: [
        {
          id: 'two_factor_auth',
          name: 'Two-Factor Authentication',
          description: 'Require two-factor authentication for all admin accounts',
          type: 'toggle',
          value: false
        },
        {
          id: 'session_timeout',
          name: 'Session Timeout',
          description: 'Minutes of inactivity before a user is automatically logged out',
          type: 'number',
          value: 60
        },
        {
          id: 'password_policy',
          name: 'Password Policy',
          description: 'Minimum password strength requirement',
          type: 'select',
          value: 'medium',
          options: [
            { value: 'low', label: 'Low - At least 6 characters' },
            { value: 'medium', label: 'Medium - At least 8 characters with numbers' },
            { value: 'high', label: 'High - At least 10 characters with numbers and special characters' },
          ]
        },
      ]
    },
  ]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleSettingChange = (sectionIndex: number, settingId: string, value: string | number | boolean) => {
    const newSections = [...sections];
    const settingIndex = newSections[sectionIndex].settings.findIndex(s => s.id === settingId);
    
    if (settingIndex !== -1) {
      newSections[sectionIndex].settings[settingIndex].value = value;
      setSections(newSections);
    }
  };
  
  const saveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically make an API call to save the settings
      // For this example, we'll just log the settings to the console
      console.log('Saving settings:', sections);
      
      setSaveSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const renderSetting = (section: SettingSection, sectionIndex: number, setting: Setting) => {
    const handleChange = (value: string | number | boolean) => {
      handleSettingChange(sectionIndex, setting.id, value);
    };
    
    switch (setting.type) {
      case 'text':
        return (
          <input
            type="text"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            value={setting.value as string}
            onChange={(e) => handleChange(e.target.value)}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            value={setting.value as number}
            onChange={(e) => handleChange(Number(e.target.value))}
          />
        );
      case 'toggle':
        return (
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={setting.value as boolean}
              onChange={(e) => handleChange(e.target.checked)}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        );
      case 'select':
        return (
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            value={setting.value as string}
            onChange={(e) => handleChange(e.target.value)}
          >
            {setting.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Configure system settings and preferences
          </p>
        </div>
        <div>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={saveSettings}
            disabled={isSaving}
          >
            <FiSave className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
      
      {saveSuccess && (
        <div className="mt-4 p-4 bg-green-50 rounded-md border border-green-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Settings saved successfully
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6 space-y-10">
        {sections.map((section, sectionIndex) => (
          <div key={section.title} className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{section.title}</h2>
              <p className="mt-1 text-sm text-gray-500">{section.description}</p>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-6">
                {section.settings.map((setting) => (
                  <div key={setting.id} className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                    <div>
                      <label htmlFor={setting.id} className="block text-sm font-medium text-gray-700">
                        {setting.name}
                      </label>
                      <p className="mt-1 text-sm text-gray-500">{setting.description}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 sm:col-span-2">
                      {renderSetting(section, sectionIndex, setting)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}