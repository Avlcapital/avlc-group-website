import AdminLoginForm from "@/components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <section className="space-y-4 rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-9">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--avlc-navy-700)]">Admin</p>
      <h1 className="text-4xl text-[var(--avlc-navy-900)]">Sign In</h1>
      <p className="text-sm leading-7 text-slate-700 sm:text-base">Sign in once and manage updates without re-entering token per action.</p>
      <AdminLoginForm />
    </section>
  );
}
