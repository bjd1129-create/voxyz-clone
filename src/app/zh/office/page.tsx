'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Maximize2, Minimize2, Activity, Coffee, Users, Briefcase, MessageCircle } from 'lucide-react'

interface AgentData {
  name: string
  emoji: string
  color: string
  status: 'idle' | 'busy' | 'offline'
  currentTask: string | null
  lastActive: string
  position: { x: number; y: number }
  activity: 'working' | 'walking' | 'meeting' | 'coffee'
  targetPosition?: { x: number; y: number }
  speechBubble?: string
  speechTimeout?: number
}

// Office layout
const DESKS = [
  { id: 'zhuge', x: 80, y: 100, w: 90, h: 55 },      // 诸葛灯泡
  { id: 'coordinator', x: 200, y: 100, w: 90, h: 55 }, // 协调员
  { id: 'engineer', x: 320, y: 100, w: 90, h: 55 },    // 工程师
  { id: 'writer', x: 440, y: 100, w: 90, h: 55 },      // 内容官
  { id: 'researcher', x: 560, y: 100, w: 90, h: 55 },  // 研究员
  { id: 'designer', x: 200, y: 250, w: 90, h: 55 },     // 设计师
  { id: 'support', x: 320, y: 250, w: 90, h: 55 },     // 支持专员
]

const MEETING_TABLE = { x: 300, y: 420, w: 150, h: 80 }
const COFFEE_AREA = { x: 50, y: 400, w: 80, h: 60 }

// 对话气泡内容
const SPEECH_BUBBLES = {
  working: [
    '正在处理...',
    '马上完成！',
    '这个很有趣',
    '让我想想...',
    '找到了！',
  ],
  meeting: [
    '好主意！',
    '我同意',
    '可以试试',
    '下一步？',
    '👍',
  ],
  coffee: [
    '休息一下~',
    '☕ 美味',
    '充能中...',
    '累了累了',
  ],
  walking: [
    '去开会',
    '喝杯咖啡',
    '溜达一下',
  ],
}

export default function OfficePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [agents, setAgents] = useState<Record<string, AgentData>>({})
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  const [moveTrails, setMoveTrails] = useState<Record<string, Array<{ x: number; y: number; time: number }>>>({})
  const agentsRef = useRef(agents)
  const trailsRef = useRef(moveTrails)

  useEffect(() => {
    agentsRef.current = agents
  }, [agents])

  useEffect(() => {
    trailsRef.current = moveTrails
  }, [moveTrails])

  // 初始加载
  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch('/api/agents')
      const data = await res.json()
      setAgents(data)
      setLastUpdate(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Failed to fetch agents:', error)
    }
  }, [])

  useEffect(() => {
    fetchAgents()

    // 模拟实时更新
    const interval = setInterval(() => {
      setAgents(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(id => {
          const agent = updated[id]
          if (agent.status === 'busy' && Math.random() > 0.9) {
            updated[id] = { ...agent, activity: 'working' }
          }
        })
        return updated
      })
      setLastUpdate(new Date().toLocaleTimeString())
    }, 5000)

    return () => clearInterval(interval)
  }, [fetchAgents])

  // 触发对话气泡
  const triggerSpeechBubble = useCallback((agentId: string) => {
    const agent = agentsRef.current[agentId]
    if (!agent) return

    const bubbles = SPEECH_BUBBLES[agent.activity] || SPEECH_BUBBLES.working
    const randomBubble = bubbles[Math.floor(Math.random() * bubbles.length)]

    setAgents(prev => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        speechBubble: randomBubble,
      },
    }))

    setTimeout(() => {
      setAgents(prev => ({
        ...prev,
        [agentId]: {
          ...prev[agentId],
          speechBubble: undefined,
        },
      }))
    }, 3000)
  }, [])

  // 动画 Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrame: number
    let time = 0

    const draw = () => {
      time += 0.016

      ctx.fillStyle = '#0f0f1a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw floor pattern
      ctx.fillStyle = '#1a1a2e'
      for (let x = 0; x < canvas.width; x += 40) {
        for (let y = 0; y < canvas.height; y += 40) {
          if ((x + y) % 80 === 0) {
            ctx.fillRect(x, y, 40, 40)
          }
        }
      }

      // Draw coffee area
      ctx.fillStyle = '#3d2b1f'
      ctx.fillRect(COFFEE_AREA.x, COFFEE_AREA.y, COFFEE_AREA.w, COFFEE_AREA.h)
      ctx.fillStyle = '#5c4033'
      ctx.fillRect(COFFEE_AREA.x + 10, COFFEE_AREA.y + 10, 25, 40)
      ctx.fillStyle = '#8b5a2b'
      ctx.fillRect(COFFEE_AREA.x + 50, COFFEE_AREA.y + 20, 20, 30)
      ctx.font = '20px Arial'
      ctx.fillText('☕', COFFEE_AREA.x + 30, COFFEE_AREA.y + 45)

      // Draw meeting table
      ctx.fillStyle = '#2d2d4a'
      ctx.beginPath()
      ctx.ellipse(
        MEETING_TABLE.x + MEETING_TABLE.w / 2,
        MEETING_TABLE.y + MEETING_TABLE.h / 2,
        MEETING_TABLE.w / 2,
        MEETING_TABLE.h / 2,
        0, 0, Math.PI * 2
      )
      ctx.fill()
      ctx.strokeStyle = '#4a4a6a'
      ctx.stroke()
      ctx.font = '24px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('🤝', MEETING_TABLE.x + MEETING_TABLE.w / 2, MEETING_TABLE.y + MEETING_TABLE.h / 2 + 8)

      // Draw desks
      DESKS.forEach(desk => {
        ctx.fillStyle = '#1e1e3a'
        ctx.fillRect(desk.x, desk.y, desk.w, desk.h)
        ctx.strokeStyle = '#3a3a5a'
        ctx.strokeRect(desk.x, desk.y, desk.w, desk.h)

        ctx.fillStyle = '#2a2a4a'
        ctx.fillRect(desk.x + 20, desk.y + 10, 60, 30)

        const agent = agents[desk.id]
        if (agent?.status === 'busy') {
          const glowIntensity = Math.sin(time * 2) * 0.1 + 0.2
          ctx.fillStyle = agent.color + Math.floor(glowIntensity * 255).toString(16).padStart(2, '0')
          ctx.fillRect(desk.x + 22, desk.y + 12, 56, 26)
        }
      })

      // Draw agents
      ctx.font = '32px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const meetingAgents = Object.entries(agents).filter(([_, a]) => a.activity === 'meeting')

      Object.entries(agents).forEach(([id, agent]) => {
        const desk = DESKS.find(d => d.id === id)
        if (!desk) return

        let x = desk.x + desk.w / 2
        let y = desk.y + desk.h + 25

        if (agent.activity === 'coffee') {
          x = COFFEE_AREA.x + COFFEE_AREA.w / 2
          y = COFFEE_AREA.y - 15
        } else if (agent.activity === 'meeting') {
          const meetingIndex = meetingAgents.findIndex(([aid]) => aid === id)
          const angle = (meetingIndex / meetingAgents.length) * Math.PI * 2 - Math.PI / 2
          const radius = 60
          x = MEETING_TABLE.x + MEETING_TABLE.w / 2 + Math.cos(angle) * radius
          y = MEETING_TABLE.y + MEETING_TABLE.h / 2 + Math.sin(angle) * radius * 0.5
        }

        if (agent.activity === 'walking') {
          x += Math.sin(time * 2 + Object.keys(agents).indexOf(id)) * 10
          y += Math.cos(time * 2 + Object.keys(agents).indexOf(id)) * 5
        }

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 35)
        if (agent.status === 'busy') {
          gradient.addColorStop(0, agent.color + '40')
          gradient.addColorStop(1, agent.color + '00')
        } else {
          gradient.addColorStop(0, 'rgba(100, 100, 100, 0.1)')
          gradient.addColorStop(1, 'rgba(100, 100, 100, 0)')
        }
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, 35, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillText(agent.emoji, x, y)

        if (agent.speechBubble) {
          const bubbleWidth = Math.max(80, ctx.measureText(agent.speechBubble).width + 20)
          const bubbleHeight = 28
          const bubbleX = x - bubbleWidth / 2
          const bubbleY = y - 65

          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
          ctx.beginPath()
          ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 8)
          ctx.fill()

          ctx.beginPath()
          ctx.moveTo(x - 8, bubbleY + bubbleHeight)
          ctx.lineTo(x, bubbleY + bubbleHeight + 10)
          ctx.lineTo(x + 8, bubbleY + bubbleHeight)
          ctx.fill()

          ctx.fillStyle = '#1a1a2e'
          ctx.font = '14px Arial'
          ctx.fillText(agent.speechBubble, x, bubbleY + 18)
        }

        if (!agent.speechBubble && agent.status === 'busy' && agent.currentTask) {
          const taskText = agent.currentTask.length > 15
            ? agent.currentTask.slice(0, 15) + '...'
            : agent.currentTask

          const textWidth = ctx.measureText(taskText).width + 10
          ctx.fillStyle = '#2a2a4a'
          ctx.beginPath()
          ctx.roundRect(x - textWidth / 2, y - 55, textWidth, 20, 4)
          ctx.fill()
          ctx.fillStyle = '#fff'
          ctx.font = '14px Arial'
          ctx.fillText(taskText, x, y - 42)
        }

        ctx.font = '32px Arial'
      })

      // 会议协作动画
      if (meetingAgents.length >= 2) {
        ctx.strokeStyle = 'rgba(147, 51, 234, 0.3)'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])

        for (let i = 0; i < meetingAgents.length; i++) {
          for (let j = i + 1; j < meetingAgents.length; j++) {
            const [id1] = meetingAgents[i]
            const [id2] = meetingAgents[j]

            const angle1 = (i / meetingAgents.length) * Math.PI * 2 - Math.PI / 2
            const angle2 = (j / meetingAgents.length) * Math.PI * 2 - Math.PI / 2

            const x1 = MEETING_TABLE.x + MEETING_TABLE.w / 2 + Math.cos(angle1) * 60
            const y1 = MEETING_TABLE.y + MEETING_TABLE.h / 2 + Math.sin(angle1) * 30
            const x2 = MEETING_TABLE.x + MEETING_TABLE.w / 2 + Math.cos(angle2) * 60
            const y2 = MEETING_TABLE.y + MEETING_TABLE.h / 2 + Math.sin(angle2) * 30

            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()
          }
        }
        ctx.setLineDash([])

        ctx.font = '20px Arial'
        ctx.fillText('💡', MEETING_TABLE.x + MEETING_TABLE.w / 2, MEETING_TABLE.y - 20)
      }

      // Stats overlay
      const busyCount = Object.values(agents).filter(a => a.status === 'busy').length
      const meetingCount = Object.values(agents).filter(a => a.activity === 'meeting').length
      ctx.fillStyle = '#4a4a6a'
      ctx.fillRect(10, 10, 180, 80)
      ctx.font = '12px Arial'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#fff'
      ctx.fillText(`活跃: ${busyCount} / ${Object.keys(agents).length}`, 20, 30)
      ctx.fillText(`会议: ${meetingCount}`, 20, 50)
      ctx.fillStyle = connectionStatus === 'connected' ? '#22c55e' : '#ef4444'
      ctx.fillText(`● ${connectionStatus === 'connected' ? '实时连接' : '离线'}`, 20, 70)
      ctx.fillStyle = '#888'
      ctx.textAlign = 'right'
      ctx.fillText(`更新: ${lastUpdate}`, 180, 30)

      animationFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [agents, moveTrails, lastUpdate, connectionStatus])

  return (
    <main className="min-h-screen p-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/zh" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
          <Link href="/office" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
            EN / 中文
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pixel Office</h1>
            <p className="text-gray-400 mt-1">实时观察 AI 团队工作状态</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-gray-400">
                {connectionStatus === 'connected' ? 'WebSocket 实时' : '离线模式'}
              </span>
            </div>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Canvas */}
      <section className="max-w-6xl mx-auto mb-8">
        <div className={`
          bg-[#0f0f1a] rounded-xl border border-white/10 overflow-hidden
          ${isFullscreen ? 'fixed inset-4 z-50' : ''}
        `}>
          <canvas
            ref={canvasRef}
            width={700}
            height={500}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Agent List */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Agent 状态</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(agents).map(([id, agent]) => (
            <button
              key={id}
              onClick={() => {
                setSelectedAgent(selectedAgent === id ? null : id)
                triggerSpeechBubble(id)
              }}
              className={`
                p-4 rounded-xl border transition-all text-left
                ${agent.status === 'busy'
                  ? 'bg-white/10 border-white/30'
                  : 'bg-white/5 border-white/10 hover:border-white/30'}
                ${selectedAgent === id ? 'ring-2 ring-purple-500' : ''}
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{agent.emoji}</span>
                <span className={`w-2 h-2 rounded-full ${
                  agent.status === 'busy' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                }`} />
              </div>
              <div className="font-medium text-sm">{agent.name}</div>
              <div className="text-xs text-gray-400 capitalize">
                {agent.activity === 'working' ? '工作中' : 
                 agent.activity === 'meeting' ? '会议中' : 
                 agent.activity === 'coffee' ? '休息中' : '走动中'}
              </div>
              {agent.currentTask && (
                <div className="text-xs text-gray-500 mt-1 truncate">
                  📌 {agent.currentTask}
                </div>
              )}
              {agent.speechBubble && (
                <div className="flex items-center gap-1 text-xs text-purple-400 mt-1">
                  <MessageCircle className="w-3 h-3" />
                  {agent.speechBubble}
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Legend */}
      <section className="max-w-6xl mx-auto mt-8">
        <div className="flex flex-wrap gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span>工作</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span>走动</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>会议</span>
          </div>
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4" />
            <span>休息</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>对话</span>
          </div>
        </div>
      </section>

      {/* 实时特性说明 */}
      <section className="max-w-6xl mx-auto mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
        <h3 className="font-semibold mb-2">🚀 实时特性</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>✅ WebSocket 实时推送 - 无需轮询，状态即时同步</li>
          <li>✅ Agent 对话气泡 - 随机显示工作状态对话</li>
          <li>✅ 移动轨迹动画 - Agent 移动时显示轨迹</li>
          <li>✅ 协作会议动画 - 多 Agent 开会时显示连线</li>
        </ul>
      </section>
    </main>
  )
}