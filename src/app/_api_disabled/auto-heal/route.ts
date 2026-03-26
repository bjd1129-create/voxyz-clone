import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Vercel Cron Authorization
function verifyCronAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret) {
    return authHeader === `Bearer ${cronSecret}`;
  }
  
  return process.env.NODE_ENV === 'development';
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const sb = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * 获取策略配置值
 */
async function getPolicyValue(key: string): Promise<number | boolean | null> {
  try {
    const { data, error } = await sb
      .from('ops_policy')
      .select('value_json')
      .eq('key', key)
      .single();

    if (error || !data) {
      return null;
    }

    return data.value_json.value ?? data.value_json.enabled ?? null;
  } catch {
    return null;
  }
}

/**
 * 检测停滞的任务步骤
 */
async function detectStaleSteps() {
  const timeoutSeconds = (await getPolicyValue('stale_task_timeout')) as number || 1800;
  
  const { data, error } = await sb
    .from('ops_mission_steps')
    .select('id, mission_id, kind, status, last_error, updated_at')
    .in('status', ['running', 'queued'])
    .lt('updated_at', new Date(Date.now() - timeoutSeconds * 1000).toISOString())
    .order('updated_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * 检测停滞的任务
 */
async function detectStaleMissions() {
  const timeoutSeconds = (await getPolicyValue('stale_task_timeout')) as number || 1800;
  
  const { data, error } = await sb
    .from('ops_missions')
    .select('id, title, status, agent_id, updated_at')
    .in('status', ['pending', 'running'])
    .lt('updated_at', new Date(Date.now() - timeoutSeconds * 1000).toISOString())
    .order('updated_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * 重置停滞的任务步骤
 */
async function resetStaleStep(step: any) {
  const staleMinutes = Math.floor((Date.now() - new Date(step.updated_at).getTime()) / 60000);
  
  const { error } = await sb
    .from('ops_mission_steps')
    .update({
      status: 'queued',
      last_error: `Auto-heal reset: stale_timeout (${staleMinutes} minutes)`,
      updated_at: new Date().toISOString()
    })
    .eq('id', step.id);

  if (error) {
    throw error;
  }

  // 记录事件
  await sb.from('ops_agent_events').insert({
    agent_id: 'auto_heal',
    action: 'step_reset',
    payload: {
      step_id: step.id,
      mission_id: step.mission_id,
      kind: step.kind,
      previous_status: step.status,
      stale_minutes: staleMinutes
    }
  });

  return staleMinutes;
}

/**
 * 记录事件
 */
async function logEvent(agentId: string, action: string, payload: any) {
  try {
    await sb.from('ops_agent_events').insert({
      agent_id: agentId,
      action: action,
      payload: payload
    });
  } catch (error) {
    console.warn('Failed to log event:', error);
  }
}

/**
 * 主函数：自动愈合检查
 */
async function autoHealCheck() {
  const result = {
    stepsReset: 0,
    missionsDetected: 0,
    actions: [] as any[],
    errors: [] as string[]
  };

  try {
    // 1. 检测停滞的任务步骤
    const staleSteps = await detectStaleSteps();
    
    for (const step of staleSteps) {
      try {
        const staleMinutes = await resetStaleStep(step);
        result.stepsReset++;
        result.actions.push({
          type: 'step_reset',
          step_id: step.id,
          mission_id: step.mission_id,
          stale_minutes: staleMinutes
        });
      } catch (error: any) {
        result.errors.push(`Failed to reset step ${step.id}: ${error.message}`);
      }
    }

    // 2. 检测停滞的任务
    const staleMissions = await detectStaleMissions();
    
    for (const mission of staleMissions) {
      const staleMinutes = Math.floor((Date.now() - new Date(mission.updated_at).getTime()) / 60000);
      
      // 记录事件，但不自动重置任务
      await logEvent('auto_heal', 'mission_stale_detected', {
        mission_id: mission.id,
        title: mission.title,
        stale_minutes: staleMinutes,
        status: mission.status
      });
      
      result.missionsDetected++;
      result.actions.push({
        type: 'mission_stale_detected',
        mission_id: mission.id,
        stale_minutes: staleMinutes
      });
    }

    // 3. 记录愈合检查完成
    await logEvent('auto_heal', 'heal_check_completed', {
      steps_reset: result.stepsReset,
      missions_detected: result.missionsDetected,
      timestamp: new Date().toISOString()
    });

    return result;
  } catch (error: any) {
    result.errors.push(`Auto-heal check failed: ${error.message}`);
    return result;
  }
}

/**
 * GET /api/auto-heal - 执行自动愈合检查
 */
export async function GET(request: Request) {
  // 验证授权
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  
  try {
    // 获取策略配置
    const staleTimeout = await getPolicyValue('stale_task_timeout');
    const heartbeatInterval = await getPolicyValue('heartbeat_interval');
    const maxDailyTasks = await getPolicyValue('max_daily_tasks');
    const autoApproveEnabled = await getPolicyValue('auto_approve_enabled');

    // 执行自动愈合检查
    const result = await autoHealCheck();
    
    const duration = Date.now() - startTime;

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'success',
      duration_ms: duration,
      policies: {
        stale_task_timeout: staleTimeout || 1800,
        heartbeat_interval: heartbeatInterval || 300,
        max_daily_tasks: maxDailyTasks || 100,
        auto_approve_enabled: autoApproveEnabled ?? true
      },
      summary: {
        steps_reset: result.stepsReset,
        missions_detected: result.missionsDetected,
        actions_count: result.actions.length
      },
      actions: result.actions,
      errors: result.errors.length > 0 ? result.errors : undefined
    });
  } catch (error: any) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'error',
      error: error.message,
      duration_ms: Date.now() - startTime
    }, { status: 500 });
  }
}

/**
 * POST /api/auto-heal - 手动触发自动愈合检查
 */
export async function POST(request: Request) {
  // 验证授权
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  
  try {
    const body = await request.json().catch(() => ({}));
    
    // 支持不同模式
    const mode = body.mode || 'check';
    
    switch (mode) {
      case 'check':
        // 执行自动愈合检查
        const result = await autoHealCheck();
        
        return NextResponse.json({
          timestamp: new Date().toISOString(),
          status: 'success',
          duration_ms: Date.now() - startTime,
          ...result
        });
      
      case 'policies':
        // 显示当前策略配置
        const policies = await sb
          .from('ops_policy')
          .select('*')
          .order('key');
        
        return NextResponse.json({
          timestamp: new Date().toISOString(),
          status: 'success',
          policies: policies.data
        });
      
      case 'health':
        // 显示任务健康状态
        const missions = await sb
          .from('ops_missions')
          .select('id, title, status, created_at, updated_at');
        
        const steps = await sb
          .from('ops_mission_steps')
          .select('id, status');
        
        return NextResponse.json({
          timestamp: new Date().toISOString(),
          status: 'success',
          missions: {
            total: missions.data?.length || 0,
            by_status: missions.data?.reduce((acc: any, m: any) => {
              acc[m.status] = (acc[m.status] || 0) + 1;
              return acc;
            }, {})
          },
          steps: {
            total: steps.data?.length || 0,
            by_status: steps.data?.reduce((acc: any, s: any) => {
              acc[s.status] = (acc[s.status] || 0) + 1;
              return acc;
            }, {})
          }
        });
      
      default:
        return NextResponse.json({
          error: 'Invalid mode. Use: check, policies, or health'
        }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'error',
      error: error.message
    }, { status: 500 });
  }
}