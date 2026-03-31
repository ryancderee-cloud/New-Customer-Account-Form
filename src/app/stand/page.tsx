import { prisma } from '@/lib/prisma';
import { VirtualStand } from '@/components/virtual-stand';
import { OrderSummary } from '@/components/order-summary';

export default async function StandPage() {
  const layout = await prisma.standLayout.findFirst({
    where: { status: 'PUBLISHED' },
    include: {
      standTemplate: true,
      cells: {
        include: { product: true },
        orderBy: [{ rowIndex: 'asc' }, { columnIndex: 'asc' }]
      }
    }
  });

  if (!layout) return <main className="p-6">No published layout found.</main>;

  return (
    <main className="mx-auto grid max-w-7xl gap-4 p-4 lg:grid-cols-[1fr_340px]">
      <section>
        <h1 className="mb-3 text-2xl font-bold">{layout.name}</h1>
        <p className="mb-3 text-sm text-slate-600">Browse the virtual stand and click any packet to order.</p>
        <VirtualStand data={layout as never} />
      </section>
      <OrderSummary />
    </main>
  );
}
