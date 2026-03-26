# 事件触发器部署指南

## 概述

本迁移创建了一个 PostgreSQL 触发器，当任务状态变为 `completed` 时，自动在 `events` 表中创建事件记录，用于触发新提案生成。

## 文件

- `001_event_trigger.sql` - 主要迁移文件
- `test-event-trigger.sh` - 测试脚本

## 部署方式

### 方式 1: Supabase Dashboard SQL 编辑器 (推荐)

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目: `krhhfykgnznkesnarbzd`
3. 点击左侧菜单 "SQL Editor"
4. 点击 "New query"
5. 复制 `001_event_trigger.sql` 的内容并粘贴
6. 点击 "Run" 执行

### 方式 2: Supabase CLI

```bash
# 安装 Supabase CLI (如果未安装)
npm install -g supabase

# 登录
supabase login

# 关联项目
supabase link --project-ref krhhfykgnznkesnarbzd

# 执行迁移
supabase db push
```

### 方式 3: psql (需要数据库连接字符串)

```bash
# 获取连接字符串: Dashboard > Settings > Database > Connection string
psql "postgresql://postgres:[PASSWORD]@db.krhhfykgnznkesnarbzd.supabase.co:5432/postgres" \
  -f supabase/migrations/001_event_trigger.sql
```

## 验证

执行迁移后，运行测试脚本验证触发器是否正常工作：

```bash
cd /Users/bjd/openclaw/company/website
chmod +x scripts/test-event-trigger.sh
./scripts/test-event-trigger.sh
```

或者手动测试：

```sql
-- 1. 创建测试任务
INSERT INTO tasks (title, status, assignee)
VALUES ('测试触发器任务', 'pending', 'developer')
RETURNING id;

-- 2. 记录任务 ID，然后更新状态
UPDATE tasks SET status = 'completed'
WHERE title = '测试触发器任务';

-- 3. 检查事件是否创建
SELECT * FROM events
WHERE action = 'task_completed'
ORDER BY created_at DESC LIMIT 1;

-- 4. 清理
DELETE FROM events WHERE action = 'task_completed' AND details->>'task_title' = '测试触发器任务';
DELETE FROM tasks WHERE title = '测试触发器任务';
```

## 预期行为

当任务的 `status` 从非 `completed` 变为 `completed` 时：

1. 触发器自动在 `events` 表插入一条记录：
   - `agent_id`: 任务执行者 (assignee 或 assigned_to)
   - `action`: `'task_completed'`
   - `details`: JSON 对象，包含任务 ID、标题、完成时间等

2. 后续可以通过监听 `events` 表或创建另一个触发器来自动创建新提案

## 扩展: 自动创建提案

如果需要事件触发新提案，可以添加另一个触发器：

```sql
-- 当事件标记了 trigger_new_proposal 时，创建提案
CREATE OR REPLACE FUNCTION on_event_trigger_proposal()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.details->>'trigger_new_proposal' = 'true' THEN
    INSERT INTO proposals (agent_id, title, description, status)
    VALUES (
      NEW.agent_id,
      '基于任务完成: ' || NEW.details->>'task_title',
      '自动生成的提案',
      'pending'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER event_proposal_trigger
AFTER INSERT ON events
FOR EACH ROW
EXECUTE FUNCTION on_event_trigger_proposal();
```

## 回滚

如果需要删除触发器：

```sql
DROP TRIGGER IF EXISTS task_completed_trigger ON tasks;
DROP FUNCTION IF EXISTS on_task_completed();
```