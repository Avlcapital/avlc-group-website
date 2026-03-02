import Image from "next/image";
import type { CSSProperties } from "react";

export default function HomePage() {
  const groupCompanies = [
    {
      name: "AVL Capital",
      description:
        "Provides excellent, innovative, and credible financial services aimed at empowering clients to build a strong financial base and successful businesses.",
      logo: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/07/AVLCAPITAL.png?fit=500%2C200&ssl=1",
    },
    {
      name: "Africa Instruments",
      description:
        "Acts as a link between local commodity traders and the global market with solutions such as supply chain finance, structured finance, and financial instruments consultancy.",
      logo: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/07/AFRICAINSTRUMENTS.png?fit=500%2C200&ssl=1",
    },
    {
      name: "Advance Ventures",
      description:
        "Supports accessible funding from investors and channels funds across group companies for each company’s specific growth vision.",
      logo: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/07/AVL.png?fit=500%2C200&ssl=1",
    },
    {
      name: "Instacash Worldwide Limited",
      description:
        "Leverages mobile money platforms to improve how people send and receive money in Africa and beyond.",
      logo: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/07/INSTACASH.png?fit=500%2C200&ssl=1",
    },
    {
      name: "BKY Insurance Agency",
      description:
        "Focuses on research, innovation, and process efficiency to deliver differentiated insurance agency solutions beyond standardized products.",
      logo: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/07/BKY.png?fit=500%2C200&ssl=1",
    },
    {
      name: "AVLC Global Consultants",
      description:
        "Operates with strong internal controls, monitoring procedures, proper authorizations, backup processes, and contingency planning to support reliable advisory delivery.",
      logo: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/07/AVLCGLOBAL.png?fit=500%2C200&ssl=1",
    },
    {
      name: "Wasili Kenya (Micro Credit CBO)",
      description:
        "Community-based micro credit initiative within the AVLC ecosystem supporting grassroots financial access.",
      logo: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/07/AVLC.png?fit=500%2C200&ssl=1",
    },
    {
      name: "PSL Capital (Cash Free Bid Bonds)",
      description:
        "Provides cash free bid bond support and related credible financial services that help clients execute opportunities without locking up working capital.",
      logo: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/07/PSL.png?fit=500%2C200&ssl=1",
    },
  ];

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
            across high-growth sectors. Discover services, announcements, and key company information in one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/about-avlc-group"
              className="rounded-md bg-[var(--avlc-gold-500)] px-5 py-3 text-sm font-semibold text-[var(--avlc-navy-900)] transition hover:bg-[var(--avlc-gold-300)]"
            >
              Learn More
            </a>
            <a
              href="/contact"
              className="rounded-md border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <section className="motion-fade-up space-y-8" style={{ "--delay": "110ms" } as CSSProperties}>
        <div id="group-companies" className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--avlc-navy-700)]">Welcome to AVLC Group</p>
          <h2 className="text-3xl leading-tight text-[var(--avlc-navy-900)] sm:text-4xl">
            A trusted strategic platform for enterprise advancement.
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
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--avlc-navy-700)]">Group Companies</p>
          <div className="grid gap-4 md:grid-cols-2">
            {groupCompanies.map((company, index) => (
              <article
                key={company.name}
                className="motion-fade-up rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
                style={{ "--delay": `${180 + index * 70}ms` } as CSSProperties}
              >
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
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="motion-fade-up grid items-center gap-8 rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-6 shadow-sm md:grid-cols-2 md:p-8"
        style={{ "--delay": "240ms" } as CSSProperties}
      >
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--avlc-navy-700)]">Introduction</p>
          <h2 className="text-3xl text-[var(--avlc-navy-900)] sm:text-4xl">AVLC Group</h2>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">
            <strong>AVLC GROUP</strong> is a ONE STOP FINANCIAL SHOP. It comprises of eight financial companies that
            fulfill all the aspects of financial growth in respect to our client&apos;s businesses.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-[var(--avlc-slate-200)] bg-slate-50">
          <Image
            src="https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/08/pngwing.com1_-800x600.png"
            alt="AVLC Group Introduction"
            width={800}
            height={600}
            className="h-auto w-full object-cover"
          />
        </div>
      </section>
    </div>
  );
}
