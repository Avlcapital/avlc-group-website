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
  const phone = formData.get("phone");
  const uploadedFiles = formData.getAll("uploaded_form");

  if (!name || !email || uploadedFiles.length === 0) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const validFiles = uploadedFiles.filter((file): file is File => file instanceof File && file.size > 0);
  if (validFiles.length === 0) {
    return NextResponse.json({ error: "At least one uploaded file is required." }, { status: 400 });
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

  const attachments = await Promise.all(
    validFiles.map(async (file) => ({
      filename: file.name || "uploaded-form",
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type || undefined,
    })),
  );

  const to = process.env.ASSET_RECOVERY_TO_EMAIL || "info@avlcapital.com";

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    replyTo: String(email),
    subject: `Asset Recovery Form Submission - ${String(name)}`,
    text: [
      "New Asset Recovery submission received.",
      `Name: ${String(name)}`,
      `Email: ${String(email)}`,
      `Phone: ${phone ? String(phone) : "Not provided"}`,
      `Files attached: ${attachments.length}`,
    ].join("\n"),
    attachments,
  });

  return NextResponse.json({ ok: true });
}
