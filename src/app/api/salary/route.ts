import { db } from "@/db";
import { salaryPayments } from "@/db/schema";
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
    conditions.push(sql`${salaryPayments.employeeId} = ${parseInt(employeeId)}`);
  }

  const whereClause = conditions.length > 0 ? sql.join(conditions, sql` AND `) : sql`1=1`;

  const rows = await db
    .select({
      id: salaryPayments.id,
      employeeId: salaryPayments.employeeId,
      employeeName: sql<string>`e.first_name || ' ' || e.last_name`,
      department: sql<string>`e.department`,
      baseSalary: salaryPayments.baseSalary,
      bonus: salaryPayments.bonus,
      overtime: salaryPayments.overtime,
      deduction: salaryPayments.deduction,
      insurance: salaryPayments.insurance,
      taxRate: salaryPayments.taxRate,
      taxAmount: salaryPayments.taxAmount,
      netSalary: salaryPayments.netSalary,
      paymentDate: salaryPayments.paymentDate,
      description: salaryPayments.description,
      createdAt: salaryPayments.createdAt,
    })
    .from(salaryPayments)
    .leftJoin(sql`employees e`, sql`e.id = ${salaryPayments.employeeId}`)
    .where(whereClause)
    .orderBy(desc(salaryPayments.createdAt))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(salaryPayments)
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
  const baseSalary = Number(body.baseSalary);
  const bonus = Number(body.bonus || 0);
  const overtime = Number(body.overtime || 0);
  const deduction = Number(body.deduction || 0);
  const insurance = Number(body.insurance || 0);
  const taxRate = body.taxRate != null ? Number(body.taxRate) : 9;

  const gross = baseSalary + bonus + overtime - deduction - insurance;
  const taxAmount = Math.floor(gross * taxRate / 100);
  const netSalary = gross - taxAmount;

  const result = await db
    .insert(salaryPayments)
    .values({
      employeeId: Number(body.employeeId),
      baseSalary,
      bonus,
      overtime,
      deduction,
      insurance,
      taxRate,
      taxAmount,
      netSalary,
      paymentDate: body.paymentDate,
      description: body.description || null,
      createdBy: body.createdBy || null,
    })
    .returning();

  return Response.json({ data: result[0] }, { status: 201 });
}
