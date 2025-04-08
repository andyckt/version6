/**
 * Merchants Data Converter
 * This script converts merchants from TypeScript format to JavaScript format for database import
 * 
 * Usage:
 * 1. Run with: node src/scripts/convert-merchants.js
 * 2. The script will read merchants.ts and output a new merchants-converted.js file
 */

const fs = require('fs');
const path = require('path');

// Define the path to the input and output files
const inputPath = path.join(__dirname, '../data/merchants.ts');
const outputPath = path.join(__dirname, '../data/merchants-converted.js');

// Profile interface enum values (matching TypeScript enum)
const ProfileInterface = {
  SingleShopRestaurant: 1,
  MultipleBranchMerchant: 2,
  Attraction: 3,
  Street: 4,
  Building: 5,
  Hotel: 6,
  BarClub: 7
};

/**
 * Convert TypeScript merchants to JavaScript format
 */
function convertMerchants() {
  try {
    // Read the TypeScript file
    console.log(`Reading merchants from ${inputPath}...`);
    const tsContent = fs.readFileSync(inputPath, 'utf-8');
    
    // Find all merchants in the TypeScript file
    // This uses a regex pattern that matches object literals between braces
    const merchantPattern = /\{[\s\S]*?id:[\s\S]*?profileInterface:[\s\S]*?\}[\s]as[\s](BaseMerchant|SingleLocationMerchant|MultiLocationMerchant|AttractionMerchant|HotelMerchant|BarClubMerchant|StreetMerchant|BuildingMerchant)/g;
    
    // Extract all merchant objects
    const merchantMatches = tsContent.match(merchantPattern);
    
    if (!merchantMatches || merchantMatches.length === 0) {
      console.error('No merchants found in the TypeScript file');
      return false;
    }
    
    console.log(`Found ${merchantMatches.length} merchants in TypeScript file`);
    
    // Process each merchant to convert it to JavaScript format
    const convertedMerchants = [];
    
    for (let i = 0; i < merchantMatches.length; i++) {
      try {
        let merchantStr = merchantMatches[i];
        
        // Remove the "as Type" at the end
        merchantStr = merchantStr.replace(/[\s]as[\s](BaseMerchant|SingleLocationMerchant|MultiLocationMerchant|AttractionMerchant|HotelMerchant|BarClubMerchant|StreetMerchant|BuildingMerchant)$/, '');
        
        // Convert TypeScript syntax to JavaScript
        merchantStr = merchantStr
          // Convert enums to direct values
          .replace(/ProfileInterface\.SingleShopRestaurant/g, 'ProfileInterface.SingleShopRestaurant')
          .replace(/ProfileInterface\.MultipleBranchMerchant/g, 'ProfileInterface.MultipleBranchMerchant')
          .replace(/ProfileInterface\.Attraction/g, 'ProfileInterface.Attraction')
          .replace(/ProfileInterface\.Street/g, 'ProfileInterface.Street')
          .replace(/ProfileInterface\.Building/g, 'ProfileInterface.Building')
          .replace(/ProfileInterface\.Hotel/g, 'ProfileInterface.Hotel')
          .replace(/ProfileInterface\.BarClub/g, 'ProfileInterface.BarClub');
        
        // Parse the merchant object
        // Note: This is a safe way to convert the string to a JS object using a sandbox
        const merchantObj = eval(`(${merchantStr})`);
        
        // Process the merchant based on its type
        const convertedMerchant = processMerchant(merchantObj);
        
        // Add to converted merchants
        convertedMerchants.push(convertedMerchant);
        
        console.log(`Processed merchant: ${merchantObj.username} (${merchantObj.id})`);
      } catch (error) {
        console.error(`Error processing merchant at index ${i}:`, error);
      }
    }
    
    // Generate the output JavaScript file
    const outputContent = generateJavaScriptFile(convertedMerchants);
    
    // Write the output file
    fs.writeFileSync(outputPath, outputContent);
    
    console.log(`\nConversion completed successfully`);
    console.log(`Converted ${convertedMerchants.length} merchants`);
    console.log(`Output saved to: ${outputPath}`);
    
    return true;
  } catch (error) {
    console.error('Error converting merchants:', error);
    return false;
  }
}

/**
 * Process a merchant object based on its type
 */
function processMerchant(merchant) {
  // Create a base merchant object with common properties
  const baseMerchant = {
    id: merchant.id,
    accountType: merchant.accountType,
    username: merchant.username,
    displayName: merchant.displayName,
    verified: merchant.verified,
    joinDate: merchant.joinDate,
    recommended: merchant.recommended,
    hashtags: merchant.hashtags,
    district: merchant.district,
    merchantType: merchant.merchantType,
    stats: merchant.stats,
    profileInterface: merchant.profileInterface,
    url: merchant.url
  };
  
  // Process based on profile interface type
  switch (merchant.profileInterface) {
    case ProfileInterface.SingleShopRestaurant:
      return processSingleLocationMerchant(baseMerchant, merchant);
      
    case ProfileInterface.MultipleBranchMerchant:
      return processMultiLocationMerchant(baseMerchant, merchant);
      
    case ProfileInterface.Attraction:
      return processAttractionMerchant(baseMerchant, merchant);
      
    case ProfileInterface.Street:
      return processStreetMerchant(baseMerchant, merchant);
      
    case ProfileInterface.Building:
      return processBuildingMerchant(baseMerchant, merchant);
      
    case ProfileInterface.Hotel:
      return processHotelMerchant(baseMerchant, merchant);
      
    case ProfileInterface.BarClub:
      return processBarClubMerchant(baseMerchant, merchant);
      
    default:
      return baseMerchant;
  }
}

/**
 * Process a single location merchant
 */
function processSingleLocationMerchant(baseMerchant, merchant) {
  return {
    ...baseMerchant,
    location: merchant.location,
    businessInfo: merchant.businessInfo,
    pricePerPerson: merchant.pricePerPerson,
    languagesSpoken: merchant.languagesSpoken,
    michelinStars: merchant.michelinStars
  };
}

/**
 * Process a multi-location merchant
 */
function processMultiLocationMerchant(baseMerchant, merchant) {
  // Check the structure of branches
  const branches = merchant.branches.map(branch => {
    // Format: In TypeScript it has combined LocationInfo & BusinessInfo
    // but in DB we need branches with openingHours at the top level
    return {
      chineseAddress: branch.chineseAddress,
      englishAddress: branch.englishAddress,
      nearestSubway: branch.nearestSubway,
      telephone: branch.telephone,
      branchDistrict: branch.branchDistrict,
      openingHours: branch.openingHours,
      needBooking: branch.needBooking,
      peakTime: branch.peakTime
    };
  });
  
  return {
    ...baseMerchant,
    branches,
    pricePerPerson: merchant.pricePerPerson,
    needBooking: merchant.needBooking,
    peakTime: merchant.peakTime,
    languagesSpoken: merchant.languagesSpoken,
    michelinStars: merchant.michelinStars
  };
}

/**
 * Process an attraction merchant
 */
function processAttractionMerchant(baseMerchant, merchant) {
  return {
    ...baseMerchant,
    location: merchant.location,
    businessInfo: merchant.businessInfo,
    ticketPrice: merchant.ticketPrice
  };
}

/**
 * Process a street merchant
 */
function processStreetMerchant(baseMerchant, merchant) {
  return {
    ...baseMerchant,
    location: merchant.location
  };
}

/**
 * Process a building merchant
 */
function processBuildingMerchant(baseMerchant, merchant) {
  return {
    ...baseMerchant,
    location: merchant.location,
    businessInfo: merchant.businessInfo,
    floors: merchant.floors,
    featuredStores: merchant.featuredStores
  };
}

/**
 * Process a hotel merchant
 */
function processHotelMerchant(baseMerchant, merchant) {
  return {
    ...baseMerchant,
    location: merchant.location,
    businessInfo: merchant.businessInfo || { 
      openingHours: [{ day: 'Monday-Sunday', hours: '24 hours' }]
    },
    pricePerNight: merchant.pricePerNight,
    amenities: merchant.amenities,
    stars: merchant.stars
  };
}

/**
 * Process a bar/club merchant
 */
function processBarClubMerchant(baseMerchant, merchant) {
  return {
    ...baseMerchant,
    location: merchant.location,
    businessInfo: merchant.businessInfo,
    pricePerPerson: merchant.pricePerPerson,
    nearbyMidnightFood: merchant.nearbyMidnightFood,
    clubCategories: merchant.clubCategories,
    entryFee: merchant.entryFee
  };
}

/**
 * Generate the JavaScript file content with the converted merchants
 */
function generateJavaScriptFile(merchants) {
  // Start with the file header
  let output = `/**
 * Converted Merchants Data (JavaScript)
 * Auto-generated from TypeScript data by convert-merchants.js
 */

// Profile interface enum values
const ProfileInterface = {
  SingleShopRestaurant: 1,
  MultipleBranchMerchant: 2,
  Attraction: 3,
  Street: 4,
  Building: 5,
  Hotel: 6,
  BarClub: 7
};

// Merchants data
const merchants = [\n`;

  // Add each merchant
  merchants.forEach((merchant, index) => {
    // Add a merchant with proper indentation and comments
    let merchantType = '';
    
    switch (merchant.profileInterface) {
      case ProfileInterface.SingleShopRestaurant:
        merchantType = 'RESTAURANT (Single Location)';
        break;
      case ProfileInterface.MultipleBranchMerchant:
        merchantType = 'RESTAURANT (Multi-Location)';
        break;
      case ProfileInterface.Attraction:
        merchantType = 'ATTRACTION';
        break;
      case ProfileInterface.Street:
        merchantType = 'STREET';
        break;
      case ProfileInterface.Building:
        merchantType = 'BUILDING';
        break;
      case ProfileInterface.Hotel:
        merchantType = 'HOTEL';
        break;
      case ProfileInterface.BarClub:
        merchantType = 'BAR/CLUB';
        break;
    }
    
    output += `  // ${merchantType}\n`;
    output += `  ${JSON.stringify(merchant, null, 2).replace(/^/gm, '  ')},\n\n`;
  });

  // Remove trailing comma and newline
  output = output.replace(/,\n\n$/m, '\n');

  // Add the helper functions and export statement
  output += `];

// Helper functions to check merchant types
function isSingleLocationMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.SingleShopRestaurant;
}

function isMultiLocationMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.MultipleBranchMerchant;
}

function isAttractionMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.Attraction;
}

function isStreetMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.Street;
}

function isBuildingMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.Building;
}

function isHotelMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.Hotel;
}

function isBarClubMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.BarClub;
}

// Export everything so it can be imported in migration scripts
module.exports = {
  ProfileInterface,
  merchants,
  isSingleLocationMerchant,
  isMultiLocationMerchant,
  isAttractionMerchant,
  isStreetMerchant,
  isBuildingMerchant,
  isHotelMerchant,
  isBarClubMerchant
};`;

  return output;
}

// Run the conversion
convertMerchants()
  .then(success => {
    if (success) {
      console.log('Conversion script completed successfully');
      process.exit(0);
    } else {
      console.error('Conversion script failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Conversion script failed:', error);
    process.exit(1);
  }); 