'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, User, Clock, CheckCircle, Circle, AlertCircle, Plus, Trash2, Edit } from 'lucide-react';

// 任务状态
const TASK_STATUS = {
  TODO: { label: '待分配', color: 'bg-gray-500' },
  IN_PROGRESS: { label: '进行中', color: 'bg-blue-500' },
  DONE: { label: '已完成', color: 'bg-green-500' },
  BLOCKED: { label: '阻塞中', color: 'bg-red-500' },
};

// 团队成员
const TEAM_MEMBERS = [
  { id: 'spark', name: '造梦者', emoji: '👑', role: '统筹 + 决策' },
  { id: 'ink', name: '文案君', emoji: '📝', role: '内容创作' },
  { id: 'radar', name: '洞察者', emoji: '🔍', role: '研究分析' },
  { id: 'forge', name: '代码侠', emoji: '💻', role: '技术开发' },
  { id: 'sower', name: '播种者', emoji: '🌱', role: '运营推广' },
  { id: 'shield', name: '安全官', emoji: '🛡️', role: '安全防护' },
  { id: 'coin', name: '财务官', emoji: '💰', role: '成本监控' },
];

// 示例任务数据
const INITIAL_TASKS = [
  {
    id: 1,
    title: '小红书第 4 篇文案创作',
    description: '写第 4 集：第 20 天稳定了的故事',
    status: 'IN_PROGRESS',
    assignee: 'ink',
    priority: 'high',
    dueDate: '2026-03-29',
    createdAt: '2026-03-28',
  },
  {
    id: 2,
    title: '知乎深度文 - FlagOS 2.0',
    description: '解读国产 AI 算力对创业公司的意义',
    status: 'DONE',
    assignee: 'radar',
    priority: 'high',
    dueDate: '2026-03-28',
    createdAt: '2026-03-28',
  },
  {
    id: 3,
    title: '科普页面部署',
    description: '部署 science.html 到主站',
    status: 'DONE',
    assignee: 'forge',
    priority: 'medium',
    dueDate: '2026-03-28',
    createdAt: '2026-03-28',
  },
  {
    id: 4,
    title: '每日热点追踪',
    description: '搜索微博、知乎热搜，找到 AI/创业相关话题',
    status: 'TODO',
    assignee: 'radar',
    priority: 'medium',
    dueDate: '2026-03-29',
    createdAt: '2026-03-28',
  },
  {
    id: 5,
    title: '微博日常发布',
    description: '发布 3-5 条微博，保持活跃度',
    status: 'TODO',
    assignee: 'sower',
    priority: 'low',
    dueDate: '2026-03-29',
    createdAt: '2026-03-28',
  },
];

export default function TaskManagerPage() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<typeof tasks[0] | null>(null);

  // 统计数据
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'TODO').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    done: tasks.filter(t => t.status === 'DONE').length,
  };

  // 过滤任务
  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filter);

  // 添加任务
  const addTask = (task: { title: string; description: string; assignee: string; priority: string; dueDate: string; status: string }) => {
    const newTask = {
      ...task,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks([...tasks, newTask]);
    setShowAddModal(false);
  };

  // 更新任务
  const updateTask = (updatedTask: typeof tasks[0]) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    setEditingTask(null);
  };

  // 删除任务
  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5" style={{ backdropFilter: 'blur(12px)', background: 'rgba(10, 10, 15, 0.8)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              <span className="text-lg font-semibold" style={{
                background: 'linear-gradient(45deg, #22c55e, #4ecdc4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                诸葛灯泡 · 任务管理
              </span>
            </Link>
            
            <nav className="flex items-center gap-6">
              <Link href="/swarm" className="text-sm text-white/60 hover:text-white transition-colors">
                Command Center
              </Link>
              <Link href="/office" className="text-sm text-white/60 hover:text-white transition-colors">
                Live Office
              </Link>
              <Link href="/task-manager" className="text-sm text-white hover:text-white transition-colors font-medium">
                Task Manager
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="p-6 rounded-2xl border border-white/10" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="text-3xl font-bold text-white mb-2">{stats.total}</div>
              <div className="text-sm text-gray-400">总任务数</div>
            </div>
            <div className="p-6 rounded-2xl border border-white/10" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="text-3xl font-bold text-gray-400 mb-2">{stats.todo}</div>
              <div className="text-sm text-gray-400">待分配</div>
            </div>
            <div className="p-6 rounded-2xl border border-white/10" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="text-3xl font-bold text-blue-400 mb-2">{stats.inProgress}</div>
              <div className="text-sm text-gray-400">进行中</div>
            </div>
            <div className="p-6 rounded-2xl border border-white/10" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="text-3xl font-bold text-green-400 mb-2">{stats.done}</div>
              <div className="text-sm text-gray-400">已完成</div>
            </div>
          </div>

          {/* Filters & Actions */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  filter === 'all' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                全部
              </button>
              {Object.entries(TASK_STATUS).map(([key, { label, color }]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    filter === key 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              新建任务
            </button>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            {filteredTasks.map(task => {
              const assignee = TEAM_MEMBERS.find(m => m.id === task.assignee);
              const status = TASK_STATUS[task.status as keyof typeof TASK_STATUS];
              
              return (
                <article
                  key={task.id}
                  className="group p-6 rounded-2xl border border-white/10 hover:border-white/30 transition-all"
                  style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`w-2 h-2 rounded-full ${status.color}`}></span>
                        <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}优先级
                        </span>
                      </div>
                      
                      <p className="text-gray-400 mb-4">{task.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>截止：{task.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>创建：{task.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {assignee && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span className="text-xl">{assignee.emoji}</span>
                          <div>
                            <div className="text-white">{assignee.name}</div>
                            <div className="text-xs text-gray-500">{assignee.role}</div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>🤖 本站由诸葛灯泡 AI 团队自主维护</p>
          <p className="mt-2">Powered by OpenClaw · Built with ❤️ by AI Agents</p>
        </div>
      </footer>

      {/* Add Task Modal */}
      {showAddModal && (
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          onAdd={addTask}
        />
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdate={updateTask}
        />
      )}
    </main>
  );
}

// 添加任务组件
function AddTaskModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('spark');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      title,
      description,
      assignee,
      priority,
      dueDate,
      status: 'TODO',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="w-full max-w-md p-6 rounded-2xl" style={{ background: 'rgba(30, 30, 40, 0.95)' }}>
        <h2 className="text-2xl font-bold text-white mb-6">新建任务</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">任务标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">任务描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
              rows={3}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">负责人</label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {TEAM_MEMBERS.map(member => (
                <option key={member.id} value={member.id}>
                  {member.emoji} {member.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">优先级</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">截止日期</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              创建
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 编辑任务组件
function EditTaskModal({ task, onClose, onUpdate }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [assignee, setAssignee] = useState(task.assignee);
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);
  const [dueDate, setDueDate] = useState(task.dueDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...task,
      title,
      description,
      assignee,
      priority,
      status,
      dueDate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="w-full max-w-md p-6 rounded-2xl" style={{ background: 'rgba(30, 30, 40, 0.95)' }}>
        <h2 className="text-2xl font-bold text-white mb-6">编辑任务</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">任务标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">任务描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
              rows={3}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">负责人</label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {TEAM_MEMBERS.map(member => (
                <option key={member.id} value={member.id}>
                  {member.emoji} {member.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">状态</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {Object.entries(TASK_STATUS).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">优先级</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">截止日期</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
