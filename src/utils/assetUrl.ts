/**
 * Prefix a local asset path with the Vite base URL so it resolves
 * correctly on GitHub Pages (where base is `/spe-mirror/`).
 *
 * Paths handled by React Router `<Link>` don't need this — only raw
 * `<a href>`, `<img src>`, etc. that bypass the router.
 *
 * @example assetUrl('/images/logo.webp') → '/spe-mirror/images/logo.webp'
 */
export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
