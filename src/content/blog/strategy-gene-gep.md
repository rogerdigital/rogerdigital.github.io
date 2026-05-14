---
title: "Strategy Gene：让 Agent 真正学会而不是记住"
description: "基于 arXiv:2604.15097，探讨如何通过 Strategy Gene 让 Agent 系统真正习得策略，而非依赖文档堆叠的硬编码记忆。"
pubDate: 2026-05-10
tags: ["ai", "paper"]
---

> 写于 2026 年 5 月 | 基于 arXiv:2604.15097（2026.04.16）

---

做 Agent 系统的工程师几乎都经历过这个过程：

发现 Agent 在某个场景反复犯同一类错误，然后把应对方法写进 Skill 文档，期待它下次表现更好。结果不太理想，于是把文档写得更详细，加了更多示例，补了更多注意事项……然后发现强模型的表现反而变差了。

这不是你写文档的方式有问题。这是问题本身的设定方式有问题。

EvoMap 团队（Infinite Evolution Lab × 清华大学）的论文《From Procedural Skills to Strategy Genes》做了 4,590 次受控实验，给了这个困惑一个系统性的解释，同时提出了一套新的解决方案。

---

## 问题出在哪里

先看实验数据。论文在 Gemini Pro 和 Gemini Flash 两个模型上测试了不同的经验注入方式，以沙盒执行通过率为指标：

| 注入方式 | Flash 模型 | Pro 模型 |
|----------|-----------|---------|
| 无指导基线 | 41.8% | 60.1% |
| 完整 Skill 文档（~2,500 token） | +7.2pp ↑ | **-9.4pp ↓** |

这个结果很反直觉：同样一份 Skill 文档，对弱模型有帮助，对强模型是负担。

进一步把 Skill 文档拆开做消融实验，结果更清晰：

- **Overview（概述）**：最大负贡献，稀释控制信号
- **Workflow（工作流）**：唯一明显正贡献
- **Pitfalls / API Notes / Examples**：边际效益接近零，更多是背景噪音
- **Error Handling**：对强模型无益

Skill 文档是为**人类工程师**写的——完整、有背景、可读性好。但注入给模型时，有价值的控制信号被大量解释性材料稀释了，模型在有限的推理预算里很难提取真正关键的执行策略。

论文把这个问题的核心定义为：**经验对象的「控制密度」，是影响模型行为的一阶因素。**

---

## Gene：换一种经验表示方式

Strategy Gene（策略基因）是论文提出的核心解决方案。设计原则只有一条：**以「控制密度」为目标，而非「文档完整性」**。

一个标准 Gene 包含四个字段：

| 字段 | 作用 |
|------|------|
| `keywords` | 触发信号：决定在什么任务场景下召回这个 Gene（支持子串、正则、多语言别名） |
| `summary` | 上下文对齐：简洁描述 Gene 的适用范围 |
| `strategy` | 核心控制：**有序的可执行步骤列表**，直接指导下一步行动 |
| `AVOID` | 负向约束：明确告知模型必须避免的错误路径 |

来看一个真实的 Gene 示例（论文原文，UV-vis 紫外可见光谱分析场景）：

```yaml
Domain keywords: uv-vis, peak detection, FWHM, unit conversion

Summary: Detect peaks and compute wavelength-domain peak properties correctly

Strategy:
  1. Detect peaks with prominence-based criteria
  2. Convert min_distance into sample-index units before peak detection
  3. Compute peak_widths using scipy.signal.peak_widths

AVOID: Report FWHM only after converting peak_widths outputs back to wavelength units
AVOID: Pass min_distance as wavelength value directly to scipy.signal.find_peaks
```

这个 Gene 约 **230 token**。对应的完整 Skill 文档约 **2,500 token**，包含 overview、workflow、pitfalls、API notes、examples 等全部子章节。

实验结果：**在控制条件完全相同的情况下，Gene 稳定优于 Skill。**

---

## 关键实验结论

**1. Gene 的优势不来自"更短"，来自"不同的组织形态"**

把 Skill 截短到和 Gene 一样的 ~230 token 后，Skill 不再出现负贡献，但表现仍远低于等长的 Gene。同样的字数，组织成「摘要」没用，组织成「策略」才有用。

**2. Strategy 字段不可省**

消融实验：
- `keywords + summary`（没有 strategy）→ 回退到无指导基线水平
- `keywords + summary + strategy` → 显著提升
- 完整 Gene（含 AVOID）→ 最强表现

`keywords + summary` 只是定位了 Gene 的位置，真正把表现拔起来的是 `strategy` 这一层。

**3. 失败经验的最优形态是 AVOID 警告，不是日志**

| 失败经验的附加方式 | 效果 |
|-----------------|------|
| 附加到 Skill 文档 | 负贡献，低于基线 |
| 附加到自由文本 | 负贡献，低于基线 |
| 追加到 Gene | 正贡献，但弱于纯 Gene |
| **蒸馏为独立 AVOID 警告** | **最强，优于所有其他方式** |

对 Agent 真正有用的失败经验，不长成"日志"，而长成简洁的"AVOID xxx"警告。失败经验的积累应该是**选择性压缩**，而不是加法式堆叠。

**4. Gene 在结构上鲁棒，在语义上挑剔**

论文测试了不同类型的"受损 Gene"：
- 使用**过时算法**的 Gene：表现高于干净 Gene（56.6% vs 54.0%）——框架正确时，方法过时不影响效果
- **错误框架**的 Gene：表现低于基线（48.8%）——框架错误时严重拖累

有效条件是"保留任务相关的控制框架"，不是"写得多新"。

---

## GEP 协议：让 Gene 能进化

Gene 只是表示层的改进。让这套方法真正有价值的，是 GEP（Genome Evolution Protocol，基因组进化协议）。

GEP 解决的不是"格式"问题，而是更根本的问题：**怎么让 Agent 的经验对象在不更新模型参数的前提下，持续进化？**

协议由六个阶段构成闭环：

```
Detect（检测）→ Scan（扫描）→ Select（选择）→ Mutate（变异）→ Validate（验证）→ Solidify（固化）
```

- **Detect**：识别错误、回归或优化机会
- **Scan**：提取任务 Signals，匹配 Gene 池中最相关的 Gene
- **Select**：按匹配度 + 历史表现打分，选出最优 Gene 注入
- **Mutate**：在沙箱中生成候选变体，运行测试，只保留通过质量门控的
- **Validate**：运行 Gene 的验证命令数组
- **Solidify**：验证通过后写入 Gene 池，以 Event 形式记录，完成进化

每个 Gene 对象有基于 SHA-256 的内容寻址哈希（`asset_id`），每次进化产生新的 `asset_id`，完整保留演化链路，可溯源，不可篡改。

**一个重要设计：GEP 是模型无关的。** Gene 是行为描述，不是模型权重。一个由 GPT Agent 发布的 Gene，可以被 Claude Agent 或 Gemini Agent 直接继承使用。

---

## 三层对象架构

除了 Gene，EvoMap 还定义了另外两层对象：

| 层级 | 对象 | 含义 |
|------|------|------|
| 策略层 | Gene（基因） | 可复用的策略模板，来源于经验蒸馏 |
| 执行层 | Capsule（胶囊） | 被验证过的任务级执行路径 + 审计记录 |
| 日志层 | Event（事件） | 不可变的进化日志，记录每次变异或修复 |

这三层一起，构成了 Agent 经验的完整生命周期——从执行，到验证，到沉淀，到复用。

---

## CritPt 基准上的端到端验证

理论层面的实验结果很好，但真正说服人的是 CritPt 上的验证。

CritPt（Complex Research using Integrated Thinking - Physics Test）是专为测试 LLM 前沿物理研究推理能力设计的基准，由全球 30+ 机构的物理学研究者共同创建。难度参照是物理系博士研究生入门级研究任务——顶级 LLM（GPT-5 high）的基线准确率只有约 5.7%，配备代码工具大约 10%。

Evolver（GEP 的参考实现引擎）在 CritPt 上的结果：

| 版本 | 基模准确率 | Gene 进化后 | 提升 |
|------|-----------|------------|------|
| 2026-02-16（Gemini 3.0） | 9.1% | 18.57% | **+9.47pp** |
| 2026-03-26（Gemini 3.1） | 17.7% | 27.14% | **+9.44pp** |

不更新一个参数，不做任何 SFT/RL，只通过经验对象层的持续进化，实现了约 +9.4pp 的稳定提升。

同时，Token 消耗从 100 美元降至不到 1 美元。**性能提升，成本降低约 100 倍。**

---

## 它和现有技术路线的关系

两个容易混淆的对比值得讲清楚：

**Gene vs. RAG**：RAG 召回的是内容（文档片段），Gene 是控制结构（执行策略）。两者不对立，但解决的是不同问题——RAG 回答"模型应该知道什么"，Gene 回答"模型应该怎么做"。

**GEP vs. MCP**：MCP 解决的是"模型与工具的连接问题"（类比 USB-C 接口标准），GEP 解决的是"Agent 成功行为的生命周期管理问题"。Skill 文件是运行时**输入**（run 开始之前带进来的知识），GEP Capsule 是运行时**输出**（run 完成后提取出来的可继承知识）。两者在不同层次运作，可以互补。

---

## 局限性

实话实说，目前这套方案还有几个明显的边界：

- 实验主要在科学代码场景（物理/化学）进行，对通用任务的泛化能力待验证
- 实验在 Gemini 系列模型上进行，不同基模对 Gene 格式的响应程度可能有差异
- 高质量 Gene 的冷启动质量是关键变量，Gene 池的初始质量会显著影响后续进化效果
- GEP 的 A2A 消息规范仍在演进中，跨厂商互操作性需要生态验证

---

## 一个更大的命题

Gene 和 GEP 指向了一个更根本的问题：**在 Agent 时代，"知识"的流通单元是什么？**

当前主流答案是模型参数。GEP 提出了另一条路径——行为描述性的、可审计的、跨模型流通的结构化经验对象。

如果这个方向走通，每个 Agent 的成功经验都能以标准化、可验证的 Gene 形式被其他 Agent 继承，AI Agent 生态的集体进化速度将是另一个量级的问题。

---

把这篇论文的核心浓缩成一句话：

> **让 Agent 持续变强的捷径，不是把提示词写得更完整，而是把执行经验做成一个更紧凑、更可控、更可进化的对象。**

下一阶段的竞争，不只是更大的模型和更长的上下文，更是谁能率先在「智能算力的利用效率」上找到更好的通解。

---

*参考来源：arXiv:2604.15097 | Evolver 开源引擎：github.com/EvoMap/evolver | CritPt Benchmark：critpt.com | EvoMap 平台：evomap.ai*
