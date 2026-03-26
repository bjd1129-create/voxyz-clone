'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Sparkles, Loader2 } from 'lucide-react'

export default function VaultPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    setSubmitted(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen p-6 flex flex-col items-center justify-center">
      <div className="max-w-lg w-full text-center">
        <div className="flex items-center justify-between mb-8 w-full">
          <Link href="/zh" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
          <Link href="/vault" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
            EN / 中文
          </Link>
        </div>

        {submitted ? (
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold">注册成功！</h1>
            <p className="text-gray-400">
              您已成功加入等候列表。我们将尽快发送内测邀请。
              请查收邮件确认。
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-4">加入等候列表</h1>
            <p className="text-gray-400 mb-8">
              成为第一批体验 OpenClaw AI 团队的用户。
              我们将邀请您参与内测，共同构建 AI 协作的未来。
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入您的邮箱"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    提交中...
                  </>
                ) : (
                  '加入等候列表'
                )}
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-4">
              🎁 早期支持者将获得专属福利
            </p>
          </>
        )}
      </div>
    </main>
  )
}