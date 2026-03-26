import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getClient() {
  return createClient(supabaseUrl, supabaseKey)
}

// GET - 获取任务进度
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const taskId = searchParams.get('task_id')
  const status = searchParams.get('status')
  const agentId = searchParams.get('agent_id')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  const supabase = getClient()
  
  let query = supabase
    .from('task_progress')
    .select('*')
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (taskId) {
    query = query.eq('task_id', taskId)
  }
  if (status) {
    query = query.eq('status', status)
  }
  if (agentId) {
    query = query.eq('agent_id', agentId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST - 创建或更新任务进度
export async function POST(request: Request) {
  const body = await request.json()
  const { task_id, status, progress, blocked_reason, agent_id, notes } = body

  if (!status) {
    return NextResponse.json({ error: 'status is required' }, { status: 400 })
  }

  const supabase = getClient()
  
  // 检查是否存在该任务的进度记录
  if (task_id) {
    const { data: existing } = await supabase
      .from('task_progress')
      .select('*')
      .eq('task_id', task_id)
      .single()

    if (existing) {
      // 更新现有记录
      const { data, error } = await supabase
        .from('task_progress')
        .update({
          status,
          progress: progress ?? existing.progress,
          blocked_reason: blocked_reason ?? existing.blocked_reason,
          agent_id: agent_id ?? existing.agent_id,
          notes: notes ?? existing.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json(data)
    }
  }

  // 创建新记录
  const { data, error } = await supabase
    .from('task_progress')
    .insert({
      task_id,
      status,
      progress: progress || 0,
      blocked_reason,
      agent_id,
      notes
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// PATCH - 更新任务进度
export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, status, progress, blocked_reason, agent_id, notes } = body

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  const supabase = getClient()
  
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (status !== undefined) updates.status = status
  if (progress !== undefined) updates.progress = progress
  if (blocked_reason !== undefined) updates.blocked_reason = blocked_reason
  if (agent_id !== undefined) updates.agent_id = agent_id
  if (notes !== undefined) updates.notes = notes

  const { data, error } = await supabase
    .from('task_progress')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}