# Virtual Seed Stand (Next.js + Prisma)

Production-ready starter for a **Virtual Seed Stand** with:
- Customer-facing stand ordering experience.
- Admin panel with grid-based planogram editor.
- Data-driven layout model (no hardcoded packet positions).

## Tech Stack
- Next.js 14 App Router + TypeScript + Tailwind.
- Prisma ORM.
- SQLite in development (easily switchable to PostgreSQL).
- Zustand for order/cart state.

## Data Model
Implemented in `prisma/schema.prisma`:
- `Product`
- `StandTemplate`
- `StandLayout`
- `LayoutCell`
- `Order`
- `OrderItem`

## Folder Structure
- `src/app/stand/page.tsx` — customer stand page.
- `src/components/virtual-stand.tsx` — realistic stand + 11x11 overlay rendering.
- `src/components/product-modal.tsx` — front/back packet detail modal.
- `src/components/order-summary.tsx` — sticky order summary + submission form.
- `src/app/admin/products/page.tsx` — product list + editor.
- `src/app/admin/stand-templates/page.tsx` — stand template manager.
- `src/app/admin/layouts/page.tsx` — layout list + duplicate/publish + grid editor.
- `src/app/api/**` — API routes for published layout, admin CRUD, import, orders.
- `prisma/seed.ts` — demo stand template (11x11), 121 cells, sample products.
- `public/demo/*` — placeholder stand and packet artwork.

## Setup
1. Install and generate client:
   ```bash
   npm install
   npm run prisma:generate
   ```
2. Create DB and seed:
   ```bash
   npm run prisma:migrate -- --name init
   npm run prisma:seed
   ```
3. Run app:
   ```bash
   npm run dev
   ```
4. Open:
   - Customer stand: `http://localhost:3000/stand`
   - Admin products: `http://localhost:3000/admin/products`
   - Admin templates: `http://localhost:3000/admin/stand-templates`
   - Admin layouts: `http://localhost:3000/admin/layouts`

## How to upload stand image
Current implementation stores a URL per stand template (`backgroundImageUrl`).
- Upload your real stand image to your CDN/storage provider.
- Paste URL in **Admin → Stand Templates**.
- Save template.

## How to upload front/back packet images
Current implementation stores URLs per product (`frontImageUrl`, `backImageUrl`).
- Upload front/back packet files to your storage provider.
- Paste URLs in **Admin → Products** when creating or editing a product.

> For production, replace URL fields with UploadThing (or equivalent) upload widgets while keeping the same DB fields.

## How to create a new layout
1. Go to **Admin → Layouts**.
2. Create via API/UI extension (current screen supports managing existing seeded layout).
3. Open **Edit Grid**.
4. Assign products cell-by-cell from dropdown (`A1`...`K11`).
5. Save layout cells.

## How to duplicate a seasonal layout
1. In **Admin → Layouts**, click **Duplicate** for current layout.
2. A draft copy is created with copied 121 cell assignments.
3. Rename/season-tag in your workflow.

## How to publish a new layout
1. In **Admin → Layouts**, click **Publish** on a draft layout.
2. Existing published layout for same stand template is set to draft.
3. Customer page always reads current published layout.

## How to swap products without code changes
- Open **Admin → Layouts → Edit Grid**.
- Change product assignment in any cell.
- Save.
- Publish when ready.

No React component edits needed for regular merchandising updates.
