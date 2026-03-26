/**
 * 数据库设置脚本
 * 
 * 执行方式：npx tsx scripts/setup-db.ts
 * 
 * 注意：此脚本需要 SUPABASE_SERVICE_ROLE_KEY 环境变量
 * 
 * 如果没有 service role key，需要：
 * 1. 访问 Supabase Dashboard > Settings > API
 * 2. 复制 service_role key（不是 anon key）
 * 3. 设置环境变量：SUPABASE_SERVICE_ROLE_KEY=xxx
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('❌ 缺少环境变量：')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', serviceKey ? '✓' : '✗')
  console.error('\n请在 Supabase Dashboard > Settings > API 获取 service_role key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const schemaSQL = `
-- VoxYZ Clone 数据闭环核心
-- 4 张表形成自循环

-- 1. 提案表 (Agent 想法)
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'idea',
  status TEXT DEFAULT 'pending',
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  converted_to_task UUID REFERENCES tasks(id)
);

-- 2. 任务表 (已批准的提案)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  assignee TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  priority INTEGER DEFAULT 0,
  proposal_id UUID REFERENCES proposals(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 3. 步骤表 (任务拆分)
CREATE TABLE IF NOT EXISTS steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  result TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 4. 事件表 (执行记录)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  type TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  trigger_new_proposal BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Agent 状态表 (实时状态)
CREATE TABLE IF NOT EXISTS agent_status (
  agent_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL,
  status TEXT DEFAULT 'idle',
  current_task TEXT,
  current_task_id UUID REFERENCES tasks(id),
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  activity TEXT DEFAULT 'idle',
  last_active TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
`

async function setupDatabase() {
  console.log('🚀 开始设置数据库...\n')

  // 检查表是否存在
  console.log('📋 检查现有表...')
  const { data: tables, error: tableError } = await supabase
    .from('agent_status')
    .select('agent_id')
    .limit(1)

  if (tableError) {
    console.log('   表不存在，需要创建\n')
  } else {
    console.log('   ✓ 表已存在\n')
    console.log('✅ 数据库已经设置完成')
    return
  }

  // 使用 RPC 执行 SQL
  console.log('📝 创建表结构...')
  
  // 由于我们无法直接执行 DDL，我们需要使用 Supabase Management API
  // 或者提供说明让用户在 Dashboard 中执行
  
  console.log('\n⚠️  无法通过 REST API 执行 DDL 语句')
  console.log('\n请在 Supabase Dashboard 中执行以下操作：')
  console.log('1. 访问: https://supabase.com/dashboard/project/krhhfykgnznkesnarbzd/sql/new')
  console.log('2. 复制 /company/supabase/schema.sql 的内容')
  console.log('3. 在 SQL Editor 中执行')
  console.log('\n或者使用 psql 连接：')
  console.log('psql "postgresql://postgres:[YOUR-PASSWORD]@db.krhhfykgnznkesnarbzd.supabase.co:5432/postgres" -f /Users/bjd/openclaw/company/supabase/schema.sql')
}

setupDatabase().catch(console.error)