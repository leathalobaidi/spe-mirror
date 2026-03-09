import { useParams, Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import podcastsData from '../data/podcasts.json'
import { formatDate, sanitiseBodyHtml } from '../utils/helpers'
import MediaEmbed from '../components/MediaEmbed'
import ContentCard from '../components/ContentCard'
import ShareButtons from '../components/ShareButtons'
import Breadcrumbs from '../components/Breadcrumbs'
import { detectMediaType } from '../utils/media'
import PdfDownloads from '../components/PdfDownloads'
import NotFound from './NotFound'

export default function PodcastDetail() {
  const { slug } = useParams()
  const podcast = podcastsData.find(p => p.slug.endsWith(`/${slug}`))

  if (!podcast) return <NotFound />

  useSEO({
    title: podcast.title,
    description: podcast.body ? podcast.body.replace(/<[^>]*>/g, '').slice(0, 155) + '...' : '',
    type: 'article',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'PodcastEpisode',
        name: podcast.title,
        ...(podcast.date && { datePublished: podcast.date }),
        ...(podcast.speakers && podcast.speakers.length > 0 && {
          actor: podcast.speakers.map((s: string) => ({ '@type': 'Person', name: s })),
        }),
        partOfSeries: {
          '@type': 'PodcastSeries',
          name: 'SPE Podcasts & Talks',
          url: 'https://www.spe.org.uk/podcasts',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.spe.org.uk/' },
          { '@type': 'ListItem', position: 2, name: 'Podcasts', item: 'https://www.spe.org.uk/podcasts' },
          { '@type': 'ListItem', position: 3, name: podcast.title },
        ],
      },
    ],
  })

  // Extract media embeds from mediaUrls
  const mediaEmbeds = (podcast.mediaUrls || [])
    .map(m => ({ type: m.type as 'vimeo' | 'youtube' | 'soundcloud', id: m.id, url: m.url }))
    .filter(m => m.type && (m.id || m.url))

  // Also try to detect embeds from HTML body
  const bodyMediaMatches = podcast.body.match(/(?:player\.vimeo\.com\/video\/|youtube\.com\/embed\/|soundcloud\.com\/)[^\s"'<]+/g) || []
  const additionalEmbeds = bodyMediaMatches
    .map(url => detectMediaType(url.startsWith('http') ? url : `https://${url}`))
    .filter((m): m is NonNullable<typeof m> => m !== null)
    .filter(m => !mediaEmbeds.some(e => e.id === m.id))

  const allEmbeds = [...mediaEmbeds, ...additionalEmbeds]

  // Strip media iframes from body for cleaner rendering
  const cleanBody = podcast.body
    .replace(/<div[^>]*class=['"]vimeo_wrap['"][^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<iframe[^>]*(?:vimeo|youtube|soundcloud)[^>]*><\/iframe>/gi, '')

  const categoryLabel = podcast.category
    ?.replace(/-/g, ' ')
    .replace(/\b\w/g, (l: string) => l.toUpperCase())

  // Find related podcasts: same category first, otherwise latest 3
  const otherPodcasts = podcastsData.filter(p => p.slug !== podcast.slug)
  const sameCategoryPodcasts = podcast.category
    ? otherPodcasts.filter(p => p.category === podcast.category)
    : []
  const relatedPodcasts = (sameCategoryPodcasts.length >= 3 ? sameCategoryPodcasts : otherPodcasts).slice(0, 3)

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
              { label: 'Podcasts', to: '/podcasts' },
              { label: podcast.title },
            ]}
          />
          {categoryLabel && (
            <p className="editorial-subheading text-spe-light mb-3">{categoryLabel}</p>
          )}
          <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl mb-4">{podcast.title}</h1>
          {podcast.date && (
            <p className="text-sm text-white/70 mt-4">{formatDate(podcast.date)}</p>
          )}
          {podcast.speakers && podcast.speakers.length > 0 && (
            <div className="mt-3 text-sm text-white/70">
              <span className="font-medium text-white/90">With: </span>
              {podcast.speakers.join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Media embeds */}
      {allEmbeds.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="space-y-6">
            {allEmbeds.map((media, i) => (
              <MediaEmbed key={`${media.type}-${media.id || i}`} media={media} />
            ))}
          </div>
        </div>
      )}

      {/* Body content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {podcast.images && podcast.images.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-4">
            {podcast.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="rounded-lg max-h-64 object-cover"
                loading="lazy"
              />
            ))}
          </div>
        )}
        <div
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-spe-dark prose-a:text-spe-blue prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitiseBodyHtml(cleanBody) }}
        />

        <PdfDownloads pdfs={podcast.pdfLinks} />

        {/* Share */}
        <ShareButtons title={podcast.title} />
      </article>

      {/* Related Podcasts */}
      {relatedPodcasts.length > 0 && (
        <section className="bg-spe-bg/50 border-t border-spe-border/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="editorial-subheading text-spe-blue mb-2">Keep Listening</p>
                <h2 className="editorial-heading text-2xl text-spe-dark">More Podcasts & Talks</h2>
              </div>
              <Link
                to="/podcasts"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors group"
              >
                View all podcasts
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPodcasts.map(p => (
                <ContentCard
                  key={p.slug}
                  to={`/${p.slug}`}
                  title={p.title}
                  date={p.date}
                  category={p.category}
                  excerpt={p.body}
                  image={p.images?.[0]}
                  speaker={p.speakers?.[0]}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
