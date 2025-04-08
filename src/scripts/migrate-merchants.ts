/**
 * Migration script to populate MongoDB with merchants data from local data file
 * 
 * Usage:
 * 1. Make sure MongoDB connection details are in .env.local
 * 2. Run with: npx ts-node -r tsconfig-paths/register src/scripts/migrate-merchants.ts
 */

import { connectToDatabase } from '@/lib/mongodb';
import { MerchantModel, MerchantDetailModel, MERCHANT_COLLECTION, MERCHANT_DETAIL_COLLECTION } from '@/models/Merchant';
import { merchants, isSingleLocationMerchant, isMultiLocationMerchant, 
  isAttractionMerchant, isHotelMerchant, isBarClubMerchant, 
  isBuildingMerchant, isStreetMerchant } from '@/data/merchants';

// Function to calculate if a merchant is currently open
function calculateIsOpen(merchant: any): boolean {
  try {
    if (!merchant.businessInfo?.openingHours) return false;
    
    const now = new Date();
    const currentDay = now.toLocaleString('en-US', { weekday: 'long' });
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute; // Convert to minutes
    
    // Check if merchant has opening hours for the current day
    for (const schedule of merchant.businessInfo.openingHours) {
      // Handle different day formats
      if (schedule.day === 'Monday-Sunday' || 
          schedule.day === 'All days' || 
          schedule.day === '全天' ||
          schedule.day === 'All day' ||
          schedule.day.includes(currentDay)) {
        
        // Handle 24 hour or all day operation
        if (schedule.hours === '24 hours' || 
            schedule.hours === 'All day' || 
            schedule.hours === '全天') {
          return true;
        }
        
        // Handle array of hours or single string
        const timeRanges = Array.isArray(schedule.hours) ? schedule.hours : [schedule.hours];
        
        for (const timeRange of timeRanges) {
          if (timeRange === 'Closed') continue;
          
          // Parse time range (format: "HH:MM-HH:MM")
          const [startTimeStr, endTimeStr] = timeRange.split('-');
          
          let startHour = parseInt(startTimeStr.split(':')[0]);
          let startMinute = parseInt(startTimeStr.split(':')[1]);
          let startTimeMinutes = startHour * 60 + startMinute;
          
          let endHour = parseInt(endTimeStr.split(':')[0]);
          let endMinute = parseInt(endTimeStr.split(':')[1]);
          let endTimeMinutes = endHour * 60 + endMinute;
          
          // Handle overnight operations (e.g., 22:00-04:00)
          if (endTimeMinutes < startTimeMinutes) {
            // Either before midnight or after midnight
            if (currentTime >= startTimeMinutes || currentTime <= endTimeMinutes) {
              return true;
            }
          } else {
            // Same day operation
            if (currentTime >= startTimeMinutes && currentTime <= endTimeMinutes) {
              return true;
            }
          }
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error(`Error calculating open status for ${merchant.username}:`, error);
    return false;
  }
}

// Function to calculate the next opening time
function calculateNextOpenTime(merchant: any): string {
  try {
    if (!merchant.businessInfo?.openingHours) return 'Unknown';
    
    const now = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = daysOfWeek[now.getDay()];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute; // Convert to minutes
    
    // Sort days to start from today
    const orderedDays = [
      ...daysOfWeek.slice(now.getDay()),
      ...daysOfWeek.slice(0, now.getDay())
    ];
    
    // Check for the next opening time
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const checkDay = orderedDays[dayOffset];
      
      for (const schedule of merchant.businessInfo.openingHours) {
        // Handle different day formats
        if (schedule.day === 'Monday-Sunday' || 
            schedule.day === 'All days' || 
            schedule.day === 'Everyday' ||
            schedule.day === 'All day' ||
            schedule.day === '全天' ||
            schedule.day.includes(checkDay)) {
            
          // Handle 24 hour operation
          if (schedule.hours === '24 hours' || 
              schedule.hours === 'All day' || 
              schedule.hours === '全天') {
            return 'Open 24 hours';
          }
          
          // Handle array of hours or single string
          const timeRanges = Array.isArray(schedule.hours) ? schedule.hours : [schedule.hours];
          
          for (const timeRange of timeRanges) {
            if (timeRange === 'Closed') continue;
            
            // Parse time range (format: "HH:MM-HH:MM")
            const [startTimeStr, endTimeStr] = timeRange.split('-');
            
            let startHour = parseInt(startTimeStr.split(':')[0]);
            let startMinute = parseInt(startTimeStr.split(':')[1]);
            let startTimeMinutes = startHour * 60 + startMinute;
            
            // If it's today and the start time is in the future
            if (dayOffset === 0 && startTimeMinutes > currentTime) {
              const date = new Date();
              date.setHours(startHour, startMinute, 0, 0);
              return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            
            // If it's a future day
            if (dayOffset > 0) {
              const date = new Date();
              date.setDate(date.getDate() + dayOffset);
              date.setHours(startHour, startMinute, 0, 0);
              return `${checkDay} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            }
          }
        }
      }
    }
    
    return 'Unknown';
  } catch (error) {
    console.error(`Error calculating next open time for ${merchant.username}:`, error);
    return 'Unknown';
  }
}

async function migrateMerchants() {
  try {
    // Connect to MongoDB
    const { db } = await connectToDatabase();
    console.log('Connected to MongoDB');
    
    // Get references to the collections
    const merchantsCollection = db.collection<MerchantModel>(MERCHANT_COLLECTION);
    const merchantDetailsCollection = db.collection<MerchantDetailModel>(MERCHANT_DETAIL_COLLECTION);
    
    // Empty collections before migration
    await merchantsCollection.deleteMany({});
    await merchantDetailsCollection.deleteMany({});
    console.log('Collections cleared');
    
    // Initialize counters for progress tracking
    let processed = 0;
    const total = merchants.length;
    
    // Process each merchant
    for (const merchant of merchants) {
      // Create base merchant document with essential fields
      const baseData: MerchantModel = {
        id: merchant.id,
        username: merchant.username,
        displayName: merchant.displayName,
        verified: merchant.verified,
        accountType: merchant.accountType,
        joinDate: merchant.joinDate,
        recommended: merchant.recommended,
        hashtags: merchant.hashtags,
        district: merchant.district,
        merchantType: merchant.merchantType,
        profileInterface: merchant.profileInterface,
        url: merchant.url,
        stats: merchant.stats,
        openStatus: {
          isCurrentlyOpen: calculateIsOpen(merchant),
          nextOpeningTime: calculateNextOpenTime(merchant),
          lastUpdated: new Date()
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Insert base document
      const merchantResult = await merchantsCollection.insertOne(baseData);
      
      // Create merchant details based on merchant type
      let detailsData: MerchantDetailModel = {
        merchantId: merchant.id,
        merchantType: merchant.merchantType,
        profileInterface: merchant.profileInterface,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add type-specific fields
      if (isSingleLocationMerchant(merchant)) {
        detailsData = {
          ...detailsData,
          location: merchant.location,
          businessInfo: merchant.businessInfo,
          pricePerPerson: merchant.pricePerPerson,
          languagesSpoken: merchant.languagesSpoken,
          michelinStars: merchant.michelinStars
        };
      } else if (isMultiLocationMerchant(merchant)) {
        detailsData = {
          ...detailsData,
          pricePerPerson: merchant.pricePerPerson,
          languagesSpoken: merchant.languagesSpoken,
          michelinStars: merchant.michelinStars,
          branches: merchant.branches
        };
      } else if (isAttractionMerchant(merchant)) {
        detailsData = {
          ...detailsData,
          location: merchant.location,
          businessInfo: merchant.businessInfo,
          ticketPrice: merchant.ticketPrice
        };
      } else if (isHotelMerchant(merchant)) {
        detailsData = {
          ...detailsData,
          location: merchant.location,
          businessInfo: merchant.businessInfo,
          pricePerNight: merchant.pricePerNight,
          amenities: merchant.amenities,
          stars: merchant.stars
        };
      } else if (isBarClubMerchant(merchant)) {
        detailsData = {
          ...detailsData,
          location: merchant.location,
          businessInfo: merchant.businessInfo,
          pricePerPerson: merchant.pricePerPerson,
          nearbyMidnightFood: merchant.nearbyMidnightFood,
          clubCategories: merchant.clubCategories,
          entryFee: merchant.entryFee
        };
      } else if (isBuildingMerchant(merchant)) {
        detailsData = {
          ...detailsData,
          location: merchant.location,
          businessInfo: merchant.businessInfo,
          floors: merchant.floors,
          featuredStores: merchant.featuredStores
        };
      } else if (isStreetMerchant(merchant)) {
        detailsData = {
          ...detailsData,
          location: merchant.location
        };
      }
      
      // Insert details document
      const detailsResult = await merchantDetailsCollection.insertOne(detailsData);
      
      // Update merchant with reference to details
      await merchantsCollection.updateOne(
        { _id: merchantResult.insertedId },
        { $set: { merchantDetailsId: detailsResult.insertedId } }
      );
      
      // Update progress
      processed++;
      if (processed % 20 === 0) {
        console.log(`Processed ${processed}/${total} merchants`);
      }
    }
    
    // Create indexes for better performance
    await merchantsCollection.createIndex({ username: 1 }, { unique: true });
    await merchantsCollection.createIndex({ id: 1 }, { unique: true });
    await merchantsCollection.createIndex({ accountType: 1, recommended: 1 });
    await merchantsCollection.createIndex({ district: 1 });
    
    await merchantDetailsCollection.createIndex({ merchantId: 1 }, { unique: true });
    
    console.log(`Migration completed successfully! Processed ${processed} merchants.`);
    console.log('Created indexes for better performance');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Execute the migration
migrateMerchants()
  .then(() => {
    console.log('Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  }); 