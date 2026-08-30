"use client";
import { useState, useEffect, type ReactNode, type FormEvent } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { toJalali } from "@/lib/utils";
import type { SessionUser } from "@/lib/auth";
import Spinner from "./Spinner";

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

const MENU_ITEMS: { key: Page; label: string; icon: string; path: string }[] = [
  { key: "dashboard", label: "داشبورد", icon: "📊", path: "/dashboard" },
  { key: "income", label: "درآمدها", icon: "💰", path: "/income" },
  { key: "expenses", label: "هزینه‌ها", icon: "💸", path: "/cost" },
  { key: "employees", label: "کارکنان", icon: "👥", path: "/employees" },
  { key: "salary", label: "حقوق و دستمزد", icon: "🏦", path: "/wages" },
  { key: "bonuses", label: "پاداش‌ها", icon: "🎁", path: "/remuneration" },
  { key: "categories", label: "دسته‌بندی‌ها", icon: "📁", path: "/categories" },
  { key: "reports", label: "گزارشات", icon: "📈", path: "/reports" },
  { key: "settings", label: "تنظیمات", icon: "⚙️", path: "/settings" },
];

export default function Shell({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentPage: Page = (MENU_ITEMS.find((m) => m.path === pathname)?.key || "dashboard") as Page;

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
    return (
      <LoginPageInline onLogin={setUser} />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden dark:bg-gray-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`no-print fixed lg:static inset-y-0 right-0 z-50 w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-lg lg:shadow-none transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-l from-blue-600 to-blue-700">
            <h1 className="text-white font-bold text-lg">سامانه مالی</h1>
            <p className="text-blue-200 text-xs mt-1">مدیریت مالی شرکت</p>
          </div>

          <nav className="flex-1 py-3 overflow-y-auto">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  currentPage === item.key
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-3 border-blue-600 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.roleName === "administrator" ? "مدیر سیستم" : user.roleName === "accountant" ? "حسابدار" : "کاربر"}</p>
              </div>
            </div>
            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
                setUser(null);
              }}
              className="w-full text-center text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg py-2 transition"
            >
              خروج از سیستم
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto dark:bg-gray-900">
        <header className="no-print bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-5 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            className="lg:hidden text-gray-600 dark:text-gray-300 text-2xl"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            {MENU_ITEMS.find((m) => m.key === currentPage)?.label || ""}
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 text-xl hover:scale-110 transition" aria-label="تغییر تم">
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400">{toJalali(new Date())}</div>
          </div>
        </header>

        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

function LoginPageInline({ onLogin }: { onLogin: (u: SessionUser) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.user) {
        onLogin(data.user);
      } else {
        setError(data.error || "خطا در ورود");
      }
    } catch {
      setError("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <span className="text-3xl">💰</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">سامانه مالی</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">ورود به سیستم مدیریت مالی</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="admin@company.ir"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition"
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </div>
    </div>
  );
}
