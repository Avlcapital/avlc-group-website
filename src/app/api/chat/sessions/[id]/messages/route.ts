import { NextResponse } from "next/server";

import { addChatMessage } from "@/lib/chat";

export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

export async function POST(request: Request, context: { params: Params }) {
  const { id } = await context.params;
  const payload = (await request.json().catch(() => null)) as { body?: string } | null;
  const body = payload?.body?.trim() || "";

  if (!body) {
    return NextResponse.json({ error: "Message body is required." }, { status: 400 });
  }

  const message = await addChatMessage(id, "visitor", body);
  if (!message) {
    return NextResponse.json({ error: "Chat session not found." }, { status: 404 });
  }

  return NextResponse.json({ message }, { status: 201 });
}
