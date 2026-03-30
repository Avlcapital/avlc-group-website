import { NextRequest, NextResponse } from "next/server";

import { isAdminAuthorized } from "@/lib/admin-auth";
import { listChatSessions } from "@/lib/chat";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const sessions = await listChatSessions();
  return NextResponse.json({ sessions });
}
