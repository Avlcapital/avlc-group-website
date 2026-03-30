import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { isAdminAuthorized } from "@/lib/admin-auth";
import { addChatMessage, getChatSessionDetails } from "@/lib/chat";

export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

const requiredEnv = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"] as const;

function missingEnv() {
  return requiredEnv.filter((key) => !process.env[key]);
}

export async function POST(request: NextRequest, context: { params: Params }) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const payload = (await request.json().catch(() => null)) as { body?: string } | null;
  const body = payload?.body?.trim() || "";

  if (!body) {
    return NextResponse.json({ error: "Message body is required." }, { status: 400 });
  }

  const missing = missingEnv();
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing email configuration: ${missing.join(", ")}` },
      { status: 500 },
    );
  }

  const session = await getChatSessionDetails(id, "admin");
  if (!session) {
    return NextResponse.json({ error: "Chat session not found." }, { status: 404 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const latestVisitorMessage =
    [...session.messages].reverse().find((message) => message.sender === "visitor")?.body || "No prior message found.";

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: session.visitorEmail,
    replyTo: process.env.CONTACT_TO_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER,
    subject: "Reply from AVLC Group",
    text: [
      `Hello ${session.visitorName},`,
      "",
      "Thank you for contacting AVLC Group.",
      "",
      body,
      "",
      "If you need further assistance, you can reply to this email or send us another message through the website.",
      "",
      "Original message:",
      latestVisitorMessage,
    ].join("\n"),
  });

  const message = await addChatMessage(id, "admin", body);
  if (!message) {
    return NextResponse.json({ error: "Chat session not found." }, { status: 404 });
  }

  return NextResponse.json({ message, emailed: true }, { status: 201 });
}
