'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, Check, Loader2, QrCode, CreditCard, Github, Mail, User, MessageSquare } from 'lucide-react'

// Product types
const PRODUCTS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 299,
    currency: '¥',
    description: '适合个人开发者',
    features: ['10 个 AI Agent', 'GitHub 私有仓库访问', '飞书支持群组', '基础文档'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 799,
    currency: '¥',
    description: '适合小团队',
    features: ['所有 Starter 功能', '优先技术支持', '高级 Agent 模板', '月度更新优先权'],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    currency: '',
    description: '适合企业定制',
    features: ['所有 Pro 功能', '专属客户经理', '定制化开发', 'SLA 保障'],
  },
]

interface FormData {
  product: string
  name: string
  email: string
  githubUsername: string
  notes: string
  paymentScreenshot: File | null
}

interface FormErrors {
  product?: string
  name?: string
  email?: string
  githubUsername?: string
  paymentScreenshot?: string
}

export default function BuyPage() {
  const [formData, setFormData] = useState<FormData>({
    product: '',
    name: '',
    email: '',
    githubUsername: '',
    notes: '',
    paymentScreenshot: null,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.product) {
      newErrors.product = '请选择一个产品'
    }

    if (!formData.name.trim()) {
      newErrors.name = '请输入您的姓名'
    }

    if (!formData.email.trim()) {
      newErrors.email = '请输入您的邮箱'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }

    if (!formData.githubUsername.trim()) {
      newErrors.githubUsername = '请输入您的 GitHub 用户名'
    }

    if (!formData.paymentScreenshot) {
      newErrors.paymentScreenshot = '请上传支付截图'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle file upload
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, paymentScreenshot: '请上传图片文件 (JPG/PNG)' }))
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, paymentScreenshot: '图片大小不能超过 10MB' }))
      return
    }

    setFormData(prev => ({ ...prev, paymentScreenshot: file }))
    setErrors(prev => ({ ...prev, paymentScreenshot: undefined }))

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [handleFile])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('product', formData.product)
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('githubUsername', formData.githubUsername)
      formDataToSend.append('notes', formData.notes)
      if (formData.paymentScreenshot) {
        formDataToSend.append('paymentScreenshot', formData.paymentScreenshot)
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '提交失败，请重试')
      }

      setIsSuccess(true)
    } catch (error) {
      alert(error instanceof Error ? error.message : '提交失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">提交成功！</h1>
          <p className="text-gray-400 mb-6">
            我们已收到您的订单，将在 24 小时内完成审核。审核通过后，您将收到：
          </p>
          <div className="bg-white/5 rounded-xl p-4 text-left space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <Github className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-white font-medium">GitHub 仓库邀请</p>
                <p className="text-gray-500 text-sm">发送到您的 GitHub 账号</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-white font-medium">确认邮件</p>
                <p className="text-gray-500 text-sm">发送到您的邮箱</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <div className="pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            立即获取诸葛灯泡
          </h1>
          <p className="text-xl text-gray-400">
            10 个 AI Agent，24/7 为你工作
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 pb-20">
        {/* Product Selection */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">选择产品</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRODUCTS.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, product: product.id }))
                  setErrors(prev => ({ ...prev, product: undefined }))
                }}
                className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                  formData.product === product.id
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                {product.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
                    最受欢迎
                  </span>
                )}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.product === product.id
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-600'
                  }`}>
                    {formData.product === product.id && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  {product.price ? (
                    <span className="text-2xl font-bold text-white">
                      {product.currency}{product.price}
                    </span>
                  ) : (
                    <span className="text-2xl font-bold text-white">联系我们</span>
                  )}
                  {product.price && (
                    <span className="text-gray-500 text-sm ml-1">/终身</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
          {errors.product && (
            <p className="text-red-400 text-sm mt-2">{errors.product}</p>
          )}
        </div>

        {/* Contact Form */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">联系信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                姓名 <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                    setErrors(prev => ({ ...prev, name: undefined }))
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="您的姓名"
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                邮箱 <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, email: e.target.value }))
                    setErrors(prev => ({ ...prev, email: undefined }))
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                GitHub 用户名 <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={formData.githubUsername}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, githubUsername: e.target.value }))
                    setErrors(prev => ({ ...prev, githubUsername: undefined }))
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="your-github-username"
                />
              </div>
              {errors.githubUsername && (
                <p className="text-red-400 text-sm mt-1">{errors.githubUsername}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                备注 <span className="text-gray-500">(可选)</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="其他说明..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">支付方式</h2>
          
          {/* Amount Display */}
          {formData.product && (
            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">应付金额</span>
                <span className="text-2xl font-bold text-white">
                  {PRODUCTS.find(p => p.id === formData.product)?.price
                    ? `¥${PRODUCTS.find(p => p.id === formData.product)!.price}`
                    : '待确认'}
                </span>
              </div>
            </div>
          )}

          {/* QR Codes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* WeChat Pay */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">微</span>
                </div>
                <span className="text-white font-medium">微信支付</span>
              </div>
              <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center mb-3">
                {/* TODO: Replace with actual QR code */}
                <div className="text-center text-gray-500">
                  <QrCode className="w-24 h-24 mx-auto mb-2" />
                  <p className="text-sm">微信收款码</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">扫码支付后上传截图</p>
            </div>

            {/* Alipay */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">支</span>
                </div>
                <span className="text-white font-medium">支付宝</span>
              </div>
              <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center mb-3">
                {/* TODO: Replace with actual QR code */}
                <div className="text-center text-gray-500">
                  <QrCode className="w-24 h-24 mx-auto mb-2" />
                  <p className="text-sm">支付宝收款码</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">扫码支付后上传截图</p>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm">
            支付后请上传支付截图，我们将在 24 小时内完成审核
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">
            上传支付截图 <span className="text-red-400">*</span>
          </h2>
          
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragActive
                ? 'border-purple-500 bg-purple-500/10'
                : previewUrl
                ? 'border-green-500/50 bg-green-500/5'
                : 'border-white/20 hover:border-white/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
            />
            
            {previewUrl ? (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="支付截图预览"
                  className="max-h-64 mx-auto rounded-lg"
                />
                <p className="text-gray-400 text-sm">点击更换图片</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-gray-500 mx-auto" />
                <div>
                  <p className="text-white mb-1">拖拽图片到这里，或点击上传</p>
                  <p className="text-gray-500 text-sm">支持 JPG、PNG，最大 10MB</p>
                </div>
              </div>
            )}
          </div>
          {errors.paymentScreenshot && (
            <p className="text-red-400 text-sm mt-2">{errors.paymentScreenshot}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2 ${
            isSubmitting
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-purple-500 text-white hover:bg-purple-600'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              提交中...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              提交订单
            </>
          )}
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          提交即表示您同意我们的服务条款和隐私政策
        </p>
      </form>
    </div>
  )
}