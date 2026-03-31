'use client';

import { useOrderStore } from '@/store/order-store';
import { useState } from 'react';

export function OrderSummary() {
  const { items, updateQty, removeItem, clear } = useOrderStore();
  const [retailerName, setRetailerName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  const total = items.reduce((sum, item) => sum + item.quantity, 0);

  async function submitOrder() {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ retailerName, contactName, email, notes, items })
    });
    if (res.ok) {
      setMessage('Order submitted successfully.');
      clear();
    } else {
      setMessage('Failed to submit order.');
    }
  }

  return (
    <aside className="sticky top-4 rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold">Order Summary</h3>
      <p className="mb-2 text-sm text-slate-500">Total packets: {total}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.productId} className="rounded border p-2 text-sm">
            <div className="font-medium">{item.name}</div>
            <div className="text-slate-500">{item.sku}</div>
            <div className="mt-1 flex items-center gap-2">
              <input type="number" className="w-16 rounded border px-2 py-1" value={item.quantity} min={1} onChange={(e) => updateQty(item.productId, Number(e.target.value))} />
              <button className="text-red-600" onClick={() => removeItem(item.productId)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2 border-t pt-3">
        <input className="w-full rounded border p-2 text-sm" placeholder="Retailer name" value={retailerName} onChange={(e) => setRetailerName(e.target.value)} />
        <input className="w-full rounded border p-2 text-sm" placeholder="Contact name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
        <input className="w-full rounded border p-2 text-sm" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <textarea className="w-full rounded border p-2 text-sm" placeholder="Optional notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button className="w-full rounded bg-seed-dark py-2 text-white" onClick={submitOrder} disabled={!items.length}>Submit Order</button>
        {message ? <p className="text-xs text-seed-green">{message}</p> : null}
      </div>
    </aside>
  );
}
