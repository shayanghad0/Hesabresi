import { db } from "@/db";
import { users, roles } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "ایمیل و رمز عبور الزامی است" },
        { status: 400 }
      );
    }

    // Find user
    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userRows.length === 0) {
      return NextResponse.json(
        { error: "ایمیل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    const user = userRows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "ایمیل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    // Get role info
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

    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      roleId: user.roleId,
      roleName,
      permissions,
    };

    const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString("base64");

    const response = NextResponse.json({ success: true, user: sessionData });
    
    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
