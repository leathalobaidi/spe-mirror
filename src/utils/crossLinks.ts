/**
 * Cross-link utilities for connecting related content across data silos.
 *
 * The SPE website has content about Annual Dinners spread across dinner reviews,
 * podcasts, Rybczynski essays, events, and news. These utilities enable
 * detail pages to surface related content from other sections.
 *
 * Key relationship: the Rybczynski Prize is announced at the Annual Dinner,
 * so a "2021/22" essay corresponds to the 2022 dinner.
 *
 * Topic-based cross-links connect book reviews ↔ events ↔ podcasts via the
 * shared topic taxonomy (e.g. "Monetary Policy", "Trade & Globalisation").
 */

import podcastsData from '../data/podcasts.json'
import essaysData from '../data/ryb-essays.json'
import dinnerReviewsData from '../data/dinner-reviews.json'
import eventsData from '../data/events.json'
import newsData from '../data/news.json'
import bookReviewsIndexData from '../data/book-reviews-index.json'
import articlesData from '../data/articles.json'
import eveningTalksData from '../data/evening-talks.json'
import conferenceReportsData from '../data/conference-reports.json'
import blogsData from '../data/blogs.json'
import { getYear } from './helpers'

// ── Type aliases ─────────────────────────────────────────────────────────

type PodcastEntry = (typeof podcastsData)[0]
type EssayEntry = (typeof essaysData)[0]
type DinnerReviewEntry = (typeof dinnerReviewsData)[0]
type EventEntry = (typeof eventsData)[0]
type NewsEntry = (typeof newsData)[0]
type BookReviewIndexEntry = (typeof bookReviewsIndexData)[0]
type ArticleEntry = (typeof articlesData)[0]
type EveningTalkEntry = (typeof eveningTalksData)[0]
type ConferenceReportEntry = (typeof conferenceReportsData)[0]

// ── Podcast lookup (dinner-review category, keyed by year) ──────────────

const dinnerPodcastsByYear = new Map<number, PodcastEntry>()
for (const p of podcastsData) {
  if (p.category === 'dinner-review' && p.date) {
    const year = getYear(p.date)
    if (year) dinnerPodcastsByYear.set(year, p)
  }
}

// ── Essay lookup (keyed by dinner year — the *second* year in "YYYY/YY") ─

const essaysByDinnerYear = new Map<number, EssayEntry[]>()
for (const e of essaysData) {
  const match = e.title.match(/(\d{4})\/(\d{2})/)
  if (match) {
    const century = match[1].slice(0, 2) // "20"
    const dinnerYear = parseInt(century + match[2]) // "2022"
    const existing = essaysByDinnerYear.get(dinnerYear) ?? []
    existing.push(e)
    essaysByDinnerYear.set(dinnerYear, existing)
  }
}

// ── Dinner review lookup (keyed by year) ────────────────────────────────

const dinnerReviewsByYear = new Map<number, DinnerReviewEntry>()
for (const d of dinnerReviewsData) {
  if (d.date) {
    const year = getYear(d.date)
    if (year) dinnerReviewsByYear.set(year, d)
  }
}

// ── Event lookup (dinner events, keyed by year) ─────────────────────────

const dinnerEventsByYear = new Map<number, EventEntry>()
for (const e of eventsData) {
  if (e.title && e.title.toLowerCase().includes('annual dinner') && e.date) {
    const year = getYear(e.date)
    if (year) dinnerEventsByYear.set(year, e)
  }
}

// ── News lookup (dinner + Ryb-related, keyed by year) ───────────────────

type NewsMatch = { news: NewsEntry; type: 'dinner-recap' | 'dinner-booking' | 'ryb-winner' | 'ryb-shortlist' | 'essay-competition' }

const dinnerNewsByYear = new Map<number, NewsMatch[]>()
for (const n of newsData) {
  if (!n.title || !n.date) continue
  const title = n.title.toLowerCase()
  const year = getYear(n.date)
  if (!year) continue

  let matched = false
  const addMatch = (y: number, type: NewsMatch['type']) => {
    const existing = dinnerNewsByYear.get(y) ?? []
    existing.push({ news: n, type })
    dinnerNewsByYear.set(y, existing)
    matched = true
  }

  // Dinner recap news (e.g. "SPE Annual Dinner 2023 - another resounding success!")
  if (title.includes('annual dinner') && (title.includes('success') || title.includes('resounding'))) {
    addMatch(year, 'dinner-recap')
  }
  // Dinner booking news
  if (title.includes('annual dinner') && title.includes('booking')) {
    addMatch(year, 'dinner-booking')
  }
  // Rybczynski winner announced
  if (title.includes('rybczynski') && (title.includes('winner') || title.includes('winning'))) {
    // Extract year from title if possible, otherwise use publish year
    const yrMatch = title.match(/(\d{4})[\s/]/)
    const prizeYear = yrMatch ? parseInt(yrMatch[1]) : year
    addMatch(prizeYear, 'ryb-winner')
  }
  // Rybczynski shortlist
  if (title.includes('rybczynski') && title.includes('shortlist')) {
    addMatch(year, 'ryb-shortlist')
  }
  // Essay competition
  if (title.includes('essay competition') && !matched) {
    addMatch(year, 'essay-competition')
  }
}

// ── Public API ──────────────────────────────────────────────────────────

/** Find the dinner podcast episode for a given dinner date */
export function getPodcastForDinner(dinnerDate: string) {
  return dinnerPodcastsByYear.get(getYear(dinnerDate)) ?? null
}

/** Find the Rybczynski essay(s) announced at a dinner in the given year */
export function getEssaysForDinner(dinnerDate: string) {
  return essaysByDinnerYear.get(getYear(dinnerDate)) ?? []
}

/** Find the dinner review for a Rybczynski essay (by title pattern) */
export function getDinnerForEssay(essayTitle: string) {
  const match = essayTitle.match(/(\d{4})\/(\d{2})/)
  if (!match) return null
  const century = match[1].slice(0, 2)
  const dinnerYear = parseInt(century + match[2])
  return dinnerReviewsByYear.get(dinnerYear) ?? null
}

/** Find the dinner review matching an event (only for dinner events) */
export function getDinnerReviewForEvent(eventTitle: string, eventDate: string) {
  if (!eventTitle.toLowerCase().includes('dinner')) return null
  return dinnerReviewsByYear.get(getYear(eventDate)) ?? null
}

/** Find the dinner podcast for an event (only for dinner events) */
export function getPodcastForEvent(eventTitle: string, eventDate: string) {
  if (!eventTitle.toLowerCase().includes('dinner')) return null
  return dinnerPodcastsByYear.get(getYear(eventDate)) ?? null
}

/** Find dinner-related news for an event year */
export function getNewsForEvent(eventTitle: string, eventDate: string) {
  if (!eventTitle.toLowerCase().includes('dinner')) return null
  const year = getYear(eventDate)
  return dinnerNewsByYear.get(year)?.filter(m => m.type === 'dinner-recap') ?? []
}

/** Find the dinner event for a given dinner review */
export function getEventForDinnerReview(dinnerDate: string) {
  return dinnerEventsByYear.get(getYear(dinnerDate)) ?? null
}

/** Find the dinner review for a dinner podcast */
export function getDinnerReviewForPodcast(podcastCategory: string | undefined, podcastDate: string) {
  if (podcastCategory !== 'dinner-review') return null
  return dinnerReviewsByYear.get(getYear(podcastDate)) ?? null
}

/** Find the dinner event for a dinner podcast */
export function getEventForPodcast(podcastCategory: string | undefined, podcastDate: string) {
  if (podcastCategory !== 'dinner-review') return null
  return dinnerEventsByYear.get(getYear(podcastDate)) ?? null
}

/** Find dinner/Ryb-related news for a given year */
export function getDinnerNewsForYear(year: number) {
  return dinnerNewsByYear.get(year) ?? []
}

/** Find the event where a Rybczynski essay was announced */
export function getEventForEssay(essayTitle: string) {
  const match = essayTitle.match(/(\d{4})\/(\d{2})/)
  if (!match) return null
  const century = match[1].slice(0, 2)
  const dinnerYear = parseInt(century + match[2])
  return dinnerEventsByYear.get(dinnerYear) ?? null
}

/** Find Rybczynski-related news for an essay (winner announcements) */
export function getNewsForEssay(essayTitle: string) {
  const match = essayTitle.match(/(\d{4})\/(\d{2})/)
  if (!match) return []
  const century = match[1].slice(0, 2)
  const dinnerYear = parseInt(century + match[2])
  // Look for winner news in the dinner year and adjacent years
  const results: NewsMatch[] = []
  for (const y of [dinnerYear, dinnerYear - 1, dinnerYear + 1]) {
    const matches = dinnerNewsByYear.get(y) ?? []
    results.push(...matches.filter(m => m.type === 'ryb-winner' || m.type === 'ryb-shortlist'))
  }
  return results
}

/** For a news article, find related dinner event and review if it's dinner/Ryb news */
export function getDinnerContentForNews(newsTitle: string, newsDate: string): {
  event: EventEntry | null
  review: DinnerReviewEntry | null
  essays: EssayEntry[]
} {
  const title = newsTitle.toLowerCase()
  const year = getYear(newsDate)

  // Is this dinner news?
  if (title.includes('annual dinner')) {
    return {
      event: dinnerEventsByYear.get(year) ?? null,
      review: dinnerReviewsByYear.get(year) ?? null,
      essays: [],
    }
  }

  // Is this Rybczynski news?
  if (title.includes('rybczynski') || title.includes('essay competition')) {
    // The year in the title or the publish year maps to the dinner year
    return {
      event: dinnerEventsByYear.get(year) ?? null,
      review: dinnerReviewsByYear.get(year) ?? null,
      essays: essaysByDinnerYear.get(year) ?? [],
    }
  }

  return { event: null, review: null, essays: [] }
}

/** Find the dinner podcast for a Rybczynski essay (by title pattern) */
export function getPodcastForEssay(essayTitle: string) {
  const match = essayTitle.match(/(\d{4})\/(\d{2})/)
  if (!match) return null
  const century = match[1].slice(0, 2)
  const dinnerYear = parseInt(century + match[2])
  return dinnerPodcastsByYear.get(dinnerYear) ?? null
}

/** Find Rybczynski essays for a dinner event (only for dinner events) */
export function getEssaysForEvent(eventTitle: string, eventDate: string) {
  if (!eventTitle.toLowerCase().includes('dinner')) return []
  return essaysByDinnerYear.get(getYear(eventDate)) ?? []
}

/** Find dinner/Ryb-related news for a dinner review's year */
export function getNewsForDinnerReview(dinnerDate: string) {
  const year = getYear(dinnerDate)
  return dinnerNewsByYear.get(year)?.filter(m => m.type === 'dinner-recap' || m.type === 'ryb-winner') ?? []
}

/** Find Rybczynski essays for a dinner podcast */
export function getEssaysForPodcast(podcastCategory: string | undefined, podcastDate: string) {
  if (podcastCategory !== 'dinner-review') return []
  return essaysByDinnerYear.get(getYear(podcastDate)) ?? []
}

/** Find dinner/Ryb news for a dinner podcast */
export function getNewsForPodcast(podcastCategory: string | undefined, podcastDate: string) {
  if (podcastCategory !== 'dinner-review') return []
  const year = getYear(podcastDate)
  return dinnerNewsByYear.get(year)?.filter(m => m.type === 'dinner-recap') ?? []
}

// ── Content type enum for universal topic cross-links ────────────────────

export type ContentType =
  | 'article' | 'blog' | 'book-review' | 'conference-report' | 'dinner-review'
  | 'evening-talk' | 'event' | 'news' | 'podcast' | 'ryb-essay'

export type RelatedContentItem = {
  title: string
  slug: string
  date?: string
  contentType: ContentType
}

/** Path builder for each content type */
export function contentTypePath(slug: string, type: ContentType): string {
  switch (type) {
    case 'article': return `/reading-room/articles/${slug}`
    case 'blog': return `/blogs/${slug}`
    case 'book-review': return `/reading-room/book-reviews/${slug}`
    case 'conference-report': return `/reading-room/conference-reports/${slug}`
    case 'dinner-review': return `/annual-dinner/${slug}`
    case 'evening-talk': return `/events/evening-talks/${slug}`
    case 'event': return `/events/${slug}`
    case 'news': return `/news/${slug}`
    case 'podcast': return `/podcasts/${slug}`
    case 'ryb-essay': return `/reading-room/rybczynski-prize/${slug}`
  }
}

/** Human-readable label for each content type */
export function contentTypeLabel(type: ContentType): string {
  switch (type) {
    case 'article': return 'Article'
    case 'blog': return 'Blog'
    case 'book-review': return 'Book Review'
    case 'conference-report': return 'Conference Report'
    case 'dinner-review': return 'Dinner Review'
    case 'evening-talk': return 'Evening Talk'
    case 'event': return 'Event'
    case 'news': return 'News'
    case 'podcast': return 'Podcast'
    case 'ryb-essay': return 'Rybczynski Essay'
  }
}

/** Extract the route-friendly slug for podcast links */
export function podcastLinkSlug(fullSlug: string) {
  return fullSlug
}

/** Build the correct event detail path from an event slug */
export function eventDetailPath(eventSlug: string) {
  return `/events/${eventSlug}`
}

// ── Topic-based cross-links (universal, all content types) ──────────────

function buildTopicIndex<T extends { topics?: string[] }>(data: T[]) {
  const map = new Map<string, T[]>()
  for (const item of data) {
    for (const topic of item.topics ?? []) {
      const existing = map.get(topic) ?? []
      existing.push(item)
      map.set(topic, existing)
    }
  }
  return map
}

const bookReviewsByTopic = buildTopicIndex(bookReviewsIndexData)
const eventsByTopic = buildTopicIndex(eventsData)
const podcastsByTopic = buildTopicIndex(podcastsData)

/** Find book reviews that share topics with a given set of topics */
export function getBookReviewsForTopics(topics: string[], excludeSlug?: string, limit = 3) {
  const seen = new Set<string>()
  const results: BookReviewIndexEntry[] = []
  for (const topic of topics) {
    for (const review of bookReviewsByTopic.get(topic) ?? []) {
      if (review.slug === excludeSlug || seen.has(review.slug)) continue
      seen.add(review.slug)
      results.push(review)
    }
  }
  // Prefer reviews with cover images for visual display
  results.sort((a, b) => (b.coverImage ? 1 : 0) - (a.coverImage ? 1 : 0))
  return results.slice(0, limit)
}

/** Find events that share topics with a book review's topics */
export function getEventsForTopics(topics: string[], limit = 3) {
  const seen = new Set<string>()
  const results: EventEntry[] = []
  for (const topic of topics) {
    for (const event of eventsByTopic.get(topic) ?? []) {
      if (seen.has(event.slug)) continue
      seen.add(event.slug)
      results.push(event)
    }
  }
  // Most recent first
  results.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
  return results.slice(0, limit)
}

/** Find podcasts that share topics with a book review's topics */
export function getPodcastsForTopics(topics: string[], limit = 3) {
  const seen = new Set<string>()
  const results: PodcastEntry[] = []
  for (const topic of topics) {
    for (const podcast of podcastsByTopic.get(topic) ?? []) {
      if (seen.has(podcast.slug)) continue
      seen.add(podcast.slug)
      results.push(podcast)
    }
  }
  // Most recent first
  results.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
  return results.slice(0, limit)
}

// ── Universal topic index (all content types in one map) ────────────────

type IndexedItem = { slug: string; title: string; date?: string; contentType: ContentType }

function toIndexed<T extends { slug: string; title: string; date?: string; topics?: string[] }>(
  data: T[], contentType: ContentType
): (T & { contentType: ContentType })[] {
  return data.map(d => ({ ...d, contentType }))
}

type BlogEntry = { slug: string; title: string; date?: string; topics?: string[] }

const allIndexedContent: IndexedItem[][] = [
  toIndexed(articlesData as (ArticleEntry & { topics?: string[] })[], 'article'),
  toIndexed(blogsData as BlogEntry[], 'blog'),
  toIndexed(bookReviewsIndexData, 'book-review'),
  toIndexed(conferenceReportsData as (ConferenceReportEntry & { topics?: string[] })[], 'conference-report'),
  toIndexed(dinnerReviewsData as (DinnerReviewEntry & { topics?: string[] })[], 'dinner-review'),
  toIndexed(eveningTalksData as (EveningTalkEntry & { topics?: string[] })[], 'evening-talk'),
  toIndexed(eventsData, 'event'),
  toIndexed(newsData as (NewsEntry & { topics?: string[] })[], 'news'),
  toIndexed(podcastsData, 'podcast'),
  toIndexed(essaysData as (EssayEntry & { topics?: string[] })[], 'ryb-essay'),
]

const universalTopicIndex = new Map<string, IndexedItem[]>()
for (const items of allIndexedContent) {
  for (const item of items) {
    const typedItem = item as unknown as { topics?: string[] } & IndexedItem
    for (const topic of typedItem.topics ?? []) {
      const existing = universalTopicIndex.get(topic) ?? []
      existing.push({ slug: item.slug, title: item.title, date: item.date, contentType: item.contentType })
      universalTopicIndex.set(topic, existing)
    }
  }
}

/**
 * Find related content from ANY content type that shares topics.
 * Excludes the current item and favours diversity across content types.
 */
export function getRelatedContentByTopic(
  topics: string[],
  currentSlug: string,
  currentType: ContentType,
  limit = 3
): RelatedContentItem[] {
  const seen = new Set<string>()
  const results: RelatedContentItem[] = []

  for (const topic of topics) {
    for (const item of universalTopicIndex.get(topic) ?? []) {
      const key = `${item.contentType}:${item.slug}`
      if (item.slug === currentSlug && item.contentType === currentType) continue
      if (seen.has(key)) continue
      seen.add(key)
      results.push(item)
    }
  }

  // Sort: prefer different content types for diversity, then most recent
  const typeCounts = new Map<ContentType, number>()
  results.sort((a, b) => {
    // Different content type from current gets priority
    const aOther = a.contentType !== currentType ? 1 : 0
    const bOther = b.contentType !== currentType ? 1 : 0
    if (aOther !== bOther) return bOther - aOther
    // Then by date (most recent first)
    return (b.date ?? '').localeCompare(a.date ?? '')
  })

  // Pick with type diversity: max 2 from any single type
  const picked: RelatedContentItem[] = []
  for (const item of results) {
    const count = typeCounts.get(item.contentType) ?? 0
    if (count >= 2) continue
    typeCounts.set(item.contentType, count + 1)
    picked.push(item)
    if (picked.length >= limit) break
  }

  return picked
}
