'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

interface AuthFormProps {
  mode: 'login' | 'register'
  onSuccess?: (user: { id: string; email: string }) => void
  onToggleMode?: () => void
}

export function AuthForm({ mode, onSuccess, onToggleMode }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase not configured')
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      if (mode === 'register') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        })

        if (signUpError) throw signUpError

        if (data.user && !data.session) {
          setMessage('注册成功！请检查您的邮箱以确认账户。')
        } else if (data.user) {
          onSuccess?.({ id: data.user.id, email: data.user.email || email })
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) throw signInError

        if (data.user) {
          onSuccess?.({ id: data.user.id, email: data.user.email || email })
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-white">
          {mode === 'login' ? '登录' : '创建账户'}
        </h2>

        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-400/10 rounded-lg">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 text-sm text-green-400 bg-green-400/10 rounded-lg">
            {message}
          </div>
        )}

        {mode === 'register' && (
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
              姓名
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="您的姓名"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            邮箱
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            密码
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="至少 8 个字符"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
        </button>

        {onToggleMode && (
          <p className="text-center text-gray-400 text-sm">
            {mode === 'login' ? '还没有账户？' : '已有账户？'}
            <button
              type="button"
              onClick={onToggleMode}
              className="ml-1 text-purple-400 hover:text-purple-300"
            >
              {mode === 'login' ? '立即注册' : '立即登录'}
            </button>
          </p>
        )}
      </form>
    </div>
  )
}