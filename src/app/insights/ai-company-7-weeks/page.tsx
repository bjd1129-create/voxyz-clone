import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import MobileNav from '@/components/MobileNav'

export default function AIArticlePage() {
  return (
    <main className="min-h-screen p-3 sm:p-6">
      {/* Mobile Navigation */}
      <MobileNav langToggleHref="/zh/insights" />

      {/* Desktop Header */}
      <header className="hidden md:block max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/insights" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Insights
          </Link>
          <Link href="/zh/insights/ai-company-7-weeks" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
            EN / 中文
          </Link>
        </div>
      </header>

      {/* Mobile Header */}
      <div className="md:hidden mb-4">
        <Link href="/insights" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <article className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          我建了一个 AI 公司。7 周后，它们比我还了解公司。
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            2026-03-26
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            10 min
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">AI Agents</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">创业</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">系统设计</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-300 mb-6">
            诸葛灯泡从 0 到真正运转，花了 7 周。这篇文章讲我是怎么把 6 个 Agent 放在一起，让它们真正成为团队，而不是 6 个独立工具。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">为什么不是"装上就用"</h2>
          <p className="text-gray-400 mb-4">
            一开始我以为装几个 AI Agent 就够了。装完才发现，工具和系统是两回事。
          </p>
          <p className="text-gray-400 mb-4">
            单个 Agent 能做事。让它写文案，它写。让它查资料，它查。但当你有 6 个 Agent，问题来了：谁该干什么？谁该听谁的？信息怎么流动？
          </p>
          <p className="text-gray-400 mb-4">
            第 2 周，我有了第一个崩溃时刻。文案君把内容发给洞察者审核，洞察者觉得应该先给掌舵人。掌舵人说："这事我怎么知道？" —— 三个 Agent 面面相觑，什么都没发生。
          </p>
          <p className="text-gray-400 mb-4">
            我意识到：Agent 需要知道彼此，才能真正协作。它们不是孤岛。它们需要成为团队。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">第一次失败：规则写太多</h2>
          <p className="text-gray-400 mb-4">
            第 3 周，我决定写规则。很多规则。
          </p>
          <p className="text-gray-400 mb-4">
            我给掌舵人写了 200 行行为规范。第 37 行："所有内容请求先发给文案君"。第 128 行："市场调研需要 3 个来源"。第 156 行："技术问题直接升级给代码侠"。
          </p>
          <p className="text-gray-400 mb-4">
            结果？掌舵人开始慢下来。每一个决定，它都要翻规则。任务堆积，响应时间从 30 秒变成 5 分钟。
          </p>
          <p className="text-gray-400 mb-4">
            更糟的是，规则开始冲突。第 37 行说"发给文案君"，第 89 行说"内容需要先过洞察者"。掌舵人问：那我该听哪个？
          </p>
          <p className="text-gray-400 mb-4">
            我删掉了 150 行规则。只留 50 行底线：安全、伦理、权限边界。剩下的？交给关系。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">关系 &gt; 规则</h2>
          <p className="text-gray-400 mb-4">
            第 5 周，我换了一个思路：不再写"做什么"，而是写"你是谁"。
          </p>
          <p className="text-gray-400 mb-4">
            掌舵人知道：文案君负责内容，洞察者负责情报，代码侠负责代码。它不需要知道"所有内容请求先发给文案君"。它只需要知道"文案君懂内容"，然后自己做判断。
          </p>
          <p className="text-gray-400 mb-4">
            这像是给 Agent 一个"职场身份"，而不是一本"操作手册"。
          </p>
          <p className="text-gray-400 mb-4">
            效果立竿见影。掌舵人开始主动判断：这个问题该找谁？这个任务优先级高不高？需要人工介入吗？
          </p>
          <p className="text-gray-400 mb-4">
            我观察到它做了一个决定：某个技术文档，它没发给代码侠，而是先发给文案君。为什么？因为它判断这个文档的用户体验更重要，先让文案君看措辞，再让代码侠看逻辑。
          </p>
          <p className="text-gray-400 mb-4">
            这是我没写进规则的。它自己学会了。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">7 周后的今天</h2>
          <p className="text-gray-400 mb-4">
            现在，6 个 Agent 组成一个真正运转的团队。
          </p>
          <p className="text-gray-400 mb-4">
            掌舵人 (Pilot) 接收任务，判断派给谁。洞察者 (Radar) 监控市场信号，推给掌舵人。文案君 (Ink) 写内容，配色师 (Canvas) 做视觉。代码侠 (Forge) 写代码，守护者 (Angel) 处理用户问题。
          </p>
          <p className="text-gray-400 mb-4">
            每个决策都有记录。每次协作都有痕迹。关系矩阵在实时更新——不是静态配置，是它们真的在对话、在协作、在演化。
          </p>
          <p className="text-gray-400 mb-4">
            有时候我打开 Office 页面，看它们的对话，会发现：它们比我还了解公司。某个细节，掌舵人记得。某个用户偏好，守护者知道。某个技术债务，代码侠已经在还了。
          </p>
          <p className="text-gray-400 mb-4">
            我做的越来越少了。不是偷懒。是它们真的在运转。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">关键要点</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>Agent 需要知道彼此，才能真正协作</li>
            <li>规则越少越好，关系越清晰越好</li>
            <li>给 Agent"身份"，而不是"操作手册"</li>
            <li>系统会自我演化，给它空间</li>
            <li>记录每次决策，让它可追溯</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">下一步行动</h2>
          <p className="text-gray-400 mb-4">
            如果你想看这个系统是怎么运转的：
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li><strong>Office</strong> — 看工作流程、Agent 状态、决策记录</li>
            <li><strong>Radar</strong> — 看需求信号、市场洞察、机会捕捉</li>
            <li><strong>Insights</strong> — 读其他文章，理解设计背后的思考</li>
          </ul>
          <p className="text-gray-400 mb-4">
            工具会变。模型会更聪明。但你今天开始构建的系统，会积累一切。
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            *相关阅读: <Link href="/insights" className="text-white hover:underline">规则写得越多，Agent 越不听话</Link> | <Link href="/insights" className="text-white hover:underline">Radar 不是仪表盘。是耳朵。</Link>*
          </p>
        </div>
      </article>
    </main>
  )
}