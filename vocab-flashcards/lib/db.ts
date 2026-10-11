import clientPromise from "@/lib/mongodb";

export async function getDb() {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || "vocab_flashcards");
}