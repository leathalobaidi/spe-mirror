import { useState, useMemo } from 'react'
import { getYear, getUniqueYears, stripHtml } from '../utils/helpers'

interface FilterableItem {
  title: string
  date?: string | null
  category?: string | null
  body?: string | null
  [key: string]: unknown
}

export function useFilteredData<T extends FilterableItem>(items: T[]) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const years = useMemo(
    () => getUniqueYears(items.map(i => i.date || '').filter(Boolean)),
    [items]
  )

  const categories = useMemo(() => {
    const cats = items.map(i => i.category).filter(Boolean) as string[]
    return [...new Set(cats)].sort()
  }, [items])

  const filtered = useMemo(() => {
    let result = items

    if (selectedYear) {
      result = result.filter(i => i.date && getYear(i.date) === selectedYear)
    }

    if (selectedCategory) {
      result = result.filter(i => i.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(i =>
        i.title.toLowerCase().includes(q) ||
        (i.body && stripHtml(i.body).toLowerCase().includes(q))
      )
    }

    return result
  }, [items, selectedYear, selectedCategory, searchQuery])

  return {
    filtered,
    searchQuery,
    setSearchQuery,
    selectedYear,
    setSelectedYear,
    selectedCategory,
    setSelectedCategory,
    years,
    categories,
  }
}
