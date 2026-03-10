import { useState } from 'react'

interface Props {
  years: number[]
  categories?: string[]
  selectedYear: number | null
  selectedCategory: string | null
  searchQuery: string
  onYearChange: (year: number | null) => void
  onCategoryChange: (cat: string | null) => void
  onSearchChange: (query: string) => void
  totalResults: number
  label?: string
}

export default function FilterBar({
  years, categories, selectedYear, selectedCategory, searchQuery,
  onYearChange, onCategoryChange, onSearchChange, totalResults, label = 'items'
}: Props) {
  const [searchFocused, setSearchFocused] = useState(false)

  const hasActiveFilters = selectedYear !== null || selectedCategory !== null || searchQuery.length > 0

  const clearAll = () => {
    onYearChange(null)
    onCategoryChange(null)
    onSearchChange('')
  }

  return (
    <div className="bg-white border-b border-spe-divider/30 sticky top-16 z-30 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search */}
          <div className={`relative flex-1 max-w-md transition-all ${searchFocused ? 'ring-2 ring-spe-blue/30' : ''} rounded-lg`}>
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-spe-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder={`Search ${label}...`}
              aria-label={`Search ${label}`}
              className="w-full pl-10 pr-4 py-2.5 text-base border border-spe-divider/50 rounded-lg bg-spe-paper/50 focus:outline-none focus:bg-white focus:border-spe-blue/30 transition-colors"
            />
          </div>

          {/* Year filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedYear || ''}
              onChange={(e) => onYearChange(e.target.value ? Number(e.target.value) : null)}
              aria-label="Filter by year"
              className="px-3 py-2.5 text-base border border-spe-divider/50 rounded-lg bg-white focus:outline-none focus:border-spe-blue/30 cursor-pointer"
            >
              <option value="">All years</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            {/* Category filter */}
            {categories && categories.length > 0 && (
              <select
                value={selectedCategory || ''}
                onChange={(e) => onCategoryChange(e.target.value || null)}
                aria-label="Filter by category"
                className="px-3 py-2.5 text-base border border-spe-divider/50 rounded-lg bg-white focus:outline-none focus:border-spe-blue/30 cursor-pointer"
              >
                <option value="">All categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>
                    {c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            )}

            {/* Results count */}
            <span className="text-xs text-spe-grey font-medium ml-1">
              {totalResults} {totalResults === 1 ? label.replace(/s$/, '') : label}
            </span>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs text-spe-grey hover:text-spe-ink bg-spe-paper/60 hover:bg-spe-paper rounded-md transition-colors min-h-[44px] min-w-[44px] justify-center"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
