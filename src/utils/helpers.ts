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

export function getUniqueYears(dates: string[]): number[] {
  const years = dates.map(getYear).filter(y => y > 0)
  return [...new Set(years)].sort((a, b) => b - a)
}

/**
 * Sanitise CMS body HTML for safe rendering via dangerouslySetInnerHTML.
 *
 * The original Squarespace site wrapped Vimeo/YouTube iframes in a
 * responsive container (position:relative + padding-bottom:56.25%).
 * The scraper captured the iframe but NOT the wrapper, so the
 * position:absolute iframe escapes its container and covers the
 * viewport.  This function:
 *
 * 1. Wraps every <iframe> that has position:absolute in a 16:9
 *    responsive container so it renders correctly.
 * 2. Removes orphaned Vimeo thumbnail <img> tags (IE8 fallbacks).
 * 3. Removes "Sorry: IE8 cannot display" messages.
 */
export function sanitiseBodyHtml(html: string): string {
  if (!html) return ''

  return html
    // Wrap absolute-positioned iframes in a responsive 16:9 container
    .replace(
      /<iframe([^>]*style=['"][^'"]*position:\s*absolute[^'"]*['"][^>]*)><\/iframe>/gi,
      (_match, attrs: string) => {
        // Strip the inline position/size styles — the wrapper handles them
        const cleanAttrs = attrs
          .replace(/style=['"][^'"]*['"]/gi, '')
        return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:1.5rem 0"><iframe${cleanAttrs} style="position:absolute;top:0;left:0;width:100%;height:100%" allowfullscreen></iframe></div>`
      }
    )
    // Remove orphaned Vimeo thumbnail images (IE8 fallbacks)
    .replace(/<img[^>]*vimeocdn\.com[^>]*\/?>/gi, '')
    // Remove IE8 warning paragraphs
    .replace(/<p[^>]*>Sorry:\s*IE8 cannot display[^<]*<\/p>/gi, '')
}
