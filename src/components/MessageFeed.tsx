'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageSquare, Send, ArrowRight } from 'lucide-react'

interface Message {
  id: string
  from_agent: string
  to_agent: string
  message: string
  created_at: string
}

interface Props {
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

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

export default function MessageFeed({ limit = 50 }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?limit=${limit}`)
        const data = await res.json()
        const sorted = (Array.isArray(data) ? data : []).sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        setMessages(sorted)
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 5000) // 每5秒刷新
    return () => clearInterval(interval)
  }, [limit])

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

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
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden flex flex-col h-[400px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2 shrink-0">
        <MessageSquare className="w-5 h-5 text-purple-400" />
        <h3 className="font-semibold">Agent 沟通</h3>
        <span className="text-xs text-gray-400 ml-auto">{messages.length} 条消息</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            暂无消息记录
          </div>
        ) : (
          messages.map((msg) => {
            const fromAgent = AGENT_NAMES[msg.from_agent] || { name: msg.from_agent, emoji: '🤖', color: '#888' }
            const toAgent = AGENT_NAMES[msg.to_agent] || { name: msg.to_agent, emoji: '🤖', color: '#888' }

            return (
              <div key={msg.id} className="flex items-start gap-2 group">
                {/* From agent */}
                <div 
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
                  style={{ backgroundColor: fromAgent.color + '20' }}
                  title={fromAgent.name}
                >
                  {fromAgent.emoji}
                </div>

                {/* Message content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <span style={{ color: fromAgent.color }}>{fromAgent.name}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span style={{ color: toAgent.color }}>{toAgent.name}</span>
                    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 bg-white/5 rounded-lg px-3 py-2">
                    {msg.message}
                  </p>
                </div>

                {/* To agent */}
                <div 
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
                  style={{ backgroundColor: toAgent.color + '20' }}
                  title={toAgent.name}
                >
                  {toAgent.emoji}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}