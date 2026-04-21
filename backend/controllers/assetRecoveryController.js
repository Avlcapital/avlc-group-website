const { assertEmailConfigured, createTransporter } = require("../middleware/email");

async function submitAssetRecoveryForm(formData) {
  assertEmailConfigured();

  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const uploadedFiles = formData
    .getAll("uploaded_form")
    .filter((file) => typeof File !== "undefined" && file instanceof File && file.size > 0);

  if (!name || !email || uploadedFiles.length === 0) {
    const error = new Error("Missing required fields.");
    error.status = 400;
    throw error;
  }

  const attachments = await Promise.all(
    uploadedFiles.map(async (file) => ({
      filename: file.name || "uploaded-form",
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type || undefined,
    })),
  );

  await createTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.ASSET_RECOVERY_TO_EMAIL || "info@avlcapital.com",
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

  return { ok: true };
}

module.exports = { submitAssetRecoveryForm };
