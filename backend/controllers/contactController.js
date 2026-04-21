const { assertEmailConfigured, createTransporter } = require("../middleware/email");

async function submitContactForm(formData) {
  assertEmailConfigured();

  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");

  if (!name || !email || !subject || !message) {
    const error = new Error("Missing required fields.");
    error.status = 400;
    throw error;
  }

  await createTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.CONTACT_TO_EMAIL || "info@avlcapital.com",
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

  return { ok: true };
}

module.exports = { submitContactForm };
