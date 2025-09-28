"use client";
import useSWR from "swr";
import ListingCard from "@/components/ListingCard";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function LivePage() {
  const { data } = useSWR<{ listings: any[] }>("/api/feed", fetcher, {
    refreshInterval: 30_000, // 30s
  });

  const listings = (data?.listings ?? []).sort((a, b) => {
    const ta = a.firstSeen ? Date.parse(a.firstSeen) : 0;
    const tb = b.firstSeen ? Date.parse(b.firstSeen) : 0;
    return tb - ta;
  });

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Assumable Listings (Live)</h1>
      {listings.length === 0 ? (
        <p className="text-gray-600">Waiting for listings…</p>
      ) : (
        <section className="grid gap-4">
          {listings.map((l) => (
            <ListingCard key={l.listingId} l={l} />
          ))}
        </section>
      )}
    </main>
  );
}
