import ContactForm from "@/components/contact-form";

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-7 shadow-sm sm:p-9">
        <h1 className="text-4xl text-[var(--avlc-navy-900)]">CONTACT</h1>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <article className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl text-[var(--avlc-navy-900)]">ADDRESS</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
            Duplex Apartments, Suite No.24
            <br />
            Upperhill Road, Upperhill, Nairobi
            <br />
            Nairobi, Kenya.
          </p>

          <h2 className="mt-6 text-xl text-[var(--avlc-navy-900)]">PHONE</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">Office: +254 20 230 4180</p>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">+254 717 780 171</p>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">Email: info@avlcapital.com</p>
        </article>

        <article className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-6 shadow-sm sm:p-8">
          <ContactForm />
        </article>
      </section>

      <section className="rounded-2xl border border-[var(--avlc-slate-200)] bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl text-[var(--avlc-navy-900)]">Our location</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-[var(--avlc-slate-200)]">
          <iframe
            title="AVLC Group location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7916496461744!2d36.816919773687694!3d-1.2998282356383932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10e409d70eb5%3A0xac8df2e2f36646eb!2sPR29%2B4VQ%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1701236665941!5m2!1sen!2ske"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
