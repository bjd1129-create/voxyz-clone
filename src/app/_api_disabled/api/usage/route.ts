import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// 记录使用量
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { usageType, quantity = 1, resourceId, metadata } = await request.json()

    if (!usageType) {
      return NextResponse.json({ error: 'Usage type is required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // 计算当前计费周期
    const now = new Date()
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    // 检查是否超过限制
    const { data: limits, error: limitError } = await supabase.rpc('check_usage_limit', {
      user_uuid: user.id,
      limit_type: usageType,
    })

    if (limitError) {
      console.error('Check limit error:', limitError)
    }

    if (limits === false) {
      return NextResponse.json(
        { error: 'Usage limit exceeded', usageType },
        { status: 403 }
      )
    }

    // 记录使用量
    const { error } = await supabase.from('usage_records').insert({
      user_id: user.id,
      usage_type: usageType,
      quantity,
      resource_id: resourceId || null,
      metadata: metadata || {},
      billing_period_start: periodStart.toISOString(),
      billing_period_end: periodEnd.toISOString(),
    })

    if (error) {
      console.error('Record usage error:', error)
      return NextResponse.json({ error: 'Failed to record usage' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Usage recorded successfully',
      usage: {
        usageType,
        quantity,
        resourceId,
      },
    })
  } catch (error) {
    console.error('Record usage error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}