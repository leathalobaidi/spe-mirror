/**
 * Speaker & Contributor Directory
 *
 * Scans all structured data sources (events, podcasts, book reviews, blogs,
 * Rybczynski essays, evening talks, and articles) to build a directory of
 * people and their appearances across the site. Uses structured fields plus
 * well-known <h4> patterns from the CMS for evening talks, articles, and
 * Rybczynski essays.
 */
import eventsData from '../data/events.json'
import podcastsData from '../data/podcasts.json'
import bookReviewsData from '../data/book-reviews-index.json'
import blogsData from '../data/blogs.json'
import rybEssaysData from '../data/ryb-essays.json'
import eveningTalksData from '../data/evening-talks.json'
import articlesData from '../data/articles.json'

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
  const s = raw.replace(/^(Speaker|Chair|Author):\s*/i, '').trim()
  return s.split(',')[0].trim()
}

/**
 * Parse well-known CMS <h4> tags that contain speaker/author info.
 * Two patterns:
 * 1. Role-prefixed: "<strong>Speaker: </strong><a>Name</a>, Org"
 * 2. Plain names:    "Name, Org" (text or linked)
 * Returns array of { name, role } extracted from the HTML.
 */
function parseH4People(html: string, defaultRole: string): { name: string; role: string }[] {
  const results: { name: string; role: string }[] = []
  // Split on <br> or <br /> to get individual person entries
  const entries = html.split(/<br\s*\/?>/i)
  for (const entry of entries) {
    const text = entry.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/\s+/g, ' ').trim()
    if (!text || text.length < 3) continue
    if (/^related\s+(pages|links)$/i.test(text)) continue

    // Check for role prefix
    const roleMatch = text.match(/^(Speaker|Chair|Author):\s*(.+)/i)
    if (roleMatch) {
      const role = roleMatch[1].charAt(0).toUpperCase() + roleMatch[1].slice(1).toLowerCase()
      const name = extractName(roleMatch[2])
      if (name.length >= 3) results.push({ name, role })
    } else {
      // Plain "Name, Org" format
      const name = extractName(text)
      if (name.length >= 3 && !/^(Related|Login|This content)/.test(name)) {
        results.push({ name, role: defaultRole })
      }
    }
  }
  return results
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

// --- Book Reviews (apply extractName to strip trailing ", Org" from reviewer/author fields) ---
for (const book of bookReviewsData as any[]) {
  const path = `/reading-room/book-reviews/${book.slug}`
  if (book.reviewer) {
    add(extractName(book.reviewer), { contentType: 'book-review', title: book.title, path, date: (book as any).date, role: 'Reviewer' })
  }
  if (book.author) {
    add(extractName(book.author), { contentType: 'book-review', title: book.title, path, date: (book as any).date, role: 'Author' })
  }
}

// --- Blogs ---
for (const blog of blogsData as any[]) {
  const path = `/blogs/${blog.slug}`
  if (blog.author) {
    add(extractName(blog.author), { contentType: 'blog', title: blog.title, path, date: blog.date, role: 'Author' })
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

// --- Evening Talks (speakers/chairs from <h4> tags) ---
for (const talk of eveningTalksData as any[]) {
  const path = `/speakers/evening-talks/${talk.slug}`
  const h4Match = (talk.body || '').match(/<h4[^>]*>([\s\S]*?)<\/h4\s*>/i)
  if (h4Match) {
    const people = parseH4People(h4Match[1], 'Speaker')
    for (const { name, role } of people) {
      add(name, { contentType: 'evening-talk', title: talk.title, path, date: talk.date, role })
    }
  }
}

// --- Articles (authors from <h4> tags) ---
for (const article of articlesData as any[]) {
  const path = `/reading-room/articles/${article.slug}`
  const h4Match = (article.body || '').match(/<h4[^>]*>([\s\S]*?)<\/h4\s*>/i)
  if (h4Match) {
    const people = parseH4People(h4Match[1], 'Author')
    for (const { name, role } of people) {
      add(name, { contentType: 'article', title: article.title, path, date: article.date, role })
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

/** Extract speaker/author names from body HTML's first <h4> tag.
 *  Re-exports the same parsing used by the directory scanner so detail
 *  pages can display the names with profile links. */
export function extractPeopleFromBody(bodyHtml: string, defaultRole: string): { name: string; role: string }[] {
  const h4Match = bodyHtml.match(/<h4[^>]*>([\s\S]*?)<\/h4\s*>/i)
  if (!h4Match) return []
  return parseH4People(h4Match[1], defaultRole)
}
