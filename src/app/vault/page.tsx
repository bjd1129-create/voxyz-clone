'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, Book, Code, Zap, Shield, Users, Clock, 
  Check, X, ChevronDown, ChevronUp, Sparkles, Lock,
  FileText, MessageSquare, TrendingUp, Database
} from 'lucide-react'
import MobileNav from '@/components/MobileNav'
import DesktopNav from '@/components/DesktopNav'

// Feature data
const FEATURES = [
  {
    icon: <Book className="w-6 h-6" />,
    title: '知识库管理',
    description: '团队沉淀的方法论、最佳实践和文档，可搜索、可复用',
    highlight: '智能分类与标签'
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: '代码片段库',
    description: '常用代码模板、组件和工具函数，一键复用',
    highlight: '多语言支持'
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: '工作流模板',
    description: '经过验证的工作流程，标准化团队协作',
    highlight: '可定制流程'
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: '权限控制',
    description: '细粒度的访问权限，保护敏感信息',
    highlight: '角色级别管理'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: '团队协作',
    description: '多人实时编辑、评论和版本追踪',
    highlight: '实时同步'
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: '历史记录',
    description: '完整的操作日志和版本回溯',
    highlight: '无限版本保留'
  },
]

// Pricing plans
const PLANS = [
  {
    name: 'Starter',
    price: '免费',
    priceNote: '永久免费',
    description: '适合个人和小型团队起步',
    features: [
      { text: '最多 3 个知识库', included: true },
      { text: '100MB 存储空间', included: true },
      { text: '基础搜索功能', included: true },
      { text: '最多 3 名团队成员', included: true },
      { text: '社区支持', included: true },
      { text: 'API 访问', included: false },
      { text: '高级权限管理', included: false },
      { text: '自定义域名', included: false },
    ],
    cta: '开始使用',
    popular: false,
  },
  {
    name: 'Pro',
    price: '¥99',
    priceNote: '/月/团队',
    description: '适合成长型团队和专业用户',
    features: [
      { text: '无限知识库', included: true },
      { text: '10GB 存储空间', included: true },
      { text: 'AI 智能搜索', included: true },
      { text: '无限团队成员', included: true },
      { text: '优先技术支持', included: true },
      { text: 'API 访问', included: true },
      { text: '高级权限管理', included: true },
      { text: '自定义品牌', included: true },
    ],
    cta: '开始试用',
    popular: true,
  },
]

// FAQ data
const FAQS = [
  {
    question: 'Vault 是什么？',
    answer: 'Vault 是诸葛灯泡团队的知识管理系统，帮助团队沉淀、组织和共享知识资产。它集成了文档管理、代码片段库、工作流模板等功能，让团队协作更高效。'
  },
  {
    question: 'Starter 版本真的免费吗？',
    answer: '是的，Starter 版本完全免费，没有隐藏费用。我们相信每个团队都值得拥有一个好的知识管理工具。当团队成长后，可以随时升级到 Pro 版本。'
  },
  {
    question: '如何从其他工具迁移数据？',
    answer: '我们支持从 Notion、语雀、飞书文档等主流工具导入数据。Pro 用户可以获得专属的迁移支持服务，确保数据平滑过渡。'
  },
  {
    question: '数据安全如何保障？',
    answer: '我们采用银行级别的加密存储，所有数据在传输和存储过程中都经过 AES-256 加密。同时支持数据导出和备份，确保您对自己的数据拥有完全控制权。'
  },
  {
    question: '可以自定义 Vault 的外观吗？',
    answer: 'Pro 版本支持自定义品牌、域名和主题颜色，让 Vault 与您的团队品牌保持一致。企业版还支持更多定制选项。'
  },
  {
    question: '如何获取技术支持？',
    answer: 'Starter 用户可以通过社区论坛获取帮助。Pro 用户享有优先技术支持，工作日 24 小时内响应。企业用户享有专属客户经理和 SLA 保障。'
  },
]

export default function VaultPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Mobile Navigation */}
      <MobileNav langToggleHref="/zh/vault" />
      
      {/* Desktop Navigation */}
      <DesktopNav langToggleHref="/zh/vault" />

      {/* Background pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10">
        {/* Desktop Header */}
        <header className="hidden md:block border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-8 lg:px-12 py-5 lg:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 lg:gap-6">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Vault 知识库
                  </h1>
                  <p className="text-sm lg:text-base text-gray-500">
                    团队知识的中央存储库
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link 
                  href="#pricing"
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  查看定价
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Title */}
        <div className="md:hidden px-4 py-4 text-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Vault 知识库
          </h1>
          <p className="text-xs text-gray-400 mt-1">团队知识的中央存储库</p>
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-full border border-primary-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-300">知识 · 流程 · 协作</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-primary-500 bg-clip-text text-transparent">
                团队知识的
              </span>
              <br />
              <span className="text-white">中央存储库</span>
            </h2>
            
            <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg mb-8 leading-relaxed">
              沉淀方法论、工具和最佳实践。让知识流动，让协作更高效。
              <br />
              AI Agent 团队持续维护，不断优化。
            </p>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link 
                href="#pricing"
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                免费开始
                <Zap className="w-4 h-4" />
              </Link>
              <Link 
                href="#features"
                className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                了解更多
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 sm:mt-16">
            {[
              { value: '500+', label: '知识条目' },
              { value: '50+', label: '工作流模板' },
              { value: '99.9%', label: '可用性' },
              { value: '10ms', label: '平均响应' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">核心功能</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              为团队知识管理打造的完整解决方案
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {FEATURES.map((feature, index) => (
              <div 
                key={index}
                className="group p-5 sm:p-6 bg-white/5 rounded-xl border border-white/10 hover:border-primary-500/30 transition-all hover:bg-white/10"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 flex items-center justify-center text-primary-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{feature.description}</p>
                <span className="text-xs text-primary-400 bg-primary-500/10 px-2 py-1 rounded">
                  {feature.highlight}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">选择方案</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              从免费开始，按需扩展
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {PLANS.map((plan, index) => (
              <div 
                key={index}
                className={`relative p-6 sm:p-8 rounded-2xl border ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-primary-500/10 to-primary-600/5 border-primary-500/30' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full text-xs font-medium">
                    最受欢迎
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 text-sm">{plan.priceNote}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-gray-300' : 'text-gray-500'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button 
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:opacity-90' 
                      : 'bg-white/10 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">常见问题</h2>
            <p className="text-gray-400">
              有其他问题？欢迎联系我们的支持团队
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index}
                className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium text-white pr-4">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="relative p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 border border-primary-500/20 text-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                准备好开始了吗？
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto mb-6">
                免费开始使用 Vault，让团队知识管理更上一层楼
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                <Link 
                  href="/swarm"
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  免费注册
                  <Sparkles className="w-4 h-4" />
                </Link>
                <Link 
                  href="/office"
                  className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg font-medium hover:bg-white/20 transition-colors"
                >
                  观看演示
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="text-gray-500 text-sm">
              Built by AI Agents · Powered by OpenClaw
            </div>
            <div className="mt-4 flex justify-center gap-6 text-sm text-gray-400">
              <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
              <Link href="/radar" className="hover:text-white transition-colors">Radar</Link>
              <Link href="/insights" className="hover:text-white transition-colors">Insights</Link>
              <Link href="/zh/" className="hover:text-white transition-colors">中文</Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}