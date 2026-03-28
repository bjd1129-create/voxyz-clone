'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Maximize2, Minimize2, Activity, Coffee, Users, Briefcase, MessageCircle } from 'lucide-react'

interface AgentProphet {
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

// Office layout - 10 desks for all agents
const DESKS = [
  { id: 'zhuge', x: 60, y: 80, w: 100, h: 60 },
  { id: 'coordinator', x: 200, y: 80, w: 100, h: 60 },
  { id: 'engineer', x: 340, y: 80, w: 100, h: 60 },
  { id: 'writer', x: 480, y: 80, w: 100, h: 60 },
  { id: 'researcher', x: 620, y: 80, w: 100, h: 60 },
  { id: 'designer', x: 60, y: 220, w: 100, h: 60 },
  { id: 'support', x: 200, y: 220, w: 100, h: 60 },
  { id: 'growth', x: 340, y: 220, w: 100, h: 60 },
  { id: 'prophet', x: 480, y: 220, w: 100, h: 60 },
  { id: 'scheduler', x: 620, y: 220, w: 100, h: 60 },
]

const MEETING_TABLE = { x: 280, y: 380, w: 180, h: 100 }
const COFFEE_AREA = { x: 40, y: 360, w: 100, h: 80 }
const PLANT_SPOTS = [
  { x: 20, y: 20 },
  { x: 740, y: 20 },
  { x: 20, y: 340 },
  { x: 740, y: 340 },
]

// Speech bubble content
const SPEECH_BUBBLES = {
  working: [
    'Processing...',
    'Almost done!',
    'Interesting...',
    'Let me think...',
    'Found it!',
  ],
  meeting: [
    'Great idea!',
    'I agree',
    'Let\'s try',
    'Next step?',
    '👍',
  ],
  coffee: [
    'Break time~',
    '☕ Delicious',
    'Recharging...',
    'So tired',
  ],
  walking: [
    'Going to meeting',
    'Coffee break',
    'Walking around',
  ],
}

export default function OfficePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [agents, setAgents] = useState<Record<string, AgentProphet>>({})
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

  // Initial load - using mock data
  const fetchAgents = useCallback(async () => {
    try {
      const mockAgents: Record<string, AgentProphet> = {
        zhuge: { name: 'Spark', emoji: '🎯', color: '#22c55e', status: 'busy', currentTask: 'System Optimization', lastActive: new Date().toISOString(), position: { x: 80, y: 100 }, activity: 'working' },
        coordinator: { name: 'Pilot', emoji: '📋', color: '#a855f7', status: 'busy', currentTask: 'Assigning Tasks', lastActive: new Date().toISOString(), position: { x: 200, y: 100 }, activity: 'working' },
        engineer: { name: 'Forge', emoji: '💻', color: '#3b82f6', status: 'busy', currentTask: 'Writing Code', lastActive: new Date().toISOString(), position: { x: 320, y: 100 }, activity: 'working' },
        writer: { name: 'Ink', emoji: '📝', color: '#10b981', status: 'idle', currentTask: null, lastActive: new Date().toISOString(), position: { x: 440, y: 100 }, activity: 'coffee' },
        researcher: { name: 'Radar', emoji: '🔍', color: '#f59e0b', status: 'busy', currentTask: 'Market Research', lastActive: new Date().toISOString(), position: { x: 560, y: 100 }, activity: 'working' },
        designer: { name: 'Canvas', emoji: '🎨', color: '#ec4899', status: 'idle', currentTask: null, lastActive: new Date().toISOString(), position: { x: 80, y: 250 }, activity: 'walking' },
        support: { name: 'Angel', emoji: '🛠️', color: '#06b6d4', status: 'busy', currentTask: 'Handling Tickets', lastActive: new Date().toISOString(), position: { x: 200, y: 250 }, activity: 'working' },
        growth: { name: 'Sower', emoji: '🌱', color: '#84cc16', status: 'idle', currentTask: null, lastActive: new Date().toISOString(), position: { x: 320, y: 250 }, activity: 'coffee' },
        prophet: { name: 'Prophet', emoji: '📊', color: '#6366f1', status: 'busy', currentTask: 'Analyzing Data', lastActive: new Date().toISOString(), position: { x: 440, y: 250 }, activity: 'working' },
        scheduler: { name: 'Scheduler', emoji: '⚙️', color: '#64748b', status: 'idle', currentTask: null, lastActive: new Date().toISOString(), position: { x: 560, y: 250 }, activity: 'walking' },
      }
      setAgents(mockAgents)
      setConnectionStatus('connected')
      setLastUpdate(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Failed to fetch agents:', error)
      setConnectionStatus('disconnected')
    }
  }, [])

  useEffect(() => {
    fetchAgents()

    // Simulate real-time updates
    const interval = setInterval(() => {
      setAgents(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(id => {
          const agent = updated[id]
          
          if (Math.random() > 0.95) {
            updated[id] = { 
              ...agent, 
              status: Math.random() > 0.5 ? 'busy' : 'idle',
              activity: Math.random() > 0.7 ? 'walking' : (Math.random() > 0.5 ? 'working' : 'coffee')
            }
          }
        })
        return updated
      })
      setLastUpdate(new Date().toLocaleTimeString())
    }, 2000)

    return () => clearInterval(interval)
  }, [fetchAgents])

  // Trigger speech bubble
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

  // Draw floor
  const drawFloor = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#e8e8e8'
    ctx.fillRect(0, 0, 800, 340)
    
    ctx.strokeStyle = '#d0d0d0'
    ctx.lineWidth = 1
    for (let x = 0; x < 800; x += 40) {
      for (let y = 0; y < 340; y += 40) {
        ctx.strokeRect(x, y, 40, 40)
      }
    }
    
    ctx.fillStyle = '#d4a574'
    ctx.fillRect(0, 340, 800, 120)
    
    ctx.strokeStyle = '#c49564'
    ctx.lineWidth = 2
    for (let x = 0; x < 800; x += 60) {
      ctx.beginPath()
      ctx.moveTo(x, 340)
      ctx.lineTo(x, 460)
      ctx.stroke()
    }
  }

  // Draw pixel desk
  const drawDesk = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = '#8b7355'
    ctx.fillRect(x, y, w, h)
    
    ctx.strokeStyle = '#6b5344'
    ctx.lineWidth = 3
    ctx.strokeRect(x, y, w, h)
    
    ctx.fillStyle = '#2d2d2d'
    ctx.fillRect(x + w/2 - 20, y + 10, 40, 30)
    
    ctx.fillStyle = '#4a9eff'
    ctx.fillRect(x + w/2 - 17, y + 13, 34, 24)
    
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(x + w/2 - 25, y + 45, 50, 12)
    
    ctx.fillStyle = '#4a4a4a'
    ctx.fillRect(x + w/2 - 15, y + h + 5, 30, 25)
  }

  // Draw meeting table
  const drawMeetingTable = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = '#a08060'
    ctx.fillRect(x, y, w, h)
    
    ctx.strokeStyle = '#806040'
    ctx.lineWidth = 4
    ctx.strokeRect(x, y, w, h)
    
    ctx.fillStyle = '#3d3d3d'
    ctx.fillRect(x + w/2 - 30, y + h/2 - 15, 60, 30)
    
    ctx.fillStyle = '#5a9eff'
    ctx.fillRect(x + w/2 - 27, y + h/2 - 12, 54, 24)
  }

  // Draw coffee area
  const drawCoffeeArea = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = '#6b8e6b'
    ctx.fillRect(x, y, w, h)
    
    ctx.fillStyle = '#5a7d5a'
    ctx.fillRect(x, y, w, 15)
    
    ctx.fillStyle = '#2d2d2d'
    ctx.fillRect(x + w + 10, y, 30, 40)
    
    ctx.fillStyle = '#8b4513'
    ctx.fillRect(x + w + 15, y + 10, 20, 25)
  }

  // Draw plant
  const drawPlant = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = '#8b4513'
    ctx.fillRect(x, y, 20, 20)
    
    ctx.fillStyle = '#228b22'
    ctx.beginPath()
    ctx.arc(x + 10, y - 10, 15, 0, Math.PI * 2)
    ctx.fill()
  }

  // Draw move trails
  const drawMoveTrails = (ctx: CanvasRenderingContext2D) => {
    Object.entries(moveTrails).forEach(([id, trails]) => {
      const agent = agents[id]
      if (!agent || trails.length < 2) return
      
      ctx.strokeStyle = agent.color + '60'
      ctx.lineWidth = 2
      ctx.setLineDash([4, 4])
      
      ctx.beginPath()
      trails.forEach((trail, index) => {
        const x = trail.x + 45
        const y = trail.y + 50
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()
      ctx.setLineDash([])
    })
  }

  // Draw collaboration lines
  const drawCollaborationLines = (ctx: CanvasRenderingContext2D) => {
    const busyAgents = Object.entries(agents).filter(([_, a]) => a.status === 'busy')
    
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)'
    ctx.lineWidth = 1
    
    for (let i = 0; i < busyAgents.length; i++) {
      for (let j = i + 1; j < busyAgents.length; j++) {
        const agent1 = busyAgents[i][1]
        const agent2 = busyAgents[j][1]
        
        const x1 = agent1.position.x + 45
        const y1 = agent1.position.y + 50
        const x2 = agent2.position.x + 45
        const y2 = agent2.position.y + 50
        
        if (Math.random() > 0.7) {
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
      }
    }
  }

  // Draw pixel agent
  const drawAgent = (ctx: CanvasRenderingContext2D, x: number, y: number, agent: AgentProphet, time: number) => {
    const scale = 2
    
    const walkBob = agent.activity === 'walking' ? Math.sin(time * 12) * 4 : 0
    const walkSway = agent.activity === 'walking' ? Math.sin(time * 12) * 2 : 0
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.beginPath()
    ctx.ellipse(x, y + 28, 12, 5, 0, 0, Math.PI * 2)
    ctx.fill()
    
    const legOffset = agent.activity === 'walking' ? Math.sin(time * 12) * 3 : 0
    ctx.fillStyle = '#2d2d2d'
    ctx.fillRect(x - 6 + legOffset, y + 20 + walkBob, 5, 10)
    ctx.fillRect(x + 1 - legOffset, y + 20 + walkBob, 5, 10)
    
    ctx.fillStyle = agent.color
    ctx.fillRect(x - 8 + walkSway, y + 8 + walkBob, 16, 14)
    
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.fillRect(x - 6 + walkSway, y + 10 + walkBob, 12, 4)
    
    if (agent.activity === 'walking') {
      const armSwing = Math.sin(time * 12) * 4
      ctx.fillRect(x - 12 + walkSway, y + 10 + armSwing + walkBob, 4, 10)
      ctx.fillRect(x + 8 + walkSway, y + 10 - armSwing + walkBob, 4, 10)
    } else {
      ctx.fillRect(x - 12 + walkSway, y + 16 + walkBob, 4, 10)
      ctx.fillRect(x + 8 + walkSway, y + 16 + walkBob, 4, 10)
    }
    
    ctx.fillStyle = '#ffdbac'
    ctx.fillRect(x - 8 + walkSway, y - 8 + walkBob, 16, 16)
    
    ctx.fillStyle = agent.color
    ctx.fillRect(x - 8 + walkSway, y - 8 + walkBob, 16, 5)
    
    const blink = Math.sin(time * 3) > 0.9
    if (blink) {
      ctx.fillStyle = '#000'
      ctx.fillRect(x - 5 + walkSway, y - 2 + walkBob, 4, 2)
      ctx.fillRect(x + 1 + walkSway, y - 2 + walkBob, 4, 2)
    } else {
      ctx.fillStyle = '#000'
      ctx.fillRect(x - 5 + walkSway, y - 3 + walkBob, 3, 3)
      ctx.fillRect(x + 2 + walkSway, y - 3 + walkBob, 3, 3)
    }
    
    ctx.fillStyle = '#d4889e'
    ctx.fillRect(x - 3 + walkSway, y + 3 + walkBob, 6, 2)
    
    if (agent.status === 'busy') {
      const pulse = Math.sin(time * 5) * 0.3 + 0.7
      ctx.strokeStyle = `rgba(34, 197, 94, ${pulse})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x + walkSway, y + walkBob, 22, 0, Math.PI * 2)
      ctx.stroke()
    }
    
    const emojiFloat = Math.sin(time * 4) * 2
    ctx.font = '16px Arial'
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0,0,0,0.3)'
    ctx.shadowBlur = 4
    ctx.fillText(agent.emoji, x + walkSway, y + 48 + emojiFloat + walkBob)
    ctx.shadowBlur = 0
  }

  // Animation Canvas
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

      ctx.fillStyle = '#1a1a2e'
      for (let x = 0; x < canvas.width; x += 40) {
        for (let y = 0; y < canvas.height; y += 40) {
          if ((x + y) % 80 === 0) {
            ctx.fillRect(x, y, 40, 40)
          }
        }
      }

      drawFloor(ctx)
      drawMoveTrails(ctx)
      drawCollaborationLines(ctx)

      PLANT_SPOTS.forEach(spot => drawPlant(ctx, spot.x, spot.y))
      DESKS.forEach(desk => drawDesk(ctx, desk.x, desk.y, desk.w, desk.h))
      drawMeetingTable(ctx, MEETING_TABLE.x, MEETING_TABLE.y, MEETING_TABLE.w, MEETING_TABLE.h)
      drawCoffeeArea(ctx, COFFEE_AREA.x, COFFEE_AREA.y, COFFEE_AREA.w, COFFEE_AREA.h)

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

        drawAgent(ctx, x, y, agent, time)

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

      const busyCount = Object.values(agents).filter(a => a.status === 'busy').length
      const meetingCount = Object.values(agents).filter(a => a.activity === 'meeting').length
      ctx.fillStyle = '#4a4a6a'
      ctx.fillRect(10, 10, 180, 80)
      ctx.font = '12px Arial'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#fff'
      ctx.fillText(`Active: ${busyCount} / ${Object.keys(agents).length}`, 20, 30)
      ctx.fillText(`Meeting: ${meetingCount}`, 20, 50)
      ctx.fillStyle = connectionStatus === 'connected' ? '#22c55e' : '#ef4444'
      ctx.fillText(`● ${connectionStatus === 'connected' ? 'Live' : 'Offline'}`, 20, 70)
      ctx.fillStyle = '#888'
      ctx.textAlign = 'right'
      ctx.fillText(`Update: ${lastUpdate}`, 180, 30)

      animationFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [agents, moveTrails, lastUpdate, connectionStatus])

  return (
    <main className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: '#fff'
    }}>
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link href="/zh/office" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
            EN / 中文
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pixel Office</h1>
            <p className="text-gray-400 mt-1">Watch the AI team work in real-time</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-gray-400">
                {connectionStatus === 'connected' ? 'Live' : 'Offline'}
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
        <h2 className="text-xl font-semibold mb-4">Agent Status</h2>
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
                ${selectedAgent === id ? 'ring-2 ring-primary-500' : ''}
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
                {agent.activity === 'working' ? 'Working' : 
                 agent.activity === 'meeting' ? 'Meeting' : 
                 agent.activity === 'coffee' ? 'On Break' : 'Walking'}
              </div>
              {agent.currentTask && (
                <div className="text-xs text-gray-500 mt-1 truncate">
                  📌 {agent.currentTask}
                </div>
              )}
              {agent.speechBubble && (
                <div className="flex items-center gap-1 text-xs text-primary-400 mt-1">
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
            <span>Working</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span>Walking</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Meeting</span>
          </div>
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4" />
            <span>On Break</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>Chatting</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-12 pt-6 border-t border-white/10 text-center text-xs text-gray-500">
        <div>Real-time data · Updates every 2 seconds</div>
        <div className="mt-2">
          <Link href="/" className="hover:text-white/60 transition-colors">← Back to Home</Link>
          <span className="mx-3">·</span>
          <Link href="/swarm" className="hover:text-white/60 transition-colors">Command Center</Link>
        </div>
      </footer>
    </main>
  )
}
