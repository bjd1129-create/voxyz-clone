-- Analytics Tables for Data Dashboard
-- Version: 1.0.0
-- Created: 2026-03-27

-- ============================================
-- 1. User Metrics Tables
-- ============================================

-- 用户基础信息扩展 (extends existing users table)
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    timezone VARCHAR(50) DEFAULT 'Asia/Shanghai',
    locale VARCHAR(10) DEFAULT 'zh-CN',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    onboarding_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户行为日志
CREATE TABLE IF NOT EXISTS user_activities (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'login', 'api_call', 'page_view', 'feature_use'
    activity_name VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    device_type VARCHAR(20), -- 'desktop', 'mobile', 'tablet'
    platform VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引优化
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_created_at ON user_activities(created_at);
CREATE INDEX idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX idx_user_activities_user_date ON user_activities(user_id, created_at);

-- 用户留存快照 (预计算)
CREATE TABLE IF NOT EXISTS retention_snapshots (
    id BIGSERIAL PRIMARY KEY,
    cohort_date DATE NOT NULL, -- 队列日期(用户注册日)
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    day_1_retained BOOLEAN DEFAULT FALSE,
    day_7_retained BOOLEAN DEFAULT FALSE,
    day_30_retained BOOLEAN DEFAULT FALSE,
    last_activity_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cohort_date, user_id)
);

CREATE INDEX idx_retention_cohort ON retention_snapshots(cohort_date);

-- 用户生命周期价值追踪
CREATE TABLE IF NOT EXISTS user_ltv (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    total_cost DECIMAL(12,2) DEFAULT 0,
    ltv_value DECIMAL(12,2) DEFAULT 0,
    lifetime_days INT DEFAULT 0,
    first_purchase_at TIMESTAMPTZ,
    last_purchase_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================
-- 2. Business Metrics Tables
-- ============================================

-- 订阅计划定义
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100),
    description TEXT,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2),
    features JSONB DEFAULT '{}',
    limits JSONB DEFAULT '{}', -- { "api_calls": 1000, "storage_mb": 100 }
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户订阅记录
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    status VARCHAR(20) NOT NULL, -- 'active', 'canceled', 'expired', 'past_due'
    billing_cycle VARCHAR(20), -- 'monthly', 'yearly'
    mrr_value DECIMAL(10,2) DEFAULT 0, -- 月度经常性收入
    started_at TIMESTAMPTZ NOT NULL,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    canceled_at TIMESTAMPTZ,
    cancel_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_period_end ON subscriptions(current_period_end);

-- 支付记录
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'CNY',
    status VARCHAR(20) NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
    payment_method VARCHAR(50),
    provider VARCHAR(50), -- 'stripe', 'alipay', 'wechat'
    provider_payment_id VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);

-- 收入快照 (MRR/ARR预计算)
CREATE TABLE IF NOT EXISTS revenue_snapshots (
    id BIGSERIAL PRIMARY KEY,
    snapshot_date DATE NOT NULL,
    mrr DECIMAL(12,2) DEFAULT 0,
    arr DECIMAL(12,2) DEFAULT 0,
    arpu DECIMAL(10,2) DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    new_mrr DECIMAL(10,2) DEFAULT 0,
    expansion_mrr DECIMAL(10,2) DEFAULT 0,
    contraction_mrr DECIMAL(10,2) DEFAULT 0,
    churned_mrr DECIMAL(10,2) DEFAULT 0,
    active_subscribers INT DEFAULT 0,
    new_subscribers INT DEFAULT 0,
    churned_subscribers INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(snapshot_date)
);

CREATE INDEX idx_revenue_snapshot_date ON revenue_snapshots(snapshot_date);

-- 流失追踪
CREATE TABLE IF NOT EXISTS churn_events (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    subscription_id UUID REFERENCES subscriptions(id),
    churn_type VARCHAR(20) NOT NULL, -- 'cancellation', 'expiration', 'non_payment'
    churn_reason TEXT,
    last_mrr DECIMAL(10,2),
    subscription_duration_days INT,
    churned_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_churn_events_date ON churn_events(churned_at);

-- ============================================
-- 3. Product Metrics Tables
-- ============================================

-- Agent任务记录
CREATE TABLE IF NOT EXISTS agent_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    task_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'pending', 'running', 'completed', 'failed', 'timeout'
    priority INT DEFAULT 0,
    input_data JSONB DEFAULT '{}',
    output_data JSONB,
    error_message TEXT,
    model_used VARCHAR(100),
    tokens_input INT DEFAULT 0,
    tokens_output INT DEFAULT 0,
    cost_estimate DECIMAL(10,6) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    duration_ms INT -- 任务耗时(毫秒)
);

CREATE INDEX idx_agent_tasks_user ON agent_tasks(user_id);
CREATE INDEX idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX idx_agent_tasks_created_at ON agent_tasks(created_at);
CREATE INDEX idx_agent_tasks_type_date ON agent_tasks(task_type, created_at);

-- 功能使用统计
CREATE TABLE IF NOT EXISTS feature_usage (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    feature_name VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'view', 'click', 'create', 'export'
    count INT DEFAULT 1,
    metadata JSONB DEFAULT '{}',
    recorded_date DATE NOT NULL,
    recorded_hour INT, -- 0-23 for hourly tracking
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, feature_name, action, recorded_date, recorded_hour)
);

CREATE INDEX idx_feature_usage_date ON feature_usage(recorded_date);
CREATE INDEX idx_feature_usage_feature ON feature_usage(feature_name);

-- 用户反馈
CREATE TABLE IF NOT EXISTS user_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    feedback_type VARCHAR(50) NOT NULL, -- 'task_rating', 'nps', 'general', 'bug_report'
    task_id UUID REFERENCES agent_tasks(id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    nps_score INT CHECK (nps_score >= 0 AND nps_score <= 10),
    comment TEXT,
    tags VARCHAR(100)[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feedback_user ON user_feedback(user_id);
CREATE INDEX idx_feedback_type ON user_feedback(feedback_type);
CREATE INDEX idx_feedback_created ON user_feedback(created_at);

-- API调用日志
CREATE TABLE IF NOT EXISTS api_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    endpoint VARCHAR(200) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INT,
    response_time_ms INT,
    request_size_bytes INT,
    response_size_bytes INT,
    error_message TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_logs_user ON api_logs(user_id);
CREATE INDEX idx_api_logs_endpoint ON api_logs(endpoint);
CREATE INDEX idx_api_logs_created ON api_logs(created_at);

-- ============================================
-- 4. Marketing Metrics Tables
-- ============================================

-- 渠道归因
CREATE TABLE IF NOT EXISTS attribution (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_touch_channel VARCHAR(100), -- 首次接触渠道
    first_touch_source VARCHAR(100), -- 来源
    first_touch_medium VARCHAR(50), -- 媒介
    first_touch_campaign VARCHAR(200), -- 活动
    first_touch_content VARCHAR(200), -- 内容
    last_touch_channel VARCHAR(100),
    last_touch_source VARCHAR(100),
    last_touch_medium VARCHAR(50),
    last_touch_campaign VARCHAR(200),
    utm_params JSONB DEFAULT '{}',
    referrer_url TEXT,
    landing_page TEXT,
    device_type VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX idx_attribution_channel ON attribution(first_touch_channel);

-- 营销支出追踪
CREATE TABLE IF NOT EXISTS marketing_spend (
    id BIGSERIAL PRIMARY KEY,
    channel VARCHAR(100) NOT NULL,
    campaign VARCHAR(200),
    spend_date DATE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'CNY',
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    conversions BIGINT DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(channel, campaign, spend_date)
);

CREATE INDEX idx_marketing_spend_date ON marketing_spend(spend_date);
CREATE INDEX idx_marketing_spend_channel ON marketing_spend(channel);

-- 转化漏斗
CREATE TABLE IF NOT EXISTS funnel_events (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    funnel_name VARCHAR(100) NOT NULL, -- 'signup', 'activation', 'purchase'
    step_name VARCHAR(100) NOT NULL,
    step_order INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    properties JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_funnel_user ON funnel_events(user_id);
CREATE INDEX idx_funnel_name ON funnel_events(funnel_name);
CREATE INDEX idx_funnel_created ON funnel_events(created_at);

-- ============================================
-- 5. Aggregation Views (Materialized Views)
-- ============================================

-- DAU/MAU视图
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_active_users AS
SELECT
    created_at::DATE as activity_date,
    COUNT(DISTINCT user_id) as dau
FROM user_activities
GROUP BY created_at::DATE;

CREATE MATERIALIZED VIEW IF NOT EXISTS monthly_active_users AS
SELECT
    DATE_TRUNC('month', created_at)::DATE as activity_month,
    COUNT(DISTINCT user_id) as mau
FROM user_activities
WHERE created_at >= DATE_TRUNC('month', NOW()) - INTERVAL '30 days'
GROUP BY DATE_TRUNC('month', created_at);

-- MRR变化趋势视图
CREATE MATERIALIZED VIEW IF NOT EXISTS mrr_movements AS
SELECT
    DATE(created_at) as date,
    SUM(CASE WHEN status = 'active' AND DATE(created_at) = DATE(started_at) 
        THEN mrr_value ELSE 0 END) as new_mrr,
    SUM(CASE WHEN status = 'canceled' THEN mrr_value ELSE 0 END) as churned_mrr,
    SUM(CASE WHEN status = 'active' THEN mrr_value ELSE 0 END) as total_mrr
FROM subscriptions
GROUP BY DATE(created_at);

-- 功能使用汇总视图
CREATE MATERIALIZED VIEW IF NOT EXISTS feature_usage_summary AS
SELECT
    feature_name,
    recorded_date,
    COUNT(DISTINCT user_id) as unique_users,
    SUM(count) as total_actions
FROM feature_usage
GROUP BY feature_name, recorded_date;

-- ============================================
-- 6. Helper Functions
-- ============================================

-- 计算留存率函数
CREATE OR REPLACE FUNCTION calculate_retention(
    cohort_date DATE,
    retention_day INT
) RETURNS DECIMAL(5,2) AS $$
DECLARE
    cohort_users INT;
    retained_users INT;
BEGIN
    SELECT COUNT(DISTINCT user_id) INTO cohort_users
    FROM users
    WHERE DATE(created_at) = cohort_date;
    
    SELECT COUNT(DISTINCT ua.user_id) INTO retained_users
    FROM users u
    JOIN user_activities ua ON u.id = ua.user_id
    WHERE DATE(u.created_at) = cohort_date
      AND DATE(ua.created_at) = cohort_date + retention_day;
    
    IF cohort_users = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN ROUND((retained_users::DECIMAL / cohort_users) * 100, 2);
END;
$$ LANGUAGE plpgsql;

-- 刷新物化视图
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_active_users;
    REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_active_users;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mrr_movements;
    REFRESH MATERIALIZED VIEW CONCURRENTLY feature_usage_summary;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. Row Level Security (RLS)
-- ============================================

-- 启用RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- 用户只能访问自己的数据
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own activities" ON user_activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tasks" ON agent_tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback" ON user_feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 8. Initial Seed Data
-- ============================================

-- 默认订阅计划
INSERT INTO subscription_plans (name, display_name, price_monthly, features, limits) VALUES
('free', 'Free', 0, '{"core_features": true}', '{"api_calls": 100, "storage_mb": 50}'),
('pro', 'Pro', 99, '{"core_features": true, "priority_support": true}', '{"api_calls": 10000, "storage_mb": 1000}'),
('enterprise', 'Enterprise', 999, '{"core_features": true, "priority_support": true, "custom_integration": true}', '{"api_calls": -1, "storage_mb": 10000}')
ON CONFLICT DO NOTHING;

-- ============================================
-- Notes
-- ============================================
-- 1. Run migrations in order: schema.sql -> workspace-tables.sql -> analytics-tables.sql
-- 2. Schedule refresh_analytics_views() to run daily via pg_cron
-- 3. Consider partitioning large tables (user_activities, api_logs) by time
-- 4. Add indexes based on actual query patterns after initial deployment