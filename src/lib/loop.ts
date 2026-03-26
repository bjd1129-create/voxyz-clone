import { createClient } from '@supabase/supabase-js'

// 使用 Anon Key（Service Role Key 无效）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
})

// 类型定义
export interface Proposal {
  id: string
  agent_id: string
  title: string
  description?: string
  type: 'idea' | 'improvement' | 'bug' | 'task'
  status: 'pending' | 'approved' | 'rejected' | 'converted'
  votes: number
  created_at: string
  converted_to_task?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  assignee: string
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
  priority: number
  proposal_id?: string
  created_at: string
  updated_at: string
  completed_at?: string
}

export interface Event {
  id: string
  agent_id: string
  type: string
  action: string
  details: Record<string, unknown>
  trigger_new_proposal: boolean
  created_at: string
}

export interface AgentStatus {
  agent_id: string
  name: string
  emoji: string
  color: string
  status: 'idle' | 'busy' | 'offline'
  current_task?: string
  current_task_id?: string
  position_x: number
  position_y: number
  activity: 'working' | 'walking' | 'meeting' | 'coffee' | 'idle'
  last_active: string
  updated_at: string
}

// ============ 闭环核心函数 ============

/**
 * 1. Agent 提出提案
 */
export async function createProposal(
  agentId: string,
  title: string,
  description?: string,
  type: Proposal['type'] = 'idea'
): Promise<Proposal> {
  const { data, error } = await supabase
    .from('proposals')
    .insert({ agent_id: agentId, title, description, type })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * 2. 批准提案，创建任务
 */
export async function approveProposal(proposalId: string, assignee: string): Promise<Task> {
  // 获取提案
  const { data: proposal } = await supabase
    .from('proposals')
    .select('*')
    .eq('id', proposalId)
    .single()

  if (!proposal) throw new Error('Proposal not found')

  // 创建任务
  const { data: task, error } = await supabase
    .from('tasks')
    .insert({
      title: proposal.title,
      description: proposal.description,
      assignee,
      proposal_id: proposalId,
    })
    .select()
    .single()

  if (error) throw error

  // 更新提案状态
  await supabase
    .from('proposals')
    .update({ status: 'converted', converted_to_task: task.id })
    .eq('id', proposalId)

  // 记录事件
  await createEvent(assignee, 'proposal_approved', `Approved proposal: ${proposal.title}`, { proposal_id: proposalId })

  return task
}

/**
 * 3. Agent 认领任务
 */
export async function claimTask(taskId: string, agentId: string): Promise<Task> {
  const { data: task, error } = await supabase
    .from('tasks')
    .update({ status: 'in_progress', assignee: agentId, updated_at: new Date().toISOString() })
    .eq('id', taskId)
    .select()
    .single()

  if (error) throw error

  // 更新 Agent 状态
  await updateAgentStatus(agentId, 'busy', task.title, taskId)

  // 记录事件
  await createEvent(agentId, 'task_claimed', `Claimed task: ${task.title}`, { task_id: taskId })

  return task
}

/**
 * 4. Agent 完成任务
 */
export async function completeTask(taskId: string, agentId: string): Promise<Task> {
  const { data: task, error } = await supabase
    .from('tasks')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId)
    .select()
    .single()

  if (error) throw error

  // 更新 Agent 状态
  await updateAgentStatus(agentId, 'idle', null, null)

  // 记录事件（会触发新提案）
  await createEvent(agentId, 'task_completed', `Completed task: ${task.title}`, { task_id: taskId }, true)

  return task
}

/**
 * 5. 记录事件
 */
export async function createEvent(
  agentId: string,
  type: string,
  action: string,
  details: Record<string, unknown> = {},
  triggerNewProposal = false
): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .insert({
      agent_id: agentId,
      type,
      action,
      details,
      trigger_new_proposal: triggerNewProposal
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * 更新 Agent 状态
 */
export async function updateAgentStatus(
  agentId: string,
  status: string,
  currentTask?: string | null,
  currentTaskId?: string | null,
  activity?: string
): Promise<void> {
  await supabase
    .from('agents')
    .update({
      status,
      current_task: currentTask,
    })
    .eq('id', agentId)
}

/**
 * Agent 心跳检查 - 返回该 Agent 应该做什么
 */
export async function agentHeartbeat(agentId: string): Promise<{
  pendingTasks: Task[]
  pendingProposals: Proposal[]
  recentEvents: Event[]
  agentStatus: AgentStatus | null
  instructions: string[]
}> {
  // 获取该 Agent 的状态
  const { data: agentStatus } = await supabase
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .single()

  // 获取分配给该 Agent 的待办任务
  const { data: pendingTasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('assignee', agentId)
    .eq('status', 'pending')
    .order('priority', { ascending: false })

  // 获取待批准的提案
  const { data: pendingProposals } = await supabase
    .from('proposals')
    .select('*')
    .eq('status', 'pending')
    .limit(5)

  // 获取最近事件
  const { data: recentEvents } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  return {
    pendingTasks: pendingTasks || [],
    pendingProposals: pendingProposals || [],
    recentEvents: recentEvents || [],
    agentStatus: agentStatus || null,
    instructions: getAgentInstructions(agentId)
  }
}

function getAgentInstructions(agentId: string): string[] {
  const instructions: Record<string, string[]> = {
    coordinator: [
      '检查待批准的提案',
      '批准提案并分配任务',
      '跟踪任务进度',
      '处理阻塞问题'
    ],
    developer: [
      '认领技术任务',
      '执行任务',
      '完成任务并触发事件',
      '提出技术改进提案'
    ],
    researcher: [
      '认领研究任务',
      '对比 openclaw.ai',
      '记录发现',
      '提出研究提案'
    ],
    writer: [
      '认领内容任务',
      '撰写内容',
      '完成并触发事件'
    ],
    designer: [
      '认领设计任务',
      '完成设计工作'
    ],
    support: [
      '处理用户反馈',
      '更新 FAQ'
    ]
  }
  return instructions[agentId] || []
}