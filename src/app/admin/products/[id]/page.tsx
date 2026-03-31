import { prisma } from '@/lib/prisma';

export default async function ProductEditor({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return <div className="p-4">Product not found.</div>;

  return (
    <div className="rounded border bg-white p-4">
      <h2 className="mb-2 text-xl font-semibold">Product Editor: {product.name}</h2>
      <p className="text-sm text-slate-600">This route is the dedicated product editor screen. For now edit fields in the product manager list and extend this route for full inline editing workflow.</p>
      <pre className="mt-3 overflow-auto rounded bg-slate-100 p-3 text-xs">{JSON.stringify(product, null, 2)}</pre>
    </div>
  );
}
