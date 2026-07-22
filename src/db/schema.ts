/**
 * Database Schema - Financial Management Platform
 * All tables for the complete accounting system
 */
import {
  pgTable,
  text,
  varchar,
  integer,
  bigint,
  boolean,
  timestamp,
  serial,
  jsonb,
  date,
  doublePrecision,
} from "drizzle-orm/pg-core";

// ===== ROLES =====
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  label: varchar("label", { length: 100 }).notNull(),
  permissions: jsonb("permissions").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===== USERS =====
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  roleId: integer("role_id").references(() => roles.id),
  avatar: text("avatar"),
  isActive: boolean("is_active").default(true).notNull(),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== EMPLOYEES =====
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  nationalId: varchar("national_id", { length: 20 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  department: varchar("department", { length: 100 }),
  position: varchar("position", { length: 100 }),
  salary: bigint("salary", { mode: "number" }).default(0),
  employmentDate: date("employment_date"),
  status: varchar("status", { length: 20 }).default("active"),
  notes: text("notes"),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== CATEGORIES =====
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'income' | 'expense'
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===== INCOME =====
export const income = pgTable("income", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  description: text("description"),
  amount: bigint("amount", { mode: "number" }).notNull(),
  taxRate: doublePrecision("tax_rate").default(9),
  taxAmount: bigint("tax_amount", { mode: "number" }).default(0),
  totalAmount: bigint("total_amount", { mode: "number" }).default(0),
  date: date("date").notNull(),
  createdBy: integer("created_by").references(() => users.id),
  attachment: text("attachment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== EXPENSES =====
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  description: text("description"),
  amount: bigint("amount", { mode: "number" }).notNull(),
  taxRate: doublePrecision("tax_rate").default(9),
  taxAmount: bigint("tax_amount", { mode: "number" }).default(0),
  totalAmount: bigint("total_amount", { mode: "number" }).default(0),
  date: date("date").notNull(),
  employeeId: integer("employee_id").references(() => employees.id),
  createdBy: integer("created_by").references(() => users.id),
  attachment: text("attachment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== SALARY =====
export const salaryPayments = pgTable("salary_payments", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  baseSalary: bigint("base_salary", { mode: "number" }).notNull(),
  bonus: bigint("bonus", { mode: "number" }).default(0),
  overtime: bigint("overtime", { mode: "number" }).default(0),
  deduction: bigint("deduction", { mode: "number" }).default(0),
  insurance: bigint("insurance", { mode: "number" }).default(0),
  taxRate: doublePrecision("tax_rate").default(9),
  taxAmount: bigint("tax_amount", { mode: "number" }).default(0),
  netSalary: bigint("net_salary", { mode: "number" }).notNull(),
  paymentDate: date("payment_date").notNull(),
  description: text("description"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===== BONUS =====
export const bonuses = pgTable("bonuses", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  amount: bigint("amount", { mode: "number" }).notNull(),
  reason: varchar("reason", { length: 255 }),
  date: date("date").notNull(),
  description: text("description"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===== SETTINGS =====
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== AUDIT LOG =====
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  entity: varchar("entity", { length: 100 }),
  entityId: integer("entity_id"),
  details: text("details"),
  ip: varchar("ip", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
