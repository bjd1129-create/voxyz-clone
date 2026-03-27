import { NextResponse } from 'next/server'

let agentStatus: Record<string, { name: string; emoji: string; color: string; status: 'idle' | 'busy' | 'offline'; currentTask: string | null; lastActive: string; position: { x: number; y: number }; activity: 'working' | 'walking' | 'meeting' | 'coffee' }> = {
  ceo: { name: '诸葛灯泡', emoji: '💡', color: '#FF6B6B', status: 'idle', currentTask: null, lastActive: new Date().toISOString(), position: { x: 200, y: 150 }, activity: 'coffee' },
  coordinator: { name: '掌舵人', emoji: '🎯', color: '#A855F7', status: 'idle', currentTask: null, lastActive: new Date().toISOString(), position: { x: 350, y: 150 }, activity: 'walking' },
  developer: { name: '代码侠', emoji: '💻', color: '#3B82F6', status: 'idle', currentTask: null, lastActive: new Date().toISOString(), position: { x: 500, y: 150 }, activity: 'working' },
  writer: { name: '文案君', emoji: '📝', color: '#10B981', status: 'idle', currentTask: null, lastActive: new Date().toISOString(), position: { x: 200, y: 300 }, activity: 'coffee' },
  researcher: { name: '洞察者', emoji: '🔍', color: '#F59E0B', status: 'idle', currentTask: null, lastActive: new Date().toISOString(), position: { x: 350, y: 300 }, activity: 'working' },
  support: { name: '守护者', emoji: '🛠️', color: '#EC4899', status: 'idle', currentTask: null, lastActive: new Date().toISOString(), position: { x: 500, y: 300 }, activity: 'walking' },
}

export async function GET() { return NextResponse.json(agentStatus) }
export async function POST(request: Request) {
  const body = await request.json()
  const { agentId, ...updates } = body
  if (agentId && agentStatus[agentId]) { agentStatus[agentId] = { ...agentStatus[agentId], ...updates, lastActive: new Date().toISOString() } }
  return NextResponse.json({ success: true, data: agentStatus[agentId] })
}