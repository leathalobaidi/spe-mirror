import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDateShort, truncateText, stripHtml } from '../utils/helpers'

interface Props {
  to: string
  title: string
  date?: string
  category?: string
  excerpt?: string
  image?: string
  imageAlt?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  /** Optional speaker/author name shown under the title */
  speaker?: string
}

const categoryColors: Record<string, string> = {
  podcast: 'bg-purple-100 text-purple-700',
  'speaker-series': 'bg-spe-btn text-spe-btn-text',
  'conference-report': 'bg-emerald-100 text-emerald-700',
  'dinner-review': 'bg-amber-100 text-amber-700',
  'book-review': 'bg-rose-100 text-rose-700',
  article: 'bg-sky-100 text-sky-700',
  event: 'bg-spe-light/30 text-spe-deep2',
  news: 'bg-slate-100 text-slate-700',
  'salary-survey': 'bg-teal-100 text-teal-700',
}

/** Gradient backgrounds for placeholder thumbnails when no image is available */
const categoryGradients: Record<string, string> = {
  podcast: 'from-purple-500/20 via-purple-400/10 to-purple-300/5',
  'speaker-series': 'from-spe-blue/20 via-spe-blue/10 to-spe-accent/5',
  'conference-report': 'from-emerald-500/20 via-emerald-400/10 to-emerald-300/5',
  'dinner-review': 'from-amber-500/20 via-amber-400/10 to-amber-300/5',
  'book-review': 'from-rose-500/20 via-rose-400/10 to-rose-300/5',
  article: 'from-sky-500/20 via-sky-400/10 to-sky-300/5',
  event: 'from-spe-deep/20 via-spe-blue/10 to-spe-accent/5',
  news: 'from-slate-500/20 via-slate-400/10 to-slate-300/5',
  'salary-survey': 'from-teal-500/20 via-teal-400/10 to-teal-300/5',
}

/** SVG icon paths by category for placeholders */
const categoryIcons: Record<string, string> = {
  podcast: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
  'speaker-series': 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  'conference-report': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'dinner-review': 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 013 15.546V12a9 9 0 0118 0v3.546z',
  article: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  event: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  news: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
  'salary-survey': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
}

export default function ContentCard({
  to, title, date, category, excerpt, image, imageAlt, className = '', size = 'md', speaker
}: Props) {
  const [imgError, setImgError] = useState(false)
  const colorClass = category ? (categoryColors[category] || 'bg-spe-bg text-spe-muted') : ''
  const strippedExcerpt = excerpt ? truncateText(stripHtml(excerpt), size === 'lg' ? 200 : 120) : ''
  const gradientClass = category ? (categoryGradients[category] || 'from-spe-bg to-white') : 'from-spe-bg to-white'
  const iconPath = category ? categoryIcons[category] : null
  const imageHeight = size === 'lg' ? 'h-64' : size === 'sm' ? 'h-36' : 'h-48'

  return (
    <Link
      to={to}
      className={`content-card group block h-full flex flex-col bg-white rounded-xl overflow-hidden border border-spe-border/30 hover:border-spe-blue/20 hover:shadow-lg transition-shadow ${className}`}
    >
      {/* Image or Placeholder */}
      <div className={`relative overflow-hidden ${imageHeight}`}>
        {image && !imgError ? (
          <img
            src={image}
            alt={imageAlt || title}
            width={500}
            height={333}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
            {iconPath && (
              <svg className="w-12 h-12 text-spe-border/40 group-hover:text-spe-blue/30 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d={iconPath} />
              </svg>
            )}
          </div>
        )}
        {category && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${colorClass} ${!image || imgError ? 'backdrop-blur-sm' : ''}`}>
            {category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        )}
        {category === 'event' && date && new Date(date) >= new Date(new Date().toDateString()) && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-sm">
            Upcoming
          </span>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 ${size === 'lg' ? 'p-6' : size === 'sm' ? 'p-3' : 'p-4'}`}>
        {date && (
          <p className="editorial-subheading text-spe-grey mb-1.5">
            {formatDateShort(date)}
          </p>
        )}
        <h3 className={`font-serif font-semibold text-spe-dark group-hover:text-spe-blue transition-colors leading-snug ${
          size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-sm' : 'text-base'
        }`}>
          {title}
        </h3>
        {speaker && (
          <p className={`mt-1 font-medium text-spe-blue/70 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
            {speaker}
          </p>
        )}
        {strippedExcerpt && (
          <p className={`mt-2 text-spe-muted leading-relaxed line-clamp-3 ${
            size === 'sm' ? 'text-xs' : 'text-sm'
          }`}>
            {strippedExcerpt}
          </p>
        )}
      </div>
    </Link>
  )
}
