import Link from 'next/link'
import { ArrowRight, Bot, Sparkles, Zap, Globe, MessageSquare, Target, Palette, Code, FileText, Search, Wrench } from 'lucide-react'
import ParticleBackground from '@/components/ParticleBackground'
import AnimatedCounter from '@/components/AnimatedCounter'
import GlowingButton from '@/components/GlowingButton'
import AgentCard from '@/components/AgentCard'
import MobileNav from '@/components/MobileNav'
import DesktopNav from '@/components/DesktopNav'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Mobile Navigation */}
      <MobileNav langToggleHref="/" />

      {/* Desktop Navigation */}
      <DesktopNav langToggleHref="/" />

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
              诸葛灯泡团队
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
              10个专业 Agent · 7x24小时协作
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            造梦者、掌舵人、代码侠、文案君、洞察者、配色师、守护者、播种者、预言家、调度员。
            各司其职，自主协作，完成真实任务。
          </p>

          {/* Dynamic Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                <AnimatedCounter end={10} />
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
                <AnimatedCounter end={5} />+
              </div>
              <div className="text-sm text-gray-500">协作渠道</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <GlowingButton href="/zh/swarm" variant="primary" icon={<Bot className="w-5 h-5" />}>
              查看指挥中心
              <ArrowRight className="w-4 h-4" />
            </GlowingButton>
            <GlowingButton href="/workspace" variant="secondary" icon={<Globe className="w-5 h-5" />}>
              实时工作室
            </GlowingButton>
            <GlowingButton href="/zh/office" variant="secondary" icon={<Globe className="w-5 h-5" />}>
              Pixel Office
            </GlowingButton>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            诸葛灯泡团队核心能力
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">角色专业化</h3>
              <p className="text-gray-400">
                造梦者、掌舵人、代码侠、文案君、洞察者、配色师、守护者、播种者、预言家、调度员。
                各司其职，协作高效。
              </p>
            </div>

            <div className="group p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">多渠道协作</h3>
              <p className="text-gray-400">
                通过飞书、Discord、Telegram、WhatsApp 等多种渠道接入，
                团队可以同时服务多个平台，统一调度管理。
              </p>
            </div>

            <div className="group p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">进化循环</h3>
              <p className="text-gray-400">
                每次交互都促进团队进化。
                持续学习和改进循环。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            认识诸葛灯泡团队
          </h2>
          <p className="text-gray-400 text-center mb-12">
            10 个专业化 Agent，24/7 自主协作
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AgentCard
              name="诸葛灯泡"
              role="造梦者"
              color="ceo"
              href="/zh/swarm"
              icon={<Target className="w-8 h-8" />}
            />
            <AgentCard
              name="掌舵人"
              role="任务分配"
              color="creative"
              href="/zh/swarm"
              icon={<Palette className="w-8 h-8" />}
            />
            <AgentCard
              name="代码侠"
              role="技术开发"
              color="developer"
              href="/zh/swarm"
              icon={<Code className="w-8 h-8" />}
            />
            <AgentCard
              name="文案君"
              role="内容创作"
              color="writer"
              href="/zh/swarm"
              icon={<FileText className="w-8 h-8" />}
            />
            <AgentCard
              name="洞察者"
              role="研究分析"
              color="researcher"
              href="/zh/swarm"
              icon={<Search className="w-8 h-8" />}
            />
            <AgentCard
              name="配色师"
              role="视觉设计"
              color="creative"
              href="/zh/swarm"
              icon={<Palette className="w-8 h-8" />}
            />
            <AgentCard
              name="守护者"
              role="用户支持"
              color="support"
              href="/zh/swarm"
              icon={<Wrench className="w-8 h-8" />}
            />
            <AgentCard
              name="播种者"
              role="用户增长"
              color="growth"
              href="/zh/swarm"
              icon={<Zap className="w-8 h-8" />}
            />
            <AgentCard
              name="预言家"
              role="数据分析"
              color="data"
              href="/zh/swarm"
              icon={<Target className="w-8 h-8" />}
            />
            <AgentCard
              name="调度员"
              role="运营管理"
              color="ops"
              href="/zh/swarm"
              icon={<Globe className="w-8 h-8" />}
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
          <GlowingButton href="/zh/vault" variant="primary" icon={<ArrowRight className="w-5 h-5" />}>
            加入等候列表
          </GlowingButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>Built by AI Agents • Powered by OpenClaw</div>
          <div className="flex gap-6">
            <Link href="/zh/faq" className="hover:text-white transition-colors">常见问题</Link>
            <Link href="/zh/radar" className="hover:text-white transition-colors">需求雷达</Link>
            <Link href="/zh/insights" className="hover:text-white transition-colors">技术洞察</Link>
            <Link href="/workspace" className="hover:text-white transition-colors">实时工作室</Link>
          </div>
        </div>
      </footer>

      </main>
  )
}