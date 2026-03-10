const d = require('../src/data/podcasts.json');

// Show Watch-pattern titles
const watch = d.filter(p => p.title.startsWith('Watch'));
console.log('=== WATCH TITLES (first 15) ===');
watch.slice(0,15).forEach(p => console.log(JSON.stringify({
  title: p.title,
  hasSpeakers: Boolean(p.speakers),
  cat: p.category
})));
console.log('');

// Show speaker-series with speakers
const ss = d.filter(p => p.category === 'speaker-series' && p.speakers);
console.log('=== speaker-series WITH speakers (' + ss.length + ') ===');
ss.slice(0,5).forEach(p => console.log(JSON.stringify({title: p.title, speakers: p.speakers})));
console.log('');

// Show the 3 'podcasts' (plural) items
const plural = d.filter(p => p.category === 'podcasts');
console.log('=== podcasts (plural) items ===');
plural.forEach(p => console.log(JSON.stringify({title: p.title, slug: p.slug})));
console.log('');

// Show evening-talks category items
const et = d.filter(p => p.category === 'evening-talks');
console.log('=== evening-talks category (' + et.length + ') ===');
et.forEach(p => console.log(JSON.stringify({title: p.title, slug: p.slug})));
console.log('');

// Title prefixes
const prefixes = {};
d.forEach(p => {
  const m = p.title.match(/^(Interview with|Watch|Podcast:|Speaker Series:|Webinar:|Replay:|Evening meeting:|Masterclass:|Breakfast Meeting:|Virtual Masterclass:)/i);
  const key = m ? m[1] : '(no prefix)';
  prefixes[key] = (prefixes[key] || 0) + 1;
});
console.log('=== Title prefixes ===');
Object.entries(prefixes).sort((a,b) => b[1] - a[1]).forEach(([k,v]) => console.log(k + ': ' + v));
console.log('');

// For items WITHOUT speakers, show what we can extract from title
console.log('=== EXTRACTION PREVIEW (items without speakers) ===');
const noSpeakers = d.filter(p => !p.speakers);
let extracted = 0;
let notExtracted = 0;

for (const p of noSpeakers) {
  let name = null;

  // Pattern 1: "Interview with Name"
  let m = p.title.match(/^Interview with\s+(.+)$/i);
  if (m) { name = m[1]; }

  // Pattern 2: "Watch Name interview with Name"
  if (!name) {
    m = p.title.match(/^Watch\s+(.+?)\s+interview with\s+(.+)$/i);
    if (m) name = m[2] + ' (interviewer: ' + m[1] + ')';
  }

  // Pattern 3: "Watch Name in conversation with Name"
  if (!name) {
    m = p.title.match(/^Watch\s+(.+?)\s+in conversation with\s+(.+)$/i);
    if (m) name = m[2] + ' (interviewer: ' + m[1] + ')';
  }

  // Pattern 4: "Watch Name talk to Name"
  if (!name) {
    m = p.title.match(/^Watch\s+(.+?)\s+talk to\s+(.+)$/i);
    if (m) name = m[2] + ' (interviewer: ' + m[1] + ')';
  }

  // Pattern 5: "Podcast: Name on topic"
  if (!name) {
    m = p.title.match(/^Podcast:\s+(.+?)\s+on\s+/i);
    if (m) name = m[1];
  }

  // Pattern 6: "Speaker Series: Interview with Name"
  if (!name) {
    m = p.title.match(/^Speaker Series:\s+Interview with\s+(.+)$/i);
    if (m) name = m[1];
  }

  // Pattern 7: Body text "spoke with Name"
  if (!name && p.body) {
    m = p.body.match(/spoke with\s+([^,<]+)/i);
    if (m) name = m[1].trim();
  }

  if (name) {
    extracted++;
    if (extracted <= 20) console.log('  ✓ ' + JSON.stringify({title: p.title.slice(0,60), extracted: name}));
  } else {
    notExtracted++;
    if (notExtracted <= 15) console.log('  ✗ ' + JSON.stringify({title: p.title.slice(0,80), cat: p.category}));
  }
}

console.log('');
console.log('EXTRACTION SUMMARY:');
console.log('  Total without speakers: ' + noSpeakers.length);
console.log('  Extractable: ' + extracted);
console.log('  Not extractable: ' + notExtracted);
