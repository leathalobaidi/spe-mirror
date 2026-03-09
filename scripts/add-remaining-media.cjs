/**
 * add-remaining-media.cjs
 * Adds remaining unmatched media entries to the correct JSON data files.
 * Also cross-syncs between podcasts.json and category-specific files.
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');

function loadJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
}
function saveJSON(file, data) {
  fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2) + '\n');
}

// Load all files
let podcasts = loadJSON('podcasts.json');
let eveningTalks = loadJSON('evening-talks.json');
let events = loadJSON('events.json');
let conferences = loadJSON('conference-reports.json');

const log = { added: [], skipped: [], errors: [] };

function addMedia(arr, fileName, slug, media, label) {
  const entry = arr.find(e => e.slug === slug);
  if (!entry) {
    log.errors.push({ label, slug, file: fileName, error: 'Entry not found' });
    return false;
  }

  // Ensure mediaUrls array exists
  if (!entry.mediaUrls) entry.mediaUrls = [];

  // Check for duplicates
  const dupes = media.filter(m =>
    entry.mediaUrls.some(existing =>
      (m.id && existing.id === m.id) || (m.url && existing.url === m.url)
    )
  );
  const newMedia = media.filter(m =>
    !entry.mediaUrls.some(existing =>
      (m.id && existing.id === m.id) || (m.url && existing.url === m.url)
    )
  );

  if (dupes.length) {
    dupes.forEach(d => log.skipped.push({ label, slug, file: fileName, reason: `Already has ${d.type}:${d.id}` }));
  }

  if (newMedia.length === 0) return false;

  entry.mediaUrls.push(...newMedia);
  newMedia.forEach(m => log.added.push({ label, slug, file: fileName, type: m.type, id: m.id }));
  return true;
}

// ======================================
// 1. IDENTIFIED TARGETS (6 entries)
// ======================================

// 1a. Nearshoring (Vimeo 982625415 + YouTube q-3HNdUVvcs)
addMedia(events, 'events.json', 'past-events/12276-1', [
  { type: 'vimeo', id: '982625415', url: 'https://player.vimeo.com/video/982625415' },
  { type: 'youtube', id: 'q-3HNdUVvcs', url: 'https://www.youtube.com/watch?v=q-3HNdUVvcs' },
], 'Nearshoring Webinar');

// 1b. Steven Millard (YouTube DSLleDYH21o) - already has Vimeo
addMedia(podcasts, 'podcasts.json', 'podcasts/12353', [
  { type: 'youtube', id: 'DSLleDYH21o', url: 'https://www.youtube.com/watch?v=DSLleDYH21o' },
], 'Steven Millard YouTube');

// 1c. Levelling Up (Vimeo 435055692)
addMedia(eveningTalks, 'evening-talks.json', 'spe-webinar-levelling-up-is-hard-to-do', [
  { type: 'vimeo', id: '435055692', url: 'https://player.vimeo.com/video/435055692' },
], 'Levelling Up Webinar');
// Cross-sync: find in podcasts.json too
const luPod = podcasts.find(e => e.slug && e.slug.includes('levelling'));
if (luPod) {
  addMedia(podcasts, 'podcasts.json', luPod.slug, [
    { type: 'vimeo', id: '435055692', url: 'https://player.vimeo.com/video/435055692' },
  ], 'Levelling Up Webinar (cross-sync)');
}

// 1d. Conference 2024 (YouTube rV_-EYOsja8 Part 1, X30jhZTjoao Part 2)
addMedia(conferences, 'conference-reports.json', '2024-annual-conference-report', [
  { type: 'youtube', id: 'rV_-EYOsja8', url: 'https://www.youtube.com/watch?v=rV_-EYOsja8' },
  { type: 'youtube', id: 'X30jhZTjoao', url: 'https://www.youtube.com/watch?v=X30jhZTjoao' },
], 'Conference 2024 YouTube');
addMedia(podcasts, 'podcasts.json', 'conferences/2024-annual-conference-report', [
  { type: 'youtube', id: 'rV_-EYOsja8', url: 'https://www.youtube.com/watch?v=rV_-EYOsja8' },
  { type: 'youtube', id: 'X30jhZTjoao', url: 'https://www.youtube.com/watch?v=X30jhZTjoao' },
], 'Conference 2024 YouTube (cross-sync)');

// Also clean up incorrect media from conference 2024 (wrong vimeo + wrong soundcloud)
function removeWrongMedia(arr, slug, idsToRemove) {
  const entry = arr.find(e => e.slug === slug);
  if (!entry || !entry.mediaUrls) return;
  const before = entry.mediaUrls.length;
  entry.mediaUrls = entry.mediaUrls.filter(m => !idsToRemove.includes(m.id));
  if (entry.mediaUrls.length < before) {
    console.log(`  Removed ${before - entry.mediaUrls.length} incorrect media from ${slug}`);
  }
}
// Vimeo 389688048 is from 2020 (Andrew Milligan Coronavirus) - wrong conference
// SoundCloud andrew-milligan is from 2020 - wrong conference
removeWrongMedia(conferences, '2024-annual-conference-report', ['389688048', 'sbe-audio-feed/andrew-milligan-on-the-coronavirus-economy']);
removeWrongMedia(podcasts, 'conferences/2024-annual-conference-report', ['389688048', 'sbe-audio-feed/andrew-milligan-on-the-coronavirus-economy']);

// 1e. SPE-Event-280220 (Vimeo 396400939)
addMedia(events, 'events.json', 'past-events/7359-1', [
  { type: 'vimeo', id: '396400939', url: 'https://player.vimeo.com/video/396400939' },
], 'Strategic Reviews of Monetary Policy');
// Check if there's a podcasts.json entry too
const monetaryPod = podcasts.find(e => e.slug && e.slug.includes('7359'));
if (monetaryPod) {
  addMedia(podcasts, 'podcasts.json', monetaryPod.slug, [
    { type: 'vimeo', id: '396400939', url: 'https://player.vimeo.com/video/396400939' },
  ], 'Strategic Reviews (cross-sync)');
}

// 1f. SPE-Event-251119 (Vimeo 379421248)
addMedia(events, 'events.json', 'past-events/5508-1', [
  { type: 'vimeo', id: '379421248', url: 'https://player.vimeo.com/video/379421248' },
], 'Economic case for gender equality');
const genderPod = podcasts.find(e => e.slug && e.slug.includes('5508'));
if (genderPod) {
  addMedia(podcasts, 'podcasts.json', genderPod.slug, [
    { type: 'vimeo', id: '379421248', url: 'https://player.vimeo.com/video/379421248' },
  ], 'Gender equality (cross-sync)');
}

// ======================================
// 2. SOUNDCLOUD ENTRIES NEEDING ADDITION
// ======================================

// 2a. Strain Podcast - add SC alongside existing Vimeo+YouTube
addMedia(podcasts, 'podcasts.json', 'podcasts/12291', [
  { type: 'soundcloud', id: 'sbe-audio-feed/strain-podcast', url: 'https://soundcloud.com/sbe-audio-feed/strain-podcast' },
], 'Strain Podcast SoundCloud');

// 2b. SBE Meeting 13 January 2015 (Outlook UK Economy)
addMedia(podcasts, 'podcasts.json', 'evening-talks/3075', [
  { type: 'soundcloud', id: 'sbe-audio-feed/sbe-meeting-13-january-2015', url: 'https://soundcloud.com/sbe-audio-feed/sbe-meeting-13-january-2015' },
], 'Outlook UK Economy Jan 2015');
const et3075 = eveningTalks.find(e => e.slug === 'outlook-for-the-uk-economy-3');
if (et3075) {
  addMedia(eveningTalks, 'evening-talks.json', et3075.slug, [
    { type: 'soundcloud', id: 'sbe-audio-feed/sbe-meeting-13-january-2015', url: 'https://soundcloud.com/sbe-audio-feed/sbe-meeting-13-january-2015' },
  ], 'Outlook UK Economy Jan 2015 (cross-sync)');
} else {
  // Try finding by date
  const match = eveningTalks.find(e => e.date === '2015-01-13');
  if (match) {
    addMedia(eveningTalks, 'evening-talks.json', match.slug, [
      { type: 'soundcloud', id: 'sbe-audio-feed/sbe-meeting-13-january-2015', url: 'https://soundcloud.com/sbe-audio-feed/sbe-meeting-13-january-2015' },
    ], 'Outlook UK Economy Jan 2015 (cross-sync by date)');
  }
}

// 2c. SBE Meeting 10 February 2015 (The Fiscal Outlook)
addMedia(podcasts, 'podcasts.json', 'evening-talks/3734', [
  { type: 'soundcloud', id: 'sbe-audio-feed/sbe-meeting-10-february-2015', url: 'https://soundcloud.com/sbe-audio-feed/sbe-meeting-10-february-2015' },
], 'Fiscal Outlook Feb 2015');
const et3734 = eveningTalks.find(e => e.date === '2015-02-10');
if (et3734) {
  addMedia(eveningTalks, 'evening-talks.json', et3734.slug, [
    { type: 'soundcloud', id: 'sbe-audio-feed/sbe-meeting-10-february-2015', url: 'https://soundcloud.com/sbe-audio-feed/sbe-meeting-10-february-2015' },
  ], 'Fiscal Outlook Feb 2015 (cross-sync)');
}

// 2d. Lord Paul Myners - SBE - 3 March 2015
addMedia(podcasts, 'podcasts.json', 'evening-talks/3742', [
  { type: 'soundcloud', id: 'sbe-audio-feed/lord-paul-myners-sbe-3-march-2015', url: 'https://soundcloud.com/sbe-audio-feed/lord-paul-myners-sbe-3-march-2015' },
], 'Lord Myners Mar 2015');
const mynerET = eveningTalks.find(e => e.date === '2015-03-03');
if (mynerET) {
  addMedia(eveningTalks, 'evening-talks.json', mynerET.slug, [
    { type: 'soundcloud', id: 'sbe-audio-feed/lord-paul-myners-sbe-3-march-2015', url: 'https://soundcloud.com/sbe-audio-feed/lord-paul-myners-sbe-3-march-2015' },
  ], 'Lord Myners Mar 2015 (cross-sync)');
}

// 2e. SBE Meeting 14 April 2016 (UK National Statistics) - already has SC API track
// The public URL is different from the API one. Let's add the public URL too
const apr2016 = podcasts.find(e => e.slug === 'evening-talks/4329');
if (apr2016 && apr2016.mediaUrls) {
  const hasPublicSC = apr2016.mediaUrls.some(m => m.url && m.url.includes('sbe-meeting-14-april-2016'));
  if (!hasPublicSC) {
    // Already has API track - skip adding duplicate
    log.skipped.push({ label: 'Apr 2016', slug: 'evening-talks/4329', file: 'podcasts.json', reason: 'Already has SC via API track ID 264582817' });
  }
}

// 2f. SBE Meeting 8 November 2016 (Does Home-Ownership Matter?) - already has SC API track
log.skipped.push({ label: 'Nov 2016', slug: 'evening-talks/4566', file: 'podcasts.json', reason: 'Already has SC via API track ID 294261439' });

// 2g. SBE Meeting 3 July 2017 (Britain\'s long-term growth) - already has 2 SC API tracks
log.skipped.push({ label: 'Jul 2017', slug: 'evening-talks/4725', file: 'podcasts.json', reason: 'Already has 2 SC via API tracks 333023838 + 334145724' });

// 2h. Brexit Seminar (Jan 2019 on SC, matches Nov 2018 event "Trade after Brexit")
addMedia(podcasts, 'podcasts.json', 'evening-talks/5290', [
  { type: 'soundcloud', id: 'sbe-audio-feed/brexit-seminar', url: 'https://soundcloud.com/sbe-audio-feed/brexit-seminar' },
], 'Brexit Seminar (Trade after Brexit)');
const brexitET = eveningTalks.find(e => e.slug === 'trade-after-brexit');
if (brexitET) {
  addMedia(eveningTalks, 'evening-talks.json', brexitET.slug, [
    { type: 'soundcloud', id: 'sbe-audio-feed/brexit-seminar', url: 'https://soundcloud.com/sbe-audio-feed/brexit-seminar' },
  ], 'Brexit Seminar (cross-sync)');
}

// 2i. Interview SBE Meeting 9 May 2017 - NO matching page found on the site
log.skipped.push({ label: 'May 2017 Interview', reason: 'No matching page found in any data file' });

// ======================================
// 3. ENTRIES WITH NO SITE MATCH (unresolvable)
// ======================================
log.skipped.push({ label: 'SPE AGM 2023', id: '889942491', reason: 'No dedicated AGM page on site' });
log.skipped.push({ label: 'Eval Soc Jan 22', id: '671965439', reason: 'External evaluation society content' });
log.skipped.push({ label: 'YouTube Live Stream', id: 'tgadW16wq-g', reason: 'Nov 2025 livestream, no matching page' });
log.skipped.push({ label: 'Rachel Griffiths SC', reason: 'Already has SC via API track 713156086' });
log.skipped.push({ label: 'SBE Meeting 3 July 2017 Presentation SC', reason: 'Already has SC via API track 334145724 (presentation part)' });

// ======================================
// 4. CROSS-SYNC: evening-talks entries in podcasts.json <-> evening-talks.json
// ======================================
let crossSyncCount = 0;

// Sync from podcasts.json evening-talks/* entries to evening-talks.json
for (const pod of podcasts) {
  if (!pod.slug || !pod.slug.startsWith('evening-talks/')) continue;
  if (!pod.mediaUrls || pod.mediaUrls.length === 0) continue;

  // Find matching entry in evening-talks.json by various methods
  const numericId = pod.slug.replace('evening-talks/', '');
  let etEntry = eveningTalks.find(e => {
    // Try matching by title + date
    return e.title === pod.title && e.date === pod.date;
  });

  if (!etEntry) continue;
  if (!etEntry.mediaUrls) etEntry.mediaUrls = [];

  for (const m of pod.mediaUrls) {
    const exists = etEntry.mediaUrls.some(em =>
      (m.id && em.id === m.id) || (m.url && em.url === m.url)
    );
    if (!exists) {
      etEntry.mediaUrls.push(m);
      crossSyncCount++;
    }
  }
}

// Sync from evening-talks.json to podcasts.json
for (const et of eveningTalks) {
  if (!et.mediaUrls || et.mediaUrls.length === 0) continue;

  const podEntry = podcasts.find(p => p.title === et.title && p.date === et.date);
  if (!podEntry) continue;
  if (!podEntry.mediaUrls) podEntry.mediaUrls = [];

  for (const m of et.mediaUrls) {
    const exists = podEntry.mediaUrls.some(pm =>
      (m.id && pm.id === m.id) || (m.url && pm.url === m.url)
    );
    if (!exists) {
      podEntry.mediaUrls.push(m);
      crossSyncCount++;
    }
  }
}

// Save all files
saveJSON('podcasts.json', podcasts);
saveJSON('evening-talks.json', eveningTalks);
saveJSON('events.json', events);
saveJSON('conference-reports.json', conferences);

// Save log
fs.writeFileSync(
  path.join(__dirname, 'add-remaining-media-log.json'),
  JSON.stringify(log, null, 2) + '\n'
);

// Summary
console.log('\n=== ADD REMAINING MEDIA - SUMMARY ===');
console.log(`Added: ${log.added.length} new media entries`);
console.log(`Skipped: ${log.skipped.length} entries`);
console.log(`Errors: ${log.errors.length}`);
console.log(`Cross-synced: ${crossSyncCount} entries`);

console.log('\n--- Added ---');
for (const a of log.added) {
  console.log(`  ✓ [${a.file}] ${a.slug} ← ${a.type}:${a.id}`);
}

console.log('\n--- Skipped ---');
for (const s of log.skipped) {
  console.log(`  ○ ${s.label}: ${s.reason}`);
}

if (log.errors.length) {
  console.log('\n--- Errors ---');
  for (const e of log.errors) {
    console.log(`  ✗ ${e.label} [${e.file}] ${e.slug}: ${e.error}`);
  }
}
