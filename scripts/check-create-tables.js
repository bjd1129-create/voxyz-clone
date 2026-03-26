// Set environment variables directly at the top
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://krhhfykgnznkesnarbzd.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyaGhmeWtnbnpua2VzbmFyYnpkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDUwMDc2NSwiZXhwIjoyMDkwMDc2NzY1fQ.hPCc7FPJ12bRhZ4MJ4jbjDN8XtOqAyuuoDUvy4g_IJo';

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkAndCreateTables() {
  // Tables to check/create
  const tables = [
    'ops_mission_proposals',
    'ops_missions', 
    'ops_mission_steps',
    'ops_agent_events',
    'ops_trigger_rules',
    'ops_policy',
    'ops_agent_reactions'
  ];

  console.log('Checking for required tables...');
  
  for (const tableName of tables) {
    // Check if table exists
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', tableName)
      .eq('table_schema', 'public');

    if (error) {
      console.error(`Error checking table ${tableName}:`, error);
      continue;
    }

    if (data.length > 0) {
      console.log(`✓ Table ${tableName} already exists`);
    } else {
      console.log(`Creating table ${tableName}...`);
      
      // Define table creation SQL based on table name
      let createTableSql = '';
      
      switch(tableName) {
        case 'ops_mission_proposals':
          createTableSql = `
            CREATE TABLE ops_mission_proposals (
              id SERIAL PRIMARY KEY,
              title TEXT NOT NULL,
              description TEXT,
              priority INTEGER DEFAULT 0,
              status TEXT DEFAULT 'pending',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `;
          break;
          
        case 'ops_missions':
          createTableSql = `
            CREATE TABLE ops_missions (
              id SERIAL PRIMARY KEY,
              proposal_id INTEGER REFERENCES ops_mission_proposals(id),
              title TEXT NOT NULL,
              description TEXT,
              status TEXT DEFAULT 'active',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `;
          break;
          
        case 'ops_mission_steps':
          createTableSql = `
            CREATE TABLE ops_mission_steps (
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
            );
          `;
          break;
          
        case 'ops_agent_events':
          createTableSql = `
            CREATE TABLE ops_agent_events (
              id SERIAL PRIMARY KEY,
              agent_name TEXT NOT NULL,
              event_type TEXT NOT NULL,
              payload JSONB,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `;
          break;
          
        case 'ops_policy':
          createTableSql = `
            CREATE TABLE ops_policy (
              id SERIAL PRIMARY KEY,
              key TEXT UNIQUE NOT NULL,
              value_json JSONB NOT NULL,
              description TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `;
          break;
          
        case 'ops_trigger_rules':
          createTableSql = `
            CREATE TABLE ops_trigger_rules (
              id SERIAL PRIMARY KEY,
              name TEXT UNIQUE NOT NULL,
              condition JSONB NOT NULL,
              action JSONB NOT NULL,
              cooldown_seconds INTEGER DEFAULT 300,
              enabled BOOLEAN DEFAULT true,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `;
          break;
          
        case 'ops_agent_reactions':
          createTableSql = `
            CREATE TABLE ops_agent_reactions (
              id SERIAL PRIMARY KEY,
              event_id INTEGER REFERENCES ops_agent_events(id),
              rule_id INTEGER REFERENCES ops_trigger_rules(id),
              agent_name TEXT NOT NULL,
              action_taken TEXT,
              result JSONB,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `;
          break;
          
        default:
          console.log(`Unknown table: ${tableName}`);
          continue;
      }
      
      if (createTableSql) {
        const { error: createError } = await supabase.rpc('execute_sql', { 
          sql_command: createTableSql 
        }).catch(err => {
          // If RPC doesn't work, we'll try to execute the raw SQL differently
          console.log(`Trying alternative method for ${tableName}...`);
          return { error: null };
        });
        
        // Alternative approach: try to create table using raw SQL
        if (createError || createTableSql) {
          try {
            const { data: result, error: altError } = await supabase
              .from(tableName)
              .select('*')
              .limit(1);
              
            // If we get an error saying table doesn't exist, we need to create it manually
            if (altError && altError.code === '42P01') { // undefined_table
              console.log(`Table ${tableName} needs to be created, attempting direct SQL...`);
              
              // We'll create a temporary function to execute raw SQL
              const response = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
                method: 'POST',
                headers: {
                  'apikey': supabaseServiceRoleKey,
                  'Authorization': `Bearer ${supabaseServiceRoleKey}`,
                  'Content-Type': 'application/json',
                  'Prefer': 'return=minimal'
                },
                body: JSON.stringify({ sql_command: createTableSql })
              });
              
              if (response.ok) {
                console.log(`✓ Created table ${tableName}`);
              } else {
                console.error(`Failed to create table ${tableName}:`, await response.text());
              }
            }
          } catch (err) {
            console.error(`Error during alternative table creation for ${tableName}:`, err);
          }
        }
      }
    }
  }
  
  console.log('\nChecking if initial policy configurations exist...');
  
  // Insert initial policy configurations if they don't exist
  const { data: existingPolicies } = await supabase
    .from('ops_policy')
    .select('key')
    .in('key', ['auto_approve', 'heartbeat_enabled', 'x_daily_quota']);
    
  const existingKeys = existingPolicies ? existingPolicies.map(p => p.key) : [];
  
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
    console.log(`Inserting ${policiesToInsert.length} initial policy configurations...`);
    const { error: insertError } = await supabase
      .from('ops_policy')
      .insert(policiesToInsert);
      
    if (insertError) {
      console.error('Error inserting policies:', insertError);
    } else {
      console.log('✓ Initial policy configurations inserted');
    }
  } else {
    console.log('✓ Initial policy configurations already exist');
  }
  
  console.log('\nChecking if trigger rules exist...');
  
  // Insert initial trigger rules if they don't exist
  const { data: existingRules } = await supabase
    .from('ops_trigger_rules')
    .select('name')
    .in('name', ['task_timeout', 'mission_failed']);
    
  const existingRuleNames = existingRules ? existingRules.map(r => r.name) : [];
  
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
    console.log(`Inserting ${rulesToInsert.length} initial trigger rules...`);
    const { error: rulesError } = await supabase
      .from('ops_trigger_rules')
      .insert(rulesToInsert);
      
    if (rulesError) {
      console.error('Error inserting trigger rules:', rulesError);
    } else {
      console.log('✓ Initial trigger rules inserted');
    }
  } else {
    console.log('✓ Initial trigger rules already exist');
  }
  
  console.log('\nTable verification and creation process completed!');
}

// Set environment variables directly
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://krhhfykgnznkesnarbzd.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyaGhmeWtnbnpua2VzbmFyYnpkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDUwMDc2NSwiZXhwIjoyMDkwMDc2NzY1fQ.hPCc7FPJ12bRhZ4MJ4jbjDN8XtOqAyuuoDUvy4g_IJo';

checkAndCreateTables()
  .then(() => {
    console.log('All operations completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error during execution:', error);
    process.exit(1);
  });