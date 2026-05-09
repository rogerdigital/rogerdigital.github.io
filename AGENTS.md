# rogerdigital.github.io

> Roger Deng 的个人网站，Astro 静态站点，通过 GitHub Pages 部署。

## Project Overview

- **Purpose**: 个人主页，展示项目、开源贡献、博客、技术方向和联系方式
- **Author**: Roger Deng
- **License**: 未声明
- **Hosting**: GitHub Pages（`main` 分支，GitHub Actions 自动构建部署）
- **URL**: https://rogerdigital.github.io

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Astro (SSG, static output) |
| Language | TypeScript |
| Content | Markdown (Content Collections) |
| Styling | CSS3 (全局样式，无预处理) |
| Build | `npm run build` → `dist/` |
| Package Manager | npm |
| CI Runtime | Node.js 22 |
| Hosting | GitHub Pages |

## Architecture

```text
rogerdigital.github.io/
├── .github/workflows/
│   ├── ci.yml              # PR / main Build check
│   └── deploy.yml          # GitHub Pages deploy on main
├── public/
│   └── favicon.svg
├── src/
│   ├── components/         # Astro 组件（Hero, About, Projects, ...）
│   ├── content/blog/       # Markdown 博客文章
│   ├── layouts/            # BaseLayout / BlogPost
│   ├── pages/              # 页面路由
│   ├── styles/global.css
│   └── content.config.ts   # Content Collections schema
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

Astro 静态输出，构建产物为纯 HTML/CSS/JS。

## Routes

- `/` — 首页：Hero / About / Projects / Open Source / Writing / Now / Uses / Contact
- `/projects` — 项目与开源贡献
- `/now` — 当前状态
- `/uses` — 工具与设备
- `/blog` — 博客列表
- `/blog/[slug]` — 博客文章
- `/oss/2026-04-29` — OSS 贡献日志
- `/contributions/oss-2026-04-29` — 旧贡献详情页，保留已有链接

## Code Conventions

### Astro / TypeScript
- 2 空格缩进
- 组件 props 使用 TypeScript interface
- 页面数据优先定义在组件内
- 博客文章用 Markdown + frontmatter

### CSS
- 2 空格缩进
- BEM-lite 类命名风格
- 系统字体栈：`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- 响应式设计：`@media (max-width: 800px)` 单断点
- 布局：Flexbox + CSS Grid
- 容器宽度：`min(960px, calc(100% - 32px))`
- 圆角：卡片 `16px`，按钮 `999px`（药丸形）

### Links
- 外部链接统一添加 `target="_blank" rel="noreferrer"`

## Development Workflow

```bash
npm install
npm run dev
npm run build
npm run preview
```

`npm run build` 是主要验证命令。Push 到 `main` 后 GitHub Actions 自动部署。

## Blog Frontmatter

```md
---
title: "文章标题"
description: "一句话摘要"
pubDate: 2026-05-09
tags: ["tag1", "tag2"]
draft: false
---
```

`draft: true` 的文章不会出现在公开列表和动态路由中。

## Important Guardrails

- 不引入不必要的客户端 JavaScript
- 所有外部链接使用 `target="_blank" rel="noreferrer"`
- 保持响应式设计，确保移动端体验
- 每个页面的 `<title>` 和 meta description 与内容保持一致
- 博客文章 frontmatter 必须符合 `src/content.config.ts`
