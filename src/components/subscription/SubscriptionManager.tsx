'use client'

import { useState, useEffect } from 'react'
import { Subscription, Plan, UsageSummary } from '@/lib/subscription'

interface SubscriptionManagerProps {
  userId: string
}

export function SubscriptionManager({ userId }: SubscriptionManagerProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usage, setUsage] = useState<Record<string, { current: number; limit: number; percentage: number }>>({})
  const [loading, setLoading] = useState(true)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [reactivateLoading, setReactivateLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [userId])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/usage/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await res.json()
      setSubscription(data.subscription)
      setUsage(data.usage || {})
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (immediately: boolean = false) => {
    if (!confirm(immediately ? '确定要立即取消订阅吗？' : '确定要在计费周期结束时取消订阅吗？')) {
      return
    }

    setCancelLoading(true)
    try {
      const res = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ immediately }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setSubscription(data.subscription)
      alert('订阅已取消')
    } catch (error) {
      alert(error instanceof Error ? error.message : '取消订阅失败')
    } finally {
      setCancelLoading(false)
    }
  }

  const handleReactivate = async () => {
    setReactivateLoading(true)
    try {
      const res = await fetch('/api/subscription/reactivate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setSubscription(data.subscription)
      alert('订阅已重新激活')
    } catch (error) {
      alert(error instanceof Error ? error.message : '重新激活失败')
    } finally {
      setReactivateLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-white mb-2">您还没有订阅</h3>
        <p className="text-gray-400 mb-4">选择一个计划开始使用</p>
        <a
          href="/pricing"
          className="inline-block py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          查看计划
        </a>
      </div>
    )
  }

  const plan = subscription.plan as Plan

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{plan?.name || '未知计划'}</h3>
            <p className="text-gray-400 text-sm">
              {subscription.billing_period === 'monthly' ? '月付' : subscription.billing_period === 'yearly' ? '年付' : '终身'}
            </p>
          </div>
          <div className="text-right">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                subscription.status === 'active'
                  ? 'bg-green-400/10 text-green-400'
                  : subscription.status === 'trialing'
                  ? 'bg-blue-400/10 text-blue-400'
                  : subscription.status === 'canceled'
                  ? 'bg-red-400/10 text-red-400'
                  : 'bg-gray-400/10 text-gray-400'
              }`}
            >
              {subscription.status === 'active' && '活跃'}
              {subscription.status === 'trialing' && '试用中'}
              {subscription.status === 'canceled' && '已取消'}
            </span>
          </div>
        </div>

        {/* Period Info */}
        {subscription.current_period_end && (
          <p className="text-gray-400 text-sm mb-4">
            {subscription.cancel_at_period_end ? (
              <>
                订阅将于{' '}
                {new Date(subscription.current_period_end).toLocaleDateString('zh-CN')} 到期
              </>
            ) : (
              <>
                下次续费日期：{' '}
                {new Date(subscription.current_period_end).toLocaleDateString('zh-CN')}
              </>
            )}
          </p>
        )}

        {/* Trial Info */}
        {subscription.trial_end && new Date(subscription.trial_end) > new Date() && (
          <p className="text-blue-400 text-sm mb-4">
            试用期至 {new Date(subscription.trial_end).toLocaleDateString('zh-CN')}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {subscription.status === 'canceled' || subscription.cancel_at_period_end ? (
            <button
              onClick={handleReactivate}
              disabled={reactivateLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {reactivateLoading ? '处理中...' : '重新激活'}
            </button>
          ) : (
            <>
              <a
                href="/pricing"
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                更改计划
              </a>
              <button
                onClick={() => handleCancel(false)}
                disabled={cancelLoading}
                className="px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
              >
                {cancelLoading ? '处理中...' : '取消订阅'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">使用情况</h3>
        <div className="space-y-4">
          {Object.entries(usage).map(([key, stat]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-400 text-sm capitalize">
                  {key === 'api_calls' ? 'API 调用' : key === 'storage_gb' ? '存储空间' : key === 'max_projects' ? '项目数量' : key}
                </span>
                <span className="text-white text-sm">
                  {stat.current} / {stat.limit === -1 ? '∞' : stat.limit}
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    stat.percentage > 80
                      ? 'bg-red-500'
                      : stat.percentage > 60
                      ? 'bg-yellow-500'
                      : 'bg-purple-500'
                  }`}
                  style={{ width: stat.limit === -1 ? '0%' : `${Math.min(stat.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      {plan?.features && (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">当前功能</h3>
          <ul className="grid grid-cols-2 gap-3">
            {Object.entries(plan.features).map(([key, value]) => (
              <li key={key} className="flex items-center text-sm text-gray-300">
                <svg
                  className="w-4 h-4 text-green-400 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {key === 'api_calls' && `${value === -1 ? '无限' : value.toLocaleString()} API 调用`}
                {key === 'storage_gb' && `${value === -1 ? '无限' : value} GB 存储`}
                {key === 'team_members' && `${value === -1 ? '无限' : value} 团队成员`}
                {!['api_calls', 'storage_gb', 'team_members'].includes(key) && `${value} ${key}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}