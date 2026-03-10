/**
 * Topic Analysis Script
 *
 * Scans all content sources to identify recurring themes for taxonomy building.
 */
const events = require('../src/data/events.json');
const podcasts = require('../src/data/podcasts.json');
const articles = require('../src/data/articles.json');
const blogs = require('../src/data/blogs.json');
const talks = require('../src/data/evening-talks.json');
const ryb = require('../src/data/ryb-essays.json');
const bookReviews = require('../src/data/book-reviews.json');
const news = require('../src/data/news.json');
const confReports = require('../src/data/conference-reports.json');
const dinnerReviews = require('../src/data/dinner-reviews.json');

const STOP_WORDS = new Set([
  'with','from','that','this','have','been','will','they','their','about',
  'more','than','what','when','were','some','into','also','other','over',
  'just','very','could','would','your','after','which','there','these',
  'those','then','only','most','both','each','many','much','such','like',
  'does','well','even','back','good','best','make','made','gave','know',
  'take','want','annual','dinner','meeting','evening','talk','conference',
  'review','report','podcast','episode','part','page','society','professional',
  'economists','great','george','street','london','online','event',
]);

// Collect all titles
const allContent = [];
const addAll = (arr, type) => arr.forEach(i => allContent.push({
  type,
  title: i.title || '',
  body: (i.body || '').replace(/<[^>]*>/g, ' ').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').toLowerCase()
}));

addAll(events, 'event');
addAll(podcasts, 'podcast');
addAll(articles, 'article');
addAll(blogs, 'blog');
addAll(talks, 'talk');
addAll(ryb, 'ryb-essay');
addAll(bookReviews, 'book-review');
addAll(news, 'news');
addAll(confReports, 'conf-report');
addAll(dinnerReviews, 'dinner-review');

console.log('Total content items:', allContent.length);
console.log('By type:');
const counts = {};
allContent.forEach(c => counts[c.type] = (counts[c.type] || 0) + 1);
Object.entries(counts).sort((a, b) => b[1] - a[1]).forEach(([t, c]) => console.log('  ' + t + ': ' + c));

// Keyword frequency on titles
const titleWords = {};
allContent.forEach(c => {
  const words = c.title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOP_WORDS.has(w));
  words.forEach(w => titleWords[w] = (titleWords[w] || 0) + 1);
});

console.log('\nTop 80 title keywords:');
Object.entries(titleWords).sort((a, b) => b[1] - a[1]).slice(0, 80).forEach(([w, c]) => console.log('  ' + w + ': ' + c));

// Bigram analysis on titles
const bigrams = {};
allContent.forEach(c => {
  const words = c.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
  for (let i = 0; i < words.length - 1; i++) {
    const bg = words[i] + ' ' + words[i + 1];
    if (!STOP_WORDS.has(words[i]) || !STOP_WORDS.has(words[i + 1])) {
      bigrams[bg] = (bigrams[bg] || 0) + 1;
    }
  }
});

console.log('\nTop 50 title bigrams (count >= 3):');
Object.entries(bigrams)
  .filter(([, c]) => c >= 3)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 50)
  .forEach(([bg, c]) => console.log('  ' + bg + ': ' + c));

// Show sample titles by major theme keywords
const themeKeywords = {
  'Monetary Policy': /monetary\s+policy|interest\s+rate|central\s+bank|bank\s+of\s+england|inflation\s+target|quantitative\s+easing/i,
  'Fiscal Policy': /fiscal|budget|taxation|tax\s+policy|public\s+spending|government\s+spending|public\s+finance/i,
  'Housing': /hous(e|ing)|property|mortgage|residential|home\s+owner|construction/i,
  'Labour Market': /labour|labor|employment|unemployment|wage|job|workforce|skills|migration|immigration/i,
  'Trade': /trade|export|import|tariff|global(isation|ization)|brexit|european\s+union|single\s+market/i,
  'Growth': /growth|gdp|productiv(e|ity)|economic\s+performance|recession|recovery/i,
  'Financial Markets': /financial\s+market|banking|credit|debt|bond|equity|stock|asset|investment/i,
  'Inequality': /inequal(ity|ities)|poverty|distribut(ion|ive)|social\s+mobil/i,
  'Climate/Energy': /climate|energy|green|carbon|net\s+zero|environment|sustainab/i,
  'Technology': /technolog|digital|innovat|artificial\s+intelligen|data|fintech|crypto/i,
  'Economic History': /histor(y|ical)|century|war|crisis|depression|post-war/i,
  'Forecasting': /forecast|outlook|predict|prospect|projections/i,
  'Education': /education|university|school|teaching|academic|curriculum/i,
  'Health': /health|nhs|pandemic|covid|medical|pharmaceutical/i,
  'Development': /develop(ing|ment)|emerging|africa|asia|poverty|aid|world\s+bank/i,
  'Public Policy': /public\s+policy|regulation|reform|government|state|welfare|pensions/i,
  'Infrastructure': /infrastructure|transport|rail|road|investment|planning/i,
};

console.log('\n\n=== THEME COVERAGE ===');
for (const [theme, regex] of Object.entries(themeKeywords)) {
  const matches = allContent.filter(c => regex.test(c.title) || regex.test(c.body.slice(0, 500)));
  console.log(`\n${theme}: ${matches.length} items`);
  matches.slice(0, 5).forEach(m => console.log(`  [${m.type}] ${m.title}`));
  if (matches.length > 5) console.log(`  ... and ${matches.length - 5} more`);
}

// Items that match NO theme
const unmatched = allContent.filter(c => {
  return !Object.values(themeKeywords).some(regex => regex.test(c.title) || regex.test(c.body.slice(0, 500)));
});
console.log(`\n\nUNMATCHED (${unmatched.length} items):`);
unmatched.forEach(m => console.log(`  [${m.type}] ${m.title}`));
