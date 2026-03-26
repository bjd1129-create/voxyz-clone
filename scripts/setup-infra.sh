#!/bin/bash

# Supabase connection details
SUPABASE_URL="https://krhhfykgnznkesnarbzd.supabase.co"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyaGhmeWtnbnpua2VzbmFyYnpkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDUwMDc2NSwiZXhwIjoyMDkwMDc2NzY1fQ.hPCc7FPJ12bRhZ4MJ4jbjDN8XtOqAyuuoDUvy4g_IJo"

# Headers for Supabase API requests
HEADERS=(-H "apikey: $SERVICE_ROLE_KEY" -H "Authorization: Bearer $SERVICE_ROLE_KEY" -H "Content-Type: application/json")

echo "Checking if tables exist..."

# Check if a table exists by querying the information schema
check_table() {
    local table_name=$1
    echo "Checking table: $table_name"
    
    response=$(curl -s -w "\n%{http_code}" "${HEADERS[@]}" \
        "$SUPABASE_URL/rest/v1/$table_name?select=count&limit=1")
    
    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | sed '$d')
    
    if [[ $http_code -eq 200 ]]; then
        echo "✓ Table $table_name exists"
        return 0
    elif [[ $http_code -eq 400 ]] && [[ $response_body == *"does not exist"* ]]; then
        echo "✗ Table $table_name does not exist"
        return 1
    else
        echo "? Status of table $table_name unknown (HTTP $http_code)"
        echo "Response: $response_body"
        return 2
    fi
}

# Create a table using Supabase SQL API
create_table() {
    local table_name=$1
    local table_definition=$2
    
    echo "Creating table: $table_name"
    
    # Attempt to create the table
    response=$(curl -s -w "\n%{http_code}" -X POST "${HEADERS[@]}" \
        --data "{\"sql\":\"CREATE TABLE IF NOT EXISTS $table_definition\"}" \
        "$SUPABASE_URL/functions/v1/sql")
    
    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | sed '$d')
    
    if [[ $http_code -eq 200 ]] || [[ $http_code -eq 201 ]]; then
        echo "✓ Table $table_name created successfully"
        return 0
    else
        echo "✗ Failed to create table $table_name (HTTP $http_code)"
        echo "Response: $response_body"
        return 1
    fi
}

# Execute raw SQL command
execute_sql() {
    local sql_command=$1
    
    response=$(curl -s -w "\n%{http_code}" -X POST "${HEADERS[@]}" \
        --data "{\"statement\":\"$sql_command\", \"params\":[]}" \
        "$SUPABASE_URL/rest/v1/rpc/experimental_rpc")
    
    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | sed '$d')
    
    if [[ $http_code -ge 200 && $http_code -le 299 ]]; then
        return 0
    else
        echo "✗ SQL execution failed (HTTP $http_code): $sql_command"
        echo "Response: $response_body"
        return 1
    fi
}

# Check and create tables
tables=(
    "ops_mission_proposals"
    "ops_missions"
    "ops_mission_steps"
    "ops_agent_events"
    "ops_trigger_rules"
    "ops_policy"
    "ops_agent_reactions"
)

# Define table schemas
table_schemas=(
    "ops_mission_proposals (id SERIAL PRIMARY KEY, title TEXT NOT NULL, description TEXT, priority INTEGER DEFAULT 0, status TEXT DEFAULT 'pending', created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW())"
    "ops_missions (id SERIAL PRIMARY KEY, proposal_id INTEGER REFERENCES ops_mission_proposals(id), title TEXT NOT NULL, description TEXT, status TEXT DEFAULT 'active', created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW())"
    "ops_mission_steps (id SERIAL PRIMARY KEY, mission_id INTEGER REFERENCES ops_missions(id), step_number INTEGER, title TEXT NOT NULL, description TEXT, kind TEXT, status TEXT DEFAULT 'pending', assigned_to TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW())"
    "ops_agent_events (id SERIAL PRIMARY KEY, agent_name TEXT NOT NULL, event_type TEXT NOT NULL, payload JSONB, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW())"
    "ops_trigger_rules (id SERIAL PRIMARY KEY, name TEXT UNIQUE NOT NULL, condition JSONB NOT NULL, action JSONB NOT NULL, cooldown_seconds INTEGER DEFAULT 300, enabled BOOLEAN DEFAULT true, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW())"
    "ops_policy (id SERIAL PRIMARY KEY, key TEXT UNIQUE NOT NULL, value_json JSONB NOT NULL, description TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW())"
    "ops_agent_reactions (id SERIAL PRIMARY KEY, event_id INTEGER REFERENCES ops_agent_events(id), rule_id INTEGER REFERENCES ops_trigger_rules(id), agent_name TEXT NOT NULL, action_taken TEXT, result JSONB, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW())"
)

# Check each table
for i in "${!tables[@]}"; do
    table="${tables[$i]}"
    schema="${table_schemas[$i]}"
    
    if ! check_table "$table"; then
        # Table doesn't exist, create it
        create_table "$table" "$schema"
    fi
done

echo ""
echo "Checking if initial policy configurations exist..."

# Check if policy records exist
policy_check_response=$(curl -s -w "\n%{http_code}" "${HEADERS[@]}" \
    "$SUPABASE_URL/rest/v1/ops_policy?select=key&in=key.(auto_approve,heartbeat_enabled,x_daily_quota)")

policy_http_code=$(echo "$policy_check_response" | tail -n1)
policy_response_body=$(echo "$policy_check_response" | sed '$d')

if [[ $policy_http_code -eq 200 ]]; then
    existing_policies=$(echo "$policy_response_body" | jq -r '.[].key' 2>/dev/null | wc -l)
    if [[ $existing_policies -ge 3 ]]; then
        echo "✓ All initial policy configurations already exist"
    else
        echo "Inserting initial policy configurations..."
        
        # Insert initial policy configurations
        curl -s -X POST "${HEADERS[@]}" \
            -H "Prefer: return=minimal" \
            --data '[{"key":"auto_approve","value_json":{"enabled":true,"allowed_step_kinds":["draft_content","research","analyze","review"]},"description":"Controls which step kinds can be auto-approved"},{"key":"heartbeat_enabled","value_json":{"enabled":true},"description":"Enables/disables heartbeat monitoring"},{"key":"x_daily_quota","value_json":{"limit":10},"description":"Daily quota limit for X API calls"}]' \
            "$SUPABASE_URL/rest/v1/ops_policy"
        
        echo "✓ Initial policy configurations inserted"
    fi
else
    echo "Inserting initial policy configurations..."
    
    # Insert initial policy configurations
    curl -s -X POST "${HEADERS[@]}" \
        -H "Prefer: return=minimal" \
        --data '[{"key":"auto_approve","value_json":{"enabled":true,"allowed_step_kinds":["draft_content","research","analyze","review"]},"description":"Controls which step kinds can be auto-approved"},{"key":"heartbeat_enabled","value_json":{"enabled":true},"description":"Enables/disables heartbeat monitoring"},{"key":"x_daily_quota","value_json":{"limit":10},"description":"Daily quota limit for X API calls"}]' \
        "$SUPABASE_URL/rest/v1/ops_policy"
    
    echo "✓ Initial policy configurations inserted"
fi

echo ""
echo "Checking if trigger rules exist..."

# Check if trigger rules exist
rule_check_response=$(curl -s -w "\n%{http_code}" "${HEADERS[@]}" \
    "$SUPABASE_URL/rest/v1/ops_trigger_rules?select=name&in=name.(task_timeout,mission_failed)")

rule_http_code=$(echo "$rule_check_response" | tail -n1)
rule_response_body=$(echo "$rule_check_response" | sed '$d')

if [[ $rule_http_code -eq 200 ]]; then
    existing_rules=$(echo "$rule_response_body" | jq -r '.[].name' 2>/dev/null | wc -l)
    if [[ $existing_rules -ge 2 ]]; then
        echo "✓ All initial trigger rules already exist"
    else
        echo "Inserting initial trigger rules..."
        
        # Insert initial trigger rules
        curl -s -X POST "${HEADERS[@]}" \
            -H "Prefer: return=minimal" \
            --data '[{"name":"task_timeout","condition":{"type":"step_stale","threshold_minutes":30},"action":{"type":"alert","target":"coordinator"},"cooldown_seconds":3600,"enabled":true,"description":"Alert coordinator when a step becomes stale"},{"name":"mission_failed","condition":{"type":"mission_status","status":"failed"},"action":{"type":"alert","target":"coordinator"},"cooldown_seconds":1800,"enabled":true,"description":"Alert coordinator when a mission fails"}]' \
            "$SUPABASE_URL/rest/v1/ops_trigger_rules"
        
        echo "✓ Initial trigger rules inserted"
    fi
else
    echo "Inserting initial trigger rules..."
    
    # Insert initial trigger rules
    curl -s -X POST "${HEADERS[@]}" \
        -H "Prefer: return=minimal" \
        --data '[{"name":"task_timeout","condition":{"type":"step_stale","threshold_minutes":30},"action":{"type":"alert","target":"coordinator"},"cooldown_seconds":3600,"enabled":true,"description":"Alert coordinator when a step becomes stale"},{"name":"mission_failed","condition":{"type":"mission_status","status":"failed"},"action":{"type":"alert","target":"coordinator"},"cooldown_seconds":1800,"enabled":true,"description":"Alert coordinator when a mission fails"}]' \
        "$SUPABASE_URL/rest/v1/ops_trigger_rules"
    
    echo "✓ Initial trigger rules inserted"
fi

echo ""
echo "Infrastructure setup completed!"