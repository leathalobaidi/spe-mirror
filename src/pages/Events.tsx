import { useSEO } from '../hooks/useSEO'
import ContentCard from '../components/ContentCard'
import FilterBar from '../components/FilterBar'
import { useFilteredData } from '../hooks/useFilteredData'
import { useReveal } from '../hooks/useReveal'
import eventsData from '../data/events.json'

export default function Events() {
  useSEO({
    title: 'Events',
    description: 'Upcoming and past SPE events including conferences, dinners, and evening talks for economists.',
    type: 'website',
  })
  const { filtered, searchQuery, setSearchQuery, selectedYear, setSelectedYear, selectedCategory, setSelectedCategory, years, categories } = useFilteredData(eventsData)
  const gridRef = useReveal()

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-br from-spe-deep2 via-spe-deep to-spe-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="editorial-subheading text-spe-light mb-3">What's On</p>
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">Events</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light">
            Conferences, annual dinners, luncheon talks, evening seminars, and virtual events bringing together professional economists.
          </p>
        </div>
      </div>

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

      {/* Events grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length > 0 ? (
          <section ref={gridRef}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
              {filtered.map((item, i) => (
                <div key={`${item.slug}-${i}`} className="reveal h-full">
                  <ContentCard
                    to={`/events/${item.slug.split('/').pop()}`}
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
        ) : (
          <div className="text-center py-20">
            <svg className="mx-auto h-16 w-16 text-spe-border/60 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
