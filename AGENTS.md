# rogerdigital.github.io

> Roger Deng 的个人网站，纯 HTML + CSS 静态页面，通过 GitHub Pages 部署。

## Project Overview

- **Purpose**: 个人主页，展示项目、开源贡献、技术方向和联系方式
- **Author**: Roger Deng
- **License**: 未声明
- **Hosting**: GitHub Pages（`main` 分支自动部署）
- **URL**: https://rogerdigital.github.io

## Tech Stack

| Layer | Tech |
|-------|------|
| Language | HTML5 + CSS3 |
| Framework | 无（零依赖、零构建） |
| JavaScript | 无 |
| Build Tools | 无 |
| Package Manager | 无 |
| Hosting | GitHub Pages |

## Architecture

```
rogerdigital.github.io/
├── index.html      # 单页面，包含所有内容（导航、Hero、Focus、Projects、OSS、Contact、Footer）
├── style.css       # 全部样式（响应式，800px 断点）
├── .gitignore      # Git 忽略规则
├── README.md       # 项目说明
├── CLAUDE.md       # 专用协作指令
└── AGENTS.md       # 通用协作指令
```

极简结构：整站只有 `index.html` + `style.css` 两个核心文件，无需构建步骤。

## Page Sections

1. **Nav** — 顶部导航：Logo + 锚点链接（Focus / Projects / OSS / Contact）
2. **Hero** — 标语 + 简介 + CTA 按钮
3. **Focus** — 三个方向卡片：Autonomous Systems / AI Product Engineering / Robotics & Digital Biology
4. **Selected Projects** — QuantPilot、Publio、Personal Website
5. **Open Source Contributions** — OpenClaw PR 等
6. **Contact** — GitHub 链接
7. **Footer** — 版权信息

## Code Conventions

### HTML
- 2 空格缩进
- 双引号属性值
- 语义化 HTML5 标签（`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`）
- 外部链接统一添加 `target="_blank" rel="noreferrer"`

### CSS
- 2 空格缩进
- BEM-lite 类命名风格（`.nav-links`, `.links-row`, `.section-header`, `.feature-card`）
- 系统字体栈：`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- 响应式设计：`@media (max-width: 800px)` 单断点
- 布局：Flexbox + CSS Grid
- 容器宽度：`min(960px, calc(100% - 32px))`
- 圆角风格：卡片 `16px`，按钮 `999px`（药丸形）
- 配色：深灰文字 `#111`，浅灰背景 `#fafafa`，白色卡片

## Development Workflow

1. 直接编辑 `index.html` 和 `style.css`
2. 本地浏览器打开 `index.html` 预览（或使用 Live Server）
3. Push 到 `main` 分支，GitHub Pages 自动部署

无需 `npm install`、无需构建命令、无需开发服务器。

## Important Guardrails

- 保持零依赖、零构建的简洁架构，不引入不必要的框架或工具链
- 不使用 JavaScript，保持纯 HTML + CSS
- 所有外部链接使用 `target="_blank" rel="noreferrer"`
- 保持响应式设计，确保移动端体验
- `index.html` 的 `<title>` 和 meta description 与页面内容保持一致
