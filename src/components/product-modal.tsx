'use client';

import Image from 'next/image';
import { useState } from 'react';

type Product = {
  id: string;
  name: string;
  sku: string;
  description: string;
  frontImageUrl: string;
  backImageUrl: string;
  category: string;
  packetSize: string | null;
};

export function ProductModal({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: (qty: number) => void }) {
  const [qty, setQty] = useState(1);
  const [side, setSide] = useState<'front' | 'back'>('front');

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-sm text-slate-500">{product.sku}</p>
          </div>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative aspect-[3/4] overflow-hidden rounded border">
            <Image src={side === 'front' ? product.frontImageUrl : product.backImageUrl} alt={product.name} fill className="object-cover" />
          </div>
          <div className="space-y-3">
            <p className="text-sm text-slate-700">{product.description}</p>
            <p className="text-sm">Category: {product.category}</p>
            <p className="text-sm">Packet size: {product.packetSize ?? 'N/A'}</p>
            <div className="flex gap-2">
              <button className="rounded border px-3 py-1" onClick={() => setSide('front')}>Front</button>
              <button className="rounded border px-3 py-1" onClick={() => setSide('back')}>Back</button>
            </div>
            <div className="flex items-center gap-2">
              <input className="w-20 rounded border px-2 py-1" type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
              <button className="rounded bg-seed-green px-4 py-2 text-white" onClick={() => onAdd(qty)}>Add to order</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
