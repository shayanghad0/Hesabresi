import { db } from "@/db";
import { income, categories } from "@/db/schema";
import { desc, sql, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const categoryId = url.searchParams.get("categoryId") || "";
  const dateFrom = url.searchParams.get("dateFrom") || "";
  const dateTo = url.searchParams.get("dateTo") || "";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;

  const conditions: ReturnType<typeof sql>[] = [];

  if (search) {
    conditions.push(sql`${income.title} LIKE ${"%" + search + "%"}`);
  }
  if (categoryId) {
    conditions.push(sql`${income.categoryId} = ${parseInt(categoryId)}`);
  }
  if (dateFrom) {
    conditions.push(sql`${income.date} >= ${dateFrom}`);
  }
  if (dateTo) {
    conditions.push(sql`${income.date} <= ${dateTo}`);
  }

  const whereClause = conditions.length > 0 ? sql.join(conditions, sql` AND `) : sql`1=1`;

  const rows = await db
    .select({
      id: income.id,
      title: income.title,
      categoryId: income.categoryId,
      categoryName: sql<string>`c.name`,
      description: income.description,
      amount: income.amount,
      taxRate: income.taxRate,
      taxAmount: income.taxAmount,
      totalAmount: income.totalAmount,
      date: income.date,
      createdBy: income.createdBy,
      createdAt: income.createdAt,
    })
    .from(income)
    .leftJoin(sql`categories c`, sql`c.id = ${income.categoryId}`)
    .where(whereClause)
    .orderBy(desc(income.date))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(income)
    .where(whereClause);

  const sumResult = await db
    .select({ total: sql<number>`COALESCE(SUM(${income.totalAmount}), 0)` })
    .from(income)
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
    .insert(income)
    .values({
      title: body.title,
      categoryId: body.categoryId ? Number(body.categoryId) : null,
      description: body.description || null,
      amount,
      taxRate,
      taxAmount,
      totalAmount,
      date: body.date,
      createdBy: body.createdBy || null,
    })
    .returning();

  return Response.json({ data: result[0] }, { status: 201 });
}
