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
| Hosting | GitHub Pages |

## Architecture

```
rogerdigital.github.io/
├── .github/workflows/
│   ├── ci.yml              # PR / main Build check
│   └── deploy.yml          # GitHub Pages deploy on main
├── public/
│   └── favicon.svg
├── src/
│   ├── components/         # Astro 组件（Hero, Projects, OpenSource, Writing, ...）
│   ├── content/
│   │   └── blog/           # Markdown 博客文章
│   ├── data/               # 非内容数据源（projects.ts 项目分组数据）
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── BlogPost.astro
│   ├── pages/
│   │   ├── index.astro     # 主页
│   │   ├── projects.astro  # 项目 + OSS 贡献
│   │   ├── now.astro
│   │   ├── uses.astro
│   │   ├── oss/            # OSS 列表（index）+ 按项目分页（[project]/[...page]）
│   │   ├── contributions/  # 旧 OSS 详情页（保留已有链接）
│   │   └── blog/           # 博客分页列表（[...page]）+ 文章（[...slug]）
│   ├── styles/
│   │   └── global.css
│   └── content.config.ts   # Content Collections schema
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

Astro 静态输出，构建产物为纯 HTML + CSS。无客户端框架和 hydration，仅少量内联脚本（主题切换、导航交互等）。

## Page Sections

### 主页
1. **Nav** — 顶部导航：Logo + Home / Projects / OSS / Writing / Now / Uses / Contact
2. **Hero** — 标语 + 内联 Bio + 能力标签
3. **Projects** — 项目分组（Products / Obsidian Plugins）+ 技术栈标签
4. **Open Source** — 贡献日志 + OpenClaw PR 详情
5. **Writing** — 最新博客文章列表
6. **Now** — 当前状态
7. **Uses** — 开发工具和设备
8. **Contact** — 联系方式
9. **Footer** — 版权 + Colophon

### 独立页面
- `/projects` — 项目 + OSS 贡献详情
- `/now` — Now 页面
- `/uses` — Uses 页面
- `/oss` — OSS 贡献日志列表；`/oss/[project]` 按项目分页
- `/contributions/oss-2026-04-29` — 旧 OSS 详情页，保留已有链接
- `/blog` — 博客分页列表
- `/blog/[slug]` — 博客文章

## Code Conventions

### Astro / TypeScript
- 2 空格缩进
- 组件 props 使用 TypeScript interface
- 跨页面复用的结构化数据抽到 `src/data/`（如 `projects.ts` 的项目分组数据），页面/组件 import 引用
- 博客文章用 Markdown + frontmatter

### CSS
- 2 空格缩进
- BEM-lite 类命名风格
- 系统字体栈：`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- 响应式设计：`@media (max-width: 800px)` 单断点
- 布局：Flexbox + CSS Grid
- 容器宽度：`min(960px, calc(100% - 32px))`
- 圆角：卡片 `16px`，按钮 `999px`（药丸形）

### HTML
- 语义化 HTML5 标签
- 外部链接统一添加 `target="_blank" rel="noreferrer"`

## Development Workflow

```bash
npm install          # 安装依赖
npm run dev          # 本地开发服务器
npm run build        # 构建静态站点到 dist/
npm run preview      # 预览构建产物
```

Push 到 `main` 分支后 GitHub Actions 自动构建部署。

### 新增博客文章

在 `src/content/blog/` 创建 `.md` 文件：

```md
---
title: "文章标题"
description: "一句话摘要"
pubDate: 2026-05-09
tags: ["tag1", "tag2"]
draft: false
---

正文内容...
```

## Important Guardrails

- 构建产物为纯 HTML + CSS，不引入客户端框架，仅在必要时使用少量内联脚本
- 所有外部链接使用 `target="_blank" rel="noreferrer"`
- 保持响应式设计，确保移动端体验
- 博客文章通过 Content Collections 管理，frontmatter 必须符合 `content.config.ts` schema
