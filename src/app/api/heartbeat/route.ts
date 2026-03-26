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
    // 1. 检查触发器
    const triggerResult = await evaluateTriggers(sb, 4000);
    
    // 2. 处理反应队列
    const reactionResult = await processReactionQueue(sb, 3000);
    
    // 3. 清理卡住的任务（30分钟无进展）
    const staleResult = await recoverStaleSteps(sb);
    
    // 4. 推广成熟洞察
    const learningResult = await promoteInsights(sb);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      triggers: triggerResult,
      reactions: reactionResult,
      stale: staleResult,
      learning: learningResult,
      status: 'active',
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