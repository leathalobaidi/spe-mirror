/**
 * Cross-link utilities for connecting related content across data silos.
 *
 * The SPE website has content about Annual Dinners spread across dinner reviews,
 * podcasts, Rybczynski essays, events, and news. These utilities enable
 * detail pages to surface related content from other sections.
 *
 * Key relationship: the Rybczynski Prize is announced at the Annual Dinner,
 * so a "2021/22" essay corresponds to the 2022 dinner.
 */

import podcastsData from '../data/podcasts.json'
import essaysData from '../data/ryb-essays.json'
import dinnerReviewsData from '../data/dinner-reviews.json'
import eventsData from '../data/events.json'
import newsData from '../data/news.json'
import { getYear } from './helpers'

// ── Type aliases ─────────────────────────────────────────────────────────

type PodcastEntry = (typeof podcastsData)[0]
type EssayEntry = (typeof essaysData)[0]
type DinnerReviewEntry = (typeof dinnerReviewsData)[0]
type EventEntry = (typeof eventsData)[0]
type NewsEntry = (typeof newsData)[0]

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

/** Extract the route-friendly slug for podcast links (last segment only) */
export function podcastLinkSlug(fullSlug: string) {
  const parts = fullSlug.split('/')
  return parts[parts.length - 1]
}

/** Build the correct event detail path from an event slug */
export function eventDetailPath(eventSlug: string) {
  // Event slugs are like "events/spe-annual-dinner-2025" or "past-events/12226-1"
  // The route is /events/:slug where :slug is the last segment
  const parts = eventSlug.split('/')
  return `/events/${parts[parts.length - 1]}`
}
