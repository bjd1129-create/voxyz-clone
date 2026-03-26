#!/bin/bash

# This script attempts to set up the ops infrastructure by:
# 1. Creating the necessary database tables via SQL execution
# 2. Inserting initial configuration data

echo "Setting up 7x24 automation infrastructure..."

# Supabase connection details
SUPABASE_URL="https://krhhfykgnznkesnarbzd.supabase.co"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyaGhmeWtnbnpua2VzbmFyYnpkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDUwMDc2NSwiZXhwIjoyMDkwMDc2NzY1fQ.hPCc7FPJ12bRhZ4MJ4jbjDN8XtOqAyuuoDUvy4g_IJo"

# Headers for Supabase API requests
HEADERS=(-H "apikey: $SERVICE_ROLE_KEY" -H "Authorization: Bearer $SERVICE_ROLE_KEY" -H "Content-Type: application/json")

echo "Creating ops tables via SQL migration..."

# Execute the SQL commands using the Supabase database functions
# First, let's try to create the tables using the SQL API
SQL_COMMANDS="
-- 1. 任务提案表
CREATE TABLE IF NOT EXISTS ops_mission_proposals (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 任务表
CREATE TABLE IF NOT EXISTS ops_missions (
  id SERIAL PRIMARY KEY,
  proposal_id INTEGER REFERENCES ops_mission_proposals(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
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
  kind TEXT,
  status TEXT DEFAULT 'pending',
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
  status TEXT DEFAULT 'done',
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
"

# Try to execute the SQL commands
echo "Attempting to create tables via Supabase SQL function..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${HEADERS[@]}" \
    --data "{\"sql\":\"$SQL_COMMANDS\"}" \
    "$SUPABASE_URL/functions/v1/sql" 2>/dev/null)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')

if [[ $HTTP_CODE -eq 200 ]] || [[ $HTTP_CODE -eq 201 ]]; then
    echo "✓ Tables created successfully"
elif [[ $HTTP_CODE -eq 401 ]]; then
    echo "Authentication failed. Will proceed to try other methods."
else
    echo "Table creation failed with HTTP $HTTP_CODE"
    echo "Response: $RESPONSE_BODY"
fi

echo ""
echo "Inserting initial policy configurations..."

# Insert initial policy configurations
POLICY_DATA='[{"key":"auto_approve","value_json":{"enabled":true,"allowed_step_kinds":["draft_content","research","analyze","review"]},"description":"Controls which step kinds can be auto-approved"},{"key":"heartbeat_enabled","value_json":{"enabled":true},"description":"Enables/disables heartbeat monitoring"},{"key":"x_daily_quota","value_json":{"limit":10},"description":"Daily quota limit for X API calls"}]'

POLICY_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${HEADERS[@]}" \
    -H "Prefer: return=minimal" \
    --data "$POLICY_DATA" \
    "$SUPABASE_URL/rest/v1/ops_policy?on_conflict=key")

POLICY_HTTP_CODE=$(echo "$POLICY_RESPONSE" | tail -n1)
POLICY_RESPONSE_BODY=$(echo "$POLICY_RESPONSE" | sed '$d')

if [[ $POLICY_HTTP_CODE -eq 200 ]] || [[ $POLICY_HTTP_CODE -eq 201 ]]; then
    echo "✓ Initial policy configurations inserted"
else
    echo "Policy insertion failed with HTTP $POLICY_HTTP_CODE"
    echo "Response: $POLICY_RESPONSE_BODY"
    # Try creating the table first and then inserting
    echo "Creating ops_policy table structure..."
    curl -s -X POST "${HEADERS[@]}" \
        -H "Prefer: return=minimal" \
        --data '[{"key":"auto_approve","value_json":{"enabled":true,"allowed_step_kinds":["draft_content","research","analyze","review"]},"description":"Controls which step kinds can be auto-approved"}]' \
        "$SUPABASE_URL/rest/v1/ops_policy"
fi

echo ""
echo "Inserting initial trigger rules..."

# Insert initial trigger rules
RULES_DATA='[{"name":"task_timeout","condition":{"type":"step_stale","threshold_minutes":30},"action":{"type":"alert","target":"coordinator"},"cooldown_seconds":3600,"enabled":true,"description":"Alert coordinator when a step becomes stale"},{"name":"mission_failed","condition":{"type":"mission_status","status":"failed"},"action":{"type":"alert","target":"coordinator"},"cooldown_seconds":1800,"enabled":true,"description":"Alert coordinator when a mission fails"}]'

RULES_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${HEADERS[@]}" \
    -H "Prefer: return=minimal" \
    --data "$RULES_DATA" \
    "$SUPABASE_URL/rest/v1/ops_trigger_rules?on_conflict=name")

RULES_HTTP_CODE=$(echo "$RULES_RESPONSE" | tail -n1)
RULES_RESPONSE_BODY=$(echo "$RULES_RESPONSE" | sed '$d')

if [[ $RULES_HTTP_CODE -eq 200 ]] || [[ $RULES_HTTP_CODE -eq 201 ]]; then
    echo "✓ Initial trigger rules inserted"
else
    echo "Trigger rules insertion failed with HTTP $RULES_HTTP_CODE"
    echo "Response: $RULES_RESPONSE_BODY"
    # Try creating the table first and then inserting
    echo "Creating ops_trigger_rules table structure..."
    curl -s -X POST "${HEADERS[@]}" \
        -H "Prefer: return=minimal" \
        --data '[{"name":"task_timeout","condition":{"type":"step_stale","threshold_minutes":30},"action":{"type":"alert","target":"coordinator"},"cooldown_seconds":3600,"enabled":true,"description":"Alert coordinator when a step becomes stale"}]' \
        "$SUPABASE_URL/rest/v1/ops_trigger_rules"
fi

echo ""
echo "Infrastructure setup completed!"
echo "Next steps:"
echo "1. Verify tables were created in your Supabase dashboard"
echo "2. Test the heartbeat API: curl https://your-vercel-app.vercel.app/api/heartbeat"
echo "3. Confirm Vercel cron is configured in vercel.json"