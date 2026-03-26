import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import MobileNav from '@/components/MobileNav'

export default function HowToBuildAITeamPage() {
  return (
    <main className="min-h-screen p-3 sm:p-6">
      <MobileNav langToggleHref="/zh/insights/how-to-build-ai-team" />

      <header className="hidden md:block max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/insights" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Insights
          </Link>
          <Link href="/zh/insights/how-to-build-ai-team" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
            EN / 中文
          </Link>
        </div>
      </header>

      <div className="md:hidden mb-4">
        <Link href="/insights" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <article className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          How to Build an AI Team: From Single Agent to Collaborative Network
        </h1>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            2026-03-25
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            8 min
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">Architecture</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">AI Agents</span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-300 mb-6">
            A deep dive into how OpenClaw organizes 7 specialized Agents into an efficient collaborative team. Including role definition, task assignment, knowledge sharing, and other core designs.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">The Single Agent Problem</h2>
          <p className="text-gray-400 mb-4">
            Most AI implementations start with one agent. One prompt. One context window. One set of tools.
          </p>
          <p className="text-gray-400 mb-4">
            This works for simple tasks. But as complexity grows, the single agent model breaks down:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>Context overflow — too much information for one window</li>
            <li>Skill dilution — generalist vs specialist trade-off</li>
            <li>Single point of failure — one agent goes down, everything stops</li>
            <li>No collaboration — no one to bounce ideas off</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">The Team Approach</h2>
          <p className="text-gray-400 mb-4">
            Instead of one super-agent, we built a team of specialists. Each agent has:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li><strong>Clear identity</strong> — who they are, what they stand for</li>
            <li><strong>Specific domain</strong> — content, research, code, design, support, ops</li>
            <li><strong>Dedicated tools</strong> — only the tools they need</li>
            <li><strong>Communication channels</strong> — how they talk to each other</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Role Definition</h2>
          <p className="text-gray-400 mb-4">
            We use a simple framework for each agent:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li><strong>Identity</strong> — "You are X, your job is Y"</li>
            <li><strong>hardBans</strong> — what you absolutely cannot do</li>
            <li><strong>Tools</strong> — what you can use to get the job done</li>
            <li><strong>Communication</strong> — who you report to, who you collaborate with</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Task Assignment</h2>
          <p className="text-gray-400 mb-4">
            Tasks flow through a coordinator agent (Pilot) who:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>Receives incoming requests</li>
            <li>Analyzes what skills are needed</li>
            <li>Dispatches to the right specialist</li>
            <li>Tracks completion and quality</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Knowledge Sharing</h2>
          <p className="text-gray-400 mb-4">
            All agents share a common memory system:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li><strong>SHARED_MEMORY.md</strong> — team announcements and decisions</li>
            <li><strong>TASKS.md</strong> — shared task queue</li>
            <li><strong>BOOTSTRAP.md</strong> — team onboarding document</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Key Takeaways</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>Specialists outperform generalists for complex work</li>
            <li>Clear roles prevent overlap and confusion</li>
            <li>Shared memory keeps everyone aligned</li>
            <li>Coordinator enables efficient task routing</li>
          </ul>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            *Related: <Link href="/insights/more-rules-less-obedient" className="text-white hover:underline">The More Rules You Write, The Less Your Agent Obeys</Link> | <Link href="/insights/radar-is-not-dashboard" className="text-white hover:underline">Radar Is Not a Dashboard</Link>*
          </p>
        </div>
      </article>
    </main>
  )
}