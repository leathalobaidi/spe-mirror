import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { breadcrumbSchema, collectionPageSchema } from '../utils/seoSchemas'
import ContentCard from '../components/ContentCard'
import FilterBar from '../components/FilterBar'
import { useFilteredData } from '../hooks/useFilteredData'
import { useReveal } from '../hooks/useReveal'
import eventsData from '../data/events.json'
import { getAllDinnerYears } from '../utils/annualDinnerData'

export default function Events() {
  useSEO({
    title: 'Events',
    description: 'Upcoming and past SPE events including conferences, dinners, and evening talks for economists.',
    type: 'website',
    schema: [
      collectionPageSchema({ name: 'Events', description: 'SPE events listing.', path: '/events', itemCount: eventsData.length }),
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Events' }]),
    ],
  })
  const { filtered, searchQuery, setSearchQuery, selectedYear, setSelectedYear, selectedCategory, setSelectedCategory, years, categories } = useFilteredData(eventsData)
  const gridRef = useReveal()

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep text-white relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <div className="inline-flex items-center gap-2 mb-3"><span className="w-6 h-[2px] bg-spe-gold rounded-full" /><span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">What's On</span></div>
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">Events</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light">
            Conferences, annual dinners, luncheon talks, evening seminars, and virtual events bringing together professional economists.
          </p>
        </div>
      </div>

      {/* Annual Dinners strip */}
      <section className="bg-spe-paper/50 border-b border-spe-divider/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-spe-gold mb-1">Flagship Event</p>
              <h2 className="editorial-heading text-xl text-spe-ink">Annual Dinners</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {getAllDinnerYears().map(d => (
              <Link
                key={d.year}
                to={`/events/annual-dinner/${d.year}`}
                className="group flex flex-col items-center rounded-xl border border-spe-divider/15 bg-white p-3 hover:border-spe-blue/30 hover:shadow-sm transition-all"
              >
                <span className="text-lg font-semibold text-spe-ink group-hover:text-spe-blue transition-colors">{d.year}</span>
                {d.guestSpeaker && !d.cancelled ? (
                  <span className="text-[10px] text-spe-ink/50 text-center mt-0.5 leading-tight">{d.guestSpeaker}</span>
                ) : d.cancelled ? (
                  <span className="text-[10px] text-amber-600 mt-0.5">Cancelled</span>
                ) : (
                  <span className="text-[10px] text-spe-ink/30 mt-0.5">Upcoming</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <FilterBar
        years={years}
        categories={categories}
        selectedYear={selectedYear}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onYearChange={setSelectedYear}
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearchQuery}
        totalResults={filtered.length}
        label="events"
      />

      {/* Events grid — split into Upcoming and Past */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length > 0 ? (
          <>
            {/* Upcoming Events (soonest first) */}
            {(() => {
              const today = new Date().toISOString().slice(0, 10)
              const upcoming = filtered
                .filter(e => e.date && e.date >= today)
                .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''))
              const past = filtered.filter(e => !e.date || e.date < today)

              return (
                <>
                  {upcoming.length > 0 && (
                    <section ref={gridRef} className="mb-14">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Upcoming
                        </span>
                        <span className="text-sm text-spe-grey">{upcoming.length} event{upcoming.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
                        {upcoming.map((item, i) => (
                          <div key={`${item.slug}-${i}`} className="reveal h-full">
                            <ContentCard
                              to={`/events/${item.slug}`}
                              title={item.title}
                              date={item.date ?? undefined}
                              category="event"
                              excerpt={item.body ?? undefined}
                              image={(item.images as string[])?.[0]}
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Past Events (newest first — already sorted) */}
                  {past.length > 0 && (
                    <section>
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-xs font-semibold uppercase tracking-wider text-spe-grey/70">Past Events</span>
                        <span className="text-sm text-spe-grey">{past.length} event{past.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {past.map((item, i) => (
                          <div key={`${item.slug}-${i}`} className="h-full">
                            <ContentCard
                              to={`/events/${item.slug}`}
                              title={item.title}
                              date={item.date ?? undefined}
                              category="event"
                              excerpt={item.body ?? undefined}
                              image={(item.images as string[])?.[0]}
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )
            })()}
          </>
        ) : (
          <div className="text-center py-20">
            <svg className="mx-auto h-16 w-16 text-spe-divider/60 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-spe-grey text-lg font-medium mb-1">No events found</p>
            <p className="text-spe-grey/70 text-sm">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
