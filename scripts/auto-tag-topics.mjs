/**
 * Auto-tag untagged content items with topics based on keyword matching.
 * Uses the existing SPE topic taxonomy.
 * Reads body HTML + title, strips tags, and scores against topic keyword lists.
 */
import { readFileSync, writeFileSync } from 'fs'

// ── The existing SPE topic taxonomy with scoring keywords ──────────────

const TOPIC_KEYWORDS = {
  'Monetary Policy': [
    'monetary policy', 'interest rate', 'central bank', 'bank of england',
    'quantitative easing', 'inflation target', 'deflation', 'money supply',
    'federal reserve', 'ecb', 'european central bank', 'base rate',
    'gilt', 'bond yield', 'yield curve', 'forward guidance', 'mpc',
    'monetary committee', 'price stability', 'disinflation'
  ],
  'Fiscal Policy': [
    'fiscal policy', 'government spending', 'taxation', 'tax policy',
    'budget', 'deficit', 'surplus', 'public debt', 'national debt',
    'government borrowing', 'austerity', 'stimulus', 'treasury',
    'chancellor', 'spending review', 'fiscal rule', 'public expenditure',
    'tax reform', 'obr', 'office for budget responsibility'
  ],
  'Macroeconomics': [
    'gdp', 'economic growth', 'recession', 'business cycle', 'output gap',
    'aggregate demand', 'aggregate supply', 'macroeconomic', 'productivity',
    'economic outlook', 'economic forecast', 'recovery', 'slowdown',
    'boom', 'depression', 'stagnation', 'potential output', 'economic performance',
    'econom', 'outlook', 'forecast'
  ],
  'Trade & Globalisation': [
    'trade', 'tariff', 'globalisation', 'globalization', 'import', 'export',
    'free trade', 'protectionism', 'wto', 'world trade', 'trade war',
    'trade agreement', 'trade deficit', 'trade surplus', 'customs',
    'supply chain', 'comparative advantage', 'trade barrier', 'brexit trade',
    'single market', 'customs union', 'emerging market'
  ],
  'Financial Markets': [
    'financial market', 'stock market', 'equity', 'derivative',
    'hedge fund', 'portfolio', 'asset price', 'financial crisis',
    'financial stability', 'systemic risk', 'credit', 'lending',
    'financial sector', 'capital market', 'bond market', 'risk management',
    'investment bank', 'financial regulation', 'fintech', 'cryptocurrency',
    'bitcoin', 'financial innovation', 'shadow banking', 'securitisation',
    'investor', 'volatility', 'valuation', 'speculation'
  ],
  'Geopolitics': [
    'geopolitic', 'china', 'russia', 'ukraine', 'war', 'conflict',
    'security', 'nato', 'eu ', 'european union', 'united states',
    'middle east', 'africa', 'asia', 'india', 'sanctions', 'cold war',
    'superpower', 'diplomacy', 'foreign policy', 'international relations',
    'developing countr', 'global order', 'democracy', 'authoritarian',
    'chatham house', 'global', 'world', 'international'
  ],
  'Public Policy': [
    'public policy', 'regulation', 'deregulation', 'welfare',
    'social policy', 'poverty', 'education policy', 'pension',
    'nhs', 'healthcare policy', 'housing policy', 'planning',
    'transport policy', 'infrastructure', 'public service', 'privatisation',
    'nationalisation', 'government intervention', 'public sector'
  ],
  'Economic History': [
    'economic history', 'historical', 'history of', 'great depression',
    'gold standard', 'bretton woods', 'post-war', 'industrial revolution',
    'pre-war', 'nineteenth century', 'twentieth century', '18th century',
    '19th century', 'victorian', 'keynesian revolution', 'marshall plan',
    'thatcher', 'reagan', 'adam smith', 'keynes', 'hayek', 'marx'
  ],
  'Technology': [
    'technology', 'artificial intelligence', 'machine learning', 'automation',
    'digital', 'internet', 'platform', 'big data', 'algorithm', 'robot',
    'innovation', 'productivity puzzle', 'tech sector', 'silicon valley',
    'startup', 'disruption', 'gig economy', 'online'
  ],
  'Inequality': [
    'inequality', 'wealth gap', 'income distribution', 'poverty',
    'social mobility', 'gender gap', 'racial', 'diversity',
    'inclusive growth', 'living standard', 'minimum wage', 'living wage',
    'top 1%', 'bottom 10%', 'gini', 'redistribution', 'piketty',
    'intergenerational', 'social class', 'meritocrac'
  ],
  'Climate & Energy': [
    'climate', 'carbon', 'emission', 'net zero', 'renewable', 'energy',
    'fossil fuel', 'green', 'sustainability', 'environmental',
    'paris agreement', 'cop26', 'cop27', 'cop28', 'decarboni',
    'transition', 'nuclear', 'oil price', 'gas price', 'clean energy'
  ],
  'Health': [
    'health', 'pandemic', 'covid', 'nhs', 'pharmaceutical',
    'vaccine', 'mortality', 'life expectancy', 'mental health',
    'public health', 'epidem', 'disease', 'ageing', 'aging population',
    'demographic', 'wellbeing', 'well-being', 'obesity', 'healthcare'
  ],
  'Labour Markets': [
    'labour market', 'labor market', 'employment', 'unemployment',
    'job', 'wage', 'worker', 'workforce', 'skill', 'migration',
    'immigration', 'gig economy', 'flexible working', 'remote work',
    'trade union', 'strike', 'hiring', 'redundanc', 'furlough',
    'human capital', 'talent', 'recruitment'
  ],
  'Careers & Profession': [
    'career', 'profession', 'economist', 'civil service', 'salary survey',
    'spe member', 'networking', 'professional development', 'mentoring',
    'graduate', 'early career', 'spe event', 'membership',
    'interview with', 'speaker series', 'in conversation', 'panel'
  ],
  'Economic Measurement': [
    'measurement', 'statistic', 'data quality', 'gdp measurement',
    'national accounts', 'ons', 'census', 'survey', 'index',
    'indicator', 'methodology', 'bias', 'big data', 'nowcast',
    'forecast accuracy', 'forecast error'
  ],
  'Housing': [
    'housing', 'house price', 'property', 'mortgage', 'rent',
    'housing market', 'housebuilding', 'planning permission',
    'homelessness', 'affordable housing', 'first-time buyer',
    'housing supply', 'housing crisis', 'stamp duty'
  ],
  'Banking': [
    'bank', 'banking', 'basel', 'capital requirement', 'stress test',
    'deposit', 'loan', 'mortgage lending', 'payment system',
    'clearing', 'settlement', 'banking regulation', 'too big to fail',
    'ring-fencing', 'resolution', 'bail-in', 'bail-out'
  ]
}

function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').toLowerCase()
}

function scoreTopic(text, keywords) {
  let score = 0
  for (const kw of keywords) {
    // Count occurrences (but cap at 5 to avoid over-counting)
    const re = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    const matches = text.match(re)
    if (matches) score += Math.min(matches.length, 5)
  }
  return score
}

function assignTopics(title, body) {
  const strippedBody = stripHtml(body)
  const isMemberLocked = strippedBody.includes('content can be accessed by members') || strippedBody.length < 50
  // If body is member-locked or very short, weight title 5x instead of 2x
  const titleRepeat = isMemberLocked ? 5 : 2
  const text = stripHtml(Array(titleRepeat).fill(title).join(' ') + ' ' + body)
  const scores = []
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    const score = scoreTopic(text, keywords)
    if (score > 0) scores.push({ topic, score })
  }
  scores.sort((a, b) => b.score - a.score)
  // Pick top 2-3 with meaningful scores (lower threshold for title-only)
  const minThreshold = isMemberLocked ? 0.5 : 1
  const threshold = Math.max(minThreshold, (scores[0]?.score || 0) * 0.2)
  const picked = scores.filter(s => s.score >= threshold).slice(0, 3)
  return picked.map(p => p.topic)
}

// ── Process each content file ──────────────────────────────────────────

const FILES = [
  'articles', 'blogs', 'dinner-reviews', 'evening-talks',
  'podcasts', 'news', 'ryb-essays', 'conference-reports', 'book-reviews'
]

let totalTagged = 0
let totalAlready = 0

for (const f of FILES) {
  const path = `src/data/${f}.json`
  const data = JSON.parse(readFileSync(path, 'utf8'))
  let changed = 0

  for (const item of data) {
    if (item.topics && item.topics.length > 0) {
      totalAlready++
      continue
    }
    const topics = assignTopics(item.title || '', item.body || '')
    if (topics.length > 0) {
      item.topics = topics
      changed++
      totalTagged++
    }
  }

  if (changed > 0) {
    writeFileSync(path, JSON.stringify(data, null, 2) + '\n')
    console.log(`${f}: tagged ${changed} items`)
  } else {
    console.log(`${f}: no changes needed`)
  }
}

console.log(`\nDone: ${totalTagged} newly tagged, ${totalAlready} already had topics`)
