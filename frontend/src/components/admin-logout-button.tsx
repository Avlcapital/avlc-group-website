"use client";

import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";

export default function AdminLogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await apiFetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={logout}
      className="inline-flex rounded-md border border-[var(--avlc-slate-200)] bg-white px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)]"
    >
      Sign Out
    </button>
  );
}
