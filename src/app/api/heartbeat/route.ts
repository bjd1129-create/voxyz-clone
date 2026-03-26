import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const sb = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Cap Gates: Check daily task quota and agent load
async function checkCapGates(sb: any) {
  try {
    // Get daily task quota policy
    const { data: taskQuotaPolicy, error: quotaError } = await sb
      .from('ops_policy')
      .select('value')
      .eq('policy_key', 'daily_task_quota')
      .single();

    if (!quotaError && taskQuotaPolicy) {
      const dailyQuota = taskQuotaPolicy.value as number;
      
      // Count today's tasks
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();
      
      const { count: todayTasks, error: countError } = await sb
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayISO);

      if (countError) {
        console.error('Error counting today\'s tasks:', countError);
      } else if (todayTasks !== null && todayTasks >= dailyQuota) {
        console.log(`Daily task quota reached: ${todayTasks}/${dailyQuota}`);
        return { allowed: false, reason: `Daily task quota exceeded: ${todayTasks}/${dailyQuota}` };
      }
    }

    // Get agent load policy
    const { data: agentLoadPolicy, error: loadError } = await sb
      .from('ops_policy')
      .select('value')
      .eq('policy_key', 'max_agent_load')
      .single();

    if (!loadError && agentLoadPolicy) {
      const maxAgentLoad = agentLoadPolicy.value as number;
      
      // Count tasks per agent that are not completed
      const { data: agentLoads, error: loadCountError } = await sb
        .from('tasks')
        .select('assignee, count(*) as active_tasks')
        .neq('status', 'completed')
        .group('assignee');
        
      if (loadCountError) {
        console.error('Error counting agent loads:', loadCountError);
      } else if (agentLoads) {
        for (const agentLoad of agentLoads) {
          if (agentLoad.active_tasks >= maxAgentLoad) {
            console.log(`Agent load limit reached for ${agentLoad.assignee}: ${agentLoad.active_tasks}/${maxAgentLoad}`);
            return { 
              allowed: false, 
              reason: `Agent load limit reached for ${agentLoad.assignee}: ${agentLoad.active_tasks}/${maxAgentLoad}` 
            };
          }
        }
      }
    }

    return { allowed: true, reason: null };
  } catch (error) {
    console.error('Error in cap gates check:', error);
    // Fail open - if we can't check policies, allow the operation
    return { allowed: true, reason: null };
  }
}

// Evaluate triggers function
async function evaluateTriggers(sb: any, limit: number = 4000) {
  try {
    // Get all enabled trigger rules
    const { data: triggerRules, error: rulesError } = await sb
      .from('ops_trigger_rules')
      .select('*')
      .eq('enabled', true);

    if (rulesError) throw rulesError;

    let processedCount = 0;
    
    // Process each trigger rule
    for (const rule of triggerRules) {
      // Check if enough time has passed since last execution (cooldown)
      const now = new Date();
      const lastExecution = new Date(rule.created_at);
      
      if ((now.getTime() - lastExecution.getTime()) / 1000 >= rule.cooldown_seconds) {
        // Here we would evaluate the condition against recent events
        // For now, just increment the counter
        processedCount++;
        
        // In a real implementation, we'd check if the condition matches recent events
        // and potentially trigger an action based on the rule
      }
    }

    return {
      success: true,
      processed: Math.min(processedCount, limit),
      totalRules: triggerRules.length,
    };
  } catch (error) {
    console.error('Error evaluating triggers:', error);
    return {
      success: false,
      error: 'Failed to evaluate triggers',
      processed: 0,
    };
  }
}

// Process reaction queue function
async function processReactionQueue(sb: any, limit: number = 3000) {
  try {
    // Get queued reactions up to the limit
    const { data: queuedReactions, error: reactionsError } = await sb
      .from('ops_agent_reactions')
      .select('*')
      .eq('status', 'queued')
      .order('created_at', { ascending: true })
      .limit(limit);

    if (reactionsError) throw reactionsError;

    let processedCount = 0;
    
    // Process each queued reaction
    for (const reaction of queuedReactions) {
      // Update the reaction status to processing
      const { error: updateError } = await sb
        .from('ops_agent_reactions')
        .update({ status: 'processing' })
        .eq('id', reaction.id);

      if (updateError) {
        console.error(`Error updating reaction ${reaction.id}:`, updateError);
        continue;
      }

      // Here we would execute the actual reaction logic
      // For now, just mark it as done
      const { error: completeError } = await sb
        .from('ops_agent_reactions')
        .update({ status: 'done' })
        .eq('id', reaction.id);

      if (completeError) {
        console.error(`Error completing reaction ${reaction.id}:`, completeError);
        continue;
      }

      processedCount++;
    }

    return {
      success: true,
      processed: processedCount,
      totalQueued: queuedReactions.length,
    };
  } catch (error) {
    console.error('Error processing reaction queue:', error);
    return {
      success: false,
      error: 'Failed to process reaction queue',
      processed: 0,
    };
  }
}

// Recover stale steps function
async function recoverStaleSteps(sb: any) {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    
    // Find steps that have been in 'running' status for more than 30 minutes
    const { data: staleSteps, error: stepsError } = await sb
      .from('ops_mission_steps')
      .select('*')
      .eq('status', 'running')
      .lt('updated_at', thirtyMinutesAgo);

    if (stepsError) throw stepsError;

    let recoveredCount = 0;
    
    // Mark stale steps as failed
    for (const step of staleSteps) {
      const { error: updateError } = await sb
        .from('ops_mission_steps')
        .update({ 
          status: 'failed', 
          last_error: 'Step timed out after 30 minutes' 
        })
        .eq('id', step.id);

      if (updateError) {
        console.error(`Error marking stale step ${step.id} as failed:`, updateError);
        continue;
      }

      // Also update the parent mission status if needed
      const { error: missionUpdateError } = await sb
        .from('ops_missions')
        .update({ 
          status: 'failed',
          completed_at: new Date().toISOString()
        })
        .eq('id', step.mission_id)
        .eq('status', 'running'); // Only update if still running

      if (missionUpdateError) {
        console.error(`Error updating mission ${step.mission_id}:`, missionUpdateError);
      }

      recoveredCount++;
    }

    return {
      success: true,
      recovered: recoveredCount,
      totalStale: staleSteps.length,
    };
  } catch (error) {
    console.error('Error recovering stale steps:', error);
    return {
      success: false,
      error: 'Failed to recover stale steps',
      recovered: 0,
    };
  }
}

// Promote insights function
async function promoteInsights(sb: any) {
  try {
    // This function would typically analyze events and steps to identify patterns
    // and promote valuable insights to a knowledge base or trigger new proposals
    
    // For now, we'll just return a success message
    return {
      success: true,
      promoted: 0,
      message: 'Insight promotion logic would run here',
    };
  } catch (error) {
    console.error('Error promoting insights:', error);
    return {
      success: false,
      error: 'Failed to promote insights',
      promoted: 0,
    };
  }
}

export async function GET(request: Request) {
  try {
    const now = new Date();
    const results = {
      timestamp: now.toISOString(),
      heartbeat: true,
      actions: [] as string[],
    };

    // Check cap gates first
    const capGatesResult = await checkCapGates(sb);
    if (!capGatesResult.allowed) {
      results.actions.push(`❌ Cap Gates: ${capGatesResult.reason}`);
      
      // Record heartbeat to database
      await sb.from('events').insert({
        type: 'heartbeat',
        agent_id: 'system',
        data: { ...results, cap_gates_blocked: true },
        created_at: now.toISOString(),
      });

      return NextResponse.json({
        ...results,
        status: 'limited',
        message: `Operations limited: ${capGatesResult.reason}`,
      });
    }
    
    results.actions.push(`✅ Cap Gates: All checks passed`);

    // 1. 检查触发器
    const triggerResult = await evaluateTriggers(sb, 4000);
    if (triggerResult.success) {
      results.actions.push(`✅ Triggers: ${triggerResult.processed} processed`);
    }
    
    // 2. 处理反应队列
    const reactionResult = await processReactionQueue(sb, 3000);
    if (reactionResult.success) {
      results.actions.push(`✅ Reactions: ${reactionResult.processed} processed`);
    }
    
    // 3. 清理卡住的任务 - Enhanced with 30-minute timeout detection
    const staleResult = await recoverStaleSteps(sb);
    if (staleResult.success) {
      if (staleResult.recovered > 0) {
        results.actions.push(`✅ Stale steps: ${staleResult.recovered} recovered (of ${staleResult.totalStale} detected)`);
      } else if (staleResult.totalStale > 0) {
        results.actions.push(`ℹ️ Stale steps: ${staleResult.totalStale} detected but ${staleResult.recovered} recovered (some may have failed to update)`);
      } else {
        results.actions.push(`✅ Stale steps: No stale steps detected`);
      }
    } else {
      results.actions.push(`❌ Stale steps: Failed to recover (${staleResult.error})`);
    }
    
    // 4. 推广成熟洞察
    const learningResult = await promoteInsights(sb);
    if (learningResult.success) {
      results.actions.push(`✅ Learning: ${learningResult.promoted} insights promoted`);
    } else {
      results.actions.push(`⚠️ Learning: ${learningResult.error}`);
    }
    
    // 5. 记录心跳到数据库
    await sb.from('events').insert({
      type: 'heartbeat',
      agent_id: 'system',
      data: results,
      created_at: now.toISOString(),
    });

    return NextResponse.json({
      ...results,
      status: 'active',
      message: '7x24 heartbeat executed successfully',
    });
  } catch (error) {
    console.error('Heartbeat API error:', error);
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      error: 'Internal server error',
      status: 'error',
    }, { status: 500 });
  }
}