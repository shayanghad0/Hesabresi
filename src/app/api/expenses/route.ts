import { db } from "@/db";
import { expenses } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const categoryId = url.searchParams.get("categoryId") || "";
  const employeeId = url.searchParams.get("employeeId") || "";
  const dateFrom = url.searchParams.get("dateFrom") || "";
  const dateTo = url.searchParams.get("dateTo") || "";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;

  const conditions: ReturnType<typeof sql>[] = [];

  if (search) {
    conditions.push(sql`${expenses.title} LIKE ${"%" + search + "%"}`);
  }
  if (categoryId) {
    conditions.push(sql`${expenses.categoryId} = ${parseInt(categoryId)}`);
  }
  if (employeeId) {
    conditions.push(sql`${expenses.employeeId} = ${parseInt(employeeId)}`);
  }
  if (dateFrom) {
    conditions.push(sql`${expenses.date} >= ${dateFrom}`);
  }
  if (dateTo) {
    conditions.push(sql`${expenses.date} <= ${dateTo}`);
  }

  const whereClause = conditions.length > 0 ? sql.join(conditions, sql` AND `) : sql`1=1`;

  const rows = await db
    .select({
      id: expenses.id,
      title: expenses.title,
      categoryId: expenses.categoryId,
      categoryName: sql<string>`c.name`,
      description: expenses.description,
      amount: expenses.amount,
      taxRate: expenses.taxRate,
      taxAmount: expenses.taxAmount,
      totalAmount: expenses.totalAmount,
      date: expenses.date,
      employeeId: expenses.employeeId,
      employeeName: sql<string>`COALESCE(e.first_name || ' ' || e.last_name, '')`,
      createdBy: expenses.createdBy,
      createdAt: expenses.createdAt,
    })
    .from(expenses)
    .leftJoin(sql`categories c`, sql`c.id = ${expenses.categoryId}`)
    .leftJoin(sql`employees e`, sql`e.id = ${expenses.employeeId}`)
    .where(whereClause)
    .orderBy(desc(expenses.date))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(expenses)
    .where(whereClause);

  const sumResult = await db
    .select({ total: sql<number>`COALESCE(SUM(${expenses.totalAmount}), 0)` })
    .from(expenses)
    .where(whereClause);

  return Response.json({
    data: rows,
    total: Number(countResult[0]?.count || 0),
    sum: Number(sumResult[0]?.total || 0),
    page,
    limit,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const amount = Number(body.amount);
  const taxRate = body.taxRate != null ? Number(body.taxRate) : 9;
  const taxAmount = Math.floor(amount * taxRate / 100);
  const totalAmount = amount + taxAmount;

  const result = await db
    .insert(expenses)
    .values({
      title: body.title,
      categoryId: body.categoryId ? Number(body.categoryId) : null,
      description: body.description || null,
      amount,
      taxRate,
      taxAmount,
      totalAmount,
      date: body.date,
      employeeId: body.employeeId ? Number(body.employeeId) : null,
      createdBy: body.createdBy || null,
    })
    .returning();

  return Response.json({ data: result[0] }, { status: 201 });
}
