import { useParams, Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import podcastsData from '../data/podcasts.json'
import { formatDate, sanitiseBodyHtml, resolveImageUrl } from '../utils/helpers'
import MediaEmbed from '../components/MediaEmbed'
import ContentCard from '../components/ContentCard'
import ShareButtons from '../components/ShareButtons'
import Breadcrumbs from '../components/Breadcrumbs'
import PdfDownloads from '../components/PdfDownloads'
import PrevNextNav from '../components/PrevNextNav'
import NotFound from './NotFound'
import { getDinnerReviewForPodcast, getEventForPodcast, getEssaysForPodcast, getNewsForPodcast, eventDetailPath } from '../utils/crossLinks'

export default function PodcastDetail() {
  const { slug } = useParams()
  const podcast = podcastsData.find(p => p.slug.endsWith(`/${slug}`))

  if (!podcast) return <NotFound />

  useSEO({
    title: podcast.title,
    description: podcast.body ? podcast.body.replace(/<[^>]*>/g, '').slice(0, 155) + '...' : '',
    type: 'article',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'PodcastEpisode',
        name: podcast.title,
        ...(podcast.date && { datePublished: podcast.date }),
        ...(podcast.speakers && podcast.speakers.length > 0 && {
          actor: podcast.speakers.map((s: string) => ({ '@type': 'Person', name: s })),
        }),
        partOfSeries: {
          '@type': 'PodcastSeries',
          name: 'SPE Podcasts & Talks',
          url: 'https://www.spe.org.uk/podcasts',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.spe.org.uk/' },
          { '@type': 'ListItem', position: 2, name: 'Podcasts', item: 'https://www.spe.org.uk/podcasts' },
          { '@type': 'ListItem', position: 3, name: podcast.title },
        ],
      },
    ],
  })

  // Media embeds (data already cleaned — one primary embed per item)
  const mediaEmbeds = (podcast.mediaUrls || [])
    .map(m => ({ type: m.type as 'vimeo' | 'youtube' | 'soundcloud', id: m.id, url: m.url }))
    .filter(m => m.type && (m.id || m.url))

  const categoryLabel = podcast.category
    ?.replace(/-/g, ' ')
    .replace(/\b\w/g, (l: string) => l.toUpperCase())

  // Find related podcasts: same category first, otherwise latest 3
  const otherPodcasts = podcastsData.filter(p => p.slug !== podcast.slug)
  const sameCategoryPodcasts = podcast.category
    ? otherPodcasts.filter(p => p.category === podcast.category)
    : []
  const relatedPodcasts = (sameCategoryPodcasts.length >= 3 ? sameCategoryPodcasts : otherPodcasts).slice(0, 3)

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep text-white relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <Breadcrumbs
            variant="light"
            className="mb-6"
            items={[
              { label: 'Home', to: '/' },
              { label: 'Podcasts', to: '/podcasts' },
              { label: podcast.title },
            ]}
          />
          {categoryLabel && (
            <div className="inline-flex items-center gap-2 mb-3"><span className="w-6 h-[2px] bg-spe-gold rounded-full" /><span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">{categoryLabel}</span></div>
          )}
          <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl mb-4">{podcast.title}</h1>
          {podcast.date && (
            <p className="text-sm text-white/70 mt-4">{formatDate(podcast.date)}</p>
          )}
          {podcast.speakers && podcast.speakers.length > 0 && (
            <div className="mt-3 text-sm text-white/70">
              <span className="font-medium text-white/90">With: </span>
              {podcast.speakers.join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Media embeds */}
      {mediaEmbeds.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="space-y-6">
            {mediaEmbeds.map((media, i) => (
              <MediaEmbed key={`${media.type}-${media.id || i}`} media={media} />
            ))}
          </div>
        </div>
      )}

      {/* Body content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {podcast.images && podcast.images.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-4">
            {podcast.images.map((img, i) => (
              <img
                key={i}
                src={resolveImageUrl(img)}
                alt=""
                className="rounded-lg max-h-64 object-cover"
                loading="lazy"
              />
            ))}
          </div>
        )}
        <div
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-spe-ink prose-a:text-spe-blue prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitiseBodyHtml(podcast.body) }}
        />

        <PdfDownloads pdfs={podcast.pdfLinks} />

        {/* Cross-links for dinner podcasts */}
        {podcast.date && (() => {
          const review = getDinnerReviewForPodcast(podcast.category, podcast.date)
          const event = getEventForPodcast(podcast.category, podcast.date)
          const essays = getEssaysForPodcast(podcast.category, podcast.date)
          const newsItems = getNewsForPodcast(podcast.category, podcast.date)
          if (!review && !event && essays.length === 0 && newsItems.length === 0) return null
          return (
            <div className="my-10 rounded-xl border border-spe-divider/15 bg-spe-paper/30 p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-spe-copper mb-4">Related content</p>
              <div className="space-y-3">
                {review && (
                  <Link
                    to={`/speakers/dinner-reviews/${review.slug}`}
                    className="flex items-start gap-3 group"
                  >
                    <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-spe-burgundy/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-spe-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </span>
                    <div>
                      <span className="text-sm font-medium text-spe-blue group-hover:text-spe-deep transition-colors">Read the dinner review</span>
                      <span className="block text-xs text-spe-ink/50 mt-0.5">{review.title}</span>
                    </div>
                  </Link>
                )}
                {event && (
                  <Link
                    to={eventDetailPath(event.slug)}
                    className="flex items-start gap-3 group"
                  >
                    <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-spe-copper/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-spe-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </span>
                    <div>
                      <span className="text-sm font-medium text-spe-blue group-hover:text-spe-deep transition-colors">View the event listing</span>
                      <span className="block text-xs text-spe-ink/50 mt-0.5">{event.title}</span>
                    </div>
                  </Link>
                )}
                {essays.map(essay => (
                  <Link
                    key={essay.slug}
                    to={`/reading-room/rybczynski-essays/${essay.slug}`}
                    className="flex items-start gap-3 group"
                  >
                    <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-spe-gold/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-spe-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </span>
                    <div>
                      <span className="text-sm font-medium text-spe-blue group-hover:text-spe-deep transition-colors">Rybczynski Prize Essay</span>
                      <span className="block text-xs text-spe-ink/50 mt-0.5">{essay.title}</span>
                    </div>
                  </Link>
                ))}
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
                      <span className="text-sm font-medium text-spe-blue group-hover:text-spe-deep transition-colors">News coverage</span>
                      <span className="block text-xs text-spe-ink/50 mt-0.5">{news.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })()}

        {/* Share */}
        <ShareButtons title={podcast.title} />

        <PrevNextNav
          items={podcastsData}
          currentSlug={podcast.slug}
          slugToPath={slug => `/${slug}`}
        />
      </article>

      {/* Related Podcasts */}
      {relatedPodcasts.length > 0 && (
        <section className="bg-spe-paper/50 border-t border-spe-divider/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="section-label">Keep Listening</p>
                <h2 className="editorial-heading text-2xl text-spe-ink">More Podcasts & Talks</h2>
              </div>
              <Link
                to="/podcasts"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors group"
              >
                View all podcasts
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPodcasts.map(p => (
                <ContentCard
                  key={p.slug}
                  to={`/${p.slug}`}
                  title={p.title}
                  date={p.date}
                  category={p.category}
                  excerpt={p.body}
                  image={p.images?.[0]}
                  speaker={p.speakers?.[0]}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
