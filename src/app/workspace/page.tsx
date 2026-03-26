'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, LayoutDashboard, Clock, MessageSquare, 
  Brain, BarChart3, RefreshCw 
} from 'lucide-react'
import WorkLogTimeline from '@/components/WorkLogTimeline'
import MessageFeed from '@/components/MessageFeed'
import ThoughtBubble from '@/components/ThoughtBubble'
import TaskProgressCard from '@/components/TaskProgressCard'

type TabType = 'overview' | 'logs' | 'messages' | 'thoughts' | 'tasks'

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(k => k + 1)
  }

  const tabs: { id: TabType; label: string; icon: typeof Clock }[] = [
    { id: 'overview', label: '概览', icon: LayoutDashboard },
    { id: 'logs', label: '工作记录', icon: Clock },
    { id: 'messages', label: '沟通', icon: MessageSquare },
    { id: 'thoughts', label: '思考', icon: Brain },
    { id: 'tasks', label: '任务', icon: BarChart3 },
  ]

  return (
    <main className="min-h-screen p-6 bg-[#0a0a12]">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              实时工作室
            </h1>
            <p className="text-gray-400 mt-1">观察 AI 团队的工作状态、沟通和思考过程</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              title="刷新数据"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <Link 
              href="/office"
              className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
            >
              Pixel Office
            </Link>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'bg-white/10 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'overview' && (
          <div key={refreshKey} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Tasks */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-400" />
                当前任务
              </h2>
              <TaskProgressCard status="in_progress" limit={5} />
            </div>

            {/* Recent Thoughts */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-yellow-400" />
                最新思考
              </h2>
              <ThoughtBubble limit={5} />
            </div>

            {/* Recent Messages */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                团队沟通
              </h2>
              <MessageFeed limit={10} />
            </div>

            {/* Work Logs */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                工作记录
              </h2>
              <WorkLogTimeline limit={10} />
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div key={refreshKey}>
            <WorkLogTimeline limit={50} />
          </div>
        )}

        {activeTab === 'messages' && (
          <div key={refreshKey}>
            <MessageFeed limit={100} />
          </div>
        )}

        {activeTab === 'thoughts' && (
          <div key={refreshKey}>
            <ThoughtBubble limit={50} />
          </div>
        )}

        {activeTab === 'tasks' && (
          <div key={refreshKey}>
            <TaskProgressCard limit={30} />
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <footer className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10">
        <div className="flex flex-wrap gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>实时同步中</span>
          </div>
          <div>
            数据刷新间隔：5-10秒
          </div>
          <div className="ml-auto">
            <Link href="/office" className="text-purple-400 hover:text-purple-300">
              查看像素办公室 →
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}