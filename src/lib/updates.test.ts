import assert from "node:assert/strict";
import test from "node:test";
import { getPublishedUpdates, getUpdatesVersion, type UpdateItem } from "./updates.ts";

test("getPublishedUpdates sorts items in reverse chronological order", () => {
  const updates = getPublishedUpdates();
  assert.equal(updates[0]?.publishedAt >= updates[1]?.publishedAt, true);
  assert.equal(updates[1]?.publishedAt >= updates[2]?.publishedAt, true);
});

test("getUpdatesVersion returns stable marker for non-empty list", () => {
  const updates = getPublishedUpdates();
  const version = getUpdatesVersion(updates);
  assert.equal(version.includes(":"), true);
  assert.equal(version.startsWith(`${updates.length}:`), true);
});

test("getUpdatesVersion changes when update content changes", () => {
  const updates = getPublishedUpdates();
  const baselineVersion = getUpdatesVersion(updates);

  const edited = [...updates];
  const first = edited[0] as UpdateItem;
  edited[0] = { ...first, summary: `${first.summary} (edited)` };

  const editedVersion = getUpdatesVersion(edited);
  assert.notEqual(editedVersion, baselineVersion);
});
