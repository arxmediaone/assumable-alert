import { NextResponse } from 'next/server';
import { getAllListings } from '@/lib/kv';

export const runtime = 'nodejs';

export async function GET() {
  const items = await getAllListings();
  if (!items.length) {
    const now = new Date().toISOString();
    return NextResponse.json([
      { listingId:'demo-1', address:'5402 Haven Oaks Dr', city:'Humble', county:'Harris County', state:'TX',
        price:315000, rate:3.25, type:'FHA', tags:'FHA,Assumable', note:'Assumable FHA @ 3.25%', img:'https://placehold.co/400x280', firstSeen:now }
    ]);
  }
  items.sort((a,b) => new Date(b.firstSeen||0).getTime() - new Date(a.firstSeen||0).getTime());
  return NextResponse.json(items);
}
