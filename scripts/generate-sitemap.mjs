#!/usr/bin/env node
/**
 * Generates sitemap.xml from route definitions and JSON data files.
 * Run: node scripts/generate-sitemap.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = (rel) => JSON.parse(readFileSync(resolve(root, rel), 'utf-8'))

const SITE = 'https://www.spe.org.uk'
const TODAY = new Date().toISOString().slice(0, 10)

// Static routes with priority hints
const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/events', priority: '0.9', changefreq: 'weekly' },
  { path: '/podcasts', priority: '0.8', changefreq: 'weekly' },
  { path: '/speakers', priority: '0.7', changefreq: 'monthly' },
  { path: '/speakers/evening-talks', priority: '0.7', changefreq: 'monthly' },
  { path: '/speakers/conference-reports', priority: '0.7', changefreq: 'monthly' },
  { path: '/speakers/dinner-reviews', priority: '0.7', changefreq: 'monthly' },
  { path: '/reading-room', priority: '0.8', changefreq: 'weekly' },
  { path: '/reading-room/book-reviews', priority: '0.7', changefreq: 'monthly' },
  { path: '/reading-room/articles', priority: '0.7', changefreq: 'monthly' },
  { path: '/reading-room/rybczynski-essays', priority: '0.7', changefreq: 'monthly' },
  { path: '/reading-room/rybczynski-prize', priority: '0.6', changefreq: 'yearly' },
  { path: '/reading-room/salary-surveys', priority: '0.6', changefreq: 'yearly' },
  { path: '/reading-room/members-polls', priority: '0.6', changefreq: 'yearly' },
  { path: '/news', priority: '0.8', changefreq: 'weekly' },
  { path: '/blogs', priority: '0.7', changefreq: 'weekly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/about/council', priority: '0.6', changefreq: 'monthly' },
  { path: '/speakers/directory', priority: '0.6', changefreq: 'monthly' },
  { path: '/membership', priority: '0.7', changefreq: 'monthly' },
  { path: '/membership/directory', priority: '0.5', changefreq: 'monthly' },
  { path: '/explore', priority: '0.7', changefreq: 'weekly' },
  { path: '/careers', priority: '0.6', changefreq: 'monthly' },
  { path: '/faqs', priority: '0.5', changefreq: 'monthly' },
  { path: '/advertise', priority: '0.5', changefreq: 'monthly' },
  { path: '/site-policies', priority: '0.3', changefreq: 'yearly' },
  { path: '/contact', priority: '0.5', changefreq: 'monthly' },
]

// Dynamic routes: { dataFile, routePrefix, slugField, priority }
// Events/podcasts slugs contain a prefix like "events/slug" or "podcasts/slug";
// the route uses only the bare part after the last "/".
const dynamicSources = [
  { file: 'src/data/events.json', prefix: '/events/', priority: '0.6', changefreq: 'monthly', stripPrefix: true },
  { file: 'src/data/podcasts.json', prefix: '/podcasts/', priority: '0.6', changefreq: 'monthly', stripPrefix: true },
  { file: 'src/data/evening-talks.json', prefix: '/speakers/evening-talks/', priority: '0.5', changefreq: 'yearly' },
  { file: 'src/data/conference-reports.json', prefix: '/speakers/conference-reports/', priority: '0.5', changefreq: 'yearly' },
  { file: 'src/data/dinner-reviews.json', prefix: '/speakers/dinner-reviews/', priority: '0.5', changefreq: 'yearly' },
  { file: 'src/data/book-reviews.json', prefix: '/reading-room/book-reviews/', priority: '0.5', changefreq: 'yearly' },
  { file: 'src/data/articles.json', prefix: '/reading-room/articles/', priority: '0.5', changefreq: 'yearly' },
  { file: 'src/data/ryb-essays.json', prefix: '/reading-room/rybczynski-essays/', priority: '0.5', changefreq: 'yearly' },
  { file: 'src/data/news.json', prefix: '/news/', priority: '0.6', changefreq: 'monthly' },
  { file: 'src/data/blogs.json', prefix: '/blogs/', priority: '0.5', changefreq: 'monthly' },
  { file: 'src/data/councillors.json', prefix: '/about/council/', priority: '0.4', changefreq: 'yearly' },
  { file: 'src/data/presidents.json', prefix: '/about/council/', priority: '0.4', changefreq: 'yearly' },
]

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

const urls = []
const seen = new Set()
let dupeCount = 0

function addUrl(entry) {
  const loc = entry.loc
  if (seen.has(loc)) { dupeCount++; return }
  seen.add(loc)
  urls.push(urlEntry(entry))
}

// Add static routes
for (const route of staticRoutes) {
  addUrl({
    loc: `${SITE}${route.path}`,
    lastmod: TODAY,
    changefreq: route.changefreq,
    priority: route.priority,
  })
}

// Add dynamic routes
for (const source of dynamicSources) {
  const items = read(source.file)
  for (const item of items) {
    if (!item.slug) continue
    const bareSlug = source.stripPrefix
      ? item.slug.split('/').pop()
      : item.slug
    const path = `${source.prefix}${bareSlug}`
    addUrl({
      loc: `${SITE}${path}`,
      lastmod: TODAY,
      changefreq: source.changefreq,
      priority: source.priority,
    })
  }
}

// Add GenericPage routes from pages.json (CMS sub-pages that aren't covered by
// the static or dynamic sources above, e.g. /about/privacy-policy)
const genericPages = read('src/data/pages.json')
for (const page of genericPages) {
  if (!page.slug) continue
  const path = `/${page.slug}`
  addUrl({
    loc: `${SITE}${path}`,
    lastmod: TODAY,
    changefreq: 'yearly',
    priority: '0.4',
  })
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`

const outPath = resolve(root, 'public/sitemap.xml')
writeFileSync(outPath, xml, 'utf-8')
console.log(`Sitemap generated: ${urls.length} URLs -> public/sitemap.xml${dupeCount ? ` (${dupeCount} duplicates skipped)` : ''}`)
