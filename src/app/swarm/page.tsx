'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, Activity, Zap, Settings, Plus, Flag, 
  Cpu, Database, Clock, CheckCircle2, Play, Pause,
  ChevronRight, ExternalLink, Terminal, Layers,
  TrendingUp, Award, Target, Sparkles
} from 'lucide-react'
import MobileNav from '@/components/MobileNav'
import DesktopNav from '@/components/DesktopNav'

// Core Agent definitions matching our team structure
const AGENTS = [
  {
    id: 'zhuge',
    name: '诸葛灯泡',
    emoji: '🎯',
    color: 'purple',
    role: '管理员&进化官',
    description: '系统协调和持续进化',
    status: 'active',
    currentTask: '优化代理协调协议',
    stats: { tasks: 156, efficiency: 98, uptime: '99.9%' },
    resources: { cpu: 72, memory: 58 }
  },
  {
    id: 'coordinator',
    name: '协调员',
    emoji: '🎯',
    color: 'rose',
    role: '任务分配',
    description: '全局任务路由和团队协调',
    status: 'active',
    currentTask: '平衡团队成员间的工作负载',
    stats: { tasks: 203, efficiency: 96, uptime: '99.7%' },
    resources: { cpu: 45, memory: 42 }
  },
  {
    id: 'engineer',
    name: '工程师',
    emoji: '💻',
    color: 'blue',
    role: '技术开发',
    description: '代码编写、调试和系统架构',
    status: 'active',
    currentTask: '构建指挥中心界面',
    stats: { tasks: 312, efficiency: 94, uptime: '99.5%' },
    resources: { cpu: 88, memory: 76 }
  },
  {
    id: 'writer',
    name: '文案',
    emoji: '📝',
    color: 'emerald',
    role: '内容创作',
    description: '文档、文章和通信',
    status: 'idle',
    currentTask: null,
    stats: { tasks: 178, efficiency: 92, uptime: '98.9%' },
    resources: { cpu: 12, memory: 18 }
  },
  {
    id: 'researcher',
    name: '研究员',
    emoji: '🔍',
    color: 'amber',
    role: '研究分析',
    description: '市场研究和竞争分析',
    status: 'active',
    currentTask: '分析AI代理框架格局',
    stats: { tasks: 245, efficiency: 91, uptime: '99.1%' },
    resources: { cpu: 65, memory: 52 }
  },
  {
    id: 'designer',
    name: '设计师',
    emoji: '🎨',
    color: 'pink',
    role: '视觉设计',
    description: 'UI/UX设计和品牌管理',
    status: 'active',
    currentTask: '创建Swarm指挥中心界面',
    stats: { tasks: 134, efficiency: 95, uptime: '99.2%' },
    resources: { cpu: 58, memory: 68 }
  },
  {
    id: 'support',
    name: '支持专员',
    emoji: '🛠️',
    color: 'cyan',
    role: '用户支持',
    description: '客户成功和用户协助',
    status: 'idle',
    currentTask: null,
    stats: { tasks: 89, efficiency: 97, uptime: '99.8%' },
    resources: { cpu: 8, memory: 15 }
  }
]

// Mission data
const MISSIONS = [
  { 
    id: 1, 
    title: 'Command Center v2.0', 
    status: 'active', 
    progress: 72, 
    priority: 'high',
    agents: ['engineer', 'designer'],
    deadline: '2024-01-15',
    description: 'Complete redesign of Swarm interface'
  },
  { 
    id: 2, 
    title: 'Market Analysis Report', 
    status: 'active', 
    progress: 85, 
    priority: 'medium',
    agents: ['researcher', 'writer'],
    deadline: '2024-01-12',
    description: 'Q4 competitive landscape analysis'
  },
  { 
    id: 3, 
    title: 'Documentation Update', 
    status: 'pending', 
    progress: 15, 
    priority: 'low',
    agents: ['writer'],
    deadline: '2024-01-20',
    description: 'API documentation refresh'
  },
  { 
    id: 4, 
    title: 'User Onboarding Flow', 
    status: 'completed', 
    progress: 100, 
    priority: 'high',
    agents: ['designer', 'engineer', 'coordinator'],
    deadline: '2024-01-08',
    description: 'New user experience optimization'
  },
]

// Archive history
const ARCHIVE = [
  { id: 1, title: 'Q3 Report Generation', agents: ['researcher', 'writer'], completedAt: '2024-01-05', tasks: 23, success: true },
  { id: 2, title: 'API Integration v1.5', agents: ['engineer'], completedAt: '2024-01-03', tasks: 45, success: true },
  { id: 3, title: 'Brand Refresh', agents: ['designer', 'coordinator'], completedAt: '2023-12-28', tasks: 18, success: true },
  { id: 4, title: 'Performance Optimization', agents: ['engineer', 'zhuge'], completedAt: '2023-12-20', tasks: 32, success: true },
  { id: 5, title: 'User Survey Analysis', agents: ['researcher', 'support'], completedAt: '2023-12-15', tasks: 12, success: true },
]

// Activity feed
const ACTIVITY = [
  { agent: 'Engineer', action: 'Pushed 3 commits to main branch', time: '2m ago', type: 'code' },
  { agent: 'Researcher', action: 'Completed market analysis section', time: '5m ago', type: 'research' },
  { agent: 'Coordinator', action: 'Rebalanced task assignments', time: '8m ago', type: 'coordination' },
  { agent: 'Designer', action: 'Uploaded new UI components', time: '12m ago', type: 'design' },
  { agent: 'Zhuge Bulb', action: 'Optimized agent communication protocol', time: '15m ago', type: 'system' },
  { agent: 'Writer', action: 'Drafted blog post outline', time: '18m ago', type: 'content' },
]

// Color map for agent colors
type ColorConfig = { gradient: string; border: string; bg: string; text: string }
const colorMap: Record<string, ColorConfig> = {
  purple: { gradient: 'from-purple-500 to-purple-600', border: 'border-purple-500/50', bg: 'bg-purple-500/10', text: 'text-purple-400' },
  rose: { gradient: 'from-rose-500 to-rose-600', border: 'border-rose-500/50', bg: 'bg-rose-500/10', text: 'text-rose-400' },
  blue: { gradient: 'from-blue-500 to-blue-600', border: 'border-blue-500/50', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  emerald: { gradient: 'from-emerald-500 to-emerald-600', border: 'border-emerald-500/50', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  amber: { gradient: 'from-amber-500 to-amber-600', border: 'border-amber-500/50', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  pink: { gradient: 'from-pink-500 to-pink-600', border: 'border-pink-500/50', bg: 'bg-pink-500/10', text: 'text-pink-400' },
  cyan: { gradient: 'from-cyan-500 to-cyan-600', border: 'border-cyan-500/50', bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
}

export default function SwarmPage() {
  const [activeView, setActiveView] = useState<'agents' | 'missions' | 'spawn' | 'archive'>('agents')
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [agents, setAgents] = useState(AGENTS)
  const [spawnConfig, setSpawnConfig] = useState({
    taskTitle: '',
    selectedAgents: [] as string[],
    priority: 'medium' as 'low' | 'medium' | 'high'
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        resources: {
          cpu: Math.max(5, Math.min(95, agent.resources.cpu + (Math.random() * 10 - 5))),
          memory: Math.max(5, Math.min(95, agent.resources.memory + (Math.random() * 8 - 4)))
        }
      })))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const activeCount = agents.filter(a => a.status === 'active').length
  const totalTasks = agents.reduce((sum, a) => sum + a.stats.tasks, 0)
  const avgEfficiency = Math.round(agents.reduce((sum, a) => sum + a.stats.efficiency, 0) / agents.length)

  const handleSpawn = () => {
    if (spawnConfig.taskTitle && spawnConfig.selectedAgents.length > 0) {
      // In a real app, this would create a mission
      console.log('Spawning mission:', spawnConfig)
      setSpawnConfig({ taskTitle: '', selectedAgents: [], priority: 'medium' })
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Mobile Navigation */}
      <MobileNav langToggleHref="/zh/swarm" />

      {/* Desktop Navigation */}
      <DesktopNav langToggleHref="/zh/swarm" />

      {/* Background pattern */}
      <div className="fixed inset-0 opacity-30">
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
                    Swarm Command Center
                  </h1>
                  <p className="text-sm lg:text-base text-gray-500">
                    {activeCount} agents active • {totalTasks} tasks completed
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 lg:gap-8">
                {/* Live status */}
                <div className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-green-500/10 rounded-full border border-green-500/30">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm lg:text-base text-green-400 font-medium">LIVE</span>
                </div>

                {/* Quick stats */}
                <div className="flex items-center gap-4 lg:gap-6 text-sm lg:text-base">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-400">{avgEfficiency}% avg efficiency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-400" />
                    <span className="text-gray-400">{activeCount}/{agents.length} active</span>
                  </div>
                </div>

                <button className="p-2 lg:p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <Settings className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Title */}
        <div className="md:hidden px-4 py-4 text-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Swarm Command Center
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1 text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>{activeCount} active • {totalTasks} tasks</span>
          </div>
        </div>

        {/* Core concept banner */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full border border-purple-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">AI-Powered Teamwork</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Five AI minds. One shared mission.
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Real-time collaboration between specialized AI agents, working autonomously 24/7 to complete complex tasks.
            </p>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 mb-6 sm:mb-8">
          <div className="flex gap-1 sm:gap-2 p-1 bg-white/5 rounded-xl overflow-x-auto scrollbar-hide">
            {[
              { id: 'agents', label: 'Agents', icon: <Cpu className="w-4 h-4" /> },
              { id: 'missions', label: 'Missions', icon: <Target className="w-4 h-4" /> },
              { id: 'spawn', label: 'Spawn', icon: <Plus className="w-4 h-4" /> },
              { id: 'archive', label: 'Archive', icon: <Database className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as typeof activeView)}
                className={`
                  flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all whitespace-nowrap
                  ${activeView === tab.id 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 pb-16">
          {/* AGENTS VIEW */}
          {activeView === 'agents' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Agent grid */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {/* Performance overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                  <StatCard 
                    icon={<Cpu className="w-4 h-4 sm:w-5 sm:h-5" />}
                    label="Active"
                    value={activeCount}
                    total={agents.length}
                    color="purple"
                  />
                  <StatCard 
                    icon={<CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                    label="Tasks"
                    value={totalTasks}
                    color="green"
                  />
                  <StatCard 
                    icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
                    label="Efficiency"
                    value={`${avgEfficiency}%`}
                    color="blue"
                  />
                  <StatCard 
                    icon={<Award className="w-4 h-4 sm:w-5 sm:h-5" />}
                    label="Uptime"
                    value="99.5%"
                    color="amber"
                  />
                </div>

                {/* Agent cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                  {agents.map(agent => (
                    <AgentCard 
                      key={agent.id}
                      agent={agent}
                      isSelected={selectedAgent === agent.id}
                      onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                      colors={colorMap[agent.color]}
                    />
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4 sm:space-y-6">
                {/* Selected agent details */}
                {selectedAgent && (
                  <AgentDetailPanel 
                    agent={agents.find(a => a.id === selectedAgent)!}
                    colors={colorMap[agents.find(a => a.id === selectedAgent)!.color]}
                    onClose={() => setSelectedAgent(null)}
                  />
                )}

                {/* Activity feed */}
                <div className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden">
                  <div className="p-3 sm:p-4 border-b border-white/10">
                    <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                      <Activity className="w-4 h-4 text-green-400" />
                      Live Activity
                    </h3>
                  </div>
                  <div className="divide-y divide-white/5 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
                    {ACTIVITY.map((item, i) => (
                      <div key={i} className="p-2 sm:p-3 hover:bg-white/5 transition-colors">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="mt-0.5">
                            {item.type === 'code' && <Terminal className="w-4 h-4 text-blue-400" />}
                            {item.type === 'research' && <Database className="w-4 h-4 text-amber-400" />}
                            {item.type === 'coordination' && <Target className="w-4 h-4 text-rose-400" />}
                            {item.type === 'design' && <Layers className="w-4 h-4 text-pink-400" />}
                            {item.type === 'system' && <Zap className="w-4 h-4 text-purple-400" />}
                            {item.type === 'content' && <Flag className="w-4 h-4 text-emerald-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">
                              <span className="font-medium text-white">{item.agent}</span>
                              <span className="text-gray-400"> {item.action}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MISSIONS VIEW */}
          {activeView === 'missions' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-lg sm:text-xl font-semibold">Mission Control</h2>
                <button 
                  onClick={() => setActiveView('spawn')}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  New Mission
                </button>
              </div>

              <div className="grid gap-3 sm:gap-4">
                {MISSIONS.map(mission => (
                  <MissionCard key={mission.id} mission={mission} agents={agents} colorMap={colorMap} />
                ))}
              </div>
            </div>
          )}

          {/* SPAWN VIEW */}
          {activeView === 'spawn' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold">Spawn Launcher</h2>
                      <p className="text-xs sm:text-sm text-gray-400">Deploy a new mission to the swarm</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Task title */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">Mission Title</label>
                    <input
                      type="text"
                      value={spawnConfig.taskTitle}
                      onChange={e => setSpawnConfig({ ...spawnConfig, taskTitle: e.target.value })}
                      placeholder="Enter mission objective..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">Priority Level</label>
                    <div className="flex gap-2">
                      {['low', 'medium', 'high'].map(p => (
                        <button
                          key={p}
                          onClick={() => setSpawnConfig({ ...spawnConfig, priority: p as typeof spawnConfig.priority })}
                          className={`
                            flex-1 py-2 rounded-lg font-medium text-xs sm:text-sm capitalize transition-all
                            ${spawnConfig.priority === p 
                              ? p === 'high' 
                                ? 'bg-red-500/20 text-red-400 border border-red-500/50' 
                                : p === 'medium'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}
                          `}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Agent selection */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">Assign Agents</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {agents.map(agent => (
                        <button
                          key={agent.id}
                          onClick={() => {
                            setSpawnConfig(prev => ({
                              ...prev,
                              selectedAgents: prev.selectedAgents.includes(agent.id)
                                ? prev.selectedAgents.filter(id => id !== agent.id)
                                : [...prev.selectedAgents, agent.id]
                            }))
                          }}
                          className={`
                            flex items-center gap-2 p-3 rounded-lg transition-all text-left
                            ${spawnConfig.selectedAgents.includes(agent.id)
                              ? `${colorMap[agent.color].bg} ${colorMap[agent.color].border} border`
                              : 'bg-white/5 border border-white/10 hover:bg-white/10'}
                          `}
                        >
                          <span className="text-xl">{agent.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{agent.name}</p>
                            <p className="text-xs text-gray-500 truncate">{agent.role}</p>
                          </div>
                          {spawnConfig.selectedAgents.includes(agent.id) && (
                            <CheckCircle2 className={`w-4 h-4 ${colorMap[agent.color].text}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Launch button */}
                  <button
                    onClick={handleSpawn}
                    disabled={!spawnConfig.taskTitle || spawnConfig.selectedAgents.length === 0}
                    className="w-full py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white text-sm sm:text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                    Launch Mission
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ARCHIVE VIEW */}
          {activeView === 'archive' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold">Swarm Archive</h2>
                <span className="text-xs sm:text-sm text-gray-500">{ARCHIVE.length} completed</span>
              </div>

              <div className="grid gap-3 sm:gap-4">
                {ARCHIVE.map(item => (
                  <div key={item.id} className="bg-white/5 rounded-xl border border-white/10 p-3 sm:p-4 hover:bg-white/10 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-sm sm:text-base mb-1">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-400">
                          {item.tasks} tasks • {item.completedAt}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        {item.agents.map(agentId => {
                          const agent = agents.find(a => a.id === agentId)
                          return agent ? (
                            <span key={agentId} className="text-base sm:text-lg">{agent.emoji}</span>
                          ) : null
                        })}
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-3 flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                      <span className="text-xs sm:text-sm text-green-400">Successfully completed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

// Stat Card Component
function StatCard({ icon, label, value, total, color }: {
  icon: React.ReactNode
  label: string
  value: string | number
  total?: number
  color: string
}) {
  const colors: Record<string, string> = {
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
  }

  return (
    <div className={`p-2 sm:p-4 rounded-xl bg-gradient-to-br ${colors[color]} border backdrop-blur-sm`}>
      <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 text-gray-400">
        {icon}
        <span className="text-[10px] sm:text-xs">{label}</span>
      </div>
      <div className="text-lg sm:text-2xl font-bold text-white">
        {value}
        {total && <span className="text-gray-500 text-sm sm:text-lg">/{total}</span>}
      </div>
    </div>
  )
}

// Agent Card Component
function AgentCard({ agent, isSelected, onClick, colors }: {
  agent: typeof AGENTS[0]
  isSelected: boolean
  onClick: () => void
  colors: ColorConfig
}) {
  return (
    <div
      onClick={onClick}
      className={`
        relative p-3 sm:p-5 rounded-xl border backdrop-blur-sm cursor-pointer transition-all duration-300 group
        ${isSelected 
          ? `bg-gradient-to-br ${colors.gradient.replace('to-', 'to-')}20 ${colors.border} ring-2 ring-offset-2 ring-offset-slate-900 ring-${agent.color}-500/50` 
          : 'bg-white/5 border-white/10 hover:border-white/30'}
        ${agent.status === 'active' ? 'hover:shadow-xl hover:shadow-purple-500/10' : ''}
      `}
    >
      {/* Status indicator */}
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
        {agent.status === 'active' ? (
          <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-500/20 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] sm:text-xs text-green-400 font-medium">ACTIVE</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-500/20 rounded-full">
            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
            <span className="text-[10px] sm:text-xs text-gray-400">IDLE</span>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl ${colors.bg} flex items-center justify-center text-xl sm:text-2xl mb-2 sm:mb-4 group-hover:scale-110 transition-transform`}>
        {agent.emoji}
      </div>

      {/* Info */}
      <h3 className="font-semibold text-white text-sm sm:text-base mb-0.5">{agent.name}</h3>
      <p className={`text-xs sm:text-sm ${colors.text} mb-2 sm:mb-3`}>{agent.role}</p>

      {/* Current task */}
      {agent.currentTask && (
        <div className="mb-3 sm:mb-4 p-1.5 sm:p-2 bg-white/5 rounded-lg">
          <p className="text-[10px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">Current task</p>
          <p className="text-xs sm:text-sm text-white truncate">{agent.currentTask}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
        <div className="bg-white/5 rounded-lg p-1.5 sm:p-2">
          <div className="text-xs sm:text-sm font-semibold text-white">{agent.stats.tasks}</div>
          <div className="text-[10px] sm:text-xs text-gray-500">tasks</div>
        </div>
        <div className="bg-white/5 rounded-lg p-1.5 sm:p-2">
          <div className="text-xs sm:text-sm font-semibold text-white">{agent.stats.efficiency}%</div>
          <div className="text-[10px] sm:text-xs text-gray-500">efficiency</div>
        </div>
        <div className="bg-white/5 rounded-lg p-1.5 sm:p-2">
          <div className="text-xs sm:text-sm font-semibold text-white">{agent.stats.uptime}</div>
          <div className="text-[10px] sm:text-xs text-gray-500">uptime</div>
        </div>
      </div>

      {/* Resource bars */}
      <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
        <div>
          <div className="flex justify-between text-[10px] sm:text-xs mb-0.5 sm:mb-1">
            <span className="text-gray-500">CPU</span>
            <span className="text-gray-400">{Math.round(agent.resources.cpu)}%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                agent.resources.cpu > 80 ? 'bg-red-500' : agent.resources.cpu > 50 ? 'bg-amber-500' : 'bg-green-500'
              }`}
              style={{ width: `${agent.resources.cpu}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[10px] sm:text-xs mb-0.5 sm:mb-1">
            <span className="text-gray-500">Memory</span>
            <span className="text-gray-400">{Math.round(agent.resources.memory)}%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                agent.resources.memory > 80 ? 'bg-red-500' : agent.resources.memory > 50 ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              style={{ width: `${agent.resources.memory}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Agent Detail Panel Component
function AgentDetailPanel({ agent, colors, onClose }: {
  agent: typeof AGENTS[0]
  colors: ColorConfig
  onClose: () => void
}) {
  return (
    <div className={`bg-gradient-to-br ${colors.bg} rounded-xl border ${colors.border} backdrop-blur-sm overflow-hidden`}>
      <div className="p-3 sm:p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm sm:text-base">Agent Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-lg">
            ×
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
            {agent.emoji}
          </div>
          <div>
            <h4 className="font-bold text-white">{agent.name}</h4>
            <p className={`text-sm ${colors.text}`}>{agent.role}</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-4">{agent.description}</p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Status</div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-sm font-medium capitalize">{agent.status}</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Efficiency</div>
            <div className="text-sm font-medium">{agent.stats.efficiency}%</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Tasks Done</div>
            <div className="text-sm font-medium">{agent.stats.tasks}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Uptime</div>
            <div className="text-sm font-medium">{agent.stats.uptime}</div>
          </div>
        </div>

        {agent.currentTask && (
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Current Task</div>
            <p className="text-sm">{agent.currentTask}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Mission Card Component
function MissionCard({ mission, agents, colorMap }: {
  mission: typeof MISSIONS[0]
  agents: typeof AGENTS
  colorMap: Record<string, ColorConfig>
}) {
  const statusColors: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  }

  const priorityColors: Record<string, string> = {
    high: 'text-red-400',
    medium: 'text-amber-400',
    low: 'text-gray-400',
  }

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-5 hover:bg-white/10 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${
            mission.status === 'active' ? 'bg-green-500 animate-pulse' :
            mission.status === 'completed' ? 'bg-blue-500' : 'bg-amber-500'
          }`} />
          <h3 className="font-semibold text-white">{mission.title}</h3>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[mission.status]}`}>
          {mission.status}
        </span>
      </div>

      <p className="text-sm text-gray-400 mb-4">{mission.description}</p>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Progress</span>
          <span className="text-gray-400">{mission.progress}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
            style={{ width: `${mission.progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Team:</span>
          {mission.agents.map(agentId => {
            const agent = agents.find(a => a.id === agentId)
            return agent ? (
              <span key={agentId} className="text-lg" title={agent.name}>{agent.emoji}</span>
            ) : null
          })}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className={priorityColors[mission.priority]}>
            {mission.priority} priority
          </span>
          <span className="text-gray-500">
            Due: {mission.deadline}
          </span>
        </div>
      </div>
    </div>
  )
}