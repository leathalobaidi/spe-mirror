import { getEmbedUrl, type MediaEmbed as MediaEmbedType } from '../utils/media'

interface Props {
  media: MediaEmbedType
  className?: string
  title?: string
}

export default function MediaEmbed({ media, className = '', title }: Props) {
  const embedUrl = getEmbedUrl(media)

  return (
    <div className={`relative w-full overflow-hidden rounded-xl bg-spe-dark/5 ${className}`}>
      <div className="relative pt-[56.25%]">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          title={title || `${media.type} media player`}
        />
      </div>
      {/* Platform badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium capitalize">
          {media.type === 'vimeo' && (
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197a315.065 315.065 0 003.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"/></svg>
          )}
          {media.type === 'youtube' && (
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          )}
          {media.type}
        </span>
      </div>
    </div>
  )
}
