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
| Feed / SEO | @astrojs/rss, @astrojs/sitemap |
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
│   ├── favicon.svg
│   └── robots.txt          # 指向 sitemap-index.xml
├── src/
│   ├── components/         # Astro 组件（Hero, Nav, Projects, ...）
│   ├── content/blog/       # Markdown 博客文章
│   ├── data/               # 共享内容单一来源（projects, oss-contributions, now, uses）
│   ├── layouts/            # BaseLayout / BlogPost
│   ├── pages/              # 页面路由 + rss.xml.js + 404.astro
│   ├── utils/              # 共享工具（日期格式化等）
│   ├── styles/global.css
│   └── content.config.ts   # Content Collections schema
├── astro.config.mjs        # site + sitemap 集成 + Shiki 双主题
├── tsconfig.json
└── package.json
```

Astro 静态输出，构建产物为纯 HTML/CSS/JS。

## Routes

- `/` — 首页：Hero / Projects / Open Source / Writing / Now / Uses / Contact
- `/projects` — 项目与开源贡献
- `/now` — 当前状态
- `/uses` — 工具与设备
- `/blog` — 博客列表（每 15 篇分页，`/blog/2` 起为分页页）
- `/blog/[slug]` — 博客文章
- `/oss` — 开源贡献项目索引
- `/oss/[project]` — 单个项目的 PR 列表（按 20 条分页）
- `/oss/2026-04-29` — 旧 OSS 日志路由，现为静态跳转页，指向 `/contributions/oss-2026-04-29`
- `/contributions/oss-2026-04-29` — 旧贡献详情页，保留已有链接
- `/rss.xml` — RSS 订阅（BaseLayout 含 autodiscovery link）
- `/sitemap-index.xml` — sitemap（@astrojs/sitemap 自动生成）
- `404.html` — 自定义 404（GitHub Pages 自动用于未知路径）

## Code Conventions

### Astro / TypeScript
- 2 空格缩进
- 组件 props 使用 TypeScript interface
- 首页与独立页共用的内容放 `src/data/` 单一来源（如 now、uses），不要在两处各写一份
- 博客文章用 Markdown + frontmatter

### CSS
- 2 空格缩进
- BEM-lite 类命名风格
- 字体：Google Fonts（Plus Jakarta Sans / Source Serif 4 / JetBrains Mono），回退系统栈 `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- 主题：`html[data-theme]` + `data-theme-choice`（light/dark/system），localStorage 持久化，`<head>` 内联脚本防闪烁
- 响应式设计：主断点 `@media (max-width: 800px)`，小屏补充 `@media (max-width: 520px)`
- 布局：Flexbox + CSS Grid
- 容器宽度：`min(720px, calc(100% - 48px))`，≤520px 时 `calc(100% - 32px)`
- 圆角：卡片 `14px`，按钮 `999px`（药丸形）

### Links
- 外部链接统一添加 `target="_blank" rel="noreferrer"`

## Development Workflow

```bash
npm install
npm run dev
npm run check
npm run build
npm run preview
```

`npm run build` 是主要验证命令，`npm run check`（astro check）做类型检查，CI 中两者都会执行。

`main` 分支受保护：改动必须通过 PR 提交，且需等 `Build` 检查通过后才能合并，合并后 GitHub Actions 自动部署。

## Blog Frontmatter

```md
---
title: "文章标题"
description: "一句话摘要"
pubDate: 2026-05-09
tags: ["tag1", "tag2"]
draft: false
lang: zh
---
```

`draft: true` 的文章不会出现在公开列表和动态路由中。`lang`（`en`/`zh`，默认 `en`）决定页面的 `<html lang>`，中文文章必须标 `zh`。

## Important Guardrails

- 不引入不必要的客户端 JavaScript
- 所有外部链接使用 `target="_blank" rel="noreferrer"`
- 保持响应式设计，确保移动端体验
- 每个页面的 `<title>` 和 meta description 与内容保持一致
- 博客文章 frontmatter 必须符合 `src/content.config.ts`
- 日期展示统一使用 `src/utils/date.ts` 的 `formatDate`（UTC 格式化），不要在组件里直接 `toLocaleDateString`
