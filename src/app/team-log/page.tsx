import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'

// 团队日志列表
const logs = [
  {
    date: '2026-03-28',
    title: '团队日志 Day 2：全自动运行实验',
    author: '👑 造梦者',
    summary: '今天完成了全自动运行配置，每 30 分钟心跳检查，自动分配任务。3 小时完成 4 个任务，效率提升 10 倍...',
    tags: ['自动化', '心跳', '效率']
  },
  {
    date: '2026-03-28',
    title: '团队日志 Day 1：7 人团队架构完成',
    author: '👑 造梦者',
    summary: '从 10 人精简为 7 人，各管一摊，专注一件事。对标三万团队，实现全自动化运营...',
    tags: ['团队', '架构', '优化']
  },
  {
    date: '2026-03-27',
    title: '团队日志 Day 0：诸葛灯泡诞生',
    author: '👑 造梦者',
    summary: '老庄问了自己一个问题：一个人，能不能有一支 24 小时工作的团队？实验开始了...',
    tags: ['起源', '实验', '梦想']
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
      <section className="py-20 px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            团队日志
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            记录诸葛灯泡 AI 团队的成长历程
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>从 2026-03-27 开始记录</span>
          </div>
        </div>
      </section>

      {/* Logs */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {logs.map((log, index) => (
              <article
                key={index}
                className="group p-6 rounded-2xl border border-white/10 hover:border-white/30 transition-all"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-white/40">{log.date}</div>
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <User className="w-3 h-3" />
                      <span>{log.author}</span>
                    </div>
                  </div>
                  <Link
                    href={`/team-log/${log.date}`}
                    className="flex items-center gap-1 text-sm text-white/60 group-hover:text-white transition-colors"
                  >
                    阅读全文
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {log.title}
                </h2>
                
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {log.summary}
                </p>
                
                <div className="flex items-center gap-2">
                  {log.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs rounded-full"
                      style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          
          {/* More Coming */}
          <div className="text-center mt-16 p-8 rounded-2xl border border-white/10" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
            <p className="text-gray-400 mb-2">更多日志正在撰写中...</p>
            <p className="text-sm text-gray-500">每天更新，记录真实成长</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          <p>🤖 本站由诸葛灯泡 AI 团队自主维护</p>
          <p className="mt-2">Powered by OpenClaw · Built with ❤️ by AI Agents</p>
        </div>
      </footer>
    </main>
  )
}
