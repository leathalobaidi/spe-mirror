import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import HeroVideo from '../components/HeroVideo'
import ContentCard from '../components/ContentCard'
import BookCover from '../components/BookCover'
import SectionHeading from '../components/SectionHeading'
import { useReveal } from '../hooks/useReveal'
import { useSEO } from '../hooks/useSEO'

// Data loaded lazily after first paint — reduces initial bundle by ~3.7 MB
type PodcastItem = { slug: string; title: string; date: string; category: string; body: string; images?: string[] }
type EventItem = { slug: string; title: string; date: string; body: string; images?: string[] }
type BookItem = { slug: string; title: string; coverImage?: string; author?: string; reviewer?: string }
type NewsItem = { slug: string; title: string; date: string; body: string; bannerImage?: string }
type TalkItem = { slug: string; title: string; date: string; body: string; images?: string[] }
type ConferenceItem = { slug: string; title: string; date?: string; body: string; images?: string[] }
type DinnerItem = { slug: string; title: string; body: string; images?: string[]; slug_match?: string }
type PresidentItem = { slug: string; name: string; role: string; body?: string; images?: string[] }

function AnimatedStat({ end, suffix = '', label }: { end: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true
        const duration = 2000
        const steps = 60
        const increment = end / steps
        let current = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= end) {
            setCount(end)
            clearInterval(timer)
          } else {
            setCount(Math.floor(current))
          }
        }, duration / steps)
      }
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [end])

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-white tracking-tight">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs uppercase tracking-[0.15em] text-white/50 mt-2.5 font-semibold">{label}</div>
    </div>
  )
}

/** Quick-navigation cards for the "Explore the SPE" section */
const makeExploreCards = (talkCount: number) => [
  {
    to: '/speakers/evening-talks',
    label: 'Evening Talks',
    desc: `${talkCount || 147} recorded talks from leading economists`,
    icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
  },
  {
    to: '/reading-room/articles',
    label: 'Articles & Analysis',
    desc: 'Research papers and economic commentary',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    to: '/reading-room/rybczynski-essays',
    label: 'Rybczynski Prize',
    desc: 'Award-winning essays from young economists',
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  },
  {
    to: '/careers',
    label: 'Careers & CPD',
    desc: 'Professional development and job opportunities',
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
] as const

export default function Home() {
  useSEO({
    description: 'The Society of Professional Economists — the UK\'s leading forum for economists since 1953, offering events, podcasts, book reviews and career resources.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Society of Professional Economists',
      alternateName: 'SPE',
      url: 'https://www.spe.org.uk',
      logo: 'https://www.spe.org.uk/images/logo-colour.png',
      foundingDate: '1953',
      description: 'The UK\'s leading forum for professional economists.',
    },
  })

  // ── Lazy-loaded data (deferred to after first paint) ──────────────
  const [latestPodcasts, setLatestPodcasts] = useState<PodcastItem[]>([])
  const [latestEvents, setLatestEvents] = useState<EventItem[]>([])
  const [latestBooks, setLatestBooks] = useState<BookItem[]>([])
  const [latestNews, setLatestNews] = useState<NewsItem[]>([])
  const [latestTalks, setLatestTalks] = useState<TalkItem[]>([])
  const [latestConferences, setLatestConferences] = useState<ConferenceItem[]>([])
  const [latestDinners, setLatestDinners] = useState<DinnerItem[]>([])
  const [president, setPresident] = useState<PresidentItem | undefined>()
  const [vicePresidents, setVicePresidents] = useState<PresidentItem[]>([])
  const [talkCount, setTalkCount] = useState(147) // fallback count

  useEffect(() => {
    // Load all data in parallel after first paint
    Promise.all([
      import('../data/podcasts.json'),
      import('../data/events.json'),
      import('../data/book-reviews.json'),
      import('../data/news.json'),
      import('../data/evening-talks.json'),
      import('../data/conference-reports.json'),
      import('../data/dinner-reviews.json'),
      import('../data/presidents.json'),
    ]).then(([podcasts, events, books, news, talks, conferences, dinners, presidents]) => {
      setLatestPodcasts(podcasts.default.slice(0, 3))
      setLatestEvents(events.default.slice(0, 4))
      setLatestBooks(books.default.slice(0, 6))
      setLatestNews(news.default.slice(0, 4))
      setLatestTalks(talks.default.slice(0, 3))
      setTalkCount(talks.default.length)
      setLatestConferences(conferences.default.slice(1, 4).reverse())

      const sortedDinners = [...dinners.default]
        .sort((a: DinnerItem, b: DinnerItem) => {
          const yearA = parseInt(a.slug.match(/\d{4}/)?.[0] || '0')
          const yearB = parseInt(b.slug.match(/\d{4}/)?.[0] || '0')
          return yearB - yearA
        })
        .slice(0, 3)
      setLatestDinners(sortedDinners)

      setPresident(presidents.default.find((p: PresidentItem) => p.role === 'President'))
      setVicePresidents(presidents.default.filter((p: PresidentItem) => p.role !== 'President'))
    })
  }, [])

  const podcastRef = useReveal()
  const eventsRef = useReveal()
  const booksRef = useReveal()
  const newsRef = useReveal()
  const talksRef = useReveal()
  const exploreRef = useReveal()
  const conferenceRef = useReveal()
  const dinnerRef = useReveal()
  const leadershipRef = useReveal()

  const exploreCards = makeExploreCards(talkCount)

  return (
    <div>
      {/* Hero — George Buckley intro video */}
      <HeroVideo
        videoId="628893749"
        title="Society of Professional Economists"
        subtitle="Advancing the profession of economics in the UK through events, publications, and professional development since 1953."
      />

      {/* Animated Stats Band */}
      <section className="relative bg-gradient-to-r from-spe-ink via-spe-deep2 to-spe-ink overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative">
          <div className="stats-grid">
            <AnimatedStat end={1953} label="Established" />
            <AnimatedStat end={250} suffix="+" label="Events Hosted" />
            <AnimatedStat end={386} suffix="+" label="Book Reviews" />
            <AnimatedStat end={226} suffix="+" label="Podcast Episodes" />
          </div>
        </div>
      </section>

      {/* Latest Podcasts & Talks */}
      <section ref={podcastRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: 'var(--section-padding-y)', paddingBottom: 'var(--section-padding-y)' }}>
        <div className="reveal">
          <SectionHeading
            title="Latest Podcasts & Talks"
            subtitle="Listen & Watch"
            linkTo="/podcasts"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 reveal-stagger">
          {latestPodcasts.map(item => (
            <div key={item.slug} className="reveal h-full">
              <ContentCard
                to={`/podcasts/${item.slug.split('/').pop()}`}
                title={item.title}
                date={item.date}
                category={item.category}
                excerpt={item.body}
                image={item.images?.[0]}
                size="md"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Evening Talks */}
      <section ref={talksRef} className="bg-spe-bg border-y border-spe-divider/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: 'var(--section-padding-y)', paddingBottom: 'var(--section-padding-y)' }}>
          <div className="reveal">
            <SectionHeading
              title="Evening Speaker Series"
              subtitle="Featured Talks"
              linkTo="/speakers/evening-talks"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 reveal-stagger">
            {latestTalks.map(item => (
              <div key={item.slug} className="reveal h-full">
                <ContentCard
                  to={`/speakers/evening-talks/${item.slug}`}
                  title={item.title}
                  date={item.date}
                  category="speaker-series"
                  excerpt={item.body}
                  image={item.images?.[0]}
                  size="md"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming & Recent Events */}
      <section ref={eventsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: 'var(--section-padding-y)', paddingBottom: 'var(--section-padding-y)' }}>
          <div className="reveal">
            <SectionHeading
              title="Events"
              subtitle="What's On"
              linkTo="/events"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal-stagger">
            {latestEvents.map((item, i) => (
              <div key={`${item.slug}-${i}`} className="reveal h-full">
                <ContentCard
                  to={`/events/${item.slug.split('/').pop()}`}
                  title={item.title}
                  date={item.date}
                  category="event"
                  excerpt={item.body}
                  image={item.images?.[0]}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conference Highlights */}
      <section ref={conferenceRef} className="bg-spe-bg border-y border-spe-divider/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: 'var(--section-padding-y)', paddingBottom: 'var(--section-padding-y)' }}>
          <div className="reveal">
            <SectionHeading
              title="Conference Highlights"
              subtitle="Annual Conference"
              linkTo="/speakers/conference-reports"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 reveal-stagger">
            {latestConferences.map(item => (
              <div key={item.slug} className="reveal h-full">
                <ContentCard
                  to={`/speakers/conference-reports/${item.slug}`}
                  title={item.title}
                  date={item.date}
                  category="conference"
                  excerpt={item.body}
                  image={item.images?.find(img => !img.includes('vimeocdn'))?.replace('/1200x0/', '/800x0/')}
                  size="md"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership CTA */}
      <section className="relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 bg-gradient-to-br from-spe-deep2 via-spe-deep to-spe-ink" />
        <div className="absolute inset-0 opacity-[0.04] hero-pattern" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-[2px] bg-spe-gold rounded-full" />
            <span className="text-spe-gold text-xs font-semibold uppercase tracking-[0.15em]">Become a Member</span>
            <span className="w-8 h-[2px] bg-spe-gold rounded-full" />
          </div>
          <h2 className="editorial-heading text-white mb-5" style={{ fontSize: 'clamp(1.75rem, 3vw + 0.5rem, 2.75rem)' }}>Join the UK&rsquo;s leading economics society</h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed text-lg">
            Access exclusive salary surveys, members&rsquo; polls, professional networking events, and contribute to advancing the profession of economics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/membership"
              className="px-8 py-3.5 bg-white text-spe-ink font-semibold rounded-xl hover:bg-spe-cream transition-all shadow-lg shadow-black/20 text-sm btn-glow"
            >
              Explore Membership
            </Link>
            <Link
              to="/events"
              className="px-8 py-3.5 bg-white/8 text-white/80 font-medium rounded-xl hover:bg-white/15 transition-all border border-white/15 text-sm"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>

      {/* Our Leadership */}
      <section ref={leadershipRef} className="bg-gradient-to-b from-spe-bg to-spe-cream border-y border-spe-divider/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: 'var(--section-padding-y)', paddingBottom: 'var(--section-padding-y)' }}>
          <div className="reveal">
            <SectionHeading
              title="Our Leadership"
              subtitle="President & Vice Presidents"
              linkTo="/about/council"
            />
          </div>

          {/* President — Featured */}
          {president && (
            <div className="reveal mb-12">
              <Link
                to={`/about/council/${president.slug}`}
                className="group flex flex-col md:flex-row items-center gap-8 rounded-2xl bg-white border border-spe-divider p-8 hover:shadow-xl hover:border-spe-blue/20 transition-all duration-500"
              >
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden ring-4 ring-spe-paper flex-shrink-0">
                  <img
                    src={president.images?.[0]}
                    alt={president.name}
                    width={176}
                    height={176}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    loading="lazy"
                  />
                </div>
                <div className="text-center md:text-left flex-1">
                  <span className="section-label mb-3 inline-flex">
                    {president.role}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-spe-ink group-hover:text-spe-blue transition-colors duration-300 mb-3">
                    {president.name}
                  </h3>
                  <p className="text-spe-muted leading-relaxed max-w-xl line-clamp-3">
                    {president.body?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 280)}...
                  </p>
                  <span className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-spe-blue group-hover:gap-3 transition-all duration-300">
                    View full profile
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          )}

          {/* Vice Presidents */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 reveal-stagger">
            {vicePresidents.map(vp => (
              <div key={vp.slug} className="reveal h-full">
                <Link
                  to={`/about/council/${vp.slug}`}
                  className="group flex flex-col items-center text-center rounded-2xl bg-white border border-spe-divider p-6 hover:shadow-lg hover:border-spe-blue/20 transition-all duration-500 h-full"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden ring-3 ring-spe-paper mb-4 flex-shrink-0">
                    <img
                      src={vp.images?.[0]}
                      alt={vp.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-spe-gold mb-2">
                    {vp.role}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-spe-ink group-hover:text-spe-blue transition-colors duration-300 mb-2">
                    {vp.name}
                  </h3>
                  <p className="text-sm text-spe-muted leading-relaxed line-clamp-3 flex-1">
                    {vp.body?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160)}...
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-spe-blue group-hover:gap-2 transition-all duration-300">
                    Profile
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Reviews — Magazine Grid */}
      <section ref={booksRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: 'var(--section-padding-y)', paddingBottom: 'var(--section-padding-y)' }}>
        <div className="reveal">
          <SectionHeading
            title="From the Reading Room"
            subtitle="Book Reviews"
            linkTo="/reading-room/book-reviews"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 reveal-stagger">
          {latestBooks.map(item => (
            <div key={item.slug} className="reveal h-full">
              <BookCover
                to={`/reading-room/book-reviews/${item.slug}`}
                title={item.title}
                coverImage={item.coverImage || '/images/placeholder-book.svg'}
                author={item.author}
                reviewer={item.reviewer}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Annual Dinner — Elegant Dark Section */}
      <section ref={dinnerRef} className="relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 bg-gradient-to-br from-spe-ink via-[#1a1a2e] to-spe-ink" />
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: 'var(--section-padding-y)', paddingBottom: 'var(--section-padding-y)' }}>
          <div className="reveal">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-[2px] bg-spe-gold/60 rounded-full" />
              <span className="text-spe-gold/70 text-xs font-semibold uppercase tracking-[0.15em]">Gala Events</span>
            </div>
            <h2 className="editorial-heading text-white mb-3" style={{ fontSize: 'clamp(1.75rem, 3vw + 0.25rem, 2.5rem)' }}>Annual Dinner</h2>
            <p className="text-white/45 max-w-2xl mb-10 leading-relaxed">
              Our flagship black-tie event brings together leading economists, policymakers, and industry leaders for an evening of distinguished speakers and networking.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 reveal-stagger">
            {latestDinners.map(item => {
              const heroImage = item.images?.[0]?.replace('/1200x0/', '/800x0/')
              return (
                <div key={item.slug} className="reveal h-full">
                  <Link
                    to={`/speakers/dinner-reviews/${item.slug}`}
                    className="group block rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-hidden hover:bg-white/[0.08] hover:border-spe-gold/30 transition-all duration-500 h-full"
                  >
                    {heroImage && (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={heroImage}
                          alt={item.title}
                          width={500}
                          height={375}
                          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-lg font-serif font-bold text-white group-hover:text-spe-gold/90 transition-colors duration-300 mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-white/40 line-clamp-3 leading-relaxed">
                        {item.body?.replace(/<[^>]*>/g, '').slice(0, 140)}...
                      </p>
                      <span className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-spe-gold/80 group-hover:gap-3 transition-all duration-300">
                        Read more
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-12 reveal">
            <Link
              to="/speakers/dinner-reviews"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-spe-gold/10 text-spe-gold/80 font-semibold rounded-xl hover:bg-spe-gold/20 transition-all duration-300 border border-spe-gold/20 text-sm"
            >
              View all dinner reviews
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Explore the SPE — Quick Navigation */}
      <section ref={exploreRef} className="bg-spe-bg border-y border-spe-divider/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: 'var(--section-padding-y)', paddingBottom: 'var(--section-padding-y)' }}>
          <div className="reveal">
            <SectionHeading
              title="Explore the SPE"
              subtitle="Discover More"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal-stagger">
            {exploreCards.map(card => (
              <div key={card.to} className="reveal h-full">
                <Link
                  to={card.to}
                  className="group block rounded-2xl bg-white border border-spe-divider p-6 hover:shadow-lg hover:border-spe-blue/25 transition-all duration-500 h-full"
                >
                  <div className="w-11 h-11 rounded-xl bg-spe-blue/8 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                    </svg>
                  </div>
                  <h3 className="text-base font-serif font-bold text-spe-ink mb-2 group-hover:text-spe-blue transition-colors duration-300">
                    {card.label}
                  </h3>
                  <p className="text-sm text-spe-muted leading-relaxed">{card.desc}</p>
                  <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-spe-blue group-hover:gap-2.5 transition-all duration-300">
                    Explore
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent News */}
      <section ref={newsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: 'var(--section-padding-y)', paddingBottom: 'var(--section-padding-y)' }}>
          <div className="reveal">
            <SectionHeading
              title="News"
              subtitle="Latest Updates"
              linkTo="/news"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal-stagger">
            {latestNews.map(item => (
              <div key={item.slug} className="reveal h-full">
                <ContentCard
                  to={`/news/${item.slug}`}
                  title={item.title}
                  date={item.date}
                  category="news"
                  excerpt={item.body}
                  image={item.bannerImage}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
