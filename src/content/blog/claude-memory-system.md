---
title: 从滚动便签到文件系统：Claude 记忆架构重构意味着什么
description: Anthropic 正为 Claude 测试双模记忆系统——Memory Files 结构化存储、Dreams 异步整合，以及永不下线的 Conway Agent。本文从技术架构与产品逻辑两个维度，拆解这次迄今最彻底的记忆系统重构。
pubDate: 2026-06-02
tags:
  - ai
  - claude
  - agent
  - architecture
  - memory
draft: false
---

> 写于 2026 年 6 月

---

2026 年，AI 助手的竞争焦点正在从「谁更聪明」转向「谁记得住」。

近期，AI 追踪平台 TestingCatalog 透露 Anthropic 正在为 Claude 测试一套全新的**双模记忆系统**：保留现有的「经典记忆」，同时引入基于文件的「Memory Files」。与之配合的还有异步整合机制 Dreams，以及一个 7×24 小时永不下线的 Agent 平台 Conway。

这不是简单的功能迭代。5 月 6 日，Anthropic 在旧金山举办首届 Code with Claude 开发者大会，正式将 Dreams 作为 Managed Agents 的 research preview 推出，并宣布 Outcomes 和多智能体编排（Multiagent Orchestration）进入 public beta。值得注意的是，这次大会 Anthropic 刻意没有发布新模型——所有弹药都打在了 Agent 基础设施上。

从架构角度看，这是 Claude 记忆系统自上线以来最彻底的一次重构——从「滚动摘要」走向「文件系统 + 异步维护」，背后是一条清晰的 Agent 基础设施演进路线。

---

## 一、经典记忆的天花板

Claude 目前的「经典记忆」模式，本质是一张不断滚动的便签纸：把你告诉它的所有信息压缩进一条摘要，每次对话时全量注入上下文窗口。

这个设计在信息量小的时候够用，但问题会随使用量增长快速暴露：

- **容量瓶颈**：摘要长度有限，旧信息被新信息覆盖，重要的讨论可能被琐碎的偏好挤出
- **检索效率低**：不管聊什么话题，都是全量灌入，大量无关记忆占据宝贵的上下文空间
- **用户控制力弱**：你只能看到一条摘要，无法按话题浏览、编辑或定向删除

从技术角度看，这本质上是**全量扫描 vs. 索引查询**的问题。当数据量小时，全量扫描够用；数据量一大，就必须引入结构化存储和按需检索。这是数据库 101 的教训，AI 记忆系统也没法绕过。

---

## 二、Memory Files：从便签到个人 Wiki

Memory Files 的核心思路：Claude 在聊天过程中，根据不同话题、项目或上下文，**自动编写并组织成结构化文档**。未来的对话涉及相关主题时，不再全量灌入，而是**选择性地读取对应文件**。

用一句话概括：**从「记忆压缩」走向「记忆检索」。**

这本质上就是 RAG（Retrieval-Augmented Generation）的思路——把记忆从上下文窗口里分离出来，存入外部文件系统，按需检索后注入。好处是显然的：

| 维度 | 经典记忆 | Memory Files |
|---|---|---|
| 容量 | 受摘要长度限制 | 理论上无限扩展 |
| 检索方式 | 全量注入上下文 | 按需检索相关文件 |
| 精准度 | 信息密度低，噪声多 | 只加载相关记忆，信噪比高 |
| 用户控制 | 只能看一条摘要 | 可浏览、编辑、删除任意文件 |
| Token 成本 | 每次对话都加载全部记忆 | 按需加载，成本与话题相关 |

**Token 成本这一点值得多说两句。** 上下文窗口是 AI 助手最贵的资源之一——每个 token 都要过一遍模型。全量注入意味着每次对话都在为所有历史记忆买单，无论是否相关。Memory Files 的按需检索，本质上是在做 token 层面的成本优化：只为当前对话需要的记忆付费。

在 Claude Code 中，Memory Files 的实现更具体：MEMORY.md 作为索引文件，启动时自动加载，但被严格控制在 200 行以内；具体话题的记忆独立存储为各自的 topic 文件，仅在相关时按需读取。这个 200 行的硬限制不是随意设定的——它是启动 token 成本和记忆覆盖面之间经过测试的平衡点。

当然，这种基于文件系统的记忆管理并非 Anthropic 首创。OpenClaw、Hermes 等长时运行的 AI Agent 早已在用类似架构。但 Anthropic 的优势在于把它做成了消费级产品的原生功能——用户不需要自己搭建，开箱即用。

---

## 三、Dreams：REM 睡眠的工程实现

如果说 Memory Files 是 Claude 的「海马体」（负责存储），那 Dreams 就是它的「REM 睡眠」（负责整合）。

Dreams 是一种**异步的后台记忆整合机制**，灵感来自人类神经科学中的快速眼动（REM）睡眠。当 Agent 在两次工作会话之间空闲时，Dreams 自动启动，对积累的记忆文件执行一轮深度整合：

- **合并重复项**：分散在不同文件中的同一话题信息被归拢到一起
- **绝对化时间戳**：「昨天决定用 Redis」被自动转换为「2026-03-15 决定用 Redis」，防止时间语义随时间流逝发生歧义
- **解决逻辑矛盾**：两条冲突记忆中，保留更新、更可靠的那一条；三周前从 Express 切换到 Fastify 后，旧条目会被自动删除
- **清理陈旧条目**：已删除文件的调试笔记等无效记忆会被裁剪
- **挖掘隐藏模式**：发现实时对话中人类和 AI 都没注意到的规律

**Dreams 已有正式的 API 规范。** 在技术层面，每次 dream 调用需要叠加两个 beta header：

```
anthropic-beta: managed-agents-2026-04-01,dreaming-2026-04-21
```

官方 SDK（Python、TypeScript、Go、C#、Java、PHP、Ruby）会自动设置这两个 header。调用接受两类输入：现有的 memory store 和最多 100 个历史 session ID，还支持最多 4096 字符的 `instructions` 字段用于聚焦整合方向，比如「重点关注代码风格偏好，忽略一次性调试笔记」。整合结果输出为一个全新的 memory store，原始 store 保持只读不变——你可以审查后再决定是否采用，整个过程是非破坏性的。

状态流转为：`pending` → `running` → `completed`（或 `failed` / `canceled`），全程可通过 API 轮询，也支持实时流式监听。

Dreams 并不适用于所有场景。Anthropic 明确指出：**Dreaming 只对反复执行同类任务的 Agent 有意义**——它整合的是跨会话的模式，一次性任务没有什么可整合的。

**企业反馈方面，数据已经相当亮眼。** 法律 AI 平台 Harvey 在为法律起草工作流启用 Dreaming 后，报告 Agent 任务完成率提升约 **6 倍**——此前 Claude 反复遗忘文件类型处理细节和工具特定的绕过方案，开启 Dreaming 后这些问题基本消失。医疗文档审核公司 Wisedocs 报告文档审核时间缩短了 **50%**。

当然，这两个数字需要注意背景：企业级场景（代码库维护、法律文档审查）的记忆模式和个人聊天场景差异很大，个人用户体验还有待更大规模的数据验证。

---

## 四、Outcomes 与多智能体编排：与 Dreams 同台亮相的基础设施

Dreams 不是孤立的发布。Code with Claude 大会同期推出了另外两项进入 public beta 的能力，共同构成 Managed Agents 的新层次。

**Outcomes** 是一套基于指标的任务评估框架。开发者编写一份描述成功标准的评分 rubric，Agent 以此为目标完成任务，再由一个独立的 grader 在隔离的上下文窗口中评估输出——grader 与 agent 的推理过程互不影响。根据 Anthropic 内部测试，Outcomes 将 docx 任务成功率提升了 8.4%，pptx 任务提升了 10.1%。

**多智能体编排（Multiagent Orchestration）** 允许一个协调 Agent 将工作分发给多达 20 个专职 subagent，最多支持 25 个并行线程。所有 Agent 共享同一沙盒、文件系统和凭据，但每个 Agent 运行在自己的 session thread 中——独立的上下文流，独立的对话历史。Netflix 已将多智能体编排部署到其平台团队，用于并行处理数百个构建管道的日志。

三个功能的定位非常清晰：Dreaming 解决跨会话的记忆质量问题，Outcomes 解决任务执行的质量评估问题，多智能体编排解决复杂任务的并行执行问题。三者叠加，才是完整的 Agent 生产基础设施。

---

## 五、Conway：永不下线的运行时

文件记忆和 Dreams 的推出，几乎可以确认是为 Anthropic 下一代产品 **Conway** 铺路。

Conway 是一个 7×24 小时常驻运行的 AI Agent 平台，3 月份从意外泄露的 51.2 万行 Claude Code 源码中首次曝光。它不是一个更智能的聊天窗口，而是一个**完全不同品类的产品**：

当前所有 AI 助手（Claude、ChatGPT、Gemini）都是被动式的——你输入提示词，它回复，对话结束。Conway 的设计目标是**常驻后台运行**，具备：

- **独立运行环境**：包含 Search、Chat、System 三个核心功能区
- **事件监听**：可以监听外部事件并主动触发任务
- **Webhook 接收**：通过 Webhook 接收外部信号并做出响应
- **浏览器操控**：集成浏览器自动化能力
- **Claude Code 运行**：直接调用 Claude Code 执行编程任务
- **扩展包机制**：支持「CNW ZIP」格式的自定义扩展

Conway 直接对标 OpenClaw，但安全模型完全不同：

| 维度 | OpenClaw | Conway |
|---|---|---|
| 运行环境 | 用户自建服务器 | Anthropic 托管云 |
| 安全记录 | 头两个月发现 9+ CVE，4.2 万暴露实例 | 原生集成，走 Claude 权限模型 |
| 扩展安装 | 开放式 | 必须显式安装 |
| Webhook | 无细粒度控制 | 逐服务开关 |
| 浏览器集成 | 社区实现 | 官方权限模型 |

**安全性是 Agent 平台的生死线。** 一个 7×24 小时在线、能操作浏览器和执行代码的 Agent，如果权限模型出问题，后果远比聊天助手严重。OpenClaw 早期暴露的安全问题已经证明了这一点。Conway 选择托管云 + 显式权限，是在安全性和灵活性之间做了一个更保守但更可靠的取舍。

与此同时，Managed Agents 也在朝同一方向演进：支持自托管沙盒（self-hosted sandboxes），工具执行可迁移至开发者自己控制的环境（Cloudflare、Daytona、Modal、Vercel 等），同时 Agent 循环的编排、上下文管理和错误恢复仍留在 Anthropic 基础设施上。这个混合模型是 Conway 安全设计思路的体现：边界明确，各司其职。

---

## 六、三者的战略闭环

把三个产品放在一起看，Anthropic 的战略意图就很清晰了：

```
Memory Files（存储）+ Dreams（维护）= Conway（永续运行）的基础设施
```

一个永不下线的 Agent，最需要什么？**持久、可靠、自维护的记忆系统。**

不是一条随时被覆盖的滚动摘要，而是一套可以无限扩展、按需检索、自动维护的文件系统。Memory Files 提供存储架构，Dreams 提供维护机制，Conway 提供运行时——三者叠加，形成了一个从**记忆 → 反思 → 行动**的完整闭环。

这也解释了为什么 Anthropic 选择在这个时间点推出 Memory Files：Conway 需要它。

---

## 七、行业对比：三条记忆路线

2026 年，AI 记忆已经成为三大巨头的核心战场，但路线截然不同：

| 路线 | 代表 | 核心策略 | 优势 | 风险 |
|---|---|---|---|---|
| 个人助理 | ChatGPT | Memory Sources：整合聊天历史、自定义指令、文件库、Gmail | 来源丰富，覆盖面广 | 依赖第三方数据源，整合复杂度高 |
| 生态打通 | Gemini | 深度连接 Gmail、Drive、Calendar | 基于真实生活数据，不需要用户主动输入 | 绑定 Google 生态，隐私争议大 |
| 文件系统 + 自主进化 | Claude | Memory Files + Dreams + Conway | 架构清晰，可扩展，安全可控 | 需要用户适应新的记忆交互模式 |

**ChatGPT 走的是「多源聚合」路线。** GPT-5.5 Instant 发布时同步更新了 Memory Sources，把记忆来源拆分为保存记忆、聊天历史、自定义指令、文件库甚至 Gmail 邮件。好处是数据来源广，坏处是整合复杂——不同来源的信息格式、时效性、可靠性参差不齐。

**Gemini 走的是「生态绑定」路线。** 凭借与 Gmail、Drive、Calendar 的深度打通，Gemini 的记忆不是来自对话，而是来自用户的真实生活数据。体验上可能最自然，但也意味着你要把更多个人数据交给 Google。

**Claude 走的是「文件系统 + 自主进化」路线。** 不依赖外部数据源，而是让 AI 自己建立结构化的知识库，并通过 Dreams 自主维护。这个路线最符合 Agent 的长期需求——一个自主运行的 Agent 需要的是自洽的内部知识系统，而不是对外部服务的依赖。

需要补充一个重要背景：在 Code with Claude 大会上，Dario Amodei 透露 Anthropic 的实际增速远超内部预期。公司原本为每年 10 倍增长做规划，实际 API 使用量却实现了年化 80 倍的增长——这解释了为什么 Anthropic 在基础设施层面的投入如此激进，包括与 SpaceX 达成的 22 万块 Nvidia GPU 算力合作协议。

---

## 八、个人观点

**持久记忆不是 AI 助手的锦上添花，而是 Agent 时代的基础设施。**

一个只能记住「当前对话」的 AI，永远只能做任务执行者。只有当它能跨会话、跨项目、跨时间维度积累和调用知识，才有可能成为真正的协作伙伴。

Dario Amodei 多次在公开场合表达过一个判断：ASI 不会是某一次突破的产物，而是一系列能力模块逐渐拼合的结果。推理、工具使用、代码执行、多模态感知……每一块都在加速就位。而**记忆，可能是其中最被低估的那一块。**

对开发者而言，这些变化已经开始影响日常工作流。Claude Code 的 `/dream` 命令已经在整理跨会话的项目记忆，Auto Dream 在后台默默合并重复的技术决策。当 Conway 上线后，一个能 7×24 小时监控代码库、自动处理 PR Review、主动发现安全问题的 Agent，将不再是科幻。

Dreams 的正式 API 规范也释放了一个信号：**这不是实验功能，而是生产级基础设施**。Harvey 6 倍任务完成率、Wisedocs 50% 效率提升，这些数字背后是真实的工作流改变，不是 demo 场景的数据。

当然，这一切的前提是**安全模型经得起考验**。一个永不下线、拥有持久记忆、能操作系统的 Agent，如果权限控制出问题，影响面远比今天的聊天助手大。Conway 的托管云方案是一个审慎的开局，但真正的考验在于：当用户开始安装第三方扩展、接入外部 Webhook、让 Agent 操作生产环境时，这个安全模型是否还能撑住。

这个问题的答案，将决定「永不下线的 AI」是下一个 iPhone 还是下一个 OpenClaw。

---

*参考来源：*
- *[TestingCatalog - Anthropic plans Claude memory update with new Memory Files](https://www.testingcatalog.com/anthropic-plans-claude-memory-update-with-new-memory-files/)*
- *[Anthropic 官方博客 - New in Claude Managed Agents: dreaming, outcomes, and multiagent orchestration](https://claude.com/blog/new-in-claude-managed-agents)*
- *[Anthropic Dreams API 文档](https://platform.claude.com/docs/en/managed-agents/dreams)*
- *[FelloAI - What Is Claude Dreaming?](https://felloai.com/what-is-claude-dreaming/)*
- *[VentureBeat - Anthropic introduces "dreaming"](https://venturebeat.com/technology/anthropic-introduces-dreaming-a-system-that-lets-ai-agents-learn-from-their-own-mistakes)*
