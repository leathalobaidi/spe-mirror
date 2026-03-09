import ContentCard from '../components/ContentCard'
import FilterBar from '../components/FilterBar'
import { useSEO } from '../hooks/useSEO'
import { useFilteredData } from '../hooks/useFilteredData'
import { useReveal } from '../hooks/useReveal'
import conferenceReportsData from '../data/conference-reports.json'

export default function ConferenceReports() {
  useSEO({
    title: 'Conference Reports',
    description: 'Reports from SPE conferences covering macroeconomics, policy, and the UK economic outlook.',
    type: 'website',
  })
  const { filtered, searchQuery, setSearchQuery, selectedYear, setSelectedYear, years } = useFilteredData(conferenceReportsData)
  const gridRef = useReveal()

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-br from-spe-deep2 via-spe-deep to-spe-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="editorial-subheading text-spe-light mb-3">Speakers</p>
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">Conference Reports</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light">
            Reports and summaries from economics conferences and symposia.
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
        label="reports"
      />

      {/* Reports grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length > 0 ? (
          <section ref={gridRef}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
              {filtered.map(item => (
                <div key={item.slug} className="reveal h-full">
                  <ContentCard
                    to={`/speakers/conference-reports/${item.slug}`}
                    title={item.title}
                    category="conference-report"
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <p className="text-spe-grey text-lg font-medium mb-1">No conference reports found</p>
            <p className="text-spe-grey/70 text-sm">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
