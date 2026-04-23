import { MongoClient } from "mongodb";
import { existsSync, readFileSync } from "node:fs";
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
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

const UPDATE_TYPES = ["Announcement", "Partnership", "Tender", "Product Launch", "Compliance"];
const UPDATE_STATUSES = ["New", "Featured", "Published"];
const UPDATES_COLLECTION_NAME = "updates";

function validateUpdatePayload(payload) {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const requiredStrings = ["title", "summary", "publishedAt", "source"];
  if (requiredStrings.some((key) => typeof payload[key] !== "string" || !String(payload[key]).trim())) {
    return false;
  }

  if (!UPDATE_TYPES.includes(payload.type)) {
    return false;
  }

  if (!UPDATE_STATUSES.includes(payload.status)) {
    return false;
  }

  return typeof payload.isPublished === "boolean";
}

function cleanOptionalString(value) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed || undefined;
}

function createUpdateId(title, publishedAt) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const date = publishedAt.replaceAll("-", "");
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `${slug || "update"}-${date}-${randomSuffix}`;
}

function normalizeUpdateDocument(item) {
  const now = new Date().toISOString();
  return {
    id: cleanOptionalString(item.id) || createUpdateId(item.title, item.publishedAt),
    title: String(item.title || "").trim(),
    summary: String(item.summary || "").trim(),
    publishedAt: String(item.publishedAt || "").trim(),
    type: item.type,
    source: String(item.source || "").trim(),
    status: item.status,
    isPublished: item.isPublished,
    ...(cleanOptionalString(item.location) ? { location: cleanOptionalString(item.location) } : {}),
    ...(cleanOptionalString(item.documentUrl) ? { documentUrl: cleanOptionalString(item.documentUrl) } : {}),
    ...(cleanOptionalString(item.externalUrl) ? { externalUrl: cleanOptionalString(item.externalUrl) } : {}),
    createdAt: now,
    updatedAt: now,
  };
}

const root = process.cwd();
loadEnvFile(path.join(root, "..", ".env"));
loadEnvFile(path.join(root, "..", ".env.local"));
loadEnvFile(path.join(root, ".env"));
loadEnvFile(path.join(root, ".env.local"));

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log("Usage: npm run updates:migrate -- [--replace]");
  console.log("  --replace   Delete all existing updates in MongoDB before importing updates.json");
  process.exit(0);
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

const sourcePath = path.join(root, "data", "updates.json");
if (!existsSync(sourcePath)) {
  console.error(`Updates source file not found: ${sourcePath}`);
  process.exit(1);
}

const raw = readFileSync(sourcePath, "utf8");
const parsed = JSON.parse(raw);
if (!Array.isArray(parsed)) {
  console.error("Updates source file must contain a JSON array.");
  process.exit(1);
}

const invalidIndex = parsed.findIndex((item) => !validateUpdatePayload(item));
if (invalidIndex >= 0) {
  console.error(`Invalid update payload at array index ${invalidIndex}.`);
  process.exit(1);
}

const replaceMode = process.argv.includes("--replace");
const updates = parsed.map(normalizeUpdateDocument);

const client = new MongoClient(normalizedUri, {
  family: 4,
  tls: true,
  retryWrites: true,
  serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 30000),
  connectTimeoutMS: Number(process.env.MONGODB_CONNECT_TIMEOUT_MS || 30000),
});

await client.connect();

try {
  const db = client.db(dbName);
  const collection = db.collection(UPDATES_COLLECTION_NAME);

  await collection.createIndex({ id: 1 }, { unique: true });
  await collection.createIndex({ isPublished: 1, publishedAt: -1 });
  await collection.createIndex({ publishedAt: -1 });

  if (replaceMode) {
    await collection.deleteMany({});
    if (updates.length) {
      await collection.insertMany(updates, { ordered: false });
    }
    console.log(`Replaced '${UPDATES_COLLECTION_NAME}' collection with ${updates.length} updates.`);
  } else {
    let insertedOrUpdated = 0;

    for (const update of updates) {
      const now = new Date().toISOString();
      const { createdAt, updatedAt, ...updatableFields } = update;
      await collection.updateOne(
        { id: update.id },
        {
          $set: {
            ...updatableFields,
            updatedAt: now,
          },
          $setOnInsert: {
            createdAt,
          },
        },
        { upsert: true },
      );
      insertedOrUpdated += 1;
    }

    console.log(`Upserted ${insertedOrUpdated} updates into '${UPDATES_COLLECTION_NAME}'.`);
  }
} finally {
  await client.close();
}
