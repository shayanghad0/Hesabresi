import { db } from "@/db";
import { employees } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(employees)
    .where(eq(employees.id, parseInt(id)))
    .limit(1);
  if (rows.length === 0) {
    return Response.json({ error: "کارمند یافت نشد" }, { status: 404 });
  }
  return Response.json({ data: rows[0] });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const result = await db
    .update(employees)
    .set({
      firstName: body.firstName,
      lastName: body.lastName,
      nationalId: body.nationalId,
      phone: body.phone,
      email: body.email,
      department: body.department,
      position: body.position,
      salary: body.salary ? Number(body.salary) : 0,
      employmentDate: body.employmentDate,
      status: body.status,
      notes: body.notes,
      updatedAt: new Date(),
    })
    .where(eq(employees.id, parseInt(id)))
    .returning();

  return Response.json({ data: result[0] });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(employees).where(eq(employees.id, parseInt(id)));
  return Response.json({ success: true });
}
