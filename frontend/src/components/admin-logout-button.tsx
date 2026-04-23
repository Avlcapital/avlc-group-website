"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/api-client";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const logout = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const response = await apiFetch("/api/admin/logout", { method: "POST" });
      if (!response.ok && response.status !== 401) {
        const error = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(error.error || "Sign out failed.");
      }

      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Sign out failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => void logout()}
        disabled={loading}
        className="inline-flex rounded-md border border-[var(--avlc-slate-200)] bg-white px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)] disabled:opacity-60"
      >
        {loading ? "Signing Out..." : "Sign Out"}
      </button>
      {status ? <p className="text-sm text-red-700">{status}</p> : null}
    </div>
  );
}
