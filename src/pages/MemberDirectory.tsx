import { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { webPageSchema, breadcrumbSchema } from '../utils/seoSchemas'
import Breadcrumbs from '../components/Breadcrumbs'
import orgsData from '../data/directory.json'

/** Categorise orgs into sectors for filter chips */
const sectorKeywords: Record<string, string[]> = {
  'Banking & Finance': [
    'Bank', 'Banking', 'Barclays', 'HSBC', 'Goldman', 'JP Morgan', 'Morgan Stanley',
    'UBS', 'Deutsche Bank', 'Nomura', 'Santander', 'Lloyds', 'Standard Chartered',
    'Rothschild', 'Haitong', 'RBC Europe', 'Brewin Dolphin', 'Arbuthnot', 'TSB',
    'Berenberg', 'Societe Generale', 'BNP Paribas', 'TD Securities', 'Investec',
    'MUFG', 'Mizuho', 'Credit', 'Netwealth',
  ],
  'Asset Management': [
    'Investments', 'Investors', 'Investment', 'Asset Management', 'Capital',
    'Fund Management', 'Vanguard', 'BlackRock', 'Invesco', 'Ruffer',
    'PGIM', 'Wadhwani', 'Rokos', 'Schonfeld', 'Millennium', 'T. Rowe',
    'Waverton', 'William Blair', 'WisdomTree', 'Cazenove', 'AustralianSuper',
    'CalPERS', 'State Street', 'Tudor', 'Element Capital', 'Taula', 'USS',
    'Capula', 'ExodusPoint', 'Cardano', 'Keyridge', 'Lightcast',
    'St James', 'Rathbones', 'Royal London',
  ],
  Government: [
    'HM Treasury', 'HMRC', 'Department for', 'Department of', 'Ministry',
    'Office for', 'OBR', 'Ofcom', 'Ofgem', 'Ofwat', 'Home Office',
    'Homes England', 'GLA', 'UK Export', 'UKRI', 'Civil Aviation',
    'Climate Change Committee', 'National Highways', 'Transport for London',
    'Financial Reporting Council', 'National Grid', 'Network Rail',
    'Office for Statistics', 'NHS',
  ],
  'Academia & Research': [
    'University', 'College', 'School', 'SOAS', 'LSE', 'London School of Economics',
    'Imperial', 'Cambridge', 'Birkbeck', 'Cranfield', 'BPP', 'Arden',
    'Open University', 'NIESR', 'National Institute', 'Resolution Foundation',
    'Institute for', 'Institute of', 'Royal Economic', 'Peterson',
    'Chatham House', 'Intergenerational', 'Pro Bono Economics',
    'Basic Income Forum',
  ],
  Consultancy: [
    'Consulting', 'Consultancy', 'Economics Ltd', 'Advisory', 'Partners',
    'Deloitte', 'KPMG', 'PwC', 'McKinsey', 'Arup', 'FTI',
    'Frontier Economics', 'Oxera', 'Capital Economics', 'Oxford Economics',
    'CEBR', 'London Economics', 'Compass Lexecon', 'PA Consulting',
    'NERA', 'Copenhagen Economics', 'Steer', 'Volterra', 'WPI',
    'Alvarez', 'AlixPartners', 'Capgemini', 'Charles River', 'Brattle',
    'Fingleton', 'Mott MacDonald', 'Savills', 'RSM', 'WSP', 'Jacobs',
    'AECOM', 'CBRE', 'Pragma', 'Public First', 'RBB Economics',
    'Warwick Economics',
  ],
  'Media & Publishing': [
    'BBC', 'Financial Times', 'Economist', 'Bloomberg', 'Thomson Reuters',
    'Fitch', 'Moody', "S&P Global", 'MNI', 'Haver', 'Scope Ratings',
    'Consensus Economics', 'Redburn', 'PeelHunt',
  ],
  'International Organisations': [
    'International Monetary Fund', 'IMF', 'European Bank', 'European Central',
    'World Bank', 'United Nations', 'Bank for International', 'Australian High',
    'Central Bank of', 'Development Bank', 'EBRD', 'Eurasia', 'Temasek',
    'OMFIF',
  ],
  'Energy & Industry': [
    'Shell', 'BP', 'Anglo American', 'Diageo', 'Teck', 'Lubrizol',
    'National Grid', 'London Gatwick', 'BT Group', 'Swiss Re', 'Visa',
    'Experian', 'Atradius', 'Construction Products', 'Food and Drink',
    'Mineral Products', 'Gas Strategies', 'Opportunity Green',
    'Grosvenor', 'Redevco', 'Aviva',
  ],
}

function getSector(org: string): string {
  for (const [sector, keywords] of Object.entries(sectorKeywords)) {
    if (keywords.some(kw => org.includes(kw))) return sector
  }
  return 'Other'
}

const organisations = orgsData.map((name: string) => ({
  name,
  sector: getSector(name),
  letter: name[0].toUpperCase(),
}))

const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const activeLetters = new Set(organisations.map(o => o.letter))

export default function MemberDirectory() {
  useSEO({
    title: 'Member Directory',
    description: 'Browse 275+ organisations where SPE members work — spanning banking, government, academia, consultancy, and more.',
    type: 'website',
    schema: [
      webPageSchema({ name: 'Member Directory', description: 'Browse 275+ organisations where SPE members work — spanning banking, government, academia, consultancy, and more.', path: '/membership/directory' }),
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Membership', path: '/membership' }, { name: 'Member Directory' }]),
    ],
  })

  const [search, setSearch] = useState('')
  const [activeSector, setActiveSector] = useState<string | null>(null)
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const sectors = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const org of organisations) {
      counts[org.sector] = (counts[org.sector] || 0) + 1
    }
    return Object.entries(counts)
      .sort(([a], [b]) => {
        if (a === 'Other') return 1
        if (b === 'Other') return -1
        return a.localeCompare(b)
      })
      .map(([name, count]) => ({ name, count }))
  }, [])

  const filtered = useMemo(() => {
    let result = organisations
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(o => o.name.toLowerCase().includes(q))
    }
    if (activeSector) {
      result = result.filter(o => o.sector === activeSector)
    }
    if (activeLetter) {
      result = result.filter(o => o.letter === activeLetter)
    }
    return result
  }, [search, activeSector, activeLetter])

  const grouped = useMemo(() => {
    const map: Record<string, typeof filtered> = {}
    for (const org of filtered) {
      if (!map[org.letter]) map[org.letter] = []
      map[org.letter].push(org)
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  // Scroll to letter section
  const scrollToLetter = (letter: string) => {
    setActiveLetter(null) // clear letter filter, scroll instead
    setActiveSector(null)
    setSearch('')
    setTimeout(() => {
      const el = sectionRefs.current[letter]
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 120
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }, 50)
  }

  // Intersection observer for active letter highlight
  const [visibleLetter, setVisibleLetter] = useState<string | null>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisibleLetter(entry.target.getAttribute('data-letter'))
          }
        }
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0 },
    )
    for (const el of Object.values(sectionRefs.current)) {
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [grouped])

  const isFiltering = !!search || !!activeSector || !!activeLetter

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep text-white relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <Breadcrumbs
            variant="light"
            className="mb-6"
            items={[
              { label: 'Home', to: '/' },
              { label: 'Membership', to: '/membership' },
              { label: 'Member Directory' },
            ]}
          />
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[2px] bg-spe-gold rounded-full" />
            <span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">Our Network</span>
          </div>
          <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl mb-4">Member Directory</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light leading-relaxed">
            SPE members work across <strong className="text-white font-medium">275+ organisations</strong> spanning
            finance, government, academia, consultancy, and industry.
          </p>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-spe-divider/30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Search input */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-spe-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search organisations…"
                aria-label="Search organisations"
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveLetter(null) }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-spe-divider/40 bg-spe-bg-alt text-sm text-spe-ink placeholder:text-spe-grey/60 focus:outline-none focus:ring-2 focus:ring-spe-blue/30 focus:border-spe-blue/50 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-spe-grey hover:text-spe-ink transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <span className="text-sm text-spe-grey whitespace-nowrap">
              <strong className="text-spe-ink font-semibold">{filtered.length}</strong>{' '}
              {filtered.length === 1 ? 'organisation' : 'organisations'}
            </span>

            {isFiltering && (
              <button
                onClick={() => { setSearch(''); setActiveSector(null); setActiveLetter(null) }}
                className="text-xs text-spe-blue hover:text-spe-deep font-medium transition-colors whitespace-nowrap"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Sector chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {sectors.map(sector => (
              <button
                key={sector.name}
                onClick={() => {
                  setActiveSector(activeSector === sector.name ? null : sector.name)
                  setActiveLetter(null)
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  activeSector === sector.name
                    ? 'bg-spe-blue text-white shadow-sm'
                    : 'bg-spe-cream/80 text-spe-muted hover:bg-spe-blue/10 hover:text-spe-deep'
                }`}
              >
                {sector.name}
                <span className={`text-[10px] ${
                  activeSector === sector.name ? 'text-white/70' : 'text-spe-grey/60'
                }`}>
                  {sector.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content with alphabet sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">
          {/* Alphabet sidebar — desktop only */}
          <nav className="hidden lg:flex flex-col items-center gap-0.5 sticky top-40 h-fit pt-2" aria-label="Jump to letter">
            {ALL_LETTERS.map(letter => {
              const hasOrgs = activeLetters.has(letter)
              const isActive = visibleLetter === letter && !isFiltering
              return (
                <button
                  key={letter}
                  onClick={() => hasOrgs && scrollToLetter(letter)}
                  disabled={!hasOrgs}
                  className={`w-8 h-7 flex items-center justify-center rounded text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-spe-blue text-white scale-110'
                      : hasOrgs
                        ? 'text-spe-ink hover:bg-spe-blue/10 hover:text-spe-blue'
                        : 'text-spe-divider cursor-default'
                  }`}
                >
                  {letter}
                </button>
              )
            })}
          </nav>

          {/* Directory listing */}
          <div className="flex-1 min-w-0">
            {grouped.length > 0 ? (
              <div className="space-y-10">
                {grouped.map(([letter, orgs]) => (
                  <div
                    key={letter}
                    ref={el => { sectionRefs.current[letter] = el }}
                    data-letter={letter}
                  >
                    {/* Letter heading */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-10 h-10 rounded-xl bg-spe-blue/10 flex items-center justify-center text-spe-blue font-serif font-bold text-lg">
                        {letter}
                      </span>
                      <div className="h-px flex-1 bg-spe-divider/30" />
                      <span className="text-xs text-spe-grey">{orgs.length}</span>
                    </div>

                    {/* Org grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1.5">
                      {orgs.map(org => (
                        <div
                          key={org.name}
                          className="flex items-center gap-2.5 py-2 px-3 rounded-lg hover:bg-spe-cream/60 transition-colors group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-spe-blue/30 group-hover:bg-spe-blue transition-colors flex-shrink-0" />
                          <span className="text-sm text-spe-ink truncate">{org.name}</span>
                          <span className="ml-auto text-[10px] text-spe-grey/50 hidden group-hover:inline-block whitespace-nowrap">
                            {org.sector}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <svg className="mx-auto h-16 w-16 text-spe-divider/60 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-spe-grey text-lg font-medium mb-1">No organisations found</p>
                <p className="text-spe-grey/70 text-sm">Try a different search term or clear filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="border-t border-spe-divider/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <p className="text-sm text-spe-muted max-w-xl mx-auto">
            This directory shows the organisations where our members work. For full member contact
            details, please{' '}
            <a href="mailto:admin@spe.org.uk" className="text-spe-blue hover:underline">
              contact the SPE office
            </a>
            .
          </p>
          <Link
            to="/membership"
            className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Membership
          </Link>
        </div>
      </div>
    </div>
  )
}
