
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getNextReviewDate } from "@/lib/review";


async function getCollection() {
  const client = await clientPromise;
  return client.db(
    process.env.MONGODB_DB || "vocab_flashcards"
  ).collection("words");
}

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  context: Context
) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid word ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const collection = await getCollection();
    const _id = new ObjectId(id);




    // Review action: "know" or "again"
    if (body.review === "know" || body.review === "again") {
      const now = new Date();
      const nextReviewAt = getNextReviewDate(body.review, now);

      // Simple MVP schedule:
      // "know" -> review again in 3 days
      // "again" -> review tomorrow
      nextReviewAt.setDate(
        now.getDate() + (body.review === "know" ? 3 : 1)
      );

      const result = await collection.updateOne(
        { _id },
        {
          $set: {
            lastReviewedAt: now,
            nextReviewAt,
          },
          $inc: { reviewCount: 1 },
        }
      );

      if (!result.matchedCount) {
        return NextResponse.json(
          { error: "Word not found." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        nextReviewAt,
      });
    }


    
    // Edit vocabulary
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

    const result = await collection.updateOne(
      { _id },
      { $set: { word, meaning, example } }
    );

    if (!result.matchedCount) {
      return NextResponse.json(
        { error: "Word not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Could not update vocabulary." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: Context
) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid word ID." },
        { status: 400 }
      );
    }

    const collection = await getCollection();
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });

    if (!result.deletedCount) {
      return NextResponse.json(
        { error: "Word not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Could not delete vocabulary." },
      { status: 500 }
    );
  }
}
