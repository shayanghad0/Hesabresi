"use client";

import { useState, useEffect, useCallback, type ReactNode, type FormEvent } from "react";

// ============================================================
// Types
// ============================================================
interface User {
  id: number;
  email: string;
  name: string;
  roleId: number | null;
  roleName: string;
  permissions: string[];
}

interface DashboardData {
  todayIncome: number;
  todayExpense: number;
  monthlyIncome: number;
  monthlyExpense: number;
  totalIncome: number;
  totalExpense: number;
  profit: number;
  loss: number;
  employeeCount: number;
  totalSalaryPaid: number;
  totalTax: number;
  totalBonuses: number;
  monthlyChartData: { month: string; income: number; expense: number; profit: number }[];
  expenseByCategory: { name: string; value: number }[];
  recentIncome: Record<string, unknown>[];
  recentExpenses: Record<string, unknown>[];
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  nationalId: string | null;
  phone: string | null;
  email: string | null;
  department: string | null;
  position: string | null;
  salary: number;
  employmentDate: string | null;
  status: string;
  notes: string | null;
}

interface Category {
  id: number;
  name: string;
  type: string;
  icon: string | null;
  color: string | null;
}

interface IncomeRecord {
  id: number;
  title: string;
  categoryId: number | null;
  categoryName?: string;
  description: string | null;
  amount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  date: string;
  createdAt: string;
}

interface ExpenseRecord {
  id: number;
  title: string;
  categoryId: number | null;
  categoryName?: string;
  description: string | null;
  amount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  date: string;
  employeeId: number | null;
  employeeName?: string;
  createdAt: string;
}

interface SalaryRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  department: string;
  baseSalary: number;
  bonus: number;
  overtime: number;
  deduction: number;
  insurance: number;
  taxRate: number;
  taxAmount: number;
  netSalary: number;
  paymentDate: string;
  description: string | null;
}

interface BonusRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  amount: number;
  reason: string | null;
  date: string;
  description: string | null;
}

interface ReportData {
  summary: {
    totalIncome: number;
    totalIncomeNet: number;
    totalIncomeTax: number;
    totalExpense: number;
    totalExpenseNet: number;
    totalExpenseTax: number;
    profit: number;
    loss: number;
    netProfit: number;
    totalSalaryPaid: number;
    totalSalaryTax: number;
    totalBonuses: number;
    totalTax: number;
  };
  incomeByCategory: { name: string; value: number }[];
  expenseByCategory: { name: string; value: number }[];
  topEmployees: { name: string; department: string; totalPaid: number }[];
  departmentExpense: { name: string; value: number }[];
  dateFrom: string;
  dateTo: string;
}

// ============================================================
// Utility Functions
// ============================================================
const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
function toPersian(str: string | number): string {
  return String(str).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
}

function formatCurrency(amount: number | null | undefined): string {
  if (amount == null || amount === 0) return toPersian("0") + " ریال";
  return toPersian(Math.abs(amount).toLocaleString("en-US")) + " ریال";
}

function formatNum(n: number | null | undefined): string {
  if (n == null) return toPersian("0");
  return toPersian(n.toLocaleString("en-US"));
}

const JALALI_BREAKS = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181,
  1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178,
];

function gregorianToJalali(gy: number, gm: number, gd: number) {
  const gDaysInMonth = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    gDaysInMonth[gm - 1];
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm =
    days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return { jy, jm, jd };
}

function toJalali(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  const { jy, jm, jd } = gregorianToJalali(
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate()
  );
  return toPersian(
    `${jy}/${String(jm).padStart(2, "0")}/${String(jd).padStart(2, "0")}`
  );
}

// ============================================================
// Simple Chart Components (SVG-based, no external lib)
// ============================================================
const CHART_COLORS = [
  "#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#64748b",
];

function BarChart({
  data,
  width = 600,
  height = 300,
}: {
  data: { label: string; values: number[]; colors?: string[] }[];
  width?: number;
  height?: number;
}) {
  if (data.length === 0) return <div className="text-center text-gray-400 py-8">داده‌ای موجود نیست</div>;
  const maxVal = Math.max(...data.flatMap((d) => d.values), 1);
  const barW = Math.min(30, (width - 80) / (data.length * data[0].values.length + data.length));
  const groupW = barW * (data[0]?.values.length || 1) + 10;
  const chartW = Math.max(width, data.length * groupW + 80);

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${chartW} ${height + 40}`}
        className="w-full"
        style={{ minWidth: 300, maxHeight: height + 40 }}
      >
        {/* Y axis */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line
              x1={60}
              y1={height - f * (height - 40)}
              x2={chartW - 10}
              y2={height - f * (height - 40)}
              stroke="#e5e7eb"
              strokeWidth={0.5}
            />
          </g>
        ))}
        {/* Bars */}
        {data.map((d, i) => (
          <g key={i}>
            {d.values.map((v, j) => {
              const barH = (v / maxVal) * (height - 40);
              const x = 70 + i * groupW + j * barW;
              const color = d.colors?.[j] || CHART_COLORS[j % CHART_COLORS.length];
              return (
                <rect
                  key={j}
                  x={x}
                  y={height - barH}
                  width={barW - 2}
                  height={barH}
                  fill={color}
                  rx={3}
                />
              );
            })}
            <text
              x={70 + i * groupW + (d.values.length * barW) / 2}
              y={height + 18}
              textAnchor="middle"
              className="text-[9px] fill-gray-500"
              style={{ fontFamily: "Vazirmatn, sans-serif", fontSize: 9 }}
            >
              {d.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function PieChart({
  data,
  size = 200,
}: {
  data: { name: string; value: number }[];
  size?: number;
}) {
  if (data.length === 0) return <div className="text-center text-gray-400 py-8">داده‌ای موجود نیست</div>;
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div className="text-center text-gray-400 py-8">داده‌ای موجود نیست</div>;
  const r = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;
  let startAngle = 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size}>
        {data.map((d, i) => {
          const angle = (d.value / total) * 360;
          const endAngle = startAngle + angle;
          const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
          const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);
          const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180);
          const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180);
          const largeArc = angle > 180 ? 1 : 0;
          const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
          startAngle = endAngle;
          return (
            <path
              key={i}
              d={path}
              fill={CHART_COLORS[i % CHART_COLORS.length]}
              stroke="white"
              strokeWidth={2}
            />
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-2 justify-center">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1 text-xs">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            <span>{d.name} ({toPersian(Math.round((d.value / total) * 100))}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChart({
  data,
  width = 600,
  height = 250,
}: {
  data: { label: string; value: number }[];
  width?: number;
  height?: number;
}) {
  if (data.length === 0) return <div className="text-center text-gray-400 py-8">داده‌ای موجود نیست</div>;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const paddingX = 60;
  const paddingY = 30;
  const chartW = width - paddingX - 20;
  const chartH = height - paddingY - 20;

  const points = data.map((d, i) => ({
    x: paddingX + (i / Math.max(data.length - 1, 1)) * chartW,
    y: paddingY + chartH - (d.value / maxVal) * chartH,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaD =
    pathD +
    ` L ${points[points.length - 1].x} ${paddingY + chartH} L ${points[0].x} ${paddingY + chartH} Z`;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ minWidth: 300 }}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={paddingX}
            y1={paddingY + chartH - f * chartH}
            x2={width - 20}
            y2={paddingY + chartH - f * chartH}
            stroke="#e5e7eb"
            strokeWidth={0.5}
          />
        ))}
        <path d={areaD} fill="url(#lineGrad)" />
        <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth={2.5} />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} fill="white" stroke="#3b82f6" strokeWidth={2} />
            <text
              x={p.x}
              y={paddingY + chartH + 16}
              textAnchor="middle"
              className="text-[9px] fill-gray-500"
              style={{ fontFamily: "Vazirmatn, sans-serif", fontSize: 9 }}
            >
              {data[i].label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ============================================================
// UI Components
// ============================================================

function Spinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color = "blue",
}: {
  title: string;
  value: string;
  icon: string;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    red: "from-red-500 to-red-600",
    yellow: "from-amber-500 to-amber-600",
    purple: "from-purple-500 to-purple-600",
    cyan: "from-cyan-500 to-cyan-600",
    pink: "from-pink-500 to-pink-600",
    indigo: "from-indigo-500 to-indigo-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">{title}</p>
          <p className="text-sm font-bold text-gray-800">{value}</p>
        </div>
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorMap[color] || colorMap.blue} flex items-center justify-center text-white text-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b px-5 py-4 flex items-center justify-between z-10">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50"
        {...props}
      />
    </div>
  );
}

function Select({
  label,
  options,
  ...props
}: {
  label: string;
  options: { value: string; label: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50"
        {...props}
      >
        <option value="">انتخاب کنید</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextArea({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50"
        rows={3}
        {...props}
      />
    </div>
  );
}

function Button({
  children,
  variant = "primary",
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants: Record<string, string> = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white",
  };
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${variants[variant]} disabled:opacity-50`}
      {...props}
    >
      {children}
    </button>
  );
}

// ============================================================
// Main App
// ============================================================
type Page =
  | "dashboard"
  | "employees"
  | "categories"
  | "income"
  | "expenses"
  | "salary"
  | "bonuses"
  | "reports"
  | "settings";

const MENU_ITEMS: { key: Page; label: string; icon: string }[] = [
  { key: "dashboard", label: "داشبورد", icon: "📊" },
  { key: "income", label: "درآمدها", icon: "💰" },
  { key: "expenses", label: "هزینه‌ها", icon: "💸" },
  { key: "employees", label: "کارکنان", icon: "👥" },
  { key: "salary", label: "حقوق و دستمزد", icon: "🏦" },
  { key: "bonuses", label: "پاداش‌ها", icon: "🎁" },
  { key: "categories", label: "دسته‌بندی‌ها", icon: "📁" },
  { key: "reports", label: "گزارشات", icon: "📈" },
  { key: "settings", label: "تنظیمات", icon: "⚙️" },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 right-0 z-50 w-64 bg-white border-l border-gray-200 shadow-lg lg:shadow-none transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-5 border-b bg-gradient-to-l from-blue-600 to-blue-700">
            <h1 className="text-white font-bold text-lg">سامانه مالی</h1>
            <p className="text-blue-200 text-xs mt-1">مدیریت مالی شرکت</p>
          </div>

          <nav className="flex-1 py-3 overflow-y-auto">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setCurrentPage(item.key);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  currentPage === item.key
                    ? "bg-blue-50 text-blue-700 border-l-3 border-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-gray-500">{user.roleName === "administrator" ? "مدیر سیستم" : user.roleName === "accountant" ? "حسابدار" : "کاربر"}</p>
              </div>
            </div>
            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
                setUser(null);
              }}
              className="w-full text-center text-sm text-red-600 hover:bg-red-50 rounded-lg py-2 transition"
            >
              خروج از سیستم
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="bg-white border-b px-5 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            className="lg:hidden text-gray-600 text-2xl"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <h2 className="text-lg font-bold text-gray-800">
            {MENU_ITEMS.find((m) => m.key === currentPage)?.label || ""}
          </h2>
          <div className="text-sm text-gray-500">{toJalali(new Date())}</div>
        </header>

        <div className="p-4 lg:p-6">
          {currentPage === "dashboard" && <DashboardPage />}
          {currentPage === "employees" && <EmployeesPage />}
          {currentPage === "categories" && <CategoriesPage />}
          {currentPage === "income" && <IncomePage />}
          {currentPage === "expenses" && <ExpensesPage />}
          {currentPage === "salary" && <SalaryPage />}
          {currentPage === "bonuses" && <BonusesPage />}
          {currentPage === "reports" && <ReportsPage />}
          {currentPage === "settings" && <SettingsPage />}
        </div>
      </main>
    </div>
  );
}

// ============================================================
// Login Page
// ============================================================
function LoginPage({ onLogin }: { onLogin: (u: User) => void }) {
  const [email, setEmail] = useState("admin@company.ir");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در ورود");
        return;
      }
      // Use user from login response directly
      if (data.user) {
        onLogin(data.user);
      } else {
        // Fallback to /me endpoint
        const meRes = await fetch("/api/auth/me", { credentials: "include" });
        const meData = await meRes.json();
        if (meData.user) onLogin(meData.user);
        else setError("خطا در دریافت اطلاعات کاربر");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("خطای ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-3xl">
            💰
          </div>
          <h1 className="text-2xl font-bold text-gray-900">سامانه مدیریت مالی</h1>
          <p className="text-gray-500 text-sm mt-2">برای ورود اطلاعات خود را وارد کنید</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          <Input
            label="ایمیل"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@company.ir"
          />
          <Input
            label="رمز عبور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? "در حال ورود..." : "ورود به سیستم"}
          </button>

          <div className="mt-4 text-xs text-gray-400 text-center">
            <p>ایمیل: admin@company.ir</p>
            <p>رمز عبور: admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// Dashboard Page
// ============================================================
function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data) return <div>خطا در بارگذاری</div>;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard title="درآمد امروز" value={formatCurrency(data.todayIncome)} icon="📈" color="green" />
        <StatCard title="هزینه امروز" value={formatCurrency(data.todayExpense)} icon="📉" color="red" />
        <StatCard title="درآمد ماهانه" value={formatCurrency(data.monthlyIncome)} icon="💰" color="blue" />
        <StatCard title="هزینه ماهانه" value={formatCurrency(data.monthlyExpense)} icon="💸" color="yellow" />
        <StatCard title="کل درآمد" value={formatCurrency(data.totalIncome)} icon="🏦" color="green" />
        <StatCard title="کل هزینه" value={formatCurrency(data.totalExpense)} icon="🧾" color="red" />
        <StatCard title="سود" value={formatCurrency(data.profit)} icon="📊" color="cyan" />
        {data.loss > 0 && <StatCard title="زیان" value={formatCurrency(data.loss)} icon="⚠️" color="red" />}
        <StatCard title="تعداد کارکنان" value={formatNum(data.employeeCount)} icon="👥" color="purple" />
        <StatCard title="حقوق پرداختی" value={formatCurrency(data.totalSalaryPaid)} icon="💳" color="indigo" />
        <StatCard title="مجموع مالیات" value={formatCurrency(data.totalTax)} icon="🏛️" color="pink" />
        <StatCard title="پاداش‌ها" value={formatCurrency(data.totalBonuses)} icon="🎁" color="yellow" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-bold text-gray-800 mb-4">📊 درآمد و هزینه ماهانه</h3>
          <BarChart
            data={data.monthlyChartData.map((m) => ({
              label: m.month,
              values: [m.income / 1000000, m.expense / 1000000],
              colors: ["#22c55e", "#ef4444"],
            }))}
          />
          <div className="flex gap-4 justify-center mt-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded" /> درآمد (میلیون)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded" /> هزینه (میلیون)</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-bold text-gray-800 mb-4">📊 دسته‌بندی هزینه‌ها</h3>
          <PieChart data={data.expenseByCategory} size={220} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-bold text-gray-800 mb-4">📈 روند سود</h3>
          <LineChart
            data={data.monthlyChartData.map((m) => ({
              label: m.month,
              value: Math.max(m.profit / 1000000, 0),
            }))}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-bold text-gray-800 mb-4">🔄 آخرین تراکنش‌ها</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...data.recentIncome.map((r: any) => ({ ...r, _type: "income" })), ...data.recentExpenses.map((r: any) => ({ ...r, _type: "expense" }))]
              .sort((a: any, b: any) => new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime())
              .slice(0, 8)
              .map((t: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${t._type === "income" ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-sm">{t.title}</span>
                  </div>
                  <span className={`text-sm font-medium ${t._type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {t._type === "income" ? "+" : "-"}{formatCurrency(t.totalAmount || t.total_amount)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Employees Page
// ============================================================
function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Employee | null>(null);
  const [form, setForm] = useState<Partial<Employee>>({});

  const loadData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/employees?search=${search}`);
    const data = await res.json();
    setEmployees(data.data || []);
    setLoading(false);
  }, [search]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? `/api/employees/${editItem.id}` : "/api/employees";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowModal(false);
    setEditItem(null);
    setForm({});
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    loadData();
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ status: "active" });
    setShowModal(true);
  };

  const openEdit = (emp: Employee) => {
    setEditItem(emp);
    setForm(emp);
    setShowModal(true);
  };

  const handleExport = () => {
    window.open("/api/export?type=employees", "_blank");
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-2">
          <Button onClick={openAdd}>+ افزودن کارمند</Button>
          <Button variant="secondary" onClick={handleExport}>📥 خروجی اکسل</Button>
        </div>
        <input
          type="text"
          placeholder="جستجو..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-64 bg-gray-50"
        />
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right font-medium text-gray-600">نام</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">بخش</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">سمت</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">حقوق</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">تلفن</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">وضعیت</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium">{emp.firstName} {emp.lastName}</td>
                  <td className="px-4 py-3 text-gray-600">{emp.department || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{emp.position || "-"}</td>
                  <td className="px-4 py-3">{formatCurrency(emp.salary)}</td>
                  <td className="px-4 py-3 text-gray-600">{emp.phone ? toPersian(emp.phone) : "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${emp.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {emp.status === "active" ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(emp)} className="text-blue-600 hover:text-blue-800 text-xs">ویرایش</button>
                      <button onClick={() => handleDelete(emp.id)} className="text-red-600 hover:text-red-800 text-xs">حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400">کارمندی یافت نشد</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? "ویرایش کارمند" : "افزودن کارمند"}
      >
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-2 gap-3">
            <Input label="نام" required value={form.firstName || ""} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <Input label="نام خانوادگی" required value={form.lastName || ""} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            <Input label="کد ملی" value={form.nationalId || ""} onChange={(e) => setForm({ ...form, nationalId: e.target.value })} />
            <Input label="تلفن" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="ایمیل" type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="بخش" value={form.department || ""} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            <Input label="سمت" value={form.position || ""} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            <Input label="حقوق (ریال)" type="number" value={form.salary || ""} onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })} />
          </div>
          <Input label="تاریخ استخدام" type="date" value={form.employmentDate || ""} onChange={(e) => setForm({ ...form, employmentDate: e.target.value })} />
          <Select
            label="وضعیت"
            value={form.status || "active"}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={[
              { value: "active", label: "فعال" },
              { value: "inactive", label: "غیرفعال" },
            ]}
          />
          <TextArea label="یادداشت" value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex gap-2 mt-4">
            <Button type="submit">{editItem ? "بروزرسانی" : "ذخیره"}</Button>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>انصراف</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ============================================================
// Categories Page
// ============================================================
function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Category>>({ type: "expense" });

  const loadData = async () => {
    setLoading(true);
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.data || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowModal(false);
    setForm({ type: "expense" });
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    loadData();
  };

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  return (
    <div>
      <div className="mb-5">
        <Button onClick={() => setShowModal(true)}>+ افزودن دسته‌بندی</Button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Expense categories */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="px-5 py-3 bg-red-50 rounded-t-xl border-b">
              <h3 className="font-bold text-red-700">دسته‌بندی هزینه‌ها</h3>
            </div>
            <div className="p-4 space-y-2">
              {expenseCategories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span>{cat.icon || "📋"}</span>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700 text-xs">حذف</button>
                </div>
              ))}
            </div>
          </div>

          {/* Income categories */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="px-5 py-3 bg-green-50 rounded-t-xl border-b">
              <h3 className="font-bold text-green-700">دسته‌بندی درآمدها</h3>
            </div>
            <div className="p-4 space-y-2">
              {incomeCategories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span>{cat.icon || "📋"}</span>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700 text-xs">حذف</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="افزودن دسته‌بندی">
        <form onSubmit={handleSave}>
          <Input label="نام دسته‌بندی" required value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Select
            label="نوع"
            value={form.type || "expense"}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            options={[
              { value: "expense", label: "هزینه" },
              { value: "income", label: "درآمد" },
            ]}
          />
          <Input label="آیکون (ایموجی)" value={form.icon || ""} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
          <div className="flex gap-2 mt-4">
            <Button type="submit">ذخیره</Button>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>انصراف</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ============================================================
// Income Page
// ============================================================
function IncomePage() {
  const [records, setRecords] = useState<IncomeRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<IncomeRecord | null>(null);
  const [total, setTotal] = useState(0);
  const [sum, setSum] = useState(0);
  const [form, setForm] = useState<Record<string, any>>({ taxRate: 9 });

  const loadData = useCallback(async () => {
    setLoading(true);
    const [res, catRes] = await Promise.all([
      fetch(`/api/income?search=${search}`),
      fetch("/api/categories?type=income"),
    ]);
    const data = await res.json();
    const catData = await catRes.json();
    setRecords(data.data || []);
    setTotal(data.total || 0);
    setSum(data.sum || 0);
    setCategories(catData.data || []);
    setLoading(false);
  }, [search]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? `/api/income/${editItem.id}` : "/api/income";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowModal(false);
    setEditItem(null);
    setForm({ taxRate: 9 });
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    await fetch(`/api/income/${id}`, { method: "DELETE" });
    loadData();
  };

  const openEdit = (item: IncomeRecord) => {
    setEditItem(item);
    setForm({
      title: item.title,
      categoryId: item.categoryId,
      description: item.description,
      amount: item.amount,
      taxRate: item.taxRate,
      date: item.date,
    });
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-2">
          <Button onClick={() => { setEditItem(null); setForm({ taxRate: 9 }); setShowModal(true); }}>+ ثبت درآمد</Button>
          <Button variant="secondary" onClick={() => window.open("/api/export?type=income", "_blank")}>📥 خروجی اکسل</Button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg font-medium">
            مجموع: {formatCurrency(sum)}
          </span>
          <input
            type="text"
            placeholder="جستجو..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-48 bg-gray-50"
          />
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right font-medium text-gray-600">عنوان</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">دسته‌بندی</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">مبلغ</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">مالیات</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">مبلغ کل</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">تاریخ</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{r.title}</td>
                  <td className="px-4 py-3 text-gray-600">{r.categoryName || "-"}</td>
                  <td className="px-4 py-3 text-green-600">{formatCurrency(r.amount)}</td>
                  <td className="px-4 py-3 text-gray-500">{formatCurrency(r.taxAmount)}</td>
                  <td className="px-4 py-3 font-medium text-green-700">{formatCurrency(r.totalAmount)}</td>
                  <td className="px-4 py-3 text-gray-600">{toJalali(r.date)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(r)} className="text-blue-600 text-xs">ویرایش</button>
                      <button onClick={() => handleDelete(r.id)} className="text-red-600 text-xs">حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400">رکوردی یافت نشد</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? "ویرایش درآمد" : "ثبت درآمد جدید"}
      >
        <form onSubmit={handleSave}>
          <Input label="عنوان" required value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Select
            label="دسته‌بندی"
            value={form.categoryId || ""}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
          />
          <Input label="مبلغ (ریال)" type="number" required value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Input label="نرخ مالیات (%)" type="number" value={form.taxRate || 9} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} />
          {form.amount && (
            <div className="bg-blue-50 rounded-lg p-3 text-sm mb-3">
              <div className="flex justify-between"><span>مالیات:</span><span>{formatCurrency(Math.floor(Number(form.amount) * (Number(form.taxRate) || 9) / 100))}</span></div>
              <div className="flex justify-between font-bold mt-1"><span>مبلغ کل:</span><span>{formatCurrency(Number(form.amount) + Math.floor(Number(form.amount) * (Number(form.taxRate) || 9) / 100))}</span></div>
            </div>
          )}
          <Input label="تاریخ" type="date" required value={form.date || ""} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <TextArea label="توضیحات" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex gap-2 mt-4">
            <Button type="submit">{editItem ? "بروزرسانی" : "ذخیره"}</Button>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>انصراف</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ============================================================
// Expenses Page
// ============================================================
function ExpensesPage() {
  const [records, setRecords] = useState<ExpenseRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<ExpenseRecord | null>(null);
  const [sum, setSum] = useState(0);
  const [form, setForm] = useState<Record<string, any>>({ taxRate: 9 });

  const loadData = useCallback(async () => {
    setLoading(true);
    const [res, catRes, empRes] = await Promise.all([
      fetch(`/api/expenses?search=${search}`),
      fetch("/api/categories?type=expense"),
      fetch("/api/employees"),
    ]);
    const data = await res.json();
    const catData = await catRes.json();
    const empData = await empRes.json();
    setRecords(data.data || []);
    setSum(data.sum || 0);
    setCategories(catData.data || []);
    setEmployees(empData.data || []);
    setLoading(false);
  }, [search]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? `/api/expenses/${editItem.id}` : "/api/expenses";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowModal(false);
    setEditItem(null);
    setForm({ taxRate: 9 });
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    loadData();
  };

  const openEdit = (item: ExpenseRecord) => {
    setEditItem(item);
    setForm({
      title: item.title,
      categoryId: item.categoryId,
      description: item.description,
      amount: item.amount,
      taxRate: item.taxRate,
      date: item.date,
      employeeId: item.employeeId,
    });
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-2">
          <Button onClick={() => { setEditItem(null); setForm({ taxRate: 9 }); setShowModal(true); }}>+ ثبت هزینه</Button>
          <Button variant="secondary" onClick={() => window.open("/api/export?type=expenses", "_blank")}>📥 خروجی اکسل</Button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-lg font-medium">
            مجموع: {formatCurrency(sum)}
          </span>
          <input
            type="text"
            placeholder="جستجو..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-48 bg-gray-50"
          />
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right font-medium text-gray-600">عنوان</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">دسته‌بندی</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">مبلغ</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">مالیات</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">مبلغ کل</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">کارمند</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">تاریخ</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{r.title}</td>
                  <td className="px-4 py-3 text-gray-600">{r.categoryName || "-"}</td>
                  <td className="px-4 py-3 text-red-600">{formatCurrency(r.amount)}</td>
                  <td className="px-4 py-3 text-gray-500">{formatCurrency(r.taxAmount)}</td>
                  <td className="px-4 py-3 font-medium text-red-700">{formatCurrency(r.totalAmount)}</td>
                  <td className="px-4 py-3 text-gray-600">{r.employeeName || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{toJalali(r.date)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(r)} className="text-blue-600 text-xs">ویرایش</button>
                      <button onClick={() => handleDelete(r.id)} className="text-red-600 text-xs">حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">رکوردی یافت نشد</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? "ویرایش هزینه" : "ثبت هزینه جدید"}
      >
        <form onSubmit={handleSave}>
          <Input label="عنوان" required value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Select
            label="دسته‌بندی"
            value={form.categoryId || ""}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
          />
          <Input label="مبلغ (ریال)" type="number" required value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Input label="نرخ مالیات (%)" type="number" value={form.taxRate || 9} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} />
          {form.amount && (
            <div className="bg-blue-50 rounded-lg p-3 text-sm mb-3">
              <div className="flex justify-between"><span>مالیات:</span><span>{formatCurrency(Math.floor(Number(form.amount) * (Number(form.taxRate) || 9) / 100))}</span></div>
              <div className="flex justify-between font-bold mt-1"><span>مبلغ کل:</span><span>{formatCurrency(Number(form.amount) + Math.floor(Number(form.amount) * (Number(form.taxRate) || 9) / 100))}</span></div>
            </div>
          )}
          <Select
            label="کارمند مرتبط"
            value={form.employeeId || ""}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            options={employees.map((emp) => ({ value: String(emp.id), label: `${emp.firstName} ${emp.lastName}` }))}
          />
          <Input label="تاریخ" type="date" required value={form.date || ""} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <TextArea label="توضیحات" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex gap-2 mt-4">
            <Button type="submit">{editItem ? "بروزرسانی" : "ذخیره"}</Button>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>انصراف</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ============================================================
// Salary Page
// ============================================================
function SalaryPage() {
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({ taxRate: 9, bonus: 0, overtime: 0, deduction: 0, insurance: 0 });

  const loadData = async () => {
    setLoading(true);
    const [res, empRes] = await Promise.all([
      fetch("/api/salary"),
      fetch("/api/employees"),
    ]);
    const data = await res.json();
    const empData = await empRes.json();
    setRecords(data.data || []);
    setEmployees(empData.data || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    await fetch("/api/salary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowModal(false);
    setForm({ taxRate: 9, bonus: 0, overtime: 0, deduction: 0, insurance: 0 });
    loadData();
  };

  const selectEmployee = (empId: string) => {
    const emp = employees.find((e) => e.id === parseInt(empId));
    setForm({
      ...form,
      employeeId: empId,
      baseSalary: emp?.salary || 0,
    });
  };

  const calcNet = () => {
    const gross = Number(form.baseSalary || 0) + Number(form.bonus || 0) + Number(form.overtime || 0) - Number(form.deduction || 0) - Number(form.insurance || 0);
    const tax = Math.floor(gross * Number(form.taxRate || 9) / 100);
    return { gross, tax, net: gross - tax };
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-2">
          <Button onClick={() => setShowModal(true)}>+ ثبت حقوق</Button>
          <Button variant="secondary" onClick={() => window.open("/api/export?type=salary", "_blank")}>📥 خروجی اکسل</Button>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-right font-medium text-gray-600 text-xs">کارمند</th>
                <th className="px-3 py-3 text-right font-medium text-gray-600 text-xs">بخش</th>
                <th className="px-3 py-3 text-right font-medium text-gray-600 text-xs">حقوق پایه</th>
                <th className="px-3 py-3 text-right font-medium text-gray-600 text-xs">پاداش</th>
                <th className="px-3 py-3 text-right font-medium text-gray-600 text-xs">اضافه‌کار</th>
                <th className="px-3 py-3 text-right font-medium text-gray-600 text-xs">کسورات</th>
                <th className="px-3 py-3 text-right font-medium text-gray-600 text-xs">بیمه</th>
                <th className="px-3 py-3 text-right font-medium text-gray-600 text-xs">مالیات</th>
                <th className="px-3 py-3 text-right font-medium text-gray-600 text-xs">خالص</th>
                <th className="px-3 py-3 text-right font-medium text-gray-600 text-xs">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-3 font-medium text-xs">{r.employeeName}</td>
                  <td className="px-3 py-3 text-gray-600 text-xs">{r.department || "-"}</td>
                  <td className="px-3 py-3 text-xs">{formatCurrency(r.baseSalary)}</td>
                  <td className="px-3 py-3 text-green-600 text-xs">{formatCurrency(r.bonus)}</td>
                  <td className="px-3 py-3 text-blue-600 text-xs">{formatCurrency(r.overtime)}</td>
                  <td className="px-3 py-3 text-red-600 text-xs">{formatCurrency(r.deduction)}</td>
                  <td className="px-3 py-3 text-orange-600 text-xs">{formatCurrency(r.insurance)}</td>
                  <td className="px-3 py-3 text-purple-600 text-xs">{formatCurrency(r.taxAmount)}</td>
                  <td className="px-3 py-3 font-bold text-xs">{formatCurrency(r.netSalary)}</td>
                  <td className="px-3 py-3 text-gray-600 text-xs">{toJalali(r.paymentDate)}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr><td colSpan={10} className="text-center py-8 text-gray-400">رکوردی یافت نشد</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="ثبت حقوق جدید">
        <form onSubmit={handleSave}>
          <Select
            label="کارمند"
            required
            value={form.employeeId || ""}
            onChange={(e) => selectEmployee(e.target.value)}
            options={employees.map((emp) => ({ value: String(emp.id), label: `${emp.firstName} ${emp.lastName}` }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="حقوق پایه" type="number" required value={form.baseSalary || ""} onChange={(e) => setForm({ ...form, baseSalary: e.target.value })} />
            <Input label="پاداش" type="number" value={form.bonus || 0} onChange={(e) => setForm({ ...form, bonus: e.target.value })} />
            <Input label="اضافه‌کار" type="number" value={form.overtime || 0} onChange={(e) => setForm({ ...form, overtime: e.target.value })} />
            <Input label="کسورات" type="number" value={form.deduction || 0} onChange={(e) => setForm({ ...form, deduction: e.target.value })} />
            <Input label="بیمه" type="number" value={form.insurance || 0} onChange={(e) => setForm({ ...form, insurance: e.target.value })} />
            <Input label="مالیات (%)" type="number" value={form.taxRate || 9} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} />
          </div>
          <Input label="تاریخ پرداخت" type="date" required value={form.paymentDate || ""} onChange={(e) => setForm({ ...form, paymentDate: e.target.value })} />
          <TextArea label="توضیحات" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />

          {form.baseSalary && (
            <div className="bg-blue-50 rounded-lg p-3 text-sm my-3 space-y-1">
              <div className="flex justify-between"><span>ناخالص:</span><span>{formatCurrency(calcNet().gross)}</span></div>
              <div className="flex justify-between text-purple-600"><span>مالیات:</span><span>{formatCurrency(calcNet().tax)}</span></div>
              <div className="flex justify-between font-bold border-t pt-1"><span>خالص دریافتی:</span><span>{formatCurrency(calcNet().net)}</span></div>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <Button type="submit">ثبت حقوق</Button>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>انصراف</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ============================================================
// Bonuses Page
// ============================================================
function BonusesPage() {
  const [records, setRecords] = useState<BonusRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});

  const loadData = async () => {
    setLoading(true);
    const [res, empRes] = await Promise.all([
      fetch("/api/bonuses"),
      fetch("/api/employees"),
    ]);
    const data = await res.json();
    const empData = await empRes.json();
    setRecords(data.data || []);
    setEmployees(empData.data || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    await fetch("/api/bonuses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowModal(false);
    setForm({});
    loadData();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-2">
          <Button onClick={() => setShowModal(true)}>+ ثبت پاداش</Button>
          <Button variant="secondary" onClick={() => window.open("/api/export?type=bonuses", "_blank")}>📥 خروجی اکسل</Button>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right font-medium text-gray-600">کارمند</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">مبلغ</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">دلیل</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">تاریخ</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">توضیحات</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{r.employeeName}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">{formatCurrency(r.amount)}</td>
                  <td className="px-4 py-3 text-gray-600">{r.reason || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{toJalali(r.date)}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{r.description || "-"}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">رکوردی یافت نشد</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="ثبت پاداش جدید">
        <form onSubmit={handleSave}>
          <Select
            label="کارمند"
            required
            value={form.employeeId || ""}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            options={employees.map((emp) => ({ value: String(emp.id), label: `${emp.firstName} ${emp.lastName}` }))}
          />
          <Input label="مبلغ (ریال)" type="number" required value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Input label="دلیل" value={form.reason || ""} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          <Input label="تاریخ" type="date" required value={form.date || ""} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <TextArea label="توضیحات" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex gap-2 mt-4">
            <Button type="submit">ثبت پاداش</Button>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>انصراف</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ============================================================
// Reports Page
// ============================================================
function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState("2024-01-01");
  const [dateTo, setDateTo] = useState("2024-12-31");

  const loadReport = async () => {
    setLoading(true);
    const res = await fetch(`/api/reports?dateFrom=${dateFrom}&dateTo=${dateTo}`);
    const d = await res.json();
    setData(d);
    setLoading(false);
  };

  useEffect(() => { loadReport(); }, []);

  if (loading) return <Spinner />;
  if (!data) return <div className="text-center py-8"><Button onClick={loadReport}>بارگذاری گزارش</Button></div>;

  const s = data.summary;
  const profitPercent = s.totalIncome > 0 ? Math.round((s.netProfit / s.totalIncome) * 100) : 0;
  const salaryPercent = s.totalExpense > 0 ? Math.round((s.totalSalaryPaid / s.totalExpense) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-wrap gap-3 items-end">
        <Input label="از تاریخ" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <Input label="تا تاریخ" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        <Button onClick={loadReport}>تولید گزارش</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard title="کل درآمد" value={formatCurrency(s.totalIncome)} icon="💰" color="green" />
        <StatCard title="کل هزینه" value={formatCurrency(s.totalExpense)} icon="💸" color="red" />
        <StatCard title="سود خالص" value={formatCurrency(s.netProfit)} icon="📊" color={s.netProfit >= 0 ? "cyan" : "red"} />
        <StatCard title="مجموع مالیات" value={formatCurrency(s.totalTax)} icon="🏛️" color="purple" />
        <StatCard title="حقوق پرداختی" value={formatCurrency(s.totalSalaryPaid)} icon="💳" color="indigo" />
        <StatCard title="پاداش‌ها" value={formatCurrency(s.totalBonuses)} icon="🎁" color="yellow" />
      </div>

      {/* Persian Analysis */}
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h3 className="font-bold text-gray-800 mb-4">📝 تحلیل هوشمند مالی</h3>
        <div className="space-y-3 text-sm text-gray-700 leading-7">
          <p>• مجموع درآمد شرکت در بازه زمانی انتخاب شده برابر با <strong>{formatCurrency(s.totalIncome)}</strong> می‌باشد.</p>
          <p>• مجموع هزینه‌های شرکت برابر با <strong>{formatCurrency(s.totalExpense)}</strong> ثبت شده است.</p>
          <p>• سود خالص شرکت برابر با <strong>{formatCurrency(s.netProfit)}</strong> می‌باشد
            {s.netProfit > 0 ? " که نشان‌دهنده عملکرد مالی مثبت است." : " که نیاز به بررسی و بهبود دارد."}
          </p>
          <p>• مجموع مالیات محاسبه شده برابر با <strong>{formatCurrency(s.totalTax)}</strong> است.</p>
          <p>• هزینه حقوق کارکنان <strong>{toPersian(salaryPercent)}٪</strong> از کل هزینه‌ها را تشکیل می‌دهد.</p>
          {s.netProfit > 0 && <p>• حاشیه سود شرکت <strong>{toPersian(profitPercent)}٪</strong> می‌باشد.</p>}
          {data.expenseByCategory.length > 0 && (
            <p>• بیشترین هزینه مربوط به بخش <strong>{data.expenseByCategory.sort((a, b) => b.value - a.value)[0]?.name}</strong> بوده است.</p>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-bold text-gray-800 mb-4">📊 دسته‌بندی هزینه‌ها</h3>
          <PieChart data={data.expenseByCategory} size={220} />
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-bold text-gray-800 mb-4">📊 دسته‌بندی درآمدها</h3>
          <PieChart data={data.incomeByCategory} size={220} />
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-bold text-gray-800 mb-4">👥 هزینه بخش‌ها</h3>
          <BarChart
            data={data.departmentExpense.map((d) => ({
              label: d.name,
              values: [d.value / 1000000],
              colors: ["#6366f1"],
            }))}
          />
          <p className="text-xs text-gray-400 text-center mt-2">مبالغ به میلیون ریال</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-bold text-gray-800 mb-4">🏆 پردرآمدترین کارکنان</h3>
          <div className="space-y-3">
            {data.topEmployees.map((emp, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">{toPersian(i + 1)}</span>
                  <div>
                    <p className="text-sm font-medium">{emp.name}</p>
                    <p className="text-xs text-gray-500">{emp.department}</p>
                  </div>
                </div>
                <span className="text-sm font-medium">{formatCurrency(emp.totalPaid)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Settings Page
// ============================================================
function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.data || {}))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold mb-6">تنظیمات سیستم</h3>

        <Input
          label="نام شرکت"
          value={settings.company_name || ""}
          onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
        />
        <Input
          label="نرخ مالیات پیش‌فرض (%)"
          type="number"
          value={settings.default_tax || "9"}
          onChange={(e) => setSettings({ ...settings, default_tax: e.target.value })}
        />
        <Input
          label="واحد پول"
          value={settings.currency || "IRR"}
          onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
        />
        <Input
          label="آدرس"
          value={settings.address || ""}
          onChange={(e) => setSettings({ ...settings, address: e.target.value })}
        />
        <Input
          label="تلفن"
          value={settings.phone || ""}
          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
        />
        <Input
          label="ایمیل شرکت"
          value={settings.company_email || ""}
          onChange={(e) => setSettings({ ...settings, company_email: e.target.value })}
        />

        <div className="mt-6 flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
          </Button>
          {saved && (
            <span className="text-green-600 text-sm">✅ تنظیمات با موفقیت ذخیره شد</span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
        <h3 className="text-lg font-bold mb-4">اطلاعات سیستم</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>نسخه: <span className="font-medium">۱.۰.۰</span></p>
          <p>پایگاه داده: PostgreSQL</p>
          <p>فریم‌ورک: Next.js + TypeScript</p>
          <p>واحد پول: ریال ایران (IRR)</p>
          <p>تقویم: شمسی (جلالی)</p>
        </div>
      </div>
    </div>
  );
}
