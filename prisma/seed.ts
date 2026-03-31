import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const cellKey = (row: number, col: number) => `${letters[col]}${row + 1}`;

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.layoutCell.deleteMany();
  await prisma.standLayout.deleteMany();
  await prisma.product.deleteMany();
  await prisma.standTemplate.deleteMany();

  const products = await Promise.all(
    Array.from({ length: 24 }).map((_, i) =>
      prisma.product.create({
        data: {
          name: `Demo Seed ${i + 1}`,
          sku: `SEED-${String(i + 1).padStart(3, '0')}`,
          description: `High quality demo seed packet ${i + 1}. Replace with real product copy in admin.`,
          category: ['Vegetable', 'Herb', 'Flower'][i % 3],
          packetSize: 'Standard packet',
          frontImageUrl: `/demo/packet-front-${(i % 6) + 1}.svg`,
          backImageUrl: `/demo/packet-back-${(i % 6) + 1}.svg`,
          isActive: true
        }
      })
    )
  );

  const template = await prisma.standTemplate.create({
    data: {
      name: 'Freestanding 11x11 Seed Stand',
      type: 'freestanding-grid',
      backgroundImageUrl: '/demo/stand-bg.svg',
      width: 900,
      height: 1700,
      gridColumns: 11,
      gridRows: 11
    }
  });

  const layout = await prisma.standLayout.create({
    data: {
      standTemplateId: template.id,
      name: 'Spring 2026 Main Floor',
      slug: 'spring-2026-main-floor',
      status: 'PUBLISHED',
      season: 'Spring 2026'
    }
  });

  const cells = [];
  for (let row = 0; row < 11; row++) {
    for (let col = 0; col < 11; col++) {
      const product = products[(row * 11 + col) % products.length];
      cells.push({
        standLayoutId: layout.id,
        rowIndex: row,
        columnIndex: col,
        cellKey: cellKey(row, col),
        productId: product.id,
      });
    }
  }

  await prisma.layoutCell.createMany({ data: cells });
  console.log('Seeded demo stand template, layout, cells, and products.');
}

main().finally(async () => prisma.$disconnect());
