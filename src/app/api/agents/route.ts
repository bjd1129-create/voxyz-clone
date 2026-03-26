import { NextResponse } from 'next/server'

// Agent status store (in production, use Supabase or Redis)
let agentStatus: Record<string, {
  name: string
  emoji: string
  color: string
  status: 'idle' | 'busy' | 'offline'
  currentTask: string | null
  lastActive: string
  position: { x: number; y: number }
  activity: 'working' | 'walking' | 'meeting' | 'coffee'
}> = {
  ceo: {
    name: 'CEO Minion',
    emoji: '🎯',
    color: '#FF6B6B',
    status: 'busy',
    currentTask: '制定战略规划',
    lastActive: new Date().toISOString(),
    position: { x: 200, y: 150 },
    activity: 'working',
  },
  creative: {
    name: 'Creative',
    emoji: '🎨',
    color: '#A855F7',
    status: 'idle',
    currentTask: null,
    lastActive: new Date().toISOString(),
    position: { x: 350, y: 150 },
    activity: 'walking',
  },
  developer: {
    name: 'Developer',
    emoji: '💻',
    color: '#3B82F6',
    status: 'busy',
    currentTask: '实现实时状态同步',
    lastActive: new Date().toISOString(),
    position: { x: 500, y: 150 },
    activity: 'working',
  },
  writer: {
    name: 'Writer',
    emoji: '📝',
    color: '#10B981',
    status: 'idle',
    currentTask: null,
    lastActive: new Date().toISOString(),
    position: { x: 200, y: 300 },
    activity: 'coffee',
  },
  researcher: {
    name: 'Researcher',
    emoji: '🔍',
    color: '#F59E0B',
    status: 'busy',
    currentTask: '分析 voxyz.space 架构',
    lastActive: new Date().toISOString(),
    position: { x: 350, y: 300 },
    activity: 'working',
  },
  support: {
    name: 'Support',
    emoji: '🛠️',
    color: '#EC4899',
    status: 'idle',
    currentTask: null,
    lastActive: new Date().toISOString(),
    position: { x: 500, y: 300 },
    activity: 'walking',
  },
}

// GET - fetch all agent status
export async function GET() {
  return NextResponse.json(agentStatus)
}

// POST - update agent status
export async function POST(request: Request) {
  const body = await request.json()
  const { agentId, ...updates } = body

  if (agentId && agentStatus[agentId]) {
    agentStatus[agentId] = {
      ...agentStatus[agentId],
      ...updates,
      lastActive: new Date().toISOString(),
    }
  }

  return NextResponse.json({ success: true, data: agentStatus[agentId] })
}