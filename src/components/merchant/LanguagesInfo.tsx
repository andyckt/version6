import React from 'react';
import { FiGlobe } from 'react-icons/fi';

interface LanguagesInfoProps {
  languages: string[];
  className?: string;
}

export default function LanguagesInfo({ languages, className = '' }: LanguagesInfoProps) {
  if (!languages || languages.length === 0) return null;
  
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="font-bold text-lg">Languages Spoken</h3>
      
      <div className="flex items-start">
        <FiGlobe className="mt-1 mr-2 text-primary flex-shrink-0" />
        <div>
          <div className="flex flex-wrap gap-2">
            {languages.map((language, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 