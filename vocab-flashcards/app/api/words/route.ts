import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";

// GET /api/words
// GET /api/words?due=true
// Үг бүрт ЭНЭ хэрэглэгчийн прогрессийг нэгтгэж буцаана
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !can(user, "word:read")) {
      return NextResponse.json({ error: "Please log in." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dueOnly = searchParams.get("due") === "true";

    const db = await getDb();
    const words = await db
      .collection("words")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    const progressList = await db
      .collection("progress")
      .find({ userId: user.id })
      .toArray();

    const progressByWord = new Map(
      progressList.map((p) => [String(p.wordId), p])
    );

    const now = new Date();
    let result = words.map((item) => {
      const id = (item._id as ObjectId).toString();
      const p = progressByWord.get(id);
      return {
        ...item,
        _id: id,
        // прогресс байхгүй бол шууд давтахад бэлэн
        nextReviewAt: p?.nextReviewAt ?? now,
        lastReviewedAt: p?.lastReviewedAt ?? null,
        reviewCount: p?.reviewCount ?? 0,
      };
    });

    if (dueOnly) {
      result = result.filter((w) => new Date(w.nextReviewAt) <= now);
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Could not load vocabulary." },
      { status: 500 }
    );
  }
}

// POST /api/words (зөвхөн admin)
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in." }, { status: 401 });
    }
    if (!can(user, "word:create")) {
      return NextResponse.json({ error: "Admin only." }, { status: 403 });
    }

    const body = await request.json();

    const word = typeof body.word === "string" ? body.word.trim() : "";
    const meaning = typeof body.meaning === "string" ? body.meaning.trim() : "";
    const example = typeof body.example === "string" ? body.example.trim() : "";
    const translation =
      typeof body.translation === "string" ? body.translation.trim() : "";

    if (!word || !meaning) {
      return NextResponse.json(
        { error: "Word and meaning are required." },
        { status: 400 }
      );
    }

    if (
      word.length > 100 ||
      meaning.length > 500 ||
      example.length > 1000 ||
      translation.length > 1000
    ) {
      return NextResponse.json(
        { error: "One or more fields are too long." },
        { status: 400 }
      );
    }

    const now = new Date();
    const db = await getDb();

    // nextReviewAt, reviewCount зэрэг прогресс одоо "progress" collection-д хадгалагдана
    const result = await db.collection("words").insertOne({
      word,
      meaning,
      example,
      translation,
      createdAt: now,
    });

    return NextResponse.json(
      {
        _id: result.insertedId.toString(),
        word,
        meaning,
        example,
        translation,
        createdAt: now,
        nextReviewAt: now,
        lastReviewedAt: null,
        reviewCount: 0,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Could not create vocabulary." },
      { status: 500 }
    );
  }
}