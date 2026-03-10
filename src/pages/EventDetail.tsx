import { useParams, Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import eventsData from '../data/events.json'
import { formatDate, sanitiseBodyHtml, resolveImageUrl } from '../utils/helpers'
import ContentCard from '../components/ContentCard'
import ShareButtons from '../components/ShareButtons'
import Breadcrumbs from '../components/Breadcrumbs'
import MediaEmbed from '../components/MediaEmbed'
import type { MediaEmbed as MediaEmbedType } from '../utils/media'
import PdfDownloads from '../components/PdfDownloads'
import NotFound from './NotFound'
import PrevNextNav from '../components/PrevNextNav'
import BookCover from '../components/BookCover'
import { getDinnerReviewForEvent, getPodcastForEvent, getNewsForEvent, getEssaysForEvent, getBookReviewsForTopics, podcastLinkSlug, eventDetailPath } from '../utils/crossLinks'
import { getSpeakerByName } from '../utils/speakerDirectory'
import { getYear } from '../utils/helpers'

export default function EventDetail() {
  const { slug } = useParams()
  const event = eventsData.find(e => e.slug.endsWith(`/${slug}`))

  if (!event) return <NotFound />

  const mediaEmbeds = (event.mediaUrls ?? []) as MediaEmbedType[]

  useSEO({
    title: event.title,
    description: event.body ? event.body.replace(/<[^>]*>/g, '').slice(0, 155) + '...' : '',
    type: 'event',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: event.title,
        ...(event.date && { startDate: event.date }),
        ...(event.venue && { location: { '@type': 'Place', name: event.venue } }),
        ...(event.speakers && event.speakers.length > 0 && {
          performer: event.speakers.map((s: string) => ({ '@type': 'Person', name: s })),
        }),
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
          { '@type': 'ListItem', position: 2, name: 'Events', item: 'https://www.spe.org.uk/events' },
          { '@type': 'ListItem', position: 3, name: event.title },
        ],
      },
    ],
  })

  // Find related events: same year first, otherwise latest 3
  const eventYear = event.date ? new Date(event.date).getFullYear() : null
  const otherEvents = eventsData.filter(e => e.slug !== event.slug)
  const sameYearEvents = eventYear
    ? otherEvents.filter(e => e.date && new Date(e.date).getFullYear() === eventYear)
    : []
  const relatedEvents = (sameYearEvents.length >= 3 ? sameYearEvents : otherEvents).slice(0, 3)

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
              { label: 'Events', to: '/events' },
              { label: event.title },
            ]}
          />
          <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl mb-4">{event.title}</h1>

          {/* Hub link for dinner events */}
          {event.title.toLowerCase().includes('annual dinner') && event.date && (
            <Link
              to={`/events/annual-dinner/${getYear(event.date)}`}
              className="inline-flex items-center gap-2 mt-2 mb-2 px-3 py-1.5 rounded-full bg-spe-gold/15 text-spe-gold text-xs font-medium hover:bg-spe-gold/25 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              View all {getYear(event.date)} dinner content →
            </Link>
          )}

          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm text-white/80">
            {event.date && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(event.date)}
              </span>
            )}
            {event.time && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {event.time}
              </span>
            )}
            {event.venue && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.venue}
              </span>
            )}
          </div>

          {event.speakers && event.speakers.length > 0 && (
            <div className="mt-4 text-sm text-white/70">
              <span className="font-medium text-white/90">Speakers: </span>
              {event.speakers.map((s: string, i: number) => {
                const name = s.replace(/^Speaker:\s*/i, '').split(',')[0].trim()
                const speaker = getSpeakerByName(name)
                return (
                  <span key={i}>
                    {i > 0 && ', '}
                    {speaker ? (
                      <Link to={`/speakers/directory/${speaker.slug}`} className="text-spe-gold hover:text-white transition-colors">{s}</Link>
                    ) : s}
                  </span>
                )
              })}
            </div>
          )}
          {event.chair && (() => {
            const chairName = event.chair.replace(/^Speaker:\s*/i, '').split(',')[0].trim()
            const chairSpeaker = getSpeakerByName(chairName)
            return (
              <div className="mt-1 text-sm text-white/70">
                <span className="font-medium text-white/90">Chair: </span>
                {chairSpeaker ? (
                  <Link to={`/speakers/directory/${chairSpeaker.slug}`} className="text-spe-gold hover:text-white transition-colors">{event.chair}</Link>
                ) : event.chair}
              </div>
            )
          })()}
        </div>
      </div>

      {/* Body content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {event.images && event.images.length > 0 && (
          <img
            src={resolveImageUrl(event.images[0])}
            alt={event.title}
            className="w-full rounded-xl mb-8 shadow-sm"
          />
        )}
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
          dangerouslySetInnerHTML={{ __html: sanitiseBodyHtml(event.body) }}
        />

        <PdfDownloads pdfs={event.pdfLinks} />

        {/* Cross-links for dinner events (review, podcast, news) */}
        {event.date && (() => {
          const review = getDinnerReviewForEvent(event.title, event.date)
          const podcast = getPodcastForEvent(event.title, event.date)
          const essays = getEssaysForEvent(event.title, event.date)
          const newsItems = getNewsForEvent(event.title, event.date) ?? []
          if (!review && !podcast && essays.length === 0 && newsItems.length === 0) return null
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

        {/* Topic cross-links: suggested book reviews */}
        {event.topics && event.topics.length > 0 && (() => {
          const suggestedBooks = getBookReviewsForTopics(event.topics)
          if (suggestedBooks.length === 0) return null
          return (
            <div className="my-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-spe-copper mb-4">Suggested reading</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {suggestedBooks.map(b => (
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
          )
        })()}

        {/* Share */}
        <ShareButtons title={event.title} />

        <PrevNextNav
          items={eventsData}
          currentSlug={event.slug}
          slugToPath={slug => `/${slug}`}
        />
      </article>

      {/* Related Events */}
      {relatedEvents.length > 0 && (
        <section className="bg-spe-paper/50 border-t border-spe-divider/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="section-label">What's On</p>
                <h2 className="editorial-heading text-2xl text-spe-ink">More Events</h2>
              </div>
              <Link
                to="/events"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors group"
              >
                View all events
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedEvents.map(e => (
                <ContentCard
                  key={e.slug}
                  to={`/${e.slug}`}
                  title={e.title}
                  date={e.date}
                  category="event"
                  excerpt={e.body}
                  image={e.images?.[0]}
                  speaker={e.speakers?.[0]}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
