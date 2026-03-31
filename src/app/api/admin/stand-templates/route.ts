import { prisma } from '@/lib/prisma';

export async function GET() {
  const standTemplates = await prisma.standTemplate.findMany({ orderBy: { updatedAt: 'desc' } });
  return Response.json({ standTemplates });
}

export async function POST(req: Request) {
  const data = await req.json();
  const standTemplate = await prisma.standTemplate.create({ data });
  return Response.json({ standTemplate });
}
