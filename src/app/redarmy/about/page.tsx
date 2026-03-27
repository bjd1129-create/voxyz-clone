'use client'

export default function AboutPage() {
  const teamMembers = [
    {
      name: '红军队长',
      role: '创始人 & CEO',
      bio: '15年企业管理与商业咨询经验，曾服务于多家知名企业的战略转型项目',
      experience: '工商管理硕士，前500强企业高管',
      achievements: ['领导过50+企业转型项目', '拥有10项管理创新专利', '发表商业管理论文20余篇']
    },
    {
      name: '战略专家',
      role: '首席战略官',
      bio: '资深战略规划专家，擅长企业中长期发展规划与市场定位',
      experience: '经济学博士，曾任知名咨询公司合伙人',
      achievements: ['服务过200+家企业', '制定过多个行业标杆战略', '出版战略管理专著3部']
    },
    {
      name: '运营总监',
      role: '首席运营官',
      bio: '运营管理专家，专注于业务流程优化与效率提升',
      experience: '工业工程硕士，精益管理认证专家',
      achievements: ['帮助客户平均提升效率40%', '设计过多个行业标杆流程', '培训管理者超过1000人次']
    }
  ];

  const stats = [
    { value: '500+', label: '服务客户' },
    { value: '50+', label: '专家团队' },
    { value: '15+', label: '行业经验' },
    { value: '98%', label: '客户满意度' }
  ];

  return (
    <div className="min-h-screen py-12 px-6" style={{
      background: 'linear-gradient(180deg, #8B0000 0%, #A52A2A 50%, #8B0000 100%)',
      color: '#fff'
    }}>
      <div className="max-w-6xl mx-auto">
        {/* 顶部介绍 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradient 3s ease infinite'
          }}>
            关于红军商业服务
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            我们是一支专业的商业服务团队，致力于为企业提供全方位的解决方案，助力企业实现可持续增长
          </p>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-2xl border border-red-900/30" 
              style={{ background: 'rgba(255, 255, 255, 0.03)' }}
            >
              <div className="text-3xl font-bold text-yellow-300 mb-2">{stat.value}</div>
              <div className="text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 我们的使命 */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-yellow-200">我们的使命</h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              通过专业的商业服务，赋能企业实现可持续增长，成为客户最值得信赖的商业伙伴
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-red-900/30" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">战略导向</h3>
              <p className="text-white/70">
                以战略为引领，帮助企业明确发展方向，制定切实可行的增长路径
              </p>
            </div>
            
            <div className="p-6 rounded-2xl border border-red-900/30" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3">高效执行</h3>
              <p className="text-white/70">
                注重执行效率，确保每一个战略都能转化为实际的业务成果
              </p>
            </div>
            
            <div className="p-6 rounded-2xl border border-red-900/30" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3">长期合作</h3>
              <p className="text-white/70">
                致力于建立长期合作关系，与客户共同成长，共创价值
              </p>
            </div>
          </div>
        </div>

        {/* 核心价值观 */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-yellow-200">核心价值观</h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              我们坚持的核心理念指导着我们的每一个行动和决策
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '💡', title: '创新', desc: '持续创新思维，引领行业发展' },
              { icon: '💎', title: '专业', desc: '精益求精，追求卓越品质' },
              { icon: '🤝', title: '诚信', desc: '诚实守信，建立信任关系' },
              { icon: '🚀', title: '高效', desc: '快速响应，高效执行' }
            ].map((value, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl border border-red-900/30 text-center" 
                style={{ background: 'rgba(255, 255, 255, 0.03)' }}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                <p className="text-sm text-white/70">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 团队介绍 */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-yellow-200">核心团队</h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              我们的专家团队拥有丰富的行业经验和专业知识
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="rounded-2xl border border-red-900/30 overflow-hidden" 
                style={{ background: 'rgba(255, 255, 255, 0.03)' }}
              >
                <div className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl" 
                         style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)' }}>
                      👨‍💼
                    </div>
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-yellow-300">{member.role}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-white/70 text-sm">{member.bio}</p>
                    
                    <div>
                      <h4 className="text-xs font-medium text-white/60 mb-2">教育背景</h4>
                      <p className="text-sm text-white/70">{member.experience}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-white/60 mb-2">主要成就</h4>
                      <ul className="space-y-1">
                        {member.achievements.map((achievement, idx) => (
                          <li key={idx} className="text-sm text-white/70 flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 发展历程 */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-yellow-200">发展历程</h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              从创立至今，我们不断成长，服务更多客户
            </p>
          </div>
          
          <div className="relative">
            {/* 时间轴线 */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ background: 'linear-gradient(to bottom, #FFD700, #FFA500)' }}></div>
            
            <div className="space-y-12 pl-12">
              {[
                { year: '2015', title: '公司成立', desc: '红军商业服务正式成立，专注于企业咨询服务' },
                { year: '2017', title: '业务扩展', desc: '扩展服务范围，增加项目开发和战略规划服务' },
                { year: '2019', title: '团队壮大', desc: '团队扩展至50人，服务客户超过100家' },
                { year: '2021', title: '数字化转型', desc: '启动数字化转型服务，帮助传统企业升级' },
                { year: '2023', title: '全国布局', desc: '在北京、上海、深圳设立办事处，服务全国客户' },
                { year: '2025', title: '国际化发展', desc: '开始拓展海外市场，服务全球客户' }
              ].map((milestone, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-10 top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black" 
                       style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}>
                    {milestone.year}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{milestone.title}</h3>
                    <p className="text-white/70">{milestone.desc}</p>
                  </div>
                </div>
              ))}
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