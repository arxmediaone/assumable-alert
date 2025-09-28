import React from "react";
import type { Listing } from "@/lib/kv";

export default function ListingCard({ l }: { l: Listing }) {
  return (
    <article className="border rounded-lg p-4 shadow-sm bg-white">
      <header className="flex items-center justify-between gap-2">
        <h2 className="font-semibold">{l.address || "Unknown address"}</h2>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
          {l.type || "Other"}
        </span>
      </header>

      <p className="text-sm text-gray-600 mt-1">
        {[l.city, l.county, l.state].filter(Boolean).join(", ")}
      </p>

      <dl className="grid grid-cols-2 gap-3 text-sm mt-3">
        <div>
          <dt className="text-gray-500">Rate</dt>
          <dd className="font-medium">{l.rate ? `${l.rate}%` : "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Price</dt>
          <dd className="font-medium">{l.price ? `$${l.price.toLocaleString()}` : "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Tags</dt>
          <dd className="font-medium">{l.tags || "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-500">First Seen</dt>
          <dd className="font-medium">
            {l.firstSeen ? new Date(l.firstSeen).toLocaleString() : "—"}
          </dd>
        </div>
      </dl>

      <footer className="mt-3 flex gap-3">
        {l.url && (
          <a className="text-blue-600 underline text-sm" href={l.url} target="_blank" rel="noreferrer">
            View Listing
          </a>
        )}
        {l.note && <span className="text-xs text-gray-500">• {l.note}</span>}
      </footer>
    </article>
  );
}
