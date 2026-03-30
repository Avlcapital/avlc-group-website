import { NextResponse } from "next/server";

import { getChatSessionDetails } from "@/lib/chat";

export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

export async function GET(_request: Request, context: { params: Params }) {
  const { id } = await context.params;
  const session = await getChatSessionDetails(id, "visitor");

  if (!session) {
    return NextResponse.json({ error: "Chat session not found." }, { status: 404 });
  }

  return NextResponse.json({ session });
}
