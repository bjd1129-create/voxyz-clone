'use client'

import { useState } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')

  const handleSuccess = () => {
    router.push('/account/subscription')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">OpenClaw</h1>
          <p className="text-gray-400">AI 驱动的自动化平台</p>
        </div>

        <AuthForm
          mode={mode}
          onSuccess={handleSuccess}
          onToggleMode={() => setMode(mode === 'login' ? 'register' : 'login')}
        />

        {mode === 'login' && (
          <p className="text-center text-gray-400 text-sm mt-4">
            <a href="/auth/forgot-password" className="text-purple-400 hover:text-purple-300">
              忘记密码？
            </a>
          </p>
        )}
      </div>
    </div>
  )
}