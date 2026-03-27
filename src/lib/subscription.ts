import { createClient } from '@supabase/supabase-js'

// ============================================
// Types
// ============================================

export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'past_due' | 'trialing'
export type BillingPeriod = 'monthly' | 'yearly' | 'lifetime'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  company: string | null
  phone: string | null
  timezone: string
  locale: string
  created_at: string
  updated_at: string
  email_verified: boolean
  email_verified_at: string | null
  marketing_consent: boolean
  newsletter_subscribed: boolean
}

export interface Plan {
  id: string
  name: string
  slug: string
  description: string | null
  price_monthly: number
  price_yearly: number
  price_lifetime: number
  currency: string
  features: Record<string, number>
  limits: Record<string, number>
  is_active: boolean
  is_popular: boolean
  display_order: number
  stripe_price_id_monthly: string | null
  stripe_price_id_yearly: string | null
  stripe_price_id_lifetime: string | null
  stripe_product_id: string | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  status: SubscriptionStatus
  billing_period: BillingPeriod
  current_period_start: string | null
  current_period_end: string | null
  canceled_at: string | null
  cancel_at_period_end: boolean
  trial_start: string | null
  trial_end: string | null
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  stripe_price_id: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  // Joined fields
  plan?: Plan
}

export interface UsageRecord {
  id: string
  user_id: string
  usage_type: string
  quantity: number
  recorded_at: string
  resource_id: string | null
  metadata: Record<string, unknown>
  billing_period_start: string
  billing_period_end: string
}

export interface UsageSummary {
  id: string
  user_id: string
  usage_type: string
  total_quantity: number
  period_start: string
  period_end: string
  updated_at: string
}

export interface Payment {
  id: string
  user_id: string
  subscription_id: string | null
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed' | 'refunded'
  stripe_payment_intent_id: string | null
  stripe_charge_id: string | null
  stripe_invoice_id: string | null
  description: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

// ============================================
// Supabase Client (Server-side)
// ============================================

export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// ============================================
// Plan Functions
// ============================================

export async function getPlans(): Promise<Plan[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return []
  }

  const client = createClient(supabaseUrl, supabaseAnonKey)
  
  const { data, error } = await client
    .from('plans')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching plans:', error)
    return []
  }

  return data || []
}

export async function getPlanBySlug(slug: string): Promise<Plan | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  const client = createClient(supabaseUrl, supabaseAnonKey)
  
  const { data, error } = await client
    .from('plans')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching plan:', error)
    return null
  }

  return data
}

// ============================================
// Subscription Functions
// ============================================

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const client = createServerClient()

  const { data, error } = await client
    .from('subscriptions')
    .select(`
      *,
      plan:plans(*)
    `)
    .eq('user_id', userId)
    .in('status', ['active', 'trialing', 'canceled'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching subscription:', error)
    return null
  }

  return data
}

export async function createSubscription(
  userId: string,
  planId: string,
  billingPeriod: BillingPeriod = 'monthly',
  trialDays: number = 0
): Promise<Subscription | null> {
  const client = createServerClient()

  const now = new Date()
  const periodStart = now
  let periodEnd: Date | null = null

  // 计算订阅周期
  if (billingPeriod === 'monthly') {
    periodEnd = new Date(now)
    periodEnd.setMonth(periodEnd.getMonth() + 1)
  } else if (billingPeriod === 'yearly') {
    periodEnd = new Date(now)
    periodEnd.setFullYear(periodEnd.getFullYear() + 1)
  }
  // lifetime 没有结束时间

  // 试用期
  let trialEnd: Date | null = null
  if (trialDays > 0) {
    trialEnd = new Date(now)
    trialEnd.setDate(trialEnd.getDate() + trialDays)
  }

  const { data, error } = await client
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_id: planId,
      status: trialDays > 0 ? 'trialing' : 'active',
      billing_period: billingPeriod,
      current_period_start: periodStart.toISOString(),
      current_period_end: periodEnd?.toISOString() || null,
      trial_start: trialDays > 0 ? now.toISOString() : null,
      trial_end: trialEnd?.toISOString() || null,
    })
    .select(`
      *,
      plan:plans(*)
    `)
    .single()

  if (error) {
    console.error('Error creating subscription:', error)
    return null
  }

  // 记录历史
  await client.from('subscription_history').insert({
    subscription_id: data.id,
    action: 'created',
    to_plan_id: planId,
    to_status: data.status,
  })

  return data
}

export async function upgradeSubscription(
  subscriptionId: string,
  newPlanId: string
): Promise<Subscription | null> {
  const client = createServerClient()

  // 获取当前订阅
  const { data: current, error: fetchError } = await client
    .from('subscriptions')
    .select('*')
    .eq('id', subscriptionId)
    .single()

  if (fetchError || !current) {
    console.error('Error fetching current subscription:', fetchError)
    return null
  }

  // 更新订阅
  const { data, error } = await client
    .from('subscriptions')
    .update({
      plan_id: newPlanId,
      status: 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('id', subscriptionId)
    .select(`
      *,
      plan:plans(*)
    `)
    .single()

  if (error) {
    console.error('Error upgrading subscription:', error)
    return null
  }

  // 记录历史
  await client.from('subscription_history').insert({
    subscription_id: subscriptionId,
    action: 'upgraded',
    from_plan_id: current.plan_id,
    to_plan_id: newPlanId,
    from_status: current.status,
    to_status: 'active',
  })

  return data
}

export async function cancelSubscription(
  subscriptionId: string,
  immediately: boolean = false
): Promise<Subscription | null> {
  const client = createServerClient()

  const updateData: Record<string, unknown> = {
    cancel_at_period_end: !immediately,
    updated_at: new Date().toISOString(),
  }

  if (immediately) {
    updateData.status = 'canceled'
    updateData.canceled_at = new Date().toISOString()
  }

  const { data, error } = await client
    .from('subscriptions')
    .update(updateData)
    .eq('id', subscriptionId)
    .select(`
      *,
      plan:plans(*)
    `)
    .single()

  if (error) {
    console.error('Error canceling subscription:', error)
    return null
  }

  // 记录历史
  await client.from('subscription_history').insert({
    subscription_id: subscriptionId,
    action: 'canceled',
    from_status: data.status,
    to_status: immediately ? 'canceled' : data.status,
    reason: immediately ? 'immediate' : 'at_period_end',
  })

  return data
}

export async function reactivateSubscription(
  subscriptionId: string
): Promise<Subscription | null> {
  const client = createServerClient()

  const { data, error } = await client
    .from('subscriptions')
    .update({
      status: 'active',
      cancel_at_period_end: false,
      canceled_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', subscriptionId)
    .select(`
      *,
      plan:plans(*)
    `)
    .single()

  if (error) {
    console.error('Error reactivating subscription:', error)
    return null
  }

  // 记录历史
  await client.from('subscription_history').insert({
    subscription_id: subscriptionId,
    action: 'renewed',
    from_status: 'canceled',
    to_status: 'active',
  })

  return data
}

// ============================================
// Usage Functions
// ============================================

export async function recordUsage(
  userId: string,
  usageType: string,
  quantity: number = 1,
  resourceId?: string,
  metadata?: Record<string, unknown>
): Promise<boolean> {
  const client = createServerClient()

  // 计算当前计费周期
  const now = new Date()
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

  const { error } = await client.from('usage_records').insert({
    user_id: userId,
    usage_type: usageType,
    quantity,
    resource_id: resourceId || null,
    metadata: metadata || {},
    billing_period_start: periodStart.toISOString(),
    billing_period_end: periodEnd.toISOString(),
  })

  if (error) {
    console.error('Error recording usage:', error)
    return false
  }

  return true
}

export async function getUserUsage(
  userId: string,
  usageType?: string
): Promise<UsageSummary[]> {
  const client = createServerClient()

  let query = client
    .from('usage_summaries')
    .select('*')
    .eq('user_id', userId)
    .gte('period_end', new Date().toISOString())

  if (usageType) {
    query = query.eq('usage_type', usageType)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching usage:', error)
    return []
  }

  return data || []
}

export async function checkUsageLimit(
  userId: string,
  limitType: string
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const client = createServerClient()

  // 获取用户订阅
  const subscription = await getUserSubscription(userId)
  
  // 获取计划限制
  let planLimits: Record<string, number> = {}
  
  if (subscription?.plan) {
    planLimits = subscription.plan.limits || {}
  } else {
    // Free 计划限制
    const { data: freePlan } = await client
      .from('plans')
      .select('limits')
      .eq('slug', 'free')
      .single()
    
    if (freePlan) {
      planLimits = freePlan.limits || {}
    }
  }

  const limit = planLimits[limitType] ?? 0

  // 获取当前使用量
  const usage = await getUserUsage(userId, limitType)
  const current = usage.reduce((sum, u) => sum + u.total_quantity, 0)

  // -1 表示无限制
  if (limit === -1) {
    return { allowed: true, current, limit: -1 }
  }

  return {
    allowed: current < limit,
    current,
    limit,
  }
}

// ============================================
// Profile Functions
// ============================================

export async function getProfile(userId: string): Promise<Profile | null> {
  const client = createServerClient()

  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'full_name' | 'avatar_url' | 'company' | 'phone' | 'timezone' | 'locale' | 'marketing_consent' | 'newsletter_subscribed'>>
): Promise<Profile | null> {
  const client = createServerClient()

  const { data, error } = await client
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }

  return data
}

// ============================================
// Payment Functions (Stripe 预留)
// ============================================

export async function createPaymentRecord(
  userId: string,
  amount: number,
  currency: string = 'CNY',
  subscriptionId?: string,
  stripePaymentIntentId?: string,
  metadata?: Record<string, unknown>
): Promise<Payment | null> {
  const client = createServerClient()

  const { data, error } = await client
    .from('payments')
    .insert({
      user_id: userId,
      subscription_id: subscriptionId || null,
      amount,
      currency,
      status: 'pending',
      stripe_payment_intent_id: stripePaymentIntentId || null,
      metadata: metadata || {},
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating payment record:', error)
    return null
  }

  return data
}

export async function updatePaymentStatus(
  paymentId: string,
  status: Payment['status'],
  stripeChargeId?: string,
  stripeInvoiceId?: string
): Promise<Payment | null> {
  const client = createServerClient()

  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (stripeChargeId) updateData.stripe_charge_id = stripeChargeId
  if (stripeInvoiceId) updateData.stripe_invoice_id = stripeInvoiceId

  const { data, error } = await client
    .from('payments')
    .update(updateData)
    .eq('id', paymentId)
    .select()
    .single()

  if (error) {
    console.error('Error updating payment:', error)
    return null
  }

  return data
}