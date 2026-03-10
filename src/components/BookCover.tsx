import { useState } from 'react'
import { Link } from 'react-router-dom'
import { resolveImageUrl } from '../utils/helpers'

interface Props {
  to: string
  title: string
  coverImage: string
  author?: string
  reviewer?: string
  date?: string
  className?: string
}

export default function BookCover({ to, title, coverImage, author, reviewer, date, className = '' }: Props) {
  const [imgError, setImgError] = useState(false)
  const resolvedCover = resolveImageUrl(coverImage)

  return (
    <Link to={to} className={`group block h-full flex flex-col ${className}`}>
      {/* Book cover with 3D hover effect */}
      <div className="relative mb-3">
        <div className="book-cover rounded-lg overflow-hidden aspect-[2/3] bg-spe-paper">
          {!imgError ? (
            <img
              src={resolvedCover}
              alt={title}
              width={500}
              height={750}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-spe-blue/8 via-spe-paper to-spe-cream flex items-center justify-center p-4">
              <span className="text-xs text-spe-muted text-center font-serif leading-tight line-clamp-4 italic">{title}</span>
            </div>
          )}
        </div>
        {/* Spine effect */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-r from-black/25 via-black/10 to-transparent rounded-l-lg" />
      </div>

      {/* Text */}
      <h3 className="font-serif text-sm font-bold text-spe-ink group-hover:text-spe-blue transition-colors duration-300 leading-snug line-clamp-2">
        {title}
      </h3>
      {author && (
        <p className="text-xs text-spe-muted mt-1 line-clamp-1">{author}</p>
      )}
      {reviewer && (
        <p className="text-[11px] text-spe-grey mt-0.5">Reviewed by {reviewer}</p>
      )}
    </Link>
  )
}
