import { prisma } from '@/lib/prisma';

export async function GET() {
  const layout = await prisma.standLayout.findFirst({
    where: { status: 'PUBLISHED' },
    include: {
      standTemplate: true,
      cells: { include: { product: true }, orderBy: [{ rowIndex: 'asc' }, { columnIndex: 'asc' }] }
    }
  });

  if (!layout) return Response.json({ error: 'No published layout found' }, { status: 404 });
  return Response.json({ layout });
}
