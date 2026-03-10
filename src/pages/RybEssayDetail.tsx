import { useParams, Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import essaysData from '../data/ryb-essays.json'
import MediaEmbed from '../components/MediaEmbed'
import { sanitiseBodyHtml } from '../utils/helpers'
import ContentCard from '../components/ContentCard'
import ShareButtons from '../components/ShareButtons'
import Breadcrumbs from '../components/Breadcrumbs'
import PrevNextNav from '../components/PrevNextNav'
import NotFound from './NotFound'
import type { MediaEmbed as MediaEmbedType } from '../utils/media'
import { getDinnerForEssay, getEventForEssay, getNewsForEssay, eventDetailPath } from '../utils/crossLinks'

export default function RybEssayDetail() {
  const { slug } = useParams()
  const item = essaysData.find(i => i.slug === slug)
  if (!item) return <NotFound />

  useSEO({
    title: item.title,
    description: (item?.body ? item.body.replace(/<[^>]*>/g, '').slice(0, 155) + '...' : ''),
    type: 'article',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: item.title,
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
          { '@type': 'ListItem', position: 3, name: 'Rybczynski Essays', item: 'https://www.spe.org.uk/reading-room/rybczynski-essays' },
          { '@type': 'ListItem', position: 4, name: item.title },
        ],
      },
    ],
  })

  const mediaEmbeds = ((item as any).mediaUrls ?? []) as MediaEmbedType[]

  let bodyHtml = item.body || ''
  bodyHtml = bodyHtml.replace(/<div class=['"]heading['"]>[\s\S]*?<\/div>/gi, '')
  bodyHtml = bodyHtml.replace(/<div class=['"]members-notice['"]>[\s\S]*?<\/div>/gi, '')

  // Related essays: pick 3 others
  const otherEssays = essaysData.filter(e => e.slug !== item.slug)
  const relatedEssays = otherEssays.slice(0, 3)

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
              { label: 'Rybczynski Essays', to: '/reading-room/rybczynski-essays' },
              { label: item.title },
            ]}
          />
          <div className="inline-flex items-center gap-2 mb-3"><span className="w-6 h-[2px] bg-spe-gold rounded-full" /><span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">Rybczynski Prize</span></div>
          <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl mb-4">{item.title}</h1>
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
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-spe-ink prose-a:text-spe-blue prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitiseBodyHtml(bodyHtml) }}
        />

        {/* Cross-links to dinner, event, and news */}
        {(() => {
          const dinner = getDinnerForEssay(item.title)
          const event = getEventForEssay(item.title)
          const newsItems = getNewsForEssay(item.title)
          if (!dinner && !event && newsItems.length === 0) return null
          return (
            <div className="my-10 rounded-xl border border-spe-divider/15 bg-spe-paper/30 p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-spe-copper mb-4">Related content</p>
              <div className="space-y-3">
                {event && (
                  <Link
                    to={eventDetailPath(event.slug)}
                    className="flex items-start gap-3 group"
                  >
                    <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-spe-copper/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-spe-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </span>
                    <div>
                      <span className="text-sm font-medium text-spe-blue group-hover:text-spe-deep transition-colors">Prize announced at the Annual Dinner</span>
                      <span className="block text-xs text-spe-ink/50 mt-0.5">{event.title}</span>
                    </div>
                  </Link>
                )}
                {dinner && (
                  <Link
                    to={`/speakers/dinner-reviews/${dinner.slug}`}
                    className="flex items-start gap-3 group"
                  >
                    <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-spe-burgundy/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-spe-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </span>
                    <div>
                      <span className="text-sm font-medium text-spe-blue group-hover:text-spe-deep transition-colors">Read the dinner review</span>
                      <span className="block text-xs text-spe-ink/50 mt-0.5">{dinner.title}</span>
                    </div>
                  </Link>
                )}
                {newsItems.map(({ news }) => (
                  <Link
                    key={news.slug}
                    to={`/news/${news.slug}`}
                    className="flex items-start gap-3 group"
                  >
                    <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-spe-copper/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-spe-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                    </span>
                    <div>
                      <span className="text-sm font-medium text-spe-blue group-hover:text-spe-deep transition-colors">Prize announcement</span>
                      <span className="block text-xs text-spe-ink/50 mt-0.5">{news.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })()}

        <ShareButtons title={item.title} />

        <PrevNextNav
          items={essaysData}
          currentSlug={item.slug}
          slugToPath={slug => `/reading-room/rybczynski-essays/${slug}`}
        />
      </article>

      {/* Related Essays */}
      {relatedEssays.length > 0 && (
        <section className="bg-spe-paper/50 border-t border-spe-divider/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="section-label">Rybczynski Prize</p>
                <h2 className="editorial-heading text-2xl text-spe-ink">More Prize Essays</h2>
              </div>
              <Link
                to="/reading-room/rybczynski-essays"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors group"
              >
                View all essays
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedEssays.map(e => (
                <ContentCard
                  key={e.slug}
                  to={`/reading-room/rybczynski-essays/${e.slug}`}
                  title={e.title}
                  category="article"
                  excerpt={e.body}
                  image={(e as any).images?.[0]}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
