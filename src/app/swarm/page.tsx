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
import { supabase } from '@/lib/supabase'

// Agent interface for type safety
interface Agent {
  id: string
  name: string
  emoji: string
  color: string
  role: string
  description: string
  status: 'active' | 'idle'
  currentTask: string | null
  stats: { tasks: number; efficiency: number; uptime: string }
  resources: { cpu: number; memory: number }
}

// We'll fetch agents from Supabase instead of using mock data
// const AGENTS = [
//   {
//     id: 'zhuge',
//     name: '诸葛灯泡',
//     emoji: '🎯',
//     color: 'purple',
//     role: '造梦者',
//     description: '系统协调和持续进化',
//     status: 'active',
//     currentTask: '优化代理协调协议',
//     stats: { tasks: 156, efficiency: 98, uptime: '99.9%' },
//     resources: { cpu: 72, memory: 58 }
//   },
//   {
//     id: 'coordinator',
//     name: '掌舵人',
//     emoji: '🎯',
//     color: 'rose',
//     role: '任务分配',
//     description: '全局任务路由和团队协调',
//     status: 'active',
//     currentTask: '平衡团队成员间的工作负载',
//     stats: { tasks: 203, efficiency: 96, uptime: '99.7%' },
//     resources: { cpu: 45, memory: 42 }
//   },
//   {
//     id: 'engineer',
//     name: '代码侠',
//     emoji: '💻',
//     color: 'blue',
//     role: '技术开发',
//     description: '代码编写、调试和系统架构',
//     status: 'active',
//     currentTask: '构建指挥中心界面',
//     stats: { tasks: 312, efficiency: 94, uptime: '99.5%' },
//     resources: { cpu: 88, memory: 76 }
//   },
//   {
//     id: 'writer',
//     name: '文案君',
//     emoji: '📝',
//     color: 'emerald',
//     role: '内容创作',
//     description: '文档、文章和通信',
//     status: 'idle',
//     currentTask: null,
//     stats: { tasks: 178, efficiency: 92, uptime: '98.9%' },
//     resources: { cpu: 12, memory: 18 }
//   },
//   {
//     id: 'researcher',
//     name: '洞察者',
//     emoji: '🔍',
//     color: 'amber',
//     role: '研究分析',
//     description: '市场研究和竞争分析',
//     status: 'active',
//     currentTask: '分析AI代理框架格局',
//     stats: { tasks: 245, efficiency: 91, uptime: '99.1%' },
//     resources: { cpu: 65, memory: 52 }
//   },
//   {
//     id: 'designer',
//     name: '配色师',
//     emoji: '🎨',
//     color: 'pink',
//     role: '视觉设计',
//     description: 'UI/UX设计和品牌管理',
//     status: 'active',
//     currentTask: '创建Swarm指挥中心界面',
//     stats: { tasks: 134, efficiency: 95, uptime: '99.2%' },
//     resources: { cpu: 58, memory: 68 }
//   },
//   {
//     id: 'support',
//     name: '守护者',
//     emoji: '🛠️',
//     color: 'cyan',
//     role: '用户支持',
//     description: '客户成功和用户协助',
//     status: 'idle',
//     currentTask: null,
//     stats: { tasks: 89, efficiency: 97, uptime: '99.8%' },
//     resources: { cpu: 8, memory: 15 }
//   }
// ]

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

// Completed missions (examples)
const COMPLETED_MISSIONS = [
  { 
    id: 5, 
    title: 'Website Redesign', 
    status: 'completed', 
    progress: 100, 
    priority: 'high',
    agents: ['designer', 'engineer'],
    deadline: '2024-01-08',
    description: 'Complete overhaul of company website',
    completedAt: '2024-01-08',
    specialists: ['配色师', '代码侠']
  },
  { 
    id: 6, 
    title: 'API Integration', 
    status: 'completed', 
    progress: 100, 
    priority: 'medium',
    agents: ['engineer', 'researcher'],
    deadline: '2024-01-05',
    description: 'Integrate third-party services',
    completedAt: '2024-01-05',
    specialists: ['Engineer', 'Researcher']
  },
]

// Failed missions (examples)
const FAILED_MISSIONS = [
  { 
    id: 7, 
    title: 'Performance Optimization', 
    status: 'failed', 
    progress: 85, 
    priority: 'high',
    agents: ['engineer'],
    deadline: '2024-01-07',
    description: 'Improve system performance by 30%',
    completedAt: '2024-01-07',
    failureReason: 'Memory constraints',
    specialists: ['Engineer']
  },
  { 
    id: 8, 
    title: 'Security Audit', 
    status: 'failed', 
    progress: 60, 
    priority: 'high',
    agents: ['engineer', 'researcher'],
    deadline: '2024-01-06',
    description: 'Complete security assessment',
    completedAt: '2024-01-06',
    failureReason: 'Critical vulnerabilities found',
    specialists: ['Engineer', 'Researcher']
  },
  { 
    id: 9, 
    title: 'Prophet Migration', 
    status: 'failed', 
    progress: 45, 
    priority: 'medium',
    agents: ['engineer', 'support'],
    deadline: '2024-01-04',
    description: 'Migrate legacy data to new system',
    completedAt: '2024-01-04',
    failureReason: 'Prophet corruption detected',
    specialists: ['Engineer', 'Support Specialist']
  },
  { 
    id: 10, 
    title: 'Feature Rollout', 
    status: 'failed', 
    progress: 70, 
    priority: 'high',
    agents: ['designer', 'engineer'],
    deadline: '2024-01-03',
    description: 'Deploy new user features',
    completedAt: '2024-01-03',
    failureReason: 'Compatibility issues',
    specialists: ['配色师', '代码侠']
  },
  { 
    id: 11, 
    title: 'Bug Fix Sprint', 
    status: 'failed', 
    progress: 55, 
    priority: 'medium',
    agents: ['engineer', 'support'],
    deadline: '2024-01-02',
    description: 'Resolve critical bugs',
    completedAt: '2024-01-02',
    failureReason: 'Complex dependencies',
    specialists: ['Engineer', 'Support Specialist']
  },
  { 
    id: 12, 
    title: 'Load Testing', 
    status: 'failed', 
    progress: 40, 
    priority: 'high',
    agents: ['researcher', 'engineer'],
    deadline: '2024-01-01',
    description: 'Test system under heavy load',
    completedAt: '2024-01-01',
    failureReason: 'Server capacity exceeded',
    specialists: ['Researcher', 'Engineer']
  },
  { 
    id: 13, 
    title: 'UI Overhaul', 
    status: 'failed', 
    progress: 65, 
    priority: 'medium',
    agents: ['designer', 'writer'],
    deadline: '2023-12-30',
    description: 'Redesign user interface',
    completedAt: '2023-12-30',
    failureReason: 'Timeline constraints',
    specialists: ['配色师', '文案君']
  },
  { 
    id: 14, 
    title: 'Integration Test', 
    status: 'failed', 
    progress: 30, 
    priority: 'high',
    agents: ['engineer'],
    deadline: '2023-12-28',
    description: 'Test system integrations',
    completedAt: '2023-12-28',
    failureReason: 'Third-party service downtime',
    specialists: ['Engineer']
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
  { agent: '诸葛灯泡', action: 'Optimized agent communication protocol', time: '15m ago', type: 'system' },
  { agent: 'Writer', action: 'Drafted blog post outline', time: '18m ago', type: 'content' },
]

// Color map for agent colors - unified with green primary
type ColorConfig = { gradient: string; border: string; bg: string; text: string }
const colorMap: Record<string, ColorConfig> = {
  purple: { gradient: 'from-primary-500 to-primary-600', border: 'border-primary-500/50', bg: 'bg-primary-500/10', text: 'text-primary-400' },
  rose: { gradient: 'from-rose-500 to-rose-600', border: 'border-rose-500/50', bg: 'bg-rose-500/10', text: 'text-rose-400' },
  blue: { gradient: 'from-blue-500 to-blue-600', border: 'border-blue-500/50', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  emerald: { gradient: 'from-emerald-500 to-emerald-600', border: 'border-emerald-500/50', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  amber: { gradient: 'from-amber-500 to-amber-600', border: 'border-amber-500/50', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  pink: { gradient: 'from-pink-500 to-pink-600', border: 'border-pink-500/50', bg: 'bg-pink-500/10', text: 'text-pink-400' },
  cyan: { gradient: 'from-cyan-500 to-cyan-600', border: 'border-cyan-500/50', bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
}

export default function SwarmPage() {
  const [activeView, setActiveView] = useState<'working' | 'missions' | 'steps' | 'archive' | 'events'>('working')
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [agents, setAgents] = useState<any[]>([]) // Using any for now, we'll define proper types later

  // Fetch agents from Supabase
  const fetchAgents = async () => {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) {
      console.error('Error fetching agents:', error)
    } else {
      // Transform the data to match the expected format
      const transformedAgents = data.map(agent => ({
        id: agent.id,
        name: agent.name,
        emoji: agent.emoji,
        color: agent.color.startsWith('#') ? agent.color.replace('#', '') : agent.color, // Remove # for color mapping
        role: agent.role,
        description: agent.role, // Using role as description for now
        status: agent.status === 'busy' ? 'active' : agent.status, // Map busy to active
        currentTask: agent.current_task,
        stats: { 
          tasks: 0, // This would come from actual task data
          efficiency: 90, // Placeholder value
          uptime: '99.9%' // Placeholder value
        },
        resources: { 
          cpu: Math.floor(Math.random() * 40) + 30, // Random value for now
          memory: Math.floor(Math.random() * 40) + 30 // Random value for now
        }
      }))
      setAgents(transformedAgents)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('agents-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agents',
        },
        (payload) => {
          console.log('Agents change received:', payload)
          // Refresh agents when there's a change
          fetchAgents()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Simulate real-time updates for resources
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
                <div className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-red-500/10 rounded-full border border-red-500/30">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm lg:text-base text-red-400 font-medium">LIVE</span>
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
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span>{activeCount} active • {totalTasks} tasks</span>
          </div>
          {/* Live status indicator for mobile */}
          <div className="flex items-center justify-center mt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-full border border-red-500/30">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-red-400 font-medium">LIVE SYSTEM STATUS</span>
            </div>
          </div>
        </div>

        {/* Core concept banner */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-full border border-primary-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-300">AI-Powered Teamwork</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-primary-500 bg-clip-text text-transparent">
                10 AI Specialists. One Mission.
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              10 Core Agents working together in real-time to achieve common objectives.
            </p>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 mb-6 sm:mb-8">
          <div className="flex gap-1 sm:gap-2 p-1 bg-white/5 rounded-xl overflow-x-auto scrollbar-hide">
            {[
              { id: 'working', label: 'Working', icon: <Cpu className="w-4 h-4" /> },
              { id: 'missions', label: 'Missions', icon: <Target className="w-4 h-4" /> },
              { id: 'steps', label: 'How It Works', icon: <Zap className="w-4 h-4" /> },
              { id: 'archive', label: 'Archive', icon: <Activity className="w-4 h-4" /> },
              { id: 'events', label: 'Events', icon: <Activity className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as typeof activeView)}
                className={`
                  flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all whitespace-nowrap
                  ${activeView === tab.id 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25' 
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
          {/* WORKING VIEW - Shows agents like the original agents view */}
          {activeView === 'working' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Agent grid */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {/* Performance metrics panel */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
                  <MetricCard 
                    label="Missions"
                    value="17"
                    color="purple"
                  />
                  <MetricCard 
                    label="Success"
                    value="52.9%"
                    color="green"
                  />
                  <MetricCard 
                    label="Parallel"
                    value="0"
                    color="blue"
                  />
                  <MetricCard 
                    label="Steps"
                    value="9"
                    color="amber"
                  />
                  <MetricCard 
                    label="Failed"
                    value="8"
                    color="red"
                  />
                  <MetricCard 
                    label="Avg"
                    value="0.4m"
                    color="gray"
                  />
                </div>

                {/* Spawn Launcher */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-4 sm:p-5">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Spawn Launcher
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Target Agent</label>
                      <select className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                        <option>Select an agent...</option>
                        {agents.map(agent => (
                          <option key={agent.id} value={agent.id}>{agent.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Mission Brief</label>
                      <input 
                        type="text" 
                        placeholder="Describe the mission..." 
                        className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3 mt-3">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                      <Play className="w-4 h-4" />
                      Launch Mission
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors border border-white/10">
                      <Target className="w-4 h-4" />
                      Preview Plan
                    </button>
                  </div>
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
                            {item.type === 'system' && <Zap className="w-4 h-4 text-primary-400" />}
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

          {/* STEPS VIEW - How the Swarm Works Visualization */}
          {activeView === 'steps' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">How the Swarm Works</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Our 7 Core Agents collaborate through a sophisticated orchestration system to deliver results efficiently.
                </p>
              </div>

              {/* Process visualization */}
              <div className="bg-white/5 rounded-xl border border-white/10 p-6 overflow-x-auto">
                <div className="flex items-center justify-center min-w-max">
                  {/* Core Agents */}
                  <div className="flex flex-col items-center mx-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-lg font-bold border-4 border-white/20 shadow-lg">
                      7 Core<br/>Agents
                    </div>
                    <div className="mt-3 text-sm text-gray-300 font-medium">Initiation</div>
                  </div>

                  {/* Arrow */}
                  <div className="mx-4 text-2xl text-gray-500">
                    <ChevronRight className="w-8 h-8" />
                  </div>

                  {/* SPAWN */}
                  <div className="flex flex-col items-center mx-4">
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center text-white text-lg font-bold border-4 border-white/20 shadow-lg">
                      SPAWN
                    </div>
                    <div className="mt-3 text-sm text-gray-300 font-medium">Specialization</div>
                  </div>

                  {/* Arrow */}
                  <div className="mx-4 text-2xl text-gray-500">
                    <ChevronRight className="w-8 h-8" />
                  </div>

                  {/* Specialists */}
                  <div className="flex flex-col items-center mx-4">
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white text-lg font-bold border-4 border-white/20 shadow-lg">
                      Specialists
                    </div>
                    <div className="mt-3 text-sm text-gray-300 font-medium">Execution</div>
                  </div>

                  {/* Arrow */}
                  <div className="mx-4 text-2xl text-gray-500">
                    <ChevronRight className="w-8 h-8" />
                  </div>

                  {/* DELIVER */}
                  <div className="flex flex-col items-center mx-4">
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center text-white text-lg font-bold border-4 border-white/20 shadow-lg">
                      DELIVER
                    </div>
                    <div className="mt-3 text-sm text-gray-300 font-medium">Result</div>
                  </div>
                </div>

                {/* Detailed explanation */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-white/10">
                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary-400" />
                      7 Core Agents
                    </h3>
                    <p className="text-sm text-gray-400">
                      Our specialized agents work in coordination - each with distinct roles and responsibilities.
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-white/10">
                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400" />
                      SPAWN
                    </h3>
                    <p className="text-sm text-gray-400">
                      When a mission is initiated, specialized agents are dynamically allocated to the task.
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-white/10">
                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-emerald-400" />
                      Specialists
                    </h3>
                    <p className="text-sm text-gray-400">
                      Specialized agents execute their assigned tasks with domain expertise.
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-white/10">
                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-rose-400" />
                      Deliver
                    </h3>
                    <p className="text-sm text-gray-400">
                      Results are aggregated and delivered as a cohesive solution.
                    </p>
                  </div>
                </div>
              </div>

              {/* Execution Steps */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Execution Steps</h3>
                <div className="grid gap-3 sm:gap-4">
                  {[
                    { id: 1, title: 'Mission Initiation', status: 'completed', time: '2m ago', agent: 'zhuge', description: 'Core agent receives mission parameters' },
                    { id: 2, title: 'Agent Selection', status: 'completed', time: '1m ago', agent: 'coordinator', description: 'Coordinator selects optimal specialist agents' },
                    { id: 3, title: 'Task Distribution', status: 'completed', time: '1m ago', agent: 'coordinator', description: 'Tasks distributed to appropriate specialists' },
                    { id: 4, title: 'Execution Phase', status: 'active', time: 'now', agent: 'engineer', description: 'Specialist agents execute assigned tasks' },
                    { id: 5, title: 'Result Aggregation', status: 'pending', time: 'pending', agent: 'coordinator', description: 'Results from specialists are collected and processed' },
                    { id: 6, title: 'Quality Assurance', status: 'pending', time: 'pending', agent: 'support', description: 'Final results undergo quality checks' },
                    { id: 7, title: 'Delivery', status: 'pending', time: 'pending', agent: 'coordinator', description: 'Final result delivered to requester' },
                  ].map(step => {
                    const agent = agents.find(a => a.id === step.agent);
                    return (
                      <div key={step.id} className="bg-white/5 rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center ${
                              step.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              step.status === 'active' ? 'bg-primary-500/20 text-primary-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> :
                               step.status === 'active' ? <Zap className="w-4 h-4 animate-pulse" /> :
                               <Clock className="w-4 h-4" />}
                            </div>
                            <div>
                              <h3 className="font-medium text-white flex items-center gap-2">
                                {step.title}
                                {step.status === 'active' && (
                                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">LIVE</span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                {agent && <span>{agent.emoji} {agent.name}</span>}
                                <span>•</span>
                                <span>{step.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${
                            step.status === 'completed' ? 'bg-green-500' :
                            step.status === 'active' ? 'bg-red-500 animate-pulse' :
                            'bg-gray-500'
                          }`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* EVENTS VIEW */}
          {activeView === 'events' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold">System Events</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm text-red-400 font-medium">LIVE</span>
                </div>
              </div>

              <div className="grid gap-3 sm:gap-4">
                {[
                  { id: 1, title: 'Agent Connected', type: 'system', time: '2m ago', severity: 'info', description: 'Engineer agent connected to swarm network' },
                  { id: 2, title: 'Resource Allocation', type: 'system', time: '3m ago', severity: 'info', description: 'Allocated additional CPU resources to researcher agent' },
                  { id: 3, title: 'Task Completed', type: 'task', time: '5m ago', severity: 'success', description: 'Market analysis task completed successfully' },
                  { id: 4, title: 'Task Started', type: 'task', time: '7m ago', severity: 'info', description: 'Started new data processing pipeline' },
                  { id: 5, title: 'Performance Alert', type: 'system', time: '10m ago', severity: 'warning', description: 'Memory usage above threshold for designer agent' },
                ].map(event => {
                  const eventColors = {
                    info: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
                    success: { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' },
                    warning: { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400' },
                    error: { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400' }
                  };
                  
                  const eventIcons = {
                    system: <Settings className="w-4 h-4" />,
                    task: <CheckCircle2 className="w-4 h-4" />
                  };

                  const eventType = event.severity as keyof typeof eventColors;
                  return (
                    <div key={event.id} className={`rounded-xl border p-4 hover:opacity-90 transition-opacity ${eventColors[eventType].bg} ${eventColors[eventType].border}`}>
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1.5 rounded-lg ${eventColors[eventType].bg} ${eventColors[eventType].border} border`}>
                          {eventIcons[event.type as keyof typeof eventIcons]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-white flex items-center gap-2">
                              {event.title}
                              {(event.severity === 'warning' || event.severity === 'error') ? (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${eventColors[eventType].bg} ${eventColors[eventType].border} border`}>
                                  {event.severity.toUpperCase()}
                                </span>
                              ) : null}
                            </h3>
                            <span className="text-xs text-gray-500">{event.time}</span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{event.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MISSIONS VIEW - Enhanced with completed and failed missions */}
          {activeView === 'missions' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">Mission Control</h2>
                <button 
                  onClick={() => window.open('/new-mission', '_blank')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  New Mission
                </button>
              </div>

              {/* Active Missions */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Active Missions
                </h3>
                <div className="grid gap-3 sm:gap-4">
                  {MISSIONS.filter(mission => mission.status !== 'completed').map(mission => (
                    <MissionCard key={mission.id} mission={mission} agents={agents} colorMap={colorMap} />
                  ))}
                </div>
              </div>

              {/* Completed Missions */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Completed Missions
                </h3>
                <div className="grid gap-3 sm:gap-4">
                  {COMPLETED_MISSIONS.map(mission => (
                    <MissionCard key={mission.id} mission={mission} agents={agents} colorMap={colorMap} />
                  ))}
                </div>
              </div>

              {/* Failed Missions */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                  <Flag className="w-5 h-5 text-red-400" />
                  Failed Missions
                </h3>
                <div className="grid gap-3 sm:gap-4">
                  {FAILED_MISSIONS.map(mission => {
                    const missionWithFailureInfo = {
                      ...mission,
                      description: `${mission.description} (Failed: ${mission.failureReason})`
                    };
                    return (
                      <MissionCard key={mission.id} mission={missionWithFailureInfo} agents={agents} colorMap={colorMap} />
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ARCHIVE VIEW */}
          {activeView === 'archive' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">Swarm Archive</h2>
                
                {/* Filter buttons */}
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    All
                  </button>
                  <button className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors border border-white/10">
                    Finished
                  </button>
                  <button className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors border border-white/10">
                    Failed
                  </button>
                </div>
              </div>

              {/* Archive stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl border border-white/10 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Missions</p>
                      <p className="text-2xl font-bold text-white">{ARCHIVE.length + COMPLETED_MISSIONS.length + FAILED_MISSIONS.length}</p>
                    </div>
                    <div className="p-3 bg-primary-500/20 rounded-lg">
                      <Activity className="w-6 h-6 text-primary-400" />
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl border border-white/10 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Successful</p>
                      <p className="text-2xl font-bold text-white">{COMPLETED_MISSIONS.length}</p>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl border border-white/10 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Failed</p>
                      <p className="text-2xl font-bold text-white">{FAILED_MISSIONS.length}</p>
                    </div>
                    <div className="p-3 bg-red-500/20 rounded-lg">
                      <Flag className="w-6 h-6 text-red-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Archive list */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Recent Archives</h3>
                
                {/* Completed missions first */}
                <div>
                  <h4 className="text-md font-medium text-green-400 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Successful Missions
                  </h4>
                  <div className="grid gap-3">
                    {COMPLETED_MISSIONS.slice(0, 5).map(mission => (
                      <ArchiveItem key={mission.id} item={mission} status="success" />
                    ))}
                  </div>
                </div>
                
                {/* Failed missions */}
                <div>
                  <h4 className="text-md font-medium text-red-400 mb-2 flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    Failed Missions
                  </h4>
                  <div className="grid gap-3">
                    {FAILED_MISSIONS.slice(0, 5).map(mission => (
                      <ArchiveItem key={mission.id} item={mission} status="failure" />
                    ))}
                  </div>
                </div>
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
    purple: 'from-primary-500/20 to-primary-600/10 border-primary-500/30',
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

// Metric Card Component
function MetricCard({ label, value, color }: {
  label: string
  value: string
  color: string
}) {
  const colors: Record<string, string> = {
    purple: 'from-primary-500/20 to-primary-600/10 border-primary-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30',
    gray: 'from-gray-500/20 to-gray-600/10 border-gray-500/30',
  }

  return (
    <div className={`p-2 sm:p-4 rounded-xl bg-gradient-to-br ${colors[color]} border backdrop-blur-sm`}>
      <div className="text-center">
        <div className="text-xs text-gray-400 mb-1">{label}</div>
        <div className="text-lg sm:text-xl font-bold text-white">{value}</div>
      </div>
    </div>
  )
}

// Agent Card Component
function AgentCard({ agent, isSelected, onClick, colors }: {
  agent: Agent
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
        ${agent.status === 'active' ? 'hover:shadow-xl hover:shadow-primary-500/10' : ''}
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
  agent: Agent
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

// Define a union type for missions that can have either deadline or completedAt
type Mission = typeof MISSIONS[0] | typeof COMPLETED_MISSIONS[0] | typeof FAILED_MISSIONS[0];

// Mission Card Component
function MissionCard({ mission, agents, colorMap }: {
  mission: Mission
  agents: Agent[]
  colorMap: Record<string, ColorConfig>
}) {
  const statusColors: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    failed: 'bg-red-500/20 text-red-400 border-red-500/30',
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
            mission.status === 'completed' ? 'bg-blue-500' :
            mission.status === 'failed' ? 'bg-red-500' : 'bg-amber-500'
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
            className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-500 transition-all"
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
            {mission.status === 'completed' || mission.status === 'failed' ? 
              `Completed: ${(mission as any).completedAt || mission.deadline}` : 
              `Due: ${mission.deadline}`}
          </span>
        </div>
      </div>
    </div>
  )
}

// Archive Item Component
function ArchiveItem({ item, status }: { 
  item: typeof COMPLETED_MISSIONS[0] | typeof FAILED_MISSIONS[0]; 
  status: 'success' | 'failure' 
}) {
  const statusColors = {
    success: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
    failure: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' }
  };

  return (
    <div className={`p-4 rounded-xl border ${statusColors[status].bg} ${statusColors[status].border} backdrop-blur-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 p-1.5 rounded-lg ${statusColors[status].bg} ${statusColors[status].border} border`}>
            {status === 'success' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Flag className="w-4 h-4 text-red-400" />}
          </div>
          <div>
            <h3 className="font-medium text-white">{item.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{item.description}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span>Participants: {item.specialists?.join(', ') || item.agents.join(', ')}</span>
              <span>•</span>
              <span>{item.completedAt}</span>
            </div>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status].bg} ${statusColors[status].border} border`}>
          {status === 'success' ? 'SUCCESS' : 'FAILED'}
        </span>
      </div>
    </div>
  )
}