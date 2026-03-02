import { NextResponse } from "next/server";
import { getUpdatesPayload } from "@/lib/updates";

export async function GET() {
  const payload = getUpdatesPayload();

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
