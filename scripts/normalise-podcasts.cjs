/**
 * Podcast Metadata Normalisation Script
 *
 * Reads podcasts.json, applies all normalisations, writes it back.
 *
 * Changes:
 *  1. Fix duplicate category "podcasts" → "podcast"
 *  2. Extract speakers from titles (7 patterns)
 *  3. Extract speakers from body text (3 fallback patterns)
 *  4. Clean junk entries in existing speakers arrays
 *  5. Fix typos in speaker data
 *  6. Normalise dinner speech titles
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, '..', 'src', 'data', 'podcasts.json');
const data = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));

// ── Stats tracking ──────────────────────────────────────────────────────────

const stats = {
  categoryFixes: 0,
  titleExtractions: 0,
  bodyExtractions: 0,
  junkCleaned: 0,
  typosFixed: 0,
  dinnerTitlesNormalised: 0,
  alreadyHadSpeakers: 0,
  stillMissing: 0,
};

// ── 1. Fix duplicate category ───────────────────────────────────────────────

for (const item of data) {
  if (item.category === 'podcasts') {
    item.category = 'podcast';
    stats.categoryFixes++;
  }
}

// ── 2. Known interviewer/host names (not guests) ────────────────────────────

const KNOWN_HOSTS = new Set([
  'Andrew Milligan',
  'George Buckley',
  'Ulrike Hotopp',
  'Filippo Gaddo',
]);

// ── 3. Title-based speaker extraction ───────────────────────────────────────

function extractFromTitle(title) {
  let m;

  // Pattern 1: "Interview with Name"
  m = title.match(/^(?:Speaker Series:\s+)?Interview with\s+(.+)$/i);
  if (m) return [{ name: cleanName(m[1]), role: 'Guest' }];

  // Pattern 2: "Watch Name interview with Name"
  m = title.match(/^Watch\s+(.+?)\s+interview with\s+(.+)$/i);
  if (m) return [
    { name: cleanName(m[1]), role: 'Guest' },
    { name: cleanName(m[2]), role: 'Interviewer' },
  ];

  // Pattern 3: "Watch Name in conversation with Name"
  m = title.match(/^Watch\s+(.+?)\s+in conversation with\s+(.+)$/i);
  if (m) return [
    { name: cleanName(m[1]), role: 'Guest' },
    { name: cleanName(m[2]), role: 'Interviewer' },
  ];

  // Pattern 4: "Watch Name talk to Name"
  m = title.match(/^Watch\s+(.+?)\s+talk(?:s)? to\s+(.+)$/i);
  if (m) return [
    { name: cleanName(m[1]), role: 'Guest' },
    { name: cleanName(m[2]), role: 'Interviewer' },
  ];

  // Pattern 5: "Podcast: Name on topic" or "Podcast: Name CBE on topic"
  m = title.match(/^Podcast:\s+(.+?)\s+on\s+/i);
  if (m) return [{ name: cleanName(m[1]), role: 'Guest' }];

  // Pattern 6: "In conversation with Name"
  m = title.match(/^In conversation with\s+(.+)$/i);
  if (m) return [{ name: cleanName(m[1]), role: 'Guest' }];

  // Pattern 7: "Replay: Name Chairs Debate on Topic"
  m = title.match(/^Replay:\s+(.+?)\s+Chairs?\s+/i);
  if (m) return [{ name: cleanName(m[1]), role: 'Chair' }];

  return null;
}

// ── 4. Body-text speaker extraction (fallback) ──────────────────────────────

function extractFromBody(body) {
  if (!body) return null;
  const plain = body.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/\s+/g, ' ');

  // Pattern A: "spoke with Name, Title" (Filippo Gaddo's standard intro)
  let m = plain.match(/spoke with\s+([^,]+)/i);
  if (m) {
    const name = cleanName(m[1].trim());
    if (name.length >= 3) return [{ name, role: 'Guest' }];
  }

  // Pattern B: Structured <h4> speaker/chair info
  const h4Match = body.match(/<h4[^>]*>([\s\S]*?)<\/h4\s*>/i);
  if (h4Match) {
    const entries = h4Match[1].split(/<br\s*\/?>/i);
    const people = [];
    for (const entry of entries) {
      const text = entry.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
      if (!text || text.length < 3) continue;
      if (/^related\s+(pages|links)$/i.test(text)) continue;

      const roleMatch = text.match(/^(Speaker|Chair|Author):\s*(.+)/i);
      if (roleMatch) {
        const role = roleMatch[1].charAt(0).toUpperCase() + roleMatch[1].slice(1).toLowerCase();
        const name = extractNamePart(roleMatch[2]);
        if (name.length >= 3) people.push({ name, role });
      } else {
        const name = extractNamePart(text);
        if (name.length >= 3 && !/^(Related|Login|This content|SPE|SBE)/.test(name)) {
          people.push({ name, role: 'Speaker' });
        }
      }
    }
    if (people.length > 0) return people;
  }

  // Pattern C: <strong>Name</strong> bio paragraph (check for standalone bold name at start of para)
  const bioMatch = body.match(/<p><strong>([A-Z][^<]+?)<\/strong>\s/);
  if (bioMatch) {
    const name = cleanName(bioMatch[1].trim());
    // Verify it looks like a person name (not a heading)
    const words = name.split(/\s+/);
    if (words.length >= 2 && words.length <= 6 && name.length < 50) {
      return [{ name, role: 'Guest' }];
    }
  }

  return null;
}

// ── 5. Name cleanup helpers ─────────────────────────────────────────────────

function cleanName(raw) {
  return raw
    .replace(/^(Dr|Professor|Prof|Sir|Dame|Lord|Lady|Rt Hon|The Rt Hon)\s+/i, '')
    .replace(/\s+(CBE|OBE|MBE|FRS|FRSE|FBA)$/gi, '')
    .trim();
}

function extractNamePart(raw) {
  const s = raw.replace(/^(Speaker|Chair|Author):\s*/i, '').trim();
  return s.split(',')[0].trim();
}

// ── 6. Known typo fixes ─────────────────────────────────────────────────────

const TYPO_FIXES = {
  'Daine Coyle': 'Diane Coyle',
  'Govenor': 'Governor',
};

function fixTypos(speakers) {
  if (!speakers) return speakers;
  let fixed = false;
  const result = speakers.map(s => {
    let out = s;
    for (const [typo, correction] of Object.entries(TYPO_FIXES)) {
      if (out.includes(typo)) {
        out = out.replace(typo, correction);
        fixed = true;
      }
    }
    return out;
  });
  if (fixed) stats.typosFixed++;
  return result;
}

// ── 7. Build the structured speaker entry ───────────────────────────────────

function formatSpeakerEntry(name, role) {
  // Match the existing format: "Speaker: Name" or "Chair: Name"
  if (role === 'Guest' || role === 'Speaker') return 'Speaker: ' + name;
  if (role === 'Chair') return 'Chair: ' + name;
  if (role === 'Interviewer') return 'Interviewer: ' + name;
  return 'Speaker: ' + name;
}

// ── 8. Apply all normalisations ─────────────────────────────────────────────

for (const item of data) {
  // Clean junk entries in existing speakers
  if (item.speakers && Array.isArray(item.speakers)) {
    const before = item.speakers.length;
    item.speakers = item.speakers.filter(s => {
      if (typeof s !== 'string') return false;
      if (/^Related\s+(pages|links)$/i.test(s.trim())) return false;
      return true;
    });
    if (item.speakers.length < before) stats.junkCleaned++;

    // Fix typos in existing entries
    item.speakers = fixTypos(item.speakers);
    stats.alreadyHadSpeakers++;
    continue; // Already has speakers, don't overwrite
  }

  // Try title extraction
  const fromTitle = extractFromTitle(item.title);
  if (fromTitle && fromTitle.length > 0) {
    // Filter out known hosts when they appear as the sole entry
    const guests = fromTitle.filter(p => !KNOWN_HOSTS.has(p.name));
    const allPeople = fromTitle;

    // Use all people (including interviewers) for full speaker list
    item.speakers = allPeople.map(p => formatSpeakerEntry(p.name, p.role));
    stats.titleExtractions++;
    continue;
  }

  // Try body extraction
  const fromBody = extractFromBody(item.body);
  if (fromBody && fromBody.length > 0) {
    item.speakers = fromBody.map(p => formatSpeakerEntry(p.name, p.role));
    stats.bodyExtractions++;
    continue;
  }

  stats.stillMissing++;
}

// ── 9. Normalise dinner speech titles ───────────────────────────────────────

for (const item of data) {
  if (item.category !== 'dinner-review') continue;
  // Extract year from title
  const yrMatch = item.title.match(/(\d{4})/);
  if (yrMatch) {
    const year = yrMatch[1];
    const canonical = 'SPE Annual Dinner ' + year;
    if (item.title !== canonical) {
      console.log('  Dinner title: "' + item.title + '" → "' + canonical + '"');
      item.title = canonical;
      stats.dinnerTitlesNormalised++;
    }
  }
}

// ── 10. Write output ────────────────────────────────────────────────────────

fs.writeFileSync(INPUT, JSON.stringify(data, null, 2) + '\n', 'utf-8');

// ── 11. Report ──────────────────────────────────────────────────────────────

console.log('\n=== PODCAST NORMALISATION REPORT ===');
console.log('Category fixes (podcasts→podcast):  ' + stats.categoryFixes);
console.log('Title-based extractions:             ' + stats.titleExtractions);
console.log('Body-based extractions:              ' + stats.bodyExtractions);
console.log('Junk entries cleaned:                ' + stats.junkCleaned);
console.log('Typos fixed:                         ' + stats.typosFixed);
console.log('Dinner titles normalised:            ' + stats.dinnerTitlesNormalised);
console.log('Already had speakers:                ' + stats.alreadyHadSpeakers);
console.log('Still missing speakers:              ' + stats.stillMissing);
console.log('Total items:                         ' + data.length);

// Show remaining items without speakers
const remaining = data.filter(p => !p.speakers || p.speakers.length === 0);
if (remaining.length > 0) {
  console.log('\nItems still without speakers (' + remaining.length + '):');
  remaining.forEach(p => console.log('  - [' + p.category + '] ' + p.title));
}
