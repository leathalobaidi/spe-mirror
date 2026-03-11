import { Link } from 'react-router-dom'
import {
  getRelatedContentByTopic,
  contentTypePath,
  contentTypeLabel,
  type ContentType,
} from '../utils/crossLinks'
import { formatDate } from '../utils/helpers'

/** SVG icon per content type (small, inline) */
function ContentIcon({ type }: { type: ContentType }) {
  const cls = 'w-4 h-4'
  switch (type) {
    case 'podcast':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 12h.01M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728M8.464 15.536a5 5 0 010-7.072" /></svg>
    case 'event': case 'evening-talk': case 'dinner-review':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    case 'book-review':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
    case 'article': case 'blog': case 'conference-report': case 'ryb-essay':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    case 'news':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
  }
}

/** Icon background colour per content type */
function iconBg(type: ContentType): string {
  switch (type) {
    case 'podcast': return 'bg-spe-blue/10 text-spe-blue'
    case 'event': case 'evening-talk': case 'dinner-review': return 'bg-spe-copper/10 text-spe-copper'
    case 'book-review': return 'bg-emerald-500/10 text-emerald-600'
    case 'article': case 'blog': case 'conference-report': case 'ryb-essay': return 'bg-amber-500/10 text-amber-600'
    case 'news': return 'bg-indigo-500/10 text-indigo-600'
  }
}

interface Props {
  topics: string[]
  currentSlug: string
  currentType: ContentType
  limit?: number
}

/**
 * Shared "Related content by topic" block.
 * Renders 3 cross-linked items from other content types sharing the same topics.
 * Returns null if no related content is found.
 */
export default function RelatedByTopic({ topics, currentSlug, currentType, limit = 3 }: Props) {
  if (!topics || topics.length === 0) return null

  const related = getRelatedContentByTopic(topics, currentSlug, currentType, limit)
  if (related.length === 0) return null

  return (
    <div className="my-10 rounded-xl border border-spe-divider/15 bg-spe-paper/30 p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-spe-copper mb-4">
        Related by topic
      </p>
      <div className="space-y-3">
        {related.map(item => (
          <Link
            key={`${item.contentType}:${item.slug}`}
            to={contentTypePath(item.slug, item.contentType)}
            className="flex items-start gap-3 group"
          >
            <span className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${iconBg(item.contentType)}`}>
              <ContentIcon type={item.contentType} />
            </span>
            <div className="min-w-0">
              <span className="text-sm font-medium text-spe-blue group-hover:text-spe-deep transition-colors line-clamp-2">
                {item.title}
              </span>
              <span className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-medium uppercase tracking-wide text-spe-ink/40">
                  {contentTypeLabel(item.contentType)}
                </span>
                {item.date && (
                  <span className="text-xs text-spe-ink/50">{formatDate(item.date)}</span>
                )}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
