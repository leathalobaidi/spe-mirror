import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_NAME = 'Society of Professional Economists'
const SITE_URL = 'https://www.spe.org.uk'
const DEFAULT_IMAGE = '/images/logo-colour.png'
const DEFAULT_DESCRIPTION =
  'The Society of Professional Economists - the UK\'s leading forum for economists since 1953, offering events, publications, career resources and professional development.'

interface SEOProps {
  /** Page title — will be appended with " — Society of Professional Economists" */
  title?: string
  /** Meta description — 120-160 chars recommended */
  description?: string
  /** OG image path (relative to site root) — defaults to logo */
  image?: string
  /** Override og:type — defaults to 'website' */
  type?: string
  /** JSON-LD schema object(s) to inject */
  schema?: Record<string, unknown> | Record<string, unknown>[]
  /** Override canonical path (relative) */
  canonicalPath?: string
  /** Don't append site name to title */
  rawTitle?: boolean
  /** Add robots noindex tag — use for 404, search results, etc. */
  noindex?: boolean
}

/**
 * Comprehensive SEO hook — sets document title, meta description,
 * canonical URL, Open Graph tags, Twitter Card tags, and JSON-LD schema.
 *
 * Cleans up injected tags on unmount so SPA navigation doesn't leak stale meta.
 */
export function useSEO({
  title,
  description,
  image,
  type = 'website',
  schema,
  canonicalPath,
  rawTitle = false,
  noindex = false,
}: SEOProps = {}) {
  const { pathname } = useLocation()

  useEffect(() => {
    // ── Title ────────────────────────────────────────
    const fullTitle = title
      ? rawTitle
        ? title
        : `${title} — ${SITE_NAME}`
      : SITE_NAME
    document.title = fullTitle

    // ── Helper to set/create meta tags ──────────────
    const metas: HTMLMetaElement[] = []
    const links: HTMLLinkElement[] = []

    function setMeta(attr: 'name' | 'property', key: string, content: string) {
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
        metas.push(el)
      }
      el.setAttribute('content', content)
    }

    function setLink(rel: string, href: string) {
      let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        document.head.appendChild(el)
        links.push(el)
      }
      el.setAttribute('href', href)
    }

    // ── Meta description ────────────────────────────
    const desc = description || DEFAULT_DESCRIPTION
    setMeta('name', 'description', desc)

    // ── Robots ────────────────────────────────────
    if (noindex) {
      setMeta('name', 'robots', 'noindex, nofollow')
    }

    // ── Canonical ───────────────────────────────────
    const canonicalUrl = `${SITE_URL}${canonicalPath || pathname}`
    setLink('canonical', canonicalUrl)

    // ── Open Graph ──────────────────────────────────
    const ogImage = image
      ? image.startsWith('http') ? image : `${SITE_URL}${image}`
      : `${SITE_URL}${DEFAULT_IMAGE}`
    setMeta('property', 'og:title', title || SITE_NAME)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:image', ogImage)
    setMeta('property', 'og:url', canonicalUrl)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:site_name', SITE_NAME)

    // ── Twitter Card ────────────────────────────────
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title || SITE_NAME)
    setMeta('name', 'twitter:description', desc)
    setMeta('name', 'twitter:image', ogImage)

    // ── JSON-LD Schema ──────────────────────────────
    let scriptEl: HTMLScriptElement | null = null
    if (schema) {
      scriptEl = document.createElement('script')
      scriptEl.type = 'application/ld+json'
      const schemas = Array.isArray(schema) ? schema : [schema]
      scriptEl.textContent = JSON.stringify(
        schemas.length === 1 ? schemas[0] : schemas
      )
      document.head.appendChild(scriptEl)
    }

    // ── Cleanup on unmount / re-render ──────────────
    return () => {
      metas.forEach(el => el.remove())
      links.forEach(el => el.remove())
      if (scriptEl) scriptEl.remove()
    }
  }, [title, description, image, type, schema, canonicalPath, pathname, rawTitle, noindex])
}
