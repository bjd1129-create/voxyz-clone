'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-400 mb-8">{error.message || 'An unexpected error occurred'}</p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}