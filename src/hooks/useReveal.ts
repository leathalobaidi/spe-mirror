import { useEffect, useRef } from 'react'

/**
 * Intersection Observer hook for scroll-triggered reveal animations.
 * Add className="reveal" to elements you want to animate in.
 * Wrap in a container with className="reveal-stagger" for staggered delays.
 *
 * Uses both IntersectionObserver and a scroll fallback to ensure
 * elements always become visible regardless of browser quirks.
 *
 * @param trigger — optional value that triggers a re-scan when it changes.
 *   Pass a data length or boolean so the hook picks up dynamically-rendered
 *   `.reveal` elements that weren't in the DOM on first mount.
 */
export function useReveal(trigger?: unknown) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const elements = Array.from(container.querySelectorAll('.reveal'))

    const revealIfVisible = (el: Element) => {
      if (el.classList.contains('visible')) return
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
        el.classList.add('visible')
      }
    }

    // Immediately reveal elements already in/near viewport
    elements.forEach(revealIfVisible)

    // IntersectionObserver — primary mechanism
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '100px', threshold: 0 }
    )

    elements.forEach(el => {
      if (!el.classList.contains('visible')) {
        observer.observe(el)
      }
    })

    // Scroll fallback — catches anything the observer misses
    const onScroll = () => {
      elements.forEach(revealIfVisible)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Safety net — reveal everything after 3s regardless
    const safetyTimer = setTimeout(() => {
      elements.forEach(el => el.classList.add('visible'))
    }, 3000)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      clearTimeout(safetyTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  return containerRef
}
