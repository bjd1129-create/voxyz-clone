# Stripe 配置指南

> 创建日期：2026-03-27  
> 状态：待配置

---

## 1. 获取 Stripe API 密钥

### 登录 Stripe Dashboard
https://dashboard.stripe.com/apikeys

### 需要的密钥

| 密钥类型 | 用途 | 前缀 |
|---------|------|------|
| **Publishable Key** | 前端使用 | `pk_test_...` 或 `pk_live_...` |
| **Secret Key** | 后端使用 | `sk_test_...` 或 `sk_live_...` |
| **Webhook Secret** | 验证回调 | `whsec_...` |

---

## 2. 创建产品

### 在 Stripe Dashboard 创建产品

**路径：** Products → Add Product

### 产品信息

| 产品 | 名称 | 价格 | 类型 |
|------|------|------|------|
| **Starter** | 诸葛灯泡 Starter | ¥299 | One-time |
| **Pro** | 诸葛灯泡 Pro | ¥799 | One-time |
| **Enterprise** | 诸葛灯泡 Enterprise | ¥10,000 | One-time |

### 创建后记录 Product ID

```
Starter: prod_xxxxx
Pro: prod_xxxxx
Enterprise: prod_xxxxx
```

---

## 3. 配置支付链接（可选）

### 创建 Payment Links

**路径：** Products → Create Payment Link

**优势：**
- 无需开发结账页面
- Stripe 托管支付流程
- 支持多种支付方式

**步骤：**
1. 选择产品
2. 配置结账页面（添加 Logo、品牌色）
3. 配置支付后重定向 URL
4. 生成支付链接

---

## 4. 设置 Webhook

### 配置 Webhook 端点

**路径：** Developers → Webhooks → Add Endpoint

**Endpoint URL:**
```
https://dengpao.pages.dev/api/webhooks/stripe
```

**Events to Listen:**
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `customer.subscription.created` (如果未来做订阅)
- `customer.subscription.updated`
- `customer.subscription.deleted`

**获取 Webhook Secret:**
创建后复制 `Signing Secret` (whsec_开头)

---

## 5. 环境变量配置

### 在 Vercel 设置环境变量

**路径：** Project Settings → Environment Variables

```bash
# Stripe 配置
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# 产品 ID
STRIPE_PRODUCT_ID_STARTER=prod_xxxxx
STRIPE_PRODUCT_ID_PRO=prod_xxxxx
STRIPE_PRODUCT_ID_ENTERPRISE=prod_xxxxx

# 交付配置
GITHUB_TOKEN=ghp_xxxxx
FEISHU_APP_ID=cli_xxxxx
FEISHU_APP_SECRET=xxxxx

# 部署环境
NEXT_PUBLIC_SITE_URL=https://dengpao.pages.dev
```

---

## 6. 测试流程

### 使用 Stripe 测试卡

**测试卡号：**
```
成功支付：4242 4242 4242 4242
需要 3DS：4000 0027 6000 3184
支付失败：4000 0000 0000 9995
```

**任意信息：**
- 过期日期：任意未来日期
- CVC：任意 3 位数字
- ZIP：任意 5 位数字

---

## 7. 检查清单

- [ ] 获取 Stripe API 密钥
- [ ] 创建 3 个产品
- [ ] 记录 Product IDs
- [ ] 配置 Webhook
- [ ] 复制 Webhook Secret
- [ ] 设置 Vercel 环境变量
- [ ] 测试支付流程
- [ ] 验证自动交付

---

## 8. 常见问题

### Q: 测试模式和正式模式如何切换？

A: Stripe 密钥前缀决定：
- `pk_test_` / `sk_test_` → 测试模式
- `pk_live_` / `sk_live_` → 正式模式

### Q: Webhook 本地如何测试？

A: 使用 Stripe CLI：
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Q: 如何查看支付记录？

A: Stripe Dashboard → Payments

---

*配置完成后，支付系统将自动运行！*