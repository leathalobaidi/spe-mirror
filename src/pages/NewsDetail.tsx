import { useParams, Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import newsData from '../data/news.json'
import { formatDate, sanitiseBodyHtml, resolveImageUrl } from '../utils/helpers'
import ContentCard from '../components/ContentCard'
import ShareButtons from '../components/ShareButtons'
import Breadcrumbs from '../components/Breadcrumbs'
import PdfDownloads from '../components/PdfDownloads'
import PrevNextNav from '../components/PrevNextNav'
import NotFound from './NotFound'
import { getDinnerContentForNews, getPodcastForDinner, podcastLinkSlug, eventDetailPath } from '../utils/crossLinks'

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
      <div className="bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep text-white relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
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
          <div className="rounded-xl overflow-hidden shadow-lg aspect-[21/9] bg-spe-paper">
            <img
              src={resolveImageUrl(article.bannerImage)}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Body content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-spe-ink prose-a:text-spe-blue prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitiseBodyHtml(article.body) }}
        />

        {/* Additional images */}
        {article.images && article.images.length > 0 && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {article.images
              .filter(img => img !== article.bannerImage)
              .map((img, i) => (
                <div key={i} className="rounded-lg overflow-hidden bg-spe-paper">
                  <img
                    src={resolveImageUrl(img)}
                    alt={`${article.title} - image ${i + 1}`}
                    className="w-full h-auto"
                  />
                </div>
              ))}
          </div>
        )}

        <PdfDownloads pdfs={article.pdfLinks} />

        {/* Cross-links for dinner/Rybczynski news */}
        {article.title && article.date && (() => {
          const { event, review, essays } = getDinnerContentForNews(article.title, article.date)
          const podcast = (article.title.toLowerCase().includes('annual dinner') || article.title.toLowerCase().includes('rybczynski'))
            ? getPodcastForDinner(article.date) : null
          if (!event && !review && !podcast && essays.length === 0) return null
          return (
            <div className="my-10 rounded-xl border border-spe-divider/15 bg-spe-paper/30 p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-spe-copper mb-4">Related content</p>
              <div className="space-y-3">
                {event && (
                  <Link
                    to={eventDetailPath(event.slug)}
                    className="flex items-start gap-3 group"
                  >
                    <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-spe-copper/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-spe-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </span>
                    <div>
                      <span className="text-sm font-medium text-spe-blue group-hover:text-spe-deep transition-colors">View the event listing</span>
                      <span className="block text-xs text-spe-ink/50 mt-0.5">{event.title}</span>
                    </div>
                  </Link>
                )}
                {review && (
                  <Link
                    to={`/speakers/dinner-reviews/${review.slug}`}
                    className="flex items-start gap-3 group"
                  >
                    <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-spe-burgundy/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-spe-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </span>
                    <div>
                      <span className="text-sm font-medium text-spe-blue group-hover:text-spe-deep transition-colors">Read the dinner review</span>
                      <span className="block text-xs text-spe-ink/50 mt-0.5">{review.title}</span>
                    </div>
                  </Link>
                )}
                {podcast && (
                  <Link
                    to={`/podcasts/${podcastLinkSlug(podcast.slug)}`}
                    className="flex items-start gap-3 group"
                  >
                    <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-spe-blue/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 12h.01M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728M8.464 15.536a5 5 0 010-7.072" /></svg>
                    </span>
                    <div>
                      <span className="text-sm font-medium text-spe-blue group-hover:text-spe-deep transition-colors">Listen to the dinner speech</span>
                      <span className="block text-xs text-spe-ink/50 mt-0.5">{podcast.title}</span>
                    </div>
                  </Link>
                )}
                {essays.map(essay => (
                  <Link
                    key={essay.slug}
                    to={`/reading-room/rybczynski-essays/${essay.slug}`}
                    className="flex items-start gap-3 group"
                  >
                    <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-spe-gold/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-spe-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </span>
                    <div>
                      <span className="text-sm font-medium text-spe-blue group-hover:text-spe-deep transition-colors">Rybczynski Prize Essay</span>
                      <span className="block text-xs text-spe-ink/50 mt-0.5">{essay.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })()}

        {/* Share */}
        <ShareButtons title={article.title} />

        <PrevNextNav
          items={newsData}
          currentSlug={article.slug}
          slugToPath={slug => `/news/${slug}`}
        />
      </article>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="bg-spe-paper/50 border-t border-spe-divider/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="section-label">Latest Updates</p>
                <h2 className="editorial-heading text-2xl text-spe-ink">More News</h2>
              </div>
              <Link
                to="/news"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors group"
              >
                View all news
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
