'use client'

import Link from 'next/link'

const articles = [
  {
    id: 'claude-code-best-practices',
    date: 'Mar 25, 2026',
    type: 'article',
    title: 'Claude Code Best Practices: From Tool to System',
    excerpt: "I've been using Claude Code for over a year. I've made enough mistakes to fill a book. When I first started, the term \"vibe coding\" didn't even exist yet. I thought it was just a chatbot in a terminal...",
    category: 'Engineering'
  },
  {
    id: 'ai-company-update',
    date: 'Mar 24, 2026',
    type: 'article',
    title: 'I Built an AI Company with OpenClaw. 7 Weeks Later, I Owe You an Update.',
    excerpt: "7 weeks. 10 articles. 1 AI company. Looking back at which calls were right and which ones weren't. That first article hit 1.4 million views...",
    category: 'Behind the Scenes'
  },
  {
    id: 'agents-went-dark',
    date: 'Mar 19, 2026',
    type: 'article',
    title: 'I Hardened My 5 AI Agents. They All Went Dark.',
    excerpt: "I run 5 AI agents on an $8 server. They handle content, support, monitoring, ops, and security while I work my day job. Last week I turned on sandbox mode. All five went silent...",
    category: 'Operations'
  },
  {
    id: 'dont-quit-job',
    date: 'Mar 13, 2026',
    type: 'article',
    title: "Everyone Says Quit Your Job and Go All In on AI. They're Wrong.",
    excerpt: '5 AI agents, 1 day job, 50 paying customers - going from "I should quit and go all in" to "my agents run the company while I\'m in meetings" took me months...',
    category: 'Strategy'
  },
  {
    id: 'more-rules-worse',
    date: 'Mar 12, 2026',
    type: 'article',
    title: 'The More Rules I Wrote for My Agents, the Worse They Performed.',
    excerpt: 'Sounds wrong. More rules should mean more accurate, right? No. Line 387 I wrote a rule in AGENTS.md: check the product docs before replying to any customer...',
    category: 'Engineering'
  },
  {
    id: 'openclaw-after-install',
    date: 'Mar 10, 2026',
    type: 'article',
    title: 'Everyone Teaches You How to Install OpenClaw. Nobody Tells You What Happens After.',
    excerpt: 'Ten hard-won OpenClaw lessons about tools, context limits, token waste, model choice, and the mistakes that cost money after install day.',
    category: 'Engineering'
  },
  {
    id: 'money-not-arrived',
    date: 'Mar 9, 2026',
    type: 'article',
    title: "My Agent Finished the Job. The Money Hasn't Arrived.",
    excerpt: 'My agent finished a client project at 2am on a Tuesday. Code, tests, deployment, all done before I woke up. I sent the invoice over breakfast...',
    category: 'Business'
  },
  {
    id: 'ai-company-reorg',
    date: 'Mar 7, 2026',
    type: 'article',
    title: 'I Built an AI Company with OpenClaw. Today, It Had Its First Reorg.',
    excerpt: 'What VoxYZ learned from its first reorg: remove fake jobs, collapse redundant work, and design every agent around a downstream consumer.',
    category: 'Behind the Scenes'
  },
  {
    id: 'swarm-adversarial-layer',
    date: 'Mar 1, 2026',
    type: 'article',
    title: 'The Hidden Layer in OpenClaw Swarms: Make Them Disagree, See Who Survives',
    excerpt: 'Why parallel AI agents still collapse into groupthink, and how an adversarial review layer forces useful disagreement before the final merge.',
    category: 'Engineering'
  },
  {
    id: 'ai-company-hiring',
    date: 'Feb 26, 2026',
    type: 'article',
    title: "I Built an AI Company with OpenClaw. Now It's Hiring.",
    excerpt: 'How OpenClaw swarms decide who to hire, how many specialists to spawn, and how to collapse parallel work into one actionable report.',
    category: 'Behind the Scenes'
  },
  {
    id: 'starting-ai-today',
    date: 'Feb 24, 2026',
    type: 'article',
    title: 'If I Were Starting AI Today, This Is Exactly What I\'d Do',
    excerpt: 'The mindset Vox would use to start over with AI today: give it hands, use it to learn, build one agent first, and think in teams.',
    category: 'Strategy'
  },
  {
    id: 'ai-company-openclaw',
    date: 'Feb 6, 2026',
    type: 'article',
    title: 'I Built an AI Company with OpenClaw + Vercel + Supabase - Two Weeks Later, They Run It Themselves',
    excerpt: 'How VoxYZ turned OpenClaw, Vercel, and Supabase into a closed-loop AI company that can propose, execute, react, and keep moving without babysitting.',
    category: 'Behind the Scenes'
  }
]

const categories = [
  { name: 'All', count: 12 },
  { name: 'Behind the Scenes', count: 4 },
  { name: 'Engineering', count: 3 },
  { name: 'Strategy', count: 2 },
  { name: 'Operations', count: 1 },
  { name: 'Business', count: 1 },
]

const archiveMonths = [
  { month: '2026年3月', count: 8 },
  { month: '2026年2月', count: 4 },
]

export default function InsightsPage() {
  return (
    <div className="min-h-screen font-sans" style={{
      background: 'linear-gradient(180deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a0f 100%)',
      color: '#fff'
    }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5" style={{ backdropFilter: 'blur(12px)', background: 'rgba(10, 10, 15, 0.8)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              <span className="text-lg font-semibold" style={{
                background: 'linear-gradient(45deg, #22c55e, #4ecdc4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                诸葛灯泡
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/swarm" className="text-sm text-white/60 hover:text-white transition-colors">
                指挥中心
              </Link>
              <Link href="/office" className="text-sm text-white/60 hover:text-white transition-colors">
                实时办公室
              </Link>
              <Link href="/radar" className="text-sm text-white/60 hover:text-white transition-colors">
                需求雷达
              </Link>
              <Link href="/vault" className="text-sm text-white/60 hover:text-white transition-colors">
                知识库
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-white/40">中文</span>
                <span className="text-white/20">|</span>
                <Link href="/en/insights" className="text-white/60 hover:text-white transition-colors">EN</Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm text-white/40 tracking-widest mb-4">FIELD NOTES</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              实战笔记
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              不是教程。不是理论。是真实踩过的坑、验证过的想法、和那些值得记录的时刻。
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex justify-center items-center gap-8 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white" style={{ color: '#4ecdc4' }}>{articles.length}</span>
              <span>篇文章</span>
            </div>
            <div className="w-px h-4 bg-white/10"></div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white" style={{ color: '#4ecdc4' }}>{categories.length - 1}</span>
              <span>个分类</span>
            </div>
            <div className="w-px h-4 bg-white/10"></div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white" style={{ color: '#4ecdc4' }}>∞</span>
              <span>次迭代</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Articles Grid */}
            <div className="flex-1">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                      cat.name === 'All'
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat.name}
                    <span className="ml-1.5 text-white/40">{cat.count}</span>
                  </button>
                ))}
              </div>

              {/* Articles */}
              <div className="grid gap-6">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/insights/${article.id}`}
                    className="group block p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                    style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Meta */}
                      <div className="sm:w-32 shrink-0">
                        <div className="text-sm text-white/40 mb-1">{article.date}</div>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-white/5 text-white/50">
                          {article.type}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-lg font-medium mb-2 group-hover:text-white transition-colors" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                          {article.title}
                        </h3>
                        <p className="text-sm text-white/50 leading-relaxed mb-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/40">
                            {article.category}
                          </span>
                          <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors flex items-center gap-1">
                            阅读文章
                            <span>→</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Load More */}
              <div className="mt-8 text-center">
                <button className="px-6 py-2.5 border border-white/10 text-white/60 text-sm rounded-full hover:border-white/20 hover:text-white transition-all">
                  加载更多
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-64 shrink-0">
              {/* Archive */}
              <div className="p-5 rounded-2xl border border-white/10 mb-6" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                <h3 className="text-sm font-medium mb-4">归档</h3>
                <ul className="space-y-2">
                  {archiveMonths.map((item) => (
                    <li key={item.month}>
                      <button className="w-full flex items-center justify-between text-sm text-white/60 hover:text-white transition-colors">
                        <span>{item.month}</span>
                        <span className="text-white/30">{item.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categories */}
              <div className="p-5 rounded-2xl border border-white/10 mb-6" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                <h3 className="text-sm font-medium mb-4">分类</h3>
                <ul className="space-y-2">
                  {categories.slice(1).map((cat) => (
                    <li key={cat.name}>
                      <button className="w-full flex items-center justify-between text-sm text-white/60 hover:text-white transition-colors">
                        <span>{cat.name}</span>
                        <span className="text-white/30">{cat.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Subscribe CTA */}
              <div className="p-5 rounded-2xl border border-white/10" style={{ background: 'rgba(78, 205, 196, 0.05)' }}>
                <h3 className="text-sm font-medium mb-2">保持更新</h3>
                <p className="text-xs text-white/40 mb-4">新文章、Agent 技巧、幕后更新——只在有值得阅读的内容时发送。</p>
                <Link
                  href="/#subscribe"
                  className="block w-full py-2 text-center text-sm font-medium rounded-full text-black"
                  style={{ background: 'linear-gradient(135deg, #22c55e, #4ecdc4)' }}
                >
                  订阅
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{
                background: 'linear-gradient(45deg, #22c55e, #4ecdc4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                诸葛灯泡
              </h3>
              <p className="text-sm text-white/40">搭建你自己的 AI 团队。我们的 24/7 公开运行。</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-4">产品</h4>
              <ul className="space-y-2">
                <li><Link href="/swarm" className="text-sm text-white/40 hover:text-white transition-colors">指挥中心</Link></li>
                <li><Link href="/office" className="text-sm text-white/40 hover:text-white transition-colors">实时办公室</Link></li>
                <li><Link href="/radar" className="text-sm text-white/40 hover:text-white transition-colors">需求雷达</Link></li>
                <li><Link href="/vault" className="text-sm text-white/40 hover:text-white transition-colors">知识库</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-4">资源</h4>
              <ul className="space-y-2">
                <li><span className="text-sm text-white/70">实战笔记</span></li>
                <li><Link href="/faq" className="text-sm text-white/40 hover:text-white transition-colors">常见问题</Link></li>
                <li><a href="https://github.com/Heyvhuang/ship-faster" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white transition-colors">Ship Faster 仓库</a></li>
                <li><a href="https://docs.openclaw.ai/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white transition-colors">文档</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-4">联系</h4>
              <ul className="space-y-2">
                <li><a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white transition-colors">Twitter / X</a></li>
                <li><a href="https://github.com/Heyvhuang" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/30">© 2026 诸葛灯泡 · Powered by OpenClaw</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors">隐私政策</Link>
              <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">服务条款</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}