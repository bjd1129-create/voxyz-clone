'use client'

import { useState, useEffect } from 'react'
import { Clock, CheckCircle, AlertCircle, Timer } from 'lucide-react'

interface WorkLog {
  id: string
  agent_id: string
  action: string
  details: Record<string, unknown>
  duration_seconds: number | null
  created_at: string
}

interface Props {
  agentId?: string
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

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

function formatTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins} 分钟前`
  if (diffHours < 24) return `${diffHours} 小时前`
  return `${diffDays} 天前`
}

export default function WorkLogTimeline({ agentId, limit = 20 }: Props) {
  const [logs, setLogs] = useState<WorkLog[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<{ totalDuration: number; count: number }>({ totalDuration: 0, count: 0 })

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const url = agentId 
          ? `/api/work-logs?agent_id=${agentId}&limit=${limit}`
          : `/api/work-logs?limit=${limit}`
        const res = await fetch(url)
        const data = await res.json()
        setLogs(Array.isArray(data) ? data : [])
        
        // 计算统计数据
        const totalDuration = data.reduce((sum: number, log: WorkLog) => 
          sum + (log.duration_seconds || 0), 0)
        setStats({ totalDuration, count: data.length })
      } catch (error) {
        console.error('Failed to fetch work logs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
    const interval = setInterval(fetchLogs, 10000) // 每10秒刷新
    return () => clearInterval(interval)
  }, [agentId, limit])

  if (loading) {
    return (
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/10 rounded w-1/4" />
          <div className="h-4 bg-white/10 rounded w-3/4" />
          <div className="h-4 bg-white/10 rounded w-1/2" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold">工作记录</h3>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Timer className="w-4 h-4" />
            <span>{formatDuration(stats.totalDuration)}</span>
          </div>
          <span>{stats.count} 条记录</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-h-[400px] overflow-y-auto">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            暂无工作记录
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {logs.map((log, index) => {
              const agent = AGENT_NAMES[log.agent_id] || { name: log.agent_id, emoji: '🤖', color: '#888' }
              const isRecent = index === 0
              
              return (
                <div 
                  key={log.id} 
                  className={`p-4 hover:bg-white/5 transition-colors ${isRecent ? 'bg-white/5' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: agent.color + '20' }}
                    >
                      {agent.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{agent.name}</span>
                        <span className="text-xs text-gray-500">{formatTimeAgo(log.created_at)}</span>
                        {isRecent && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                            最新
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300">{log.action}</p>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {JSON.stringify(log.details).slice(0, 100)}
                        </p>
                      )}
                    </div>
                    {log.duration_seconds && (
                      <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                        {formatDuration(log.duration_seconds)}
                      </div>
                    )}
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