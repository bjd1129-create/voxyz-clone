import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import MobileNav from '@/components/MobileNav'

export default function OpenClawAgentDevelopmentPage() {
  return (
    <main className="min-h-screen p-3 sm:p-6">
      <MobileNav langToggleHref="/zh/insights/openclaw-agent-development" />

      <header className="hidden md:block max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/insights" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Insights
          </Link>
          <Link href="/zh/insights/openclaw-agent-development" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
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
          OpenClaw Agent Development Experience: Roles, Tools & Collaboration
        </h1>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            2026-03-18
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            10 min
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">Development</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">Practice</span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-300 mb-6">
            Sharing practical experience in developing specialized Agents. How to define role personalities, select tool sets, design collaboration workflows, and lessons learned.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Starting Point: The SOUL.md</h2>
          <p className="text-gray-400 mb-4">
            Every agent starts with a SOUL.md file that defines:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li><strong>Name & Identity</strong> — who they are</li>
            <li><strong>Mission</strong> — what they're here to do</li>
            <li><strong>Personality</strong> — how they communicate</li>
            <li><strong>Relationships</strong> — who they work with</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Tool Selection</h2>
          <p className="text-gray-400 mb-4">
            Less is more. Each agent gets only the tools they need:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li><strong>Content Agent</strong> — write, edit, feishu_doc</li>
            <li><strong>Research Agent</strong> — web_search, web_fetch, browser</li>
            <li><strong>Code Agent</strong> — exec, read, write, edit</li>
            <li><strong>Design Agent</strong> — canvas, image</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Collaboration Patterns</h2>
          <p className="text-gray-400 mb-4">
            Agents don't work in isolation. We designed common patterns:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li><strong>Handoff</strong> — agent A completes, passes to agent B</li>
            <li><strong>Review</strong> — agent A creates, agent B reviews</li>
            <li><strong>Swarm</strong> — multiple agents work in parallel, merge results</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Lessons Learned</h2>
          <p className="text-gray-400 mb-4">
            After months of development, here's what we learned:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>Start with identity, not rules</li>
            <li>Limit tools to prevent confusion</li>
            <li>Design handoffs explicitly</li>
            <li>Shared memory is critical</li>
            <li>Heartbeat checks keep everyone aligned</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Common Mistakes</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>Overloading one agent with too many responsibilities</li>
            <li>Not defining clear handoff points</li>
            <li>Forgetting to update shared memory</li>
            <li>Too many tools leads to decision paralysis</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Key Takeaways</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>Identity &gt; Rules for agent behavior</li>
            <li>Minimal tool sets improve focus</li>
            <li>Explicit collaboration patterns prevent chaos</li>
            <li>Shared memory is the team's brain</li>
          </ul>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            *Related: <Link href="/insights/how-to-build-ai-team" className="text-white hover:underline">How to Build an AI Team</Link> | <Link href="/insights/more-rules-less-obedient" className="text-white hover:underline">The More Rules You Write</Link>*
          </p>
        </div>
      </article>
    </main>
  )
}