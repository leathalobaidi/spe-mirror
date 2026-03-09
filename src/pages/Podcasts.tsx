import { useSEO } from '../hooks/useSEO'
import ContentCard from '../components/ContentCard'
import FilterBar from '../components/FilterBar'
import { useFilteredData } from '../hooks/useFilteredData'
import { useReveal } from '../hooks/useReveal'
import podcastsData from '../data/podcasts.json'

export default function Podcasts() {
  useSEO({
    title: 'Podcasts & Talks',
    description: 'Listen to SPE podcasts featuring interviews with economists on policy, research, and careers.',
    type: 'website',
  })
  const { filtered, searchQuery, setSearchQuery, selectedYear, setSelectedYear, selectedCategory, setSelectedCategory, years, categories } = useFilteredData(podcastsData)
  const gridRef = useReveal()

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-br from-spe-deep2 via-spe-deep to-spe-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="editorial-subheading text-spe-light mb-3">Listen & Watch</p>
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">Podcasts & Talks</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light">
            In-depth conversations with leading economists, conference reports, speaker series recordings, and annual dinner reviews.
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
        label="podcasts & talks"
      />

      {/* Content grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length > 0 ? (
          <section ref={gridRef}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
              {filtered.map(item => (
                <div key={item.slug} className="reveal h-full">
                  <ContentCard
                    to={`/podcasts/${item.slug.split('/').pop()}`}
                    title={item.title}
                    date={item.date}
                    category={item.category}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <p className="text-spe-grey text-lg font-medium mb-1">No podcasts or talks found</p>
            <p className="text-spe-grey/70 text-sm">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
