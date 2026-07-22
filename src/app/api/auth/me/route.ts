import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    
    if (!sessionCookie?.value) {
      return Response.json({ user: null });
    }

    const sessionData = JSON.parse(
      Buffer.from(sessionCookie.value, "base64").toString("utf-8")
    );

    return Response.json({ user: sessionData });
  } catch (error) {
    console.error("Auth me error:", error);
    return Response.json({ user: null });
  }
}
