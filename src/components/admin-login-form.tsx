"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    setStatus(null);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => ({}))) as { error?: string };
      setStatus(error.error || "Login failed.");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/admin/updates");
    router.refresh();
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        placeholder="Username"
        className="w-full rounded-md border border-[var(--avlc-slate-200)] px-3 py-2 text-sm text-slate-700"
      />
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        className="w-full rounded-md border border-[var(--avlc-slate-200)] px-3 py-2 text-sm text-slate-700"
      />
      <button
        type="button"
        onClick={onLogin}
        disabled={loading}
        className="inline-flex rounded-md bg-[var(--avlc-primary)] px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)] disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
      {status ? <p className="text-sm text-red-700">{status}</p> : null}
    </div>
  );
}
