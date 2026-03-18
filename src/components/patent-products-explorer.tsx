"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ProductCard = {
  name: string;
  logo: string;
  summary: string;
};

type ProductDetail = {
  intro: string[];
  sections: Array<{
    title: string;
    paragraphs?: string[];
    bullets?: string[];
  }>;
};

const productCards: ProductCard[] = [
  {
    name: "ASSET RECOVERY",
    logo: "/assets/patented-products/asset-recovery.jpg",
    summary:
      "One of our key services is the facilitation of asset recovery and reunification, where AVLC acts as a trusted intermediary between asset-holding institutions and clients.",
  },
  {
    name: "CHILD GUARD",
    logo: "/assets/patented-products/child-guard.jpg",
    summary:
      "A partnership with E-plus Emergency Medical services and Flying Doctors Society of Africa powered by BKY Insurance Agency Limited.",
  },
  {
    name: "LIFESTYLE LADY",
    logo: "/assets/patented-products/lifestyle-lady.jpg",
    summary:
      "Insurance policy targeted to the modern lady that covers beyond basics, including valuables and subsidized partner offers.",
  },
  {
    name: "PESA NA PESA",
    logo: "/assets/patented-products/pesa-na-pesa.jpg",
    summary:
      "Pesa na Pesa is a mobile utility financing platform that helps approved customers pay essential service bills through an allocated utility limit.",
  },
  {
    name: "BIMA HIMA",
    logo: "/assets/patented-products/bima-hima.jpg",
    summary:
      "A platform that eases the burden of paying insurance premiums in manageable installments.",
  },
  {
    name: "LANDBANK SOLUTION",
    logo: "/assets/companies/avlc-global.png",
    summary:
      "Consultative structuring that facilitates security using land and other assets to unlock cash flows and business growth.",
  },
];

const productDetails: Record<string, ProductDetail> = {
  "ASSET RECOVERY": {
    intro: [
      "Asset Recovery and reunification is designed to help rightful owners recover unclaimed assets through a guided and documented process.",
      "AVLC acts as a trusted intermediary between clients, asset-holding institutions, and the relevant authority so the process is managed with structure and speed.",
    ],
    sections: [
      {
        title: "What AVLC Handles",
        bullets: [
          "Preparation and handling of the required paperwork on behalf of the client",
          "Engagement with asset holders and financial institutions to obtain verification documents",
          "Follow-up and submission support with the Unclaimed Financial Assets Authority",
        ],
      },
      {
        title: "Process Flow",
        paragraphs: [
          "The process generally moves through agreement execution, ownership verification, submission to UFAA, review, approval, and final transfer.",
          "Depending on the arrangement, recovered assets may be transferred directly to the client or through an escrow and paymaster structure.",
        ],
      },
    ],
  },
  "CHILD GUARD": {
    intro: [
      "Child Guard focuses on one urgent need: making sure a child can access timely emergency medical support when a parent or guardian cannot intervene immediately.",
      "The product is powered through a partnership between emergency response providers and BKY Insurance Agency Limited.",
    ],
    sections: [
      {
        title: "Core Idea",
        bullets: [
          "Emergency medical assistance support for children",
          "Insurance-backed response arrangement",
          "Practical family-focused continuity cover",
        ],
      },
    ],
  },
  "LIFESTYLE LADY": {
    intro: [
      "Lifestyle Lady is tailored to the modern woman and extends beyond standard insurance expectations.",
      "The product combines motor protection with cover for selected personal valuables and access to lifestyle partner benefits.",
    ],
    sections: [
      {
        title: "Highlights",
        bullets: [
          "Protection that goes beyond standard vehicle cover",
          "Support for items such as phones, handbags, and similar valuables",
          "Access to subsidized offers through partner outlets",
        ],
      },
      {
        title: "Customer Experience",
        paragraphs: [
          "Physical registration is completed once for compliance, after which ongoing use is supported through mobile-based transactions.",
        ],
      },
    ],
  },
  "PESA NA PESA": {
    intro: [
      "Pesa na Pesa is a mobile-based utility financing platform that allows approved customers to access an allocated utility limit and settle essential bills instantly through their phones.",
      "The solution brings together USSD access, CreditInfo CRB scoring, MPESA payments, provider integrations, repayment tracking, and SMS notifications in one workflow.",
    ],
    sections: [
      {
        title: "Registration Flow",
        bullets: [
          "Dial *519*25# and complete the registration prompts",
          "Enter ID details and full names exactly as they appear on the ID",
          "Consent to CRB assessment and accept the terms and conditions",
          "Pay the KES 100 registration fee via MPESA",
          "Receive a utility limit allocation based on the resulting credit score",
        ],
      },
      {
        title: "Utility Usage",
        bullets: [
          "Select a provider such as KPLC, Nairobi Water, DSTV, GOTV, ZUKU, or STARTIMES",
          "Enter the correct utility account number",
          "Have the approved amount credited directly to the selected provider",
          "Receive SMS confirmation for the payment transaction",
        ],
      },
      {
        title: "Repayment And Controls",
        bullets: [
          "Repay via Paybill 990390 using the customer phone number as the account number",
          "Receive SMS updates for registration outcome, loan details, reminders, and repayment",
          "Benefit from transparent cost disclosure and automated limit restoration after full repayment",
          "Operate under explicit consent requirements for CRB checks and structured penalty handling",
        ],
      },
    ],
  },
  "BIMA HIMA": {
    intro: [
      "BIMA HIMA makes large insurance premium payments easier to manage by turning them into a more accessible installment-based arrangement.",
      "The platform is designed to improve affordability while keeping access to insurance cover practical and simple.",
    ],
    sections: [
      {
        title: "Key Benefits",
        bullets: [
          "Monthly installment repayment approach",
          "Flexible financing terms",
          "Fast processing with competitive pricing",
        ],
      },
    ],
  },
  "LANDBANK SOLUTION": {
    intro: [
      "LandBank Solution helps structure security using land and related assets so borrowers can unlock financing opportunities.",
      "AVLC supports the transaction by connecting the parties, shaping the structure, and securing the interests of both sides.",
    ],
    sections: [
      {
        title: "How It Helps",
        bullets: [
          "Supports land-backed security structuring",
          "Connects borrowers with third-party landowners where needed",
          "Helps unlock capital for business expansion and cash-flow support",
        ],
      },
    ],
  },
};

export default function PatentProductsExplorer() {
  const [activeProduct, setActiveProduct] = useState<string | null>(null);

  useEffect(() => {
    if (!activeProduct) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveProduct(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeProduct]);

  const detail = activeProduct ? productDetails[activeProduct] : null;

  return (
    <>
      <section className="grid gap-4 md:grid-cols-2">
        {productCards.map((card) => (
          <button
            key={card.name}
            type="button"
            onClick={() => setActiveProduct(card.name)}
            className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[var(--avlc-primary)] hover:shadow-md"
          >
            <div className="mb-4 flex min-h-20 items-center justify-center rounded-xl border border-[var(--avlc-slate-200)] bg-slate-50 p-3">
              <Image src={card.logo} alt={`${card.name} logo`} width={260} height={120} className="h-auto w-auto max-h-16 object-contain" />
            </div>
            <h2 className="text-2xl text-[var(--avlc-navy-900)]">{card.name}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">{card.summary}</p>
            <p className="mt-4 text-sm font-semibold text-[var(--avlc-navy-700)]">Open product details</p>
          </button>
        ))}
      </section>

      {activeProduct && detail ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgb(9_26_52_/_55%)] px-4 py-6">
          <div className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-[var(--avlc-slate-200)] bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[var(--avlc-slate-200)] px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--avlc-navy-700)]">Product Overview</p>
                <h3 className="mt-2 text-3xl text-[var(--avlc-navy-900)]">{activeProduct}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveProduct(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--avlc-slate-200)] bg-white text-lg text-[var(--avlc-navy-900)]"
                aria-label="Close product details"
              >
                x
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5">
              <div className="space-y-4">
                {detail.intro.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-7 text-slate-700 sm:text-base">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-6 space-y-6">
                {detail.sections.map((section) => (
                  <section key={section.title} className="space-y-3">
                    <h4 className="text-xl text-[var(--avlc-navy-900)]">{section.title}</h4>
                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-7 text-slate-700 sm:text-base">
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets ? (
                      <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
