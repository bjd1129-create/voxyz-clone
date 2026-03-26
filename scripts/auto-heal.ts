#!/usr/bin/env npx ts-node
/**
 * 自动愈合检查脚本
 * 
 * 功能：
 * 1. 检测停滞的任务步骤
 * 2. 检测停滞的任务
 * 3. 自动重置停滞的任务步骤
 * 4. 记录愈合事件
 * 
 * 使用方法：
 * - 手动执行: npx ts-node scripts/auto-heal.ts
 * - 定时任务: 每 5 分钟执行一次（通过 crontab 或 Vercel Cron）
 */

import { createClient } from '@supabase/supabase-js';

// 环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少 Supabase 配置');
  console.error('请设置环境变量：');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// 策略配置类型
interface Policy {
  key: string;
  value_json: {
    value?: number;
    enabled?: boolean;
    unit?: string;
    [key: string]: any;
  };
  updated_at: string;
}

// 任务步骤类型
interface MissionStep {
  id: string;
  mission_id: string;
  kind: string;
  status: string;
  last_error?: string;
  updated_at: string;
}

// 任务类型
interface Mission {
  id: string;
  title: string;
  status: string;
  agent_id?: string;
  updated_at: string;
}

/**
 * 获取策略配置
 */
async function getPolicy(key: string): Promise<number | boolean | null> {
  const { data, error } = await supabase
    .from('ops_policy')
    .select('value_json')
    .eq('key', key)
    .single();

  if (error || !data) {
    console.warn(`⚠️  无法获取策略配置 ${key}:`, error?.message);
    return null;
  }

  return data.value_json.value ?? data.value_json.enabled ?? null;
}

/**
 * 检测停滞的任务步骤
 */
async function detectStaleSteps(): Promise<MissionStep[]> {
  const timeoutSeconds = (await getPolicy('stale_task_timeout')) as number || 1800;
  
  const { data, error } = await supabase
    .from('ops_mission_steps')
    .select('id, mission_id, kind, status, last_error, updated_at')
    .in('status', ['running', 'queued'])
    .lt('updated_at', new Date(Date.now() - timeoutSeconds * 1000).toISOString())
    .order('updated_at', { ascending: true });

  if (error) {
    console.error('❌ 检测停滞步骤失败:', error.message);
    return [];
  }

  return data || [];
}

/**
 * 检测停滞的任务
 */
async function detectStaleMissions(): Promise<Mission[]> {
  const timeoutSeconds = (await getPolicy('stale_task_timeout')) as number || 1800;
  
  const { data, error } = await supabase
    .from('ops_missions')
    .select('id, title, status, agent_id, updated_at')
    .in('status', ['pending', 'running'])
    .lt('updated_at', new Date(Date.now() - timeoutSeconds * 1000).toISOString())
    .order('updated_at', { ascending: true });

  if (error) {
    console.error('❌ 检测停滞任务失败:', error.message);
    return [];
  }

  return data || [];
}

/**
 * 重置停滞的任务步骤
 */
async function resetStaleStep(step: MissionStep): Promise<boolean> {
  const { error } = await supabase
    .from('ops_mission_steps')
    .update({
      status: 'queued',
      last_error: `Auto-heal reset: stale_timeout (${Math.floor((Date.now() - new Date(step.updated_at).getTime()) / 60000)} minutes)`,
      updated_at: new Date().toISOString()
    })
    .eq('id', step.id);

  if (error) {
    console.error(`❌ 重置步骤 ${step.id} 失败:`, error.message);
    return false;
  }

  // 记录事件
  await logEvent('auto_heal', 'step_reset', {
    step_id: step.id,
    mission_id: step.mission_id,
    kind: step.kind,
    previous_status: step.status,
    stale_minutes: Math.floor((Date.now() - new Date(step.updated_at).getTime()) / 60000)
  });

  return true;
}

/**
 * 记录事件到 ops_agent_events
 */
async function logEvent(agentId: string, action: string, payload: any): Promise<void> {
  try {
    await supabase
      .from('ops_agent_events')
      .insert({
        agent_id: agentId,
        action: action,
        payload: payload
      });
  } catch (error: any) {
    console.warn('⚠️  记录事件失败:', error.message);
  }
}

/**
 * 主函数：自动愈合检查
 */
async function autoHealCheck(): Promise<{
  stepsReset: number;
  missionsDetected: number;
  actions: any[];
}> {
  console.log('🔍 开始自动愈合检查...');
  console.log('⏰ 时间:', new Date().toISOString());
  
  const result = {
    stepsReset: 0,
    missionsDetected: 0,
    actions: [] as any[]
  };

  // 1. 检测停滞的任务步骤
  console.log('\n📋 检测停滞的任务步骤...');
  const staleSteps = await detectStaleSteps();
  
  if (staleSteps.length > 0) {
    console.log(`⚠️  发现 ${staleSteps.length} 个停滞的任务步骤`);
    
    for (const step of staleSteps) {
      const staleMinutes = Math.floor((Date.now() - new Date(step.updated_at).getTime()) / 60000);
      console.log(`  - 步骤 ${step.id} (${step.kind}): ${staleMinutes} 分钟`);
      
      const resetSuccess = await resetStaleStep(step);
      if (resetSuccess) {
        result.stepsReset++;
        result.actions.push({
          type: 'step_reset',
          step_id: step.id,
          mission_id: step.mission_id,
          stale_minutes: staleMinutes
        });
        console.log(`    ✅ 已重置`);
      }
    }
  } else {
    console.log('✅ 没有发现停滞的任务步骤');
  }

  // 2. 检测停滞的任务
  console.log('\n📋 检测停滞的任务...');
  const staleMissions = await detectStaleMissions();
  
  if (staleMissions.length > 0) {
    console.log(`⚠️  发现 ${staleMissions.length} 个停滞的任务`);
    result.missionsDetected = staleMissions.length;
    
    for (const mission of staleMissions) {
      const staleMinutes = Math.floor((Date.now() - new Date(mission.updated_at).getTime()) / 60000);
      console.log(`  - 任务 ${mission.id} (${mission.title}): ${staleMinutes} 分钟`);
      
      // 记录事件，但不自动重置任务（需要人工干预）
      await logEvent('auto_heal', 'mission_stale_detected', {
        mission_id: mission.id,
        title: mission.title,
        stale_minutes: staleMinutes,
        status: mission.status
      });
      
      result.actions.push({
        type: 'mission_stale_detected',
        mission_id: mission.id,
        stale_minutes: staleMinutes
      });
    }
  } else {
    console.log('✅ 没有发现停滞的任务');
  }

  // 3. 记录愈合检查完成事件
  await logEvent('auto_heal', 'heal_check_completed', {
    steps_reset: result.stepsReset,
    missions_detected: result.missionsDetected,
    timestamp: new Date().toISOString()
  });

  console.log('\n✅ 自动愈合检查完成');
  console.log(`📊 结果: ${result.stepsReset} 个步骤重置, ${result.missionsDetected} 个任务检测到停滞`);
  
  return result;
}

/**
 * 显示当前策略配置
 */
async function showPolicies(): Promise<void> {
  console.log('\n📋 当前策略配置:');
  
  const { data, error } = await supabase
    .from('ops_policy')
    .select('*')
    .order('key');

  if (error) {
    console.error('❌ 获取策略配置失败:', error.message);
    return;
  }

  if (data) {
    for (const policy of data) {
      console.log(`  - ${policy.key}: ${JSON.stringify(policy.value_json)}`);
    }
  }
}

/**
 * 显示任务健康状态
 */
async function showHealthStatus(): Promise<void> {
  console.log('\n📊 任务健康状态:');
  
  // 查询任务统计
  const { data: missions } = await supabase
    .from('ops_missions')
    .select('id, title, status, created_at, updated_at');

  if (missions && missions.length > 0) {
    const byStatus = missions.reduce((acc: any, m: any) => {
      acc[m.status] = (acc[m.status] || 0) + 1;
      return acc;
    }, {});

    console.log(`  总任务数: ${missions.length}`);
    for (const [status, count] of Object.entries(byStatus)) {
      console.log(`  - ${status}: ${count}`);
    }
  } else {
    console.log('  没有任务');
  }

  // 查询步骤统计
  const { data: steps } = await supabase
    .from('ops_mission_steps')
    .select('id, status');

  if (steps && steps.length > 0) {
    const byStatus = steps.reduce((acc: any, s: any) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    }, {});

    console.log(`\n  总步骤数: ${steps.length}`);
    for (const [status, count] of Object.entries(byStatus)) {
      console.log(`  - ${status}: ${count}`);
    }
  }
}

// 主入口
const command = process.argv[2];

async function main() {
  switch (command) {
    case 'check':
      await autoHealCheck();
      break;
    
    case 'policies':
      await showPolicies();
      break;
    
    case 'health':
      await showHealthStatus();
      break;
    
    case 'all':
      await showPolicies();
      await showHealthStatus();
      await autoHealCheck();
      break;
    
    default:
      console.log('🧠 自动愈合系统');
      console.log('');
      console.log('用法:');
      console.log('  npx ts-node scripts/auto-heal.ts check     - 执行自动愈合检查');
      console.log('  npx ts-node scripts/auto-heal.ts policies  - 显示当前策略配置');
      console.log('  npx ts-node scripts/auto-heal.ts health    - 显示任务健康状态');
      console.log('  npx ts-node scripts/auto-heal.ts all       - 执行全部检查');
      console.log('');
      console.log('环境变量:');
      console.log('  NEXT_PUBLIC_SUPABASE_URL    - Supabase 项目 URL');
      console.log('  SUPABASE_SERVICE_ROLE_KEY   - Supabase Service Role Key');
      break;
  }
}

main().catch(console.error);