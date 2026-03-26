#!/bin/bash
# Event Trigger 测试脚本
# 用于验证任务完成触发器是否正常工作

SUPABASE_URL="https://krhhfykgnznkesnarbzd.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyaGhmeWtnbnpua2VzbmFyYnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MDA3NjUsImV4cCI6MjA5MDA3Njc2NX0.hPCc7FPJ12bRhZ4MJ4jbjDN8XtOqAyuuoDUvy4g_IJo"

echo "=== 事件触发器测试 ==="
echo ""

# 1. 创建测试任务
echo "步骤 1: 创建测试任务..."
TASK_RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/rest/v1/tasks" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"title": "测试触发器任务", "status": "pending", "assignee": "developer"}')

TASK_ID=$(echo "$TASK_RESPONSE" | jq -r '.[0].id // .id // empty')
echo "任务 ID: $TASK_ID"
echo ""

# 2. 更新任务状态为完成
echo "步骤 2: 将任务状态更新为 completed..."
curl -s -X PATCH "${SUPABASE_URL}/rest/v1/tasks?id=eq.${TASK_ID}" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"status": "completed"}' | jq .
echo ""

# 3. 检查事件是否创建
echo "步骤 3: 检查事件表..."
curl -s "${SUPABASE_URL}/rest/v1/events?select=*&order=created_at.desc&limit=3" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" | jq .
echo ""

# 4. 清理测试数据
echo "步骤 4: 清理测试数据..."
curl -s -X DELETE "${SUPABASE_URL}/rest/v1/tasks?id=eq.${TASK_ID}" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
echo "测试任务已删除"
echo ""

echo "=== 测试完成 ==="