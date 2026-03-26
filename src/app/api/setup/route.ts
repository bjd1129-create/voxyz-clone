import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * 设置 API - 检查和设置数据库
 * 
 * GET /api/setup - 检查数据库状态
 * POST /api/setup - 执行设置（需要 service role key）
 */

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const config = {
    url: supabaseUrl ? '✓' : '✗',
    anonKey: anonKey ? '✓' : '✗',
    serviceKey: serviceKey ? '✓ (隐藏)' : '✗'
  }

  if (!supabaseUrl || !anonKey) {
    return NextResponse.json({
      status: 'error',
      message: '缺少必要的环境变量',
      config
    }, { status: 500 })
  }

  // 使用 anon key 测试连接
  const supabase = createClient(supabaseUrl, anonKey)

  // 检查表是否存在
  const checks = {
    agent_status: false,
    tasks: false,
    events: false,
    proposals: false,
    steps: false
  }

  try {
    await supabase.from('agent_status').select('agent_id').limit(1)
    checks.agent_status = true
  } catch {}

  try {
    await supabase.from('tasks').select('id').limit(1)
    checks.tasks = true
  } catch {}

  try {
    await supabase.from('events').select('id').limit(1)
    checks.events = true
  } catch {}

  try {
    await supabase.from('proposals').select('id').limit(1)
    checks.proposals = true
  } catch {}

  try {
    await supabase.from('steps').select('id').limit(1)
    checks.steps = true
  } catch {}

  const allTablesExist = Object.values(checks).every(v => v)

  return NextResponse.json({
    status: allTablesExist ? 'ready' : 'setup_required',
    message: allTablesExist 
      ? '✅ 数据库已配置完成' 
      : '⚠️ 需要创建表结构',
    config,
    tables: checks,
    nextSteps: allTablesExist ? undefined : [
      '访问 Supabase SQL Editor:',
      'https://supabase.com/dashboard/project/krhhfykgnznkesnarbzd/sql/new',
      '',
      '复制并执行 /company/supabase/schema.sql 的内容'
    ]
  })
}