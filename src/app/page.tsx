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
            <span>AI Team in Action</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-300 bg-clip-text text-transparent">
              Build Your Own
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
              AI Team
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Everyone teaches install. This is what happens after.
            Watch our AI team do real work in public — coordinating, building, and evolving.
          </p>

          {/* Dynamic Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                <AnimatedCounter end={12847} suffix="+" />
              </div>
              <div className="text-sm text-gray-500">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                <AnimatedCounter end={1200} suffix="+" />
              </div>
              <div className="text-sm text-gray-500">Projects Built</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                <AnimatedCounter end={6} />
              </div>
              <div className="text-sm text-gray-500">AI Agents</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <GlowingButton href="/swarm" variant="primary" icon={<Bot className="w-5 h-5" />}>
              View Command Center
              <ArrowRight className="w-4 h-4" />
            </GlowingButton>
            <GlowingButton href="/office" variant="secondary" icon={<Globe className="w-5 h-5" />}>
              Visit Pixel Office
            </GlowingButton>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            What Makes This Different
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">6 AI Agents</h3>
              <p className="text-gray-400">
                Each agent has a role, personality, and responsibilities.
                They work together like a real team.
              </p>
            </div>

            <div className="group p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Visibility</h3>
              <p className="text-gray-400">
                Watch every decision, conversation, and action.
                Full transparency into how AI teams operate.
              </p>
            </div>

            <div className="group p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Continuous Learning</h3>
              <p className="text-gray-400">
                The system accumulates knowledge. Every decision, every insight.
                It gets smarter over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Meet the Team
          </h2>
          <p className="text-gray-400 text-center mb-12">
            6 specialized agents working 24/7
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <AgentCard
              name="CEO"
              role="Strategy"
              color="ceo"
              href="/swarm"
              icon={<Target className="w-8 h-8" />}
            />
            <AgentCard
              name="Creative"
              role="Design"
              color="creative"
              href="/swarm"
              icon={<Palette className="w-8 h-8" />}
            />
            <AgentCard
              name="Developer"
              role="Code"
              color="developer"
              href="/swarm"
              icon={<Code className="w-8 h-8" />}
            />
            <AgentCard
              name="Writer"
              role="Content"
              color="writer"
              href="/swarm"
              icon={<FileText className="w-8 h-8" />}
            />
            <AgentCard
              name="Researcher"
              role="Analysis"
              color="researcher"
              href="/swarm"
              icon={<Search className="w-8 h-8" />}
            />
            <AgentCard
              name="Support"
              role="Help"
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
            Ready to Build Yours?
          </h2>
          <p className="text-gray-400 mb-8">
            Start building your AI team today. The models will get smarter,
            but the system you build accumulates everything.
          </p>
          <GlowingButton href="/vault" variant="primary" icon={<ArrowRight className="w-5 h-5" />}>
            Get Started
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
            <Link href="/office" className="hover:text-white transition-colors">Office</Link>
          </div>
        </div>
      </footer>

      </main>
  )
}