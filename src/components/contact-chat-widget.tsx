"use client";

import { useMemo, useState } from "react";

export default function ContactChatWidget() {
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const canSend = useMemo(
    () => Boolean(visitorName.trim() && visitorEmail.trim() && message.trim()),
    [message, visitorEmail, visitorName],
  );

  const sendMessage = async () => {
    if (!canSend) {
      setStatus("Name, email, and your message are required.");
      return;
    }

    setLoading(true);
    setStatus("");

    const response = await fetch("/api/chat/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorName,
        visitorEmail,
        message,
      }),
    });

    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      setStatus(data.error || "Unable to send your message right now.");
      setLoading(false);
      return;
    }

    setVisitorName("");
    setVisitorEmail("");
    setMessage("");
    setStatus("Your message has been sent. Our team will reply directly to your email.");
    setLoading(false);
  };

  return (
    <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-6 shadow-sm sm:p-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--avlc-navy-700)]">Chat Support</p>
        <h2 className="mt-2 text-2xl text-[var(--avlc-navy-900)]">Chat with us now</h2>
        <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">
          Send your message here and our team will respond directly to the email address you provide.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <input
          value={visitorName}
          onChange={(event) => setVisitorName(event.target.value)}
          placeholder="Your name *"
          className="w-full rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-2 text-sm text-slate-700"
        />
        <input
          value={visitorEmail}
          onChange={(event) => setVisitorEmail(event.target.value)}
          placeholder="Your email *"
          type="email"
          className="w-full rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-2 text-sm text-slate-700"
        />
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="How can we help you today? *"
          rows={5}
          className="w-full rounded-md border border-[var(--avlc-slate-200)] bg-white px-3 py-2 text-sm text-slate-700"
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={loading}
          className="inline-flex rounded-md bg-[var(--avlc-navy-900)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </div>

      {status ? <p className="mt-4 text-sm text-slate-700">{status}</p> : null}
    </section>
  );
}
