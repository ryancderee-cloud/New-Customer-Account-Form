'use client';

import { useEffect, useState } from 'react';

type StandTemplate = { id: string; name: string; type: string; backgroundImageUrl: string; width: number; height: number; gridColumns: number; gridRows: number };

export default function StandTemplatesPage() {
  const [items, setItems] = useState<StandTemplate[]>([]);
  const [form, setForm] = useState({ name: '', type: 'freestanding-grid', backgroundImageUrl: '/demo/stand-bg.svg', width: 900, height: 1700, gridColumns: 11, gridRows: 11 });

  async function load() { const res = await fetch('/api/admin/stand-templates'); setItems((await res.json()).standTemplates); }
  useEffect(() => { load(); }, []);

  async function save() {
    await fetch('/api/admin/stand-templates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    load();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded border bg-white p-4 space-y-2">
        <h2 className="font-semibold">Stand Template Manager</h2>
        {Object.entries(form).map(([key, value]) => <input key={key} className="w-full rounded border p-2 text-sm" value={String(value)} onChange={(e) => setForm((s) => ({ ...s, [key]: ['width','height','gridColumns','gridRows'].includes(key) ? Number(e.target.value) : e.target.value }))} placeholder={key} />)}
        <button className="rounded bg-seed-green px-4 py-2 text-white" onClick={save}>Save Template</button>
      </div>
      <div className="rounded border bg-white p-4">
        <h2 className="mb-2 font-semibold">Templates</h2>
        <div className="space-y-2">{items.map((t) => <div key={t.id} className="rounded border p-2 text-sm">{t.name} · {t.gridColumns}x{t.gridRows}</div>)}</div>
      </div>
    </div>
  );
}
