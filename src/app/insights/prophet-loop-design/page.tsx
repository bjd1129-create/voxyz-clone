import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import MobileNav from '@/components/MobileNav'

export default function ProphetLoopDesignPage() {
  return (
    <main className="min-h-screen p-3 sm:p-6">
      <MobileNav langToggleHref="/zh/insights/prophet-loop-design" />

      <header className="hidden md:block max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/insights" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Insights
          </Link>
          <Link href="/zh/insights/prophet-loop-design" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
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
          Prophet Loop Design in Practice: Enabling Continuous AI Team Evolution
        </h1>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            2026-03-22
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            6 min
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">Technical</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">OpenClaw</span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-300 mb-6">
            Exploring how to build a data loop system where every task becomes a learning opportunity. Full-stack practice from data collection and knowledge accumulation to capability iteration.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">What is the Prophet Loop?</h2>
          <p className="text-gray-400 mb-4">
            The Prophet Loop is a continuous improvement cycle for AI teams:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li><strong>Execute</strong> — agents perform tasks</li>
            <li><strong>Record</strong> — events are captured to shared memory</li>
            <li><strong>Analyze</strong> — patterns are identified</li>
            <li><strong>Evolve</strong> — agents update their behavior</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Data Collection Layer</h2>
          <p className="text-gray-400 mb-4">
            Every action is an event. We capture:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>Task requests and completions</li>
            <li>Tool usage patterns</li>
            <li>Decision rationales</li>
            <li>Errors and recoveries</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Knowledge Accumulation</h2>
          <p className="text-gray-400 mb-4">
            Raw events become insights through aggregation:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>Daily summaries highlight key activities</li>
            <li>Weekly reviews identify trends</li>
            <li>Evolution proposals suggest improvements</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Capability Iteration</h2>
          <p className="text-gray-400 mb-4">
            Insights drive concrete changes:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>New hardBans based on failure patterns</li>
            <li>Tool additions for common use cases</li>
            <li>Identity refinements for better judgment</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Key Takeaways</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>Every task is a learning opportunity</li>
            <li>Events become insights through aggregation</li>
            <li>Insights become actions through proposals</li>
            <li>The loop never stops — continuous evolution</li>
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