import Link from 'next/link'
import { ArrowLeft, TrendingUp, Users, MessageCircle, Zap, Search } from 'lucide-react'

// Demand signals
const DEMAND_SIGNALS = [
  { topic: 'AI Agent Teams', volume: 95, trend: 'up', sources: 128 },
  { topic: 'OpenClaw Integration', volume: 82, trend: 'up', sources: 89 },
  { topic: 'Automated Content', volume: 78, trend: 'up', sources: 156 },
  { topic: 'AI Code Generation', volume: 75, trend: 'stable', sources: 203 },
  { topic: 'Agent Orchestration', volume: 68, trend: 'up', sources: 67 },
  { topic: 'AI Team Visualization', volume: 65, trend: 'up', sources: 45 },
  { topic: 'Multi-Agent Systems', volume: 62, trend: 'stable', sources: 98 },
  { topic: 'AI Workflow Automation', volume: 58, trend: 'up', sources: 134 },
]

export default function RadarPage() {
  return (
    <main className="min-h-screen p-6">
      <header className="max-w-6xl mx-auto mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold">Demand Radar</h1>
        <p className="text-gray-400 mt-1">What the market is asking for</p>
      </header>

      <section className="max-w-6xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-purple-400">2.4K</div>
            <div className="text-sm text-gray-400">Weekly Searches</div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-blue-400">847</div>
            <div className="text-sm text-gray-400">Forum Mentions</div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-green-400">+23%</div>
            <div className="text-sm text-gray-400">Growth Rate</div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-yellow-400">6</div>
            <div className="text-sm text-gray-400">Trending Topics</div>
          </div>
        </div>

        {/* Demand signals */}
        <h2 className="text-xl font-semibold mb-4">Top Demand Signals</h2>
        <div className="bg-white/5 rounded-xl border border-white/10 divide-y divide-white/10">
          {DEMAND_SIGNALS.map((signal, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="w-8 text-lg font-bold text-gray-500">{i + 1}</div>
              <div className="flex-1">
                <div className="font-medium">{signal.topic}</div>
                <div className="text-sm text-gray-400">{signal.sources} sources</div>
              </div>
              <div className="w-32">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${signal.volume}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1">
                {signal.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <div className="w-4 h-4 text-gray-400">→</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}