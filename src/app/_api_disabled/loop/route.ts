import { NextResponse } from 'next/server'
import {
  agentHeartbeat,
  claimTask,
  completeTask,
  createProposal,
  approveProposal,
  supabase
} from '@/lib/loop'

/**
 * 数据闭环 API
 *
 * GET /api/loop?agent=xxx - Agent 心跳，返回待办
 * POST /api/loop - 执行闭环操作
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const agentId = searchParams.get('agent')

  if (!agentId) {
    // 返回全局状态
    try {
      const { data: agents, error: agentsError } = await supabase.from('agents').select('*')
      const { data: tasks, error: tasksError } = await supabase.from('tasks').select('*').eq('status', 'pending')
      const { data: proposals, error: proposalsError } = await supabase.from('proposals').select('*').eq('status', 'pending')
      const { data: events, error: eventsError } = await supabase.from('events').select('*').order('created_at', { ascending: false }).limit(20)

      if (agentsError) console.error('Agents error:', agentsError)
      if (tasksError) console.error('Tasks error:', tasksError)
      if (proposalsError) console.error('Proposals error:', proposalsError)
      if (eventsError) console.error('Events error:', eventsError)

      return NextResponse.json({
        timestamp: new Date().toISOString(),
        agents: agents || [],
        pendingTasks: tasks || [],
        pendingProposals: proposals || [],
        recentEvents: events || [],
      })
    } catch (error) {
      console.error('GET /api/loop error:', error)
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, { status: 500 })
    }
  }

  // 返回 Agent 专属信息
  try {
    const heartbeat = await agentHeartbeat(agentId)
    return NextResponse.json({
      agentId,
      timestamp: new Date().toISOString(),
      ...heartbeat
    })
  } catch (error) {
    console.error('Heartbeat error:', error)
    return NextResponse.json({ error: 'Agent not found or error' }, { status: 404 })
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const { action, agentId, taskId, proposalId, title, description, assignee, type } = body

  console.log('POST /api/loop:', { action, agentId, taskId, proposalId, title })

  try {
    switch (action) {
      case 'claim':
        // Agent 认领任务
        const claimedTask = await claimTask(taskId, agentId)
        console.log('Task claimed:', claimedTask)
        return NextResponse.json({ success: true, task: claimedTask })

      case 'complete':
        // Agent 完成任务
        const completedTask = await completeTask(taskId, agentId)
        console.log('Task completed:', completedTask)
        return NextResponse.json({ success: true, task: completedTask })

      case 'propose':
        // Agent 提出提案
        const proposal = await createProposal(agentId, title, description, type || 'idea')
        console.log('Proposal created:', proposal)
        return NextResponse.json({ success: true, proposal })

      case 'approve':
        // 批准提案
        const task = await approveProposal(proposalId, assignee)
        console.log('Proposal approved, task created:', task)
        return NextResponse.json({ success: true, task })

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    console.error('POST /api/loop error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}