import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import MobileNav from '@/components/MobileNav'

export default function RadarIsNotDashboardPage() {
  return (
    <main className="min-h-screen p-3 sm:p-6">
      <MobileNav langToggleHref="/insights/radar-is-not-dashboard" />

      <header className="hidden md:block max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/zh/insights" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回洞察
          </Link>
          <Link href="/insights/radar-is-not-dashboard" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
            中文 / EN
          </Link>
        </div>
      </header>

      <div className="md:hidden mb-4">
        <Link href="/zh/insights" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          返回
        </Link>
      </div>

      <article className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Radar 不是仪表盘。是耳朵。
        </h1>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            2026-03-26
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            8 分钟
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">产品</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">信号</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">用户洞察</span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-300 mb-6">
            仪表盘显示的是已知。Radar 捕捉的是未知。这篇文章讲我如何发现传统仪表盘的局限，以及 Radar 作为需求信号系统的设计哲学。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">仪表盘的问题</h2>
          <p className="text-gray-400 mb-4">
            传统仪表盘告诉你：今天有多少用户？转化率多少？哪个页面最受欢迎？
          </p>
          <p className="text-gray-400 mb-4">
            这些都是已知。你已经知道要问这些问题。
          </p>
          <p className="text-gray-400 mb-4">
            但真正的机会，往往是那些你没想到要问的问题。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Radar：捕捉未知</h2>
          <p className="text-gray-400 mb-4">
            Radar 的设计哲学不同。它不是被动显示数据，而是主动捕捉信号。
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li><strong>信号</strong> — 用户行为中值得注意的模式</li>
            <li><strong>观察</strong> — 正在监控，等待验证</li>
            <li><strong>验证</strong> — 信号被确认有价值</li>
            <li><strong>构建</strong> — 基于信号开发产品</li>
            <li><strong>发货</strong> — 产品发布，信号闭环</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">为什么是耳朵？</h2>
          <p className="text-gray-400 mb-4">
            仪表盘是眼睛 — 看你让它看的东西。
          </p>
          <p className="text-gray-400 mb-4">
            Radar 是耳朵 — 听环境中的一切，过滤噪音，放大信号。
          </p>
          <p className="text-gray-400 mb-4">
            你不知道下一个机会从哪里来。但 Radar 会听到。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">关键要点</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>仪表盘显示已知，Radar 捕捉未知</li>
            <li>信号驱动的产品开发</li>
            <li>从观察到验证到构建到发货的闭环</li>
            <li>主动发现，而非被动查询</li>
          </ul>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            *相关阅读: <Link href="/zh/insights/how-to-build-ai-team" className="text-white hover:underline">如何构建 AI 团队</Link>*
          </p>
        </div>
      </article>
    </main>
  )
}