import { Component, type ReactNode } from 'react'

/**
 * Catches render/runtime errors in its children (e.g. WebGL failures in the
 * 3D background) so a single broken effect can never blank the entire page.
 * Renders `fallback` (default: nothing) instead.
 */
export class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    // Keep a breadcrumb in the console without crashing the app.
    console.warn('[OwnTheHomeScreen] A non-critical component failed and was skipped:', error)
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null
    return this.props.children
  }
}
