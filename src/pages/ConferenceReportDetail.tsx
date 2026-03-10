import { useParams, Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import conferenceReportsData from '../data/conference-reports.json'
import MediaEmbed from '../components/MediaEmbed'
import { sanitiseBodyHtml } from '../utils/helpers'
import ContentCard from '../components/ContentCard'
import ShareButtons from '../components/ShareButtons'
import Breadcrumbs from '../components/Breadcrumbs'
import PdfDownloads from '../components/PdfDownloads'
import PrevNextNav from '../components/PrevNextNav'
import NotFound from './NotFound'
import type { MediaEmbed as MediaEmbedType } from '../utils/media'

export default function ConferenceReportDetail() {
  const { slug } = useParams()
  const item = conferenceReportsData.find(i => i.slug === slug)

  if (!item) return <NotFound />

  useSEO({
    title: item.title,
    description: (item?.body ? item.body.replace(/<[^>]*>/g, '').slice(0, 155) + '...' : ''),
    image: item.images?.[0] || undefined,
    type: 'article',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: item.title,
        publisher: {
          '@type': 'Organization',
          name: 'Society of Professional Economists',
          url: 'https://www.spe.org.uk',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.spe.org.uk/' },
          { '@type': 'ListItem', position: 2, name: 'Speakers', item: 'https://www.spe.org.uk/speakers' },
          { '@type': 'ListItem', position: 3, name: 'Conference Reports', item: 'https://www.spe.org.uk/speakers/conference-reports' },
          { '@type': 'ListItem', position: 4, name: item.title },
        ],
      },
    ],
  })

  const mediaEmbeds = (item.mediaUrls ?? []) as MediaEmbedType[]

  // Strip CMS heading div that duplicates the title
  let bodyHtml = item.body || ''
  bodyHtml = bodyHtml.replace(/<div class=['"]heading['"]>[\s\S]*?<\/div>/gi, '')
  bodyHtml = bodyHtml.replace(/<div class=['"]members-notice['"]>[\s\S]*?<\/div>/gi, '')

  // Related reports: pick 3 others
  const otherReports = conferenceReportsData.filter(r => r.slug !== item.slug)
  const relatedReports = otherReports.slice(0, 3)

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep text-white relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <Breadcrumbs
            variant="light"
            className="mb-6"
            items={[
              { label: 'Home', to: '/' },
              { label: 'Speakers', to: '/speakers' },
              { label: 'Conference Reports', to: '/speakers/conference-reports' },
              { label: item.title },
            ]}
          />
          <div className="inline-flex items-center gap-2 mb-3"><span className="w-6 h-[2px] bg-spe-gold rounded-full" /><span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">Conference Report</span></div>
          <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl mb-4">{item.title}</h1>
        </div>
      </div>

      {/* Body content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {mediaEmbeds.length > 0 && (
          <div className="mb-10 space-y-6">
            {mediaEmbeds.map(media => (
              <div key={media.id || media.url} className="max-w-3xl">
                <MediaEmbed media={media} />
              </div>
            ))}
          </div>
        )}
        <div
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-spe-ink prose-a:text-spe-blue prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitiseBodyHtml(bodyHtml) }}
        />

        <PdfDownloads pdfs={(item as any).pdfLinks} />

        <ShareButtons title={item.title} />

        <PrevNextNav
          items={conferenceReportsData}
          currentSlug={item.slug}
          slugToPath={slug => `/speakers/conference-reports/${slug}`}
        />
      </article>

      {/* Related Reports */}
      {relatedReports.length > 0 && (
        <section className="bg-spe-paper/50 border-t border-spe-divider/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="section-label">Speakers</p>
                <h2 className="editorial-heading text-2xl text-spe-ink">More Conference Reports</h2>
              </div>
              <Link
                to="/speakers/conference-reports"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors group"
              >
                View all reports
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedReports.map(r => (
                <ContentCard
                  key={r.slug}
                  to={`/speakers/conference-reports/${r.slug}`}
                  title={r.title}
                  category="conference-report"
                  excerpt={r.body}
                  image={r.images?.[0]}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
