import { useParams, Link, Navigate } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { getDinnerYear, getDinnerYearsList } from '../utils/annualDinnerData'
import { podcastLinkSlug, eventDetailPath } from '../utils/crossLinks'
import { getSpeakerByName } from '../utils/speakerDirectory'
import { formatDate, resolveImageUrl } from '../utils/helpers'
import Breadcrumbs from '../components/Breadcrumbs'
import ShareButtons from '../components/ShareButtons'

const VENUE_DEFAULT = 'Institute of Directors, 116 Pall Mall, London'

export default function AnnualDinnerHub() {
  const { year: yearParam } = useParams()
  const year = yearParam ? parseInt(yearParam) : 0
  const data = getDinnerYear(year)
  const allYears = getDinnerYearsList()

  // Invalid year → redirect to events
  if (!data || year < 2014 || year > 2025) {
    return <Navigate to="/events" replace />
  }

  const prevYear = allYears.find(y => y < year)
  const nextYear = allYears.find(y => y > year)

  // Determine date string — prefer event date, fall back to review date
  const dateStr = data.event?.date ?? data.review?.date ?? data.podcast?.date ?? null
  const venue = data.event?.venue ?? VENUE_DEFAULT

  // Determine if this is a future/upcoming dinner
  const today = new Date().toISOString().slice(0, 10)
  const isUpcoming = dateStr ? dateStr > today : false

  useSEO({
    title: `Annual Dinner ${year}`,
    description: data.guestSpeaker
      ? `The SPE Annual Dinner ${year} — guest speaker ${data.guestSpeaker}${data.guestSpeakerRole ? `, ${data.guestSpeakerRole}` : ''}.`
      : `The SPE Annual Dinner ${year} at the ${venue}.`,
    type: 'event',
  })

  // Speaker profile link
  const speakerProfile = data.guestSpeaker ? getSpeakerByName(data.guestSpeaker) : null

  // One-line description from review body
  const reviewSnippet = (() => {
    if (!data.review?.body) return null
    const text = data.review.body
      .replace(/<div class=['"]heading['"]>[\s\S]*?<\/div>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/&\w+;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    // Skip date/speaker preamble — find first sentence that starts with a capital letter
    // and mentions "members" or "guests" or "gathered"
    const sentences = text.split(/(?<=[.!?])\s+/)
    const narrative = sentences.find(s =>
      /\b(members|guests|gathered|over \d+|annual dinner)/i.test(s) && s.length > 30
    )
    if (narrative) return narrative.length > 200 ? narrative.slice(0, 200) + '…' : narrative
    // Fallback: first meaningful sentence
    const first = sentences.find(s => s.length > 40)
    return first ? (first.length > 200 ? first.slice(0, 200) + '…' : first) : null
  })()

  return (
    <div>
      {/* Hero header */}
      <div className="bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep text-white relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <Breadcrumbs
            variant="light"
            className="mb-6"
            items={[
              { label: 'Home', to: '/' },
              { label: 'Events', to: '/events' },
              { label: `Annual Dinner ${year}` },
            ]}
          />

          {/* Year navigation pills */}
          <div className="flex items-center gap-2 mb-6">
            {nextYear && (
              <Link
                to={`/events/annual-dinner/${nextYear}`}
                className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                {nextYear}
              </Link>
            )}
            <span className="text-white/30">·</span>
            {prevYear && (
              <Link
                to={`/events/annual-dinner/${prevYear}`}
                className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors"
              >
                {prevYear}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            )}
          </div>

          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[2px] bg-spe-gold rounded-full" />
            <span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">Annual Dinner</span>
          </div>

          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">
            {data.cancelled ? `Annual Dinner ${year}` : `Annual Dinner ${year}`}
          </h1>

          {/* COVID notice */}
          {data.cancelled && (
            <div className="rounded-lg bg-amber-500/15 border border-amber-400/30 px-4 py-3 mb-6">
              <p className="text-amber-200 text-sm">
                The 2020 Annual Dinner was cancelled due to the COVID-19 pandemic.
              </p>
            </div>
          )}

          {/* Upcoming notice */}
          {isUpcoming && !data.cancelled && (
            <div className="rounded-lg bg-emerald-500/15 border border-emerald-400/30 px-4 py-3 mb-6">
              <p className="text-emerald-200 text-sm">
                This dinner has not yet taken place. Details below are provisional.
              </p>
            </div>
          )}

          {/* Date, venue, speaker meta */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-white/80">
            {dateStr && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(dateStr)}
              </span>
            )}
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {venue}
            </span>
          </div>

          {/* Guest speaker headline */}
          {data.guestSpeaker && !data.cancelled && (
            <div className="mt-4 text-sm text-white/70">
              <span className="font-medium text-white/90">Guest Speaker: </span>
              {speakerProfile ? (
                <Link to={`/speakers/directory/${speakerProfile.slug}`} className="text-spe-gold hover:text-white transition-colors">
                  {data.guestSpeaker}
                </Link>
              ) : (
                <span>{data.guestSpeaker}</span>
              )}
              {data.guestSpeakerRole && (
                <span className="text-white/60"> — {data.guestSpeakerRole}</span>
              )}
            </div>
          )}

          {/* One-line description */}
          {reviewSnippet && !data.cancelled && (
            <p className="mt-4 text-white/60 text-sm leading-relaxed max-w-2xl">{reviewSnippet}</p>
          )}
        </div>
      </div>

      {/* Main content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Hero image from dinner review */}
        {data.heroImage && (
          <img
            src={resolveImageUrl(data.heroImage)}
            alt={`Annual Dinner ${year}`}
            className="w-full rounded-xl mb-10 shadow-sm"
          />
        )}

        {/* Content sections — only show if not cancelled */}
        {!data.cancelled ? (
          <div className="space-y-8">

            {/* ── Dinner Review Section ───────────────────────────── */}
            {data.review && (
              <section className="rounded-xl border border-spe-divider/15 bg-spe-paper/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-spe-burgundy/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-spe-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-spe-burgundy">Dinner Review</p>
                  </div>
                </div>
                <Link
                  to={`/speakers/dinner-reviews/${data.review.slug}`}
                  className="group block"
                >
                  <p className="text-spe-blue group-hover:text-spe-deep font-medium transition-colors mb-1">{data.review.title}</p>
                  <p className="text-xs text-spe-ink/50">Read the full review of the evening →</p>
                </Link>
                {/* Additional review images */}
                {data.review.images && data.review.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {data.review.images.slice(1, 4).map((img, i) => (
                      <img
                        key={i}
                        src={resolveImageUrl(img)}
                        alt={`Dinner ${year} photo ${i + 2}`}
                        className="rounded-lg w-full h-24 object-cover"
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ── Podcast Section ─────────────────────────────────── */}
            {data.podcast && (
              <section className="rounded-xl border border-spe-divider/15 bg-spe-paper/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-spe-blue/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 12h.01M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728M8.464 15.536a5 5 0 010-7.072" /></svg>
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-spe-blue">Speech Recording</p>
                  </div>
                </div>
                <Link
                  to={`/podcasts/${podcastLinkSlug(data.podcast.slug)}`}
                  className="group block"
                >
                  <p className="text-spe-blue group-hover:text-spe-deep font-medium transition-colors mb-1">{data.podcast.title}</p>
                  <p className="text-xs text-spe-ink/50">Listen to the guest speaker's address →</p>
                </Link>
              </section>
            )}

            {/* ── Event Listing Section ────────────────────────────── */}
            {data.event && (
              <section className="rounded-xl border border-spe-divider/15 bg-spe-paper/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-spe-copper/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-spe-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-spe-copper">Event Listing</p>
                  </div>
                </div>
                <Link
                  to={eventDetailPath(data.event.slug)}
                  className="group block"
                >
                  <p className="text-spe-blue group-hover:text-spe-deep font-medium transition-colors mb-1">{data.event.title}</p>
                  <p className="text-xs text-spe-ink/50">View event details, programme, and booking information →</p>
                </Link>
              </section>
            )}

            {/* ── Rybczynski Prize Section ─────────────────────────── */}
            {data.essays.length > 0 && (
              <section className="rounded-xl border border-spe-divider/15 bg-spe-paper/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-spe-gold/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-spe-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-spe-gold">Rybczynski Prize</p>
                  </div>
                </div>
                <p className="text-xs text-spe-ink/60 mb-3">
                  The Rybczynski Prize essay{data.essays.length > 1 ? 's' : ''} announced at this dinner:
                </p>
                <div className="space-y-2">
                  {data.essays.map(essay => (
                    <Link
                      key={essay.slug}
                      to={`/reading-room/rybczynski-essays/${essay.slug}`}
                      className="group block"
                    >
                      <p className="text-spe-blue group-hover:text-spe-deep font-medium transition-colors text-sm">{essay.title}</p>
                      {essay.author && (
                        <p className="text-xs text-spe-ink/50 mt-0.5">by {essay.author}</p>
                      )}
                    </Link>
                  ))}
                </div>
                <Link
                  to="/reading-room/rybczynski-prize"
                  className="inline-flex items-center gap-1 text-xs text-spe-gold hover:text-spe-deep mt-3 transition-colors"
                >
                  View full Rybczynski Prize timeline →
                </Link>
              </section>
            )}

            {/* ── News Coverage Section ────────────────────────────── */}
            {data.news.length > 0 && (
              <section className="rounded-xl border border-spe-divider/15 bg-spe-paper/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-spe-copper/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-spe-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-spe-copper">News & Coverage</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {data.news.map(n => (
                    <Link
                      key={n.slug}
                      to={`/news/${n.slug}`}
                      className="group flex items-center gap-2"
                    >
                      <span className="text-[10px] uppercase tracking-wider text-spe-ink/40 w-20 flex-shrink-0">
                        {n.type.replace(/-/g, ' ')}
                      </span>
                      <span className="text-sm text-spe-blue group-hover:text-spe-deep transition-colors">{n.title}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* COVID cancelled year */
          <div className="text-center py-12">
            <p className="text-spe-grey">
              The Annual Dinner was not held in 2020 due to the COVID-19 pandemic.
            </p>
            {data.essays.length > 0 && (
              <div className="mt-8 rounded-xl border border-spe-divider/15 bg-spe-paper/30 p-6 max-w-lg mx-auto text-left">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-spe-gold mb-3">Rybczynski Prize</p>
                <p className="text-xs text-spe-ink/60 mb-3">
                  The Rybczynski Prize essay competition continued despite the dinner cancellation:
                </p>
                {data.essays.map(essay => (
                  <Link
                    key={essay.slug}
                    to={`/reading-room/rybczynski-essays/${essay.slug}`}
                    className="group block"
                  >
                    <p className="text-spe-blue group-hover:text-spe-deep font-medium transition-colors text-sm">{essay.title}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Share buttons */}
        <div className="mt-10">
          <ShareButtons title={`SPE Annual Dinner ${year}`} />
        </div>

        {/* Year navigation (bottom) */}
        <nav className="flex items-center justify-between mt-12 pt-8 border-t border-spe-divider/10">
          {nextYear ? (
            <Link
              to={`/events/annual-dinner/${nextYear}`}
              className="flex items-center gap-2 text-sm text-spe-blue hover:text-spe-deep transition-colors group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Annual Dinner {nextYear}
            </Link>
          ) : <span />}
          {prevYear ? (
            <Link
              to={`/events/annual-dinner/${prevYear}`}
              className="flex items-center gap-2 text-sm text-spe-blue hover:text-spe-deep transition-colors group"
            >
              Annual Dinner {prevYear}
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          ) : <span />}
        </nav>
      </article>

      {/* All dinners timeline strip */}
      <section className="bg-spe-paper/50 border-t border-spe-divider/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="section-label mb-4">All Annual Dinners</p>
          <div className="flex flex-wrap gap-2">
            {allYears.map(y => (
              <Link
                key={y}
                to={`/events/annual-dinner/${y}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  y === year
                    ? 'bg-spe-blue text-white'
                    : 'bg-spe-paper border border-spe-divider/20 text-spe-ink/70 hover:text-spe-blue hover:border-spe-blue/30'
                }`}
              >
                {y}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
