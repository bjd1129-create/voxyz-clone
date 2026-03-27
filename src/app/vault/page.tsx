'use client'

import Link from 'next/link'
import { useState } from 'react'

const pricingTiers = [
  {
    id: 'starter',
    name: 'Starter',
    price: '¥299',
    originalPrice: '¥499',
    discount: '40% OFF',
    description: '从零开始，搭建你的 AI Agent 团队',
    audience: '独立开发者 · 内容创作者',
    features: [
      { text: '10 个 Agent 角色定义 + 协作流程', included: true },
      { text: '一键部署脚本（Vercel/Cloudflare）', included: true },
      { text: '飞书/微信/Telegram 配置模板', included: true },
      { text: '20+ 失败模式文档', included: true },
      { text: '基础监控仪表盘', included: true },
      { text: '社区支持（飞书群组）', included: true },
      { text: '详细部署文档', included: true },
      { text: '视频教程', included: true },
      { text: '多 Agent 对抗审核管道', included: false },
      { text: '长期记忆 + 上下文管理', included: false },
      { text: '生产级运维手册', included: false },
      { text: '实时监控 + 告警系统', included: false },
      { text: '开放 API + Webhook 支持', included: false },
      { text: '1 对 1 部署协助', included: false },
      { text: '优先技术支持', included: false },
      { text: '定制 Agent 角色开发', included: false },
      { text: '企业系统集成对接', included: false },
      { text: '私有化部署方案', included: false },
      { text: '团队培训服务', included: false },
      { text: '专属技术支持通道', included: false },
      { text: 'SLA 服务保障', included: false },
    ],
    cta: '立即开始',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '¥799',
    originalPrice: '¥1,299',
    discount: '39% OFF',
    badge: '最受欢迎',
    description: '已有系统，需要规模化升级',
    audience: '小型创业团队 · 产品负责人',
    features: [
      { text: '10 个 Agent 角色定义 + 协作流程', included: true },
      { text: '一键部署脚本（Vercel/Cloudflare）', included: true },
      { text: '飞书/微信/Telegram 配置模板', included: true },
      { text: '20+ 失败模式文档', included: true },
      { text: '基础监控仪表盘', included: true },
      { text: '社区支持（飞书群组）', included: true },
      { text: '详细部署文档', included: true },
      { text: '视频教程', included: true },
      { text: '多 Agent 对抗审核管道', included: true },
      { text: '长期记忆 + 上下文管理', included: true },
      { text: '生产级运维手册', included: true },
      { text: '实时监控 + 告警系统', included: true },
      { text: '开放 API + Webhook 支持', included: true },
      { text: '1 对 1 部署协助', included: true },
      { text: '优先技术支持', included: true },
      { text: '定制 Agent 角色开发', included: false },
      { text: '企业系统集成对接', included: false },
      { text: '私有化部署方案', included: false },
      { text: '团队培训服务', included: false },
      { text: '专属技术支持通道', included: false },
      { text: 'SLA 服务保障', included: false },
    ],
    cta: '升级 Pro',
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '定制',
    originalPrice: null,
    discount: null,
    description: '企业级定制需求',
    audience: '企业决策者 · 技术团队',
    features: [
      { text: '10 个 Agent 角色定义 + 协作流程', included: true },
      { text: '一键部署脚本（Vercel/Cloudflare）', included: true },
      { text: '飞书/微信/Telegram 配置模板', included: true },
      { text: '20+ 失败模式文档', included: true },
      { text: '基础监控仪表盘', included: true },
      { text: '社区支持（飞书群组）', included: true },
      { text: '详细部署文档', included: true },
      { text: '视频教程', included: true },
      { text: '多 Agent 对抗审核管道', included: true },
      { text: '长期记忆 + 上下文管理', included: true },
      { text: '生产级运维手册', included: true },
      { text: '实时监控 + 告警系统', included: true },
      { text: '开放 API + Webhook 支持', included: true },
      { text: '1 对 1 部署协助', included: true },
      { text: '优先技术支持', included: true },
      { text: '定制 Agent 角色开发', included: true },
      { text: '企业系统集成对接', included: true },
      { text: '私有化部署方案', included: true },
      { text: '团队培训服务', included: true },
      { text: '专属技术支持通道', included: true },
      { text: 'SLA 服务保障', included: true },
    ],
    cta: '联系咨询',
    highlight: false,
  },
]

const faqs = [
  {
    question: '一次付费是什么意思？',
    answer: '参照 VoxYZ 的定价策略，我们采用一次付费、永久更新的模式。没有订阅，没有隐藏费用。你买的是一套完整的系统，不是租用服务。',
  },
  {
    question: '付款后多久可以访问？',
    answer: '支付完成后几分钟内，你会收到邮件邀请加入私有 Git 仓库。同时会收到详细部署文档和视频教程。',
  },
  {
    question: '需要什么技术基础？',
    answer: 'Starter 版本适合有基础编程能力的开发者。如果你能看懂 README 并运行命令行，就能部署。Pro 版本提供 1 对 1 部署协助，Enterprise 版本包含完整实施服务。',
  },
  {
    question: '支持什么支付方式？',
    answer: '支持微信支付、支付宝、信用卡（Stripe）。企业客户可以走对公转账。',
  },
  {
    question: '可以退款吗？',
    answer: '支持 7 天无理由退款。如果产品不符合预期，发送邮件即可办理。',
  },
  {
    question: '更新怎么收费？',
    answer: '永久免费更新。我们持续迭代系统，你只需要 git pull 就能获取最新版本。',
  },
]

const testimonials = [
  {
    quote: 'Zhuge Bulb made me truly understand what an AI team can do. Within a week, I had 10 agents working for me.',
    author: 'Mr. Zhang',
    title: '独立开发者',
    avatar: '👨‍💻',
  },
  {
    quote: 'I thought I needed a big team to do these things. Now my AI team completes work daily that used to require 5 people.',
    author: 'Ms. Li',
    title: '创业者',
    avatar: '👩‍💼',
  },
  {
    quote: "OpenClaw's system design is amazing. I built my own agent team following the docs, and it's now a core company asset.",
    author: 'Mr. Wang',
    title: '产品负责人',
    avatar: '👨‍💼',
  },
]

const trustBadges = [
  { icon: '🔒', text: '安全支付' },
  { icon: '✓', text: '7 天退款保证' },
  { icon: '🎁', text: '永久免费更新' },
  { icon: '💬', text: '技术支持' },
]

const paymentMethods = [
  { name: '微信支付', icon: '💚' },
  { name: '支付宝', icon: '💙' },
  { name: 'Stripe', icon: '💜' },
  { name: '对公转账', icon: '🏦' },
]

export default function VaultPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showComparison, setShowComparison] = useState(false)

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
              <Link href="/vault" className="text-sm text-white transition-colors">
                Knowledge Base
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs">
                <Link href="/zh" className="text-white/60 hover:text-white transition-colors">中文</Link>
                <span className="text-white/20">|</span>
                <span className="text-white/40">EN</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 text-xs text-white/60 mb-6" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            <span>Knowledge Base</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #4ecdc4 50%, #22c55e 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradient 3s ease infinite'
          }}>
            你的第一个
            <br />
            AI 团队。
          </h1>

          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed">
            10 个 Agent，24/7 工作。从角色定义到生产部署，
            <br />
            <span className="text-white/80">一次付费，永久更新。无订阅，无隐藏费用。</span>
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="#pricing" 
              className="px-6 py-3 bg-white text-black text-sm font-medium rounded-full hover:bg-white/90 transition-colors"
            >
              查看定价
            </Link>
            <Link 
              href="/office" 
              className="px-6 py-3 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all flex items-center gap-2"
            >
              看看他们如何工作
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-1" style={{ color: '#4ecdc4' }}>10</div>
              <div className="text-sm text-white/40">预置 Agent 角色</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1" style={{ color: '#4ecdc4' }}>5分钟</div>
              <div className="text-sm text-white/40">一键部署上线</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1" style={{ color: '#4ecdc4' }}>20+</div>
              <div className="text-sm text-white/40">失败模式文档</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1" style={{ color: '#4ecdc4' }}>永久</div>
              <div className="text-sm text-white/40">免费更新</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-white/50">
                <span className="text-lg">{badge.icon}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">选择适合你的方案</h2>
            <p className="text-white/60">一次付费，永久更新。无订阅，无隐藏费用。</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {pricingTiers.map((tier) => (
              <div 
                key={tier.id}
                className={`relative p-6 rounded-2xl transition-all ${
                  tier.highlight 
                    ? 'border-2' 
                    : 'border border-white/10 hover:border-white/20'
                }`}
                style={{ 
                  background: tier.highlight 
                    ? 'linear-gradient(180deg, rgba(78, 205, 196, 0.12) 0%, rgba(78, 205, 196, 0.04) 100%)' 
                    : 'rgba(255, 255, 255, 0.02)',
                  borderColor: tier.highlight ? '#4ecdc4' : undefined,
                }}
              >
                {/* 推荐标签 */}
                {tier.badge && (
                  <div 
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ 
                      background: 'linear-gradient(135deg, #22c55e, #4ecdc4)',
                      color: '#000',
                      boxShadow: '0 4px 12px rgba(78, 205, 196, 0.3)'
                    }}
                  >
                    {tier.badge}
                  </div>
                )}
                
                {tier.discount && (
                  <div className={`text-xs font-medium mb-2 ${
                    tier.highlight ? 'text-cyan-400' : 'text-green-400'
                  }`}>
                    限时 {tier.discount}
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                <p className="text-sm text-white/60 mb-4">{tier.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.originalPrice && (
                      <span className="text-sm text-white/40 line-through">{tier.originalPrice}</span>
                    )}
                  </div>
                  {tier.originalPrice && (
                    <div className="text-xs text-white/40 mt-1">一次付费，永久更新</div>
                  )}
                </div>
                
                <div className="text-xs text-white/40 mb-6">{tier.audience}</div>
                
                <button 
                  className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all ${
                    tier.highlight 
                      ? 'text-black hover:opacity-90' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  style={tier.highlight ? { 
                    background: 'linear-gradient(135deg, #22c55e, #4ecdc4)',
                    boxShadow: '0 4px 16px rgba(78, 205, 196, 0.25)'
                  } : {}}
                >
                  {tier.cta}
                </button>

                {/* 快速功能列表 - 只显示数量统计 */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="text-xs text-white/40">
                    包含 <span className="text-white/70">{tier.features.filter(f => f.included).length}</span> 项核心功能
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 功能对比展开按钮 */}
          <div className="text-center">
            <button 
              onClick={() => setShowComparison(!showComparison)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
            >
              <span>{showComparison ? '收起' : '查看'}功能对比</span>
              <span style={{ 
                transform: showComparison ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }}>▼</span>
            </button>
          </div>

          {/* 功能对比表格 */}
          {showComparison && (
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-white/60 font-medium">功能</th>
                    <th className="text-center py-4 px-4 text-white/80 font-medium w-[120px]">Starter</th>
                    <th className="text-center py-4 px-4 text-cyan-400 font-medium w-[120px]" style={{ background: 'rgba(78, 205, 196, 0.05)' }}>Pro</th>
                    <th className="text-center py-4 px-4 text-white/80 font-medium w-[120px]">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingTiers[0].features.map((feature, index) => (
                    <tr key={index} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 text-white/70">{feature.text}</td>
                      <td className="text-center py-3 px-4">
                        {pricingTiers[0].features[index].included ? (
                          <span className="text-green-400">✓</span>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                      <td className="text-center py-3 px-4" style={{ background: 'rgba(78, 205, 196, 0.02)' }}>
                        {pricingTiers[1].features[index].included ? (
                          <span className="text-cyan-400">✓</span>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        {pricingTiers[2].features[index].included ? (
                          <span className="text-green-400">✓</span>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* 支付方式 */}
          <div className="mt-12 text-center">
            <p className="text-xs text-white/40 mb-4">支持的支付方式</p>
            <div className="flex justify-center gap-6">
              {paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center gap-1.5 text-sm text-white/50">
                  <span>{method.icon}</span>
                  <span>{method.name}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-white/30 mt-8">
            已有 <span className="text-white/50">50+</span> 位构建者正在使用
          </p>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">你将获得什么</h2>
            <p className="text-white/60">从零到一，完整的 AI Agent 团队构建方案</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-colors" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="text-2xl mb-3">📦</div>
              <h3 className="text-lg font-medium mb-2">核心 Playbook</h3>
              <p className="text-sm text-white/60">10 个 Agent 角色定义、协作流程、任务调度规则。开箱即用的团队架构。</p>
            </div>
            
            <div className="p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-colors" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="text-2xl mb-3">🚀</div>
              <h3 className="text-lg font-medium mb-2">部署脚本</h3>
              <p className="text-sm text-white/60">一键部署到 Vercel 或 Cloudflare。5 分钟上线，零配置。</p>
            </div>
            
            <div className="p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-colors" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="text-2xl mb-3">⚙️</div>
              <h3 className="text-lg font-medium mb-2">配置模板</h3>
              <p className="text-sm text-white/60">飞书、微信、Telegram 集成配置模板。修改环境变量即可使用。</p>
            </div>
            
            <div className="p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-colors" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="text-2xl mb-3">📚</div>
              <h3 className="text-lg font-medium mb-2">失败模式文档</h3>
              <p className="text-sm text-white/60">20+ 常见陷阱和解决方案。别人踩过的坑，你不用再踩。</p>
            </div>
            
            <div className="p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-colors" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="text-2xl mb-3">📊</div>
              <h3 className="text-lg font-medium mb-2">监控仪表盘</h3>
              <p className="text-sm text-white/60">实时监控 Agent 状态、任务执行日志、协作流程可视化。</p>
            </div>
            
            <div className="p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-colors" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="text-2xl mb-3">💬</div>
              <h3 className="text-lg font-medium mb-2">社区支持</h3>
              <p className="text-sm text-white/60">飞书群组交流、邮件技术支持、定期更新分享。</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">常见问题</h2>
            <p className="text-white/60">还有疑问？查看 <Link href="/faq" className="text-white hover:underline">完整 FAQ</Link></p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-colors"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}
              >
                <button
                  className="w-full p-6 text-left flex justify-between items-center gap-4"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-medium">{faq.question}</span>
                  <span className={`text-white/40 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-sm text-white/60 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">用户反馈</h2>
            <p className="text-white/40">真实消息，真实构建者</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-colors"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}
              >
                <p className="text-sm text-white/70 leading-relaxed mb-4">"{item.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{item.avatar}</div>
                  <div>
                    <div className="text-sm font-medium">{item.author}</div>
                    <div className="text-xs text-white/40">{item.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">准备好构建你的 AI 团队了吗？</h2>
          <p className="text-white/60 mb-8">
            现在开始，几个月后当模型变得更智能，
            <br />
            你的团队已经积累了所有决策、对话和思考过程。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="#pricing" 
              className="px-8 py-3.5 rounded-xl text-sm font-semibold text-black hover:opacity-90 transition-opacity"
              style={{ 
                background: 'linear-gradient(135deg, #22c55e, #4ecdc4)',
                boxShadow: '0 4px 16px rgba(78, 205, 196, 0.25)'
              }}
            >
              立即开始
            </Link>
            <Link 
              href="/office" 
              className="px-8 py-3.5 rounded-xl text-sm font-semibold border border-white/20 text-white/70 hover:border-white/40 hover:text-white transition-all"
            >
              查看演示
            </Link>
          </div>

          {/* 安全徽章 */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-white/40">
            <div className="flex items-center gap-1.5">
              <span>🔒</span>
              <span>256-bit SSL 加密</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🛡️</span>
              <span>Stripe 安全支付</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>↩️</span>
              <span>7 天退款保证</span>
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
                Zhuge Bulb
              </h3>
              <p className="text-sm text-white/40">构建你的 AI 团队。24/7 为你工作。</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-4">产品</h4>
              <ul className="space-y-2">
                <li><Link href="/swarm" className="text-sm text-white/40 hover:text-white transition-colors">Command Center</Link></li>
                <li><Link href="/office" className="text-sm text-white/40 hover:text-white transition-colors">Live Office</Link></li>
                <li><Link href="/radar" className="text-sm text-white/40 hover:text-white transition-colors">Demand Radar</Link></li>
                <li><Link href="/vault" className="text-sm text-white/40 hover:text-white transition-colors">Knowledge Base</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-4">资源</h4>
              <ul className="space-y-2">
                <li><Link href="/insights" className="text-sm text-white/40 hover:text-white transition-colors">Field Notes</Link></li>
                <li><Link href="/faq" className="text-sm text-white/40 hover:text-white transition-colors">FAQ</Link></li>
                <li><a href="https://github.com/Heyvhuang/ship-faster" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white transition-colors">Ship Faster Repo</a></li>
                <li><a href="https://docs.openclaw.ai/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white transition-colors">Docs</a></li>
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
            <p className="text-xs text-white/30">© 2026 Zhuge Bulb · Powered by OpenClaw</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors">隐私政策</Link>
              <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">服务条款</Link>
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