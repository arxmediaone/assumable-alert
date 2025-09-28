// src/app/api/feed/route.ts
import { NextResponse } from 'next/server';
import { getAllListings } from '@/lib/kv';

export const dynamic = 'force-dynamic';

export async function GET() {
  const listings = await getAllListings(); // already real objects
  // (optional) newest first here, so clients don’t have to sort
  listings.sort((a, b) => {
    const ta = a.firstSeen ? Date.parse(a.firstSeen) : 0;
    const tb = b.firstSeen ? Date.parse(b.firstSeen) : 0;
    return tb - ta;
  });
  return NextResponse.json({ listings });
}
