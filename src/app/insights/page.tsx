import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import MobileNav from '@/components/MobileNav'
import DesktopNav from '@/components/DesktopNav'

// Blog posts
const POSTS = [
  {
    title: '我建了一个 AI 公司。7 周后，它们比我还了解公司。',
    excerpt: '诸葛灯泡从 0 到真正运转，花了 7 周。这篇文章讲我是怎么把 6 个 Agent 放在一起，让它们真正成为团队，而不是 6 个独立工具。',
    date: '2026-03-26',
    readTime: '10 min',
    tags: ['AI Agents', '创业', '系统设计'],
    slug: 'ai-company-7-weeks',
  },
  {
    title: 'Radar 不是仪表盘。是耳朵。',
    excerpt: '仪表盘显示的是已知。Radar 捕捉的是未知。这篇文章讲我如何发现传统仪表盘的局限，以及 Radar 作为需求信号系统的设计哲学。',
    date: '2026-03-26',
    readTime: '8 min',
    tags: ['产品', '信号', '用户洞察'],
    slug: 'radar-is-not-dashboard',
  },
  {
    title: 'How to Build an AI Team: From Single Agent to Collaborative Network',
    excerpt: 'A deep dive into how OpenClaw organizes 7 specialized Agents into an efficient collaborative team. Including role definition, task assignment, knowledge sharing, and other core designs.',
    date: '2026-03-25',
    readTime: '8 min',
    tags: ['Architecture', 'AI Agents'],
  },
  {
    title: 'Data Loop Design in Practice: Enabling Continuous AI Team Evolution',
    excerpt: 'Exploring how to build a data loop system where every task becomes a learning opportunity. Full-stack practice from data collection and knowledge accumulation to capability iteration.',
    date: '2026-03-22',
    readTime: '6 min',
    tags: ['Technical', 'OpenClaw'],
  },
  {
    title: 'OpenClaw Agent Development Experience: Roles, Tools & Collaboration',
    excerpt: 'Sharing practical experience in developing specialized Agents. How to define role personalities, select tool sets, design collaboration workflows, and lessons learned.',
    date: '2026-03-18',
    readTime: '10 min',
    tags: ['Development', 'Practice'],
  },
]

export default function InsightsPage() {
  return (
    <main className="min-h-screen p-3 sm:p-6">
      {/* Mobile Navigation */}
      <MobileNav langToggleHref="/zh/insights" />
      
      {/* Desktop Navigation */}
      <DesktopNav langToggleHref="/zh/insights" />

      {/* Desktop Header */}
      <header className="hidden md:block max-w-6xl lg:max-w-7xl mx-auto mb-8 lg:mb-12">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link href="/zh/insights" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
            EN / 中文
          </Link>
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold">Insights</h1>
        <p className="text-gray-400 mt-2 text-lg lg:text-xl">Deep thoughts on AI team building and operations</p>
      </header>

      {/* Mobile Title */}
      <div className="md:hidden mb-6 text-center">
        <h1 className="text-2xl font-bold">Insights</h1>
        <p className="text-gray-400 text-sm mt-1">AI team building insights</p>
      </div>

      <section className="max-w-6xl lg:max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {POSTS.map((post, i) => (
            <Link
              key={i}
              href={post.slug ? `/insights/${post.slug}` : '#'}
              className="block p-5 sm:p-6 lg:p-8 bg-white/5 rounded-xl border border-white/10 hover:border-white/30 transition-colors cursor-pointer"
            >
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 lg:mb-3">{post.title}</h2>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-4">{post.excerpt}</p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  {post.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
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
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}