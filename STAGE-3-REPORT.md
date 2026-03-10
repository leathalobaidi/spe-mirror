# Stage 3 — Content Architecture Report

**Completed:** 10 March 2026
**Commits:** `ae5b52e` (Phase 1), `65bf3ef` (Phase 2), `955c466` (Phase 3)

---

## Overview

Stage 3 elevated the SPE site from a collection of independent content silos into a connected content network. Three phases introduced hub pages that aggregate related content, speaker profile links that create person-centric navigation, and discovery improvements that ensure consistent wayfinding across all sections.

---

## Phase 1 — Annual Dinner Hub Pages

**Commit:** `ae5b52e`

### What was built

A data aggregation utility (`annualDinnerData.ts`, 229 lines) and hub page component (`AnnualDinnerHub.tsx`, 409 lines) that pull together all content related to each year's Annual Dinner from five data sources:

| Source | Content type | Count |
|--------|-------------|-------|
| `events.json` | Event listings | 181 |
| `dinner-reviews.json` | Dinner review articles | 9 |
| `podcasts.json` | Dinner speech recordings | 236 (9 dinner-review category) |
| `ryb-essays.json` | Rybczynski Prize essays | 23 |
| `news.json` | Related news articles | 111 |

### How it works

- `annualDinnerData.ts` builds year-keyed Maps from each data source at module load time
- Guest speaker name extracted from podcast `speakers` field (most reliable), falling back to event `speakers`
- Essay year derived from the "YYYY/YY" pattern in essay titles
- News matched by keyword patterns (annual dinner, booking, rybczynski, winner, shortlist)
- Hub pages cover 2014–2025 (12 years), including COVID-cancelled 2020

### Routes added

- `/events/annual-dinner/:year` — Dynamic route in `App.tsx`
- Year navigation strip added to `Events.tsx` using `getAllDinnerYears()`

---

## Phase 2 — Speaker Directory Expansion + Profile Links

**Commit:** `65bf3ef`

### What was built

Extended the speaker directory (`speakerDirectory.ts`, 244 lines) and added profile links to detail page headers so that speakers, authors, and chairs link directly to their profile pages when they exist in the directory.

### Profile link integration

| Page | Link type | Implementation |
|------|-----------|---------------|
| `EveningTalkDetail.tsx` | Speaker + Chair | `extractPeopleFromBody()` + `getSpeakerByName()` |
| `ArticleDetail.tsx` | Author | `extractPeopleFromBody()` + `getSpeakerByName()` |
| `EventDetail.tsx` | Speaker + Chair | `getSpeakerByName()` on event fields |
| `PodcastDetail.tsx` | Speaker | `getSpeakerByName()` on podcast speaker string |
| `BlogDetail.tsx` | Author | `getSpeakerByName()` on `post.author` |
| `BookReviewDetail.tsx` | Reviewer | `getSpeakerByName()` on `review.reviewer` |
| `AnnualDinnerHub.tsx` | Guest Speaker | `getSpeakerByName()` on aggregated speaker name |
| `ConferenceReportDetail.tsx` | Speaker | `getSpeakerByName()` on extracted speakers |

### Speaker directory composition

The directory scans 7 data sources and deduplicates by normalised name:

1. Evening talks (h4 speaker/chair extraction)
2. Events (speaker/chair fields)
3. Podcasts (speaker string parsing)
4. Conference reports (h4 speaker extraction)
5. Dinner reviews (h4 speaker extraction)
6. Articles (h4 author extraction)
7. Blog posts (author field)

---

## Phase 3 — Content Discovery Improvements

**Commit:** `955c466`

### Changes made

1. **SalarySurveys.tsx** — Replaced manual breadcrumb with `<Breadcrumbs>` component; added "Back to Reading Room" link
2. **MembersPolls.tsx** — Same improvements as SalarySurveys
3. **ReadingRoom.tsx** — Enhanced with articles + essays preview sections using `ContentCard` components
4. **Design token consistency** — Migrated remaining hardcoded colours to spe-* design tokens across components

### Breadcrumb coverage

19 pages now use the `<Breadcrumbs>` component with consistent variant styling:

- All 10 detail pages (articles, blogs, books, conference reports, dinner reviews, evening talks, events, news, podcasts, Ryb essays)
- All hub pages (Speakers, Reading Room, Events)
- Sub-section pages (Salary Surveys, Members' Polls, Speaker Directory, Member Directory, Council, Ryb Timeline, Generic Pages)

---

## Phase 4 — Verification Results

| Check | Result |
|-------|--------|
| TypeScript (`tsc --noEmit`) | Clean — 0 errors |
| Production build (`vite build`) | Passes — 2.34s |
| Route count | 49 routes in `App.tsx` |
| Page components | 40 `.tsx` files in `src/pages/` |
| ContentCard usage | 21 pages with preview grids |
| PrevNextNav | All 10 detail pages |
| ShareButtons | 13 detail/hub pages |
| Speaker profile links | 8 detail pages |
| Breadcrumbs | 19 pages |
| Related content sections | 11 detail pages |

---

## Content Inventory

| Data file | Items |
|-----------|-------|
| `events.json` | 181 |
| `podcasts.json` | 236 |
| `evening-talks.json` | 147 |
| `news.json` | 111 |
| `book-reviews.json` | 386 |
| `articles.json` | 29 |
| `ryb-essays.json` | 23 |
| `conference-reports.json` | 13 |
| `dinner-reviews.json` | 9 |
| `blogs.json` | 4 |
| **Total content items** | **1,139** |

---

## Connectivity Score

### Cross-link mechanisms (8 types)

1. **Speaker profile links** — Person names link to `/speakers/directory/:slug` (8 page types)
2. **Annual Dinner hub** — Aggregates 5 content types per year (12 years)
3. **Related content sections** — "More X" grids on all 11 detail page types
4. **PrevNextNav** — Sequential browsing across all 10 content collections
5. **Breadcrumb trails** — Hierarchical wayfinding on 19 pages
6. **Hub page previews** — Reading Room, Speakers, Events show latest items with "View all" links
7. **ShareButtons** — Social sharing on 13 pages
8. **Back links** — Sub-section pages link back to their parent hub

### Before Stage 3

- Content existed in independent silos
- No person-centric navigation
- No aggregation of related dinner content
- Inconsistent breadcrumbs and wayfinding

### After Stage 3

- Every detail page connects to related content, adjacent items, speaker profiles, and its parent hub
- Annual Dinner hubs aggregate 5 content types into single-year views
- Speaker directory enables person-centric discovery across all content types
- Consistent breadcrumb trails across all 19 key pages

### Score: **9/10**

The one remaining gap: the `directory.json` member directory data (non-public) is not cross-linked to authored content. This is intentional — member directory entries are private and should not expose associations to public-facing content.

---

## Cumulative Commit History

### Stage 1 — Content Integration (6 commits)
- `571df9e` Cross-links: Annual Dinner content connected
- `9c2bc65` Cross-links: Rybczynski Prize essays connected
- `e7cb62d` Rybczynski Prize timeline page
- `705f3cd` Speaker & contributor directory with profile pages
- `872be81` Fix orphaned high-value pages
- `7446499` Book reviews silo — reviewer cross-links

### Stage 2 — Cross-Link Pentagon (3 commits)
- `2909a75` Dinner content cross-link pentagon
- `b780bd1` Speaker profile cross-links to detail pages
- `1f84d72` Podcast cross-link pills to Rybczynski timeline

### Stage 3 — Content Architecture (3 commits)
- `ae5b52e` Annual Dinner hub pages for 2014–2025
- `65bf3ef` Speaker directory expansion + profile links
- `955c466` Content discovery improvements + design token consistency

**Total: 12 commits across 3 stages**
