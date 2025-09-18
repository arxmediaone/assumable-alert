import { kv } from '@vercel/kv';
export type Listing = {
  listingId: string;
  address: string;
  city?: string;
  county?: string;
  state?: string;
  price?: number;
  rate?: number;
  type?: 'FHA' | 'VA' | 'Other';
  tags?: string;
  note?: string;
  url?: string;
  img?: string;
  firstSeen?: string;
};

const KEY = 'listings:v1';

export async function addListing(item: Listing) {
  const now = new Date().toISOString();
  const rec = { ...item, firstSeen: item.firstSeen ?? now };
  await kv.hset(KEY, { [rec.listingId]: JSON.stringify(rec) });
}

export async function getAllListings(): Promise<Listing[]> {
  // T is the ENTIRE record shape
  const hash = await kv.hgetall<Record<string, string>>(KEY);
  if (!hash) return [];
  return Object.values(hash).map((s) => JSON.parse(s) as Listing);
}