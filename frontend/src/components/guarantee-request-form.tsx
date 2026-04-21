"use client";

import { FormEvent, useState } from "react";
import { apiFetch } from "@/lib/api-client";

const guaranteeTypes = [
  "Bid Bond",
  "Performance Bond",
  "Advance Payment Guarantee",
  "Payment Guarantee",
  "Retention Bond",
  "Other Guarantee",
];

export default function GuaranteeRequestForm() {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    const form = event.currentTarget;
    const response = await apiFetch("/api/guarantee-requests", {
      method: "POST",
      body: new FormData(form),
    });

    if (response.ok) {
      form.reset();
      setStatus("Guarantee request submitted successfully. Our team will contact you shortly.");
    } else {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setStatus(data.error || "Unable to submit the guarantee request right now.");
    }

    setSubmitting(false);
  };

  return (
    <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--avlc-navy-700)]">
            Online Application
          </p>
          <h2 className="mt-2 text-2xl text-[var(--avlc-navy-900)]">Guarantee Request Form 2025</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700 sm:text-base">
            Fill the PSL Capital guarantee request form online. Once submitted, the request is emailed to AVLC and saved
            in the admin database for review.
          </p>
        </div>
        <a
          href="/assets/documents/companies/guarantee-request-form-2025.pdf"
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-md border border-[var(--avlc-slate-200)] bg-white px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)]"
        >
          View Original PDF
        </a>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-[var(--avlc-navy-900)]">Applicant Details</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <input name="applicantName" required placeholder="Applicant / Company Name *" className="form-field" />
            <input name="registrationNumber" placeholder="Registration / Incorporation Number" className="form-field" />
            <input name="kraPin" placeholder="KRA PIN" className="form-field" />
            <input name="contactPerson" required placeholder="Contact Person *" className="form-field" />
            <input name="contactEmail" type="email" required placeholder="Email Address *" className="form-field" />
            <input name="contactPhone" type="tel" required placeholder="Phone Number *" className="form-field" />
            <textarea
              name="physicalAddress"
              placeholder="Physical / Postal Address"
              rows={3}
              className="form-field md:col-span-2"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[var(--avlc-navy-900)]">Guarantee Details</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <select name="guaranteeType" required className="form-field">
              <option value="">Select Guarantee Type *</option>
              {guaranteeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="grid gap-3 sm:grid-cols-[110px_1fr]">
              <select name="currency" defaultValue="KES" className="form-field">
                <option value="KES">KES</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              <input name="guaranteeAmount" required placeholder="Guarantee Amount *" className="form-field" />
            </div>
            <input name="beneficiaryName" required placeholder="Beneficiary / Procuring Entity *" className="form-field" />
            <input name="beneficiaryAddress" placeholder="Beneficiary Address" className="form-field" />
            <input name="tenderNumber" placeholder="Tender / Reference Number" className="form-field" />
            <input name="tenderTitle" required placeholder="Tender / Project Title *" className="form-field" />
            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Tender Closing Date
              <input name="tenderClosingDate" type="date" className="form-field mt-1" />
            </label>
            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Guarantee Start Date
              <input name="guaranteeStartDate" type="date" className="form-field mt-1" />
            </label>
            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Guarantee Expiry Date *
              <input name="guaranteeEndDate" type="date" required className="form-field mt-1" />
            </label>
            <input name="deliveryMode" placeholder="Delivery Mode, e.g. email, physical copy, portal upload" className="form-field" />
            <input name="bankPreference" placeholder="Preferred Bank / Issuer, if any" className="form-field" />
            <textarea
              name="purpose"
              placeholder="Purpose / instructions for the guarantee"
              rows={3}
              className="form-field md:col-span-2"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[var(--avlc-navy-900)]">Supporting Documents</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Upload tender documents, company registration, KRA PIN, IDs, or any supporting files. These are emailed to
            AVLC, while the form details are saved in the database.
          </p>
          <div className="mt-3 grid gap-3">
            <input
              name="supportingDocuments"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
              className="form-field"
            />
            <textarea
              name="additionalNotes"
              placeholder="Additional notes"
              rows={4}
              className="form-field"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex rounded-md bg-[var(--avlc-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--avlc-navy-900)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Guarantee Request"}
        </button>

        {status ? <p className="text-sm text-slate-700">{status}</p> : null}
      </form>
    </section>
  );
}
