import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { webPageSchema, breadcrumbSchema } from '../utils/seoSchemas'
import pagesData from '../data/pages.json'
import { sanitiseBodyHtml } from '../utils/helpers'

const subPages = [
  {
    title: 'Jobs Board',
    href: '/careers/jobs',
    description: 'Browse current vacancies and career opportunities in economics.',
    colour: 'emerald',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'SPE Courses',
    href: '/careers/courses',
    description:
      'Online courses developed in collaboration with Economicsense, covering key topics in applied economics.',
    colour: 'blue',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: 'Professional Development',
    href: '/careers/development',
    description:
      'CPD programme, masterclasses, and resources to advance your career in economics.',
    colour: 'violet',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
]

const colourMap: Record<string, { bg: string; text: string; ring: string }> = {
  emerald: { bg: 'bg-spe-cream', text: 'text-spe-gold', ring: 'ring-spe-divider' },
  blue: { bg: 'bg-spe-cream', text: 'text-spe-gold', ring: 'ring-spe-divider' },
  violet: { bg: 'bg-spe-cream', text: 'text-spe-gold', ring: 'ring-spe-divider' },
}

export default function Careers() {
  useSEO({
    title: 'Careers & Professional Development',
    description: 'Economics careers and job opportunities. Find roles in policy, research, finance, and consulting.',
    type: 'website',
    schema: [
      webPageSchema({ name: 'Careers & Professional Development', description: 'Economics careers and job opportunities. Find roles in policy, research, finance, and consulting.', path: '/careers' }),
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Careers' }]),
    ],
  })

  const careersPage = pagesData.find(p => p.slug === 'careers')

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep text-white relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <div className="inline-flex items-center gap-2 mb-3"><span className="w-6 h-[2px] bg-spe-gold rounded-full" /><span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">Grow Your Career</span></div>
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">
            Careers &amp; Professional Development
          </h1>
          <p className="text-lg text-white/70 max-w-2xl font-light">
            Jobs, courses, and CPD resources to support professional economists at every stage of
            their career.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* CMS body intro */}
        {careersPage?.body && (
          <div
            className="prose max-w-none mb-12 text-spe-muted leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitiseBodyHtml(careersPage.body) }}
          />
        )}

        {/* Sub-section cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {subPages.map(page => {
            const c = colourMap[page.colour]
            return (
              <Link
                key={page.href}
                to={page.href}
                className="group rounded-2xl border border-spe-divider/30 bg-white p-7 hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center mb-5`}
                >
                  <span className={c.text}>{page.icon}</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-spe-ink mb-2 group-hover:text-spe-blue transition-colors">
                  {page.title}
                </h3>
                <p className="text-sm text-spe-muted leading-relaxed">{page.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-spe-blue mt-4">
                  Explore
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            )
          })}
        </div>

        {/* Stats */}
        <div className="rounded-2xl bg-gradient-to-br from-spe-cream/50 to-spe-paper/50 border border-spe-divider/20 p-10 mb-16">
          <h2 className="editorial-heading text-2xl text-spe-ink mb-8 text-center">
            Supporting Economists Since 2008
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '15+', label: 'Years of Masterclasses' },
              { value: '20+', label: 'Online Courses' },
              { value: '2018', label: 'CPD Programme Launched' },
              { value: '500+', label: 'Professionals Trained' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-3xl font-serif font-bold text-spe-blue mb-1">{stat.value}</p>
                <p className="text-sm text-spe-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Membership CTA */}
        <div className="text-center bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep rounded-2xl p-10 text-white relative overflow-hidden grain-overlay">
          <h2 className="editorial-heading text-2xl mb-3">Advance Your Career with the SPE</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-6 font-light">
            Members enjoy discounted course fees, exclusive job listings, and access to our full CPD
            programme.
          </p>
          <Link
            to="/membership"
            className="inline-flex items-center gap-2 bg-white text-spe-deep font-semibold px-6 py-3 rounded-lg hover:bg-spe-cream transition-colors"
          >
            Join the SPE
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
