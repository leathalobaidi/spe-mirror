import ContentCard from '../components/ContentCard'
import FilterBar from '../components/FilterBar'
import { useSEO } from '../hooks/useSEO'
import { useFilteredData } from '../hooks/useFilteredData'
import { useReveal } from '../hooks/useReveal'
import dinnerReviewsData from '../data/dinner-reviews.json'

export default function DinnerReviews() {
  useSEO({
    title: 'Dinner Reviews',
    description: 'Reviews of SPE dinner events featuring talks from distinguished economists and policymakers.',
    type: 'website',
  })
  const { filtered, searchQuery, setSearchQuery, selectedYear, setSelectedYear, years } = useFilteredData(dinnerReviewsData)
  const gridRef = useReveal()

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-br from-spe-deep2 via-spe-deep to-spe-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="editorial-subheading text-spe-light mb-3">Speakers</p>
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">Dinner Reviews</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light">
            Reviews and write-ups from the Society's annual and special dinners.
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
        label="reviews"
      />

      {/* Reviews grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length > 0 ? (
          <section ref={gridRef}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
              {filtered.map(item => (
                <div key={item.slug} className="reveal h-full">
                  <ContentCard
                    to={`/speakers/dinner-reviews/${item.slug}`}
                    title={item.title}
                    category="dinner-review"
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <p className="text-spe-grey text-lg font-medium mb-1">No dinner reviews found</p>
            <p className="text-spe-grey/70 text-sm">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
