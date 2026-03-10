import { useSEO } from '../hooks/useSEO'
import { breadcrumbSchema, collectionPageSchema } from '../utils/seoSchemas'
import ContentCard from '../components/ContentCard'
import FilterBar from '../components/FilterBar'
import { useFilteredData } from '../hooks/useFilteredData'
import { useReveal } from '../hooks/useReveal'
import articlesData from '../data/articles.json'

export default function Articles() {
  useSEO({
    title: 'Articles',
    description: 'Read articles and analysis from leading economists on policy, markets, and the UK economy.',
    type: 'website',
    schema: [
      collectionPageSchema({ name: 'Articles', description: 'SPE articles and analysis.', path: '/reading-room/articles', itemCount: articlesData.length }),
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Reading Room', path: '/reading-room' }, { name: 'Articles' }]),
    ],
  })
  const { filtered, searchQuery, setSearchQuery, selectedYear, setSelectedYear, years } = useFilteredData(articlesData)
  const gridRef = useReveal()

  return (
    <div>
      <div className="bg-gradient-to-br from-spe-deep2 via-spe-blue to-spe-accent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="inline-flex items-center gap-2 mb-3"><span className="w-6 h-[2px] bg-spe-gold rounded-full" /><span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">Reading Room</span></div>
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">Articles</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light">
            Research papers, analysis, and thought leadership from SPE members and contributors.
          </p>
        </div>
      </div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length > 0 ? (
          <section ref={gridRef}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
              {filtered.map(item => (
                <div key={item.slug} className="reveal h-full">
                  <ContentCard
                    to={`/reading-room/articles/${item.slug}`}
                    title={item.title}
                    category="article"
                    excerpt={item.body}
                    image={(item as any).images?.[0]}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-20">
            <svg className="mx-auto h-16 w-16 text-spe-divider/60 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-spe-grey text-lg font-medium mb-1">No articles found</p>
            <p className="text-spe-grey/70 text-sm">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
