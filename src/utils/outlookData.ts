/**
 * Outlook for the UK Economy series — year-keyed data aggregation.
 *
 * The SPE has hosted an annual "Outlook for the UK Economy" panel event
 * each January since at least 2015.  Content about each year's event can
 * appear across events.json, evening-talks.json and podcasts.json.
 *
 * This module mirrors the pattern of annualDinnerData.ts: it builds a
 * Map<number, OutlookYear> at import time and exposes simple accessor
 * functions for the hub page component.
 *
 * Naming evolution:
 *   "2016 Outlook for UK Economy" → "Outlook for the UK Economy 20XX"
 *   → "UK Outlook for 2022" → "European Economic Outlook 2025"
 *   → "UK & Euro Area Economic Outlook 2026"
 */

import eventsData from '../data/events.json'
import eveningTalksData from '../data/evening-talks.json'
import podcastsData from '../data/podcasts.json'
import { getYear } from './helpers'

// ── Types ────────────────────────────────────────────────────────────────

type EventEntry = (typeof eventsData)[0]
type TalkEntry = (typeof eveningTalksData)[0]
type PodcastEntry = (typeof podcastsData)[0]

export interface OutlookSpeaker {
  name: string
  affiliation: string
}

export interface OutlookYear {
  year: number
  /** Display title for this year's event (taken from the event or talk) */
  title: string
  /** The event listing (if one exists in events.json) */
  event: EventEntry | null
  /** The evening-talk review/write-up */
  eveningTalk: TalkEntry | null
  /** Podcast or recording of the event */
  podcast: PodcastEntry | null
  /** Panel speakers (excluding the chair) */
  speakers: OutlookSpeaker[]
  /** Panel chair (if listed) */
  chair: OutlookSpeaker | null
  /** Whether this was a virtual/webinar event */
  virtual: boolean
}

// ── Core event slugs (manually verified from investigation) ──────────────
//
// These are the known slugs for the main January Outlook events.
// Excludes false positives like "BP Energy Outlook" (4957) and
// unrelated economy events (e.g. "Challenge and Change" 4692).

const CORE_EVENT_SLUGS = new Set([
  '3851',       // 2016
  '4810',       // 2018
  '5137',       // 2019
  '7270-1',     // 2020
  '7795-1',     // 2021
  '8783-1',     // 2022
  '11267-1',    // 2023
  '12091-1',    // 2024
  'european-economic-outlook-2026',           // 2025
  'uk-euro-area-economic-outlook-2027',       // 2026
])

// ── Evening talk slugs (manually verified) ───────────────────────────────

const TALK_SLUG_TO_YEAR: Record<string, number> = {
  'outlook-for-the-uk-economy': 2015,
  'uk-outlook-panel-debate': 2016,
  '2017-outlook-for-the-uk-economy': 2017,
  '2018-outlook-for-the-uk-economy': 2018,
  '2019-outlook-for-the-uk-economy': 2019,
  '2020-outlook-for-the-uk-economy-watch-video-now': 2020,
  'uk-outlook-for-2022': 2022,
}

// ── Podcast slugs (manually verified, excluding duplicates) ──────────────

const PODCAST_SLUG_TO_YEAR: Record<string, number> = {
  'outlook-for-the-uk-economy': 2015,
  'uk-outlook-panel-debate': 2016,
  '2018-outlook-for-the-uk-economy': 2018,
  '2019-outlook-for-the-uk-economy': 2019,
  '2020-outlook-for-the-uk-economy-watch-video-now': 2020,
  'webinar-uk-outlook-for-2022': 2022,
  // Note: 'video-2020-outlook-for-the-uk-economy' is a duplicate of the
  // 2020 entry (video vs audio version) — we keep only the primary one.
}

// ── Speaker parsing ──────────────────────────────────────────────────────

/**
 * Parse "Name, Title, Organisation" → { name, affiliation }.
 * Handles variants: "Name, Org" and "Name" (no comma).
 */
function parseSpeakerString(raw: string): OutlookSpeaker {
  const trimmed = raw.trim()
  const commaIdx = trimmed.indexOf(',')
  if (commaIdx === -1) {
    return { name: trimmed, affiliation: '' }
  }
  const name = trimmed.slice(0, commaIdx).trim()
  const rest = trimmed.slice(commaIdx + 1).trim()
  return { name, affiliation: rest }
}

// ── Build the year map ───────────────────────────────────────────────────

const outlookYears = new Map<number, OutlookYear>()

// Phase 1: Seed from events
for (const ev of eventsData) {
  if (!CORE_EVENT_SLUGS.has(ev.slug)) continue
  const year = getYear(ev.date)
  if (!year) continue

  const speakers = (ev.speakers ?? []).map(parseSpeakerString)
  const chair = ev.chair ? parseSpeakerString(ev.chair) : null
  const virtual = /webinar|live webinar/i.test(ev.title)

  outlookYears.set(year, {
    year,
    title: ev.title,
    event: ev,
    eveningTalk: null,
    podcast: null,
    speakers,
    chair,
    virtual,
  })
}

// Phase 2: Attach evening talks
for (const talk of eveningTalksData) {
  const year = TALK_SLUG_TO_YEAR[talk.slug]
  if (!year) continue

  const existing = outlookYears.get(year)
  if (existing) {
    existing.eveningTalk = talk
  } else {
    // Years with talks but no event (e.g. 2015, 2017)
    outlookYears.set(year, {
      year,
      title: talk.title.replace(/\s*-\s*watch video now!?\s*/i, ''),
      event: null,
      eveningTalk: talk,
      podcast: null,
      speakers: [],
      chair: null,
      virtual: false,
    })
  }
}

// Phase 3: Attach podcasts
for (const pod of podcastsData) {
  const year = PODCAST_SLUG_TO_YEAR[pod.slug]
  if (!year) continue

  const existing = outlookYears.get(year)
  if (existing) {
    existing.podcast = pod
  }
  // If no event or talk exists for this year, don't create a standalone
  // podcast-only entry — it would be a very sparse hub page.
}

// Phase 4: For 2015 and 2017 (no event), try to extract speakers from
// podcast speaker fields if the event speakers array is empty
for (const [year, data] of outlookYears) {
  if (data.speakers.length === 0 && data.podcast?.speakers?.length) {
    data.speakers = data.podcast.speakers
      .map(s => s.replace(/^Speaker:\s*/i, ''))
      .map(parseSpeakerString)
  }
}

// ── Public API ───────────────────────────────────────────────────────────

/** Get the aggregated Outlook data for a specific year */
export function getOutlookYear(year: number): OutlookYear | undefined {
  return outlookYears.get(year)
}

/** Get all Outlook years as a Map */
export function getAllOutlookYears(): Map<number, OutlookYear> {
  return outlookYears
}

/** Get all Outlook years sorted descending (newest first) */
export function getOutlookYearsList(): OutlookYear[] {
  return [...outlookYears.values()].sort((a, b) => b.year - a.year)
}

/** Get just the year numbers, sorted descending */
export function getOutlookYearNumbers(): number[] {
  return [...outlookYears.keys()].sort((a, b) => b - a)
}
