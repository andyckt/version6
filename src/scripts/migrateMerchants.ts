import { merchants } from '../data/merchants';
import { migrateAllMerchants } from '../lib/merchantRepository';

async function migrate() {
  console.log(`Starting migration of ${merchants.length} merchants to MongoDB...`);
  
  try {
    const insertedCount = await migrateAllMerchants(merchants);
    console.log(`Successfully migrated ${insertedCount} merchants to MongoDB!`);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrate()
  .then(() => {
    console.log('Migration completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Unexpected error during migration:', error);
    process.exit(1);
  }); 