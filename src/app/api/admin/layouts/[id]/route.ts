import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const layout = await prisma.standLayout.findUnique({
    where: { id: params.id },
    include: {
      standTemplate: true,
      cells: { include: { product: true }, orderBy: [{ rowIndex: 'asc' }, { columnIndex: 'asc' }] }
    }
  });

  if (!layout) return Response.json({ error: 'Layout not found' }, { status: 404 });
  return Response.json({ layout });
}
