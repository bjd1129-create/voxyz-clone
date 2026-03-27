import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// 重新激活已取消的订阅
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    // 获取已取消的订阅
    const { data: current, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('cancel_at_period_end', true)
      .in('status', ['active', 'canceled'])
      .single()

    if (fetchError || !current) {
      return NextResponse.json(
        { error: 'No canceled subscription found to reactivate' },
        { status: 404 }
      )
    }

    // 重新激活
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        cancel_at_period_end: false,
        canceled_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', current.id)
      .select(`
        *,
        plan:plans(*)
      `)
      .single()

    if (error) {
      console.error('Reactivate subscription error:', error)
      return NextResponse.json({ error: 'Failed to reactivate subscription' }, { status: 500 })
    }

    // 记录历史
    await supabase.from('subscription_history').insert({
      subscription_id: current.id,
      action: 'renewed',
      from_status: current.status,
      to_status: 'active',
    })

    return NextResponse.json({
      message: 'Subscription reactivated successfully',
      subscription,
    })
  } catch (error) {
    console.error('Reactivate subscription error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}