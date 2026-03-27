'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SubscriptionManager } from '@/components/subscription/SubscriptionManager'

export default function SubscriptionPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    // Get user ID from token (simplified - in real app, decode JWT)
    fetch('/api/auth/session', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.id) {
          setUserId(data.user.id)
        } else {
          router.push('/auth/login')
        }
      })
      .catch(() => router.push('/auth/login'))
  }, [router])

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">账户设置</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <a
            href="/account/profile"
            className="px-4 py-3 text-gray-400 hover:text-white transition-colors"
          >
            个人资料
          </a>
          <a
            href="/account/subscription"
            className="px-4 py-3 text-purple-400 border-b-2 border-purple-400"
          >
            订阅管理
          </a>
        </div>

        <SubscriptionManager userId={userId} />
      </div>
    </div>
  )
}