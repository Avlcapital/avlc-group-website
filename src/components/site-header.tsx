"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { companyNavItems } from "@/lib/companies";
import { tenderNavItems } from "@/lib/tenders";

const primaryNav = [
  { href: "/about-avlc-group", label: "About AvlcGroup" },
  { href: "/patented-products", label: "Our Patent Products" },
  { href: "/leadership", label: "Leadership" },
  { href: "/updates", label: "Updates" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [companiesOpen, setCompaniesOpen] = useState(false);
  const [tenderOpen, setTenderOpen] = useState(false);

  const closeMobileMenu = () => {
    setMenuOpen(false);
    setCompaniesOpen(false);
    setTenderOpen(false);
  };

  return (
    <div className="motion-header-in fixed inset-x-0 top-0 z-50">
      <header className="border-b border-[var(--avlc-slate-200)] bg-[var(--avlc-primary)] text-[var(--avlc-navy-900)]">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-2 text-xs sm:text-sm">
          <p className="tracking-wide">Corporate Office: +254 717 780 171</p>
          <p className="font-semibold">info@avlcapital.com</p>
        </div>
      </header>

      <header className="border-b border-[var(--avlc-slate-200)] bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/07/AVLC.png?fit=500%2C200&ssl=1"
              alt="AVLC Group logo"
              width={170}
              height={68}
              className="h-auto w-auto max-h-11 object-contain"
              priority
            />
          </Link>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--avlc-slate-200)] bg-white text-[var(--avlc-navy-900)] shadow-sm transition hover:bg-slate-50 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((v) => !v);
              if (menuOpen) {
                setCompaniesOpen(false);
                setTenderOpen(false);
              }
            }}
          >
            <span className="relative block h-5 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  menuOpen ? "top-2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-2 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-4 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  menuOpen ? "top-2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>

          <nav aria-label="Primary" className="hidden flex-wrap items-center gap-1 text-sm font-semibold md:flex">
            {primaryNav.slice(0, 1).map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="rounded px-3 py-2 text-[var(--avlc-navy-900)] hover:bg-[color-mix(in_srgb,var(--avlc-gold-500)_14%,white)]"
              >
                {item.label}
              </Link>
            ))}

            <div className="group relative">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded px-3 py-2 text-[var(--avlc-navy-900)] hover:bg-[color-mix(in_srgb,var(--avlc-gold-500)_14%,white)]"
                aria-label="Show company list"
              >
                <span>Our Companies</span>
                <span className="text-xs transition group-hover:rotate-180">v</span>
              </button>

              <div className="invisible absolute left-0 top-full mt-1 w-80 rounded-xl border border-[var(--avlc-slate-200)] bg-white p-2 opacity-0 shadow-xl transition duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                {companyNavItems.map((item) => (
                  <Link
                    key={`desktop-company-${item.href}`}
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-[var(--avlc-navy-900)] transition-colors hover:bg-[color-mix(in_srgb,var(--avlc-gold-500)_14%,white)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {primaryNav.slice(1, 4).map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="rounded px-3 py-2 text-[var(--avlc-navy-900)] hover:bg-[color-mix(in_srgb,var(--avlc-gold-500)_14%,white)]"
              >
                {item.label}
              </Link>
            ))}

            <div className="group relative">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded px-3 py-2 text-[var(--avlc-navy-900)] hover:bg-[color-mix(in_srgb,var(--avlc-gold-500)_14%,white)]"
                aria-label="Show tender openings countries"
              >
                <span>Tender Openings</span>
                <span className="text-xs transition group-hover:rotate-180">v</span>
              </button>

              <div className="invisible absolute left-0 top-full mt-1 w-72 rounded-xl border border-[var(--avlc-slate-200)] bg-white p-2 opacity-0 shadow-xl transition duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                {tenderNavItems.map((item) => (
                  <Link
                    key={`desktop-tender-${item.href}`}
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-[var(--avlc-navy-900)] transition-colors hover:bg-[color-mix(in_srgb,var(--avlc-gold-500)_14%,white)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {primaryNav.slice(4).map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="rounded px-3 py-2 text-[var(--avlc-navy-900)] hover:bg-[color-mix(in_srgb,var(--avlc-gold-500)_14%,white)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <nav
          aria-label="Mobile Primary"
          className={`overflow-hidden border-t border-[var(--avlc-slate-200)] bg-white transition-all duration-300 md:hidden ${
            menuOpen ? "max-h-[40rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col px-5 py-2">
            {primaryNav.slice(0, 1).map((item) => (
              <Link
                key={`mobile-${item.href}-${item.label}`}
                href={item.href}
                className="rounded px-3 py-2 text-sm font-semibold text-[var(--avlc-navy-900)] transition-colors hover:bg-[color-mix(in_srgb,var(--avlc-gold-500)_14%,white)]"
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}

            <button
              type="button"
              className="inline-flex items-center justify-between rounded px-3 py-2 text-left text-sm font-semibold text-[var(--avlc-navy-900)] transition-colors hover:bg-[color-mix(in_srgb,var(--avlc-gold-500)_14%,white)]"
              aria-expanded={companiesOpen}
              onClick={() => setCompaniesOpen((v) => !v)}
            >
              <span>Our Companies</span>
              <span className={`text-xs transition ${companiesOpen ? "rotate-180" : ""}`}>v</span>
            </button>

            <div
              className={`overflow-hidden pl-2 transition-all duration-300 ${
                companiesOpen ? "max-h-[30rem] py-1" : "max-h-0"
              }`}
            >
              {companyNavItems.map((item) => (
                <Link
                  key={`mobile-company-${item.href}`}
                  href={item.href}
                  className="block rounded px-3 py-2 text-sm font-medium text-[var(--avlc-navy-900)] transition-colors hover:bg-[color-mix(in_srgb,var(--avlc-gold-500)_14%,white)]"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {primaryNav.slice(1, 4).map((item) => (
              <Link
                key={`mobile-${item.href}-${item.label}`}
                href={item.href}
                className="rounded px-3 py-2 text-sm font-semibold text-[var(--avlc-navy-900)] transition-colors hover:bg-[color-mix(in_srgb,var(--avlc-gold-500)_14%,white)]"
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}

            <button
              type="button"
              className="inline-flex items-center justify-between rounded px-3 py-2 text-left text-sm font-semibold text-[var(--avlc-navy-900)] transition-colors hover:bg-[color-mix(in_srgb,var(--avlc-gold-500)_14%,white)]"
              aria-expanded={tenderOpen}
              onClick={() => setTenderOpen((v) => !v)}
            >
              <span>Tender Openings</span>
              <span className={`text-xs transition ${tenderOpen ? "rotate-180" : ""}`}>v</span>
            </button>

            <div
              className={`overflow-hidden pl-2 transition-all duration-300 ${
                tenderOpen ? "max-h-[24rem] py-1" : "max-h-0"
              }`}
            >
              {tenderNavItems.map((item) => (
                <Link
                  key={`mobile-tender-${item.href}`}
                  href={item.href}
                  className="block rounded px-3 py-2 text-sm font-medium text-[var(--avlc-navy-900)] transition-colors hover:bg-[color-mix(in_srgb,var(--avlc-gold-500)_14%,white)]"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {primaryNav.slice(4).map((item) => (
              <Link
                key={`mobile-${item.href}-${item.label}`}
                href={item.href}
                className="rounded px-3 py-2 text-sm font-semibold text-[var(--avlc-navy-900)] transition-colors hover:bg-[color-mix(in_srgb,var(--avlc-gold-500)_14%,white)]"
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
    </div>
  );
}
