import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { MerchantModel, MERCHANT_COLLECTION, MERCHANT_DETAIL_COLLECTION } from '@/models/Merchant';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/auth';

// Admin-only API route for merchant management

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  let client: MongoClient | null = null;
  
  try {
    // Check if user is admin (implement your own auth check)
    const isAdminUser = await isAdmin(request);
    
    if (!isAdminUser) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    const id = parseInt(params.id);
    
    // Check if id is a valid number
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid merchant ID' },
        { status: 400 }
      );
    }
    
    // Get MongoDB URI from environment variable
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('Please add your MongoDB URI to .env.local');
    }
    
    // Create a new MongoDB client
    client = new MongoClient(uri);
    
    // Connect to the MongoDB server
    await client.connect();
    
    // Get the database
    const db = client.db('bobe');
    
    const merchantsCollection = db.collection<MerchantModel>(MERCHANT_COLLECTION);
    const merchantDetailsCollection = db.collection(MERCHANT_DETAIL_COLLECTION);
    
    // Find the merchant to get its details ID
    const merchant = await merchantsCollection.findOne({ id });
    
    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }
    
    // Delete merchant details first if they exist
    if (merchant.merchantDetailsId) {
      await merchantDetailsCollection.deleteOne({ _id: merchant.merchantDetailsId });
    }
    
    // Delete the merchant
    const result = await merchantsCollection.deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to delete merchant' },
        { status: 500 }
      );
    }
    
    // Invalidate cache for API routes
    try {
      const { invalidateMerchantListCache, invalidateMerchantDetailCache } = await import('@/services/merchantCache');
      await invalidateMerchantListCache();
      
      if (merchant.username) {
        await invalidateMerchantDetailCache(merchant.username);
      }
      
      // Also revalidate any related pages
      revalidatePath('/merchants');
      revalidatePath(`/merchants/${merchant.username}`);
      revalidatePath('/admin/merchants');
    } catch (err) {
      console.error('Failed to invalidate cache:', err);
    }
    
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('Error deleting merchant:', error);
    return NextResponse.json(
      { error: 'Failed to delete merchant', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  let client: MongoClient | null = null;
  
  try {
    // Check if user is admin (implement your own auth check)
    const isAdminUser = await isAdmin(request);
    
    if (!isAdminUser) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    const id = parseInt(params.id);
    
    // Check if id is a valid number
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid merchant ID' },
        { status: 400 }
      );
    }
    
    // Parse the request body
    const updates = await request.json();
    
    if (!updates) {
      return NextResponse.json(
        { error: 'No update data provided' },
        { status: 400 }
      );
    }
    
    // Get MongoDB URI from environment variable
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('Please add your MongoDB URI to .env.local');
    }
    
    // Create a new MongoDB client
    client = new MongoClient(uri);
    
    // Connect to the MongoDB server
    await client.connect();
    
    // Get the database
    const db = client.db('bobe');
    
    const merchantsCollection = db.collection<MerchantModel>(MERCHANT_COLLECTION);
    const merchantDetailsCollection = db.collection(MERCHANT_DETAIL_COLLECTION);
    
    // Find the merchant to get its details ID
    const merchant = await merchantsCollection.findOne({ id });
    
    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }
    
    // Extract merchant base data and details data
    const { 
      // Fields for merchant details based on type
      location, 
      businessInfo, 
      branches, 
      ticketPrice, 
      pricePerPerson,
      pricePerNight,
      languagesSpoken,
      michelinStars,
      floors,
      featuredStores,
      amenities,
      stars,
      nearbyMidnightFood,
      clubCategories,
      entryFee,
      // All other fields for base merchant
      ...baseUpdates 
    } = updates;
    
    // Prepare merchant details updates
    const detailsUpdates: any = {
      updatedAt: new Date()
    };
    
    // Add type-specific fields to details updates
    if (location !== undefined) detailsUpdates.location = location;
    if (businessInfo !== undefined) detailsUpdates.businessInfo = businessInfo;
    if (branches !== undefined) detailsUpdates.branches = branches;
    if (ticketPrice !== undefined) detailsUpdates.ticketPrice = ticketPrice;
    if (pricePerPerson !== undefined) detailsUpdates.pricePerPerson = pricePerPerson;
    if (pricePerNight !== undefined) detailsUpdates.pricePerNight = pricePerNight;
    if (languagesSpoken !== undefined) detailsUpdates.languagesSpoken = languagesSpoken;
    if (michelinStars !== undefined) detailsUpdates.michelinStars = michelinStars;
    if (floors !== undefined) detailsUpdates.floors = floors;
    if (featuredStores !== undefined) detailsUpdates.featuredStores = featuredStores;
    if (amenities !== undefined) detailsUpdates.amenities = amenities;
    if (stars !== undefined) detailsUpdates.stars = stars;
    if (nearbyMidnightFood !== undefined) detailsUpdates.nearbyMidnightFood = nearbyMidnightFood;
    if (clubCategories !== undefined) detailsUpdates.clubCategories = clubCategories;
    if (entryFee !== undefined) detailsUpdates.entryFee = entryFee;
    
    // Prepare base merchant updates with timestamp
    const merchantUpdates = {
      ...baseUpdates,
      updatedAt: new Date()
    };
    
    // Update merchant details if they exist
    if (merchant.merchantDetailsId && Object.keys(detailsUpdates).length > 1) {
      await merchantDetailsCollection.updateOne(
        { _id: merchant.merchantDetailsId },
        { $set: detailsUpdates }
      );
    }
    
    // Update base merchant
    if (Object.keys(merchantUpdates).length > 1) {
      await merchantsCollection.updateOne(
        { id },
        { $set: merchantUpdates }
      );
    }
    
    // Invalidate cache for API routes
    try {
      const { invalidateMerchantListCache, invalidateMerchantDetailCache } = await import('@/services/merchantCache');
      await invalidateMerchantListCache();
      
      if (merchant.username) {
        await invalidateMerchantDetailCache(merchant.username);
      }
      
      // Also revalidate any related pages
      revalidatePath('/merchants');
      revalidatePath(`/merchants/${merchant.username}`);
      revalidatePath('/admin/merchants');
    } catch (err) {
      console.error('Failed to invalidate cache:', err);
    }
    
    // Get the updated merchant
    const updatedMerchant = await merchantsCollection.findOne({ id });
    
    return NextResponse.json({ 
      success: true, 
      merchant: updatedMerchant 
    });
  } catch (error) {
    console.error('Error updating merchant:', error);
    return NextResponse.json(
      { error: 'Failed to update merchant', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  let client: MongoClient | null = null;
  
  try {
    // Check if user is admin (implement your own auth check)
    const isAdminUser = await isAdmin(request);
    
    if (!isAdminUser) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    const id = parseInt(params.id);
    
    // Check if id is a valid number
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid merchant ID' },
        { status: 400 }
      );
    }
    
    // Get MongoDB URI from environment variable
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('Please add your MongoDB URI to .env.local');
    }
    
    // Create a new MongoDB client
    client = new MongoClient(uri);
    
    // Connect to the MongoDB server
    await client.connect();
    
    // Get the database
    const db = client.db('bobe');
    
    const merchantsCollection = db.collection<MerchantModel>(MERCHANT_COLLECTION);
    const merchantDetailsCollection = db.collection(MERCHANT_DETAIL_COLLECTION);
    
    // Find the merchant
    const merchant = await merchantsCollection.findOne({ id });
    
    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }
    
    // Get merchant details if they exist
    let merchantDetails = null;
    if (merchant.merchantDetailsId) {
      merchantDetails = await merchantDetailsCollection.findOne({ _id: merchant.merchantDetailsId });
    }
    
    // Combine the data
    const merchantData = {
      ...merchant,
      ...(merchantDetails || {})
    };
    
    return NextResponse.json(merchantData);
  } catch (error) {
    console.error('Error retrieving merchant:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve merchant data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
} 