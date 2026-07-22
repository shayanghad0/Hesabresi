import { db } from "@/db";
import { income, expenses, employees, salaryPayments, bonuses } from "@/db/schema";
import { sql, desc } from "drizzle-orm";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

function formatNum(n: number): string {
  return n.toLocaleString("en-US");
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "income";

    let data: Record<string, unknown>[] = [];
    let headers: string[] = [];
    let sheetName = "Sheet1";

    if (type === "income") {
      sheetName = "درآمدها";
      headers = ["ردیف", "عنوان", "مبلغ", "مالیات", "مبلغ کل", "تاریخ"];
      const rows = await db.select().from(income).orderBy(desc(income.date));
      data = rows.map((r, i) => ({
        ردیف: i + 1,
        عنوان: r.title,
        مبلغ: formatNum(r.amount),
        مالیات: formatNum(r.taxAmount || 0),
        "مبلغ کل": formatNum(r.totalAmount || 0),
        تاریخ: r.date,
      }));
    } else if (type === "expenses") {
      sheetName = "هزینه‌ها";
      headers = ["ردیف", "عنوان", "مبلغ", "مالیات", "مبلغ کل", "تاریخ"];
      const rows = await db.select().from(expenses).orderBy(desc(expenses.date));
      data = rows.map((r, i) => ({
        ردیف: i + 1,
        عنوان: r.title,
        مبلغ: formatNum(r.amount),
        مالیات: formatNum(r.taxAmount || 0),
        "مبلغ کل": formatNum(r.totalAmount || 0),
        تاریخ: r.date,
      }));
    } else if (type === "employees") {
      sheetName = "کارکنان";
      const rows = await db.select().from(employees);
      data = rows.map((r, i) => ({
        ردیف: i + 1,
        نام: r.firstName,
        "نام خانوادگی": r.lastName,
        "کد ملی": r.nationalId || "",
        تلفن: r.phone || "",
        بخش: r.department || "",
        سمت: r.position || "",
        حقوق: formatNum(r.salary || 0),
        وضعیت: r.status === "active" ? "فعال" : "غیرفعال",
      }));
    } else if (type === "salary") {
      sheetName = "حقوق";
      const rows = await db
        .select({
          id: salaryPayments.id,
          employeeName: sql<string>`e.first_name || ' ' || e.last_name`,
          baseSalary: salaryPayments.baseSalary,
          bonus: salaryPayments.bonus,
          overtime: salaryPayments.overtime,
          deduction: salaryPayments.deduction,
          insurance: salaryPayments.insurance,
          taxAmount: salaryPayments.taxAmount,
          netSalary: salaryPayments.netSalary,
          paymentDate: salaryPayments.paymentDate,
        })
        .from(salaryPayments)
        .leftJoin(sql`employees e`, sql`e.id = ${salaryPayments.employeeId}`)
        .orderBy(desc(salaryPayments.createdAt));

      data = rows.map((r, i) => ({
        ردیف: i + 1,
        کارمند: r.employeeName,
        "حقوق پایه": formatNum(r.baseSalary),
        پاداش: formatNum(r.bonus || 0),
        اضافه‌کار: formatNum(r.overtime || 0),
        کسورات: formatNum(r.deduction || 0),
        بیمه: formatNum(r.insurance || 0),
        مالیات: formatNum(r.taxAmount || 0),
        "حقوق خالص": formatNum(r.netSalary),
        "تاریخ پرداخت": r.paymentDate,
      }));
    } else if (type === "bonuses") {
      sheetName = "پاداش‌ها";
      const rows = await db
        .select({
          id: bonuses.id,
          employeeName: sql<string>`e.first_name || ' ' || e.last_name`,
          amount: bonuses.amount,
          reason: bonuses.reason,
          date: bonuses.date,
        })
        .from(bonuses)
        .leftJoin(sql`employees e`, sql`e.id = ${bonuses.employeeId}`)
        .orderBy(desc(bonuses.createdAt));

      data = rows.map((r, i) => ({
        ردیف: i + 1,
        کارمند: r.employeeName,
        مبلغ: formatNum(r.amount),
        دلیل: r.reason || "",
        تاریخ: r.date,
      }));
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new Response(buf, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${type}-report.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return Response.json({ error: "خطای سرور" }, { status: 500 });
  }
}
