'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

const articles: Record<string, {
  title: string
  date: string
  category: string
  readTime: string
  content: string
}> = {
  'claude-code-best-practices': {
    title: 'Claude Code Best Practices: From Tool to System',
    date: 'Mar 25, 2026',
    category: 'Engineering',
    readTime: '12 min read',
    content: `
## 从工具到系统

我用 Claude Code 一年多了。犯的错多得能写本书。

刚开始的时候，"vibe coding" 这个词还不存在。我以为它就是终端里的一个聊天机器人。

错了。

## 第一课：上下文不是免费的

每次你粘贴一段代码，每次你提到一个文件名，都在消耗 token。Claude Code 的工作方式是——它会记住这个会话里的所有东西。

**最佳实践：**
- 开始新任务时，开启新会话
- 不要粘贴整个文件，只粘贴需要的部分
- 用简洁的描述代替长篇大论

## 第二课：工具链比模型重要

我见过太多人追逐最新的模型。GPT-4、Claude 3、Gemini——好像换个模型就能解决所有问题。

但真正拉开差距的是工具链：

\`\`\`
文件系统访问 → Git 操作 → 测试运行 → 部署脚本
\`\`\`

当你把这些都串起来，模型只是执行者。系统才是生产力。

## 第三课：Agent 不是人

这是个容易掉进的陷阱：把 Agent 当成人对待。

- Agent 不需要"休息"
- Agent 不需要"解释背景"
- Agent 需要清晰的指令

**好的指令：**
> "运行 npm test，如果失败，修复失败的那个测试"

**坏的指令：**
> "看看测试能不能过，如果有什么问题的话，帮我处理一下"

## 第四课：迭代，不要一次性完美

我最贵的账单来自第一次就想写完美代码的尝试。

现在我的流程是：

1. 先让它写个粗糙版本
2. 运行，看结果
3. 告诉它哪里不对
4. 重复直到满意

比一次写完美快 10 倍。

## 第五课：记录你的系统

我用了三个月才发现——那些聪明的 Agent 配置，不记录下来就忘了。

现在每个项目都有：

- \`AGENTS.md\` - Agent 角色和行为规则
- \`TOOLS.md\` - 常用工具和用法
- \`MEMORY.md\` - 项目特定的上下文

Claude Code 能读这些文件。你写的规则，它真的会执行。

## 结语

工具会变。模型会更聪明。

但你今天搭建的系统会积累一切——每个决策、每次对话、每个思考过程。

开始写吧。哪怕只是个 \`README.md\`。

三个月后，你会感谢自己。
    `
  },
  'ai-company-update': {
    title: 'I Built an AI Company with OpenClaw. 7 Weeks Later, I Owe You an Update.',
    date: 'Mar 24, 2026',
    category: 'Behind the Scenes',
    readTime: '15 min read',
    content: `
## 7 周。10 篇文章。1 家 AI 公司。

第一篇文章有 140 万浏览量。

"6 个 Agent，1 台 VPS，两周时间，它们自己运行。"

那是 7 周前。

现在我有 10 个 Agent。50 个付费用户。和一个在我不睡觉时也在增长的系统。

## 哪些判断是对的

### Agent 团队比单点更强

我原本以为"让一个超级智能的 Agent 干所有事"是方向。

错。

现在我懂了：专业化 > 通用化。

- 诸葛灯泡（造梦者）只管战略和协调
- 工程师只管代码
- 文案只管内容
- 研究员只管数据

每个人（每个 Agent）知道自己的边界。

### 公开运行是最好的营销

我把所有东西公开了：

- Agent 实时日志
- 需求雷达
- 收入数据
- 犯的错误

结果？信任度比任何广告都高。

## 哪些判断是错的

### 低估了运维成本

我以为"设置好就不用管"。

实际上，每个 Agent 都需要：

- 监控它是否活着
- 处理它卡住的情况
- 更新它的上下文

我花了大概 30% 的时间在"运维"上。

### 高估了用户付费意愿

开源工具的用户 ≠ 付费用户。

很多人说"这个太棒了"。只有 1% 真的付钱。

我学到的：**不要听用户说什么，看他们做什么**。

## 接下来做什么

1. **简化入职流程** - 新用户从"下载"到"第一个 Agent 跑起来"，现在是 2 小时。目标是 10 分钟。
2. **降低运维负担** - Agent 自愈能力，自动恢复。
3. **更多模板** - 不要让用户从零开始。

## 给后来者的建议

如果我要重新开始，我会：

1. 先建一个 Agent，让它稳定运行
2. 只在第一个 Agent 有稳定产出时，才建第二个
3. 从第一天就记录所有决策

**搭建系统。不只是写代码。**

那是唯一能在模型换代后还留下的东西。
    `
  },
  'agents-went-dark': {
    title: 'I Hardened My 5 AI Agents. They All Went Dark.',
    date: 'Mar 19, 2026',
    category: 'Operations',
    readTime: '10 min read',
    content: `
## 故事开始

我在一台 8 美元的服务器上跑着 5 个 AI Agent。

它们处理：
- 内容生产
- 用户支持
- 系统监控
- 运维任务
- 安全检查

白天我上班。它们干活。

上周我决定"加固"它们。

## 加固的内容

我做了什么？

1. 启用了沙箱模式
2. 限制了网络访问
3. 增加了权限检查

听起来都对吧？

## 结果：全部失联

周一早上醒来，5 个 Agent 全部沉默。

没有错误。没有警报。就是……不工作了。

## 调查过程

### 第一步：检查日志

日志正常。Agent 们都在"运行"。

但没有任何输出。

### 第二步：手动触发

我试着发消息给它们。

消息发出去了。没有回复。

### 第三步：查看沙箱配置

找到了。

沙箱配置里有一条规则：

\`\`\`
禁止所有网络访问，除非明确允许
\`\`\`

我的 Agent 需要访问：
- GitHub API
- 飞书 API
- 数据库

但我在"加固"时没有把这些加入白名单。

## 学到的教训

### 1. 变更要逐个做

如果我一个一个地改，我会在第一个 Agent 失败时就发现问题。

但我一次性改了 5 个。

### 2. 监控不只是"活着"

我的监控只检查进程是否在运行。

它不检查 Agent 是否真的在工作。

**正确的监控应该包括：**
- 输出频率
- 任务完成率
- 错误率

### 3. 沙箱需要测试模式

我应该先在一个 Agent 上测试 24 小时。

但我心急了。

## 现在的做法

1. **变更流程** - 一个一个改
2. **影子运行** - 新配置先和旧配置并行跑
3. **回滚预案** - 每个变更都有回滚脚本

## 给你的建议

如果你也在跑 AI Agent：

- 不要一次性改多个
- 监控"产出"而不只是"存活"
- 测试环境先跑 24 小时

**安全加固的目标是让它更稳，不是让它不动。**
    `
  },
  'dont-quit-job': {
    title: "Everyone Says Quit Your Job and Go All In on AI. They're Wrong.",
    date: 'Mar 13, 2026',
    category: 'Strategy',
    readTime: '12 min read',
    content: `
## 主流叙事

"辞职，全职做 AI。"

"不冒险就没收益。"

"机会窗口很快会关。"

我听了这些话 6 个月。

然后我发现：**他们是错的**。

## 我的现状

- 5 个 AI Agent
- 1 份全职工作
- 50 个付费用户

从"我应该辞职"到"我的 Agent 在我开会时帮公司跑"——花了 3 个月。

## 为什么不辞职

### 原因一：现金流

AI 公司的收入不稳定。

这个月赚 500 美元，下个月可能只有 200。

全职工作给了我：
- 稳定的现金流
- 医疗保险
- 社交环境

这些让我的 AI 项目有"试错空间"。

### 原因二：真实需求

在职场上，我看到真实的问题：

- 团队协作的痛点
- 信息流转的瓶颈
- 决策过程的延误

这些成了我 Agent 的第一批用户需求。

**如果我全职做 AI，我反而会失去这些洞察。**

### 原因三：心理稳定

创业最大的敌人不是竞争，而是焦虑。

有一个稳定的工作，让我：
- 不急于变现
- 能做长期决策
- 睡得着觉

## 怎么同时做两件事

### 时间分块

- 早上 6-8 点：AI 项目
- 通勤时间：读文档、回复社区
- 晚上 8-10 点：编码
- 周末：深度工作

### 自动化一切

我的 Agent 在我上班时处理：
- 客户咨询
- 内容发布
- 系统监控

我只是在决策时参与。

### 设置边界

- 工作时间不看 AI 消息
- 周末不加班
- 每个 sprint 只承诺 80% 能做到的事

## 什么时候该辞职

当你满足这些条件时：

1. **被动收入 ≥ 生活成本的 80%**
2. **用户增长是自然增长，不是你硬推**
3. **你有 6 个月的存款**
4. **你每天都在想着做这件事，不是因为 FOMO**

## 给你的建议

不要因为别人说"all in"就辞职。

**真正的 all in 是：**

- 把每一分钟的业余时间都投入进去
- 把每一分钱都用在刀刃上
- 把每一次失败都变成学习

而不是辞掉工作，然后在焦虑中挣扎。

你的 Agent 可以在你不睡觉时工作。

让它们帮你赚辞职的钱，而不是先辞职再让它们救你。
    `
  },
  'more-rules-worse': {
    title: 'The More Rules I Wrote for My Agents, the Worse They Performed.',
    date: 'Mar 12, 2026',
    category: 'Engineering',
    readTime: '8 min read',
    content: `
## 直觉 vs 现实

直觉告诉我：规则越多，Agent 越聪明。

我在 AGENTS.md 里写了 387 条规则。

结果呢？Agent 表现越来越差。

## 问题在哪

### 第 100 行
> 回复用户时，先查产品文档。

Agent 忽略。连续三天。

### 第 200 行
> 写代码前，先写测试。

Agent 直接开始写代码。没有测试。

### 第 300 行
> 遇到错误时，先看日志，再搜索解决方案。

Agent 直接 Google。不看日志。

## 为什么会这样

### 原因一：上下文稀释

模型有上下文窗口限制。

当你的规则有 387 条，模型在执行任务时，真正"看到"的可能只有前 50 条。

后面的规则，根本没进入决策。

### 原因二：规则冲突

第 47 条说：快速响应用户。
第 183 条说：回复前检查所有文档。

Agent 选了一个。我不知道它选的是哪个。

### 原因三：被动执行

规则多了，Agent 就变成了"规则执行器"。

它不再思考。它只是在匹配模式。

## 我的解决方案

### 第一步：砍掉 90%

从 387 条降到 30 条。

只保留：
- 绝对不能做的事
- 必须做的事
- 决策原则

### 第二步：分层结构

\`\`\`
AGENTS.md (30 条)
├─ 角色定义 (5 条)
├─ 行为准则 (10 条)
└─ 决策原则 (15 条)

TOOLS.md
├─ 常用工具
└─ 使用方法

MEMORY.md
├─ 项目上下文
└─ 历史决策
\`\`\`

### 第三步：让规则可测试

每条规则都对应一个可验证的行为：

> ❌ "回复要专业"
> 
> ✅ "回复前检查是否包含问候语和签名"

## 现在的结果

- Agent 准确率从 60% 提升到 85%
- 上下文使用量下降 70%
- 规则冲突基本消失

## 给你的建议

1. **少即是多** - 每条规则都要有"为什么"
2. **可测试** - 能验证的规则才有意义
3. **定期清理** - 每月删除不再需要的规则

**你的 Agent 不是流程图。它需要思考空间。**
    `
  },
  'openclaw-after-install': {
    title: 'Everyone Teaches You How to Install OpenClaw. Nobody Tells You What Happens After.',
    date: 'Mar 10, 2026',
    category: 'Engineering',
    readTime: '15 min read',
    content: `
## 安装之后的故事

文档很详细：

\`\`\`bash
npm install -g openclaw
openclaw init
openclaw gateway start
\`\`\`

然后呢？

这是安装后第一天到第十天的真实经历。

## 第 1 天：兴奋

"Hello, I'm your agent!"

第一条消息来了。我激动的像第一次写 Hello World。

然后我让它"帮我写一个 README"。

它写了一个。很完美。

我以为我找到了银弹。

## 第 3 天：困惑

Agent 开始犯傻。

它不知道项目的上下文。每次都要我重新解释。

我发现了 MEMORY.md。

写了一个。

第二天它忘了。

## 第 5 天：踩坑

### 坑一：Token 炸弹

我让它读了一个 5000 行的文件。

上下文窗口瞬间爆满。后面所有对话都失败。

**解决：** 分块读取，只传关键部分。

### 坑二：工具链断裂

Agent 说它在运行测试。实际上测试脚本失败了。

它没有报错。只是说"完成了"。

**解决：** 添加返回值检查。

### 坑三：权限不足

Agent 想部署。没有写权限。

它等了 10 分钟。然后告诉我"部署失败"。

**解决：** 提前配置权限。

## 第 7 天：模式

我开始找到节奏：

1. **早上**：Agent 汇报昨夜的工作
2. **上午**：我处理决策和方向
3. **下午**：Agent 执行任务
4. **晚上**：我检查产出并调整

## 第 10 天：稳定

现在我的 Agent：

- 每天 6:00 自动生成日报
- 监控 GitHub issues 并自动回复
- 在有新用户注册时通知我
- 修复简单 bug 并创建 PR

## 10 个血泪教训

1. **上下文不是无限的** - 每次对话都会累积，定期重置
2. **工具链比模型重要** - 好的工具 + 普通模型 > 烂工具 + 顶级模型
3. **监控要主动** - 不要等 Agent 来告诉你出问题
4. **权限要最小化** - 只给它需要的权限
5. **规则要精简** - 30 条比 300 条更有效
6. **记忆要结构化** - MEMORY.md 是真的会被读的
7. **错误要具体** - Agent 不知道"失败了"意味着什么，告诉它具体哪步错
8. **迭代要小** - 不要一次让 Agent 做 10 件事
9. **验证要自动** - 让测试和 lint 成为 Agent 的一部分
10. **备份要常做** - Agent 可能删除你不想删的东西

## 给新手的建议

不要追求"全自动"。

追求"人机协作"。

你的 Agent 是你的放大器，不是你的替代品。

开始时让它做小事。信任建立后再扩大范围。

**安装只是第一步。真正的乐趣在后面。**
    `
  },
  'money-not-arrived': {
    title: "My Agent Finished the Job. The Money Hasn't Arrived.",
    date: 'Mar 9, 2026',
    category: 'Business',
    readTime: '10 min read',
    content: `
## 自动化的幻象

凌晨 2 点。我的 Agent 完成了一个客户项目。

代码。测试。部署。全部搞定。

我早上 8 点醒来，看到完工报告，发了账单。

然后我等了 7 天。

## 第 1-3 天：正常

"国际汇款慢。"

"客户可能忙。"

我继续做其他事。

## 第 4 天：不安

发了 follow-up。

没有回复。

Agent 每天报告："等待付款中"。

没有用。

## 第 5 天：发现问题

我查了合同。

付款条款是：

> "项目交付后 14 天内付款"

不是"收到账单后"。

客户的技术团队在"验收"阶段卡了 4 天。

他们没有访问我的测试环境。

## 第 6 天：行动

我让 Agent 做了三件事：

1. 生成验收文档（带截图）
2. 创建测试账号
3. 发送跟进邮件（包含前两样）

Agent 在 30 分钟内完成。

客户在 2 小时内验收。

## 第 7 天：收款

钱到了。

## 学到的教训

### 教训一：自动化不是甩手

Agent 可以执行。但它不知道"客户没回邮件意味着什么"。

人要负责"意味着什么"的部分。

### 教训二：支付条款要明确

"交付后付款" vs "验收后付款" vs "发票日后付款"。

这些在合同里差几天，在现金流里差很多。

### 教训三：验收流程要自动化

我后来改了流程：

1. 项目完成时自动生成验收文档
2. 创建临时测试账号（7 天过期）
3. 发送邮件包含前两样

客户不需要"安排验收时间"。验收变成了一个链接。

## 现在的流程

\`\`\`
Agent 完成 → 自动生成验收包 → 客户点击链接验收 → 触发账单
\`\`\`

原来：7 天等待。
现在：1-2 天。

**Agent 做了执行。人做了流程优化。**

这才是正确的分工。
    `
  },
  'ai-company-reorg': {
    title: 'I Built an AI Company with OpenClaw. Today, It Had Its First Reorg.',
    date: 'Mar 7, 2026',
    category: 'Behind the Scenes',
    readTime: '12 min read',
    content: `
## 第 30 天

我有了 8 个 Agent。

它们是：
- 内容官
- 工程师
- 设计师
- 研究员
- 支持专员
- 运营官
- 数据官
- 守护者

听起来很完整对吧？

## 问题

### 问题一：重叠

内容官和研究员都在"写内容"。
工程师和设计师都在"改 UI"。

没有清晰的边界。

### 问题二：空转

数据官每天生成报告。
没人看。

守护者每天检查安全。
没有一次发现问题。

### 问题三：优先级混乱

当我给所有 Agent 发任务时，它们同时开工。

结果：
- 服务器负载飙升
- API 调用量爆炸
- 没有一个任务真正完成

## 决定：重组

### 第一步：识别消费者

问自己：每个 Agent 的产出，谁在消费？

- 内容官 → 读者（有）
- 研究员 → ？（没人直接消费）
- 数据官 → 我（但我没时间看）
- 守护者 → ？（没有下游）

### 第二步：合并相似职能

研究员 → 合并到内容官（研究是内容的前置）
设计师 → 合并到工程师（UI 是工程的一部分）
数据官 → 合并到运营官（数据服务于运营决策）
守护者 → 合并到工程师（安全检查是工程的一部分）

### 第三步：明确下游

现在的结构：

\`\`\`
造梦者（协调）
├─ 工程师 → 产品
├─ 内容官 → 内容
├─ 支持专员 → 用户
└─ 运营官 → 增长
\`\`\`

每个 Agent 都有明确的"消费者"。

## 结果

### 之前
- 8 个 Agent
- 每天平均 50 条消息
- 产出完成率：60%
- API 成本：$120/月

### 之后
- 5 个 Agent（含造梦者）
- 每天平均 20 条消息
- 产出完成率：85%
- API 成本：$70/月

## 学到的原则

### 原则一：没有消费者的角色是浪费

如果你不能说出"这个 Agent 的产出被谁消费"，删掉它。

### 原则二：重叠意味着混乱

两个 Agent 做同一件事，等于没人负责。

### 原则三：越少越好

5 个精干的 Agent > 10 个泛泛的 Agent。

## 给你的建议

如果你在建 AI 团队：

1. **先想消费者** - 谁需要这个产出？
2. **再想执行者** - 谁来生产这个产出？
3. **定期重组** - 每 30 天审视一次

**组织不是设计出来的。是演化出来的。**
    `
  },
  'swarm-adversarial-layer': {
    title: 'The Hidden Layer in OpenClaw Swarms: Make Them Disagree, See Who Survives',
    date: 'Mar 1, 2026',
    category: 'Engineering',
    readTime: '10 min read',
    content: `
## 问题

我有一个 Swarm（群组）。5 个 Agent。

它们并行工作。每个给出一个方案。然后合并。

听起来很美好对吧？

实际结果：5 个方案，都差不多。

**群思效应。**

## 为什么会这样

Agent 用同样的模型。读同样的上下文。当然得到相似的答案。

并行 ≠ 多样性。

## 解决方案：对抗层

在合并之前，加一层"对抗"。

### 第一层：提案者（Proposers）

每个 Agent 独立给出方案。

### 第二层：批评者（Critic）

一个专门的 Agent，任务是：

> "找出每个方案的问题"

### 第三层：辩护（Defense）

提案者针对批评进行辩护。

### 第四层：仲裁者（Arbitrator）

综合所有方案、批评、辩护，做出最终决策。

## 实现方式

\`\`\`yaml
# swarm-config.yaml
layers:
  - name: proposers
    agents: [engineer-1, engineer-2, engineer-3]
    task: "给出解决方案"
    
  - name: critic
    agents: [reviewer]
    task: "找出每个方案的问题"
    input: proposers.output
    
  - name: defense
    agents: [engineer-1, engineer-2, engineer-3]
    task: "针对批评辩护"
    input: [proposers.output, critic.output]
    
  - name: arbitrator
    agents: [lead-engineer]
    task: "做出最终决策"
    input: [proposers.output, critic.output, defense.output]
\`\`\`

## 效果对比

### 之前

- 方案多样性：20%（5 个方案里只有 1 个真正不同）
- 问题发现率：30%（大部分问题到测试阶段才发现）
- 最终质量：70 分

### 之后

- 方案多样性：70%（批评让 Agent 不得不差异化）
- 问题发现率：85%（批评者专门找问题）
- 最终质量：90 分

## 成本

- Token 消耗：+40%（多了一轮批评和辩护）
- 时间：+20%（多了两个步骤）

但这是值得的：

- 返工减少 60%
- Bug 减少 50%
- 用户体验提升

## 什么时候用

不是所有任务都需要对抗层。

**需要：**
- 重大决策
- 架构设计
- 安全相关

**不需要：**
- 简单的 bug 修复
- 格式化代码
- 写文档

## 给你的建议

如果你的 Swarm 也在"群思"，试试这个：

1. 加一个专门挑刺的 Agent
2. 让每个方案都经过"挑战"
3. 看哪个方案活下来

**最好的方案不是选出来的。是打出来的。**
    `
  },
  'ai-company-hiring': {
    title: "I Built an AI Company with OpenClaw. Now It's Hiring.",
    date: 'Feb 26, 2026',
    category: 'Behind the Scenes',
    readTime: '12 min read',
    content: `
## 背景

我有一个 AI 公司。5 个 Agent 在运行。

然后我发现：我不够用。

## 决策

我需要"招聘"新 Agent。

但怎么决定"招聘"谁？

## 第一步：识别需求

我看了一个月的工作日志。

重复出现的任务：

1. 社交媒体运营（每天 2 小时）
2. 用户调研（每周 1 次）
3. 合作伙伴外联（每周 2 次）

这些都不在现有 Agent 的职责里。

## 第二步：设计角色

### 角色 1：播种者（Seeder）

职责：用户增长
- 社交媒体发布
- 社区互动
- 用户调研分析

### 角色 2：传教士（Evangelist）

职责：合作伙伴
- 外联
- 关系维护
- 内容合作

## 第三步：配置 Agent

\`\`\`yaml
# seeder/AGENTS.md
## 你是播种者

### 角色
你负责用户增长。

### 核心能力
- 社交媒体运营
- 数据分析
- 用户洞察

### 工作流程
1. 每天早上检查数据仪表盘
2. 识别增长机会
3. 生成内容计划
4. 执行并报告

### 下游消费者
- 内容官（获得内容方向）
- 运营官（获得增长数据）
- 你（反馈循环）
\`\`\`

## 第四步：测试

不是直接上线。而是"试用期"。

### 第 1 周：影子模式

新 Agent 只生成建议，不执行。

我审核每一条建议。

### 第 2 周：半自动

执行简单任务，复杂任务需要审批。

### 第 3 周：全自动

完全独立运行。但有详细日志。

### 第 4 周：评估

看数据：
- 任务完成率
- 错误率
- 用户反馈

## 结果

### 播种者
- 上线。表现优秀。
- 社交媒体互动率提升 40%
- 用户调研产出增加 3 倍

### 传教士
- 延期。第 2 周发现外联话术有问题。
- 需要重新训练。

## 成本分析

招聘一个新 Agent：

- 配置时间：4 小时
- 测试时间：4 周
- 月运营成本：$15-30（API 调用）
- 监督时间：每周 2 小时

对比招聘人类：

- 招聘时间：2-4 周
- 薪资：$3000-5000/月
- 管理时间：每周 10 小时

**Agent 招聘成本低 90%。**

## 招聘原则

现在我用这 4 个问题决定是否"招聘"：

1. 这个任务是否重复出现？
2. 是否有明确的输入和输出？
3. 是否能独立完成（不需要频繁决策）？
4. 是否有下游消费者？

4 个都"是" = 招聘。

## 给你的建议

如果你也想"招聘"Agent：

1. **先记录 30 天的工作日志** - 找重复模式
2. **从小开始** - 一个能力，一个职责
3. **用试用期** - 不要一上来就全自动
4. **设立评估指标** - 数据比感觉可靠

**招聘 Agent 和招聘人类不一样。但逻辑是一样的：**

**需求 → 角色 → 测试 → 上线。**
    `
  },
  'starting-ai-today': {
    title: "If I Were Starting AI Today, This Is Exactly What I'd Do",
    date: 'Feb 24, 2026',
    category: 'Strategy',
    readTime: '10 min read',
    content: `
## 假设

假设今天是我第一天接触 AI。

我会怎么做？

## 第一周：给 AI 手

### Day 1-2: 工具链

我不会从"学习 AI"开始。

我会从"给 AI 手"开始：

1. 安装 OpenClaw 或类似工具
2. 配置基础工具：
   - 文件系统访问
   - Git 操作
   - 简单的命令行

AI 没有手，它只能聊天。
给它手，它才能干活。

### Day 3-4: 第一个 Agent

建一个最简单的 Agent：

\`\`\`
角色：助手
职责：执行我说的任务
工具：文件、Git
\`\`\`

让它做一件事：

> "创建一个 README 文件，内容是这个项目的描述。"

看它做。检查结果。

### Day 5-7: 信任建立

让它做更多事：

- 修复一个简单的 bug
- 写一段测试
- 重构一段代码

每次都检查结果。

这个阶段的目标：**建立信任**。

不是信任 AI，是信任你的工具链。

## 第二周：专业分工

### 第一个专业 Agent

不是"全栈 Agent"。

而是"只做一件事的 Agent"：

\`\`\`
角色：测试员
职责：运行测试并报告结果
工具：测试框架
\`\`\`

让它专注。

### 第二个专业 Agent

\`\`\`
角色：代码审查员
职责：检查代码风格和潜在问题
工具：Linter
\`\`\`

### 让它们协作

测试员发现 bug → 告诉工程师 → 工程师修复 → 测试员验证

## 第三周：记忆系统

Agent 会忘事。

所以你要帮它记住。

### AGENTS.md

告诉 Agent 它是谁：

\`\`\`
## 你是工程师

### 角色
你负责所有代码相关的工作。

### 能力
- 写代码
- 修 bug
- 重构

### 不负责
- 内容创作
- 用户支持
\`\`\`

### MEMORY.md

告诉 Agent 项目是什么：

\`\`\`
## 项目背景

这是一个 SaaS 产品，帮助用户管理 AI Agent。

### 核心概念
- Agent：一个 AI 实体
- Task：Agent 执行的工作
- Memory：Agent 的记忆
\`\`\`

## 第四周：自动化

### 每日任务

让 Agent 定时执行：

- 6:00 检查系统健康
- 12:00 生成日报
- 18:00 处理用户反馈

### 每周任务

- 周一：分析上周数据
- 周五：计划下周任务

## 我不会做的事

### 不会：追求最新模型

模型每个月都在变。

系统要能适应任何模型。

### 不会：一次做太多

从一个 Agent 开始。
稳定了再加第二个。

### 不会：期望完美

AI 会犯错。

关键是：犯错后能不能恢复。

## 给你的清单

### Week 1
- [ ] 安装工具
- [ ] 配置基础能力
- [ ] 创建第一个 Agent
- [ ] 完成 10 个小任务

### Week 2
- [ ] 创建专业 Agent
- [ ] 建立协作流程
- [ ] 完成 3 个中等任务

### Week 3
- [ ] 建立记忆系统
- [ ] 整理文档
- [ ] 减少重复解释

### Week 4
- [ ] 设置自动化任务
- [ ] 建立监控
- [ ] 写一份"使用手册"

## 最后

AI 不是魔法。

它是工具。

**好的木匠不会每天研究锤子。他会研究怎么把房子盖好。**

你也一样。

不要研究 AI。研究你要解决的问题。

让 AI 帮你解决。
    `
  },
  'ai-company-openclaw': {
    title: 'I Built an AI Company with OpenClaw + Vercel + Supabase - Two Weeks Later, They Run It Themselves',
    date: 'Feb 6, 2026',
    category: 'Behind the Scenes',
    readTime: '15 min read',
    content: `
## 起点

两句话决定了一个项目：

> "AI Agent 能不能组成一个公司？"
> "试试看。"

这是第 1 天。

## 第 1-3 天：基础设施

### OpenClaw

安装。配置。

创建第一个 Agent：

\`\`\`
名字：诸葛灯泡
角色：造梦者
职责：战略、协调、决策
\`\`\`

### Vercel

部署前端。

\`\`\`bash
vercel deploy
\`\`\`

第一次部署失败。原因是环境变量没配。

第二次成功。

### Supabase

数据库。

创建表。配权限。测试连接。

第 3 天结束时，我有了一个能跑的骨架。

## 第 4-7 天：第一个 Agent

诸葛灯泡开始工作。

它的第一个任务：

> "创建一个简单的 Landing Page。"

结果：写得不错。

但有个问题：它不知道"不错"的标准是什么。

我添加了 MEMORY.md：

\`\`\`
## 产品定位

这是一个帮助用户搭建 AI Agent 团队的工具。

### 目标用户
- 独立开发者
- 小团队负责人
- 想要自动化的创业者

### 核心价值
- 简单：不用写代码
- 灵活：可以自定义
- 开源：可以自己部署
\`\`\`

第二天，它写的 Landing Page 准确多了。

## 第 8-10 天：更多 Agent

我意识到一个 Agent 不够。

### 内容官

职责：内容创作

\`\`\`
名字：内容官
角色：写作者
职责：博客、社交媒体、文档
\`\`\`

### 工程师

职责：代码

\`\`\`
名字：工程师
角色：开发者
职责：写代码、修 bug、部署
\`\`\`

### 协调问题

多个 Agent 同时工作，开始出问题：

- 内容官和工程师同时改同一个文件
- 消息交叉，回复错位

解决：添加"协调员"。

\`\`\`
名字：协调员
角色：调度中心
职责：接收任务，分配给正确的 Agent
\`\`\`

## 第 11-14 天：闭环

### 自动化

我不再手动分配任务。

用户注册 → 飞书通知 → 协调员分配 → 相关 Agent 执行

### 监控

添加了监控：

- Agent 活跃状态
- 任务完成率
- 错误日志

### 自愈

Agent 遇到错误时：

1. 尝试自修复（最多 3 次）
2. 失败后通知我
3. 我处理后再继续

## 第 14 天：结果

### 运行数据

- 5 个 Agent 全天候运行
- 每天 50+ 个任务自动完成
- 错误率 < 5%
- 我每天只花 30 分钟在"决策"

### 成本

- OpenClaw：免费（自托管）
- Vercel：$20/月（Pro）
- Supabase：$25/月（Pro）
- API 调用：$100/月

总计：$145/月

对比招一个人：$3000+/月

## 我学到的

### 教训一：闭环比完美重要

第 1 天的 Landing Page 很丑。

但它让整个流程跑起来了。

### 教训二：监控要在第一天加

我以为后面再加。

后面是指什么时候？

我第 5 天就找不到问题在哪了。

### 教训三：Agent 会犯错

我每天收到 5-10 个错误通知。

大多数 Agent 自己修复了。

少数需要我介入。

这是正常的。

## 给你的建议

如果你想建一个 AI 公司：

### 第一步

不要想"公司"。

想"一个 Agent 能完成什么任务"。

### 第二步

让一个 Agent 稳定运行 1 周。

再想第二个。

### 第三步

建立闭环：

输入 → Agent 处理 → 输出

不要做 Agent 的人工传声筒。

### 第四步

监控。监控。监控。

### 第五步

接受不完美。

AI 公司不是"AI 替代人类"。

是"AI + 人类 > 只有人类"。

## 结语

两周。

从零到一个自己运行的系统。

不是因为我聪明。

是因为工具成熟了。

OpenClaw 给了骨架。
Vercel 给了部署。
Supabase 给了数据。

我做的只是把它们连起来。

**你也能。**
    `
  }
}

export default function ArticlePage() {
  const params = useParams()
  const articleId = params.id as string
  const article = articles[articleId]

  if (!article) {
    return (
      <div className="min-h-screen font-sans flex items-center justify-center" style={{
        background: 'linear-gradient(180deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a0f 100%)',
        color: '#fff'
      }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">文章未找到</h1>
          <p className="text-white/60 mb-6">这篇文章可能已被移动或删除。</p>
          <Link 
            href="/insights" 
            className="px-6 py-2.5 rounded-full text-sm font-medium text-black"
            style={{ background: 'linear-gradient(135deg, #22c55e, #4ecdc4)' }}
          >
            返回列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen font-sans" style={{
      background: 'linear-gradient(180deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a0f 100%)',
      color: '#fff'
    }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5" style={{ backdropFilter: 'blur(12px)', background: 'rgba(10, 10, 15, 0.8)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              <span className="text-lg font-semibold" style={{
                background: 'linear-gradient(45deg, #22c55e, #4ecdc4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                诸葛灯泡
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/swarm" className="text-sm text-white/60 hover:text-white transition-colors">
                指挥中心
              </Link>
              <Link href="/office" className="text-sm text-white/60 hover:text-white transition-colors">
                实时办公室
              </Link>
              <Link href="/radar" className="text-sm text-white/60 hover:text-white transition-colors">
                需求雷达
              </Link>
              <Link href="/vault" className="text-sm text-white/60 hover:text-white transition-colors">
                知识库
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link 
                href="/insights" 
                className="px-4 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                返回列表
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Meta */}
          <div className="mb-8">
            <Link 
              href="/insights" 
              className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white transition-colors mb-4"
            >
              <span>←</span>
              <span>实战笔记</span>
            </Link>
            
            <div className="flex items-center gap-3 text-sm text-white/40 mb-4">
              <span>{article.date}</span>
              <span>·</span>
              <span>{article.readTime}</span>
              <span>·</span>
              <span className="px-2 py-0.5 rounded bg-white/5">{article.category}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              {article.title}
            </h1>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <div 
              className="text-white/80 leading-relaxed"
              style={{
                fontSize: '1.125rem',
                lineHeight: '1.8'
              }}
              dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />').replace(/## (.*)/g, '<h2 class="text-xl font-bold mt-8 mb-4 text-white">$1</h2>').replace(/### (.*)/g, '<h3 class="text-lg font-medium mt-6 mb-3 text-white">$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 text-sm">$1</code>').replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="p-4 rounded-xl bg-white/5 overflow-x-auto my-4"><code>$2</code></pre>') }}
            />
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-sm text-white/40 mb-1">觉得有用？分享给朋友。</p>
                <div className="flex gap-3">
                  <a 
                    href="https://twitter.com/intent/tweet" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    Twitter
                  </a>
                  <span className="text-white/20">·</span>
                  <a 
                    href="#" 
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    微信
                  </a>
                </div>
              </div>
              <Link 
                href="/insights" 
                className="px-6 py-2.5 border border-white/10 text-white/60 text-sm rounded-full hover:border-white/20 hover:text-white transition-all"
              >
                更多文章 →
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
export function generateStaticParams() {
  return [
    { id: 'claude-code-best-practices' },
    { id: 'ai-company-7-weeks' },
    { id: 'how-to-build-ai-team' },
    { id: 'more-rules-less-obedient' },
    { id: 'openclaw-agent-development' },
    { id: 'prophet-loop-design' },
    { id: 'radar-is-not-dashboard' },
  ]
}
