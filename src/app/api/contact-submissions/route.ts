import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const requiredEnv = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"] as const;

function missingEnv() {
  return requiredEnv.filter((key) => !process.env[key]);
}

export async function POST(request: Request) {
  const missing = missingEnv();
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing email configuration: ${missing.join(", ")}` },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
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

  const to = process.env.CONTACT_TO_EMAIL || "info@avlcapital.com";

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    replyTo: String(email),
    subject: `Contact Form: ${String(subject)}`,
    text: [
      "New contact form message received.",
      `Name: ${String(name)}`,
      `Email: ${String(email)}`,
      `Subject: ${String(subject)}`,
      "",
      String(message),
    ].join("\n"),
  });

  return NextResponse.json({ ok: true });
}
