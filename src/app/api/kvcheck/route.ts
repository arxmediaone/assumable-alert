// src/app/api/kvcheck/route.ts
import { NextResponse } from "next/server";
import { getAllListings } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET() {
  const listings = await getAllListings();
  return NextResponse.json({ ok: true, count: listings.length });
}
