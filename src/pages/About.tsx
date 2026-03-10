import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import pagesData from '../data/pages.json'
import presidentsData from '../data/presidents.json'
import MediaEmbed from '../components/MediaEmbed'
import { detectMediaType } from '../utils/media'
import { sanitiseBodyHtml, resolveImageUrl } from '../utils/helpers'

export default function About() {
  useSEO({
    title: 'About',
    description: 'Learn about the Society of Professional Economists, our mission, leadership, and how we support UK economists.',
    type: 'website',
  })
  const aboutPage = pagesData.find(p => p.slug === 'about')

  // Key pages for navigation cards
  const subPages = [
    { path: '/about/council', title: 'Council & Officers', description: 'Meet the economists who lead the Society.', icon: 'council', dataSlug: '' },
    { path: '/about/society-activities', title: 'Society Activities', description: 'Learn about our events, publications, and community initiatives.', icon: 'calendar', dataSlug: 'about/society-activities' },
    { path: '/about/society-activities/conference', title: 'Annual Conference', description: 'Our flagship event bringing together economists from across sectors.', icon: 'mic', dataSlug: 'about/society-activities/conference' },
    { path: '/about/society-activities/dinner', title: 'Annual Dinner', description: 'The SPE\'s premier networking event for members and guests.', icon: 'users', dataSlug: 'about/society-activities/dinner' },
    { path: '/about/society-activities/rybczynski-prize', title: 'Rybczynski Prize', description: 'An annual essay prize for the best work on an economic policy topic.', icon: 'award', dataSlug: 'about/society-activities/rybczynski-prize' },
    { path: '/about/society-activities/statistics-community', title: 'Statistics Community', description: 'The SPE\'s work on the quality and use of economic statistics.', icon: 'chart', dataSlug: 'about/society-activities/statistics-community' },
  ]

  // George Buckley intro video
  const introMedia = detectMediaType('https://vimeo.com/628893749')

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep text-white relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <div className="inline-flex items-center gap-2 mb-3"><span className="w-6 h-[2px] bg-spe-gold rounded-full" /><span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">Who We Are</span></div>
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">About the SPE</h1>
          <p className="text-lg text-white/70 max-w-2xl font-light">
            The Society of Professional Economists is the UK's leading network for economists working in business, government, and academia.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro video */}
        {introMedia && (
          <div className="max-w-3xl mx-auto mb-16">
            <MediaEmbed media={introMedia} />
            <p className="text-center text-sm text-spe-grey mt-3">
              George Buckley, SPE President, introduces the Society
            </p>
          </div>
        )}

        {/* About body content */}
        {aboutPage && (
          <div className="max-w-3xl mx-auto mb-16">
            <div
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-spe-ink prose-a:text-spe-blue prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitiseBodyHtml(
                // Strip the intro Vimeo embed from body – already rendered by MediaEmbed above
                aboutPage.body.replace(/<div[^>]*style="[^"]*position:\s*relative[^"]*"[^>]*>[\s\S]*?<iframe[^>]*vimeo[^>]*>[\s\S]*?<\/div>/gi, '')
                  .replace(/<iframe[^>]*vimeo\.com\/video\/628893749[^>]*><\/iframe>/gi, '')
              ) }}
            />
          </div>
        )}

        {/* Sub-section cards */}
        <div className="border-t border-spe-divider/20 pt-12">
          <div className="text-center mb-10">
            <p className="section-label">Explore</p>
            <h2 className="editorial-heading text-2xl sm:text-3xl text-spe-ink">Our Activities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {subPages.map(page => {
              const pageData = pagesData.find(p => p.slug === page.dataSlug)
              return (
                <Link
                  key={page.path}
                  to={page.path}
                  className="group rounded-2xl border border-spe-divider/30 bg-white p-8 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-spe-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-spe-blue/20 transition-colors">
                      {page.icon === 'calendar' && (
                        <svg className="w-5 h-5 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                      {page.icon === 'mic' && (
                        <svg className="w-5 h-5 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      )}
                      {page.icon === 'users' && (
                        <svg className="w-5 h-5 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      )}
                      {page.icon === 'council' && (
                        <svg className="w-5 h-5 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      )}
                      {page.icon === 'award' && (
                        <svg className="w-5 h-5 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      )}
                      {page.icon === 'chart' && (
                        <svg className="w-5 h-5 text-spe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-bold text-spe-ink group-hover:text-spe-blue transition-colors mb-1">{page.title}</h3>
                      <p className="text-sm text-spe-muted leading-relaxed mb-3">{page.description}</p>
                      {pageData && pageData.body && (
                        <div
                          className="text-sm text-spe-muted/80 leading-relaxed line-clamp-3 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: sanitiseBodyHtml(pageData.body.slice(0, 300)) }}
                        />
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* President & Vice Presidents */}
        <div className="border-t border-spe-divider/20 pt-12 mt-16">
          <div className="text-center mb-10">
            <p className="section-label">Leadership</p>
            <h2 className="editorial-heading text-2xl sm:text-3xl text-spe-ink">
              President &amp; Vice Presidents
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {presidentsData.map(person => (
              <Link
                key={person.slug}
                to={`/about/council/${person.slug}`}
                className="group text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-spe-divider/20 group-hover:ring-spe-blue/30 transition-all">
                  {person.images?.[0] ? (
                    <img
                      src={resolveImageUrl(person.images[0])}
                      alt={person.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-spe-blue/20 to-spe-deep/20 flex items-center justify-center">
                      <svg className="w-10 h-10 text-spe-blue/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="font-serif font-bold text-spe-ink group-hover:text-spe-blue transition-colors text-sm leading-tight">
                  {person.name}
                </h3>
                <p className="text-xs text-spe-muted mt-1">{person.role}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Membership CTA */}
        <div className="mt-16 text-center bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep rounded-2xl p-12 text-white relative overflow-hidden grain-overlay">
          <h2 className="editorial-heading text-2xl sm:text-3xl mb-4">Become a Member</h2>
          <p className="text-white/70 max-w-xl mx-auto mb-6 font-light">
            Join the UK's leading community of professional economists. Access exclusive events,
            publications, and networking opportunities.
          </p>
          <Link
            to="/membership"
            className="inline-flex items-center gap-2 bg-white text-spe-deep font-semibold px-6 py-3 rounded-lg hover:bg-spe-cream transition-colors"
          >
            Learn About Membership
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
