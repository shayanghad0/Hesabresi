import { db } from "@/db";
import { income, expenses, salaryPayments, bonuses, employees, categories } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const dateFrom = url.searchParams.get("dateFrom") || "2020-01-01";
    const dateTo = url.searchParams.get("dateTo") || "2030-12-31";

    const totalInc = await db
      .select({
        total: sql<number>`COALESCE(SUM(${income.totalAmount}), 0)`,
        tax: sql<number>`COALESCE(SUM(${income.taxAmount}), 0)`,
        net: sql<number>`COALESCE(SUM(${income.amount}), 0)`,
      })
      .from(income)
      .where(sql`${income.date} >= ${dateFrom} AND ${income.date} <= ${dateTo}`);

    const totalExp = await db
      .select({
        total: sql<number>`COALESCE(SUM(${expenses.totalAmount}), 0)`,
        tax: sql<number>`COALESCE(SUM(${expenses.taxAmount}), 0)`,
        net: sql<number>`COALESCE(SUM(${expenses.amount}), 0)`,
      })
      .from(expenses)
      .where(sql`${expenses.date} >= ${dateFrom} AND ${expenses.date} <= ${dateTo}`);

    const salaryTotals = await db
      .select({
        total: sql<number>`COALESCE(SUM(${salaryPayments.netSalary}), 0)`,
        tax: sql<number>`COALESCE(SUM(${salaryPayments.taxAmount}), 0)`,
        bonusTotal: sql<number>`COALESCE(SUM(${salaryPayments.bonus}), 0)`,
      })
      .from(salaryPayments)
      .where(sql`${salaryPayments.paymentDate} >= ${dateFrom} AND ${salaryPayments.paymentDate} <= ${dateTo}`);

    const bonusTotals = await db
      .select({
        total: sql<number>`COALESCE(SUM(${bonuses.amount}), 0)`,
      })
      .from(bonuses)
      .where(sql`${bonuses.date} >= ${dateFrom} AND ${bonuses.date} <= ${dateTo}`);

    const incByCategory = await db
      .select({
        category: sql<string>`COALESCE(${categories.name}, 'سایر')`,
        total: sql<number>`COALESCE(SUM(${income.totalAmount}), 0)`,
      })
      .from(income)
      .leftJoin(categories, eq(income.categoryId, categories.id))
      .where(sql`${income.date} >= ${dateFrom} AND ${income.date} <= ${dateTo}`)
      .groupBy(categories.name);

    const expByCategory = await db
      .select({
        category: sql<string>`COALESCE(${categories.name}, 'سایر')`,
        total: sql<number>`COALESCE(SUM(${expenses.totalAmount}), 0)`,
      })
      .from(expenses)
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .where(sql`${expenses.date} >= ${dateFrom} AND ${expenses.date} <= ${dateTo}`)
      .groupBy(categories.name);

    const topEmployees = await db
      .select({
        name: sql<string>`${employees.firstName} || ' ' || ${employees.lastName}`,
        department: employees.department,
        totalPaid: sql<number>`COALESCE(SUM(${salaryPayments.netSalary}), 0)`,
      })
      .from(salaryPayments)
      .leftJoin(employees, eq(salaryPayments.employeeId, employees.id))
      .where(sql`${salaryPayments.paymentDate} >= ${dateFrom} AND ${salaryPayments.paymentDate} <= ${dateTo}`)
      .groupBy(employees.firstName, employees.lastName, employees.department)
      .orderBy(sql`SUM(${salaryPayments.netSalary}) DESC`)
      .limit(5);

    const deptExpense = await db
      .select({
        department: sql<string>`COALESCE(${employees.department}, 'نامشخص')`,
        total: sql<number>`COALESCE(SUM(${salaryPayments.netSalary}), 0)`,
      })
      .from(salaryPayments)
      .leftJoin(employees, eq(salaryPayments.employeeId, employees.id))
      .where(sql`${salaryPayments.paymentDate} >= ${dateFrom} AND ${salaryPayments.paymentDate} <= ${dateTo}`)
      .groupBy(employees.department);

    const totalIncVal = Number(totalInc[0]?.total || 0);
    const totalExpVal = Number(totalExp[0]?.total || 0);
    const profit = totalIncVal - totalExpVal;

    return Response.json({
      summary: {
        totalIncome: totalIncVal,
        totalIncomeNet: Number(totalInc[0]?.net || 0),
        totalIncomeTax: Number(totalInc[0]?.tax || 0),
        totalExpense: totalExpVal,
        totalExpenseNet: Number(totalExp[0]?.net || 0),
        totalExpenseTax: Number(totalExp[0]?.tax || 0),
        profit: profit > 0 ? profit : 0,
        loss: profit < 0 ? Math.abs(profit) : 0,
        netProfit: profit,
        totalSalaryPaid: Number(salaryTotals[0]?.total || 0),
        totalSalaryTax: Number(salaryTotals[0]?.tax || 0),
        totalBonuses: Number(bonusTotals[0]?.total || 0),
        totalTax: Number(totalInc[0]?.tax || 0) + Number(totalExp[0]?.tax || 0) + Number(salaryTotals[0]?.tax || 0),
      },
      incomeByCategory: incByCategory.map((r) => ({ name: r.category, value: Number(r.total) })),
      expenseByCategory: expByCategory.map((r) => ({ name: r.category, value: Number(r.total) })),
      topEmployees: topEmployees.map((r) => ({
        name: r.name,
        department: r.department,
        totalPaid: Number(r.totalPaid),
      })),
      departmentExpense: deptExpense.map((r) => ({ name: r.department, value: Number(r.total) })),
      dateFrom,
      dateTo,
    });
  } catch (error) {
    console.error("Reports error:", error);
    return Response.json({ error: "خطای سرور" }, { status: 500 });
  }
}
