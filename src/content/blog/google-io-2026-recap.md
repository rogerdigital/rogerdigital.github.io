# Google I/O 2026 全面回顾：从 AI 助手到 AI Agent，开发者的新纪元

> **发布日期：** 2026 年 5 月 20 日  
> **作者：** Roger  
> **活动时间：** 2026 年 5 月 19–20 日，Shoreline Amphitheatre，Mountain View, CA

---

一年一度的 Google I/O 刚刚落幕，和往年一样，我把整个 Keynote 一字不落地看完了。如果用一句话概括今年的主题，那就是：**Google 正式宣告 AI Agent 时代的到来**。

不是「AI 辅助开发」，而是 AI 主导、人类监督。这个方向上，今年的 I/O 比我预期的更激进，也更务实。下面我按照主题拆开来聊。

---

## 一、模型层：Gemini 3.5 系列正式登场

### Gemini 3.5 Flash

今年最核心的模型发布是 **Gemini 3.5 Flash**。这个版本的定位非常清晰：在编码、Agent 任务和多模态 benchmark 上全面超越 Gemini 3.1 Pro，同时继承 Flash 系列的速度和成本优势——官方给出的数据是**比其他前沿模型快 4 倍**（output tokens/s）。

从开发者的角度来看，这个组合很有吸引力：不再需要在「性能」和「速度」之间做取舍。它已今日起在 Gemini App、Search、Antigravity 2.0 以及 Gemini API 全面铺开。

### Gemini 3.5 Pro

Pro 版本目前仍在测试中，预计下个月放出。按照发布节奏判断，3.5 Pro 很可能是为更复杂的推理和长上下文场景设计的旗舰版本。值得关注。

### Gemini Omni：推理 × 创作的融合

**Gemini Omni** 是一个全新的模型系列，这次的定位是「理解 + 生成」的统一体。Omni Flash 支持图像、音频、视频和文本的输入，直接输出视频内容，并且可以基于真实世界知识做内容接地（grounding）和后续编辑。

简单说：你给它一个问题或场景，它可以直接给你生成一段视频回答——而且这个视频不是乱编的，是带有知识依据的。这个能力已经接入了 Gemini App、Google Flow 和 YouTube Shorts。

**个人评价：** Gemini Omni 是我今年最感兴趣的模型产品之一。多模态"理解"一直是 Gemini 的强项，这次把"生成"也拉通了，从 API 调用者的角度看，统一接口意味着更简洁的系统设计。

---

## 二、开发者工具层：Antigravity 2.0 —— Agent 的基础设施

去年的 Antigravity（Google 对标 Cursor 的 AI coding 工具）今年完成了一次架构级升级。

### Antigravity 2.0 Desktop App

2.0 是一个**全新的独立桌面应用**，和原有的 Antigravity IDE 分离，专门为 Agent 编排设计。主要能力：

- **多 Agent 并行编排**：可以同时启动多个专用 subagent，并行处理复杂工作流
- **后台任务调度**：支持定时/触发式的自动化任务
- **原生集成 Google AI Studio、Android Studio、Firebase**
- **内置语音命令支持**
- **跨平台终端沙箱 + Credential 掩码 + Git 策略加固**（安全性显著增强）

### Antigravity CLI

面向喜欢命令行的开发者，Google 发布了 **Antigravity CLI**，完全取代之前的 Gemini CLI。它与 Antigravity 2.0 共用同一个 agent harness，这意味着未来 Antigravity 的所有改进都会自动同步到 CLI。

原 Gemini CLI 的核心功能（Agent Skills、Hooks、Subagents、Extensions）全部保留迁移，Extensions 更名为 Antigravity Plugins。

### Antigravity SDK

面向想要自定义 Agent 行为并部署在自有基础设施上的工程团队，Google 开放了 **Antigravity SDK**。这给企业级用户提供了更大的控制权，不再强绑 Google 的托管环境。

### Managed Agents in Gemini API

对于不想自己搭基础设施的开发者，Gemini API 现在提供 **Managed Agents**：一个 API 调用即可获得一个完整的 Agent 实例，带有远程沙箱，免去所有基础设施配置。

**个人评价：** 这一套 Antigravity 生态是我认为今年开发者侧最值得关注的发布。Google 把 AI 编码工具从「辅助写代码」推进到了「自主完成复杂工作流」的层次，而且同时提供了 Desktop、CLI、SDK、Managed API 四个入口，覆盖不同团队的不同需求。架构上的清晰度让我印象深刻。

---

## 三、AI Studio：从原型到生产的全链路

**Google AI Studio** 也迎来了多项重要更新：

- **原生 Kotlin 支持**："Vibe coding" Android 应用，从 Prompt 到 Android App
- **一键 Deploy 到 Cloud Run**，Firebase 服务集成
- **Google Workspace 集成**
- **一键导出整个项目状态到 Antigravity**，无缝衔接本地开发
- **AI Studio 移动端 App** 正式发布，支持直接在移动端生成 Android 应用并发布到 Google Play Console 测试轨道

这条链路让「Prompt → 原型 → 生产部署」可以完全在 Google 生态内完成，摩擦成本大幅降低。

---

## 四、Android 开发工具：Migration Agent + Android Bench

### Android CLI & Skills

**Android CLI** 稳定版发布，让 AI Agent 可以直接调用 Android Studio 的核心能力：下载 SDK、在真机/模拟器上运行 App 等。同时开源了一批 **Android Skills**，帮助 LLM 执行最佳实践，覆盖：Jetpack Compose 迁移、Jetpack Navigation 3 迁移等复杂场景。

### Migration Agent（预览）

这个功能让我眼前一亮：**Migration Agent** 可以将现有代码（无论是 React Native、Web Framework 还是 iOS）自动迁移为原生 Kotlin Android App。Google 声称原本需要数周的迁移工作，现在可以压缩到数小时。

这是个大胆的承诺，我持谨慎乐观态度——实际效果很大程度上取决于源码复杂度，但方向无疑是正确的。

### Android Bench

Google 建立了专门针对 Android 开发任务的 **LLM 排行榜**，这次新增了 Gemma 4 等开源模型。对于需要在技术选型时评估不同 LLM Android 开发能力的团队来说，这是个实用参考。

---

## 五、Web 开发：WebMCP 和 Modern Web Guidance

### WebMCP

**WebMCP** 是今年 Web 侧最具前瞻性的提案。这是一个开放 Web 标准草案，允许开发者将网页中的 JavaScript 函数、HTML 表单等结构化工具暴露给浏览器内的 AI Agent，使其能以更高的精度、速度和可靠性执行复杂任务。

Chrome 149 的 Origin Trial 今日开启，Gemini in Chrome 的支持也即将到来。

**个人评价：** 如果 WebMCP 成为标准，Web 开发的范式会发生根本变化——页面不再只是给人看的，还需要为 AI Agent 提供标准化的"可操作接口"。这会催生新的设计原则和新的前端工程实践。值得持续跟进。

### Modern Web Guidance

面向 AI coding agent 的 **Modern Web Guidance** 提供了超过 100 个专家审核的 Web 开发最佳实践 Skill，集成了 Baseline 兼容性数据，支持一行命令安装：

```bash
npx modern-web-guidance install
```

### Chrome DevTools for Agents

将 Chrome DevTools 的调试能力开放给 AI Agent：自动化质量审计、真实用户体验模拟、自动连接 debug session 等，实现无人值守的代码优化循环。

### HTML-in-Canvas API

新的 **HTML-in-Canvas API**（Origin Trial）允许开发者将真实 DOM 元素嵌入 WebGL/WebGPU canvas，构建同时具备 3D 沉浸感、SEO 可索引性、无障碍可访问性和 DOM 可交互性的 Web 体验。这是个很有意思的技术突破。

---

## 六、消费端产品：Gemini 无处不在

### Gemini Spark —— 个人 AI Agent

**Gemini Spark** 是今年消费端最重要的产品发布之一。定位是「你的个人 AI Agent」，可以主动代表你执行操作、管理你的数字生活。

- 集成 Gmail、Docs、Calendar、Tasks，扩展至第三方工具（通过 MCP）
- **Daily Brief**：每日摘要，扫描你的 Gmail、Calendar 和 Tasks，按优先级整理并给出下一步建议
- 首先向美国 Google AI Ultra 订阅用户开放

从功能设计看，Gemini Spark 的野心是成为 OS 级别的个人助理，而不只是聊天机器人。

### Google Search：搜索变成 AI 函数

Google Search 做出了我认为是产品史上最重大的范式转变之一：**搜索从文本输入变成 AI 执行函数**。

结合 Gemini Spark，你的搜索查询可以是 Agentic 的——不只是给你一个当时的答案快照，而是可以在未来继续跟踪更新。同时 Search 会直接生成定制化的动态 UI 作为回答界面。

### Google Shopping：Universal Cart

Google 推出了**跨平台购物车**：从多个平台添加商品，AI 追踪价格历史、建议替代品（兼容性检测）、推荐最优支付方式，并由 Gemini 直接完成结账。配合一个通用的跨店 Profile，这个体验如果做好了会非常流畅。

### Google Workspace 更新

- **Docs Live**：对话式 AI 实时文档创建和编辑
- **Google Pics**：AI 图像生成和设计工具（类 Canva）
- **Google Keep**：AI 将自由笔记整理成结构化笔记
- **Gmail/Docs**：新增语音功能

### YouTube

- **Ask YouTube**：处理复杂搜索和追问，在 YouTube 全库中找到最相关视频并给出结构化交互式回答（YouTube Premium 用户，美区，youtube.com/new）
- **YouTube Shorts Remix + Create App**：集成 Gemini Omni，AI 视频生成/混剪

---

## 七、硬件：Android XR 智能眼镜

今年 Keynote 上硬件部分相对克制，但 **Android XR 智能眼镜**的官方确认还是引发了现场热情。

核心信息：
- 定位为"音频眼镜"（Audio Glasses），今秋发布
- 硬件由 **Samsung + Qualcomm** 打造，外观设计由 **Gentle Monster 和 Warby Parker** 负责
- 同时支持 Android 和 iPhone 配对
- 内置 Gemini，支持语音交互和 Agentic 操作（如：用眼镜直接下咖啡订单）
- 带显示屏的型号将支持 Create My Widget，具体时间表待定
- 与 Nano Banana（Android 17 代号）生态打通

另外，Samsung 和 Google 合作的 **Project Aura**（XR 头显）在 Keynote 没有正式登台，预计会在展区展示。

---

## 八、安全与 AI for Science

### Code Mender

Google 推出了 **Code Mender**，一个通过 Agent Platform 提供的 AI 安全 Agent，专门用于自动发现并修复代码库中的安全漏洞。目前处于邀请测试阶段。安全工具的 AI 化是个高价值方向，值得关注进展。

### Gemini for Science

Demis Hassabis 上台介绍了 **Gemini for Science**：将多种强大 AI 工具汇聚，加速科学研究。包括用 Gemini 模拟细胞行为以发现新疗法，以及完整的地球系统模拟（用于气象学和长期天气预测）。

---

## 九、我的整体评价

**Google 今年做对了什么？**

架构层面的清晰度是这次 I/O 给我留下最深印象的地方。Antigravity 生态（Desktop + CLI + SDK + Managed API）、Gemini 模型系列（Flash / Pro / Omni）、消费端（Spark / Docs / Search）——每一层的定位都很清晰，层与层之间的接口设计也是有意为之的。这说明 Google 内部至少在"如何把 AI 融入整个产品体系"这件事上想清楚了。

**哪里还有疑问？**

WebMCP 和 HTML-in-Canvas 这类 Web 标准提案的落地，高度依赖整个社区的跟进，Google 单方面推进不了；Migration Agent 的实际迁移质量还需要在生产环境中验证；Gemini Spark 的"个人 Agent"定位与隐私边界之间的张力也会是持续的议题。

**对开发者的行动建议：**

1. 立即评估 **Antigravity CLI**，尤其是原 Gemini CLI 用户——迁移路径已经铺好了
2. 关注 **WebMCP Origin Trial**，思考你的 Web 产品如何为 AI Agent 提供结构化接口
3. Android 团队可以开始实验 **Android CLI + Skills**，特别是 Jetpack Compose 迁移场景
4. **Gemini 3.5 Flash** 现在就可以接入 API，速度和性能的组合对大多数 Agentic 应用来说是目前的最优解

---

Google I/O 2026 标志着一个转折点：AI 工具链从"辅助人类"到"自主执行"的角色迁移已经不是概念，而是产品。作为开发者，我们现在面临的问题不再是"该不该用 AI"，而是"如何设计系统，让 AI Agent 成为可靠的协作者"。

这个问题比上一个问题难，也更有趣。

---

*以上内容基于 Google I/O 2026 主 Keynote（2026/05/19）及开发者 Keynote 的公开信息整理，部分产品功能仍处于 Preview 或 Origin Trial 阶段，实际发布时间以 Google 官方为准。*

*参考来源：[Google Developers Blog](https://developers.googleblog.com)、[9to5Google](https://9to5google.com)、[TechCrunch](https://techcrunch.com)、[Google Cloud Blog](https://cloud.google.com/blog)*
