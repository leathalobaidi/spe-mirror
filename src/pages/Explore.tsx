import { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { stripHtml, truncateText, formatDateShort, getYear, getUniqueYears, sanitiseBodyHtml } from '../utils/helpers'
import { useSEO } from '../hooks/useSEO'
import { breadcrumbSchema, collectionPageSchema } from '../utils/seoSchemas'
import ContentCard from '../components/ContentCard'

// Import all content sources
import eventsData from '../data/events.json'
import podcastsData from '../data/podcasts.json'
import newsData from '../data/news.json'
import bookReviewsData from '../data/book-reviews-index.json'
import articlesData from '../data/articles.json'
import rybEssaysData from '../data/ryb-essays.json'
import eveningTalksData from '../data/evening-talks.json'
import blogsData from '../data/blogs.json'
import conferenceReportsData from '../data/conference-reports.json'
import dinnerReviewsData from '../data/dinner-reviews.json'

/* ── Unified content item type ─────────────────────── */

interface ExploreItem {
  title: string
  slug: string
  date?: string
  contentType: string
  contentTypeLabel: string
  path: string
  body?: string
  image?: string
  topics: string[]
  speaker?: string
}

/* ── Content type config ───────────────────────────── */

const CONTENT_TYPES: { key: string; label: string; cardCategory: string }[] = [
  { key: 'event', label: 'Events', cardCategory: 'event' },
  { key: 'podcast', label: 'Podcasts', cardCategory: 'podcast' },
  { key: 'evening-talk', label: 'Evening Talks', cardCategory: 'speaker-series' },
  { key: 'article', label: 'Articles', cardCategory: 'article' },
  { key: 'book-review', label: 'Book Reviews', cardCategory: 'book-review' },
  { key: 'ryb-essay', label: 'Rybczynski Essays', cardCategory: 'article' },
  { key: 'blog', label: 'Blog Posts', cardCategory: 'article' },
  { key: 'news', label: 'News', cardCategory: 'news' },
  { key: 'conference-report', label: 'Conference Reports', cardCategory: 'conference-report' },
  { key: 'dinner-review', label: 'Dinner Reviews', cardCategory: 'dinner-review' },
]

const contentTypeMap = new Map(CONTENT_TYPES.map(ct => [ct.key, ct]))

/* ── Build the unified index ───────────────────────── */

function buildIndex(): ExploreItem[] {
  const items: ExploreItem[] = []

  const push = (raw: any, contentType: string, pathFn: (slug: string) => string) => {
    const ct = contentTypeMap.get(contentType)!
    const slug = raw.slug
    items.push({
      title: raw.title || '',
      slug,
      date: raw.date || undefined,
      contentType,
      contentTypeLabel: ct.label,
      path: pathFn(slug),
      body: raw.body || undefined,
      image: raw.images?.[0] || raw.coverImage || undefined,
      topics: Array.isArray(raw.topics) ? raw.topics : [],
      speaker: Array.isArray(raw.speakers) && raw.speakers.length > 0
        ? raw.speakers[0].replace(/^Speaker:\s*/i, '').split(',')[0].trim()
        : raw.reviewer || raw.author || undefined,
    })
  }

  ;(eventsData as any[]).forEach(e => push(e, 'event', s => `/events/${s}`))
  ;(podcastsData as any[]).forEach(e => push(e, 'podcast', s => `/podcasts/${s}`))
  ;(eveningTalksData as any[]).forEach(e => push(e, 'evening-talk', s => `/speakers/evening-talks/${s}`))
  ;(articlesData as any[]).forEach(e => push(e, 'article', s => `/reading-room/articles/${s}`))
  ;(bookReviewsData as any[]).forEach(e => push(e, 'book-review', s => `/reading-room/book-reviews/${s}`))
  ;(rybEssaysData as any[]).forEach(e => push(e, 'ryb-essay', s => `/reading-room/rybczynski-essays/${s}`))
  ;(blogsData as any[]).forEach(e => push(e, 'blog', s => `/blogs/${s}`))
  ;(newsData as any[]).forEach(e => push(e, 'news', s => `/news/${s}`))
  ;(conferenceReportsData as any[]).forEach(e => push(e, 'conference-report', s => `/speakers/conference-reports/${s}`))
  ;(dinnerReviewsData as any[]).forEach(e => push(e, 'dinner-review', s => `/speakers/dinner-reviews/${s}`))

  // Sort newest first
  items.sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return b.date.localeCompare(a.date)
  })

  return items
}

/* ── Pagination ────────────────────────────────────── */

const PAGE_SIZE = 24

/* ── Topic badge colors ────────────────────────────── */

const topicColors: Record<string, string> = {
  'Macroeconomics': 'bg-spe-blue/10 text-spe-deep2',
  'Monetary Policy': 'bg-spe-deep/10 text-spe-deep',
  'Fiscal Policy': 'bg-spe-gold/15 text-spe-copper',
  'Financial Markets': 'bg-spe-ink/8 text-spe-ink',
  'Labour Markets': 'bg-spe-teal/10 text-spe-teal',
  'Trade & Globalisation': 'bg-spe-copper/10 text-spe-copper',
  'Housing': 'bg-spe-burgundy/10 text-spe-burgundy',
  'Inequality': 'bg-rose-50 text-rose-700',
  'Climate & Energy': 'bg-emerald-50 text-emerald-700',
  'Technology': 'bg-violet-50 text-violet-700',
  'Public Policy': 'bg-spe-cream text-spe-ink',
  'Economic History': 'bg-amber-50 text-amber-700',
  'Health': 'bg-sky-50 text-sky-700',
  'Geopolitics': 'bg-slate-100 text-slate-700',
  'Careers & Profession': 'bg-spe-paper text-spe-muted',
  'Economic Measurement': 'bg-indigo-50 text-indigo-700',
}

/* ── Component ─────────────────────────────────────── */

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams()
  const gridRef = useRef<HTMLDivElement>(null)

  // Build index once (needed for item count in SEO)
  const allItems = useMemo(() => buildIndex(), [])

  useSEO({
    title: 'Explore All Content',
    description: `Browse ${allItems.length.toLocaleString()} events, podcasts, articles, and publications from the SPE — filter by topic, year, or content type.`,
    type: 'website',
    noindex: false,
    schema: [
      collectionPageSchema({
        name: 'Explore All Content',
        description: 'Unified content discovery page for the Society of Professional Economists.',
        path: '/explore',
        itemCount: allItems.length,
      }),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Explore' },
      ]),
    ],
  })

  // Read filter state from URL
  const query = searchParams.get('q') || ''
  const yearParam = searchParams.get('year')
  const selectedYear = yearParam ? Number(yearParam) : null
  const selectedType = searchParams.get('type') || null
  const selectedTopic = searchParams.get('topic') || null

  // Page state (not in URL for simplicity)
  const [page, setPage] = useState(1)

  // Reset page when filters change
  useEffect(() => { setPage(1) }, [query, selectedYear, selectedType, selectedTopic])

  // Extract unique years and topics for filter dropdowns
  const years = useMemo(
    () => getUniqueYears(allItems.map(i => i.date || '').filter(Boolean)),
    [allItems]
  )

  const allTopics = useMemo(() => {
    const set = new Set<string>()
    allItems.forEach(i => i.topics.forEach(t => set.add(t)))
    return [...set].sort()
  }, [allItems])

  // Apply filters
  const filtered = useMemo(() => {
    let result = allItems

    if (selectedYear) {
      result = result.filter(i => i.date && getYear(i.date) === selectedYear)
    }

    if (selectedType) {
      result = result.filter(i => i.contentType === selectedType)
    }

    if (selectedTopic) {
      result = result.filter(i => i.topics.includes(selectedTopic))
    }

    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(i => {
        if (i.title.toLowerCase().includes(q)) return true
        if (i.speaker && i.speaker.toLowerCase().includes(q)) return true
        if (i.body) {
          const bodyText = stripHtml(i.body).toLowerCase()
          return bodyText.includes(q)
        }
        return false
      })
    }

    return result
  }, [allItems, selectedYear, selectedType, selectedTopic, query])

  // Paginated results
  const paginated = useMemo(
    () => filtered.slice(0, page * PAGE_SIZE),
    [filtered, page]
  )

  const hasMore = paginated.length < filtered.length

  // Filter counts for facets
  const typeCounts = useMemo(() => {
    const counts = new Map<string, number>()
    filtered.forEach(i => counts.set(i.contentType, (counts.get(i.contentType) || 0) + 1))
    return counts
  }, [filtered])

  const topicCounts = useMemo(() => {
    const counts = new Map<string, number>()
    filtered.forEach(i => i.topics.forEach(t => counts.set(t, (counts.get(t) || 0) + 1)))
    return counts
  }, [filtered])

  // Update URL params helper
  const setFilter = (key: string, value: string | null) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) {
        next.set(key, value)
      } else {
        next.delete(key)
      }
      return next
    }, { replace: true })
  }

  const hasActiveFilters = query.length > 0 || selectedYear !== null || selectedType !== null || selectedTopic !== null

  const clearAll = () => {
    setSearchParams({}, { replace: true })
  }

  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <div>
      {/* Hero header */}
      <div className="bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">Explore</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light">
            Search and filter across {allItems.length.toLocaleString()} events, podcasts, articles,
            book reviews, and more — spanning seven decades of economic thought.
          </p>
        </div>
      </div>

      {/* Filter bar — sticky */}
      <div className="bg-white border-b border-spe-divider/30 sticky top-16 z-30 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-3">
            {/* Row 1: Search + dropdowns */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Search input */}
              <div className={`relative flex-1 max-w-md transition-all ${searchFocused ? 'ring-2 ring-spe-blue/30' : ''} rounded-lg`}>
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-spe-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={e => setFilter('q', e.target.value || null)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search by title, speaker, or keyword..."
                  aria-label="Search all content"
                  className="w-full pl-10 pr-4 py-2.5 text-base border border-spe-divider/50 rounded-lg bg-spe-paper/50 focus:outline-none focus:bg-white focus:border-spe-blue/30 transition-colors"
                />
              </div>

              {/* Filter dropdowns */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Year */}
                <select
                  value={selectedYear || ''}
                  onChange={e => setFilter('year', e.target.value || null)}
                  aria-label="Filter by year"
                  className="px-3 py-2.5 text-sm border border-spe-divider/50 rounded-lg bg-white focus:outline-none focus:border-spe-blue/30 cursor-pointer"
                >
                  <option value="">All years</option>
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>

                {/* Content type */}
                <select
                  value={selectedType || ''}
                  onChange={e => setFilter('type', e.target.value || null)}
                  aria-label="Filter by content type"
                  className="px-3 py-2.5 text-sm border border-spe-divider/50 rounded-lg bg-white focus:outline-none focus:border-spe-blue/30 cursor-pointer"
                >
                  <option value="">All types</option>
                  {CONTENT_TYPES.map(ct => {
                    const count = typeCounts.get(ct.key) || 0
                    return (
                      <option key={ct.key} value={ct.key}>
                        {ct.label} ({count})
                      </option>
                    )
                  })}
                </select>

                {/* Topic */}
                <select
                  value={selectedTopic || ''}
                  onChange={e => setFilter('topic', e.target.value || null)}
                  aria-label="Filter by topic"
                  className="px-3 py-2.5 text-sm border border-spe-divider/50 rounded-lg bg-white focus:outline-none focus:border-spe-blue/30 cursor-pointer"
                >
                  <option value="">All topics</option>
                  {allTopics.map(t => {
                    const count = topicCounts.get(t) || 0
                    return count > 0 ? (
                      <option key={t} value={t}>
                        {t} ({count})
                      </option>
                    ) : null
                  })}
                </select>

                {/* Results count */}
                <span className="text-xs text-spe-grey font-medium ml-1">
                  {filtered.length.toLocaleString()} {filtered.length === 1 ? 'result' : 'results'}
                </span>

                {/* Clear */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAll}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs text-spe-grey hover:text-spe-ink bg-spe-paper/60 hover:bg-spe-paper rounded-md transition-colors min-h-[44px] min-w-[44px] justify-center"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Row 2: Active topic pills (when a topic is selected, show related topics) */}
            {selectedTopic && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-spe-grey font-medium">Topic:</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${topicColors[selectedTopic] || 'bg-spe-paper text-spe-muted'}`}>
                  {selectedTopic}
                  <button
                    onClick={() => setFilter('topic', null)}
                    className="hover:text-spe-ink transition-colors"
                    aria-label={`Remove ${selectedTopic} filter`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {paginated.length > 0 ? (
          <>
            {/* Topic overview — shown when no filters active, as discovery aids */}
            {!hasActiveFilters && (
              <div className="mb-10">
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-spe-grey mb-4">Browse by topic</h2>
                <div className="flex flex-wrap gap-2">
                  {allTopics.map(topic => {
                    const count = topicCounts.get(topic) || 0
                    if (count === 0) return null
                    return (
                      <button
                        key={topic}
                        onClick={() => setFilter('topic', topic)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:ring-1 hover:ring-spe-blue/30 ${topicColors[topic] || 'bg-spe-paper text-spe-muted'}`}
                      >
                        {topic}
                        <span className="text-[10px] opacity-60">({count})</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Content grid */}
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((item, i) => (
                <article key={`${item.contentType}-${item.slug}-${i}`}>
                  <ContentCard
                    to={item.path}
                    title={item.title}
                    date={item.date}
                    category={contentTypeMap.get(item.contentType)?.cardCategory || item.contentType}
                    excerpt={item.body}
                    image={item.image}
                    speaker={item.speaker}
                  />
                  {/* Topic pills under the card */}
                  {item.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 px-1">
                      {item.topics.map(t => (
                        <button
                          key={t}
                          onClick={() => setFilter('topic', t)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors hover:ring-1 hover:ring-spe-blue/20 ${topicColors[t] || 'bg-spe-paper text-spe-muted'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold text-spe-blue border border-spe-blue/30 rounded-xl hover:bg-spe-blue/5 transition-colors"
                >
                  Show more
                  <span className="text-xs text-spe-grey font-normal">
                    ({filtered.length - paginated.length} remaining)
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty state */
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-spe-divider mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg text-spe-muted font-serif">No results found</p>
            <p className="text-sm text-spe-grey mt-2 max-w-md mx-auto">
              Try adjusting your filters or search terms. You can also{' '}
              <button onClick={clearAll} className="text-spe-blue hover:underline">
                clear all filters
              </button>{' '}
              to start fresh.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
