import { useLocation, Link } from 'react-router-dom'
import NotFound from './NotFound'
import pagesData from '../data/pages.json'
import { sanitiseBodyHtml } from '../utils/helpers'
import { useSEO } from '../hooks/useSEO'
import { webPageSchema, breadcrumbSchema } from '../utils/seoSchemas'
import Breadcrumbs from '../components/Breadcrumbs'
import ShareButtons from '../components/ShareButtons'
import MediaEmbed from '../components/MediaEmbed'
import type { MediaEmbed as MediaEmbedType } from '../utils/media'

/**
 * Section metadata — drives header gradient, subtitle, and grouping.
 */
const sectionMeta: Record<string, { subtitle: string; label: string; gradient: string }> = {
  about: {
    subtitle: 'About the SPE',
    label: 'About',
    gradient: 'from-spe-ink via-spe-deep2 to-spe-deep',
  },
  membership: {
    subtitle: 'Join the Community',
    label: 'Membership',
    gradient: 'from-spe-ink via-spe-deep2 to-spe-deep',
  },
  careers: {
    subtitle: 'Professional Development',
    label: 'Careers',
    gradient: 'from-spe-ink via-spe-deep2 to-spe-deep',
  },
  advertise: {
    subtitle: 'Partner with SPE',
    label: 'Advertise',
    gradient: 'from-spe-ink via-spe-deep2 to-spe-deep',
  },
  'reading-room': {
    subtitle: 'Publications',
    label: 'Reading Room',
    gradient: 'from-spe-ink via-spe-deep2 to-spe-deep',
  },
  'site-policies': {
    subtitle: 'Legal',
    label: 'Site Policies',
    gradient: 'from-spe-ink via-spe-deep2 to-spe-deep',
  },
  faqs: {
    subtitle: 'Help & Support',
    label: 'FAQs',
    gradient: 'from-spe-ink via-spe-deep2 to-spe-deep',
  },
  contact: {
    subtitle: 'Get in Touch',
    label: 'Contact',
    gradient: 'from-spe-ink via-spe-deep2 to-spe-deep',
  },
}

/**
 * GenericPage renders any page from pages.json by matching the current URL
 * path to a page slug. Used for section pages that don't need bespoke layout
 * (membership, careers, about sub-pages, policies, etc.).
 */
export default function GenericPage() {
  const { pathname } = useLocation()
  const slug = pathname.replace(/^\//, '').replace(/\/$/, '') // strip leading/trailing slashes

  const page = pagesData.find(p => p.slug === slug)

  // If no page found, render 404 inline (preserves the original URL)
  if (!page) {
    return <NotFound />
  }

  const pageDescription = page.body
    ? page.body.replace(/<[^>]*>/g, '').slice(0, 155) + '...'
    : ''

  useSEO({
    title: page.title,
    description: pageDescription,
    type: 'website',
    schema: [
      webPageSchema({ name: page.title, description: pageDescription, path: '/' + slug }),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        ...slug.split('/').slice(0, -1).map((seg, i, arr) => {
          const ancestorSlug = arr.slice(0, i + 1).join('/')
          const ancestorPage = pagesData.find(p => p.slug === ancestorSlug)
          return { name: ancestorPage?.title ?? seg.replace(/-/g, ' '), path: '/' + ancestorSlug }
        }),
        { name: page.title },
      ]),
    ],
  })

  const topSection = slug.split('/')[0]
  const meta = sectionMeta[topSection] ?? {
    subtitle: '',
    label: '',
    gradient: 'from-spe-deep2 via-spe-deep to-spe-blue',
  }

  // Build breadcrumb segments
  const segments = slug.split('/')
  const breadcrumbs: { label: string; path: string }[] = []
  for (let i = 0; i < segments.length - 1; i++) {
    const ancestorSlug = segments.slice(0, i + 1).join('/')
    const ancestorPage = pagesData.find(p => p.slug === ancestorSlug)
    breadcrumbs.push({
      label: ancestorPage?.title ?? segments[i].replace(/-/g, ' '),
      path: '/' + ancestorSlug,
    })
  }

  // Find sibling pages (same parent path) for sidebar navigation
  const parentSlug = segments.length > 1 ? segments.slice(0, -1).join('/') : null
  const siblingPages = parentSlug
    ? pagesData.filter(p => {
        if (p.slug === slug) return false
        const parentParts = p.slug.split('/')
        parentParts.pop()
        return parentParts.join('/') === parentSlug
      })
    : []

  // Child pages (pages directly under this page)
  const childPages = pagesData.filter(p => {
    if (p.slug === slug) return false
    const parts = p.slug.split('/')
    parts.pop()
    return parts.join('/') === slug
  })

  // Media embeds — mediaUrls are already pre-parsed into {type, id, url} objects
  const mediaEmbeds = (page.mediaUrls ?? []) as MediaEmbedType[]

  // Clean up body — strip duplicate heading if it matches the page title
  let bodyHtml = page.body || ''
  // Remove CMS heading div that duplicates the page title
  bodyHtml = bodyHtml.replace(/<div class=['"]heading['"]>\s*<h1>[^<]*<\/h1>\s*<\/div>/gi, '')

  return (
    <div>
      {/* Header */}
      <div className={`bg-gradient-to-br ${meta.gradient} text-white relative overflow-hidden grain-overlay`}>
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <Breadcrumbs
            variant="light"
            className="mb-6"
            items={[
              { label: 'Home', to: '/' },
              ...breadcrumbs.map(bc => ({ label: bc.label, to: bc.path })),
              { label: page.title },
            ]}
          />

          {meta.subtitle && (
            <div className="inline-flex items-center gap-2 mb-3"><span className="w-6 h-[2px] bg-spe-gold rounded-full" /><span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">{meta.subtitle}</span></div>
          )}
          <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl">{page.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Media embeds */}
            {mediaEmbeds.length > 0 && (
              <div className="mb-10 space-y-6">
                {mediaEmbeds.map((media) => (
                  <div key={media.id || media.url} className="max-w-3xl">
                    <MediaEmbed media={media} />
                  </div>
                ))}
              </div>
            )}

            {/* Body HTML */}
            {bodyHtml && (
              <div
                className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-spe-ink prose-a:text-spe-blue prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ __html: sanitiseBodyHtml(bodyHtml) }}
              />
            )}

            {/* Share */}
            <ShareButtons title={page.title} />

            {/* Child pages list */}
            {childPages.length > 0 && (
              <div className="mt-12 border-t border-spe-divider/20 pt-10">
                <h2 className="editorial-heading text-xl sm:text-2xl text-spe-ink mb-6">
                  In this section
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {childPages.map(child => (
                    <Link
                      key={child.slug}
                      to={'/' + child.slug}
                      className="group rounded-xl border border-spe-divider/30 bg-white p-6 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-serif font-bold text-spe-ink group-hover:text-spe-blue transition-colors mb-1">
                        {child.title}
                      </h3>
                      <span className="text-sm text-spe-blue flex items-center gap-1">
                        Read more
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — only if there are sibling pages */}
          {siblingPages.length > 0 && (
            <aside className="lg:w-72 flex-shrink-0">
              <div className="sticky top-24 rounded-xl border border-spe-divider/30 bg-spe-cream/50 p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-spe-muted mb-4">
                  Related pages
                </h3>
                <nav className="space-y-2">
                  {siblingPages.map(sib => (
                    <Link
                      key={sib.slug}
                      to={'/' + sib.slug}
                      className="block text-sm text-spe-ink hover:text-spe-blue transition-colors py-1"
                    >
                      {sib.title}
                    </Link>
                  ))}
                </nav>

                {/* Back to parent link */}
                {parentSlug && (
                  <Link
                    to={'/' + parentSlug}
                    className="mt-6 flex items-center gap-1.5 text-xs text-spe-muted hover:text-spe-blue transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to {breadcrumbs[breadcrumbs.length - 1]?.label ?? 'parent'}
                  </Link>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
