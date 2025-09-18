// src/app/api/inbound/sendgrid/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';          // use Node runtime (larger bodies, simpler I/O)
export const dynamic = 'force-dynamic';   // never cache

export async function GET() {
  return NextResponse.json({ ok: true, route: '/api/inbound/sendgrid' });
}

export async function POST(req: NextRequest) {
  const ct = req.headers.get('content-type') || '';
  let body = '';
  try {
    if (ct.includes('multipart/form-data')) {
      const form = await req.formData();
      // Pull common fields; also log the keys we received
      const keys = Array.from(form.keys());
      const text = (form.get('text') || form.get('html') || '') as string;
      body = typeof text === 'string' ? text : '';
      console.log('INBOUND FORM KEYS:', keys);
    } else {
      body = await req.text(); // raw MIME if you checked “POST raw, full MIME message”
    }
  } catch (e) {
    console.error('PARSE ERROR', e);
  }

  console.log('INBOUND EMAIL', {
    contentType: ct,
    length: body?.length || 0,
    sample: body?.slice(0, 500) || ''
  });

  // Always 200 so SendGrid doesn’t retry
  return NextResponse.json({ ok: true, contentType: ct, length: body?.length || 0 });
}
