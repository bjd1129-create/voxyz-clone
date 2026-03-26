'use client'

import { useState, useEffect } from 'react'
import { Brain, Sparkles, Lightbulb } from 'lucide-react'

interface Thought {
  id: string
  agent_id: string
  thought: string
  context: Record<string, unknown>
  created_at: string
}

interface Props {
  agentId?: string
  limit?: number
}

const AGENT_NAMES: Record<string, { name: string; emoji: string; color: string }> = {
  ceo: { name: '诸葛灯泡', emoji: '🎯', color: '#FF6B6B' },
  creative: { name: '配色师', emoji: '🎨', color: '#A855F7' },
  developer: { name: '代码侠', emoji: '💻', color: '#3B82F6' },
  writer: { name: '文案君', emoji: '📝', color: '#10B981' },
  researcher: { name: '洞察者', emoji: '🔍', color: '#F59E0B' },
  support: { name: '守护者', emoji: '🛠️', color: '#EC4899' },
}

function formatTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  return `${Math.floor(diffMins / 60)}小时前`
}

export default function ThoughtBubble({ agentId, limit = 30 }: Props) {
  const [thoughts, setThoughts] = useState<Thought[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        const url = agentId 
          ? `/api/thoughts?agent_id=${agentId}&limit=${limit}`
          : `/api/thoughts?limit=${limit}`
        const res = await fetch(url)
        const data = await res.json()
        setThoughts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch thoughts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchThoughts()
    const interval = setInterval(fetchThoughts, 8000) // 每8秒刷新
    return () => clearInterval(interval)
  }, [agentId, limit])

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

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
        <Brain className="w-5 h-5 text-yellow-400" />
        <h3 className="font-semibold">工作思考</h3>
        <span className="text-xs text-gray-400 ml-auto">{thoughts.length} 条思考</span>
      </div>

      {/* Thoughts */}
      <div className="max-h-[400px] overflow-y-auto">
        {thoughts.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            暂无思考记录
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {thoughts.map((thought, index) => {
              const agent = AGENT_NAMES[thought.agent_id] || { name: thought.agent_id, emoji: '🤖', color: '#888' }
              const isExpanded = expandedId === thought.id
              const isRecent = index === 0

              return (
                <div 
                  key={thought.id} 
                  className={`
                    relative p-4 rounded-xl cursor-pointer transition-all duration-300
                    ${isRecent ? 'animate-pulse-slow' : ''}
                  `}
                  style={{ 
                    backgroundColor: agent.color + '10',
                    borderLeft: `3px solid ${agent.color}`
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : thought.id)}
                >
                  {/* Thinking bubble tail */}
                  <div 
                    className="absolute -left-1 top-4 w-3 h-3 rounded-full"
                    style={{ backgroundColor: agent.color + '30' }}
                  />

                  {/* Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{agent.emoji}</span>
                    <span className="font-medium text-sm" style={{ color: agent.color }}>
                      {agent.name}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {formatTimeAgo(thought.created_at)}
                    </span>
                    {isRecent && (
                      <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                    )}
                  </div>

                  {/* Thought content */}
                  <p className={`text-sm text-gray-200 ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {thought.thought}
                  </p>

                  {/* Context (expanded) */}
                  {isExpanded && thought.context && Object.keys(thought.context).length > 0 && (
                    <div className="mt-3 p-2 bg-black/20 rounded text-xs text-gray-400">
                      <div className="flex items-center gap-1 mb-1">
                        <Lightbulb className="w-3 h-3" />
                        <span>上下文</span>
                      </div>
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(thought.context, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}