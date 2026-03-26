'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
        <p className="text-gray-400 mb-8">{error.message || 'An unexpected error occurred'}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  )
}