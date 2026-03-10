import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  const sponsors = ['Consensus Economics', 'Oxford Economics', 'Haver Analytics']

  return (
    <footer className="bg-spe-ink text-white/70">
      {/* Newsletter CTA */}
      <div className="relative bg-gradient-to-r from-spe-ink via-spe-deep2 to-spe-ink overflow-hidden grain-overlay">
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-6 h-[2px] bg-spe-gold rounded-full" />
                <span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">Newsletter</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-white">Stay in the loop</h3>
              <p className="text-white/50 text-sm mt-1.5 max-w-md">Get the latest events, podcasts, and economic insights delivered to your inbox.</p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2 text-white">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">Thanks! You&rsquo;re subscribed.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex w-full max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  aria-label="Email address for newsletter"
                  autoComplete="email"
                  className="flex-1 px-4 py-3.5 bg-white/[0.06] border border-white/[0.12] rounded-l-xl text-base text-white placeholder:text-white/30 focus:outline-none focus:bg-white/[0.1] focus:border-white/30 transition-colors duration-300"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-white text-spe-ink text-sm font-semibold rounded-r-xl hover:bg-spe-cream transition-colors duration-300 flex-shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Sponsors marquee */}
      <div className="border-t border-white/[0.06] bg-spe-ink overflow-hidden">
        <div className="py-6">
          <p className="text-center text-white/40 mb-4 text-[10px] font-semibold uppercase tracking-[0.15em]">Our Sponsors</p>
          <div className="relative overflow-hidden">
            <div className="marquee-track">
              {[...sponsors, ...sponsors].map((s, i) => (
                <span key={`${s}-${i}`} className="text-sm font-medium text-white/50 hover:text-white/80 transition-colors duration-300 cursor-default mx-12 whitespace-nowrap flex-shrink-0">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="min-[480px]:col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <img src="/images/logo.webp" alt="SPE" width={215} height={32} className="h-8 w-auto brightness-0 invert" />
              <span className="font-serif text-lg font-bold text-white">SPE</span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-6">
              Advancing the profession of economics in the UK since 1953.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2.5">
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
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/40 hover:bg-white/[0.08] hover:text-white/80 transition-all duration-300"
                  aria-label={s.label}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={s.icon}/></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40 mb-5">Explore</h4>
            <ul className="space-y-1">
              {[
                { to: '/events', label: 'Events' },
                { to: '/speakers', label: 'Speakers' },
                { to: '/podcasts', label: 'Podcasts' },
                { to: '/reading-room', label: 'Reading Room' },
                { to: '/news', label: 'News' },
                { to: '/blogs', label: 'Blog' },
              ].map(l => (
                <li key={l.to}><Link to={l.to} className="text-sm text-white/50 hover:text-white transition-colors duration-200 inline-flex items-center min-h-[44px]">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Reading Room */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40 mb-5">Reading Room</h4>
            <ul className="space-y-1">
              {[
                { to: '/reading-room/book-reviews', label: 'Book Reviews' },
                { to: '/reading-room/articles', label: 'Articles' },
                { to: '/reading-room/rybczynski-essays', label: 'Rybczynski Essays' },
                { to: '/reading-room/salary-surveys', label: 'Salary Surveys' },
                { to: '/reading-room/members-polls', label: 'Members\u2019 Polls' },
              ].map(l => (
                <li key={l.to}><Link to={l.to} className="text-sm text-white/50 hover:text-white transition-colors duration-200 inline-flex items-center min-h-[44px]">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Society */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40 mb-5">Society</h4>
            <ul className="space-y-1">
              {[
                { to: '/about', label: 'About the SPE' },
                { to: '/about/council', label: 'Council & Officers' },
                { to: '/membership', label: 'Membership' },
                { to: '/careers', label: 'Careers' },
                { to: '/faqs', label: 'FAQs' },
                { to: '/site-policies', label: 'Policies' },
              ].map(l => (
                <li key={l.to}><Link to={l.to} className="text-sm text-white/50 hover:text-white transition-colors duration-200 inline-flex items-center min-h-[44px]">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40 mb-5">Contact</h4>
            <ul className="space-y-1">
              <li>
                <a href="mailto:info@spe.org.uk" className="text-sm text-white/50 hover:text-white transition-colors duration-200 inline-flex items-center min-h-[44px]">
                  info@spe.org.uk
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-white/50 hover:text-white transition-colors duration-200 inline-flex items-center min-h-[44px]">
                  Get in Touch
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="text-sm text-white/50 hover:text-white transition-colors duration-200 inline-flex items-center min-h-[44px]">
                  Advertise with SPE
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Society of Professional Economists. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Modernised by{' '}
            <a href="https://e17studio.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors duration-200">
              e17studio.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
