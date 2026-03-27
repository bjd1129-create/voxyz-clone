'use client'

export default function ServicesPage() {
  const services = [
    {
      id: 'consulting',
      title: '商业咨询',
      subtitle: 'Business Consulting',
      description: '提供专业的商业策略咨询，帮助企业制定发展方向和增长策略',
      features: [
        '市场调研与分析',
        '竞争对手研究',
        '商业模式优化',
        '发展策略制定',
        '风险评估与应对',
        '投资机会分析'
      ],
      icon: '💼',
      duration: '根据项目复杂度',
      price: '面议'
    },
    {
      id: 'development',
      title: '项目开发',
      subtitle: 'Project Development',
      description: '从概念到实施的全流程项目管理，确保项目按时按质完成',
      features: [
        '项目策划与管理',
        '团队组建与协调',
        '进度监控与报告',
        '质量保证与验收',
        '资源调配与优化',
        '风险管理与控制'
      ],
      icon: '🚀',
      duration: '根据项目规模',
      price: '按项目报价'
    },
    {
      id: 'strategy',
      title: '战略规划',
      subtitle: 'Strategic Planning',
      description: '为企业制定长远发展规划，明确未来发展方向和目标',
      features: [
        '企业愿景规划',
        '长期目标设定',
        '发展路径设计',
        '资源配置策略',
        '组织架构优化',
        '绩效管理体系'
      ],
      icon: '🎯',
      duration: '3-6个月',
      price: '面议'
    },
    {
      id: 'analysis',
      title: '市场分析',
      subtitle: 'Market Analysis',
      description: '深入的市场洞察和数据分析，为决策提供科学依据',
      features: [
        '行业趋势分析',
        '消费者行为研究',
        '竞品分析',
        '市场规模测算',
        '渠道策略建议',
        '定价策略分析'
      ],
      icon: '📊',
      duration: '2-4周',
      price: '面议'
    },
    {
      id: 'optimization',
      title: '业务优化',
      subtitle: 'Business Optimization',
      description: '识别并改进业务流程中的瓶颈和低效环节',
      features: [
        '流程梳理与诊断',
        '效率提升方案',
        '成本控制策略',
        '数字化转型',
        '供应链优化',
        '质量管理体系'
      ],
      icon: '⚡',
      duration: '1-3个月',
      price: '面议'
    },
    {
      id: 'support',
      title: '技术支持',
      subtitle: 'Technical Support',
      description: '为企业提供专业的技术解决方案和实施支持',
      features: [
        '系统架构设计',
        '技术选型咨询',
        '软件开发支持',
        '数据迁移服务',
        '安全评估',
        '运维支持'
      ],
      icon: '🛠️',
      duration: '按需定制',
      price: '按服务周期'
    }
  ]

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
            我们的服务项目
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            红军商业服务提供全方位的解决方案，满足不同企业的发展需求
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id}
              className="rounded-2xl border border-red-900/30 hover:border-yellow-500/50 transition-all overflow-hidden"
              style={{ background: 'rgba(255, 255, 255, 0.03)' }}
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl p-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)' }}>
                    {service.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-1">{service.title}</h2>
                    <p className="text-sm text-white/60">{service.subtitle}</p>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6">{service.description}</p>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3 text-yellow-300">服务内容</h3>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                        <span className="text-white/70">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-red-900/30">
                  <div>
                    <div className="text-xs text-white/50">预计周期</div>
                    <div className="text-sm font-medium">{service.duration}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/50">价格</div>
                    <div className="text-sm font-medium text-yellow-300">{service.price}</div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-yellow-500/10 border-t border-red-900/20">
                <button className="w-full py-2 text-center text-sm font-medium text-yellow-200 hover:text-yellow-300 transition-colors">
                  了解更多 →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-yellow-500/30" style={{ background: 'rgba(255, 215, 0, 0.05)' }}>
            <span className="text-yellow-300">❓</span>
            <span className="text-white/80">需要定制化解决方案？</span>
            <a href="/redarmy/contact" className="text-yellow-300 hover:underline ml-2">联系我们</a>
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