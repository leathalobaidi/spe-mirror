import { useParams, Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import bookReviewsData from '../data/book-reviews.json'
import { formatDate, sanitiseBodyHtml, resolveImageUrl } from '../utils/helpers'
import { getSpeakerByName } from '../utils/speakerDirectory'
import { getEventsForTopics, getPodcastsForTopics, eventDetailPath, podcastLinkSlug } from '../utils/crossLinks'
import BookCover from '../components/BookCover'
import ShareButtons from '../components/ShareButtons'
import Breadcrumbs from '../components/Breadcrumbs'
import PrevNextNav from '../components/PrevNextNav'
import NotFound from './NotFound'

/** Extract person name from "Name, Role, Org" format */
function extractReviewerName(raw: string): string {
  return raw.split(',')[0].trim()
}

export default function BookReviewDetail() {
  const { slug } = useParams()
  const review = bookReviewsData.find(b => b.slug === slug)

  if (!review) return <NotFound />

  const reviewerName = review.reviewer ? extractReviewerName(review.reviewer) : undefined

  useSEO({
    title: review.title,
    description: review.body ? review.body.replace(/<[^>]*>/g, '').slice(0, 155) + '...' : '',
    image: review.coverImage || review.images?.[0] || undefined,
    type: 'article',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'Review',
        name: review.title,
        ...(review.author && { itemReviewed: { '@type': 'Book', name: review.title, author: { '@type': 'Person', name: review.author } } }),
        ...(reviewerName && { author: { '@type': 'Person', name: reviewerName } }),
        ...(review.date && { datePublished: review.date }),
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
          { '@type': 'ListItem', position: 3, name: 'Book Reviews', item: 'https://www.spe.org.uk/reading-room/book-reviews' },
          { '@type': 'ListItem', position: 4, name: review.title },
        ],
      },
    ],
  })

  // Cross-link reviewer to speaker profile if they're in the directory
  const reviewerSpeaker = reviewerName ? getSpeakerByName(reviewerName) : undefined

  // Related reviews: prefer same reviewer, then fall back to others with covers
  const sameReviewer = review.reviewer
    ? bookReviewsData.filter(b => b.slug !== review.slug && b.reviewer === review.reviewer && b.coverImage)
    : []
  const otherReviews = bookReviewsData.filter(b => b.slug !== review.slug && b.coverImage && (!review.reviewer || b.reviewer !== review.reviewer))
  const relatedReviews = [...sameReviewer, ...otherReviews].slice(0, 3)

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
              { label: 'Reading Room', to: '/reading-room' },
              { label: 'Book Reviews', to: '/reading-room/book-reviews' },
              { label: review.title },
            ]}
          />
          <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl mb-4">{review.title}</h1>
          {review.author && (
            <p className="text-lg text-white/80 font-light">by {review.author}</p>
          )}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-white/70">
            {review.reviewer && (
              <span>
                <span className="font-medium text-white/90">Reviewed by </span>
                {reviewerSpeaker ? (
                  <Link to={`/speakers/directory/${reviewerSpeaker.slug}`} className="text-spe-gold hover:text-white transition-colors underline decoration-spe-gold/30 hover:decoration-white/60">
                    {review.reviewer}
                  </Link>
                ) : (
                  review.reviewer
                )}
              </span>
            )}
            {review.date && (
              <span>{formatDate(review.date)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Body content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="md:flex gap-10">
          {/* Book cover */}
          {review.coverImage && (
            <div className="flex-shrink-0 mb-8 md:mb-0">
              <div className="book-cover rounded-lg overflow-hidden w-48 mx-auto md:mx-0 aspect-[2/3] bg-spe-paper shadow-lg">
                <img
                  src={resolveImageUrl(review.coverImage)}
                  alt={review.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Review text */}
          <div className="flex-1 min-w-0">
            <div
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-spe-ink prose-a:text-spe-blue prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitiseBodyHtml(review.body) }}
            />
          </div>
        </div>

        {/* Topic cross-links: related events & podcasts */}
        {review.topics && review.topics.length > 0 && (() => {
          const relatedEvents = getEventsForTopics(review.topics)
          const relatedPodcasts = getPodcastsForTopics(review.topics)
          if (relatedEvents.length === 0 && relatedPodcasts.length === 0) return null
          return (
            <div className="my-10 rounded-xl border border-spe-divider/15 bg-spe-paper/30 p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-spe-copper mb-4">Related events & talks</p>
              <div className="space-y-3">
                {relatedEvents.map(event => (
                  <Link
                    key={event.slug}
                    to={eventDetailPath(event.slug)}
                    className="flex items-start gap-3 group"
                  >
                    <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-spe-copper/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-spe-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </span>
                    <div>
                      <span className="text-sm font-medium text-spe-blue group-hover:text-spe-deep transition-colors">{event.title}</span>
                      {event.date && <span className="block text-xs text-spe-ink/50 mt-0.5">{formatDate(event.date)}</span>}
                    </div>
                  </Link>
                ))}
                {relatedPodcasts.map(podcast => (
                  <Link
                    key={podcast.slug}
                    to={`/podcasts/${podcastLinkSlug(podcast.slug)}`}
                    className="flex items-start gap-3 group"
                  >
                    <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-spe-blue/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 12h.01M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728M8.464 15.536a5 5 0 010-7.072" /></svg>
                    </span>
                    <div>
                      <span className="text-sm font-medium text-spe-blue group-hover:text-spe-deep transition-colors">{podcast.title}</span>
                      {podcast.date && <span className="block text-xs text-spe-ink/50 mt-0.5">{formatDate(podcast.date)}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })()}

        {/* Share */}
        <ShareButtons title={review.title} />

        <PrevNextNav
          items={bookReviewsData}
          currentSlug={review.slug}
          slugToPath={slug => `/reading-room/book-reviews/${slug}`}
        />
      </article>

      {/* More Reviews */}
      {relatedReviews.length > 0 && (
        <section className="bg-spe-paper/50 border-t border-spe-divider/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="section-label">Reading Room</p>
                <h2 className="editorial-heading text-2xl text-spe-ink">
                  {sameReviewer.length > 0 ? `More by ${review.reviewer}` : 'More Reviews'}
                </h2>
              </div>
              <Link
                to="/reading-room/book-reviews"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors group"
              >
                View all reviews
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {relatedReviews.map(b => (
                <BookCover
                  key={b.slug}
                  to={`/reading-room/book-reviews/${b.slug}`}
                  title={b.title}
                  coverImage={b.coverImage}
                  author={b.author}
                  reviewer={b.reviewer}
                  date={b.date}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
