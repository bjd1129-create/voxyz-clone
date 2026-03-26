-- ============================================
-- Ops 自动化基础设施表
-- 在 Supabase SQL Editor 执行:
-- https://supabase.com/dashboard/project/krhhfykgnznkesnarbzd/sql/new
-- ============================================

-- 1. 任务提案表
CREATE TABLE IF NOT EXISTS ops_mission_proposals (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 任务表
CREATE TABLE IF NOT EXISTS ops_missions (
  id SERIAL PRIMARY KEY,
  proposal_id INTEGER REFERENCES ops_mission_proposals(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active', -- active, completed, failed, paused
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 任务步骤表
CREATE TABLE IF NOT EXISTS ops_mission_steps (
  id SERIAL PRIMARY KEY,
  mission_id INTEGER REFERENCES ops_missions(id),
  step_number INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  kind TEXT, -- draft_content, research, analyze, review, etc.
  status TEXT DEFAULT 'pending', -- pending, running, completed, failed
  assigned_to TEXT,
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Agent事件表
CREATE TABLE IF NOT EXISTS ops_agent_events (
  id SERIAL PRIMARY KEY,
  agent_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 触发规则表
CREATE TABLE IF NOT EXISTS ops_trigger_rules (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  condition JSONB NOT NULL,
  action JSONB NOT NULL,
  cooldown_seconds INTEGER DEFAULT 300,
  enabled BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 策略配置表
CREATE TABLE IF NOT EXISTS ops_policy (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value_json JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Agent反应表
CREATE TABLE IF NOT EXISTS ops_agent_reactions (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES ops_agent_events(id),
  rule_id INTEGER REFERENCES ops_trigger_rules(id),
  agent_name TEXT NOT NULL,
  action_taken TEXT,
  result JSONB,
  status TEXT DEFAULT 'done', -- queued, processing, done, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 Realtime (可选，用于实时监控)
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS ops_mission_proposals;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS ops_missions;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS ops_mission_steps;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS ops_agent_events;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS ops_trigger_rules;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS ops_policy;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS ops_agent_reactions;

-- 创建索引加速查询
CREATE INDEX IF NOT EXISTS idx_ops_missions_proposal ON ops_missions(proposal_id);
CREATE INDEX IF NOT EXISTS idx_ops_missions_status ON ops_missions(status);
CREATE INDEX IF NOT EXISTS idx_ops_mission_steps_mission ON ops_mission_steps(mission_id);
CREATE INDEX IF NOT EXISTS idx_ops_mission_steps_status ON ops_mission_steps(status);
CREATE INDEX IF NOT EXISTS idx_ops_agent_events_agent ON ops_agent_events(agent_name);
CREATE INDEX IF NOT EXISTS idx_ops_agent_events_type ON ops_agent_events(event_type);
CREATE INDEX IF NOT EXISTS idx_ops_agent_events_created ON ops_agent_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ops_trigger_rules_enabled ON ops_trigger_rules(enabled);
CREATE INDEX IF NOT EXISTS idx_ops_agent_reactions_event ON ops_agent_reactions(event_id);
CREATE INDEX IF NOT EXISTS idx_ops_agent_reactions_rule ON ops_agent_reactions(rule_id);
CREATE INDEX IF NOT EXISTS idx_ops_agent_reactions_status ON ops_agent_reactions(status);

-- 插入初始策略配置
INSERT INTO ops_policy (key, value_json, description) VALUES 
('auto_approve', '{"enabled": true, "allowed_step_kinds": ["draft_content", "research", "analyze", "review"]}', 'Controls which step kinds can be auto-approved'),
('heartbeat_enabled', '{"enabled": true}', 'Enables/disables heartbeat monitoring'),
('heartbeat_interval', '{"value": 300, "unit": "seconds"}', 'Agent心跳检查间隔（秒）'),
('stale_task_timeout', '{"value": 1800, "unit": "seconds"}', '任务超时时间（秒），超过此时间视为停滞'),
('max_daily_tasks', '{"value": 100, "unit": "count"}', '单个Agent每日任务上限'),
('auto_approve_enabled', '{"enabled": true, "allowed_kinds": ["draft_content", "research", "analyze", "review"]}', '自动审批开关配置'),
('x_daily_quota', '{"limit": 10}', 'Daily quota limit for X API calls')
ON CONFLICT (key) DO NOTHING;

-- 插入初始触发器规则
INSERT INTO ops_trigger_rules (name, condition, action, cooldown_seconds, enabled, description) VALUES 
('task_timeout', '{"type": "step_stale", "threshold_minutes": 30}', '{"type": "alert", "target": "coordinator"}', 3600, true, 'Alert coordinator when a step becomes stale'),
('mission_failed', '{"type": "mission_status", "status": "failed"}', '{"type": "alert", "target": "coordinator"}', 1800, true, 'Alert coordinator when a mission fails')
ON CONFLICT (name) DO NOTHING;