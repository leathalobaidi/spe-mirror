import { useState, useEffect, useRef } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const acceptRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const consent = localStorage.getItem('spe-cookie-consent')
    if (!consent) {
      setTimeout(() => setVisible(true), 1500)
    }
  }, [])

  useEffect(() => {
    if (visible) acceptRef.current?.focus()
  }, [visible])

  const accept = () => {
    localStorage.setItem('spe-cookie-consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('spe-cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 cookie-banner" role="alertdialog" aria-label="Cookie consent" aria-describedby="cookie-desc">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-spe-divider/20 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-spe-ink font-medium">We value your privacy</p>
            <p id="cookie-desc" className="text-xs text-spe-muted mt-1 leading-relaxed">
              This website uses essential cookies to ensure functionality. No tracking or analytics cookies are used without your consent.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={decline}
              className="px-4 py-2.5 text-sm font-medium text-spe-muted hover:text-spe-ink border border-spe-divider/40 rounded-lg hover:bg-spe-paper transition-colors focus-ring min-h-[44px]"
            >
              Decline
            </button>
            <button
              ref={acceptRef}
              onClick={accept}
              className="px-4 py-2.5 text-sm font-medium text-white bg-spe-blue rounded-lg hover:bg-spe-deep transition-colors shadow-sm focus-ring min-h-[44px]"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
