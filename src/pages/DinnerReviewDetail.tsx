import { useParams, Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import dinnerReviewsData from '../data/dinner-reviews.json'
import MediaEmbed from '../components/MediaEmbed'
import { sanitiseBodyHtml } from '../utils/helpers'
import ContentCard from '../components/ContentCard'
import ShareButtons from '../components/ShareButtons'
import Breadcrumbs from '../components/Breadcrumbs'
import PdfDownloads from '../components/PdfDownloads'
import PrevNextNav from '../components/PrevNextNav'
import NotFound from './NotFound'
import type { MediaEmbed as MediaEmbedType } from '../utils/media'
import { getPodcastForDinner, getEssaysForDinner, getEventForDinnerReview, getNewsForDinnerReview, podcastLinkSlug, eventDetailPath } from '../utils/crossLinks'
import { getYear } from '../utils/helpers'

export default function DinnerReviewDetail() {
  const { slug } = useParams()
  const item = dinnerReviewsData.find(i => i.slug === slug)

  if (!item) return <NotFound />

  useSEO({
    title: item.title,
    description: (item?.body ? item.body.replace(/<[^>]*>/g, '').slice(0, 155) + '...' : ''),
    image: item.images?.[0] || undefined,
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
          { '@type': 'ListItem', position: 2, name: 'Speakers', item: 'https://www.spe.org.uk/speakers' },
          { '@type': 'ListItem', position: 3, name: 'Dinner Reviews', item: 'https://www.spe.org.uk/speakers/dinner-reviews' },
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

  // Related reviews: pick 3 others
  const otherReviews = dinnerReviewsData.filter(r => r.slug !== item.slug)
  const relatedReviews = otherReviews.slice(0, 3)

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
              { label: 'Speakers', to: '/speakers' },
              { label: 'Dinner Reviews', to: '/speakers/dinner-reviews' },
              { label: item.title },
            ]}
          />
          <div className="inline-flex items-center gap-2 mb-3"><span className="w-6 h-[2px] bg-spe-gold rounded-full" /><span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">Dinner Review</span></div>
          <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl mb-4">{item.title}</h1>
          {item.date && (
            <Link
              to={`/events/annual-dinner/${getYear(item.date)}`}
              className="inline-flex items-center gap-2 mt-1 px-3 py-1.5 rounded-full bg-spe-gold/15 text-spe-gold text-xs font-medium hover:bg-spe-gold/25 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              View all {getYear(item.date)} dinner content →
            </Link>
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
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-spe-ink prose-a:text-spe-blue prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitiseBodyHtml(bodyHtml) }}
        />

        <PdfDownloads pdfs={item.pdfLinks} />

        {/* Cross-links to related content */}
        {item.date && (() => {
          const podcast = getPodcastForDinner(item.date)
          const essays = getEssaysForDinner(item.date)
          const event = getEventForDinnerReview(item.date)
          const newsItems = getNewsForDinnerReview(item.date)
          if (!podcast && essays.length === 0 && !event && newsItems.length === 0) return null
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
                      <span className="text-sm font-medium text-spe-blue group-hover:text-spe-deep transition-colors">View the event listing</span>
                      <span className="block text-xs text-spe-ink/50 mt-0.5">{event.title}</span>
                    </div>
                  </Link>
                )}
                {podcast && (
                  <Link
                    to={`/podcasts/${podcastLinkSlug(podcast.slug)}`}
                    className="flex items-start gap-3 group"
                  >
                    <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-spe-blue/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 12h.01M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728M8.464 15.536a5 5 0 010-7.072" /></svg>
                    </span>
                    <div>
                      <span className="text-sm font-medium text-spe-blue group-hover:text-spe-deep transition-colors">Listen to the speech recording</span>
                      <span className="block text-xs text-spe-ink/50 mt-0.5">{podcast.title}</span>
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

        <ShareButtons title={item.title} />

        <PrevNextNav
          items={dinnerReviewsData}
          currentSlug={item.slug}
          slugToPath={slug => `/speakers/dinner-reviews/${slug}`}
        />
      </article>

      {/* Related Reviews */}
      {relatedReviews.length > 0 && (
        <section className="bg-spe-paper/50 border-t border-spe-divider/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="section-label">Speakers</p>
                <h2 className="editorial-heading text-2xl text-spe-ink">More Dinner Reviews</h2>
              </div>
              <Link
                to="/speakers/dinner-reviews"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors group"
              >
                View all reviews
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedReviews.map(r => (
                <ContentCard
                  key={r.slug}
                  to={`/speakers/dinner-reviews/${r.slug}`}
                  title={r.title}
                  category="dinner-review"
                  excerpt={r.body}
                  image={r.images?.[0]}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
