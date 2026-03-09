const fs = require('fs');
const path = require('path');

// Load all data files
const dataDir = path.join(__dirname, '..', 'src', 'data');
const files = {
  podcasts: require(path.join(dataDir, 'podcasts.json')),
  'evening-talks': require(path.join(dataDir, 'evening-talks.json')),
  events: require(path.join(dataDir, 'events.json')),
  'conference-reports': require(path.join(dataDir, 'conference-reports.json')),
  'dinner-reviews': require(path.join(dataDir, 'dinner-reviews.json')),
  articles: require(path.join(dataDir, 'articles.json')),
  pages: require(path.join(dataDir, 'pages.json')),
  'ryb-essays': require(path.join(dataDir, 'ryb-essays.json')),
};

// Build a master index of all media across all files
const allMedia = new Map(); // key: type:id -> value: [{file, slug, title}]
const allBodyMedia = new Map(); // key: id -> [{file, slug}]

for (const [fname, data] of Object.entries(files)) {
  for (const entry of data) {
    // Check mediaUrls array
    for (const m of (entry.mediaUrls || [])) {
      const key = m.type + ':' + m.id;
      if (!allMedia.has(key)) allMedia.set(key, []);
      allMedia.get(key).push({ file: fname, slug: entry.slug, title: (entry.title || '').slice(0, 60) });
    }
    // Check body for embedded iframes
    if (entry.body) {
      const body = entry.body;
      // Vimeo
      const vimeoRe = /player\.vimeo\.com\/video\/(\d+)/g;
      let m;
      while ((m = vimeoRe.exec(body)) !== null) {
        const key = 'vimeo_body:' + m[1];
        if (!allBodyMedia.has(key)) allBodyMedia.set(key, []);
        allBodyMedia.get(key).push({ file: fname, slug: entry.slug });
      }
      // YouTube
      const ytRe = /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/g;
      while ((m = ytRe.exec(body)) !== null) {
        const key = 'youtube_body:' + m[1];
        if (!allBodyMedia.has(key)) allBodyMedia.set(key, []);
        allBodyMedia.get(key).push({ file: fname, slug: entry.slug });
      }
      // SoundCloud
      const scRe = /soundcloud\.com[^\s"']*/g;
      while ((m = scRe.exec(body)) !== null) {
        const key = 'sc_body:' + m[0].slice(0, 80);
        if (!allBodyMedia.has(key)) allBodyMedia.set(key, []);
        allBodyMedia.get(key).push({ file: fname, slug: entry.slug });
      }
    }
  }
}

// YOUTUBE
console.log('===================================================');
console.log('  YOUTUBE TRIPLE-CHECK');
console.log('===================================================');

const ytCsv = fs.readFileSync('/Users/leath/Downloads/spe_youtube_content.csv', 'utf8');
const ytLines = ytCsv.split('\n').slice(1).filter(l => l.trim());
let ytFound = 0, ytMissing = 0;

for (const line of ytLines) {
  const parts = line.split(',');
  const title = parts[0];
  const url = parts.find(p => p.includes('youtube.com/watch'));
  if (!url) continue;
  const idMatch = url.match(/v=([a-zA-Z0-9_-]+)/);
  if (!idMatch) continue;
  const ytId = idMatch[1];

  const inMediaUrls = allMedia.has('youtube:' + ytId);
  const inBody = [...allBodyMedia.keys()].some(k => k.includes(ytId));

  if (inMediaUrls) {
    const locations = allMedia.get('youtube:' + ytId);
    console.log('Y ' + ytId + ' | ' + title.slice(0, 50) + ' -> ' + locations.map(l => l.file + '/' + l.slug).join(', '));
    ytFound++;
  } else if (inBody) {
    console.log('~ ' + ytId + ' | ' + title.slice(0, 50) + ' -> in body HTML (fallback)');
    ytFound++;
  } else {
    console.log('X ' + ytId + ' | ' + title.slice(0, 50) + ' -> NOT FOUND');
    ytMissing++;
  }
}
console.log('\nYouTube: ' + ytFound + ' found, ' + ytMissing + ' not found\n');

// VIMEO
console.log('===================================================');
console.log('  VIMEO TRIPLE-CHECK');
console.log('===================================================');

const vimeoCsv = fs.readFileSync('/Users/leath/Downloads/spe_vimeo_content (1).csv', 'utf8');
const vimeoLines = vimeoCsv.split('\n').slice(1).filter(l => l.trim());
let vFound = 0, vMissing = 0;

for (const line of vimeoLines) {
  // Extract vimeo ID from the line
  const idMatch = line.match(/vimeo\.com\/(\d+)/);
  if (!idMatch) continue;
  const vimeoId = idMatch[1];

  // Get title (first field, possibly quoted)
  let title = line.split(',')[0].replace(/^"/, '').replace(/"$/, '');

  const inMediaUrls = allMedia.has('vimeo:' + vimeoId);
  const inBody = [...allBodyMedia.keys()].some(k => k.includes(vimeoId));

  if (inMediaUrls) {
    const locations = allMedia.get('vimeo:' + vimeoId);
    console.log('Y ' + vimeoId + ' | ' + title.slice(0, 50) + ' -> ' + locations.map(l => l.file + '/' + l.slug).join(', ').slice(0, 80));
    vFound++;
  } else if (inBody) {
    console.log('~ ' + vimeoId + ' | ' + title.slice(0, 50) + ' -> in body HTML');
    vFound++;
  } else {
    console.log('X ' + vimeoId + ' | ' + title.slice(0, 50) + ' -> NOT FOUND');
    vMissing++;
  }
}
console.log('\nVimeo: ' + vFound + ' found, ' + vMissing + ' not found\n');

// SOUNDCLOUD
console.log('===================================================');
console.log('  SOUNDCLOUD TRIPLE-CHECK');
console.log('===================================================');

const scCsv = fs.readFileSync('/Users/leath/Downloads/spe_soundcloud_content (1).csv', 'utf8');
const scLines = scCsv.split('\n').slice(1).filter(l => l.trim());
let scFound = 0, scMissing = 0, scRemoved = 0;

for (const line of scLines) {
  // Simple CSV parse (handle quoted fields)
  const parts = [];
  let current = '';
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === ',' && !inQuotes) { parts.push(current); current = ''; continue; }
    current += ch;
  }
  parts.push(current);

  const title = parts[0] || '';
  const url = parts[7] || '';
  const status = (parts[8] || '').trim();

  if (!url.includes('soundcloud.com/')) continue;

  const scSlug = url.replace('https://soundcloud.com/', '');
  const scTrailSlug = scSlug.split('/').pop(); // just the last segment

  if (status === 'Removed/Private') {
    console.log('- ' + scSlug.slice(0, 50) + ' | ' + title.slice(0, 40) + ' -> REMOVED/PRIVATE');
    scRemoved++;
    continue;
  }

  // Check if in mediaUrls (match on the trail slug in the id field)
  const inMediaUrls = [...allMedia.keys()].some(k => k.includes(scTrailSlug));
  const inBody = [...allBodyMedia.keys()].some(k => k.includes(scTrailSlug));

  if (inMediaUrls) {
    const matchKey = [...allMedia.keys()].find(k => k.includes(scTrailSlug));
    const locations = matchKey ? allMedia.get(matchKey) : [];
    console.log('Y ' + scSlug.slice(0, 50) + ' | ' + title.slice(0, 40) + ' -> ' + locations.map(l => l.file).join(', '));
    scFound++;
  } else if (inBody) {
    console.log('~ ' + scSlug.slice(0, 50) + ' | ' + title.slice(0, 40) + ' -> in body HTML');
    scFound++;
  } else {
    console.log('X ' + scSlug.slice(0, 50) + ' | ' + title.slice(0, 40) + ' -> NOT FOUND');
    scMissing++;
  }
}
console.log('\nSoundCloud: ' + scFound + ' found, ' + scMissing + ' not found, ' + scRemoved + ' removed/private\n');

// SUMMARY
console.log('===================================================');
console.log('  FINAL SUMMARY');
console.log('===================================================');
console.log('YouTube:    ' + ytFound + ' embedded, ' + ytMissing + ' not found');
console.log('Vimeo:      ' + vFound + ' embedded, ' + vMissing + ' not found');
console.log('SoundCloud: ' + scFound + ' embedded, ' + scMissing + ' not found, ' + scRemoved + ' removed/private');
const total = ytFound + vFound + scFound;
const totalMissing = ytMissing + vMissing + scMissing;
console.log('\nTOTAL: ' + total + ' embedded, ' + totalMissing + ' not found, ' + scRemoved + ' SC removed/private');
