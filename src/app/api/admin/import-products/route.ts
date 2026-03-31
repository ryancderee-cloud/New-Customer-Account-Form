import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const rows = body.rows as Array<{ sku: string; name: string; description: string; category: string }>;

  const created = await Promise.all(rows.map((row) => prisma.product.upsert({
    where: { sku: row.sku },
    create: {
      sku: row.sku,
      name: row.name,
      description: row.description,
      category: row.category,
      frontImageUrl: '/demo/packet-front-1.svg',
      backImageUrl: '/demo/packet-back-1.svg',
      packetSize: 'Standard',
      isActive: true
    },
    update: {
      name: row.name,
      description: row.description,
      category: row.category
    }
  })));

  return Response.json({ count: created.length });
}
