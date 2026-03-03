"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/contact-submissions", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      event.currentTarget.reset();
      setStatus("Message submitted successfully. We will contact you shortly.");
    } else {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setStatus(data.error || "Unable to submit message right now. Please try again.");
    }

    setSubmitting(false);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        name="name"
        type="text"
        required
        placeholder="Your Name *"
        className="w-full rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-2 text-sm text-slate-700"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Your Email *"
        className="w-full rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-2 text-sm text-slate-700"
      />
      <input
        name="subject"
        type="text"
        required
        placeholder="Subject *"
        className="w-full rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-2 text-sm text-slate-700"
      />
      <textarea
        name="message"
        required
        placeholder="Message *"
        rows={7}
        className="w-full rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-2 text-sm text-slate-700"
      />
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex rounded-md bg-[var(--avlc-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--avlc-navy-900)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "SUBMIT"}
      </button>
      {status ? <p className="text-sm text-slate-700">{status}</p> : null}
    </form>
  );
}
