import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// 创建支持 Realtime 的客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Realtime channel for agent updates
export const AGENTS_CHANNEL = 'agents-realtime'
export const EVENTS_CHANNEL = 'events-realtime'

// Types
export interface Agent {
  id: string
  name: string
  role: string
  emoji: string
  color: string
  status: 'idle' | 'busy' | 'offline'
  current_task: string | null
  last_active: string
}

export interface Task {
  id: string
  title: string
  description: string
  assignee: string
  status: 'pending' | 'in_progress' | 'completed'
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  agent_id: string
  action: string
  details: Record<string, unknown>
  created_at: string
}

// API functions
export async function getAgents(): Promise<Agent[]> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')

  if (error) throw error
  return data
}

export async function updateAgentStatus(id: string, status: Agent['status'], task?: string) {
  const { error } = await supabase
    .from('agents')
    .update({
      status,
      current_task: task || null,
      last_active: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) throw error
}

export async function getEvents(limit = 20): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function createEvent(agentId: string, action: string, details: Record<string, unknown>) {
  const { error } = await supabase
    .from('events')
    .insert({
      agent_id: agentId,
      action,
      details,
    })

  if (error) throw error
}