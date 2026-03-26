'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, TrendingDown, Activity, Eye, MessageCircle, Users, BarChart3, Target, Zap } from 'lucide-react'
import MobileNav from '@/components/MobileNav'
import DesktopNav from '@/components/DesktopNav'
import { supabase } from '@/lib/supabase'

// We'll fetch this data from Supabase instead of using mock data
// const DEMAND_SIGNALS = [
//   { 
//     id: 1, 
//     topic: 'AI Agent 团队协作', 
//     volume: 98, 
//     trend: 'up', 
//     sources: 256,
//     strength: 9.2,
//     sentiment: 'positive',
//     category: 'productivity',
//     lastDetected: '2 min ago'
//   },
//   { 
//     id: 2, 
//     topic: 'OpenClaw 多渠道接入', 
//     volume: 89, 
//     trend: 'up', 
//     sources: 178,
//     strength: 8.7,
//     sentiment: 'positive',
//     category: 'integration',
//     lastDetected: '5 min ago'
//   },
//   { 
//     id: 3, 
//     topic: '自动化内容生成', 
//     volume: 85, 
//     trend: 'up', 
//     sources: 312,
//     strength: 8.5,
//     sentiment: 'positive',
//     category: 'content',
//     lastDetected: '8 min ago'
//   },
//   { 
//     id: 4, 
//     topic: 'AI 编程助手', 
//     volume: 82, 
//     trend: 'stable', 
//     sources: 405,
//     strength: 8.1,
//     sentiment: 'neutral',
//     category: 'development',
//     lastDetected: '12 min ago'
//   },
//   { 
//     id: 5, 
//     topic: 'Agent 任务编排', 
//     volume: 75, 
//     trend: 'up', 
//     sources: 134,
//     strength: 7.4,
//     sentiment: 'positive',
//     category: 'orchestration',
//     lastDetected: '15 min ago'
//   },
//   { 
//     id: 6, 
//     topic: '数据闭环系统', 
//     volume: 72, 
//     trend: 'up', 
//     sources: 89,
//     strength: 7.1,
//     sentiment: 'positive',
//     category: 'analytics',
//     lastDetected: '18 min ago'
//   },
//   { 
//     id: 7, 
//     topic: '多 Agent 协作框架', 
//     volume: 68, 
//     trend: 'stable', 
//     sources: 196,
//     strength: 6.7,
//     sentiment: 'positive',
//     category: 'collaboration',
//     lastDetected: '22 min ago'
//   },
//   { 
//     id: 8, 
//     topic: 'AI 工作流自动化', 
//     volume: 65, 
//     trend: 'up', 
//     sources: 268,
//     strength: 6.4,
//     sentiment: 'positive',
//     category: 'automation',
//     lastDetected: '25 min ago'
//   },
// ]

// Mock trend data for charts - we'll fetch this from Supabase too
// const TREND_DATA = [
//   { time: 'Jan', demand: 65 },
//   { time: 'Feb', demand: 70 },
//   { time: 'Mar', demand: 75 },
//   { time: 'Apr', demand: 80 },
//   { time: 'May', demand: 85 },
//   { time: 'Jun', demand: 90 },
//   { time: 'Jul', demand: 92 },
//   { time: 'Aug', demand: 95 },
//   { time: 'Sep', demand: 98 },
//   { time: 'Oct', demand: 97 },
//   { time: 'Nov', demand: 99 },
//   { time: 'Dec', demand: 100 },
// ]

export default function RadarPage() {
  const [signals, setSignals] = useState<any[]>([]) // Using any for now, we'll define proper types later
  const [trendData, setTrendData] = useState<any[]>([]) // For chart data
  const [selectedSignal, setSelectedSignal] = useState<number | null>(null)
  const [timeRange, setTimeRange] = useState('7d')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [sortOption, setSortOption] = useState<string>('strength-desc')
  
  // Fetch demand signals from Supabase
  useEffect(() => {
    const fetchSignals = async () => {
      try {
        // Fetch events as demand signals (we'll interpret various events as demand signals)
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select(`
            id,
            agent_id,
            action,
            details,
            created_at
          `)
          .order('created_at', { ascending: false })
          .limit(50)
        
        if (eventsError) {
          console.error('Error fetching events:', eventsError)
          return
        }
        
        // Transform events into demand signals
        // In a real scenario, we might have a dedicated table for demand signals
        // For now, we'll interpret certain events as demand signals
        const demandSignals = eventsData.map((event: any, index: number) => {
          // Generate mock values based on the event data
          const topics = [
            'AI Agent 团队协作',
            'OpenClaw 多渠道接入', 
            '自动化内容生成',
            'AI 编程助手',
            'Agent 任务编排',
            '数据闭环系统',
            '多 Agent 协作框架',
            'AI 工作流自动化',
            '智能决策系统',
            '认知计算模型'
          ]
          
          const categories = ['productivity', 'integration', 'content', 'development', 'orchestration', 'analytics', 'collaboration', 'automation', 'decision-making', 'cognition']
          
          return {
            id: index + 1,
            topic: event.action || topics[index % topics.length],
            volume: Math.floor(Math.random() * 40) + 60, // Random volume between 60-100
            trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
            sources: Math.floor(Math.random() * 200) + 50, // Random sources between 50-250
            strength: parseFloat((Math.random() * 4 + 5).toFixed(1)), // Random strength between 5.0-9.0
            sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as 'positive' | 'negative' | 'neutral',
            category: categories[index % categories.length],
            lastDetected: `${Math.floor(Math.random() * 30) + 1} min ago`
          }
        })
        
        setSignals(demandSignals)
        
        // Generate trend data based on the signals
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const generatedTrendData = months.map((month, index) => ({
          time: month,
          demand: Math.floor(Math.random() * 35) + 65 // Random demand between 65-100
        }))
        
        setTrendData(generatedTrendData)
      } catch (error) {
        console.error('Error fetching demand signals:', error)
      }
    }
    
    fetchSignals()
    
    // Set up real-time subscription for new events
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'events',
        },
        (payload) => {
          console.log('New event received:', payload)
          // Refresh signals when there's a new event
          fetchSignals()
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
  
  // 获取所有唯一类别用于筛选
  const categories = ['all', ...Array.from(new Set(signals.map(signal => signal.category)))]

  // 应用筛选和排序
  const filteredAndSortedSignals = signals
    .filter(signal => {
      const categoryMatch = categoryFilter === 'all' || signal.category === categoryFilter
      return categoryMatch
    })
    .sort((a: any, b: any) => {
      switch(sortOption) {
        case 'strength-desc':
          return b.strength - a.strength
        case 'strength-asc':
          return a.strength - b.strength
        case 'volume-desc':
          return b.volume - a.volume
        case 'volume-asc':
          return a.volume - b.volume
        case 'trend-up':
          if (a.trend === 'up' && b.trend !== 'up') return -1
          if (a.trend !== 'up' && b.trend === 'up') return 1
          return b.strength - a.strength
        default:
          return b.strength - a.strength
      }
    })

  const selectedSignalProphet = selectedSignal 
    ? signals.find((s: any) => s.id === selectedSignal) 
    : null

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-3 sm:p-6 pb-20">
      {/* Mobile Navigation */}
      <MobileNav langToggleHref="/zh/radar" />
      
      {/* Desktop Navigation */}
      <DesktopNav langToggleHref="/zh/radar" />

      {/* Desktop Header */}
      <header className="hidden md:block max-w-7xl lg:max-w-[1600px] mx-auto mb-8 lg:mb-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 lg:mb-8">
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 lg:gap-4 mb-2 lg:mb-3">
              <div className="p-2 lg:p-3 bg-primary-500/20 rounded-lg">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Demand Radar</h1>
            </div>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg">实时监测市场需求信号 • {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm lg:text-base text-gray-400">实时监控</span>
            </div>
            
            {/* Category Filter */}
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm lg:text-base"
            >
              <option value="all">全部类别</option>
              <option value="productivity">生产力</option>
              <option value="integration">集成</option>
              <option value="content">内容</option>
              <option value="development">开发</option>
              <option value="orchestration">编排</option>
              <option value="analytics">分析</option>
              <option value="collaboration">协作</option>
              <option value="automation">自动化</option>
            </select>
            
            {/* Sort Option */}
            <select 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm lg:text-base"
            >
              <option value="strength-desc">按强度降序</option>
              <option value="strength-asc">按强度升序</option>
              <option value="volume-desc">按音量降序</option>
              <option value="volume-asc">按音量升序</option>
              <option value="trend-up">上升趋势优先</option>
            </select>
            
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm lg:text-base"
            >
              <option value="24h">24小时</option>
              <option value="7d">7天</option>
              <option value="30d">30天</option>
            </select>
          </div>
        </div>
      </header>

      {/* Mobile Title */}
      <div className="md:hidden mb-4">
        <h1 className="text-xl font-bold text-center">Demand Radar</h1>
        <div className="flex items-center justify-center gap-2 mt-1 text-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-gray-400">实时监控</span>
        </div>
      </div>

      {/* Stats Overview */}
      <section className="max-w-7xl lg:max-w-[1600px] mx-auto mb-6 sm:mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          <div className="p-3 sm:p-5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-primary-500/20 rounded-lg">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-primary-400">4.8K</div>
                <div className="text-xs text-gray-400">周搜索量</div>
              </div>
            </div>
          </div>
          
          <div className="p-3 sm:p-5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-blue-400">1.6K</div>
                <div className="text-xs text-gray-400">社区讨论</div>
              </div>
            </div>
          </div>
          
          <div className="p-3 sm:p-5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-green-400">+35%</div>
                <div className="text-xs text-gray-400">增长率</div>
              </div>
            </div>
          </div>
          
          <div className="p-3 sm:p-5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-yellow-500/20 rounded-lg">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-yellow-400">6</div>
                <div className="text-xs text-gray-400">热门趋势</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl lg:max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {/* Main Radar Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold">市场信号分布</h2>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span className="text-sm text-gray-400">高需求</span>
                <div className="w-3 h-3 bg-blue-500 rounded-full ml-3"></div>
                <span className="text-sm text-gray-400">中需求</span>
              </div>
            </div>
            
            {/* Radar Chart Visualization */}
            <div className="relative aspect-square max-w-xs sm:max-w-md mx-auto">
              {/* Concentric circles */}
              <div className="absolute inset-0 rounded-full border border-white/10" style={{ margin: '10%' }}></div>
              <div className="absolute inset-0 rounded-full border border-white/10" style={{ margin: '20%' }}></div>
              <div className="absolute inset-0 rounded-full border border-white/10" style={{ margin: '30%' }}></div>
              <div className="absolute inset-0 rounded-full border border-white/10" style={{ margin: '40%' }}></div>
              
              {/* Signal points */}
              {signals.slice(0, 6).map((signal: any, index: number) => {
                const angle = (index * 60) * (Math.PI / 180);
                const distance = 40 + (signal.volume / 100) * 40;
                const x = 50 + Math.cos(angle) * distance;
                const y = 50 + Math.sin(angle) * distance;
                
                return (
                  <div 
                    key={signal.id}
                    className={`
                      absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full cursor-pointer transition-all
                      ${signal.volume > 85 ? 'bg-primary-500 shadow-lg shadow-primary-500/50' : 
                        signal.volume > 70 ? 'bg-blue-500' : 'bg-gray-500'}
                      ${selectedSignal === signal.id ? 'ring-2 ring-white/50 scale-125 sm:scale-150' : ''}
                    `}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onClick={() => setSelectedSignal(signal.id === selectedSignal ? null : signal.id)}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-black/70 px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                      {signal.topic}
                    </div>
                  </div>
                );
              })}
              
              {/* Center */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-primary-400" />
              </div>
            </div>
            
            {/* Mobile Legend */}
            <div className="sm:hidden flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-xs text-gray-400">高需求</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-400">中需求</span>
              </div>
            </div>
            
            {/* Trend Chart */}
            <div className="mt-6 sm:mt-8">
              <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">需求趋势变化</h3>
              <div className="h-32 sm:h-40 flex items-end gap-0.5 sm:gap-1">
                {trendData.map((point, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-primary-500/30 to-primary-500 rounded-t hover:from-primary-500/50 hover:to-primary-500 transition-all"
                      style={{ height: `${point.demand}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-1 hidden sm:block">{point.time}</div>
                    <div className="text-[0.6rem] sm:hidden text-gray-500 mt-1">{point.time.substring(0, 1)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Signal List */}
        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">热门需求信号</h2>
            <div className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-1 sm:pr-2">
              {filteredAndSortedSignals.map((signal) => (
                <div 
                  key={signal.id}
                  className={`
                    p-3 sm:p-4 rounded-lg border transition-all cursor-pointer
                    ${selectedSignal === signal.id 
                      ? 'bg-primary-500/20 border-primary-500/50' 
                      : 'bg-white/5 border-white/10 hover:border-white/30'}
                  `}
                  onClick={() => setSelectedSignal(signal.id === selectedSignal ? null : signal.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1">
                        <h3 className="font-medium text-sm sm:text-base truncate">{signal.topic}</h3>
                        <span className={`text-[0.6rem] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                          signal.sentiment === 'positive' 
                            ? 'bg-green-500/20 text-green-400' 
                            : signal.sentiment === 'negative' 
                              ? 'bg-red-500/20 text-red-400' 
                              : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {signal.category}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-2">
                        <div className="flex items-center gap-1">
                          <Activity className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span>{signal.strength.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span>{signal.sources}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{signal.lastDetected}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 sm:gap-2">
                      {signal.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                      ) : signal.trend === 'down' ? (
                        <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                      ) : (
                        <div className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400">→</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2 sm:mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>信号强度</span>
                      <span>{signal.volume}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          signal.volume > 80 ? 'bg-gradient-to-r from-primary-500 to-primary-400' :
                          signal.volume > 60 ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                          signal.volume > 40 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                          'bg-gradient-to-r from-gray-500 to-gray-400'
                        }`}
                        style={{ width: `${signal.volume}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Selected Signal Detail */}
          {selectedSignalProphet && (
            <div className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-medium">信号详情</h3>
                <button 
                  onClick={() => setSelectedSignal(null)}
                  className="text-gray-400 hover:text-white text-lg"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h4 className="font-medium text-primary-400 text-sm sm:text-base">{selectedSignalProphet.topic}</h4>
                  <p className="text-xs text-gray-400 mt-1">ID: {selectedSignalProphet.id}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                    <div className="text-xs text-gray-400">信号强度</div>
                    <div className="text-base sm:text-lg font-bold">{selectedSignalProphet.strength.toFixed(1)}/10</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                    <div className="text-xs text-gray-400">数据源</div>
                    <div className="text-base sm:text-lg font-bold">{selectedSignalProphet.sources}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                    <div className="text-xs text-gray-400">趋势</div>
                    <div className="flex items-center gap-1">
                      {selectedSignalProphet.trend === 'up' ? (
                        <>
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                          <span className="text-xs sm:text-sm">上升</span>
                        </>
                      ) : selectedSignalProphet.trend === 'down' ? (
                        <>
                          <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                          <span className="text-xs sm:text-sm">下降</span>
                        </>
                      ) : (
                        <>
                          <div className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400">→</div>
                          <span className="text-xs sm:text-sm">平稳</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                    <div className="text-xs text-gray-400">最后检测</div>
                    <div className="text-xs sm:text-sm">{selectedSignalProphet.lastDetected}</div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <button className="w-full py-2 bg-gradient-to-r from-primary-600 to-blue-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    深入分析此信号
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}