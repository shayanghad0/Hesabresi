import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");

  const conditions = type ? eq(categories.type, type) : sql`1=1`;
  const rows = await db.select().from(categories).where(conditions);
  return Response.json({ data: rows });
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await db
    .insert(categories)
    .values({
      name: body.name,
      type: body.type,
      icon: body.icon || null,
      color: body.color || null,
    })
    .returning();
  return Response.json({ data: result[0] }, { status: 201 });
}
