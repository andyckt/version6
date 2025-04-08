import { NextResponse } from 'next/server';
import { updateMerchant, deleteMerchant, getMerchantById } from '@/lib/merchantRepository';

// Update merchant
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const idStr = params.id;
  const id = parseInt(idStr, 10);
  
  // Check if ID is a valid number
  if (isNaN(id)) {
    return NextResponse.json(
      { error: 'Invalid merchant ID' },
      { status: 400 }
    );
  }
  
  try {
    // Get merchant data from request body
    const updatedMerchant = await request.json();
    
    // Validate that the merchant ID in the URL matches the one in the request body
    if (updatedMerchant.id !== id) {
      return NextResponse.json(
        { error: 'Merchant ID mismatch' },
        { status: 400 }
      );
    }
    
    // First check if the merchant exists
    const existingMerchant = await getMerchantById(id);
    if (!existingMerchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }
    
    // Update the merchant
    const result = await updateMerchant(updatedMerchant);
    
    // Return the updated merchant
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error updating merchant with ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete merchant
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const idStr = params.id;
  const id = parseInt(idStr, 10);
  
  // Check if ID is a valid number
  if (isNaN(id)) {
    return NextResponse.json(
      { error: 'Invalid merchant ID' },
      { status: 400 }
    );
  }
  
  try {
    // First check if the merchant exists
    const existingMerchant = await getMerchantById(id);
    if (!existingMerchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }
    
    // Delete the merchant
    const success = await deleteMerchant(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete merchant' },
        { status: 500 }
      );
    }
    
    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting merchant with ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 