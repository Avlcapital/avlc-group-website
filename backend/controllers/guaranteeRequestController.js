const { ObjectId } = require("mongodb");
const { getMongoDb } = require("../middleware/db");
const { assertEmailConfigured, createTransporter } = require("../middleware/email");

const COLLECTION = "guarantee_requests";

function getText(formData, key) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isUploadedFile(value) {
  return value && typeof value === "object" && typeof value.arrayBuffer === "function" && value.size > 0;
}

function serializeRequest(record) {
  return {
    id: record._id.toHexString(),
    applicantName: record.applicantName,
    registrationNumber: record.registrationNumber,
    kraPin: record.kraPin,
    contactPerson: record.contactPerson,
    contactEmail: record.contactEmail,
    contactPhone: record.contactPhone,
    physicalAddress: record.physicalAddress,
    guaranteeType: record.guaranteeType,
    guaranteeAmount: record.guaranteeAmount,
    currency: record.currency,
    beneficiaryName: record.beneficiaryName,
    beneficiaryAddress: record.beneficiaryAddress,
    tenderNumber: record.tenderNumber,
    tenderTitle: record.tenderTitle,
    tenderClosingDate: record.tenderClosingDate,
    guaranteeStartDate: record.guaranteeStartDate,
    guaranteeEndDate: record.guaranteeEndDate,
    purpose: record.purpose,
    deliveryMode: record.deliveryMode,
    bankPreference: record.bankPreference,
    additionalNotes: record.additionalNotes,
    supportingDocuments: record.supportingDocuments,
    status: record.status,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function buildSubmission(formData) {
  return {
    applicantName: getText(formData, "applicantName"),
    registrationNumber: getText(formData, "registrationNumber"),
    kraPin: getText(formData, "kraPin"),
    contactPerson: getText(formData, "contactPerson"),
    contactEmail: getText(formData, "contactEmail"),
    contactPhone: getText(formData, "contactPhone"),
    physicalAddress: getText(formData, "physicalAddress"),
    guaranteeType: getText(formData, "guaranteeType"),
    guaranteeAmount: getText(formData, "guaranteeAmount"),
    currency: getText(formData, "currency") || "KES",
    beneficiaryName: getText(formData, "beneficiaryName"),
    beneficiaryAddress: getText(formData, "beneficiaryAddress"),
    tenderNumber: getText(formData, "tenderNumber"),
    tenderTitle: getText(formData, "tenderTitle"),
    tenderClosingDate: getText(formData, "tenderClosingDate"),
    guaranteeStartDate: getText(formData, "guaranteeStartDate"),
    guaranteeEndDate: getText(formData, "guaranteeEndDate"),
    purpose: getText(formData, "purpose"),
    deliveryMode: getText(formData, "deliveryMode"),
    bankPreference: getText(formData, "bankPreference"),
    additionalNotes: getText(formData, "additionalNotes"),
  };
}

function validateSubmission(submission) {
  const required = [
    "applicantName",
    "contactPerson",
    "contactEmail",
    "contactPhone",
    "guaranteeType",
    "guaranteeAmount",
    "beneficiaryName",
    "tenderTitle",
    "guaranteeEndDate",
  ];

  const missing = required.filter((key) => !submission[key]);
  if (missing.length > 0) {
    const error = new Error(`Missing required fields: ${missing.join(", ")}`);
    error.status = 400;
    throw error;
  }
}

function formatEmailText(submission, supportingDocuments) {
  return [
    "New PSL Capital Guarantee Request received.",
    "",
    "Applicant Details",
    `Applicant / Company: ${submission.applicantName}`,
    `Registration Number: ${submission.registrationNumber || "Not provided"}`,
    `KRA PIN: ${submission.kraPin || "Not provided"}`,
    `Contact Person: ${submission.contactPerson}`,
    `Contact Email: ${submission.contactEmail}`,
    `Contact Phone: ${submission.contactPhone}`,
    `Physical Address: ${submission.physicalAddress || "Not provided"}`,
    "",
    "Guarantee Details",
    `Guarantee Type: ${submission.guaranteeType}`,
    `Amount: ${submission.currency} ${submission.guaranteeAmount}`,
    `Beneficiary: ${submission.beneficiaryName}`,
    `Beneficiary Address: ${submission.beneficiaryAddress || "Not provided"}`,
    `Tender / Reference Number: ${submission.tenderNumber || "Not provided"}`,
    `Tender / Project Title: ${submission.tenderTitle}`,
    `Tender Closing Date: ${submission.tenderClosingDate || "Not provided"}`,
    `Guarantee Start Date: ${submission.guaranteeStartDate || "Not provided"}`,
    `Guarantee Expiry Date: ${submission.guaranteeEndDate}`,
    `Purpose: ${submission.purpose || "Not provided"}`,
    `Delivery Mode: ${submission.deliveryMode || "Not provided"}`,
    `Preferred Bank / Issuer: ${submission.bankPreference || "Not provided"}`,
    "",
    "Additional Notes",
    submission.additionalNotes || "None",
    "",
    `Supporting documents attached: ${supportingDocuments.length}`,
  ].join("\n");
}

async function submitGuaranteeRequest(formData) {
  const submission = buildSubmission(formData);
  validateSubmission(submission);
  assertEmailConfigured();

  const files = formData.getAll("supportingDocuments").filter(isUploadedFile);
  const supportingDocuments = files.map((file) => ({
    filename: file.name || "supporting-document",
    contentType: file.type || "application/octet-stream",
    size: file.size,
  }));

  const attachments = await Promise.all(
    files.map(async (file) => ({
      filename: file.name || "supporting-document",
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type || undefined,
    })),
  );

  const now = new Date();
  const record = {
    _id: new ObjectId(),
    ...submission,
    supportingDocuments,
    status: "new",
    createdAt: now,
    updatedAt: now,
  };

  const db = await getMongoDb();
  await db.collection(COLLECTION).insertOne(record);

  await createTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.GUARANTEE_REQUEST_TO_EMAIL || process.env.CONTACT_TO_EMAIL || "info@avlcapital.com",
    replyTo: submission.contactEmail,
    subject: `PSL Guarantee Request - ${submission.applicantName}`,
    text: formatEmailText(submission, supportingDocuments),
    attachments,
  });

  return { ok: true, request: serializeRequest(record) };
}

async function listGuaranteeRequests() {
  const db = await getMongoDb();
  const requests = await db.collection(COLLECTION).find({}).sort({ createdAt: -1 }).toArray();
  return { requests: requests.map(serializeRequest) };
}

async function updateGuaranteeRequestStatus(id, payload) {
  if (!ObjectId.isValid(id)) {
    const error = new Error("Guarantee request not found.");
    error.status = 404;
    throw error;
  }

  const allowedStatuses = ["new", "reviewing", "completed"];
  const status = String(payload?.status || "").trim();
  if (!allowedStatuses.includes(status)) {
    const error = new Error("Valid status is required.");
    error.status = 400;
    throw error;
  }

  const db = await getMongoDb();
  const result = await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, updatedAt: new Date() } },
  );

  if (result.matchedCount === 0) {
    const error = new Error("Guarantee request not found.");
    error.status = 404;
    throw error;
  }

  return { ok: true };
}

module.exports = {
  listGuaranteeRequests,
  submitGuaranteeRequest,
  updateGuaranteeRequestStatus,
};
