import { useParams, Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import eveningTalksData from '../data/evening-talks.json'
import MediaEmbed from '../components/MediaEmbed'
import ContentCard from '../components/ContentCard'
import ShareButtons from '../components/ShareButtons'
import Breadcrumbs from '../components/Breadcrumbs'
import { formatDate, sanitiseBodyHtml } from '../utils/helpers'
import PdfDownloads from '../components/PdfDownloads'
import NotFound from './NotFound'
import type { MediaEmbed as MediaEmbedType } from '../utils/media'

export default function EveningTalkDetail() {
  const { slug } = useParams()
  const item = eveningTalksData.find(i => i.slug === slug)

  if (!item) return <NotFound />

  useSEO({
    title: item.title,
    description: item.body ? item.body.replace(/<[^>]*>/g, '').slice(0, 155) + '...' : '',
    type: 'article',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: item.title,
        ...(item.date && { startDate: item.date }),
        organizer: {
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
          { '@type': 'ListItem', position: 2, name: 'Speakers', item: 'https://www.spe.org.uk/speakers' },
          { '@type': 'ListItem', position: 3, name: 'Evening Talks', item: 'https://www.spe.org.uk/speakers/evening-talks' },
          { '@type': 'ListItem', position: 4, name: item.title },
        ],
      },
    ],
  })

  const mediaEmbeds = (item.mediaUrls ?? []) as MediaEmbedType[]

  // Strip CMS heading div that duplicates the title
  let bodyHtml = item.body || ''
  bodyHtml = bodyHtml.replace(/<div class=['"]heading['"]>[\s\S]*?<\/div>/gi, '')
  bodyHtml = bodyHtml.replace(/<div class=['"]members-notice['"]>[\s\S]*?<\/div>/gi, '')
  // Remove CMS login/register anchors and surrounding boilerplate
  bodyHtml = bodyHtml.replace(/<a[^>]*class=['"][^'"]*login[^'"]*['"][^>]*>[\s\S]*?<\/a>/gi, '')
  bodyHtml = bodyHtml.replace(/This content can be accessed by members[\s\S]*?(?=<(?:div|section|article)|$)/gi, '')

  // Find related talks: same year first, otherwise latest 3
  const talkYear = item.date ? new Date(item.date).getFullYear() : null
  const otherTalks = eveningTalksData.filter(t => t.slug !== item.slug)
  const sameYearTalks = talkYear
    ? otherTalks.filter(t => t.date && new Date(t.date).getFullYear() === talkYear)
    : []
  const relatedTalks = (sameYearTalks.length >= 3 ? sameYearTalks : otherTalks).slice(0, 3)

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-spe-deep2 via-spe-deep to-spe-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <Breadcrumbs
            variant="light"
            className="mb-6"
            items={[
              { label: 'Home', to: '/' },
              { label: 'Speakers', to: '/speakers' },
              { label: 'Evening Talks', to: '/speakers/evening-talks' },
              { label: item.title },
            ]}
          />
          <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl mb-4">{item.title}</h1>
          {item.date && (
            <p className="text-sm text-white/70">{formatDate(item.date)}</p>
          )}
        </div>
      </div>

      {/* Body content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {mediaEmbeds.length > 0 && (
          <div className="mb-10 space-y-6">
            {mediaEmbeds.map(media => (
              <div key={media.id || media.url} className="max-w-3xl">
                <MediaEmbed media={media} />
              </div>
            ))}
          </div>
        )}
        <div
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-spe-dark prose-a:text-spe-blue prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitiseBodyHtml(bodyHtml) }}
        />

        <PdfDownloads pdfs={item.pdfLinks} />

        {/* Share */}
        <ShareButtons title={item.title} />
      </article>

      {/* Related Talks */}
      {relatedTalks.length > 0 && (
        <section className="bg-spe-bg/50 border-t border-spe-border/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="editorial-subheading text-spe-blue mb-2">From the Archive</p>
                <h2 className="editorial-heading text-2xl text-spe-dark">More Evening Talks</h2>
              </div>
              <Link
                to="/speakers/evening-talks"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors group"
              >
                View all talks
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedTalks.map(t => (
                <ContentCard
                  key={t.slug}
                  to={`/speakers/evening-talks/${t.slug}`}
                  title={t.title}
                  date={t.date}
                  category="speaker-series"
                  excerpt={t.body}
                  image={t.images?.[0]}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
