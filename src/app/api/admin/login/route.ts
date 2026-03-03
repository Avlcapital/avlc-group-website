import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";

import {
  ADMIN_COOKIE_NAME,
} from "@/lib/admin-auth";
import { cleanupExpiredSessions, createAdminSession, findAdminUserByUsername } from "@/lib/admin-users";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ error: "MongoDB is not configured." }, { status: 500 });
  }

  const payload = (await request.json().catch(() => null)) as
    | { username?: string; password?: string }
    | null;

  const username = payload?.username?.trim() || "";
  const password = payload?.password || "";

  const user = await findAdminUserByUsername(username);
  if (!user) {
    return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
  }

  const validPassword = await compare(password, user.passwordHash);
  if (!validPassword) {
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
}
