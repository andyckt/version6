import React from 'react';
import { FiX, FiPhone } from 'react-icons/fi';

interface PhoneNumberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumbers: string[];
}

export default function PhoneNumberDialog({ isOpen, onClose, phoneNumbers }: PhoneNumberDialogProps) {
  if (!isOpen) return null;

  const handlePhoneClick = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Contact Numbers</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={20} />
          </button>
        </div>
        
        <div className="space-y-3">
          {phoneNumbers.map((phone, index) => (
            <button
              key={index}
              onClick={() => handlePhoneClick(phone)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <FiPhone className="mr-3 text-primary" size={20} />
                <span className="font-medium">{phone}</span>
              </div>
              <span className="text-sm text-gray-500">Tap to call</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 