import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { collectionPageSchema, breadcrumbSchema } from '../utils/seoSchemas'
import Breadcrumbs from '../components/Breadcrumbs'

const surveys = [
  { year: 2025, pdf: '/images/14447/salary_survey_2025.pdf' },
  { year: 2024, pdf: '/images/12352/spe_salary_survey_2024_results.pdf' },
  { year: 2023, pdf: '/images/11486/salary_survey_2023.pdf' },
  { year: 2022, pdf: '/images/10731/salary_survey_2022.pdf' },
  { year: 2021, pdf: '/images/8707/salary_survey_2021.pdf' },
  { year: 2020, pdf: '/images/7631/salary_survey_2020.pdf' },
  { year: 2019, pdf: '/images/5517/salary_survey_2019.pdf' },
  { year: 2018, pdf: '/images/5136/salary_survey_2018.pdf' },
  { year: 2017, pdf: '/images/4771/sbe_salary_survey_2017.pdf' },
  { year: 2016, pdf: '/images/4482/salary_survey_2016.pdf' },
  { year: 2015, pdf: '/images/3988/sbe_salary_survey_2015.pdf' },
  { year: 2014, pdf: '/images/3074/sbe_salary_survey_2014.pdf' },
  { year: 2013, pdf: '/images/3038/sbe_salary_survey_2013.pdf' },
  { year: 2012, pdf: '/images/2831/sbe_salary_survey_2012.pdf' },
  { year: 2011, pdf: '/images/2832/sbe_salary_survey_2011.pdf' },
  { year: 2010, pdf: '/images/2833/sbe_salary_survey_2010.pdf' },
  { year: 2009, pdf: '/images/2834/sbe_salary_survey_2009.pdf' },
  { year: 2008, pdf: '/images/2835/sbe_salary_survey_2008.pdf' },
  { year: 2007, pdf: '/images/2836/sbe_salary_survey_2007.pdf' },
  { year: 2006, pdf: '/images/2837/sbe_salary_survey_2006.pdf' },
]

export default function SalarySurveys() {
  useSEO({
    title: 'Salary Surveys',
    description: 'SPE salary surveys providing data on economist compensation across sectors and seniority levels.',
    type: 'website',
    schema: [
      collectionPageSchema({ name: 'Salary Surveys', description: 'SPE salary surveys providing data on economist compensation across sectors and seniority levels.', path: '/reading-room/salary-surveys', itemCount: surveys.length }),
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Reading Room', path: '/reading-room' }, { name: 'Salary Surveys' }]),
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
              { label: 'Salary Surveys' },
            ]}
          />
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">Salary Surveys</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light">
            Annual compensation benchmarking data for professional economists across sectors.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Survey list */}
        <div className="space-y-3">
          {surveys.map(({ year, pdf }) => (
            <div
              key={year}
              className="group flex items-center justify-between rounded-xl border border-spe-divider/30 bg-white p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-spe-cream to-spe-paper flex items-center justify-center">
                  <span className="text-lg font-serif font-bold text-spe-ink">{year}</span>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-spe-ink">
                    SPE Salary Survey {year}
                  </h3>
                  <p className="text-sm text-spe-muted mt-0.5">
                    Annual compensation report
                  </p>
                </div>
              </div>
              <a
                href={pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-spe-blue hover:text-spe-deep transition-colors"
              >
                <svg className="w-5 h-5 flex-shrink-0 text-spe-error-light/70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z" />
                  <path d="M12 18l4-4h-3v-4h-2v4H8l4 4z" />
                </svg>
                <span className="hidden sm:inline group-hover:underline">Download PDF</span>
              </a>
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
