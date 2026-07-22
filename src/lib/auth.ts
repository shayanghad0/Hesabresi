/**
 * Authentication utilities
 */
import { db } from "@/db";
import { users, roles } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export interface SessionUser {
  id: number;
  email: string;
  name: string;
  roleId: number | null;
  roleName: string;
  permissions: string[];
}

/** Simple cookie-based session (production would use JWT/OAuth) */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  if (!sessionCookie?.value) return null;

  try {
    const data = JSON.parse(
      Buffer.from(sessionCookie.value, "base64").toString("utf-8")
    );
    return data as SessionUser;
  } catch {
    return null;
  }
}

export async function createSession(userId: number): Promise<string> {
  const userRows = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (userRows.length === 0) throw new Error("User not found");

  const user = userRows[0];
  let roleName = "employee";
  let permissions: string[] = [];

  if (user.roleId) {
    const roleRows = await db
      .select()
      .from(roles)
      .where(eq(roles.id, user.roleId))
      .limit(1);
    if (roleRows.length > 0) {
      roleName = roleRows[0].name;
      permissions = (roleRows[0].permissions as string[]) || [];
    }
  }

  const sessionData: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    roleId: user.roleId,
    roleName,
    permissions,
  };

  return Buffer.from(JSON.stringify(sessionData)).toString("base64");
}

export async function verifyPassword(
  email: string,
  password: string
): Promise<number | null> {
  const userRows = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (userRows.length === 0) return null;

  const user = userRows[0];
  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user.id : null;
}

export function hasPermission(
  session: SessionUser,
  permission: string
): boolean {
  if (session.roleName === "administrator") return true;
  return session.permissions.includes(permission);
}
