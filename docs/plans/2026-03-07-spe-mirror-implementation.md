# SPE Mirror Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a modern editorial/magazine-style website for the Society of Professional Economists, preserving all original content, images, and media from the downloaded mirror.

**Architecture:** React SPA with React Router v7 for client-side routing. Content stored as JSON data files extracted from the HTML mirror via a Node script. All original images served from public/images/. Vimeo/YouTube/SoundCloud auto-detected and embedded inline.

**Tech Stack:** React 19, Vite, Tailwind CSS v4, React Router v7, Playfair Display + Inter fonts

---

### Task 1: Scaffold Project

**Files:**
- Create: `~/spe-mirror/package.json`
- Create: `~/spe-mirror/vite.config.ts`
- Create: `~/spe-mirror/tsconfig.json`
- Create: `~/spe-mirror/src/main.tsx`
- Create: `~/spe-mirror/src/App.tsx`
- Create: `~/spe-mirror/src/index.css`
- Create: `~/spe-mirror/index.html`

**Step 1:** Initialize with Vite React-TS template, install deps (react, react-dom, react-router, @tailwindcss/vite, tailwindcss)
**Step 2:** Configure Tailwind v4 in vite.config.ts and index.css with SPE colour theme
**Step 3:** Set up Google Fonts (Playfair Display + Inter)
**Step 4:** Verify dev server starts with `npm run dev`
**Step 5:** Commit

---

### Task 2: Content Extraction Script

**Files:**
- Create: `~/spe-mirror/scripts/extract-content.js`

**Step 1:** Write Node script using built-in fs and a simple HTML parser
**Step 2:** Parse book reviews from mirror (`.book_review_template` pages) → `src/data/book-reviews.json`
**Step 3:** Parse podcasts/speakers (`.talk_template` pages) → `src/data/podcasts.json`
**Step 4:** Parse events (`.event_template` pages) → `src/data/events.json`
**Step 5:** Parse news (`.article_template` pages) → `src/data/news.json`
**Step 6:** Parse about/basic pages (`.basic-page_template`) → `src/data/pages.json`
**Step 7:** Auto-detect media URLs (Vimeo iframes, YouTube links, SoundCloud embeds)
**Step 8:** Run script, verify JSON output
**Step 9:** Commit

---

### Task 3: Copy and Organize Images

**Step 1:** Copy all images from mirror's `/site/assets/files/` to `~/spe-mirror/public/images/`
**Step 2:** Copy logo from mirror's `/site/templates/images/specific/logo.png`
**Step 3:** Copy sponsor logos
**Step 4:** Verify image paths in JSON data reference correct public/ paths
**Step 5:** Commit

---

### Task 4: Core Layout — Navbar + Footer + Router

**Files:**
- Create: `src/components/Navbar.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/layouts/MainLayout.tsx`
- Modify: `src/App.tsx` — add React Router with all routes

**Step 1:** Build Navbar with SPE gradient, Logo | Events | Podcasts | Reading Room | News | About, mobile hamburger
**Step 2:** Build Footer with social links, sponsor logos, copyright
**Step 3:** Build MainLayout wrapping Navbar + content + Footer
**Step 4:** Set up React Router with all routes (/, /events, /podcasts, /reading-room, /news, /about, plus detail routes)
**Step 5:** Verify navigation works
**Step 6:** Commit

---

### Task 5: Shared Components

**Files:**
- Create: `src/components/ContentCard.tsx`
- Create: `src/components/MediaEmbed.tsx`
- Create: `src/components/FilterBar.tsx`
- Create: `src/components/BookCover.tsx`
- Create: `src/components/HeroVideo.tsx`

**Step 1:** ContentCard — reusable card with image, title, date, category tag, excerpt
**Step 2:** MediaEmbed — auto-detect Vimeo/YouTube/SoundCloud URL and render responsive iframe
**Step 3:** FilterBar — category/year/search input for filtering content lists
**Step 4:** BookCover — book cover image with shadow and tilt hover effect
**Step 5:** HeroVideo — Vimeo background video, muted autoplay, unmute on hover
**Step 6:** Commit

---

### Task 6: Homepage

**Files:**
- Create: `src/pages/Home.tsx`

**Step 1:** Hero section with George Buckley Vimeo video (628893749) as muted background, overlay with SPE branding
**Step 2:** Editorial grid below: Latest Podcast, Upcoming Events, Featured Book Review
**Step 3:** Recent News horizontal scroll
**Step 4:** Sponsor logos section
**Step 5:** Commit

---

### Task 7: Events Section

**Files:**
- Create: `src/pages/Events.tsx`
- Create: `src/pages/EventDetail.tsx`

**Step 1:** Events listing page with filterable grid/timeline of all events
**Step 2:** EventDetail page showing full event content with speakers, venue, date, body, images
**Step 3:** Commit

---

### Task 8: Podcasts Section

**Files:**
- Create: `src/pages/Podcasts.tsx`
- Create: `src/pages/PodcastDetail.tsx`

**Step 1:** Podcasts listing with grid of episodes, filter by year/category
**Step 2:** PodcastDetail with embedded Vimeo/audio player, speaker info, full content
**Step 3:** Commit

---

### Task 9: Reading Room

**Files:**
- Create: `src/pages/ReadingRoom.tsx`
- Create: `src/pages/BookReviews.tsx`
- Create: `src/pages/BookReviewDetail.tsx`
- Create: `src/pages/Articles.tsx`
- Create: `src/pages/SalarySurveys.tsx`

**Step 1:** ReadingRoom landing with sections for book reviews, articles, salary surveys
**Step 2:** BookReviews grid with magazine-style book cover display, filtering
**Step 3:** BookReviewDetail with large cover, reviewer info, full review text
**Step 4:** Articles listing and detail
**Step 5:** SalarySurveys page
**Step 6:** Commit

---

### Task 10: News Section

**Files:**
- Create: `src/pages/News.tsx`
- Create: `src/pages/NewsDetail.tsx`

**Step 1:** News archive with content cards, date-sorted
**Step 2:** NewsDetail with banner image, full article content
**Step 3:** Commit

---

### Task 11: About Page

**Files:**
- Create: `src/pages/About.tsx`

**Step 1:** About page with SPE description, governance, embedded intro video, membership info
**Step 2:** Commit

---

### Task 12: Final Polish

**Step 1:** Responsive testing — all breakpoints
**Step 2:** Hover animations, transitions, scroll effects
**Step 3:** 404 page
**Step 4:** Page title/meta tags per route
**Step 5:** Final commit
