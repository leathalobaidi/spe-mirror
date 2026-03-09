import { useState, useRef } from 'react'

interface Props {
  videoId: string
  title?: string
  subtitle?: string
}

export default function HeroVideo({ videoId, title, subtitle }: Props) {
  const [isHovered, setIsHovered] = useState(false)
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
    <section className="relative bg-gradient-to-br from-spe-deep2 via-spe-deep to-spe-blue overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03] hero-pattern" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 py-16 sm:py-20 lg:py-24">
          {/* Left — text content */}
          <div className="flex-1 text-white z-10">
            {title && (
              <h1 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl mb-5 leading-[1.1]">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-lg sm:text-xl text-white/75 font-light leading-relaxed mb-8 max-w-lg">
                {subtitle}
              </p>
            )}

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/membership"
                className="inline-flex items-center gap-2 bg-white text-spe-deep font-semibold px-6 py-3 rounded-lg hover:bg-spe-light transition-colors"
              >
                Join the SPE
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="/events"
                className="inline-flex items-center gap-2 text-white/80 font-medium hover:text-white transition-colors"
              >
                Upcoming Events
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right — video clip */}
          <div
            className="flex-1 w-full lg:max-w-[55%]"
            onMouseEnter={() => { setIsHovered(true); setIsMuted(false); toggleMute(false) }}
            onMouseLeave={() => { setIsHovered(false); setIsMuted(true); toggleMute(true) }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/30 aspect-video">
              <iframe
                ref={iframeRef}
                src={`https://player.vimeo.com/video/${videoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&quality=1080p`}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen"
                title="SPE Introduction"
              />

              {/* Subtle gradient overlay on video for polish */}
              <div className="absolute inset-0 bg-gradient-to-t from-spe-deep2/30 via-transparent to-transparent pointer-events-none" />

              {/* Audio toggle */}
              <button
                onClick={() => { const next = !isMuted; setIsMuted(next); toggleMute(next) }}
                className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 hover:bg-black/60 transition-all duration-300 focus-ring"
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
                    <svg className="w-3.5 h-3.5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <span className="text-white/80 text-xs font-medium">Listen</span>
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
