import { useSEO } from '../hooks/useSEO'

export default function Contact() {
  useSEO({
    title: 'Contact the SPE',
    description: 'Contact the Society of Professional Economists. Get in touch with our team in London.',
    type: 'website',
  })

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep text-white relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <div className="inline-flex items-center gap-2 mb-3"><span className="w-6 h-[2px] bg-spe-gold rounded-full" /><span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">Get in Touch</span></div>
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">Contact Us</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light">
            Have a question about the Society, membership, or our events? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-spe-divider/30 bg-white p-8 sm:p-10">
              <h2 className="editorial-heading text-xl sm:text-2xl text-spe-ink mb-6">
                Send us a message
              </h2>
              <form
                className="space-y-5"
                onSubmit={e => {
                  e.preventDefault()
                  // Static mirror — form does not submit
                }}
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-spe-ink mb-1.5">
                    Your full name <span className="text-spe-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    className="w-full rounded-lg border border-spe-divider/40 bg-white px-4 py-2.5 text-base text-spe-ink placeholder:text-spe-muted/50 focus:outline-none focus:ring-2 focus:ring-spe-blue/30 focus:border-spe-blue transition-colors"
                    placeholder="Jane Smith"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-spe-ink mb-1.5">
                    Company <span className="text-spe-muted/50 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    autoComplete="organization"
                    className="w-full rounded-lg border border-spe-divider/40 bg-white px-4 py-2.5 text-base text-spe-ink placeholder:text-spe-muted/50 focus:outline-none focus:ring-2 focus:ring-spe-blue/30 focus:border-spe-blue transition-colors"
                    placeholder="Your organisation"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-spe-ink mb-1.5">
                      Email <span className="text-spe-error">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      autoComplete="email"
                      className="w-full rounded-lg border border-spe-divider/40 bg-white px-4 py-2.5 text-base text-spe-ink placeholder:text-spe-muted/50 focus:outline-none focus:ring-2 focus:ring-spe-blue/30 focus:border-spe-blue transition-colors"
                      placeholder="jane@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="telephone" className="block text-sm font-medium text-spe-ink mb-1.5">
                      Telephone <span className="text-spe-muted/50 font-normal">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="telephone"
                      name="telephone"
                      autoComplete="tel"
                      className="w-full rounded-lg border border-spe-divider/40 bg-white px-4 py-2.5 text-base text-spe-ink placeholder:text-spe-muted/50 focus:outline-none focus:ring-2 focus:ring-spe-blue/30 focus:border-spe-blue transition-colors"
                      placeholder="+44 20 1234 5678"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-spe-ink mb-1.5">
                    Message <span className="text-spe-error">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full rounded-lg border border-spe-divider/40 bg-white px-4 py-2.5 text-base text-spe-ink placeholder:text-spe-muted/50 focus:outline-none focus:ring-2 focus:ring-spe-blue/30 focus:border-spe-blue transition-colors resize-y"
                    placeholder="How can we help?"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-spe-blue text-white font-semibold px-6 py-3 rounded-lg hover:bg-spe-deep transition-colors"
                >
                  Send Message
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar info */}
          <div className="lg:col-span-2 space-y-6">
            {/* General enquiries */}
            <div className="rounded-2xl border border-spe-divider/30 bg-white p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-spe-blue/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-serif font-bold text-spe-ink">General Enquiries</h3>
              </div>
              <p className="text-sm text-spe-muted leading-relaxed mb-3">
                For general questions about the Society, events, or publications, use the contact form
                or email us directly.
              </p>
              <a
                href="mailto:admin@spe.org.uk"
                className="text-sm font-medium text-spe-blue hover:underline"
              >
                admin@spe.org.uk →
              </a>
            </div>

            {/* Membership */}
            <div className="rounded-2xl border border-spe-divider/30 bg-white p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-spe-cream flex items-center justify-center">
                  <svg className="w-5 h-5 text-spe-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="font-serif font-bold text-spe-ink">Membership</h3>
              </div>
              <p className="text-sm text-spe-muted leading-relaxed mb-3">
                Questions about joining the SPE, renewals, or member benefits?
              </p>
              <a
                href="/membership"
                className="text-sm font-medium text-spe-blue hover:underline"
              >
                Visit the membership page →
              </a>
            </div>

            {/* Advertising */}
            <div className="rounded-2xl border border-spe-divider/30 bg-white p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-spe-cream flex items-center justify-center">
                  <svg className="w-5 h-5 text-spe-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <h3 className="font-serif font-bold text-spe-ink">Advertising</h3>
              </div>
              <p className="text-sm text-spe-muted leading-relaxed mb-3">
                Interested in advertising with the SPE or sponsoring an event?
              </p>
              <a
                href="/advertise"
                className="text-sm font-medium text-spe-blue hover:underline"
              >
                View advertising options →
              </a>
            </div>

            {/* Social media */}
            <div className="rounded-2xl bg-gradient-to-br from-spe-cream/50 to-spe-paper/50 border border-spe-divider/20 p-7">
              <h3 className="font-serif font-bold text-spe-ink mb-3">Follow Us</h3>
              <div className="flex items-center gap-4">
                <a
                  href="https://twitter.com/econ_SPE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white border border-spe-divider/20 flex items-center justify-center hover:border-spe-blue/30 transition-colors"
                  aria-label="Follow SPE on X (Twitter)"
                >
                  <svg className="w-4 h-4 text-spe-ink" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/society-of-professional-economists"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white border border-spe-divider/20 flex items-center justify-center hover:border-spe-blue/30 transition-colors"
                  aria-label="Follow SPE on LinkedIn"
                >
                  <svg className="w-4 h-4 text-spe-ink" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
