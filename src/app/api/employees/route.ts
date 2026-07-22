import { db } from "@/db";
import { employees } from "@/db/schema";
import { desc, sql, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const department = url.searchParams.get("department") || "";
    const status = url.searchParams.get("status") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    let query = db.select().from(employees);
    const conditions: ReturnType<typeof sql>[] = [];

    if (search) {
      conditions.push(
        sql`(${employees.firstName} LIKE ${"%" + search + "%"} OR ${employees.lastName} LIKE ${"%" + search + "%"} OR ${employees.email} LIKE ${"%" + search + "%"})`
      );
    }
    if (department) {
      conditions.push(sql`${employees.department} = ${department}`);
    }
    if (status) {
      conditions.push(sql`${employees.status} = ${status}`);
    }

    const whereClause =
      conditions.length > 0
        ? sql.join(conditions, sql` AND `)
        : sql`1=1`;

    const rows = await db
      .select()
      .from(employees)
      .where(whereClause)
      .orderBy(desc(employees.createdAt))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(employees)
      .where(whereClause);

    return Response.json({
      data: rows,
      total: Number(countResult[0]?.count || 0),
      page,
      limit,
    });
  } catch (error) {
    console.error("Employees GET error:", error);
    return Response.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await db.insert(employees).values({
      firstName: body.firstName,
      lastName: body.lastName,
      nationalId: body.nationalId || null,
      phone: body.phone || null,
      email: body.email || null,
      department: body.department || null,
      position: body.position || null,
      salary: body.salary ? Number(body.salary) : 0,
      employmentDate: body.employmentDate || null,
      status: body.status || "active",
      notes: body.notes || null,
    }).returning();

    return Response.json({ data: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Employee POST error:", error);
    return Response.json({ error: "خطای سرور" }, { status: 500 });
  }
}
