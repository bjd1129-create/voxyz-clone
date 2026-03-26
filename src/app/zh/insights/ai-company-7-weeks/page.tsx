import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import MobileNav from '@/components/MobileNav'

export default function AICompany7WeeksPage() {
  return (
    <main className="min-h-screen p-3 sm:p-6">
      <MobileNav langToggleHref="/insights/ai-company-7-weeks" />

      <header className="hidden md:block max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/zh/insights" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回洞察
          </Link>
          <Link href="/insights/ai-company-7-weeks" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
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
          我建了一个 AI 公司。7 周后，它们比我还了解公司。
        </h1>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            2026-03-26
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            10 分钟
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">AI Agents</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">创业</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">系统设计</span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-300 mb-6">
            诸葛灯泡从 0 到真正运转，花了 7 周。这篇文章讲我是怎么把 6 个 Agent 放在一起，让它们真正成为团队，而不是 6 个独立工具。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">起点：一个人，一个想法</h2>
          <p className="text-gray-400 mb-4">
            7 周前，我有一个想法：能不能用 AI Agent 组建一个真正运转的公司？
          </p>
          <p className="text-gray-400 mb-4">
            不是演示。不是玩具。是真正能干活、能协作、能进化的团队。
          </p>
          <p className="text-gray-400 mb-4">
            我从一个人开始。没有团队。没有资金。只有一个 OpenClaw 实例和一个目标。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">6 个 Agent 的诞生</h2>
          <p className="text-gray-400 mb-4">
            我没有试图做一个超级 Agent。我选择了另一个方向：专业化分工。
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li><strong>造梦者</strong> — 系统管理 + 进化</li>
            <li><strong>掌舵人</strong> — 任务协调 + 分配</li>
            <li><strong>代码侠</strong> — 技术开发</li>
            <li><strong>文案君</strong> — 内容创作</li>
            <li><strong>洞察者</strong> — 研究分析</li>
            <li><strong>配色师</strong> — 视觉设计</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">它们比我更了解公司</h2>
          <p className="text-gray-400 mb-4">
            7 周后，发生了一件有趣的事。
          </p>
          <p className="text-gray-400 mb-4">
            我问一个问题，它们比我还清楚答案。我忘了某件事，它们记得。我做了某个决定，它们知道原因。
          </p>
          <p className="text-gray-400 mb-4">
            因为所有决策都记录在共享记忆里。每个 Agent 都能访问。它们不是孤立工作——它们共享一个大脑。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">关键要点</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>专业分工 > 超级 Agent</li>
            <li>共享记忆是团队的核心</li>
            <li>心跳检查保持团队一致</li>
            <li>持续进化是目标</li>
          </ul>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            *相关阅读: <Link href="/zh/insights/how-to-build-ai-team" className="text-white hover:underline">如何构建 AI 团队</Link> | <Link href="/zh/insights/more-rules-less-obedient" className="text-white hover:underline">规则写得越多，Agent 越不听话</Link>*
          </p>
        </div>
      </article>
    </main>
  )
}