/**
 * Stage 2G — Podcast Title Normalisation
 *
 * 1. Remove 4 confirmed duplicate entries (keep the richer version)
 * 2. Clean up title prefixes: Watch, Podcast:, Webinar:, Evening meeting:, Speaker Series:, Video:, Replay:
 * 3. Remove call-to-action text ("watch video now!", etc.)
 * 4. Add speaker attribution to Annual Dinner titles
 * 5. Standardise "Watch [Name] in conversation with [Name]" → "[Speaker] — Interview with [Interviewer] ([Month Year])"
 * 6. Standardise "Watch [Name] interview with [Name]" similarly
 * 7. Standardise "Podcast:" entries
 * 8. Standardise "Webinar:" and "Evening meeting:" entries
 * 9. Standardise "Speaker Series:" entries
 */

import { readFileSync, writeFileSync } from 'fs'

const pods = JSON.parse(readFileSync('src/data/podcasts.json', 'utf8'))
const originalCount = pods.length

// ──────────────────────────────────────────
// 1. Remove confirmed duplicates
// ──────────────────────────────────────────
const duplicateSlugs = new Set([
  'video-2020-outlook-for-the-uk-economy',
  'video-the-economic-case-for-gender-equality',
  'replay-britains-longterm-growth',
  'replay-secular-stagnation-and-low-interest-rates-temporary-or-permanent',
])

let cleaned = pods.filter(p => !duplicateSlugs.has(p.slug))
console.log(`Removed ${originalCount - cleaned.length} duplicates (${originalCount} → ${cleaned.length})`)

// ──────────────────────────────────────────
// Helper: extract month/year from ISO date
// ──────────────────────────────────────────
function monthYear(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleString('en-GB', { month: 'long', year: 'numeric' })
}

// Helper: extract speaker name from speakers array
function extractSpeaker(speakers) {
  if (!speakers || speakers.length === 0) return null
  const first = speakers[0]
  // "Speaker: Eric Leeper" → "Eric Leeper"
  const match = first.match(/^Speaker:\s*(.+)$/i)
  return match ? match[1].trim() : first.trim()
}

// Helper: extract interviewer from speakers array
function extractInterviewer(speakers) {
  if (!speakers) return null
  for (const s of speakers) {
    const match = s.match(/^Interviewer:\s*(.+)$/i)
    if (match) return match[1].trim()
  }
  return null
}

// Helper: extract chair from speakers array
function extractChair(speakers) {
  if (!speakers) return null
  for (const s of speakers) {
    const match = s.match(/^Chair:\s*(.+)$/i)
    if (match) return match[1].trim()
  }
  return null
}

// ──────────────────────────────────────────
// Track changes for reporting
// ──────────────────────────────────────────
const changes = []

function normaliseTitle(p) {
  const original = p.title
  let title = p.title
  const my = monthYear(p.date)

  // ── Remove CTA text ──
  title = title.replace(/\s*[-–—:]\s*[Ww]atch\s+video\s+now\s*!?\s*$/i, '')
  title = title.replace(/:\s*[Ww]atch\s+video\s+now\s*!?\s*$/i, '')

  // ── "Watch [Name] in conversation with [Name]" ──
  // e.g. "Watch Kevin Daly in conversation with Andrew Milligan"
  const watchConvoMatch = title.match(/^Watch\s+(.+?)\s+in\s+conversation\s+with\s+(.+)$/i)
  if (watchConvoMatch) {
    const speaker = extractSpeaker(p.speakers) || watchConvoMatch[1].replace(/^(Prof|Dr|Dame|Sir|Lord|Mr|Mrs|Ms)\s+/i, '')
    const interviewer = extractInterviewer(p.speakers) || watchConvoMatch[2]
    title = `${speaker} — Interview (${my})`
    if (title !== original) changes.push({ slug: p.slug, from: original, to: title })
    return title
  }

  // ── "Watch [Name] talk to [Name]" ──
  const watchTalkMatch = title.match(/^Watch\s+(.+?)\s+talk\s+to\s+(.+)$/i)
  if (watchTalkMatch) {
    const speaker = extractSpeaker(p.speakers) || watchTalkMatch[1]
    title = `${speaker} — Interview (${my})`
    if (title !== original) changes.push({ slug: p.slug, from: original, to: title })
    return title
  }

  // ── "Watch [Name] interview with [Name]" ──
  const watchIntMatch = title.match(/^Watch\s+(.+?)\s+interview\s+with\s+(.+)$/i)
  if (watchIntMatch) {
    const speaker = extractSpeaker(p.speakers) || watchIntMatch[1]
    title = `${speaker} — Interview (${my})`
    if (title !== original) changes.push({ slug: p.slug, from: original, to: title })
    return title
  }

  // ── "Watch interviews with shortlisted contenders..." (essay comp) ──
  // NOTE: These must come BEFORE the generic "Watch interview with [Name]" pattern
  if (title.startsWith('Watch interviews with shortlisted contenders')) {
    title = `Rybczynski Essay Competition — Shortlisted Contenders (${my})`
    if (title !== original) changes.push({ slug: p.slug, from: original, to: title })
    return title
  }

  // ── "Watch interview with some of the shortlisted contenders..." (essay comp variant) ──
  if (/^Watch\s+interview\s+with\s+some\s+of\s+the\s+shortlisted/i.test(title)) {
    title = `Rybczynski Essay Competition — Shortlisted Contenders (${my})`
    if (title !== original) changes.push({ slug: p.slug, from: original, to: title })
    return title
  }

  // ── "Watch interview with [Name]" (no structured speakers) ──
  const watchInterview2Match = title.match(/^Watch\s+interview\s+with\s+(.+)$/i)
  if (watchInterview2Match) {
    const speaker = extractSpeaker(p.speakers) || watchInterview2Match[1]
    title = `${speaker} — Interview (${my})`
    if (title !== original) changes.push({ slug: p.slug, from: original, to: title })
    return title
  }

  // ── "Watch [remaining Watch titles]" — generic strip ──
  if (title.startsWith('Watch ')) {
    // These should all be caught by the patterns above,
    // but just in case, strip the "Watch " prefix
    title = title.replace(/^Watch\s+/, '')
    if (title !== original) changes.push({ slug: p.slug, from: original, to: title })
    return title
  }

  // ── "Podcast: [content]" ──
  if (title.startsWith('Podcast: ') || title.startsWith('Podcast:')) {
    title = title.replace(/^Podcast:\s*/, '')
    // For "Listen to Ian Bright read his review of..." → keep as-is after stripping prefix
    // For "Sarah Smith on improving diversity..." → keep as-is
    if (title !== original) changes.push({ slug: p.slug, from: original, to: title })
    return title
  }

  // ── "Webinar: [content]" ──
  if (title.startsWith('Webinar: ') || title.startsWith('Webinar:')) {
    title = title.replace(/^Webinar:\s*/, '')
    if (title !== original) changes.push({ slug: p.slug, from: original, to: title })
    return title
  }

  // ── "Evening meeting: [content]" ──
  if (title.startsWith('Evening meeting: ') || title.startsWith('Evening meeting:')) {
    title = title.replace(/^Evening meeting:\s*/, '')
    if (title !== original) changes.push({ slug: p.slug, from: original, to: title })
    return title
  }

  // ── "Speaker Series: [content]" ──
  if (title.startsWith('Speaker Series: ') || title.startsWith('Speaker Series:')) {
    title = title.replace(/^Speaker Series:\s*/, '')
    // e.g. "Interview with Yael Selfin" → leave as-is (already clean after prefix removal)
    // "Annual Conference interview with Evan Davis" → leave as-is
    // "SBE Conference 2016" → leave as-is
    if (title !== original) changes.push({ slug: p.slug, from: original, to: title })
    return title
  }

  // ── "Replay: [content]" ──
  // Note: the 2 worst duplicates were already removed. This catches the remaining one.
  if (title.startsWith('Replay: ') || title.startsWith('Replay:')) {
    title = title.replace(/^Replay:\s*/, '')
    if (title !== original) changes.push({ slug: p.slug, from: original, to: title })
    return title
  }

  // ── "Video: [content]" ──
  // Note: the 2 duplicates were already removed. This is a safety net.
  if (title.startsWith('Video: ') || title.startsWith('Video:')) {
    title = title.replace(/^Video:\s*/, '')
    if (title !== original) changes.push({ slug: p.slug, from: original, to: title })
    return title
  }

  // ── Annual Dinner titles: add speaker name ──
  const dinnerMatch = title.match(/^SPE Annual Dinner (\d{4})$/)
  if (dinnerMatch) {
    let speaker = extractSpeaker(p.speakers)
    if (speaker) {
      // Strip honorific prefixes for consistency
      speaker = speaker.replace(/^(Mr|Mrs|Ms|Miss|Dr|Prof|Sir|Dame|Lord|Lady)\s+/i, '')
      title = `SPE Annual Dinner ${dinnerMatch[1]} — ${speaker}`
      if (title !== original) changes.push({ slug: p.slug, from: original, to: title })
      return title
    }
  }

  // No change needed
  return title
}

// ──────────────────────────────────────────
// Apply normalisation
// ──────────────────────────────────────────
cleaned.forEach(p => {
  p.title = normaliseTitle(p)
})

// ──────────────────────────────────────────
// Report
// ──────────────────────────────────────────
console.log(`\nTitle changes: ${changes.length}`)
changes.forEach(c => {
  console.log(`  "${c.from}"`)
  console.log(`  → "${c.to}"`)
  console.log()
})

// ──────────────────────────────────────────
// Write back
// ──────────────────────────────────────────
writeFileSync('src/data/podcasts.json', JSON.stringify(cleaned, null, 2) + '\n')
console.log(`\nWrote ${cleaned.length} entries to src/data/podcasts.json`)
