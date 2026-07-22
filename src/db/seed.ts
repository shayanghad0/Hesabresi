/**
 * Database Seed Script
 * Seeds initial data for the Financial Management Platform (SQLite)
 */
import { db } from "./index";
import {
  roles,
  users,
  categories,
  settings,
  employees,
  income,
  expenses,
  salaryPayments,
  bonuses,
} from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  // Seed Roles
  const roleData = [
    {
      name: "administrator",
      label: "مدیر سیستم",
      permissions: [
        "full_access",
        "manage_users",
        "manage_roles",
        "settings",
        "reports",
        "employees",
        "categories",
        "financial_records",
        "export",
      ],
    },
    {
      name: "accountant",
      label: "حسابدار",
      permissions: [
        "add_income",
        "add_expense",
        "register_salary",
        "register_bonus",
        "register_reimbursement",
        "view_reports",
        "export",
      ],
    },
    {
      name: "manager",
      label: "مدیر",
      permissions: ["dashboard", "reports", "profit_loss", "employee_overview"],
    },
    {
      name: "employee",
      label: "کارمند",
      permissions: [
        "view_own_salary",
        "view_bonuses",
        "view_payments",
        "download_own_reports",
      ],
    },
  ];

  for (const r of roleData) {
    const existing = await db.select().from(roles).where(eq(roles.name, r.name)).limit(1);
    if (existing.length === 0) {
      await db.insert(roles).values(r);
    }
  }
  console.log("Roles seeded");

  // Seed Admin User
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const existingAdmin = await db
    .select()
    .from(users)
    .where(eq(users.email, "admin@company.ir"))
    .limit(1);

  if (existingAdmin.length === 0) {
    await db.insert(users).values({
      email: "admin@company.ir",
      name: "مدیر سیستم",
      password: hashedPassword,
      roleId: 1,
      isActive: true,
    });
  }

  // Seed Accountant
  const existingAccountant = await db
    .select()
    .from(users)
    .where(eq(users.email, "accountant@company.ir"))
    .limit(1);

  if (existingAccountant.length === 0) {
    await db.insert(users).values({
      email: "accountant@company.ir",
      name: "حسابدار شرکت",
      password: await bcrypt.hash("accountant123", 10),
      roleId: 2,
      isActive: true,
    });
  }
  console.log("Users seeded");

  // Seed Categories
  const categoryData = [
    { name: "دفتری", type: "expense", icon: "📎", color: "#6366f1" },
    { name: "غذا و تغذیه", type: "expense", icon: "🍕", color: "#f59e0b" },
    { name: "بازاریابی", type: "expense", icon: "📢", color: "#ec4899" },
    { name: "تجهیزات", type: "expense", icon: "🖥️", color: "#8b5cf6" },
    { name: "حمل و نقل", type: "expense", icon: "🚗", color: "#14b8a6" },
    { name: "تعمیرات", type: "expense", icon: "🔧", color: "#f97316" },
    { name: "آب و برق و گاز", type: "expense", icon: "💡", color: "#eab308" },
    { name: "حقوق", type: "expense", icon: "💰", color: "#22c55e" },
    { name: "پاداش", type: "expense", icon: "🎁", color: "#3b82f6" },
    { name: "بیمه", type: "expense", icon: "🛡️", color: "#64748b" },
    { name: "مالیات", type: "expense", icon: "🏛️", color: "#ef4444" },
    { name: "سایر هزینه‌ها", type: "expense", icon: "📋", color: "#94a3b8" },
    { name: "فروش", type: "income", icon: "🛒", color: "#22c55e" },
    { name: "خدمات", type: "income", icon: "⚙️", color: "#3b82f6" },
    { name: "سرمایه‌گذاری", type: "income", icon: "📈", color: "#8b5cf6" },
    { name: "مشاوره", type: "income", icon: "💼", color: "#f59e0b" },
    { name: "سایر درآمدها", type: "income", icon: "📊", color: "#94a3b8" },
  ];

  const existingCategories = await db.select().from(categories).limit(1);
  if (existingCategories.length === 0) {
    for (const c of categoryData) {
      await db.insert(categories).values(c);
    }
  }
  console.log("Categories seeded");

  // Seed Settings
  const settingsData = [
    { key: "company_name", value: "شرکت نمونه" },
    { key: "default_tax", value: "9" },
    { key: "currency", value: "IRR" },
    { key: "address", value: "تهران، خیابان ولیعصر" },
    { key: "phone", value: "021-12345678" },
    { key: "company_email", value: "info@company.ir" },
  ];

  for (const s of settingsData) {
    const existing = await db.select().from(settings).where(eq(settings.key, s.key)).limit(1);
    if (existing.length === 0) {
      await db.insert(settings).values(s);
    }
  }
  console.log("Settings seeded");

  // Seed Employees
  const existingEmployees = await db.select().from(employees).limit(1);
  if (existingEmployees.length === 0) {
    const empData = [
      {
        firstName: "علی",
        lastName: "احمدی",
        nationalId: "0012345678",
        phone: "09121234567",
        email: "ali@company.ir",
        department: "فنی",
        position: "توسعه‌دهنده ارشد",
        salary: 85000000,
        employmentDate: "1402-01-15",
        status: "active",
      },
      {
        firstName: "مریم",
        lastName: "محمدی",
        nationalId: "0023456789",
        phone: "09132345678",
        email: "maryam@company.ir",
        department: "مالی",
        position: "حسابدار",
        salary: 65000000,
        employmentDate: "1401-06-01",
        status: "active",
      },
      {
        firstName: "رضا",
        lastName: "کریمی",
        nationalId: "0034567890",
        phone: "09143456789",
        email: "reza@company.ir",
        department: "بازاریابی",
        position: "مدیر بازاریابی",
        salary: 95000000,
        employmentDate: "1400-03-10",
        status: "active",
      },
      {
        firstName: "فاطمه",
        lastName: "حسینی",
        nationalId: "0045678901",
        phone: "09154567890",
        email: "fatemeh@company.ir",
        department: "منابع انسانی",
        position: "کارشناس منابع انسانی",
        salary: 60000000,
        employmentDate: "1402-04-20",
        status: "active",
      },
      {
        firstName: "محمد",
        lastName: "رضایی",
        nationalId: "0056789012",
        phone: "09165678901",
        email: "mohammad@company.ir",
        department: "فنی",
        position: "توسعه‌دهنده",
        salary: 70000000,
        employmentDate: "1402-07-05",
        status: "active",
      },
    ];

    for (const emp of empData) {
      await db.insert(employees).values(emp);
    }
  }
  console.log("Employees seeded");

  // Seed Income
  const existingIncome = await db.select().from(income).limit(1);
  if (existingIncome.length === 0) {
    const incomeData = [
      { title: "فروش محصول نرم‌افزاری", categoryId: 13, amount: 500000000, taxRate: 9, date: "2024-01-15" },
      { title: "خدمات مشاوره فنی", categoryId: 16, amount: 150000000, taxRate: 9, date: "2024-01-20" },
      { title: "فروش لایسنس", categoryId: 13, amount: 300000000, taxRate: 9, date: "2024-02-10" },
      { title: "قرارداد پشتیبانی", categoryId: 14, amount: 200000000, taxRate: 9, date: "2024-02-15" },
      { title: "فروش محصول جدید", categoryId: 13, amount: 750000000, taxRate: 9, date: "2024-03-01" },
      { title: "درآمد سرمایه‌گذاری", categoryId: 15, amount: 100000000, taxRate: 9, date: "2024-03-10" },
      { title: "خدمات طراحی وب", categoryId: 14, amount: 120000000, taxRate: 9, date: "2024-04-05" },
      { title: "فروش اشتراک ماهانه", categoryId: 13, amount: 450000000, taxRate: 9, date: "2024-04-20" },
    ];

    for (const inc of incomeData) {
      const taxAmount = Math.floor(inc.amount * inc.taxRate / 100);
      await db.insert(income).values({
        ...inc,
        taxAmount,
        totalAmount: inc.amount + taxAmount,
        createdBy: 1,
      });
    }
  }
  console.log("Income seeded");

  // Seed Expenses
  const existingExpenses = await db.select().from(expenses).limit(1);
  if (existingExpenses.length === 0) {
    const expenseData = [
      { title: "اجاره دفتر", categoryId: 1, amount: 80000000, taxRate: 9, date: "2024-01-01", employeeId: null },
      { title: "خرید تجهیزات کامپیوتری", categoryId: 4, amount: 120000000, taxRate: 9, date: "2024-01-10", employeeId: 1 },
      { title: "هزینه تبلیغات", categoryId: 3, amount: 50000000, taxRate: 9, date: "2024-02-01", employeeId: 3 },
      { title: "قبض برق و گاز", categoryId: 7, amount: 15000000, taxRate: 9, date: "2024-02-15", employeeId: null },
      { title: "هزینه غذای کارکنان", categoryId: 2, amount: 25000000, taxRate: 9, date: "2024-03-01", employeeId: null },
      { title: "تعمیرات ساختمان", categoryId: 6, amount: 35000000, taxRate: 9, date: "2024-03-15", employeeId: null },
      { title: "بیمه تکمیلی", categoryId: 10, amount: 40000000, taxRate: 9, date: "2024-04-01", employeeId: null },
      { title: "هزینه حمل و نقل", categoryId: 5, amount: 18000000, taxRate: 9, date: "2024-04-10", employeeId: 2 },
    ];

    for (const exp of expenseData) {
      const taxAmount = Math.floor(exp.amount * exp.taxRate / 100);
      await db.insert(expenses).values({
        ...exp,
        taxAmount,
        totalAmount: exp.amount + taxAmount,
        createdBy: 1,
      });
    }
  }
  console.log("Expenses seeded");

  // Seed Salary Payments
  const existingSalary = await db.select().from(salaryPayments).limit(1);
  if (existingSalary.length === 0) {
    const salaryData = [
      { employeeId: 1, baseSalary: 85000000, bonus: 5000000, overtime: 10000000, deduction: 2000000, insurance: 6000000 },
      { employeeId: 2, baseSalary: 65000000, bonus: 3000000, overtime: 5000000, deduction: 1000000, insurance: 5000000 },
      { employeeId: 3, baseSalary: 95000000, bonus: 10000000, overtime: 8000000, deduction: 3000000, insurance: 7000000 },
      { employeeId: 4, baseSalary: 60000000, bonus: 2000000, overtime: 4000000, deduction: 1500000, insurance: 4500000 },
      { employeeId: 5, baseSalary: 70000000, bonus: 4000000, overtime: 6000000, deduction: 2000000, insurance: 5000000 },
    ];

    for (const sal of salaryData) {
      const gross = sal.baseSalary + sal.bonus + sal.overtime - sal.deduction - sal.insurance;
      const taxAmount = Math.floor(gross * 9 / 100);
      const netSalary = gross - taxAmount;
      await db.insert(salaryPayments).values({
        ...sal,
        taxRate: 9,
        taxAmount,
        netSalary,
        paymentDate: "2024-03-29",
        description: "حقوق اسفند ۱۴۰۲",
        createdBy: 1,
      });
    }
  }
  console.log("Salary payments seeded");

  // Seed Bonuses
  const existingBonuses = await db.select().from(bonuses).limit(1);
  if (existingBonuses.length === 0) {
    await db.insert(bonuses).values([
      { employeeId: 1, amount: 20000000, reason: "عملکرد عالی", date: "2024-03-20", description: "پاداش پایان سال" },
      { employeeId: 3, amount: 15000000, reason: "جذب مشتری جدید", date: "2024-02-15", description: "پاداش ویژه بازاریابی" },
      { employeeId: 5, amount: 10000000, reason: "اتمام پروژه", date: "2024-04-01", description: "پاداش تکمیل پروژه" },
    ]);
  }
  console.log("Bonuses seeded");

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
