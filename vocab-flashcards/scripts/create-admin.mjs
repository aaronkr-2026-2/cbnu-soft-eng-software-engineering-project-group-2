import { MongoClient } from "mongodb";
import { randomBytes, scryptSync } from "crypto";

const [usernameArg, password] = process.argv.slice(2);
if (!usernameArg || !password || password.length < 8) {
  console.error('Usage: node --env-file=.env.local scripts/create-admin.mjs <username> "<password (8+ chars)>"');
  process.exit(1);
}

const username = usernameArg.trim().toLowerCase();
const salt = randomBytes(16);
const passwordHash = `${salt.toString("hex")}:${scryptSync(password, salt, 64).toString("hex")}`;

const client = new MongoClient(process.env.MONGODB_URI);
try {
  await client.connect();
  const users = client.db(process.env.MONGODB_DB || "vocab_flashcards").collection("users");
  await users.createIndex({ username: 1 }, { unique: true });
  await users.updateOne(
    { username },
    { $set: { passwordHash, role: "admin" }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
  console.log(`Admin "${username}" is ready.`);
} finally {
  await client.close();
}