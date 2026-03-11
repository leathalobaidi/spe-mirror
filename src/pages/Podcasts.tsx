import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { breadcrumbSchema, collectionPageSchema } from '../utils/seoSchemas'
import PodcastCard from '../components/PodcastCard'
import { parseSpeaker } from '../components/PodcastCard'
import { useFilteredData } from '../hooks/useFilteredData'
import { useReveal } from '../hooks/useReveal'
import { formatDateShort, truncateText, stripHtml, sanitiseBodyHtml, resolveImageUrl } from '../utils/helpers'
import podcastsData from '../data/podcasts.json'

const categoryLabels: Record<string, string> = {
  podcast: 'Podcasts',
  'speaker-series': 'Speaker Series',
  'conference-report': 'Conference Reports',
  'dinner-review': 'Dinner Reviews',
}

export default function Podcasts() {
  useSEO({
    title: 'Podcasts & Talks',
    description: 'Listen to SPE podcasts featuring interviews with economists on policy, research, and careers.',
    type: 'website',
    schema: [
      collectionPageSchema({ name: 'Podcasts & Talks', description: 'SPE podcast episodes.', path: '/podcasts', itemCount: podcastsData.length }),
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Podcasts' }]),
    ],
  })

  const {
    filtered, searchQuery, setSearchQuery,
    selectedYear, setSelectedYear,
    selectedCategory, setSelectedCategory,
    years, categories,
  } = useFilteredData(podcastsData)
  const gridRef = useReveal(filtered.length)

  const isFiltered = !!(searchQuery || selectedYear || selectedCategory)
  const featured = !isFiltered ? filtered[0] : null
  const gridItems = featured ? filtered.slice(1) : filtered
  const hasActiveFilters = selectedYear !== null || selectedCategory !== null || searchQuery.length > 0

  return (
    <div className="bg-spe-bg min-h-screen">

      {/* ═══ HERO ═══ */}
      <section className="relative bg-spe-ink text-white overflow-hidden grain-overlay">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-ink" />
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-spe-copper/[0.06] rounded-full blur-[100px]" />
          <div className="absolute -bottom-48 -left-24 w-80 h-80 bg-spe-gold/[0.04] rounded-full blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.02] hero-pattern" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <div className="flex items-center justify-between gap-8">
            <div className="flex-1 max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-6 h-[2px] bg-spe-copper rounded-full" />
                <span className="text-spe-copper text-[10px] font-semibold uppercase tracking-[0.2em]">Listen & Watch</span>
              </div>

              <h1 className="editorial-heading text-4xl sm:text-5xl lg:text-[3.5rem] mb-5 text-white leading-[1.1]">
                Podcasts <span className="text-spe-copper">&amp;</span> Talks
              </h1>

              <p className="text-lg text-white/55 max-w-xl font-light leading-relaxed mb-8">
                In-depth conversations with leading economists, conference reports, speaker series recordings, and annual dinner reviews.
              </p>

              <div className="flex items-center gap-5 text-[13px] text-white/35 font-medium">
                <span>{podcastsData.length} episodes</span>
                <span className="w-1 h-1 rounded-full bg-spe-copper/40" />
                <span>{categories.length} categories</span>
                <span className="w-1 h-1 rounded-full bg-spe-copper/40" />
                <span>Since {years[years.length - 1]}</span>
              </div>
            </div>

            {/* Waveform decoration */}
            <div className="hidden md:flex items-end gap-[3px] h-28 self-center" aria-hidden="true">
              {[0.3, 0.55, 0.85, 0.5, 1, 0.65, 0.4, 0.8, 0.45, 0.3, 0.7, 0.95, 0.55, 0.35, 0.6, 0.9, 0.5].map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full bg-gradient-to-t from-spe-copper/60 to-spe-gold/40"
                  style={{ height: `${h * 100}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ═══ FILTER BAR ═══ */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-spe-divider/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Category pills + controls */}
          <div className="flex items-center gap-2 pt-3 pb-2 sm:pb-3 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
                !selectedCategory
                  ? 'bg-spe-ink text-white shadow-sm'
                  : 'text-spe-grey hover:text-spe-ink hover:bg-spe-paper'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-spe-ink text-white shadow-sm'
                    : 'text-spe-grey hover:text-spe-ink hover:bg-spe-paper'
                }`}
              >
                {categoryLabels[cat] || cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}

            <div className="shrink-0 w-px h-5 bg-spe-divider/30 mx-1 hidden sm:block" />

            {/* Search — desktop */}
            <div className="shrink-0 relative hidden sm:block">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-spe-grey/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                aria-label="Search podcasts & talks"
                className="w-44 focus:w-56 pl-9 pr-3 py-2 text-[13px] border border-spe-divider/40 rounded-full bg-spe-paper/40 focus:outline-none focus:border-spe-blue/30 focus:bg-white transition-all duration-300"
              />
            </div>

            {/* Year */}
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
              aria-label="Filter by year"
              className="shrink-0 px-3 py-2 text-[13px] border border-spe-divider/40 rounded-full bg-white focus:outline-none focus:border-spe-blue/30 cursor-pointer hidden sm:block"
            >
              <option value="">All years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            {/* Count + Clear */}
            <div className="shrink-0 flex items-center gap-2 ml-auto">
              <span className="text-[11px] text-spe-grey font-medium tabular-nums">
                {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
              </span>
              {hasActiveFilters && (
                <button
                  onClick={() => { setSelectedCategory(null); setSelectedYear(null); setSearchQuery('') }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] text-spe-grey hover:text-spe-ink bg-spe-paper/60 hover:bg-spe-paper rounded-full transition-colors"
                  aria-label="Clear all filters"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Mobile search row */}
          <div className="pb-3 sm:hidden">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-spe-grey/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search podcasts..."
                  aria-label="Search podcasts & talks"
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-spe-divider/40 rounded-lg bg-spe-paper/40 focus:outline-none focus:border-spe-blue/30 focus:bg-white"
                />
              </div>
              <select
                value={selectedYear || ''}
                onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
                aria-label="Filter by year"
                className="px-3 py-2.5 text-sm border border-spe-divider/40 rounded-lg bg-white focus:outline-none cursor-pointer"
              >
                <option value="">Year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

        </div>
      </div>


      {/* ═══ CONTENT ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length > 0 ? (
          <section ref={gridRef}>

            {/* Featured episode — only when unfiltered */}
            {featured && (
              <div className="reveal mb-10">
                <Link
                  to={`/podcasts/${featured.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 border border-spe-divider/20"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Image */}
                    <div className="relative lg:w-2/5 h-56 sm:h-64 lg:h-auto lg:min-h-[320px] overflow-hidden">
                      {featured.images?.[0] ? (
                        <img
                          src={resolveImageUrl(featured.images[0])}
                          alt={featured.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                          loading="eager"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-spe-copper/12 via-spe-gold/6 to-spe-cream flex items-center justify-center">
                          <div className="flex items-end gap-[3px] h-16 opacity-25" aria-hidden="true">
                            {[0.4, 0.7, 1, 0.6, 0.8, 0.5, 0.9].map((h, i) => (
                              <div key={i} className="w-[3px] rounded-full bg-spe-copper" style={{ height: `${h * 100}%` }} />
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-spe-copper text-white text-[10px] font-bold uppercase tracking-[0.15em] rounded-md shadow-sm">
                        Latest
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        {featured.category && (
                          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-spe-copper">
                            {featured.category.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </span>
                        )}
                        {featured.category && featured.date && <span className="w-1 h-1 rounded-full bg-spe-divider" />}
                        {featured.date && (
                          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-spe-grey">
                            {formatDateShort(featured.date)}
                          </span>
                        )}
                      </div>

                      <h2 className="font-serif font-bold text-spe-ink text-xl sm:text-2xl lg:text-[1.75rem] leading-snug group-hover:text-spe-blue transition-colors duration-300 mb-3">
                        {featured.title}
                      </h2>

                      {featured.speakers && featured.speakers.length > 0 && (
                        <p className="text-sm font-semibold text-spe-copper mb-3">
                          {featured.speakers.map(parseSpeaker).filter(Boolean).join(', ')}
                        </p>
                      )}

                      {featured.body && (
                        <p className="text-spe-muted text-sm leading-relaxed line-clamp-3 mb-6">
                          {truncateText(stripHtml(sanitiseBodyHtml(featured.body)), 220)}
                        </p>
                      )}

                      {featured.topics && featured.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {featured.topics.map((topic: string) => (
                            <span key={topic} className="px-2.5 py-1 text-[10px] font-semibold tracking-wide rounded-full bg-spe-cream text-spe-muted border border-spe-divider/50">
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="inline-flex items-center gap-2 text-spe-copper text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span>Listen now</span>
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
              {gridItems.map(item => (
                <div key={item.slug} className="reveal h-full">
                  <PodcastCard
                    to={`/podcasts/${item.slug}`}
                    title={item.title}
                    date={item.date}
                    category={item.category}
                    excerpt={item.body}
                    image={item.images?.[0]}
                    speakers={item.speakers}
                    topics={item.topics}
                    hasMedia={!!(item.mediaUrls && item.mediaUrls.length > 0)}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : (
          /* ═══ EMPTY STATE ═══ */
          <div className="text-center py-24">
            <div className="flex items-end justify-center gap-[3px] h-14 mb-6 opacity-20" aria-hidden="true">
              {[0.3, 0.5, 0.8, 0.4, 0.6, 0.9, 0.5, 0.3, 0.7].map((h, i) => (
                <div key={i} className="w-[3px] rounded-full bg-spe-divider" style={{ height: `${h * 100}%` }} />
              ))}
            </div>
            <p className="text-spe-grey text-lg font-medium mb-1">No podcasts or talks found</p>
            <p className="text-spe-grey/70 text-sm">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
