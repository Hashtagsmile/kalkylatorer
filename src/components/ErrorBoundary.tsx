import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../config/links'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * Fångar React-fel i underträd och visar fallback-UI istället för att krascha hela appen.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div className="min-h-[40vh] flex flex-col items-center justify-center px-4 py-12">
          <div className="max-w-md text-center">
            <h2 className="text-xl font-semibold text-stone-800 mb-2">
              Något gick fel
            </h2>
            <p className="text-stone-600 mb-6">
              Ett oväntat fel inträffade. Sidan kunde inte laddas. Försök ladda om eller gå tillbaka till startsidan.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-lg bg-stone-100 text-stone-800 font-medium text-sm hover:bg-stone-200 transition-colors"
              >
                Ladda om
              </button>
              <Link
                to={ROUTES.home}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition-colors"
              >
                Till startsidan
              </Link>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
