import assert from "node:assert/strict";
import test from "node:test";
import {
  getFallbackRefreshMessage,
  shouldRefreshUpdates,
} from "./live-updates-client.ts";

test("shouldRefreshUpdates returns true when versions differ", () => {
  assert.equal(shouldRefreshUpdates("v1", "v2"), true);
});

test("shouldRefreshUpdates returns false when versions match", () => {
  assert.equal(shouldRefreshUpdates("v1", "v1"), false);
});

test("getFallbackRefreshMessage provides non-blocking guidance", () => {
  const message = getFallbackRefreshMessage();
  assert.equal(typeof message, "string");
  assert.equal(message.length > 0, true);
  assert.equal(message.toLowerCase().includes("retry"), true);
});
