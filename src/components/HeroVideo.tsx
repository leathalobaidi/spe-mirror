import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  videoId: string
  title?: string
  subtitle?: string
}

export default function HeroVideo({ videoId, title, subtitle }: Props) {
  const [isMuted, setIsMuted] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Toggle mute via Vimeo postMessage API
  const toggleMute = (muted: boolean) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ method: 'setVolume', value: muted ? 0 : 0.7 }),
        '*'
      )
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-spe-ink via-spe-deep2 to-spe-deep overflow-hidden grain-overlay">
      {/* Subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.04] hero-pattern" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 py-20 sm:py-24 lg:py-28">
          {/* Left — text content */}
          <div className="flex-1 text-white">
            {title && (
              <>
                <div className="inline-flex items-center gap-2 mb-6">
                  <span className="w-8 h-[2px] bg-spe-gold rounded-full" />
                  <span className="text-spe-gold text-xs font-semibold uppercase tracking-[0.15em]">Est. 1953</span>
                </div>
                <h1 className="editorial-heading mb-6 leading-[1.05]" style={{ fontSize: 'clamp(2.25rem, 5vw + 0.5rem, 3.75rem)' }}>
                  {title}
                </h1>
              </>
            )}
            {subtitle && (
              <p className="text-lg sm:text-xl text-white/65 font-light leading-relaxed mb-10 max-w-lg">
                {subtitle}
              </p>
            )}

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/membership"
                className="inline-flex items-center gap-2.5 bg-white text-spe-ink font-semibold px-7 py-3.5 rounded-xl hover:bg-spe-cream transition-colors shadow-lg shadow-black/20 btn-glow"
              >
                Join the SPE
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 text-white/70 font-medium hover:text-white transition-colors group"
              >
                Upcoming Events
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right — video clip */}
          <div
            className="flex-1 w-full lg:max-w-[55%]"
            onMouseEnter={() => { setIsMuted(false); toggleMute(false) }}
            onMouseLeave={() => { setIsMuted(true); toggleMute(true) }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/40 aspect-video ring-1 ring-white/10">
              <iframe
                ref={iframeRef}
                src={`https://player.vimeo.com/video/${videoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&quality=1080p`}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen"
                title="SPE Introduction"
              />

              {/* Gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-spe-ink/40 via-transparent to-transparent pointer-events-none" />

              {/* Audio toggle */}
              <button
                onClick={() => { const next = !isMuted; setIsMuted(next); toggleMute(next) }}
                className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-md rounded-full px-4 py-2.5 min-h-[44px] hover:bg-black/70 transition-all duration-300 focus-ring border border-white/10"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {!isMuted ? (
                  <>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-0.5 bg-white/80 rounded-full waveform-bar" style={{ animationDelay: `${i * 0.12}s` }} />
                      ))}
                    </div>
                    <span className="text-white/80 text-xs font-medium ml-1">Listening</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <span className="text-white/70 text-xs font-medium">Listen</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
