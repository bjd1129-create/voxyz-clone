import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// 取消订阅
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { immediately = false, reason } = await request.json()

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

    // 获取当前订阅
    const { data: current, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing'])
      .single()

    if (fetchError || !current) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    // 更新订阅
    const updateData: Record<string, unknown> = {
      cancel_at_period_end: !immediately,
      updated_at: new Date().toISOString(),
    }

    if (immediately) {
      updateData.status = 'canceled'
      updateData.canceled_at = new Date().toISOString()
    }

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('id', current.id)
      .select(`
        *,
        plan:plans(*)
      `)
      .single()

    if (error) {
      console.error('Cancel subscription error:', error)
      return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
    }

    // 记录历史
    await supabase.from('subscription_history').insert({
      subscription_id: current.id,
      action: 'canceled',
      from_status: current.status,
      to_status: immediately ? 'canceled' : current.status,
      reason: reason || (immediately ? 'immediate' : 'at_period_end'),
    })

    return NextResponse.json({
      message: immediately
        ? 'Subscription canceled immediately'
        : 'Subscription will be canceled at the end of the billing period',
      subscription,
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}