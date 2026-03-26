import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import MobileNav from '@/components/MobileNav'

export default function RadarIsNotDashboardPage() {
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
          <Link href="/zh/insights/radar-is-not-dashboard" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
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
          Radar 不是仪表盘。是耳朵。
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            2026-03-26
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            8 min
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">产品</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">信号</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">用户洞察</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-300 mb-6">
            仪表盘显示的是已知。Radar 捕捉的是未知。这个认知转变，花了我两年。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">传统仪表盘的谎言</h2>
          <p className="text-gray-400 mb-4">
            我见过太多仪表盘。GMV、DAU、转化率、留存率。每天早上打开，数字跳一跳，心里踏实一踏实。
          </p>
          <p className="text-gray-400 mb-4">
            但这些数字有一个共同点：它们都是"已经发生的事"。昨天有多少用户？上周转化多少？这个月增长如何？
          </p>
          <p className="text-gray-400 mb-4">
            真正重要的信号，从来没有出现在仪表盘上。
          </p>
          <p className="text-gray-400 mb-4">
            一个用户在 Twitter 抱怨产品难用。一个潜在客户在论坛问有没有替代方案。一个竞品悄悄上线了新功能。这些都在仪表盘之外。等你看到数字下滑，问题已经发酵了两周。
          </p>
          <p className="text-gray-400 mb-4">
            我把仪表盘叫做"后视镜"。它告诉你开过的路，但不告诉你前面有坑。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Radar 的第一次预警</h2>
          <p className="text-gray-400 mb-4">
            去年，我做了第一个 Radar。初心很简单：不想错过重要信号。
          </p>
          <p className="text-gray-400 mb-4">
            我让洞察者 Agent（Radar）订阅了几个关键词：公司名、竞品名、行业术语。每天早上，它会把发现推给我。
          </p>
          <p className="text-gray-400 mb-4">
            第三天，它捕获了一条不起眼的推文。一个用户说："X 产品有个功能很好用，可惜 Y 竞品没有。"
          </p>
          <p className="text-gray-400 mb-4">
            这条推文只有 12 个赞。不会出现在任何报告里。但我看到后立刻意识到——这是真实痛点。三天后，我们上线了这个功能。那个用户成了忠实推广者。
          </p>
          <p className="text-gray-400 mb-4">
            这一刻我明白了：Radar 不是展示数据。它是捕捉信号。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">仪表盘是眼睛，Radar 是耳朵</h2>
          <p className="text-gray-400 mb-4">
            我用了一个比喻来解释区别：
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li><strong>仪表盘是眼睛</strong> — 你主动去看。你决定看什么。你只能看到你预设的指标。</li>
            <li><strong>Radar 是耳朵</strong> — 它被动接收。你不知道会听到什么。它捕捉你没预设的信号。</li>
          </ul>
          <p className="text-gray-400 mb-4">
            眼睛看到的是你已经知道的。耳朵听到的是你还不知道的。
          </p>
          <p className="text-gray-400 mb-4">
            这解释了为什么传统 BI 工具永远做不好"需求发现"。因为需求不是"已知指标"，而是"未知信号"。你不能预设一个叫"用户真正想要的"指标。你只能听。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Radar 的三层结构</h2>
          <p className="text-gray-400 mb-4">
            现在的 Radar 有三层：
          </p>
          <p className="text-gray-400 mb-4">
            <strong>第一层：信号捕获</strong>。洞察者 Agent 监控关键词、论坛、社交媒体。所有信号都进入一个池子。
          </p>
          <p className="text-gray-400 mb-4">
            <strong>第二层：信号分类</strong>。掌舵人 Agent 判断：这是抱怨？这是需求？这是机会？这是噪音？每个信号被打上标签，推给对应的人。
          </p>
          <p className="text-gray-400 mb-4">
            <strong>第三层：信号行动</strong>。产品经理收到需求信号。市场团队收到舆情信号。代码侠收到 bug 信号。每个信号都有行动建议。
          </p>
          <p className="text-gray-400 mb-4">
            整个过程不需要我主动看任何东西。信号会自己流向我。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">真实案例：一次凌晨的预警</h2>
          <p className="text-gray-400 mb-4">
            上个月的一个凌晨 3 点，Radar 推了一条信号给我：
          </p>
          <p className="text-gray-400 mb-4">
            <em>"竞品 X 刚发布了功能 Y。用户讨论热烈。关键词：'终于有了'、'等了很久'。"</em>
          </p>
          <p className="text-gray-400 mb-4">
            我第二天早上 7 点看到，立刻做了两个决定：第一，评估我们的对标功能是否落后；第二，在社交媒体上回应这个话题。
          </p>
          <p className="text-gray-400 mb-4">
            如果没有 Radar，我可能在三天后才从行业简报里看到。那时候，话题已经冷却，机会窗口关闭。
          </p>
          <p className="text-gray-400 mb-4">
            不是因为我更快。是因为 Radar 让我"被动接收"而不是"主动寻找"。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">关键要点</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>仪表盘显示已知，Radar 捕捉未知</li>
            <li>仪表盘是"后视镜"，Radar 是"顺风耳"</li>
            <li>真正重要的信号从不主动出现</li>
            <li>三层结构：捕获 → 分类 → 行动</li>
            <li>让信号流动，而不是让人寻找</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">下一步行动</h2>
          <p className="text-gray-400 mb-4">
            想看 Radar 是怎么运转的？
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li><strong>Office</strong> — 看工作流程、Agent 状态、决策记录</li>
            <li><strong>Radar</strong> — 看实时信号流、分类标签、行动建议</li>
            <li><strong>Insights</strong> — 读其他文章，理解设计背后的思考</li>
          </ul>
          <p className="text-gray-400 mb-4">
            最好的洞察，来自你还没问的问题。Radar 就是帮你不问而答。
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            *相关阅读: <Link href="/insights" className="text-white hover:underline">我建了一个 AI 公司。7 周后，它们比我还了解公司。</Link> | <Link href="/insights" className="text-white hover:underline">规则写得越多，Agent 越不听话。</Link>*
          </p>
        </div>
      </article>
    </main>
  )
}