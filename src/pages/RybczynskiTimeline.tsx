import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import essaysData from '../data/ryb-essays.json'
import Breadcrumbs from '../components/Breadcrumbs'
import { getEventForEssay, getDinnerForEssay, getNewsForEssay, eventDetailPath } from '../utils/crossLinks'

/** Extract subtitle from body HTML: <h2 class='page-subhead'>...</h2> */
function extractSubtitle(body: string): string | null {
  const m = body.match(/<h2[^>]*class=['"]page-subhead['"][^>]*>([\s\S]*?)<\/h2>/i)
  if (!m) return null
  return m[1].replace(/<[^>]*>/g, '').replace(/&#\d+;/g, c => {
    const code = parseInt(c.replace(/&#|;/g, ''))
    return String.fromCharCode(code)
  }).trim() || null
}

/** Extract author names from body HTML: names inside <h4> with <a> or <strong> */
function extractAuthors(body: string): string[] {
  const h4Match = body.match(/<h4[^>]*>([\s\S]*?)<\/h4\s*>/i)
  if (!h4Match) return []
  const html = h4Match[1]
  const names: string[] = []
  // Match names in <a> tags (most common pattern)
  for (const m of html.matchAll(/<a[^>]*>([^<]+)<\/a>/g)) {
    const name = m[1].replace(/^Dr\s+/, '').trim()
    if (name && !name.includes('Author')) names.push(name)
  }
  // If no <a> tags, try <strong> tags that contain names (not "Author:")
  if (names.length === 0) {
    for (const m of html.matchAll(/<strong>([^<]+)<\/strong>/g)) {
      const text = m[1].trim()
      if (text && !text.includes('Author') && !text.includes(':')) names.push(text)
    }
  }
  return names
}

/** Extract prize year string from title: "YYYY/YY" */
function extractPrizeYear(title: string): string | null {
  const m = title.match(/(\d{4}\/\d{2})/)
  return m ? m[1] : null
}

/** Convert "2021/22" → 2022 (the dinner year) */
function dinnerYearFromTitle(title: string): number | null {
  const m = title.match(/(\d{4})\/(\d{2})/)
  if (!m) return null
  return parseInt(m[1].slice(0, 2) + m[2])
}

export default function RybczynskiTimeline() {
  useSEO({
    title: 'Rybczynski Prize — Winners & Essays',
    description: 'The Rybczynski Prize for the best essay by an economist under 30, awarded annually by the Society of Professional Economists since 2004.',
    type: 'website',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Rybczynski Prize — Winners & Essays',
        description: 'Annual essay prize for economists under 30.',
        publisher: {
          '@type': 'Organization',
          name: 'Society of Professional Economists',
          url: 'https://www.spe.org.uk',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.spe.org.uk/' },
          { '@type': 'ListItem', position: 2, name: 'Reading Room', item: 'https://www.spe.org.uk/reading-room' },
          { '@type': 'ListItem', position: 3, name: 'Rybczynski Prize' },
        ],
      },
    ],
  })

  // Group essays by prize year (handles joint winners)
  const yearGroups = new Map<string, typeof essaysData>()
  for (const essay of essaysData) {
    const yr = extractPrizeYear(essay.title)
    if (!yr) continue
    const existing = yearGroups.get(yr) ?? []
    existing.push(essay)
    yearGroups.set(yr, existing)
  }
  const sortedYears = Array.from(yearGroups.entries()).sort((a, b) => b[0].localeCompare(a[0]))

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-spe-deep2 to-spe-deep text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <Breadcrumbs
            variant="light"
            className="mb-6"
            items={[
              { label: 'Home', to: '/' },
              { label: 'Reading Room', to: '/reading-room' },
              { label: 'Rybczynski Prize' },
            ]}
          />
          <div className="inline-flex items-center gap-2 mb-3"><span className="w-6 h-[2px] bg-spe-gold rounded-full" /><span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">Rybczynski Prize</span></div>
          <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl mb-4">Prize Winners & Essays</h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            The annual essay prize for economists under 30, announced each year at the SPE Annual Dinner.
          </p>
          <Link
            to="/reading-room/rybczynski-essays"
            className="inline-flex items-center gap-1.5 mt-6 text-sm font-medium text-spe-gold hover:text-white transition-colors group"
          >
            Browse all essays
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Timeline */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-spe-divider/20" />

          <div className="space-y-12">
            {sortedYears.map(([yearLabel, essays]) => {
              const firstEssay = essays[0]
              const dYear = dinnerYearFromTitle(firstEssay.title)
              const event = getEventForEssay(firstEssay.title)
              const dinner = getDinnerForEssay(firstEssay.title)
              const newsItems = getNewsForEssay(firstEssay.title)

              return (
                <div key={yearLabel} className="relative pl-12 sm:pl-16">
                  {/* Year dot */}
                  <div className="absolute left-2.5 sm:left-4.5 top-1 w-3 h-3 rounded-full bg-spe-gold ring-4 ring-white" />

                  {/* Year label */}
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-spe-copper mb-3">{yearLabel}</p>

                  {/* Essay cards */}
                  <div className="space-y-4">
                    {essays.map(essay => {
                      const subtitle = extractSubtitle(essay.body || '')
                      const authors = extractAuthors(essay.body || '')
                      return (
                        <Link
                          key={essay.slug}
                          to={`/reading-room/rybczynski-essays/${essay.slug}`}
                          className="block rounded-xl border border-spe-divider/15 bg-white p-5 hover:border-spe-blue/30 hover:shadow-sm transition-all group"
                        >
                          {subtitle && (
                            <h3 className="font-serif text-lg text-spe-ink group-hover:text-spe-blue transition-colors leading-snug">
                              {subtitle}
                            </h3>
                          )}
                          {!subtitle && (
                            <h3 className="font-serif text-lg text-spe-ink group-hover:text-spe-blue transition-colors leading-snug">
                              {essay.title}
                            </h3>
                          )}
                          {authors.length > 0 && (
                            <p className="text-sm text-spe-ink/60 mt-1.5">{authors.join(' & ')}</p>
                          )}
                          {essays.length > 1 && (
                            <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wider text-spe-gold bg-spe-gold/10 px-2 py-0.5 rounded-full">Joint Winner</span>
                          )}
                        </Link>
                      )
                    })}
                  </div>

                  {/* Cross-link pills */}
                  {(event || dinner || newsItems.length > 0) && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {event && (
                        <Link
                          to={eventDetailPath(event.slug)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-spe-copper hover:text-spe-deep bg-spe-copper/5 hover:bg-spe-copper/10 px-3 py-1.5 rounded-full transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          Annual Dinner {dYear}
                        </Link>
                      )}
                      {dinner && (
                        <Link
                          to={`/speakers/dinner-reviews/${dinner.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-spe-burgundy hover:text-spe-deep bg-spe-burgundy/5 hover:bg-spe-burgundy/10 px-3 py-1.5 rounded-full transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          Dinner Review
                        </Link>
                      )}
                      {newsItems.map(({ news }) => (
                        <Link
                          key={news.slug}
                          to={`/news/${news.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-spe-blue hover:text-spe-deep bg-spe-blue/5 hover:bg-spe-blue/10 px-3 py-1.5 rounded-full transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                          News
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
