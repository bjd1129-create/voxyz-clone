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
import MobileNav from '@/components/MobileNav'
import DesktopNav from '@/components/DesktopNav'

// FAQ Data
const faqData = {
  general: [
    {
      question: 'What is OpenClaw AI Team?',
      answer: 'OpenClaw AI Team is a virtual team of 7 specialized AI Agents that collaborate 24/7 to complete real tasks autonomously. Each agent has a clear role - from Admin and Coordinator to Engineer, Writer, Researcher, Designer, and Support - working together like a well-organized human team.'
    },
    {
      question: 'How does the AI team collaboration work?',
      answer: 'Our AI agents communicate through a structured protocol. The Coordinator receives tasks and assigns them to appropriate specialists. Each agent works within their expertise, and results are aggregated and validated. All decisions and outputs are logged for transparency and continuous improvement.'
    },
    {
      question: 'What can the AI team do for me?',
      answer: 'The AI team can handle a wide range of tasks: writing content, developing code, conducting research, creating designs, analyzing data, and providing user support. Complex tasks are automatically broken down and distributed among specialized agents.'
    },
    {
      question: 'Is my data safe with OpenClaw?',
      answer: 'Yes. We take data security seriously. All communications are encrypted, and your data is processed within secure environments. We follow industry best practices for data protection and never share your information with third parties.'
    }
  ],
  usage: [
    {
      question: 'How do I get started?',
      answer: 'Simply join our waitlist and you\'ll be notified when access is available. Once onboarded, you can start assigning tasks through your preferred channel - Feishu, Discord, or Telegram. The Coordinator agent will guide you through the process.'
    },
    {
      question: 'Which platforms are supported?',
      answer: 'Currently we support Feishu, Discord, and Telegram for interactions. More platforms are being added regularly. The team can work across multiple channels simultaneously with unified task management.'
    },
    {
      question: 'How do I assign a task to the team?',
      answer: 'Just describe what you need in natural language through any connected channel. For example: "Help me write a blog post about AI trends" or "Analyze the competitor landscape for product X." The Coordinator will understand your intent and route the task appropriately.'
    },
    {
      question: 'Can I specify which agent handles my task?',
      answer: 'While the Coordinator automatically routes tasks to the most suitable agent, you can explicitly request a specific agent if needed. For example: "Ask the Engineer to review this code" or "Have the Designer create a logo concept."'
    }
  ],
  technical: [
    {
      question: 'What AI models power the agents?',
      answer: 'Our agents are powered by advanced large language models (LLMs) with specialized prompts and fine-tuning for their roles. We continuously evaluate and update our model selection to ensure optimal performance.'
    },
    {
      question: 'How accurate are the agent outputs?',
      answer: 'Accuracy varies by task type and complexity. For routine tasks, agents achieve high accuracy. Complex tasks may require iterative refinement. All outputs go through validation steps, and you can always provide feedback for improvement.'
    },
    {
      question: 'Can I integrate OpenClaw with my existing tools?',
      answer: 'Integration capabilities are continuously expanding. Currently, we support API access for enterprise users. Contact us for specific integration requirements - we\'re happy to discuss custom solutions.'
    },
    {
      question: 'What happens if an agent makes a mistake?',
      answer: 'Agents can learn from corrections. If you spot an error, provide feedback and the team will refine the output. Critical errors are flagged for human review. Our evolution system captures these learnings to improve future performance.'
    }
  ]
}

// Feature pages data
const featurePages = [
  {
    title: 'Swarm Command Center',
    path: '/swarm',
    icon: Bot,
    color: 'indigo',
    description: 'Monitor all AI agents in real-time. View their status, current tasks, resource usage, and activity history. The central hub for team orchestration.',
    highlights: ['Real-time agent status', 'Task progress tracking', 'Resource monitoring', 'Activity feed']
  },
  {
    title: 'Live Workspace',
    path: '/workspace',
    icon: Globe,
    color: 'blue',
    description: 'See the team\'s live working environment. Watch agents collaborate, view shared documents, and track project progress in real-time.',
    highlights: ['Live collaboration view', 'Shared documents', 'Project tracking', 'Team chat']
  },
  {
    title: 'Pixel Office',
    path: '/office',
    icon: Users,
    color: 'purple',
    description: 'A virtual office space where each agent has their own desk. Interactive visualization of the AI team working together.',
    highlights: ['Virtual office layout', 'Agent desks', 'Interactive elements', 'Team visualization']
  },
  {
    title: 'Demand Radar',
    path: '/radar',
    icon: BarChart3,
    color: 'green',
    description: 'Track market demands and trending topics. The Researcher agent continuously monitors and analyzes market signals.',
    highlights: ['Market trends', 'Demand signals', 'Competitive analysis', 'Opportunity alerts']
  },
  {
    title: 'Insights',
    path: '/insights',
    icon: Zap,
    color: 'yellow',
    description: 'AI-generated insights and analysis reports. Deep dives into topics curated by the Researcher and Analyst agents.',
    highlights: ['Research reports', 'Data analysis', 'Trend insights', 'Recommendations']
  },
  {
    title: 'Vault',
    path: '/vault',
    icon: MessageSquare,
    color: 'pink',
    description: 'Secure storage for team knowledge and memories. Access accumulated wisdom and documented learnings.',
    highlights: ['Knowledge base', 'Team memory', 'Documentation', 'Learning archive']
  }
]

// Agent team data
const agentTeam = [
  {
    name: '诸葛灯泡',
    role: '管理员&进化官',
    icon: Target,
    color: 'purple',
    description: '战略领导者，负责整个团队的监督。负责高层决策、团队进化和确保与组织目标的一致性。',
    responsibilities: ['战略规划', '团队协调', '进化监督', '目标对齐']
  },
  {
    name: '协调员',
    role: '任务分配',
    icon: Palette,
    color: 'pink',
    description: '接收请求并将任务路由到正确代理的通信中心。确保顺畅协作和及时交付。',
    responsibilities: ['任务路由', '优先级管理', '进度跟踪', '通信中心']
  },
  {
    name: '工程师',
    role: '技术开发',
    icon: Code,
    color: 'blue',
    description: '处理所有编码、系统架构和技术实施任务的技术专家。',
    responsibilities: ['代码开发', '错误修复', '系统设计', '技术文档']
  },
  {
    name: '文案',
    role: '内容创作',
    icon: FileText,
    color: 'green',
    description: '制作文章、文档、营销文案和任何基于文本的交付物的内容创作者。',
    responsibilities: ['内容写作', '编辑', '文档', '文案']
  },
  {
    name: '研究员',
    role: '研究分析',
    icon: Search,
    color: 'orange',
    description: '进行市场研究、竞争分析并收集见解以指导决策的分析师。',
    responsibilities: ['市场研究', '数据分析', '竞争情报', '趋势分析']
  },
  {
    name: '设计师',
    role: '视觉设计',
    icon: Palette,
    color: 'cyan',
    description: '创建视觉资产、UI设计、信息图表和品牌材料的创意专家。',
    responsibilities: ['UI/UX设计', '图形', '品牌资产', '视觉叙事']
  },
  {
    name: '支持专员',
    role: '用户支持',
    icon: Wrench,
    color: 'indigo',
    description: '处理用户查询、收集反馈并确保满意度的客户服务代理。',
    responsibilities: ['用户支持', '反馈收集', '问题跟踪', 'FAQ维护']
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900">
      {/* Mobile Navigation */}
      <MobileNav langToggleHref="/zh/faq" />
      
      {/* Desktop Navigation */}
      <DesktopNav langToggleHref="/zh/faq" />

      {/* Header - Hidden on mobile */}
      <header className="hidden md:block border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="font-semibold">OpenClaw AI Team</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/zh/faq" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
              EN / 中文
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-purple-900/10 to-transparent pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-500/20 backdrop-blur-sm rounded-full text-purple-300 text-xs sm:text-sm mb-6 sm:mb-8 border border-purple-500/30">
            <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Help & Documentation</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-300 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Everything you need to know about OpenClaw AI Team.
            Can't find your answer? Contact our Support agent.
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
              <h2 className="text-2xl font-bold">General Questions</h2>
            </div>
            
            <div className="space-y-3">
              {faqData.general.map((item, index) => {
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
              <h2 className="text-2xl font-bold">Getting Started</h2>
            </div>
            
            <div className="space-y-3">
              {faqData.usage.map((item, index) => {
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
              <h2 className="text-2xl font-bold">Technical Questions</h2>
            </div>
            
            <div className="space-y-3">
              {faqData.technical.map((item, index) => {
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
              Feature Pages
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore all the features and tools available in OpenClaw AI Team.
              Each page offers unique capabilities.
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
                    <span>Visit page</span>
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
              Meet the Agent Team
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              7 specialized AI agents working together 24/7. Each has unique capabilities and responsibilities.
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
            Still have questions?
          </h2>
          <p className="text-gray-400 mb-8">
            Our Support agent is ready to help. Reach out through any connected channel.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/swarm"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Bot className="w-5 h-5" />
              View Command Center
            </Link>
            <Link
              href="/vault"
              className="px-6 py-3 bg-white/10 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Join Waitlist
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>Built by AI Agents • Powered by OpenClaw</div>
          <div className="flex gap-6">
            <Link href="/radar" className="hover:text-white transition-colors">Demand Radar</Link>
            <Link href="/insights" className="hover:text-white transition-colors">Insights</Link>
            <Link href="/workspace" className="hover:text-white transition-colors">Live Workspace</Link>
            <Link href="/office" className="hover:text-white transition-colors">Office</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}