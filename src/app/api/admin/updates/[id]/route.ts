import { NextRequest, NextResponse } from "next/server";

import { isAdminAuthorized } from "@/lib/admin-auth";
import { deleteUpdate, type UpdateInput, upsertUpdate } from "@/lib/updates";

export const runtime = "nodejs";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: NextRequest, { params }: RouteParams) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const payload = (await request.json().catch(() => null)) as UpdateInput | null;
  if (!payload) {
    return NextResponse.json({ error: "Invalid update payload." }, { status: 400 });
  }

  const updated = await upsertUpdate({ ...payload, id });
  return NextResponse.json({ update: updated });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const removed = await deleteUpdate(id);
  if (!removed) {
    return NextResponse.json({ error: "Update not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
