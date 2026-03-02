"use client";

import { FormEvent, useState } from "react";

const claimForms = [
  {
    label: "Claiming as an Original Owner (4A)",
    href: "https://ufaa.go.ke/wp-content/uploads/2022/07/ORIGINAL-OWNER-CLAIM-FORM-1.pdf",
  },
  {
    label: "Claiming as a Beneficiary/Deceased Cases (4B)",
    href: "https://ufaa.go.ke/wp-content/uploads/2022/07/BENEFICIARY-CLAIM-FORM-1.pdf",
  },
  {
    label: "Claiming on Behalf of a Business Entity (4C)",
    href: "https://ufaa.go.ke/wp-content/uploads/2022/07/BUSINESS-ENTITY-CLAIM-FORM-2.pdf",
  },
  {
    label: "Claiming as an Agent for Owner (4D)",
    href: "https://ufaa.go.ke/wp-content/uploads/2022/07/AGENT-FOR-OWNER-CLAIM-FORM-1.pdf",
  },
  {
    label: "Claiming on Behalf of a Minor (4D Minor)",
    href: "https://ufaa.go.ke/wp-content/uploads/2022/07/AGENT-FOR-OWNER-CLAIM-FORM-MINOR-1.pdf",
  },
];

export default function AssetRecoveryTools() {
  const [selectedForm, setSelectedForm] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const openSelectedForm = () => {
    if (!selectedForm) {
      return;
    }
    window.open(selectedForm, "_blank", "noopener,noreferrer");
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/asset-recovery-submissions", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      event.currentTarget.reset();
      setStatus("Form submitted successfully. Our team will contact you.");
    } else {
      setStatus("Unable to submit form right now. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6 rounded-xl border border-[var(--avlc-slate-200)] bg-slate-50 p-5">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-[var(--avlc-navy-900)]">Claiming Instruction Forms</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={selectedForm}
            onChange={(event) => setSelectedForm(event.target.value)}
            className="w-full rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-2 text-sm text-slate-700 sm:max-w-xl"
          >
            <option value="">-- Select Claiming Instructions Form --</option>
            {claimForms.map((form) => (
              <option key={form.href} value={form.href}>
                {form.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={openSelectedForm}
            disabled={!selectedForm}
            className="inline-flex rounded-md bg-[var(--avlc-primary)] px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Open Form
          </button>
        </div>
      </div>

      <form className="space-y-3" onSubmit={onSubmit}>
        <p className="text-sm font-semibold text-[var(--avlc-navy-900)]">Upload Filled Form</p>
        <input
          type="text"
          name="name"
          required
          placeholder="Full name"
          className="w-full rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-2 text-sm text-slate-700"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Email address"
          className="w-full rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-2 text-sm text-slate-700"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone number"
          className="w-full rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-2 text-sm text-slate-700"
        />
        <input
          type="file"
          name="uploaded_form"
          accept=".pdf,.doc,.docx,.zip"
          multiple
          required
          className="w-full rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-2 text-sm text-slate-700"
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex rounded-md bg-[var(--avlc-navy-900)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Form"}
        </button>
        {status ? <p className="text-sm text-slate-700">{status}</p> : null}
      </form>
    </div>
  );
}
