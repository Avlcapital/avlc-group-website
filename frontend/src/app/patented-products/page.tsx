import Link from "next/link";

import AssetRecoveryTools from "@/components/asset-recovery-tools";
import PatentProductsExplorer from "@/components/patent-products-explorer";

const assetRecoverySteps = [
  "Handling all paperwork on behalf of the client and obtaining all necessary approvals to facilitate the recovery of assets.",
  "Engaging with the clients and asset holders/financial institutions to obtain verification documents.",
  "Engaging with UFAA (Unclaimed Financial Assets Authority) on behalf of the client to fast track the approval as well as the recovery process.",
];

const processFlow = [
  "Agreement Execution and Application: AVLC provides the client application form with NCNDA, then both parties execute a contract after required submission.",
  "Verification of Ownership: AVLC verifies ownership and submits KYC and verification documentation with holders.",
  "Documents Submission to UFAA: AVLC and legal team proceed with formal application and supporting documentation.",
  "Review and Approval: UFAA reviews for completeness/accuracy and transfers asset once requirements are met.",
];

export default function PatentedProductsPage() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--avlc-navy-700)]">Our Patented Products</p>
        <h1 className="mt-2 text-4xl text-[var(--avlc-navy-900)]">Our Patented Products</h1>
        <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
          AVLC’s product lines are designed to deliver integrated financial solutions that combine finance, insurance protection, emergency liquidity support, and structured solutions to address real-world financial needs. 
          These patented and proprietary products are built to serve individuals, SMEs, and corporate clients across the region, enabling access to capital while supporting resilience, business growth, and financial stability.
        </p>
      </section>

      <PatentProductsExplorer />

      <section className="space-y-8 rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-8">
        <article className="space-y-4">
          <h2 className="text-2xl text-[var(--avlc-navy-900)]">ASSET RECOVERY</h2>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">
            One of our key services is the facilitation of asset recovery and reunification, where AVLC acts as a trusted
            intermediary between asset-holding institutions and clients to ensure the return of unclaimed assets to their rightful owners.
          </p>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">AVLC will be responsible for:</p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
            {assetRecoverySteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <a
            href="/assets/documents/asset-recovery/avlc-asset-recovery-application-form.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-md bg-[var(--avlc-primary)] px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)] transition hover:brightness-95"
          >
            AVLC Asset Recovery Application Form (PDF)
          </a>
        </article>

        <article className="space-y-4">
          <h3 className="text-xl text-[var(--avlc-navy-900)]">Structure And Process Flow</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
            {processFlow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">
            Estimated turn-around time from document verification to asset recovery is 30 days for direct applicants and
            90 days for other applicants.
          </p>
        </article>

        <article className="space-y-3">
          <h3 className="text-xl text-[var(--avlc-navy-900)]">Asset Transfer Options</h3>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">
            Option 1: The asset is transferred directly to the client account or nominated account upon approval.
          </p>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">
            Option 2: The asset is transferred to AVLC for onward transfer to the client through escrow and paymaster arrangements.
          </p>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">
            For further inquiries: AVLC Global Consultants Limited, P.O Box 35502-00100, Nairobi, Kenya. Email:
            assetsrecovery@avlcapital.com. Tel: +254 20 230 4180, Mobile: +254 717 780 171.
          </p>
        </article>

        <AssetRecoveryTools />
      </section>

      <section className="space-y-8 rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-8">
        <article className="space-y-3">
          <h2 className="text-2xl text-[var(--avlc-navy-900)]">CHILD GUARD</h2>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">
            Every responsible parent would wish to be able to fend for their child every minute of day and night. Every parent
            knows that this can only remain as a wish. It is not realistic. Every parent accepts that significant others must
            step into the parental role. The teacher is one; the maid is another; the neighbour is yet another; and then there
            is Child Guard.
          </p>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">
            ChildGuard is a partnership between E-plus Emergency Medical services (Red Cross) and Flying Doctors Society of Africa
            powered by BKY Insurance Agency Limited to ensure that in the misfortunate event of an emergency, your child gets life
            saving medical assistance in time.
          </p>
          <Link
            href="/contact"
            className="inline-flex rounded-md border border-[var(--avlc-slate-200)] bg-white px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)]"
          >
            Request Child Guard Form (PDF)
          </Link>
        </article>

        <article className="space-y-3">
          <h2 className="text-2xl text-[var(--avlc-navy-900)]">LIFESTYLE LADY</h2>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">
            Lifestyle Lady Insurance policy targeted to the modern lady that covers beyond basics. It covers not only the ladies car
            in case of an accident but also valuables like cell phones, handbags to shoes. The lady also enjoys subsidized prices in
            various outlets like Spas, Shopping Malls and Hair Saloons.
          </p>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">
            The service is not network dependent and physical registration is done once (in keeping with Know Your Customer
            requirements), after which all transactions thereafter are mobile phone based.
          </p>
          <Link
            href="/contact"
            className="inline-flex rounded-md border border-[var(--avlc-slate-200)] bg-white px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)]"
          >
            Request Lifestyle Lady Form (PDF)
          </Link>
        </article>

        <article className="space-y-3">
          <h2 className="text-2xl text-[var(--avlc-navy-900)]">PESA NA PESA</h2>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">
            Pesa na Pesa™ (PNP) is an innovative mobile phone based digital lending product developed by AVL Capital ltd which offers utility loans to anyone who needs short term funds to pay for their utility bills.
          </p>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">
            The platform combines a USSD access layer, CRB-based credit scoring, MPESA payments, utility-provider integrations,
            automated repayment tracking, and SMS notifications into one simple financing workflow.
          </p>
          <div className="space-y-3">
            <h3 className="text-xl text-[var(--avlc-navy-900)]">Customer Registration Process</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
              <li>Dial `*519*25#` and follow the registration prompts.</li>
              <li>Enter your National ID number and full names exactly as they appear on the ID.</li>
              <li>Consent to CreditInfo CRB assessment for utility-limit allocation.</li>
              <li>Accept the terms and conditions at `https://bit.ly/4tc1mJN`.</li>
              <li>Pay the registration fee of KES 100 through MPESA.</li>
              <li>The system runs a CRB check and assigns a utility limit based on the rating, typically KES 200, 300, or 500.</li>
              <li>A confirmation SMS is sent whether registration is approved or unsuccessful.</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl text-[var(--avlc-navy-900)]">Utility Limit Usage Flow</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
              <li>Dial `*519*25#` and select the borrowing option.</li>
              <li>Choose the service provider, including KPLC, Nairobi Water, DSTV, GOTV, ZUKU, or STARTIMES.</li>
              <li>Enter the correct utility account number.</li>
              <li>The approved amount is deducted from the utility limit and credited directly to the selected provider.</li>
              <li>The customer receives an SMS confirming the utility payment transaction.</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl text-[var(--avlc-navy-900)]">Repayment And Notifications</h3>
            <p className="text-sm leading-7 text-slate-700 sm:text-base">
              Repayment is made through Paybill `990390`, using the customer phone number as the account number. Loan notices
              communicate the principal amount, interest, total due, and repayment deadline.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
              <li>Registration outcome and approved limit notifications</li>
              <li>Utility usage and provider-credit confirmations</li>
              <li>Loan details with repayment instructions</li>
              <li>Two-week reminder and due-date reminder messages</li>
              <li>Payment-success confirmation with limit restoration notice</li>
              <li>Overdue alerts and penalty notifications where applicable</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl text-[var(--avlc-navy-900)]">Compliance And Risk Controls</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
              <li>Explicit customer consent is required before CRB checks are performed.</li>
              <li>Cost disclosures are surfaced clearly as part of onboarding and borrowing flows.</li>
              <li>Penalty calculations are automated to support consistency and transparency.</li>
              <li>Utility limits are only restored after full repayment has been completed.</li>
              <li>Credit scoring is handled through CreditInfo CRB integration.</li>
            </ul>
          </div>
          <a
            href="/assets/documents/patented-products/pesa-na-pesa-terms-and-conditions.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-md bg-[var(--avlc-primary)] px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)] transition hover:brightness-95"
          >
            Download Pesa na Pesa Terms & Conditions (PDF)
          </a>
        </article>

        <article className="space-y-3">
          <h2 className="text-2xl text-[var(--avlc-navy-900)]">BIMA HIMA</h2>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">
            BIMA HIMA is a platform that eases the burden of paying your insurance premiums. With this facility, paying for large
            insurance premiums is easy, simple and affordable through monthly installments.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
            <li>Flexible financing terms of up to 4 months.</li>
            <li>Quick processing time with competitive interest rates.</li>
            {/*<li>Access by dialing *483*01#.</li>*/}
          </ul>
          <a
            href="/assets/documents/patented-products/bima-hima-terms-and-conditions.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-md bg-[var(--avlc-primary)] px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)] transition hover:brightness-95"
          >
            Download BIMA HIMA Terms & Conditions (PDF)
          </a>
        </article>

        <article className="space-y-3">
          <h2 className="text-2xl text-[var(--avlc-navy-900)]">LANDBANK SOLUTION</h2>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">
            AVLC Group LandBank solution facilitates borrowers in obtaining security in the form of land from third-party landowners.
            AVLC connects parties, structures agreements, and secures the interests of both sides.
          </p>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">
            Turn-around time is 14 days, subject to submission of KYC, NCNDA, financials, offer letters, formal application, and agreed fees.
          </p>
          <Link
            href="/contact"
            className="inline-flex rounded-md border border-[var(--avlc-slate-200)] bg-white px-4 py-2 text-sm font-semibold text-[var(--avlc-navy-900)]"
          >
            Request LandBank Form (PDF)
          </Link>
        </article>
      </section>
    </div>
  );
}
