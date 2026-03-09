import { useSEO } from '../hooks/useSEO'
import ContentCard from '../components/ContentCard'
import FilterBar from '../components/FilterBar'
import { useFilteredData } from '../hooks/useFilteredData'
import { useReveal } from '../hooks/useReveal'
import newsData from '../data/news.json'

export default function News() {
  useSEO({
    title: 'News',
    description: 'Latest news from the Society of Professional Economists on events, policy, and member updates.',
    type: 'website',
  })
  const { filtered, searchQuery, setSearchQuery, selectedYear, setSelectedYear, years } = useFilteredData(newsData)
  const gridRef = useReveal()

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-br from-spe-deep2 via-spe-deep to-spe-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="editorial-subheading text-spe-light mb-3">Latest Updates</p>
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">News</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light">
            Announcements, prize winners, membership updates, and other news from the Society.
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
        label="articles"
      />

      {/* News grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length > 0 ? (
          <section ref={gridRef}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
              {filtered.map(item => (
                <div key={item.slug} className="reveal h-full">
                  <ContentCard
                    to={`/news/${item.slug}`}
                    title={item.title}
                    date={item.date}
                    category="news"
                    excerpt={item.body}
                    image={item.bannerImage || item.images?.[0]}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-20">
            <svg className="mx-auto h-16 w-16 text-spe-border/60 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-spe-grey text-lg font-medium mb-1">No news articles found</p>
            <p className="text-spe-grey/70 text-sm">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
