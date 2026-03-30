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
      <p className="text-sm leading-7 text-slate-700 sm:text-base">
        Use the publisher tools to manage live website updates and respond to visitor chats from the contact page.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/updates"
          className="rounded-2xl border border-[var(--avlc-slate-200)] bg-slate-50 p-5 transition hover:border-[var(--avlc-primary)] hover:bg-white"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--avlc-navy-700)]">Publishing</p>
          <h2 className="mt-2 text-2xl text-[var(--avlc-navy-900)]">Updates Publisher</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">Create, edit, publish, and unpublish website updates.</p>
        </Link>
        <Link
          href="/admin/chat"
          className="rounded-2xl border border-[var(--avlc-slate-200)] bg-slate-50 p-5 transition hover:border-[var(--avlc-primary)] hover:bg-white"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--avlc-navy-700)]">Support</p>
          <h2 className="mt-2 text-2xl text-[var(--avlc-navy-900)]">Live Chat Inbox</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">Read visitor chats, reply from admin, and close conversations.</p>
        </Link>
      </div>
      <div>
        <AdminLogoutButton />
      </div>
    </section>
  );
}
