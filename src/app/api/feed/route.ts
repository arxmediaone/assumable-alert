// src/app/api/feed/route.ts
import { NextResponse } from 'next/server';
import { getAllListings } from '@/lib/kv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const listings = await getAllListings(); // <-- tolerant reader
    return NextResponse.json({ listings });
  } catch (e: any) {
    return NextResponse.json(
      { error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
