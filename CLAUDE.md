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
│   └── deploy.yml          # GitHub Actions: build + deploy
├── public/
│   └── favicon.svg
├── src/
│   ├── components/         # Astro 组件（Hero, About, Projects, ...）
│   ├── content/
│   │   └── blog/           # Markdown 博客文章
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── BlogPost.astro
│   ├── pages/
│   │   ├── index.astro     # 主页
│   │   ├── now.astro
│   │   ├── uses.astro
│   │   ├── oss/2026-04-29.astro
│   │   └── blog/           # 博客列表 + 动态路由
│   ├── styles/
│   │   └── global.css
│   └── content.config.ts   # Content Collections schema
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

Astro 静态输出，构建产物为纯 HTML + CSS，客户端零 JS。

## Page Sections

### 主页
1. **Nav** — 顶部导航：Logo + Home / About / Projects / OSS / Writing / Now / Uses / Contact
2. **Hero** — 标语 + 简介 + 能力标签
3. **About** — Bio 展开 + 关键链接
4. **Projects** — 精选项目卡片 + 技术栈标签
5. **Open Source** — 贡献日志 + OpenClaw PR 详情
6. **Writing** — 最新博客文章列表
7. **Now** — 当前状态
8. **Uses** — 开发工具和设备
9. **Contact** — 联系方式 + Resume 下载
10. **Footer** — 版权 + Colophon

### 独立页面
- `/now` — Now 页面
- `/uses` — Uses 页面
- `/oss/2026-04-29` — OSS 贡献日志
- `/blog` — 博客列表
- `/blog/[slug]` — 博客文章

## Code Conventions

### Astro / TypeScript
- 2 空格缩进
- 组件 props 使用 TypeScript interface
- 页面数据优先定义在组件内（如 Projects 数据数组）
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

- 构建产物为纯 HTML + CSS，不向客户端发送 JavaScript
- 所有外部链接使用 `target="_blank" rel="noreferrer"`
- 保持响应式设计，确保移动端体验
- 博客文章通过 Content Collections 管理，frontmatter 必须符合 `content.config.ts` schema
