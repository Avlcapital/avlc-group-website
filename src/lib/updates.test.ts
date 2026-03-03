import assert from "node:assert/strict";
import test from "node:test";
import { getPublishedUpdates, getUpdatesVersion, sortUpdatesDesc, type UpdateItem } from "./updates.ts";

test("sortUpdatesDesc sorts items in reverse chronological order", () => {
  const updates = sortUpdatesDesc([
    {
      id: "a",
      title: "Old",
      summary: "Old summary",
      publishedAt: "2026-01-01",
      type: "Announcement",
      source: "Source",
      status: "Published",
      isPublished: true,
    },
    {
      id: "b",
      title: "New",
      summary: "New summary",
      publishedAt: "2026-02-01",
      type: "Announcement",
      source: "Source",
      status: "Published",
      isPublished: true,
    },
  ]);

  assert.equal(updates[0]?.publishedAt >= updates[1]?.publishedAt, true);
});

test("getPublishedUpdates returns only published updates", async () => {
  const updates = await getPublishedUpdates();
  assert.equal(updates.every((item) => item.isPublished), true);
});

test("getUpdatesVersion returns stable marker for non-empty list", async () => {
  const updates = await getPublishedUpdates();
  const version = getUpdatesVersion(updates);
  assert.equal(version.includes(":"), true);
  assert.equal(version.startsWith(`${updates.length}:`), true);
});

test("getUpdatesVersion changes when update content changes", async () => {
  const updates = await getPublishedUpdates();
  const baselineVersion = getUpdatesVersion(updates);

  const edited = [...updates];
  const first = edited[0] as UpdateItem;
  edited[0] = { ...first, summary: `${first.summary} (edited)` };

  const editedVersion = getUpdatesVersion(edited);
  assert.notEqual(editedVersion, baselineVersion);
});
