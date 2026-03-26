-- Migration: Event Trigger for Task Completion
-- 创建时间: 2026-03-27
-- 目的: 当任务完成时自动创建事件，用于触发新提案生成

-- ============================================================================
-- 步骤 1: 创建触发器函数
-- ============================================================================

CREATE OR REPLACE FUNCTION on_task_completed()
RETURNS TRIGGER AS $$
BEGIN
  -- 当任务状态从非 completed 变为 completed 时
  -- 在 events 表中插入事件记录
  INSERT INTO events (agent_id, action, details)
  VALUES (
    COALESCE(NEW.assignee, NEW.assigned_to, 'unknown'),
    'task_completed',
    jsonb_build_object(
      'task_id', NEW.id,
      'task_title', NEW.title,
      'trigger_new_proposal', true,
      'completed_at', NOW()
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 步骤 2: 创建触发器
-- ============================================================================

DROP TRIGGER IF EXISTS task_completed_trigger ON tasks;

CREATE TRIGGER task_completed_trigger
AFTER UPDATE ON tasks
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM 'completed' AND NEW.status = 'completed')
EXECUTE FUNCTION on_task_completed();

-- ============================================================================
-- 步骤 3: 添加注释
-- ============================================================================

COMMENT ON FUNCTION on_task_completed() IS '当任务完成时自动创建事件，用于触发新提案生成';
COMMENT ON TRIGGER task_completed_trigger ON tasks IS '监听任务状态变化，当任务完成时触发事件创建';

-- ============================================================================
-- 步骤 4: 验证触发器
-- ============================================================================

-- 测试方式 1: 创建测试任务
-- INSERT INTO tasks (title, status, assignee) VALUES ('测试任务', 'pending', 'developer');

-- 测试方式 2: 更新任务状态为完成
-- UPDATE tasks SET status = 'completed' WHERE title = '测试任务';

-- 测试方式 3: 检查事件是否创建
-- SELECT * FROM events WHERE action = 'task_completed' ORDER BY created_at DESC LIMIT 1;

-- ============================================================================
-- 可选: 创建索引优化查询
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_events_action ON events(action);
CREATE INDEX IF NOT EXISTS idx_events_created_desc ON events(created_at DESC);