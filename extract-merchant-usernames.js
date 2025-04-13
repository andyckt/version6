// Script to extract all merchant usernames and save to a markdown file
const { MongoClient } = require('mongodb');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

// MongoDB Connection URI from environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
const outputFile = 'merchant-usernames.md';

// Function to extract merchant usernames and save to markdown
async function extractMerchantUsernames() {
  // Check if MongoDB URI and DB name are available
  if (!uri || !dbName) {
    console.error('MongoDB URI or DB name is missing in environment variables');
    process.exit(1);
  }

  // Create a new MongoDB client
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    // Access the database and collection
    const db = client.db(dbName);
    const merchantsCollection = db.collection('merchants');

    // Get all merchants and sort them by username
    const merchants = await merchantsCollection
      .find({}, { projection: { username: 1, displayName: 1 } })
      .sort({ username: 1 })
      .toArray();

    console.log(`Found ${merchants.length} merchants`);

    // Create markdown content
    let markdownContent = '# Merchant Usernames\n\n';
    markdownContent += 'List of all merchant usernames in the database:\n\n';
    
    merchants.forEach((merchant, index) => {
      if (merchant.username) {
        markdownContent += `${index + 1}. @${merchant.username}`;
        if (merchant.displayName) {
          markdownContent += ` - ${merchant.displayName}`;
        }
        markdownContent += '\n';
      }
    });

    // Write to markdown file
    fs.writeFileSync(outputFile, markdownContent);
    console.log(`Markdown file created: ${outputFile}`);

  } catch (error) {
    console.error('Error extracting merchant usernames:', error);
  } finally {
    // Close the client connection
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
extractMerchantUsernames().catch(console.error); 