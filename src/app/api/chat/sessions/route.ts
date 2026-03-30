import { NextResponse } from "next/server";

import { createChatSession } from "@/lib/chat";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | { visitorName?: string; visitorEmail?: string; message?: string }
    | null;

  const visitorName = payload?.visitorName?.trim() || "";
  const visitorEmail = payload?.visitorEmail?.trim() || "";
  const message = payload?.message?.trim() || "";

  if (!visitorName || !visitorEmail || !message) {
    return NextResponse.json({ error: "Name, email, and first message are required." }, { status: 400 });
  }

  const session = await createChatSession(visitorName, visitorEmail, message);
  return NextResponse.json({ session }, { status: 201 });
}
