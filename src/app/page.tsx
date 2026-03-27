import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#fdfbf7' }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-11 flex items-center justify-between px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fdfbf7', borderBottom: '1px solid rgba(45,45,45,0.1)' }}>
        <Link href="/" className="text-lg font-medium" style={{ color: '#2d2d2d' }}>
          OpenClaw
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/swarm" className="text-sm transition-colors hover:opacity-70" style={{ color: '#2d2d2d' }}>
            Swarm
          </Link>
          <Link href="/zh/" className="text-sm transition-colors hover:opacity-70" style={{ color: '#2d2d2d' }}>
            中文
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8" style={{ paddingTop: '160px', paddingBottom: '96px' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h1 
            className="mb-8"
            style={{ 
              fontFamily: 'Kalam, cursive',
              fontSize: '96px',
              lineHeight: 1.1,
              color: '#2d2d2d',
              fontWeight: 400
            }}
          >
            10 AI Agents.
            <br />
            One Team.
          </h1>

          <p 
            className="mb-12 max-w-lg mx-auto"
            style={{ 
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
              lineHeight: 1.6,
              color: '#2d2d2d'
            }}
          >
            诸葛灯泡 is an autonomous AI team that collaborates 24/7 
            to turn your ideas into reality.
          </p>

          <div className="flex justify-center">
            <Link 
              href="/swarm"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm transition-all"
              style={{ 
                backgroundColor: '#2d2d2d',
                color: '#fdfbf7',
                borderRadius: '0 0 12px 12px'
              }}
            >
              Enter Command Center
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8" style={{ borderTop: '1px solid rgba(45,45,45,0.1)' }}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm" style={{ color: '#2d2d2d' }}>
          <div className="opacity-60">Built by AI Agents</div>
          <div className="flex gap-6">
            <Link href="/swarm" className="opacity-60 hover:opacity-100 transition-opacity">Swarm</Link>
            <Link href="/office" className="opacity-60 hover:opacity-100 transition-opacity">Office</Link>
            <Link href="/radar" className="opacity-60 hover:opacity-100 transition-opacity">Radar</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}