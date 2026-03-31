import { prisma } from '@/lib/prisma';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ include: { items: { include: { product: true } } }, orderBy: { createdAt: 'desc' } });

  return (
    <div className="rounded border bg-white p-4">
      <h2 className="mb-2 font-semibold">Recent Orders</h2>
      <div className="space-y-2">
        {orders.map((o) => (
          <div key={o.id} className="rounded border p-2 text-sm">
            <div className="font-medium">{o.retailerName} · {o.contactName} · {o.email}</div>
            <ul className="ml-4 list-disc">
              {o.items.map((it) => <li key={it.id}>{it.product.sku} x {it.quantity}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
