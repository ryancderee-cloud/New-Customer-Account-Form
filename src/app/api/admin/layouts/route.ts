import { prisma } from '@/lib/prisma';

export async function GET() {
  const layouts = await prisma.standLayout.findMany({
    include: { standTemplate: true },
    orderBy: { updatedAt: 'desc' }
  });
  return Response.json({ layouts });
}

export async function POST(req: Request) {
  const data = await req.json();
  const layout = await prisma.standLayout.create({ data });
  return Response.json({ layout });
}

export async function PATCH(req: Request) {
  const data = await req.json();

  if (data.action === 'publish') {
    await prisma.$transaction([
      prisma.standLayout.updateMany({ where: { standTemplateId: data.standTemplateId, status: 'PUBLISHED' }, data: { status: 'DRAFT' } }),
      prisma.standLayout.update({ where: { id: data.id }, data: { status: 'PUBLISHED' } })
    ]);
    return Response.json({ ok: true });
  }

  if (data.action === 'duplicate') {
    const source = await prisma.standLayout.findUnique({ where: { id: data.id }, include: { cells: true } });
    if (!source) return Response.json({ error: 'Not found' }, { status: 404 });
    const copy = await prisma.standLayout.create({
      data: {
        standTemplateId: source.standTemplateId,
        name: data.name,
        slug: data.slug,
        season: data.season,
        status: 'DRAFT',
        cells: {
          create: source.cells.map((c) => ({
            rowIndex: c.rowIndex,
            columnIndex: c.columnIndex,
            cellKey: c.cellKey,
            productId: c.productId,
            xOffset: c.xOffset,
            yOffset: c.yOffset,
            widthAdjust: c.widthAdjust,
            heightAdjust: c.heightAdjust,
            zIndex: c.zIndex
          }))
        }
      }
    });
    return Response.json({ layout: copy });
  }

  if (data.action === 'saveCells') {
    await Promise.all(
      data.cells.map((cell: { id: string; productId: string | null; xOffset: number; yOffset: number; widthAdjust: number; heightAdjust: number; zIndex: number }) =>
        prisma.layoutCell.update({ where: { id: cell.id }, data: cell })
      )
    );
    return Response.json({ ok: true });
  }

  return Response.json({ error: 'Unsupported action' }, { status: 400 });
}
