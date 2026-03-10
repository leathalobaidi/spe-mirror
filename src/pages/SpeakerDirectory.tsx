import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import Breadcrumbs from '../components/Breadcrumbs'
import { speakerDirectory } from '../utils/speakerDirectory'

const ROLE_COLORS: Record<string, string> = {
  Speaker: 'bg-spe-blue/10 text-spe-blue',
  Chair: 'bg-spe-copper/10 text-spe-copper',
  Guest: 'bg-spe-blue/10 text-spe-blue',
  Reviewer: 'bg-spe-burgundy/10 text-spe-burgundy',
  Author: 'bg-spe-deep/10 text-spe-deep',
  'Prize Winner': 'bg-spe-gold/15 text-spe-gold',
}

export default function SpeakerDirectory() {
  useSEO({
    title: 'Speaker & Contributor Directory',
    description: 'Browse economists and commentators who have spoken at, reviewed for, or contributed to SPE events and publications.',
    type: 'website',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Speaker & Contributor Directory',
        description: 'People who contribute to the Society of Professional Economists.',
        publisher: {
          '@type': 'Organization',
          name: 'Society of Professional Economists',
          url: 'https://www.spe.org.uk',
        },
      },
    ],
  })

  const [search, setSearch] = useState('')
  const [activeRole, setActiveRole] = useState<string | null>(null)

  const roles = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const s of speakerDirectory) {
      for (const r of s.roles) {
        counts[r] = (counts[r] || 0) + 1
      }
    }
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name, count }))
  }, [])

  const filtered = useMemo(() => {
    let result = speakerDirectory
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s => s.name.toLowerCase().includes(q))
    }
    if (activeRole) {
      result = result.filter(s => s.roles.includes(activeRole))
    }
    return result
  }, [search, activeRole])

  const isFiltering = !!search || !!activeRole

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
              { label: 'Speakers', to: '/speakers' },
              { label: 'Directory' },
            ]}
          />
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[2px] bg-spe-gold rounded-full" />
            <span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">People</span>
          </div>
          <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl mb-4">Speaker & Contributor Directory</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light leading-relaxed">
            <strong className="text-white font-medium">{speakerDirectory.length} economists and commentators</strong> who
            have spoken at events, reviewed books, or contributed to SPE publications.
          </p>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-spe-divider/30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-spe-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-spe-divider/40 bg-white text-sm text-spe-ink placeholder:text-spe-grey/60 focus:outline-none focus:ring-2 focus:ring-spe-blue/30 focus:border-spe-blue/50 transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-spe-grey hover:text-spe-ink transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>

            <span className="text-sm text-spe-grey whitespace-nowrap">
              <strong className="text-spe-ink font-semibold">{filtered.length}</strong> people
            </span>

            {isFiltering && (
              <button
                onClick={() => { setSearch(''); setActiveRole(null) }}
                className="text-xs text-spe-blue hover:text-spe-deep font-medium transition-colors whitespace-nowrap"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Role chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {roles.map(role => (
              <button
                key={role.name}
                onClick={() => setActiveRole(activeRole === role.name ? null : role.name)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  activeRole === role.name
                    ? 'bg-spe-blue text-white shadow-sm'
                    : 'bg-spe-cream/80 text-spe-muted hover:bg-spe-blue/10 hover:text-spe-deep'
                }`}
              >
                {role.name}
                <span className={`text-[10px] ${activeRole === role.name ? 'text-white/70' : 'text-spe-grey/60'}`}>
                  {role.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Directory grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(speaker => (
              <Link
                key={speaker.slug}
                to={`/speakers/directory/${speaker.slug}`}
                className="group rounded-xl border border-spe-divider/20 bg-white p-5 hover:border-spe-blue/30 hover:shadow-sm transition-all"
              >
                <h3 className="font-serif font-bold text-spe-ink group-hover:text-spe-blue transition-colors">
                  {speaker.name}
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {speaker.roles.map(role => (
                    <span
                      key={role}
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${ROLE_COLORS[role] || 'bg-spe-cream text-spe-muted'}`}
                    >
                      {role}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-spe-muted mt-3">
                  {speaker.appearances.length} appearance{speaker.appearances.length !== 1 ? 's' : ''} across{' '}
                  {speaker.contentTypes.length} content type{speaker.contentTypes.length !== 1 ? 's' : ''}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="mx-auto h-16 w-16 text-spe-divider/60 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-spe-grey text-lg font-medium mb-1">No matches found</p>
            <p className="text-spe-grey/70 text-sm">Try a different name or clear filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
