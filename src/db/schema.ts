/**
 * Database Schema - Financial Management Platform
 * SQLite version
 */
import {
  sqliteTable,
  text,
  integer,
  real,
} from "drizzle-orm/sqlite-core";

// ===== ROLES =====
export const roles = sqliteTable("roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { length: 50 }).notNull().unique(),
  label: text("label", { length: 100 }).notNull(),
  permissions: text("permissions", { mode: "json" }).$type<string[]>().default([]),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()).notNull(),
});

// ===== USERS =====
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email", { length: 255 }).notNull().unique(),
  name: text("name", { length: 255 }).notNull(),
  password: text("password", { length: 255 }).notNull(),
  roleId: integer("role_id").references(() => roles.id),
  avatar: text("avatar"),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  lastLogin: integer("last_login", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()).notNull(),
});

// ===== EMPLOYEES =====
export const employees = sqliteTable("employees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name", { length: 100 }).notNull(),
  lastName: text("last_name", { length: 100 }).notNull(),
  nationalId: text("national_id", { length: 20 }),
  phone: text("phone", { length: 20 }),
  email: text("email", { length: 255 }),
  department: text("department", { length: 100 }),
  position: text("position", { length: 100 }),
  salary: integer("salary").default(0),
  employmentDate: text("employment_date"),
  status: text("status", { length: 20 }).default("active"),
  notes: text("notes"),
  userId: integer("user_id").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()).notNull(),
});

// ===== CATEGORIES =====
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { length: 100 }).notNull(),
  type: text("type", { length: 20 }).notNull(),
  icon: text("icon", { length: 50 }),
  color: text("color", { length: 20 }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()).notNull(),
});

// ===== INCOME =====
export const income = sqliteTable("income", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title", { length: 255 }).notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  description: text("description"),
  amount: integer("amount").notNull(),
  taxRate: real("tax_rate").default(9),
  taxAmount: integer("tax_amount").default(0),
  totalAmount: integer("total_amount").default(0),
  date: text("date").notNull(),
  createdBy: integer("created_by").references(() => users.id),
  attachment: text("attachment"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()).notNull(),
});

// ===== EXPENSES =====
export const expenses = sqliteTable("expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title", { length: 255 }).notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  description: text("description"),
  amount: integer("amount").notNull(),
  taxRate: real("tax_rate").default(9),
  taxAmount: integer("tax_amount").default(0),
  totalAmount: integer("total_amount").default(0),
  date: text("date").notNull(),
  employeeId: integer("employee_id").references(() => employees.id),
  createdBy: integer("created_by").references(() => users.id),
  attachment: text("attachment"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()).notNull(),
});

// ===== SALARY =====
export const salaryPayments = sqliteTable("salary_payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  baseSalary: integer("base_salary").notNull(),
  bonus: integer("bonus").default(0),
  overtime: integer("overtime").default(0),
  deduction: integer("deduction").default(0),
  insurance: integer("insurance").default(0),
  taxRate: real("tax_rate").default(9),
  taxAmount: integer("tax_amount").default(0),
  netSalary: integer("net_salary").notNull(),
  paymentDate: text("payment_date").notNull(),
  description: text("description"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()).notNull(),
});

// ===== BONUS =====
export const bonuses = sqliteTable("bonuses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  amount: integer("amount").notNull(),
  reason: text("reason", { length: 255 }),
  date: text("date").notNull(),
  description: text("description"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()).notNull(),
});

// ===== SETTINGS =====
export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()).notNull(),
});

// ===== AUDIT LOG =====
export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  action: text("action", { length: 100 }).notNull(),
  entity: text("entity", { length: 100 }),
  entityId: integer("entity_id"),
  details: text("details"),
  ip: text("ip", { length: 50 }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()).notNull(),
});
