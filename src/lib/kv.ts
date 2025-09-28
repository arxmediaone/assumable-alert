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


}export async function getAllListings(): Promise<Listing[]> {
  const hash = await kv.hgetall<Record<string, unknown>>(KEY);
  if (!hash) return [];

  const out: Listing[] = [];
  for (const v of Object.values(hash)) {
    try {
      if (typeof v === 'string') {
        out.push(JSON.parse(v) as Listing);
      } else {
        out.push(v as Listing);
      }
    } catch {
      // Skip malformed values instead of breaking everything
      continue;
    }
  }
  return out;
}
