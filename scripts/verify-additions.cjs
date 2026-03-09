const p = require('../src/data/podcasts.json');
const et = require('../src/data/evening-talks.json');
const ev = require('../src/data/events.json');
const cr = require('../src/data/conference-reports.json');

const checks = [
  // 6 identified targets
  { file: 'events', slug: 'past-events/12276-1', label: 'Nearshoring', expectMedia: ['vimeo:982625415', 'youtube:q-3HNdUVvcs'] },
  { file: 'podcasts', slug: 'podcasts/12353', label: 'Millard', expectMedia: ['youtube:DSLleDYH21o'] },
  { file: 'evening-talks', slug: 'spe-webinar-levelling-up-is-hard-to-do', label: 'Levelling Up', expectMedia: ['vimeo:435055692'] },
  { file: 'conference-reports', slug: '2024-annual-conference-report', label: 'Conference 2024', expectMedia: ['youtube:rV_-EYOsja8', 'youtube:X30jhZTjoao'] },
  { file: 'podcasts', slug: 'conferences/2024-annual-conference-report', label: 'Conf2024 in podcasts', expectMedia: ['youtube:rV_-EYOsja8', 'youtube:X30jhZTjoao'] },
  { file: 'events', slug: 'past-events/7359-1', label: 'SPE-Event-280220', expectMedia: ['vimeo:396400939'] },
  { file: 'events', slug: 'past-events/5508-1', label: 'SPE-Event-251119', expectMedia: ['vimeo:379421248'] },

  // SoundCloud additions
  { file: 'podcasts', slug: 'podcasts/12291', label: 'Strain Podcast SC', expectMedia: ['soundcloud:sbe-audio-feed/strain-podcast'] },
  { file: 'podcasts', slug: 'evening-talks/3075', label: 'Jan 2015 SC', expectMedia: ['soundcloud:sbe-audio-feed/sbe-meeting-13-january-2015'] },
  { file: 'podcasts', slug: 'evening-talks/3734', label: 'Feb 2015 SC', expectMedia: ['soundcloud:sbe-audio-feed/sbe-meeting-10-february-2015'] },
  { file: 'podcasts', slug: 'evening-talks/3742', label: 'Mar 2015 Myners SC', expectMedia: ['soundcloud:sbe-audio-feed/lord-paul-myners-sbe-3-march-2015'] },
  { file: 'podcasts', slug: 'evening-talks/5290', label: 'Brexit SC in podcasts', expectMedia: ['soundcloud:sbe-audio-feed/brexit-seminar'] },
  { file: 'evening-talks', slug: 'trade-after-brexit', label: 'Brexit SC in ET', expectMedia: ['soundcloud:sbe-audio-feed/brexit-seminar'] },

  // Conference 2024 should NOT have wrong media
  { file: 'conference-reports', slug: '2024-annual-conference-report', label: 'Conf2024 NO wrong media', expectAbsent: ['vimeo:389688048', 'soundcloud:andrew-milligan-on-the-coronavirus-economy'] },
  { file: 'podcasts', slug: 'conferences/2024-annual-conference-report', label: 'Conf2024 pod NO wrong', expectAbsent: ['vimeo:389688048', 'soundcloud:andrew-milligan-on-the-coronavirus-economy'] },
];

const fileLookup = {
  podcasts: p,
  'evening-talks': et,
  events: ev,
  'conference-reports': cr,
};

let pass = 0, fail = 0;

for (const c of checks) {
  const data = fileLookup[c.file];
  const entry = data.find(e => e.slug === c.slug);
  if (!entry) {
    console.log(`✗ ${c.label}: entry NOT FOUND (${c.file}/${c.slug})`);
    fail++;
    continue;
  }

  const mediaIds = (entry.mediaUrls || []).map(m => m.type + ':' + m.id);
  const mediaSet = new Set(mediaIds);

  if (c.expectMedia) {
    const missing = c.expectMedia.filter(m => !mediaSet.has(m));
    if (missing.length > 0) {
      console.log(`✗ ${c.label}: MISSING ${JSON.stringify(missing)}`);
      console.log(`  Has: ${JSON.stringify(mediaIds)}`);
      fail++;
    } else {
      console.log(`✓ ${c.label}: all expected media present`);
      pass++;
    }
  }

  if (c.expectAbsent) {
    const found = c.expectAbsent.filter(m => mediaSet.has(m));
    if (found.length > 0) {
      console.log(`✗ ${c.label}: STILL HAS wrong media ${JSON.stringify(found)}`);
      fail++;
    } else {
      console.log(`✓ ${c.label}: wrong media correctly removed`);
      pass++;
    }
  }
}

console.log(`\n=== RESULTS: ${pass} pass, ${fail} fail ===`);
