const { getMongoDb } = require("../middleware/db");

const UPDATE_TYPES = ["Announcement", "Partnership", "Tender", "Product Launch", "Compliance"];
const UPDATE_STATUSES = ["New", "Featured", "Published"];
const UPDATES_COLLECTION_NAME = "updates";

let updatesCollectionPromise;

function cleanOptionalString(value) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed || undefined;
}

function normalizeUpdateInput(payload) {
  return {
    id: cleanOptionalString(payload.id),
    title: String(payload.title || "").trim(),
    summary: String(payload.summary || "").trim(),
    publishedAt: String(payload.publishedAt || "").trim(),
    type: payload.type,
    source: String(payload.source || "").trim(),
    status: payload.status,
    isPublished: payload.isPublished,
    location: cleanOptionalString(payload.location),
    documentUrl: cleanOptionalString(payload.documentUrl),
    externalUrl: cleanOptionalString(payload.externalUrl),
  };
}

function toStoredUpdateDocument(payload, existing = {}) {
  const now = new Date().toISOString();
  return {
    id: payload.id,
    title: payload.title,
    summary: payload.summary,
    publishedAt: payload.publishedAt,
    type: payload.type,
    source: payload.source,
    status: payload.status,
    isPublished: payload.isPublished,
    ...(payload.location ? { location: payload.location } : {}),
    ...(payload.documentUrl ? { documentUrl: payload.documentUrl } : {}),
    ...(payload.externalUrl ? { externalUrl: payload.externalUrl } : {}),
    createdAt: existing.createdAt || now,
    updatedAt: now,
  };
}

function mapStoredUpdate(document) {
  return {
    id: document.id,
    title: document.title,
    summary: document.summary,
    publishedAt: document.publishedAt,
    type: document.type,
    source: document.source,
    status: document.status,
    isPublished: document.isPublished,
    ...(document.location ? { location: document.location } : {}),
    ...(document.documentUrl ? { documentUrl: document.documentUrl } : {}),
    ...(document.externalUrl ? { externalUrl: document.externalUrl } : {}),
  };
}

function getUpdatesVersion(items) {
  if (items.length === 0) {
    return "empty";
  }

  const fingerprint = items
    .map(
      (item) =>
        `${item.id}:${item.publishedAt}:${item.title}:${item.summary}:${item.type}:${item.status}:${item.source}:${item.isPublished}:${item.location || ""}:${item.documentUrl || ""}:${item.externalUrl || ""}`,
    )
    .join("|");
  return `${items.length}:${fingerprint}`;
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

async function getUpdatesCollection() {
  if (!updatesCollectionPromise) {
    updatesCollectionPromise = (async () => {
      const db = await getMongoDb();
      const collection = db.collection(UPDATES_COLLECTION_NAME);

      await collection.createIndex({ id: 1 }, { unique: true });
      await collection.createIndex({ isPublished: 1, publishedAt: -1 });
      await collection.createIndex({ publishedAt: -1 });
      return collection;
    })().catch((error) => {
      updatesCollectionPromise = undefined;
      throw error;
    });
  }

  return updatesCollectionPromise;
}

async function getAllUpdates() {
  const collection = await getUpdatesCollection();
  const documents = await collection.find({}).sort({ publishedAt: -1, updatedAt: -1 }).toArray();
  return documents.map(mapStoredUpdate);
}

async function getPublishedUpdates() {
  const collection = await getUpdatesCollection();
  const documents = await collection.find({ isPublished: true }).sort({ publishedAt: -1, updatedAt: -1 }).toArray();
  return documents.map(mapStoredUpdate);
}

async function getUpdatesPayload() {
  const updates = await getPublishedUpdates();
  return { updates, version: getUpdatesVersion(updates) };
}

async function upsertUpdate(input) {
  const collection = await getUpdatesCollection();
  const normalized = normalizeUpdateInput({ ...input, id: input.id || createUpdateId(input.title, input.publishedAt) });
  const existing = await collection.findOne({ id: normalized.id }, { projection: { createdAt: 1 } });
  const stored = toStoredUpdateDocument(normalized, existing || {});

  await collection.replaceOne({ id: normalized.id }, stored, { upsert: true });
  return mapStoredUpdate(stored);
}

async function deleteUpdate(id) {
  const collection = await getUpdatesCollection();
  const result = await collection.deleteOne({ id });
  return result.deletedCount > 0;
}

async function listPublicUpdates() {
  return getUpdatesPayload();
}

async function listAdminUpdates() {
  return { updates: await getAllUpdates() };
}

async function createAdminUpdate(payload) {
  if (!validateUpdatePayload(payload)) {
    const error = new Error("Invalid update payload.");
    error.status = 400;
    throw error;
  }
  return { update: await upsertUpdate(payload) };
}

async function updateAdminUpdate(id, payload) {
  if (!payload || !validateUpdatePayload(payload)) {
    const error = new Error("Invalid update payload.");
    error.status = 400;
    throw error;
  }
  return { update: await upsertUpdate({ ...payload, id }) };
}

async function removeAdminUpdate(id) {
  const removed = await deleteUpdate(id);
  if (!removed) {
    const error = new Error("Update not found.");
    error.status = 404;
    throw error;
  }
  return { ok: true };
}

module.exports = {
  createAdminUpdate,
  listAdminUpdates,
  listPublicUpdates,
  removeAdminUpdate,
  updateAdminUpdate,
};
