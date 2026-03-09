import { useParams, Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import eventsData from '../data/events.json'
import { formatDate, sanitiseBodyHtml } from '../utils/helpers'
import ContentCard from '../components/ContentCard'
import ShareButtons from '../components/ShareButtons'
import Breadcrumbs from '../components/Breadcrumbs'
import MediaEmbed from '../components/MediaEmbed'
import type { MediaEmbed as MediaEmbedType } from '../utils/media'
import PdfDownloads from '../components/PdfDownloads'
import NotFound from './NotFound'

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
      <div className="bg-gradient-to-br from-spe-deep2 via-spe-deep to-spe-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
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
              {event.speakers.join(', ')}
            </div>
          )}
          {event.chair && (
            <div className="mt-1 text-sm text-white/70">
              <span className="font-medium text-white/90">Chair: </span>
              {event.chair}
            </div>
          )}
        </div>
      </div>

      {/* Body content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {event.images && event.images.length > 0 && (
          <img
            src={event.images[0]}
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
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-spe-dark prose-a:text-spe-blue prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitiseBodyHtml(event.body) }}
        />

        <PdfDownloads pdfs={event.pdfLinks} />

        {/* Share */}
        <ShareButtons title={event.title} />
      </article>

      {/* Related Events */}
      {relatedEvents.length > 0 && (
        <section className="bg-spe-bg/50 border-t border-spe-border/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="editorial-subheading text-spe-blue mb-2">What's On</p>
                <h2 className="editorial-heading text-2xl text-spe-dark">More Events</h2>
              </div>
              <Link
                to="/events"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors group"
              >
                View all events
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
