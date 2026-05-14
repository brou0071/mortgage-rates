import { Component, type ReactNode } from 'react'
import i18n from '../i18n'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: ReactNode
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo)
  }

  render() {
    const { hasError, error } = this.state
    const t = i18n.t.bind(i18n)

    if (hasError) {
      return (
        <main className="error-boundary">
          <section className="center">
            <h1>{t('errorBoundary.title')}</h1>
            <p>{error?.message ?? t('errorBoundary.defaultMessage')}</p>
            <button type="button" onClick={() => window.location.reload()}>
              {t('errorBoundary.reload')}
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
