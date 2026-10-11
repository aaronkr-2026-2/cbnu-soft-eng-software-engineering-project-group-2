import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { setSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username =
      typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    const db = await getDb();
    const user = await db.collection("users").findOne({ username });

    const ok = user && (await verifyPassword(password, user.passwordHash));
    if (!user || !ok) {
      return NextResponse.json(
        { error: "Wrong username or password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        username: user.username,
        role: user.role === "admin" ? "admin" : "user",
      },
    });
    setSessionCookie(response, user._id.toString());
    return response;
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}