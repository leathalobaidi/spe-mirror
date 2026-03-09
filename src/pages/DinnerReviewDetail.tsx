import { useParams, Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import dinnerReviewsData from '../data/dinner-reviews.json'
import MediaEmbed from '../components/MediaEmbed'
import { sanitiseBodyHtml } from '../utils/helpers'
import ContentCard from '../components/ContentCard'
import ShareButtons from '../components/ShareButtons'
import Breadcrumbs from '../components/Breadcrumbs'
import PdfDownloads from '../components/PdfDownloads'
import NotFound from './NotFound'
import type { MediaEmbed as MediaEmbedType } from '../utils/media'

export default function DinnerReviewDetail() {
  const { slug } = useParams()
  const item = dinnerReviewsData.find(i => i.slug === slug)

  if (!item) return <NotFound />

  useSEO({
    title: item.title,
    description: (item?.body ? item.body.replace(/<[^>]*>/g, '').slice(0, 155) + '...' : ''),
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
          { '@type': 'ListItem', position: 3, name: 'Dinner Reviews', item: 'https://www.spe.org.uk/speakers/dinner-reviews' },
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

  // Related reviews: pick 3 others
  const otherReviews = dinnerReviewsData.filter(r => r.slug !== item.slug)
  const relatedReviews = otherReviews.slice(0, 3)

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-spe-deep2 via-spe-deep to-spe-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <Breadcrumbs
            variant="light"
            className="mb-6"
            items={[
              { label: 'Home', to: '/' },
              { label: 'Speakers', to: '/speakers' },
              { label: 'Dinner Reviews', to: '/speakers/dinner-reviews' },
              { label: item.title },
            ]}
          />
          <p className="editorial-subheading text-spe-light mb-3">Dinner Review</p>
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
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-spe-dark prose-a:text-spe-blue prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitiseBodyHtml(bodyHtml) }}
        />

        <PdfDownloads pdfs={item.pdfLinks} />

        <ShareButtons title={item.title} />
      </article>

      {/* Related Reviews */}
      {relatedReviews.length > 0 && (
        <section className="bg-spe-bg/50 border-t border-spe-border/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="editorial-subheading text-spe-blue mb-2">Speakers</p>
                <h2 className="editorial-heading text-2xl text-spe-dark">More Dinner Reviews</h2>
              </div>
              <Link
                to="/speakers/dinner-reviews"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors group"
              >
                View all reviews
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedReviews.map(r => (
                <ContentCard
                  key={r.slug}
                  to={`/speakers/dinner-reviews/${r.slug}`}
                  title={r.title}
                  category="dinner-review"
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
