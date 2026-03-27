'use client'

import { UpdatePasswordForm } from '@/components/auth/UpdatePasswordForm'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export default function ResetPasswordPage() {
  const [isValid, setIsValid] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkSession() {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        setIsValid(false)
        return
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      const { data: { session } } = await supabase.auth.getSession()

      setIsValid(!!session)
    }

    checkSession()
  }, [])

  if (isValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">链接已过期</h2>
          <p className="text-gray-400 mb-4">请重新请求密码重置链接。</p>
          <a
            href="/auth/forgot-password"
            className="text-purple-400 hover:text-purple-300"
          >
            重新发送
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <UpdatePasswordForm />
    </div>
  )
}