import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";

import {
  ADMIN_COOKIE_NAME,
} from "@/lib/admin-auth";
import { cleanupExpiredSessions, createAdminSession, findAdminUserByUsername } from "@/lib/admin-users";
import { pingMongo } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: "MongoDB is not configured." }, { status: 500 });
    }

    const payload = (await request.json().catch(() => null)) as
      | { username?: string; password?: string }
      | null;

    const username = payload?.username?.trim() || "";
    const password = payload?.password || "";

    await pingMongo();

    const user = await findAdminUserByUsername(username);
    if (!user) {
      console.warn("Admin login rejected: user not found", { username });
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }

    const validPassword = await compare(password, user.passwordHash);
    if (!validPassword) {
      console.warn("Admin login rejected: password mismatch", { username });
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }

    await cleanupExpiredSessions();
    const sessionValue = await createAdminSession(user);

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: sessionValue,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return response;
  } catch (error) {
    console.error("Admin login failed", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      hasMongoUri: Boolean(process.env.MONGODB_URI),
      mongoDb: process.env.MONGODB_DB || "avlc_group_website",
    });
    return NextResponse.json(
      { error: "Admin login failed. Check MongoDB connection, database records, and deployment environment variables." },
      { status: 500 },
    );
  }
}
