-- ============================================
-- User Subscription System Schema
-- ============================================
-- 技术栈: Supabase Auth + 自定义订阅表
-- 注意: Supabase Auth 自动处理 auth.users 表
-- ============================================

-- ============================================
-- 1. 用户资料表 (扩展 auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'Asia/Shanghai',
  locale TEXT DEFAULT 'zh-CN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 邮箱验证
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMPTZ,
  
  -- 营销偏好
  marketing_consent BOOLEAN DEFAULT FALSE,
  newsletter_subscribed BOOLEAN DEFAULT FALSE,
  
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

-- 启用 RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS 策略: 用户只能查看和更新自己的资料
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 自动创建用户资料的触发器
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. 订阅计划表
-- ============================================
CREATE TYPE subscription_status AS ENUM (
  'active',      -- 活跃订阅
  'canceled',    -- 已取消（到期前仍有效）
  'expired',     -- 已过期
  'past_due',    -- 支付失败
  'trialing'     -- 试用期
);

CREATE TYPE billing_period AS ENUM (
  'monthly',
  'yearly',
  'lifetime'
);

CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- 计划名称 (Free, Pro, Enterprise)
  slug TEXT UNIQUE NOT NULL,             -- URL 友好标识
  description TEXT,
  
  -- 定价
  price_monthly DECIMAL(10, 2) DEFAULT 0,
  price_yearly DECIMAL(10, 2) DEFAULT 0,
  price_lifetime DECIMAL(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'CNY',
  
  -- 功能限制
  features JSONB DEFAULT '{}',           -- {"api_calls": 1000, "storage_gb": 10, "team_members": 5}
  limits JSONB DEFAULT '{}',              -- {"max_projects": 10, "max_exports": 100}
  
  -- 显示设置
  is_active BOOLEAN DEFAULT TRUE,
  is_popular BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  
  -- Stripe 集成
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  stripe_price_id_lifetime TEXT,
  stripe_product_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 插入默认计划
INSERT INTO public.plans (name, slug, description, price_monthly, price_yearly, price_lifetime, features, limits, is_popular, display_order) VALUES
  ('Free', 'free', '免费计划，适合个人试用', 0, 0, 0, 
   '{"api_calls": 100, "storage_gb": 1, "team_members": 1}'::jsonb,
   '{"max_projects": 3, "max_exports": 10}'::jsonb,
   FALSE, 1),
  ('Pro', 'pro', '专业版，适合小团队', 99, 999, 0,
   '{"api_calls": 10000, "storage_gb": 50, "team_members": 10}'::jsonb,
   '{"max_projects": 50, "max_exports": 1000}'::jsonb,
   TRUE, 2),
  ('Enterprise', 'enterprise', '企业版，无限可能', 499, 4999, 0,
   '{"api_calls": -1, "storage_gb": -1, "team_members": -1}'::jsonb,
   '{"max_projects": -1, "max_exports": -1}'::jsonb,
   FALSE, 3);

-- ============================================
-- 3. 用户订阅表
-- ============================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id),
  
  -- 订阅状态
  status subscription_status DEFAULT 'active',
  billing_period billing_period DEFAULT 'monthly',
  
  -- 时间周期
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  
  -- 试用期
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  
  -- Stripe 集成
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_price_id TEXT,
  
  -- 元数据
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_period CHECK (
    current_period_end IS NULL OR 
    current_period_start IS NULL OR 
    current_period_end > current_period_start
  )
);

-- 索引优化
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_subscription ON public.subscriptions(stripe_subscription_id);

-- 启用 RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access" ON public.subscriptions
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- 4. 使用量追踪表
-- ============================================
CREATE TABLE IF NOT EXISTS public.usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- 使用类型
  usage_type TEXT NOT NULL,              -- 'api_calls', 'storage', 'exports'
  quantity INTEGER DEFAULT 1,
  
  -- 时间戳
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 关联资源
  resource_id TEXT,                       -- 例如: 项目ID、文件ID
  metadata JSONB DEFAULT '{}',
  
  -- 计费周期（用于聚合）
  billing_period_start TIMESTAMPTZ NOT NULL,
  billing_period_end TIMESTAMPTZ NOT NULL
);

-- 索引优化
CREATE INDEX idx_usage_user_period ON public.usage_records(user_id, billing_period_start, billing_period_end);
CREATE INDEX idx_usage_type ON public.usage_records(usage_type);
CREATE INDEX idx_usage_recorded ON public.usage_records(recorded_at DESC);

-- 启用 RLS
ALTER TABLE public.usage_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage" ON public.usage_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON public.usage_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 5. 使用量汇总表（优化查询性能）
-- ============================================
CREATE TABLE IF NOT EXISTS public.usage_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- 使用类型
  usage_type TEXT NOT NULL,
  
  -- 汇总周期
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  
  -- 汇总值
  total_quantity BIGINT DEFAULT 0,
  
  -- 最后更新
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_user_type_period UNIQUE (user_id, usage_type, period_start)
);

-- 索引
CREATE INDEX idx_usage_summaries_user ON public.usage_summaries(user_id);
CREATE INDEX idx_usage_summaries_period ON public.usage_summaries(period_start, period_end);

-- 更新汇总的函数
CREATE OR REPLACE FUNCTION public.update_usage_summary()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usage_summaries (user_id, usage_type, period_start, period_end, total_quantity)
  VALUES (
    NEW.user_id,
    NEW.usage_type,
    NEW.billing_period_start,
    NEW.billing_period_end,
    NEW.quantity
  )
  ON CONFLICT (user_id, usage_type, period_start)
  DO UPDATE SET
    total_quantity = usage_summaries.total_quantity + NEW.quantity,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_usage_record_created
  AFTER INSERT ON public.usage_records
  FOR EACH ROW EXECUTE FUNCTION public.update_usage_summary();

-- ============================================
-- 6. 订阅历史/审计表
-- ============================================
CREATE TABLE IF NOT EXISTS public.subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  
  -- 变更类型
  action TEXT NOT NULL,                   -- 'created', 'upgraded', 'downgraded', 'canceled', 'renewed', 'expired'
  
  -- 变更详情
  from_plan_id UUID REFERENCES public.plans(id),
  to_plan_id UUID REFERENCES public.plans(id),
  from_status subscription_status,
  to_status subscription_status,
  
  -- 元数据
  reason TEXT,
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscription_history_sub ON public.subscription_history(subscription_id);
CREATE INDEX idx_subscription_history_user ON public.subscription_history(created_at DESC);

-- ============================================
-- 7. 支付记录表（预留 Stripe 集成）
-- ============================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id),
  
  -- 支付金额
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'CNY',
  
  -- 支付状态
  status TEXT DEFAULT 'pending',          -- 'pending', 'succeeded', 'failed', 'refunded'
  
  -- Stripe 集成
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  stripe_invoice_id TEXT,
  
  -- 元数据
  description TEXT,
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_stripe ON public.payments(stripe_payment_intent_id);

-- ============================================
-- 8. 邮件验证 Token 表
-- ============================================
CREATE TABLE IF NOT EXISTS public.verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  token TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,                     -- 'email_verification', 'password_reset'
  
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_verification_tokens_token ON public.verification_tokens(token);
CREATE INDEX idx_verification_tokens_user ON public.verification_tokens(user_id);

-- 清理过期 token 的函数
CREATE OR REPLACE FUNCTION public.cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM public.verification_tokens 
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 9. 更新时间戳的通用触发器
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 应用到各表
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- 10. 实用视图
-- ============================================

-- 用户当前订阅视图（包含计划详情）
CREATE OR REPLACE VIEW public.user_current_subscriptions AS
SELECT 
  s.id AS subscription_id,
  s.user_id,
  p.email,
  p.full_name,
  pl.id AS plan_id,
  pl.name AS plan_name,
  pl.slug AS plan_slug,
  pl.features,
  pl.limits,
  s.status,
  s.billing_period,
  s.current_period_start,
  s.current_period_end,
  s.cancel_at_period_end,
  s.trial_end
FROM public.subscriptions s
JOIN public.profiles p ON s.user_id = p.id
JOIN public.plans pl ON s.plan_id = pl.id
WHERE s.status IN ('active', 'trialing', 'canceled')
  AND (s.current_period_end IS NULL OR s.current_period_end > NOW());

-- 用户使用量统计视图
CREATE OR REPLACE VIEW public.user_usage_stats AS
SELECT 
  us.user_id,
  us.usage_type,
  us.total_quantity,
  us.period_start,
  us.period_end,
  p.email,
  p.full_name
FROM public.usage_summaries us
JOIN public.profiles p ON us.user_id = p.id;

-- ============================================
-- 11. 常用函数
-- ============================================

-- 检查用户是否有活跃订阅
CREATE OR REPLACE FUNCTION public.has_active_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = user_uuid
      AND status IN ('active', 'trialing')
      AND (current_period_end IS NULL OR current_period_end > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 获取用户当前计划
CREATE OR REPLACE FUNCTION public.get_user_plan(user_uuid UUID)
RETURNS TABLE (
  plan_id UUID,
  plan_name TEXT,
  plan_slug TEXT,
  features JSONB,
  limits JSONB,
  status subscription_status
) AS $$
BEGIN
  RETURN QUERY
  SELECT pl.id, pl.name, pl.slug, pl.features, pl.limits, s.status
  FROM public.subscriptions s
  JOIN public.plans pl ON s.plan_id = pl.id
  WHERE s.user_id = user_uuid
    AND s.status IN ('active', 'trialing', 'canceled')
    AND (s.current_period_end IS NULL OR s.current_period_end > NOW())
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 检查用户是否超过限制
CREATE OR REPLACE FUNCTION public.check_usage_limit(
  user_uuid UUID,
  limit_type TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  current_plan RECORD;
  current_usage BIGINT;
  limit_value INTEGER;
BEGIN
  -- 获取用户计划
  SELECT * INTO current_plan FROM public.get_user_plan(user_uuid);
  
  IF NOT FOUND THEN
    -- 无订阅，使用 free 计划限制
    SELECT limits->limit_type INTO limit_value
    FROM public.plans WHERE slug = 'free';
  ELSE
    limit_value := (current_plan.limits->limit_type)::INTEGER;
  END IF;
  
  -- -1 表示无限制
  IF limit_value = -1 THEN
    RETURN TRUE;
  END IF;
  
  -- 获取当前使用量
  SELECT COALESCE(SUM(total_quantity), 0) INTO current_usage
  FROM public.usage_summaries
  WHERE user_id = user_uuid
    AND usage_type = limit_type
    AND period_end > NOW();
  
  RETURN current_usage < limit_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 完成提示
-- ============================================
-- 执行此 SQL 后:
-- 1. 在 Supabase 控制台配置 Auth 设置
-- 2. 配置邮件模板（验证、重置密码）
-- 3. 设置 Stripe Webhook（如使用 Stripe）
-- 4. 配置定时任务清理过期 token