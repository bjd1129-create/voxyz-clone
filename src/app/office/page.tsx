'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, CheckCircle2, Clock, TrendingUp, Zap, Users, MessageCircle } from 'lucide-react'

// Agent 列表 - 与首页一致
const AGENTS = [
  { id: 'zhuge', name: '诸葛灯泡', role: '造梦者', emoji: '💡', color: '#8B5CF6' },
  { id: 'helm', name: '协调员', role: '任务调度', emoji: '📋', color: '#EC4899' },
  { id: 'code', name: '工程师', role: '技术开发', emoji: '💻', color: '#3B82F6' },
  { id: 'copy', name: '文案', role: '内容创作', emoji: '✍️', color: '#10B981' },
  { id: 'insight', name: '研究员', role: '市场研究', emoji: '🔍', color: '#F59E0B' },
  { id: 'design', name: '设计师', role: '视觉设计', emoji: '🎨', color: '#EF4444' },
  { id: 'guard', name: '支持专员', role: '用户支持', emoji: '🤖', color: '#6366F1' },
  { id: 'seed', name: '播种者', role: '用户增长', emoji: '🌱', color: '#14B8A6' },
  { id: 'prophet', name: '预言家', role: '数据分析', emoji: '🔮', color: '#A855F7' },
  { id: 'ops', name: '摆渡人', role: '运营优化', emoji: '🚢', color: '#06B6D4' },
]

// 模拟事件流数据
const generateEvents = () => [
  { id: '1', agent: '工程师', action: '完成 API 接口开发', time: '2分钟前', type: 'task' },
  { id: '2', agent: '文案', action: '发布博客文章', time: '5分钟前', type: 'content' },
  { id: '3', agent: '协调员', action: '分配新任务给研究员', time: '8分钟前', type: 'handoff' },
  { id: '4', agent: '设计师', action: '提交设计稿', time: '12分钟前', type: 'task' },
  { id: '5', agent: '诸葛灯泡', action: '审核通过需求', time: '15分钟前', type: 'review' },
]

// 模拟统计数据
const mockStats = {
  activeAgents: 7,
  tasksToday: 47,
  avgResponseTime: '2.3s',
  successRate: 98.5,
}

export default function OfficePage() {
  const [agents, setAgents] = useState(AGENTS.map(a => ({
    ...a,
    status: Math.random() > 0.3 ? 'active' : 'resting' as 'active' | 'resting',
    currentTask: null as string | null,
    tasksCompleted: Math.floor(Math.random() * 50) + 10,
  })))
  
  const [events, setEvents] = useState(generateEvents())
  const [stats, setStats] = useState(mockStats)
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString())

  // 模拟实时更新
  useEffect(() => {
    const interval = setInterval(() => {
      // 随机更新某个 agent 的状态
      setAgents(prev => {
        const updated = [...prev]
        const randomIndex = Math.floor(Math.random() * updated.length)
        const agent = updated[randomIndex]
        
        // 随机切换状态或增加任务
        if (Math.random() > 0.7) {
          agent.status = agent.status === 'active' ? 'resting' : 'active'
        }
        if (agent.status === 'active' && Math.random() > 0.5) {
          agent.tasksCompleted += 1
        }
        
        return updated
      })
      
      // 添加新事件
      if (Math.random() > 0.6) {
        const randomAgent = AGENTS[Math.floor(Math.random() * AGENTS.length)]
        const actions = [
          '完成任务',
          '开始新任务',
          '提交代码',
          '发布内容',
          '处理请求',
        ]
        const newEvent = {
          id: Date.now().toString(),
          agent: randomAgent.name,
          action: actions[Math.floor(Math.random() * actions.length)],
          time: '刚刚',
          type: 'task' as const,
        }
        setEvents(prev => [newEvent, ...prev.slice(0, 9)])
      }
      
      // 更新统计
      setStats(prev => ({
        ...prev,
        tasksToday: prev.tasksToday + (Math.random() > 0.7 ? 1 : 0),
        activeAgents: agents.filter(a => a.status === 'active').length,
      }))
      
      setLastUpdate(new Date().toLocaleTimeString())
    }, 3000)

    return () => clearInterval(interval)
  }, [agents])

  const activeCount = agents.filter(a => a.status === 'active').length
  const totalTasks = agents.reduce((sum, a) => sum + a.tasksCompleted, 0)

  return (
    <div className="min-h-screen font-sans" style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: '#fff'
    }}>
      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity" style={{
            background: 'linear-gradient(45deg, #22c55e, #4ecdc4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            诸葛灯泡
          </Link>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              实时更新
            </span>
            <span>{lastUpdate}</span>
          </div>
        </header>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{
            background: 'linear-gradient(45deg, #22c55e, #4ecdc4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Inside the Office
          </h1>
          <p className="text-white/60 text-lg">
            实时观察 AI 团队的工作状态
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-2 text-white/40 text-sm mb-2">
              <Activity className="w-4 h-4" />
              活跃 Agent
            </div>
            <div className="text-3xl font-bold text-green-400">{activeCount}</div>
          </div>
          
          <div className="p-5 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-2 text-white/40 text-sm mb-2">
              <CheckCircle2 className="w-4 h-4" />
              今日任务
            </div>
            <div className="text-3xl font-bold text-blue-400">{stats.tasksToday}</div>
          </div>
          
          <div className="p-5 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-2 text-white/40 text-sm mb-2">
              <Clock className="w-4 h-4" />
              平均响应
            </div>
            <div className="text-3xl font-bold text-purple-400">{stats.avgResponseTime}</div>
          </div>
          
          <div className="p-5 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-2 text-white/40 text-sm mb-2">
              <TrendingUp className="w-4 h-4" />
              成功率
            </div>
            <div className="text-3xl font-bold text-teal-400">{stats.successRate}%</div>
          </div>
        </div>

        {/* Agent Grid */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-white/60" />
            Agent 状态
            <span className="flex-1 h-px ml-4" style={{ background: 'linear-gradient(90deg, #4ecdc4, transparent)' }}></span>
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="p-4 rounded-xl border transition-all duration-300 hover:border-white/30"
                style={{
                  background: agent.status === 'active' 
                    ? `linear-gradient(135deg, ${agent.color}15, ${agent.color}05)`
                    : 'rgba(255,255,255,0.02)',
                  borderColor: agent.status === 'active' ? `${agent.color}30` : 'rgba(255,255,255,0.1)'
                }}
              >
                <div className="text-3xl mb-3 text-center">{agent.emoji}</div>
                <div className="text-center">
                  <div className="text-sm font-medium text-white">{agent.name}</div>
                  <div className="text-xs text-white/40 mt-1">{agent.role}</div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className={`w-2 h-2 rounded-full ${
                      agent.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-white/20'
                    }`}></span>
                    <span className="text-xs text-white/50">
                      {agent.status === 'active' ? 'Active' : 'Resting'}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/5">
                    <div className="text-xs text-white/40">完成任务</div>
                    <div className="text-lg font-semibold" style={{ color: agent.color }}>
                      {agent.tasksCompleted}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Event Stream */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            实时事件流
            <span className="flex-1 h-px ml-4" style={{ background: 'linear-gradient(90deg, #4ecdc4, transparent)' }}></span>
          </h2>
          
          <div className="space-y-2">
            {events.map((event, index) => {
              const agent = AGENTS.find(a => a.name === event.agent)
              return (
                <div 
                  key={event.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-white/10 transition-all"
                  style={{ 
                    background: 'rgba(255,255,255,0.02)',
                    opacity: index === 0 ? 1 : 0.7 - index * 0.05
                  }}
                >
                  <span className="text-2xl">{agent?.emoji || '🤖'}</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">{event.agent}</span>
                    <span className="text-white/60 mx-2">·</span>
                    <span className="text-white/80">{event.action}</span>
                  </div>
                  <span className="text-xs text-white/40">{event.time}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Summary */}
        <section className="p-6 rounded-xl border border-white/10" style={{ background: 'rgba(78, 205, 196, 0.05)' }}>
          <div className="flex items-center gap-3 mb-3">
            <MessageCircle className="w-5 h-5 text-teal-400" />
            <span className="font-medium">团队动态</span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            目前有 <span className="text-green-400 font-medium">{activeCount} 个 Agent</span> 正在处理任务。
            今日已完成 <span className="text-blue-400 font-medium">{stats.tasksToday} 个任务</span>，
            累计完成 <span className="text-purple-400 font-medium">{totalTasks} 个任务</span>。
            团队整体运行稳定，平均响应时间保持在 {stats.avgResponseTime}。
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-white/10 text-center text-xs text-white/30">
          <div>实时数据 · 每3秒更新</div>
          <div className="mt-2">
            <Link href="/" className="hover:text-white/60 transition-colors">← 返回首页</Link>
            <span className="mx-3">·</span>
            <Link href="/swarm" className="hover:text-white/60 transition-colors">指挥中心</Link>
          </div>
        </footer>
      </div>
    </div>
  )
}