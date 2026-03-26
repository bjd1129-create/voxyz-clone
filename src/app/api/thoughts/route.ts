import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getClient() {
  return createClient(supabaseUrl, supabaseKey)
}

// GET - 获取思考记录
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const agentId = searchParams.get('agent_id')
  const limit = parseInt(searchParams.get('limit') || '100')
  const offset = parseInt(searchParams.get('offset') || '0')

  const supabase = getClient()
  
  let query = supabase
    .from('agent_thoughts')
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

// POST - 记录思考
export async function POST(request: Request) {
  const body = await request.json()
  const { agent_id, thought, context } = body

  if (!agent_id || !thought) {
    return NextResponse.json({ error: 'agent_id and thought are required' }, { status: 400 })
  }

  const supabase = getClient()
  
  const { data, error } = await supabase
    .from('agent_thoughts')
    .insert({
      agent_id,
      thought,
      context: context || {}
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}