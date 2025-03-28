import React from 'react';
import { FiDollarSign, FiTag } from 'react-icons/fi';
import { 
  BaseMerchant, 
  SingleLocationMerchant, 
  HotelMerchant, 
  AttractionMerchant,
  BarClubMerchant,
  BuildingMerchant,
  isHotelMerchant,
  isAttractionMerchant,
  isBarClubMerchant,
  isSingleLocationMerchant,
  isBuildingMerchant
} from '@/data/merchants';

interface PriceInfoProps {
  merchant: BaseMerchant;
  className?: string;
}

export default function PriceInfo({ merchant, className = '' }: PriceInfoProps) {
  const renderPriceInfo = () => {
    // Hotel merchants show price per night
    if (isHotelMerchant(merchant)) {
      return (
        <div className="flex items-center">
          <span className="font-medium mr-2">Price per Night:</span>
          <span>¥{merchant.pricePerNight} CNY</span>
        </div>
      );
    }
    
    // Attraction merchants show admission price
    if (isAttractionMerchant(merchant)) {
      const isFree = merchant.ticketPrice === 0;
      return (
        <div className="flex items-center">
          <span className="font-medium mr-2">Admission:</span>
          <span>{isFree ? 'Free Entry' : `¥${merchant.ticketPrice} CNY`}</span>
        </div>
      );
    }
    
    // Bar and club merchants show entry fee if applicable
    if (isBarClubMerchant(merchant)) {
      const hasFee = merchant.entryFee !== undefined && merchant.entryFee > 0;
      return (
        <div className="flex items-center">
          <span className="font-medium mr-2">Entry Fee:</span>
          <span>{hasFee ? `¥${merchant.entryFee} CNY` : 'No Entry Fee'}</span>
        </div>
      );
    }
    
    // Building merchants don't have price information
    if (isBuildingMerchant(merchant)) {
      return (
        <div className="flex items-center">
          <span className="text-gray-500">Not available</span>
        </div>
      );
    }
    
    // Default for restaurants and other merchants: price per person
    if (isSingleLocationMerchant(merchant) && merchant.pricePerPerson) {
      return (
        <div className="flex items-center">
          <span className="font-medium mr-2">Average Price per Person:</span>
          <span>¥{merchant.pricePerPerson} CNY</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center">
        <span className="text-gray-500">Price information not available</span>
      </div>
    );
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-sm p-5 ${className}`}>
      <h2 className="text-lg font-bold mb-4">Price Information</h2>
      <div className="flex items-center">
        <FiDollarSign className="text-amber-500 mr-3 flex-shrink-0" size={20} />
        {renderPriceInfo()}
      </div>
    </div>
  );
} 