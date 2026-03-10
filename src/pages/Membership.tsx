import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'

const benefits = [
  {
    icon: 'calendar',
    title: 'Events & Networking',
    description:
      'Access to the Annual Conference, Annual Dinner, Evening Talks, and exclusive member networking events throughout the year.',
  },
  {
    icon: 'book',
    title: 'Publications & Research',
    description:
      'Salary surveys, members\' polls, Rybczynski Prize essays, book reviews, articles, and The Business Economist magazine.',
  },
  {
    icon: 'mic',
    title: 'Speaker Programme',
    description:
      'Hear from leading economists at our Evening Talks, conference sessions, and dinner reviews featuring top speakers.',
  },
  {
    icon: 'users',
    title: 'Professional Community',
    description:
      'Join a network of economists from the Bank of England, HM Treasury, Goldman Sachs, McKinsey, and 300+ organisations.',
  },
  {
    icon: 'briefcase',
    title: 'Career Development',
    description:
      'Access careers resources, salary benchmarking data, and professional development opportunities.',
  },
  {
    icon: 'podcast',
    title: 'Podcasts & Media',
    description:
      'Listen to expert podcasts, conference reports, and stay connected with the latest economic thinking.',
  },
]

const tiers = [
  {
    name: 'Student',
    price: '£40',
    period: 'per year',
    description: 'For students and recent graduates starting their economics career.',
    features: [
      'All member events at reduced rates',
      'Full digital access to publications',
      'Salary survey access',
      'Members\' poll participation',
      'Networking & career development',
    ],
    accent: 'blue',
    popular: false,
  },
  {
    name: 'Full Membership',
    price: '£110',
    period: 'per year',
    description: 'For professional economists across all sectors.',
    features: [
      'Priority access to all events',
      'Full publications library',
      'Annual salary survey reports',
      'Vote in members\' polls',
      'Directory listing',
      'Conference & dinner invitations',
      'Eligible for Fellowship',
    ],
    accent: 'blue',
    popular: true,
  },
]

const directoryOrgs = [
  'Bank of England',
  'HM Treasury',
  'Goldman Sachs',
  'McKinsey & Company',
  'London School of Economics',
  'Oxford Economics',
  'NIESR',
  'Deloitte',
  'PwC',
  'KPMG',
  'Barclays',
  'HSBC',
  'Office for Budget Responsibility',
  'International Monetary Fund',
  'European Central Bank',
  'University of Cambridge',
]

const subPages = [
  {
    path: '/membership/join',
    title: 'Join Now',
    description: 'Apply for SPE membership online.',
    icon: 'arrow-right',
  },
  {
    path: '/membership/subscriptions',
    title: 'Manage Subscription',
    description: 'Renew or manage your membership payments.',
    icon: 'credit-card',
  },
  {
    path: '/membership/docs',
    title: 'Society Documents',
    description: 'Constitution, annual reports, and governance documents.',
    icon: 'document',
  },
  {
    path: '/membership/directory',
    title: 'Member Directory',
    description: 'Browse organisations where SPE members work.',
    icon: 'globe',
  },
]

export default function Membership() {
  useSEO({
    title: 'Membership',
    description: 'Join the Society of Professional Economists. Membership benefits, fees, and how to apply.',
    type: 'website',
  })

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep text-white relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <div className="inline-flex items-center gap-2 mb-3"><span className="w-6 h-[2px] bg-spe-gold rounded-full" /><span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">Join the Community</span></div>
          <h1 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl mb-5">
            Become a Member
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl font-light leading-relaxed">
            The Society of Professional Economists is the UK's leading network for economists
            working in business, government, and academia. Join 1,000+ economists shaping economic
            policy and practice.
          </p>
        </div>
      </div>

      {/* Spring Offer Banner */}
      <div className="bg-gradient-to-r from-spe-cream to-spe-paper border-b border-spe-divider/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-3 text-center">
            <span className="inline-flex items-center gap-1.5 bg-spe-gold/20 text-spe-copper text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Spring Offer
            </span>
            <p className="text-sm sm:text-base text-spe-ink font-medium">
              Join now and get <strong>18 months for the price of 12</strong> — your membership
              won't renew until end of June 2027.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <p className="section-label">Why Join</p>
          <h2 className="editorial-heading text-2xl sm:text-3xl text-spe-ink">
            Membership Benefits
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map(benefit => (
            <div key={benefit.title} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-spe-blue/10 flex items-center justify-center flex-shrink-0">
                {benefit.icon === 'calendar' && (
                  <svg className="w-5 h-5 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                {benefit.icon === 'book' && (
                  <svg className="w-5 h-5 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )}
                {benefit.icon === 'mic' && (
                  <svg className="w-5 h-5 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
                {benefit.icon === 'users' && (
                  <svg className="w-5 h-5 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )}
                {benefit.icon === 'briefcase' && (
                  <svg className="w-5 h-5 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
                {benefit.icon === 'podcast' && (
                  <svg className="w-5 h-5 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 0m0 0a5 5 0 007.072 0m-7.072 0L4.343 16.88m0 0A9 9 0 012.1 12m2.243 4.88L2.1 12m0 0a9 9 0 012.243-4.88M12 12v.01" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="font-serif font-bold text-spe-ink mb-1">{benefit.title}</h3>
                <p className="text-sm text-spe-muted leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="bg-spe-cream/50 border-y border-spe-divider/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <p className="section-label">Pricing</p>
            <h2 className="editorial-heading text-2xl sm:text-3xl text-spe-ink">
              Choose Your Membership
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {tiers.map(tier => (
              <div
                key={tier.name}
                className={`relative rounded-2xl bg-white p-8 flex flex-col ${
                  tier.popular
                    ? 'border-2 border-spe-blue shadow-lg shadow-spe-blue/10 ring-1 ring-spe-blue/5'
                    : 'border border-spe-divider/30'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-spe-blue text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-lg font-serif font-bold text-spe-ink mb-2">{tier.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-spe-ink">{tier.price}</span>
                    <span className="text-spe-muted text-sm">/{tier.period}</span>
                  </div>
                  <p className="text-sm text-spe-muted mt-2">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map(feature => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-spe-ink">
                      <svg
                        className="w-4 h-4 text-spe-teal flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/membership/join"
                  className={`block text-center font-semibold px-6 py-3 rounded-lg transition-colors ${
                    tier.popular
                      ? 'bg-spe-blue text-white hover:bg-spe-deep'
                      : 'bg-spe-cream text-spe-ink hover:bg-spe-blue/10'
                  }`}
                >
                  Join as {tier.name.replace(' Membership', '')}
                </Link>
              </div>
            ))}
          </div>

          {/* Fellowship note */}
          <div className="mt-10 max-w-2xl mx-auto text-center">
            <p className="text-sm text-spe-muted">
              <strong className="text-spe-ink">Fellowship</strong> is awarded by the Council to
              members who have made a distinguished contribution to economics or to the Society.
              Fellows use the designation FSPE.
            </p>
          </div>
        </div>
      </div>

      {/* Directory preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-10">
          <p className="section-label">Our Network</p>
          <h2 className="editorial-heading text-2xl sm:text-3xl text-spe-ink">
            Where Our Members Work
          </h2>
          <p className="text-spe-muted mt-3 max-w-xl mx-auto font-light">
            SPE members come from over 300 organisations across the public and private sectors,
            academia, and international institutions.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {directoryOrgs.map(org => (
            <span
              key={org}
              className="inline-block bg-white border border-spe-divider/30 rounded-full px-4 py-2 text-sm text-spe-ink font-medium"
            >
              {org}
            </span>
          ))}
          <Link
            to="/membership/directory"
            className="inline-flex items-center gap-1.5 bg-spe-blue/5 border border-spe-blue/20 rounded-full px-4 py-2 text-sm text-spe-blue font-medium hover:bg-spe-blue/10 transition-colors"
          >
            View all 300+
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Sub-page cards */}
      <div className="border-t border-spe-divider/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <p className="section-label">Quick Links</p>
            <h2 className="editorial-heading text-2xl sm:text-3xl text-spe-ink">
              Membership Resources
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {subPages.map(page => (
              <Link
                key={page.path}
                to={page.path}
                className="group rounded-2xl border border-spe-divider/30 bg-white p-6 hover:shadow-md transition-shadow text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-spe-blue/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-spe-blue/20 transition-colors">
                  {page.icon === 'arrow-right' && (
                    <svg className="w-5 h-5 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                  {page.icon === 'credit-card' && (
                    <svg className="w-5 h-5 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  )}
                  {page.icon === 'document' && (
                    <svg className="w-5 h-5 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  {page.icon === 'globe' && (
                    <svg className="w-5 h-5 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <h3 className="font-serif font-bold text-spe-ink group-hover:text-spe-blue transition-colors mb-1">
                  {page.title}
                </h3>
                <p className="text-sm text-spe-muted">{page.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Payment info + CTA */}
      <div className="bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep text-white relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center relative z-10">
          <h2 className="editorial-heading text-2xl sm:text-3xl mb-4">Ready to Join?</h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8 font-light leading-relaxed">
            Pay by PayPal, Direct Debit, credit or debit card, or cheque. You can also join by
            phone on +44 (0)1264 737552.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/membership/join"
              className="inline-flex items-center gap-2 bg-white text-spe-deep font-semibold px-8 py-3.5 rounded-lg hover:bg-spe-cream transition-colors"
            >
              Apply for Membership
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="/images/1029/digital_-spe_membership_brochure_2026-27.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium transition-colors"
            >
              <svg className="w-5 h-5 flex-shrink-0 text-spe-error-light/70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z" />
                <path d="M12 18l4-4h-3v-4h-2v4H8l4 4z" />
              </svg>
              Download Brochure
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium transition-colors"
            >
              Questions? Contact us
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
