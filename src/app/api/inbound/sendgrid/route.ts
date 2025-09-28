// src/app/api/inbound/sendgrid/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { addListing, type Listing } from '@/lib/kv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** ---------- small helpers ---------- */
function first(s: string, re: RegExp) {
  const m = s.match(re);
  return m?.[1]?.trim();
}

// stable, short hash for IDs
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

/** ---------- parser ---------- */
function parse(subject: string, body: string): { isAssumable: boolean; record: Listing } {
  const blob = `${subject}\n\n${body}`;

  // keywords: assumable, assumption, misspellings like "assumble"
  const isAssumable =
    /\bassum(?:able|ption|ble|mble)\b/i.test(blob) ||
    /\bva\s+assum/i.test(blob) ||
    /\bfha\s+assum/i.test(blob);

  // loan type
  const type: Listing['type'] =
    /\bva\b/i.test(blob) ? 'VA'
    : /\bfha\b/i.test(blob) ? 'FHA'
    : 'Other';

  // rate like "3.25%" or "rate: 2.9"
  const rate = (() => {
    const pct = first(blob, /\b(\d{1,2}(?:\.\d{1,3})?)\s*%/);
    if (pct) return parseFloat(pct);
    const bare = first(blob, /\brate[:\s-]*?(\d{1,2}(?:\.\d{1,3})?)\b/i);
    return bare ? parseFloat(bare) : undefined;
  })();

  // counties we care about
  const county =
    /\bharris\b/i.test(blob) ? 'Harris County'
    : /\bmontgomery\b/i.test(blob) ? 'Montgomery County'
    : first(blob, /\b(Harris County|Montgomery County)\b/i) || undefined;

  // address variants:
  //  - "Address: 123 Main St, Houston, TX 77002"
  //  - "123 Main St, Houston, TX"
  //  - "123 Main Street ..." (street suffixes)
  const address =
    first(blob, /(?:^|\n)\s*(?:Address|Property|Location)\s*:\s*(.+)$/mi) ||
    first(blob, /\b(\d{2,6}\s+[A-Za-z0-9.'\- ]+,\s*[A-Za-z.'\- ]+,\s*TX(?:\s*\d{5}(?:-\d{4})?)?)\b/m) ||
    first(blob, /\b(\d{2,6}\s+[A-Za-z0-9.'\- ]+(?:\s+(?:St|Street|Ave|Avenue|Blvd|Lane|Ln|Dr|Drive|Ct|Court|Way|Rd|Road))?[^\n,]*)/m) ||
    'Unknown address';

  // a listing URL if present (Zillow/MLS/etc)
  const url = first(blob, /(https?:\/\/[^\s>"]+)/i);

  // de-dupe ID: address + type + rounded rate (e.g. 3.25 -> 325)
  const rateKey = (rate != null ? Math.round(rate * 100) : 'na').toString();
  const idBasis = `${(address || '').toLowerCase()}|${type}|${rateKey}`;
  const listingId = `lid-${hash(idBasis)}`;

  const tags = [
    type,
    'Assumable',
    county?.includes('Harris') ? 'Harris' : undefined,
    county?.includes('Montgomery') ? 'Montgomery' : undefined,
  ].filter(Boolean).join(',');

  const record: Listing = {
    listingId,
    address,
    county,
    state: 'TX',
    rate,
    type,
    tags,
    note: subject || 'Assumable found via email',
    url: url || undefined,
  };

  return { isAssumable, record };
}

/** ---------- handlers ---------- */
export async function GET() {
  return NextResponse.json({ ok: true, route: '/api/inbound/sendgrid' });
}

export async function POST(req: NextRequest) {
  const ct = req.headers.get('content-type') || '';
  let subject = '';
  let body = '';

  try {
    if (ct.includes('multipart/form-data')) {
      // SendGrid Inbound Parse typically posts multipart with fields
      const form = await req.formData();
      subject = String(form.get('subject') || '');
      // prefer text, fall back to html if needed
      body = String(form.get('text') || form.get('html') || '');
    } else {
      // raw MIME message — we’ll grab Subject and keep whole thing as body
      const raw = await req.text();
      subject = first(raw, /^Subject:\s*(.+)$/mi) || '';
      body = raw;
    }
  } catch (e) {
    console.error('Inbound parse error:', e);
  }

  const { isAssumable, record } = parse(subject, body);

  if (isAssumable) {
    await addListing(record);
    console.log('Saved listing:', record.listingId, record.address);
  } else {
    console.log('Skipped (no assumable keyword):', subject);
  }

  return NextResponse.json({ ok: true, stored: isAssumable ? 1 : 0 });
}
