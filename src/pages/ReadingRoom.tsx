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
      <div className="bg-gradient-to-br from-spe-deep2 via-spe-deep to-spe-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="editorial-subheading text-spe-light mb-3">Explore</p>
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
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/50 border border-rose-200/30 p-8 hover:shadow-lg transition-all duration-300"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-xl font-serif font-bold text-spe-dark mb-2 group-hover:text-rose-700 transition-colors">
                Book Reviews
              </h2>
              <p className="text-sm text-spe-muted leading-relaxed">
                {bookReviewsData.length} expert reviews of the latest economics and finance books.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-rose-600 group-hover:gap-2 transition-all">
                Browse reviews
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Articles */}
          <Link
            to="/reading-room/articles"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100/50 border border-sky-200/30 p-8 hover:shadow-lg transition-all duration-300"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-serif font-bold text-spe-dark mb-2 group-hover:text-sky-700 transition-colors">
                Articles
              </h2>
              <p className="text-sm text-spe-muted leading-relaxed">
                {articlesData.length} contributions from SPE members on economics and policy.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-sky-600 group-hover:gap-2 transition-all">
                Browse articles
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Rybczynski Essays */}
          <Link
            to="/reading-room/rybczynski-essays"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/30 p-8 hover:shadow-lg transition-all duration-300"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-serif font-bold text-spe-dark mb-2 group-hover:text-amber-700 transition-colors">
                Rybczynski Essays
              </h2>
              <p className="text-sm text-spe-muted leading-relaxed">
                {rybEssaysData.length} prize-winning essays from the annual Rybczynski competition.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-amber-600 group-hover:gap-2 transition-all">
                Browse essays
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Salary Surveys — members only */}
          <Link
            to="/reading-room/salary-surveys"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-200/30 p-8 hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 bg-teal-100 px-2 py-1 rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Members
              </span>
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-serif font-bold text-spe-dark mb-2 group-hover:text-teal-700 transition-colors">
                Salary Surveys
              </h2>
              <p className="text-sm text-spe-muted leading-relaxed">
                20 years of annual compensation benchmarking data for professional economists.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-teal-600 group-hover:gap-2 transition-all">
                View surveys
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Members' Polls — members only */}
          <Link
            to="/reading-room/members-polls"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100/50 border border-violet-200/30 p-8 hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 bg-violet-100 px-2 py-1 rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Members
              </span>
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-xl font-serif font-bold text-spe-dark mb-2 group-hover:text-violet-700 transition-colors">
                Members' Polls
              </h2>
              <p className="text-sm text-spe-muted leading-relaxed">
                "Ask the Members" survey results on fiscal policy, AI, and more.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-violet-600 group-hover:gap-2 transition-all">
                View polls
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        </div>

        {/* Book Reviews Editor contact */}
        <div className="mb-12 rounded-2xl border border-rose-200/40 bg-gradient-to-br from-rose-50/50 to-white p-7">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif font-bold text-spe-dark mb-1">For Books and Reviews</h3>
              <p className="text-sm text-spe-muted leading-relaxed mb-2">
                Articles reflect the authors' views which are not necessarily shared by the Society or the Editor. The Editor welcomes comments, ideas and articles on a wide range of applied economics topics.
              </p>
              <p className="text-sm text-spe-dark font-medium">Ian Harwood</p>
              <p className="text-xs text-spe-muted mb-2">Book Reviews Editor, The Society of Professional Economists</p>
              <a
                href="mailto:harwoodfive@btinternet.com"
                className="text-sm font-medium text-rose-600 hover:underline"
              >
                harwoodfive@btinternet.com →
              </a>
            </div>
          </div>
        </div>

        {/* Latest book reviews preview */}
        <div className="border-t border-spe-border/20 pt-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="editorial-subheading text-spe-blue mb-2">Latest</p>
              <h2 className="editorial-heading text-2xl sm:text-3xl text-spe-dark">Recent Book Reviews</h2>
            </div>
            <Link
              to="/reading-room/book-reviews"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors group"
            >
              View all {bookReviewsData.length} reviews
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
