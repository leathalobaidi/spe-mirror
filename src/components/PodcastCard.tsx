import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDateShort, truncateText, stripHtml, sanitiseBodyHtml, resolveImageUrl } from '../utils/helpers'

interface Props {
  to: string
  title: string
  date?: string
  category?: string
  excerpt?: string
  image?: string
  speakers?: string[]
  topics?: string[]
  hasMedia?: boolean
}

export function parseSpeaker(raw: string): string {
  return raw.replace(/^Speaker:\s*/i, '')
}

const categoryLabels: Record<string, string> = {
  podcast: 'Podcast',
  'speaker-series': 'Speaker Series',
  'conference-report': 'Conference Report',
  'dinner-review': 'Dinner Review',
}

export default function PodcastCard({
  to, title, date, category, excerpt, image, speakers, topics, hasMedia
}: Props) {
  const [imgError, setImgError] = useState(false)
  const resolvedImage = resolveImageUrl(image)
  const speakerNames = speakers?.map(parseSpeaker).filter(Boolean) || []
  const strippedExcerpt = excerpt ? truncateText(stripHtml(sanitiseBodyHtml(excerpt)), 110) : ''

  return (
    <Link to={to} className="podcast-card group block h-full flex flex-col">
      {/* Image / Waveform placeholder */}
      <div className="relative overflow-hidden aspect-[16/10] bg-gradient-to-br from-spe-ink/8 via-spe-deep/4 to-spe-paper">
        {resolvedImage && !imgError ? (
          <img
            src={resolvedImage}
            alt={title}
            width={500}
            height={312}
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-spe-copper/8 via-spe-gold/4 to-spe-paper">
            <div className="flex items-end gap-[3px] h-10 opacity-40">
              {[0.3, 0.7, 0.4, 0.9, 0.5, 0.8, 0.35, 0.65, 0.45, 0.75].map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full bg-spe-copper waveform-bar"
                  style={{ height: `${h * 100}%`, animationDelay: `${i * 0.09}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Play indicator on hover */}
        {hasMedia && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-spe-ink/15" />
            <div className="relative w-12 h-12 rounded-full bg-white/95 shadow-lg flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <svg className="w-5 h-5 text-spe-ink ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Category badge */}
        {category && (
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-white/90 text-spe-muted backdrop-blur-sm border border-white/60">
            {categoryLabels[category] || category.replace(/-/g, ' ')}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 pt-3.5">
        {/* Date + waveform accent */}
        <div className="flex items-center gap-2.5 mb-2">
          {date && (
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-spe-grey">
              {formatDateShort(date)}
            </span>
          )}
          <div className="flex items-end gap-[2px] h-3 ml-auto opacity-50">
            {[0.4, 0.8, 0.5, 0.9, 0.6].map((h, i) => (
              <div
                key={i}
                className="w-[2px] rounded-full bg-spe-copper waveform-bar"
                style={{ height: `${h * 100}%`, animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif font-bold text-spe-ink text-base leading-snug group-hover:text-spe-blue transition-colors duration-300">
          {title}
        </h3>

        {/* Speaker name(s) */}
        {speakerNames.length > 0 && (
          <p className="text-sm text-spe-copper font-medium mt-1.5">
            {speakerNames.join(', ')}
          </p>
        )}

        {/* Topic tags */}
        {topics && topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {topics.map(topic => (
              <span key={topic} className="px-2 py-0.5 text-[10px] font-medium tracking-wide rounded-full bg-spe-cream text-spe-muted border border-spe-divider/50">
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* Excerpt fallback (only when no speaker or topic data) */}
        {strippedExcerpt && speakerNames.length === 0 && (!topics || topics.length === 0) && (
          <p className="text-sm text-spe-muted leading-relaxed line-clamp-2 mt-2.5">
            {strippedExcerpt}
          </p>
        )}
      </div>
    </Link>
  )
}
