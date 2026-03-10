import { Link } from 'react-router-dom'

interface Props {
  title: string
  subtitle?: string
  linkTo?: string
  linkLabel?: string
  className?: string
}

export default function SectionHeading({ title, subtitle, linkTo, linkLabel = 'View all', className = '' }: Props) {
  return (
    <div className={`flex items-end justify-between mb-10 ${className}`}>
      <div>
        {subtitle && (
          <p className="section-label mb-3">{subtitle}</p>
        )}
        <h2 className="editorial-heading text-spe-ink" style={{ fontSize: 'clamp(1.5rem, 3vw + 0.25rem, 2rem)' }}>{title}</h2>
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="hidden sm:flex items-center gap-2 text-sm font-semibold text-spe-blue hover:text-spe-deep transition-colors group"
        >
          {linkLabel}
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      )}
    </div>
  )
}
