# rogerdigital.github.io

Roger Deng's personal website.

Built with [Astro](https://astro.build) and deployed to GitHub Pages.

## Overview

- **Site**: https://rogerdigital.github.io
- **Framework**: Astro static site generation
- **Language**: TypeScript / Astro components
- **Content**: Markdown blog posts via Astro Content Collections
- **Styling**: Global CSS
- **Package manager**: npm
- **Runtime for CI**: Node.js 22
- **Hosting**: GitHub Pages

## Sections And Routes

- `/` — Home page with Hero, About, Projects, Open Source, Writing, Now, Uses, and Contact sections.
- `/projects` — Selected projects and open-source contribution details.
- `/now` — Current focus and activities.
- `/uses` — Development tools and setup.
- `/blog` — Public blog post list.
- `/blog/[slug]` — Blog post detail pages.
- `/oss/2026-04-29` — OSS contribution log.
- `/contributions/oss-2026-04-29` — Earlier contribution detail page retained for existing links.

## Project Structure

```text
rogerdigital.github.io/
├── .github/workflows/
│   ├── ci.yml              # Required Build check for PRs and main
│   └── deploy.yml          # GitHub Pages deploy on main
├── public/
│   └── favicon.svg
├── src/
│   ├── components/         # Reusable Astro components
│   ├── content/blog/       # Markdown blog posts
│   ├── layouts/            # BaseLayout and BlogPost layouts
│   ├── pages/              # Astro file-based routes
│   ├── styles/global.css
│   └── content.config.ts   # Content Collections schema
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Development

```bash
npm install
npm run dev      # Start local dev server
npm run build    # Build static site into dist/
npm run preview  # Preview the built site
```

`npm run build` is the primary local verification command.

## Blog Posts

Create Markdown posts under `src/content/blog/`:

```md
---
title: "Post title"
description: "Short summary"
pubDate: 2026-05-09
tags: ["tag"]
draft: false
---

Post body...
```

Posts with `draft: true` are excluded from public lists and routes.

## Deployment

GitHub Actions handles both validation and deployment:

- `Build` runs on pull requests and pushes to `main`.
- `Deploy` runs only on pushes to `main` and publishes `dist/` to GitHub Pages.

Repository settings should keep Pages source set to GitHub Actions.

## Focus

Autonomous systems, AI product engineering, robotics, digital biology, and open-source AI assistant work.
