/**
 * Topic Tagging Script
 *
 * Assigns 1-3 topic tags to every content item across all JSON data sources.
 * Uses title-primary matching with body-text fallback.
 *
 * Strategy:
 *  - Title keywords: high confidence, always used
 *  - Body first-800-chars: medium confidence, used when title has no matches
 *  - Extended body (first 2000 chars): for interview/conversation items and
 *    book reviews where titles are often just speaker/book names
 *
 * Taxonomy (16 topics for a professional economics society):
 *   Macroeconomics        – growth, GDP, productivity, outlook, cycles
 *   Monetary Policy       – interest rates, inflation, central banks, QE
 *   Fiscal Policy         – budget, tax, public spending, fiscal rules
 *   Financial Markets     – banking, credit, debt, bonds, investment
 *   Labour Markets        – employment, unemployment, wages, skills, migration
 *   Trade & Globalisation – trade, Brexit, EU, globalisation, tariffs
 *   Housing               – housing market, property, construction
 *   Inequality            – inequality, poverty, welfare, gender, demographics
 *   Climate & Energy      – climate, green, net zero, sustainability
 *   Technology            – digital, AI, fintech, data science, innovation
 *   Public Policy         – regulation, reform, governance, CBA, wellbeing
 *   Economic History      – history of economic thought, capitalism, crises
 *   Health                – NHS, pandemic, health economics
 *   Geopolitics           – defence, geopolitical, world order, security
 *   Careers & Profession  – careers, salary, professional development, courses
 *   Economic Measurement  – statistics, PMI, ONS, data quality
 */

const fs = require('fs');
const path = require('path');

// ── Topic definitions ──────────────────────────────────────────────────────

const TOPICS = [
  {
    tag: 'Macroeconomics',
    title: /\b(macroeconomic|gdp|productiv(e|ity)|economic\s+(growth|outlook|performance|recovery|cycle|prospect|forecast|stagnation)|growth\s+(rate|strateg)|recession|demand\s+and\s+supply|supply[\s-]side|aggregate\s+demand|business\s+cycle|national\s+income|outlook\s+for\s+\d{4}|outlook\s+for\s+the|revitalis|future[\s-]proof|stagnated|levelling\s+up|economic\s+model|economic\s+regime|uk\s+(macro\s+)?outlook|global\s+outlook|economic\s+outlook|long[\s-]?term\s+growth|post[\s-]crisis|weak\s+growth|return\s+to\s+growth|secular\s+stagnation|spare\s+capacity|better\s+growth)\b/i,
    body: /\b(gdp|macroeconom|economic\s+growth|aggregate\s+demand|supply[\s-]side|business\s+cycle|national\s+output|economic\s+outlook|economic\s+recovery|recession)\b/i,
  },
  {
    tag: 'Monetary Policy',
    title: /\b(monetary\s+policy|interest\s+rate|central\s+bank|bank\s+of\s+england|inflation|quantitative\s+(easing|tightening)|deflation|money\s+supply|MPC\b|mervyn\s+king|modern\s+monetary|MMT\b|money:\s+historical|QE\b|QT\b|low\s+interest\s+rates|price\s+of\s+time|money\s+revolution|lombard\s+street|paper\s+money\s+collapse|price\s+setting|curse\s+of\s+cash|new\s+case\s+for\s+gold)\b/i,
    body: /\b(monetary\s+policy|interest\s+rate|central\s+bank|bank\s+of\s+england|inflation\s+target|quantitative|monetary\s+union|base\s+rate)\b/i,
  },
  {
    tag: 'Fiscal Policy',
    title: /\b(fiscal|budget|post[\s‑-]?budget|taxation|tax\s+(system|policy|reform)|public\s+(spending|finance|debt)|government\s+(spend|borrow|debt)|spring\s+statement|autumn\s+statement|OBR\b|deficit|austerit|public\s+service\s+pension|debt\s+overhang|taxing\s+multinational|multinationals|national\s+debt|time\s+for\s+socialism|deficit\s+myth|beyond\s+our\s+means)\b/i,
    body: /\b(fiscal\s+policy|government\s+(spending|borrowing)|public\s+(finance|debt)|budget\s+(deficit|surplus)|taxation|tax\s+system|treasury)\b/i,
  },
  {
    tag: 'Financial Markets',
    title: /\b(financial\s+(market|crisis|sector|stability|regulation|system|diaries|model|order)|banking|bank(s|er)|credit|hedge\s+fund|bond|equity|asset\s+(price|class|allocation|management)|stock\s+market|capital\s+market|risk\s+management|portfolio|fund\s+management|securiti|dollar\s+dominan|de-dollarisation|financier|strategic\s+risk|goldilocks|supply\s+shock|atlas\s+of\s+finance|king\s+dollar|our\s+dollar|multicurrency|money\s+work|fearful\s+rise|boom\s+and\s+bust|long\s+good\s+buy|little\s+book\s+of\s+hedge|bankers|bail(out)?|leveraged|investing|investment\s+return|happy\s+returns|country\s+risk|man\s+who\s+knew|courage\s+to\s+act|FPC\b)\b/i,
    body: /\b(financial\s+(market|crisis|stability)|capital\s+market|stock\s+market|asset\s+(price|allocation)|banking\s+(sector|system|crisis)|bond\s+(market|yield)|investment\s+(bank|return))\b/i,
  },
  {
    tag: 'Labour Markets',
    title: /\b(labour\s+market|labor\s+market|employment|unemployment|wage(s)?|job(s)?\s+market|workforce|skill(s)?\s+gap|migration|immigration|gender\s+equality|women\s+in\s+economics|gender\s+pay|minimum\s+wage|gig\s+economy|working\s+pattern|salary\s+survey|work[\s-]life|not\s+working|diversity|exceptional\s+people|paid\s+what|good\s+time\s+to\s+be\s+a\s+girl|finding\s+time|work\s+restrictions|apprenticeship)\b/i,
    body: /\b(labour\s+market|employment\s+(rate|level)|unemployment\s+rate|wage\s+(growth|inflation)|job\s+(market|creation)|labour\s+supply|workforce)\b/i,
  },
  {
    tag: 'Trade & Globalisation',
    title: /\b(trade\b|export|import|tariff|globali[sz]ation|brexit|european\s+union|single\s+market|free\s+trade|WTO\b|nearshoring|reshoring|continental\s+drift|euro\s+area|north\s+american|protectionism|world\s+order|europe\b|euroshock|can\s+europe|eurozone|belt\s+and\s+road|economic\s+integration|superpower\s+showdown|accidental\s+conflict|global\s+discord|trouble\s+with\s+europe|t[\s-]shirts?\s+to\s+t[\s-]bonds?)\b/i,
    body: /\b(international\s+trade|free\s+trade|trade\s+(policy|agreement|war|deficit)|globali[sz]ation|brexit|european\s+(union|economy|integration)|world\s+trade)\b/i,
  },
  {
    tag: 'Housing',
    title: /\b(hous(e|ing)\s+(market|policy|crisis|supply|price|storm|debate|for\s+all)|property\s+(market|price)|mortgage|residential|construction\s+(sector|industry)|home[\s-]?owner(ship)?|housebuilding|hs2|safe\s+as\s+houses|housing\b|understanding\s+affordability|urban\s+policy|british\s+cities)\b/i,
    body: /\b(housing\s+(market|price|supply|policy)|property\s+(market|price)|mortgage\s+(rate|lending)|house\s+price|housebuilding)\b/i,
  },
  {
    tag: 'Inequality',
    title: /\b(inequal(ity|ities)|poverty|distribut(ion|ive)|social\s+mobil|intergenerational|demographic(s)?|ageing|population\s+(ageing|growth|decline)|left\s+behind|share\s+power|welfare|pension|basic\s+income|richer\s+and\s+more\s+equal|getting\s+poorer|no\s+one\s+left|rich\s+world|happiness|insecurity|prosperity\s+and\s+justice|rewriting\s+the\s+rules|success\s+and\s+luck|time\s+bomb|doughnut\s+economics|world\s+in\s+2050|economics\s+of\s+belonging|people.*profits|gender\s+equality|herstory|world\s+add\s+up|wealth\s+effect|economic\s+case\s+for\s+gender|demographic\s+unravelled|demographics\s+unravelled)\b/i,
    body: /\b(income\s+inequality|wealth\s+(distribution|inequality)|social\s+mobility|gini\s+coefficient|poverty\s+(rate|line|reduction)|intergenerational|demographic)\b/i,
  },
  {
    tag: 'Climate & Energy',
    title: /\b(climate|energy|green\s+(finance|deal|transition|economy)|carbon|net\s+zero|environment|sustainab|biodiversity|renewable|oil\s+price|price\s+of\s+oil|material\s+world|doughnut\s+economics|environmental\s+economics)\b/i,
    body: /\b(climate\s+change|carbon\s+(emission|tax|price)|net\s+zero|green\s+(finance|transition|economy)|renewable\s+energy|energy\s+(policy|transition))\b/i,
  },
  {
    tag: 'Technology',
    title: /\b(technolog|digital|innovat(ion|ive)|artificial\s+intelligen|gen\s*ai|data\s+science|fintech|crypto|blockchain|algorithm|platform\s+revolution|python|machine\s+learning|online\s+retail|social\s+media|data\s+economy|coming\s+wave|machine\s+age|creative\s+destruction|bit\s+by\s+bit|technology\s+trap|ai\s+economy|virtual\s+competition|power\s+of\s+networks|disruption\s+dilemma|if\s+then|wildcat\s+currency|machine.*platform.*crowd)\b/i,
    body: /\b(artificial\s+intelligen|machine\s+learning|digital\s+(economy|transformation)|fintech|blockchain|technology|innovation\s+policy|data\s+science)\b/i,
  },
  {
    tag: 'Public Policy',
    title: /\b(public\s+policy|public\s+service|regulat(ion|ory)|reform\b|governance|cost[\s‑-]?benefit|wellbeing|well[\s-]being|appraisal|evaluation|behavioural\s+economics|nudge|competition\s+policy|competition\s+drives|mission[\s-]oriented|presenting\s+data|government\s+paternalism|nanny\s+state|unelected\s+power|phishing\s+for\s+phools|sharing\s+economy|road\s+to\s+freedom|mission\s+economy|voltage\s+effect|mismanaged\s+decline)\b/i,
    body: /\b(public\s+policy|cost[\s-]benefit\s+analysis|regulatory\s+(reform|policy)|behavioural\s+economics|government\s+policy|policy[\s-]mak)\b/i,
  },
  {
    tag: 'Economic History',
    title: /\b(histor(y|ical)|adam\s+smith|keynes|hayek|capitalism|economic\s+thought|enlightened\s+economics|modern\s+economy|fifty\s+things|first\s+principles|money:\s+historical|how\s+economics\s+became|remaking\s+of|great\s+economists|chancellors|french\s+revolution|classical\s+(school|liberalism)|forgotten\s+depression|two\s+hundred\s+years|double\s+entry|evolution\s+of\s+(money|everything)|what\s+went\s+wrong|laissez[\s-]faire|stolen\s+heritage|british\s+imperialism|road\s+to\s+recovery)\b/i,
    body: null, // title-only — body too noisy
  },
  {
    tag: 'Health',
    title: /\b(health|NHS|pandemic|covid|coronavirus|medical|pharmaceutical|emergency\s+care|patient|empire\s+of\s+pain)\b/i,
    body: /\b(health\s+(economics|spending|policy|care)|NHS|pandemic|covid[\s-]?19|coronavirus|public\s+health)\b/i,
  },
  {
    tag: 'Geopolitics',
    title: /\b(geopolitic|defence\s+economics|security|world\s+order|china|chinese|russia|us\s+president|general\s+election|populism|democracy|liberal\s+democracy|british\s+cities|urban\s+policy|economic\s+diplomacy|making\s+sense\s+of\s+china|breakneck|chile\s+project|south\s+korean|unlikely\s+partners|red\s+flags)\b/i,
    body: /\b(geopolitic|national\s+security|foreign\s+policy|international\s+relations|defence\s+(spending|economics))\b/i,
  },
  {
    tag: 'Careers & Profession',
    title: /\b(career(s)?|salary\s+survey|professional\s+development|how\s+to\s+be\s+a\s+successful\s+economist|cpd\b|courses?\b|masterclass|refresher|introduction\s+to\s+(python|evaluation|wellbeing|green)|mastering\s+metrics|teaching\s+economics|heart\s+of\s+teaching|is\s+economics\s+unscientific|economics\s+professors|what.s\s+wrong\s+with\s+economics)\b/i,
    body: null, // title-only
  },
  {
    tag: 'Economic Measurement',
    title: /\b(statistic(s|al)|measurement|measur(e|ing)\b|PMI|data\s+(quality|collection|strategy)|ONS\b|national\s+accounts|how\s+to\s+make\s+the\s+world\s+add\s+up|in\s+numbers|the\s+1%|alternative\s+data|now[\s-]cast|forecast(s|ing)?|fortune\s+tellers|narrative\s+economics)\b/i,
    body: /\b(economic\s+statistics|national\s+accounts|ONS|measurement\s+of|economic\s+data|data\s+quality)\b/i,
  },
];

// ── Tagging logic ──────────────────────────────────────────────────────────

/** Detect if this is an interview/conversation item (title is mainly a name) */
function isInterviewTitle(title) {
  return /\b(interview|conversation|watch\s+|hear\s+|speaker\s+series|talk(s)?\s+to|in\s+conversation)\b/i.test(title);
}

function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#0?39;/g, "'")
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tagItem(item) {
  const title = item.title || '';
  const bodyRaw = stripHtml(item.body || '');

  // For interviews/conversations/book reviews, use much more body text
  const isInterview = isInterviewTitle(title);
  const bodySlice = isInterview || !title ? bodyRaw.slice(0, 2000) : bodyRaw.slice(0, 800);
  const bodyLower = bodySlice.toLowerCase();

  const matched = [];

  for (const topic of TOPICS) {
    // Title match = high confidence, always include
    if (topic.title && topic.title.test(title)) {
      matched.push(topic.tag);
      continue;
    }
    // Body match = medium confidence, only if body is substantial
    if (topic.body && bodyRaw.length >= 50 && topic.body.test(bodyLower)) {
      matched.push(topic.tag);
    }
  }

  // Limit to 3 most relevant
  return matched.slice(0, 3);
}

// ── Process each data file ─────────────────────────────────────────────────

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

const FILES = [
  'events.json',
  'podcasts.json',
  'articles.json',
  'blogs.json',
  'evening-talks.json',
  'ryb-essays.json',
  'book-reviews.json',
  'news.json',
  'conference-reports.json',
  'dinner-reviews.json',
  'pages.json',
];

const stats = {
  totalItems: 0,
  taggedItems: 0,
  untaggedItems: 0,
  tagCounts: {},
  perFile: {},
};

for (const filename of FILES) {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.log('SKIP (not found): ' + filename);
    continue;
  }

  const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  let tagged = 0;
  let untagged = 0;

  for (const item of data) {
    const topics = tagItem(item);
    item.topics = topics;
    stats.totalItems++;

    if (topics.length > 0) {
      tagged++;
      stats.taggedItems++;
      topics.forEach(t => stats.tagCounts[t] = (stats.tagCounts[t] || 0) + 1);
    } else {
      untagged++;
      stats.untaggedItems++;
    }
  }

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  stats.perFile[filename] = { total: data.length, tagged, untagged };
  console.log(filename + ': ' + tagged + '/' + data.length + ' tagged (' + untagged + ' untagged)');
}

// ── Also regenerate book-reviews-index.json with topics ────────────────────

const brFullPath = path.join(DATA_DIR, 'book-reviews.json');
const brIndexPath = path.join(DATA_DIR, 'book-reviews-index.json');
if (fs.existsSync(brFullPath)) {
  const brFull = JSON.parse(fs.readFileSync(brFullPath, 'utf-8'));
  const brIndex = brFull.map(({ slug, title, date, reviewer, author, bookTitle, coverImage, topics }) =>
    ({ slug, title, date, reviewer, author, bookTitle, coverImage, topics })
  );
  fs.writeFileSync(brIndexPath, JSON.stringify(brIndex, null, 2) + '\n', 'utf-8');
  console.log('\nRegenerated book-reviews-index.json with topics field');
}

// ── Report ─────────────────────────────────────────────────────────────────

console.log('\n=== TOPIC TAGGING REPORT ===');
console.log('Total items:    ' + stats.totalItems);
console.log('Tagged:         ' + stats.taggedItems + ' (' + Math.round(100 * stats.taggedItems / stats.totalItems) + '%)');
console.log('Untagged:       ' + stats.untaggedItems + ' (' + Math.round(100 * stats.untaggedItems / stats.totalItems) + '%)');

console.log('\nTag distribution:');
Object.entries(stats.tagCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([tag, count]) => console.log('  ' + tag + ': ' + count));

console.log('\nPer file:');
Object.entries(stats.perFile).forEach(([f, s]) => {
  const pct = Math.round(100 * s.tagged / s.total);
  console.log('  ' + f + ': ' + s.tagged + '/' + s.total + ' (' + pct + '%) — ' + s.untagged + ' untagged');
});

// Show untagged items (re-read from disk)
const untaggedItems = [];
for (const filename of FILES) {
  const filepath = path.join(DATA_DIR, filename);
  if (fs.existsSync(filepath)) {
    const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    data.forEach(item => {
      if (!item.topics || item.topics.length === 0) {
        untaggedItems.push({ file: filename, title: item.title });
      }
    });
  }
}

if (untaggedItems.length > 0 && untaggedItems.length <= 100) {
  console.log('\nUntagged items (' + untaggedItems.length + '):');
  untaggedItems.forEach(u => console.log('  [' + u.file.replace('.json', '') + '] ' + u.title));
} else if (untaggedItems.length > 100) {
  console.log('\nUntagged items (' + untaggedItems.length + ') — showing first 60:');
  untaggedItems.slice(0, 60).forEach(u => console.log('  [' + u.file.replace('.json', '') + '] ' + u.title));
}
