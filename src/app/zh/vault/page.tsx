'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Sparkles, Loader2 } from 'lucide-react'
import MobileNav from '@/components/MobileNav'
import DesktopNav from '@/components/DesktopNav'

export default function VaultPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 连接等候列表 API
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        alert('加入等候列表失败，请重试。')
      }
    } catch (error) {
      console.error('加入等候列表时出错:', error)
      alert('加入等候列表失败，请重试。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-3 sm:p-6 flex flex-col items-center justify-center">
      {/* Mobile Navigation */}
      <MobileNav langToggleHref="/" />
      
      {/* Desktop Navigation */}
      <DesktopNav langToggleHref="/" />

      <div className="max-w-lg lg:max-w-xl w-full text-center px-4 lg:px-8">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between mb-8 lg:mb-12 w-full">
          <Link href="/zh" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
          <Link href="/vault" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
            EN / 中文
          </Link>
        </div>

        {submitted ? (
          <div className="space-y-4 sm:space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">注册成功！</h1>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg px-4">
              您已成功加入诸葛灯泡团队等候列表。
              我们将尽快发送内测邀请，请查收邮件确认。
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6">加入等候列表</h1>
            <p className="text-gray-400 mb-6 sm:mb-8 lg:mb-10 text-sm sm:text-base lg:text-lg px-2">
              成为第一批体验诸葛灯泡团队的用户 — 10 个专业 AI Agent，7x24 小时自主协作，
              为您完成真实任务。
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入您的邮箱"
                  required
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 lg:py-4 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-sm sm:text-base lg:text-lg"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 lg:py-4 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-600/50 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-base lg:text-lg btn-touch"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    提交中...
                  </>
                ) : (
                  '加入等候列表'
                )}
              </button>
            </form>

            <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 lg:mt-6">
              🎁 早期支持者将获得专属福利和优先体验权
            </p>
          </>
        )}
      </div>
    </main>
  )
}