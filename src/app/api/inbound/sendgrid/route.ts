import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { addListing } from '@/lib/kv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const first = (s:string, re:RegExp) => s.match(re)?.[1]?.trim();

function parse(subject: string, body: string) {
  const blob = `${subject}\n\n${body}`;

  const isAssumable =
    /\bassumable\b/i.test(blob) || /\bassumble\b/i.test(blob) || /\bassumption\b/i.test(blob);

  const type = /\bFHA\b/i.test(blob) ? 'FHA' : /\bVA\b/i.test(blob) ? 'VA' : 'Other';
  const rateStr = first(blob, /(\d(?:\.\d{1,3})?)\s*%/);
  const rate = rateStr ? parseFloat(rateStr) : undefined;
  const county = first(blob, /\b(Harris County|Montgomery County)\b/i);
  const address = first(blob, /\b(\d{2,6}\s+[^\n,]+,\s*[A-Z][a-zA-Z]+,\s*TX\b[^\n]*)/i)
                || first(blob, /\b(\d{2,6}\s+[^\n]*?(?:St|Street|Ave|Avenue|Blvd|Ln|Lane|Dr|Drive|Ct|Court|Way|Rd|Road)[^\n,]*)/i)
                || 'Unknown address';
  const url = first(blob, /(https?:\/\/[^\s>"]+)/i);

  const listingId = 'email-' + crypto.createHash('sha1')
    .update((subject || '') + '|' + address)
    .digest('hex')
    .slice(0, 24);

  return {
    isAssumable,
    record: {
      listingId,
      address,
      county: county || undefined,
      state: 'TX',
      rate,
      type,
      tags: [type, 'Assumable'].filter(Boolean).join(','),
      note: subject || 'Assumable found via email',
      url: url || undefined,
    }
  };
}

export async function GET() {
  return NextResponse.json({ ok: true, route: '/api/inbound/sendgrid' });
}

export async function POST(req: NextRequest) {
  const ct = req.headers.get('content-type') || '';
  let subject = '';
  let body = '';

  if (ct.includes('multipart/form-data')) {
    const form = await req.formData();
    subject = String(form.get('subject') || '');
    body = String(form.get('text') || form.get('html') || '');
  } else {
    const raw = await req.text();        // raw MIME when “Send raw” is enabled
    subject = first(raw, /^Subject:\s*(.+)$/mi) || '';
    body = raw;
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
