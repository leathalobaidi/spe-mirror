import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import ContentCard from '../components/ContentCard'
import eveningTalksData from '../data/evening-talks.json'
import conferenceReportsData from '../data/conference-reports.json'
import dinnerReviewsData from '../data/dinner-reviews.json'

export default function Speakers() {
  useSEO({
    title: 'Speakers',
    description: 'Browse SPE speakers available for economics events, conferences, and media commentary.',
    type: 'website',
  })
  const recentTalks = eveningTalksData.slice(0, 6)
  const recentReports = conferenceReportsData.slice(0, 3)
  const recentDinners = dinnerReviewsData.slice(0, 3)

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-br from-spe-deep2 via-spe-deep to-spe-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="editorial-subheading text-spe-light mb-3">Events & Talks</p>
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">Speakers</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light">
            Evening talks, conference reports, and dinner reviews from the Society's speaker programme.
          </p>
        </div>
      </div>

      {/* Navigation cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Evening Talks */}
          <Link
            to="/speakers/evening-talks"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200/30 p-8 hover:shadow-lg transition-all duration-300"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-serif font-bold text-spe-dark mb-2 group-hover:text-indigo-700 transition-colors">
                Evening Talks
              </h2>
              <p className="text-sm text-spe-muted leading-relaxed">
                {eveningTalksData.length} talks from the Society's evening speaker series.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-indigo-600 group-hover:gap-2 transition-all">
                Browse talks
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Conference Reports */}
          <Link
            to="/speakers/conference-reports"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/30 p-8 hover:shadow-lg transition-all duration-300"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-serif font-bold text-spe-dark mb-2 group-hover:text-amber-700 transition-colors">
                Conference Reports
              </h2>
              <p className="text-sm text-spe-muted leading-relaxed">
                {conferenceReportsData.length} reports from economics conferences and symposia.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-amber-600 group-hover:gap-2 transition-all">
                Browse reports
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Dinner Reviews */}
          <Link
            to="/speakers/dinner-reviews"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/30 p-8 hover:shadow-lg transition-all duration-300"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              </div>
              <h2 className="text-xl font-serif font-bold text-spe-dark mb-2 group-hover:text-emerald-700 transition-colors">
                Dinner Reviews
              </h2>
              <p className="text-sm text-spe-muted leading-relaxed">
                {dinnerReviewsData.length} reviews of the Society's annual and special dinners.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-emerald-600 group-hover:gap-2 transition-all">
                Browse reviews
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        </div>

        {/* Recent evening talks preview */}
        <div className="border-t border-spe-border/20 pt-12 mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="editorial-subheading text-spe-blue mb-2">Latest</p>
              <h2 className="editorial-heading text-2xl sm:text-3xl text-spe-dark">Recent Evening Talks</h2>
            </div>
            <Link
              to="/speakers/evening-talks"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors group"
            >
              View all {eveningTalksData.length} talks
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTalks.map(item => (
              <ContentCard
                key={item.slug}
                to={`/speakers/evening-talks/${item.slug}`}
                title={item.title}
                date={item.date}
                category="speaker-series"
                excerpt={item.body}
                image={item.images?.[0]}
              />
            ))}
          </div>
        </div>

        {/* Recent conference reports preview */}
        <div className="border-t border-spe-border/20 pt-12 mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="editorial-subheading text-spe-blue mb-2">Latest</p>
              <h2 className="editorial-heading text-2xl sm:text-3xl text-spe-dark">Recent Conference Reports</h2>
            </div>
            <Link
              to="/speakers/conference-reports"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors group"
            >
              View all {conferenceReportsData.length} reports
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentReports.map(item => (
              <ContentCard
                key={item.slug}
                to={`/speakers/conference-reports/${item.slug}`}
                title={item.title}
                category="conference-report"
                excerpt={item.body}
                image={item.images?.[0]}
              />
            ))}
          </div>
        </div>

        {/* Recent dinner reviews preview */}
        <div className="border-t border-spe-border/20 pt-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="editorial-subheading text-spe-blue mb-2">Latest</p>
              <h2 className="editorial-heading text-2xl sm:text-3xl text-spe-dark">Recent Dinner Reviews</h2>
            </div>
            <Link
              to="/speakers/dinner-reviews"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors group"
            >
              View all {dinnerReviewsData.length} reviews
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentDinners.map(item => (
              <ContentCard
                key={item.slug}
                to={`/speakers/dinner-reviews/${item.slug}`}
                title={item.title}
                category="dinner-review"
                excerpt={item.body}
                image={item.images?.[0]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
