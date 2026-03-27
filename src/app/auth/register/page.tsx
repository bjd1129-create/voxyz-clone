'use client'

import { AuthForm } from '@/components/auth/AuthForm'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/account/subscription')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">创建账户</h1>
          <p className="text-gray-400">开始您的 AI 自动化之旅</p>
        </div>

        <AuthForm
          mode="register"
          onSuccess={handleSuccess}
          onToggleMode={() => router.push('/auth/login')}
        />
      </div>
    </div>
  )
}