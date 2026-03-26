import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getClient() {
  return createClient(supabaseUrl, supabaseKey)
}

// GET - 获取消息记录
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fromAgent = searchParams.get('from_agent')
  const toAgent = searchParams.get('to_agent')
  const limit = parseInt(searchParams.get('limit') || '100')
  const offset = parseInt(searchParams.get('offset') || '0')

  const supabase = getClient()
  
  let query = supabase
    .from('agent_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (fromAgent) {
    query = query.eq('from_agent', fromAgent)
  }
  if (toAgent) {
    query = query.eq('to_agent', toAgent)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST - 发送消息
export async function POST(request: Request) {
  const body = await request.json()
  const { from_agent, to_agent, message } = body

  if (!from_agent || !to_agent || !message) {
    return NextResponse.json({ error: 'from_agent, to_agent, and message are required' }, { status: 400 })
  }

  const supabase = getClient()
  
  const { data, error } = await supabase
    .from('agent_messages')
    .insert({
      from_agent,
      to_agent,
      message
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}