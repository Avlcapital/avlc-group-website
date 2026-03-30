import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import AdminChatManager from "@/components/admin-chat-manager";
import AdminLogoutButton from "@/components/admin-logout-button";
import { ADMIN_COOKIE_NAME, isAdminSessionValid } from "@/lib/admin-auth";
import { listChatSessions } from "@/lib/chat";

export default async function AdminChatPage() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await isAdminSessionValid(cookieValue))) {
    redirect("/admin/login");
  }

  const sessions = await listChatSessions();

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-9">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--avlc-navy-700)]">Admin</p>
            <h1 className="mt-2 text-4xl text-[var(--avlc-navy-900)]">Live Chat Inbox</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700 sm:text-base">
              Monitor visitor conversations from the Contact page, reply in real time, and close chats when the issue
              has been resolved.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="inline-flex rounded-md border border-[var(--avlc-slate-200)] bg-white px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)]"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/admin/updates"
              className="inline-flex rounded-md border border-[var(--avlc-slate-200)] bg-white px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)]"
            >
              Open Updates
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </section>

      <AdminChatManager initialSessions={sessions} />
    </div>
  );
}
