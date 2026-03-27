# 数据分析仪表盘使用指南

## 概述

数据分析仪表盘是一个全面的数据监控和分析系统，用于追踪产品的核心业务指标。

## 文件结构

```
website/
├── src/app/dashboard/analytics/
│   └── page.tsx          # 仪表盘页面组件
├── supabase/
│   ├── analytics-tables.sql  # 数据分析相关表结构
│   ├── schema.sql            # 基础schema
│   └── workspace-tables.sql  # 工作空间表
└── docs/
    └── analytics-dashboard.md # 本文档

/company/
└── METRICS.md            # 指标定义文档
```

## 安装依赖

```bash
cd /Users/bjd/openclaw/company/website
npm install
```

## 数据库部署

```bash
# 1. 确保 Supabase CLI 已安装
# 2. 连接到 Supabase 项目
supabase link --project-ref <your-project-ref>

# 3. 推送数据库迁移
supabase db push
```

或者直接在 Supabase SQL Editor 中执行：
1. `supabase/schema.sql`
2. `supabase/workspace-tables.sql`
3. `supabase/analytics-tables.sql`

## 启动开发服务器

```bash
npm run dev
```

访问: http://localhost:3000/dashboard/analytics

## 功能模块

### 1. 概览 (Overview)
- 核心指标卡片展示
- DAU/MAU 趋势图
- 收入趋势图
- 快速统计面板

### 2. 用户指标 (Users)
- 注册用户数、DAU、MAU
- 留存率分布
- 用户分层分析

### 3. 业务指标 (Business)
- MRR/ARR/ARPU
- MRR 变化分析
- 订阅分布

### 4. 产品指标 (Product)
- 任务完成数、响应时间
- 成功率追踪
- Agent 任务分析表格

### 5. 营销指标 (Marketing)
- CAC/LTV 分析
- 转化漏斗
- 渠道效果对比

## API 集成

当前使用 Mock 数据。实际部署时，需要创建 API 端点：

```typescript
// 建议的 API 路由结构
/src/app/api/analytics/
├── users/
│   ├── dau/route.ts
│   ├── mau/route.ts
│   └── retention/route.ts
├── business/
│   ├── mrr/route.ts
│   ├── arr/route.ts
│   └── churn/route.ts
├── product/
│   ├── tasks/route.ts
│   └── performance/route.ts
└── marketing/
    ├── cac/route.ts
    └── funnel/route.ts
```

## 数据刷新策略

### 物化视图刷新
建议设置 pg_cron 定时任务：

```sql
-- 每天凌晨 1 点刷新物化视图
SELECT cron.schedule(
  'refresh-analytics-views',
  '0 1 * * *',
  'SELECT refresh_analytics_views()'
);
```

### 实时更新
对于需要实时数据的指标，可以直接查询原表而非物化视图。

## 自定义指标

### 添加新指标
1. 在 `METRICS.md` 中定义指标
2. 在 `analytics-tables.sql` 中添加相应表结构
3. 在仪表盘组件中添加展示逻辑

### 添加新图表
```tsx
// 在 page.tsx 中添加新图表
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={yourData}>
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line dataKey="value" stroke="#0088FE" />
  </LineChart>
</ResponsiveContainer>
```

## 权限控制

仪表盘使用 Supabase RLS (Row Level Security) 控制数据访问：
- 普通用户只能查看自己的数据
- 管理员可以查看所有数据

创建管理员角色：
```sql
-- 添加管理员策略
CREATE POLICY "Admins can view all data" ON user_activities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );
```

## 监控告警

建议集成告警系统：

| 指标 | 阈值 | 严重级别 |
|------|------|----------|
| Churn Rate | > 5%/月 | 高 |
| 错误率 | > 1% | 中 |
| 平均响应时间 | > 30s | 中 |
| DAU 下降 | > 20% | 高 |

## 技术栈

- **前端**: Next.js 15, React 18, Tailwind CSS
- **图表**: Recharts
- **数据库**: PostgreSQL (Supabase)
- **认证**: Supabase Auth

## 后续优化

1. [ ] 添加日期范围选择器
2. [ ] 实现数据导出功能
3. [ ] 添加实时数据推送 (WebSocket)
4. [ ] 集成告警通知
5. [ ] 添加数据对比功能（周对周、月对月）
6. [ ] 实现自定义仪表盘布局

---

*文档版本: 1.0.0 | 创建时间: 2026-03-27*