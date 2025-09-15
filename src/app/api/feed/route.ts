import { NextResponse } from 'next/server';

export async function GET() {
  const now = new Date().toISOString();
  return NextResponse.json([
    {
      listingId: 'HAR-5402-HAVEN-OAKS',
      address: '5402 Haven Oaks Dr',
      city: 'Humble',
      county: 'Harris County',
      state: 'TX',
      price: 315000,
      rate: 3.25,
      type: 'FHA',
      tags: 'FHA,Assumable',
      note: 'Assumable FHA @ 3.25%',
      url: '#',
      img: 'https://placehold.co/400x280',
      firstSeen: now
    },
    {
      listingId: 'MC-25130-FALCON-CASTLE',
      address: '25130 Falcon Castle Ln',
      city: 'Porter',
      county: 'Montgomery County',
      state: 'TX',
      price: 369000,
      rate: 3.375,
      type: 'FHA',
      tags: 'FHA,Assumable',
      note: 'FHA assumable 3.375%',
      url: '#',
      img: 'https://placehold.co/400x280',
      firstSeen: now
    }
  ]);
}
