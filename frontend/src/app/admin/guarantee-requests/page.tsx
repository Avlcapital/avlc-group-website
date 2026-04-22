import Link from "next/link";

import AdminGuaranteeRequestsManager from "@/components/admin-guarantee-requests-manager";
import AdminLogoutButton from "@/components/admin-logout-button";

export default function AdminGuaranteeRequestsPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-9">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--avlc-navy-700)]">Admin</p>
            <h1 className="mt-2 text-4xl text-[var(--avlc-navy-900)]">PSL Guarantee Requests</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700 sm:text-base">
              Review online guarantee request submissions from the PSL Capital page. Submissions are saved in MongoDB
              and emailed to AVLC.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="inline-flex rounded-md border border-[var(--avlc-slate-200)] bg-white px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)]"
            >
              Back to Dashboard
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </section>

      <AdminGuaranteeRequestsManager />
    </div>
  );
}
