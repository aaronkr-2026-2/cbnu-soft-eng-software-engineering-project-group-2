
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

async function getCollection() {
  const client = await clientPromise;
  const db = client.db(
    process.env.MONGODB_DB || "vocab_flashcards"
  );

  return db.collection("words");
}

// GET /api/words
// GET /api/words?due=true
export async function GET(request: Request) {
  try {
    const collection = await getCollection();
    const { searchParams } = new URL(request.url);
    const dueOnly = searchParams.get("due") === "true";

    const filter = dueOnly
      ? { nextReviewAt: { $lte: new Date() } }
      : {};

    const words = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      words.map((item) => ({
        ...item,
        _id: (item._id as ObjectId).toString(),
      }))
    );
  } catch {
    return NextResponse.json(
      { error: "Could not load vocabulary." },
      { status: 500 }
    );
  }
}

// POST /api/words
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const word =
      typeof body.word === "string" ? body.word.trim() : "";
    const meaning =
      typeof body.meaning === "string"
        ? body.meaning.trim()
        : "";
    const example =
      typeof body.example === "string"
        ? body.example.trim()
        : "";

    if (!word || !meaning) {
      return NextResponse.json(
        { error: "Word and meaning are required." },
        { status: 400 }
      );
    }

    if (
      word.length > 100 ||
      meaning.length > 500 ||
      example.length > 1000
    ) {
      return NextResponse.json(
        { error: "One or more fields are too long." },
        { status: 400 }
      );
    }

    const now = new Date();
    const collection = await getCollection();

    const result = await collection.insertOne({
      word,
      meaning,
      example,
      createdAt: now,
      nextReviewAt: now,
      lastReviewedAt: null,
      reviewCount: 0,
    });

    return NextResponse.json(
      {
        _id: result.insertedId.toString(),
        word,
        meaning,
        example,
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
