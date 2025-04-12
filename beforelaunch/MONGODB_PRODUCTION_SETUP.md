# MongoDB Atlas Production Setup Guide

## Overview

This document outlines the steps required to prepare your MongoDB Atlas configuration for moving from development to production for your photo sharing application.

## Current Development Setup

During development, you're using IP whitelisting, which means:
- Only IP addresses explicitly added to MongoDB Atlas Network Access can connect
- You need to update this list whenever your development environment's IP changes
- This is secure but not practical for a production application with multiple users

## Production Setup Options

### Option 1: IP Whitelist for Production Servers Only (Recommended for Most Deployments)

In production, your application architecture will be:
```
Users' Devices → Your Application Server → MongoDB Atlas
```

Users never connect directly to MongoDB. Only your server does, so:

1. **Determine your production server's IP address(es)**:
   - If using a cloud provider (AWS, GCP, Azure, etc.), the server will have either:
     - Static IP(s) - easiest to whitelist
     - Dynamic IP within a known range - whitelist the range

2. **Add your production server's IP(s) to MongoDB Atlas Network Access**:
   - Log in to MongoDB Atlas
   - Navigate to Network Access
   - Add the IP address(es) of your production server
   - Optionally, add a comment like "Production Server"

3. **Configure your production environment variables**:
   - Ensure your production server has the correct MongoDB connection string
   - Use environment secrets management appropriate to your hosting platform

### Option 2: Allow Access from Anywhere (Less Secure)

If your application servers have highly dynamic IPs or you're using serverless functions:

1. **Add `0.0.0.0/0` to the IP whitelist**:
   - This allows connections from any IP address
   - **Security warning**: This is less secure but still requires valid credentials

2. **Strengthen other security measures**:
   - Use very strong, unique passwords for database users
   - Create database users with minimum required permissions (read/write to specific collections)
   - Enable MongoDB Atlas Advanced Security features if available in your plan

### Option 3: Virtual Private Cloud (VPC) Peering (Most Secure)

For enterprise-grade security:

1. **Set up VPC peering between your cloud provider and MongoDB Atlas**:
   - Works with AWS, GCP, and Azure
   - Keeps all database traffic on private networks
   - Requires Atlas dedicated clusters (M10 or higher)

2. **Configure private endpoints**:
   - Set up private DNS
   - Update connection strings to use private endpoints

## Updating Your Application for Production

### Backend Connection Configuration

Modify `src/lib/db/mongodb.ts` to include TLS options for reliable connections in production:

```javascript
export async function connectToDatabase(): Promise<{ db: Db; client: MongoClient }> {
  // Check for environment variables
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }
  
  if (!process.env.MONGODB_DB) {
    throw new Error('Please define the MONGODB_DB environment variable');
  }
  
  // If we already have a connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  
  // Add connection options with better error handling
  const options = {
    // Add TLS options if needed for your Atlas configuration
    tls: true,
    // Disable in production, but may help during initial deployment troubleshooting
    // tlsAllowInvalidCertificates: process.env.NODE_ENV !== 'production',
    // tlsAllowInvalidHostnames: process.env.NODE_ENV !== 'production',
    
    // Add retry logic for better resilience
    serverSelectionTimeoutMS: 15000, // 15 seconds
    maxPoolSize: 10, // Maintain up to 10 socket connections
    retryWrites: true, 
    retryReads: true,
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

### Error Handling

Improve error handling in upload routes to give meaningful errors to users:

- In the upload API route, add better error logging with context
- Implement retry logic for transient connection issues
- Add health check endpoints to monitor database connectivity

## Production Database Maintenance

Once in production, regularly:

1. **Monitor database performance**:
   - Set up Atlas performance alerts
   - Watch for slow queries and optimize as needed

2. **Scale appropriately**:
   - Start with a smaller instance (M2/M5) and scale up as needed
   - Enable auto-scaling if available in your plan

3. **Regular backups**:
   - Verify automated backups are enabled and working
   - Periodically test backup restoration

4. **Security audits**:
   - Regularly review who has access to the database
   - Rotate credentials periodically
   - Check for new security features in Atlas

## Pre-Launch Checklist

Before launching to production:

- [ ] Production MongoDB URI and credentials are correctly set up
- [ ] Application server IP(s) are whitelisted in MongoDB Atlas
- [ ] Connection has been tested from production environment
- [ ] Database user has appropriate permissions (not admin)
- [ ] MongoDB connection includes proper error handling and retry logic
- [ ] Connection pooling is configured appropriately
- [ ] Monitoring and alerts are set up

## Common Issues and Solutions

### Connection Timeout
- **Symptom**: Server can't establish connection to MongoDB
- **Solution**: Verify IP whitelisting, check network rules on server side

### Authentication Failed
- **Symptom**: Connection established but login fails
- **Solution**: Verify username, password, and authentication database

### Slow Connections
- **Symptom**: Database operations take too long
- **Solution**: Check Atlas metrics, review indexes, consider upgrading cluster

## Contact and Support

- MongoDB Atlas Support: https://support.mongodb.com
- MongoDB Connection Issues Documentation: https://docs.mongodb.com/manual/reference/connection-string/ 