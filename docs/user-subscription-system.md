# 用户订阅系统文档

## 概述

这是一个完整的用户注册、登录和订阅管理系统，使用 Next.js App Router + Supabase 构建，预留 Stripe 支付集成。

## 目录结构

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts          # 登录 API
│   │   │   ├── register/route.ts       # 注册 API
│   │   │   ├── logout/route.ts         # 登出 API
│   │   │   ├── reset-password/route.ts # 重置密码请求
│   │   │   ├── update-password/route.ts# 更新密码
│   │   │   └── session/route.ts        # 获取会话
│   │   ├── subscription/
│   │   │   ├── route.ts                # 获取订阅
│   │   │   ├── create/route.ts         # 创建订阅
│   │   │   ├── upgrade/route.ts        # 升级/降级
│   │   │   ├── cancel/route.ts         # 取消订阅
│   │   │   └── reactivate/route.ts     # 重新激活
│   │   ├── usage/
│   │   │   ├── route.ts                # 记录使用量
│   │   │   └── stats/route.ts          # 使用量统计
│   │   └── plans/route.ts              # 获取计划列表
│   ├── auth/
│   │   ├── login/page.tsx              # 登录页
│   │   ├── register/page.tsx           # 注册页
│   │   ├── forgot-password/page.tsx    # 忘记密码页
│   │   ├── reset-password/page.tsx     # 重置密码页
│   │   └── callback/page.tsx           # OAuth 回调
│   ├── account/
│   │   ├── profile/page.tsx            # 个人资料页
│   │   └── subscription/page.tsx       # 订阅管理页
│   └── pricing/page.tsx                # 定价页
├── components/
│   ├── auth/
│   │   ├── AuthForm.tsx                # 登录/注册表单
│   │   ├── ResetPasswordForm.tsx       # 重置密码表单
│   │   └── UpdatePasswordForm.tsx      # 更新密码表单
│   └── subscription/
│       ├── PricingCards.tsx            # 定价卡片
│       └── SubscriptionManager.tsx     # 订阅管理组件
└── lib/
    └── subscription.ts                 # 类型定义和工具函数
```

## 数据库表设计

### 1. profiles (用户资料表)
扩展 Supabase Auth 的 auth.users 表，存储用户额外信息。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键，关联 auth.users |
| email | TEXT | 邮箱 |
| full_name | TEXT | 姓名 |
| avatar_url | TEXT | 头像 URL |
| company | TEXT | 公司 |
| phone | TEXT | 电话 |
| timezone | TEXT | 时区 |
| email_verified | BOOLEAN | 邮箱已验证 |
| created_at | TIMESTAMPTZ | 创建时间 |
| updated_at | TIMESTAMPTZ | 更新时间 |

### 2. plans (订阅计划表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | TEXT | 计划名称 |
| slug | TEXT | URL 标识 |
| price_monthly | DECIMAL | 月付价格 |
| price_yearly | DECIMAL | 年付价格 |
| features | JSONB | 功能列表 |
| limits | JSONB | 使用限制 |
| stripe_price_id_* | TEXT | Stripe 价格 ID |

### 3. subscriptions (用户订阅表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 用户 ID |
| plan_id | UUID | 计划 ID |
| status | ENUM | 状态 |
| billing_period | ENUM | 计费周期 |
| current_period_start/end | TIMESTAMPTZ | 当前周期 |
| stripe_subscription_id | TEXT | Stripe 订阅 ID |

### 4. usage_records (使用量记录表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 用户 ID |
| usage_type | TEXT | 使用类型 |
| quantity | INTEGER | 数量 |
| billing_period_start/end | TIMESTAMPTZ | 计费周期 |

### 5. usage_summaries (使用量汇总表)

用于快速查询当前周期的使用量。

### 6. subscription_history (订阅历史表)

记录订阅变更历史，用于审计。

### 7. payments (支付记录表)

预留 Stripe 集成，记录支付状态。

## API 端点

### 认证 API

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/logout | 用户登出 |
| POST | /api/auth/reset-password | 请求重置密码 |
| POST | /api/auth/update-password | 更新密码 |
| GET | /api/auth/session | 获取当前会话 |

### 订阅 API

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | /api/subscription | 获取用户订阅 |
| POST | /api/subscription/create | 创建订阅 |
| POST | /api/subscription/upgrade | 升级/降级订阅 |
| POST | /api/subscription/cancel | 取消订阅 |
| POST | /api/subscription/reactivate | 重新激活订阅 |

### 使用量 API

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | /api/usage | 记录使用量 |
| GET | /api/usage/stats | 获取使用量统计 |

### 计划 API

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | /api/plans | 获取所有计划 |

## 使用示例

### 用户注册

```typescript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    full_name: '张三',
  }),
})
```

### 创建订阅

```typescript
const response = await fetch('/api/subscription/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    planId: 'plan-uuid',
    billingPeriod: 'monthly',
  }),
})
```

### 记录使用量

```typescript
await fetch('/api/usage', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    usageType: 'api_calls',
    quantity: 1,
  }),
})
```

### 检查使用限制

```typescript
const response = await fetch('/api/usage/stats', {
  headers: { Authorization: `Bearer ${token}` },
})
const { usage } = await response.json()

// usage.api_calls = { current: 50, limit: 100, percentage: 50 }
```

## Stripe 集成（预留）

1. 在 Supabase 控制台配置 Stripe 密钥
2. 在 `plans` 表中设置 `stripe_price_id_*` 字段
3. 创建 Stripe Webhook 处理订阅事件
4. 使用 Stripe Checkout 处理支付流程

## 部署步骤

1. **执行数据库 Schema**
   ```bash
   supabase db push
   ```

2. **配置环境变量**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

3. **配置 Supabase Auth**
   - 在 Supabase 控制台配置邮件模板
   - 设置重定向 URL
   - 配置第三方 OAuth（可选）

4. **部署应用**
   ```bash
   npm run build
   npm start
   ```

## 安全考虑

1. **RLS 策略**：所有表都启用了行级安全，用户只能访问自己的数据
2. **JWT 验证**：每个 API 请求都验证 JWT token
3. **服务端验证**：敏感操作使用 service_role 密钥在服务端执行
4. **输入验证**：API 端点验证所有输入参数

## 扩展建议

1. **添加团队功能**：创建 teams 表，支持团队协作
2. **添加邀请系统**：用户邀请团队成员
3. **添加发票系统**：生成 PDF 发票
4. **添加 Webhook 通知**：订阅状态变更通知
5. **添加多语言支持**：i18n 国际化