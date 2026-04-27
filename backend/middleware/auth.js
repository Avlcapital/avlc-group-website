const { createHash, randomBytes } = require("node:crypto");
const { ObjectId } = require("mongodb");
const { getMongoDb } = require("./db");
const { parseCookies } = require("./http");

const ADMIN_COOKIE_NAME = "avlc_admin_session";

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function findAdminUserByUsername(username) {
  const db = await getMongoDb();
  const normalized = username.trim().toLowerCase();
  return db.collection("admin_users").findOne({ username: normalized, isActive: true });
}

async function cleanupExpiredSessions() {
  const db = await getMongoDb();
  await db.collection("admin_sessions").deleteMany({ expiresAt: { $lte: new Date() } });
}

async function createAdminSession(user) {
  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 12);
  const db = await getMongoDb();

  await db.collection("admin_sessions").insertOne({
    _id: new ObjectId(),
    tokenHash: sha256(token),
    userId: user._id,
    username: user.username,
    createdAt: now,
    expiresAt,
  });

  return token;
}

async function findAdminSessionByToken(token) {
  if (!token) {
    return null;
  }

  const db = await getMongoDb();
  return db.collection("admin_sessions").findOne({
    tokenHash: sha256(token),
    expiresAt: { $gt: new Date() },
  });
}

function getSessionTokenFromRequest(request) {
  const cookies = parseCookies(request.headers.cookie || "");
  return cookies[ADMIN_COOKIE_NAME];
}

async function getAdminSession(request) {
  return findAdminSessionByToken(getSessionTokenFromRequest(request));
}

async function getCurrentAdminUser(request) {
  const session = await getAdminSession(request);
  if (!session) {
    return null;
  }

  const db = await getMongoDb();
  return db.collection("admin_users").findOne(
    { _id: session.userId, isActive: true },
    { projection: { passwordHash: 0 } },
  );
}

async function deleteSessionToken(token) {
  if (!token) {
    return;
  }

  const db = await getMongoDb();
  await db.collection("admin_sessions").deleteOne({ tokenHash: sha256(token) });
}

async function requireAdmin(request) {
  return Boolean(await getCurrentAdminUser(request));
}

module.exports = {
  ADMIN_COOKIE_NAME,
  cleanupExpiredSessions,
  createAdminSession,
  deleteSessionToken,
  findAdminUserByUsername,
  getAdminSession,
  getCurrentAdminUser,
  getSessionTokenFromRequest,
  requireAdmin,
};
