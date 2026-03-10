import { Link } from 'react-router-dom'
import ContentCard from '../components/ContentCard'
import FilterBar from '../components/FilterBar'
import { useSEO } from '../hooks/useSEO'
import { breadcrumbSchema, collectionPageSchema } from '../utils/seoSchemas'
import { useFilteredData } from '../hooks/useFilteredData'
import { useReveal } from '../hooks/useReveal'
import essaysData from '../data/ryb-essays.json'

export default function RybEssays() {
  useSEO({
    title: 'Rybczynski Essays',
    description: 'Read Your Brief essays by SPE members on topical economic issues and policy debates.',
    type: 'website',
    schema: [
      collectionPageSchema({ name: 'Rybczynski Essays', description: 'SPE Rybczynski Prize essays.', path: '/reading-room/rybczynski-essays', itemCount: essaysData.length }),
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Reading Room', path: '/reading-room' }, { name: 'Rybczynski Essays' }]),
    ],
  })
  const { filtered, searchQuery, setSearchQuery, selectedYear, setSelectedYear, years } = useFilteredData(essaysData)
  const gridRef = useReveal()

  return (
    <div>
      <div className="bg-gradient-to-br from-spe-deep2 to-spe-deep text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="inline-flex items-center gap-2 mb-3"><span className="w-6 h-[2px] bg-spe-gold rounded-full" /><span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">Rybczynski Prize</span></div>
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">Prize Essays</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light">
            Winning and shortlisted essays from the annual Rybczynski Prize essay competition.
          </p>
          <a
            href="/images/2167/rybentryform.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 flex-shrink-0 text-spe-error-light/70" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z" />
              <path d="M12 18l4-4h-3v-4h-2v4H8l4 4z" />
            </svg>
            <span className="hover:underline">Download Entry Form (PDF)</span>
          </a>
          <Link
            to="/reading-room/rybczynski-prize"
            className="inline-flex items-center gap-2 mt-4 ml-6 text-sm text-white/80 hover:text-white transition-colors group"
          >
            <svg className="w-5 h-5 flex-shrink-0 text-spe-gold/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hover:underline">Prize Timeline & Winners</span>
          </Link>
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
        label="essays"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length > 0 ? (
          <section ref={gridRef}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
              {filtered.map(item => (
                <div key={item.slug} className="reveal h-full">
                  <ContentCard
                    to={`/reading-room/rybczynski-essays/${item.slug}`}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <p className="text-spe-grey text-lg font-medium mb-1">No essays found</p>
            <p className="text-spe-grey/70 text-sm">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
