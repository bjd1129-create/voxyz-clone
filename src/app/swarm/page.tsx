'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Activity, Clock, CheckCircle2, Circle } from 'lucide-react'

// Agent data
const AGENTS = [
  {
    id: 'ceo',
    name: 'CEO Minion',
    emoji: '🎯',
    color: 'agent-ceo',
    role: 'Decision Maker',
    status: 'busy',
    currentTask: 'Reviewing Q1 roadmap',
  },
  {
    id: 'creative',
    name: 'Creative',
    emoji: '🎨',
    color: 'agent-creative',
    role: 'Design Lead',
    status: 'idle',
    currentTask: null,
  },
  {
    id: 'developer',
    name: 'Developer',
    emoji: '💻',
    color: 'agent-developer',
    role: 'Tech Lead',
    status: 'busy',
    currentTask: 'Implementing Command Center UI',
  },
  {
    id: 'writer',
    name: 'Writer',
    emoji: '📝',
    color: 'agent-writer',
    role: 'Content Lead',
    status: 'idle',
    currentTask: null,
  },
  {
    id: 'researcher',
    name: 'Researcher',
    emoji: '🔍',
    color: 'agent-researcher',
    role: 'Analysis Lead',
    status: 'busy',
    currentTask: 'Competitive analysis: AI agent frameworks',
  },
  {
    id: 'support',
    name: 'Support',
    emoji: '🛠️',
    color: 'agent-support',
    role: 'Customer Success',
    status: 'idle',
    currentTask: null,
  },
]

// Recent activity
const ACTIVITY = [
  { agent: 'CEO', action: 'Approved new feature proposal', time: '2 min ago' },
  { agent: 'Developer', action: 'Pushed 3 commits to main', time: '15 min ago' },
  { agent: 'Researcher', action: 'Completed market analysis', time: '32 min ago' },
  { agent: 'Writer', action: 'Published blog post', time: '1 hour ago' },
  { agent: 'Creative', action: 'Updated brand guidelines', time: '2 hours ago' },
]

export default function SwarmPage() {
  const [agents, setAgents] = useState(AGENTS)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  // Simulate status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        status: Math.random() > 0.7 ? 'busy' : 'idle',
      })))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen p-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Command Center</h1>
            <p className="text-gray-400 mt-1">Real-time view of your AI team</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-gray-400">Live</span>
          </div>
        </div>
      </header>

      {/* Agent Grid - Honeycomb Layout */}
      <section className="max-w-6xl mx-auto mb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
              className={`
                relative p-6 rounded-2xl border transition-all duration-300 text-left
                ${agent.status === 'busy'
                  ? `bg-${agent.color}/10 border-${agent.color}/50`
                  : 'bg-white/5 border-white/10 hover:border-white/30'}
                ${selectedAgent === agent.id ? 'ring-2 ring-purple-500' : ''}
              `}
            >
              {/* Status indicator */}
              <div className="absolute top-4 right-4">
                {agent.status === 'busy' ? (
                  <div className="flex items-center gap-1">
                    <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                    <span className="text-xs text-green-400">Busy</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Circle className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500">Idle</span>
                  </div>
                )}
              </div>

              {/* Agent avatar */}
              <div className={`
                w-20 h-20 rounded-2xl bg-${agent.color}/20 flex items-center justify-center text-4xl mb-4
                ${agent.status === 'busy' ? 'animate-pulse-slow' : ''}
              `}>
                {agent.emoji}
              </div>

              {/* Agent info */}
              <h3 className="text-lg font-semibold">{agent.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{agent.role}</p>

              {/* Current task */}
              {agent.currentTask && (
                <div className="text-sm text-gray-300 bg-white/5 rounded-lg p-2">
                  📌 {agent.currentTask}
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Activity Feed */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white/5 rounded-xl border border-white/10 divide-y divide-white/10">
          {ACTIVITY.map((item, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-lg">
                {AGENTS.find(a => a.name === item.agent)?.emoji || '🤖'}
              </div>
              <div className="flex-1">
                <div className="font-medium">{item.agent}</div>
                <div className="text-sm text-gray-400">{item.action}</div>
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.time}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}