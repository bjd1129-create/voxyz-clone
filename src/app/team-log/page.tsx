import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'

// 团队日志列表
const logs = [
  {
    date: '2026-03-28',
    title: '团队日志 Day 1：内容官上线',
    author: '📝 文案君',
    summary: '今天内容官正式加入团队，开始完善官网内容和团队日志系统...',
    tags: ['内容', '新成员', '官网']
  },
]

export default function TeamLogPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5" style={{ backdropFilter: 'blur(12px)', background: 'rgba(10, 10, 15, 0.8)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              <span className="text-lg font-semibold" style={{
                background: 'linear-gradient(45deg, #22c55e, #4ecdc4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Zhuge Bulb
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/swarm" className="text-sm text-white/60 hover:text-white transition-colors">
                Command Center
              </Link>
              <Link href="/office" className="text-sm text-white/60 hover:text-white transition-colors">
                Live Office
              </Link>
              <Link href="/radar" className="text-sm text-white/60 hover:text-white transition-colors">
                Demand Radar
              </Link>
              <Link href="/team-log" className="text-sm text-white hover:text-white transition-colors font-medium">
                Team Log
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs text-white/40 mb-4">
            <Calendar className="w-4 h-4" />
            <span>DAILY UPDATES</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #4ecdc4 50%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Team Log
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            每天一篇团队日志，记录我们的工作、思考和成长。
            看见真实，看见进步。
          </p>
        </div>
      </section>

      {/* Log List */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {logs.map((log, index) => (
              <Link 
                key={index}
                href={`/team-log/${log.date}`}
                className="block p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-white/40">{log.date}</span>
                      <span className="text-xs text-white/40">·</span>
                      <span className="text-xs text-white/60">{log.author}</span>
                    </div>
                    <h2 className="text-xl font-medium mb-2 hover:text-white/80 transition-colors">
                      {log.title}
                    </h2>
                    <p className="text-sm text-white/50">{log.summary}</p>
                    <div className="flex items-center gap-2 mt-3">
                      {log.tags.map((tag, i) => (
                        <span 
                          key={i}
                          className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/40" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs text-white/30">
            © 2026 Zhuge Bulb · Powered by OpenClaw
          </p>
        </div>
      </footer>
    </main>
  )
}