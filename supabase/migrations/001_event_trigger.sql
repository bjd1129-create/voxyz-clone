-- Event Trigger: Task Completed -> Create Event
-- 当任务完成时自动创建事件，触发新提案生成

-- 1. 创建触发器函数
CREATE OR REPLACE FUNCTION on_task_completed()
RETURNS TRIGGER AS $$
BEGIN
  -- 当任务状态从非 completed 变为 completed 时
  -- 在 events 表中插入事件记录
  INSERT INTO events (agent_id, action, details)
  VALUES (
    NEW.assignee,
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

-- 2. 创建触发器
DROP TRIGGER IF EXISTS task_completed_trigger ON tasks;

CREATE TRIGGER task_completed_trigger
AFTER UPDATE ON tasks
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM 'completed' AND NEW.status = 'completed')
EXECUTE FUNCTION on_task_completed();

-- 3. 添加注释
COMMENT ON FUNCTION on_task_completed() IS '当任务完成时自动创建事件，用于触发新提案生成';
COMMENT ON TRIGGER task_completed_trigger ON tasks IS '监听任务状态变化，当任务完成时触发事件创建';

-- 4. 验证触发器
-- 测试方式:
-- UPDATE tasks SET status = 'completed' WHERE id = '<task_id>';
-- SELECT * FROM events WHERE action = 'task_completed' ORDER BY created_at DESC LIMIT 1;