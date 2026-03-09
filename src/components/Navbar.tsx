import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const megaMenus: Record<string, { label: string; to: string; desc?: string }[]> = {
  'About': [
    { label: 'About the SPE', to: '/about', desc: 'Our mission and history' },
    { label: 'Council & Officers', to: '/about/council', desc: 'Leadership team' },
    { label: 'Society Activities', to: '/about/society-activities', desc: 'What we do' },
    { label: 'Membership', to: '/membership', desc: 'Join & benefits' },
    { label: 'Careers & Development', to: '/careers', desc: 'CPD, courses & jobs' },
    { label: 'Advertise with SPE', to: '/advertise', desc: 'Sponsorship & advertising' },
    { label: 'Contact Us', to: '/contact', desc: 'Get in touch' },
  ],
  'Speakers': [
    { label: 'Speakers Hub', to: '/speakers', desc: 'All speaker content' },
    { label: 'Evening Talks', to: '/speakers/evening-talks', desc: '147 recorded talks' },
    { label: 'Conference Reports', to: '/speakers/conference-reports', desc: 'Annual conferences' },
    { label: 'Dinner Reviews', to: '/speakers/dinner-reviews', desc: 'Annual dinner speakers' },
  ],
  'Reading Room': [
    { label: 'Reading Room', to: '/reading-room', desc: 'All publications' },
    { label: 'Book Reviews', to: '/reading-room/book-reviews', desc: '386 reviews' },
    { label: 'Articles', to: '/reading-room/articles', desc: 'Economic analysis' },
    { label: 'Rybczynski Essays', to: '/reading-room/rybczynski-essays', desc: 'Prize-winning essays' },
    { label: 'Salary Surveys', to: '/reading-room/salary-surveys', desc: 'Members only' },
    { label: 'Members\u2019 Polls', to: '/reading-room/members-polls', desc: 'Members only' },
  ],
}

const navItems = [
  { to: '/events', label: 'Events' },
  { to: '/speakers', label: 'Speakers', hasMega: true },
  { to: '/podcasts', label: 'Podcasts' },
  { to: '/reading-room', label: 'Reading Room', hasMega: true },
  { to: '/news', label: 'News' },
  { to: '/blogs', label: 'Blog' },
  { to: '/about', label: 'About', hasMega: true },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeMega, setActiveMega] = useState<string | null>(null)
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setActiveMega(null)
  }, [location])

  const showMega = (label: string) => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current)
    setActiveMega(label)
  }
  const hideMega = () => {
    megaTimeout.current = setTimeout(() => setActiveMega(null), 150)
  }

  // Determine colors based on scroll state
  const isTransparent = isHome && !scrolled && !mobileOpen
  const navBg = isTransparent ? 'nav-glass' : 'nav-glass-scrolled'
  const textColor = isTransparent ? 'text-white' : 'text-spe-dark'
  const textMuted = isTransparent ? 'text-white/70' : 'text-spe-muted'
  const hoverBg = isTransparent ? 'hover:bg-white/10' : 'hover:bg-spe-bg'
  const activeBg = isTransparent ? 'bg-white/15 text-white' : 'bg-spe-blue/10 text-spe-blue'
  const logoFilter = isTransparent ? 'brightness-0 invert' : ''

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className={`transition-all duration-300 ${navBg}`} aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0" aria-label="SPE Home">
              <img src="/images/logo.webp" alt="SPE" width={242} height={36} className={`h-9 w-auto transition-all duration-300 ${logoFilter}`} />
              <div className="hidden sm:block">
                <span className={`font-serif text-lg font-bold tracking-wide transition-colors ${textColor}`}>
                  SPE
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navItems.map(item => (
                <div
                  key={item.to}
                  className="relative"
                  onMouseEnter={() => item.hasMega && showMega(item.label)}
                  onMouseLeave={() => item.hasMega && hideMega()}
                  onFocusCapture={() => item.hasMega && showMega(item.label)}
                  onBlurCapture={(e) => { if (item.hasMega && !e.currentTarget.contains(e.relatedTarget as Node)) setActiveMega(null) }}
                  onKeyDown={(e) => { if (item.hasMega && e.key === 'Escape') { setActiveMega(null); (e.currentTarget.querySelector('a') as HTMLElement)?.focus() } }}
                >
                  <NavLink
                    to={item.to}
                    aria-haspopup={item.hasMega ? 'true' : undefined}
                    aria-expanded={item.hasMega ? activeMega === item.label : undefined}
                    className={({ isActive }) =>
                      `px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                        isActive ? activeBg : `${textMuted} ${hoverBg} hover:${textColor}`
                      }`
                    }
                  >
                    {item.label}
                    {item.hasMega && (
                      <svg className={`w-3.5 h-3.5 transition-transform ${activeMega === item.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </NavLink>

                  {/* Mega menu dropdown */}
                  {item.hasMega && megaMenus[item.label] && (
                    <div
                      className={`absolute top-full left-0 pt-2 transition-all duration-200 ${
                        activeMega === item.label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
                      }`}
                      onMouseEnter={() => showMega(item.label)}
                      onMouseLeave={hideMega}
                    >
                      <div className="bg-white rounded-xl shadow-xl border border-spe-border/20 p-2 min-w-[260px]">
                        {megaMenus[item.label].map(sub => (
                          <Link
                            key={sub.to}
                            to={sub.to}
                            className="flex flex-col px-3.5 py-2.5 rounded-lg hover:bg-spe-bg transition-colors group"
                          >
                            <span className="text-sm font-medium text-spe-dark group-hover:text-spe-blue transition-colors">
                              {sub.label}
                            </span>
                            {sub.desc && (
                              <span className="text-xs text-spe-grey mt-0.5">{sub.desc}</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right section: Search + Join CTA */}
            <div className="flex items-center gap-2">
              {/* Search trigger */}
              <button
                onClick={() => document.dispatchEvent(new CustomEvent('toggle-search'))}
                className={`p-2.5 rounded-lg transition-colors focus-ring ${textMuted} ${hoverBg}`}
                aria-label="Search"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Join CTA */}
              <Link
                to="/membership"
                className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 btn-glow ${
                  isTransparent
                    ? 'bg-white text-spe-deep2 hover:bg-white/90 shadow-lg shadow-black/10'
                    : 'bg-spe-blue text-white hover:bg-spe-deep shadow-md shadow-spe-blue/20'
                }`}
              >
                Join SPE
              </Link>

              {/* Social links — desktop only */}
              <div className={`hidden xl:flex items-center gap-2.5 ml-2 pl-3 border-l ${isTransparent ? 'border-white/20' : 'border-spe-border/30'}`}>
                {[
                  { href: 'https://twitter.com/econ_SPE', label: 'Twitter', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                  { href: 'https://www.linkedin.com/company/society-of-professional-economists/', label: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                  { href: 'https://www.youtube.com/@econ_SPE', label: 'YouTube', icon: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
                ].map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`transition-colors ${textMuted} hover:${textColor}`}
                    aria-label={s.label}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={s.icon}/></svg>
                  </a>
                ))}
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2.5 rounded-lg transition-colors ${textMuted} ${hoverBg}`}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                {mobileOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white border-t border-spe-border/20 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-0.5">
              {navItems.map(item => (
                <div key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => !item.hasMega && setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? 'bg-spe-blue/10 text-spe-blue' : 'text-spe-dark hover:bg-spe-bg'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                  {/* Mobile sub-links */}
                  {item.hasMega && megaMenus[item.label] && (
                    <div className="pl-4 space-y-0.5 mb-1">
                      {megaMenus[item.label].map(sub => (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2 text-sm text-spe-muted hover:text-spe-blue hover:bg-spe-bg rounded-lg transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {/* Mobile utility links */}
              <div className="pt-3 mt-2 border-t border-spe-border/20 space-y-0.5">
                {[
                  { to: '/membership', label: 'Membership' },
                  { to: '/careers', label: 'Careers & CPD' },
                  { to: '/advertise', label: 'Advertise' },
                  { to: '/contact', label: 'Contact' },
                ].map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 text-sm text-spe-muted hover:text-spe-blue hover:bg-spe-bg rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="pt-3 pb-2 border-t border-spe-border/20 mt-2">
                <Link
                  to="/membership"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-spe-blue text-white rounded-lg text-sm font-semibold hover:bg-spe-deep transition-colors"
                >
                  Join SPE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
