import { useEffect } from 'react'

/**
 * Sets the browser tab title. Appends the site name suffix unless
 * the page is the home page (pass no title or empty string).
 */
export default function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title
      ? `${title} — Society of Professional Economists`
      : 'Society of Professional Economists'
  }, [title])
}
