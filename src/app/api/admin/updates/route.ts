import { NextRequest, NextResponse } from "next/server";

import { isAdminAuthorized } from "@/lib/admin-auth";
import { UPDATE_STATUSES, UPDATE_TYPES, getAllUpdates, type UpdateInput, upsertUpdate } from "@/lib/updates";

export const runtime = "nodejs";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function validatePayload(payload: unknown): payload is UpdateInput {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const obj = payload as Record<string, unknown>;
  const requiredStrings = ["title", "summary", "publishedAt", "source"];
  if (requiredStrings.some((key) => typeof obj[key] !== "string" || !String(obj[key]).trim())) {
    return false;
  }

  if (!UPDATE_TYPES.includes(obj.type as (typeof UPDATE_TYPES)[number])) {
    return false;
  }
  if (!UPDATE_STATUSES.includes(obj.status as (typeof UPDATE_STATUSES)[number])) {
    return false;
  }
  if (typeof obj.isPublished !== "boolean") {
    return false;
  }
  return true;
}

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updates = await getAllUpdates();
  return NextResponse.json({ updates });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as unknown;
  if (!validatePayload(payload)) {
    return badRequest("Invalid update payload.");
  }

  const created = await upsertUpdate(payload);
  return NextResponse.json({ update: created });
}
