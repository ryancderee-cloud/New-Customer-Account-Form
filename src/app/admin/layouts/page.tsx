'use client';

import { useEffect, useState } from 'react';

type Product = { id: string; name: string; sku: string };
type Cell = { id: string; cellKey: string; productId: string | null; xOffset: number; yOffset: number; widthAdjust: number; heightAdjust: number; zIndex: number };
type Layout = { id: string; name: string; slug: string; season: string | null; status: 'DRAFT'|'PUBLISHED'; standTemplateId: string; standTemplate: { name: string; gridColumns: number; gridRows: number }; cells?: Cell[] };

export default function LayoutsPage() {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [active, setActive] = useState<Layout | null>(null);

  async function load() {
    const [l, p] = await Promise.all([fetch('/api/admin/layouts'), fetch('/api/admin/products')]);
    setLayouts((await l.json()).layouts);
    setProducts((await p.json()).products);
  }
  useEffect(() => { load(); }, []);

  async function openEditor(layout: Layout) {
    const res = await fetch(`/api/admin/layouts/${layout.id}`);
    const json = await res.json();
    setActive(json.layout);
  }

  async function publish(layout: Layout) {
    await fetch('/api/admin/layouts', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'publish', id: layout.id, standTemplateId: layout.standTemplateId }) });
    load();
  }

  async function duplicate(layout: Layout) {
    await fetch('/api/admin/layouts', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'duplicate', id: layout.id, name: `${layout.name} Copy`, slug: `${layout.slug}-copy-${Date.now()}`, season: layout.season }) });
    load();
  }

  async function saveCells() {
    if (!active?.cells) return;
    await fetch('/api/admin/layouts', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'saveCells', cells: active.cells }) });
    alert('Saved cells');
  }

  return (
    <div className="space-y-4">
      <div className="rounded border bg-white p-4">
        <h2 className="mb-2 font-semibold">Layout List (duplicate/publish)</h2>
        <div className="space-y-2">
          {layouts.map((l) => <div key={l.id} className="flex items-center justify-between rounded border p-2 text-sm"><span>{l.name} · {l.status}</span><div className="space-x-2"><button className="rounded border px-2 py-1" onClick={() => openEditor(l)}>Edit Grid</button><button className="rounded border px-2 py-1" onClick={() => duplicate(l)}>Duplicate</button><button className="rounded border px-2 py-1" onClick={() => publish(l)}>Publish</button></div></div>)}
        </div>
      </div>

      {active?.cells ? <div className="rounded border bg-white p-4">
        <h3 className="mb-2 font-semibold">Grid-based Layout Editor ({active.name})</h3>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${active.standTemplate.gridColumns}, minmax(0,1fr))` }}>
          {active.cells.map((cell) => (
            <div key={cell.id} className="rounded border p-1">
              <div className="text-[10px] text-slate-500">{cell.cellKey}</div>
              <select className="w-full rounded border text-xs" value={cell.productId ?? ''} onChange={(e) => setActive((s) => s ? ({ ...s, cells: s.cells?.map((x) => x.id === cell.id ? { ...x, productId: e.target.value || null } : x) }) : s)}>
                <option value="">Empty</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.sku}</option>)}
              </select>
              <div className="mt-1 grid grid-cols-2 gap-1">
                <input className="rounded border px-1 text-[10px]" placeholder="x" value={cell.xOffset} onChange={(e) => setActive((s) => s ? ({ ...s, cells: s.cells?.map((x) => x.id === cell.id ? { ...x, xOffset: Number(e.target.value) || 0 } : x) }) : s)} />
                <input className="rounded border px-1 text-[10px]" placeholder="y" value={cell.yOffset} onChange={(e) => setActive((s) => s ? ({ ...s, cells: s.cells?.map((x) => x.id === cell.id ? { ...x, yOffset: Number(e.target.value) || 0 } : x) }) : s)} />
              </div>
            </div>
          ))}
        </div>
        <button className="mt-3 rounded bg-seed-dark px-4 py-2 text-white" onClick={saveCells}>Save Layout Cells</button>
      </div> : null}
    </div>
  );
}
