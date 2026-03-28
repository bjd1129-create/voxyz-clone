# 灯泡实验室页面部署指南

> 创建日期：2026-03-27  
> 页面 URL：`/labs`

---

## 📍 页面位置

**访问地址：**
- 主站：https://dengpao.pages.dev/labs
- 备用 1：https://zhugedengpao.vercel.app/labs
- 备用 2：https://dengpao-official.netlify.app/labs

**导航位置：**
- 主导航菜单：Vault → **实验室** → Insights

---

## 🚀 部署流程

### 方式一：Cloudflare Pages（主站）

**前提条件：**
- 已有 Cloudflare 账号
- 已创建 Pages 项目 `dengpao`

**部署步骤：**

1. **本地构建**
   ```bash
   cd /Users/bjd/openclaw/company/website
   npm run build
   ```

2. **部署到 Cloudflare**
   ```bash
   npx wrangler pages deploy out --project-name=dengpao --commit-dirty=true
   ```

3. **验证部署**
   - 访问：https://dengpao.pages.dev/labs
   - 检查页面是否正常加载
   - 检查导航链接是否正确

**自动部署（推荐）：**
- 连接 GitHub 仓库
- 开启自动部署
- 每次 push 到 main 分支自动构建部署

---

### 方式二：Vercel（备用）

**前提条件：**
- 已有 Vercel 账号
- 已创建项目 `zhugedengpao`

**部署步骤：**

1. **本地构建**
   ```bash
   cd /Users/bjd/openclaw/company/website
   npm run build
   ```

2. **部署到 Vercel**
   ```bash
   vercel --prod
   ```

3. **验证部署**
   - 访问：https://zhugedengpao.vercel.app/labs

**自动部署（推荐）：**
- 连接 GitHub 仓库
- 开启自动部署
- 每次 push 自动构建

---

### 方式三：Netlify（备用）

**前提条件：**
- 已有 Netlify 账号
- 已创建项目 `dengpao-official`

**部署步骤：**

1. **本地构建**
   ```bash
   cd /Users/bjd/openclaw/company/website
   npm run build
   ```

2. **部署到 Netlify**
   ```bash
   netlify deploy --prod --dir=out
   ```

3. **验证部署**
   - 访问：https://dengpao-official.netlify.app/labs

---

## 🔧 本地开发测试

**启动开发服务器：**

```bash
cd /Users/bjd/openclaw/company/website
npm run dev
```

**访问本地页面：**
- http://localhost:3000/labs

**测试检查清单：**
- [ ] 页面加载正常
- [ ] 团队介绍 Tab 切换正常
- [ ] 项目展示 Tab 切换正常
- [ ] 响应式设计正常（手机/平板/电脑）
- [ ] 导航链接正确
- [ ] 联系按钮可点击

---

## 📝 内容更新指南

### 更新团队成员

**文件位置：**
`/Users/bjd/openclaw/company/website/src/app/labs/page.tsx`

**找到 `teamMembers` 数组，修改内容：**

```javascript
const teamMembers = [
  {
    role: '👑 老庄',
    title: '创始人 + 故事主角',
    description: '描述内容...',
    icon: '👑'
  },
  // ... 其他成员
]
```

**修改后重新部署即可。**

---

### 更新项目列表

**找到 `projects` 数组，修改内容：**

```javascript
const projects = [
  {
    name: '项目名称',
    status: '内测中', // 可选：内测中/已上线/开发中/谋划中
    description: '项目描述...',
    tags: ['标签 1', '标签 2'],
    link: '/链接',
    cta: '行动按钮文字'
  },
  // ... 其他项目
]
```

**状态颜色映射：**
- `内测中` → 黄色
- `已上线` → 绿色
- `开发中` → 蓝色
- `谋划中` → 灰色

---

## 🎨 样式自定义

### 修改配色

**文件位置：**
`/Users/bjd/openclaw/company/website/src/app/labs/page.tsx`

**主色调（青色）：**
```javascript
// 找到所有 #4ecdc4 替换为你的颜色
bg-gradient-to-r from-[#4ecdc4] to-[#44a08d]
```

**背景色（深色）：**
```javascript
// 找到所有 #0a0a0a 替换为你的颜色
bg-[#0a0a0a]
```

---

### 修改字体

**文件位置：**
`/Users/bjd/openclaw/company/website/src/app/globals.css`

```css
/* 修改全局字体 */
body {
  font-family: '你的字体', sans-serif;
}
```

---

## 🔍 常见问题

### Q1: 页面 404 怎么办？

**检查：**
1. 文件路径是否正确：`src/app/labs/page.tsx`
2. 是否重新构建：`npm run build`
3. 是否重新部署：`npx wrangler pages deploy`

---

### Q2: 导航链接不显示？

**检查：**
1. DesktopNav.tsx 是否添加了链接
2. MobileNav.tsx 是否添加了链接
3. 是否重新构建部署

---

### Q3: 样式不对？

**检查：**
1. Tailwind CSS 是否正常加载
2. 是否有 CSS 冲突
3. 清除浏览器缓存

---

### Q4: 移动端显示异常？

**检查：**
1. 响应式断点是否正确
2. 使用浏览器开发者工具测试
3. 检查 grid/flex 布局

---

## 📊 数据追踪

### 添加访问统计

**推荐工具：**

1. **Google Analytics**
   ```javascript
   // 在 layout.tsx 中添加 GA 脚本
   ```

2. **Cloudflare Analytics**
   - Cloudflare Dashboard → Analytics
   - 自动启用

3. **Vercel Analytics**
   - Vercel Dashboard → Analytics
   - 自动启用

---

## 🔐 权限管理

### 保护敏感信息

**不要提交到代码库：**
- API 密钥
- 数据库密码
- 第三方服务密钥

**使用环境变量：**
```bash
# .env.local
NEXT_PUBLIC_API_KEY=your_key_here
```

---

## 📱 多平台测试

**测试清单：**

| 平台 | 浏览器 | 状态 |
|------|--------|------|
| Desktop | Chrome | ⬜ 待测试 |
| Desktop | Safari | ⬜ 待测试 |
| Desktop | Firefox | ⬜ 待测试 |
| Mobile | iOS Safari | ⬜ 待测试 |
| Mobile | Android Chrome | ⬜ 待测试 |
| Tablet | iPad Safari | ⬜ 待测试 |

---

## 🚨 紧急回滚

**如果部署后发现问题：**

1. **Cloudflare**
   ```bash
   # 查看历史部署
   npx wrangler pages deployment list --project-name=dengpao
   
   # 回滚到上一个版本
   npx wrangler pages deployment rollback --project-name=dengpao
   ```

2. **Vercel**
   - Vercel Dashboard → Deployments
   - 找到上一个版本 → 点击 Promote

3. **Netlify**
   - Netlify Dashboard → Deploys
   - 找到上一个版本 → 点击 Publish deploy

---

## 📞 技术支持

**遇到问题？**

1. 检查构建日志
2. 查看错误信息
3. 搜索类似问题
4. 联系技术支持

---

*最后更新：2026-03-27*
