import { MongoClient } from "mongodb";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const raw = readFileSync(filePath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const eq = trimmed.indexOf("=");
    if (eq <= 0) {
      continue;
    }

    const key = trimmed.slice(0, eq).trim();
    if (process.env[key] !== undefined) {
      continue;
    }

    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

const root = process.cwd();
loadEnvFile(path.join(root, ".env"));
loadEnvFile(path.join(root, ".env.local"));

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "avlc_group_website";

if (!uri) {
  console.error("MONGODB_URI is missing.");
  process.exit(1);
}

const normalizedUri = uri.trim().replace(/^['"]|['"]$/g, "");

if (!normalizedUri.startsWith("mongodb://") && !normalizedUri.startsWith("mongodb+srv://")) {
  console.error("MONGODB_URI must start with mongodb:// or mongodb+srv://");
  process.exit(1);
}

const client = new MongoClient(normalizedUri, {
  family: 4,
  tls: true,
  retryWrites: true,
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
});

try {
  await client.connect();
  const db = client.db(dbName);
  await db.command({ ping: 1 });

  const adminUsersCount = await db.collection("admin_users").countDocuments();
  const adminSessionsCount = await db.collection("admin_sessions").countDocuments();

  console.log("MongoDB connection successful.");
  console.log(`Database: ${dbName}`);
  console.log(`admin_users: ${adminUsersCount}`);
  console.log(`admin_sessions: ${adminSessionsCount}`);
} catch (error) {
  console.error("MongoDB connection failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
} finally {
  await client.close().catch(() => {});
}
