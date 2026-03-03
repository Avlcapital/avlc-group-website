import { NextRequest, NextResponse } from "next/server";

import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import { deleteSessionToken } from "@/lib/admin-users";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  await deleteSessionToken(token);

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
