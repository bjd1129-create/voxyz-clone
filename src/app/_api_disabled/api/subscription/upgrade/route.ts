import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// 升级/降级订阅
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { newPlanId } = await request.json()

    if (!newPlanId) {
      return NextResponse.json({ error: 'New plan ID is required' }, { status: 400 })
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

    // 获取新计划
    const { data: newPlan, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', newPlanId)
      .eq('is_active', true)
      .single()

    if (planError || !newPlan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // 更新订阅
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .update({
        plan_id: newPlanId,
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', current.id)
      .select(`
        *,
        plan:plans(*)
      `)
      .single()

    if (error) {
      console.error('Upgrade subscription error:', error)
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
    }

    // 记录历史
    const isUpgrade = (newPlan.display_order || 0) > (subscription.plan?.display_order || 0)
    await supabase.from('subscription_history').insert({
      subscription_id: current.id,
      action: isUpgrade ? 'upgraded' : 'downgraded',
      from_plan_id: current.plan_id,
      to_plan_id: newPlanId,
      from_status: current.status,
      to_status: 'active',
    })

    return NextResponse.json({
      message: `Subscription ${isUpgrade ? 'upgraded' : 'downgraded'} successfully`,
      subscription,
    })
  } catch (error) {
    console.error('Upgrade subscription error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}