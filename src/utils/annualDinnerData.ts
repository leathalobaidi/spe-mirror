/**
 * Annual Dinner Hub Data
 *
 * Aggregates all content related to each year's Annual Dinner into a
 * single data structure. Sources: events, dinner reviews, podcasts,
 * Rybczynski essays, news articles.
 *
 * The guest speaker is extracted from the podcast's `speakers` field
 * (most reliable source), falling back to the event's `speakers` array.
 */

import eventsData from '../data/events.json'
import podcastsData from '../data/podcasts.json'
import dinnerReviewsData from '../data/dinner-reviews.json'
import essaysData from '../data/ryb-essays.json'
import newsData from '../data/news.json'
import { getYear } from './helpers'

// ── Types ────────────────────────────────────────────────────────────

export interface DinnerYear {
  year: number
  /** Guest speaker name (cleaned) */
  guestSpeaker: string | null
  /** Guest speaker's full title/role */
  guestSpeakerRole: string | null
  /** Event listing (if one exists) */
  event: { slug: string; title: string; date: string; venue?: string; time?: string; speakers?: string[]; chair?: string; body?: string; images?: string[] } | null
  /** Dinner review article */
  review: { slug: string; title: string; date?: string; body?: string; images?: string[] } | null
  /** Podcast recording of the dinner speech */
  podcast: { slug: string; title: string; date?: string; speakers?: string } | null
  /** Rybczynski Prize essays announced at this dinner */
  essays: { slug: string; title: string; author?: string }[]
  /** Related news articles */
  news: { slug: string; title: string; date?: string; type: string }[]
  /** Whether this dinner was cancelled (COVID 2020) */
  cancelled: boolean
  /** The primary image for this dinner year */
  heroImage: string | null
}

// ── Build lookup maps ────────────────────────────────────────────────

// Dinner events by year
const dinnerEventsByYear = new Map<number, typeof eventsData[0]>()
for (const e of eventsData) {
  if (e.title?.toLowerCase().includes('annual dinner') && e.date) {
    const year = getYear(e.date)
    if (year) dinnerEventsByYear.set(year, e)
  }
}

// Dinner reviews by year
const dinnerReviewsByYear = new Map<number, typeof dinnerReviewsData[0]>()
for (const d of dinnerReviewsData) {
  if (d.date) {
    const year = getYear(d.date)
    if (year) dinnerReviewsByYear.set(year, d)
  }
}

// Dinner podcasts by year
const dinnerPodcastsByYear = new Map<number, typeof podcastsData[0]>()
for (const p of podcastsData) {
  if (p.category === 'dinner-review' && p.date) {
    const year = getYear(p.date)
    if (year) dinnerPodcastsByYear.set(year, p)
  }
}

// Essays by dinner year (the second year in "YYYY/YY")
const essaysByDinnerYear = new Map<number, typeof essaysData[0][]>()
for (const e of essaysData) {
  const match = e.title.match(/(\d{4})\/(\d{2})/)
  if (match) {
    const century = match[1].slice(0, 2)
    const dinnerYear = parseInt(century + match[2])
    const existing = essaysByDinnerYear.get(dinnerYear) ?? []
    existing.push(e)
    essaysByDinnerYear.set(dinnerYear, existing)
  }
}

// Dinner/Ryb news by year
type NewsType = 'dinner-recap' | 'dinner-booking' | 'ryb-winner' | 'ryb-shortlist' | 'essay-competition'
interface NewsMatch { slug: string; title: string; date?: string; type: NewsType }

const dinnerNewsByYear = new Map<number, NewsMatch[]>()
for (const n of newsData) {
  if (!n.title || !n.date) continue
  const title = n.title.toLowerCase()
  const year = getYear(n.date)
  if (!year) continue

  const add = (y: number, type: NewsType) => {
    const list = dinnerNewsByYear.get(y) ?? []
    list.push({ slug: n.slug, title: n.title, date: n.date ?? undefined, type })
    dinnerNewsByYear.set(y, list)
  }

  if (title.includes('annual dinner') && (title.includes('success') || title.includes('resounding'))) {
    add(year, 'dinner-recap')
  }
  if (title.includes('annual dinner') && title.includes('booking')) {
    add(year, 'dinner-booking')
  }
  if (title.includes('rybczynski') && (title.includes('winner') || title.includes('winning'))) {
    const yrMatch = title.match(/(\d{4})[\s/]/)
    add(yrMatch ? parseInt(yrMatch[1]) : year, 'ryb-winner')
  }
  if (title.includes('rybczynski') && title.includes('shortlist')) {
    add(year, 'ryb-shortlist')
  }
  if (title.includes('essay competition')) {
    add(year, 'essay-competition')
  }
}

// ── Extract guest speaker from podcast field ─────────────────────────

function parseGuestSpeaker(raw: string | undefined): { name: string; role: string } | null {
  if (!raw) return null
  // Format: "Speaker: Name, Title, Organisation"
  const cleaned = raw.replace(/^Speaker:\s*/i, '').trim()
  const parts = cleaned.split(',').map(s => s.trim())
  if (parts.length === 0) return null
  const name = parts[0].replace(/^(Mr|Mrs|Ms|Dr|Sir|Dame|Professor|Prof|Lord|Lady|Rt Hon)\s+/i, '').trim()
  const role = parts.slice(1).join(', ').trim() || null
  return { name, role: role ?? '' }
}

// ── Build the full DinnerYear records ────────────────────────────────

const dinnerYears = new Map<number, DinnerYear>()

for (let year = 2014; year <= 2025; year++) {
  const event = dinnerEventsByYear.get(year) ?? null
  const review = dinnerReviewsByYear.get(year) ?? null
  const podcast = dinnerPodcastsByYear.get(year) ?? null
  const essays = essaysByDinnerYear.get(year) ?? []
  const news = dinnerNewsByYear.get(year) ?? []

  // Guest speaker: prefer podcast field, fall back to event speakers
  let guestSpeaker: string | null = null
  let guestSpeakerRole: string | null = null

  const podcastSpeakers = podcast?.speakers as string[] | undefined
  if (podcastSpeakers && podcastSpeakers.length > 0) {
    const parsed = parseGuestSpeaker(podcastSpeakers[0])
    if (parsed) {
      guestSpeaker = parsed.name
      guestSpeakerRole = parsed.role
    }
  }
  if (!guestSpeaker && event?.speakers && event.speakers.length > 0) {
    const parsed = parseGuestSpeaker(event.speakers[0])
    if (parsed) {
      guestSpeaker = parsed.name
      guestSpeakerRole = parsed.role
    }
  }

  // Hero image: prefer review images, fall back to event images
  const reviewImages = (review?.images as string[] | undefined) ?? []
  const eventImages = (event?.images as string[] | undefined) ?? []
  const heroImage = reviewImages[0] ?? eventImages[0] ?? null

  // COVID 2020: event exists but was cancelled
  const cancelled = year === 2020

  // Extract essay authors from the body HTML <h4> tags
  const essaysWithAuthors = essays.map(e => {
    const authorMatch = (e as { body?: string }).body?.match(/<h4[^>]*>(.*?)<\/h4>/i)
    const author = authorMatch ? authorMatch[1].replace(/<[^>]*>/g, '').trim() : undefined
    return { slug: e.slug, title: e.title, author }
  })

  dinnerYears.set(year, {
    year,
    guestSpeaker,
    guestSpeakerRole,
    event: event ? {
      slug: event.slug,
      title: event.title,
      date: event.date,
      venue: event.venue ?? undefined,
      time: event.time ?? undefined,
      speakers: event.speakers ?? undefined,
      chair: event.chair ?? undefined,
      body: event.body ?? undefined,
      images: (event.images as string[] | undefined) ?? undefined,
    } : null,
    review: review ? {
      slug: review.slug,
      title: review.title,
      date: review.date ?? undefined,
      body: review.body ?? undefined,
      images: (review.images as string[] | undefined) ?? undefined,
    } : null,
    podcast: podcast ? {
      slug: podcast.slug,
      title: podcast.title,
      date: podcast.date ?? undefined,
      speakers: podcastSpeakers?.[0],
    } : null,
    essays: essaysWithAuthors,
    news,
    cancelled,
    heroImage,
  })
}

// ── Public API ────────────────────────────────────────────────────────

/** Get the aggregated content for a specific dinner year */
export function getDinnerYear(year: number): DinnerYear | null {
  return dinnerYears.get(year) ?? null
}

/** Get all dinner years sorted newest first */
export function getAllDinnerYears(): DinnerYear[] {
  return Array.from(dinnerYears.values()).sort((a, b) => b.year - a.year)
}

/** Get the list of years that have dinner content */
export function getDinnerYearsList(): number[] {
  return Array.from(dinnerYears.keys()).sort((a, b) => b - a)
}
