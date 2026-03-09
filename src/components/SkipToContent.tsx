/**
 * Accessible skip-to-content link. Visually hidden until focused
 * via keyboard navigation, allowing screen-reader and keyboard users
 * to bypass the navigation and jump straight to the page content.
 */
export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-spe-blue focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-none"
    >
      Skip to main content
    </a>
  )
}
