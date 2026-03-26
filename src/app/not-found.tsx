import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-blue-600 rounded-lg hover:opacity-90 transition-opacity"
        >
          Go home
        </Link>
      </div>
    </main>
  )
}