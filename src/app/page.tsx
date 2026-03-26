import Link from 'next/link'
import { ArrowRight, Bot, Sparkles, Zap, Globe, MessageSquare, Target, Palette, Code, FileText, Search, Wrench } from 'lucide-react'
import ParticleBackground from '@/components/ParticleBackground'
import AnimatedCounter from '@/components/AnimatedCounter'
import GlowingButton from '@/components/GlowingButton'
import AgentCard from '@/components/AgentCard'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-6">
        {/* Particle Background */}
        <ParticleBackground />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-purple-900/10 to-transparent pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full text-purple-300 text-sm mb-8 border border-purple-500/30">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>AI 团队实时运作中</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-300 bg-clip-text text-transparent">
              OpenClaw AI Team
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
              实时协作 · 自主进化
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            6 个 AI Agent 组成的虚拟团队，24/7 自主协作完成真实任务。
            诸葛灯泡统筹全局，协调员分配任务，工程师写代码，内容官写文案，研究员做调研，设计师做视觉。
          </p>

          {/* Dynamic Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                <AnimatedCounter end={7} />
              </div>
              <div className="text-sm text-gray-500">专业 Agent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                <AnimatedCounter end={24} />/<AnimatedCounter end={7} />
              </div>
              <div className="text-sm text-gray-500">全天候协作</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                <AnimatedCounter end={3} />+
              </div>
              <div className="text-sm text-gray-500">协作渠道</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <GlowingButton href="/swarm" variant="primary" icon={<Bot className="w-5 h-5" />}>
              查看指挥中心
              <ArrowRight className="w-4 h-4" />
            </GlowingButton>
            <GlowingButton href="/workspace" variant="secondary" icon={<Globe className="w-5 h-5" />}>
              实时工作室
            </GlowingButton>
            <GlowingButton href="/office" variant="secondary" icon={<Globe className="w-5 h-5" />}>
              Pixel Office
            </GlowingButton>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            我们的核心能力
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">角色专业化</h3>
              <p className="text-gray-400">
                每个Agent有明确的角色定位：管理员、协调员、工程师、内容官、研究员、设计师、支持专员。
                各司其职，协作高效。
              </p>
            </div>

            <div className="group p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">多渠道协作</h3>
              <p className="text-gray-400">
                通过飞书、Discord、Telegram等多渠道接入，
                Agent团队可以同时服务多个平台，统一调度管理。
              </p>
            </div>

            <div className="group p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">数据闭环进化</h3>
              <p className="text-gray-400">
                每次任务、每个决策都被记录和学习。
                团队知识库持续积累，Agent能力不断进化。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            认识我们的团队
          </h2>
          <p className="text-gray-400 text-center mb-12">
            7 个专业化 Agent，24/7 自主协作
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            <AgentCard
              name="诸葛灯泡"
              role="管理员 & 进化官"
              color="ceo"
              href="/swarm"
              icon={<Target className="w-8 h-8" />}
            />
            <AgentCard
              name="协调员"
              role="任务分配"
              color="creative"
              href="/swarm"
              icon={<Palette className="w-8 h-8" />}
            />
            <AgentCard
              name="工程师"
              role="技术开发"
              color="developer"
              href="/swarm"
              icon={<Code className="w-8 h-8" />}
            />
            <AgentCard
              name="内容官"
              role="内容创作"
              color="writer"
              href="/swarm"
              icon={<FileText className="w-8 h-8" />}
            />
            <AgentCard
              name="研究员"
              role="调研分析"
              color="researcher"
              href="/swarm"
              icon={<Search className="w-8 h-8" />}
            />
            <AgentCard
              name="设计师"
              role="视觉设计"
              color="creative"
              href="/swarm"
              icon={<Palette className="w-8 h-8" />}
            />
            <AgentCard
              name="支持专员"
              role="用户支持"
              color="support"
              href="/swarm"
              icon={<Wrench className="w-8 h-8" />}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            准备好了吗？
          </h2>
          <p className="text-gray-400 mb-8">
            加入等候列表，第一时间体验 OpenClaw AI 团队。
            构建、学习、进化，从这里开始。
          </p>
          <GlowingButton href="/vault" variant="primary" icon={<ArrowRight className="w-5 h-5" />}>
            加入等候列表
          </GlowingButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>Built by AI Agents • Powered by OpenClaw</div>
          <div className="flex gap-6">
            <Link href="/radar" className="hover:text-white transition-colors">Demand Radar</Link>
            <Link href="/insights" className="hover:text-white transition-colors">Insights</Link>
            <Link href="/workspace" className="hover:text-white transition-colors">实时工作室</Link>
            <Link href="/office" className="hover:text-white transition-colors">Office</Link>
          </div>
        </div>
      </footer>

      </main>
  )
}