/**
 * Event Metadata Normalisation Script
 *
 * Reads events.json, applies all normalisations, writes it back.
 *
 * Changes:
 *  1. Fix SBE → SPE naming (society rebranded)
 *  2. Normalise Annual Dinner titles to "SPE Annual Dinner YYYY"
 *  3. Assign categories to uncategorised events
 *  4. Normalise venue names
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, '..', 'src', 'data', 'events.json');
const data = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));

const stats = {
  sbeToSpe: 0,
  dinnerTitles: 0,
  categoriesAssigned: 0,
  venueNormalised: 0,
};

// ── 1. Fix SBE → SPE naming ────────────────────────────────────────────────

for (const item of data) {
  if (/\bSBE\b/.test(item.title)) {
    const before = item.title;
    item.title = item.title.replace(/\bSBE\b/g, 'SPE');
    if (item.title !== before) {
      console.log('  SBE→SPE: "' + before + '" → "' + item.title + '"');
      stats.sbeToSpe++;
    }
  }
}

// ── 2. Normalise Annual Dinner titles ──────────────────────────────────────

for (const item of data) {
  if (/annual dinner/i.test(item.title)) {
    const yrMatch = item.title.match(/(\d{4})/) || (item.date && item.date.match(/^(\d{4})/));
    if (yrMatch) {
      const canonical = 'SPE Annual Dinner ' + yrMatch[1];
      if (item.title !== canonical) {
        console.log('  Dinner title: "' + item.title + '" → "' + canonical + '"');
        item.title = canonical;
        stats.dinnerTitles++;
      }
    }
  }
}

// ── 3. Assign categories to uncategorised events ───────────────────────────

for (const item of data) {
  if (item.category) continue;

  const t = item.title.toLowerCase();

  if (/annual dinner/i.test(item.title)) {
    item.category = 'Dinner';
    stats.categoriesAssigned++;
  } else if (/annual conference|online conference/i.test(item.title)) {
    item.category = 'Conference';
    stats.categoriesAssigned++;
  } else if (/evening (meeting|talk)/i.test(item.title)) {
    item.category = 'Meeting';
    stats.categoriesAssigned++;
  } else if (/joint.*meeting|joint.*event|joint.*resolution/i.test(item.title)) {
    item.category = 'Meeting';
    stats.categoriesAssigned++;
  } else if (/outlook|economic|post-crisis|pmi|demographics/i.test(t)) {
    item.category = 'Meeting';
    stats.categoriesAssigned++;
  }
}

// ── 4. Normalise common venue spellings ────────────────────────────────────

const VENUE_FIXES = {
  'One Great George St': 'One Great George Street',
  'One Great George St.': 'One Great George Street',
  '1 Great George Street': 'One Great George Street',
  'ICE, 1 Great George Street': 'One Great George Street',
  'ICE, One Great George Street': 'One Great George Street',
  'Institute of Civil Engineers': 'One Great George Street',
};

for (const item of data) {
  if (item.venue && VENUE_FIXES[item.venue]) {
    console.log('  Venue: "' + item.venue + '" → "' + VENUE_FIXES[item.venue] + '"');
    item.venue = VENUE_FIXES[item.venue];
    stats.venueNormalised++;
  }
}

// ── 5. Write output ────────────────────────────────────────────────────────

fs.writeFileSync(INPUT, JSON.stringify(data, null, 2) + '\n', 'utf-8');

// ── 6. Report ──────────────────────────────────────────────────────────────

console.log('\n=== EVENT NORMALISATION REPORT ===');
console.log('SBE → SPE fixes:          ' + stats.sbeToSpe);
console.log('Dinner title fixes:       ' + stats.dinnerTitles);
console.log('Categories assigned:      ' + stats.categoriesAssigned);
console.log('Venue names normalised:   ' + stats.venueNormalised);
console.log('Total events:             ' + data.length);

// Show remaining uncategorised
const uncategorised = data.filter(e => !e.category);
if (uncategorised.length > 0) {
  console.log('\nStill uncategorised (' + uncategorised.length + '):');
  uncategorised.forEach(e => console.log('  - ' + e.title));
}
