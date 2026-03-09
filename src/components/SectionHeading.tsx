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
    <div className={`flex items-end justify-between mb-8 ${className}`}>
      <div>
        <p className="editorial-subheading text-spe-blue mb-2">{subtitle || ''}</p>
        <h2 className="editorial-heading text-2xl sm:text-3xl text-spe-dark">{title}</h2>
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors group"
        >
          {linkLabel}
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  )
}
