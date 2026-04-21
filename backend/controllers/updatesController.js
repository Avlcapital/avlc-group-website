const path = require("node:path");
const { mkdir, readFile, writeFile } = require("node:fs/promises");

const UPDATE_TYPES = ["Announcement", "Partnership", "Tender", "Product Launch", "Compliance"];
const UPDATE_STATUSES = ["New", "Featured", "Published"];
const updatesFilePath = path.join(__dirname, "..", "data", "updates.json");

async function readUpdatesFile() {
  try {
    const raw = await readFile(updatesFilePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeUpdatesFile(items) {
  await mkdir(path.dirname(updatesFilePath), { recursive: true });
  await writeFile(updatesFilePath, JSON.stringify(items, null, 2), "utf8");
}

function sortUpdatesDesc(items) {
  return [...items].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
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

async function getAllUpdates() {
  return sortUpdatesDesc(await readUpdatesFile());
}

async function getPublishedUpdates() {
  const updates = await readUpdatesFile();
  return sortUpdatesDesc(updates.filter((item) => item.isPublished));
}

async function getUpdatesPayload() {
  const updates = await getPublishedUpdates();
  return { updates, version: getUpdatesVersion(updates) };
}

async function upsertUpdate(input) {
  const updates = await readUpdatesFile();
  const normalized = { ...input, id: input.id || createUpdateId(input.title, input.publishedAt) };
  const existingIndex = updates.findIndex((item) => item.id === normalized.id);

  if (existingIndex >= 0) {
    updates[existingIndex] = normalized;
  } else {
    updates.push(normalized);
  }

  await writeUpdatesFile(updates);
  return normalized;
}

async function deleteUpdate(id) {
  const updates = await readUpdatesFile();
  const filtered = updates.filter((item) => item.id !== id);
  if (filtered.length === updates.length) {
    return false;
  }

  await writeUpdatesFile(filtered);
  return true;
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
  if (!payload) {
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
