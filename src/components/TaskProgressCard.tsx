'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircle, Clock, AlertTriangle, BarChart3, 
  Play, Pause, X, ChevronRight 
} from 'lucide-react'

interface TaskProgress {
  id: string
  task_id: string | null
  status: string
  progress: number
  blocked_reason: string | null
  agent_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

interface Props {
  status?: string
  limit?: number
}

const AGENT_NAMES: Record<string, { name: string; emoji: string; color: string }> = {
  ceo: { name: 'CEO Minion', emoji: '🎯', color: '#FF6B6B' },
  creative: { name: 'Creative', emoji: '🎨', color: '#A855F7' },
  developer: { name: 'Developer', emoji: '💻', color: '#3B82F6' },
  writer: { name: 'Writer', emoji: '📝', color: '#10B981' },
  researcher: { name: 'Researcher', emoji: '🔍', color: '#F59E0B' },
  support: { name: 'Support', emoji: '🛠️', color: '#EC4899' },
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  pending: { label: '待处理', color: '#6B7280', icon: Clock },
  in_progress: { label: '进行中', color: '#3B82F6', icon: Play },
  blocked: { label: '阻塞', color: '#EF4444', icon: AlertTriangle },
  paused: { label: '暂停', color: '#F59E0B', icon: Pause },
  completed: { label: '已完成', color: '#10B981', icon: CheckCircle },
  cancelled: { label: '已取消', color: '#6B7280', icon: X },
}

function formatTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  return `${diffDays}天前`
}

export default function TaskProgressCard({ status, limit = 20 }: Props) {
  const [tasks, setTasks] = useState<TaskProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>(status || 'all')

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const statusParam = filter !== 'all' ? `&status=${filter}` : ''
        const res = await fetch(`/api/task-progress?limit=${limit}${statusParam}`)
        const data = await res.json()
        setTasks(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
    const interval = setInterval(fetchTasks, 10000) // 每10秒刷新
    return () => clearInterval(interval)
  }, [filter, limit])

  if (loading) {
    return (
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/10 rounded w-1/4" />
          <div className="h-4 bg-white/10 rounded w-3/4" />
        </div>
      </div>
    )
  }

  const activeTasks = tasks.filter(t => t.status === 'in_progress' || t.status === 'blocked')
  const blockedCount = tasks.filter(t => t.status === 'blocked').length

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-400" />
          <h3 className="font-semibold">任务进程</h3>
          {blockedCount > 0 && (
            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
              {blockedCount} 阻塞
            </span>
          )}
        </div>
        
        {/* Filter */}
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm"
        >
          <option value="all">全部</option>
          <option value="in_progress">进行中</option>
          <option value="blocked">阻塞</option>
          <option value="completed">已完成</option>
        </select>
      </div>

      {/* Active tasks highlight */}
      {activeTasks.length > 0 && (
        <div className="px-4 py-3 bg-blue-500/10 border-b border-white/10">
          <div className="text-sm text-blue-400 font-medium mb-2">
            当前进行中 ({activeTasks.length})
          </div>
          <div className="space-y-2">
            {activeTasks.slice(0, 3).map(task => {
              const agent = task.agent_id ? AGENT_NAMES[task.agent_id] : null
              const config = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending

              return (
                <div 
                  key={task.id}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    task.status === 'blocked' ? 'bg-red-500/10' : 'bg-white/5'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {agent && <span>{agent.emoji}</span>}
                      <span className="text-sm">{task.notes || '任务 #' + task.id.slice(0, 8)}</span>
                    </div>
                    {task.status === 'blocked' && task.blocked_reason && (
                      <p className="text-xs text-red-400 mt-1">
                        ⚠️ {task.blocked_reason}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${task.progress}%`,
                          backgroundColor: config.color 
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{task.progress}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="max-h-[400px] overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            暂无任务记录
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {tasks.map(task => {
              const agent = task.agent_id ? AGENT_NAMES[task.agent_id] : null
              const config = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending
              const Icon = config.icon

              return (
                <div key={task.id} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: config.color + '20' }}
                    >
                      <Icon className="w-4 h-4" style={{ color: config.color }} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{ 
                            backgroundColor: config.color + '20',
                            color: config.color 
                          }}
                        >
                          {config.label}
                        </span>
                        {agent && (
                          <span className="text-sm">{agent.emoji} {agent.name}</span>
                        )}
                        <span className="text-xs text-gray-500 ml-auto">
                          {formatTimeAgo(task.updated_at)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-300 truncate">
                        {task.notes || `任务 ${task.task_id || task.id.slice(0, 8)}`}
                      </p>
                      
                      {/* Progress bar */}
                      {task.status !== 'completed' && task.status !== 'cancelled' && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{ 
                                width: `${task.progress}%`,
                                backgroundColor: config.color 
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">{task.progress}%</span>
                        </div>
                      )}
                      
                      {/* Blocked reason */}
                      {task.blocked_reason && (
                        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {task.blocked_reason}
                        </p>
                      )}
                    </div>

                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}