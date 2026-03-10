import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { webPageSchema, breadcrumbSchema } from '../utils/seoSchemas'

const services = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Recruitment',
    description: 'Reach qualified professional economists through direct mailing to our membership base and prominent placement on the SPE website.',
    colour: 'indigo',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    title: 'Conference Sponsorship',
    description: 'Sponsor the SPE Annual Conference and gain visibility among senior economists from the public and private sectors.',
    colour: 'amber',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Newsletter & Publications',
    description: 'Advertise in the Society Newsletter or through our website to reach economists across government, finance, and academia.',
    colour: 'emerald',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Event Partnership',
    description: 'Partner on evening talks and special events to connect your brand with the UK\'s foremost professional economists.',
    colour: 'rose',
  },
]

const colourMap: Record<string, { bg: string; icon: string; text: string }> = {
  indigo: { bg: 'bg-spe-cream', icon: 'text-spe-gold', text: 'text-spe-ink' },
  amber: { bg: 'bg-spe-cream', icon: 'text-spe-gold', text: 'text-spe-ink' },
  emerald: { bg: 'bg-spe-cream', icon: 'text-spe-gold', text: 'text-spe-ink' },
  rose: { bg: 'bg-spe-cream', icon: 'text-spe-gold', text: 'text-spe-ink' },
}

const stats = [
  { value: '700+', label: 'Members' },
  { value: '70+', label: 'Years' },
  { value: '50+', label: 'Events / year' },
  { value: '16+', label: 'Major employers' },
]

export default function Advertise() {
  useSEO({
    title: 'Advertise with SPE',
    description: 'Advertise with the Society of Professional Economists. Reach professional economists across the UK.',
    type: 'website',
    schema: [
      webPageSchema({ name: 'Advertise with SPE', description: 'Advertise with the Society of Professional Economists. Reach professional economists across the UK.', path: '/advertise' }),
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Advertise' }]),
    ],
  })

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep text-white relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <div className="inline-flex items-center gap-2 mb-3"><span className="w-6 h-[2px] bg-spe-gold rounded-full" /><span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">Partner with SPE</span></div>
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">Advertise</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light">
            Connect your brand with the UK's leading community of professional economists through recruitment, sponsorship, and advertising.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map(stat => (
            <div key={stat.label} className="text-center p-6 rounded-xl bg-spe-cream/50 border border-spe-divider/20">
              <div className="text-3xl sm:text-4xl font-serif font-bold text-spe-blue mb-1">{stat.value}</div>
              <div className="text-sm text-spe-muted">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Services */}
        <div className="mb-16">
          <h2 className="editorial-heading text-2xl sm:text-3xl text-spe-ink mb-2">Advertising Services</h2>
          <p className="text-spe-muted mb-10 max-w-2xl">
            The Society offers multiple ways to reach professional economists across the public and private sectors.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map(service => {
              const colours = colourMap[service.colour]
              return (
                <div
                  key={service.title}
                  className="rounded-2xl border border-spe-divider/30 bg-white p-8 hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-xl ${colours.bg} flex items-center justify-center mb-5`}>
                    <span className={colours.icon}>{service.icon}</span>
                  </div>
                  <h3 className={`text-xl font-serif font-bold mb-3 ${colours.text}`}>
                    {service.title}
                  </h3>
                  <p className="text-spe-muted leading-relaxed">{service.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Audience */}
        <div className="mb-16 rounded-2xl bg-spe-cream/50 border border-spe-divider/20 p-8 sm:p-10">
          <h2 className="editorial-heading text-2xl text-spe-ink mb-6">Our Audience</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Bank of England',
              'HM Treasury',
              'Goldman Sachs',
              'J.P. Morgan',
              'Oxford Economics',
              'Barclays',
              'HSBC',
              'Deutsche Bank',
              'Capital Economics',
              'OBR',
              'London School of Economics',
              'University of Oxford',
            ].map(org => (
              <div key={org} className="flex items-center gap-3 text-sm text-spe-ink">
                <div className="w-1.5 h-1.5 rounded-full bg-spe-blue flex-shrink-0" />
                {org}
              </div>
            ))}
          </div>
          <p className="text-xs text-spe-muted mt-6">
            SPE members work across government, central banking, financial services, consulting, and academia.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep rounded-2xl p-10 sm:p-14 text-white relative overflow-hidden grain-overlay">
          <h2 className="editorial-heading text-2xl sm:text-3xl mb-3">Get in Touch</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-6 font-light">
            To discuss advertising opportunities, sponsorship packages, or recruitment placements, contact the SPE Secretariat.
          </p>
          <p className="text-white/60 text-sm mb-8">
            <a href="mailto:admin@spe.org.uk" className="text-white/80 hover:text-white underline transition-colors">
              admin@spe.org.uk
            </a>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-spe-deep font-semibold px-6 py-3 rounded-lg hover:bg-spe-cream transition-colors"
            >
              Contact the SPE
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              to="/careers/jobs"
              className="inline-flex items-center gap-2 text-white/80 font-medium hover:text-white transition-colors"
            >
              View Jobs Board
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
