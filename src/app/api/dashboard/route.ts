import { db } from "@/db";
import { income, expenses, employees, salaryPayments, bonuses, auditLogs } from "@/db/schema";
import { sql, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

    // Today's income
    const todayIncome = await db
      .select({ total: sql<number>`COALESCE(SUM(${income.totalAmount}), 0)` })
      .from(income)
      .where(sql`${income.date} = ${todayStr}`);

    // Today's expenses
    const todayExpense = await db
      .select({ total: sql<number>`COALESCE(SUM(${expenses.totalAmount}), 0)` })
      .from(expenses)
      .where(sql`${expenses.date} = ${todayStr}`);

    // Monthly income
    const monthlyIncome = await db
      .select({ total: sql<number>`COALESCE(SUM(${income.totalAmount}), 0)` })
      .from(income)
      .where(sql`${income.date} >= ${monthStart}`);

    // Monthly expenses
    const monthlyExpense = await db
      .select({ total: sql<number>`COALESCE(SUM(${expenses.totalAmount}), 0)` })
      .from(expenses)
      .where(sql`${expenses.date} >= ${monthStart}`);

    // Total income all time
    const totalIncome = await db
      .select({ total: sql<number>`COALESCE(SUM(${income.totalAmount}), 0)` })
      .from(income);

    // Total expenses all time
    const totalExpense = await db
      .select({ total: sql<number>`COALESCE(SUM(${expenses.totalAmount}), 0)` })
      .from(expenses);

    // Employee count
    const empCount = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(employees)
      .where(sql`${employees.status} = 'active'`);

    // Total salary paid
    const totalSalaryPaid = await db
      .select({ total: sql<number>`COALESCE(SUM(${salaryPayments.netSalary}), 0)` })
      .from(salaryPayments);

    // Total tax collected
    const totalTaxIncome = await db
      .select({ total: sql<number>`COALESCE(SUM(${income.taxAmount}), 0)` })
      .from(income);

    const totalTaxExpense = await db
      .select({ total: sql<number>`COALESCE(SUM(${expenses.taxAmount}), 0)` })
      .from(expenses);

    // Monthly chart data (last 6 months)
    const monthlyChartData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mStart = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
      const nextM = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const mEnd = `${nextM.getFullYear()}-${String(nextM.getMonth() + 1).padStart(2, "0")}-01`;

      const mInc = await db
        .select({ total: sql<number>`COALESCE(SUM(${income.totalAmount}), 0)` })
        .from(income)
        .where(sql`${income.date} >= ${mStart} AND ${income.date} < ${mEnd}`);

      const mExp = await db
        .select({ total: sql<number>`COALESCE(SUM(${expenses.totalAmount}), 0)` })
        .from(expenses)
        .where(sql`${expenses.date} >= ${mStart} AND ${expenses.date} < ${mEnd}`);

      const months = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
      const monthIndex = d.getMonth();

      monthlyChartData.push({
        month: months[monthIndex] || `ماه ${monthIndex + 1}`,
        income: Number(mInc[0]?.total || 0),
        expense: Number(mExp[0]?.total || 0),
        profit: Number(mInc[0]?.total || 0) - Number(mExp[0]?.total || 0),
      });
    }

    // Expense categories breakdown
    const expenseByCat = await db
      .select({
        category: sql<string>`COALESCE(c.name, 'سایر')`,
        total: sql<number>`COALESCE(SUM(${expenses.totalAmount}), 0)`,
      })
      .from(expenses)
      .leftJoin(sql`categories c`, sql`c.id = ${expenses.categoryId}`)
      .groupBy(sql`c.name`);

    // Recent transactions
    const recentIncome = await db
      .select()
      .from(income)
      .orderBy(desc(income.createdAt))
      .limit(5);

    const recentExpenses = await db
      .select()
      .from(expenses)
      .orderBy(desc(expenses.createdAt))
      .limit(5);

    // Total bonuses
    const totalBonuses = await db
      .select({ total: sql<number>`COALESCE(SUM(${bonuses.amount}), 0)` })
      .from(bonuses);

    const totalIncomeVal = Number(totalIncome[0]?.total || 0);
    const totalExpenseVal = Number(totalExpense[0]?.total || 0);
    const profit = totalIncomeVal - totalExpenseVal;

    return Response.json({
      todayIncome: Number(todayIncome[0]?.total || 0),
      todayExpense: Number(todayExpense[0]?.total || 0),
      monthlyIncome: Number(monthlyIncome[0]?.total || 0),
      monthlyExpense: Number(monthlyExpense[0]?.total || 0),
      totalIncome: totalIncomeVal,
      totalExpense: totalExpenseVal,
      profit: profit > 0 ? profit : 0,
      loss: profit < 0 ? Math.abs(profit) : 0,
      employeeCount: Number(empCount[0]?.count || 0),
      totalSalaryPaid: Number(totalSalaryPaid[0]?.total || 0),
      totalTax: Number(totalTaxIncome[0]?.total || 0) + Number(totalTaxExpense[0]?.total || 0),
      totalBonuses: Number(totalBonuses[0]?.total || 0),
      monthlyChartData,
      expenseByCategory: expenseByCat.map((e) => ({
        name: e.category,
        value: Number(e.total),
      })),
      recentIncome,
      recentExpenses,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return Response.json({ error: "خطای سرور" }, { status: 500 });
  }
}
