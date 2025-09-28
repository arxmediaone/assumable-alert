import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const key = 'kvcheck:' + Date.now();
    await kv.set(key, 'ok', { ex: 30 });
    const val = await kv.get<string>(key);
    return NextResponse.json({ ok: val === 'ok' });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
