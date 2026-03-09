const podcasts = require('../src/data/podcasts.json');
const eveningTalks = require('../src/data/evening-talks.json');
const events = require('../src/data/events.json');
const conferences = require('../src/data/conference-reports.json');

function findByDate(data, name, dateStr) {
  return data.filter(e => e.date && e.date.includes(dateStr)).map(e => ({
    file: name,
    slug: (e.slug || '').slice(0, 60),
    title: (e.title || '').slice(0, 60),
    date: e.date,
    hasMediaUrls: Boolean(e.mediaUrls && e.mediaUrls.length > 0),
    scMedia: (e.mediaUrls || []).filter(m => m.type === 'soundcloud').map(m => (m.url || '').slice(0, 80)),
    bodyHasSC: Boolean(e.body && e.body.toLowerCase().includes('soundcloud')),
  }));
}

// Check all SoundCloud CSV dates
const datesToCheck = [
  ['2015-01-13', 'Jan 2015 - Outlook UK Economy (sbe-meeting-13-january-2015)'],
  ['2015-02-10', 'Feb 2015 - Fiscal Outlook (sbe-meeting-10-february-2015)'],
  ['2015-03-03', 'Mar 2015 - Lord Myners (lord-paul-myners-sbe-3-march-2015)'],
  ['2016-04-14', 'Apr 2016 (sbe-meeting-14-april-2016)'],
  ['2016-11-08', 'Nov 2016 - Home Ownership (sbe-meeting-8-november-2016)'],
  ['2017-05-09', 'May 2017 (interview-sbe-meeting-9-may-2017)'],
  ['2017-07-03', 'Jul 2017 - long-term growth (sbe-meeting-3-july-2017)'],
  ['2019-01', 'Jan 2019 - Brexit Seminar (brexit-seminar)'],
];

for (const [d, label] of datesToCheck) {
  console.log(`\n--- ${label} ---`);
  const pr = findByDate(podcasts, 'podcasts', d);
  const et = findByDate(eveningTalks, 'evening-talks', d);
  const ev = findByDate(events, 'events', d);
  const all = [...pr, ...et, ...ev];
  if (all.length) {
    all.forEach(e => console.log(`  [${e.file}] ${e.slug} | media:${e.hasMediaUrls} | SC in body:${e.bodyHasSC} | SC media: ${JSON.stringify(e.scMedia)}`));
  } else {
    console.log('  (no entries found for this date)');
  }
}

// Also check the "Strain Podcast" and "Rachel Griffiths" SoundCloud
console.log('\n--- Strain Podcast ---');
const strain = [...podcasts, ...eveningTalks].filter(e => e.title && e.title.toLowerCase().includes('strain'));
strain.forEach(e => {
  const sc = (e.mediaUrls || []).filter(m => m.type === 'soundcloud');
  console.log(`  ${e.slug} | "${e.title}" | SC: ${JSON.stringify(sc.map(m=>m.url?.slice(0,60)))}`);
});

console.log('\n--- Rachel Griffiths ---');
const rg = [...podcasts, ...eveningTalks].filter(e => e.title && e.title.toLowerCase().includes('griffith'));
rg.forEach(e => {
  const sc = (e.mediaUrls || []).filter(m => m.type === 'soundcloud');
  console.log(`  ${e.slug} | "${e.title}" | SC: ${JSON.stringify(sc.map(m=>m.url?.slice(0,60)))}`);
});

// Check the target entries that need media additions
console.log('\n\n=== 6 IDENTIFIED TARGETS ===');

// Nearshoring
const nearshoring = events.find(e => e.slug === 'past-events/12276-1');
console.log(`\n1. Nearshoring: ${nearshoring ? nearshoring.slug : 'NOT FOUND'} | media: ${JSON.stringify((nearshoring?.mediaUrls||[]).map(m=>m.type+':'+m.id))}`);

// Millard
const millard = podcasts.find(e => e.slug === 'podcasts/12353');
console.log(`2. Millard: ${millard ? millard.slug : 'NOT FOUND'} | media: ${JSON.stringify((millard?.mediaUrls||[]).map(m=>m.type+':'+m.id))}`);

// Levelling Up
const levelUp = eveningTalks.find(e => e.slug && e.slug.includes('levelling'));
console.log(`3. Levelling Up: ${levelUp ? levelUp.slug : 'NOT FOUND'} | media: ${JSON.stringify((levelUp?.mediaUrls||[]).map(m=>m.type+':'+m.id))}`);

// Conference 2024
const conf2024 = conferences.find(e => e.slug === '2024-annual-conference-report');
const confPod = podcasts.find(e => e.slug && e.slug.includes('2024-annual-conference'));
console.log(`4a. Conference 2024 (conf): ${conf2024 ? conf2024.slug : 'NOT FOUND'} | media: ${JSON.stringify((conf2024?.mediaUrls||[]).map(m=>m.type+':'+m.id))}`);
console.log(`4b. Conference 2024 (pod): ${confPod ? confPod.slug : 'NOT FOUND'} | media: ${JSON.stringify((confPod?.mediaUrls||[]).map(m=>m.type+':'+m.id))}`);

// SPE-Event-280220
const evt280220 = events.find(e => e.slug === 'past-events/7359-1');
console.log(`5. SPE-Event-280220: ${evt280220 ? evt280220.slug : 'NOT FOUND'} | media: ${JSON.stringify((evt280220?.mediaUrls||[]).map(m=>m.type+':'+m.id))}`);

// SPE-Event-251119
const evt251119 = events.find(e => e.slug === 'past-events/5508-1');
console.log(`6. SPE-Event-251119: ${evt251119 ? evt251119.slug : 'NOT FOUND'} | media: ${JSON.stringify((evt251119?.mediaUrls||[]).map(m=>m.type+':'+m.id))}`);
