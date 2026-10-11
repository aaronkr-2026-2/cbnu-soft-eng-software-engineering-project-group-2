import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import type { SessionUser } from "@/lib/permissions";

if (!process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET is missing from .env.local");
}

export const COOKIE_NAME = "session";
export const MAX_AGE = 60 * 60 * 24 * 7; // 7 хоног

function scrypt(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, 64, (err, key) =>
      err ? reject(err) : resolve(key)
    );
  });
}

// ---------- Нууц үг ----------
export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, "hex");
  const actual = await scrypt(password, Buffer.from(saltHex, "hex"));
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

// ---------- Session token ----------
function sign(value: string) {
  return createHmac("sha256", process.env.AUTH_SECRET ?? "")
    .update(value)
    .digest("hex");
}

function createToken(userId: string) {
  const data = `${userId}.${Date.now() + MAX_AGE * 1000}`;
  return `${data}.${sign(data)}`;
}

function readToken(token?: string): string | null {
  if (!token || !process.env.AUTH_SECRET) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [userId, expires, signature] = parts;
  const a = Buffer.from(signature);
  const b = Buffer.from(sign(`${userId}.${expires}`));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(expires) <= Date.now()) return null;

  return userId;
}

export function setSessionCookie(response: NextResponse, userId: string) {
  response.cookies.set(COOKIE_NAME, createToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

// ---------- Одоогийн хэрэглэгч ----------
// Role-ийг cookie-оос биш DB-ээс уншдаг тул role өөрчлөгдвөл шууд хүчинтэй болно.
export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const userId = readToken(store.get(COOKIE_NAME)?.value);
  if (!userId || !ObjectId.isValid(userId)) return null;

  const db = await getDb();
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });
  if (!user) return null;

  return {
    id: user._id.toString(),
    username: user.username,
    role: user.role === "admin" ? "admin" : "user",
  };
}