---
title: "Harness Engineering：AI Agent 时代，真正该工程化的不是 Prompt，而是运行环境"
description: "从 Prompt Engineering、Context Engineering 到 Harness Engineering：为什么 AI Agent 需要约束、反馈循环和验证系统。"
date: 2026-05-10
tags: ["AI Agent", "Harness Engineering", "Context Engineering", "Agentic Coding", "Engineering"]
---

# Harness Engineering：AI Agent 时代，真正该工程化的不是 Prompt，而是运行环境

过去几年，AI 编程工具的演进速度很快。

2022 年之后，大家先学会了写 Prompt；2025 年左右，大家开始讨论 Context Engineering；到了 2026 年，一个新的词开始密集出现：**Harness Engineering**。

这个词第一次看起来有点抽象，但它背后的问题非常具体：

> 当 AI Agent 不再只是回答问题，而是开始持续修改代码、运行测试、修复 CI、提交 PR 时，我们到底应该工程化什么？

我的理解是：**Prompt Engineering 解决的是“怎么说”；Context Engineering 解决的是“让模型看到什么”；Harness Engineering 解决的是“怎样让 Agent 在一个可控环境里持续工作”。**

这篇文章会从三个角度梳理 Harness Engineering：

1. 它为什么会出现；
2. 它和 Prompt Engineering、Context Engineering 的区别；
3. 对个人开发者和小团队有什么实际价值。

---

## 1. 从 Prompt 到 Context：为什么还不够？

### Prompt Engineering：一次性交互的技巧

ChatGPT 刚出现时，最火的是 Prompt Engineering。

大家研究如何写更好的提示词：角色设定、Few-shot、Chain-of-Thought、任务拆解、输出格式约束。它的核心假设是：**只要我把话说清楚，模型就能给出更好的答案。**

这在单次问答里确实有效。

但它有一个明显天花板：Prompt 本质上是一次性交互。模型这次答错了，下次并不会天然记住这个错误。你可以把 Prompt 写得越来越长，但这依然是在试图“说服模型表现得更好”，而不是在构建一个稳定系统。

换句话说，Prompt Engineering 更像沟通技巧，不是工程系统。

### Context Engineering：让模型看到正确的信息

后来大家意识到，只优化 Prompt 不够。模型之所以出错，很多时候不是因为指令写得差，而是因为它没有看到必要信息。

于是 Context Engineering 开始变重要。

它关注的是：在模型做决策前，如何动态构造上下文窗口。比如：

- 当前相关的代码文件；
- 项目文档；
- 历史对话；
- 数据库 schema；
- 工具定义；
- RAG 检索结果；
- 当前任务状态。

这解决了一个关键问题：**模型不知道该看什么。**

但当 Agent 开始执行更长任务时，新问题出现了：

> 就算模型看到了足够多的信息，它仍然会重复犯错。

比如：

- 明明只让它改一个模块，它会顺手改一堆无关文件；
- CI 失败后，它会在同一个 lint 错误上反复尝试；
- 跑了很久之后，它会忘掉最初目标；
- 它会写出看似合理、但无法长期维护的代码。

这类问题不是“缺信息”，而是“缺约束、缺反馈、缺停止条件”。

这就是 Harness Engineering 出现的背景。

---

## 2. Harness Engineering 到底是什么？

我更愿意把 Harness Engineering 翻译成：**Agent 运行环境工程**。

它不是一个单独工具，也不是一种新的 Prompt 技巧，而是一套围绕 Agent 构建的工程系统。

一句话定义：

> Harness Engineering 是在 AI Agent 外部构建约束、工具链、反馈循环、验证机制和运行边界，让 Agent 能稳定完成多步任务的工程方法。

这里的 Harness 可以理解成“马具”。模型本身像马，有力量；但如果没有马具，力量很难稳定地拉动车。Harness 的作用不是让马变强，而是让它的力量可控、可复用、可验证。

放到 AI Agent 场景里，Harness 包括：

- `AGENTS.md` / `CLAUDE.md` 这类项目规则文件；
- 自定义 linter；
- 测试与 CI；
- 自动化脚本；
- 工具调用权限边界；
- 任务分解与状态管理；
- 失败重试策略；
- 人工介入触发条件；
- 多 Agent 协作结构。

它的核心思想不是“让模型听话”，而是：

> 不要指望 Agent 下次自动变聪明。把它犯过的错变成系统规则，让同类错误以后更难发生。

这是 Harness Engineering 和 Prompt Engineering 最大的区别。

---

## 3. 为什么这个概念在 2026 年突然变重要？

Harness Engineering 不是凭空出现的概念，它是被 Agentic Coding 的实践逼出来的。

### Mitchell Hashimoto 的个人实践

Mitchell Hashimoto 在文章中描述过一个很有代表性的习惯：当 Agent 犯错时，他不是单纯修改提示词，而是修改环境本身。

比如：

- 更新 `AGENTS.md`；
- 增加脚本；
- 增加 linter；
- 增加检查工具；
- 让 Agent 能自己验证修改结果。

这个动作的本质是：**把一次错误沉淀成系统改进。**

这对个人开发者尤其有价值。因为它不要求你一开始就搭一个复杂平台，只需要在每次 Agent 犯错后，追问一句：

> 我能不能加一个机制，让这个错误下次更难发生？

### OpenAI 的 Codex 实践

OpenAI 工程团队在 2026 年发布过一篇关于 Harness Engineering 的文章，里面提到一个非常激进的实验：一个小团队从空仓库开始，依靠 Codex 生成了大量生产代码和 PR。

但我觉得真正有价值的不是“AI 写了多少代码”，而是他们总结出的工程规则：

1. 仓库是 Agent 的唯一知识来源；
2. 代码不仅要对人类可读，也要对 Agent 可读；
3. 架构约束不靠 Prompt，而靠 linter；
4. Agent 自主性要逐步放开；
5. 如果一个 PR 需要人类大改才能合并，问题不只在 Agent，也在 Harness。

这几个原则说明了一件事：AI 编程进入 Agent 阶段后，工程师的工作重心会发生变化。

以前是直接写代码；现在越来越像是在设计：

- 环境；
- 规则；
- 验证链路；
- 反馈循环；
- 失败恢复机制。

也就是：少写一次性指令，多写可重复执行的系统约束。

### Stripe、Anthropic 等团队的实践

Stripe 的内部 Agent 系统 Minions 体现了另一种方向：大规模无人值守 Agent。它的重点不是让 Agent 无限自由，而是把流程拆成确定性节点和 Agentic 节点。

确定性节点负责稳定动作，比如运行 linter、推送代码；Agentic 节点负责需要模型判断的部分，比如实现功能、修复 CI。

这里有一个很实用的原则：**CI 不允许无限重试。**失败后可以自动修一次，再失败就交给人类。

Anthropic 的实践则强调多 Agent 分工和 Context Reset。

他们的一个核心判断是：模型不可靠地评估自己的工作。因此规划、生成、评估最好由不同角色承担。另一个经验是，当上下文接近饱和时，与其压缩上下文，不如用结构化交接文档启动一个新的干净 Agent。

这些实践虽然形态不同，但共识是一致的：

> Agent 要稳定工作，不能只靠模型能力，必须靠外部系统设计。

---

## 4. Harness Engineering 和 Agent Framework 有什么区别？

这两个概念很容易混淆。

Agent Framework 关注的是：**怎样让 Agent 拥有能力。**

比如：

- 工具调用；
- 多 Agent 编排；
- 状态机；
- memory；
- planner；
- workflow。

Harness Engineering 关注的是：**怎样让 Agent 在真实工程环境里可靠工作。**

比如：

- 它能不能被约束在正确目录里；
- 它改完代码后有没有自动验证；
- 它失败几次后应该停止；
- 它是否知道哪些操作不能做；
- 它是否能把错误转化为长期规则；
- 它是否能在上下文丢失后恢复任务状态。

一个简单类比：

> Agent Framework 提供肌肉，Harness Engineering 提供骨架、护栏和反馈神经。

所以 Cursor、Claude Code、Codex 这类产品本身不一定等于 Harness。它们内部让长任务稳定运行的规划、验证、恢复、限制机制，才是 Harness 的部分。

---

## 5. 对个人开发者有什么实际意义？

如果只看 OpenAI、Stripe、Anthropic 的案例，Harness Engineering 容易显得很“企业级”。但我反而认为，它对个人开发者更重要。

因为个人开发者最缺的不是想法，而是稳定执行力。

尤其是在做开源项目、个人产品、技术博客、自动化工作流时，AI Agent 很适合承担大量重复任务：

- 修复 lint；
- 补测试；
- 写 changelog；
- 跟进 PR 状态；
- 生成发布说明；
- 整理贡献记录；
- 把 issue 转成任务；
- 把技术调研转成博客草稿。

但如果每次都靠临时对话驱动 Agent，效率会很不稳定。真正能积累复利的是：把这些流程逐步沉淀成仓库规则、脚本和自动化检查。

对个人开发者来说，可以从三个最小动作开始。

### 1. 给项目加一个 `AGENTS.md`

这个文件不需要一开始很复杂。可以先写清楚：

```md
# AGENTS.md

## Project Rules

- Do not modify unrelated files.
- Run tests before final response.
- Keep changes small and reviewable.
- Prefer existing patterns over introducing new abstractions.
- If CI fails twice, stop and report the failure instead of guessing.

## Architecture Constraints

- Frontend code lives in `src/`.
- Shared utilities live in `src/lib/`.
- Do not add dependencies without explaining why.

## Verification

- Run `npm run lint` after code changes.
- Run `npm test` when business logic changes.
```

这个文件的意义不是“写给人看”，而是让 Agent 每次进入项目时有稳定的行为边界。

### 2. 把最常见错误变成检查规则

如果 Agent 经常犯同一种错误，不要只在对话里反复提醒。

更好的方式是把它固化成：

- eslint rule；
- TypeScript 类型约束；
- pre-commit hook；
- CI check；
- shell script；
- 单元测试。

Prompt 是提醒，linter 是制度。

### 3. 设计停止条件

很多 Agent 任务失败，不是因为第一次做错，而是因为它会在错误路径上无限消耗。

所以要明确写出停止条件：

- CI 最多修复两轮；
- 连续两次测试失败就停止；
- 遇到权限、依赖、外部 API 问题时不要猜；
- 修改超过 N 个文件时先汇报；
- 不确定需求时先输出方案，不直接改代码。

这类规则看起来普通，但它们是 Agent 稳定运行的关键。

---

## 6. 我对 Harness Engineering 的判断

我认为 Harness Engineering 会成为 AI-native 开发者必须理解的工程范式。

原因很简单：模型能力会继续提升，但模型越强，越需要边界。

弱模型的问题是做不了事；强 Agent 的问题是能做太多事。它可以改代码、删文件、运行命令、调用 API、提交 PR。此时真正重要的不是“它会不会做”，而是：

- 它是否只做该做的事；
- 它是否知道什么时候停；
- 它是否能验证自己；
- 它是否能把失败沉淀成系统改进；
- 它是否能在长期项目中保持一致性。

这也是为什么我觉得 Harness Engineering 比单纯的 Prompt 技巧更值得投入。

Prompt 技巧会随着模型升级快速贬值，但工程约束、测试体系、CI、文档结构、工具链设计，这些会持续产生复利。

---

## 7. 一个可以直接照着做的起步清单

如果现在要在个人项目里开始实践，我会按这个顺序做：

### P0：马上做

- 新建 `AGENTS.md` 或 `CLAUDE.md`；
- 写清楚项目结构、禁止操作、验证命令；
- 把常见 Agent 错误写进规则；
- 确保项目有一键 lint / test 命令；
- 要求 Agent 每次修改后运行验证命令。

### P1：一周内做

- 为常见错误增加自动检查；
- 配置 pre-commit 或 CI；
- 让 PR 模板包含 Agent 修改说明；
- 增加 changelog 生成规则；
- 明确“失败几次后停止”。

### P2：项目变复杂后再做

- 拆分规划 Agent、实现 Agent、评估 Agent；
- 引入工作流编排工具；
- 设计任务状态持久化；
- 做 Context Reset / 交接文档；
- 对高风险操作增加人工审批。

不需要一开始就追求复杂架构。对个人开发者来说，最有效的路径通常是：

> 先用一个 Agent，把环境规则做扎实。

---

## 结语：未来的工程师，可能首先是环境设计者

AI Agent 让“写代码”这件事变得越来越自动化，但它并不会让工程消失。

相反，工程的重要性会转移到更上层：

- 设计约束；
- 设计反馈；
- 设计验证；
- 设计权限；
- 设计协作边界；
- 设计长期可维护性。

这就是 Harness Engineering 的价值。

它提醒我们：在 Agent 时代，真正重要的不是每次都写出更聪明的 Prompt，而是构建一个让 Agent 持续变可靠的环境。

我对这个方向的判断是：**未来优秀的 AI-native 工程师，不只是会使用 Agent 的人，而是能为 Agent 设计运行系统的人。**

---

## 参考与延伸阅读

- Mitchell Hashimoto: *My AI Adoption Journey*
- OpenAI Engineering Blog: *Harness Engineering: Leveraging Codex in an Agent-First World*
- Anthropic Engineering Blog: Agent engineering and long-running coding agents related posts
- Stripe Engineering: *Stripe's Minions*
- Martin Fowler / Birgitta Böckeler: *Harness Engineering*
- LangChain Blog: *The Anatomy of an Agent Harness*
- arXiv: Natural-Language Agent Harnesses related research
