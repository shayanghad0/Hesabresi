import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const result = await db
    .update(categories)
    .set({ name: body.name, type: body.type, icon: body.icon, color: body.color })
    .where(eq(categories.id, parseInt(id)))
    .returning();
  return Response.json({ data: result[0] });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(categories).where(eq(categories.id, parseInt(id)));
  return Response.json({ success: true });
}
