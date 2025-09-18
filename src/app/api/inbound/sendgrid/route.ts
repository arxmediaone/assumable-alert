// 1) Make "type" a proper union, not a plain string
import { addListing, type Listing } from '@/lib/kv';  // <-- import Listing type

// ...

function parse(subject: string, body: string): { isAssumable: boolean; record: Listing } {
  const blob = `${subject}\n\n${body}`;

  // ✅ declare with the union type from Listing
  const type: Listing['type'] =
    /\bFHA\b/i.test(blob) ? 'FHA' :
    /\bVA\b/i.test(blob)  ? 'VA'  : 'Other';

  const rateStr = first(blob, /(\d(?:\.\d{1,3})?)\s*%/);
  const rate = rateStr ? parseFloat(rateStr) : undefined;
  const county = first(blob, /\b(Harris County|Montgomery County)\b/i);
  const address =
    first(blob, /\b(\d{2,6}\s+[^\n,]+,\s*[A-Z][a-zA-Z]+,\s*TX\b[^\n]*)/i) ||
    first(blob, /\b(\d{2,6}\s+[^\n]*?(?:St|Street|Ave|Avenue|Blvd|Ln|Lane|Dr|Drive|Ct|Court|Way|Rd|Road)[^\n,]*)/i) ||
    'Unknown address';
  const url = first(blob, /(https?:\/\/[^\s>"]+)/i);

  const listingId = 'email-' + crypto.createHash('sha1')
    .update((subject || '') + '|' + address)
    .digest('hex')
    .slice(0, 24);

  const isAssumable =
    /\bassumable\b/i.test(blob) || /\bassumble\b/i.test(blob) || /\bassumption\b/i.test(blob);

  // ✅ return a full Listing object, matching the union type
  const record: Listing = {
    listingId,
    address,
    county: county || undefined,
    state: 'TX',
    rate,
    type,                                // now typed correctly
    tags: [type, 'Assumable'].join(','),
    note: subject || 'Assumable found via email',
    url: url || undefined,
  };

  return { isAssumable, record };
}
