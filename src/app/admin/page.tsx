import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import AdminLogoutButton from "@/components/admin-logout-button";
import { ADMIN_COOKIE_NAME, isAdminSessionValid } from "@/lib/admin-auth";

export default async function AdminHomePage() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await isAdminSessionValid(cookieValue))) {
    redirect("/admin/login");
  }

  return (
    <section className="space-y-4 rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-9">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--avlc-navy-700)]">Admin</p>
      <h1 className="text-4xl text-[var(--avlc-navy-900)]">Operations Dashboard</h1>
      <p className="text-sm leading-7 text-slate-700 sm:text-base">Use the publisher tools to manage live website updates.</p>
      <Link
        href="/admin/updates"
        className="inline-flex rounded-md bg-[var(--avlc-primary)] px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)]"
      >
        Open Updates Publisher
      </Link>
      <div>
        <AdminLogoutButton />
      </div>
    </section>
  );
}
