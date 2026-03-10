/**
 * Reusable JSON-LD schema generators for SEO.
 *
 * Each function returns a plain object suitable for passing to useSEO({ schema }).
 * The useSEO hook serialises it into a <script type="application/ld+json"> tag.
 */

const SITE = 'https://www.spe.org.uk'
const ORG_NAME = 'Society of Professional Economists'

// ── Organisation (singleton — used on Home) ──────────────────────────

export function orgSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORG_NAME,
    alternateName: 'SPE',
    url: SITE,
    logo: `${SITE}/images/logo-colour.png`,
    foundingDate: '1953',
    description: "The UK's leading forum for professional economists.",
    sameAs: [
      'https://twitter.com/econ_SPE',
      'https://www.linkedin.com/company/society-of-professional-economists/',
      'https://www.youtube.com/@econ_SPE',
    ],
  }
}

// ── Breadcrumb list ──────────────────────────────────────────────────

interface Crumb {
  name: string
  path?: string        // omit for the final (current) item
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: `${SITE}${c.path}` } : {}),
    })),
  }
}

// ── WebPage (for landing / listing pages) ────────────────────────────

export function webPageSchema(opts: {
  name: string
  description: string
  path: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: opts.name,
    description: opts.description,
    url: `${SITE}${opts.path}`,
    isPartOf: {
      '@type': 'WebSite',
      name: ORG_NAME,
      url: SITE,
    },
  }
}

// ── CollectionPage (listing of items) ────────────────────────────────

export function collectionPageSchema(opts: {
  name: string
  description: string
  path: string
  itemCount: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: `${SITE}${opts.path}`,
    numberOfItems: opts.itemCount,
    isPartOf: {
      '@type': 'WebSite',
      name: ORG_NAME,
      url: SITE,
    },
  }
}

// ── Event (for event detail and annual dinner pages) ─────────────────

export function eventSchema(opts: {
  name: string
  date?: string
  venue?: string
  speakers?: string[]
  description?: string
  path: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: opts.name,
    ...(opts.date && { startDate: opts.date }),
    ...(opts.venue && { location: { '@type': 'Place', name: opts.venue } }),
    ...(opts.description && { description: opts.description }),
    ...(opts.speakers && opts.speakers.length > 0 && {
      performer: opts.speakers.map(s => ({ '@type': 'Person', name: s })),
    }),
    url: `${SITE}${opts.path}`,
    organizer: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: SITE,
    },
  }
}

// ── Article (for blog posts, news, articles, essays) ─────────────────

export function articleSchema(opts: {
  headline: string
  datePublished?: string
  author?: string
  description?: string
  image?: string
  path: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    ...(opts.datePublished && { datePublished: opts.datePublished }),
    ...(opts.author && {
      author: { '@type': 'Person', name: opts.author },
    }),
    ...(opts.description && { description: opts.description }),
    ...(opts.image && { image: `${SITE}${opts.image}` }),
    url: `${SITE}${opts.path}`,
    publisher: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/images/logo-colour.png` },
    },
  }
}

// ── Person (for speaker profiles, council members) ───────────────────

export function personSchema(opts: {
  name: string
  path: string
  role?: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: opts.name,
    url: `${SITE}${opts.path}`,
    ...(opts.role && { jobTitle: opts.role }),
    ...(opts.image && { image: `${SITE}${opts.image}` }),
    affiliation: {
      '@type': 'Organization',
      name: ORG_NAME,
    },
  }
}

// ── FAQPage (for FAQ sections) ───────────────────────────────────────

export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
