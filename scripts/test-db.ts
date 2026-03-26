import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, serviceKey)

async function testDatabase() {
  console.log('🔍 测试数据库连接...\n')

  // 测试 agent_status 表
  console.log('📊 agent_status 表:')
  const { data: agents, error: agentError } = await supabase
    .from('agent_status')
    .select('*')
  
  if (agentError) {
    console.log('   ❌ 错误:', agentError.message)
  } else {
    console.log('   ✓ 数据:', agents?.length || 0, '条记录')
    agents?.forEach(a => console.log(`     - ${a.emoji} ${a.name} (${a.agent_id})`))
  }

  // 测试 tasks 表
  console.log('\n📋 tasks 表:')
  const { data: tasks, error: taskError } = await supabase
    .from('tasks')
    .select('*')
  console.log('   ✓ 数据:', tasks?.length || 0, '条记录')

  // 测试 proposals 表
  console.log('\n💡 proposals 表:')
  const { data: proposals, error: propError } = await supabase
    .from('proposals')
    .select('*')
  console.log('   ✓ 数据:', proposals?.length || 0, '条记录')

  // 测试 events 表
  console.log('\n📅 events 表:')
  const { data: events, error: eventError } = await supabase
    .from('events')
    .select('*')
  console.log('   ✓ 数据:', events?.length || 0, '条记录')

  // 如果 agent_status 为空，初始化数据
  if (!agents || agents.length === 0) {
    console.log('\n⚙️  初始化 Agent 数据...')
    const { error: initError } = await supabase
      .from('agent_status')
      .insert([
        { agent_id: 'ceo', name: '诸葛灯泡', emoji: '💡', color: '#FF6B6B', position_x: 200, position_y: 150 },
        { agent_id: 'coordinator', name: '掌舵人', emoji: '🎯', color: '#A855F7', position_x: 350, position_y: 150 },
        { agent_id: 'developer', name: '代码侠', emoji: '💻', color: '#3B82F6', position_x: 500, position_y: 150 },
        { agent_id: 'writer', name: '文案君', emoji: '📝', color: '#10B981', position_x: 200, position_y: 300 },
        { agent_id: 'researcher', name: '洞察者', emoji: '🔍', color: '#F59E0B', position_x: 350, position_y: 300 },
        { agent_id: 'support', name: '守护者', emoji: '🛠️', color: '#EC4899', position_x: 500, position_y: 300 }
      ])
    
    if (initError) {
      console.log('   ❌ 初始化失败:', initError.message)
    } else {
      console.log('   ✅ 初始化成功！')
    }
  }

  console.log('\n✅ 测试完成！')
}

testDatabase().catch(console.error)