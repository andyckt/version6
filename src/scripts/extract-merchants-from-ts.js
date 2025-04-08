/**
 * Extract Merchants from TypeScript
 * 
 * This script extracts merchant data from merchants.ts and prepares it for import-merchants.js
 * 
 * Usage:
 * 1. Run this script: node src/scripts/extract-merchants-from-ts.js
 * 2. Then update REAL_MERCHANTS in import-merchants.js with the output
 */

const fs = require('fs');
const path = require('path');

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

// Helper functions
function isSingleLocationMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.SingleShopRestaurant;
}

function isMultiLocationMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.MultipleBranchMerchant;
}

// Extract merchants from TypeScript file
async function extractMerchants() {
  try {
    const tsFilePath = path.join(__dirname, '../data/merchants.ts');
    console.log(`Reading merchants from ${tsFilePath}...`);
    
    // Read the TypeScript file
    const fileContent = fs.readFileSync(tsFilePath, 'utf8');
    
    // Find merchant objects in the TypeScript file using regex
    // This pattern finds objects that include an 'id' property followed by other properties
    // and ends with "as TypeName"
    const merchantPattern = /\{[\s\S]*?id: \d+[\s\S]*?\}[\s]as[\s](BaseMerchant|SingleLocationMerchant|MultiLocationMerchant|AttractionMerchant|HotelMerchant|BarClubMerchant|StreetMerchant|BuildingMerchant)/g;
    
    const merchantMatches = fileContent.match(merchantPattern);
    
    if (!merchantMatches || merchantMatches.length === 0) {
      console.error('No merchants found in the TypeScript file');
      return false;
    }
    
    console.log(`Found ${merchantMatches.length} merchant objects`);
    
    // Process each merchant match
    const merchants = [];
    let nextId = 1; // Start ID counter
    
    for (let i = 0; i < merchantMatches.length; i++) {
      try {
        // Get the merchant string and remove the "as Type" suffix
        let merchantStr = merchantMatches[i];
        merchantStr = merchantStr.replace(/[\s]as[\s](BaseMerchant|SingleLocationMerchant|MultiLocationMerchant|AttractionMerchant|HotelMerchant|BarClubMerchant|StreetMerchant|BuildingMerchant)$/, '');
        
        // Replace TypeScript enum references with JavaScript object references
        merchantStr = merchantStr
          .replace(/ProfileInterface\.SingleShopRestaurant/g, 'ProfileInterface.SingleShopRestaurant')
          .replace(/ProfileInterface\.MultipleBranchMerchant/g, 'ProfileInterface.MultipleBranchMerchant')
          .replace(/ProfileInterface\.Attraction/g, 'ProfileInterface.Attraction')
          .replace(/ProfileInterface\.Street/g, 'ProfileInterface.Street')
          .replace(/ProfileInterface\.Building/g, 'ProfileInterface.Building')
          .replace(/ProfileInterface\.Hotel/g, 'ProfileInterface.Hotel')
          .replace(/ProfileInterface\.BarClub/g, 'ProfileInterface.BarClub');
        
        // Convert TypeScript object to JavaScript object
        // Note: This approach should be used carefully as eval can be risky
        // But in this controlled environment for data conversion, it's acceptable
        const merchantObj = eval(`(${merchantStr})`);
        
        // Process the merchant to ensure it has the correct structure
        // Reassign a new ID to avoid conflicts
        merchantObj.id = nextId++;
        
        // Add to merchants array
        merchants.push(merchantObj);
        
        console.log(`Processed merchant: ${merchantObj.username} (ID: ${merchantObj.id})`);
      } catch (error) {
        console.error(`Error processing merchant at index ${i}:`, error);
      }
    }
    
    // Generate JavaScript file with the extracted merchants
    const outputPath = path.join(__dirname, '../data/extracted-merchants.js');
    
    let output = `/**
 * Extracted Merchants from TypeScript
 * Generated on ${new Date().toLocaleString()}
 * 
 * To use these merchants:
 * 1. Copy the EXTRACTED_MERCHANTS array
 * 2. Replace the REAL_MERCHANTS array in import-merchants.js with this data
 * 3. Run import-merchants.js to import to database
 */

// Profile interface types
const ProfileInterface = {
  SingleShopRestaurant: 1,
  MultipleBranchMerchant: 2,
  Attraction: 3,
  Street: 4,
  Building: 5,
  Hotel: 6,
  BarClub: 7
};

// Extracted merchants from TypeScript file
const EXTRACTED_MERCHANTS = ${JSON.stringify(merchants, null, 2)
  .replace(/"ProfileInterface\.SingleShopRestaurant"/g, 'ProfileInterface.SingleShopRestaurant')
  .replace(/"ProfileInterface\.MultipleBranchMerchant"/g, 'ProfileInterface.MultipleBranchMerchant')
  .replace(/"ProfileInterface\.Attraction"/g, 'ProfileInterface.Attraction')
  .replace(/"ProfileInterface\.Street"/g, 'ProfileInterface.Street')
  .replace(/"ProfileInterface\.Building"/g, 'ProfileInterface.Building')
  .replace(/"ProfileInterface\.Hotel"/g, 'ProfileInterface.Hotel')
  .replace(/"ProfileInterface\.BarClub"/g, 'ProfileInterface.BarClub')};

// Instructions for import:
// 1. Copy the EXTRACTED_MERCHANTS array
// 2. Paste it into import-merchants.js to replace the REAL_MERCHANTS array
// 3. Run import-merchants.js to import the merchants to the database

// Export the merchants for use in other scripts
module.exports = {
  ProfileInterface,
  EXTRACTED_MERCHANTS
};
`;
    
    fs.writeFileSync(outputPath, output);
    
    console.log(`\nSuccessfully extracted ${merchants.length} merchants`);
    console.log(`Output saved to: ${outputPath}`);
    
    console.log('\nNext steps:');
    console.log('1. Open src/data/extracted-merchants.js');
    console.log('2. Copy the EXTRACTED_MERCHANTS array');
    console.log('3. Replace the REAL_MERCHANTS array in import-merchants.js with this data');
    console.log('4. Run import-merchants.js to import the merchants to your database');
    
    return true;
  } catch (error) {
    console.error('Error extracting merchants:', error);
    return false;
  }
}

// Run the extraction
extractMerchants()
  .then(success => {
    if (success) {
      console.log('Merchant extraction completed successfully');
      process.exit(0);
    } else {
      console.error('Merchant extraction failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Script error:', error);
    process.exit(1);
  }); 