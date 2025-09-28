'use client';

import { useEffect, useState } from 'react';

type Item = {
  listingId: string; address: string; city: string; county: string; state: string;
  price?: number; rate?: number; type?: string; tags?: string; note?: string;
  url?: string; img?: string; firstSeen?: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const r = await fetch('/api/feed');
    const data = await r.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-2">Assumables Alert</h1>
      <p className="text-gray-600 mb-4">Demo results for FHA/VA assumable listings.</p>
      <button onClick={load} className="rounded-xl px-3 py-2 bg-gray-900 text-white text-sm mb-4">Refresh</button>

      {loading && <div className="text-gray-500">Loading…</div>}

      <div className="space-y-3">
        {items.map((x) => (
          <div key={x.listingId} className="rounded-2xl shadow p-4 bg-white border border-gray-100">
            <div className="flex items-start gap-3">
              <img src={x.img || 'https://placehold.co/160x120'} alt="" className="w-40 h-28 object-cover rounded-xl" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold truncate">{x.address}</h2>
                  <span className="text-sm font-semibold">{x.price ? `$${x.price.toLocaleString()}` : ''}</span>
                </div>
                <div className="text-xs text-gray-500">{x.city}, {x.county}, {x.state}</div>
                <div className="mt-1 text-sm">{x.note}</div>
                <div className="mt-2 flex flex-wrap gap-1 text-xs">
                  {x.type && <span className="px-2 py-1 rounded-2xl bg-sky-100 text-sky-700">{x.type}</span>}
                  {x.rate && <span className="px-2 py-1 rounded-2xl bg-sky-100 text-sky-700">{x.rate}%</span>}
                  {x.tags?.split(',').map(t => (
                    <span key={t.trim()} className="px-2 py-1 rounded-2xl bg-gray-100 text-gray-700">{t.trim()}</span>
                  ))}
                </div>
                <div className="mt-3">{x.url && <a className="text-sky-600 text-sm underline" href={x.url} target="_blank">Open Listing</a>}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && !items.length && <div className="text-center text-gray-500 text-sm">No results yet.</div>}
    </main>
  );
}
 