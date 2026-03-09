#!/usr/bin/env node

/**
 * SPE Website Mirror Content Extractor
 *
 * Parses the SPE website mirror HTML files and outputs structured JSON data files.
 * Uses only Node.js built-in modules (fs, path) with regex-based HTML parsing.
 *
 * Usage: node scripts/extract-content.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const MIRROR_ROOT = path.resolve(
  __dirname,
  '../../Downloads/Finance & Work/SPE/spe_mirror/spe.org.uk'
);

const OUTPUT_DIR = path.resolve(__dirname, '../src/data');

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

/** Read file contents, return null on error */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    return null;
  }
}

/** Recursively find all index.html files under a directory */
function findHtmlFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findHtmlFiles(full));
    } else if (entry.name === 'index.html') {
      results.push(full);
    }
  }
  return results;
}

/** Decode common HTML entities */
function decodeEntities(str) {
  if (!str) return '';
  return str
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#8221;/g, '\u201D')
    .replace(/&#8211;/g, '\u2013')
    .replace(/&#8212;/g, '\u2014')
    .replace(/&#8209;/g, '\u2011')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

/** Strip all HTML tags, returning plain text */
function stripTags(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

/** Get plain text from HTML: strip tags then decode entities, collapse whitespace */
function textContent(html) {
  if (!html) return '';
  return decodeEntities(stripTags(html)).replace(/\s+/g, ' ').trim();
}

/**
 * Extract the first regex match group from html.
 * Returns the captured group (index 1 by default), or fallback.
 */
function extractFirst(html, regex, group = 1, fallback = '') {
  const m = html.match(regex);
  return m ? m[group] : fallback;
}

/**
 * Extract all regex matches, returning an array of the specified capture group.
 */
function extractAll(html, regex, group = 1) {
  const results = [];
  let m;
  const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
  while ((m = re.exec(html)) !== null) {
    results.push(m[group]);
  }
  return results;
}

// ---------------------------------------------------------------------------
// Image path transformation
// ---------------------------------------------------------------------------

/**
 * Transform image src from relative mirror path to canonical /images/ID/filename form.
 * Handles patterns like:
 *   ../../../site/assets/files/4172/the_remaking.500x0.jpg
 *   ../../site/assets/files/14957/woman.1200x450.jpg
 */
function transformImagePath(src) {
  if (!src) return src;
  // Match site/assets/files/{id}/{filename}
  const m = src.match(/site\/assets\/files\/(\d+)\/([^'"?\s]+)/);
  if (m) {
    return `/images/${m[1]}/${m[2]}`;
  }
  return src;
}

/**
 * Extract all images from an HTML block and return transformed paths.
 * Skips template/navigation images (logo, icons, search, social, etc.).
 */
function extractImages(html) {
  if (!html) return [];
  const imgs = [];
  const seen = new Set();
  const re = /<img[^>]+src=['"]([^'"]+)['"]/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const src = m[1];
    // Skip template chrome images
    if (
      src.includes('/templates/images/') ||
      src.includes('magnifying-glass') ||
      src.includes('linkedin') ||
      src.includes('youtube.svg') ||
      src.includes('x.svg') ||
      src.includes('logo.png') ||
      src.includes('vimeocdn.com')
    ) continue;

    const transformed = transformImagePath(src);
    if (!seen.has(transformed)) {
      seen.add(transformed);
      imgs.push(transformed);
    }
  }
  return imgs;
}

// ---------------------------------------------------------------------------
// Media URL extraction
// ---------------------------------------------------------------------------

/**
 * Extract media URLs (Vimeo, YouTube, SoundCloud) from an HTML block.
 * Returns array of { type, id, url }.
 */
function extractMediaUrls(html) {
  if (!html) return [];
  const media = [];
  const seen = new Set();

  // Vimeo: player.vimeo.com/video/XXXXX or vimeo.com/XXXXX
  const vimeoRe = /(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)/g;
  let m;
  while ((m = vimeoRe.exec(html)) !== null) {
    const id = m[1];
    if (!seen.has('vimeo:' + id)) {
      seen.add('vimeo:' + id);
      media.push({
        type: 'vimeo',
        id,
        url: `https://player.vimeo.com/video/${id}`,
      });
    }
  }

  // YouTube: youtube.com/watch?v=XXXXX or youtu.be/XXXXX or youtube.com/embed/XXXXX
  const ytRe = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/g;
  while ((m = ytRe.exec(html)) !== null) {
    const id = m[1];
    if (!seen.has('youtube:' + id)) {
      seen.add('youtube:' + id);
      media.push({
        type: 'youtube',
        id,
        url: `https://www.youtube.com/watch?v=${id}`,
      });
    }
  }

  // SoundCloud: soundcloud.com URLs (extract full URL from iframe src)
  const scRe = /src=['"]([^'"]*soundcloud\.com[^'"]*)['"]/gi;
  while ((m = scRe.exec(html)) !== null) {
    const url = decodeEntities(m[1]);
    // Try to extract a track URL from the embed URL
    const trackMatch = url.match(/url=([^&]+)/);
    const trackUrl = trackMatch ? decodeURIComponent(trackMatch[1]) : url;
    const trackIdMatch = trackUrl.match(/tracks\/(\d+)/);
    const id = trackIdMatch ? trackIdMatch[1] : trackUrl;
    if (!seen.has('soundcloud:' + id)) {
      seen.add('soundcloud:' + id);
      media.push({
        type: 'soundcloud',
        id: String(id),
        url: trackUrl,
      });
    }
  }

  return media;
}

// ---------------------------------------------------------------------------
// Body HTML cleaning
// ---------------------------------------------------------------------------

/**
 * Clean body HTML: remove script/style tags, strip navigation chrome,
 * transform image paths, but preserve formatting tags.
 */
function cleanBodyHtml(html) {
  if (!html) return '';

  let cleaned = html;

  // Remove script and style blocks
  cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, '');
  cleaned = cleaned.replace(/<style[\s\S]*?<\/style>/gi, '');

  // Remove HTML comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

  // Remove members-notice divs
  cleaned = cleaned.replace(/<div\s+class=['"]members-notice['"]>[\s\S]*?<\/div>/gi, '');

  // Remove login-to-comment blocks
  cleaned = cleaned.replace(/<a[^>]*class=['"][^'"]*login[^'"]*['"][^>]*>[\s\S]*?<\/a>/gi, '');

  // Remove vimeo-ie8 fallback divs
  cleaned = cleaned.replace(/<div\s+class=['"]vimeo-ie8['"]>[\s\S]*?<\/div>/gi, '');

  // Transform image src paths
  cleaned = cleaned.replace(
    /(<img[^>]+src=['"])([^'"]+)(['"])/gi,
    (match, prefix, src, suffix) => {
      return prefix + transformImagePath(src) + suffix;
    }
  );

  // Also transform srcset paths
  cleaned = cleaned.replace(
    /srcset=['"]([^'"]+)['"]/gi,
    (match, srcset) => {
      const transformed = srcset
        .split(',')
        .map((entry) => {
          const parts = entry.trim().split(/\s+/);
          parts[0] = transformImagePath(parts[0]);
          return parts.join(' ');
        })
        .join(', ');
      return `srcset="${transformed}"`;
    }
  );

  // Collapse excessive whitespace while preserving newlines
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');

  return cleaned.trim();
}

// ---------------------------------------------------------------------------
// Template detection
// ---------------------------------------------------------------------------

/**
 * Detect the page template from the #page_content container's class.
 * Returns: 'book_review' | 'talk' | 'event' | 'article' | 'basic-page' | null
 */
function detectTemplate(html) {
  const m = html.match(/<div[^>]+class="container\s+(\w[\w-]*?)_template"[^>]+id="page_content"/);
  if (m) return m[1];
  return null;
}

// ---------------------------------------------------------------------------
// Common heading extraction
// ---------------------------------------------------------------------------

/**
 * Extract the heading block from #page_content.
 * Returns { title, dateRaw, h4s[] } where h4s are the raw h4 HTML strings.
 */
function extractHeading(html) {
  // Find the .heading div — must handle nested divs (e.g. PAST EVENT banner)
  const startMarker = /<div\s+class=['"]heading['"]>/;
  const startMatch = html.match(startMarker);
  if (!startMatch) {
    return { title: '', dateRaw: '', h4s: [] };
  }

  // Walk forward from the opening tag, counting div depth
  const startIdx = startMatch.index + startMatch[0].length;
  let depth = 1;
  let pos = startIdx;
  while (pos < html.length && depth > 0) {
    const nextOpen = html.indexOf('<div', pos);
    const nextClose = html.indexOf('</div>', pos);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen + 4;
    } else {
      depth--;
      if (depth === 0) break;
      pos = nextClose + 6;
    }
  }
  const headingHtml = html.substring(startIdx, pos === startIdx ? startIdx + 500 : html.indexOf('</div>', pos - 1));

  // Title from h1
  const title = textContent(extractFirst(headingHtml, /<h1[^>]*>([\s\S]*?)<\/h1>/i));

  // Date from h5
  const dateRaw = textContent(extractFirst(headingHtml, /<h5[^>]*>([\s\S]*?)<\/h5>/i));

  // All h4 blocks (there can be multiple)
  const h4s = extractAll(headingHtml, /<h4[^>]*>([\s\S]*?)<\/h4\s*>/gi);

  return { title, dateRaw, h4s };
}

// ---------------------------------------------------------------------------
// Date parsing
// ---------------------------------------------------------------------------

const MONTHS = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

/**
 * Parse a date string like "01 February 2016" or
 * "Event: 12 February 2026 6.00pm - 8.30pm" or
 * "Meeting: 05 August 2021 5.30pm"
 *
 * Returns { date: 'YYYY-MM-DD', time: string|null, dateLabel: string|null }
 */
function parseDate(raw) {
  if (!raw) return { date: null, time: null, dateLabel: null };

  // Strip prefix labels like "Event:", "Meeting:", "Webinar:" etc.
  let dateLabel = null;
  const labelMatch = raw.match(/^(\w+):\s*/);
  if (labelMatch) {
    dateLabel = labelMatch[1];
  }
  const cleaned = raw.replace(/^\w+:\s*/, '');

  // Extract day, month name, year
  const dateMatch = cleaned.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
  if (!dateMatch) return { date: null, time: null, dateLabel };

  const day = parseInt(dateMatch[1], 10);
  const monthName = dateMatch[2].toLowerCase();
  const year = parseInt(dateMatch[3], 10);
  const month = MONTHS[monthName];
  if (month === undefined) return { date: null, time: null, dateLabel };

  const isoDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // Extract time portion (after the year)
  let time = null;
  const afterDate = cleaned.substring(dateMatch.index + dateMatch[0].length).trim();
  if (afterDate) {
    // e.g. "6.00pm - 8.30pm" or "5.30pm"
    time = afterDate.replace(/^\s*[-–]\s*/, '').trim();
    if (time) {
      // Normalise: keep it as-is but trim
      time = time.trim();
    }
  }

  return { date: isoDate, time: time || null, dateLabel };
}

// ---------------------------------------------------------------------------
// Main content extraction
// ---------------------------------------------------------------------------

/**
 * Extract the main-content block from the page HTML.
 * This is the primary body content area.
 */
function extractMainContent(html) {
  // The main body is inside .main-content
  // Try matching the div with class containing 'main-content'
  const m = html.match(/<div\s+class=['"][^'"]*main-content[^'"]*['"][^>]*>([\s\S]*?)(?=<\/div>\s*<div\s+id=['"]right['"]|<\/div>\s*<\/div>\s*<div\s+class=['"]row['"]|<\/div>\s*\n*<\/div>\s*\n*<div\s+class=['"]row['"])/i);
  if (m) {
    return m[1];
  }

  // Fallback: try to get content between main-content div and the next sibling
  const startIdx = html.indexOf("class='main-content") || html.indexOf('class="main-content');
  if (startIdx === -1) return '';

  // Find the opening tag close
  const tagClose = html.indexOf('>', startIdx);
  if (tagClose === -1) return '';

  // Now we need to find the matching closing div. Count depth.
  let depth = 1;
  let pos = tagClose + 1;
  const content = [];
  while (pos < html.length && depth > 0) {
    const nextOpen = html.indexOf('<div', pos);
    const nextClose = html.indexOf('</div>', pos);

    if (nextClose === -1) break;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      content.push(html.substring(pos, nextOpen));
      depth++;
      pos = html.indexOf('>', nextOpen) + 1;
    } else {
      content.push(html.substring(pos, nextClose));
      depth--;
      pos = nextClose + 6;
    }
  }

  return content.join('');
}

/**
 * Alternative: extract everything inside the main-block area.
 * Used when main-content div is missing (some templates).
 */
function extractMainBlock(html) {
  const m = html.match(/<div\s+class=['"][^'"]*main-block[^'"]*['"][^>]*>([\s\S]*?)<\/div>\s*<!--\s*\.main-block\s*-->/i);
  if (m) return m[1];
  return '';
}

// ---------------------------------------------------------------------------
// Slug generation
// ---------------------------------------------------------------------------

/**
 * Generate a slug from the file path relative to the mirror root.
 * e.g. /reading-room/book-reviews/the-remaking-of-the-mining-industry/index.html
 *   -> the-remaking-of-the-mining-industry
 */
function slugFromPath(filePath, sectionDir) {
  const rel = path.relative(sectionDir, filePath);
  // rel looks like "the-remaking-of-the-mining-industry/index.html"
  // or "past-events/8712-1/index.html"
  const parts = rel.split(path.sep);
  // Remove index.html
  parts.pop();
  return parts.join('/');
}

// ---------------------------------------------------------------------------
// Section-specific extractors
// ---------------------------------------------------------------------------

// -- BOOK REVIEWS --

function extractBookReview(filePath) {
  const html = readFile(filePath);
  if (!html) return null;
  if (detectTemplate(html) !== 'book_review') return null;

  const { title, dateRaw, h4s } = extractHeading(html);
  if (!title) return null;

  const { date } = parseDate(dateRaw);

  // Parse h4 blocks for reviewer, author, book info
  let reviewer = '';
  let author = '';
  let bookTitle = '';

  for (const h4Html of h4s) {
    const h4Text = textContent(h4Html);

    if (h4Text.match(/reviewer:\s*/i)) {
      // Reviewer line: "Reviewer: Dr Diane Coyle OBE, Director, Enlightenment Economics"
      reviewer = h4Text.replace(/^.*?reviewer:\s*/i, '').trim();
    } else if (!reviewer && !h4Text.match(/reviewer/i)) {
      // First non-reviewer h4 is typically author + publisher info
      // e.g. "David Humphreys 2015, Palgrave Macmillan, 250 pages, ISBN 9781137442000"
      // Extract author (bold text)
      const authorMatch = h4Html.match(/<strong>([\s\S]*?)<\/strong>/);
      if (authorMatch) {
        author = textContent(authorMatch[1]);
      }
    }
  }

  // Cover image
  let coverImage = '';
  const coverMatch = html.match(/<img[^>]+class=['"][^'"]*cover[^'"]*['"][^>]+src=['"]([^'"]+)['"]/i);
  if (coverMatch) {
    coverImage = transformImagePath(coverMatch[1]);
  }

  // Body content
  const mainContent = extractMainContent(html);
  const body = cleanBodyHtml(mainContent);
  const images = extractImages(mainContent);

  const slug = slugFromPath(filePath, path.join(MIRROR_ROOT, 'reading-room/book-reviews'));

  return { slug, title, date, reviewer, author, bookTitle, coverImage, body, images };
}

// -- PODCASTS / SPEAKERS --

function extractPodcast(filePath) {
  const html = readFile(filePath);
  if (!html) return null;
  if (detectTemplate(html) !== 'talk') return null;

  const { title, dateRaw, h4s } = extractHeading(html);
  if (!title) return null;

  const { date } = parseDate(dateRaw);

  // Determine category from breadcrumbs / path
  const relToSpeakers = path.relative(path.join(MIRROR_ROOT, 'speakers'), filePath);
  let category = 'speaker-series';
  if (relToSpeakers.startsWith('conferences')) category = 'conference-report';
  else if (relToSpeakers.startsWith('dinners')) category = 'dinner-review';
  else if (relToSpeakers.startsWith('podcasts')) category = 'podcast';
  else if (relToSpeakers.startsWith('evening-talks')) category = 'speaker-series';

  // Parse speakers from h4 blocks
  const speakers = [];
  for (const h4Html of h4s) {
    const h4Text = textContent(h4Html);
    // Look for "Speaker:", "Chair:", or just names
    // Multiple speakers can be in one h4 separated by <br>
    const lines = h4Html.split(/<br\s*\/?>/i);
    for (const line of lines) {
      const lineText = textContent(line).trim();
      if (!lineText) continue;
      // Skip venue lines
      if (lineText.match(/^venue:\s*/i)) continue;
      speakers.push(lineText);
    }
  }

  // Body + media
  const mainContent = extractMainContent(html);
  const mainBlock = mainContent || extractMainBlock(html);

  // Also look for media in the broader page content area (iframes can be outside main-content)
  const pageContentMatch = html.match(/id="page_content">([\s\S]*?)<\/div>\s*<!--\s*#bodywrap|<\/div>\s*<!--\s*\.container\s+#page_content/);
  const broadContent = pageContentMatch ? pageContentMatch[1] : html;

  const body = cleanBodyHtml(mainBlock);
  const images = extractImages(mainBlock);
  const mediaUrls = extractMediaUrls(broadContent);

  // Generate slug relative to the speakers directory
  let slug;
  const relPath = path.relative(path.join(MIRROR_ROOT, 'speakers'), filePath);
  const parts = relPath.split(path.sep);
  parts.pop(); // remove index.html
  slug = parts.join('/');

  return { slug, title, date, speakers, category, body, mediaUrls, images };
}

// -- EVENTS --

function extractEvent(filePath) {
  const html = readFile(filePath);
  if (!html) return null;
  if (detectTemplate(html) !== 'event') return null;

  const { title, dateRaw, h4s } = extractHeading(html);
  if (!title) return null;

  const { date, time, dateLabel } = parseDate(dateRaw);

  // Parse h4 blocks for venue, speakers, chair
  let venue = '';
  const speakers = [];
  let chair = '';

  for (const h4Html of h4s) {
    const h4Text = textContent(h4Html);

    if (h4Text.match(/^venue:\s*/i)) {
      venue = h4Text.replace(/^venue:\s*/i, '').trim();
    } else {
      // Look for speaker/chair lines
      const lines = h4Html.split(/<br\s*\/?>/i);
      for (const line of lines) {
        const lineText = textContent(line).trim();
        if (!lineText) continue;
        if (lineText.match(/^venue:\s*/i)) {
          venue = lineText.replace(/^venue:\s*/i, '').trim();
        } else if (lineText.match(/^chair:\s*/i)) {
          chair = lineText.replace(/^chair:\s*/i, '').trim();
        } else if (lineText.match(/^speaker:\s*/i)) {
          speakers.push(lineText.replace(/^speaker:\s*/i, '').trim());
        } else if (lineText.match(/^panellist:\s*/i)) {
          speakers.push(lineText.replace(/^panellist:\s*/i, '').trim());
        } else if (lineText && !lineText.match(/^(venue|chair|speaker|panellist):/i)) {
          // Could be speaker info without a prefix
          speakers.push(lineText);
        }
      }
    }
  }

  const category = dateLabel || null;

  const mainContent = extractMainContent(html);
  const mainBlock = mainContent || extractMainBlock(html);
  const body = cleanBodyHtml(mainBlock);
  const images = extractImages(mainBlock);

  const slug = slugFromPath(filePath, path.join(MIRROR_ROOT, 'whats-on'));

  return { slug, title, date, time, venue, speakers, chair, category, body, images };
}

// -- NEWS --

function extractNews(filePath) {
  const html = readFile(filePath);
  if (!html) return null;
  if (detectTemplate(html) !== 'article') return null;

  const { title, dateRaw } = extractHeading(html);
  if (!title) return null;

  const { date } = parseDate(dateRaw);

  // Banner image
  let bannerImage = '';
  const bannerMatch = html.match(/<div\s+class=['"]banner_image_wrap['"][^>]*>[\s\S]*?<img[^>]+src=['"]([^'"]+)['"]/i);
  if (bannerMatch) {
    bannerImage = transformImagePath(bannerMatch[1]);
  }

  const mainContent = extractMainContent(html);
  const mainBlock = mainContent || extractMainBlock(html);
  const body = cleanBodyHtml(mainBlock);
  const images = extractImages(mainBlock);

  const slug = slugFromPath(filePath, path.join(MIRROR_ROOT, 'news'));

  return { slug, title, date, bannerImage, body, images };
}

// -- BASIC PAGES --

function extractBasicPage(filePath) {
  const html = readFile(filePath);
  if (!html) return null;
  if (detectTemplate(html) !== 'basic-page') return null;

  const { title } = extractHeading(html);
  if (!title) return null;

  const mainContent = extractMainContent(html);
  const mainBlock = mainContent || extractMainBlock(html);

  // Also look for media in the broader content
  const pageContentMatch = html.match(/id="page_content">([\s\S]*?)<\/div>\s*<!--/);
  const broadContent = pageContentMatch ? pageContentMatch[1] : html;

  const body = cleanBodyHtml(mainBlock);
  const images = extractImages(mainBlock);
  const mediaUrls = extractMediaUrls(broadContent);

  // Slug: relative to mirror root, within about/membership/careers sections
  const relToRoot = path.relative(MIRROR_ROOT, filePath);
  const parts = relToRoot.split(path.sep);
  parts.pop(); // remove index.html
  const slug = parts.join('/');

  return { slug, title, body, images, mediaUrls };
}

// ---------------------------------------------------------------------------
// Sort helper
// ---------------------------------------------------------------------------

function sortByDateDesc(items) {
  return items.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });
}

// ---------------------------------------------------------------------------
// Main processing
// ---------------------------------------------------------------------------

function main() {
  console.log('SPE Content Extractor');
  console.log('=====================');
  console.log(`Mirror root: ${MIRROR_ROOT}`);
  console.log(`Output dir:  ${OUTPUT_DIR}`);
  console.log();

  if (!fs.existsSync(MIRROR_ROOT)) {
    console.error(`ERROR: Mirror root does not exist: ${MIRROR_ROOT}`);
    process.exit(1);
  }

  // Create output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const errors = [];

  // -----------------------------------------------------------------------
  // 1. Book Reviews
  // -----------------------------------------------------------------------
  console.log('--- Extracting book reviews ---');
  const bookReviewDir = path.join(MIRROR_ROOT, 'reading-room/book-reviews');
  const bookReviewFiles = findHtmlFiles(bookReviewDir);
  const bookReviews = [];

  for (const f of bookReviewFiles) {
    // Skip listing pages
    if (f === path.join(bookReviewDir, 'index.html')) continue;

    try {
      const item = extractBookReview(f);
      if (item) {
        bookReviews.push(item);
      }
    } catch (e) {
      errors.push(`Book review ${f}: ${e.message}`);
    }
  }

  sortByDateDesc(bookReviews);
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'book-reviews.json'),
    JSON.stringify(bookReviews, null, 2)
  );
  console.log(`  Extracted: ${bookReviews.length} book reviews`);

  // -----------------------------------------------------------------------
  // 2. Podcasts & Speakers
  // -----------------------------------------------------------------------
  console.log('--- Extracting podcasts & speakers ---');
  const speakersDir = path.join(MIRROR_ROOT, 'speakers');
  const speakerFiles = findHtmlFiles(speakersDir);
  const podcasts = [];

  // Listing/index pages to skip
  const speakerListingPaths = [
    path.join(speakersDir, 'index.html'),
    path.join(speakersDir, 'evening-talks/index.html'),
    path.join(speakersDir, 'conferences/index.html'),
    path.join(speakersDir, 'dinners/index.html'),
    path.join(speakersDir, 'podcasts/index.html'),
    path.join(speakersDir, 'masterclasses/index.html'),
  ];

  for (const f of speakerFiles) {
    if (speakerListingPaths.includes(f)) continue;

    try {
      const item = extractPodcast(f);
      if (item) {
        podcasts.push(item);
      }
    } catch (e) {
      errors.push(`Podcast/speaker ${f}: ${e.message}`);
    }
  }

  // Also look under speakers-corner for podcasts
  const speakersCornerDir = path.join(MIRROR_ROOT, 'speakers-corner');
  const speakersCornerFiles = findHtmlFiles(speakersCornerDir);
  for (const f of speakersCornerFiles) {
    if (f === path.join(speakersCornerDir, 'index.html')) continue;
    try {
      const html = readFile(f);
      if (!html) continue;
      const template = detectTemplate(html);
      if (template === 'talk') {
        const item = extractPodcast(f);
        if (item) {
          // Fix slug for speakers-corner items
          const relPath = path.relative(MIRROR_ROOT, f);
          const parts = relPath.split(path.sep);
          parts.pop();
          item.slug = parts.join('/');
          item.category = 'podcast';
          podcasts.push(item);
        }
      }
    } catch (e) {
      errors.push(`Speakers-corner ${f}: ${e.message}`);
    }
  }

  sortByDateDesc(podcasts);
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'podcasts.json'),
    JSON.stringify(podcasts, null, 2)
  );
  console.log(`  Extracted: ${podcasts.length} podcasts/speakers`);

  // -----------------------------------------------------------------------
  // 3. Events
  // -----------------------------------------------------------------------
  console.log('--- Extracting events ---');
  const eventsDir = path.join(MIRROR_ROOT, 'whats-on');
  const eventFiles = findHtmlFiles(eventsDir);
  const events = [];

  const eventListingPaths = [
    path.join(eventsDir, 'index.html'),
    path.join(eventsDir, 'past-events/index.html'),
  ];

  for (const f of eventFiles) {
    if (eventListingPaths.includes(f)) continue;

    try {
      const item = extractEvent(f);
      if (item) {
        events.push(item);
      }
    } catch (e) {
      errors.push(`Event ${f}: ${e.message}`);
    }
  }

  sortByDateDesc(events);
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'events.json'),
    JSON.stringify(events, null, 2)
  );
  console.log(`  Extracted: ${events.length} events`);

  // -----------------------------------------------------------------------
  // 4. News
  // -----------------------------------------------------------------------
  console.log('--- Extracting news ---');
  const newsDir = path.join(MIRROR_ROOT, 'news');
  const newsFiles = findHtmlFiles(newsDir);
  const newsItems = [];

  for (const f of newsFiles) {
    if (f === path.join(newsDir, 'index.html')) continue;

    try {
      const item = extractNews(f);
      if (item) {
        newsItems.push(item);
      }
    } catch (e) {
      errors.push(`News ${f}: ${e.message}`);
    }
  }

  sortByDateDesc(newsItems);
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'news.json'),
    JSON.stringify(newsItems, null, 2)
  );
  console.log(`  Extracted: ${newsItems.length} news articles`);

  // -----------------------------------------------------------------------
  // 5. Basic Pages (about, membership, careers, etc.)
  // -----------------------------------------------------------------------
  console.log('--- Extracting basic pages ---');
  const basicPageDirs = ['about', 'membership', 'careers', 'contact', 'advertise', 'site-policies'];
  const pages = [];

  for (const dir of basicPageDirs) {
    const sectionDir = path.join(MIRROR_ROOT, dir);
    const files = findHtmlFiles(sectionDir);

    for (const f of files) {
      try {
        const item = extractBasicPage(f);
        if (item) {
          pages.push(item);
        }
      } catch (e) {
        errors.push(`Page ${f}: ${e.message}`);
      }
    }
  }

  // Also try the reading-room section pages (articles, salary-survey, etc.)
  const readingRoomDir = path.join(MIRROR_ROOT, 'reading-room');
  const rrFiles = findHtmlFiles(readingRoomDir);
  for (const f of rrFiles) {
    // Skip book-reviews (already extracted) and listing pages we may want
    if (f.includes('/book-reviews/')) continue;
    try {
      const item = extractBasicPage(f);
      if (item) {
        pages.push(item);
      }
    } catch (e) {
      errors.push(`Page ${f}: ${e.message}`);
    }
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'pages.json'),
    JSON.stringify(pages, null, 2)
  );
  console.log(`  Extracted: ${pages.length} basic pages`);

  // -----------------------------------------------------------------------
  // Summary
  // -----------------------------------------------------------------------
  console.log();
  console.log('=== Summary ===');
  console.log(`Book reviews:      ${bookReviews.length}`);
  console.log(`Podcasts/Speakers: ${podcasts.length}`);
  console.log(`Events:            ${events.length}`);
  console.log(`News articles:     ${newsItems.length}`);
  console.log(`Basic pages:       ${pages.length}`);
  console.log(`Total:             ${bookReviews.length + podcasts.length + events.length + newsItems.length + pages.length}`);

  if (errors.length > 0) {
    console.log();
    console.log(`=== Errors (${errors.length}) ===`);
    for (const err of errors.slice(0, 20)) {
      console.log(`  - ${err}`);
    }
    if (errors.length > 20) {
      console.log(`  ... and ${errors.length - 20} more`);
    }
  }

  console.log();
  console.log(`Output written to: ${OUTPUT_DIR}`);
}

main();
