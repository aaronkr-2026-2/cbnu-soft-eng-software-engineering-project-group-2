import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username =
      typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!/^[a-z0-9_.-]{3,30}$/.test(username)) {
      return NextResponse.json(
        { error: "Username must be 3-30 characters (letters, numbers, _ . -)." },
        { status: 400 }
      );
    }
    if (password.length < 8 || password.length > 100) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const users = db.collection("users");
    await users.createIndex({ username: 1 }, { unique: true });

    let insertedId;
    try {
      const result = await users.insertOne({
        username,
        passwordHash: await hashPassword(password),
        role: "user", // бүртгүүлэгч үргэлж энгийн хэрэглэгч
        createdAt: new Date(),
      });
      insertedId = result.insertedId;
    } catch (err) {
      if ((err as { code?: number }).code === 11000) {
        return NextResponse.json(
          { error: "This username is already taken." },
          { status: 409 }
        );
      }
      throw err;
    }

    const response = NextResponse.json(
      { user: { id: insertedId.toString(), username, role: "user" } },
      { status: 201 }
    );
    setSessionCookie(response, insertedId.toString());
    return response;
  } catch {
    return NextResponse.json({ error: "Could not register." }, { status: 500 });
  }
}