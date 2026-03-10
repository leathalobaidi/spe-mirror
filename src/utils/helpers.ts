export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function getYear(dateStr: string): number {
  try {
    const date = new Date(dateStr)
    return date.getFullYear()
  } catch {
    return 0
  }
}

export function truncateText(text: string, maxLength: number = 150): string {
  if (!text || text.length <= maxLength) return text || ''
  const stripped = text.replace(/<[^>]*>/g, '')
  if (stripped.length <= maxLength) return stripped
  return stripped.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

/** Phrases that indicate scraped CMS login/members-only boilerplate */
const BOILERPLATE_PHRASES = [
  'login to comment',
  'please login',
  'please register',
  'this content can be accessed by members',
  'to access please login',
  'login or register',
]

export function stripHtml(html: string): string {
  const text = html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim()

  // If the remaining text is just CMS boilerplate, return empty
  const lower = text.toLowerCase()
  if (BOILERPLATE_PHRASES.some(phrase => lower.includes(phrase))) {
    return ''
  }

  return text
}

/**
 * Resolve an image path from scraped data to a full URL.
 *
 * Local relative paths like `/images/15308/foo.webp` were the original
 * CMS asset paths on spe.org.uk. The scraper didn't download all of them,
 * so we point them at the live site's asset directory instead.
 *
 * Absolute URLs (https://…) and already-resolved paths are returned as-is.
 */
const SPE_ASSET_BASE = 'https://spe.org.uk/site/assets/files'

export function resolveImageUrl(src: string | undefined): string | undefined {
  if (!src) return undefined
  // Already an absolute URL — leave as-is
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  // Local CMS asset path → resolve to live site
  if (src.startsWith('/images/')) {
    return SPE_ASSET_BASE + src.replace(/^\/images/, '')
  }
  return src
}

export function getUniqueYears(dates: string[]): number[] {
  const years = dates.map(getYear).filter(y => y > 0)
  return [...new Set(years)].sort((a, b) => b - a)
}

/**
 * Sanitise CMS body HTML for safe rendering.
 *
 * Handles legacy CMS artefacts from the original Squarespace/ProcessWire site:
 *
 * 1. Wraps absolute-positioned iframes in 16:9 responsive containers.
 * 2. Removes orphaned Vimeo thumbnail imgs (IE8 fallbacks).
 * 3. Removes IE8 warning paragraphs.
 * 4. Resolves old CMS image paths so inline imgs render from the live site.
 */
export function sanitiseBodyHtml(html: string): string {
  if (!html) return ''

  return html
    // Remove "Login to comment" links (old CMS artefact)
    .replace(/<a[^>]*class=["']login btn["'][^>]*>[\s\S]*?<\/a>/gi, '')
    // Remove "members-notice" gated-content banners
    .replace(/<div[^>]*class=["']members-notice["'][^>]*>[\s\S]*?<\/div>/gi, '')
    // Wrap absolute-positioned iframes in a responsive 16:9 container
    .replace(
      /<iframe([^>]*style=['"][^'"]*position:\s*absolute[^'"]*['"][^>]*)><\/iframe>/gi,
      (_match, attrs: string) => {
        const cleanAttrs = attrs
          .replace(/style=['"][^'"]*['"]/gi, '')
        return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:1.5rem 0"><iframe${cleanAttrs} style="position:absolute;top:0;left:0;width:100%;height:100%" allowfullscreen></iframe></div>`
      }
    )
    // Remove orphaned Vimeo thumbnail images (IE8 fallbacks)
    .replace(/<img[^>]*vimeocdn\.com[^>]*\/?>/gi, '')
    // Remove IE8 warning paragraphs
    .replace(/<p[^>]*>Sorry:\s*IE8 cannot display[^<]*<\/p>/gi, '')
    // Resolve old CMS image paths: /images/NNNNN/… → live site asset URL
    .replace(
      /(<img[^>]*src=["'])\/images\//gi,
      `$1${SPE_ASSET_BASE}/`
    )
    // Resolve relative /site/assets/files/… paths → absolute live URL
    .replace(
      /(<img[^>]*src=["'])\/site\/assets\/files\//gi,
      `$1${SPE_ASSET_BASE}/`
    )
    // Remove empty CMS wrapper divs (clearfix, body_image_container)
    .replace(/<div[^>]*class=["']clearfix["'][^>]*>\s*<\/div>/gi, '')
    .replace(/<div[^>]*class=["']body_image_container[^"']*["'][^>]*>\s*<\/div>/gi, '')
}
