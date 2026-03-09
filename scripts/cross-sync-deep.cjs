const p = require('../src/data/podcasts.json');
const et = require('../src/data/evening-talks.json');

// Check if the specific entries we're concerned about exist in both files
const checks = [
  { label: 'Levelling Up', etSlug: 'spe-webinar-levelling-up-is-hard-to-do' },
  { label: 'Trade after Brexit', etSlug: 'trade-after-brexit' },
  { label: 'Jan 2015', etSlug: '3075' },
  { label: 'Feb 2015', etSlug: '3734' },
  { label: 'Mar 2015 Myners', etSlug: '3742' },
  { label: 'Brexit/5290', etSlug: '5290' },
];

for (const c of checks) {
  const pSlug = 'evening-talks/' + c.etSlug;
  const etEntry = et.find(e => e.slug === c.etSlug);
  const pEntry = p.find(e => e.slug === pSlug);

  console.log(`\n${c.label} (${c.etSlug}):`);
  console.log(`  In evening-talks.json: ${etEntry ? 'YES' : 'NO'}`);
  if (etEntry) console.log(`    mediaUrls: ${JSON.stringify((etEntry.mediaUrls||[]).map(m=>m.type+':'+m.id))}`);
  console.log(`  In podcasts.json as '${pSlug}': ${pEntry ? 'YES' : 'NO'}`);
  if (pEntry) console.log(`    mediaUrls: ${JSON.stringify((pEntry.mediaUrls||[]).map(m=>m.type+':'+m.id))}`);
}

// Also count how many evening-talks entries exist in each file
const etSlugsInP = p.filter(e => e.slug && e.slug.startsWith('evening-talks/')).length;
const etTotal = et.length;
console.log(`\nTotal: ${etSlugsInP} evening-talks entries in podcasts.json, ${etTotal} in evening-talks.json`);
