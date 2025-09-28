import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    has_KV_REST_API_URL: !!process.env.KV_REST_API_URL,
    has_KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
    rest_host: process.env.KV_REST_API_URL?.split('/')[2] ?? null, // e.g. us1-rest-redis.upstash.io
    token_len: process.env.KV_REST_API_TOKEN?.length ?? 0,         // just the length (no secret)
  });
}

