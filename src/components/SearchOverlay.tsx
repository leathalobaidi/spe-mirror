import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { stripHtml, truncateText, formatDateShort } from '../utils/helpers'

// Import all searchable data
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
import pagesData from '../data/pages.json'

interface SearchItem {
  title: string
  slug: string
  date?: string
  category: string
  path: string
  body?: string
}

export default function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Build search index once
  const searchIndex = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = []
    eventsData.forEach((e: any) => items.push({ title: e.title, slug: e.slug, date: e.date, category: 'Event', path: `/events/${e.slug.split('/').pop()}`, body: e.body }))
    podcastsData.forEach((e: any) => items.push({ title: e.title, slug: e.slug, date: e.date, category: 'Podcast', path: `/podcasts/${e.slug.split('/').pop()}`, body: e.body }))
    newsData.forEach((e: any) => items.push({ title: e.title, slug: e.slug, date: e.date, category: 'News', path: `/news/${e.slug}`, body: e.body }))
    bookReviewsData.forEach((e: any) => items.push({ title: e.title, slug: e.slug, date: e.date, category: 'Book Review', path: `/reading-room/book-reviews/${e.slug}`, body: e.body }))
    articlesData.forEach((e: any) => items.push({ title: e.title, slug: e.slug, date: e.date, category: 'Article', path: `/reading-room/articles/${e.slug}`, body: e.body }))
    rybEssaysData.forEach((e: any) => items.push({ title: e.title, slug: e.slug, date: e.date, category: 'Essay', path: `/reading-room/rybczynski-essays/${e.slug}`, body: e.body }))
    eveningTalksData.forEach((e: any) => items.push({ title: e.title, slug: e.slug, date: e.date, category: 'Talk', path: `/speakers/evening-talks/${e.slug}`, body: e.body }))
    blogsData.forEach((e: any) => items.push({ title: e.title, slug: e.slug, date: e.date, category: 'Blog', path: `/blogs/${e.slug}`, body: e.body }))
    conferenceReportsData.forEach((e: any) => items.push({ title: e.title, slug: e.slug, category: 'Conference', path: `/speakers/conference-reports/${e.slug}`, body: e.body }))
    dinnerReviewsData.forEach((e: any) => items.push({ title: e.title, slug: e.slug, category: 'Dinner', path: `/speakers/dinner-reviews/${e.slug}`, body: e.body }))
    pagesData.forEach((e: any) => items.push({ title: e.title, slug: e.slug, category: 'Page', path: `/${e.slug}`, body: e.body }))
    return items
  }, [])

  // Filter results
  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return searchIndex
      .filter(item => {
        const titleMatch = item.title.toLowerCase().includes(q)
        const bodyText = item.body ? stripHtml(item.body).toLowerCase() : ''
        return titleMatch || bodyText.includes(q)
      })
      .slice(0, 8)
  }, [query, searchIndex])

  const close = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setSelectedIndex(0)
  }, [])

  // Open/close handlers
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => {
        if (prev) {
          setQuery('')
          setSelectedIndex(0)
        }
        return !prev
      })
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        handleToggle()
      }
    }
    document.addEventListener('toggle-search', handleToggle)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('toggle-search', handleToggle)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Focus input when opened + lock body scroll
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Focus trap: keep Tab cycling within the dialog
  useEffect(() => {
    if (!isOpen) return
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'input, button, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [isOpen, close])

  // Keyboard navigation within results
  const handleInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      navigate(results[selectedIndex].path)
      close()
    }
  }

  // Category colors
  const catColors: Record<string, string> = {
    'Event': 'bg-spe-blue/10 text-spe-deep2',
    'Podcast': 'bg-spe-cream text-spe-copper',
    'News': 'bg-spe-paper text-spe-muted',
    'Book Review': 'bg-spe-cream text-spe-burgundy',
    'Article': 'bg-spe-blue/8 text-spe-deep2',
    'Essay': 'bg-spe-cream text-spe-ink',
    'Talk': 'bg-spe-cream text-spe-copper',
    'Blog': 'bg-spe-blue/8 text-spe-deep2',
    'Conference': 'bg-spe-cream text-spe-ink',
    'Dinner': 'bg-spe-cream text-spe-copper',
    'Page': 'bg-spe-paper text-spe-muted',
  }

  // Combobox expansion state
  const hasResults = query.trim().length > 0 && results.length > 0
  const activeDescendant = hasResults ? `search-result-${selectedIndex}` : undefined

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] search-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Site search"
      onClick={close}
    >
      <div className="absolute inset-0 bg-spe-ink/60 backdrop-blur-sm" aria-hidden="true" />
      <div
        ref={dialogRef}
        className="relative max-w-2xl mx-auto mt-[12vh] px-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden search-overlay-content border border-spe-divider/20">
          {/* Search input — combobox pattern */}
          <div className="flex items-center gap-3 px-5 border-b border-spe-divider/20">
            <svg className="w-5 h-5 text-spe-grey flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              role="combobox"
              aria-expanded={hasResults}
              aria-controls="search-results-listbox"
              aria-activedescendant={activeDescendant}
              aria-autocomplete="list"
              aria-label="Search site content"
              value={query}
              onChange={e => { setQuery(e.target.value); setSelectedIndex(0) }}
              onKeyDown={handleInputKey}
              placeholder="Search events, podcasts, articles, books..."
              className="flex-1 py-4 text-base text-spe-ink placeholder:text-spe-grey/60 focus:outline-none bg-transparent"
            />
            <button
              onClick={close}
              className="hidden sm:inline-flex items-center px-2 py-1 text-xs text-spe-grey border border-spe-divider/40 rounded-md bg-spe-paper/50 hover:bg-spe-paper transition-colors"
              aria-label="Close search"
            >
              ESC
            </button>
          </div>

          {/* Results listbox */}
          {query.trim() && (
            <div className="max-h-[50vh] overflow-y-auto">
              {results.length > 0 ? (
                <ul id="search-results-listbox" role="listbox" aria-label="Search results" className="py-2">
                  {results.map((item, i) => (
                    <li
                      key={`${item.category}-${item.slug}`}
                      id={`search-result-${i}`}
                      role="option"
                      aria-selected={i === selectedIndex}
                      onClick={() => { navigate(item.path); close() }}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`w-full text-left px-5 py-3 flex items-start gap-3 transition-colors cursor-pointer ${
                        i === selectedIndex ? 'bg-spe-blue/5' : 'hover:bg-spe-paper/50'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${catColors[item.category] || 'bg-spe-paper text-spe-muted'}`}>
                            {item.category}
                          </span>
                          {item.date && (
                            <span className="text-xs text-spe-grey">{formatDateShort(item.date)}</span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-spe-ink truncate">{item.title}</p>
                        {item.body && (
                          <p className="text-xs text-spe-muted mt-0.5 line-clamp-1">
                            {truncateText(stripHtml(item.body), 100)}
                          </p>
                        )}
                      </div>
                      {i === selectedIndex && (
                        <svg className="w-4 h-4 text-spe-blue mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-12 text-center" role="status">
                  <p className="text-spe-grey text-sm">No results for &ldquo;{query}&rdquo;</p>
                  <p className="text-spe-grey/60 text-xs mt-1">Try different keywords</p>
                </div>
              )}
              {/* Link to full Explore page */}
              <div className="border-t border-spe-divider/20 px-5 py-3">
                <button
                  onClick={() => { navigate(`/explore?q=${encodeURIComponent(query)}`); close() }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-spe-blue hover:text-spe-deep transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Search with filters on Explore page
                </button>
              </div>
            </div>
          )}

          {/* Live region — announces result count to screen readers */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {query.trim() && (
              results.length > 0
                ? `${results.length} result${results.length !== 1 ? 's' : ''} found`
                : `No results for ${query}`
            )}
          </div>

          {/* Footer hint */}
          {!query.trim() && (
            <div className="px-5 py-6 text-center">
              <p className="text-sm text-spe-grey/60">
                Search across {searchIndex.length.toLocaleString()} events, podcasts, articles, and more
              </p>
              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-spe-grey/40">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-spe-paper rounded border border-spe-divider/30 text-[10px]">&uarr;&darr;</kbd> navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-spe-paper rounded border border-spe-divider/30 text-[10px]">&crarr;</kbd> select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-spe-paper rounded border border-spe-divider/30 text-[10px]">esc</kbd> close
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
