'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Maximize2, Minimize2, Activity, Coffee, Users, Briefcase, MessageCircle, FileText, Clock, BarChart3, Eye, Zap, Database, TrendingUp, Target, Search, PenTool, Code, Palette, Wrench } from 'lucide-react'
import { supabase, AGENTS_CHANNEL, EVENTS_CHANNEL } from '@/lib/supabase'
import MobileNav from '@/components/MobileNav'
import DesktopNav from '@/components/DesktopNav'
import AgentRPGCard, { AgentRPGStats, AgentColor } from '@/components/AgentRPGCard'

interface AgentProphet {
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
  status: 'active' | 'completed' | 'failed' | 'pending'
  duration?: number
}

// Office layout - 7 workstations for our team
const DESKS = [
  { id: 'zhuge', x: 80, y: 100, w: 90, h: 55 },      // 诸葛灯泡
  { id: 'coordinator', x: 200, y: 100, w: 90, h: 55 }, // 掌舵人
  { id: 'engineer', x: 320, y: 100, w: 90, h: 55 },    // 代码侠
  { id: 'writer', x: 440, y: 100, w: 90, h: 55 },      // 文案君
  { id: 'researcher', x: 560, y: 100, w: 90, h: 55 },  // 洞察者
  { id: 'designer', x: 80, y: 250, w: 90, h: 55 },     // 配色师
  { id: 'support', x: 200, y: 250, w: 90, h: 55 },     // 守护者
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

// We'll fetch these from Supabase instead of using mock data
// const TIMESHEETS = [
//   { id: '1', agent: '代码侠', task: '实现指挥中心界面', date: '2024-03-26', startTime: '10:00', endTime: '12:00', duration: 7200, status: 'completed' },
//   { id: '2', agent: '洞察者', task: '竞争分析：AI Agent 框架', date: '2024-03-26', startTime: '09:30', endTime: '11:30', duration: 7200, status: 'completed' },
//   { id: '3', agent: '配色师', task: '为活动创建视觉素材', date: '2024-03-26', startTime: '10:15', endTime: '13:15', duration: 10800, status: 'completed' },
//   { id: '4', agent: '文案君', task: '撰写关于AI趋势的博客文章', date: '2024-03-26', startTime: '09:00', endTime: '11:00', duration: 7200, status: 'completed' },
//   { id: '5', agent: '诸葛灯泡', task: '审核Q1路线图', date: '2024-03-26', startTime: '08:30', endTime: '10:30', duration: 7200, status: 'completed' },
//   { id: '6', agent: '守护者', task: '处理客户咨询', date: '2024-03-26', startTime: '10:00', endTime: '11:00', duration: 3600, status: 'completed' },
//   { id: '7', agent: '洞察者', task: '处理市场趋势', date: '2024-03-26', startTime: '11:00', endTime: '13:00', duration: 7200, status: 'completed' },
//   { id: '8', agent: '掌舵人', task: '更新策略文档', date: '2024-03-26', startTime: '13:00', endTime: '15:00', duration: 7200, status: 'completed' },
// ];

// const PAY_SLIPS = [
//   { id: '1', agent: '代码侠', period: '2024-03-01 to 2024-03-31', amount: 4500, currency: 'USD', status: 'paid', hours: 120 },
//   { id: '2', agent: '洞察者', period: '2024-03-01 to 2024-03-31', amount: 4200, currency: 'USD', status: 'paid', hours: 115 },
//   { id: '3', agent: '配色师', period: '2024-03-01 to 2024-03-31', amount: 4300, currency: 'USD', status: 'paid', hours: 118 },
//   { id: '4', agent: '文案君', period: '2024-03-01 to 2024-03-31', amount: 3800, currency: 'USD', status: 'paid', hours: 105 },
//   { id: '5', agent: '诸葛灯泡', period: '2024-03-01 to 2024-03-31', amount: 5500, currency: 'USD', status: 'paid', hours: 130 },
//   { id: '6', agent: '守护者', period: '2024-03-01 to 2024-03-31', amount: 3600, currency: 'USD', status: 'paid', hours: 100 },
//   { id: '7', agent: '掌舵人', period: '2024-03-01 to 2024-03-31', amount: 4100, currency: 'USD', status: 'paid', hours: 112 },
// ];

// const HANDOFF_RECORDS = [
//   { id: '1', from: '洞察者', to: '代码侠', task: '交接竞争分析结果', timestamp: '2024-03-26T10:30:00Z', status: 'completed' },
//   { id: '2', from: '配色师', to: '文案君', task: '共享用于内容的设计素材', timestamp: '2024-03-26T11:15:00Z', status: 'completed' },
//   { id: '3', from: '文案君', to: '诸葛灯泡', task: '提交博客草稿供审核', timestamp: '2024-03-26T12:00:00Z', status: 'completed' },
//   { id: '4', from: '代码侠', to: '守护者', task: '部署新UI供测试', timestamp: '2024-03-26T13:30:00Z', status: 'completed' },
//   { id: '5', from: '洞察者', to: '掌舵人', task: '提供市场数据供策略制定', timestamp: '2024-03-26T14:00:00Z', status: 'completed' },
//   { id: '6', from: '守护者', to: '洞察者', task: '关于用户查询的反馈', timestamp: '2024-03-26T15:00:00Z', status: 'completed' },
// ];

// const CULTURE_LOOPS = [
//   { id: '1', topic: '团队协作', participants: ['诸葛灯泡', '代码侠', '配色师'], date: '2024-03-26', status: 'completed', feedback: '改进沟通协议' },
//   { id: '2', topic: '创新研讨会', participants: ['洞察者', '文案君', '掌舵人'], date: '2024-03-25', status: 'completed', feedback: '产生12个新想法' },
//   { id: '3', topic: '绩效评审', participants: ['诸葛灯泡', '守护者', '掌舵人'], date: '2024-03-24', status: 'completed', feedback: '确定优化机会' },
//   { id: '4', topic: '技能分享', participants: ['配色师', '文案君', '代码侠'], date: '2024-03-23', status: 'completed', feedback: '启动交叉培训计划' },
// ];

// const GROWTH_WATCH = [
//   { id: '1', agent: '代码侠', metric: '代码质量评分', current: 8.5, target: 9.0, trend: 'up', improvement: '本周+0.3' },
//   { id: '2', agent: '洞察者', metric: '分析准确性', current: 92, target: 95, trend: 'up', improvement: '本周+2%' },
//   { id: '3', agent: '配色师', metric: '设计影响力', current: 8.7, target: 9.0, trend: 'stable', improvement: '保持一致性' },
//   { id: '4', agent: '文案君', metric: '内容参与度', current: 78, target: 85, trend: 'up', improvement: '本周+5%' },
//   { id: '5', agent: '守护者', metric: '响应时间', current: 2.1, target: 2.0, trend: 'down', improvement: '本周-0.2' },
//   { id: '6', agent: '掌舵人', metric: '数据准确性', current: 96, target: 97, trend: 'up', improvement: '本周+1%' },
// ];

// Agent列表
const AGENT_LIST = [
  { id: 'zhuge', name: '诸葛灯泡', emoji: '💡', color: '#8B5CF6', role: '造梦者' },
  { id: 'coordinator', name: '掌舵人', emoji: '⛵', color: '#EC4899', role: '任务分配' },
  { id: 'engineer', name: '代码侠', emoji: '💻', color: '#3B82F6', role: '技术开发' },
  { id: 'writer', name: '文案君', emoji: '✍️', color: '#10B981', role: '内容创作' },
  { id: 'researcher', name: '洞察者', emoji: '🔍', color: '#F59E0B', role: '研究分析' },
  { id: 'designer', name: '配色师', emoji: '🎨', color: '#EF4444', role: '视觉设计' },
  { id: 'support', name: '守护者', emoji: '🛡️', color: '#6366F1', role: '用户支持' },
];

// 添加拖拽和缩放状态
interface DragState {
  isDragging: boolean;
  dragStart: { x: number; y: number };
  offset: { x: number; y: number };
  initialOffset: { x: number; y: number };
}

interface ZoomState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export default function OfficePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [agents, setAgents] = useState<Record<string, AgentProphet>>({})
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  const [moveTrails, setMoveTrails] = useState<Record<string, Array<{ x: number; y: number; time: number }>>>({})
  const [activeView, setActiveView] = useState<'office' | 'ledger' | 'stats'>('office')
  const [workRecords, setWorkRecords] = useState<WorkRecord[]>([])
  const [timesheets, setTimesheets] = useState<any[]>([])
  const [paySlips, setPaySlips] = useState<any[]>([])
  const [handoffs, setHandoffs] = useState<any[]>([])
  const [cultureLoops, setCultureLoops] = useState<any[]>([])
  const [growthWatch, setGrowthWatch] = useState<any[]>([])
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('all') // For filtering by agent
  
  // 添加拖拽和缩放状态
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    initialOffset: { x: 0, y: 0 }
  });
  const [zoomState, setZoomState] = useState<ZoomState>({
    scale: 1,
    offsetX: 0,
    offsetY: 0
  });
  
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

  // 处理拖拽功能
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return; // 只处理左键点击
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 检查是否点击了某个Agent
    let clickedAgent = false;
    Object.entries(agents).forEach(([id, agent]) => {
      const desk = DESKS.find(d => d.id === id);
      if (!desk) return;

      // Calculate position based on activity
      let agentX = desk.x + desk.w / 2;
      let agentY = desk.y + desk.h + 25;

      if (agent.activity === 'coffee') {
        agentX = COFFEE_AREA.x + COFFEE_AREA.w / 2;
        agentY = COFFEE_AREA.y - 15;
      } else if (agent.activity === 'meeting') {
        const meetingAgents = Object.entries(agents).filter(([_, a]) => a.activity === 'meeting');
        const meetingIndex = meetingAgents.findIndex(([aid]) => aid === id);
        const angle = (meetingIndex / meetingAgents.length) * Math.PI * 2 - Math.PI / 2;
        const radius = 60;
        agentX = MEETING_TABLE.x + MEETING_TABLE.w / 2 + Math.cos(angle) * radius;
        agentY = MEETING_TABLE.y + MEETING_TABLE.h / 2 + Math.sin(angle) * radius * 0.5;
      }

      // Apply zoom and pan transformations to agent position
      const transformedX = agentX * zoomState.scale + zoomState.offsetX;
      const transformedY = agentY * zoomState.scale + zoomState.offsetY;

      // Check if click is near agent considering current zoom
      const distance = Math.sqrt(Math.pow(x - transformedX, 2) + Math.pow(y - transformedY, 2));
      const clickRadius = 25 / zoomState.scale; // Adjust click radius based on zoom level
      
      if (distance < clickRadius) { // 25px radius around agent adjusted for zoom
        setSelectedAgent(selectedAgent === id ? null : id);
        triggerSpeechBubble(id);
        clickedAgent = true;
      }
    });

    if (!clickedAgent) {
      // 如果没有点击到Agent，则开始拖拽
      setDragState({
        isDragging: true,
        dragStart: { x, y },
        offset: { x: zoomState.offsetX, y: zoomState.offsetY },
        initialOffset: { x: zoomState.offsetX, y: zoomState.offsetY }
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragState.isDragging) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const deltaX = x - dragState.dragStart.x;
    const deltaY = y - dragState.dragStart.y;
    
    setZoomState(prev => ({
      ...prev,
      offsetX: dragState.initialOffset.x + deltaX,
      offsetY: dragState.initialOffset.y + deltaY
    }));
  };

  const handleMouseUp = () => {
    setDragState(prev => ({ ...prev, isDragging: false }));
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    const scaleFactor = 0.1;
    const delta = e.deltaY > 0 ? -scaleFactor : scaleFactor;
    
    // 计算新的缩放比例
    const newScale = Math.min(Math.max(0.5, zoomState.scale + delta), 3);
    
    // 计算鼠标在canvas上的位置
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // 计算相对于缩放中心的偏移
    const relX = mouseX - zoomState.offsetX;
    const relY = mouseY - zoomState.offsetY;
    
    // 更新缩放和偏移
    setZoomState(prev => ({
      scale: newScale,
      offsetX: prev.offsetX + relX * (delta),
      offsetY: prev.offsetY + relY * (delta)
    }));
  };

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
      // Fetch real data from Supabase
      // Fetch tasks as work records
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          assignee,
          status,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError)
      } else {
        const workRecordsFromTasks: WorkRecord[] = tasksData.map((task: any) => ({
          id: task.id,
          agent: task.assignee || 'Unknown',
          task: task.title || task.description || 'Untitled task',
          startTime: task.created_at,
          endTime: task.updated_at,
          status: task.status === 'completed' ? 'completed' : task.status === 'in_progress' ? 'active' : 'pending',
          duration: task.updated_at ? 
            Math.floor((new Date(task.updated_at).getTime() - new Date(task.created_at).getTime()) / 1000) : 
            Math.floor((Date.now() - new Date(task.created_at).getTime()) / 1000)
        }))
        setWorkRecords(workRecordsFromTasks)
      }

      // Fetch timesheets from tasks
      const { data: timesheetData, error: timesheetError } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          assignee,
          created_at,
          updated_at,
          status
        `)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
        .order('created_at', { ascending: false })

      if (timesheetError) {
        console.error('Error fetching timesheets:', timesheetError)
      } else {
        const timesheetsData = timesheetData.map((task: any) => {
          const startDate = new Date(task.created_at)
          const endDate = task.updated_at ? new Date(task.updated_at) : new Date()
          const duration = Math.floor((endDate.getTime() - startDate.getTime()) / 1000)
          
          return {
            id: task.id,
            agent: task.assignee || 'Unknown',
            task: task.title || 'Untitled task',
            date: startDate.toISOString().split('T')[0],
            startTime: startDate.toTimeString().substring(0, 5),
            endTime: task.updated_at ? new Date(task.updated_at).toTimeString().substring(0, 5) : null,
            duration: duration,
            status: task.status === 'completed' ? 'completed' : 'active'
          }
        })
        setTimesheets(timesheetsData)
      }

      // Fetch events as handoff records
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          id,
          agent_id,
          action,
          details,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      if (eventsError) {
        console.error('Error fetching events:', eventsError)
      } else {
        const handoffRecords = eventsData.map((event: any) => ({
          id: event.id,
          from: event.agent_id,
          to: 'System', // We don't have explicit to field in our schema
          task: event.action,
          timestamp: event.created_at,
          status: 'completed'
        }))
        setHandoffs(handoffRecords)
      }

      // Fetch proposals as culture loops
      const { data: proposalsData, error: proposalsError } = await supabase
        .from('proposals')
        .select(`
          id,
          title,
          description,
          agent_id,
          status,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(20)

      if (proposalsError) {
        console.error('Error fetching proposals:', proposalsError)
      } else {
        const cultureLoopsData = proposalsData.map((proposal: any) => ({
          id: proposal.id,
          topic: proposal.title,
          participants: [proposal.agent_id], // Simplified - just the proposer for now
          date: new Date(proposal.created_at).toISOString().split('T')[0],
          status: proposal.status === 'accepted' ? 'completed' : proposal.status,
          feedback: proposal.description || 'No feedback provided'
        }))
        setCultureLoops(cultureLoopsData)
      }

      // Fetch agent memory as growth watch metrics
      const { data: memoryData, error: memoryError } = await supabase
        .from('memory')
        .select(`
          id,
          agent_id,
          type,
          content,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      if (memoryError) {
        console.error('Error fetching memory:', memoryError)
      } else {
        // Group memories by agent and calculate metrics
        const agentMemories: Record<string, any[]> = {}
        memoryData.forEach((mem: any) => {
          if (!agentMemories[mem.agent_id]) {
            agentMemories[mem.agent_id] = []
          }
          agentMemories[mem.agent_id].push(mem)
        })

        const growthWatchData = Object.entries(agentMemories).map(([agentId, memories], index) => {
          const current = Math.min(10, memories.length * 0.5) // Scale factor for demo
          const target = 10
          const trend = index % 3 === 0 ? 'up' : index % 3 === 1 ? 'stable' : 'down'
          const improvement = trend === 'up' ? `Week +${(current * 0.1).toFixed(1)}` : 
                             trend === 'down' ? `Week -${(current * 0.05).toFixed(1)}` : 'Stable'
          
          return {
            id: `${index}`,
            agent: agentId,
            metric: 'Learning Index',
            current: parseFloat(current.toFixed(1)),
            target,
            trend,
            improvement
          }
        }).slice(0, 10)
        
        setGrowthWatch(growthWatchData)
      }

      // For pay slips, we'll use mock data since we don't have a dedicated table for payroll
      const mockPaySlips = [
        { id: '1', agent: '代码侠', period: '2024-03-01 to 2024-03-31', amount: 4500, currency: 'USD', status: 'paid', hours: 120 },
        { id: '2', agent: '洞察者', period: '2024-03-01 to 2024-03-31', amount: 4200, currency: 'USD', status: 'paid', hours: 115 },
        { id: '3', agent: '配色师', period: '2024-03-01 to 2024-03-31', amount: 4300, currency: 'USD', status: 'paid', hours: 118 },
        { id: '4', agent: '文案君', period: '2024-03-01 to 2024-03-31', amount: 3800, currency: 'USD', status: 'paid', hours: 105 },
        { id: '5', agent: '诸葛灯泡', period: '2024-03-01 to 2024-03-31', amount: 5500, currency: 'USD', status: 'paid', hours: 130 },
        { id: '6', agent: '守护者', period: '2024-03-01 to 2024-03-31', amount: 3600, currency: 'USD', status: 'paid', hours: 100 },
        { id: '7', agent: '掌舵人', period: '2024-03-01 to 2024-03-31', amount: 4100, currency: 'USD', status: 'paid', hours: 112 },
      ];
      setPaySlips(mockPaySlips)
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
          const newRecord = payload.new as AgentProphet | undefined
          const oldRecord = payload.old as AgentProphet | undefined
          
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

    // 启用图像平滑以改善缩放效果
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    let animationFrame: number
    let time = 0

    const draw = () => {
      time += 0.016 // ~60fps

      // Clear
      ctx.fillStyle = '#0f0f1a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 应用缩放和平移变换
      ctx.save();
      ctx.translate(zoomState.offsetX, zoomState.offsetY);
      ctx.scale(zoomState.scale, zoomState.scale);

      // Draw floor pattern - optimized to only draw visible area
      ctx.fillStyle = '#1a1a2e'
      const startX = Math.floor((-zoomState.offsetX) / (40 * zoomState.scale))
      const endX = Math.ceil((canvas.width - zoomState.offsetX) / (40 * zoomState.scale))
      const startY = Math.floor((-zoomState.offsetY) / (40 * zoomState.scale))
      const endY = Math.ceil((canvas.height - zoomState.offsetY) / (40 * zoomState.scale))
      
      for (let x = startX; x < endX; x++) {
        for (let y = startY; y < endY; y++) {
          if ((x + y) % 2 === 0) {
            ctx.fillRect(x * 40, y * 40, 40, 40)
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

      // Restore original transformation
      ctx.restore();

      // Stats overlay (drawn in original scale)
      const busyCount = Object.values(agents).filter(a => a.status === 'busy').length
      const meetingCount = Object.values(agents).filter(a => a.activity === 'meeting').length
      ctx.fillStyle = '#4a4a6a'
      ctx.fillRect(10, 10, 220, 120)
      ctx.font = '12px Arial'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#fff'
      ctx.fillText(`活跃: ${busyCount} / ${Object.keys(agents).length}`, 20, 30)
      ctx.fillText(`会议: ${meetingCount}`, 20, 50)
      ctx.fillText(`缩放: ${(zoomState.scale * 100).toFixed(0)}%`, 20, 70)
      ctx.fillStyle = connectionStatus === 'connected' ? '#22c55e' : '#ef4444'
      ctx.fillText(`● ${connectionStatus === 'connected' ? '实时连接' : connectionStatus === 'connecting' ? '连接中...' : '离线'}`, 20, 90)
      ctx.fillStyle = '#888'
      ctx.textAlign = 'right'
      ctx.fillText(`更新: ${lastUpdate}`, 210, 30)
      ctx.fillText(`拖拽: ${dragState.isDragging ? '是' : '否'}`, 210, 50)

      // Performance indicators (drawn in original scale)
      Object.entries(agents).forEach(([id, agent], index) => {
        if (agent.status === 'busy') {
          // Calculate positions accounting for transforms
          const desk = DESKS.find(d => d.id === id)
          if (desk) {
            // Only draw if agent is potentially visible in current view
            const x = (desk.x + desk.w / 2) * zoomState.scale + zoomState.offsetX
            const y = (desk.y + desk.h + 50) * zoomState.scale + zoomState.offsetY
            
            if (x > -20 && x < canvas.width + 20 && y > -20 && y < canvas.height + 20) {
              // CPU usage indicator
              ctx.fillStyle = '#3b82f6'
              ctx.fillRect(10, 140 + index * 20, 30, 5)
              ctx.fillStyle = '#1e40af'
              ctx.fillRect(10, 140 + index * 20, 30 * (agent.resources?.cpu || 50) / 100, 5)
              
              // Memory usage indicator
              ctx.fillStyle = '#8b5cf6'
              ctx.fillRect(10, 147 + index * 20, 30, 3)
              ctx.fillStyle = '#7c3aed'
              ctx.fillRect(10, 147 + index * 20, 30 * (agent.resources?.memory || 50) / 100, 3)
              
              ctx.fillStyle = '#fff'
              ctx.font = '10px Arial'
              ctx.fillText(`${agent.name.substring(0, 8)}...`, 45, 145 + index * 20)
            }
          }
        }
      })

      animationFrame = requestAnimationFrame(draw)
    }

    draw()

    // 添加键盘事件监听器
    const handleKeyDown = (e: KeyboardEvent) => {
      // 缩放控制: +/- 或 Ctrl + 鼠标滚轮
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        const newScale = Math.min(zoomState.scale + 0.1, 3);
        setZoomState(prev => ({ ...prev, scale: newScale }));
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        const newScale = Math.max(zoomState.scale - 0.1, 0.5);
        setZoomState(prev => ({ ...prev, scale: newScale }));
      } else if (e.key === '0' || e.key === 'Home') {
        // 重置视图
        e.preventDefault();
        setZoomState({ scale: 1, offsetX: 0, offsetY: 0 });
      } else if (e.key === 'f' || e.key === 'F') {
        // 全屏切换
        e.preventDefault();
        setIsFullscreen(!isFullscreen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [agents, moveTrails, lastUpdate, connectionStatus, zoomState, dragState, isFullscreen])

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
              <span className={`w-3 h-3 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'}`} />
              <span className="text-gray-400">
                {connectionStatus === 'connected' ? 'WebSocket 实时' : connectionStatus === 'connecting' ? '连接中...' : '离线模式'}
              </span>
            </div>
            <button
              onClick={() => {
                // 重置缩放和平移
                setZoomState({ scale: 1, offsetX: 0, offsetY: 0 });
              }}
              className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              title="重置视图"
            >
              <Target className="w-6 h-6" />
            </button>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex gap-1 sm:gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
          <button
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 font-medium text-sm sm:text-base rounded-lg transition-all duration-300 ${
              activeView === 'office'
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30 shadow-lg shadow-primary-500/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            onClick={() => setActiveView('office')}
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">办公室</span>
            <span className="sm:hidden">办公室</span>
          </button>
          <button
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 font-medium text-sm sm:text-base rounded-lg transition-all duration-300 ${
              activeView === 'ledger'
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30 shadow-lg shadow-primary-500/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            onClick={() => setActiveView('ledger')}
          >
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">记录</span>
            <span className="sm:hidden">记录</span>
          </button>
          <button
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 font-medium text-sm sm:text-base rounded-lg transition-all duration-300 ${
              activeView === 'stats'
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30 shadow-lg shadow-primary-500/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            onClick={() => setActiveView('stats')}
          >
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">统计</span>
            <span className="sm:hidden">统计</span>
          </button>
        </div>
      </div>

      {/* Office View */}
      <div className={`transition-all duration-500 ease-in-out ${activeView === 'office' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 hidden'}`}>
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
          <div className={`
            bg-[#0f0f1a] rounded-xl border border-white/10 overflow-hidden
            ${isFullscreen ? 'fixed inset-4 z-50' : ''}
          `}>
            <canvas
              ref={canvasRef}
              width={1400}
              height={900}
              className="w-full h-auto max-h-[75vh] lg:max-h-[85vh] object-contain cursor-grab"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            />
          </div>
          
          {/* Mobile touch instructions */}
          <p className="text-xs text-gray-500 text-center mt-2 md:hidden">
            👆 点击 Agent 卡片查看详情
          </p>
        </section>
      </div>

      {/* Office Ledger View */}
      <div className={`transition-all duration-500 ease-in-out ${activeView === 'ledger' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 hidden'}`}>
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-8 lg:mb-12">
          <div className="bg-white/5 rounded-xl border border-white/10 p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 gap-4">
              <h2 className="text-2xl lg:text-3xl font-semibold">Office Ledger 2.0</h2>
              
              {/* Agent Filter */}
              <div className="flex items-center gap-2">
                <label htmlFor="agent-filter" className="text-sm text-gray-400">筛选:</label>
                <select
                  id="agent-filter"
                  value={selectedAgentFilter}
                  onChange={(e) => setSelectedAgentFilter(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">全部智能体</option>
                  {AGENT_LIST.map(agent => (
                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="text-2xl font-bold text-blue-400">{timesheets.length}</div>
                <div className="text-sm text-gray-400">工时记录</div>
              </div>
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="text-2xl font-bold text-green-400">{paySlips.length}</div>
                <div className="text-sm text-gray-400">薪资单</div>
              </div>
              <div className="p-4 bg-purple-500/10 rounded-lg border border-primary-500/20">
                <div className="text-2xl font-bold text-primary-400">{handoffs.length}</div>
                <div className="text-sm text-gray-400">交接记录</div>
              </div>
              <div className="p-4 bg-teal-500/10 rounded-lg border border-teal-500/20">
                <div className="text-2xl font-bold text-teal-400">{cultureLoops.length}</div>
                <div className="text-sm text-gray-400">文化循环</div>
              </div>
            </div>
            
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
                    {timesheets
                      .filter(timesheet => selectedAgentFilter === 'all' || 
                        AGENT_LIST.some(agent => agent.name === timesheet.agent && agent.id === selectedAgentFilter))
                      .map(timesheet => (
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
                    {paySlips
                      .filter(paySlip => selectedAgentFilter === 'all' || 
                        AGENT_LIST.some(agent => agent.name === paySlip.agent && agent.id === selectedAgentFilter))
                      .map(paySlip => (
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
                  <MessageCircle className="w-5 h-5 text-primary-400" />
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
                    {handoffs
                      .filter(handoff => selectedAgentFilter === 'all' || 
                        AGENT_LIST.some(agent => (agent.name === handoff.from || agent.name === handoff.to) && agent.id === selectedAgentFilter))
                      .map(handoff => (
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
                    {cultureLoops
                      .filter(loop => selectedAgentFilter === 'all' || 
                        loop.participants.some((participant: string) => 
                          AGENT_LIST.some(agent => agent.name === participant && agent.id === selectedAgentFilter)))
                      .map(loop => (
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
                {growthWatch
                  .filter(watch => selectedAgentFilter === 'all' || 
                    AGENT_LIST.some(agent => agent.name === watch.agent && agent.id === selectedAgentFilter))
                  .map(watch => (
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
      </div>

      {/* Stats View */}
      <div className={`transition-all duration-500 ease-in-out ${activeView === 'stats' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 hidden'}`}>
        <section className="max-w-6xl lg:max-w-7xl mx-auto mb-8 lg:mb-12">
          {/* RPG Stats Grid */}
          <div className="mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 text-primary-400" />
              Agent RPG Stats
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {/* 诸葛灯泡 - Zhuge */}
              <AgentRPGCard
                name="诸葛灯泡"
                codeName="Zhuge"
                role="造梦者"
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
              
              {/* 掌舵人 - Pilot */}
              <AgentRPGCard
                name="掌舵人"
                codeName="Pilot"
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
              
              {/* 洞察者 - Radar */}
              <AgentRPGCard
                name="洞察者"
                codeName="Radar"
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
              
              {/* 文案君 - Ink */}
              <AgentRPGCard
                name="文案君"
                codeName="Ink"
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
              
              {/* 代码侠 - Forge */}
              <AgentRPGCard
                name="代码侠"
                codeName="Forge"
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
              
              {/* 配色师 - Canvas */}
              <AgentRPGCard
                name="配色师"
                codeName="Canvas"
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
              
              {/* 守护者 - Angel */}
              <AgentRPGCard
                name="守护者"
                codeName="Angel"
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
                  <Zap className="w-6 h-6 text-primary-400" />
                  <h3 className="font-medium">总工时</h3>
                </div>
                <div className="text-2xl font-bold text-primary-400">
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
      </div>

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
                ${selectedAgent === id ? 'ring-2 ring-primary-500' : ''}
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
      
      {/* 控制说明 */}
      <section className="max-w-6xl lg:max-w-7xl mx-auto mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
        <h3 className="font-semibold mb-2 text-base lg:text-lg">🖱️ 交互控制</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
          <div>
            <p><span className="text-white">点击 Agent</span> - 查看详细信息</p>
            <p><span className="text-white">鼠标拖拽</span> - 平移视图</p>
            <p><span className="text-white">滚轮</span> - 缩放视图</p>
          </div>
          <div>
            <p><span className="text-white">+/- 键</span> - 快捷缩放</p>
            <p><span className="text-white">0 键</span> - 重置视图</p>
            <p><span className="text-white">F 键</span> - 全屏切换</p>
          </div>
        </div>
      </section>
    </main>
  )
}