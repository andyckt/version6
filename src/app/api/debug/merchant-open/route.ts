import { NextResponse } from 'next/server';
import { isMerchantOpen, getMerchantById } from '@/data/merchants';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });
  }
  
  const merchantId = parseInt(id);
  const merchant = getMerchantById(merchantId);
  
  if (!merchant) {
    return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
  }
  
  const isOpen = isMerchantOpen(merchant);
  
  return NextResponse.json({
    id: merchantId,
    username: merchant.username,
    displayName: merchant.displayName,
    isOpen
  });
} 