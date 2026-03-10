import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import BookCover from '../components/BookCover'
import bookReviewsData from '../data/book-reviews.json'
import articlesData from '../data/articles.json'
import rybEssaysData from '../data/ryb-essays.json'

export default function ReadingRoom() {
  useSEO({
    title: 'Reading Room',
    description: 'The SPE Reading Room: articles, book reviews, essays, and conference reports from economists.',
    type: 'website',
  })
  const latestBooks = bookReviewsData.slice(0, 12)

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep text-white relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <div className="inline-flex items-center gap-2 mb-3"><span className="w-6 h-[2px] bg-spe-gold rounded-full" /><span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">Explore</span></div>
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">Reading Room</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light">
            Book reviews, prize-winning essays, articles, and salary survey reports from the SPE community.
          </p>
        </div>
      </div>

      {/* Navigation cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-16">
          {/* Book Reviews */}
          <Link
            to="/reading-room/book-reviews"
            className="group rounded-2xl border border-spe-divider/30 bg-white p-7 hover:shadow-lg hover:border-spe-gold/30 transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-spe-cream flex items-center justify-center mb-4 group-hover:bg-spe-gold/10 transition-colors">
              <svg className="w-5 h-5 text-spe-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-lg font-serif font-bold text-spe-ink mb-1.5 group-hover:text-spe-blue transition-colors">
              Book Reviews
            </h2>
            <p className="text-xs text-spe-muted leading-relaxed">
              {bookReviewsData.length} expert reviews of economics and finance books.
            </p>
            <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-spe-blue group-hover:gap-2 transition-all">
              Browse
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>

          {/* Articles */}
          <Link
            to="/reading-room/articles"
            className="group rounded-2xl border border-spe-divider/30 bg-white p-7 hover:shadow-lg hover:border-spe-gold/30 transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-spe-cream flex items-center justify-center mb-4 group-hover:bg-spe-gold/10 transition-colors">
              <svg className="w-5 h-5 text-spe-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-serif font-bold text-spe-ink mb-1.5 group-hover:text-spe-blue transition-colors">
              Articles
            </h2>
            <p className="text-xs text-spe-muted leading-relaxed">
              {articlesData.length} contributions on economics and policy.
            </p>
            <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-spe-blue group-hover:gap-2 transition-all">
              Browse
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>

          {/* Rybczynski Essays */}
          <Link
            to="/reading-room/rybczynski-essays"
            className="group rounded-2xl border border-spe-divider/30 bg-white p-7 hover:shadow-lg hover:border-spe-gold/30 transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-spe-cream flex items-center justify-center mb-4 group-hover:bg-spe-gold/10 transition-colors">
              <svg className="w-5 h-5 text-spe-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h2 className="text-lg font-serif font-bold text-spe-ink mb-1.5 group-hover:text-spe-blue transition-colors">
              Rybczynski Essays
            </h2>
            <p className="text-xs text-spe-muted leading-relaxed">
              {rybEssaysData.length} prize-winning essays from the annual competition.
            </p>
            <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-spe-blue group-hover:gap-2 transition-all">
              Browse
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>

          {/* Rybczynski Prize Timeline */}
          <Link
            to="/reading-room/rybczynski-prize"
            className="group rounded-2xl border border-spe-divider/30 bg-white p-7 hover:shadow-lg hover:border-spe-gold/30 transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-spe-cream flex items-center justify-center mb-4 group-hover:bg-spe-gold/10 transition-colors">
              <svg className="w-5 h-5 text-spe-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-serif font-bold text-spe-ink mb-1.5 group-hover:text-spe-blue transition-colors">
              Prize Timeline
            </h2>
            <p className="text-xs text-spe-muted leading-relaxed">
              All Rybczynski Prize winners chronologically, with links to dinners and news.
            </p>
            <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-spe-blue group-hover:gap-2 transition-all">
              View timeline
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>

          {/* Salary Surveys */}
          <Link
            to="/reading-room/salary-surveys"
            className="group relative rounded-2xl border border-spe-divider/30 bg-white p-7 hover:shadow-lg hover:border-spe-gold/30 transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-spe-cream flex items-center justify-center mb-4 group-hover:bg-spe-gold/10 transition-colors">
              <svg className="w-5 h-5 text-spe-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-lg font-serif font-bold text-spe-ink mb-1.5 group-hover:text-spe-blue transition-colors">
              Salary Surveys
            </h2>
            <p className="text-xs text-spe-muted leading-relaxed">
              20 years of compensation benchmarking data.
            </p>
            <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-spe-blue group-hover:gap-2 transition-all">
              View
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>

          {/* Members' Polls */}
          <Link
            to="/reading-room/members-polls"
            className="group relative rounded-2xl border border-spe-divider/30 bg-white p-7 hover:shadow-lg hover:border-spe-gold/30 transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-spe-cream flex items-center justify-center mb-4 group-hover:bg-spe-gold/10 transition-colors">
              <svg className="w-5 h-5 text-spe-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-lg font-serif font-bold text-spe-ink mb-1.5 group-hover:text-spe-blue transition-colors">
              Members' Polls
            </h2>
            <p className="text-xs text-spe-muted leading-relaxed">
              Survey results on fiscal policy, AI, and more.
            </p>
            <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-spe-blue group-hover:gap-2 transition-all">
              View
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Book Reviews Editor contact */}
        <div className="mb-12 rounded-2xl border border-spe-divider/30 bg-white p-7">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-spe-cream flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-spe-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif font-bold text-spe-ink mb-1">For Books and Reviews</h3>
              <p className="text-sm text-spe-muted leading-relaxed mb-2">
                Articles reflect the authors' views which are not necessarily shared by the Society or the Editor. The Editor welcomes comments, ideas and articles on a wide range of applied economics topics.
              </p>
              <p className="text-sm text-spe-ink font-medium">Ian Harwood</p>
              <p className="text-xs text-spe-muted mb-2">Book Reviews Editor, The Society of Professional Economists</p>
              <a
                href="mailto:harwoodfive@btinternet.com"
                className="text-sm font-medium text-spe-blue hover:underline"
              >
                harwoodfive@btinternet.com →
              </a>
            </div>
          </div>
        </div>

        {/* Latest book reviews preview */}
        <div className="border-t border-spe-divider/20 pt-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="section-label">Latest</p>
              <h2 className="editorial-heading text-2xl sm:text-3xl text-spe-ink">Recent Book Reviews</h2>
            </div>
            <Link
              to="/reading-room/book-reviews"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors group"
            >
              View all {bookReviewsData.length} reviews
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {latestBooks.map(book => (
              <BookCover
                key={book.slug}
                to={`/reading-room/book-reviews/${book.slug}`}
                title={book.title}
                coverImage={book.coverImage || '/images/placeholder-book.svg'}
                author={book.author}
                reviewer={book.reviewer}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
