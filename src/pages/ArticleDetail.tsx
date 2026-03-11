import { useParams, Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import articlesData from '../data/articles.json'
import MediaEmbed from '../components/MediaEmbed'
import ContentCard from '../components/ContentCard'
import ShareButtons from '../components/ShareButtons'
import Breadcrumbs from '../components/Breadcrumbs'
import { formatDate, sanitiseBodyHtml } from '../utils/helpers'
import PrevNextNav from '../components/PrevNextNav'
import NotFound from './NotFound'
import type { MediaEmbed as MediaEmbedType } from '../utils/media'
import { extractPeopleFromBody, getSpeakerByName } from '../utils/speakerDirectory'
import RelatedByTopic from '../components/RelatedByTopic'

export default function ArticleDetail() {
  const { slug } = useParams()
  const item = articlesData.find(i => i.slug === slug)
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
          { '@type': 'ListItem', position: 2, name: 'Reading Room', item: 'https://www.spe.org.uk/reading-room' },
          { '@type': 'ListItem', position: 3, name: 'Articles', item: 'https://www.spe.org.uk/reading-room/articles' },
          { '@type': 'ListItem', position: 4, name: item.title },
        ],
      },
    ],
  })

  const mediaEmbeds = ((item as any).mediaUrls ?? []) as MediaEmbedType[]

  let bodyHtml = item.body || ''
  bodyHtml = bodyHtml.replace(/<div class=['"]heading['"]>[\s\S]*?<\/div>/gi, '')
  bodyHtml = bodyHtml.replace(/<div class=['"]members-notice['"]>[\s\S]*?<\/div>/gi, '')

  // Find related articles: latest 3 other articles
  const relatedArticles = articlesData
    .filter(a => a.slug !== item.slug)
    .slice(0, 3)

  return (
    <div>
      <div className="bg-gradient-to-br from-spe-deep2 via-spe-blue to-spe-accent text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <Breadcrumbs
            variant="light"
            className="mb-6"
            items={[
              { label: 'Home', to: '/' },
              { label: 'Reading Room', to: '/reading-room' },
              { label: 'Articles', to: '/reading-room/articles' },
              { label: item.title },
            ]}
          />
          <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl mb-4">{item.title}</h1>
          {(() => {
            const people = extractPeopleFromBody(item.body || '', 'Author')
            if (people.length === 0) return null
            return (
              <div className="mt-2 text-sm text-white/70">
                <span className="font-medium text-white/90">By </span>
                {people.map((p, i) => {
                  const sp = getSpeakerByName(p.name)
                  return (
                    <span key={i}>
                      {i > 0 && (i === people.length - 1 ? ' and ' : ', ')}
                      {sp ? (
                        <Link to={`/speakers/directory/${sp.slug}`} className="text-spe-gold hover:text-white transition-colors">{p.name}</Link>
                      ) : p.name}
                    </span>
                  )
                })}
              </div>
            )
          })()}
        </div>
      </div>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {mediaEmbeds.length > 0 && (
          <div className="mb-10 space-y-6">
            {mediaEmbeds.map(media => (
              <div key={media.id || media.url} className="max-w-3xl"><MediaEmbed media={media} /></div>
            ))}
          </div>
        )}
        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-spe-ink prose-a:text-spe-blue prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitiseBodyHtml(bodyHtml) }} />

        <RelatedByTopic topics={(item as any).topics} currentSlug={item.slug} currentType="article" />

        {/* Share */}
        <ShareButtons title={item.title} />

        <PrevNextNav
          items={articlesData}
          currentSlug={item.slug}
          slugToPath={slug => `/reading-room/articles/${slug}`}
        />
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-spe-paper/50 border-t border-spe-divider/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="editorial-heading text-2xl text-spe-ink mb-8">More Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedArticles.map(a => (
                <ContentCard
                  key={a.slug}
                  to={`/reading-room/articles/${a.slug}`}
                  title={a.title}
                  category="article"
                  excerpt={a.body}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
