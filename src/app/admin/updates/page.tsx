import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminLogoutButton from "@/components/admin-logout-button";
import AdminUpdatesManager from "@/components/admin-updates-manager";
import { ADMIN_COOKIE_NAME, isAdminSessionValid } from "@/lib/admin-auth";
import { getAllUpdates } from "@/lib/updates";

export default async function AdminUpdatesPage() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await isAdminSessionValid(cookieValue))) {
    redirect("/admin/login");
  }

  const updates = await getAllUpdates();

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--avlc-navy-700)]">Admin</p>
        <h1 className="mt-2 text-4xl text-[var(--avlc-navy-900)]">Updates Publisher</h1>
        <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
          Create, edit, and publish updates that appear on the public Updates page.
        </p>
        <div className="mt-4">
          <AdminLogoutButton />
        </div>
      </section>

      <AdminUpdatesManager initialUpdates={updates} />
    </div>
  );
}
