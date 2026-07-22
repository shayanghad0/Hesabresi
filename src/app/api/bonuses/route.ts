import { db } from "@/db";
import { bonuses } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const employeeId = url.searchParams.get("employeeId") || "";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;

  const conditions: ReturnType<typeof sql>[] = [];
  if (employeeId) {
    conditions.push(sql`${bonuses.employeeId} = ${parseInt(employeeId)}`);
  }
  const whereClause = conditions.length > 0 ? sql.join(conditions, sql` AND `) : sql`1=1`;

  const rows = await db
    .select({
      id: bonuses.id,
      employeeId: bonuses.employeeId,
      employeeName: sql<string>`e.first_name || ' ' || e.last_name`,
      amount: bonuses.amount,
      reason: bonuses.reason,
      date: bonuses.date,
      description: bonuses.description,
      createdAt: bonuses.createdAt,
    })
    .from(bonuses)
    .leftJoin(sql`employees e`, sql`e.id = ${bonuses.employeeId}`)
    .where(whereClause)
    .orderBy(desc(bonuses.createdAt))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(bonuses)
    .where(whereClause);

  return Response.json({
    data: rows,
    total: Number(countResult[0]?.count || 0),
    page,
    limit,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await db
    .insert(bonuses)
    .values({
      employeeId: Number(body.employeeId),
      amount: Number(body.amount),
      reason: body.reason || null,
      date: body.date,
      description: body.description || null,
      createdBy: body.createdBy || null,
    })
    .returning();
  return Response.json({ data: result[0] }, { status: 201 });
}
