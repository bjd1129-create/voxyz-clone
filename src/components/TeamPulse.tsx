'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  Zap, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Sparkles,
  TrendingUp,
  MessageCircle,
  Rocket
} from 'lucide-react'

// Agent 配置
const AGENTS: Record<string, { name: string; emoji: string; color: string; role: string }> = {
  ceo: { name: '诸葛灯泡', emoji: '🎯', color: '#FF6B6B', role: '造梦者' },
  coordinator: { name: '掌舵人', emoji: '📋', color: '#8B5CF6', role: '任务分配' },
  developer: { name: '代码侠', emoji: '💻', color: '#3B82F6', role: '技术开发' },
  writer: { name: '文案君', emoji: '📝', color: '#10B981', role: '内容创作' },
  researcher: { name: '洞察者', emoji: '🔍', color: '#F59E0B', role: '研究分析' },
  creative: { name: '配色师', emoji: '🎨', color: '#A855F7', role: '视觉设计' },
  support: { name: '守护者', emoji: '🛠️', color: '#EC4899', role: '用户支持' },
  growth: { name: '播种者', emoji: '🌱', color: '#22C55E', role: '用户增长' },
  data: { name: '预言家', emoji: '📊', color: '#06B6D4', role: '数据分析' },
  ops: { name: '调度员', emoji: '⚙️', color: '#64748B', role: '运营管理' },
}

// 活动类型
type ActivityType = 'task_start' | 'task_complete' | 'message' | 'status_change' | 'collaboration'

interface Activity {
  id: string
  type: ActivityType
  agent_id: string
  title: string
  description?: string
  duration?: number
  timestamp: Date
}

// Agent 状态
type AgentStatus = 'active' | 'processing' | 'idle'

interface AgentState {
  id: string
  status: AgentStatus
  lastActivity: Date
  currentTask?: string
}

// 模拟数据生成
function generateMockData() {
  const agentIds = Object.keys(AGENTS)
  const activities: Activity[] = []
  const agentStates: AgentState[] = []

  // 生成最近活动
  const activityTypes: ActivityType[] = ['task_start', 'task_complete', 'message', 'collaboration']
  const taskNames = [
    '完成用户调研报告',
    '优化首页加载速度',
    '撰写产品说明文档',
    '设计新功能原型',
    '修复支付系统Bug',
    '分析用户行为数据',
    '创建营销内容',
    '回复用户反馈',
  ]

  for (let i = 0; i < 8; i++) {
    const agentId = agentIds[Math.floor(Math.random() * agentIds.length)]
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)]
    const task = taskNames[Math.floor(Math.random() * taskNames.length)]
    
    activities.push({
      id: `act-${i}`,
      type,
      agent_id: agentId,
      title: type === 'task_complete' ? `完成任务: ${task}` :
             type === 'task_start' ? `开始任务: ${task}` :
             type === 'collaboration' ? `协作处理: ${task}` :
             task,
      description: type === 'task_complete' ? '耗时 15 分钟' : undefined,
      duration: type === 'task_complete' ? Math.floor(Math.random() * 3600) : undefined,
      timestamp: new Date(Date.now() - i * 60000 * Math.random() * 10),
    })
  }

  // 生成 Agent 状态
  for (const agentId of agentIds) {
    const statuses: AgentStatus[] = ['active', 'processing', 'idle']
    agentStates.push({
      id: agentId,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastActivity: new Date(Date.now() - Math.random() * 3600000),
      currentTask: Math.random() > 0.5 ? taskNames[Math.floor(Math.random() * taskNames.length)] : undefined,
    })
  }

  return { activities, agentStates }
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins} 分钟前`
  if (diffHours < 24) return `${diffHours} 小时前`
  return `${Math.floor(diffHours / 24)} 天前`
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}秒`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分${seconds % 60}秒`
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  return `${hours}时${mins}分`
}

// 活动图标
function ActivityIcon({ type }: { type: ActivityType }) {
  const icons = {
    task_start: <Rocket className="w-4 h-4 text-blue-400" />,
    task_complete: <CheckCircle2 className="w-4 h-4 text-green-400" />,
    message: <MessageCircle className="w-4 h-4 text-purple-400" />,
    status_change: <TrendingUp className="w-4 h-4 text-yellow-400" />,
    collaboration: <Sparkles className="w-4 h-4 text-pink-400" />,
  }
  return icons[type] || <Activity className="w-4 h-4 text-gray-400" />
}

// Agent 状态指示器
function StatusIndicator({ status }: { status: AgentStatus }) {
  if (status === 'active') {
    return (
      <span className="flex items-center gap-1">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-xs text-green-400">活跃</span>
      </span>
    )
  }
  if (status === 'processing') {
    return (
      <span className="flex items-center gap-1">
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-spin" />
        <span className="text-xs text-blue-400">处理中</span>
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1">
      <span className="w-2 h-2 bg-gray-400 rounded-full" />
      <span className="text-xs text-gray-400">空闲</span>
    </span>
  )
}

export default function TeamPulse() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [agentStates, setAgentStates] = useState<AgentState[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 初始加载
    const { activities: acts, agentStates: states } = generateMockData()
    setActivities(acts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()))
    setAgentStates(states)
    setLoading(false)

    // 模拟实时更新
    const interval = setInterval(() => {
      setActivities(prev => {
        const agentIds = Object.keys(AGENTS)
        const activityTypes: ActivityType[] = ['task_start', 'task_complete', 'message', 'collaboration']
        const tasks = ['处理新任务', '优化代码', '撰写文档', '设计界面', '分析数据']
        
        const newActivity: Activity = {
          id: `act-${Date.now()}`,
          type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
          agent_id: agentIds[Math.floor(Math.random() * agentIds.length)],
          title: tasks[Math.floor(Math.random() * tasks.length)],
          timestamp: new Date(),
        }
        
        return [newActivity, ...prev.slice(0, 9)]
      })
    }, 15000) // 每15秒更新一次

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl lg:max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-white/10 rounded w-1/4" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-white/5 rounded-xl" />
              <div className="h-96 bg-white/5 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const activeCount = agentStates.filter(a => a.status === 'active' || a.status === 'processing').length

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-6xl lg:max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-16 px-2">
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500/20 backdrop-blur-sm rounded-full text-green-300 text-xs sm:text-sm mb-3 sm:mb-4 border border-green-500/30">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" />
            <span>实时更新</span>
            <span className="text-green-400 font-medium">{activeCount} 个 Agent 活跃中</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            团队动态
          </h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-2">
            查看 AI 团队的实时活动流，了解每个 Agent 的状态和最新进展
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Stream - Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
              {/* Header */}
              <div className="px-3 sm:px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  <h3 className="font-semibold text-sm sm:text-base">实时活动流</h3>
                </div>
                <span className="text-xs text-gray-400">最近 10 条</span>
              </div>

              {/* Activity List */}
              <div className="divide-y divide-white/5 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
                {activities.map((activity, index) => {
                  const agent = AGENTS[activity.agent_id] || { name: activity.agent_id, emoji: '🤖', color: '#888' }
                  const isNew = index === 0

                  return (
                    <div 
                      key={activity.id}
                      className={`p-4 hover:bg-white/5 transition-all duration-300 ${isNew ? 'bg-purple-500/10 border-l-2 border-purple-400' : ''}`}
                    >
                      <div className="flex flex-col xs:flex-row xs:items-start gap-2 xs:gap-3">
                        {/* Agent Avatar */}
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 self-start xs:self-auto"
                          style={{ backgroundColor: agent.color + '20' }}
                        >
                          {agent.emoji}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                            <span className="font-medium text-sm">{agent.name}</span>
                            <ActivityIcon type={activity.type} />
                            {isNew && (
                              <span className="px-2 py-0.5 bg-purple-500/30 text-purple-300 text-xs rounded-full animate-pulse">
                                NEW
                              </span>
                            )}
                            {/* Time - shown inline on mobile, moved to end on larger screens */}
                            <span className="xs:hidden text-xs text-gray-500 ml-auto">
                              {formatTimeAgo(activity.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">{activity.title}</p>
                          {activity.description && (
                            <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                          )}
                          {activity.duration && (
                            <span className="inline-block mt-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {formatDuration(activity.duration)}
                            </span>
                          )}
                        </div>

                        {/* Time - hidden on mobile, shown on larger screens */}
                        <span className="hidden xs:block text-xs text-gray-500 shrink-0 self-start">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-white/10 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-400">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                <span>自动刷新中</span>
              </div>
            </div>
          </div>

          {/* Right Column - Agent Status & Quick Stats */}
          <div className="space-y-6">
            {/* Agent Status Panel */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
              <div className="px-3 sm:px-4 py-3 border-b border-white/10 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                <h3 className="font-semibold text-sm sm:text-base">Agent 状态</h3>
              </div>

              <div className="divide-y divide-white/5 max-h-[280px] sm:max-h-[350px] overflow-y-auto">
                {agentStates.map((agentState) => {
                  const agent = AGENTS[agentState.id]
                  if (!agent) return null

                  return (
                    <div key={agentState.id} className="p-3 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div 
                          className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm"
                          style={{ backgroundColor: agent.color + '20' }}
                        >
                          {agent.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1">
                            <span className="text-sm font-medium truncate">{agent.name}</span>
                            <StatusIndicator status={agentState.status} />
                          </div>
                          {agentState.currentTask && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {agentState.currentTask}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl border border-white/10 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <h3 className="font-semibold text-sm sm:text-base">今日统计</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-purple-400">28</div>
                  <div className="text-xs text-gray-400">完成任务</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-400">4.2h</div>
                  <div className="text-xs text-gray-400">总工作时长</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-400">156</div>
                  <div className="text-xs text-gray-400">协作消息</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-pink-400">92%</div>
                  <div className="text-xs text-gray-400">成功率</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}