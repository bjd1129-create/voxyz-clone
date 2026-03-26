import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'

// Blog posts
const POSTS = [
  {
    title: '规则写得越多，Agent 越不听话。',
    excerpt: '我试过给 Agent 写 200 条规则。它变得更笨了。删到 15 条后，它反而更聪明了。这是一篇关于"少即是多"的规则设计哲学。',
    date: '2026-03-27',
    readTime: '8 分钟',
    tags: ['Agent 设计', '规则哲学', 'hardBans'],
    slug: 'more-rules-less-obedient',
  },
  {
    title: '我建了一个 AI 公司。7 周后，它们比我还了解公司。',
    excerpt: '诸葛灯泡从 0 到真正运转，花了 7 周。这篇文章讲我是怎么把 6 个 Agent 放在一起，让它们真正成为团队，而不是 6 个独立工具。',
    date: '2026-03-26',
    readTime: '10 分钟',
    tags: ['AI Agents', '创业', '系统设计'],
  },
  {
    title: 'Radar 不是仪表盘。是耳朵。',
    excerpt: '仪表盘显示的是已知。Radar 捕捉的是未知。这篇文章讲我如何发现传统仪表盘的局限，以及 Radar 作为需求信号系统的设计哲学。',
    date: '2026-03-26',
    readTime: '8 分钟',
    tags: ['产品', '信号', '用户洞察'],
  },
  {
    title: '如何构建 AI 团队：从单一 Agent 到协作网络',
    excerpt: '详解 OpenClaw 如何将 7 个专业化 Agent 组织成高效协作团队。包括角色定义、任务分配、知识共享等核心设计。',
    date: '2026-03-25',
    readTime: '8 分钟',
    tags: ['架构设计', 'AI Agents'],
  },
  {
    title: '数据闭环设计实践：让 AI 团队持续进化',
    excerpt: '探讨如何构建数据闭环系统，让每次任务都成为学习机会。从数据采集、知识沉淀到能力迭代的全链路实践。',
    date: '2026-03-22',
    readTime: '6 分钟',
    tags: ['技术实践', 'OpenClaw'],
  },
  {
    title: 'OpenClaw Agent 开发经验：角色、工具与协作',
    excerpt: '分享开发专业化 Agent 的实战经验。如何定义角色性格、选择工具集、设计协作流程，以及踩过的坑。',
    date: '2026-03-18',
    readTime: '10 分钟',
    tags: ['开发经验', '实战'],
  },
]

export default function InsightsPage() {
  return (
    <main className="min-h-screen p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/zh" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
          <Link href="/insights" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
            EN / 中文
          </Link>
        </div>

        <h1 className="text-3xl font-bold">技术洞察</h1>
        <p className="text-gray-400 mt-1">AI 团队构建与运营的深度思考</p>
      </header>

      <section className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {POSTS.map((post, i) => (
            <article
              key={i}
              className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/30 transition-colors cursor-pointer"
            >
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-400 mb-4">{post.excerpt}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </div>
                <div className="flex gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-white/10 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}