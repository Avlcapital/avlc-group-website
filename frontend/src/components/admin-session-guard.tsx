"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { apiFetch } from "@/lib/api-client";

type Props = {
  children: React.ReactNode;
};

export default function AdminSessionGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [checking, setChecking] = useState(!isLoginPage);
  const [isAuthorized, setIsAuthorized] = useState(isLoginPage);

  useEffect(() => {
    let active = true;

    if (isLoginPage) {
      setChecking(false);
      setIsAuthorized(true);
      return () => {
        active = false;
      };
    }

    setChecking(true);

    void apiFetch("/api/admin/session")
      .then((response) => {
        if (!active) {
          return;
        }

        if (response.ok) {
          setIsAuthorized(true);
          setChecking(false);
          return;
        }

        setIsAuthorized(false);
        setChecking(false);
        router.replace("/admin/login");
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setIsAuthorized(false);
        setChecking(false);
        router.replace("/admin/login");
      });

    return () => {
      active = false;
    };
  }, [isLoginPage, pathname, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking || !isAuthorized) {
    return (
      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--avlc-navy-700)]">Admin</p>
        <h1 className="mt-2 text-3xl text-[var(--avlc-navy-900)]">Checking Session</h1>
        <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
          Confirming your admin session before opening this page.
        </p>
      </section>
    );
  }

  return <>{children}</>;
}
