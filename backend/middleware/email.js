const nodemailer = require("nodemailer");

function missingEmailEnv() {
  return ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"].filter((key) => !process.env[key]);
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function assertEmailConfigured() {
  const missing = missingEmailEnv();
  if (missing.length > 0) {
    const error = new Error(`Missing email configuration: ${missing.join(", ")}`);
    error.status = 500;
    throw error;
  }
}

module.exports = { assertEmailConfigured, createTransporter, missingEmailEnv };
