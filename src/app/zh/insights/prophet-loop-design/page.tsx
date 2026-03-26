import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import MobileNav from '@/components/MobileNav'

export default function ProphetLoopDesignPage() {
  return (
    <main className="min-h-screen p-3 sm:p-6">
      <MobileNav langToggleHref="/insights/prophet-loop-design" />

      <header className="hidden md:block max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/zh/insights" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回洞察
          </Link>
          <Link href="/insights/prophet-loop-design" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
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
          Prophet Loop 实践：让 AI 团队持续进化
        </h1>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            2026-03-22
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            6 分钟
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">技术</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">OpenClaw</span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-300 mb-6">
            探索如何构建数据闭环系统，让每个任务都成为学习机会。从数据收集、知识积累到能力迭代的全栈实践。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">什么是 Prophet Loop？</h2>
          <p className="text-gray-400 mb-4">
            Prophet Loop 是 AI 团队的持续改进循环：
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li><strong>执行</strong> — Agent 执行任务</li>
            <li><strong>记录</strong> — 事件被捕获到共享记忆</li>
            <li><strong>分析</strong> — 识别模式</li>
            <li><strong>进化</strong> — Agent 更新行为</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">关键要点</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>每个任务都是学习机会</li>
            <li>事件通过聚合变成洞察</li>
            <li>洞察通过提案变成行动</li>
            <li>循环永不停止 — 持续进化</li>
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