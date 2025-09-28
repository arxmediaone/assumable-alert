// src/app/api/admin/normalize/route.ts
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const KEY = 'listings:v1';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const hash = await kv.hgetall<Record<string, unknown>>(KEY);
  if (!hash) return NextResponse.json({ ok: true, normalized: 0 });

  const updates: Record<string, string> = {};
  for (const [k, v] of Object.entries(hash)) {
    if (typeof v !== 'string') {
      updates[k] = JSON.stringify(v);
    }
  }
  if (Object.keys(updates).length) {
    await kv.hset(KEY, updates);
  }
  return NextResponse.json({ ok: true, normalized: Object.keys(updates).length });
}
