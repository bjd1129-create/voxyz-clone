import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const sb = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// 完整的数据库初始化SQL
const INIT_SQL = `
-- Agents 表
CREATE TABLE IF NOT EXISTS agents (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  emoji VARCHAR(10),
  role VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  current_task TEXT,
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events 表
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  agent_id VARCHAR(50),
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Research Reports 表
CREATE TABLE IF NOT EXISTS ai_research_reports (
  id VARCHAR(100) PRIMARY KEY,
  title TEXT NOT NULL,
  theme VARCHAR(50) NOT NULL,
  focus TEXT,
  keywords TEXT[],
  regions TEXT[],
  content JSONB,
  status VARCHAR(20) DEFAULT 'draft',
  reviewed_by VARCHAR(100),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages 表
CREATE TABLE IF NOT EXISTS agent_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'thought',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks 表
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  assignee VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_agent_id ON events(agent_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_research_theme ON ai_research_reports(theme);
CREATE INDEX IF NOT EXISTS idx_ai_research_created_at ON ai_research_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_messages_agent_id ON agent_messages(agent_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee);

-- 启用 RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_research_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY "Allow all for service_role" ON agents FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow read for all" ON agents FOR SELECT USING (true);

CREATE POLICY "Allow all for service_role" ON events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow read for all" ON events FOR SELECT USING (true);

CREATE POLICY "Allow all for service_role" ON ai_research_reports FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow read for all" ON ai_research_reports FOR SELECT USING (true);

CREATE POLICY "Allow all for service_role" ON agent_messages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow read for all" ON agent_messages FOR SELECT USING (true);

CREATE POLICY "Allow all for service_role" ON tasks FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow read for all" ON tasks FOR SELECT USING (true);

-- 插入默认 Agents
INSERT INTO agents (id, name, emoji, role, status, position_x, position_y) VALUES
  ('coordinator', '协调员', '🎯', '团队协调与任务分配', 'active', 100, 100),
  ('researcher', '洞察者', '🔍', '市场研究与数据分析', 'active', 200, 100),
  ('writer', '文案君', '📝', '内容创作与编辑', 'active', 300, 100),
  ('engineer', '代码侠', '💻', '技术开发与维护', 'active', 400, 100),
  ('designer', '配色师', '🎨', 'UI/UX设计', 'active', 500, 100),
  ('support', '守护者', '🛠️', '用户支持与服务', 'active', 600, 100)
ON CONFLICT (id) DO NOTHING;
`;

export async function GET() {
  try {
    // Supabase 不支持直接执行多语句 SQL，所以我们需要逐表创建
    
    const results: { table: string; success: boolean; error?: string }[] = [];
    
    // 创建 agents 表
    const { error: agentsError } = await sb.from('agents').select('id').limit(1);
    if (agentsError && agentsError.message.includes('does not exist')) {
      results.push({ table: 'agents', success: false, error: '需要手动创建' });
    } else {
      results.push({ table: 'agents', success: true });
    }
    
    // 创建 events 表
    const { error: eventsError } = await sb.from('events').select('id').limit(1);
    if (eventsError && eventsError.message.includes('does not exist')) {
      results.push({ table: 'events', success: false, error: '需要手动创建' });
    } else {
      results.push({ table: 'events', success: true });
    }
    
    // 创建 ai_research_reports 表
    const { error: reportsError } = await sb.from('ai_research_reports').select('id').limit(1);
    if (reportsError && reportsError.message.includes('does not exist')) {
      results.push({ table: 'ai_research_reports', success: false, error: '需要手动创建' });
    } else {
      results.push({ table: 'ai_research_reports', success: true });
    }
    
    // 创建 agent_messages 表
    const { error: messagesError } = await sb.from('agent_messages').select('id').limit(1);
    if (messagesError && messagesError.message.includes('does not exist')) {
      results.push({ table: 'agent_messages', success: false, error: '需要手动创建' });
    } else {
      results.push({ table: 'agent_messages', success: true });
    }
    
    // 创建 tasks 表
    const { error: tasksError } = await sb.from('tasks').select('id').limit(1);
    if (tasksError && tasksError.message.includes('does not exist')) {
      results.push({ table: 'tasks', success: false, error: '需要手动创建' });
    } else {
      results.push({ table: 'tasks', success: true });
    }
    
    const allSuccess = results.every(r => r.success);
    
    return NextResponse.json({
      success: allSuccess,
      message: allSuccess 
        ? '✅ 所有数据库表都已存在' 
        : '⚠️ 部分表需要手动创建',
      tables: results,
      sqlToRun: allSuccess ? null : INIT_SQL,
      instructions: allSuccess ? null : [
        '1. 打开 Supabase Dashboard (https://supabase.com/dashboard)',
        '2. 进入 SQL Editor',
        '3. 粘贴上面的 SQL 并执行',
        '4. 刷新此页面确认',
      ],
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '检查失败',
      details: error,
      sqlToRun: INIT_SQL,
    }, { status: 500 });
  }
}