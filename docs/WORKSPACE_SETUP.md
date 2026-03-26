# 实时工作室设置指南

## 快速设置

### 1. 创建数据库表

在 Supabase SQL Editor 中执行以下 SQL:

**Supabase Dashboard → SQL Editor → New Query**

```sql
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

-- 5. 创建索引
CREATE INDEX IF NOT EXISTS idx_work_logs_agent ON work_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_work_logs_created ON work_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_messages_created ON agent_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_thoughts_agent ON agent_thoughts(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_thoughts_created ON agent_thoughts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_task_progress_task ON task_progress(task_id);
CREATE INDEX IF NOT EXISTS idx_task_progress_status ON task_progress(status);

-- 6. 插入示例数据
INSERT INTO work_logs (agent_id, action, details, duration_seconds) VALUES
('ceo', '制定战略规划', '{"target": "Q2"}', 1800),
('developer', '实现实时状态同步', '{"feature": "websocket"}', 3600),
('researcher', '分析竞品架构', '{"competitor": "voxyz"}', 2400);

INSERT INTO agent_messages (from_agent, to_agent, message) VALUES
('ceo', 'developer', '优先完成实时同步功能'),
('developer', 'researcher', '需要了解竞品技术架构');

INSERT INTO agent_thoughts (agent_id, thought, context) VALUES
('ceo', '需要平衡短期交付和长期架构优化', '{}'),
('developer', '使用 Supabase Realtime 实现推送', '{}');

INSERT INTO task_progress (status, progress, agent_id, notes) VALUES
('completed', 100, 'developer', '实时状态同步已完成'),
('in_progress', 60, 'creative', 'UI设计进行中'),
('blocked', 20, 'researcher', '等待API文档');
```

### 2. 验证安装

访问 `/workspace` 页面，应该能看到示例数据。

## API 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/work-logs` | GET/POST | 工作记录 CRUD |
| `/api/messages` | GET/POST | Agent 沟通记录 |
| `/api/thoughts` | GET/POST | Agent 思考记录 |
| `/api/task-progress` | GET/POST/PATCH | 任务进程管理 |

## 使用示例

### 记录工作日志
```bash
curl -X POST http://localhost:3000/api/work-logs \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "developer",
    "action": "完成功能开发",
    "details": {"feature": "workspace"},
    "duration_seconds": 3600
  }'
```

### 发送消息
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "from_agent": "ceo",
    "to_agent": "developer",
    "message": "请优先处理核心功能"
  }'
```

### 记录思考
```bash
curl -X POST http://localhost:3000/api/thoughts \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "ceo",
    "thought": "需要重新评估优先级",
    "context": {"reason": "用户反馈"}
  }'
```

### 更新任务进度
```bash
curl -X POST http://localhost:3000/api/task-progress \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "progress": 50,
    "agent_id": "developer",
    "notes": "核心功能开发中"
  }'
```