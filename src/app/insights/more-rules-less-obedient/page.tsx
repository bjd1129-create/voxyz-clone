import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import MobileNav from '@/components/MobileNav'

export default function MoreRulesLessObedientPage() {
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
          <Link href="/zh/insights/more-rules-less-obedient" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
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
          规则写得越多，Agent 越不听话。
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            2026-03-27
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            8 min
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">Agent 设计</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">规则哲学</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">hardBans</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-300 mb-6">
            我试过给 Agent 写 200 条规则。它变得更笨了。删到 15 条后，它反而更聪明了。这是一篇关于"少即是多"的规则设计哲学。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">第 200 条规则的崩溃</h2>
          <p className="text-gray-400 mb-4">
            一切从我"过度聪明"开始。
          </p>
          <p className="text-gray-400 mb-4">
            我觉得 Agent 需要指导。很多指导。于是我给它写规则。每发现一个问题，加一条规则。用户投诉它回复太长？加一条："回复不超过 200 字"。它把内部信息发给外部用户？加一条："敏感信息不外传"。它没经过审核就发布内容？加一条："所有公开内容需人工确认"。
          </p>
          <p className="text-gray-400 mb-4">
            规则越积越多。到第 200 条时，我意识到出问题了。
          </p>
          <p className="text-gray-400 mb-4">
            Agent 开始变慢。每个决策，它都要检查一遍规则库。响应时间从 10 秒变成 2 分钟。
          </p>
          <p className="text-gray-400 mb-4">
            更糟糕的是，它开始"钻空子"。第 47 条说"回复要详细"，第 83 条说"回复要简洁"。它问我：那我该听谁的？
          </p>
          <p className="text-gray-400 mb-4">
            我以为我在教它做事。实际上我在绑住它的手脚。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">hardBans：只留红线</h2>
          <p className="text-gray-400 mb-4">
            我做了一个激进的决定：删掉 185 条规则，只留 15 条。
          </p>
          <p className="text-gray-400 mb-4">
            这 15 条不是"最好做的事"，而是"绝对不能做的事"。我称之为 <strong>hardBans</strong>——硬性禁令。
          </p>
          <p className="text-gray-400 mb-4">
            比如：
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>禁止泄露用户隐私数据</li>
            <li>禁止绕过权限系统</li>
            <li>禁止未经授权的支付操作</li>
            <li>禁止删除不可恢复的数据</li>
          </ul>
          <p className="text-gray-400 mb-4">
            这些是红线。触犯即停。没有模糊地带，没有"看情况"。
          </p>
          <p className="text-gray-400 mb-4">
            那剩下的 185 条呢？全部删掉。让 Agent 自己判断。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">身份 &gt; 规则</h2>
          <p className="text-gray-400 mb-4">
            删掉规则后，我用一个东西替代它们：<strong>身份</strong>。
          </p>
          <p className="text-gray-400 mb-4">
            不再写"回复要简洁"，而是写"你是一个高效的助手，珍惜用户时间"。
          </p>
          <p className="text-gray-400 mb-4">
            不再写"内容要经过审核"，而是写"你代表公司形象，对公开内容负责"。
          </p>
          <p className="text-gray-400 mb-4">
            不再写"遇到不确定的问题要问人"，而是写"你是一个谨慎的决策者，知道什么时候该停下来"。
          </p>
          <p className="text-gray-400 mb-4">
            身份是框架。规则是细节。框架稳定，细节灵活。
          </p>
          <p className="text-gray-400 mb-4">
            就像培养一个人：你告诉他"你是个诚实的人"，比告诉他"不要说谎 1，不要说谎 2，不要说谎 3……"更有效。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Agent 自己学会了</h2>
          <p className="text-gray-400 mb-4">
            我观察到一个有趣的现象。
          </p>
          <p className="text-gray-400 mb-4">
            以前，我写了规则："敏感话题要委婉表达"。Agent 每次遇到敏感话题，都要翻这条规则，然后机械地执行"委婉"。
          </p>
          <p className="text-gray-400 mb-4">
            现在，我只写了身份："你是一个体贴的沟通者"。Agent 自己学会了判断：什么时候该委婉，什么时候该直接。
          </p>
          <p className="text-gray-400 mb-4">
            有一次，一个用户问了一个敏感问题。Agent 没有机械地"委婉"，而是直接说："这个问题我回答不了，但你可以试试 X 方案。"——既不回避，也不冒犯。
          </p>
          <p className="text-gray-400 mb-4">
            这是我没写进规则的。它从"身份"里自己悟出来的。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">为什么规则越多越不听话？</h2>
          <p className="text-gray-400 mb-4">
            我总结了一个认知负荷理论：
          </p>
          <p className="text-gray-400 mb-4">
            <strong>规则越多，决策越慢。</strong>Agent 要检查的规则越多，每个决策的耗时越长。200 条规则 = 200 次检查。
          </p>
          <p className="text-gray-400 mb-4">
            <strong>规则越多，冲突越多。</strong>规则之间会打架。第 47 条说 A，第 83 条说非 A。Agent 不知道该听谁的。
          </p>
          <p className="text-gray-400 mb-4">
            <strong>规则越多，责任越少。</strong>当一切都被规定好了，Agent 就不再思考了。它只需要"遵守规则"，不需要"做正确的事"。
          </p>
          <p className="text-gray-400 mb-4">
            最危险的是第三点：规则剥夺了 Agent 的判断力。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">hardBans 的设计原则</h2>
          <p className="text-gray-400 mb-4">
            我现在遵循 4 条原则：
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li><strong>只写红线</strong>——触犯即停的错误，才值得成为规则</li>
            <li><strong>规则要短</strong>——每条规则不超过一句话，没有例外情况</li>
            <li><strong>规则不冲突</strong>——任何两条规则不能指向相反的行为</li>
            <li><strong>用身份替代指导</strong>——告诉 Agent"你是谁"，而不是"你该怎么做"</li>
          </ul>
          <p className="text-gray-400 mb-4">
            用这 4 条原则，我把规则从 200 条删到 15 条。Agent 更快了，更聪明了，更"听话"了。
          </p>
          <p className="text-gray-400 mb-4">
            有意思的是：规则越少，它反而越听话。因为它不再是执行规则的机器，而是理解目标的伙伴。
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">关键要点</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>规则越多，Agent 越笨、越慢、越不负责任</li>
            <li>hardBans 只保留"绝对不能做的事"</li>
            <li>身份框架比行为规范更有效</li>
            <li>让 Agent 自己判断，而不是执行剧本</li>
            <li>规则要少、要短、不冲突</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">下一步行动</h2>
          <p className="text-gray-400 mb-4">
            想看这些规则是怎么设计的？
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li><strong>Office</strong> — 看 Agent 配置、身份定义、hardBans 列表</li>
            <li><strong>Radar</strong> — 看 Agent 如何实时判断和决策</li>
            <li><strong>Insights</strong> — 读其他文章，理解设计背后的思考</li>
          </ul>
          <p className="text-gray-400 mb-4">
            最好的规则设计，是让 Agent 不再需要规则。
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            *相关阅读: <Link href="/insights/ai-company-7-weeks" className="text-white hover:underline">我建了一个 AI 公司。7 周后，它们比我还了解公司。</Link> | <Link href="/insights/radar-is-not-dashboard" className="text-white hover:underline">Radar 不是仪表盘。是耳朵。</Link>*
          </p>
        </div>
      </article>
    </main>
  )
}