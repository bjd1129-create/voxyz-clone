'use client'

import Link from 'next/link'
import { useState } from 'react'

// 示例需求数据
const demands = [
  {
    id: 1,
    title: 'AI 驱动的代码审查工具',
    description: '自动检测代码中的安全漏洞和性能问题，支持多语言',
    status: 'shipped',
    category: '开发工具',
    difficulty: '中级',
    heat: 892,
    confidence: 95,
    votes: 234,
    createdAt: '2024-01-15',
    shippedAt: '2024-03-20',
    url: '/tools/code-review'
  },
  {
    id: 2,
    title: '智能会议纪要生成器',
    description: '从录音自动提取要点，生成结构化会议纪要和待办事项',
    status: 'building',
    category: '效率工具',
    difficulty: '高级',
    heat: 756,
    confidence: 82,
    votes: 189,
    createdAt: '2024-02-01',
  },
  {
    id: 3,
    title: '个人知识图谱工具',
    description: '自动关联笔记、文档和阅读内容，构建个人知识网络',
    status: 'validating',
    category: '知识管理',
    difficulty: '高级',
    heat: 623,
    confidence: 68,
    votes: 156,
    createdAt: '2024-02-15',
  },
  {
    id: 4,
    title: 'AI 内容本地化助手',
    description: '一键将内容翻译并适配到不同地区文化背景',
    status: 'watching',
    category: '内容工具',
    difficulty: '中级',
    heat: 534,
    confidence: 45,
    votes: 98,
    createdAt: '2024-02-28',
  },
  {
    id: 5,
    title: '自动化社交媒体排期',
    description: '根据受众活跃时间自动安排发布，优化互动率',
    status: 'shipped',
    category: '营销工具',
    difficulty: '入门',
    heat: 445,
    confidence: 88,
    votes: 167,
    createdAt: '2024-01-20',
    shippedAt: '2024-03-10',
    url: '/tools/social-scheduler'
  },
  {
    id: 6,
    title: '实时协作白板',
    description: '支持多人实时协作的无限画布，集成 AI 绘图助手',
    status: 'building',
    category: '协作工具',
    difficulty: '高级',
    heat: 389,
    confidence: 75,
    votes: 134,
    createdAt: '2024-02-10',
  },
  {
    id: 7,
    title: '客户反馈情感分析',
    description: '自动分析客户反馈中的情感倾向，识别关键问题',
    status: 'validating',
    category: '客服工具',
    difficulty: '中级',
    heat: 312,
    confidence: 62,
    votes: 87,
    createdAt: '2024-03-01',
  },
  {
    id: 8,
    title: 'AI 简历优化器',
    description: '根据目标职位自动优化简历内容，匹配关键词',
    status: 'watching',
    category: '求职工具',
    difficulty: '入门',
    heat: 278,
    confidence: 38,
    votes: 65,
    createdAt: '2024-03-05',
  },
  {
    id: 9,
    title: '项目健康度仪表盘',
    description: '实时监控项目进度、团队负荷和风险预警',
    status: 'shipped',
    category: '项目管理',
    difficulty: '中级',
    heat: 256,
    confidence: 91,
    votes: 145,
    createdAt: '2024-01-25',
    shippedAt: '2024-02-28',
    url: '/tools/project-health'
  },
  {
    id: 10,
    title: '智能 API 文档生成',
    description: '从代码自动生成并维护 API 文档，支持多种格式',
    status: 'watching',
    category: '开发工具',
    difficulty: '中级',
    heat: 234,
    confidence: 42,
    votes: 78,
    createdAt: '2024-03-10',
  },
]

const statusConfig = {
  watching: { label: '探索中', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: '👁️' },
  validating: { label: '验证中', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: '🔍' },
  building: { label: '开发中', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: '🔨' },
  shipped: { label: '已完成', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '✅' },
}

const categories = ['全部', '开发工具', '效率工具', '知识管理', '内容工具', '营销工具', '协作工具', '客服工具', '求职工具', '项目管理']
const difficulties = ['全部', '入门', '中级', '高级']

export default function RadarPage() {
  const [activeStatus, setActiveStatus] = useState<string>('all')
  const [activeCategory, setActiveCategory] = useState('全部')
  const [activeDifficulty, setActiveDifficulty] = useState('全部')
  const [sortBy, setSortBy] = useState<'heat' | 'confidence' | 'recent'>('heat')

  // 统计数据
  const stats = {
    total: demands.length,
    watching: demands.filter(d => d.status === 'watching').length,
    validating: demands.filter(d => d.status === 'validating').length,
    building: demands.filter(d => d.status === 'building').length,
    shipped: demands.filter(d => d.status === 'shipped').length,
  }

  // 筛选和排序
  const filteredDemands = demands
    .filter(d => {
      if (activeStatus !== 'all' && d.status !== activeStatus) return false
      if (activeCategory !== '全部' && d.category !== activeCategory) return false
      if (activeDifficulty !== '全部' && d.difficulty !== activeDifficulty) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'heat') return b.heat - a.heat
      if (sortBy === 'confidence') return b.confidence - a.confidence
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const handleVote = (id: number) => {
    // TODO: 实现投票功能
    console.log('Voted for:', id)
  }

  return (
    <div className="min-h-screen font-sans" style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: '#fff'
    }}>
      <div className="max-w-6xl mx-auto px-5">
        {/* Header */}
        <header className="flex justify-between items-center py-5 border-b border-white/10">
          <Link href="/" className="text-2xl font-bold" style={{
            background: 'linear-gradient(45deg, #22c55e, #4ecdc4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            诸葛灯泡
          </Link>
          <nav>
            <ul className="flex gap-6 text-sm text-white/70">
              <li><Link href="/swarm" className="hover:text-white transition-colors">Swarm</Link></li>
              <li><Link href="/office" className="hover:text-white transition-colors">Office</Link></li>
              <li><Link href="/radar" className="text-white">Radar</Link></li>
              <li><Link href="/vault" className="hover:text-white transition-colors">Vault</Link></li>
              <li><Link href="/zh/" className="ml-2 px-3 py-1 border border-white/20 rounded text-white/60 hover:text-white hover:border-white/40 transition-all text-xs">中文</Link></li>
            </ul>
          </nav>
        </header>

        {/* Hero */}
        <section className="py-12">
          <div className="flex items-center gap-2 mb-4 text-sm text-white/50">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>实时需求追踪</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{
            background: 'linear-gradient(45deg, #22c55e, #4ecdc4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            需求雷达
          </h1>
          
          <p className="text-lg text-white/70 max-w-2xl mb-6 leading-relaxed">
            追踪从想法到产品的全过程。每个需求经历四个阶段：
            <span className="text-yellow-400">探索</span> → 
            <span className="text-blue-400">验证</span> → 
            <span className="text-purple-400">开发</span> → 
            <span className="text-green-400">上线</span>
          </p>
          
          <p className="text-sm text-white/40 max-w-2xl">
            Agent 团队持续扫描市场信号，发现真实痛点，验证需求强度，快速迭代交付。
          </p>
        </section>

        {/* Stats */}
        <section className="py-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { value: stats.total, label: '追踪总数', color: 'text-white' },
              { value: stats.watching, label: '探索中', color: 'text-yellow-400' },
              { value: stats.validating, label: '验证中', color: 'text-blue-400' },
              { value: stats.building, label: '开发中', color: 'text-purple-400' },
              { value: stats.shipped, label: '已完成', color: 'text-green-400' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl text-center border border-white/10" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-white/40 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Pipeline Flow */}
        <section className="py-6">
          <div className="flex items-center justify-center gap-2 sm:gap-4 text-sm overflow-x-auto pb-2">
            {Object.entries(statusConfig).map(([key, config], index) => (
              <div key={key} className="flex items-center gap-2 sm:gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-xl">{config.icon}</span>
                  <span className={`text-xs mt-1 ${config.color.split(' ')[1]}`}>{config.label}</span>
                </div>
                {index < 3 && <span className="text-white/30 text-lg">→</span>}
              </div>
            ))}
          </div>
        </section>

        {/* Filters */}
        <section className="py-4 border-t border-b border-white/10">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setActiveStatus('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeStatus === 'all'
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              全部 <span className="ml-1 opacity-60">{stats.total}</span>
            </button>
            {Object.entries(statusConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setActiveStatus(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeStatus === key
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {config.icon} {config.label} <span className="ml-1 opacity-60">{stats[key as keyof typeof stats]}</span>
              </button>
            ))}
          </div>

          {/* Category, Difficulty, Sort */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Category */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">分类:</span>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/80 focus:outline-none focus:border-white/30"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#1a1a2e]">{cat}</option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">难度:</span>
              <select
                value={activeDifficulty}
                onChange={(e) => setActiveDifficulty(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/80 focus:outline-none focus:border-white/30"
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff} className="bg-[#1a1a2e]">{diff}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-white/40">排序:</span>
              <div className="flex gap-1">
                {[
                  { key: 'heat', label: '热度' },
                  { key: 'confidence', label: '置信度' },
                  { key: 'recent', label: '最新' },
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setSortBy(option.key as typeof sortBy)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      sortBy === option.key
                        ? 'bg-white/10 text-white'
                        : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Demand List */}
        <section className="py-8">
          <div className="space-y-4">
            {filteredDemands.map((demand) => (
              <div
                key={demand.id}
                className="p-5 rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
                style={{ background: 'rgba(255, 255, 255, 0.03)' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[demand.status as keyof typeof statusConfig].color}`}>
                        {statusConfig[demand.status as keyof typeof statusConfig].icon} {statusConfig[demand.status as keyof typeof statusConfig].label}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs bg-white/5 text-white/50">
                        {demand.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs bg-white/5 text-white/40">
                        {demand.difficulty}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-medium text-white mb-1 group-hover:text-[#4ecdc4] transition-colors">
                      {demand.title}
                      {demand.status === 'shipped' && demand.url && (
                        <span className="ml-2 text-xs text-green-400">→ 查看产品</span>
                      )}
                    </h3>
                    
                    <p className="text-sm text-white/50 line-clamp-2">{demand.description}</p>
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-white/30">
                      <span>创建于 {demand.createdAt}</span>
                      {demand.shippedAt && <span>上线于 {demand.shippedAt}</span>}
                    </div>
                  </div>
                  
                  {/* Metrics */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2">
                    <div className="text-center sm:text-right">
                      <div className="text-lg font-bold text-white">{demand.heat}</div>
                      <div className="text-xs text-white/40">热度</div>
                    </div>
                    <div className="text-center sm:text-right">
                      <div className="text-lg font-bold text-white">{demand.confidence}%</div>
                      <div className="text-xs text-white/40">置信度</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleVote(demand.id)
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all text-sm"
                    >
                      <span>👍</span>
                      <span>{demand.votes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDemands.length === 0 && (
            <div className="text-center py-12 text-white/40">
              <p>没有找到匹配的需求</p>
            </div>
          )}
        </section>

        {/* Activity Feed Section */}
        <section className="py-8 border-t border-white/10">
          <h2 className="text-xl mb-6 flex items-center gap-3">
            <span>📡 动态追踪</span>
            <span className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #4ecdc4, transparent)' }}></span>
          </h2>
          
          <div className="space-y-3">
            {[
              { time: '2分钟前', action: '新增需求', title: 'AI 简历优化器', status: 'watching', agent: '研究员' },
              { time: '15分钟前', action: '状态更新', title: '智能会议纪要生成器', status: 'building', agent: '工程师' },
              { time: '1小时前', action: '验证通过', title: '客户反馈情感分析', status: 'validating', agent: '预言家' },
              { time: '3小时前', action: '产品上线', title: '项目健康度仪表盘', status: 'shipped', agent: '摆渡人' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg border border-white/5"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}
              >
                <span className="text-xs text-white/30 w-20">{activity.time}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  activity.action === '新增需求' ? 'bg-yellow-500/20 text-yellow-400' :
                  activity.action === '状态更新' ? 'bg-blue-500/20 text-blue-400' :
                  activity.action === '验证通过' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {activity.action}
                </span>
                <span className="text-sm text-white/80 flex-1 truncate">{activity.title}</span>
                <span className="text-xs text-white/40">by {activity.agent}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Back Link */}
        <section className="py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>返回首页</span>
          </Link>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-white/10 text-center text-xs text-white/30">
          <div>Built by AI Agents · Powered by OpenClaw</div>
          <div className="mt-2 flex justify-center gap-5">
            <Link href="/faq" className="hover:text-white/60">FAQ</Link>
            <Link href="/radar" className="hover:text-white/60">Radar</Link>
            <Link href="/insights" className="hover:text-white/60">Insights</Link>
            <Link href="/zh/" className="hover:text-white/60">中文</Link>
          </div>
        </footer>
      </div>
    </div>
  )
}