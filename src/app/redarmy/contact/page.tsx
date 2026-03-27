'use client'

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 实现表单提交逻辑
    alert(`感谢您的咨询！我们会尽快联系您。\n\n姓名: ${formData.name}\n邮箱: ${formData.email}\n公司: ${formData.company}`);
    setFormData({ name: '', email: '', phone: '', company: '', message: '' });
  };

  const contactMethods = [
    {
      icon: '📧',
      title: '商务合作邮箱',
      detail: 'business@redarmy-service.com',
      description: '发送详细需求和合作意向'
    },
    {
      icon: '📞',
      title: '24小时热线',
      detail: '+86 138-0000-0000',
      description: '随时接听您的咨询和紧急需求'
    },
    {
      icon: '🏢',
      title: '办公地址',
      detail: '北京市朝阳区xxx大厦',
      description: '欢迎预约现场交流与参观'
    },
    {
      icon: '💬',
      title: '在线客服',
      detail: 'QQ: 123456789',
      description: '即时沟通，快速响应'
    }
  ];

  return (
    <div className="min-h-screen py-12 px-6" style={{
      background: 'linear-gradient(180deg, #8B0000 0%, #A52A2A 50%, #8B0000 100%)',
      color: '#fff'
    }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradient 3s ease infinite'
          }}>
            联系我们
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            我们期待与您合作，共同推动业务增长和发展
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* 联系表单 */}
          <div className="rounded-2xl border border-red-900/30 p-8" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
            <h2 className="text-2xl font-bold mb-6 text-yellow-200">发送咨询信息</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-white/80">姓名 *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg text-sm border border-red-900/30 bg-white/5 focus:outline-none focus:border-yellow-500/50 text-white placeholder-white/50 transition-colors"
                    placeholder="请输入您的姓名"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2 text-white/80">公司名称</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg text-sm border border-red-900/30 bg-white/5 focus:outline-none focus:border-yellow-500/50 text-white placeholder-white/50 transition-colors"
                    placeholder="请输入公司名称"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-white/80">邮箱 *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg text-sm border border-red-900/30 bg-white/5 focus:outline-none focus:border-yellow-500/50 text-white placeholder-white/50 transition-colors"
                    placeholder="请输入您的邮箱"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2 text-white/80">电话</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg text-sm border border-red-900/30 bg-white/5 focus:outline-none focus:border-yellow-500/50 text-white placeholder-white/50 transition-colors"
                    placeholder="请输入您的电话"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-white/80">咨询内容 *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg text-sm border border-red-900/30 bg-white/5 focus:outline-none focus:border-yellow-500/50 text-white placeholder-white/50 transition-colors resize-none"
                  placeholder="请详细描述您的需求或问题..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full py-3 rounded-lg text-sm font-medium text-black"
                style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}
              >
                提交咨询
              </button>
            </form>
          </div>

          {/* 联系方式 */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-yellow-200">其他联系方式</h2>
            
            <div className="space-y-6 mb-12">
              {contactMethods.map((method, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-2xl border border-red-900/30 hover:border-yellow-500/50 transition-all" 
                  style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl p-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)' }}>
                      {method.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">{method.title}</h3>
                      <p className="text-yellow-300 text-lg font-medium mb-2">{method.detail}</p>
                      <p className="text-sm text-white/60">{method.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 工作时间 */}
            <div className="rounded-2xl border border-red-900/30 p-6" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
              <h3 className="text-lg font-bold mb-4 text-yellow-200">工作时间</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/80">周一至周五</span>
                  <span className="text-yellow-300">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">周六</span>
                  <span className="text-yellow-300">10:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">周日及节假日</span>
                  <span className="text-yellow-300">紧急事务处理</span>
                </div>
              </div>
              <p className="text-xs text-white/50 mt-4">* 紧急需求可通过热线联系，我们将第一时间响应</p>
            </div>
          </div>
        </div>

        {/* 地图区域（占位） */}
        <div className="mt-16 rounded-2xl border border-red-900/30 overflow-hidden" style={{ height: '400px', background: 'rgba(255, 255, 255, 0.03)' }}>
          <div className="h-full flex items-center justify-center text-white/60">
            <div className="text-center">
              <div className="text-5xl mb-4">📍</div>
              <p className="text-lg">我们的位置</p>
              <p className="text-sm mt-2">北京市朝阳区xxx大厦 - 欢迎预约来访</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}