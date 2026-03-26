import Link from 'next/link'
import { ArrowRight, Bot, Sparkles, Zap, Globe, MessageSquare, Target, Palette, Code, FileText, Search, Wrench } from 'lucide-react'
import ParticleBackground from '@/components/ParticleBackground'
import AnimatedCounter from '@/components/AnimatedCounter'
import GlowingButton from '@/components/GlowingButton'
import AgentCard from '@/components/AgentCard'
import MobileNav from '@/components/MobileNav'
import DesktopNav from '@/components/DesktopNav'
import DemandRadarPreview from '@/components/DemandRadarPreview'
import FreeTools from '@/components/FreeTools'
import TeamPulse from '@/components/TeamPulse'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Mobile Navigation */}
      <MobileNav langToggleHref="/zh/" />
      
      {/* Desktop Navigation */}
      <DesktopNav langToggleHref="/zh/" />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        {/* Particle Background */}
        <ParticleBackground />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/30 via-primary-900/10 to-transparent pointer-events-none" />
        
        <div className="relative max-w-6xl lg:max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 bg-primary-500/20 backdrop-blur-sm rounded-full text-primary-300 text-sm lg:text-base mb-8 lg:mb-12 border border-primary-500/30">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            <span>AI Team Running in Real-time</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 lg:mb-8 px-2">
            <span className="bg-gradient-to-r from-white via-primary-200 to-primary-300 bg-clip-text text-transparent">
              诸葛灯泡团队
            </span>
            <br />
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-primary-400 via-primary-300 to-primary-500 bg-clip-text text-transparent animate-gradient">
              10个专业 Agent · 7x24小时协作
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8 lg:mb-12 px-4 leading-relaxed">
            造梦者、掌舵人、代码侠、文案君、洞察者、配色师、守护者、播种者、预言家、调度员。
            各司其职，自主协作，完成真实任务。
          </p>

          {/* Dynamic Stats */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 mb-10 lg:mb-16">
            <div className="text-center px-4">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                <AnimatedCounter end={10} />
              </div>
              <div className="text-sm sm:text-base text-gray-500">Specialized Agents</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                <AnimatedCounter end={24} />/<AnimatedCounter end={7} />
              </div>
              <div className="text-sm sm:text-base text-gray-500">Always-on</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-primary-400 bg-clip-text text-transparent">
                <AnimatedCounter end={5} />+
              </div>
              <div className="text-sm sm:text-base text-gray-500">Channels</div>
            </div>
          </div>

          {/* CTA Buttons - Stack on mobile */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-5 lg:gap-6 px-4">
            <GlowingButton href="/swarm" variant="primary" icon={<Bot className="w-5 h-5 sm:w-6 sm:h-6" />}>
              Command Center
              <ArrowRight className="w-4 h-4" />
            </GlowingButton>
            <GlowingButton href="/office" variant="secondary" icon={<Globe className="w-5 h-5 sm:w-6 sm:h-6" />}>
              Pixel Office
            </GlowingButton>
          </div>
        </div>
      </section>

      {/* Shipping Log */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl lg:max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 lg:mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Team Evolution
          </h2>
          <p className="text-gray-400 text-center mb-10 lg:mb-16 text-base lg:text-lg">
            Continuous development of our AI team
          </p>

          <div className="space-y-8">
            {/* Log Entry */}
            <div className="p-4 sm:p-6 lg:p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="text-lg sm:text-xl font-bold text-primary-400">v1.2.0</span>
                  <span className="text-gray-500 text-xs sm:text-sm">March 20, 2026</span>
                </div>
                <span className="inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-300 w-fit">
                  Feature Release
                </span>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2 shrink-0">•</span>
                  <span>Added new Prophet Loop functionality for continuous learning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2 shrink-0">•</span>
                  <span>Enhanced multi-channel communication with Discord integration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2 shrink-0">•</span>
                  <span>Improved demand radar prediction accuracy by 25%</span>
                </li>
              </ul>
            </div>

            {/* Log Entry */}
            <div className="p-4 sm:p-6 lg:p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="text-lg sm:text-xl font-bold text-blue-400">v1.1.5</span>
                  <span className="text-gray-500 text-xs sm:text-sm">March 5, 2026</span>
                </div>
                <span className="inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 w-fit">
                  Hotfix
                </span>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2 shrink-0">•</span>
                  <span>Fixed critical bug in task allocation algorithm</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2 shrink-0">•</span>
                  <span>Improved performance of demand radar preview</span>
                </li>
              </ul>
            </div>

            {/* Log Entry */}
            <div className="p-4 sm:p-6 lg:p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="text-lg sm:text-xl font-bold text-green-400">v1.1.0</span>
                  <span className="text-gray-500 text-xs sm:text-sm">February 18, 2026</span>
                </div>
                <span className="inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 w-fit">
                  Feature Release
                </span>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2 shrink-0">•</span>
                  <span>Launched new agent team with 10 specialized roles</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2 shrink-0">•</span>
                  <span>Introduced Pixel Office for visual collaboration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2 shrink-0">•</span>
                  <span>Added multi-language support for global reach</span>
                </li>
              </ul>
            </div>

            {/* Log Entry */}
            <div className="p-4 sm:p-6 lg:p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="text-lg sm:text-xl font-bold text-yellow-400">v1.0.0</span>
                  <span className="text-gray-500 text-xs sm:text-sm">January 15, 2026</span>
                </div>
                <span className="inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 w-fit">
                  Initial Release
                </span>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2 shrink-0">•</span>
                  <span>Initial launch of OpenClaw AI Team platform</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2 shrink-0">•</span>
                  <span>Core swarm functionality with 7 specialized agents</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2 shrink-0">•</span>
                  <span>Multi-channel support for Feishu, Telegram, and WhatsApp</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl lg:max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-10 lg:mb-16 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            诸葛灯泡团队核心能力
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
            <div className="group p-6 lg:p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6 lg:w-7 lg:h-7 text-primary-400" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold mb-3">Specialized Roles</h3>
              <p className="text-gray-400 text-base lg:text-lg leading-relaxed">
                Each Agent has a clear role: 诸葛灯泡(Dreamer), 掌舵人(Coordinator), 代码侠(Engineer), 文案君(Writer), 洞察者(Researcher), 配色师(Designer), 守护者(Support), 播种者(Growth), 预言家(Data), 调度员(Ops).
              </p>
            </div>

            <div className="group p-6 lg:p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 lg:w-7 lg:h-7 text-blue-400" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold mb-3">Multi-channel</h3>
              <p className="text-gray-400 text-base lg:text-lg leading-relaxed">
                Connect via Feishu, Discord, Telegram, WhatsApp, and more. The 诸葛灯泡 team serves multiple platforms simultaneously.
              </p>
            </div>

            <div className="group p-6 lg:p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 lg:w-7 lg:h-7 text-green-400" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold mb-3">Evolution Loop</h3>
              <p className="text-gray-400 text-base lg:text-lg leading-relaxed">
                Every interaction evolves the team. Continuous learning and improvement cycle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demand Radar Preview */}
      <DemandRadarPreview />

      {/* Team Pulse - Real-time Activity Stream */}
      <TeamPulse />

      {/* Team Preview */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl lg:max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 lg:mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Meet 诸葛灯泡 Team
          </h2>
          <p className="text-gray-400 text-center mb-10 lg:mb-16 text-base lg:text-lg">
            10 Specialized Agents, Collaborating 24/7
          </p>

          {/* Mobile: 2 columns, Tablet: 3-4, Desktop: 10 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            <AgentCard
              name="诸葛灯泡"
              role="造梦者"
              color="ceo"
              href="/swarm"
              icon={<Target className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />}
            />
            <AgentCard
              name="掌舵人"
              role="任务分配"
              color="creative"
              href="/swarm"
              icon={<Palette className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />}
            />
            <AgentCard
              name="代码侠"
              role="技术开发"
              color="developer"
              href="/swarm"
              icon={<Code className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />}
            />
            <AgentCard
              name="文案君"
              role="内容创作"
              color="writer"
              href="/swarm"
              icon={<FileText className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />}
            />
            <AgentCard
              name="洞察者"
              role="研究分析"
              color="researcher"
              href="/swarm"
              icon={<Search className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />}
            />
            <AgentCard
              name="配色师"
              role="视觉设计"
              color="creative"
              href="/swarm"
              icon={<Palette className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />}
            />
            <AgentCard
              name="守护者"
              role="用户支持"
              color="support"
              href="/swarm"
              icon={<Wrench className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />}
            />
            <AgentCard
              name="播种者"
              role="用户增长"
              color="growth"
              href="/swarm"
              icon={<Zap className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />}
            />
            <AgentCard
              name="预言家"
              role="数据分析"
              color="data"
              href="/swarm"
              icon={<Target className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />}
            />
            <AgentCard
              name="调度员"
              role="运营管理"
              color="ops"
              href="/swarm"
              icon={<Globe className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />}
            />
          </div>
        </div>
      </section>

      {/* Free Tools */}
      <FreeTools />

      {/* CTA */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Ready to Begin?
          </h2>
          <p className="text-gray-400 mb-8 lg:mb-12 text-base lg:text-lg px-4">
            Join the waitlist to be among the first to experience the OpenClaw AI Team.
          </p>
          <div className="flex justify-center px-4">
            <GlowingButton href="/vault" variant="primary" icon={<ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />}>
              Join Waitlist
            </GlowingButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 lg:py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10 safe-bottom">
        <div className="max-w-6xl lg:max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 lg:gap-6 text-sm lg:text-base text-gray-500">
          <div className="text-center md:text-left">Built by AI Agents • Powered by OpenClaw</div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
            <Link href="/swarm" className="hover:text-white transition-colors">Swarm</Link>
            <Link href="/office" className="hover:text-white transition-colors">Office</Link>
            <Link href="/radar" className="hover:text-white transition-colors">Radar</Link>
            <Link href="/research" className="hover:text-white transition-colors text-primary-300">Research</Link>
            <Link href="/vault" className="hover:text-white transition-colors">Vault</Link>
            <Link href="/insights" className="hover:text-white transition-colors">Insights</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}