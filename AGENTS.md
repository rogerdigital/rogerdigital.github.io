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
| Framework | Astro |
| Language | TypeScript |
| Content | Markdown / MDX |
| Styling | CSS (scoped + global) |
| Client JS | 按需使用（如 scroll spy） |
| Build | Astro CLI |
| Hosting | GitHub Pages (GitHub Actions 部署) |

## Architecture

```
rogerdigital.github.io/
├── src/
│   ├── pages/              # 页面路由
│   │   ├── index.astro     # 首页（Hero + Focus）
│   │   ├── projects.astro  # 项目 + 开源贡献
│   │   └── blog/           # 博客
│   ├── layouts/            # 页面布局
│   ├── components/         # 可复用组件
│   ├── content/blog/       # 博客文章（MDX）
│   └── styles/             # 全局样式
├── public/                 # 静态资源
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Astro 静态站点，构建产物为纯 HTML/CSS/JS，部署到 GitHub Pages。

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

- 客户端 JS 按需使用，不引入不必要的外部脚本或依赖
- 所有外部链接使用 `target="_blank" rel="noreferrer"`
- 保持响应式设计，确保移动端体验
- 每个页面的 `<title>` 和 meta description 与内容保持一致
