import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

// Lazy-load pages for code splitting — each page and its JSON data
// will be in a separate chunk, loaded only when the route is visited
const Home = lazy(() => import('./pages/Home'))
const Events = lazy(() => import('./pages/Events'))
const EventDetail = lazy(() => import('./pages/EventDetail'))
const Podcasts = lazy(() => import('./pages/Podcasts'))
const PodcastDetail = lazy(() => import('./pages/PodcastDetail'))
const ReadingRoom = lazy(() => import('./pages/ReadingRoom'))
const BookReviews = lazy(() => import('./pages/BookReviews'))
const BookReviewDetail = lazy(() => import('./pages/BookReviewDetail'))
const Articles = lazy(() => import('./pages/Articles'))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'))
const RybEssays = lazy(() => import('./pages/RybEssays'))
const RybEssayDetail = lazy(() => import('./pages/RybEssayDetail'))
const RybczynskiTimeline = lazy(() => import('./pages/RybczynskiTimeline'))
const News = lazy(() => import('./pages/News'))
const NewsDetail = lazy(() => import('./pages/NewsDetail'))
const About = lazy(() => import('./pages/About'))
const Council = lazy(() => import('./pages/Council'))
const CouncilMemberDetail = lazy(() => import('./pages/CouncilMemberDetail'))
const Speakers = lazy(() => import('./pages/Speakers'))
const EveningTalks = lazy(() => import('./pages/EveningTalks'))
const EveningTalkDetail = lazy(() => import('./pages/EveningTalkDetail'))
const ConferenceReports = lazy(() => import('./pages/ConferenceReports'))
const ConferenceReportDetail = lazy(() => import('./pages/ConferenceReportDetail'))
const DinnerReviews = lazy(() => import('./pages/DinnerReviews'))
const DinnerReviewDetail = lazy(() => import('./pages/DinnerReviewDetail'))
const Blogs = lazy(() => import('./pages/Blogs'))
const BlogDetail = lazy(() => import('./pages/BlogDetail'))
const SalarySurveys = lazy(() => import('./pages/SalarySurveys'))
const MembersPolls = lazy(() => import('./pages/MembersPolls'))
const Membership = lazy(() => import('./pages/Membership'))
const MemberDirectory = lazy(() => import('./pages/MemberDirectory'))
const Careers = lazy(() => import('./pages/Careers'))
const Contact = lazy(() => import('./pages/Contact'))
const FAQs = lazy(() => import('./pages/FAQs'))
const Advertise = lazy(() => import('./pages/Advertise'))
const GenericPage = lazy(() => import('./pages/GenericPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 border-2 border-spe-blue/10 rounded-full" />
          <div className="absolute inset-0 border-2 border-transparent border-t-spe-blue rounded-full animate-spin" />
        </div>
        <p className="text-sm text-spe-grey font-light tracking-wide">Loading…</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          {/* Events */}
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventDetail />} />

          {/* Podcasts & Talks */}
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/podcasts/:slug" element={<PodcastDetail />} />

          {/* Speakers — evening talks, conference reports, dinner reviews */}
          <Route path="/speakers" element={<Speakers />} />
          <Route path="/speakers/evening-talks" element={<EveningTalks />} />
          <Route path="/speakers/evening-talks/:slug" element={<EveningTalkDetail />} />
          <Route path="/speakers/conference-reports" element={<ConferenceReports />} />
          <Route path="/speakers/conference-reports/:slug" element={<ConferenceReportDetail />} />
          <Route path="/speakers/dinner-reviews" element={<DinnerReviews />} />
          <Route path="/speakers/dinner-reviews/:slug" element={<DinnerReviewDetail />} />

          {/* Reading Room */}
          <Route path="/reading-room" element={<ReadingRoom />} />
          <Route path="/reading-room/book-reviews" element={<BookReviews />} />
          <Route path="/reading-room/book-reviews/:slug" element={<BookReviewDetail />} />
          <Route path="/reading-room/articles" element={<Articles />} />
          <Route path="/reading-room/articles/:slug" element={<ArticleDetail />} />
          <Route path="/reading-room/rybczynski-prize" element={<RybczynskiTimeline />} />
          <Route path="/reading-room/rybczynski-essays" element={<RybEssays />} />
          <Route path="/reading-room/rybczynski-essays/:slug" element={<RybEssayDetail />} />
          <Route path="/reading-room/salary-surveys" element={<SalarySurveys />} />
          <Route path="/reading-room/members-polls" element={<MembersPolls />} />
          <Route path="/reading-room/*" element={<GenericPage />} />

          {/* News */}
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />

          {/* Blog */}
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />

          {/* About — bespoke landing page + Council + sub-pages via GenericPage */}
          <Route path="/about" element={<About />} />
          <Route path="/about/council" element={<Council />} />
          <Route path="/about/council/:slug" element={<CouncilMemberDetail />} />
          <Route path="/about/*" element={<GenericPage />} />

          {/* Membership section */}
          <Route path="/membership" element={<Membership />} />
          <Route path="/membership/directory" element={<MemberDirectory />} />
          <Route path="/membership/*" element={<GenericPage />} />

          {/* Careers / Professional development */}
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/*" element={<GenericPage />} />

          {/* Standalone pages */}
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/site-policies" element={<GenericPage />} />
          <Route path="/contact" element={<Contact />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
