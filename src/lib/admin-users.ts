import { createHash, randomBytes } from "node:crypto";
import { ObjectId } from "mongodb";

import { getMongoDb } from "@/lib/mongodb";

export type AdminUserRecord = {
  _id: ObjectId;
  username: string;
  passwordHash: string;
  role: "super_admin" | "editor";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type AdminSessionRecord = {
  _id: ObjectId;
  tokenHash: string;
  userId: ObjectId;
  username: string;
  createdAt: Date;
  expiresAt: Date;
};

const USERS_COLLECTION = "admin_users";
const SESSIONS_COLLECTION = "admin_sessions";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export async function findAdminUserByUsername(username: string): Promise<AdminUserRecord | null> {
  const db = await getMongoDb();
  const normalized = username.trim().toLowerCase();
  return db.collection<AdminUserRecord>(USERS_COLLECTION).findOne({ username: normalized, isActive: true });
}

export async function createAdminSession(user: AdminUserRecord): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = sha256(token);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 12);

  const db = await getMongoDb();
  await db.collection<AdminSessionRecord>(SESSIONS_COLLECTION).insertOne({
    _id: new ObjectId(),
    tokenHash,
    userId: user._id,
    username: user.username,
    createdAt: now,
    expiresAt,
  });

  return token;
}

export async function isSessionTokenValid(token: string | undefined | null): Promise<boolean> {
  if (!token) {
    return false;
  }
  const tokenHash = sha256(token);
  const db = await getMongoDb();
  const now = new Date();

  const session = await db.collection<AdminSessionRecord>(SESSIONS_COLLECTION).findOne({
    tokenHash,
    expiresAt: { $gt: now },
  });
  return Boolean(session);
}

export async function deleteSessionToken(token: string | undefined | null): Promise<void> {
  if (!token) {
    return;
  }
  const tokenHash = sha256(token);
  const db = await getMongoDb();
  await db.collection<AdminSessionRecord>(SESSIONS_COLLECTION).deleteOne({ tokenHash });
}

export async function cleanupExpiredSessions(): Promise<void> {
  const db = await getMongoDb();
  await db.collection<AdminSessionRecord>(SESSIONS_COLLECTION).deleteMany({ expiresAt: { $lte: new Date() } });
}
