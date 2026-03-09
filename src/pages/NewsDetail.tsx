import { useParams, Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import newsData from '../data/news.json'
import { formatDate, sanitiseBodyHtml } from '../utils/helpers'
import ContentCard from '../components/ContentCard'
import ShareButtons from '../components/ShareButtons'
import Breadcrumbs from '../components/Breadcrumbs'
import PdfDownloads from '../components/PdfDownloads'
import NotFound from './NotFound'

export default function NewsDetail() {
  const { slug } = useParams()
  const article = newsData.find(n => n.slug === slug)

  if (!article) return <NotFound />

  useSEO({
    title: article.title,
    description: article.body ? article.body.replace(/<[^>]*>/g, '').slice(0, 155) + '...' : '',
    type: 'article',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.title,
        ...(article.date && { datePublished: article.date }),
        ...(article.bannerImage && { image: article.bannerImage }),
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
          { '@type': 'ListItem', position: 2, name: 'News', item: 'https://www.spe.org.uk/news' },
          { '@type': 'ListItem', position: 3, name: article.title },
        ],
      },
    ],
  })

  // Find related news: latest 3 other news items
  const relatedNews = newsData
    .filter(n => n.slug !== article.slug)
    .slice(0, 3)

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
              { label: 'News', to: '/news' },
              { label: article.title },
            ]}
          />
          <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl mb-4">{article.title}</h1>
          {article.date && (
            <p className="text-sm text-white/70">{formatDate(article.date)}</p>
          )}
        </div>
      </div>

      {/* Banner image */}
      {article.bannerImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="rounded-xl overflow-hidden shadow-lg aspect-[21/9] bg-spe-bg">
            <img
              src={article.bannerImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Body content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-spe-dark prose-a:text-spe-blue prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitiseBodyHtml(article.body) }}
        />

        {/* Additional images */}
        {article.images && article.images.length > 0 && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {article.images
              .filter(img => img !== article.bannerImage)
              .map((img, i) => (
                <div key={i} className="rounded-lg overflow-hidden bg-spe-bg">
                  <img
                    src={img}
                    alt={`${article.title} - image ${i + 1}`}
                    className="w-full h-auto"
                  />
                </div>
              ))}
          </div>
        )}

        <PdfDownloads pdfs={article.pdfLinks} />

        {/* Share */}
        <ShareButtons title={article.title} />
      </article>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="bg-spe-bg/50 border-t border-spe-border/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="editorial-subheading text-spe-blue mb-2">Latest Updates</p>
                <h2 className="editorial-heading text-2xl text-spe-dark">More News</h2>
              </div>
              <Link
                to="/news"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors group"
              >
                View all news
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedNews.map(n => (
                <ContentCard
                  key={n.slug}
                  to={`/news/${n.slug}`}
                  title={n.title}
                  date={n.date}
                  category="news"
                  excerpt={n.body}
                  image={n.bannerImage || n.images?.[0]}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
