import { Link } from 'react-router-dom'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface Props {
  items: BreadcrumbItem[]
  className?: string
  /** Use "light" variant on dark gradient headers */
  variant?: 'default' | 'light'
}

export default function Breadcrumbs({ items, className = '', variant = 'default' }: Props) {
  if (items.length === 0) return null

  const isLight = variant === 'light'
  const listColor = isLight ? 'text-white/60' : 'text-spe-grey'
  const sepColor = isLight ? 'text-white/30' : 'text-spe-grey/40'
  const currentColor = isLight ? 'text-white/90 font-medium' : 'text-spe-ink/70 font-medium'
  const linkHover = isLight ? 'hover:text-white' : 'hover:text-spe-blue'

  return (
    <nav aria-label="Breadcrumb" className={`font-sans ${className}`}>
      <ol className={`flex items-center gap-1.5 text-xs ${listColor}`}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          const isFirst = i === 0

          return (
            <li key={i} className="flex items-center gap-1.5">
              {/* Chevron separator (not before the first item) */}
              {i > 0 && (
                <svg
                  className={`w-3 h-3 ${sepColor} flex-shrink-0`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              )}

              {isLast || !item.to ? (
                <span className={`${currentColor} truncate max-w-[200px] flex items-center gap-1`}>
                  {isFirst && <HomeIcon />}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className={`${linkHover} transition-colors duration-150 truncate max-w-[200px] flex items-center gap-1`}
                >
                  {isFirst && <HomeIcon />}
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function HomeIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
      />
    </svg>
  )
}
