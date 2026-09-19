/**
 * Database initialization script
 * Creates the SQLite database and seeds it with initial data.
 * Uses Drizzle ORM directly to avoid drizzle-kit push bugs with SQLite.
 */
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "data", "hesabresi.db");

// Ensure data directory exists
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Remove existing db to start fresh (--force equivalent)
try {
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
    console.log("Deleted existing database");
  }
} catch (e: any) {
  if (e.code === "EBUSY") {
    console.log("Database is locked, will create tables in existing database");
  } else {
    throw e;
  }
}

const client = createClient({ url: `file:${DB_PATH}` });

async function main() {
  console.log("Creating tables...");

  await client.execute(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name TEXT(50) NOT NULL UNIQUE,
      label TEXT(100) NOT NULL,
      permissions TEXT DEFAULT '[]',
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      email TEXT(255) NOT NULL UNIQUE,
      name TEXT(255) NOT NULL,
      password TEXT(255) NOT NULL,
      role_id INTEGER REFERENCES roles(id),
      avatar TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      last_login INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      first_name TEXT(100) NOT NULL,
      last_name TEXT(100) NOT NULL,
      national_id TEXT(20),
      phone TEXT(20),
      email TEXT(255),
      department TEXT(100),
      position TEXT(100),
      salary INTEGER DEFAULT 0,
      employment_date TEXT,
      status TEXT(20) DEFAULT 'active',
      notes TEXT,
      user_id INTEGER REFERENCES users(id),
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name TEXT(100) NOT NULL,
      type TEXT(20) NOT NULL,
      icon TEXT(50),
      color TEXT(20),
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS income (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      title TEXT(255) NOT NULL,
      category_id INTEGER REFERENCES categories(id),
      description TEXT,
      amount INTEGER NOT NULL,
      tax_rate REAL DEFAULT 9,
      tax_amount INTEGER DEFAULT 0,
      total_amount INTEGER DEFAULT 0,
      date TEXT NOT NULL,
      created_by INTEGER REFERENCES users(id),
      attachment TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      title TEXT(255) NOT NULL,
      category_id INTEGER REFERENCES categories(id),
      description TEXT,
      amount INTEGER NOT NULL,
      tax_rate REAL DEFAULT 9,
      tax_amount INTEGER DEFAULT 0,
      total_amount INTEGER DEFAULT 0,
      date TEXT NOT NULL,
      employee_id INTEGER REFERENCES employees(id),
      created_by INTEGER REFERENCES users(id),
      attachment TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS salary_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      employee_id INTEGER NOT NULL REFERENCES employees(id),
      base_salary INTEGER NOT NULL,
      bonus INTEGER DEFAULT 0,
      overtime INTEGER DEFAULT 0,
      deduction INTEGER DEFAULT 0,
      insurance INTEGER DEFAULT 0,
      tax_rate REAL DEFAULT 9,
      tax_amount INTEGER DEFAULT 0,
      net_salary INTEGER NOT NULL,
      payment_date TEXT NOT NULL,
      description TEXT,
      created_by INTEGER REFERENCES users(id),
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS bonuses (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      employee_id INTEGER NOT NULL REFERENCES employees(id),
      amount INTEGER NOT NULL,
      reason TEXT(255),
      date TEXT NOT NULL,
      description TEXT,
      created_by INTEGER REFERENCES users(id),
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      key TEXT(100) NOT NULL UNIQUE,
      value TEXT NOT NULL,
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      user_id INTEGER REFERENCES users(id),
      action TEXT(100) NOT NULL,
      entity TEXT(100),
      entity_id INTEGER,
      details TEXT,
      ip TEXT(50),
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  console.log("Tables created successfully");
  await client.close();
}

main().catch((err) => {
  console.error("DB init error:", err);
  process.exit(1);
});
