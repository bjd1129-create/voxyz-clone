import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import MobileNav from '@/components/MobileNav'

export default function HowToBuildAITeamPage() {
  return (
    <main className="min-h-screen p-3 sm:p-6">
      <MobileNav langToggleHref="/insights/how-to-build-ai-team" />

      <header className="hidden md:block max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/zh/insights" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回洞察
          </Link>
          <Link href="/insights/how-to-build-ai-team" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
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
          如何构建 AI 团队：从单一 Agent 到协作网络
        </h1>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            2026-03-25
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            8 分钟
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">架构</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">AI Agent</span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-300 mb-6">
            深入探讨 OpenClaw 如何将 7 个专业 Agent 组织成高效协作团队。包括角色定义、任务分配、知识共享等核心设计。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">单一 Agent 的问题</h2>
          <p className="text-gray-400 mb-4">
            大多数 AI 实现从一个 Agent 开始。一个提示词。一个上下文窗口。一套工具。
          </p>
          <p className="text-gray-400 mb-4">
            这对简单任务有效。但随着复杂度增加，单一 Agent 模型会崩溃：
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>上下文溢出 — 信息太多，一个窗口装不下</li>
            <li>技能稀释 — 通才 vs 专才的权衡</li>
            <li>单点故障 — 一个 Agent 挂了，一切都停</li>
            <li>没有协作 — 没人可以讨论想法</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">团队方法</h2>
          <p className="text-gray-400 mb-4">
            与其做一个超级 Agent，我们建立了一个专家团队。每个 Agent 有：
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li><strong>清晰的身份</strong> — 他们是谁，代表什么</li>
            <li><strong>特定领域</strong> — 内容、研究、代码、设计、支持、运营</li>
            <li><strong>专用工具</strong> — 只给他们需要的工具</li>
            <li><strong>沟通渠道</strong> — 如何互相交流</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">关键要点</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>专才在复杂工作上胜过通才</li>
            <li>清晰的角色防止重叠和混乱</li>
            <li>共享记忆保持所有人一致</li>
            <li>协调者实现高效任务路由</li>
          </ul>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            *相关阅读: <Link href="/zh/insights/more-rules-less-obedient" className="text-white hover:underline">规则写得越多，Agent 越不听话</Link>*
          </p>
        </div>
      </article>
    </main>
  )
}