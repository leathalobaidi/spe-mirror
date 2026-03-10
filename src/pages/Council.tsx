import { Link } from 'react-router-dom'
import councillorsData from '../data/councillors.json'
import presidentsData from '../data/presidents.json'
import { stripHtml, truncateText, resolveImageUrl } from '../utils/helpers'
import { useSEO } from '../hooks/useSEO'
import { webPageSchema, breadcrumbSchema } from '../utils/seoSchemas'
import Breadcrumbs from '../components/Breadcrumbs'

export default function Council() {
  useSEO({
    title: 'Council & Officers',
    description: 'Meet the SPE Council members who govern the Society of Professional Economists.',
    type: 'website',
    schema: [
      webPageSchema({ name: 'Council & Officers', description: 'Meet the SPE Council members who govern the Society of Professional Economists.', path: '/about/council' }),
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }, { name: 'Council & Officers' }]),
    ],
  })

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep text-white relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 opacity-[0.03] hero-pattern" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <Breadcrumbs
            items={[
              { label: 'About', to: '/about' },
              { label: 'Council & Officers' },
            ]}
          />
          <div className="inline-flex items-center gap-2 mb-3"><span className="w-6 h-[2px] bg-spe-gold rounded-full" /><span className="text-spe-gold text-[10px] font-semibold uppercase tracking-[0.15em]">About the SPE</span></div>
          <h1 className="editorial-heading text-4xl sm:text-5xl">Council & Officers</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Presidents section */}
        <section className="mb-16">
          <h2 className="editorial-heading text-2xl sm:text-3xl text-spe-ink mb-8">Officers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {presidentsData.map(person => {
              const photo = resolveImageUrl(person.images?.[0])
              return (
                <Link
                  key={person.slug}
                  to={`/about/council/${person.slug}`}
                  className="group flex gap-5 rounded-xl border border-spe-divider/30 bg-white p-6 hover:shadow-md transition-shadow"
                >
                  {photo && (
                    <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-spe-paper">
                      <img src={photo} alt={person.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-serif font-bold text-spe-ink group-hover:text-spe-blue transition-colors">
                      {person.name}
                    </h3>
                    <p className="text-sm text-spe-blue mb-2">{person.role}</p>
                    <p className="text-sm text-spe-muted line-clamp-2">
                      {truncateText(stripHtml(person.body), 120)}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Council members */}
        <section>
          <h2 className="editorial-heading text-2xl sm:text-3xl text-spe-ink mb-8">Council Members</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {councillorsData.map(person => {
              const photo = resolveImageUrl(person.images?.[0])
              return (
                <Link
                  key={person.slug}
                  to={`/about/council/${person.slug}`}
                  className="group rounded-xl border border-spe-divider/30 bg-white p-6 hover:shadow-md transition-shadow text-center"
                >
                  {photo && (
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 bg-spe-paper">
                      <img src={photo} alt={person.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="font-serif font-bold text-spe-ink group-hover:text-spe-blue transition-colors">
                    {person.name}
                  </h3>
                  <p className="text-sm text-spe-muted mt-1">{person.role}</p>
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
