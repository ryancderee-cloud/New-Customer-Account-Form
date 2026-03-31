import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const { retailerName, contactName, email, notes, items } = body;

  if (!retailerName || !contactName || !email || !Array.isArray(items) || !items.length) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const order = await prisma.order.create({
    data: {
      retailerName,
      contactName,
      email,
      notes,
      items: {
        create: items.map((item: { productId: string; quantity: number }) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      }
    }
  });

  return Response.json({ success: true, orderId: order.id });
}
