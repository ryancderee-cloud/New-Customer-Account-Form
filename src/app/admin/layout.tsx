import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-7xl p-4">
      <h1 className="mb-2 text-2xl font-bold">Admin Panel</h1>
      <div className="mb-4 flex gap-3 text-sm">
        <Link href="/admin/products" className="rounded border px-3 py-1">Products</Link>
        <Link href="/admin/stand-templates" className="rounded border px-3 py-1">Stand Templates</Link>
        <Link href="/admin/layouts" className="rounded border px-3 py-1">Layouts</Link>
        <Link href="/admin/orders" className="rounded border px-3 py-1">Orders</Link>
      </div>
      {children}
    </main>
  );
}
