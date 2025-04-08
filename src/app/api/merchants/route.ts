import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Helper function to read merchants data
async function readMerchantsData() {
  const filePath = path.join(process.cwd(), 'src/data/merchants.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

// Helper function to write merchants data
async function writeMerchantsData(data: any) {
  const filePath = path.join(process.cwd(), 'src/data/merchants.json');
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const data = await readMerchantsData();
    return NextResponse.json(data.merchants);
  } catch (error) {
    console.error('Error reading merchants:', error);
    return NextResponse.json({ error: 'Failed to fetch merchants' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newMerchant = await request.json();
    const data = await readMerchantsData();
    
    // Generate new ID
    const maxId = data.merchants.length > 0 
      ? Math.max(...data.merchants.map((m: any) => m.id))
      : 0;
    
    // Add the new merchant
    const merchantToAdd = {
      ...newMerchant,
      id: maxId + 1
    };
    
    data.merchants.push(merchantToAdd);
    
    // Save the updated data
    await writeMerchantsData(data);
    
    return NextResponse.json({ success: true, merchant: merchantToAdd });
  } catch (error) {
    console.error('Error creating merchant:', error);
    return NextResponse.json({ error: 'Failed to create merchant' }, { status: 500 });
  }
} 