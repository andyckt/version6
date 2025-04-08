// Direct merchant migration script using CommonJS
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB connection string from .env file or default
require('dotenv').config();
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db-name';

// ProfileInterface enum (duplicate for direct access)
const ProfileInterface = {
  SingleShopRestaurant: 1,
  MultipleBranchMerchant: 2,
  Attraction: 3,
  Street: 4,
  Building: 5,
  Hotel: 6,
  BarClub: 7
};

async function migrateMerchants() {
  console.log('Starting direct merchant migration...');
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB database');
    
    const db = client.db();
    const merchantsCollection = db.collection('merchants');
    
    // Check if collection already has merchants
    const existingCount = await merchantsCollection.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already contains ${existingCount} merchants`);
      const force = process.argv.includes('--force');
      
      if (!force) {
        const readline = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        const answer = await new Promise(resolve => {
          readline.question('Do you want to delete existing merchants and re-import? (y/N): ', resolve);
        });
        
        readline.close();
        
        if (answer.toLowerCase() !== 'y') {
          console.log('Migration aborted');
          return;
        }
      }
      
      // Delete existing merchants
      await merchantsCollection.deleteMany({});
      console.log('Deleted existing merchants');
    }
    
    // Read the dummy data from our JSON file
    const sampleData = require('../data/sampleMerchants.json');
    console.log(`Found ${sampleData.length} sample merchants to migrate`);
    
    // Extract the real data from the merchants.ts file
    const merchantsFilePath = path.join(process.cwd(), 'src', 'data', 'merchants.ts');
    const fileContent = fs.readFileSync(merchantsFilePath, 'utf8');
    
    // Extract merchant objects
    const merchants = [];
    
    // Use regex to find merchant objects
    const merchantRegex = /\{\s*id:\s*(\d+),\s*accountType:\s*['"]([^'"]+)['"]/g;
    let match;
    const merchantStartPositions = [];
    
    while ((match = merchantRegex.exec(fileContent)) !== null) {
      merchantStartPositions.push(match.index);
    }
    
    // Parse each merchant object
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
      
      try {
        // Extract basic properties using regex
        const idMatch = merchantStr.match(/id:\s*(\d+)/);
        const usernameMatch = merchantStr.match(/username:\s*['"]([^'"]+)['"]/);
        const accountTypeMatch = merchantStr.match(/accountType:\s*['"]([^'"]+)['"]/);
        const displayNameMatch = merchantStr.match(/displayName:\s*['"]([^'"]+)['"]/);
        const interfaceMatch = merchantStr.match(/profileInterface:\s*ProfileInterface\.([a-zA-Z]+)/);
        
        if (idMatch && usernameMatch && accountTypeMatch && displayNameMatch && interfaceMatch) {
          const id = parseInt(idMatch[1]);
          const username = usernameMatch[1];
          const accountType = accountTypeMatch[1];
          const displayName = displayNameMatch[1];
          const interfaceName = interfaceMatch[1];
          const profileInterface = ProfileInterface[interfaceName];
          
          // Create merchant object using direct evaluation
          // WARNING: This is for development use only, never use in production
          // with untrusted input
          const merchantRaw = merchantStr
            // Replace ProfileInterface with numbers
            .replace(/ProfileInterface\.SingleShopRestaurant/g, '1')
            .replace(/ProfileInterface\.MultipleBranchMerchant/g, '2')
            .replace(/ProfileInterface\.Attraction/g, '3')
            .replace(/ProfileInterface\.Street/g, '4')
            .replace(/ProfileInterface\.Building/g, '5')
            .replace(/ProfileInterface\.Hotel/g, '6')
            .replace(/ProfileInterface\.BarClub/g, '7')
            // Convert TypeScript type casts
            .replace(/\s+as\s+[a-zA-Z]+/g, '');
          
          // Dangerous but effective for our controlled dev environment
          const merchant = eval(`(${merchantRaw})`);
          
          // Add MongoDB specific fields
          merchant.lastUpdated = new Date();
          merchant.isActive = true;
          
          merchants.push(merchant);
          console.log(`Parsed merchant: ${displayName} (${username})`);
        }
      } catch (error) {
        console.error(`Error parsing merchant at position ${start}:`, error);
      }
    }
    
    console.log(`Successfully parsed ${merchants.length} merchants`);
    
    // Insert all merchants
    if (merchants.length > 0) {
      const result = await merchantsCollection.insertMany(merchants);
      console.log(`Inserted ${result.insertedCount} merchants into the database`);
      
      // Create indexes for better performance
      await merchantsCollection.createIndex({ username: 1 }, { unique: true });
      await merchantsCollection.createIndex({ displayName: 'text', username: 'text', hashtags: 'text' });
      await merchantsCollection.createIndex({ accountType: 1 });
      await merchantsCollection.createIndex({ district: 1 });
      await merchantsCollection.createIndex({ profileInterface: 1 });
      console.log('Created database indexes');
    }
    
    console.log('Migration completed successfully');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run migration
migrateMerchants().catch(console.error); 