/**
 * Speaker & Contributor Directory
 *
 * Scans all structured data sources (events, podcasts, book reviews, blogs,
 * Rybczynski essays) to build a directory of people and their appearances
 * across the site. Only uses structured fields — never guesses from body HTML
 * except for Rybczynski essay authors which are in well-known <h4> tags.
 */
import eventsData from '../data/events.json'
import podcastsData from '../data/podcasts.json'
import bookReviewsData from '../data/book-reviews.json'
import blogsData from '../data/blogs.json'
import rybEssaysData from '../data/ryb-essays.json'

export interface Appearance {
  contentType: string
  title: string
  path: string
  date?: string
  role: string
}

export interface Speaker {
  name: string
  slug: string
  appearances: Appearance[]
  roles: string[]
  contentTypes: string[]
}

/* ── Helpers ───────────────────────────────────────────── */

/** Extract person name from "Name, Role, Org" or "Speaker: Name, Role" */
function extractName(raw: string): string {
  const s = raw.replace(/^Speaker:\s*/i, '').trim()
  return s.split(',')[0].trim()
}

/** Normalise for matching — strip titles/honorifics, lowercase */
function normaliseForMatch(name: string): string {
  return name
    .replace(/^(Dr|Professor|Prof|Sir|Lord|Lady|Dame|Rt Hon|The Rt Hon|The Hon|Baron|Baroness)\s+/gi, '')
    .replace(/\s+(CBE|OBE|MBE|FRS|FRSE|FBA|PhD)$/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/* ── Build the directory ──────────────────────────────── */

const map = new Map<string, { displayName: string; appearances: Appearance[] }>()

function add(rawName: string, appearance: Appearance) {
  const display = rawName.replace(/^(Dr|Professor|Prof)\s+/i, '').trim()
  if (!display || display.length < 3) return
  const key = normaliseForMatch(display)
  if (!key) return

  const existing = map.get(key)
  if (existing) {
    existing.appearances.push(appearance)
    // Keep the longer/more complete version of the name
    if (display.length > existing.displayName.length) existing.displayName = display
  } else {
    map.set(key, { displayName: display, appearances: [appearance] })
  }
}

// --- Events ---
for (const event of eventsData as any[]) {
  const lastSlug = (event.slug || '').split('/').pop() || event.slug
  const path = `/events/${lastSlug}`
  if (event.speakers) {
    for (const s of event.speakers) {
      add(extractName(s), { contentType: 'event', title: event.title, path, date: event.date, role: 'Speaker' })
    }
  }
  if (event.chair) {
    add(extractName(event.chair), { contentType: 'event', title: event.title, path, date: event.date, role: 'Chair' })
  }
}

// --- Podcasts ---
for (const podcast of podcastsData as any[]) {
  const lastSlug = (podcast.slug || '').split('/').pop() || podcast.slug
  const path = `/podcasts/${lastSlug}`
  if (podcast.speakers) {
    for (const s of podcast.speakers) {
      add(extractName(s), { contentType: 'podcast', title: podcast.title, path, date: podcast.date, role: 'Guest' })
    }
  }
}

// --- Book Reviews ---
for (const book of bookReviewsData as any[]) {
  const path = `/reading-room/book-reviews/${book.slug}`
  if (book.reviewer) {
    add(book.reviewer, { contentType: 'book-review', title: book.title, path, date: (book as any).date, role: 'Reviewer' })
  }
  if (book.author) {
    add(book.author, { contentType: 'book-review', title: book.title, path, date: (book as any).date, role: 'Author' })
  }
}

// --- Blogs ---
for (const blog of blogsData as any[]) {
  const path = `/blogs/${blog.slug}`
  if (blog.author) {
    add(blog.author, { contentType: 'blog', title: blog.title, path, date: blog.date, role: 'Author' })
  }
}

// --- Rybczynski Essays (authors from structured <h4> tags in body) ---
for (const essay of rybEssaysData as any[]) {
  const path = `/reading-room/rybczynski-essays/${essay.slug}`
  const h4Match = (essay.body || '').match(/<h4[^>]*>([\s\S]*?)<\/h4\s*>/i)
  if (h4Match) {
    const html = h4Match[1]
    const names: string[] = []
    for (const m of html.matchAll(/<a[^>]*>([^<]+)<\/a>/g)) {
      const name = m[1].replace(/^Dr\s+/, '').trim()
      if (name && !name.includes('Author')) names.push(name)
    }
    if (names.length === 0) {
      for (const m of html.matchAll(/<strong>([^<]+)<\/strong>/g)) {
        const text = m[1].trim()
        if (text && !text.includes('Author') && !text.includes(':')) names.push(text)
      }
    }
    for (const name of names) {
      add(name, { contentType: 'ryb-essay', title: essay.title, path, role: 'Prize Winner' })
    }
  }
}

// Sort each person's appearances newest-first
for (const [, speaker] of map) {
  speaker.appearances.sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return b.date.localeCompare(a.date)
  })
}

/* ── Exported directory — people with 2+ appearances ─── */

export const speakerDirectory: Speaker[] = Array.from(map.values())
  .filter(s => s.appearances.length >= 2)
  .map(s => ({
    name: s.displayName,
    slug: slugify(s.displayName),
    appearances: s.appearances,
    roles: [...new Set(s.appearances.map(a => a.role))],
    contentTypes: [...new Set(s.appearances.map(a => a.contentType))],
  }))
  .sort((a, b) => b.appearances.length - a.appearances.length)

export function getSpeakerBySlug(slug: string): Speaker | undefined {
  return speakerDirectory.find(s => s.slug === slug)
}

/** Look up a speaker by display name (exact match) — for cross-linking reviewers etc. */
export function getSpeakerByName(name: string): Speaker | undefined {
  const key = normaliseForMatch(name)
  return speakerDirectory.find(s => normaliseForMatch(s.name) === key)
}
