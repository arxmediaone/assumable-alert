// src/app/page.tsx
import { getAllListings } from "@/lib/kv";
import ListingCard from "@/components/ListingCard";

export const dynamic = "force-dynamic"; // always up-to-date on reload

export default async function HomePage() {
  const listings = await getAllListings();

  listings.sort((a, b) => {
    const ta = a.firstSeen ? Date.parse(a.firstSeen) : 0;
    const tb = b.firstSeen ? Date.parse(b.firstSeen) : 0;
    return tb - ta;
  });

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Assumable Listings</h1>

      {listings.length === 0 ? (
        <p className="text-gray-600">
          No listings yet. Send an email to your parse address to add one.
        </p>
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
