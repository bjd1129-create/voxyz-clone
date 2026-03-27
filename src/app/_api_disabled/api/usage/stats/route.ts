import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// 获取用户使用量
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const usageType = url.searchParams.get('type')

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

    // 获取用户订阅和计划
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plan:plans(*)
      `)
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing', 'canceled'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    // 获取计划限制
    let planLimits: Record<string, number> = {}
    let planFeatures: Record<string, number> = {}

    if (subscription?.plan) {
      planLimits = subscription.plan.limits || {}
      planFeatures = subscription.plan.features || {}
    } else {
      // Free 计划
      const { data: freePlan } = await supabase
        .from('plans')
        .select('limits, features')
        .eq('slug', 'free')
        .single()

      if (freePlan) {
        planLimits = freePlan.limits || {}
        planFeatures = freePlan.features || {}
      }
    }

    // 获取当前使用量
    const now = new Date()
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    let query = supabase
      .from('usage_summaries')
      .select('*')
      .eq('user_id', user.id)
      .gte('period_end', now.toISOString())

    if (usageType) {
      query = query.eq('usage_type', usageType)
    }

    const { data: usageData, error } = await query

    if (error) {
      console.error('Get usage error:', error)
      return NextResponse.json({ error: 'Failed to fetch usage' }, { status: 500 })
    }

    // 计算使用量汇总
    const usage: Record<string, { current: number; limit: number; percentage: number }> = {}

    for (const [key, limit] of Object.entries(planLimits)) {
      const current = usageData
        ?.filter((u) => u.usage_type === key)
        .reduce((sum, u) => sum + u.total_quantity, 0) || 0

      usage[key] = {
        current,
        limit: limit as number,
        percentage: limit === -1 ? 0 : Math.round((current / (limit as number)) * 100),
      }
    }

    return NextResponse.json({
      subscription: subscription ? {
        id: subscription.id,
        status: subscription.status,
        planName: subscription.plan?.name,
        planSlug: subscription.plan?.slug,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      } : null,
      usage,
      limits: planLimits,
      features: planFeatures,
    })
  } catch (error) {
    console.error('Get usage error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}