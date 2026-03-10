import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SearchOverlay from '../components/SearchOverlay'
import BackToTop from '../components/BackToTop'
import CookieBanner from '../components/CookieBanner'
import ScrollToTop from '../components/ScrollToTop'
import SkipToContent from '../components/SkipToContent'

export default function MainLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <SkipToContent />
      <Navbar />
      {/* Add top padding for fixed navbar, except on home (hero is full-bleed) */}
      {/* Mobile: h-14 nav only (56px). Desktop: h-8 accent + h-14 nav (88px) */}
      <main id="main-content" className={`flex-1 ${isHome ? '' : 'pt-14 lg:pt-[5.5rem]'}`}>
        <Outlet />
      </main>
      <Footer />
      <SearchOverlay />
      <BackToTop />
      <CookieBanner />
    </div>
  )
}
