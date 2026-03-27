'use client'

import { useState, useEffect } from 'react'
import { Plan } from '@/lib/subscription'

interface PricingCardsProps {
  currentPlanSlug?: string
  onSelectPlan?: (plan: Plan, billingPeriod: 'monthly' | 'yearly') => void
}

export function PricingCards({ currentPlanSlug, onSelectPlan }: PricingCardsProps) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch('/api/plans')
        const data = await res.json()
        setPlans(data.plans || [])
      } catch (error) {
        console.error('Failed to fetch plans:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const getPrice = (plan: Plan) => {
    if (billingPeriod === 'monthly') return plan.price_monthly
    if (billingPeriod === 'yearly') return plan.price_yearly
    return plan.price_lifetime
  }

  const formatPrice = (price: number) => {
    if (price === 0) return '免费'
    return `¥${price.toLocaleString()}`
  }

  const getPeriodLabel = () => {
    if (billingPeriod === 'monthly') return '/月'
    if (billingPeriod === 'yearly') return '/年'
    return ''
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Billing Period Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            月付
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              billingPeriod === 'yearly'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            年付
            <span className="ml-1 text-xs text-green-400">省 15%</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = plan.slug === currentPlanSlug
          const price = getPrice(plan)

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 ${
                plan.is_popular
                  ? 'bg-gradient-to-b from-purple-900/50 to-blue-900/50 border-2 border-purple-500'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              {plan.is_popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    最受欢迎
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>

              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-white">
                  {formatPrice(price)}
                </span>
                {price > 0 && (
                  <span className="text-gray-400">{getPeriodLabel()}</span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {Object.entries(plan.features).map(([key, value]) => (
                  <li key={key} className="flex items-center text-sm text-gray-300">
                    <svg
                      className="w-5 h-5 text-green-400 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {key === 'api_calls' && `${value === -1 ? '无限' : value.toLocaleString()} API 调用`}
                    {key === 'storage_gb' && `${value === -1 ? '无限' : value} GB 存储`}
                    {key === 'team_members' && `${value === -1 ? '无限' : value} 团队成员`}
                    {!['api_calls', 'storage_gb', 'team_members'].includes(key) && `${value} ${key}`}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => onSelectPlan?.(plan, billingPeriod)}
                disabled={isCurrentPlan}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                  isCurrentPlan
                    ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                    : plan.is_popular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {isCurrentPlan ? '当前计划' : price === 0 ? '开始使用' : '选择计划'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}