import { NextResponse } from 'next/server'
import { supabase, claimTask, completeTask, createProposal, updateAgentStatus } from '@/lib/loop'

/**
 * Cron 触发器 - Agent 自动执行
 *
 * 被 Vercel Cron 调用，让每个 Agent 自动工作
 */

// Vercel Cron Authorization
function verifyCronAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // If CRON_SECRET is set, verify it
  if (cronSecret) {
    return authHeader === `Bearer ${cronSecret}`;
  }
  
  // In development, allow without secret
  return process.env.NODE_ENV === 'development';
}

export async function GET(request: Request) {
  // Verify cron authorization
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url)
  const agentId = searchParams.get('agent')

  if (!agentId) {
    return NextResponse.json({ error: 'Missing agent parameter' }, { status: 400 })
  }

  const results = {
    agentId,
    timestamp: new Date().toISOString(),
    actions: [] as string[]
  }

  try {
    // 1. 获取 Agent 当前状态
    const { data: agent } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single()

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // 2. 如果 Agent 正忙，跳过
    if (agent.status === 'busy') {
      results.actions.push(`Already busy with: ${agent.current_task}`)
      return NextResponse.json(results)
    }

    // 3. 检查待办任务
    const { data: pendingTasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('assignee', agentId)
      .eq('status', 'pending')
      .order('priority', { ascending: false })
      .limit(1)

    if (pendingTasks && pendingTasks.length > 0) {
      // 认领任务
      const task = pendingTasks[0]
      await claimTask(task.id, agentId)
      results.actions.push(`Claimed task: ${task.title}`)

      // 模拟执行（实际生产中 Agent 会真正执行）
      // 这里我们随机决定是否完成
      const shouldComplete = Math.random() > 0.3 // 70% 概率完成

      if (shouldComplete) {
        await new Promise(r => setTimeout(r, 1000)) // 模拟工作
        await completeTask(task.id, agentId)
        results.actions.push(`Completed task: ${task.title}`)

        // 任务完成会触发事件，事件会触发新提案
      } else {
        results.actions.push(`Still working on: ${task.title}`)
      }
    } else {
      // 没有待办任务，检查是否要发起新提案
      const shouldPropose = Math.random() > 0.7 // 30% 概率发起新提案

      if (shouldPropose) {
        const proposalIdeas = getProposalIdeas(agentId)
        const idea = proposalIdeas[Math.floor(Math.random() * proposalIdeas.length)]

        await createProposal(agentId, idea.title, idea.description, idea.type)
        results.actions.push(`Created proposal: ${idea.title}`)
      } else {
        results.actions.push('No pending tasks, idle')

        // 更新状态为 idle
        await updateAgentStatus(agentId, 'idle', null, null, getRandomActivity())
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      ...results
    }, { status: 500 })
  }
}

function getProposalIdeas(agentId: string): Array<{ title: string; description: string; type: 'idea' | 'improvement' | 'bug' }> {
  const ideas: Record<string, Array<{ title: string; description: string; type: 'idea' | 'improvement' | 'bug' }>> = {
    coordinator: [
      { title: '优化任务分配算法', description: '根据 Agent 能力和负载智能分配任务', type: 'improvement' },
      { title: '建立周报机制', description: '每周生成团队工作报告', type: 'idea' },
    ],
    developer: [
      { title: '实现 WebSocket 实时推送', description: '让 Agent 状态实时同步到前端', type: 'improvement' },
      { title: '添加错误监控', description: '自动捕获和报告系统错误', type: 'bug' },
      { title: '优化构建速度', description: '减少 Next.js 构建时间', type: 'improvement' },
    ],
    researcher: [
      { title: '调研 Agent 记忆方案', description: '研究如何让 Agent 拥有长期记忆', type: 'idea' },
      { title: '对比竞品新功能', description: '分析 openclaw.ai 最新更新', type: 'idea' },
    ],
    writer: [
      { title: '撰写技术博客', description: '分享数据闭环设计经验', type: 'idea' },
      { title: '完善文档', description: '更新 API 文档', type: 'improvement' },
    ],
    designer: [
      { title: '优化 Office 动画', description: '添加更多 Agent 交互效果', type: 'improvement' },
      { title: '设计新页面', description: '创建 Agent 详情页', type: 'idea' },
    ],
    support: [
      { title: '整理 FAQ', description: '收集常见问题和解答', type: 'improvement' },
    ],
  }
  return ideas[agentId] || [{ title: '通用改进', description: '待细化', type: 'idea' }]
}

function getRandomActivity(): 'walking' | 'coffee' | 'idle' {
  const activities: ('walking' | 'coffee' | 'idle')[] = ['walking', 'coffee', 'idle']
  return activities[Math.floor(Math.random() * activities.length)]
}