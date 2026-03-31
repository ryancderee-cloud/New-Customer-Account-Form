'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import type { PublishedLayoutResponse } from '@/types/layout';
import { ProductModal } from './product-modal';
import { useOrderStore } from '@/store/order-store';

export function VirtualStand({ data }: { data: PublishedLayoutResponse['layout'] }) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const addItem = useOrderStore((s) => s.addItem);

  const products = useMemo(() => {
    const map = new Map<string, NonNullable<(typeof data.cells)[number]['product']>>();
    data.cells.forEach((c) => c.product && map.set(c.product.id, c.product));
    return map;
  }, [data.cells]);

  const selected = selectedProductId ? products.get(selectedProductId) : null;

  return (
    <>
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="mx-auto max-w-[760px]">
          <div className="relative w-full overflow-hidden rounded-xl bg-slate-100" style={{ aspectRatio: `${data.standTemplate.width}/${data.standTemplate.height}` }}>
            <Image src={data.standTemplate.backgroundImageUrl} alt={data.standTemplate.name} fill className="object-contain" />

            <div
              className="absolute"
              style={{
                left: '17.5%',
                top: '19.2%',
                width: '64.5%',
                height: '64.5%'
              }}
            >
              <div
                className="grid h-full w-full gap-[0.32rem]"
                style={{
                  gridTemplateColumns: `repeat(${data.standTemplate.gridColumns}, minmax(0,1fr))`,
                  gridTemplateRows: `repeat(${data.standTemplate.gridRows}, minmax(0,1fr))`
                }}
              >
                {data.cells.map((cell) => (
                  <button
                    key={cell.id}
                    className="group relative overflow-visible rounded-[2px] border border-slate-200/80 bg-white/85 shadow-[0_1px_2px_rgba(0,0,0,.14)] hover:z-20 hover:scale-[1.03]"
                    onClick={() => cell.product && setSelectedProductId(cell.product.id)}
                    title={cell.cellKey}
                  >
                    <span className="pointer-events-none absolute -top-[0.28rem] left-1/2 h-[0.28rem] w-[70%] -translate-x-1/2 rounded-t-full border border-slate-300 bg-slate-100" />
                    {cell.product ? (
                      <>
                        <Image
                          src={cell.product.frontImageUrl}
                          alt={cell.product.name}
                          fill
                          className="object-cover p-[2px]"
                          style={{
                            transform: `translate(${cell.xOffset}px,${cell.yOffset}px)`,
                            zIndex: cell.zIndex
                          }}
                        />
                        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-[#2d47b7] py-[2px] text-center text-[8px] font-medium uppercase tracking-wide text-white/90">
                          {cell.cellKey}
                        </span>
                      </>
                    ) : (
                      <span className="absolute inset-0 grid place-items-center text-[10px] text-slate-300">{cell.cellKey}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {selected ? (
        <ProductModal
          product={selected}
          onClose={() => setSelectedProductId(null)}
          onAdd={(qty) => {
            addItem({ productId: selected.id, name: selected.name, sku: selected.sku }, qty);
            setSelectedProductId(null);
          }}
        />
      ) : null}
    </>
  );
}
