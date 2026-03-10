import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { collectionPageSchema, breadcrumbSchema } from '../utils/seoSchemas'
import Breadcrumbs from '../components/Breadcrumbs'

const polls = [
  {
    title: 'UK Budget Measures November 2025',
    date: 'November 2025',
    summary:
      'Members were asked what they expected the Chancellor to announce in the UK Budget. Over 85% expected income tax, VAT, employee NICS, or corporation tax to rise. A plurality expected tax hikes of £20–29bn, front-loaded or evenly distributed, to address the fiscal hole.',
    pdf: '/images/15018/uk_budget_measures_nov_2025.pdf',
  },
  {
    title: 'Fiscal Outlook May 2025',
    date: 'May 2025',
    summary:
      'Members were most concerned about the fiscal position of the US, with a majority recommending raising domestic taxes. Respondents were split on whether Europe\'s recent fiscal announcements would be a game-changer for growth, and most thought they would not be inflationary.',
    pdf: '/images/14374/results_fiscal_outlook_may_2025.pdf',
  },
  {
    title: 'Artificial Intelligence Poll October 2024',
    date: 'October 2024',
    summary:
      'Over 70% of respondents saw AI\'s effect on growth as "mildly positive", with 15% seeing it as "very positive". While 60%+ expected no effect on unemployment, 29% anticipated AI pushing it up. Among AI users, 70% reported higher personal productivity.',
    pdf: '/images/3932/results_ai_poll_oct_2024.pdf',
  },
]

export default function MembersPolls() {
  useSEO({
    title: "Members' Polls",
    description: 'SPE members polls on economic forecasts, policy views, and professional opinions.',
    type: 'website',
    schema: [
      collectionPageSchema({ name: "Members' Polls", description: 'SPE members polls on economic forecasts, policy views, and professional opinions.', path: '/reading-room/members-polls', itemCount: polls.length }),
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Reading Room', path: '/reading-room' }, { name: "Members' Polls" }]),
    ],
  })

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep text-white relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <Breadcrumbs
            variant="light"
            className="mb-6"
            items={[
              { label: 'Home', to: '/' },
              { label: 'Reading Room', to: '/reading-room' },
              { label: "Members' Polls" },
            ]}
          />
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">Members' Polls</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light">
            In our "Ask the Members" series, the SPE invites members to share their views
            on the most pressing economic topics of the day.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Poll cards */}
        <div className="space-y-6">
          {polls.map((poll, i) => (
            <div
              key={i}
              className="rounded-2xl border border-spe-divider/30 bg-white p-8 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-medium text-spe-copper bg-spe-cream px-2.5 py-1 rounded-full">
                    {poll.date}
                  </span>
                </div>
                <a
                  href={poll.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-spe-blue hover:text-spe-deep transition-colors"
                >
                  <svg className="w-4 h-4 flex-shrink-0 text-spe-error-light/70" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z" />
                    <path d="M12 18l4-4h-3v-4h-2v4H8l4 4z" />
                  </svg>
                  <span className="hover:underline">Download PDF</span>
                </a>
              </div>
              <h3 className="text-xl font-serif font-bold text-spe-ink mb-3">{poll.title}</h3>
              <p className="text-spe-muted leading-relaxed">{poll.summary}</p>
            </div>
          ))}
        </div>

        {/* Back link */}
        <div className="mt-10 pt-8 border-t border-spe-divider/20">
          <Link
            to="/reading-room"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Reading Room
          </Link>
        </div>
      </div>
    </div>
  )
}
