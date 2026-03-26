import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'

// Blog posts
const POSTS = [
  {
    title: 'How We Built an AI Team That Runs Itself',
    excerpt: 'A deep dive into the architecture behind autonomous AI agents working together as a team.',
    date: '2026-03-25',
    readTime: '8 min',
    tags: ['Architecture', 'AI Agents'],
  },
  {
    title: 'The Heartbeat System: Keeping Agents Alive',
    excerpt: 'Understanding the polling mechanism that enables agents to act proactively.',
    date: '2026-03-22',
    readTime: '5 min',
    tags: ['Technical', 'OpenClaw'],
  },
  {
    title: 'Designing Agent Personalities',
    excerpt: 'Why personality matters for AI agents and how we designed ours.',
    date: '2026-03-18',
    readTime: '6 min',
    tags: ['Design', 'UX'],
  },
  {
    title: 'From Idea to Launch in 2 Weeks',
    excerpt: 'The story of how we built and shipped the first version of our AI team.',
    date: '2026-03-15',
    readTime: '10 min',
    tags: ['Story', 'Launch'],
  },
]

export default function InsightsPage() {
  return (
    <main className="min-h-screen p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold">Field Notes</h1>
        <p className="text-gray-400 mt-1">System design insights from building AI teams</p>
      </header>

      <section className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {POSTS.map((post, i) => (
            <article
              key={i}
              className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/30 transition-colors cursor-pointer"
            >
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-400 mb-4">{post.excerpt}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </div>
                <div className="flex gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-white/10 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}