'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, TrendingDown, Activity, Eye, MessageCircle, Users, BarChart3, Target, Zap } from 'lucide-react'

// Mock data for radar signals
const DEMAND_SIGNALS = [
  { 
    id: 1, 
    topic: 'AI Agent 团队协作', 
    volume: 98, 
    trend: 'up', 
    sources: 256,
    strength: 9.2,
    sentiment: 'positive',
    category: '生产力',
    lastDetected: '2 分钟前'
  },
  { 
    id: 2, 
    topic: 'OpenClaw 多渠道接入', 
    volume: 89, 
    trend: 'up', 
    sources: 178,
    strength: 8.7,
    sentiment: 'positive',
    category: '集成',
    lastDetected: '5 分钟前'
  },
  { 
    id: 3, 
    topic: '自动化内容生成', 
    volume: 85, 
    trend: 'up', 
    sources: 312,
    strength: 8.5,
    sentiment: 'positive',
    category: '内容',
    lastDetected: '8 分钟前'
  },
  { 
    id: 4, 
    topic: 'AI 编程助手', 
    volume: 82, 
    trend: 'stable', 
    sources: 405,
    strength: 8.1,
    sentiment: 'neutral',
    category: '开发',
    lastDetected: '12 分钟前'
  },
  { 
    id: 5, 
    topic: 'Agent 任务编排', 
    volume: 75, 
    trend: 'up', 
    sources: 134,
    strength: 7.4,
    sentiment: 'positive',
    category: '编排',
    lastDetected: '15 分钟前'
  },
  { 
    id: 6, 
    topic: '数据闭环系统', 
    volume: 72, 
    trend: 'up', 
    sources: 89,
    strength: 7.1,
    sentiment: 'positive',
    category: '分析',
    lastDetected: '18 分钟前'
  },
  { 
    id: 7, 
    topic: '多 Agent 协作框架', 
    volume: 68, 
    trend: 'stable', 
    sources: 196,
    strength: 6.7,
    sentiment: 'positive',
    category: '协作',
    lastDetected: '22 分钟前'
  },
  { 
    id: 8, 
    topic: 'AI 工作流自动化', 
    volume: 65, 
    trend: 'up', 
    sources: 268,
    strength: 6.4,
    sentiment: 'positive',
    category: '自动化',
    lastDetected: '25 分钟前'
  },
]

// Mock trend data for charts
const TREND_DATA = [
  { time: '1月', demand: 65 },
  { time: '2月', demand: 70 },
  { time: '3月', demand: 75 },
  { time: '4月', demand: 80 },
  { time: '5月', demand: 85 },
  { time: '6月', demand: 90 },
  { time: '7月', demand: 92 },
  { time: '8月', demand: 95 },
  { time: '9月', demand: 98 },
  { time: '10月', demand: 97 },
  { time: '11月', demand: 99 },
  { time: '12月', demand: 100 },
]

export default function RadarPage() {
  const [signals, setSignals] = useState(DEMAND_SIGNALS)
  const [selectedSignal, setSelectedSignal] = useState<number | null>(null)
  const [timeRange, setTimeRange] = useState('7d')

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSignals(prev => prev.map(signal => ({
        ...signal,
        volume: Math.max(50, signal.volume + (Math.random() * 10 - 5)),
        strength: Math.max(5, signal.strength + (Math.random() * 0.5 - 0.25))
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const selectedSignalData = selectedSignal 
    ? signals.find(s => s.id === selectedSignal) 
    : null

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/zh" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
          <Link href="/radar" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
            EN / 中文
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold">需求雷达</h1>
            </div>
            <p className="text-gray-400">实时监测市场需求信号 • {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-400">实时监控</span>
            </div>
            
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm"
            >
              <option value="24h">24小时</option>
              <option value="7d">7天</option>
              <option value="30d">30天</option>
            </select>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">4.8K</div>
                <div className="text-xs text-gray-400">周搜索量</div>
              </div>
            </div>
          </div>
          
          <div className="p-5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">1.6K</div>
                <div className="text-xs text-gray-400">社区讨论</div>
              </div>
            </div>
          </div>
          
          <div className="p-5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">+35%</div>
                <div className="text-xs text-gray-400">增长率</div>
              </div>
            </div>
          </div>
          
          <div className="p-5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">6</div>
                <div className="text-xs text-gray-400">热门趋势</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Radar Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">市场信号分布</h2>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-400">高需求</span>
                <div className="w-3 h-3 bg-blue-500 rounded-full ml-3"></div>
                <span className="text-sm text-gray-400">中需求</span>
              </div>
            </div>
            
            {/* Radar Chart Visualization */}
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Concentric circles */}
              <div className="absolute inset-0 rounded-full border border-white/10" style={{ margin: '10%' }}></div>
              <div className="absolute inset-0 rounded-full border border-white/10" style={{ margin: '20%' }}></div>
              <div className="absolute inset-0 rounded-full border border-white/10" style={{ margin: '30%' }}></div>
              <div className="absolute inset-0 rounded-full border border-white/10" style={{ margin: '40%' }}></div>
              
              {/* Signal points */}
              {signals.slice(0, 6).map((signal, index) => {
                const angle = (index * 60) * (Math.PI / 180);
                const distance = 40 + (signal.volume / 100) * 40;
                const x = 50 + Math.cos(angle) * distance;
                const y = 50 + Math.sin(angle) * distance;
                
                return (
                  <div 
                    key={signal.id}
                    className={`
                      absolute w-4 h-4 rounded-full cursor-pointer transition-all
                      ${signal.volume > 85 ? 'bg-purple-500 shadow-lg shadow-purple-500/50' : 
                        signal.volume > 70 ? 'bg-blue-500' : 'bg-gray-500'}
                      ${selectedSignal === signal.id ? 'ring-4 ring-white/50 scale-150' : ''}
                    `}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onClick={() => setSelectedSignal(signal.id === selectedSignal ? null : signal.id)}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-black/70 px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                      {signal.topic}
                    </div>
                  </div>
                );
              })}
              
              {/* Center */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <Eye className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            
            {/* Trend Chart */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">需求趋势变化</h3>
              <div className="h-40 flex items-end gap-1">
                {TREND_DATA.map((point, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-purple-500/30 to-purple-500 rounded-t hover:from-purple-500/50 hover:to-purple-500 transition-all"
                      style={{ height: `${point.demand}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-1">{point.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Signal List */}
        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm p-6">
            <h2 className="text-xl font-semibold mb-4">热门需求信号</h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {signals.map((signal) => (
                <div 
                  key={signal.id}
                  className={`
                    p-4 rounded-lg border transition-all cursor-pointer
                    ${selectedSignal === signal.id 
                      ? 'bg-purple-500/20 border-purple-500/50' 
                      : 'bg-white/5 border-white/10 hover:border-white/30'}
                  `}
                  onClick={() => setSelectedSignal(signal.id === selectedSignal ? null : signal.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{signal.topic}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          signal.sentiment === 'positive' 
                            ? 'bg-green-500/20 text-green-400' 
                            : signal.sentiment === 'negative' 
                              ? 'bg-red-500/20 text-red-400' 
                              : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {signal.category}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          <span>{signal.strength.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{signal.sources}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{signal.lastDetected}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {signal.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : signal.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      ) : (
                        <div className="w-4 h-4 text-gray-400">→</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>信号强度</span>
                      <span>{signal.volume}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          signal.volume > 80 ? 'bg-gradient-to-r from-purple-500 to-purple-400' :
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
          {selectedSignalData && (
            <div className="bg-white/05 rounded-xl border border-white/10 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">信号详情</h3>
                <button 
                  onClick={() => setSelectedSignal(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-purple-400">{selectedSignalData.topic}</h4>
                  <p className="text-sm text-gray-400 mt-1">ID: {selectedSignalData.id}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400">信号强度</div>
                    <div className="text-lg font-bold">{selectedSignalData.strength.toFixed(1)}/10</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400">数据源</div>
                    <div className="text-lg font-bold">{selectedSignalData.sources}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400">趋势</div>
                    <div className="flex items-center gap-1">
                      {selectedSignalData.trend === 'up' ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-sm">上升</span>
                        </>
                      ) : selectedSignalData.trend === 'down' ? (
                        <>
                          <TrendingDown className="w-4 h-4 text-red-400" />
                          <span className="text-sm">下降</span>
                        </>
                      ) : (
                        <>
                          <div className="w-4 h-4 text-gray-400">→</div>
                          <span className="text-sm">平稳</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400">最后检测</div>
                    <div className="text-sm">{selectedSignalData.lastDetected}</div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
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