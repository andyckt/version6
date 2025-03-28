import { NextResponse } from 'next/server';
import { merchants } from '@/data/merchants';

export async function GET() {
  return NextResponse.json(merchants);
} 