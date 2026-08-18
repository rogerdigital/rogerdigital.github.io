---
title: "让 Agent 拥有自己的搜索能力：用 DSH 与 SearXNG 构建可自托管 Web Search"
description: "当 Agent 需要实时信息时，如何避免绑定单一商业搜索 API？本文以 dsh-searxng 为例，拆解可替换的搜索 Provider、自托管部署、错误边界与验证方法。"
pubDate: 2026-08-18
tags: ["ai", "agent", "search", "open-source"]
draft: false
---

> 写于 2026 年 8 月 | 基于 dsh-searxng 0.1.1

---

Agent 可以在模型已有知识里推理，却无法仅靠这些知识可靠回答「今天发布了什么」「这个依赖当前版本是多少」「某个网页现在写了什么」。一旦任务涉及动态信息，搜索就不再是锦上添花，而是基础能力。

最直接的实现，是在 Agent 里接入一个商业搜索 API：申请密钥、定义一个 `web_search` 工具、把返回结果塞进上下文。这条路径能很快跑通，但也把工具协议、供应商、计费方式和结果格式绑在了一起。以后想换搜索后端，就得重新改工具甚至 Agent 工作流。

我更希望 Agent 依赖的是一种稳定的**搜索能力**，而不是某一家搜索服务。上层只关心「用什么查询词搜索」和「拿到了哪些可引用来源」，底层可以是商业 API，也可以是自己控制的 SearXNG 实例。

`dsh-searxng` 就是沿着这个边界设计的：它不为 Agent 再造一个搜索工具，而是把 SearXNG 注册成 DeepSeek Harness（DSH）已有 Web 能力的一种 Provider。

---

## 当 Agent 需要实时信息

搜索对 Agent 的价值，不只是补足模型的知识截止时间。它至少承担三类工作：

- **获取动态事实**：版本、公告、价格、状态和近期事件
- **定位一手资料**：官方文档、源码、论文和发布记录
- **提供可追溯来源**：让结论能够被复核，而不只是听起来合理

但搜索本身并不等于事实。搜索后端返回的是候选来源，Agent 仍要判断来源质量、阅读正文、比较证据，再形成结论。因此，一个合适的搜索接口应该输出结构清楚的来源列表，而不是假装直接给出唯一答案。

这也是为什么我没有让插件生成摘要或拼装长文本。SearXNG 负责检索，插件负责把结果转换成 DSH 能理解的来源结构；后续阅读、引用和推理仍由上层工作流决定。

---

## 不要把搜索供应商写进 Agent

如果 Agent 直接调用某个供应商，通常会形成这样的依赖：

```text
Agent → 供应商专用工具 → 搜索 API
```

工具参数、密钥、错误码和返回字段都属于这家供应商。替换它，意味着重新修改 Agent 看得见的接口。

DSH 在中间提供了一层 Web capability seam。Agent 始终调用统一的 `web_search`，具体搜索服务通过 Provider 注册进去：

```text
Agent → web_search → DSH Web seam → Search Provider → 搜索服务
```

接入 SearXNG 后，实际链路是：

```text
Agent
  ↓ web_search
DSH Web seam
  ↓ WebSearchProvider
dsh-searxng
  ↓ GET /search?format=json
SearXNG
  ↓ 标准化 sources
Agent
```

这个设计的关键不是多了一层抽象，而是**稳定边界终于有了明确归属**：

- Agent 只依赖 `web_search`
- DSH Web seam 负责 Provider 选择和结果数量上限
- `dsh-searxng` 负责请求 SearXNG、转换结果和报告后端错误
- SearXNG 负责实际检索哪些搜索引擎

未来增加其他 Provider 时，Agent 不需要学习一套新工具；切换搜索后端也不需要改写任务提示词。

---

## 真正的工程难点不是发送 HTTP 请求

从表面看，这个插件只是请求一个 JSON 接口：

```http
GET /search?q=deepseek+harness&format=json
```

真正容易出问题的，是请求前后的边界处理。

### 1. 部署地址不能靠字符串拼接

SearXNG 既可能部署在根路径：

```text
http://127.0.0.1:8080/
```

也可能位于反向代理的子路径：

```text
https://example.com/searxng/
```

简单拼接 `baseURL + "/search"` 会制造双斜杠，或者丢掉子路径。插件使用标准 `URL` 对象构造地址，统一去掉路径末尾的斜杠，再追加 `/search`。同时，`baseURL` 必须是绝对的 HTTP(S) 地址，不能带 query 或 fragment；`localhost:8080` 这种看似合理但协议无效的值会直接被判定为不可用。

### 2. 结果映射要尊重接口契约

SearXNG 的结果字段并不总是完整。插件把字段映射为 DSH 的统一来源结构：

| SearXNG | DSH source |
|---|---|
| `url` | `url` |
| `title` | `title` |
| `content` | `snippet` |
| `publishedDate` | `publishedAt` |

其中只有 URL 是可引用来源的必要条件。没有 URL 的条目会被丢弃；只有 URL、没有标题或摘要的条目仍会保留；纯空白字段不会被伪造成有效内容。

插件也不会生成一个并不存在的回答正文。SearXNG 返回搜索结果，而不是生成式答案，所以输出只包含 `sources`。

### 3. 策略应该由一层负责

SearXNG 的搜索接口没有稳定的「返回 N 条」参数。`web_search` 的 `maxResults` 如果在 Provider 和上层各截断一次，很容易出现重复策略和行为分叉。

因此，`dsh-searxng` 返回完整映射结果，并明确报告自己没有截断；最终数量由 DSH Web seam 根据 `searchMaxResults` 统一限制，默认值是 8。Provider 只做后端适配，不接管上层策略。

### 4. 失败必须能指导下一步行动

把所有失败都包装成一句「搜索失败」，对人和 Agent 都没有帮助。插件区分了几类状态：

- 请求被取消：`WEB_ABORTED`
- 网络失败、非成功 HTTP 状态或无法解析的响应：`WEB_PROVIDER_ERROR`
- HTTP 403：重点提示检查 SearXNG 的 `search.formats` 是否启用了 `json`
- HTTP 429：提示实例触发了限流
- 其他状态，例如 502：保留具体 HTTP 状态

`AbortSignal` 会一直传给底层 `fetch`。上层停止任务后，请求可以真正终止，而不是继续占用连接并在稍后返回一个已经没人需要的结果。

---

## 为什么选择 SearXNG

SearXNG 是一个开源元搜索引擎。它可以在自己的服务器上运行，并把多个搜索引擎的结果聚合到统一接口中。对 Agent 工具链来说，它有几个直接优势：

- 不要求为插件配置商业搜索 API Key
- 搜索实例、日志和访问策略由自己控制
- 可以选择语言、引擎和搜索分类
- 搜索后端与 Agent 工具协议解耦

但这里需要说清楚：**自托管不是零成本。** 你仍然要承担计算资源、带宽、升级、安全和可用性。如果上游搜索引擎改变反爬策略，结果质量也可能波动。

公共 SearXNG 实例通常也不是可靠的 Agent 后端。很多实例为了防止滥用，会关闭 JSON 输出或严格限流。因此 `dsh-searxng` 没有偷偷选择一个公共实例作为默认值。没有配置有效的 `baseURL` 时，Provider 会诚实地注册为不可用，而不是把请求发送到一个不受你控制的服务。

---

## 从安装到第一次搜索

最短路径是使用仓库附带的 Docker Compose 示例。它只监听本机回环地址，并已启用 JSON 输出：

```sh
git clone --depth 1 https://github.com/rogerdigital/dsh-searxng.git dsh-searxng-example
docker compose -f dsh-searxng-example/examples/docker/docker-compose.yml up -d
curl 'http://127.0.0.1:8080/search?q=test&format=json'
```

看到 JSON 响应后，安装插件：

```sh
dsh plugin add dsh-searxng
```

将 SearXNG 地址传给启动 DSH 的环境：

```sh
export SEARXNG_BASE_URL=http://127.0.0.1:8080
dsh
```

如果这是唯一可用的搜索 Provider，DSH 会自动选择它。如果还安装了 Exa、Perplexity 等其他 Provider，需要明确指定：

```sh
export DSH_WEB_SEARCH_PROVIDER=searxng
dsh
```

也可以在 profile 的 `cordis.patch.yml` 中配置：

```yaml
- id: web-search-searxng
  config:
    baseURL: http://127.0.0.1:8080
    language: zh-CN
    engines: bing,duckduckgo
    categories: general
```

插件还支持 `authHeader`，用于给经过反向代理或 API Key 网关保护的私有实例发送 `Authorization` Header。这个值会原样发送，不应提交到公开仓库。

需要特别注意：示例配置关闭了 SearXNG limiter，因为容器只绑定在 `127.0.0.1`。如果实例要暴露到本机之外，必须重新启用限流、替换默认 `secret_key`，并补上认证和 TLS 等必要防护。

---

## 如何证明它能可靠工作

这类插件最危险的状态不是完全不能运行，而是只在作者机器上的一个理想地址里运行。`dsh-searxng` 的自动化测试因此围绕边界而不是只测成功路径：

- 根路径、末尾斜杠和子路径部署能否得到正确 `/search` 地址
- 缺少 URL、只有 URL、空白标题和缺少结果数组时如何映射
- 语言、引擎、分类和认证 Header 是否按配置发送
- `AbortSignal` 是否真正传到网络请求
- 403、429、502、网络失败和无效 JSON 是否转换成稳定错误
- Provider ID 和可用性判断是否保持一致

项目 CI 在 Node.js 20 和 24 上运行类型检查、测试、构建与打包验证。打包检查也很重要：源码测试通过，并不代表发布到 npm 的 tarball 一定包含运行时需要的文件。

这些测试没有证明 SearXNG 永远可用，也没有证明任何查询都能得到高质量结果。它们证明的是更基础的事情：在后端正常、异常或配置错误时，Provider 的边界行为可预测。

---

## 这个插件没有解决什么

`dsh-searxng` 的范围刻意很小：让 DSH 的 `web_search` 能使用一个 SearXNG 实例。它不负责：

- 部署和长期运维公网 SearXNG 服务
- 抓取搜索结果对应网页的完整正文
- 对多个来源进行事实核验或可信度排序
- 生成带引用的最终回答
- 保证上游搜索引擎的覆盖率和稳定性

这些能力都可以继续构建，但不应该被塞进同一个 Provider。连接搜索后端、阅读网页、评估来源和组织答案是不同的职责。边界越清楚，每一层就越容易替换、测试和维护。

---

## 结语

为 Agent 增加搜索，最容易想到的是「再接一个 API」。更值得先决定的问题是：**Agent 应该依赖某个供应商，还是依赖一种可以替换实现的能力？**

`dsh-searxng` 选择了后者。Agent 继续使用统一的 `web_search`，DSH 管理 Provider 和上层策略，插件处理 SearXNG 的协议边界，搜索实例则由使用者自己控制。

这不会消除搜索的成本，也不会自动解决来源质量问题。但它把搜索后端从 Agent 工作流中拆了出来，让密钥、供应商和部署方式不再成为工具接口的一部分。对需要可控基础设施的 Agent 来说，这是一个更稳固的起点。

---

## 参考资料

- [dsh-searxng GitHub 仓库](https://github.com/rogerdigital/dsh-searxng)
- [dsh-searxng npm 包](https://www.npmjs.com/package/dsh-searxng)
- [DeepSeek Harness GitHub 仓库](https://github.com/deepseek-ai/deepseek-harness)
- [SearXNG 官方文档](https://docs.searxng.org/)
- [SearXNG Search API](https://docs.searxng.org/dev/search_api.html)
