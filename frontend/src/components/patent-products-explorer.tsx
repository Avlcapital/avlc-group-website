"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ProductCard = {
  name: string;
  logo: string;
  summary: string;
};

const productCards: ProductCard[] = [
  {
    name: "ASSET RECOVERY",
    logo: "/assets/patented-products/asset-recovery.jpg",
    summary:
      "A structured recovery and reunification service that helps clients reclaim eligible assets through a guided process.",
  },
  {
    name: "CHILD GUARD",
    logo: "/assets/patented-products/child-guard.jpg",
    summary:
      "Emergency-response cover for children delivered through specialized medical and insurance partnerships.",
  },
  {
    name: "LIFESTYLE LADY",
    logo: "/assets/patented-products/lifestyle-lady.jpg",
    summary:
      "A modern insurance proposition designed around lifestyle risks, valuables protection, and partner benefits.",
  },
  {
    name: "PESA NA PESA",
    logo: "/assets/patented-products/pesa-na-pesa.jpg",
    summary:
      "A mobile utility financing platform that gives approved customers instant access to small utility limits directly from their phones.",
  },
  {
    name: "BIMA HIMA",
    logo: "/assets/patented-products/bima-hima.jpg",
    summary:
      "An installment-based insurance premium support platform built to make cover more affordable and manageable.",
  },
  {
    name: "LANDBANK SOLUTION",
    logo: "/assets/branding/avlc-logo.png",
    summary:
      "A consultative structuring solution that helps unlock land and asset-backed security for business growth.",
  },
];

const productDetails: Record<string, { intro: string[]; sections: Array<{ title: string; bullets?: string[]; paragraphs?: string[] }> }> = {
  "ASSET RECOVERY": {
    intro: [
      "Asset Recovery is designed to help rightful owners reclaim eligible unclaimed assets through a guided, documentation-led process.",
      "AVLC supports verification, paperwork handling, and structured engagement with asset holders and the relevant authority.",
    ],
    sections: [
      {
        title: "Key Service Areas",
        bullets: [
          "Client paperwork support and approvals coordination",
          "Verification with institutions holding the asset",
          "Submission support and fast-tracking with UFAA",
        ],
      },
      {
        title: "Process",
        paragraphs: [
          "The service typically moves through application, ownership verification, document submission, review, approval, and asset transfer stages.",
          "Depending on the case structure, transfer may be direct to the client or routed through an escrow-supported arrangement.",
        ],
      },
    ],
  },
  "CHILD GUARD": {
    intro: [
      "Child Guard is built around one practical concern: timely emergency assistance when a parent or guardian cannot physically intervene immediately.",
      "It combines emergency medical response capability with insurance-backed support so that a child can access urgent care faster in a crisis.",
    ],
    sections: [
      {
        title: "What It Offers",
        bullets: [
          "Emergency support orientation for children",
          "Medical-response partnership model",
          "Insurance-backed support structure",
        ],
      },
    ],
  },
  "LIFESTYLE LADY": {
    intro: [
      "Lifestyle Lady is an insurance product tailored to the realities of a modern female customer, extending beyond standard motor cover.",
      "The product includes protection for selected valuables and access to partner-driven lifestyle benefits.",
    ],
    sections: [
      {
        title: "Coverage Direction",
        bullets: [
          "Motor protection with broader practical benefits",
          "Support for valuables such as phones and handbags",
          "Partner offers in beauty, shopping, and lifestyle outlets",
        ],
      },
      {
        title: "Customer Experience",
        paragraphs: [
          "The service is structured for convenience, with physical registration completed once and later interactions supported through mobile-based transactions.",
        ],
      },
    ],
  },
  "PESA NA PESA": {
    intro: [
      "Pesa na Pesa (PNP) is a mobile-based utility financing platform that allows approved customers to access a utility limit and pay essential services instantly by phone.",
      "The platform combines USSD access, CreditInfo CRB scoring, MPESA payments, utility integrations, SMS notifications, and automated repayment tracking into one flow.",
    ],
    sections: [
      {
        title: "Registration Flow",
        bullets: [
          "Dial *519*25# and complete the registration prompts",
          "Submit ID details and names exactly as they appear on the ID",
          "Consent to CRB scoring and accept terms and conditions",
          "Pay the KES 100 registration fee through MPESA",
          "Receive a utility limit allocation based on credit rating",
        ],
      },
      {
        title: "Usage And Repayment",
        bullets: [
          "Select a provider such as KPLC, Nairobi Water, DSTV, GOTV, ZUKU, or STARTIMES",
          "Enter the utility account number and trigger direct provider payment",
          "Repay through Paybill 990390 using the phone number as the account number",
          "Receive SMS updates for registration, usage, reminders, repayment, and overdue events",
        ],
      },
      {
        title: "Risk And Compliance Controls",
        bullets: [
          "Explicit consent before CRB checks",
          "Transparent cost disclosure",
          "Automated penalty handling",
          "Limit restoration only after full repayment",
        ],
      },
    ],
  },
  "BIMA HIMA": {
    intro: [
      "BIMA HIMA is a premium-financing support platform that makes large insurance premium payments easier to manage.",
      "It is designed to spread payment pressure and improve access to insurance cover for both individuals and business clients.",
    ],
    sections: [
      {
        title: "Key Benefits",
        bullets: [
          "Monthly installment approach instead of one large upfront premium",
          "Flexible financing terms",
          "Faster processing and competitive pricing",
        ],
      },
    ],
  },
  "LANDBANK SOLUTION": {
    intro: [
      "LandBank Solution helps structure security arrangements using land and other qualifying assets so borrowers can unlock financing opportunities.",
      "AVLC's role is consultative and structuring-focused, connecting parties and securing the commercial interests of each side.",
    ],
    sections: [
      {
        title: "Use Case",
        bullets: [
          "Land-backed security structuring",
          "Support for borrowers seeking third-party collateral support",
          "Business growth facilitation through unlocked asset value",
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
              <Image
                src={card.logo}
                alt={`${card.name} logo`}
                width={260}
                height={120}
                unoptimized
                className="h-auto w-auto max-h-16 object-contain"
              />
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
