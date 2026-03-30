import { NextRequest, NextResponse } from "next/server";

import { isAdminAuthorized } from "@/lib/admin-auth";
import { getChatSessionDetails, setChatSessionStatus, type ChatSessionStatus } from "@/lib/chat";

export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

export async function GET(request: NextRequest, context: { params: Params }) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const session = await getChatSessionDetails(id, "admin");

  if (!session) {
    return NextResponse.json({ error: "Chat session not found." }, { status: 404 });
  }

  return NextResponse.json({ session });
}

export async function PATCH(request: NextRequest, context: { params: Params }) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const payload = (await request.json().catch(() => null)) as { status?: ChatSessionStatus } | null;
  const status = payload?.status;

  if (status !== "open" && status !== "closed") {
    return NextResponse.json({ error: "Valid status is required." }, { status: 400 });
  }

  const updated = await setChatSessionStatus(id, status);
  if (!updated) {
    return NextResponse.json({ error: "Chat session not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
