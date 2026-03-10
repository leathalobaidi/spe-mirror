import { useParams, Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { getSpeakerBySlug } from '../utils/speakerDirectory'
import { formatDate } from '../utils/helpers'
import Breadcrumbs from '../components/Breadcrumbs'
import ShareButtons from '../components/ShareButtons'
import NotFound from './NotFound'

const TYPE_LABELS: Record<string, string> = {
  event: 'Events',
  podcast: 'Podcasts & Talks',
  'book-review': 'Book Reviews',
  blog: 'Blog Posts',
  'ryb-essay': 'Rybczynski Prize',
}

const ROLE_COLORS: Record<string, string> = {
  Speaker: 'bg-spe-blue/10 text-spe-blue',
  Chair: 'bg-spe-copper/10 text-spe-copper',
  Guest: 'bg-spe-blue/10 text-spe-blue',
  Reviewer: 'bg-spe-burgundy/10 text-spe-burgundy',
  Author: 'bg-spe-deep/10 text-spe-deep',
  'Prize Winner': 'bg-spe-gold/15 text-spe-gold',
}

const TYPE_ICONS: Record<string, string> = {
  event: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  podcast: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
  'book-review': 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  blog: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  'ryb-essay': 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
}

export default function SpeakerProfile() {
  const { slug } = useParams()
  const speaker = getSpeakerBySlug(slug || '')

  if (!speaker) return <NotFound />

  useSEO({
    title: `${speaker.name} — SPE Speaker & Contributor`,
    description: `${speaker.name} has ${speaker.appearances.length} appearances across SPE events, publications, and podcasts.`,
    type: 'profile',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: speaker.name,
        url: `https://www.spe.org.uk/speakers/directory/${speaker.slug}`,
        affiliation: {
          '@type': 'Organization',
          name: 'Society of Professional Economists',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.spe.org.uk/' },
          { '@type': 'ListItem', position: 2, name: 'Speakers', item: 'https://www.spe.org.uk/speakers' },
          { '@type': 'ListItem', position: 3, name: 'Directory', item: 'https://www.spe.org.uk/speakers/directory' },
          { '@type': 'ListItem', position: 4, name: speaker.name },
        ],
      },
    ],
  })

  // Group appearances by content type
  const grouped = new Map<string, typeof speaker.appearances>()
  for (const a of speaker.appearances) {
    const existing = grouped.get(a.contentType) ?? []
    existing.push(a)
    grouped.set(a.contentType, existing)
  }

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
              { label: 'Speakers', to: '/speakers' },
              { label: 'Directory', to: '/speakers/directory' },
              { label: speaker.name },
            ]}
          />
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[2px] bg-spe-gold rounded-full" />
            <span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">Contributor</span>
          </div>
          <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl mb-4">{speaker.name}</h1>
          <div className="flex flex-wrap gap-2 mt-4">
            {speaker.roles.map(role => (
              <span key={role} className="text-xs font-semibold uppercase tracking-wider text-white/90 bg-white/15 px-3 py-1 rounded-full">
                {role}
              </span>
            ))}
          </div>
          <p className="text-white/60 text-sm mt-4">
            {speaker.appearances.length} appearance{speaker.appearances.length !== 1 ? 's' : ''} across{' '}
            {speaker.contentTypes.length} content type{speaker.contentTypes.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Appearances grouped by type */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">
          {Array.from(grouped.entries()).map(([type, appearances]) => (
            <section key={type}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-spe-cream flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-spe-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={TYPE_ICONS[type] || TYPE_ICONS.event} />
                  </svg>
                </div>
                <h2 className="font-serif font-bold text-lg text-spe-ink">{TYPE_LABELS[type] || type}</h2>
                <span className="text-xs text-spe-grey ml-auto">{appearances.length}</span>
              </div>
              <div className="space-y-1 ml-12">
                {appearances.map((a, i) => (
                  <Link
                    key={`${a.path}-${i}`}
                    to={a.path}
                    className="flex items-start justify-between gap-4 py-3 px-4 rounded-lg hover:bg-spe-cream/50 transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-spe-ink group-hover:text-spe-blue transition-colors leading-snug">
                        {a.title}
                      </p>
                      <span className={`inline-block mt-1.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${ROLE_COLORS[a.role] || 'bg-spe-cream text-spe-muted'}`}>
                        {a.role}
                      </span>
                    </div>
                    {a.date && (
                      <span className="text-xs text-spe-grey whitespace-nowrap flex-shrink-0 pt-0.5">
                        {formatDate(a.date)}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <ShareButtons title={`${speaker.name} — SPE Directory`} />

        {/* Back link */}
        <div className="mt-10 pt-8 border-t border-spe-divider/20">
          <Link
            to="/speakers/directory"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Directory
          </Link>
        </div>
      </div>
    </div>
  )
}
