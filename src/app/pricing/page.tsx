'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PricingCards } from '@/components/subscription/PricingCards'
import { Plan } from '@/lib/subscription'

export default function PricingPage() {
  const router = useRouter()
  const [currentPlanSlug, setCurrentPlanSlug] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check current subscription
    const token = localStorage.getItem('token')
    if (token) {
      fetch('/api/subscription', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.subscription?.plan?.slug) {
            setCurrentPlanSlug(data.subscription.plan.slug)
          }
        })
        .catch(console.error)
    }
  }, [])

  const handleSelectPlan = async (plan: Plan, billingPeriod: 'monthly' | 'yearly') => {
    const token = localStorage.getItem('token')

    if (!token) {
      // Not logged in, redirect to register
      router.push('/auth/register')
      return
    }

    // Free plan - create subscription directly
    if (plan.slug === 'free') {
      router.push('/account/subscription')
      return
    }

    setLoading(true)

    try {
      // Check if user has existing subscription
      const subRes = await fetch('/api/subscription', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const subData = await subRes.json()

      if (subData.subscription) {
        // Upgrade/downgrade existing subscription
        const upgradeRes = await fetch('/api/subscription/upgrade', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newPlanId: plan.id }),
        })

        const upgradeData = await upgradeRes.json()
        if (!upgradeRes.ok) throw new Error(upgradeData.error)

        alert('订阅已更新')
        router.push('/account/subscription')
      } else {
        // Create new subscription
        const createRes = await fetch('/api/subscription/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            planId: plan.id,
            billingPeriod,
          }),
        })

        const createData = await createRes.json()
        if (!createRes.ok) throw new Error(createData.error)

        // TODO: For paid plans, redirect to Stripe checkout
        // For now, just redirect to account
        alert('订阅已创建')
        router.push('/account/subscription')
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : '操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">选择您的计划</h1>
          <p className="text-gray-400 text-lg">
            从免费开始，随时升级以获得更多功能
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <PricingCards
            currentPlanSlug={currentPlanSlug}
            onSelectPlan={handleSelectPlan}
          />
        )}

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">常见问题</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">可以随时取消吗？</h3>
              <p className="text-gray-400 text-sm">
                是的，您可以随时取消订阅。取消后，您仍可以使用服务直到当前计费周期结束。
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">支持退款吗？</h3>
              <p className="text-gray-400 text-sm">
                我们提供 7 天无理由退款保证。如果您对服务不满意，请联系客服申请退款。
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">如何升级/降级？</h3>
              <p className="text-gray-400 text-sm">
                您可以随时在账户设置中更改计划。升级立即生效，降级将在当前计费周期结束后生效。
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">支持哪些支付方式？</h3>
              <p className="text-gray-400 text-sm">
                我们支持微信支付、支付宝、银联卡以及国际信用卡（Visa、Mastercard）。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}