import { useState, useMemo } from 'react'
import { useSEO } from '../hooks/useSEO'
import { breadcrumbSchema, collectionPageSchema } from '../utils/seoSchemas'
import BookCover from '../components/BookCover'
import { useReveal } from '../hooks/useReveal'
import bookReviewsData from '../data/book-reviews-index.json'
import { getYear, getUniqueYears } from '../utils/helpers'

export default function BookReviews() {
  useSEO({
    title: 'Book Reviews',
    description: 'Book reviews by economists. Discover the latest economics titles reviewed by SPE members.',
    type: 'website',
    schema: [
      collectionPageSchema({ name: 'Book Reviews', description: 'SPE book reviews.', path: '/reading-room/book-reviews', itemCount: bookReviewsData.length }),
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Reading Room', path: '/reading-room' }, { name: 'Book Reviews' }]),
    ],
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  const years = useMemo(
    () => getUniqueYears(bookReviewsData.map(b => b.date).filter(Boolean)),
    []
  )

  const filtered = useMemo(() => {
    let result = bookReviewsData

    if (selectedYear) {
      result = result.filter(b => b.date && getYear(b.date) === selectedYear)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(b =>
        b.title.toLowerCase().includes(q) ||
        (b.author && b.author.toLowerCase().includes(q)) ||
        (b.reviewer && b.reviewer.toLowerCase().includes(q))
      )
    }

    return result
  }, [selectedYear, searchQuery])

  const gridRef = useReveal()

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep text-white relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <div className="inline-flex items-center gap-2 mb-3"><span className="w-6 h-[2px] bg-spe-gold rounded-full" /><span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">Reading Room</span></div>
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">Book Reviews</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light">
            {bookReviewsData.length} expert reviews of economics, finance, and public policy books by SPE members.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border-b border-spe-divider/30 sticky top-16 z-30 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md rounded-lg">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-spe-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, or reviewer..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-spe-divider/50 rounded-lg bg-spe-paper/50 focus:outline-none focus:bg-white focus:border-spe-blue/30 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedYear || ''}
                onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
                className="px-3 py-2.5 text-sm border border-spe-divider/50 rounded-lg bg-white focus:outline-none focus:border-spe-blue/30 cursor-pointer"
              >
                <option value="">All years</option>
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>

              <span className="text-xs text-spe-grey font-medium ml-1">
                {filtered.length} reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Book Reviews Editor contact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-2xl border border-spe-divider/30 bg-white p-7">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-spe-cream flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-spe-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif font-bold text-spe-ink mb-1">For Books and Reviews</h3>
              <p className="text-sm text-spe-muted leading-relaxed mb-2">
                Articles reflect the authors' views which are not necessarily shared by the Society or the Editor. The Editor welcomes comments, ideas and articles on a wide range of applied economics topics.
              </p>
              <p className="text-sm text-spe-ink font-medium">Ian Harwood</p>
              <p className="text-xs text-spe-muted mb-2">Book Reviews Editor, The Society of Professional Economists</p>
              <a
                href="mailto:harwoodfive@btinternet.com"
                className="text-sm font-medium text-spe-blue hover:underline"
              >
                harwoodfive@btinternet.com →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Book grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length > 0 ? (
          <section ref={gridRef}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-8 reveal-stagger">
              {filtered.map(book => (
                <div key={book.slug} className="reveal">
                  <BookCover
                    to={`/reading-room/book-reviews/${book.slug}`}
                    title={book.title}
                    coverImage={book.coverImage || '/images/placeholder-book.svg'}
                    author={book.author}
                    reviewer={book.reviewer}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-20">
            <svg className="mx-auto h-16 w-16 text-spe-divider/60 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-spe-grey text-lg font-medium mb-1">No book reviews found</p>
            <p className="text-spe-grey/70 text-sm">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
