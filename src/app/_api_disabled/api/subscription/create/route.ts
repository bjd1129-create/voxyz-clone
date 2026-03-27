import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// 创建订阅（新用户选择计划）
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId, billingPeriod = 'monthly' } = await request.json()

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 })
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

    // 检查是否已有活跃订阅
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing'])
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'User already has an active subscription' },
        { status: 400 }
      )
    }

    // 获取计划信息
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .single()

    if (planError || !plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // 计算订阅周期
    const now = new Date()
    let periodEnd: Date | null = null

    if (billingPeriod === 'monthly') {
      periodEnd = new Date(now)
      periodEnd.setMonth(periodEnd.getMonth() + 1)
    } else if (billingPeriod === 'yearly') {
      periodEnd = new Date(now)
      periodEnd.setFullYear(periodEnd.getFullYear() + 1)
    }
    // lifetime 没有结束时间

    // 创建订阅
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan_id: planId,
        status: 'active',
        billing_period: billingPeriod,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd?.toISOString() || null,
      })
      .select(`
        *,
        plan:plans(*)
      `)
      .single()

    if (error) {
      console.error('Create subscription error:', error)
      return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
    }

    // 记录历史
    await supabase.from('subscription_history').insert({
      subscription_id: subscription.id,
      action: 'created',
      to_plan_id: planId,
      to_status: 'active',
    })

    return NextResponse.json({
      message: 'Subscription created successfully',
      subscription,
    })
  } catch (error) {
    console.error('Create subscription error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}