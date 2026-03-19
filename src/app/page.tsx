import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { homepageCompanies } from "@/lib/companies";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="avlc-hero motion-fade-up rounded-2xl p-7 text-white shadow-xl sm:p-10">
        <div className="max-w-3xl space-y-6">
          <span className="avlc-badge inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]">
            AVLC Group
          </span>
          <h1 className="text-4xl leading-tight sm:text-5xl">
            Your one-stop financial and corporate growth partner in Africa.
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
            We support institutional clients with corporate structuring, advisory, compliance support, and execution
            across high-growth sectors. 
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/about-avlc-group"
              className="rounded-md bg-[var(--avlc-gold-500)] px-5 py-3 text-sm font-semibold text-[var(--avlc-navy-900)] transition hover:bg-[var(--avlc-gold-300)]"
            >
              Learn More
            </Link>
            <Link
              href="/contact"
              className="rounded-md border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <section
        className="motion-fade-up grid items-center gap-8 rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-6 shadow-sm md:grid-cols-2 md:p-8"
        style={{ "--delay": "110ms" } as CSSProperties}
      >
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--avlc-navy-700)]">Introduction</p>
          <h2 className="text-3xl text-[var(--avlc-navy-900)] sm:text-4xl">AVLC Group</h2>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">
            <strong>AVLC GROUP</strong> AVLC Group is a reputable boutique finance firm offering a comprehensive range of financial solutions within the mezzanine space. The group comprises of 8 registered companies all working together to provide great products and solutions that are progressive and innovative whilst providing unrivalled customer service. We believe that our innovativeness and passion for mutual success puts us ahead of the pack. 

            Our Vision is to provide a one stop shop for all financial needs through structured and customized finance solutions across East Africa and beyond. This vision is driven by the following <br/>
            KEY STRATEGY: Customization - Creating products as per the greater well researched market demand.

          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-[var(--avlc-slate-200)] bg-slate-50">
          <Image
            src="/assets/branding/avlc-building.png"
            alt="AVLC Group Introduction"
            width={800}
            height={600}
            className="h-auto w-full object-cover"
          />
        </div>
      </section>

      <section className="motion-fade-up space-y-8" style={{ "--delay": "240ms" } as CSSProperties}>
        <div id="group-companies" className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--avlc-navy-700)]">Welcome to AVLC Group</p>
          <h2 className="text-3xl leading-tight text-[var(--avlc-navy-900)] sm:text-4xl">
            A trusted strategic partner for enterprise advancement.
          </h2>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">
            Our team combines financial insight, execution capability, and regional knowledge to deliver practical
            solutions for organizations navigating complexity.
          </p>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">
            We maintain a strong focus on professionalism, compliance, and value creation across all client
            engagements.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--avlc-navy-700)]">Our Companies</p>
          <div className="grid gap-4 md:grid-cols-2">
            {homepageCompanies.map((company, index) => (
              <article
                key={company.name}
                className="motion-fade-up rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
                style={{ "--delay": `${180 + index * 70}ms` } as CSSProperties}
              >
                <Link href={company.href} className="block">
                  <div className="mb-4 flex h-20 items-center justify-start rounded-lg bg-slate-50 px-3">
                    <Image
                      src={company.logo}
                      alt={`${company.name} logo`}
                      width={180}
                      height={72}
                      className="h-auto w-auto max-h-14 object-contain"
                    />
                  </div>
                  <h3 className="text-xl text-[var(--avlc-navy-900)]">{company.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{company.description}</p>
                  <p className="mt-3 text-sm font-semibold text-[var(--avlc-navy-700)]">Read company profile</p>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
