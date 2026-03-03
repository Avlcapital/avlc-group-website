import { promises as fs } from "node:fs";
import path from "node:path";

import { UPDATE_STATUSES, UPDATE_TYPES, type UpdateInput, type UpdateItem } from "@/lib/updates-schema";
export { UPDATE_STATUSES, UPDATE_TYPES };
export type { UpdateInput, UpdateItem };

const updatesFilePath = path.join(process.cwd(), "data", "updates.json");

async function readUpdatesFile(): Promise<UpdateItem[]> {
  try {
    const raw = await fs.readFile(updatesFilePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed as UpdateItem[];
  } catch {
    return [];
  }
}

async function writeUpdatesFile(items: UpdateItem[]): Promise<void> {
  await fs.writeFile(updatesFilePath, JSON.stringify(items, null, 2), "utf8");
}

function createUpdateId(title: string, publishedAt: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const date = publishedAt.replaceAll("-", "");
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `${slug || "update"}-${date}-${randomSuffix}`;
}

export function sortUpdatesDesc(items: UpdateItem[]): UpdateItem[] {
  return [...items].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getUpdatesVersion(items: UpdateItem[]): string {
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

export async function getAllUpdates(): Promise<UpdateItem[]> {
  const updates = await readUpdatesFile();
  return sortUpdatesDesc(updates);
}

export async function getPublishedUpdates(): Promise<UpdateItem[]> {
  const updates = await readUpdatesFile();
  return sortUpdatesDesc(updates.filter((item) => item.isPublished));
}

export async function getUpdatesPayload(): Promise<{ updates: UpdateItem[]; version: string }> {
  const updates = await getPublishedUpdates();
  return { updates, version: getUpdatesVersion(updates) };
}

export async function upsertUpdate(input: UpdateInput): Promise<UpdateItem> {
  const updates = await readUpdatesFile();
  const normalized: UpdateItem = {
    ...input,
    id: input.id || createUpdateId(input.title, input.publishedAt),
  };

  const existingIndex = updates.findIndex((item) => item.id === normalized.id);
  if (existingIndex >= 0) {
    updates[existingIndex] = normalized;
  } else {
    updates.push(normalized);
  }

  await writeUpdatesFile(updates);
  return normalized;
}

export async function deleteUpdate(id: string): Promise<boolean> {
  const updates = await readUpdatesFile();
  const filtered = updates.filter((item) => item.id !== id);
  if (filtered.length === updates.length) {
    return false;
  }
  await writeUpdatesFile(filtered);
  return true;
}
