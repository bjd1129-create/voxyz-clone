import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import MobileNav from '@/components/MobileNav'

export default function OpenClawAgentDevelopmentPage() {
  return (
    <main className="min-h-screen p-3 sm:p-6">
      <MobileNav langToggleHref="/insights/openclaw-agent-development" />

      <header className="hidden md:block max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/zh/insights" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回洞察
          </Link>
          <Link href="/insights/openclaw-agent-development" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
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
          OpenClaw Agent 开发经验：角色、工具与协作
        </h1>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            2026-03-18
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            10 分钟
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">开发</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">实践</span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-300 mb-6">
            分享开发专业 Agent 的实践经验。如何定义角色性格、选择工具集、设计协作流程，以及学到的教训。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">起点：SOUL.md</h2>
          <p className="text-gray-400 mb-4">
            每个 Agent 从 SOUL.md 文件开始，定义：
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li><strong>名称与身份</strong> — 他们是谁</li>
            <li><strong>使命</strong> — 他们来这里做什么</li>
            <li><strong>性格</strong> — 他们如何沟通</li>
            <li><strong>关系</strong> — 他们与谁合作</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">教训</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>从身份开始，而不是规则</li>
            <li>限制工具以防止混乱</li>
            <li>明确设计交接点</li>
            <li>共享记忆至关重要</li>
            <li>心跳检查保持所有人一致</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">关键要点</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>身份 > 规则，决定 Agent 行为</li>
            <li>最小工具集提高专注度</li>
            <li>明确的协作模式防止混乱</li>
            <li>共享记忆是团队的大脑</li>
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