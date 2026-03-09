# SPE Mirror — Website Modernization Design

## Overview
Complete modernization of the Society of Professional Economists (SPE) website. Preserve all original content, images, and media while applying a modern editorial/magazine aesthetic. Domain: thesbemirror.org. Portfolio piece for e17studio.com.

## Information Architecture

```
/                           → Homepage (hero video + editorial grid)
/events                     → All events (conferences, dinners, talks)
/events/:slug               → Individual event
/podcasts                   → Podcasts + Speaker Series (190 items)
/podcasts/:slug             → Individual episode with embedded media
/reading-room               → Book reviews, articles, salary surveys
/reading-room/book-reviews  → 386 book reviews
/reading-room/book-reviews/:slug → Individual review
/reading-room/articles      → 33 articles/essays
/reading-room/salary-surveys → Salary survey data
/news                       → News archive (76 items)
/news/:slug                 → Individual news article
/about                      → About SPE, governance, membership
```

**Navbar:** Logo | Events | Podcasts | Reading Room | News | About

## Visual Design

### Colour Palette (preserved from original)
- Primary Blue: #2789c2
- Deep Blue: #0678ba
- Deep Blue 2: #04598a
- Light Blue: #a4c0e3
- Nav gradient: linear-gradient(90deg, #0678ba, #a4c0e3)
- Nav text: #eef0f0
- Backgrounds: #f8f8f8, #fafafa, #fff
- Dark text: #222, #333, #555
- Accent green: #32db56
- Highlight: #ffee55
- Button default: #abddfa / #0d2f43
- Button hover: #2789c2 / #fff

### Typography
- Headlines: Playfair Display (serif) — editorial gravitas
- Body: Inter (sans-serif) — modern readability
- Monospace accents for data/stats where appropriate

### Design Principles
- Editorial/magazine feel — clean grids, generous whitespace
- Book covers with shadow/tilt hover effects
- Content cards with category tags and date badges
- Full-bleed hero images
- Smooth transitions and subtle hover animations
- Mobile-first responsive

## Tech Stack
- React 19 + Vite + Tailwind CSS v4
- React Router v7 (client-side SPA)
- JSON data files (content extracted from HTML mirror)
- All original images preserved in public/images/

## Homepage — Hero Section
- George Buckley intro video (Vimeo 628893749) plays muted in background
- On hover: audio unmutes, user can listen
- Overlay with SPE branding and tagline
- Below hero: editorial grid with Latest Podcast, Upcoming Events, Featured Book Review, Recent News

## Content Pipeline
1. Node script parses 952 HTML pages from mirror
2. Extracts: title, date, body (as HTML), images, media URLs
3. Auto-detects Vimeo/YouTube/SoundCloud URLs for embedding
4. Outputs structured JSON per content type
5. Copies all images to public/images/ with organized subdirs

## Key Components
- Navbar — sticky, gradient, 6 nav items + search + social icons
- HeroVideo — muted autoplay Vimeo, unmute on hover
- ContentCard — reusable for all content types
- MediaEmbed — auto-detect and render Vimeo/YouTube/SoundCloud
- BookCoverGrid — magazine-style grid with hover effects
- EventTimeline — chronological event display
- FilterBar — category/year/search filtering
- Footer — links, social media, sponsors

## Data Structure (JSON)
Each content type follows: { slug, title, date, category, body, images[], mediaUrls[], speakers[], tags[] }
