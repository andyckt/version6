require('dotenv').config();
const { connectToDatabase } = require('./src/lib/mongodb');

async function listUsers() {
  try {
    const { db } = await connectToDatabase();
    console.log('Connected to MongoDB successfully');
    
    const users = await db.collection('users').find({}).toArray();
    
    console.log('\nUsers in MongoDB:');
    console.log('=================');
    users.forEach(user => {
      console.log(`ID: ${user._id}`);
      console.log(`Username: ${user.username}`);
      console.log(`Display Name: ${user.displayName}`);
      console.log(`Email: ${user.email}`);
      console.log(`Verified: ${user.verified}`);
      console.log('-------------------');
    });
    
    console.log(`Total users: ${users.length}`);
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    process.exit(0);
  }
}

listUsers(); 