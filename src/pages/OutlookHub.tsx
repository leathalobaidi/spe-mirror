import { useParams, Link, Navigate } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { eventSchema, breadcrumbSchema } from '../utils/seoSchemas'
import { getOutlookYear, getOutlookYearNumbers } from '../utils/outlookData'
import { podcastLinkSlug, eventDetailPath } from '../utils/crossLinks'
import { getSpeakerByName } from '../utils/speakerDirectory'
import { formatDate } from '../utils/helpers'
import Breadcrumbs from '../components/Breadcrumbs'
import ShareButtons from '../components/ShareButtons'

export default function OutlookHub() {
  const { year: yearParam } = useParams()
  const year = yearParam ? parseInt(yearParam) : 0
  const data = getOutlookYear(year)
  const allYears = getOutlookYearNumbers()

  // Invalid year → redirect to events
  if (!data || year < 2015 || year > 2026) {
    return <Navigate to="/events" replace />
  }

  // allYears is sorted descending: [2026, 2025, …, 2015]
  const prevYear = allYears.find(y => y < year)
  const nextYear = [...allYears].reverse().find(y => y > year)

  // Determine date string — prefer event date, fall back to talk or podcast date
  const dateStr = data.event?.date ?? data.eveningTalk?.date ?? data.podcast?.date ?? null

  // Determine if this is a future/upcoming event
  const today = new Date().toISOString().slice(0, 10)
  const isUpcoming = dateStr ? dateStr > today : false

  // Speaker names for SEO
  const speakerNames = data.speakers.map(s => s.name)

  useSEO({
    title: data.title,
    description: speakerNames.length > 0
      ? `${data.title} — panel featuring ${speakerNames.slice(0, 3).join(', ')}${speakerNames.length > 3 ? ' and others' : ''}.`
      : `${data.title} — the SPE's annual economic outlook panel event.`,
    type: 'event',
    schema: [
      eventSchema({
        name: data.title,
        date: dateStr ?? undefined,
        venue: data.virtual ? 'Online Webinar' : undefined,
        speakers: speakerNames.length > 0 ? speakerNames : undefined,
        description: `${data.title} — the SPE's annual economic outlook panel event.`,
        path: `/events/uk-outlook/${year}`,
      }),
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Events', path: '/events' }, { name: data.title }]),
    ],
  })

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
              { label: data.title },
            ]}
          />

          {/* Year navigation pills */}
          <div className="flex items-center gap-2 mb-6">
            {nextYear && (
              <Link
                to={`/events/uk-outlook/${nextYear}`}
                className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                {nextYear}
              </Link>
            )}
            <span className="text-white/30">·</span>
            {prevYear && (
              <Link
                to={`/events/uk-outlook/${prevYear}`}
                className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors"
              >
                {prevYear}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            )}
          </div>

          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[2px] bg-spe-gold rounded-full" />
            <span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">UK Economic Outlook</span>
          </div>

          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">
            {data.title}
          </h1>

          {/* Virtual/webinar notice */}
          {data.virtual && (
            <div className="rounded-lg bg-cyan-500/15 border border-cyan-400/30 px-4 py-3 mb-6">
              <p className="text-cyan-200 text-sm">
                This was a virtual/webinar event.
              </p>
            </div>
          )}

          {/* Upcoming notice */}
          {isUpcoming && (
            <div className="rounded-lg bg-emerald-500/15 border border-emerald-400/30 px-4 py-3 mb-6">
              <p className="text-emerald-200 text-sm">
                This event has not yet taken place. Details below are provisional.
              </p>
            </div>
          )}

          {/* Date meta */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-white/80">
            {dateStr && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(dateStr)}
              </span>
            )}
            {data.virtual && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Online Webinar
              </span>
            )}
          </div>

          {/* Panel speakers */}
          {data.speakers.length > 0 && (
            <div className="mt-5">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Panel</p>
              <div className="space-y-1.5">
                {data.speakers.map((speaker, i) => {
                  const profile = getSpeakerByName(speaker.name)
                  return (
                    <div key={i} className="text-sm text-white/80">
                      {profile ? (
                        <Link to={`/speakers/directory/${profile.slug}`} className="text-spe-gold hover:text-white transition-colors">
                          {speaker.name}
                        </Link>
                      ) : (
                        <span className="text-white/90">{speaker.name}</span>
                      )}
                      {speaker.affiliation && (
                        <span className="text-white/50"> — {speaker.affiliation}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Chair */}
          {data.chair && (
            <div className="mt-3 text-sm text-white/70">
              <span className="font-medium text-white/90">Chair: </span>
              {(() => {
                const chairProfile = getSpeakerByName(data.chair.name)
                return chairProfile ? (
                  <Link to={`/speakers/directory/${chairProfile.slug}`} className="text-spe-gold hover:text-white transition-colors">
                    {data.chair.name}
                  </Link>
                ) : (
                  <span>{data.chair.name}</span>
                )
              })()}
              {data.chair.affiliation && (
                <span className="text-white/60"> — {data.chair.affiliation}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">

          {/* ── Evening Talk Review Section ──────────────────────── */}
          {data.eveningTalk && (
            <section className="rounded-xl border border-spe-divider/15 bg-spe-paper/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-spe-burgundy/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-spe-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-spe-burgundy">Talk Review</p>
                </div>
              </div>
              <Link
                to={`/speakers/evening-talks/${data.eveningTalk.slug}`}
                className="group block"
              >
                <p className="text-spe-blue group-hover:text-spe-deep font-medium transition-colors mb-1">{data.eveningTalk.title}</p>
                <p className="text-xs text-spe-ink/50">Read the full review of the panel discussion →</p>
              </Link>
            </section>
          )}

          {/* ── Podcast / Recording Section ─────────────────────── */}
          {data.podcast && (
            <section className="rounded-xl border border-spe-divider/15 bg-spe-paper/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-spe-blue/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 12h.01M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728M8.464 15.536a5 5 0 010-7.072" /></svg>
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-spe-blue">
                    {data.virtual ? 'Webinar Recording' : 'Panel Recording'}
                  </p>
                </div>
              </div>
              <Link
                to={`/podcasts/${podcastLinkSlug(data.podcast.slug)}`}
                className="group block"
              >
                <p className="text-spe-blue group-hover:text-spe-deep font-medium transition-colors mb-1">{data.podcast.title}</p>
                <p className="text-xs text-spe-ink/50">
                  {data.virtual ? 'Watch the webinar recording →' : 'Listen to the panel discussion →'}
                </p>
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

          {/* Empty state for years with no content sections */}
          {!data.eveningTalk && !data.podcast && !data.event && (
            <div className="text-center py-12">
              <p className="text-spe-grey">
                No detailed content is available for the {year} Outlook event.
              </p>
            </div>
          )}
        </div>

        {/* Share buttons */}
        <div className="mt-10">
          <ShareButtons title={data.title} />
        </div>

        {/* Year navigation (bottom) */}
        <nav className="flex items-center justify-between mt-12 pt-8 border-t border-spe-divider/10">
          {nextYear ? (
            <Link
              to={`/events/uk-outlook/${nextYear}`}
              className="flex items-center gap-2 text-sm text-spe-blue hover:text-spe-deep transition-colors group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Outlook {nextYear}
            </Link>
          ) : <span />}
          {prevYear ? (
            <Link
              to={`/events/uk-outlook/${prevYear}`}
              className="flex items-center gap-2 text-sm text-spe-blue hover:text-spe-deep transition-colors group"
            >
              Outlook {prevYear}
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          ) : <span />}
        </nav>
      </article>

      {/* All Outlook years timeline strip */}
      <section className="bg-spe-paper/50 border-t border-spe-divider/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="section-label mb-4">All UK Economic Outlook Events</p>
          <div className="flex flex-wrap gap-2">
            {allYears.map(y => (
              <Link
                key={y}
                to={`/events/uk-outlook/${y}`}
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
