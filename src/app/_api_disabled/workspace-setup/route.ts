import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * 设置实时工作室所需的额外表
 */

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceKey) {
    return NextResponse.json({
      error: 'Service role key not configured',
      sqlCommands: getSQLCommands()
    }, { status: 500 })
  }

  const supabase = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  const results: Record<string, { success: boolean; error?: string }> = {}

  // 创建 work_logs 表
  try {
    const { error } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS work_logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          agent_id TEXT NOT NULL,
          action TEXT NOT NULL,
          details JSONB DEFAULT '{}',
          duration_seconds INTEGER,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    })
    results.work_logs = { success: !error, error: error?.message }
  } catch (e) {
    results.work_logs = { success: false, error: String(e) }
  }

  // 创建 agent_messages 表
  try {
    const { error } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS agent_messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          from_agent TEXT NOT NULL,
          to_agent TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    })
    results.agent_messages = { success: !error, error: error?.message }
  } catch (e) {
    results.agent_messages = { success: false, error: String(e) }
  }

  // 创建 agent_thoughts 表
  try {
    const { error } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS agent_thoughts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          agent_id TEXT NOT NULL,
          thought TEXT NOT NULL,
          context JSONB DEFAULT '{}',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    })
    results.agent_thoughts = { success: !error, error: error?.message }
  } catch (e) {
    results.agent_thoughts = { success: false, error: String(e) }
  }

  // 创建 task_progress 表
  try {
    const { error } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS task_progress (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          task_id UUID,
          status TEXT NOT NULL,
          progress INTEGER DEFAULT 0,
          blocked_reason TEXT,
          agent_id TEXT,
          notes TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    })
    results.task_progress = { success: !error, error: error?.message }
  } catch (e) {
    results.task_progress = { success: false, error: String(e) }
  }

  return NextResponse.json({
    results,
    sqlCommands: getSQLCommands()
  })
}

function getSQLCommands() {
  return `
-- ============================================
-- 实时工作室扩展表 - 在 Supabase SQL Editor 执行
-- ============================================

-- 1. 工作记录表
CREATE TABLE IF NOT EXISTS work_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Agent 沟通记录表
CREATE TABLE IF NOT EXISTS agent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_agent TEXT NOT NULL,
  to_agent TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Agent 思考记录表
CREATE TABLE IF NOT EXISTS agent_thoughts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  thought TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 任务进程表
CREATE TABLE IF NOT EXISTS task_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID,
  status TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  blocked_reason TEXT,
  agent_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 启用 Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE work_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_thoughts;
ALTER PUBLICATION supabase_realtime ADD TABLE task_progress;

-- 6. 创建索引加速查询
CREATE INDEX IF NOT EXISTS idx_work_logs_agent ON work_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_work_logs_created ON work_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_messages_created ON agent_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_thoughts_agent ON agent_thoughts(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_thoughts_created ON agent_thoughts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_task_progress_task ON task_progress(task_id);
CREATE INDEX IF NOT EXISTS idx_task_progress_status ON task_progress(status);
`
}