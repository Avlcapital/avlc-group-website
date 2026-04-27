import { MongoClient } from "mongodb";
import { hash } from "bcryptjs";
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
loadEnvFile(path.join(root, "..", ".env"));
loadEnvFile(path.join(root, "..", ".env.local"));
loadEnvFile(path.join(root, ".env"));
loadEnvFile(path.join(root, ".env.local"));

const [usernameArg, passwordArg, thirdArg, fourthArg] = process.argv.slice(2);

if (!usernameArg || !passwordArg) {
  console.error("Usage: npm run admin:create-user -- <username> <password> [role] [email]");
  console.error("   or: npm run admin:create-user -- <username> <password> <email>");
  process.exit(1);
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "avlc_group_website";
if (!uri) {
  console.error("MONGODB_URI is required.");
  process.exit(1);
}

const normalizedUri = uri.trim().replace(/^['"]|['"]$/g, "");
if (!normalizedUri.startsWith("mongodb://") && !normalizedUri.startsWith("mongodb+srv://")) {
  console.error("MONGODB_URI must start with mongodb:// or mongodb+srv://");
  process.exit(1);
}

const username = usernameArg.trim().toLowerCase();
const possibleRole = thirdArg === "editor" || thirdArg === "super_admin" ? thirdArg : fourthArg;
const role = possibleRole === "editor" ? "editor" : "super_admin";
const possibleEmail = thirdArg && thirdArg.includes("@") ? thirdArg : fourthArg;
const email = String(possibleEmail || "").trim().toLowerCase();

if (!email) {
  console.error("Admin email is required so chat notifications can be delivered.");
  process.exit(1);
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("A valid admin email address is required.");
  process.exit(1);
}

const client = new MongoClient(normalizedUri, {
  family: 4,
  tls: true,
  retryWrites: true,
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
});
await client.connect();

try {
  const db = client.db(dbName);
  const users = db.collection("admin_users");

  await users.createIndex({ username: 1 }, { unique: true });
  await users.createIndex({ email: 1 }, { unique: true, sparse: true });

  const existing = await users.findOne({ $or: [{ username }, { email }] });
  if (existing?.username === username) {
    console.error(`Admin user '${username}' already exists.`);
    process.exit(1);
  }
  if (existing?.email === email) {
    console.error(`Admin email '${email}' already exists.`);
    process.exit(1);
  }

  const passwordHash = await hash(passwordArg, 12);
  const now = new Date();

  await users.insertOne({
    username,
    email,
    passwordHash,
    role,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Admin user '${username}' created with role '${role}' and email '${email}'.`);
} finally {
  await client.close();
}

