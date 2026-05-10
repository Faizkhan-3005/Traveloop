import React from 'react'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("[GLOBAL ERROR]", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 rounded-[2.5rem] bg-red-50 dark:bg-red-900/10 flex items-center justify-center border border-red-100 dark:border-red-900/30 mb-8">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Something went wrong
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 font-medium">
            We've encountered an unexpected error. Don't worry, your data is safe.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary h-12 px-8"
            >
              <RotateCcw className="w-4 h-4" />
              Reload Page
            </button>
            <a 
              href="/app/dashboard"
              className="btn-secondary h-12 px-8"
            >
              <Home className="w-4 h-4" />
              Return Home
            </a>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 p-6 bg-red-50 dark:bg-red-900/5 rounded-2xl border border-red-100 dark:border-red-900/20 text-left max-w-2xl w-full overflow-auto">
              <p className="text-xs font-black uppercase text-red-500 mb-2 tracking-widest">Error Details (Dev Only)</p>
              <code className="text-[10px] text-red-600 dark:text-red-400 font-mono">
                {this.state.error?.toString()}
              </code>
            </div>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
