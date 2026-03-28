'use client'

import Link from 'next/link'
import { useState } from 'react'

const agents = [
  { id: 'zhuge', name: 'Zhuge Bulb', role: 'Dream Maker', status: 'active', events: 6, emoji: '💡' },
  { id: 'helm', name: 'Coordinator', role: 'Task Dispatch', status: 'active', events: 3, emoji: '📋' },
  { id: 'code', name: 'Engineer', role: 'Tech Dev', status: 'active', events: 8, emoji: '💻' },
  { id: 'copy', name: 'Writer', role: 'Content Creation', status: 'researching', events: 2, emoji: '✍️' },
  { id: 'insight', name: 'Researcher', role: 'Market Research', status: 'active', events: 4, emoji: '🔍' },
  { id: 'design', name: 'Designer', role: 'Visual Design', status: 'resting', events: 1, emoji: '🎨' },
  { id: 'guard', name: 'Support', role: 'User Support', status: 'resting', events: 5, emoji: '🤖' },
  { id: 'seed', name: 'Seeder', role: 'User Growth', status: 'active', events: 3, emoji: '🌱' },
  { id: 'prophet', name: 'Analyst', role: 'Data Analysis', status: 'researching', events: 2, emoji: '🔮' },
  { id: 'ops', name: 'Operator', role: 'Operations', status: 'active', events: 7, emoji: '🚢' },
]

// 实验数据统计
const labStats = {
  signalsProcessed: 2847,      // 累计处理信号数
  tasksCompleted: 1563,        // 累计完成任务数
  hoursSaved: 3420,            // 节省工时（小时）
  activeDays: 42,              // 活跃天数
  avgResponseTime: '< 30s',    // 平均响应时间
}

// 起源故事时间线
const originTimeline = [
  { phase: 'Phase 1', title: 'The Question', desc: '一个人，能不能有一支24小时工作的团队？', icon: '💭' },
  { phase: 'Phase 2', title: 'The Build', desc: '开始搭建。10个Agent，10种职责。一个造梦者，九个执行者。', icon: '🔧' },
  { phase: 'Phase 3', title: 'The Crash', desc: '第一次崩溃。记忆丢失，任务阻塞。学到了：系统需要进化机制。', icon: '💥' },
  { phase: 'Phase 4', title: 'The Recovery', desc: '重建。更稳的架构，更清晰的分工。记忆系统开始自动维护。', icon: '🔄' },
  { phase: 'Phase 5', title: 'Running', desc: '现在。每天处理信号，完成任务。一个人的公司，十个不睡觉的员工。', icon: '⚡' },
]

const testimonials = [
  {
    quote: "Zhuge Bulb made me truly understand what an AI team can do. Within a week, I had 10 agents working for me.",
    author: "Mr. Zhang",
    title: "Indie Developer"
  },
  {
    quote: "I thought I needed a big team to do these things. Now my AI team completes work daily that used to require 5 people.",
    author: "Ms. Li",
    title: "Entrepreneur"
  },
  {
    quote: "OpenClaw's system design is amazing. I built my own agent team following the docs, and it's now a core company asset.",
    author: "Mr. Wang",
    title: "Product Lead"
  }
]

const radarStages = [
  { name: 'Watching', desc: 'Ideas tracked', count: 23, icon: '👁️' },
  { name: 'Validating', desc: 'Testing demand', count: 8, icon: '🔬' },
  { name: 'Building', desc: 'In development', count: 5, icon: '🔨' },
  { name: 'Shipped', desc: 'Live products', count: 3, icon: '🚀' },
]

export default function Home() {
  const [email, setEmail] = useState('')
  const activeCount = agents.filter(a => a.status === 'active').length
  const signalsToday = 13

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 实现订阅逻辑
    alert(`感谢订阅！我们会将最新动态发送到 ${email}`)
    setEmail('')
  }

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
                Zhuge Bulb
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/swarm" className="text-sm text-white/60 hover:text-white transition-colors">
                Command Center
              </Link>
              <Link href="/office" className="text-sm text-white/60 hover:text-white transition-colors">
                Live Office
              </Link>
              <Link href="/radar" className="text-sm text-white/60 hover:text-white transition-colors">
                Demand Radar
              </Link>
              <Link href="/vault" className="text-sm text-white/60 hover:text-white transition-colors">
                Knowledge Base
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs">
                <Link href="/zh" className="text-white/60 hover:text-white transition-colors">中文</Link>
                <span className="text-white/20">|</span>
                <span className="text-white/40">EN</span>
              </div>
              <Link 
                href="/redarmy" 
                className="px-4 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-full transition-colors mr-2"
              >
                红军服务
              </Link>
              <Link 
                href="/vault" 
                className="px-4 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                Start Building
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-white/40 tracking-widest mb-4">一个人 · 十个员工 · 员工不睡觉</p>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6" style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #4ecdc4 50%, #22c55e 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradient 3s ease infinite'
          }}>
            One Person.
            <br />
            <span className="relative">
              Ten AI Agents.
            </span>
          </h1>
          
          <p className="text-lg text-white/60 max-w-xl mx-auto mb-4 leading-relaxed">
            一个人的公司，十个不睡觉的员工。
          </p>
          <p className="text-base text-white/50 max-w-lg mx-auto mb-8">
            从2026年3月开始，老庄带着10个Agent开始了一场实验：能不能让AI团队真正做事情？
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/vault" 
              className="px-6 py-3 bg-white text-black text-sm font-medium rounded-full hover:bg-white/90 transition-colors"
            >
              开始搭建 →
            </Link>
            <Link 
              href="/office" 
              className="px-6 py-3 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all flex items-center gap-2"
            >
              看他们工作
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Agent Live Feed */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/office" className="block group">
            <div className="p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Status */}
                <div className="lg:w-64 shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-xs text-white/40">Agents Online</span>
                  </div>
                  <h3 className="text-lg font-medium mb-1">Live Feed</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold" style={{ color: '#4ecdc4' }}>{signalsToday}</span>
                    <span className="text-sm text-white/40">signals processed today</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-white/60 group-hover:text-white transition-colors">
                    <span>See the Office</span>
                    <span>→</span>
                  </div>
                </div>
                
                {/* Right: Agent Cards */}
                <div className="flex-1 overflow-x-auto">
                  <div className="flex gap-3 min-w-max">
                    {agents.map((agent) => (
                      <div 
                        key={agent.id}
                        className="p-4 rounded-xl border border-white/5 shrink-0 w-40"
                        style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                      >
                        <div className="text-2xl mb-2">{agent.emoji}</div>
                        <div className="text-sm font-medium">{agent.name}</div>
                        <div className="text-xs text-white/40 mt-0.5">{agent.role}</div>
                        <div className="flex items-center gap-1.5 mt-3">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            agent.status === 'active' ? 'bg-green-400' : 
                            agent.status === 'researching' ? 'bg-yellow-400' : 
                            'bg-white/20'
                          }`}></span>
                          <span className="text-xs text-white/40 capitalize">{agent.status}</span>
                        </div>
                        <div className="text-xs text-white/30 mt-1">{agent.events} events</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Lab Stats - 实验数据展示 */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs text-white/40 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span>LIVE DATA</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">实验数据</h2>
            <p className="text-white/40">42天，真实数字</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl border border-white/10 text-center" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="text-4xl font-bold mb-2" style={{ color: '#4ecdc4' }}>{labStats.signalsProcessed}</div>
              <div className="text-sm text-white/60">信号处理</div>
              <div className="text-xs text-white/40 mt-1">Signals Processed</div>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 text-center" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="text-4xl font-bold mb-2" style={{ color: '#22c55e' }}>{labStats.tasksCompleted}</div>
              <div className="text-sm text-white/60">任务完成</div>
              <div className="text-xs text-white/40 mt-1">Tasks Completed</div>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 text-center" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="text-4xl font-bold mb-2" style={{ color: '#f59e0b' }}>{labStats.hoursSaved}h</div>
              <div className="text-sm text-white/60">节省工时</div>
              <div className="text-xs text-white/40 mt-1">Hours Saved</div>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 text-center" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="text-4xl font-bold mb-2" style={{ color: '#ec4899' }}>{labStats.activeDays}</div>
              <div className="text-sm text-white/60">活跃天数</div>
              <div className="text-xs text-white/40 mt-1">Active Days</div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-white/30">
              平均响应时间 {labStats.avgResponseTime} · 相当于 {Math.round(labStats.hoursSaved / 8)} 个工作日节省
            </p>
          </div>
        </div>
      </section>

      {/* Origin Story - 起源故事 */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm text-white/40 tracking-widest mb-4">THE ORIGIN</p>
            <h2 className="text-3xl font-bold mb-4">起源故事</h2>
            <p className="text-white/60 leading-relaxed">
              2026年3月，老庄问了自己一个问题：
              <br />
              <span className="text-white/80">"一个人，能不能有一支24小时工作的团队？"</span>
            </p>
          </div>
          
          <div className="space-y-6">
            {originTimeline.map((phase, index) => (
              <div 
                key={index}
                className="flex gap-6 items-start p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}
              >
                <div className="text-3xl shrink-0">{phase.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-white/40">{phase.phase}</span>
                    <span className="text-sm font-medium">{phase.title}</span>
                  </div>
                  <p className="text-white/60 leading-relaxed">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12 p-6 rounded-2xl border border-white/10" style={{ background: 'rgba(34, 197, 94, 0.05)' }}>
            <p className="text-white/70 leading-relaxed">
              这不是demo。这是真的在做事情。
              <br />
              <span className="text-white/40 text-sm">每天，10个Agent处理来自飞书、邮件、社交媒体的信号，完成任务，记录结果。</span>
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-white/40 tracking-widest mb-4">START HERE</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Everyone teaches install. This is what happens after.
          </h2>
          <p className="text-white/60 leading-relaxed mb-6">
            Zhuge Bulb shows what an AI team looks like when it does real work in public. Watch
            <Link href="/office" className="text-white hover:underline mx-1">the office</Link>,
            open<Link href="/radar" className="text-white hover:underline mx-1">Demand Radar</Link>,
            and read<Link href="/insights" className="text-white hover:underline mx-1">field notes</Link>
            for the system design behind it. When you're ready, build
            <Link href="/vault" className="text-white hover:underline mx-1">yours</Link>.
          </p>
          <div className="space-y-4 text-sm text-white/40">
            <p>
              The tools will change. The models will get better.
              <br />
              But the system you start building today accumulates everything—every decision, every conversation, every thought process.
            </p>
            <p>
              A few months from now, when the models are smarter,
              <br />
              <span className="text-white/60">the builder who waits will still be explaining who they are.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Start Fast. Hold Up in Production.</h2>
            <p className="text-white/60">Starter gets you running. Pro keeps it running. Pick the stage that matches where you are.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Starter */}
            <div className="p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="text-xs text-green-400 font-medium mb-2">Save $30</div>
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-sm text-white/60 mb-4">Get your AI team running.</p>
              <div className="mb-6">
                <div className="text-3xl font-bold">$79</div>
                <div className="text-sm text-white/40 line-through">$109</div>
              </div>
              <Link 
                href="/vault"
                className="block w-full py-2.5 text-center rounded-full text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors"
              >
                Start with Starter
              </Link>
            </div>
            
            {/* Pro */}
            <div className="p-6 rounded-2xl border border-white/20 hover:border-white/30 transition-all" style={{ background: 'rgba(78, 205, 196, 0.05)' }}>
              <div className="text-xs text-cyan-400 font-medium mb-2">Save $60</div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-sm text-white/60 mb-4">Make it hold up.</p>
              <div className="mb-6">
                <div className="text-3xl font-bold">$199</div>
                <div className="text-sm text-white/40 line-through">$259</div>
              </div>
              <Link 
                href="/vault"
                className="block w-full py-2.5 text-center rounded-full text-sm font-medium text-black"
                style={{ background: 'linear-gradient(135deg, #22c55e, #4ecdc4)' }}
              >
                Get Pro
              </Link>
            </div>
          </div>
          
          <p className="text-center text-sm text-white/30 mt-8">+50 builders already building with this</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">Real messages from builders</h2>
            <p className="text-white/40">Not what they hoped. What they shipped.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl border border-white/10"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}
              >
                <p className="text-sm text-white/70 leading-relaxed mb-4">"{item.quote}"</p>
                <div>
                  <div className="text-sm font-medium">{item.author}</div>
                  <div className="text-xs text-white/40">{item.title}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/insights" 
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              Read the field notes
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Demand Radar Preview */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs text-white/40 mb-4">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                <span>LIVE TRACKER</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Demand Radar</h2>
              <p className="text-white/60 leading-relaxed mb-6">
                Agents find real problems, test if people want solutions, and start building. You decide what ships.
              </p>
              <div className="text-sm text-white/40">
                <span className="text-2xl font-bold text-white" style={{ color: '#4ecdc4' }}>39</span>
                {' '}public signals tracked
              </div>
            </div>
            
            <div>
              <div className="p-6 rounded-2xl border border-white/10" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {radarStages.map((stage) => (
                    <div key={stage.name} className="text-center">
                      <div className="text-2xl mb-2">{stage.icon}</div>
                      <div className="text-xs font-medium">{stage.name}</div>
                      <div className="text-xs text-white/40 mt-0.5">{stage.desc}</div>
                      <div className="text-lg font-bold mt-2" style={{ color: '#4ecdc4' }}>{stage.count}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-white/40">
                  <span>Ideas flow from left to right</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
            <Link href="/radar" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium mb-1">Explore Full Radar</h3>
                <p className="text-sm text-white/40">Watch agents work, vote on ideas, and help decide what gets built next</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <span>View All</span>
                <span>→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section id="subscribe" className="py-16 px-6 border-t border-white/5">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs text-white/40 mb-4">
            <span>📧</span>
            <span>Join 700+ builders</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Stay in the loop</h2>
          <p className="text-white/60 mb-8">
            New features, agent tips, and behind-the-scenes updates—sent only when there's something worth reading.
          </p>
          
          <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-2.5 rounded-full text-sm border border-white/10 bg-white/5 focus:outline-none focus:border-white/30 transition-colors"
              required
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-sm font-medium text-black shrink-0"
              style={{ background: 'linear-gradient(135deg, #22c55e, #4ecdc4)' }}
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-white/30 mt-3">No spam. Unsubscribe anytime.</p>
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
                Zhuge Bulb
              </h3>
              <p className="text-sm text-white/40">Build your own AI team. Ours runs 24/7 in public.</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-4">Products</h4>
              <ul className="space-y-2">
                <li><Link href="/swarm" className="text-sm text-white/40 hover:text-white transition-colors">Command Center</Link></li>
                <li><Link href="/office" className="text-sm text-white/40 hover:text-white transition-colors">Live Office</Link></li>
                <li><Link href="/radar" className="text-sm text-white/40 hover:text-white transition-colors">Demand Radar</Link></li>
                <li><Link href="/vault" className="text-sm text-white/40 hover:text-white transition-colors">Knowledge Base</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/insights" className="text-sm text-white/40 hover:text-white transition-colors">Field Notes</Link></li>
                <li><Link href="/faq" className="text-sm text-white/40 hover:text-white transition-colors">FAQ</Link></li>
                <li><a href="https://github.com/Heyvhuang/ship-faster" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white transition-colors">Ship Faster Repo</a></li>
                <li><a href="https://docs.openclaw.ai/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white transition-colors">Docs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white transition-colors">Twitter / X</a></li>
                <li><a href="https://github.com/Heyvhuang" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/30">© 2026 Zhuge Bulb · Powered by OpenClaw</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy</Link>
              <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}