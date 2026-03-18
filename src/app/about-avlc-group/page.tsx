import Image from "next/image";

const coreValues = [
  "Professionalism",
  "Integrity",
  "Innovation Passion",
  "Corporate Governance",
];

const keyStrategies = [
  "Innovation: Thinking outside the confines of traditional financial solutions by integrating technology and new schools of thought.",
  "Execution excellence through quality products, strong engineering, and dependable service delivery.",
  "Customer-centered growth by building solutions aligned to client business outcomes.",
];

const directors = [
  {
    name: "John Kageche",
    image:
      "/assets/about/john-kageche.png",
    role: "Director",
  },
  {
    name: "Andrew Kanyutu",
    image:
      "/assets/about/AK.jpg",
    role: "Chief Executive Officer",
  },
  {
    name: "Moses Muriithi",
    image:
      "/assets/about/moses-muriithi.jpg",
    role: "Chairman",
  },
];

const partners = [
  { name: "UAP", image: "/assets/partners/uap.jpg" },
  {
    name: "Resolution Insurance",
    image: "/assets/partners/resolution.png",
  },
  { name: "Proxima", image: "/assets/partners/proxima.jpg" },
  { name: "MPesa", image: "/assets/partners/mpesa.jpg" },
  { name: "Jubilee", image: "/assets/partners/jubilee.png" },
  { name: "IRA", image: "/assets/partners/ira.png" },
  {
    name: "Flying Doctors",
    image: "/assets/partners/flying-doctors.jpg",
  },
  { name: "EcoCash", image: "/assets/partners/ecocash.png" },
  { name: "E Plus", image: "/assets/partners/eplus.png" },
  { name: "CIC Group", image: "/assets/partners/cic.png" },
  { name: "APA Insurance", image: "/assets/partners/apa.png" },
  { name: "AIG", image: "/assets/partners/aig.png" },
];

export default function AboutAvlcGroupPage() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--avlc-navy-700)]">About AVLC Group</p>
        <h1 className="mt-2 text-4xl text-[var(--avlc-navy-900)]">About AvlcGroup</h1>
        <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700 sm:text-base">
          <p>
            <strong>AVLC Group </strong> is a reputable boutique finance firm offering a comprehensive range of financial solutions within the mezzanine space. 
            The group comprises of 8 registered companies all working together to provide great products and solutions that are progressive and innovative whilst providing unrivalled customer service. 
            We believe that our innovativeness and passion for mutual success puts us ahead of the pack. 
          </p>

          <p>
            Our Vision is to provide a one stop shop for all financial needs through structured and customized finance solutions across East Africa and beyond. 
            This vision is driven by the following <br/> KEY STRATEGY: Customization - Creating products as per the greater well researched market demand.
          </p>
        </div>
      </section>

      <section className="grid items-center gap-8 md:grid-cols-2">
        <article className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--avlc-navy-700)]">Vision</p>
          <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
            <strong>AVLC GROUP VISION </strong> is to provide a one stop shop for all financial needs though structured and customized finance solutions across East Africa and beyond. 
          </p>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-[var(--avlc-navy-700)]">Key Strategy</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
            {keyStrategies.map((strategy) => (
              <li key={strategy}>{strategy}</li>
            ))}
          </ul>
        </article>

        <div className="overflow-hidden rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-2 shadow-sm">
          <Image
            src="/assets/branding/avlc-building.png"
            alt="AVLC Group introduction visual"
            width={800}
            height={600}
            className="h-auto w-full rounded-xl object-cover"
          />
        </div>
      </section>

      <section id="group-companies" className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--avlc-navy-700)]">Core Values</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {coreValues.map((value) => (
            <li
              key={value}
              className="rounded-lg border border-[var(--avlc-slate-200)] bg-slate-50 px-4 py-3 text-sm font-semibold text-[var(--avlc-navy-900)]"
            >
              {value}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--avlc-navy-700)]">Board Of Directors</p>
        <h2 className="mt-2 text-3xl text-[var(--avlc-navy-900)]">Leadership Team</h2>
        <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
          At AVLC Group our operations are distinct and specific to our growing organization. Our company is built on
          leadership, strategy, integrity, team work, results, governance and professionalism. We believe in our
          directors&apos; capability to realize these goals.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {directors.map((director) => (
            <article key={director.name} className="overflow-hidden rounded-xl border border-[var(--avlc-slate-200)] bg-slate-50">
              <Image src={director.image} alt={director.name} width={370} height={275} className="h-auto w-full object-cover" />
              <div className="px-4 py-3">
                <h3 className="text-lg text-[var(--avlc-navy-900)]">{director.name}</h3>
                <p className="mt-2 inline-flex rounded-full bg-[color-mix(in_srgb,var(--avlc-primary)_16%,white)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--avlc-navy-900)]">
                  {director.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--avlc-navy-700)]">Partners</p>
        <h2 className="mt-2 text-3xl text-[var(--avlc-navy-900)]">Our Partners</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((partner) => (
            <article key={partner.name} className="flex items-center justify-center rounded-xl border border-[var(--avlc-slate-200)] bg-slate-50 p-4">
              <Image src={partner.image} alt={partner.name} width={180} height={90} className="h-auto w-auto max-h-14 object-contain" />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
