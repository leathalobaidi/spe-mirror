import { useParams, Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import blogsData from '../data/blogs.json'
import { formatDate, sanitiseBodyHtml } from '../utils/helpers'
import ContentCard from '../components/ContentCard'
import ShareButtons from '../components/ShareButtons'
import Breadcrumbs from '../components/Breadcrumbs'
import PrevNextNav from '../components/PrevNextNav'
import NotFound from './NotFound'
import { getSpeakerByName } from '../utils/speakerDirectory'

export default function BlogDetail() {
  const { slug } = useParams()
  const post = blogsData.find(b => b.slug === slug)

  if (!post) return <NotFound />

  useSEO({
    title: post.title,
    description: post.body ? post.body.replace(/<[^>]*>/g, '').slice(0, 155) + '...' : '',
    type: 'article',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        ...(post.date && { datePublished: post.date }),
        ...(post.author && { author: { '@type': 'Person', name: post.author } }),
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
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.spe.org.uk/blogs' },
          { '@type': 'ListItem', position: 3, name: post.title },
        ],
      },
    ],
  })

  let bodyHtml = post.body || ''
  bodyHtml = bodyHtml.replace(/<div class=['"]heading['"]>[\s\S]*?<\/div>/gi, '')

  // Find related blog posts: latest 3 other posts
  const relatedPosts = blogsData
    .filter(b => b.slug !== post.slug)
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
              { label: 'Blog', to: '/blogs' },
              { label: post.title },
            ]}
          />
          <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl mb-4">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-white/70">
            {post.author && (() => {
              const speaker = getSpeakerByName(post.author)
              return speaker ? (
                <Link to={`/speakers/directory/${speaker.slug}`} className="text-spe-gold hover:text-white transition-colors">By {post.author}</Link>
              ) : (
                <span>By {post.author}</span>
              )
            })()}
            {post.author && post.date && <span className="text-white/30">&middot;</span>}
            {post.date && <span>{formatDate(post.date)}</span>}
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-spe-ink prose-a:text-spe-blue prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitiseBodyHtml(bodyHtml) }}
        />

        {/* Share */}
        <ShareButtons title={post.title} />

        <PrevNextNav
          items={blogsData}
          currentSlug={post.slug}
          slugToPath={slug => `/blogs/${slug}`}
        />
      </article>

      {/* Related Blog Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-spe-paper/50 border-t border-spe-divider/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="section-label">From the Blog</p>
                <h2 className="editorial-heading text-2xl text-spe-ink">More Posts</h2>
              </div>
              <Link
                to="/blogs"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors group"
              >
                View all posts
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map(b => (
                <ContentCard
                  key={b.slug}
                  to={`/blogs/${b.slug}`}
                  title={b.title}
                  date={b.date}
                  excerpt={b.body}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
