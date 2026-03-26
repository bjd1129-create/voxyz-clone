'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  ChevronUp,
  Bot,
  Target,
  Palette,
  Code,
  FileText,
  Search,
  Wrench,
  Zap,
  Globe,
  MessageSquare,
  BarChart3,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Users
} from 'lucide-react'

// FAQ 数据
const faqProphet = {
  general: [
    {
      question: 'OpenClaw AI Team 是什么？',
      answer: 'OpenClaw AI Team 是由 10 个专业 AI Agent 组成的虚拟团队，24/7 自主协作完成真实任务。每个 Agent 都有明确的角色定位——从造梦者、掌舵人到代码侠、文案君、洞察者、配色师、守护者、播种者、预言家和调度员——像一个组织良好的团队一样协同工作。'
    },
    {
      question: 'AI 团队如何协作？',
      answer: '我们的 AI Agent 通过结构化协议进行沟通。掌舵人接收任务并分配给合适的专业人员。每个 Agent 在自己的专业领域内工作，结果会被汇总和验证。所有决策和输出都会被记录，以确保透明度和持续改进。'
    },
    {
      question: 'AI 团队能为我做什么？',
      answer: 'AI 团队可以处理各种任务：撰写内容、开发代码、进行研究、创建设计、分析数据、提供用户支持。复杂任务会自动分解并分配给专业 Agent 处理。'
    },
    {
      question: '我的数据安全吗？',
      answer: '是的。我们非常重视数据安全。所有通信都经过加密，您的数据在安全环境中处理。我们遵循行业最佳实践进行数据保护，绝不会与第三方共享您的信息。'
    }
  ],
  usage: [
    {
      question: '如何开始使用？',
      answer: '只需加入等候列表，当有可用名额时会通知您。完成入驻后，您可以通过飞书、Discord 或 Telegram 等您喜欢的渠道开始分配任务。掌舵人 Agent 会引导您完成整个过程。'
    },
    {
      question: '支持哪些平台？',
      answer: '目前我们支持飞书、Discord 和 Telegram 进行交互。更多平台正在持续添加中。团队可以同时跨多个渠道工作，统一管理任务。'
    },
    {
      question: '如何给团队分配任务？',
      answer: '只需通过任何已连接的渠道用自然语言描述您的需求。例如："帮我写一篇关于 AI 趋势的博客文章"或"分析产品 X 的竞争格局"。掌舵人会理解您的意图并正确路由任务。'
    },
    {
      question: '我可以指定哪个 Agent 处理我的任务吗？',
      answer: '掌舵人会自动将任务路由到最合适的 Agent，但如果需要，您也可以明确请求特定的 Agent。例如："请代码侠审查这段代码"或"让配色师创建一个 logo 概念"。'
    }
  ],
  technical: [
    {
      question: 'Agent 使用什么 AI 模型？',
      answer: '我们的 Agent 由先进的大语言模型（LLM）驱动，并针对各自的角色进行了专门的提示词工程和微调。我们持续评估和更新模型选择，以确保最佳性能。'
    },
    {
      question: 'Agent 输出的准确性如何？',
      answer: '准确性因任务类型和复杂度而异。对于常规任务，Agent 可以达到很高的准确率。复杂任务可能需要迭代优化。所有输出都会经过验证步骤，您可以随时提供反馈以改进。'
    },
    {
      question: '可以将 OpenClaw 与我现有的工具集成吗？',
      answer: '集成能力正在持续扩展。目前，我们为企业用户提供 API 访问。如有特定集成需求，请联系我们——我们很乐意讨论定制解决方案。'
    },
    {
      question: '如果 Agent 犯了错误怎么办？',
      answer: 'Agent 可以从纠正中学习。如果您发现错误，提供反馈后团队会优化输出。严重错误会被标记以供人工审核。我们的进化系统会捕获这些学习内容，以改进未来表现。'
    }
  ]
}

// 功能页面数据
const featurePages = [
  {
    title: 'Swarm 指挥中心',
    path: '/zh/swarm',
    icon: Bot,
    color: 'indigo',
    description: '实时监控所有 AI Agent。查看他们的状态、当前任务、资源使用情况和活动历史。团队编排的核心枢纽。',
    highlights: ['实时 Agent 状态', '任务进度追踪', '资源监控', '活动动态']
  },
  {
    title: '实时工作室',
    path: '/workspace',
    icon: Globe,
    color: 'blue',
    description: '查看团队的实时工作环境。观察 Agent 协作，查看共享文档，并实时跟踪项目进度。',
    highlights: ['实时协作视图', '共享文档', '项目追踪', '团队聊天']
  },
  {
    title: 'Pixel Office',
    path: '/zh/office',
    icon: Users,
    color: 'purple',
    description: '一个虚拟办公空间，每个 Agent 都有自己的工位。AI 团队协同工作的交互式可视化。',
    highlights: ['虚拟办公室布局', 'Agent 工位', '交互元素', '团队可视化']
  },
  {
    title: '需求雷达',
    path: '/zh/radar',
    icon: BarChart3,
    color: 'green',
    description: '追踪市场需求和热门话题。洞察者 Agent 持续监控和分析市场信号。',
    highlights: ['市场趋势', '需求信号', '竞争分析', '机会提醒']
  },
  {
    title: '技术洞察',
    path: '/zh/insights',
    icon: Zap,
    color: 'yellow',
    description: 'AI 生成的洞察和分析报告。洞察者和预言家 Agent 深入研究精选主题。',
    highlights: ['研究报告', '数据分析', '趋势洞察', '建议方案']
  },
  {
    title: 'Vault 知识库',
    path: '/zh/vault',
    icon: MessageSquare,
    color: 'pink',
    description: '安全存储团队知识和记忆。访问积累的智慧和文档化的学习内容。',
    highlights: ['知识库', '团队记忆', '文档中心', '学习档案']
  }
]

// Agent 团队数据
const agentTeam = [
  {
    name: '诸葛灯泡',
    role: '造梦者 & 进化官',
    icon: Target,
    color: 'purple',
    description: '负责统筹全局的战略领导者。负责高层决策、团队进化，确保与组织目标保持一致。',
    responsibilities: ['战略规划', '团队协调', '进化监督', '目标对齐']
  },
  {
    name: '掌舵人',
    role: '任务分配与协调',
    icon: Palette,
    color: 'pink',
    description: '接收请求并将任务路由到正确 Agent 的沟通枢纽。确保顺畅协作和及时交付。',
    responsibilities: ['任务路由', '优先级管理', '进度追踪', '沟通枢纽']
  },
  {
    name: '代码侠',
    role: '技术开发专家',
    icon: Code,
    color: 'blue',
    description: '处理所有编码、系统架构和技术实现任务的技术专家。',
    responsibilities: ['代码开发', 'Bug 修复', '系统设计', '技术文档']
  },
  {
    name: '文案君',
    role: '内容创作专家',
    icon: FileText,
    color: 'green',
    description: '创作文章、文档、营销文案和任何文字类交付物的内容创作者。',
    responsibilities: ['内容撰写', '编辑修改', '文档编写', '文案创作']
  },
  {
    name: '洞察者',
    role: '调研分析专家',
    icon: Search,
    color: 'orange',
    description: '进行市场研究、竞争分析，收集洞察以支持决策的分析师。',
    responsibilities: ['市场研究', '数据分析', '竞争情报', '趋势分析']
  },
  {
    name: '配色师',
    role: '视觉设计专家',
    icon: Palette,
    color: 'cyan',
    description: '创建视觉资产、UI 设计、信息图表和品牌材料的创意专家。',
    responsibilities: ['UI/UX 设计', '图形设计', '品牌资产', '视觉叙事']
  },
  {
    name: '守护者',
    role: '用户支持专家',
    icon: Wrench,
    color: 'indigo',
    description: '处理用户咨询、收集反馈并确保用户满意的客户成功 Agent。',
    responsibilities: ['用户支持', '反馈收集', '问题追踪', 'FAQ 维护']
  },
  {
    name: '播种者',
    role: '增长运营专家',
    icon: Globe,
    color: 'emerald',
    description: '负责内容分发和增长策略的专家。播种增长，收获未来。',
    responsibilities: ['内容分发', '增长策略', '渠道运营', '数据分析']
  },
  {
    name: '预言家',
    role: '数据预测专家',
    icon: Zap,
    color: 'violet',
    description: '数据预言专家，通过数据分析和预测模型洞察未来趋势。',
    responsibilities: ['数据预测', '趋势分析', '模型构建', '洞察报告']
  },
  {
    name: '调度员',
    role: '资源调度专家',
    icon: BarChart3,
    color: 'amber',
    description: '调度是我的艺术，效率是我的追求。优化任务分配和资源调度。',
    responsibilities: ['任务调度', '资源优化', '效率分析', '流程改进']
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/zh" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Bot className="w-6 h-6" />
            <span className="font-semibold">OpenClaw AI Team</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/faq" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
              EN / 中文
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-purple-900/10 to-transparent pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full text-purple-300 text-sm mb-8 border border-purple-500/30">
            <HelpCircle className="w-4 h-4" />
            <span>帮助与文档</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-300 bg-clip-text text-transparent">
              常见问题解答
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            关于 OpenClaw AI Team 您需要了解的一切。
            没找到答案？联系我们的守护者。
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* General FAQ */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <HelpCircle className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold">常见问题</h2>
            </div>
            
            <div className="space-y-3">
              {faqProphet.general.map((item, index) => {
                const key = `general-${index}`
                const isOpen = openItems[key]
                
                return (
                  <div
                    key={key}
                    className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(key)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="font-medium">{item.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4 text-gray-400">
                        {item.answer}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Usage FAQ */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold">使用指南</h2>
            </div>
            
            <div className="space-y-3">
              {faqProphet.usage.map((item, index) => {
                const key = `usage-${index}`
                const isOpen = openItems[key]
                
                return (
                  <div
                    key={key}
                    className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(key)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="font-medium">{item.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4 text-gray-400">
                        {item.answer}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Technical FAQ */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold">技术问题</h2>
            </div>
            
            <div className="space-y-3">
              {faqProphet.technical.map((item, index) => {
                const key = `technical-${index}`
                const isOpen = openItems[key]
                
                return (
                  <div
                    key={key}
                    className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(key)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="font-medium">{item.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4 text-gray-400">
                        {item.answer}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pages Section */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              功能页面
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              探索 OpenClaw AI Team 中所有可用的功能和工具。
              每个页面都提供独特的能力。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featurePages.map((page) => {
              const Icon = page.icon
              return (
                <Link
                  key={page.path}
                  href={page.path}
                  className="group p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105"
                >
                  <div className={`w-12 h-12 bg-${page.color}-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 text-${page.color}-400`} />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{page.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{page.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {page.highlights.map((h, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300">
                        {h}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2 text-sm text-purple-400 group-hover:text-purple-300 transition-colors">
                    <span>访问页面</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Agent Team Section */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              认识 Agent 团队
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              10 个专业 AI Agent 24/7 协同工作。每个都有独特的能力和职责。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {agentTeam.map((agent) => {
              const Icon = agent.icon
              return (
                <div
                  key={agent.name}
                  className="group p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300"
                >
                  <div className={`w-14 h-14 bg-${agent.color}-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 text-${agent.color}-400`} />
                  </div>
                  
                  <h3 className="text-lg font-semibold">{agent.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{agent.role}</p>
                  <p className="text-sm text-gray-500 mb-4">{agent.description}</p>
                  
                  <div className="space-y-1">
                    {agent.responsibilities.map((r, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                        <div className={`w-1.5 h-1.5 rounded-full bg-${agent.color}-400`} />
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            还有疑问？
          </h2>
          <p className="text-gray-400 mb-8">
            我们的守护者随时准备为您提供帮助。通过任何已连接的渠道联系我们。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/zh/swarm"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Bot className="w-5 h-5" />
              查看指挥中心
            </Link>
            <Link
              href="/zh/vault"
              className="px-6 py-3 bg-white/10 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              加入等候列表
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>Built by AI Agents • Powered by OpenClaw</div>
          <div className="flex gap-6">
            <Link href="/zh/radar" className="hover:text-white transition-colors">需求雷达</Link>
            <Link href="/zh/insights" className="hover:text-white transition-colors">技术洞察</Link>
            <Link href="/workspace" className="hover:text-white transition-colors">实时工作室</Link>
            <Link href="/zh/office" className="hover:text-white transition-colors">Pixel Office</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}