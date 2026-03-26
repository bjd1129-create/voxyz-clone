'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Maximize2, Minimize2, Activity, Coffee, Users, Briefcase } from 'lucide-react'

interface AgentData {
  name: string
  emoji: string
  color: string
  status: 'idle' | 'busy' | 'offline'
  currentTask: string | null
  lastActive: string
  position: { x: number; y: number }
  activity: 'working' | 'walking' | 'meeting' | 'coffee'
}

// Office layout
const DESKS = [
  { id: 'ceo', x: 150, y: 120, w: 100, h: 60 },
  { id: 'creative', x: 300, y: 120, w: 100, h: 60 },
  { id: 'developer', x: 450, y: 120, w: 100, h: 60 },
  { id: 'writer', x: 150, y: 270, w: 100, h: 60 },
  { id: 'researcher', x: 300, y: 270, w: 100, h: 60 },
  { id: 'support', x: 450, y: 270, w: 100, h: 60 },
]

const MEETING_TABLE = { x: 300, y: 420, w: 150, h: 80 }
const COFFEE_AREA = { x: 50, y: 400, w: 80, h: 60 }

export default function OfficePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [agents, setAgents] = useState<Record<string, AgentData>>({})
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  // Fetch agent status
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
    const interval = setInterval(fetchAgents, 3000) // Poll every 3 seconds
    return () => clearInterval(interval)
  }, [fetchAgents])

  // Animate canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrame: number
    let time = 0

    const draw = () => {
      time += 0.016 // ~60fps

      // Clear
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

        // Monitor glow
        ctx.fillStyle = '#2a2a4a'
        ctx.fillRect(desk.x + 20, desk.y + 10, 60, 30)

        const agent = agents[desk.id]
        if (agent?.status === 'busy') {
          // Animated screen glow
          const glowIntensity = Math.sin(time * 2) * 0.1 + 0.2
          ctx.fillStyle = agent.color + Math.floor(glowIntensity * 255).toString(16).padStart(2, '0')
          ctx.fillRect(desk.x + 22, desk.y + 12, 56, 26)
        }
      })

      // Draw agents
      ctx.font = '32px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      Object.entries(agents).forEach(([id, agent]) => {
        const desk = DESKS.find(d => d.id === id)
        if (!desk) return

        // Calculate position based on activity
        let x = desk.x + desk.w / 2
        let y = desk.y + desk.h + 25

        if (agent.activity === 'coffee') {
          x = COFFEE_AREA.x + COFFEE_AREA.w / 2
          y = COFFEE_AREA.y - 15
        } else if (agent.activity === 'meeting') {
          x = MEETING_TABLE.x + MEETING_TABLE.w / 2 + (Object.keys(agents).indexOf(id) - 3) * 30
          y = MEETING_TABLE.y + MEETING_TABLE.h / 2
        }

        // Walking animation
        if (agent.activity === 'walking') {
          x += Math.sin(time * 2 + Object.keys(agents).indexOf(id)) * 10
          y += Math.cos(time * 2 + Object.keys(agents).indexOf(id)) * 5
        }

        // Glow effect based on status
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

        // Agent emoji
        ctx.fillText(agent.emoji, x, y)

        // Activity indicator
        ctx.font = '14px Arial'
        if (agent.status === 'busy' && agent.currentTask) {
          const taskText = agent.currentTask.length > 15
            ? agent.currentTask.slice(0, 15) + '...'
            : agent.currentTask

          // Task bubble
          const textWidth = ctx.measureText(taskText).width + 10
          ctx.fillStyle = '#2a2a4a'
          ctx.beginPath()
          ctx.roundRect(x - textWidth / 2, y - 55, textWidth, 20, 4)
          ctx.fill()
          ctx.fillStyle = '#fff'
          ctx.fillText(taskText, x, y - 42)
        }

        ctx.font = '32px Arial'
      })

      // Stats overlay
      const busyCount = Object.values(agents).filter(a => a.status === 'busy').length
      ctx.fillStyle = '#4a4a6a'
      ctx.fillRect(10, 10, 150, 60)
      ctx.font = '12px Arial'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#fff'
      ctx.fillText(`活跃: ${busyCount} / ${Object.keys(agents).length}`, 20, 30)
      ctx.fillStyle = '#888'
      ctx.fillText(`更新: ${lastUpdate}`, 20, 50)

      animationFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [agents, lastUpdate])

  return (
    <main className="min-h-screen p-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pixel Office</h1>
            <p className="text-gray-400 mt-1">实时观察 AI 团队工作状态</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gray-400">实时同步</span>
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
              onClick={() => setSelectedAgent(selectedAgent === id ? null : id)}
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
              <div className="text-xs text-gray-400 capitalize">{agent.activity}</div>
              {agent.currentTask && (
                <div className="text-xs text-gray-500 mt-1 truncate">
                  📌 {agent.currentTask}
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
        </div>
      </section>
    </main>
  )
}