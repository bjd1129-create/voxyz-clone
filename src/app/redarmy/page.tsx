'use client'

import Link from 'next/link'
import { useState } from 'react'

const services = [
  { id: 'consulting', name: '商业咨询', role: 'Business Consulting', status: 'available', events: 15, emoji: '💼' },
  { id: 'development', name: '项目开发', role: 'Project Development', status: 'available', events: 12, emoji: '🚀' },
  { id: 'strategy', name: '战略规划', role: 'Strategic Planning', status: 'available', events: 8, emoji: '🎯' },
  { id: 'analysis', name: '市场分析', role: 'Market Analysis', status: 'available', events: 10, emoji: '📊' },
  { id: 'optimization', name: '业务优化', role: 'Business Optimization', status: 'available', events: 7, emoji: '⚡' },
  { id: 'support', name: '技术支持', role: 'Technical Support', status: 'available', events: 5, emoji: '🛠️' },
]

const testimonials = [
  {
    quote: "红军团队帮助我们重新设计了业务流程，在3个月内实现了效率提升50%。",
    author: "张总",
    title: "某科技公司 CEO"
  },
  {
    quote: "专业的解决方案，高效的执行力。红军是我们最信赖的商业合作伙伴。",
    author: "李经理",
    title: "某制造企业 总监"
  },
  {
    quote: "从战略规划到实施落地，红军展现了卓越的专业能力和服务态度。",
    author: "王总监",
    title: "某互联网公司 CTO"
  }
]

const projectStages = [
  { name: '需求分析', desc: 'Requirement Analysis', count: 23, icon: '🔍' },
  { name: '方案设计', desc: 'Solution Design', count: 18, icon: '📝' },
  { name: '开发实施', desc: 'Development', count: 15, icon: '🔨' },
  { name: '交付完成', desc: 'Delivered', count: 42, icon: '✅' },
]

export default function RedArmyBusinessPage() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const availableCount = services.filter(s => s.status === 'available').length
  const projectsCompleted = 42

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 实现联系表单提交逻辑
    alert(`感谢联系！我们会尽快回复您。\n邮箱: ${email}\n电话: ${phone}`)
    setEmail('')
    setPhone('')
  }

  return (
    <div className="min-h-screen font-sans" style={{
      background: 'linear-gradient(180deg, #8B0000 0%, #A52A2A 50%, #8B0000 100%)', // 红色渐变背景
      color: '#fff'
    }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-red-900/50" style={{ backdropFilter: 'blur(12px)', background: 'rgba(139, 0, 0, 0.8)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🔴</span>
              <span className="text-lg font-semibold" style={{
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                红军商业服务
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/redarmy/services" className="text-sm text-white/80 hover:text-yellow-300 transition-colors">
                服务项目
              </Link>
              <Link href="/redarmy/projects" className="text-sm text-white/80 hover:text-yellow-300 transition-colors">
                成功案例
              </Link>
              <Link href="/redarmy/about" className="text-sm text-white/80 hover:text-yellow-300 transition-colors">
                关于我们
              </Link>
              <Link href="/redarmy/contact" className="text-sm text-white/80 hover:text-yellow-300 transition-colors">
                联系我们
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs">
                <Link href="/zh" className="text-white/80 hover:text-yellow-300 transition-colors">中文</Link>
                <span className="text-white/40">|</span>
                <Link href="/en" className="text-white/40 hover:text-yellow-300 transition-colors">EN</Link>
              </div>
              <Link 
                href="/redarmy/contact" 
                className="px-4 py-1.5 text-sm bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 rounded-full transition-colors border border-yellow-500/30"
              >
                立即合作
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-yellow-300/80 tracking-widest mb-4">专业 · 高效 · 可靠</p>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6" style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradient 3s ease infinite'
          }}>
            红军商业服务
            <br />
            <span className="relative">
              助力企业发展
            </span>
          </h1>
          
          <p className="text-lg text-white/90 max-w-xl mx-auto mb-8 leading-relaxed">
            专业的商业解决方案提供商
            <br />
            从战略规划到项目实施，全方位助力企业成长
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/redarmy/services" 
              className="px-6 py-3 bg-yellow-500 text-black text-sm font-medium rounded-full hover:bg-yellow-400 transition-colors"
            >
              了解服务 →
            </Link>
            <Link 
              href="/redarmy/contact" 
              className="px-6 py-3 border border-yellow-500/50 text-yellow-200 text-sm rounded-full hover:border-yellow-400 hover:text-yellow-300 transition-all flex items-center gap-2"
            >
              免费咨询
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Live Feed */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/redarmy/services" className="block group">
            <div className="p-6 rounded-2xl border border-red-900/30 hover:border-yellow-500/50 transition-all" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Status */}
                <div className="lg:w-64 shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-xs text-yellow-300/80">服务团队在线</span>
                  </div>
                  <h3 className="text-lg font-medium mb-1">专业服务团队</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold" style={{ color: '#FFD700' }}>{projectsCompleted}</span>
                    <span className="text-sm text-white/60">个项目已完成</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-yellow-200/80 group-hover:text-yellow-300 transition-colors">
                    <span>查看全部服务</span>
                    <span>→</span>
                  </div>
                </div>
                
                {/* Right: Service Cards */}
                <div className="flex-1 overflow-x-auto">
                  <div className="flex gap-3 min-w-max">
                    {services.map((service) => (
                      <div 
                        key={service.id}
                        className="p-4 rounded-xl border border-red-900/20 hover:border-yellow-500/30 shrink-0 w-40"
                        style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                      >
                        <div className="text-2xl mb-2">{service.emoji}</div>
                        <div className="text-sm font-medium">{service.name}</div>
                        <div className="text-xs text-white/60 mt-0.5">{service.role}</div>
                        <div className="flex items-center gap-1.5 mt-3">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            service.status === 'available' ? 'bg-green-400' : 
                            service.status === 'busy' ? 'bg-yellow-400' : 
                            'bg-red-400'
                          }`}></span>
                          <span className="text-xs text-white/40 capitalize">可接单</span>
                        </div>
                        <div className="text-xs text-white/30 mt-1">{service.events} 个进行中</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 px-6 border-t border-red-900/20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-yellow-300/80 tracking-widest mb-4">我们的优势</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            专业团队，卓越服务，助力您的企业腾飞
          </h2>
          <p className="text-white/80 leading-relaxed mb-6">
            红军商业服务致力于为企业提供全方位的解决方案。我们拥有丰富的行业经验，
            <Link href="/redarmy/about" className="text-yellow-300 hover:underline mx-1">专业团队</Link>,
            和经过验证的
            <Link href="/redarmy/projects" className="text-yellow-300 hover:underline mx-1">成功案例</Link>,
            帮助您在竞争激烈的市场中脱颖而出。
          </p>
          <div className="space-y-4 text-sm text-white/60">
            <p>
              我们专注于为不同规模的企业提供定制化服务
              <br />
              从初创公司到大型企业，我们都能提供合适的解决方案
            </p>
            <p>
              选择红军商业服务，您获得的不仅仅是项目成果
              <br />
              <span className="text-yellow-200/80">更是长期可靠的合作伙伴关系</span>
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-6 border-t border-red-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">专业服务项目</h2>
            <p className="text-white/80">我们提供全方位的商业解决方案，满足不同企业的发展需求</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Business Consulting */}
            <div className="p-6 rounded-2xl border border-red-900/30 hover:border-yellow-500/50 transition-all" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-bold mb-2">商业咨询</h3>
              <p className="text-sm text-white/60 mb-4">提供专业的商业策略咨询，帮助企业制定发展方向和增长策略。</p>
              <ul className="text-xs text-white/50 space-y-1">
                <li>• 市场调研与分析</li>
                <li>• 竞争对手研究</li>
                <li>• 商业模式优化</li>
                <li>• 发展战略制定</li>
              </ul>
            </div>
            
            {/* Project Development */}
            <div className="p-6 rounded-2xl border border-red-900/30 hover:border-yellow-500/50 transition-all" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">项目开发</h3>
              <p className="text-sm text-white/60 mb-4">从概念到实施的全流程项目管理，确保项目按时按质完成。</p>
              <ul className="text-xs text-white/50 space-y-1">
                <li>• 项目策划与管理</li>
                <li>• 团队组建与协调</li>
                <li>• 进度监控与报告</li>
                <li>• 质量保证与验收</li>
              </ul>
            </div>
            
            {/* Strategic Planning */}
            <div className="p-6 rounded-2xl border border-red-900/30 hover:border-yellow-500/50 transition-all" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">战略规划</h3>
              <p className="text-sm text-white/60 mb-4">为企业制定长远发展规划，明确未来发展方向和目标。</p>
              <ul className="text-xs text-white/50 space-y-1">
                <li>• 企业愿景规划</li>
                <li>• 长期目标设定</li>
                <li>• 发展路径设计</li>
                <li>• 风险评估与应对</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 border-t border-red-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">客户评价</h2>
            <p className="text-white/60">来自真实客户的反馈与评价</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl border border-red-900/30"
                style={{ background: 'rgba(255, 255, 255, 0.03)' }}
              >
                <p className="text-sm text-white/80 leading-relaxed mb-4">"{item.quote}"</p>
                <div>
                  <div className="text-sm font-medium text-yellow-200">{item.author}</div>
                  <div className="text-xs text-white/50">{item.title}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/redarmy/testimonials" 
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-yellow-300 transition-colors"
            >
              查看更多案例
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Project Tracker Preview */}
      <section className="py-16 px-6 border-t border-red-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs text-yellow-300/80 mb-4">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                <span>项目进度追踪</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">项目执行透明化</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                我们提供实时项目进度跟踪，让客户随时了解项目状态，确保项目按计划推进。
              </p>
              <div className="text-sm text-white/60">
                <span className="text-2xl font-bold text-yellow-300" style={{ color: '#FFD700' }}>{projectsCompleted}</span>
                {' '}个项目已成功交付
              </div>
            </div>
            
            <div>
              <div className="p-6 rounded-2xl border border-red-900/30" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {projectStages.map((stage) => (
                    <div key={stage.name} className="text-center">
                      <div className="text-2xl mb-2">{stage.icon}</div>
                      <div className="text-xs font-medium">{stage.name}</div>
                      <div className="text-xs text-white/50 mt-0.5">{stage.desc}</div>
                      <div className="text-lg font-bold mt-2" style={{ color: '#FFD700' }}>{stage.count}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-white/60">
                  <span>项目从左到右逐步推进</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 rounded-2xl border border-red-900/30 hover:border-yellow-500/50 transition-all" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
            <Link href="/redarmy/projects" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium mb-1">查看项目详情</h3>
                <p className="text-sm text-white/60">了解我们正在执行的项目及进展情况</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60 hover:text-yellow-300 transition-colors">
                <span>查看详情</span>
                <span>→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-6 border-t border-red-900/20">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs text-yellow-300/80 mb-4">
            <span>📞</span>
            <span>联系我们</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">获取免费咨询服务</h2>
          <p className="text-white/80 mb-8">
            填写以下信息，我们的专业顾问将尽快与您联系，为您提供个性化的解决方案。
          </p>
          
          <form onSubmit={handleContact} className="space-y-4 max-w-md mx-auto">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="您的邮箱地址"
                className="w-full px-4 py-2.5 rounded-full text-sm border border-red-900/30 bg-white/5 focus:outline-none focus:border-yellow-500/50 text-white placeholder-white/50 transition-colors"
                required
              />
            </div>
            <div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="您的联系电话"
                className="w-full px-4 py-2.5 rounded-full text-sm border border-red-900/30 bg-white/5 focus:outline-none focus:border-yellow-500/50 text-white placeholder-white/50 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-full text-sm font-medium text-black"
              style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}
            >
              立即咨询
            </button>
          </form>
          <p className="text-xs text-white/50 mt-3">我们承诺保护您的隐私，绝不泄露您的个人信息</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-red-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                红军商业服务
              </h3>
              <p className="text-sm text-white/60">专业商业解决方案，助力企业腾飞。我们的团队全天候为您服务。</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-4 text-yellow-200">服务项目</h4>
              <ul className="space-y-2">
                <li><Link href="/redarmy/services#consulting" className="text-sm text-white/60 hover:text-yellow-300 transition-colors">商业咨询</Link></li>
                <li><Link href="/redarmy/services#development" className="text-sm text-white/60 hover:text-yellow-300 transition-colors">项目开发</Link></li>
                <li><Link href="/redarmy/services#strategy" className="text-sm text-white/60 hover:text-yellow-300 transition-colors">战略规划</Link></li>
                <li><Link href="/redarmy/services#analysis" className="text-sm text-white/60 hover:text-yellow-300 transition-colors">市场分析</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-4 text-yellow-200">关于我们</h4>
              <ul className="space-y-2">
                <li><Link href="/redarmy/about" className="text-sm text-white/60 hover:text-yellow-300 transition-colors">公司简介</Link></li>
                <li><Link href="/redarmy/team" className="text-sm text-white/60 hover:text-yellow-300 transition-colors">团队介绍</Link></li>
                <li><Link href="/redarmy/projects" className="text-sm text-white/60 hover:text-yellow-300 transition-colors">成功案例</Link></li>
                <li><Link href="/redarmy/news" className="text-sm text-white/60 hover:text-yellow-300 transition-colors">新闻动态</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-4 text-yellow-200">联系方式</h4>
              <ul className="space-y-2">
                <li className="text-sm text-white/60">📧 info@redarmy-business.com</li>
                <li className="text-sm text-white/60">📞 +86 138-0000-0000</li>
                <li className="text-sm text-white/60">🏢 北京市朝阳区xxx大厦</li>
                <li><Link href="/redarmy/contact" className="text-sm text-white/60 hover:text-yellow-300 transition-colors">在线留言</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-red-900/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/40">© 2026 红军商业服务 · 保留所有权利</p>
            <div className="flex gap-6">
              <Link href="/redarmy/privacy" className="text-xs text-white/40 hover:text-yellow-300 transition-colors">隐私政策</Link>
              <Link href="/redarmy/terms" className="text-xs text-white/40 hover:text-yellow-300 transition-colors">服务条款</Link>
              <Link href="/redarmy/support" className="text-xs text-white/40 hover:text-yellow-300 transition-colors">支持中心</Link>
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