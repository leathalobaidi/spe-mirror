import { useSEO } from '../hooks/useSEO'
import ContentCard from '../components/ContentCard'
import FilterBar from '../components/FilterBar'
import { useFilteredData } from '../hooks/useFilteredData'
import { useReveal } from '../hooks/useReveal'
import eveningTalksData from '../data/evening-talks.json'

export default function EveningTalks() {
  useSEO({
    title: 'Evening Talks',
    description: 'Watch recordings of SPE evening talks with leading economists on current economic issues.',
    type: 'website',
  })
  const { filtered, searchQuery, setSearchQuery, selectedYear, setSelectedYear, years } = useFilteredData(eveningTalksData)
  const gridRef = useReveal()

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-br from-spe-deep2 via-spe-deep to-spe-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="editorial-subheading text-spe-light mb-3">Speaker Series</p>
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">Evening Talks</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light">
            Talks and lectures from the Society's evening speaker programme.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar
        years={years}
        categories={[]}
        selectedYear={selectedYear}
        selectedCategory={null}
        searchQuery={searchQuery}
        onYearChange={setSelectedYear}
        onCategoryChange={() => {}}
        onSearchChange={setSearchQuery}
        totalResults={filtered.length}
        label="talks"
      />

      {/* Members notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">
        <div className="flex items-center gap-2 text-sm text-spe-muted/70 bg-spe-bg/60 border border-spe-border/20 rounded-lg px-4 py-2.5">
          <svg className="w-4 h-4 shrink-0 text-spe-blue/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Full talk summaries are available to SPE members. Click any talk to view available details.
        </div>
      </div>

      {/* Talks grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length > 0 ? (
          <section ref={gridRef}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
              {filtered.map(item => (
                <div key={item.slug} className="reveal h-full">
                  <ContentCard
                    to={`/speakers/evening-talks/${item.slug}`}
                    title={item.title}
                    date={item.date}
                    category="speaker-series"
                    excerpt={item.body}
                    image={item.images?.[0]}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-20">
            <svg className="mx-auto h-16 w-16 text-spe-border/60 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-spe-grey text-lg font-medium mb-1">No evening talks found</p>
            <p className="text-spe-grey/70 text-sm">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
