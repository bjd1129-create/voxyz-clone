'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Activity, Clock, CheckCircle2, Circle, Play, Pause, Settings, Plus, Flag, MessageSquare, Zap, Users, Cpu, Database } from 'lucide-react'

// Enhanced agent data with more properties
const AGENTS = [
  {
    id: 'zhuge',
    name: '诸葛灯泡',
    emoji: '💡',
    color: 'purple',
    role: '造梦者',
    status: 'busy',
    currentTask: '审核 Q1 路线图',
    tasksCompleted: 24,
    uptime: '98%',
    efficiency: 95,
    lastActive: 'now',
    priority: 'high',
    resources: { cpu: 85, memory: 60 }
  },
  {
    id: 'coordinator',
    name: '掌舵人',
    emoji: '🎯',
    color: 'pink',
    role: '任务分配',
    status: 'busy',
    currentTask: '协调团队任务分配',
    tasksCompleted: 32,
    uptime: '99%',
    efficiency: 92,
    lastActive: 'now',
    priority: 'high',
    resources: { cpu: 78, memory: 65 }
  },
  {
    id: 'engineer',
    name: '代码侠',
    emoji: '💻',
    color: 'blue',
    role: '技术开发',
    status: 'busy',
    currentTask: '实现指挥中心 UI',
    tasksCompleted: 41,
    uptime: '97%',
    efficiency: 87,
    lastActive: 'now',
    priority: 'high',
    resources: { cpu: 92, memory: 85 }
  },
  {
    id: 'writer',
    name: '文案君',
    emoji: '📝',
    color: 'green',
    role: '内容创作',
    status: 'busy',
    currentTask: '撰写项目文档',
    tasksCompleted: 27,
    uptime: '94%',
    efficiency: 90,
    lastActive: '2m ago',
    priority: 'medium',
    resources: { cpu: 45, memory: 55 }
  },
  {
    id: 'researcher',
    name: '洞察者',
    emoji: '🔍',
    color: 'yellow',
    role: '研究分析',
    status: 'busy',
    currentTask: '竞争分析：AI Agent 框架',
    tasksCompleted: 38,
    uptime: '93%',
    efficiency: 89,
    lastActive: '1m ago',
    priority: 'high',
    resources: { cpu: 78, memory: 55 }
  },
  {
    id: 'designer',
    name: '配色师',
    emoji: '🎨',
    color: 'indigo',
    role: '视觉设计',
    status: 'busy',
    currentTask: '创建活动视觉素材',
    tasksCompleted: 18,
    uptime: '96%',
    efficiency: 88,
    lastActive: '2m ago',
    priority: 'medium',
    resources: { cpu: 65, memory: 75 }
  },
  {
    id: 'support',
    name: '守护者',
    emoji: '🛠️',
    color: 'teal',
    role: '用户支持',
    status: 'idle',
    currentTask: null,
    tasksCompleted: 15,
    uptime: '95%',
    efficiency: 85,
    lastActive: '5m ago',
    priority: 'low',
    resources: { cpu: 20, memory: 30 }
  },
  {
    id: 'sower',
    name: '播种者',
    emoji: '🌱',
    color: 'emerald',
    role: '增长运营',
    status: 'busy',
    currentTask: '优化内容分发渠道',
    tasksCompleted: 22,
    uptime: '96%',
    efficiency: 91,
    lastActive: 'now',
    priority: 'high',
    resources: { cpu: 55, memory: 48 }
  },
  {
    id: 'prophet',
    name: '预言家',
    emoji: '🔮',
    color: 'violet',
    role: '数据预测',
    status: 'busy',
    currentTask: '构建预测模型',
    tasksCompleted: 19,
    uptime: '97%',
    efficiency: 93,
    lastActive: 'now',
    priority: 'high',
    resources: { cpu: 62, memory: 52 }
  },
  {
    id: 'scheduler',
    name: '调度员',
    emoji: '⚡',
    color: 'amber',
    role: '资源调度',
    status: 'busy',
    currentTask: '优化任务队列',
    tasksCompleted: 35,
    uptime: '98%',
    efficiency: 94,
    lastActive: 'now',
    priority: 'high',
    resources: { cpu: 48, memory: 42 }
  }
]

// Mock recent activity
const ACTIVITY = [
  { agent: '诸葛灯泡', action: '批准新功能提案', time: '2 分钟前', type: 'decision' },
  { agent: '代码侠', action: '推送 3 个提交到主分支', time: '5 分钟前', type: 'code' },
  { agent: '洞察者', action: '完成市场分析', time: '8 分钟前', type: 'analysis' },
  { agent: '配色师', action: '上传新设计素材', time: '12 分钟前', type: 'design' },
  { agent: '文案君', action: '发布博客文章', time: '15 分钟前', type: 'content' },
  { agent: '掌舵人', action: '生成周报', time: '18 分钟前', type: 'report' },
  { agent: '守护者', action: '解决 5 个工单', time: '22 分钟前', type: 'support' },
  { agent: '掌舵人', action: '更新策略文档', time: '25 分钟前', type: 'strategy' },
]

// Mock missions/tasks
const MISSIONS = [
  { id: 1, title: 'Q1 路线图', status: 'active', progress: 75, agents: ['zhuge', 'coordinator'] },
  { id: 2, title: '活动上线', status: 'active', progress: 45, agents: ['designer', 'writer'] },
  { id: 3, title: '系统升级', status: 'pending', progress: 10, agents: ['engineer', 'researcher'] },
  { id: 4, title: '市场分析', status: 'completed', progress: 100, agents: ['researcher', 'coordinator'] },
]

export default function SwarmPage() {
  const [agents, setAgents] = useState(AGENTS)
  const [missions, setMissions] = useState(MISSIONS)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [selectedMission, setSelectedMission] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'missions' | 'spawn'>('dashboard')
  const [newMission, setNewMission] = useState({ title: '', agents: [] as string[] })

  // Simulate status changes and activity
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        status: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'busy' : 'idle') : agent.status,
        efficiency: Math.min(100, Math.max(50, agent.efficiency + (Math.random() * 10 - 5))),
        resources: {
          cpu: Math.min(100, Math.max(0, agent.resources.cpu + (Math.random() * 20 - 10))),
          memory: Math.min(100, Math.max(0, agent.resources.memory + (Math.random() * 15 - 7.5)))
        }
      })))
    }, 8000)

    return () => clearInterval(interval)
  }, [agents])

  const toggleAgentTask = (agentId: string) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === agentId) {
        return {
          ...agent,
          status: agent.status === 'busy' ? 'idle' : 'busy',
          currentTask: agent.status === 'busy' 
            ? null 
            : `执行${agent.role}任务`
        }
      }
      return agent
    }))
  }

  const createMission = () => {
    if (newMission.title.trim()) {
      const mission = {
        id: missions.length + 1,
        title: newMission.title,
        status: 'active',
        progress: 0,
        agents: newMission.agents
      }
      setMissions([...missions, mission])
      setNewMission({ title: '', agents: [] })
    }
  }

  const selectedAgentProphet = selectedAgent 
    ? agents.find(a => a.id === selectedAgent) 
    : null

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900/20 to-gray-900 p-6">
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/zh" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
          <div className="ml-auto">
            <Link href="/swarm" className="px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
              EN / 中文
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
              <h1 className="text-3xl font-bold">指挥中心</h1>
            </div>
            <p className="text-gray-400">实时监控多智能体状态 • {new Date().toLocaleTimeString()}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-400">实时连接</span>
            </div>
            
            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 text-sm">
              <Cpu className="w-4 h-4 text-green-400" />
              <span>{agents.filter(a => a.status === 'busy').length}/{agents.length} 工作中</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-400">{agents.length}</div>
                <div className="text-xs text-gray-400">智能体总数</div>
              </div>
            </div>
          </div>
          
          <div className="p-5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{agents.filter(a => a.status === 'busy').length}</div>
                <div className="text-xs text-gray-400">工作中</div>
              </div>
            </div>
          </div>
          
          <div className="p-5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Flag className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{missions.filter(m => m.status === 'active').length}</div>
                <div className="text-xs text-gray-400">活跃任务</div>
              </div>
            </div>
          </div>
          
          <div className="p-5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Database className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{agents.reduce((sum, agent) => sum + agent.tasksCompleted, 0)}</div>
                <div className="text-xs text-gray-400">已完成任务</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex border-b border-white/10">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            仪表板
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'missions'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('missions')}
          >
            任务中心
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'spawn'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('spawn')}
          >
            生成中心
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Agent Grid */}
              <div className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">智能体状态网格</h2>
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">实时监控</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                      className={`
                        relative p-4 rounded-xl border transition-all duration-300 text-left cursor-pointer
                        ${agent.status === 'busy'
                          ? `bg-${agent.color}-500/10 border-${agent.color}-500/50`
                          : 'bg-white/5 border-white/10 hover:border-white/30'}
                        ${selectedAgent === agent.id ? 'ring-2 ring-indigo-500' : ''}
                      `}
                    >
                      <div className="absolute top-2 right-2">
                        {agent.status === 'busy' ? (
                          <Activity className="w-3 h-3 text-green-400 animate-pulse" />
                        ) : (
                          <Circle className="w-3 h-3 text-gray-500" />
                        )}
                      </div>

                      <div className={`
                        w-12 h-12 rounded-xl bg-${agent.color}-500/20 flex items-center justify-center text-xl mb-3
                        ${agent.status === 'busy' ? 'animate-pulse-slow' : ''}
                      `}>
                        {agent.emoji}
                      </div>

                      <h3 className="font-medium text-sm truncate">{agent.name}</h3>
                      <p className="text-xs text-gray-400 mb-2 truncate">{agent.role}</p>

                      <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
                        <div
                          className={`h-1.5 rounded-full bg-${
                            agent.efficiency > 80 ? 'green' : agent.efficiency > 60 ? 'yellow' : 'red'
                          }-500`}
                          style={{ width: `${agent.efficiency}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500">{agent.efficiency}% 效率</div>

                      {agent.currentTask && (
                        <div className="text-xs text-gray-300 bg-white/5 rounded mt-2 p-1 truncate">
                          📌 {agent.currentTask}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Resource Utilization */}
              <div className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm p-6">
                <h2 className="text-xl font-semibold mb-4">资源利用率</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {agents.map(agent => (
                    <div key={agent.id} className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{agent.emoji}</span>
                        <span className="font-medium text-sm">{agent.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          agent.status === 'busy' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {agent.status === 'busy' ? '工作中' : '空闲'}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>CPU</span>
                            <span>{agent.resources.cpu}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                agent.resources.cpu > 80 ? 'bg-red-500' : 
                                agent.resources.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${agent.resources.cpu}%` }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>内存</span>
                            <span>{agent.resources.memory}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                agent.resources.memory > 80 ? 'bg-red-500' : 
                                agent.resources.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${agent.resources.memory}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'missions' && (
            <div className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">任务追踪面板</h2>
                <button className="px-3 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-500/30 transition-colors">
                  创建任务
                </button>
              </div>
              
              <div className="space-y-4">
                {missions.map(mission => (
                  <div 
                    key={mission.id} 
                    className={`
                      p-4 rounded-lg border cursor-pointer transition-all
                      ${selectedMission === mission.id 
                        ? 'bg-indigo-500/20 border-indigo-500/50' 
                        : 'bg-white/5 border-white/10 hover:border-white/30'}
                    `}
                    onClick={() => setSelectedMission(mission.id === selectedMission ? null : mission.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          mission.status === 'active' ? 'bg-green-500 animate-pulse' :
                          mission.status === 'completed' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`} />
                        <h3 className="font-medium">{mission.title}</h3>
                      </div>
                      <div className="text-sm text-gray-400">{mission.progress}%</div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-primary-500"
                          style={{ width: `${mission.progress}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">分配给:</span>
                          {mission.agents.map(agentId => {
                            const agent = agents.find(a => a.id === agentId)
                            return agent ? (
                              <span key={agentId} className="flex items-center gap-1">
                                <span>{agent.emoji}</span>
                                <span className="text-xs">{agent.name}</span>
                              </span>
                            ) : null
                          })}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          mission.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : mission.status === 'completed'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {mission.status === 'active' ? '进行中' : mission.status === 'completed' ? '已完成' : '待处理'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'spawn' && (
            <div className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm p-6">
              <h2 className="text-xl font-semibold mb-4">快速启动</h2>
              
              <div className="mb-6 p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <h3 className="font-medium text-indigo-400 mb-2">快速启动模板</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <button className="py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors">
                    🤖 AI 助手
                  </button>
                  <button className="py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors">
                    📊 数据分析师
                  </button>
                  <button className="py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors">
                    📝 内容创作
                  </button>
                  <button className="py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors">
                    🔍 调研 Agent
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">任务标题</label>
                <input
                  type="text"
                  value={newMission.title}
                  onChange={(e) => setNewMission({...newMission, title: e.target.value})}
                  placeholder="输入新任务标题..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">分配智能体</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {agents.map(agent => (
                    <button
                      key={agent.id}
                      onClick={() => {
                        if (newMission.agents.includes(agent.id)) {
                          setNewMission({
                            ...newMission,
                            agents: newMission.agents.filter(id => id !== agent.id)
                          })
                        } else {
                          setNewMission({
                            ...newMission,
                            agents: [...newMission.agents, agent.id]
                          })
                        }
                      }}
                      className={`
                        py-2 rounded-lg text-sm flex items-center justify-center gap-2
                        ${newMission.agents.includes(agent.id)
                          ? `bg-${agent.color}-500/20 border border-${agent.color}-500/50`
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'}
                      `}
                    >
                      <span>{agent.emoji}</span>
                      <span>{agent.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={createMission}
                disabled={!newMission.title.trim()}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                启动新任务
              </button>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Agent Detail Panel */}
          {selectedAgentProphet && (
            <div className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">智能体详情</h3>
                <button 
                  onClick={() => setSelectedAgent(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-14 h-14 rounded-xl bg-${selectedAgentProphet.color}-500/20 flex items-center justify-center text-2xl`}>
                  {selectedAgentProphet.emoji}
                </div>
                <div>
                  <h4 className="font-bold">{selectedAgentProphet.name}</h4>
                  <p className="text-sm text-gray-400">{selectedAgentProphet.role}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400">状态</div>
                    <div className="flex items-center gap-1 mt-1">
                      <div className={`w-2 h-2 rounded-full ${
                        selectedAgentProphet.status === 'busy' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                      }`} />
                      <span className="text-sm">{selectedAgentProphet.status === 'busy' ? '工作中' : '空闲'}</span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400">效率</div>
                    <div className="text-sm font-medium mt-1">{selectedAgentProphet.efficiency}%</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400">任务完成数</div>
                    <div className="text-sm font-medium mt-1">{selectedAgentProphet.tasksCompleted}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400">运行时间</div>
                    <div className="text-sm font-medium mt-1">{selectedAgentProphet.uptime}</div>
                  </div>
                </div>
                
                {selectedAgentProphet.currentTask && (
                  <div className="pt-2">
                    <div className="text-xs text-gray-400 mb-1">当前任务</div>
                    <div className="text-sm bg-white/5 rounded-lg p-2">{selectedAgentProphet.currentTask}</div>
                  </div>
                )}
                
                <div className="pt-2">
                  <button 
                    onClick={() => toggleAgentTask(selectedAgentProphet.id)}
                    className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    {selectedAgentProphet.status === 'busy' ? '暂停任务' : '开始任务'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Recent Activity */}
          <div className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm p-6">
            <h3 className="text-lg font-medium mb-4">最近活动</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {ACTIVITY.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-2 hover:bg-white/5 rounded-lg">
                  <div className="mt-0.5">
                    {item.type === 'decision' && <Flag className="w-4 h-4 text-blue-400" />}
                    {item.type === 'code' && <Zap className="w-4 h-4 text-green-400" />}
                    {item.type === 'analysis' && <MessageSquare className="w-4 h-4 text-purple-400" />}
                    {(item.type === 'design' || item.type === 'content') && <Users className="w-4 h-4 text-pink-400" />}
                    {item.type === 'report' && <Database className="w-4 h-4 text-teal-400" />}
                    {item.type === 'support' && <Cpu className="w-4 h-4 text-indigo-400" />}
                    {item.type === 'strategy' && <Activity className="w-4 h-4 text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{item.agent}: {item.action}</div>
                    <div className="text-xs text-gray-500">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}