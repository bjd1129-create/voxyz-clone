-- ============================================
-- 验证脚本 - 检查所有表是否创建成功
-- 在 Supabase SQL Editor 中执行
-- ============================================

-- 1. 检查用户订阅相关表
SELECT 
    'profiles' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') as exists
UNION ALL
SELECT 
    'plans' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'plans')
UNION ALL
SELECT 
    'subscriptions' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subscriptions')
UNION ALL
SELECT 
    'usage_records' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'usage_records')
UNION ALL
SELECT 
    'usage_summaries' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'usage_summaries')
UNION ALL
SELECT 
    'subscription_history' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subscription_history')
UNION ALL
SELECT 
    'payments' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'payments')
UNION ALL
SELECT 
    'verification_tokens' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'verification_tokens');

-- 2. 检查分析相关表
SELECT 
    'user_activities' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_activities') as exists
UNION ALL
SELECT 
    'retention_snapshots' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'retention_snapshots')
UNION ALL
SELECT 
    'user_ltv' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_ltv')
UNION ALL
SELECT 
    'revenue_snapshots' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'revenue_snapshots')
UNION ALL
SELECT 
    'churn_events' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'churn_events')
UNION ALL
SELECT 
    'agent_tasks' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agent_tasks')
UNION ALL
SELECT 
    'feature_usage' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'feature_usage')
UNION ALL
SELECT 
    'user_feedback' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_feedback')
UNION ALL
SELECT 
    'api_logs' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'api_logs')
UNION ALL
SELECT 
    'attribution' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'attribution')
UNION ALL
SELECT 
    'marketing_spend' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'marketing_spend')
UNION ALL
SELECT 
    'funnel_events' as table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'funnel_events');

-- 3. 检查 ENUM 类型
SELECT 
    'subscription_status' as type_name,
    EXISTS(SELECT 1 FROM pg_type WHERE typname = 'subscription_status') as exists
UNION ALL
SELECT 
    'billing_period' as type_name,
    EXISTS(SELECT 1 FROM pg_type WHERE typname = 'billing_period') as exists;

-- 4. 检查物化视图
SELECT 
    'daily_active_users' as view_name,
    EXISTS(SELECT 1 FROM pg_matviews WHERE schemaname = 'public' AND matviewname = 'daily_active_users') as exists
UNION ALL
SELECT 
    'monthly_active_users' as view_name,
    EXISTS(SELECT 1 FROM pg_matviews WHERE schemaname = 'public' AND matviewname = 'monthly_active_users') as exists
UNION ALL
SELECT 
    'mrr_movements' as view_name,
    EXISTS(SELECT 1 FROM pg_matviews WHERE schemaname = 'public' AND matviewname = 'mrr_movements') as exists
UNION ALL
SELECT 
    'feature_usage_summary' as view_name,
    EXISTS(SELECT 1 FROM pg_matviews WHERE schemaname = 'public' AND matviewname = 'feature_usage_summary') as exists;

-- 5. 检查默认计划数据
SELECT name, slug, price_monthly, is_popular FROM public.plans ORDER BY display_order;

-- 6. 检查函数
SELECT 
    'handle_new_user' as function_name,
    EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') as exists
UNION ALL
SELECT 
    'update_usage_summary' as function_name,
    EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'update_usage_summary') as exists
UNION ALL
SELECT 
    'has_active_subscription' as function_name,
    EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'has_active_subscription') as exists
UNION ALL
SELECT 
    'get_user_plan' as function_name,
    EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'get_user_plan') as exists
UNION ALL
SELECT 
    'check_usage_limit' as function_name,
    EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'check_usage_limit') as exists
UNION ALL
SELECT 
    'calculate_retention' as function_name,
    EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'calculate_retention') as exists
UNION ALL
SELECT 
    'refresh_analytics_views' as function_name,
    EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'refresh_analytics_views') as exists;

-- 7. 列出所有 public schema 的表（汇总）
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;