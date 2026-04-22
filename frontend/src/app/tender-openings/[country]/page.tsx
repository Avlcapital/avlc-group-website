import Link from "next/link";
import { notFound } from "next/navigation";

import { tenderCountries, tenderCountryMap } from "@/lib/tenders";

type CountryTenderPageProps = {
  params: Promise<{
    country: string;
  }>;
};

export function generateStaticParams() {
  return tenderCountries.map((country) => ({ country: country.slug }));
}

export default async function CountryTenderPage({ params }: CountryTenderPageProps) {
  const { country } = await params;
  const tender = tenderCountryMap[country];

  if (!tender) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white px-6 py-4 text-sm text-slate-600 shadow-sm sm:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/tender-openings" className="hover:text-[var(--avlc-navy-900)]">
            Tender Openings
          </Link>
          <span>/</span>
          <span className="font-semibold text-[var(--avlc-navy-900)]">{tender.title}</span>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-9">
        <h1 className="text-4xl text-[var(--avlc-navy-900)]">{tender.title}</h1>
        {tender.tenderNo ? <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">Tender NO: {tender.tenderNo}</p> : null}
        {tender.tenderName ? <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">Tender Name: {tender.tenderName}</p> : null}
      </section>

      {tender.sections.map((section, index) => (
        <section key={`${tender.slug}-${index}`} className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-8">
          {section.heading ? <h2 className="text-2xl text-[var(--avlc-navy-900)]">{section.heading}</h2> : null}
          {section.paragraphs ? (
            <div className={`${section.heading ? "mt-4" : ""} space-y-3 text-sm leading-7 text-slate-700 sm:text-base`}>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : null}
          {section.bullets ? (
            <ul className={`${section.heading ? "mt-4" : ""} list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base`}>
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      {tender.downloads?.length ? (
        <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-8">
          <h2 className="text-2xl text-[var(--avlc-navy-900)]">Tender Documents</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {tender.downloads.map((download) => (
              <a
                key={download.href}
                href={download.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-md bg-[var(--avlc-primary)] px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)] transition hover:brightness-95"
              >
                {download.label}
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
