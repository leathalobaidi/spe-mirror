import { useParams, Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import councillorsData from '../data/councillors.json'
import presidentsData from '../data/presidents.json'
import { sanitiseBodyHtml } from '../utils/helpers'
import NotFound from './NotFound'

export default function CouncilMemberDetail() {
  const { slug } = useParams()
  const allMembers = [...presidentsData, ...councillorsData]
  const person = allMembers.find(p => p.slug === slug)

  if (!person) return <NotFound />

  useSEO({
    title: person.name,
    description: person.body ? person.body.replace(/<[^>]*>/g, '').slice(0, 155) + '...' : '',
    image: person.images?.[0] || undefined,
    type: 'profile',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: person.name,
      ...(person.role && { jobTitle: person.role }),
      memberOf: {
        '@type': 'Organization',
        name: 'Society of Professional Economists',
        url: 'https://www.spe.org.uk',
      },
    },
  })

  let bodyHtml = person.body || ''
  bodyHtml = bodyHtml.replace(/<div class=['"]heading['"]>[\s\S]*?<\/div>/gi, '')

  return (
    <div>
      <div className="bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep text-white relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <Link to="/about/council" className="inline-flex items-center gap-1.5 text-white hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Council Members
          </Link>
          <div className="inline-flex items-center gap-2 mb-3"><span className="w-6 h-[2px] bg-spe-gold rounded-full" /><span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">{person.role}</span></div>
          <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl">{person.name}</h1>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-spe-ink prose-a:text-spe-blue prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitiseBodyHtml(bodyHtml) }}
        />
      </article>
    </div>
  )
}
