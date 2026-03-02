import Image from "next/image";
import Link from "next/link";

import AssetRecoveryTools from "@/components/asset-recovery-tools";

const productCards = [
  {
    name: "ASSET RECOVERY",
    logo: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/08/istockphoto-1198189076-612x612-1.jpg?resize=158%2C59",
    summary:
      "One of our key services is the facilitation of asset recovery and reunification, where AVLC acts as a trusted intermediary between asset-holding institutions and clients.",
  },
  {
    name: "CHILD GUARD",
    logo: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/08/Child-Guard-Logo.jpg?fit=185%2C118&ssl=1",
    summary:
      "A partnership with E-plus Emergency Medical services and Flying Doctors Society of Africa powered by BKY Insurance Agency Limited.",
  },
  {
    name: "LIFESTYLE LADY",
    logo: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/08/Lifestyle-Lady-Logo.jpg?fit=194%2C126&ssl=1",
    summary:
      "Insurance policy targeted to the modern lady that covers beyond basics, including valuables and subsidized partner offers.",
  },
  {
    name: "PESA NA PESA",
    logo: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/08/Pesa-na-Pesa-Logo.jpg?fit=233%2C148&ssl=1",
    summary:
      "An innovative mobile phone based borrowing and lending product developed by AVL Capital ltd for short-term utility financing.",
  },
  {
    name: "BIMA HIMA",
    logo: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/09/IMG-20210924-WA0001.jpg?fit=628%2C218&ssl=1",
    summary:
      "A platform that eases the burden of paying insurance premiums in manageable installments.",
  },
  {
    name: "LANDBANK SOLUTION",
    logo: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/07/AVLCGLOBAL.png?fit=500%2C200&ssl=1",
    summary:
      "Consultative structuring that facilitates security using land and other assets to unlock cash flows and business growth.",
  },
];

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
          AVLC product lines combine finance, insurance, emergency support, and asset-backed structuring to deliver practical
          solutions for individuals and businesses across the region.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {productCards.map((card) => (
          <article key={card.name} className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-6 shadow-sm">
            <div className="mb-4 flex min-h-20 items-center justify-center rounded-xl border border-[var(--avlc-slate-200)] bg-slate-50 p-3">
              <Image src={card.logo} alt={`${card.name} logo`} width={260} height={120} className="h-auto w-auto max-h-16 object-contain" />
            </div>
            <h2 className="text-2xl text-[var(--avlc-navy-900)]">{card.name}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">{card.summary}</p>
          </article>
        ))}
      </section>

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
            href="https://acrobat.adobe.com/id/urn:aaid:sc:eu:c4a3c8e0-9d76-4a75-bce1-3c717fc7600d"
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
            Pesa na Pesa is an innovative mobile phone based borrowing and lending product developed by AVL Capital ltd which offers
            utility loans to anyone who needs short term funds to pay for bills. It is a facility payable within 30 days for amounts
            up to Kes. 5,000.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
            <li>Registration: Dial *483*118# and follow the system prompts with correct signup details.</li>
            <li>Borrowing: Dial *483*118#, enter your PIN, and proceed to pay for bill in the menu.</li>
            <li>Repayments: Dial *483*118# and select Pay Loan. Limit restores automatically after clearance.</li>
          </ul>
          <a
            href="http://www.avlc-group.com/wp-content/uploads/2021/08/PNP-TERMS-AND-CONDITIONS.pdf"
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
            <li>Access by dialing *483*01#.</li>
          </ul>
          <a
            href="http://www.avlc-group.com/wp-content/uploads/2021/09/BIMA-HIMA-Terms-and-Conditions.pdf"
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
