
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;

    await client.db("admin").command({ ping: 1 });

    const db = client.db(
      process.env.MONGODB_DB || "vocab_flashcards"
    );

    const collections = await db
      .listCollections()
      .toArray();

    return Response.json({
      connected: true,
      database: db.databaseName,
      collections: collections.map((c) => c.name),
    });
  } catch (error) {
    console.error("MongoDB check failed:", error);

    return Response.json(
      { connected: false, error: "MongoDB connection failed" },
      { status: 500 }
    );
  }
}
