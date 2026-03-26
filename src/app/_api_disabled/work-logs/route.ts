import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getClient() {
  return createClient(supabaseUrl, supabaseKey)
}

// GET - 获取工作日志
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const agentId = searchParams.get('agent_id')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  const supabase = getClient()
  
  let query = supabase
    .from('work_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (agentId) {
    query = query.eq('agent_id', agentId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST - 创建工作日志
export async function POST(request: Request) {
  const body = await request.json()
  const { agent_id, action, details, duration_seconds } = body

  if (!agent_id || !action) {
    return NextResponse.json({ error: 'agent_id and action are required' }, { status: 400 })
  }

  const supabase = getClient()
  
  const { data, error } = await supabase
    .from('work_logs')
    .insert({
      agent_id,
      action,
      details: details || {},
      duration_seconds: duration_seconds || null
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// DELETE - 删除工作日志
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  const supabase = getClient()
  
  const { error } = await supabase
    .from('work_logs')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}