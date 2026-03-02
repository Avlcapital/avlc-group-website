import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { companyProfiles } from "@/lib/companies";

type CompanyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return Object.keys(companyProfiles).map((slug) => ({ slug }));
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const company = companyProfiles[slug];

  if (!company) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white px-6 py-4 text-sm text-slate-600 shadow-sm sm:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-[var(--avlc-navy-900)]">
            Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-[var(--avlc-navy-900)]">{company.pageTitle}</span>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-9">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="mb-6 flex min-h-28 items-center justify-center rounded-xl border border-[var(--avlc-slate-200)] bg-slate-50 p-5">
            <Image
              src={company.heroImage ?? company.logo}
              alt={`${company.pageTitle} logo`}
              width={500}
              height={200}
              className="h-auto w-auto max-h-24 object-contain sm:max-h-28"
            />
          </div>
          <h1 className="text-3xl text-[var(--avlc-navy-900)] sm:text-4xl">{company.pageTitle}</h1>
          <h2 className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-[var(--avlc-navy-700)]">
            {company.introHeading ?? "WHO WE ARE"}
          </h2>
          <div className="mt-4 space-y-3 text-left text-sm leading-7 text-slate-700 sm:text-base">
            {company.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {company.downloadCta ? (
            <a
              href={company.downloadCta.href}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-md bg-[var(--avlc-primary)] px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)] transition hover:brightness-95"
            >
              {company.downloadCta.label}
            </a>
          ) : null}
        </div>
      </section>

      {company.sections.map((section) => (
        <section key={section.title} className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-8">
          <h2 className="text-2xl text-[var(--avlc-navy-900)]">{section.title}</h2>

          {section.paragraphs ? (
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700 sm:text-base">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : null}

          {section.bullets ? (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      {company.contact ? (
        <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-8">
          <h2 className="text-2xl text-[var(--avlc-navy-900)]">Contact</h2>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700 sm:text-base">
            {company.contact.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-5">
            <Link
              href="/contact"
              className="inline-flex rounded-md bg-[var(--avlc-primary)] px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)] transition hover:brightness-95"
            >
              Contact AVLC Group
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
