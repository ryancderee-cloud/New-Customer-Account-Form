import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 text-sm">
            <Link href="/" className="font-semibold text-seed-dark">Virtual Seed Stand</Link>
            <div className="flex gap-4">
              <Link href="/stand">Customer Stand</Link>
              <Link href="/admin/products">Admin</Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
