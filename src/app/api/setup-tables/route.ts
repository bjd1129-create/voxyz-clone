import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * 设置表结构 - 添加缺失的列
 * 注意：这需要 Service Role Key，如果不可用，需要手动在 Supabase Dashboard 执行
 */

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const results = {
    tables: {} as Record<string, boolean>,
    missingColumns: [] as string[],
    instructions: [] as string[]
  }

  const client = createClient(url, anonKey)

  // 检查 proposals 表
  try {
    const { error } = await client.from('proposals').select('id, agent_id, title, description, type, status, votes').limit(1)
    if (error) {
      if (error.message.includes('type')) {
        results.missingColumns.push('proposals.type')
        results.instructions.push('ALTER TABLE proposals ADD COLUMN type TEXT DEFAULT \'idea\';')
      }
      if (error.message.includes('votes')) {
        results.missingColumns.push('proposals.votes')
        results.instructions.push('ALTER TABLE proposals ADD COLUMN votes INTEGER DEFAULT 0;')
      }
    } else {
      results.tables.proposals = true
    }
  } catch (e) {
    results.tables.proposals = false
  }

  // 检查 tasks 表
  try {
    const { error } = await client.from('tasks').select('id, title, assignee, status, priority, proposal_id, completed_at').limit(1)
    if (error) {
      if (error.message.includes('priority')) {
        results.missingColumns.push('tasks.priority')
        results.instructions.push('ALTER TABLE tasks ADD COLUMN priority INTEGER DEFAULT 0;')
      }
      if (error.message.includes('proposal_id')) {
        results.missingColumns.push('tasks.proposal_id')
        results.instructions.push('ALTER TABLE tasks ADD COLUMN proposal_id UUID;')
      }
      if (error.message.includes('completed_at')) {
        results.missingColumns.push('tasks.completed_at')
        results.instructions.push('ALTER TABLE tasks ADD COLUMN completed_at TIMESTAMPTZ;')
      }
    } else {
      results.tables.tasks = true
    }
  } catch (e) {
    results.tables.tasks = false
  }

  // 检查 events 表
  try {
    const { error } = await client.from('events').select('id, agent_id, type, action, details, trigger_new_proposal').limit(1)
    if (error) {
      if (error.message.includes('trigger_new_proposal')) {
        results.missingColumns.push('events.trigger_new_proposal')
        results.instructions.push('ALTER TABLE events ADD COLUMN trigger_new_proposal BOOLEAN DEFAULT false;')
      }
    } else {
      results.tables.events = true
    }
  } catch (e) {
    results.tables.events = false
  }

  return NextResponse.json({
    status: results.missingColumns.length === 0 ? 'ready' : 'migration_needed',
    ...results,
    sqlCommands: results.instructions.length > 0 ? `
-- 在 Supabase SQL Editor 中执行：
-- https://supabase.com/dashboard/project/krhhfykgnznkesnarbzd/sql/new

${results.instructions.join('\n')}
` : null
  })
}