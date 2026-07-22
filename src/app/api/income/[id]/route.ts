import { db } from "@/db";
import { income } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const amount = Number(body.amount);
  const taxRate = body.taxRate != null ? Number(body.taxRate) : 9;
  const taxAmount = Math.floor(amount * taxRate / 100);
  const totalAmount = amount + taxAmount;

  const result = await db
    .update(income)
    .set({
      title: body.title,
      categoryId: body.categoryId ? Number(body.categoryId) : null,
      description: body.description,
      amount,
      taxRate,
      taxAmount,
      totalAmount,
      date: body.date,
      updatedAt: new Date(),
    })
    .where(eq(income.id, parseInt(id)))
    .returning();

  return Response.json({ data: result[0] });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(income).where(eq(income.id, parseInt(id)));
  return Response.json({ success: true });
}
