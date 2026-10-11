import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { getNextReviewDate } from "@/lib/review";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in." }, { status: 401 });
    }

    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid word ID." }, { status: 400 });
    }

    const body = await request.json();
    const db = await getDb();
    const words = db.collection("words");
    const _id = new ObjectId(id);

    // Review action: "know" or "again" (нэвтэрсэн бүх хэрэглэгч, өөрийн прогресс дээр)
    if (body.review === "know" || body.review === "again") {
      if (!can(user, "review")) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }

      if (!(await words.countDocuments({ _id }))) {
        return NextResponse.json({ error: "Word not found." }, { status: 404 });
      }

      const now = new Date();
      const nextReviewAt = getNextReviewDate(body.review, now);

      await db.collection("progress").updateOne(
        { userId: user.id, wordId: _id },
        {
          $set: { lastReviewedAt: now, nextReviewAt },
          $inc: { reviewCount: 1 },
        },
        { upsert: true }
      );

      return NextResponse.json({ success: true, nextReviewAt });
    }

    // Edit vocabulary (зөвхөн admin)
    if (!can(user, "word:edit")) {
      return NextResponse.json({ error: "Admin only." }, { status: 403 });
    }

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

    const result = await words.updateOne(
      { _id },
      { $set: { word, meaning, example, translation } }
    );

    if (!result.matchedCount) {
      return NextResponse.json({ error: "Word not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Could not update vocabulary." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in." }, { status: 401 });
    }
    if (!can(user, "word:delete")) {
      return NextResponse.json({ error: "Admin only." }, { status: 403 });
    }

    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid word ID." }, { status: 400 });
    }

    const db = await getDb();
    const _id = new ObjectId(id);
    const result = await db.collection("words").deleteOne({ _id });

    if (!result.deletedCount) {
      return NextResponse.json({ error: "Word not found." }, { status: 404 });
    }

    // Тухайн үгийн бүх хэрэглэгчийн прогрессийг цэвэрлэнэ
    await db.collection("progress").deleteMany({ wordId: _id });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Could not delete vocabulary." },
      { status: 500 }
    );
  }
}