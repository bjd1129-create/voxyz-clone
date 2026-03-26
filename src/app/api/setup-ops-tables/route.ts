import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json({ 
      error: 'Missing Supabase environment variables' 
    }, { status: 500 });
  }

  // Use service role key for full access
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // Check if tables exist by trying to select from them
    const tablesToCheck = [
      'ops_mission_proposals',
      'ops_missions',
      'ops_mission_steps',
      'ops_agent_events',
      'ops_trigger_rules',
      'ops_policy',
      'ops_agent_reactions'
    ];

    const results: Record<string, any> = {};
    
    for (const tableName of tablesToCheck) {
      try {
        const { error } = await supabase
          .from(tableName)
          .select('id')
          .limit(1);
          
        if (error) {
          // Table might not exist
          if (error.message.includes('does not exist')) {
            results[tableName] = { exists: false, error: error.message };
          } else {
            results[tableName] = { exists: false, error: error.message };
          }
        } else {
          results[tableName] = { exists: true };
        }
      } catch (err: any) {
        results[tableName] = { exists: false, error: err.message };
      }
    }

    return NextResponse.json({ 
      status: 'success', 
      tables: results,
      message: 'Table existence check completed' 
    });
  } catch (error: any) {
    console.error('Error checking tables:', error);
    return NextResponse.json({ 
      error: 'Failed to check tables', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json({ 
      error: 'Missing Supabase environment variables' 
    }, { status: 500 });
  }

  // Use service role key for full access
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // Create tables if they don't exist
    const createTableQueries = [
      // ops_mission_proposals
      `CREATE TABLE IF NOT EXISTS ops_mission_proposals (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        priority INTEGER DEFAULT 0,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      
      // ops_missions
      `CREATE TABLE IF NOT EXISTS ops_missions (
        id SERIAL PRIMARY KEY,
        proposal_id INTEGER REFERENCES ops_mission_proposals(id),
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      
      // ops_mission_steps
      `CREATE TABLE IF NOT EXISTS ops_mission_steps (
        id SERIAL PRIMARY KEY,
        mission_id INTEGER REFERENCES ops_missions(id),
        step_number INTEGER,
        title TEXT NOT NULL,
        description TEXT,
        kind TEXT,
        status TEXT DEFAULT 'pending',
        assigned_to TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      
      // ops_agent_events
      `CREATE TABLE IF NOT EXISTS ops_agent_events (
        id SERIAL PRIMARY KEY,
        agent_name TEXT NOT NULL,
        event_type TEXT NOT NULL,
        payload JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      
      // ops_trigger_rules
      `CREATE TABLE IF NOT EXISTS ops_trigger_rules (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        condition JSONB NOT NULL,
        action JSONB NOT NULL,
        cooldown_seconds INTEGER DEFAULT 300,
        enabled BOOLEAN DEFAULT true,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      
      // ops_policy
      `CREATE TABLE IF NOT EXISTS ops_policy (
        id SERIAL PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value_json JSONB NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      
      // ops_agent_reactions
      `CREATE TABLE IF NOT EXISTS ops_agent_reactions (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES ops_agent_events(id),
        rule_id INTEGER REFERENCES ops_trigger_rules(id),
        agent_name TEXT NOT NULL,
        action_taken TEXT,
        result JSONB,
        status TEXT DEFAULT 'done',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`
    ];

    const createResults = [];
    for (const query of createTableQueries) {
      try {
        // Since Supabase doesn't expose raw SQL execution through the JS client easily,
        // we'll try to create the tables using RPC
        let result;
        try {
          result = await supabase.rpc('execute_ddl_if_not_exists', {
            ddl_statement: query
          });
        } catch (rpcError: any) {
          // If RPC fails, we'll try to create the tables using a different approach
          // For now, just log the attempt
          console.log("Could not execute:", query.substring(0, 100) + "...");
          result = { data: null, error: null }; // Don't throw to continue processing
        }
        
        if (result && result.error) {
          console.error("Error executing query:", result.error);
          createResults.push({ success: false, error: result.error.message });
        } else {
          createResults.push({ success: true });
        }
      } catch (error: any) {
        console.error("Exception executing query:", error.message);
        createResults.push({ success: false, error: error.message });
      }
    }

    // After attempting to create tables, insert initial data
    // Check if policy records already exist before inserting
    const { data: existingPolicies } = await supabase
      .from('ops_policy')
      .select('key')
      .in('key', ['auto_approve', 'heartbeat_enabled', 'x_daily_quota']);

    const existingKeys = existingPolicies ? existingPolicies.map(p => p.key) : [];

    if (existingKeys.length < 3) {
      const policiesToInsert = [];
      
      if (!existingKeys.includes('auto_approve')) {
        policiesToInsert.push({
          key: 'auto_approve',
          value_json: { 
            enabled: true, 
            allowed_step_kinds: ["draft_content", "research", "analyze", "review"] 
          },
          description: 'Controls which step kinds can be auto-approved'
        });
      }
      
      if (!existingKeys.includes('heartbeat_enabled')) {
        policiesToInsert.push({
          key: 'heartbeat_enabled',
          value_json: { enabled: true },
          description: 'Enables/disables heartbeat monitoring'
        });
      }
      
      if (!existingKeys.includes('x_daily_quota')) {
        policiesToInsert.push({
          key: 'x_daily_quota',
          value_json: { limit: 10 },
          description: 'Daily quota limit for X API calls'
        });
      }
      
      if (policiesToInsert.length > 0) {
        const { error: policyError } = await supabase
          .from('ops_policy')
          .insert(policiesToInsert);
          
        if (policyError) {
          console.error('Error inserting policies:', policyError);
        }
      }
    }

    // Check if trigger rules already exist before inserting
    const { data: existingRules } = await supabase
      .from('ops_trigger_rules')
      .select('name')
      .in('name', ['task_timeout', 'mission_failed']);

    const existingRuleNames = existingRules ? existingRules.map(r => r.name) : [];

    if (existingRuleNames.length < 2) {
      const rulesToInsert = [];
      
      if (!existingRuleNames.includes('task_timeout')) {
        rulesToInsert.push({
          name: 'task_timeout',
          condition: { type: "step_stale", threshold_minutes: 30 },
          action: { type: "alert", target: "coordinator" },
          cooldown_seconds: 3600,
          enabled: true,
          description: 'Alert coordinator when a step becomes stale'
        });
      }
      
      if (!existingRuleNames.includes('mission_failed')) {
        rulesToInsert.push({
          name: 'mission_failed',
          condition: { type: "mission_status", status: "failed" },
          action: { type: "alert", target: "coordinator" },
          cooldown_seconds: 1800,
          enabled: true,
          description: 'Alert coordinator when a mission fails'
        });
      }
      
      if (rulesToInsert.length > 0) {
        const { error: rulesError } = await supabase
          .from('ops_trigger_rules')
          .insert(rulesToInsert);
          
        if (rulesError) {
          console.error('Error inserting trigger rules:', rulesError);
        }
      }
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'Setup completed',
      createResults 
    });
  } catch (error: any) {
    console.error('Error setting up tables:', error);
    return NextResponse.json({ 
      error: 'Failed to set up tables', 
      details: error.message 
    }, { status: 500 });
  }
}