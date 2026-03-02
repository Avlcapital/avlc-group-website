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
      "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2015/11/John-Kageche-Passport-Photo-370x275.png?resize=370%2C275&ssl=1",
  },
  {
    name: "Andrew Kanyutu",
    image:
      "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2015/11/Andrew-Kanyutu-Photo-370x275.jpg?resize=370%2C275&ssl=1",
  },
  {
    name: "Moses Muriithi",
    image:
      "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2015/11/Moses-Muriithi-Photo-370x275.jpg?resize=370%2C275&ssl=1",
  },
];

const partners = [
  { name: "UAP", image: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/08/uap.jpg?w=940&ssl=1" },
  {
    name: "Resolution Insurance",
    image: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/08/resolution.png?w=940&ssl=1",
  },
  { name: "Proxima", image: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/08/proxima.jpg?w=940&ssl=1" },
  { name: "MPesa", image: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/08/mpesa.jpg?w=940&ssl=1" },
  { name: "Jubilee", image: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/08/jubilee.png?w=940&ssl=1" },
  { name: "IRA", image: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/08/ira.png?w=940&ssl=1" },
  {
    name: "Flying Doctors",
    image: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/08/flying-doctors.jpg?w=940&ssl=1",
  },
  { name: "EcoCash", image: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/08/ecocash.png?w=940&ssl=1" },
  { name: "E Plus", image: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/08/eplus.png?w=940&ssl=1" },
  { name: "CIC Group", image: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/08/cic.png?w=940&ssl=1" },
  { name: "APA Insurance", image: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/08/apa1.png?w=940&ssl=1" },
  { name: "AIG", image: "https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/08/aig.png?w=940&ssl=1" },
];

export default function AboutAvlcGroupPage() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--avlc-navy-700)]">About AVLC Group</p>
        <h1 className="mt-2 text-4xl text-[var(--avlc-navy-900)]">About AvlcGroup</h1>
        <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700 sm:text-base">
          <p>
            <strong>AVLC GROUP</strong> is a ONE STOP FINANCIAL SHOP. It comprises of eight financial companies that
            fulfill all the aspects of financial growth in respect to our client&apos;s businesses.
          </p>
          <p>
            We believe that innovation is the key to a leading team and we know that nothing great has ever been
            accomplished without passion.
          </p>
          <p>
            <strong>AVLC GROUP</strong> business doctrine is not just doing great deals; it is having great products,
            doing great engineering and providing tremendous services to customers.
          </p>
        </div>
      </section>

      <section className="grid items-center gap-8 md:grid-cols-2">
        <article className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--avlc-navy-700)]">Vision</p>
          <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
            <strong>AVLC GROUP VISION</strong> is to provide a one stop shop for all financial needs across East
            Africa and beyond.
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
            src="https://i0.wp.com/www.avlc-group.com/wp-content/uploads/2021/08/pngwing.com1_-800x600.png"
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
