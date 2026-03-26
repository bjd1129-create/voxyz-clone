-- ============================================
-- 实时工作室扩展表
-- 在 Supabase SQL Editor 执行:
-- https://supabase.com/dashboard/project/krhhfykgnznkesnarbzd/sql/new
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

-- 5. 启用 Realtime (可选，用于实时推送)
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

-- 7. 插入示例数据
-- 工作记录示例
INSERT INTO work_logs (agent_id, action, details, duration_seconds) VALUES
('ceo', '制定战略规划', '{"target": "Q2", "priority": "high"}', 1800),
('developer', '实现实时状态同步', '{"feature": "websocket", "status": "completed"}', 3600),
('researcher', '分析竞品架构', '{"competitor": "voxyz.space"}', 2400),
('writer', '撰写产品文档', '{"pages": 5}' , 1200),
('creative', '设计UI原型', '{"screens": 3, "tool": "figma"}', 2700);

-- 消息示例
INSERT INTO agent_messages (from_agent, to_agent, message) VALUES
('ceo', 'developer', '优先完成实时同步功能，这是本周的关键目标'),
('developer', 'researcher', '我需要了解竞品的技术架构，有什么发现吗？'),
('researcher', 'developer', '他们使用了 WebSocket + Supabase Realtime，非常高效'),
('writer', 'creative', '新的产品文档需要配合UI设计，什么时候可以出图？'),
('creative', 'ceo', '设计原型已完成，请审核确认');

-- 思考示例
INSERT INTO agent_thoughts (agent_id, thought, context) VALUES
('ceo', '需要平衡短期交付和长期架构优化，当前应该优先完成核心功能', '{"decision": "prioritize_core_features"}'),
('developer', '使用 Supabase Realtime 可以快速实现推送功能，但需要考虑断线重连', '{"tech_choice": "supabase_realtime", "concern": "reconnection"}'),
('researcher', '竞品的市场定位更偏向企业用户，我们可以差异化定位个人用户', '{"insight": "market_positioning"}'),
('creative', '深色主题配合渐变色彩可以突出科技感，但要注意可读性', '{"design_direction": "dark_gradient"}'),
('writer', '文档结构应该从用户痛点出发，而不是功能列表', '{"approach": "pain_point_first"}');

-- 任务进度示例
INSERT INTO task_progress (task_id, status, progress, agent_id, notes) VALUES
(gen_random_uuid(), 'completed', 100, 'developer', '实时状态同步已完成'),
(gen_random_uuid(), 'in_progress', 60, 'creative', 'UI设计优化进行中'),
(gen_random_uuid(), 'in_progress', 30, 'writer', '产品文档撰写中'),
(gen_random_uuid(), 'blocked', 20, 'researcher', '等待第三方API文档'),
(gen_random_uuid(), 'pending', 0, 'support', '用户反馈系统待启动');

-- 阻塞原因示例
UPDATE task_progress 
SET blocked_reason = '第三方API文档未提供，已发送跟进邮件' 
WHERE status = 'blocked';