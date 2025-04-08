import { NextResponse } from 'next/server';
import { getMerchantCollection, AccountType } from '@/models/merchant';
import { ObjectId } from 'mongodb';

// Import sample data - we'll reconstruct this data properly
import sampleData from '@/data/sampleMerchants.json';

export async function POST(request: Request) {
  try {
    // Check for admin authorization (in a real app, you'd have proper auth)
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('apiKey');
    
    // Simple auth check - in production, use proper authentication
    // Temporarily use a hardcoded key for testing
    if (apiKey !== process.env.ADMIN_API_KEY && apiKey !== 'testkey123') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body to check if we should force reimport
    const { force = false } = await request.json().catch(() => ({}));
    
    // Get the merchants collection
    const collection = await getMerchantCollection();
    
    // Check if merchants already exist
    const existingCount = await collection.countDocuments();
    
    if (existingCount > 0 && !force) {
      return NextResponse.json({
        message: `Database already contains ${existingCount} merchants. Use force=true to reimport.`,
        success: false,
        count: existingCount
      });
    }
    
    // If forced or no existing merchants, clear the collection
    if (existingCount > 0) {
      await collection.deleteMany({});
    }
    
    // Reconstruct the merchants from sample data
    // This ensures proper MongoDB document structure
    const merchants = sampleData.map(sample => {
      // Extract the ObjectId string
      const idStr = sample._id?.$oid || new ObjectId().toString();
      
      // Recreate the document with proper MongoDB types
      return {
        _id: new ObjectId(idStr),
        id: sample.id,
        accountType: sample.accountType,
        username: sample.username,
        displayName: sample.displayName,
        verified: sample.verified,
        joinDate: sample.joinDate,
        recommended: sample.recommended,
        hashtags: sample.hashtags,
        district: sample.district,
        merchantType: sample.merchantType,
        stats: sample.stats,
        profileInterface: sample.profileInterface,
        location: sample.location ? {
          chineseAddress: sample.location.chineseAddress,
          englishAddress: sample.location.englishAddress,
          nearestSubway: sample.location.nearestSubway,
          telephone: sample.location.telephone,
          branchDistrict: sample.location.branchDistrict
        } : undefined,
        businessInfo: sample.businessInfo ? {
          openingHours: sample.businessInfo.openingHours,
          peakTime: sample.businessInfo.peakTime
        } : undefined,
        pricePerPerson: sample.pricePerPerson,
        pricePerNight: sample.pricePerNight,
        stars: sample.stars,
        amenities: sample.amenities,
        languagesSpoken: sample.languagesSpoken,
        isActive: true,
        lastUpdated: new Date()
      };
    });
    
    // Insert merchants
    const result = await collection.insertMany(merchants as any);
    
    // Create indexes for better performance
    await collection.createIndex({ username: 1 }, { unique: true });
    await collection.createIndex({ displayName: 'text', username: 'text', hashtags: 'text' });
    await collection.createIndex({ accountType: 1 });
    await collection.createIndex({ district: 1 });
    await collection.createIndex({ profileInterface: 1 });
    
    return NextResponse.json({
      message: `Successfully imported ${result.insertedCount} merchants`,
      success: true,
      count: result.insertedCount
    });
    
  } catch (error) {
    console.error('Error importing merchants:', error);
    return NextResponse.json(
      { error: 'Failed to import merchants' },
      { status: 500 }
    );
  }
}

// Also allow GET requests to trigger import with query params
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('apiKey');
    const force = searchParams.get('force') === 'true';
    
    // Create a mock request with the parsed params
    const mockRequestBody = JSON.stringify({ force });
    const mockRequest = new Request(request.url, {
      method: 'POST',
      headers: request.headers,
      body: mockRequestBody
    });
    
    // Forward to the POST handler
    return POST(mockRequest);
  } catch (error) {
    console.error('Error in GET import:', error);
    return NextResponse.json(
      { error: 'Failed to process import request' },
      { status: 500 }
    );
  }
} 