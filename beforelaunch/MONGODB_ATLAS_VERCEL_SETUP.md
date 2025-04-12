# MongoDB Atlas Setup for Vercel Deployment

## Overview

This document outlines the steps needed to prepare your MongoDB Atlas configuration for deploying your photo sharing application to Vercel.

## Development vs. Production MongoDB Access

### Development Environment
- **Current setup**: IP whitelisting for your development machine
- **Limitation**: Requires adding your IP address whenever your location/network changes
- **Purpose**: Provides high security during development

### Production Environment (Vercel)
- **Challenge**: Vercel uses serverless functions with dynamic, unpredictable IP addresses
- **Solution**: Configure MongoDB Atlas to accept connections from Vercel's dynamic IPs

## Setup Instructions for Vercel Deployment

### 1. Configure MongoDB Atlas Network Access

The simplest approach for Vercel deployments:

1. **Open MongoDB Atlas dashboard**
2. **Navigate to Network Access**:
   - In the left sidebar, click "Network Access"
3. **Add IP Address**:
   - Click "Add IP Address" button
   - Select "Allow Access from Anywhere" (adds `0.0.0.0/0`)
   - Add comment: "Vercel Production" 
   - Click "Confirm"

### 2. Create a Dedicated Database User

For better security when using the open IP access:

1. **Navigate to Database Access**:
   - In the left sidebar, click "Database Access"
2. **Add New Database User**:
   - Click "Add New Database User"
   - Authentication method: "Password"
   - Username: Create a specific username for your production app (e.g., "vercel-app-user")
   - Password: Generate a strong, random password (save this securely!)
   - User Privileges: Select "Read and Write to Any Database" (or more restrictive if possible)
   - Click "Add User"

### 3. Get Your Connection String

1. **Return to Clusters**:
   - Click "Database" in the left sidebar
2. **Connect to Your Cluster**:
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<password>` with the password you created for the database user

### 4. Configure Vercel Environment Variables

1. **Add MongoDB Connection Info to Vercel**:
   - Open your Vercel dashboard
   - Select your project
   - Go to "Settings" → "Environment Variables"
   - Add the following variables:
     - `MONGODB_URI`: Your full connection string with password
     - `MONGODB_DB`: Your database name

2. **Additional Recommended Variables**:
   - `NODE_ENV`: Set to "production"
   - `FORCE_CLOUDINARY`: Set to "true" (if using Cloudinary)

### 5. Update Your MongoDB Connection Code

Ensure your connection code is optimized for Vercel's serverless environment:

```javascript
// In src/lib/db/mongodb.ts
export async function connectToDatabase(): Promise<{ db: Db; client: MongoClient }> {
  // Check for environment variables
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }
  
  if (!process.env.MONGODB_DB) {
    throw new Error('Please define the MONGODB_DB environment variable');
  }
  
  // If we already have a connection, use it (connection pooling)
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  
  // Optimize connection options for Vercel serverless functions
  const options = {
    // These settings help with Vercel's serverless environment
    tls: true,
    retryWrites: true,
    retryReads: true,
    maxPoolSize: 10,
    maxIdleTimeMS: 30000, // Keep connections alive for 30 seconds
    serverSelectionTimeoutMS: 5000, // Quick server selection for fast cold starts
  };
  
  // Connect to MongoDB
  try {
    const client = new MongoClient(process.env.MONGODB_URI, options);
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    
    // Cache the connection
    cachedClient = client;
    cachedDb = db;
    
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }
}
```

## Security Considerations

Since we're using `0.0.0.0/0` (allowing connections from anywhere), we need additional security measures:

1. **Strong Authentication**:
   - Use a complex, randomly generated password for your database user
   - Store this securely in Vercel's environment variables (never in code)

2. **Least Privilege Principle**:
   - Your database user should have only the permissions it needs
   - Consider creating separate users for different functions if needed

3. **Additional MongoDB Atlas Security Features** (depending on your plan):
   - Enable Advanced Security features if available
   - Set up database auditing to track access
   - Consider encryption at rest
   - Enable auto expiry for access from specific IPs when not needed

4. **Application Security Best Practices**:
   - Validate all inputs in your application
   - Use parameterized queries to prevent injection attacks
   - Implement proper error handling that doesn't leak database information

## Monitoring and Maintenance

After deployment:

1. **Monitor Database Performance**:
   - Set up MongoDB Atlas alerts for unusual activity
   - Regularly check the Atlas metrics dashboard

2. **Connection Management**:
   - Vercel's serverless functions can create many connections
   - Monitor connection counts in Atlas
   - Adjust your connection pooling settings if needed

3. **Regular Updates**:
   - Keep your MongoDB driver updated
   - Stay current with security best practices

## Alternative Approaches (For Future Reference)

If you need higher security in the future:

1. **MongoDB Atlas Data API** (Less code changes, better security):
   - Access MongoDB through HTTPS REST API
   - No direct database connection needed
   - Eliminates IP whitelisting concerns
   - Available on M0 free clusters and above

2. **MongoDB Private Endpoints** (Most secure, more complex):
   - Available on M10+ clusters
   - Creates secure connection between Vercel and MongoDB
   - No public internet exposure of your database
   - Requires additional configuration in both Vercel and Atlas

## Pre-Launch Checklist

Before going live:

- [ ] MongoDB Atlas whitelist includes `0.0.0.0/0`
- [ ] Dedicated database user created with strong password
- [ ] Connection string properly configured in Vercel environment variables
- [ ] Connection code optimized for serverless environment
- [ ] Test database operations in Vercel preview deployments
- [ ] MongoDB Atlas monitoring set up
- [ ] Backup strategy confirmed
- [ ] Performance tested with expected load 