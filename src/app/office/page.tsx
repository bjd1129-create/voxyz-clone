'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Maximize2, Minimize2, Activity, Coffee, Users, Briefcase, MessageCircle, FileText, Clock, BarChart3, Eye, Zap, Database, TrendingUp, Target, Search, PenTool, Code, Palette, Wrench } from 'lucide-react'
import { supabase, AGENTS_CHANNEL, EVENTS_CHANNEL } from '@/lib/supabase'
import MobileNav from '@/components/MobileNav'
import DesktopNav from '@/components/DesktopNav'
import AgentRPGCard, { AgentRPGStats, AgentColor } from '@/components/AgentRPGCard'

interface AgentData {
  name: string
  emoji: string
  color: string
  status: 'idle' | 'busy' | 'offline'
  currentTask: string | null
  lastActive: string
  position: { x: number; y: number }
  activity: 'working' | 'walking' | 'meeting' | 'coffee'
  // 动画相关
  targetPosition?: { x: number; y: number }
  speechBubble?: string
  speechTimeout?: number
  tasksCompleted?: number
  efficiency?: number
  resources?: { cpu: number; memory: number }
}

interface WorkRecord {
  id: string
  agent: string
  task: string
  startTime: string
  endTime?: string
  status: 'active' | 'completed' | 'failed'
  duration?: number
}

// Office layout - 10 工位
const DESKS = [
  { id: 'zhuge', x: 80, y: 100, w: 90, h: 55 },      // 诸葛灯泡
  { id: 'coordinator', x: 200, y: 100, w: 90, h: 55 }, // 协调员
  { id: 'engineer', x: 320, y: 100, w: 90, h: 55 },    // 工程师
  { id: 'writer', x: 440, y: 100, w: 90, h: 55 },      // 内容官
  { id: 'researcher', x: 560, y: 100, w: 90, h: 55 },  // 研究员
  { id: 'designer', x: 80, y: 250, w: 90, h: 55 },     // 设计师
  { id: 'support', x: 200, y: 250, w: 90, h: 55 },     // 支持专员
  { id: 'desk8', x: 320, y: 250, w: 90, h: 55 },       // 预留
  { id: 'desk9', x: 440, y: 250, w: 90, h: 55 },       // 预留
  { id: 'desk10', x: 560, y: 250, w: 90, h: 55 },      // 预留
]

const MEETING_TABLE = { x: 320, y: 400, w: 150, h: 80 }
const COFFEE_AREA = { x: 580, y: 380, w: 80, h: 60 }

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

// Office Ledger 数据
const TIMESHEETS = [
  { id: '1', agent: 'Developer', task: 'Implementing Command Center UI', date: '2023-05-15', startTime: '10:00', endTime: '12:00', duration: 7200, status: 'completed' },
  { id: '2', agent: 'Researcher', task: 'Competitive analysis: AI agent frameworks', date: '2023-05-15', startTime: '09:30', endTime: '11:30', duration: 7200, status: 'completed' },
  { id: '3', agent: 'Creative', task: 'Creating visual assets for campaign', date: '2023-05-15', startTime: '10:15', endTime: '13:15', duration: 10800, status: 'completed' },
  { id: '4', agent: 'Writer', task: 'Writing blog post about AI trends', date: '2023-05-15', startTime: '09:00', endTime: '11:00', duration: 7200, status: 'completed' },
  { id: '5', agent: 'CEO', task: 'Reviewing Q1 roadmap', date: '2023-05-15', startTime: '08:30', endTime: '10:30', duration: 7200, status: 'completed' },
  { id: '6', agent: 'Support', task: 'Handling customer inquiries', date: '2023-05-15', startTime: '10:00', endTime: '11:00', duration: 3600, status: 'completed' },
  { id: '7', agent: 'Analyst', task: 'Processing market trends', date: '2023-05-15', startTime: '11:00', endTime: '13:00', duration: 7200, status: 'completed' },
  { id: '8', agent: 'Strategist', task: 'Updating strategy document', date: '2023-05-15', startTime: '13:00', endTime: '15:00', duration: 7200, status: 'completed' },
];

const PAY_SLIPS = [
  { id: '1', agent: 'Developer', period: '2023-05-01 to 2023-05-15', amount: 4500, currency: 'USD', status: 'paid', hours: 120 },
  { id: '2', agent: 'Researcher', period: '2023-05-01 to 2023-05-15', amount: 4200, currency: 'USD', status: 'paid', hours: 115 },
  { id: '3', agent: 'Creative', period: '2023-05-01 to 2023-05-15', amount: 4300, currency: 'USD', status: 'paid', hours: 118 },
  { id: '4', agent: 'Writer', period: '2023-05-01 to 2023-05-15', amount: 3800, currency: 'USD', status: 'paid', hours: 105 },
  { id: '5', agent: 'CEO', period: '2023-05-01 to 2023-05-15', amount: 5500, currency: 'USD', status: 'paid', hours: 130 },
  { id: '6', agent: 'Support', period: '2023-05-01 to 2023-05-15', amount: 3600, currency: 'USD', status: 'paid', hours: 100 },
  { id: '7', agent: 'Analyst', period: '2023-05-01 to 2023-05-15', amount: 4100, currency: 'USD', status: 'paid', hours: 112 },
  { id: '8', agent: 'Strategist', period: '2023-05-01 to 2023-05-15', amount: 4400, currency: 'USD', status: 'paid', hours: 122 },
];

const HANDOFF_RECORDS = [
  { id: '1', from: 'Researcher', to: 'Developer', task: 'Handoff competitive analysis results', timestamp: '2023-05-15T10:30:00Z', status: 'completed' },
  { id: '2', from: 'Creative', to: 'Writer', task: 'Share design assets for content', timestamp: '2023-05-15T11:15:00Z', status: 'completed' },
  { id: '3', from: 'Writer', to: 'CEO', task: 'Submit blog draft for review', timestamp: '2023-05-15T12:00:00Z', status: 'completed' },
  { id: '4', from: 'Developer', to: 'Support', task: 'Deploy new UI for testing', timestamp: '2023-05-15T13:30:00Z', status: 'completed' },
  { id: '5', from: 'Analyst', to: 'Strategist', task: 'Provide market data for strategy', timestamp: '2023-05-15T14:00:00Z', status: 'completed' },
  { id: '6', from: 'Support', to: 'Researcher', task: 'Feedback on user inquiries', timestamp: '2023-05-15T15:00:00Z', status: 'completed' },
];

const CULTURE_LOOPS = [
  { id: '1', topic: 'Team Collaboration', participants: ['CEO', 'Developer', 'Creative'], date: '2023-05-15', status: 'completed', feedback: 'Improved communication protocols' },
  { id: '2', topic: 'Innovation Workshop', participants: ['Researcher', 'Writer', 'Analyst'], date: '2023-05-14', status: 'completed', feedback: 'Generated 12 new ideas' },
  { id: '3', topic: 'Performance Review', participants: ['CEO', 'Support', 'Strategist'], date: '2023-05-13', status: 'completed', feedback: 'Identified optimization opportunities' },
  { id: '4', topic: 'Skill Sharing', participants: ['Creative', 'Writer', 'Developer'], date: '2023-05-12', status: 'completed', feedback: 'Cross-training initiative launched' },
];

const GROWTH_WATCH = [
  { id: '1', agent: 'Developer', metric: 'Code Quality Score', current: 8.5, target: 9.0, trend: 'up', improvement: '+0.3 this week' },
  { id: '2', agent: 'Researcher', metric: 'Analysis Accuracy', current: 92, target: 95, trend: 'up', improvement: '+2% this week' },
  { id: '3', agent: 'Creative', metric: 'Design Impact', current: 8.7, target: 9.0, trend: 'stable', improvement: 'Maintained consistency' },
  { id: '4', agent: 'Writer', metric: 'Content Engagement', current: 78, target: 85, trend: 'up', improvement: '+5% this week' },
  { id: '5', agent: 'Support', metric: 'Response Time', current: 2.1, target: 2.0, trend: 'down', improvement: '-0.2 this week' },
  { id: '6', agent: 'Analyst', metric: 'Data Accuracy', current: 96, target: 97, trend: 'up', improvement: '+1% this week' },
];

export default function OfficePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [agents, setAgents] = useState<Record<string, AgentData>>({})
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  const [moveTrails, setMoveTrails] = useState<Record<string, Array<{ x: number; y: number; time: number }>>>({})
  const [activeView, setActiveView] = useState<'office' | 'ledger' | 'stats'>('office')
  const [workRecords, setWorkRecords] = useState<WorkRecord[]>([])
  const [timesheets, setTimesheets] = useState(TIMESHEETS)
  const [paySlips, setPaySlips] = useState(PAY_SLIPS)
  const [handoffs, setHandoffs] = useState(HANDOFF_RECORDS)
  const [cultureLoops, setCultureLoops] = useState(CULTURE_LOOPS)
  const [growthWatch, setGrowthWatch] = useState(GROWTH_WATCH)
  const agentsRef = useRef(agents)
  const trailsRef = useRef(moveTrails)
  const recordsRef = useRef(workRecords)

  // 保持引用最新
  useEffect(() => {
    agentsRef.current = agents
  }, [agents])

  useEffect(() => {
    trailsRef.current = moveTrails
  }, [moveTrails])

  useEffect(() => {
    recordsRef.current = workRecords
  }, [workRecords])

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

  // 获取工作记录
  const fetchWorkRecords = useCallback(async () => {
    try {
      // 模拟获取工作记录
      const mockRecords: WorkRecord[] = [
        { id: '1', agent: 'Developer', task: 'Implementing Command Center UI', startTime: '2023-05-15T10:00:00Z', endTime: '2023-05-15T12:00:00Z', status: 'completed', duration: 7200 },
        { id: '2', agent: 'Researcher', task: 'Competitive analysis: AI agent frameworks', startTime: '2023-05-15T09:30:00Z', endTime: '2023-05-15T11:30:00Z', status: 'completed', duration: 7200 },
        { id: '3', agent: 'Creative', task: 'Creating visual assets for campaign', startTime: '2023-05-15T10:15:00Z', status: 'active', duration: 3600 },
        { id: '4', agent: 'Writer', task: 'Writing blog post about AI trends', startTime: '2023-05-15T09:00:00Z', endTime: '2023-05-15T11:00:00Z', status: 'completed', duration: 7200 },
        { id: '5', agent: 'CEO', task: 'Reviewing Q1 roadmap', startTime: '2023-05-15T08:30:00Z', status: 'active', duration: 5400 },
      ]
      setWorkRecords(mockRecords)
      setTimesheets(TIMESHEETS)
      setPaySlips(PAY_SLIPS)
      setHandoffs(HANDOFF_RECORDS)
      setCultureLoops(CULTURE_LOOPS)
      setGrowthWatch(GROWTH_WATCH)
    } catch (error) {
      console.error('Failed to fetch work records:', error)
    }
  }, [])

  // 设置 Realtime 订阅
  useEffect(() => {
    fetchAgents()
    fetchWorkRecords()

    // 订阅 agents 表变更
    const agentsChannel = supabase
      .channel(AGENTS_CHANNEL)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agents',
        },
        (payload) => {
          console.log('Agent update:', payload)
          const newRecord = payload.new as AgentData | undefined
          const oldRecord = payload.old as AgentData | undefined
          
          if (payload.eventType === 'DELETE' && oldRecord) {
            setAgents(prev => {
              const next = { ...prev }
              delete next[oldRecord.name.toLowerCase()]
              return next
            })
          } else if (newRecord) {
            const agent = newRecord
            setAgents(prev => ({
              ...prev,
              [agent.name.toLowerCase()]: {
                ...agent,
                activity: agent.status === 'busy' ? 'working' : agent.status === 'idle' ? 'coffee' : 'walking',
                tasksCompleted: agent.tasksCompleted || 0,
                efficiency: agent.efficiency || 80,
                resources: agent.resources || { cpu: 50, memory: 50 },
              },
            }))
          }
          setLastUpdate(new Date().toLocaleTimeString())

          // 触发对话气泡
          if (payload.eventType === 'UPDATE' && newRecord?.status === 'busy') {
            triggerSpeechBubble(newRecord.name.toLowerCase())
          }
        }
      )
      .subscribe((status) => {
        console.log('Agents channel status:', status)
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 'disconnected')
      })

    // 订阅 events 表变更
    const eventsChannel = supabase
      .channel(EVENTS_CHANNEL)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'events',
        },
        (payload) => {
          console.log('New event:', payload)
          // 可以在这里处理新事件，如触发 Agent 移动
          const newEvent = payload.new as { agent_id?: string } | undefined
          if (newEvent?.agent_id) {
            // 添加移动轨迹
            addMoveTrail(newEvent.agent_id)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(agentsChannel)
      supabase.removeChannel(eventsChannel)
    }
  }, [fetchAgents, fetchWorkRecords])

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

    // 3秒后清除气泡
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

  // 添加移动轨迹
  const addMoveTrail = useCallback((agentId: string) => {
    const agent = agentsRef.current[agentId]
    if (!agent) return

    const desk = DESKS.find(d => d.id === agentId)
    if (!desk) return

    // 随机移动目标
    const targets = [
      { x: desk.x + desk.w / 2, y: desk.y + desk.h + 25 }, // 工位
      { x: COFFEE_AREA.x + COFFEE_AREA.w / 2, y: COFFEE_AREA.y - 15 }, // 咖啡
      { x: MEETING_TABLE.x + MEETING_TABLE.w / 2, y: MEETING_TABLE.y + MEETING_TABLE.h / 2 }, // 会议
    ]
    const target = targets[Math.floor(Math.random() * targets.length)]

    // 生成轨迹点
    const steps = 20
    const trail: Array<{ x: number; y: number; time: number }> = []
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps
      trail.push({
        x: agent.position.x + (target.x - agent.position.x) * progress,
        y: agent.position.y + (target.y - agent.position.y) * progress,
        time: Date.now() + i * 100,
      })
    }

    setMoveTrails(prev => ({
      ...prev,
      [agentId]: trail,
    }))

    // 更新 Agent 位置
    setAgents(prev => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        position: target,
        activity: 'walking',
      },
    }))

    // 5秒后清除轨迹
    setTimeout(() => {
      setMoveTrails(prev => {
        const next = { ...prev }
        delete next[agentId]
        return next
      })
    }, 5000)
  }, [])

  // 定期随机触发气泡和移动
  useEffect(() => {
    const interval = setInterval(() => {
      const agentIds = Object.keys(agentsRef.current)
      if (agentIds.length === 0) return

      // 随机选择一个 Agent
      const randomAgent = agentIds[Math.floor(Math.random() * agentIds.length)]
      const agent = agentsRef.current[randomAgent]

      if (agent.status === 'busy') {
        // 30% 几率显示气泡
        if (Math.random() < 0.3) {
          triggerSpeechBubble(randomAgent)
        }
      }

      // 10% 几率移动
      if (Math.random() < 0.1) {
        addMoveTrail(randomAgent)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [triggerSpeechBubble, addMoveTrail])

  // 动画 Canvas
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

      // Draw move trails
      Object.entries(moveTrails).forEach(([agentId, trail]) => {
        if (trail.length < 2) return

        const agent = agents[agentId]
        if (!agent) return

        ctx.beginPath()
        ctx.strokeStyle = agent.color + '60'
        ctx.lineWidth = 3
        ctx.lineCap = 'round'

        const now = Date.now()
        trail.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y)
          } else {
            // 淡出效果
            const age = now - point.time
            const alpha = Math.max(0, 1 - age / 5000)
            ctx.strokeStyle = agent.color + Math.floor(alpha * 96).toString(16).padStart(2, '0')
            ctx.lineTo(point.x, point.y)
          }
        })
        ctx.stroke()

        // 轨迹粒子
        trail.forEach((point, i) => {
          if (i % 3 !== 0) return
          const age = now - point.time
          if (age > 3000) return
          const alpha = 1 - age / 3000
          const size = 3 * alpha
          ctx.fillStyle = agent.color + Math.floor(alpha * 255).toString(16).padStart(2, '0')
          ctx.beginPath()
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2)
          ctx.fill()
        })
      })

      // Draw agents
      ctx.font = '32px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // 检查是否有多个 Agent 在开会
      const meetingAgents = Object.entries(agents).filter(([_, a]) => a.activity === 'meeting')

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
          // 会议围坐布局
          const meetingIndex = meetingAgents.findIndex(([aid]) => aid === id)
          const angle = (meetingIndex / meetingAgents.length) * Math.PI * 2 - Math.PI / 2
          const radius = 60
          x = MEETING_TABLE.x + MEETING_TABLE.w / 2 + Math.cos(angle) * radius
          y = MEETING_TABLE.y + MEETING_TABLE.h / 2 + Math.sin(angle) * radius * 0.5
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

        // Speech bubble
        if (agent.speechBubble) {
          const bubbleWidth = Math.max(80, ctx.measureText(agent.speechBubble).width + 20)
          const bubbleHeight = 28
          const bubbleX = x - bubbleWidth / 2
          const bubbleY = y - 65

          // Bubble background
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
          ctx.beginPath()
          ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 8)
          ctx.fill()

          // Bubble tail
          ctx.beginPath()
          ctx.moveTo(x - 8, bubbleY + bubbleHeight)
          ctx.lineTo(x, bubbleY + bubbleHeight + 10)
          ctx.lineTo(x + 8, bubbleY + bubbleHeight)
          ctx.fill()

          // Bubble text
          ctx.fillStyle = '#1a1a2e'
          ctx.font = '14px Arial'
          ctx.fillText(agent.speechBubble, x, bubbleY + 18)
        }

        // Task indicator (when not showing speech bubble)
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

      // 会议协作动画 - 显示连线
      if (meetingAgents.length >= 2) {
        ctx.strokeStyle = 'rgba(147, 51, 234, 0.3)'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])

        for (let i = 0; i < meetingAgents.length; i++) {
          for (let j = i + 1; j < meetingAgents.length; j++) {
            const [id1, a1] = meetingAgents[i]
            const [id2, a2] = meetingAgents[j]

            const desk1 = DESKS.find(d => d.id === id1)
            const desk2 = DESKS.find(d => d.id === id2)
            if (!desk1 || !desk2) continue

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

        // 显示会议图标
        ctx.font = '20px Arial'
        ctx.fillText('💡', MEETING_TABLE.x + MEETING_TABLE.w / 2, MEETING_TABLE.y - 20)
      }

      // Stats overlay
      const busyCount = Object.values(agents).filter(a => a.status === 'busy').length
      const meetingCount = Object.values(agents).filter(a => a.activity === 'meeting').length
      ctx.fillStyle = '#4a4a6a'
      ctx.fillRect(10, 10, 180, 100)
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

      // Performance indicators
      Object.entries(agents).forEach(([id, agent], index) => {
        if (agent.status === 'busy') {
          const desk = DESKS.find(d => d.id === id)
          if (desk) {
            const x = desk.x + desk.w / 2
            const y = desk.y + desk.h + 50
            
            // CPU usage indicator
            ctx.fillStyle = '#3b82f6'
            ctx.fillRect(x - 15, y, 30, 5)
            ctx.fillStyle = '#1e40af'
            ctx.fillRect(x - 15, y, 30 * (agent.resources?.cpu || 50) / 100, 5)
            
            // Memory usage indicator
            ctx.fillStyle = '#8b5cf6'
            ctx.fillRect(x - 15, y + 7, 30, 3)
            ctx.fillStyle = '#7c3aed'
            ctx.fillRect(x - 15, y + 7, 30 * (agent.resources?.memory || 50) / 100, 3)
          }
        }
      })

      animationFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [agents, moveTrails, lastUpdate, connectionStatus])

  // Format duration in seconds to HH:MM:SS
  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return [h, m, s]
      .map(v => v.toString().padStart(2, '0'))
      .join(':')
  }

  return (
    <main className="min-h-screen">
      {/* Mobile Navigation */}
      <MobileNav langToggleHref="/zh/office" />
      
      {/* Desktop Navigation */}
      <DesktopNav langToggleHref="/zh/office" />

      {/* Header - Hidden on mobile (handled by MobileNav) */}
      <header className="hidden md:block max-w-7xl mx-auto px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
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
            <h1 className="text-3xl lg:text-5xl font-bold">Pixel Office</h1>
            <p className="text-gray-400 mt-2 text-lg lg:text-xl">实时观察 AI 团队工作状态</p>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-2 text-base lg:text-lg">
              <span className={`w-3 h-3 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-gray-400">
                {connectionStatus === 'connected' ? 'WebSocket 实时' : '离线模式'}
              </span>
            </div>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Header - Title only */}
      <div className="md:hidden p-3 mb-4">
        <h1 className="text-xl font-bold text-center">Pixel Office</h1>
        <div className="flex items-center justify-center gap-2 mt-1 text-xs">
          <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-gray-400">
            {connectionStatus === 'connected' ? '实时连接' : '离线'}
          </span>
        </div>
      </div>

      {/* View Tabs */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-6">
        <div className="flex border-b border-white/10">
          <button
            className={`px-6 py-3 font-medium text-base ${
              activeView === 'office'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveView('office')}
          >
            <Eye className="w-5 h-5 inline mr-2" />
            办公室
          </button>
          <button
            className={`px-6 py-3 font-medium text-base ${
              activeView === 'ledger'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveView('ledger')}
          >
            <FileText className="w-5 h-5 inline mr-2" />
            记录
          </button>
          <button
            className={`px-6 py-3 font-medium text-base ${
              activeView === 'stats'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveView('stats')}
          >
            <BarChart3 className="w-5 h-5 inline mr-2" />
            统计
          </button>
        </div>
      </div>

      {/* Office View */}
      {activeView === 'office' && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
          <div className={`
            bg-[#0f0f1a] rounded-xl border border-white/10 overflow-hidden
            ${isFullscreen ? 'fixed inset-4 z-50' : ''}
          `}>
            <canvas
              ref={canvasRef}
              width={1400}
              height={900}
              className="w-full h-auto max-h-[75vh] lg:max-h-[85vh] object-contain"
            />
          </div>
          
          {/* Mobile touch instructions */}
          <p className="text-xs text-gray-500 text-center mt-2 md:hidden">
            👆 点击 Agent 卡片查看详情
          </p>
        </section>
      )}

      {/* Office Ledger View */}
      {activeView === 'ledger' && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-8 lg:mb-12">
          <div className="bg-white/5 rounded-xl border border-white/10 p-6 lg:p-8">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-6 lg:mb-8">Office Ledger</h2>
            
            {/* Timesheets Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Timesheets
                </h3>
                <button className="px-3 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-500/30 transition-colors">
                  导出
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-sm">
                      <th className="pb-3">智能体</th>
                      <th className="pb-3">任务</th>
                      <th className="pb-3">日期</th>
                      <th className="pb-3">开始时间</th>
                      <th className="pb-3">结束时间</th>
                      <th className="pb-3">时长</th>
                      <th className="pb-3">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timesheets.map(timesheet => (
                      <tr key={timesheet.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3">{timesheet.agent}</td>
                        <td className="py-3">{timesheet.task}</td>
                        <td className="py-3">{timesheet.date}</td>
                        <td className="py-3">{timesheet.startTime}</td>
                        <td className="py-3">{timesheet.endTime}</td>
                        <td className="py-3">{formatDuration(timesheet.duration)}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            timesheet.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            timesheet.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {timesheet.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Daily Pay Slips Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-green-400" />
                  Daily Pay Slips
                </h3>
                <button className="px-3 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-500/30 transition-colors">
                  发放
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-sm">
                      <th className="pb-3">智能体</th>
                      <th className="pb-3">期间</th>
                      <th className="pb-3">金额</th>
                      <th className="pb-3">货币</th>
                      <th className="pb-3">工时</th>
                      <th className="pb-3">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paySlips.map(paySlip => (
                      <tr key={paySlip.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3">{paySlip.agent}</td>
                        <td className="py-3">{paySlip.period}</td>
                        <td className="py-3">${paySlip.amount.toLocaleString()}</td>
                        <td className="py-3">{paySlip.currency}</td>
                        <td className="py-3">{paySlip.hours} 小时</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            paySlip.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                            paySlip.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {paySlip.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Handoffs Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-purple-400" />
                  Handoffs
                </h3>
                <button className="px-3 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-500/30 transition-colors">
                  记录
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-sm">
                      <th className="pb-3">发送方</th>
                      <th className="pb-3">接收方</th>
                      <th className="pb-3">任务</th>
                      <th className="pb-3">时间戳</th>
                      <th className="pb-3">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {handoffs.map(handoff => (
                      <tr key={handoff.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3">{handoff.from}</td>
                        <td className="py-3">{handoff.to}</td>
                        <td className="py-3">{handoff.task}</td>
                        <td className="py-3">{new Date(handoff.timestamp).toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            handoff.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            handoff.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {handoff.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Culture Loops Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  Culture Loops
                </h3>
                <button className="px-3 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-500/30 transition-colors">
                  新建
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-sm">
                      <th className="pb-3">主题</th>
                      <th className="pb-3">参与者</th>
                      <th className="pb-3">日期</th>
                      <th className="pb-3">状态</th>
                      <th className="pb-3">反馈</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cultureLoops.map(loop => (
                      <tr key={loop.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3">{loop.topic}</td>
                        <td className="py-3">{loop.participants.join(', ')}</td>
                        <td className="py-3">{loop.date}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            loop.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            loop.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {loop.status}
                          </span>
                        </td>
                        <td className="py-3">{loop.feedback}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Growth Watch Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-400" />
                  Growth Watch
                </h3>
                <button className="px-3 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-500/30 transition-colors">
                  更新
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {growthWatch.map(watch => (
                  <div key={watch.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{watch.agent}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        watch.trend === 'up' ? 'bg-green-500/20 text-green-400' :
                        watch.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {watch.trend}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">{watch.metric}</div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">当前: {watch.current}</span>
                      <span className="text-sm">目标: {watch.target}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mb-1">
                      <div
                        className={`h-2 rounded-full ${
                          watch.current >= watch.target ? 'bg-green-500' : 
                          (watch.current / watch.target) > 0.8 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, (watch.current / watch.target) * 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">{watch.improvement}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats View */}
      {activeView === 'stats' && (
        <section className="max-w-6xl lg:max-w-7xl mx-auto mb-8 lg:mb-12">
          {/* RPG Stats Grid */}
          <div className="mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 text-purple-400" />
              Agent RPG Stats
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {/* 诸葛灯泡 - Zhuge */}
              <AgentRPGCard
                name="诸葛灯泡"
                codeName="Zhuge"
                role="管理员&进化官"
                color="coordinator"
                icon={<Target className="w-5 h-5 sm:w-6 sm:h-6" />}
                stats={{
                  vrl: 85,
                  tru: 95,
                  wis: 90,
                  level: 30,
                  experience: 35000,
                  tasksCompleted: agents['zhuge']?.tasksCompleted || 180,
                }}
              />
              
              {/* 协调员 - Minion */}
              <AgentRPGCard
                name="协调员"
                codeName="Minion"
                role="任务分配"
                color="coordinator"
                icon={<Target className="w-5 h-5 sm:w-6 sm:h-6" />}
                stats={{
                  vrl: 75,
                  tru: 92,
                  wis: 85,
                  level: 24,
                  experience: 24500,
                  tasksCompleted: agents['coordinator']?.tasksCompleted || 156,
                }}
              />
              
              {/* 研究员 - Scout */}
              <AgentRPGCard
                name="研究员"
                codeName="Scout"
                role="研究分析"
                color="researcher"
                icon={<Search className="w-5 h-5 sm:w-6 sm:h-6" />}
                stats={{
                  vrl: 60,
                  tru: 88,
                  wis: 95,
                  level: 22,
                  experience: 21200,
                  tasksCompleted: agents['researcher']?.tasksCompleted || 89,
                }}
              />
              
              {/* 文案 - Quill */}
              <AgentRPGCard
                name="文案"
                codeName="Quill"
                role="内容创作"
                color="writer"
                icon={<PenTool className="w-5 h-5 sm:w-6 sm:h-6" />}
                stats={{
                  vrl: 95,
                  tru: 85,
                  wis: 78,
                  level: 19,
                  experience: 17800,
                  tasksCompleted: agents['writer']?.tasksCompleted || 234,
                }}
              />
              
              {/* 工程师 - Sage */}
              <AgentRPGCard
                name="工程师"
                codeName="Sage"
                role="技术开发"
                color="engineer"
                icon={<Code className="w-5 h-5 sm:w-6 sm:h-6" />}
                stats={{
                  vrl: 55,
                  tru: 96,
                  wis: 90,
                  level: 28,
                  experience: 32000,
                  tasksCompleted: agents['engineer']?.tasksCompleted || 178,
                }}
              />
              
              {/* 设计师 - Xalt */}
              <AgentRPGCard
                name="设计师"
                codeName="Xalt"
                role="视觉设计"
                color="designer"
                icon={<Palette className="w-5 h-5 sm:w-6 sm:h-6" />}
                stats={{
                  vrl: 88,
                  tru: 82,
                  wis: 75,
                  level: 21,
                  experience: 19600,
                  tasksCompleted: agents['designer']?.tasksCompleted || 112,
                }}
              />
              
              {/* 支持专员 - Observer */}
              <AgentRPGCard
                name="支持专员"
                codeName="Observer"
                role="用户支持"
                color="support"
                icon={<Wrench className="w-5 h-5 sm:w-6 sm:h-6" />}
                stats={{
                  vrl: 70,
                  tru: 94,
                  wis: 82,
                  level: 17,
                  experience: 14800,
                  tasksCompleted: agents['support']?.tasksCompleted || 312,
                }}
              />
            </div>
          </div>
          
          {/* Team Overview Stats */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl lg:text-2xl font-semibold mb-6 lg:mb-8">团队概览</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-6 h-6 text-green-400" />
                  <h3 className="font-medium">工作负载</h3>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {Object.values(agents).filter(a => a.status === 'busy').length}/{Object.keys(agents).length}
                </div>
                <div className="text-sm text-gray-400">智能体正在工作</div>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="w-6 h-6 text-blue-400" />
                  <h3 className="font-medium">任务完成</h3>
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  {workRecords.filter(r => r.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-400">今日完成任务</div>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-6 h-6 text-purple-400" />
                  <h3 className="font-medium">总工时</h3>
                </div>
                <div className="text-2xl font-bold text-purple-400">
                  {formatDuration(workRecords.reduce((sum, r) => sum + (r.duration || 0), 0))}
                </div>
                <div className="text-sm text-gray-400">累计工作时长</div>
              </div>
            </div>
            
            {/* Attribute Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg border border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-lg">🔥</span>
                <div>
                  <div className="font-medium text-sm">VRL - Viral Score</div>
                  <div className="text-xs text-gray-400">互动影响力，基于互动率计算</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">🛡️</span>
                <div>
                  <div className="font-medium text-sm">TRU - Trust Score</div>
                  <div className="text-xs text-gray-400">任务成功率和可靠度指标</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">💡</span>
                <div>
                  <div className="font-medium text-sm">WIS - Wisdom Score</div>
                  <div className="text-xs text-gray-400">知识积累，基于记忆数量和置信度</div>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mb-4">智能体效率</h3>
            <div className="space-y-4">
              {Object.entries(agents).map(([id, agent]) => (
                <div key={id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{agent.emoji}</span>
                      <span className="font-medium">{agent.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      agent.status === 'busy' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>效率</span>
                        <span>{agent.efficiency || 0}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            (agent.efficiency || 0) > 80 ? 'bg-green-500' : 
                            (agent.efficiency || 0) > 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${agent.efficiency || 0}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>CPU 使用率</span>
                        <span>{agent.resources?.cpu}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            (agent.resources?.cpu || 0) > 80 ? 'bg-red-500' : 
                            (agent.resources?.cpu || 0) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${agent.resources?.cpu}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>内存使用率</span>
                        <span>{agent.resources?.memory}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            (agent.resources?.memory || 0) > 80 ? 'bg-red-500' : 
                            (agent.resources?.memory || 0) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${agent.resources?.memory}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {agent.currentTask && (
                    <div className="mt-3 text-sm bg-white/5 rounded-lg p-2">
                      📌 {agent.currentTask}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Agent List - Enhanced Cards */}
      <section className="max-w-6xl lg:max-w-7xl mx-auto">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">Agent 状态</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
          {Object.entries(agents).map(([id, agent]) => (
            <button
              key={id}
              onClick={() => {
                setSelectedAgent(selectedAgent === id ? null : id)
                triggerSpeechBubble(id)
              }}
              className={`
                p-3 sm:p-4 rounded-xl border transition-all text-left
                ${agent.status === 'busy'
                  ? 'bg-white/10 border-white/30'
                  : 'bg-white/5 border-white/10 hover:border-white/30'}
                ${selectedAgent === id ? 'ring-2 ring-purple-500' : ''}
              `}
            >
              <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <span className="text-xl sm:text-2xl">{agent.emoji}</span>
                <div className="flex-1">
                  <span className={`w-2 h-2 rounded-full float-right ${
                    agent.status === 'busy' ? 'bg-green-500 animate-pulse' : 
                    agent.status === 'idle' ? 'bg-gray-500' : 'bg-red-500'
                  }`} />
                </div>
              </div>
              <div className="font-medium text-xs sm:text-sm">{agent.name}</div>
              <div className="text-xs text-gray-400 capitalize">{agent.activity}</div>
              
              {/* Enhanced status indicators */}
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">效率</span>
                  <span className="text-white">{agent.efficiency}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full ${
                      agent.efficiency! > 80 ? 'bg-green-500' : 
                      agent.efficiency! > 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${agent.efficiency}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-500">CPU</span>
                  <span className="text-white">{agent.resources?.cpu}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full ${
                      (agent.resources?.cpu || 0) > 80 ? 'bg-red-500' : 
                      (agent.resources?.cpu || 0) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${agent.resources?.cpu}%` }}
                  />
                </div>
              </div>
              
              {agent.currentTask && (
                <div className="text-xs text-gray-500 mt-2 truncate">
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
      <section className="max-w-6xl lg:max-w-7xl mx-auto mt-8">
        <div className="flex flex-wrap gap-6 lg:gap-8 text-sm lg:text-base text-gray-400">
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
      <section className="max-w-6xl lg:max-w-7xl mx-auto mt-8 p-4 sm:p-6 lg:p-8 bg-white/5 rounded-lg border border-white/10">
        <h3 className="font-semibold mb-2 text-lg lg:text-xl">🚀 实时特性</h3>
        <ul className="text-sm lg:text-base text-gray-400 space-y-1">
          <li>✅ WebSocket 实时推送 - 无需轮询，状态即时同步</li>
          <li>✅ Agent 对话气泡 - 随机显示工作状态对话</li>
          <li>✅ 移动轨迹动画 - Agent 移动时显示轨迹</li>
          <li>✅ 协作会议动画 - 多 Agent 开会时显示连线</li>
          <li>✅ 资源监控 - 实时显示 CPU/内存使用情况</li>
          <li>✅ 工作记录 - 跟踪任务完成情况</li>
        </ul>
      </section>
    </main>
  )
}