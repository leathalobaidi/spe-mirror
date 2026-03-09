/**
 * embed-media.cjs
 *
 * Matches Vimeo/YouTube/SoundCloud CSV entries to JSON data files
 * and populates the mediaUrls arrays.
 *
 * Strategy:
 * 1. Parse all three CSVs
 * 2. For each JSON entry, scan body HTML for existing embedded media IDs
 * 3. Fuzzy-match CSV titles to JSON titles
 * 4. Populate mediaUrls with matches (deduplicating)
 * 5. Update both podcasts.json AND category-specific JSON files
 * 6. Report unmatched entries
 */

const fs = require('fs');
const path = require('path');

// ─── Paths ───────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const VIMEO_CSV = path.join(process.env.HOME, 'Downloads', 'spe_vimeo_content (1).csv');
const YOUTUBE_CSV = path.join(process.env.HOME, 'Downloads', 'spe_youtube_content.csv');
const SOUNDCLOUD_CSV = path.join(process.env.HOME, 'Downloads', 'spe_soundcloud_content (1).csv');

// ─── CSV Parser (handles quoted fields with commas) ──────
function parseCSV(text) {
  const lines = text.split('\n');
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    // Handle multi-line quoted fields
    let fullLine = line;
    while (countQuotes(fullLine) % 2 !== 0 && i + 1 < lines.length) {
      i++;
      fullLine += '\n' + lines[i];
    }
    const values = parseCSVLine(fullLine);
    if (values.length >= 2) {
      const obj = {};
      headers.forEach((h, idx) => { obj[h.trim()] = (values[idx] || '').trim(); });
      rows.push(obj);
    }
  }
  return rows;
}

function countQuotes(s) {
  return (s.match(/"/g) || []).length;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ─── Load CSVs ───────────────────────────────────────────
console.log('Loading CSVs...');
const vimeoEntries = parseCSV(fs.readFileSync(VIMEO_CSV, 'utf8'));
const youtubeEntries = parseCSV(fs.readFileSync(YOUTUBE_CSV, 'utf8'));
const soundcloudEntries = parseCSV(fs.readFileSync(SOUNDCLOUD_CSV, 'utf8'))
  .filter(e => e.Status !== 'Removed/Private'); // Skip removed entries

console.log(`  Vimeo: ${vimeoEntries.length} entries`);
console.log(`  YouTube: ${youtubeEntries.length} entries`);
console.log(`  SoundCloud: ${soundcloudEntries.length} (live only, skipped Removed/Private)`);

// ─── Load JSON data files ────────────────────────────────
const dataFiles = {
  'podcasts': JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'podcasts.json'), 'utf8')),
  'evening-talks': JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'evening-talks.json'), 'utf8')),
  'conference-reports': JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'conference-reports.json'), 'utf8')),
  'dinner-reviews': JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'dinner-reviews.json'), 'utf8')),
};

// ─── Title normalization for fuzzy matching ──────────────
function normalize(title) {
  if (!title) return '';
  return title
    .replace(/\.mp4$/i, '')
    .replace(/^SPE\s+/i, '')
    .replace(/^SPE-/i, '')
    .replace(/^SBE\s+/i, '')
    .replace(/^Watch\s+/i, '')
    .replace(/\bPodcast\s*Interview\b/i, 'Interview')
    .replace(/\bPodCast\s*Interview\b/i, 'Interview')
    .replace(/\bBook\s*Review\s*Podcast\b/i, 'Book Review')
    .replace(/\bBooks?\s+/i, 'Book Review ')
    .replace(/\bInterview\s+with\s+/i, '')
    .replace(/\bInterview\s+-\s+/i, '')
    .replace(/\bInterview\s+/i, '')
    .replace(/\bWebinar\s+-?\s*/i, '')
    .replace(/\bin conversation with\b/i, '')
    .replace(/\btalks to\b/i, '')
    .replace(/\btalks\b/i, '')
    .replace(/\bspeaks to\b/i, '')
    .replace(/\s*-\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*\d{2,4}\s*$/i, '')
    .replace(/\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*\d{2,4}\s*$/i, '')
    .replace(/\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s*\d{4}\s*$/i, '')
    .replace(/\s*-\s*\d{4}\s*$/, '')
    .replace(/\s+(20\d{2})\s*$/, '')
    .replace(/\s*\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*$/i, '')
    .replace(/\s*Part\s*\d+\s*$/i, '')
    .replace(/\s*-\s*Part\s*\d+\s*$/i, '')
    .replace(/\bDr\.?\s+/gi, '')
    .replace(/\bProf\.?\s+/gi, '')
    .replace(/\bSir\s+/gi, '')
    .replace(/\bLord\s+/gi, '')
    .replace(/\bDame\s+/gi, '')
    .replace(/\bCBE\b/gi, '')
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .replace(/[^a-z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

// Extract key person name from a title
function extractName(title) {
  if (!title) return '';
  // Remove common prefixes
  let name = title
    .replace(/^SPE\s+/i, '')
    .replace(/^SBE\s+/i, '')
    .replace(/^Watch\s+/i, '')
    .replace(/\bPodcast\s*Interview\b/i, '')
    .replace(/\bPodCast\s*Interview\b/i, '')
    .replace(/\bInterview\s+with\b/i, '')
    .replace(/\bInterview\s+-\s+/i, '')
    .replace(/\bInterview\b/i, '')
    .replace(/\bin conversation with\b/i, '')
    .replace(/\btalks to\b/i, '')
    .replace(/\btalks\b/i, '')
    .replace(/\bspeaks to\b/i, '')
    .replace(/\bDr\.?\s+/gi, '')
    .replace(/\bProf\.?\s+/gi, '')
    .replace(/\bSir\s+/gi, '')
    .replace(/\bLord\s+/gi, '')
    .replace(/\bDame\s+/gi, '')
    .replace(/\bCBE\b/gi, '')
    .replace(/\s*-\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*\d{2,4}\s*$/i, '')
    .replace(/\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*\d{2,4}\s*$/i, '')
    .replace(/\s+(20\d{2})\s*$/, '')
    .replace(/\.mp4$/i, '')
    .replace(/[^a-zA-Z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Extract words that look like names (capitalized)
  const words = name.split(/\s+/).filter(w => w.length > 1);
  return words.join(' ').toLowerCase();
}

// ─── Build media lookup from CSVs ────────────────────────
// Vimeo lookup by ID
const vimeoById = {};
for (const v of vimeoEntries) {
  const id = v['Vimeo ID'] || '';
  if (id) vimeoById[id] = v;
}

// YouTube lookup by ID
const youtubeById = {};
for (const y of youtubeEntries) {
  const id = y['YouTube ID'] || '';
  if (id) youtubeById[id] = y;
}

// ─── Extract media IDs from HTML body ────────────────────
function extractVimeoIds(html) {
  if (!html) return [];
  const ids = new Set();
  // Match player.vimeo.com/video/ID
  const matches = html.matchAll(/player\.vimeo\.com\/video\/(\d+)/g);
  for (const m of matches) ids.add(m[1]);
  // Match vimeo.com/ID
  const matches2 = html.matchAll(/vimeo\.com\/(\d+)/g);
  for (const m of matches2) ids.add(m[1]);
  return [...ids];
}

function extractYoutubeIds(html) {
  if (!html) return [];
  const ids = new Set();
  const matches = html.matchAll(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/g);
  for (const m of matches) ids.add(m[1]);
  const matches2 = html.matchAll(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g);
  for (const m of matches2) ids.add(m[1]);
  const matches3 = html.matchAll(/youtu\.be\/([a-zA-Z0-9_-]+)/g);
  for (const m of matches3) ids.add(m[1]);
  return [...ids];
}

function extractSoundcloudUrls(html) {
  if (!html) return [];
  const urls = new Set();
  const matches = html.matchAll(/soundcloud\.com\/[^\s"'<&]+/g);
  for (const m of matches) {
    let url = m[0].replace(/&amp;/g, '&');
    // Clean up URL - get the track URL
    if (url.includes('/player/')) continue; // skip player widget URLs
    if (!url.startsWith('http')) url = 'https://' + url;
    urls.add(url);
  }
  return [...urls];
}

// ─── Scoring function for title matching ─────────────────
function matchScore(csvTitle, jsonTitle, jsonSpeakers) {
  const normCsv = normalize(csvTitle);
  const normJson = normalize(jsonTitle);

  if (!normCsv || !normJson) return 0;

  // Exact match after normalization
  if (normCsv === normJson) return 100;

  // One contains the other
  if (normCsv.includes(normJson) || normJson.includes(normCsv)) return 80;

  // Extract names and compare
  const csvName = extractName(csvTitle);
  const jsonName = extractName(jsonTitle);

  // Check speakers array too
  const speakersNorm = (jsonSpeakers || []).map(s => s.toLowerCase().replace(/[^a-z\s]/g, '').trim());

  // Name-based matching
  if (csvName && jsonName) {
    // Split into words
    const csvWords = csvName.split(/\s+/).filter(w => w.length > 2);
    const jsonWords = jsonName.split(/\s+/).filter(w => w.length > 2);

    // Count matching words
    const matchingWords = csvWords.filter(w => jsonWords.includes(w) || speakersNorm.some(s => s.includes(w)));

    if (csvWords.length > 0 && matchingWords.length >= Math.min(2, csvWords.length)) {
      const ratio = matchingWords.length / Math.max(csvWords.length, jsonWords.length);
      return Math.round(60 + ratio * 30);
    }

    // Check if surname matches (last significant word)
    const csvSurname = csvWords[csvWords.length - 1];
    const jsonSurname = jsonWords[jsonWords.length - 1];
    if (csvSurname && jsonSurname && csvSurname === jsonSurname && csvSurname.length > 3) {
      return 65;
    }

    // Check against speakers
    for (const sp of speakersNorm) {
      const spWords = sp.split(/\s+/);
      const spMatches = csvWords.filter(w => spWords.includes(w));
      if (spMatches.length >= Math.min(2, Math.max(csvWords.length, spWords.length))) {
        return 70;
      }
    }
  }

  // Word overlap on full normalized titles
  const csvWords = normCsv.split(/\s+/).filter(w => w.length > 2);
  const jsonWords = normJson.split(/\s+/).filter(w => w.length > 2);
  if (csvWords.length > 0 && jsonWords.length > 0) {
    const overlap = csvWords.filter(w => jsonWords.includes(w));
    const ratio = overlap.length / Math.max(csvWords.length, jsonWords.length);
    if (ratio > 0.5) return Math.round(40 + ratio * 30);
  }

  return 0;
}

// ─── Build flat list of all JSON entries with refs ───────
const allEntries = [];

for (const [fileKey, items] of Object.entries(dataFiles)) {
  for (let i = 0; i < items.length; i++) {
    allEntries.push({
      fileKey,
      index: i,
      slug: items[i].slug,
      title: items[i].title,
      body: items[i].body || '',
      speakers: items[i].speakers || [],
      mediaUrls: items[i].mediaUrls || [],
      date: items[i].date || '',
    });
  }
}

console.log(`\nTotal JSON entries: ${allEntries.length}`);
console.log(`  podcasts: ${dataFiles.podcasts.length}`);
console.log(`  evening-talks: ${dataFiles['evening-talks'].length}`);
console.log(`  conference-reports: ${dataFiles['conference-reports'].length}`);
console.log(`  dinner-reviews: ${dataFiles['dinner-reviews'].length}`);

// ─── Phase 1: Extract existing media from body HTML ──────
console.log('\n=== Phase 1: Extracting existing media from body HTML ===');

let bodyVimeoCount = 0, bodyYoutubeCount = 0, bodySoundcloudCount = 0;

for (const entry of allEntries) {
  const vimeoIds = extractVimeoIds(entry.body);
  const youtubeIds = extractYoutubeIds(entry.body);
  const soundcloudUrls = extractSoundcloudUrls(entry.body);

  entry._bodyVimeo = vimeoIds;
  entry._bodyYoutube = youtubeIds;
  entry._bodySoundcloud = soundcloudUrls;

  bodyVimeoCount += vimeoIds.length;
  bodyYoutubeCount += youtubeIds.length;
  bodySoundcloudCount += soundcloudUrls.length;
}

console.log(`Found in body HTML: ${bodyVimeoCount} Vimeo, ${bodyYoutubeCount} YouTube, ${bodySoundcloudCount} SoundCloud`);

// ─── Phase 2: Match CSV entries to JSON entries ──────────
console.log('\n=== Phase 2: Matching CSV entries to JSON entries ===');

// Track which CSV entries were matched
const matchedVimeo = new Set();
const matchedYoutube = new Set();
const matchedSoundcloud = new Set();

// For each JSON entry, find matching CSV entries
for (const entry of allEntries) {
  const newMedia = [];
  const existingIds = new Set(entry.mediaUrls.map(m => m.id));

  // 2a. Add media found in body HTML (if not already in mediaUrls)
  for (const vId of entry._bodyVimeo) {
    if (!existingIds.has(vId)) {
      newMedia.push({
        type: 'vimeo',
        id: vId,
        url: `https://player.vimeo.com/video/${vId}`
      });
      existingIds.add(vId);
      if (vimeoById[vId]) matchedVimeo.add(vId);
    } else {
      if (vimeoById[vId]) matchedVimeo.add(vId);
    }
  }

  for (const yId of entry._bodyYoutube) {
    if (!existingIds.has(yId)) {
      newMedia.push({
        type: 'youtube',
        id: yId,
        url: `https://www.youtube.com/watch?v=${yId}`
      });
      existingIds.add(yId);
      if (youtubeById[yId]) matchedYoutube.add(yId);
    } else {
      if (youtubeById[yId]) matchedYoutube.add(yId);
    }
  }

  // 2b. Title-match Vimeo entries
  for (const v of vimeoEntries) {
    const vId = v['Vimeo ID'];
    if (!vId || existingIds.has(vId) || matchedVimeo.has(vId)) continue;

    const score = matchScore(v.Title, entry.title, entry.speakers);
    if (score >= 65) {
      newMedia.push({
        type: 'vimeo',
        id: vId,
        url: `https://player.vimeo.com/video/${vId}`,
        _matchScore: score,
        _csvTitle: v.Title,
      });
      existingIds.add(vId);
      matchedVimeo.add(vId);
    }
  }

  // 2c. Title-match YouTube entries
  for (const y of youtubeEntries) {
    const yId = y['YouTube ID'];
    if (!yId || existingIds.has(yId) || matchedYoutube.has(yId)) continue;

    const score = matchScore(y.Title, entry.title, entry.speakers);
    if (score >= 65) {
      newMedia.push({
        type: 'youtube',
        id: yId,
        url: `https://www.youtube.com/watch?v=${yId}`,
        _matchScore: score,
        _csvTitle: y.Title,
      });
      existingIds.add(yId);
      matchedYoutube.add(yId);
    }
  }

  // 2d. Title-match SoundCloud entries
  for (const sc of soundcloudEntries) {
    const scUrl = sc.URL;
    if (!scUrl) continue;
    const scId = scUrl.replace('https://soundcloud.com/', '');
    if (existingIds.has(scId) || matchedSoundcloud.has(scUrl)) continue;

    const score = matchScore(sc.Title, entry.title, entry.speakers);
    if (score >= 65) {
      newMedia.push({
        type: 'soundcloud',
        id: scId,
        url: scUrl,
        _matchScore: score,
        _csvTitle: sc.Title,
      });
      existingIds.add(scId);
      matchedSoundcloud.add(scUrl);
    }
  }

  entry._newMedia = newMedia;
}

// ─── Phase 3: Second pass for unmatched - try lower threshold with body context ──
console.log('\n=== Phase 3: Second pass for remaining unmatched ===');

for (const entry of allEntries) {
  const existingIds = new Set([
    ...entry.mediaUrls.map(m => m.id),
    ...(entry._newMedia || []).map(m => m.id),
  ]);

  const moreMedia = [];

  // Try Vimeo with lower threshold
  for (const v of vimeoEntries) {
    const vId = v['Vimeo ID'];
    if (!vId || existingIds.has(vId) || matchedVimeo.has(vId)) continue;

    const score = matchScore(v.Title, entry.title, entry.speakers);
    if (score >= 50 && score < 65) {
      // Only add if we can corroborate with date or additional context
      const csvTitle = normalize(v.Title);
      const jsonTitle = normalize(entry.title);

      // Check if both have a matching surname
      const csvName = extractName(v.Title);
      const jsonName = extractName(entry.title);
      const csvSurname = csvName.split(/\s+/).pop();
      const jsonSurname = jsonName.split(/\s+/).pop();

      if (csvSurname && jsonSurname && csvSurname === jsonSurname && csvSurname.length > 3) {
        moreMedia.push({
          type: 'vimeo',
          id: vId,
          url: `https://player.vimeo.com/video/${vId}`,
          _matchScore: score,
          _csvTitle: v.Title,
          _secondPass: true,
        });
        existingIds.add(vId);
        matchedVimeo.add(vId);
      }
    }
  }

  // Try YouTube with lower threshold
  for (const y of youtubeEntries) {
    const yId = y['YouTube ID'];
    if (!yId || existingIds.has(yId) || matchedYoutube.has(yId)) continue;

    const score = matchScore(y.Title, entry.title, entry.speakers);
    if (score >= 50 && score < 65) {
      const csvSurname = extractName(y.Title).split(/\s+/).pop();
      const jsonSurname = extractName(entry.title).split(/\s+/).pop();

      if (csvSurname && jsonSurname && csvSurname === jsonSurname && csvSurname.length > 3) {
        moreMedia.push({
          type: 'youtube',
          id: yId,
          url: `https://www.youtube.com/watch?v=${yId}`,
          _matchScore: score,
          _csvTitle: y.Title,
          _secondPass: true,
        });
        existingIds.add(yId);
        matchedYoutube.add(yId);
      }
    }
  }

  // Try SoundCloud with lower threshold
  for (const sc of soundcloudEntries) {
    const scUrl = sc.URL;
    if (!scUrl) continue;
    const scId = scUrl.replace('https://soundcloud.com/', '');
    if (existingIds.has(scId) || matchedSoundcloud.has(scUrl)) continue;

    const score = matchScore(sc.Title, entry.title, entry.speakers);
    if (score >= 50 && score < 65) {
      const csvSurname = extractName(sc.Title).split(/\s+/).pop();
      const jsonSurname = extractName(entry.title).split(/\s+/).pop();

      if (csvSurname && jsonSurname && csvSurname === jsonSurname && csvSurname.length > 3) {
        moreMedia.push({
          type: 'soundcloud',
          id: scId,
          url: scUrl,
          _matchScore: score,
          _csvTitle: sc.Title,
          _secondPass: true,
        });
        existingIds.add(scId);
        matchedSoundcloud.add(scUrl);
      }
    }
  }

  entry._newMedia = [...(entry._newMedia || []), ...moreMedia];
}

// ─── Phase 4: Apply matches to JSON data ─────────────────
console.log('\n=== Phase 4: Applying matches to JSON data ===');

let totalAdded = 0;
const matchLog = [];

for (const entry of allEntries) {
  if (!entry._newMedia || entry._newMedia.length === 0) continue;

  const item = dataFiles[entry.fileKey][entry.index];
  if (!item.mediaUrls) item.mediaUrls = [];

  for (const media of entry._newMedia) {
    // Check not already present
    const alreadyExists = item.mediaUrls.some(m => m.id === media.id);
    if (alreadyExists) continue;

    // Clean internal fields
    const cleanMedia = {
      type: media.type,
      id: media.id,
      url: media.url,
    };

    item.mediaUrls.push(cleanMedia);
    totalAdded++;

    matchLog.push({
      file: entry.fileKey,
      slug: entry.slug,
      jsonTitle: entry.title,
      csvTitle: media._csvTitle || '(from body HTML)',
      mediaType: media.type,
      mediaId: media.id,
      score: media._matchScore || 'body-html',
      secondPass: media._secondPass || false,
    });
  }
}

console.log(`Total media entries added: ${totalAdded}`);

// ─── Phase 5: Cross-sync podcasts.json with category files ──
console.log('\n=== Phase 5: Cross-syncing podcasts.json with category files ===');

// podcasts.json contains entries from ALL categories.
// We need to sync media from category-specific files back to podcasts.json and vice versa.

const podcasts = dataFiles.podcasts;
const categoryFiles = {
  'evening-talks': dataFiles['evening-talks'],
  'conference-reports': dataFiles['conference-reports'],
  'dinner-reviews': dataFiles['dinner-reviews'],
};

let crossSyncCount = 0;

// For each podcast entry that has a non-podcasts slug, find the matching category entry
for (const podcast of podcasts) {
  const slug = podcast.slug;

  for (const [catKey, catItems] of Object.entries(categoryFiles)) {
    const prefix = catKey === 'evening-talks' ? 'evening-talks/' :
                   catKey === 'conference-reports' ? 'conferences/' :
                   catKey === 'dinner-reviews' ? 'dinners/' : '';

    if (!slug.startsWith(prefix)) continue;

    // Find matching entry in category file
    const slugSuffix = slug.replace(prefix, '');
    const catEntry = catItems.find(c => c.slug === slugSuffix || c.slug === slug);

    if (!catEntry) continue;

    // Merge mediaUrls both ways
    if (!podcast.mediaUrls) podcast.mediaUrls = [];
    if (!catEntry.mediaUrls) catEntry.mediaUrls = [];

    // podcast → category
    for (const m of podcast.mediaUrls) {
      if (!catEntry.mediaUrls.some(cm => cm.id === m.id)) {
        catEntry.mediaUrls.push({ type: m.type, id: m.id, url: m.url });
        crossSyncCount++;
      }
    }

    // category → podcast
    for (const m of catEntry.mediaUrls) {
      if (!podcast.mediaUrls.some(pm => pm.id === m.id)) {
        podcast.mediaUrls.push({ type: m.type, id: m.id, url: m.url });
        crossSyncCount++;
      }
    }
  }
}

console.log(`Cross-synced ${crossSyncCount} media entries between files`);

// ─── Phase 6: Normalize all URLs ─────────────────────────
console.log('\n=== Phase 6: Normalizing URLs ===');

let normalizedCount = 0;
for (const [fileKey, items] of Object.entries(dataFiles)) {
  for (const item of items) {
    if (!item.mediaUrls) continue;
    for (const m of item.mediaUrls) {
      // Ensure vimeo URLs use https://player.vimeo.com/video/
      if (m.type === 'vimeo') {
        const expected = `https://player.vimeo.com/video/${m.id}`;
        if (m.url !== expected) {
          m.url = expected;
          normalizedCount++;
        }
      }
      // Ensure YouTube URLs use https://
      if (m.type === 'youtube' && !m.url.startsWith('https://')) {
        m.url = `https://www.youtube.com/watch?v=${m.id}`;
        normalizedCount++;
      }
      // Ensure SoundCloud URLs use https://
      if (m.type === 'soundcloud' && !m.url.startsWith('https://')) {
        m.url = 'https://' + m.url.replace(/^\/\//, '');
        normalizedCount++;
      }
    }
  }
}

console.log(`Normalized ${normalizedCount} URLs`);

// ─── Phase 7: Write updated JSON files ───────────────────
console.log('\n=== Phase 7: Writing updated JSON files ===');

for (const [fileKey, items] of Object.entries(dataFiles)) {
  const filePath = path.join(DATA_DIR, `${fileKey}.json`);
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2) + '\n');
  const withMedia = items.filter(i => i.mediaUrls && i.mediaUrls.length > 0).length;
  console.log(`  ${fileKey}.json: ${items.length} entries, ${withMedia} with media`);
}

// ─── Phase 8: Report unmatched CSV entries ───────────────
console.log('\n=== Phase 8: Unmatched CSV entries ===');

const unmatchedVimeo = vimeoEntries.filter(v => !matchedVimeo.has(v['Vimeo ID']));
const unmatchedYoutube = youtubeEntries.filter(y => !matchedYoutube.has(y['YouTube ID']));
const unmatchedSoundcloud = soundcloudEntries.filter(sc => !matchedSoundcloud.has(sc.URL));

console.log(`\nUnmatched Vimeo: ${unmatchedVimeo.length}/${vimeoEntries.length}`);
for (const v of unmatchedVimeo) {
  console.log(`  [${v['Vimeo ID']}] ${v.Title}`);
}

console.log(`\nUnmatched YouTube: ${unmatchedYoutube.length}/${youtubeEntries.length}`);
for (const y of unmatchedYoutube) {
  console.log(`  [${y['YouTube ID']}] ${y.Title}`);
}

console.log(`\nUnmatched SoundCloud: ${unmatchedSoundcloud.length}/${soundcloudEntries.length}`);
for (const sc of unmatchedSoundcloud) {
  console.log(`  [${sc.URL}] ${sc.Title}`);
}

// ─── Write match log for review ──────────────────────────
const logPath = path.join(__dirname, 'embed-media-log.json');
fs.writeFileSync(logPath, JSON.stringify({
  totalAdded,
  crossSyncCount,
  normalizedCount,
  unmatchedVimeo: unmatchedVimeo.map(v => ({ id: v['Vimeo ID'], title: v.Title })),
  unmatchedYoutube: unmatchedYoutube.map(y => ({ id: y['YouTube ID'], title: y.Title })),
  unmatchedSoundcloud: unmatchedSoundcloud.map(sc => ({ url: sc.URL, title: sc.Title })),
  matches: matchLog,
}, null, 2));

console.log(`\nMatch log written to: ${logPath}`);
console.log('\nDone!');
