const p = require('../src/data/podcasts.json');
const et = require('../src/data/evening-talks.json');

// P→ET: entries in podcasts.json with evening-talks/ prefix that have media missing from evening-talks.json
const gaps = [];
for (const pe of p) {
  if (!pe.slug || !pe.slug.startsWith('evening-talks/')) continue;
  if (!pe.mediaUrls || pe.mediaUrls.length === 0) continue;
  const etSlug = pe.slug.replace('evening-talks/', '');
  const etEntry = et.find(e => e.slug === etSlug);
  if (!etEntry) continue;
  const pMedia = pe.mediaUrls.map(m => m.type+':'+m.id).sort();
  const etMedia = (etEntry.mediaUrls || []).map(m => m.type+':'+m.id).sort();
  const etSet = new Set(etMedia);
  const missing = pMedia.filter(m => !etSet.has(m));
  if (missing.length > 0) {
    gaps.push({ pSlug: pe.slug, etSlug, missing });
  }
}
console.log('=== P→ET gaps (podcasts has media, evening-talks missing) ===');
console.log(JSON.stringify(gaps, null, 2));

// ET→P: entries in evening-talks.json that have media missing from podcasts.json
const gaps2 = [];
for (const ee of et) {
  if (!ee.mediaUrls || ee.mediaUrls.length === 0) continue;
  const pSlug = 'evening-talks/' + ee.slug;
  const pe = p.find(e => e.slug === pSlug);
  if (!pe) continue;
  const etMedia = ee.mediaUrls.map(m => m.type+':'+m.id).sort();
  const pMedia = (pe.mediaUrls || []).map(m => m.type+':'+m.id).sort();
  const pSet = new Set(pMedia);
  const missing = etMedia.filter(m => !pSet.has(m));
  if (missing.length > 0) {
    gaps2.push({ etSlug: ee.slug, pSlug, missing });
  }
}
console.log('\n=== ET→P gaps (evening-talks has media, podcasts missing) ===');
console.log(JSON.stringify(gaps2, null, 2));

// Also check conferences/podcasts cross-sync
const cr = require('../src/data/conference-reports.json');
console.log('\n=== Conference Reports ↔ Podcasts cross-sync ===');
for (const c of cr) {
  if (!c.mediaUrls || c.mediaUrls.length === 0) continue;
  const pSlug = 'conferences/' + c.slug;
  const pe = p.find(e => e.slug === pSlug);
  if (!pe) continue;
  const cMedia = c.mediaUrls.map(m => m.type+':'+m.id).sort();
  const pMedia = (pe.mediaUrls || []).map(m => m.type+':'+m.id).sort();
  if (JSON.stringify(cMedia) !== JSON.stringify(pMedia)) {
    console.log(`  MISMATCH ${c.slug}:`);
    console.log(`    conf:  ${JSON.stringify(cMedia)}`);
    console.log(`    pod:   ${JSON.stringify(pMedia)}`);
  }
}
