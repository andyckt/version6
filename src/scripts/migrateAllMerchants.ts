import { getMerchantCollection, convertToMongoDocument } from '@/models/merchant';
import { ProfileInterface, AccountType } from '@/data/merchants';
import fs from 'fs';
import path from 'path';

async function migrateAllMerchants() {
  try {
    console.log('Starting merchant data migration...');
    
    // Read the merchants.ts file as a string
    const merchantsFilePath = path.join(process.cwd(), 'src', 'data', 'merchants.ts');
    const fileContent = fs.readFileSync(merchantsFilePath, 'utf8');
    
    // Extract all merchant objects using regex pattern matching
    // This regex looks for objects that match our merchant pattern
    const merchantRegex = /\{\s*id:\s*(\d+),\s*accountType:\s*['"]([^'"]+)['"]/g;
    let match;
    const merchantStartPositions: number[] = [];
    
    while ((match = merchantRegex.exec(fileContent)) !== null) {
      merchantStartPositions.push(match.index);
    }
    
    // Parse each merchant object
    const merchants = [];
    for (let i = 0; i < merchantStartPositions.length; i++) {
      const start = merchantStartPositions[i];
      // Find the end of the object by balancing brackets
      let brackets = 0;
      let end = start;
      
      for (let j = start; j < fileContent.length; j++) {
        if (fileContent[j] === '{') brackets++;
        if (fileContent[j] === '}') brackets--;
        
        if (brackets === 0 && fileContent[j] === '}') {
          // Found the closing bracket of the merchant object
          end = j + 1;
          break;
        }
      }
      
      // Extract the merchant object string
      const merchantStr = fileContent.substring(start, end);
      
      // Convert to proper object using Function constructor
      // This is safer than eval but still requires careful input validation
      try {
        // Extract ID and other basic info using regex for safer parsing
        const idMatch = merchantStr.match(/id:\s*(\d+)/);
        const usernameMatch = merchantStr.match(/username:\s*['"]([^'"]+)['"]/);
        const accountTypeMatch = merchantStr.match(/accountType:\s*['"]([^'"]+)['"]/);
        const displayNameMatch = merchantStr.match(/displayName:\s*['"]([^'"]+)['"]/);
        
        if (idMatch && usernameMatch && accountTypeMatch && displayNameMatch) {
          const id = parseInt(idMatch[1]);
          const username = usernameMatch[1];
          const accountType = accountTypeMatch[1] as AccountType;
          const displayName = displayNameMatch[1];
          
          // Create a base merchant object with the extracted properties
          const merchant: any = {
            id,
            username,
            accountType,
            displayName,
            // Parse other properties based on accountType and object structure
            // This is a simplified approach - in a real implementation, you'd need more robust parsing
          };
          
          // Extract the ProfileInterface
          const interfaceMatch = merchantStr.match(/profileInterface:\s*ProfileInterface\.([a-zA-Z]+)/);
          if (interfaceMatch) {
            const interfaceName = interfaceMatch[1];
            merchant['profileInterface'] = ProfileInterface[interfaceName as keyof typeof ProfileInterface];
          }
          
          // For each property we want to extract, use regex to find it
          const props = [
            'verified', 'joinDate', 'recommended', 'hashtags', 'district', 'merchantType', 
            'url', 'stats', 'location', 'businessInfo', 'pricePerPerson', 'pricePerNight',
            'ticketPrice', 'languagesSpoken', 'michelinStars', 'branches', 'amenities',
            'stars', 'clubCategories', 'entryFee', 'floors', 'featuredStores', 'nearbyMidnightFood'
          ];
          
          // Use Function constructor to evaluate the object string safely
          // This requires careful input validation
          const merchantObj = new Function(`
            const ProfileInterface = ${JSON.stringify(ProfileInterface)};
            return ${merchantStr};
          `)();
          
          // Merge the evaluated object with our base merchant
          Object.assign(merchant, merchantObj);
          
          merchants.push(merchant);
          console.log(`Parsed merchant: ${displayName} (${username})`);
        }
      } catch (error) {
        console.error(`Error parsing merchant at position ${start}:`, error);
      }
    }
    
    console.log(`Found ${merchants.length} merchants to migrate`);
    
    // Get MongoDB collection
    const collection = await getMerchantCollection();
    
    // Check if we already have the merchants in the database
    const existing = await collection.countDocuments();
    if (existing > 0) {
      console.log(`Database already contains ${existing} merchants`);
      const confirmation = process.argv.includes('--force') ? 'y' : 
        require('readline').createInterface({
          input: process.stdin,
          output: process.stdout,
        }).question('Do you want to delete existing merchants and re-import? (y/N): ');
      
      if (confirmation.toLowerCase() !== 'y') {
        console.log('Migration aborted');
        process.exit(0);
      }
      
      // Delete existing merchants
      await collection.deleteMany({});
      console.log('Existing merchants deleted');
    }
    
    // Convert and insert all merchants
    const merchantDocs = merchants.map(merchant => convertToMongoDocument(merchant));
    const result = await collection.insertMany(merchantDocs as any);
    
    console.log(`Successfully migrated ${result.insertedCount} merchants to database`);
    
    // Create indexes for better search performance
    await collection.createIndex({ username: 1 }, { unique: true });
    await collection.createIndex({ displayName: 'text', username: 'text', hashtags: 'text' });
    await collection.createIndex({ accountType: 1 });
    await collection.createIndex({ district: 1 });
    await collection.createIndex({ profileInterface: 1 });
    
    console.log('Created database indexes');
    console.log('Migration completed successfully');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run migration
migrateAllMerchants(); 