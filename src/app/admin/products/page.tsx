'use client';

import { useEffect, useState } from 'react';

type Product = { id: string; name: string; sku: string; category: string; isActive: boolean; description: string; packetSize: string | null; frontImageUrl: string; backImageUrl: string };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: '', sku: '', description: '', category: '', packetSize: '', frontImageUrl: '/demo/packet-front-1.svg', backImageUrl: '/demo/packet-back-1.svg', isActive: true });

  async function load() {
    const res = await fetch('/api/admin/products');
    const json = await res.json();
    setProducts(json.products);
  }

  useEffect(() => { load(); }, []);

  async function createProduct() {
    await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ ...form, name: '', sku: '', description: '' });
    load();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded border bg-white p-4">
        <h2 className="mb-2 font-semibold">Create / Edit Product</h2>
        <div className="space-y-2">
          {Object.entries(form).map(([key, value]) => key !== 'isActive' ? <input key={key} placeholder={key} className="w-full rounded border p-2 text-sm" value={String(value)} onChange={(e) => setForm((s) => ({ ...s, [key]: e.target.value }))} /> : null)}
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((s) => ({ ...s, isActive: e.target.checked }))} /> Active</label>
          <button className="rounded bg-seed-green px-4 py-2 text-white" onClick={createProduct}>Save Product</button>
        </div>
      </div>
      <div className="rounded border bg-white p-4">
        <h2 className="mb-2 font-semibold">Products ({products.length})</h2>
        <div className="max-h-[70vh] space-y-2 overflow-auto">
          {products.map((p) => <div key={p.id} className="rounded border p-2 text-sm"><div className="font-medium">{p.name}</div><div>{p.sku} · {p.category}</div></div>)}
        </div>
      </div>
    </div>
  );
}
