import Link from "next/link";

import { tenderCountries } from "@/lib/tenders";

export default function TenderOpeningsPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--avlc-navy-700)]">Tender Openings</p>
        <h1 className="mt-2 text-4xl text-[var(--avlc-navy-900)]">Tender Openings</h1>
        <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
          Select a country to view current tender content as published on AVLC Group.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {tenderCountries.map((country) => (
          <Link
            key={country.slug}
            href={`/tender-openings/${country.slug}`}
            className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-2xl text-[var(--avlc-navy-900)]">{country.title}</h2>
            <p className="mt-2 text-sm font-semibold text-[var(--avlc-navy-700)]">Open country tenders</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
