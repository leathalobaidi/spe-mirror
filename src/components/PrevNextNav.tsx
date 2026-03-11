import { Link } from 'react-router-dom'

interface NavItem {
  slug: string
  title: string
}

interface PrevNextNavProps {
  items: NavItem[]
  currentSlug: string
  /** Renders the slug as the `to` path — e.g. item.slug already includes the full route */
  slugToPath?: (slug: string) => string
}

/**
 * Prev/Next navigation for sequential content browsing.
 * Items are expected newest-first, so "Newer" = lower index, "Older" = higher index.
 */
export default function PrevNextNav({ items, currentSlug, slugToPath }: PrevNextNavProps) {
  const currentIndex = items.findIndex(item => item.slug === currentSlug)
  if (currentIndex === -1) return null

  const newer = currentIndex > 0 ? items[currentIndex - 1] : null
  const older = currentIndex < items.length - 1 ? items[currentIndex + 1] : null

  if (!newer && !older) return null

  const toPath = slugToPath ?? ((slug: string) => `/${slug}`)

  return (
    <nav
      aria-label="Previous and next"
      className="mt-12 pt-8 border-t border-spe-divider/15 grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {newer ? (
        <Link
          to={toPath(newer.slug)}
          className="group flex items-start gap-3 p-4 rounded-xl bg-spe-paper/40 hover:bg-spe-paper/70 transition-colors"
        >
          <svg
            className="w-5 h-5 mt-0.5 text-spe-ink/30 group-hover:text-spe-blue transition-colors flex-shrink-0"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-spe-ink/40">Newer</span>
            <span className="block text-sm font-medium text-spe-ink group-hover:text-spe-blue transition-colors line-clamp-2 mt-0.5">
              {newer.title}
            </span>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {older ? (
        <Link
          to={toPath(older.slug)}
          className="group flex items-start gap-3 p-4 rounded-xl bg-spe-paper/40 hover:bg-spe-paper/70 transition-colors sm:text-right sm:flex-row-reverse"
        >
          <svg
            className="w-5 h-5 mt-0.5 text-spe-ink/30 group-hover:text-spe-blue transition-colors flex-shrink-0"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-spe-ink/40">Older</span>
            <span className="block text-sm font-medium text-spe-ink group-hover:text-spe-blue transition-colors line-clamp-2 mt-0.5">
              {older.title}
            </span>
          </div>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}
