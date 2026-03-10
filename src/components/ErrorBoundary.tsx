import { Component, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Catches render-time errors in the React component tree.
 *
 * Without this, a single malformed data record or broken component
 * would crash the entire SPA with a white screen. The boundary
 * displays a graceful fallback and lets the user navigate away.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log for debugging — safe to leave in production
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-spe-cream mb-6">
            <svg className="w-8 h-8 text-spe-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="editorial-heading text-2xl text-spe-ink mb-3">Something went wrong</h1>
          <p className="text-spe-muted mb-8 leading-relaxed">
            We hit an unexpected error loading this page. You can try refreshing,
            or head back to a page you know works.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 bg-spe-blue text-white font-semibold px-6 py-3 rounded-lg hover:bg-spe-deep transition-colors"
            >
              Refresh page
            </button>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="inline-flex items-center gap-2 text-spe-blue font-medium hover:text-spe-deep transition-colors"
            >
              Go to homepage
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <details className="mt-8 text-left text-xs text-spe-muted bg-spe-cream/50 rounded-lg p-4">
              <summary className="cursor-pointer font-medium text-spe-ink mb-2">Error details (dev only)</summary>
              <pre className="whitespace-pre-wrap break-words font-mono">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    )
  }
}
