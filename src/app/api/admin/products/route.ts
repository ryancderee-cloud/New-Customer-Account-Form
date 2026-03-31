import { prisma } from '@/lib/prisma';

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { updatedAt: 'desc' } });
  return Response.json({ products });
}

export async function POST(req: Request) {
  const data = await req.json();
  const product = await prisma.product.create({ data });
  return Response.json({ product });
}
