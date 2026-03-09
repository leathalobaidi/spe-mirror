import { useParams, Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import bookReviewsData from '../data/book-reviews.json'
import { formatDate, sanitiseBodyHtml } from '../utils/helpers'
import BookCover from '../components/BookCover'
import ShareButtons from '../components/ShareButtons'
import Breadcrumbs from '../components/Breadcrumbs'
import NotFound from './NotFound'

export default function BookReviewDetail() {
  const { slug } = useParams()
  const review = bookReviewsData.find(b => b.slug === slug)

  if (!review) return <NotFound />

  useSEO({
    title: review.title,
    description: review.body ? review.body.replace(/<[^>]*>/g, '').slice(0, 155) + '...' : '',
    type: 'article',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'Review',
        name: review.title,
        ...(review.author && { itemReviewed: { '@type': 'Book', name: review.title, author: { '@type': 'Person', name: review.author } } }),
        ...(review.reviewer && { author: { '@type': 'Person', name: review.reviewer } }),
        ...(review.date && { datePublished: review.date }),
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
          { '@type': 'ListItem', position: 3, name: 'Book Reviews', item: 'https://www.spe.org.uk/reading-room/book-reviews' },
          { '@type': 'ListItem', position: 4, name: review.title },
        ],
      },
    ],
  })

  // Find related reviews: 3 other reviews
  const relatedReviews = bookReviewsData
    .filter(b => b.slug !== review.slug && b.coverImage)
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
              { label: 'Reading Room', to: '/reading-room' },
              { label: 'Book Reviews', to: '/reading-room/book-reviews' },
              { label: review.title },
            ]}
          />
          <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl mb-4">{review.title}</h1>
          {review.author && (
            <p className="text-lg text-white/80 font-light">by {review.author}</p>
          )}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-white/70">
            {review.reviewer && (
              <span>
                <span className="font-medium text-white/90">Reviewed by </span>
                {review.reviewer}
              </span>
            )}
            {review.date && (
              <span>{formatDate(review.date)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Body content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="md:flex gap-10">
          {/* Book cover */}
          {review.coverImage && (
            <div className="flex-shrink-0 mb-8 md:mb-0">
              <div className="book-cover rounded-lg overflow-hidden w-48 mx-auto md:mx-0 aspect-[2/3] bg-spe-bg shadow-lg">
                <img
                  src={review.coverImage}
                  alt={review.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Review text */}
          <div className="flex-1 min-w-0">
            <div
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-spe-dark prose-a:text-spe-blue prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitiseBodyHtml(review.body) }}
            />
          </div>
        </div>

        {/* Share */}
        <ShareButtons title={review.title} />
      </article>

      {/* More Reviews */}
      {relatedReviews.length > 0 && (
        <section className="bg-spe-bg/50 border-t border-spe-border/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="editorial-subheading text-spe-blue mb-2">Reading Room</p>
                <h2 className="editorial-heading text-2xl text-spe-dark">More Reviews</h2>
              </div>
              <Link
                to="/reading-room/book-reviews"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-spe-blue hover:text-spe-deep transition-colors group"
              >
                View all reviews
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {relatedReviews.map(b => (
                <BookCover
                  key={b.slug}
                  to={`/reading-room/book-reviews/${b.slug}`}
                  title={b.title}
                  coverImage={b.coverImage}
                  author={b.author}
                  reviewer={b.reviewer}
                  date={b.date}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
