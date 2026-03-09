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
      <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-white/60 mt-2 font-medium">{label}</div>
    </div>
  )
}

/** Quick-navigation cards for the "Explore the SPE" section */
const makeExploreCards = (talkCount: number) => [
  {
    to: '/speakers/evening-talks',
    label: 'Evening Talks',
    desc: `${talkCount || 147} recorded talks from leading economists`,
    color: 'indigo',
    icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
  },
  {
    to: '/reading-room/articles',
    label: 'Articles & Analysis',
    desc: 'Research papers and economic commentary',
    color: 'sky',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    to: '/reading-room/rybczynski-essays',
    label: 'Rybczynski Prize',
    desc: 'Award-winning essays from young economists',
    color: 'amber',
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  },
  {
    to: '/careers',
    label: 'Careers & CPD',
    desc: 'Professional development and job opportunities',
    color: 'emerald',
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
] as const

const colorMap: Record<string, { bg: string; border: string; iconBg: string; iconColor: string; hoverText: string; linkColor: string }> = {
  indigo:  { bg: 'from-indigo-50 to-indigo-100/50',  border: 'border-indigo-200/30',  iconBg: 'bg-indigo-100',  iconColor: 'text-indigo-600',  hoverText: 'group-hover:text-indigo-700',  linkColor: 'text-indigo-600' },
  sky:     { bg: 'from-sky-50 to-sky-100/50',        border: 'border-sky-200/30',      iconBg: 'bg-sky-100',     iconColor: 'text-sky-600',     hoverText: 'group-hover:text-sky-700',     linkColor: 'text-sky-600' },
  amber:   { bg: 'from-amber-50 to-amber-100/50',    border: 'border-amber-200/30',    iconBg: 'bg-amber-100',   iconColor: 'text-amber-600',   hoverText: 'group-hover:text-amber-700',   linkColor: 'text-amber-600' },
  emerald: { bg: 'from-emerald-50 to-emerald-100/50', border: 'border-emerald-200/30', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', hoverText: 'group-hover:text-emerald-700', linkColor: 'text-emerald-600' },
}

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
      <section className="bg-gradient-to-r from-spe-deep2 via-spe-deep to-spe-deep2 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="stats-grid">
            <AnimatedStat end={1953} label="Established" />
            <AnimatedStat end={250} suffix="+" label="Events Hosted" />
            <AnimatedStat end={386} suffix="+" label="Book Reviews" />
            <AnimatedStat end={226} suffix="+" label="Podcast Episodes" />
          </div>
        </div>
      </section>

      {/* Latest Podcasts & Talks */}
      <section ref={podcastRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="reveal">
          <SectionHeading
            title="Latest Podcasts & Talks"
            subtitle="Listen & Watch"
            linkTo="/podcasts"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-stagger">
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
      <section ref={talksRef} className="bg-spe-bg/50 border-y border-spe-border/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="reveal">
            <SectionHeading
              title="Evening Speaker Series"
              subtitle="Featured Talks"
              linkTo="/speakers/evening-talks"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-stagger">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="reveal">
            <SectionHeading
              title="Events"
              subtitle="What's On"
              linkTo="/events"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 reveal-stagger">
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
      <section ref={conferenceRef} className="bg-spe-bg/50 border-y border-spe-border/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="reveal">
            <SectionHeading
              title="Conference Highlights"
              subtitle="Annual Conference"
              linkTo="/speakers/conference-reports"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-stagger">
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-spe-blue via-spe-deep to-spe-deep2" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <p className="editorial-subheading text-white/50 mb-3">Become a Member</p>
          <h2 className="editorial-heading text-3xl sm:text-4xl text-white mb-4">Join the UK&rsquo;s leading economics society</h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
            Access exclusive salary surveys, members&rsquo; polls, professional networking events, and contribute to advancing the profession of economics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/membership"
              className="px-8 py-3.5 bg-white text-spe-deep2 font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg shadow-black/10 text-sm btn-glow"
            >
              Explore Membership
            </Link>
            <Link
              to="/events"
              className="px-8 py-3.5 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all border border-white/20 text-sm"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>

      {/* Our Leadership */}
      <section ref={leadershipRef} className="bg-gradient-to-b from-spe-bg to-white border-y border-spe-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
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
                className="group flex flex-col md:flex-row items-center gap-8 rounded-2xl bg-white border border-spe-border/60 p-8 hover:shadow-xl hover:border-spe-blue/20 transition-all duration-300"
              >
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden ring-4 ring-spe-blue/10 flex-shrink-0">
                  <img
                    src={president.images?.[0]}
                    alt={president.name}
                    width={176}
                    height={176}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="text-center md:text-left flex-1">
                  <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-spe-blue bg-spe-blue/5 rounded-full mb-3">
                    {president.role}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-spe-dark group-hover:text-spe-blue transition-colors mb-3">
                    {president.name}
                  </h3>
                  <p className="text-spe-muted leading-relaxed max-w-xl line-clamp-3">
                    {president.body?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 280)}...
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-spe-blue group-hover:gap-2.5 transition-all">
                    View full profile
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                  className="group flex flex-col items-center text-center rounded-2xl bg-white border border-spe-border/60 p-6 hover:shadow-lg hover:border-spe-blue/20 transition-all duration-300 h-full"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden ring-3 ring-spe-bg mb-4 flex-shrink-0">
                    <img
                      src={vp.images?.[0]}
                      alt={vp.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-spe-muted/70 mb-1.5">
                    {vp.role}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-spe-dark group-hover:text-spe-blue transition-colors mb-2">
                    {vp.name}
                  </h3>
                  <p className="text-sm text-spe-muted leading-relaxed line-clamp-3 flex-1">
                    {vp.body?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160)}...
                  </p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-spe-blue group-hover:gap-1.5 transition-all">
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
      <section ref={booksRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
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
      <section ref={dinnerRef} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zMCAzMGgxdjFoLTF6IiBmaWxsPSJyZ2JhKDI1NSwyMTUsMCwwLjAzKSIvPjwvc3ZnPg==')] opacity-60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="reveal">
            <p className="editorial-subheading text-amber-400/70 mb-2">Gala Events</p>
            <h2 className="editorial-heading text-3xl sm:text-4xl text-white mb-3">Annual Dinner</h2>
            <p className="text-white/50 max-w-2xl mb-10 leading-relaxed">
              Our flagship black-tie event brings together leading economists, policymakers, and industry leaders for an evening of distinguished speakers and networking.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-stagger">
            {latestDinners.map(item => {
              const heroImage = item.images?.[0]?.replace('/1200x0/', '/800x0/')
              return (
                <div key={item.slug} className="reveal h-full">
                  <Link
                    to={`/speakers/dinner-reviews/${item.slug}`}
                    className="group block rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300 h-full"
                  >
                    {heroImage && (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={heroImage}
                          alt={item.title}
                          width={500}
                          height={375}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-200 transition-colors mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-white/50 line-clamp-3 leading-relaxed">
                        {item.body?.replace(/<[^>]*>/g, '').slice(0, 140)}...
                      </p>
                      <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-amber-400 group-hover:gap-2.5 transition-all">
                        Read more
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-10 reveal">
            <Link
              to="/speakers/dinner-reviews"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 text-amber-300 font-medium rounded-xl hover:bg-amber-500/20 transition-all border border-amber-500/20 text-sm"
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
      <section ref={exploreRef} className="bg-spe-bg/50 border-y border-spe-border/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="reveal">
            <SectionHeading
              title="Explore the SPE"
              subtitle="Discover More"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal-stagger">
            {exploreCards.map(card => {
              const c = colorMap[card.color]
              return (
                <div key={card.to} className="reveal h-full">
                  <Link
                    to={card.to}
                    className={`group block rounded-2xl bg-gradient-to-br ${c.bg} border ${c.border} p-6 hover:shadow-lg transition-all duration-300 h-full`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center mb-3`}>
                      <svg className={`w-5 h-5 ${c.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                      </svg>
                    </div>
                    <h3 className={`text-base font-serif font-bold text-spe-dark mb-1.5 ${c.hoverText} transition-colors`}>
                      {card.label}
                    </h3>
                    <p className="text-sm text-spe-muted leading-relaxed">{card.desc}</p>
                    <span className={`inline-flex items-center gap-1 mt-3 text-sm font-medium ${c.linkColor} group-hover:gap-1.5 transition-all`}>
                      Explore
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Recent News */}
      <section ref={newsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="reveal">
            <SectionHeading
              title="News"
              subtitle="Latest Updates"
              linkTo="/news"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 reveal-stagger">
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
