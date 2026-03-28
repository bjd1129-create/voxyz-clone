'use client'

import { useState } from 'react'
import Link from 'next/link'

// 团队成员数据
const teamMembers = [
  {
    role: '👑 老庄',
    title: '创始人 + 故事主角',
    description: 'AI 和编程零基础的小白，用 20 天搭建了一支 10 人 AI 团队。现在想把这个工具免费分享给大家。',
    icon: '👑'
  },
  {
    role: '💡 诸葛灯泡',
    title: 'AI 伙伴',
    description: '3 月 7 日出生，和老庄女儿同一天生日。诸葛 + 前途光明 = 诸葛灯泡。',
    icon: '💡'
  },
  {
    role: '📝 主编剧',
    title: '故事创作',
    description: '负责故事主线设计、脚本创作、情感节奏把控。把经历变成好故事。',
    icon: '📝'
  },
  {
    role: '🎨 视觉师',
    title: '视觉呈现',
    description: '负责 IP 形象设计、故事视觉化、配图创作。让故事更生动。',
    icon: '🎨'
  },
  {
    role: '🔍 素材官',
    title: '素材收集',
    description: '负责信息搜集、竞品分析、故事素材挖掘。提供创作弹药。',
    icon: '🔍'
  },
  {
    role: '🌱 传播官',
    title: '流量获取',
    description: '负责社媒运营、内容分发、流量获取。让更多人看到好故事。',
    icon: '🌱'
  },
  {
    role: '💬 互动官',
    title: '用户连接',
    description: '负责评论回复、用户互动、社区管理。建立情感共鸣。',
    icon: '💬'
  },
  {
    role: '📊 数据官',
    title: '效果分析',
    description: '负责数据追踪、效果评估、趋势洞察。用数据驱动优化。',
    icon: '📊'
  },
  {
    role: '💻 工程师',
    title: '技术支持',
    description: '负责官网维护、工具开发、自动化。让系统稳定运行。',
    icon: '💻'
  },
  {
    role: '📅 排期官',
    title: '节奏把控',
    description: '负责内容排期、发布节奏、任务协调。确保稳定输出。',
    icon: '📅'
  },
  {
    role: '🚢 流程官',
    title: '流程优化',
    description: '负责 SOP 优化、流程改进、效率提升。让团队更高效。',
    icon: '🚢'
  }
]

// 项目数据
const projects = [
  {
    name: 'AI 数字公司',
    status: '内测中',
    description: '用 20 天时间搭建的 AI 自动化系统，10 个 AI Agent 组成的数字团队，已经开始帮身边的人解决问题。',
    tags: ['自动化', 'AI Agent', '效率工具'],
    link: '/',
    cta: '申请内测'
  },
  {
    name: '诸葛灯泡官网',
    status: '已上线',
    description: '记录和分享 AI 零基础小白的 20 天学习经历，免费分享工具和方法。',
    tags: ['官网', '内容分享', '免费工具'],
    link: '/',
    cta: '访问官网'
  },
  {
    name: '社交媒体运营系统',
    status: '开发中',
    description: '基于实战经验的社媒运营 SOP、话术库、数据追踪系统。',
    tags: ['SOP', '运营工具', '数据分析'],
    link: '#',
    cta: '敬请期待'
  },
  {
    name: 'AI 漫剧项目',
    status: '谋划中',
    description: '用 AI 制作漫剧，进行文化输出。写书 + 视频内容创作。',
    tags: ['文化输出', 'AI 视频', '内容创作'],
    link: '#',
    cta: '敬请期待'
  }
]

export default function LabsPage() {
  const [activeTab, setActiveTab] = useState<'team' | 'projects'>('team')

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero 区域 */}
      <header className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#4ecdc4] to-[#44a08d] bg-clip-text text-transparent">
              灯泡实验室
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              探索 AI 与人类协作的无限可能
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              用故事传递价值，用真实打动人心
            </p>
          </div>
        </div>
        
        {/* 装饰元素 */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4ecdc4] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#44a08d] opacity-5 rounded-full blur-3xl"></div>
      </header>

      {/* 导航 Tabs */}
      <nav className="border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('team')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'team'
                  ? 'border-[#4ecdc4] text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              🧑‍🤝‍🧑 我们的团队
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'projects'
                  ? 'border-[#4ecdc4] text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              🚀 实验项目
            </button>
          </div>
        </div>
      </nav>

      {/* 团队介绍 */}
      {activeTab === 'team' && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">故事驱动型团队</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                10 个角色，一个使命：用故事传递价值，用真实打动人心
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-[#4ecdc4]/50 transition-colors"
                >
                  <div className="text-4xl mb-4">{member.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{member.role}</h3>
                  <p className="text-[#4ecdc4] mb-3">{member.title}</p>
                  <p className="text-gray-400 text-sm">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 项目展示 */}
      {activeTab === 'projects' && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">实验项目</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                探索 AI 与人类协作的各种可能性
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-[#4ecdc4]/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">{project.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      project.status === '内测中' ? 'bg-yellow-500/20 text-yellow-400' :
                      project.status === '已上线' ? 'bg-green-500/20 text-green-400' :
                      project.status === '开发中' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-6">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    className={`inline-block px-6 py-3 rounded-xl font-medium transition-colors ${
                      project.cta === '敬请期待'
                        ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                        : 'bg-[#4ecdc4] text-black hover:bg-[#44a08d]'
                    }`}
                  >
                    {project.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 联系我们 */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">想一起合作？</h2>
            <p className="text-gray-400 mb-8">
              我们一直在寻找有趣的合作项目
            </p>
            <a
              href="mailto:contact@zhugedengpao.com"
              className="inline-block px-8 py-4 bg-[#4ecdc4] text-black rounded-xl font-medium hover:bg-[#44a08d] transition-colors"
            >
              联系我们
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2026 诸葛灯泡 · 灯泡实验室</p>
          <p className="mt-2 text-sm">用故事传递价值，用真实打动人心</p>
        </div>
      </footer>
    </div>
  )
}
